/*
 * ============================================================================
 *           BLACK INK COIN (BIC) — ESP32 HARDWARE MINER FIRMWARE
 *          WITH OLED DISPLAY (GM009605v4.3 SSD1306) & TTP223 TOUCH SENSOR
 * ============================================================================
 * 
 * Hardware:
 *   - Microcontroller: ESP32 DevKit V1 / ESP32-WROOM-32 / ESP32-S3
 *   - Display: 0.96" I2C OLED (Model: GM009605v4.3, 128x64 pixels, SSD1306 driver)
 *   - Touch Sensor: TTP223 Capacitive Digital Touch Module (Proof of Human Touch)
 * 
 * Wiring Connections:
 *   [OLED GM009605 4-Pin]
 *     * GND  -> ESP32 GND
 *     * VCC  -> ESP32 3.3V
 *     * SCL  -> ESP32 GPIO 22 (I2C Clock)
 *     * SDA  -> ESP32 GPIO 21 (I2C Data)
 * 
 *   [TTP223 Touch Sensor 3-Pin]
 *     * GND  -> ESP32 GND
 *     * VCC  -> ESP32 3.3V
 *     * OUT  -> ESP32 GPIO 4 (Digital Input)
 * 
 *   [Status LED]
 *     * Builtin Blue LED -> ESP32 GPIO 2
 * 
 * Libraries Required (Install via Arduino IDE Library Manager):
 *   1. "Adafruit SSD1306" by Adafruit
 *   2. "Adafruit GFX Library" by Adafruit
 *   3. "ArduinoJson" (v6 or v7) by Benoit Blanchon
 * ============================================================================
 */

#include <Wire.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <time.h>
#include "mbedtls/md.h"

// ============================================================================
// HARDWARE PIN DEFINITIONS & OLED CONFIG
// ============================================================================
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET    -1
#define OLED_I2C_ADDR 0x3C  // Default I2C address for GM009605 SSD1306

#define I2C_SDA_PIN   21    // Default ESP32 I2C SDA
#define I2C_SCL_PIN   22    // Default ESP32 I2C SCL
#define TTP223_PIN    4     // Digital Input from TTP223 OUT pin
#define STATUS_LED    2     // Onboard Blue LED

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);
bool has_display = false;

// ============================================================================
// NETWORK & MINER CONFIGURATION
// ============================================================================
const char* WIFI_SSID     = "BatKuevaUp";
const char* WIFI_PASSWORD = "JaMon2026";

// IP Address and Port of your Black Ink Coin Node
const char* NODE_URL      = "http://192.168.0.23:6660";

// Your 100% Private BIC Public Stealth Address (obtained from Web Wallet or `bic-cli address`)
// Default: Official Sovereign Test Wallet
const char* MINER_ADDRESS = "bic666_440fa0a9c07544082f1bd22a7cae1115d033347ef07f4d44699d1068fc4545140c416a62f1d39ea7c5d66e9968e025f3ddfa2a6ff75250bbc05a75829e76df46";

// ============================================================================
// GLOBAL MINING STATE
// ============================================================================
uint64_t current_height = 0;
String current_challenge = "";
String current_touch_challenge = "";
int target_zeros = 2;
int target_zero_bits = 16;
double block_reward_bic = 6.66;
String hardware_id = "";
unsigned long last_touch_time = 0;
uint32_t touch_entropy_accumulator = 1337;
uint64_t total_blocks_mined = 0;
unsigned long last_display_update = 0;
float current_hashrate = 0.0;
uint64_t last_server_time = 0;
unsigned long last_server_time_millis = 0;
uint64_t persistent_nonce = 0;
String active_challenge = "";
uint64_t round_duration_secs = 30;
uint64_t round_time_remaining_secs = 30;
int active_collaborative_miners = 0;
uint64_t current_round_shares = 0;

// ============================================================================
// OLED GRAPHICAL UI FUNCTIONS
// ============================================================================

