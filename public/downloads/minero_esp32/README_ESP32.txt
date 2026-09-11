================================================================================
       OFFICIAL ESP32 MINER FIRMWARE - BLACK INK COIN (BIC)
================================================================================

Ultra-low power autonomous hardware miner (1 Watt) with capacitive touch sensor
and I2C OLED display for Black Ink Coin.

REQUIRED COMPONENTS:
1. ESP32 Development Board (ESP32 DevKit V1, ESP32-WROOM-32, or ESP32-S3).
2. (Optional) 0.96" I2C OLED Display 128x64 (SSD1306) connected to:
   - SDA -> Pin 21
   - SCL -> Pin 22
   - VCC -> 3.3V
   - GND -> GND
3. Capacitive touch sensor (TTP223 or simple touch wire) connected to GPIO 4.

HOW TO CONFIGURE AND FLASH:
1. Open 'bic_miner_esp32.ino' in Arduino IDE or PlatformIO.
2. Install required libraries via Arduino Library Manager:
   - Adafruit SSD1306
   - Adafruit GFX Library
   - ArduinoJson (v6 or v7)
3. Edit the top network configuration lines:
   - const char* WIFI_SSID     = "YOUR_WIFI_NAME";
   - const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";
   - const char* NODE_URL      = "http://192.168.1.50:6660"; // IP of your bicd node
   - const char* MINER_ADDRESS = "bic666_your_address_here...";
4. Select "ESP32 Dev Module", connect via USB, and click "Upload".

The ESP32 will connect to WiFi, display live round status on OLED,
and mine continuously whenever the capacitive touch presence is active!
================================================================================