void drawBootScreen(const char* statusMsg, int progressPercent) {
    if (!has_display) return;
    display.clearDisplay();
    display.setTextColor(SSD1306_WHITE);

    // Title Banner
    display.setTextSize(1);
    display.setCursor(10, 2);
    display.println(F("BLACK INK COIN"));
    display.setCursor(18, 14);
    display.println(F("[BIC MINER v0.666]"));

    display.drawLine(0, 25, 128, 25, SSD1306_WHITE);

    // Status Message
    display.setCursor(4, 30);
    display.println(statusMsg);

    // Progress Bar
    int barWidth = 116;
    int fill = (barWidth * progressPercent) / 100;
    display.drawRect(5, 46, barWidth + 2, 10, SSD1306_WHITE);
    display.fillRect(6, 47, fill, 8, SSD1306_WHITE);

    display.display();
}

void formatCompactTime(uint64_t sec, char* buf, size_t max_len) {
    if (sec < 60) {
        snprintf(buf, max_len, "%lus", (unsigned long)sec);
    } else if (sec < 3600) {
        snprintf(buf, max_len, "%lum", (unsigned long)(sec / 60));
    } else if (sec < 86400) {
        snprintf(buf, max_len, "%luh", (unsigned long)(sec / 3600));
    } else if (sec < 365ULL * 86400ULL) {
        snprintf(buf, max_len, "%lud", (unsigned long)(sec / 86400));
    } else {
        snprintf(buf, max_len, "%0.1fy", (double)sec / (365.0 * 86400.0));
    }
}

void drawMiningDashboard(uint64_t height, int diff_bits, double reward, float hr, uint64_t nonce, bool isTouching) {
    if (!has_display) return;
    display.clearDisplay();
    display.setTextColor(SSD1306_WHITE);

    // Top Header: Block Height & WiFi indicator
    display.setTextSize(1);
    display.setCursor(0, 0);
    display.printf("BIC #%llu [ROUND]", height);

    display.setCursor(80, 0);
    if (WiFi.status() == WL_CONNECTED) {
        display.print(F("[WIFI OK]"));
    } else {
        display.print(F("[NO WIFI]"));
    }

    display.drawLine(0, 9, 128, 9, SSD1306_WHITE);

    // Row 1: Collaborative Round Progress & Time remaining
    char rem_buf[20];
    char dur_buf[20];
    formatCompactTime(round_time_remaining_secs, rem_buf, sizeof(rem_buf));
    formatCompactTime(round_duration_secs, dur_buf, sizeof(dur_buf));
    display.setCursor(0, 12);
    display.printf("Round: %s / %s", rem_buf, dur_buf);

    // Row 2: Active Miners & Shares
    display.setCursor(0, 23);
    display.printf("Sh:%llu Miners:%d", current_round_shares, active_collaborative_miners);

    // Row 3: Hashrate & Diff
    display.setCursor(0, 34);
    display.printf("HR:%4.0fH/s D:%db", hr, diff_bits);

    // Row 4: Human Touch Status (TTP223)
    display.setCursor(0, 45);
    if (isTouching) {
        display.print(F("TOUCH: [ACTIVE 🖐️]"));
    } else {
        unsigned long elapsedSec = (millis() - last_touch_time) / 1000;
        if (elapsedSec < 120) {
            display.printf("TOUCH: [OK %lus]", 120 - elapsedSec);
        } else {
            display.print(F("TOUCH: [PAUSE ⏸️]"));
        }
    }

    // Bottom Round Progress Bar
    int barWidth = 126;
    uint64_t elapsedRound = round_duration_secs > round_time_remaining_secs ? (round_duration_secs - round_time_remaining_secs) : 0;
    int fill = round_duration_secs > 0 ? (int)(((uint64_t)barWidth * elapsedRound) / round_duration_secs) : 0;
    if (fill > barWidth) fill = barWidth;
    display.drawRect(0, 56, 128, 8, SSD1306_WHITE);
    display.fillRect(1, 57, fill, 6, SSD1306_WHITE);

    display.display();
}

void drawBlockMinedCelebration(uint64_t height, double reward, const char* blockHash) {
    if (!has_display) return;
    display.clearDisplay();
    display.setTextColor(SSD1306_WHITE);

    display.setTextSize(1);
    display.setCursor(4, 2);
    display.println(F("★ BLOCK MINED! ★"));
    display.drawLine(0, 12, 128, 12, SSD1306_WHITE);

    display.setTextSize(2);
    display.setCursor(8, 18);
    display.printf("+%.2f BIC", reward);

    display.setTextSize(1);
    display.setCursor(0, 38);
    display.printf("Block: #%llu", height);

    display.setCursor(0, 50);
    String hStr = String(blockHash);
    display.printf("Hash: %s..", hStr.substring(0, 12).c_str());

    display.display();
}

void drawWaitingTouchScreen() {
    if (!has_display) return;
    display.clearDisplay();
    display.setTextColor(SSD1306_WHITE);

    display.setTextSize(1);
    display.setCursor(8, 4);
    display.println(F("PROOF OF HUMAN TOUCH"));
    display.drawLine(0, 14, 128, 14, SSD1306_WHITE);

    display.setCursor(14, 22);
    display.println(F("TOUCH SENSOR"));
    display.setCursor(20, 34);
    display.println(F("TTP223 (GPIO 4)"));

    display.setCursor(8, 48);
    display.println(F("To resume mining"));

    display.display();
}

// ============================================================================
// PROOF OF HUMAN TOUCH DETECTION (TTP223 SENSOR)
// ============================================================================

bool is_ttp223_touched() {
    int val = digitalRead(TTP223_PIN);
    if (val == HIGH) {
        last_touch_time = millis();
        // Accumulate physical jitter and timing entropy
        touch_entropy_accumulator = ((touch_entropy_accumulator * 31) ^ (micros() & 0xFFFF)) + 1;
        return true;
    }
    return false;
}

bool is_human_presence_valid() {
    // Valid if touched within the last 120 seconds (BIC consensus window)
    return (millis() - last_touch_time) < 120000;
}

// ============================================================================
// CRYPTOGRAPHIC HASH IMPLEMENTATION (ESP32 HARDWARE ACCELERATED SHA/BLAKE)
// ============================================================================

void compute_mining_hash(const uint8_t* challenge, size_t ch_len, const char* addr, uint64_t nonce, uint8_t* output_hash) {
    mbedtls_md_context_t ctx;
    mbedtls_md_type_t md_type = MBEDTLS_MD_SHA256;
    mbedtls_md_init(&ctx);
    mbedtls_md_setup(&ctx, mbedtls_md_info_from_type(md_type), 0);
    mbedtls_md_starts(&ctx);
    mbedtls_md_update(&ctx, challenge, ch_len);
    mbedtls_md_update(&ctx, (const unsigned char*)addr, strlen(addr));
    mbedtls_md_update(&ctx, (const unsigned char*)&nonce, sizeof(nonce));
    mbedtls_md_update(&ctx, (const unsigned char*)"_BIC_HUMAN_MINED", 16);
    mbedtls_md_finish(&ctx, output_hash);
    mbedtls_md_free(&ctx);
}

bool check_difficulty_bits(const uint8_t* hash, int bits_required) {
    int full_bytes = bits_required / 8;
    for (int i = 0; i < full_bytes; i++) {
        if (hash[i] != 0) return false;
    }
    int rem_bits = bits_required % 8;
    if (rem_bits > 0) {
        uint8_t mask = (uint8_t)(0xFF << (8 - rem_bits));
        if ((hash[full_bytes] & mask) != 0) return false;
    }
    return true;
}

bool check_difficulty(const uint8_t* hash, int zeros_required) {
    return check_difficulty_bits(hash, zeros_required * 8);
}

// ============================================================================
// RPC CLIENT: FETCH MINING JOB & SUBMIT BLOCK
// ============================================================================

bool fetch_mining_job() {
    if (WiFi.status() != WL_CONNECTED) return false;

    HTTPClient http;
    http.begin(String(NODE_URL) + "/api/mining/job");
    int httpCode = http.GET();

    if (httpCode == 200) {
        String payload = http.getString();
        DynamicJsonDocument doc(2048);
        DeserializationError err = deserializeJson(doc, payload);
        if (!err) {
            current_height = doc["height"] | 1;
            target_zeros = doc["target_zeros"] | 2;
            target_zero_bits = doc["target_zero_bits"] | 16;
            block_reward_bic = doc["reward_bic"] | 6.66;

            // Extract challenge
            if (doc["challenge"].is<JsonArray>()) {
                JsonArray arr = doc["challenge"].as<JsonArray>();
                current_challenge = "";
                for (JsonVariant v : arr) {
                    char buf[3];
                    sprintf(buf, "%02x", v.as<uint8_t>());
                    current_challenge += buf;
                }
            } else if (doc["challenge"].is<const char*>()) {
                current_challenge = doc["challenge"].as<String>();
            }

            // Extract touch_challenge for fortified Proof of Human Touch
            if (doc["touch_challenge"].is<JsonArray>()) {
                JsonArray arr = doc["touch_challenge"].as<JsonArray>();
                current_touch_challenge = "";
                for (JsonVariant v : arr) {
                    char buf[3];
                    sprintf(buf, "%02x", v.as<uint8_t>());
                    current_touch_challenge += buf;
                }
            } else if (doc["touch_challenge"].is<const char*>()) {
                current_touch_challenge = doc["touch_challenge"].as<String>();
            }

            if (doc.containsKey("server_time")) {
                last_server_time = doc["server_time"].as<uint64_t>();
                last_server_time_millis = millis();
            }

            if (doc.containsKey("round_duration_secs")) {
                round_duration_secs = doc["round_duration_secs"].as<uint64_t>();
            }
            if (doc.containsKey("time_remaining_secs")) {
                round_time_remaining_secs = doc["time_remaining_secs"].as<uint64_t>();
            }
            if (doc.containsKey("active_miners_count")) {
                active_collaborative_miners = doc["active_miners_count"].as<int>();
            }

            if (current_challenge != active_challenge) {
                active_challenge = current_challenge;
                persistent_nonce = 0;
                current_round_shares = 0;
            }

            http.end();
            return true;
        }
    }
    http.end();
    return false;
}

bool submit_solution(uint64_t nonce, uint64_t touch_proof_timestamp) {
    if (WiFi.status() != WL_CONNECTED) return false;

    HTTPClient http;
    http.begin(String(NODE_URL) + "/api/mining/submit");
    http.addHeader("Content-Type", "application/json");

    DynamicJsonDocument doc(2048);
    doc["miner_address"] = MINER_ADDRESS;
    doc["nonce"] = nonce;
    doc["hardware_id"] = hardware_id;
    doc["human_touch_proof"] = touch_proof_timestamp;
    if (current_touch_challenge.length() > 0) {
        doc["touch_challenge"] = current_touch_challenge;
    }
    doc["touch_entropy"] = (touch_entropy_accumulator == 0) ? 666 : touch_entropy_accumulator;

    String requestBody;
    serializeJson(doc, requestBody);

    int httpCode = http.POST(requestBody);
    String response = http.getString();

    if (httpCode == 200) {
        DynamicJsonDocument resDoc(1024);
        deserializeJson(resDoc, response);
        const char* status = resDoc["status"] | "";

        if (strcmp(status, "share_accepted") == 0) {
            current_round_shares = resDoc["your_shares"] | (current_round_shares + 1);
            round_time_remaining_secs = resDoc["time_remaining_secs"] | 0;
            round_duration_secs = resDoc["round_duration_secs"] | round_duration_secs;
            active_collaborative_miners = resDoc["active_miners_count"] | 1;

            Serial.printf("⏱️ [ROUND #%llu] Share accepted! Shares: %llu | Miners: %d | Remaining: %llus\n",
                current_height, current_round_shares, active_collaborative_miners, round_time_remaining_secs);

            // Short LED blink to confirm share registered without freezing mining
            digitalWrite(STATUS_LED, HIGH);
            delay(40);
            digitalWrite(STATUS_LED, LOW);

            http.end();
            // Stagger next share submission by 4 seconds (Democratic Proof of Time)
            delay(4000);
            return true;
        } else if (strcmp(status, "block_sealed") == 0) {
            const char* bHash = resDoc["block_hash"] | "00000000";
            double total_rew = resDoc["total_reward_bic"] | block_reward_bic;
            int payouts_cnt = resDoc["payouts_count"] | 1;

            Serial.println(F("\n=================================================="));
            Serial.printf("🎉🎉🎉 COLLABORATIVE BLOCK #%llu SEALED! 🎉🎉🎉\n", current_height);
            Serial.printf("Miners rewarded: %d | Total Reward: %.4f BIC\n", payouts_cnt, total_rew);
            Serial.println(response);
            Serial.println(F("==================================================\n"));

            drawBlockMinedCelebration(current_height, total_rew, bHash);

            // Flash celebratory LED
            for (int i = 0; i < 8; i++) {
                digitalWrite(STATUS_LED, HIGH);
                delay(80);
                digitalWrite(STATUS_LED, LOW);
                delay(80);
            }

            total_blocks_mined++;
            current_round_shares = 0;
            http.end();
            delay(2500);
            return true;
        }
    } else {
        Serial.printf("❌ Submission rejected (Code %d): %s\n", httpCode, response.c_str());
    }

    http.end();
    return false;
}

// ============================================================================
// ARDUINO SETUP
// ============================================================================
void setup() {
    Serial.begin(115200);
    delay(500);

    pinMode(STATUS_LED, OUTPUT);
    digitalWrite(STATUS_LED, LOW);

    pinMode(TTP223_PIN, INPUT); // TTP223 capacitive touch button digital read

    // Initialize I2C and OLED Display GM009605v4.3
    Wire.begin(I2C_SDA_PIN, I2C_SCL_PIN);
    if (display.begin(SSD1306_SWITCHCAPVCC, OLED_I2C_ADDR)) {
        has_display = true;
        Serial.println(F("✅ OLED GM009605v4.3 (SSD1306 128x64) initialized successfully at 0x3C!"));
        display.clearDisplay();
        display.display();
    } else {
        has_display = false;
        Serial.println(F("⚠️ OLED Display not detected at 0x3C. Miner running via Serial output."));
    }

    drawBootScreen("Starting Hardware...", 20);

    Serial.println(F("\n============================================================"));
    Serial.println(F("    BLACK INK COIN (BIC) — ESP32 HARDWARE MINER         "));
    Serial.println(F("   OLED GM009605 + TTP223 Human Touch Capacitive Sensor   "));
    Serial.println(F("============================================================"));

    // Derive Unique Hardware ID from ESP32 WiFi MAC address (Solution 3 Anti-Sybil)
    WiFi.mode(WIFI_STA);
    hardware_id = "ESP32-OLED-" + WiFi.macAddress();
    Serial.printf("Hardware ID: %s (Protected by sub-linear anti-sybil by IP)\n", hardware_id.c_str());

    drawBootScreen("Connecting WiFi...", 40);

    // Connect to WiFi
    Serial.printf("Connecting to WiFi '%s'...", WIFI_SSID);
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    int retries = 0;
    while (WiFi.status() != WL_CONNECTED && retries < 30) {
        delay(400);
        Serial.print(".");
        digitalWrite(STATUS_LED, !digitalRead(STATUS_LED));
        drawBootScreen("Connecting WiFi...", 40 + retries);
        retries++;
    }

    if (WiFi.status() == WL_CONNECTED) {
        Serial.println(F("\n✅ WiFi Connected!"));
        Serial.printf("ESP32 IP: %s\n", WiFi.localIP().toString().c_str());
        Serial.printf("Node URL: %s\n", NODE_URL);
        configTime(0, 0, "pool.ntp.org", "time.nist.gov");
        drawBootScreen("WiFi OK! Syncing...", 90);
        delay(600);
    } else {
        Serial.println(F("\n⚠️ WiFi Connection Failed! Check SSID/Password in config."));
        drawBootScreen("WiFi Error. Check config", 100);
        delay(1500);
    }

    digitalWrite(STATUS_LED, LOW);
    drawBootScreen("Ready to Mine!", 100);
    delay(800);
}

// ============================================================================
// MAIN LOOP: HUMAN TOUCH VERIFICATION & BLAKE3 MINING
// ============================================================================
void loop() {
    if (WiFi.status() != WL_CONNECTED) {
        drawBootScreen("Reconnecting WiFi...", 50);
        WiFi.reconnect();
        delay(4000);
        return;
    }

    // 1. Check TTP223 Capacitive Touch Presence (Solution 1)
    bool isTouching = is_ttp223_touched();
    if (isTouching) {
        digitalWrite(STATUS_LED, HIGH); // Blue LED lights up solid when human touches TTP223
    } else {
        digitalWrite(STATUS_LED, LOW);
    }

    // If human has not touched the sensor in the last 120 seconds, pause mining
    if (!is_human_presence_valid()) {
        drawWaitingTouchScreen();
        Serial.println(F("🖐️ [HUMAN TOUCH REQUIRED] Touch TTP223 sensor to resume mining!"));
        delay(1000);
        return;
    }

    // 2. Fetch latest mining challenge from node
    if (!fetch_mining_job()) {
        Serial.println(F("Failed to connect to BIC node. Retrying in 3s..."));
        delay(3000);
        return;
    }

    Serial.printf("\n⛏️  Mining Block #%llu | Target zeros: %d (%d bits) | Reward: %.2f BIC\n", 
        current_height, target_zeros, target_zero_bits, block_reward_bic);

    // Decode hex challenge into binary bytes
    uint8_t challenge_bytes[32];
    for(int i=0; i<32; i++) {
        String byteString = current_challenge.substring(i*2, i*2 + 2);
        challenge_bytes[i] = (uint8_t) strtol(byteString.c_str(), NULL, 16);
    }

    // 3. PoW Mining Iteration Loop (Batches of 15,000 hashes)
    uint8_t hash[32];
    unsigned long start_time = millis();
    bool block_found = false;
    uint64_t target_chunk_end = persistent_nonce + 15000;

    while (persistent_nonce < target_chunk_end && !block_found) {
        compute_mining_hash(challenge_bytes, 32, MINER_ADDRESS, persistent_nonce, hash);

        if (check_difficulty_bits(hash, target_zero_bits)) {
            unsigned long duration = millis() - start_time;
            current_hashrate = (duration > 0) ? (float)15000 / ((float)duration / 1000.0) : 8000.0;

            Serial.printf("✨ Winning Nonce Found: %llu in %lu ms (%.1f H/s)\n", persistent_nonce, duration, current_hashrate);

            // Fetch synchronized network timestamp
            uint64_t touch_proof_timestamp = 0;
            if (last_server_time > 0) {
                touch_proof_timestamp = last_server_time + ((millis() - last_server_time_millis) / 1000);
            } else {
                time_t nowSec;
                time(&nowSec);
                touch_proof_timestamp = (nowSec > 1700000000) ? (uint64_t)nowSec : 666;
            }

            if (submit_solution(persistent_nonce, touch_proof_timestamp)) {
                block_found = true;
                persistent_nonce = 0;
                break;
            }
        }

        persistent_nonce++;

        // Periodic OLED Display Update and Touch Check every 1200 hashes (~150ms)
        if (persistent_nonce % 1200 == 0) {
            isTouching = is_ttp223_touched();
            unsigned long nowM = millis();
            if (nowM - last_display_update > 250) {
                unsigned long elapsed = nowM - start_time;
                if (elapsed > 0) {
                    current_hashrate = (float)(persistent_nonce % 15000) / ((float)elapsed / 1000.0);
                }
                drawMiningDashboard(current_height, target_zero_bits, block_reward_bic, current_hashrate, persistent_nonce, isTouching);
                last_display_update = nowM;
            }

            // If user released the touch long ago and window expired, pause
            if (!is_human_presence_valid()) {
                break;
            }
        }
    }

    delay(50);
}
