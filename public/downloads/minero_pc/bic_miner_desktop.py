#!/usr/bin/env python3
"""
================================================================================
  BLACK INK COIN (BIC) — OFFICIAL DESKTOP MINER (SOVEREIGN LAYER 1)
  Multi-Threaded CPU Engine + Human Presence Touch Sensor + ESP32 Serial Monitor
  + Multi-Guardian Pool with Automatic Failover
================================================================================
"""

import os
import sys
import time
import json
import struct
import hashlib
import socket
import threading
import queue
import argparse
import urllib.request
import urllib.error
from datetime import datetime

try:
    import tkinter as tk
    from tkinter import ttk, messagebox, scrolledtext, simpledialog
except ImportError:
    print("Error: tkinter is required to run the Desktop Miner. Install python3-tk.")
    sys.exit(1)

# Optional serial support for monitoring ESP32
try:
    import serial
    import serial.tools.list_ports
    HAS_SERIAL = True
except ImportError:
    HAS_SERIAL = False

# Default Configuration
DEFAULT_GUARDIANS = [
    {
        "name": "🖥️ Servidor X88 (Staging LAN)",
        "url": "http://192.168.0.20:6660"
    },
    {
        "name": "🏠 Guardián Localhost (PC)",
        "url": "http://127.0.0.1:6660"
    }
]
DEFAULT_ADDRESS = "bic666_440fa0a9c07544082f1bd22a7cae1115d033347ef07f4d44699d1068fc4545140c416a62f1d39ea7c5d66e9968e025f3ddfa2a6ff75250bbc05a75829e76df46"
TARGET_VALIDITY_WINDOW = 120 # Seconds of human touch validity
CONFIG_FILE = os.path.expanduser("~/.bic_miner_config.json")

def check_difficulty_bits(h_bytes, zero_bits):
    full_bytes = zero_bits // 8
    rem_bits = zero_bits % 8
    for i in range(full_bytes):
        if h_bytes[i] != 0:
            return False
    if rem_bits > 0 and full_bytes < len(h_bytes):
        mask = (0xFF << (8 - rem_bits)) & 0xFF
        if (h_bytes[full_bytes] & mask) != 0:
            return False
    return True

def format_time_human(seconds):
    try:
        s = int(seconds)
    except (ValueError, TypeError):
        return f"{seconds}s"
    if s < 60:
        return f"{s}s"
    elif s < 3600:
        return f"{s // 60}m {s % 60}s"
    elif s < 86400:
        return f"{(s / 3600):.1f}h"
    elif s < 365 * 86400:
        return f"{(s / 86400):.1f}d"
    else:
        return f"{(s / (365 * 86400)):.2f}y"


class BicDesktopMinerApp:
    def __init__(self, root, cli_node=None, cli_address=None, cli_threads=None):
        self.root = root
        self.root.title("Black Ink Coin — Official Desktop Miner v0.666 (Multi-Guardian)")
        self.root.geometry("1000x840")
        self.root.minsize(880, 700)
        self.root.configure(bg="#0c0d12")

        # Thread-safe UI update queue
        self.ui_queue = queue.Queue()

        # Configuration & persistence
        self.config = self._load_config()
        self.guardians = self._init_guardians(cli_node)
        self.active_guardian_idx = self._find_initial_guardian_idx(cli_node)
        self.auto_failover_enabled = self.config.get("auto_failover", True)
        self.consecutive_failures = 0
        self.guardian_statuses = {} # url -> dict with status info
        self.is_failover_active = False

        self.initial_address = cli_address or self.config.get("miner_address", DEFAULT_ADDRESS)
        initial_threads = cli_threads or self.config.get("threads_count", max(1, min(os.cpu_count() or 4, 8)))
        try:
            self.threads_count = max(1, min(int(initial_threads), os.cpu_count() or 8))
        except (ValueError, TypeError):
            self.threads_count = max(1, min(os.cpu_count() or 4, 8))

        # Mining State
        self.is_mining = False
        self.miner_threads = []
        self.total_hashes = 0
        self.blocks_mined = 0
        self.start_time = 0
        self.current_hashrate = 0.0
        self.hashrate_history = [0.0] * 30
        
        # Human Presence State
        self.last_human_touch = time.time()
        self.touch_entropy_accumulator = 1337
        self.is_touch_key_held = False
        
        # Current Job
        self.current_job = None
        self.current_height = 0
        self.current_zeros = 2
        self.current_diff_bits = 16
        self.current_reward = 6.66
        self.tier_name = "Estándar"
        self.challenge_bytes = b"\x00" * 32
        self.touch_challenge_str = ""
        self.server_time_sync = 0
        self.server_time_fetch_local = 0
        self.nonce_counter = 0

        # Collaborative Mining Round State
        self.round_duration = 30
        self.round_time_remaining = 30
        self.active_miners_count = 0
        self.your_shares = 0
        self.lucky_wins = 0
        self.mining_streak = 0

        # Anti-Sybil Cooldown & Submission Controls
        self.cooldown_until = 0.0
        self.submit_lock = threading.Lock()
        self.last_solved_height = 0
        self.last_cooldown_log = 0.0

        # ESP32 Serial Monitor State
        self.serial_conn = None
        self.serial_thread = None
        self.serial_running = False

        self._setup_styles()
        self._build_ui()
        self._start_background_loops()

    def schedule_ui(self, fn, *args):
        self.ui_queue.put((fn, args))

    def _load_config(self):
        try:
            if os.path.exists(CONFIG_FILE):
                with open(CONFIG_FILE, "r", encoding="utf-8") as f:
                    return json.load(f)
        except Exception:
            pass
        return {}

    def _init_guardians(self, cli_node=None):
        saved = self.config.get("guardians")
        if isinstance(saved, list) and len(saved) > 0:
            guardians = saved
        else:
            guardians = [dict(g) for g in DEFAULT_GUARDIANS]

        # If CLI node was given, ensure it exists in the list
        if cli_node:
            cli_clean = cli_node.rstrip("/")
            if not any(g["url"].rstrip("/") == cli_clean for g in guardians):
                guardians.insert(0, {
                    "name": f"CLI Node ({cli_clean})",
                    "url": cli_clean
                })
        return guardians

    def _find_initial_guardian_idx(self, cli_node=None):
        target_url = cli_node or self.config.get("node_url")
        if target_url:
            clean = target_url.rstrip("/")
            for idx, g in enumerate(self.guardians):
                if g["url"].rstrip("/") == clean:
                    return idx
        return 0

    def _save_config(self):
        try:
            active_url = self.get_node_url()
            addr = self.ent_address.get().strip() if hasattr(self, "ent_address") else self.initial_address
            th = int(self.spn_threads.get()) if hasattr(self, "spn_threads") else self.threads_count
            cfg = {
                "node_url": active_url,
                "guardians": self.guardians,
                "auto_failover": self.var_auto_failover.get() if hasattr(self, "var_auto_failover") else self.auto_failover_enabled,
                "miner_address": addr,
                "threads_count": th
            }
            with open(CONFIG_FILE, "w", encoding="utf-8") as f:
                json.dump(cfg, f, indent=2)
        except Exception:
            pass

    def get_node_url(self):
        if 0 <= self.active_guardian_idx < len(self.guardians):
            url = self.guardians[self.active_guardian_idx]["url"].strip().rstrip("/")
        else:
            url = DEFAULT_GUARDIANS[0]["url"]
        if not url.startswith("http://") and not url.startswith("https://"):
            url = f"http://{url}"
        return url

    def get_active_guardian(self):
        if 0 <= self.active_guardian_idx < len(self.guardians):
            return self.guardians[self.active_guardian_idx]
        return DEFAULT_GUARDIANS[0]

    def _format_node_display(self):
        url = self.get_node_url()
        return url.replace("http://", "").replace("https://", "")

    def _setup_styles(self):
        self.style = ttk.Style()
        self.style.theme_use("clam")
        
        # Configure TTK widgets colors
        self.style.configure(".", background="#0c0d12", foreground="#e6e8f0", font=("Helvetica", 10))
        self.style.configure("TFrame", background="#0c0d12")
        self.style.configure("Card.TFrame", background="#141620", relief="flat")
        self.style.configure("TLabel", background="#0c0d12", foreground="#e6e8f0")
        self.style.configure("Card.TLabel", background="#141620", foreground="#e6e8f0")
        self.style.configure("TCombobox", fieldbackground="#0d0e14", background="#1f2333", foreground="#ffffff")
        
        self.style.configure("Accent.TButton", font=("Helvetica", 10, "bold"), background="#ff2a44", foreground="#ffffff", borderwidth=0)
        self.style.map("Accent.TButton", background=[("active", "#d91e36"), ("disabled", "#3a1c22")])

    def _build_ui(self):
        # 1. Header Bar
        header = tk.Frame(self.root, bg="#12131b", height=64, bd=0, highlightthickness=1, highlightbackground="#251419")
        header.pack(fill="x", side="top", padx=0, pady=0)

        title_box = tk.Frame(header, bg="#12131b")
        title_box.pack(side="left", padx=16, pady=10)

        badge_666 = tk.Label(title_box, text="666", font=("Cinzel", 15, "bold"), fg="#ff2a44", bg="#12131b")
        badge_666.pack(side="left", padx=(0, 10))

        title_text = tk.Label(title_box, text="BLACK INK COIN", font=("Helvetica", 13, "bold"), fg="#ffffff", bg="#12131b")
        title_text.pack(anchor="w")

        sub_text = tk.Label(title_box, text="DESKTOP SOVEREIGN CPU MINER (PROT. 0.666)", font=("Helvetica", 8), fg="#ff6677", bg="#12131b")
        sub_text.pack(anchor="w")

        # Daemon Connection Pill
        daemon_box = tk.Frame(header, bg="#12131b")
        daemon_box.pack(side="right", padx=16, pady=12)

        self.lbl_daemon_status = tk.Label(daemon_box, text="● GUARDIÁN: CONECTANDO...", font=("Monospace", 9, "bold"), fg="#ffaa00", bg="#1b1c28", padx=10, pady=4)
        self.lbl_daemon_status.pack()

        # 2. Main Paned Body
        main_paned = tk.PanedWindow(self.root, orient="horizontal", bg="#0c0d12", bd=0, sashwidth=4, sashrelief="flat")
        main_paned.pack(fill="both", expand=True, padx=12, pady=10)

        # Left Column: Mining Engine & Controls
        left_col = tk.Frame(main_paned, bg="#0c0d12")
        main_paned.add(left_col, minsize=490, stretch="always")

        # Right Column: ESP32 Hardware Monitor & Logs
        right_col = tk.Frame(main_paned, bg="#0c0d12")
        main_paned.add(right_col, minsize=380, stretch="always")

        self._build_mining_panel(left_col)
        self._build_esp32_and_logs(right_col)

    def _build_mining_panel(self, parent):
        # Card 0: Multi-Guardian Pool & Auto-Failover
        card_guardian = tk.Frame(parent, bg="#141620", highlightthickness=1, highlightbackground="#2a1820", padx=12, pady=8)
        card_guardian.pack(fill="x", pady=(0, 8))

        g_hdr = tk.Frame(card_guardian, bg="#141620")
        g_hdr.pack(fill="x", pady=(0, 4))
        tk.Label(g_hdr, text="🛡️ SELECCIÓN DE GUARDIÁN & AUTO-FAILOVER:", font=("Helvetica", 9, "bold"), fg="#00e5ff", bg="#141620").pack(side="left")

        # Auto-Failover checkbox
        self.var_auto_failover = tk.BooleanVar(value=self.auto_failover_enabled)
        chk_failover = tk.Checkbutton(
            g_hdr, text="⚡ Auto-Failover activo",
            variable=self.var_auto_failover, command=self._on_failover_toggle,
            bg="#141620", fg="#00ff88", selectcolor="#0d0e14", activebackground="#141620", activeforeground="#00ff88",
            font=("Helvetica", 8, "bold"), bd=0, highlightthickness=0, cursor="hand2"
        )
        chk_failover.pack(side="right")

        # Combobox + Actions Row
        g_sel_row = tk.Frame(card_guardian, bg="#141620")
        g_sel_row.pack(fill="x", pady=(4, 2))

        self.cbo_guardians = ttk.Combobox(g_sel_row, state="readonly", font=("Helvetica", 9, "bold"))
        self.cbo_guardians.pack(side="left", fill="x", expand=True, padx=(0, 6))
        self.cbo_guardians.bind("<<ComboboxSelected>>", self._on_guardian_selected)

        btn_add_g = tk.Button(g_sel_row, text="➕ Añadir", font=("Helvetica", 8, "bold"), bg="#1c2438", fg="#00e5ff", activebackground="#2a3552", bd=0, padx=8, pady=2, command=self._prompt_add_guardian)
        btn_add_g.pack(side="left", padx=(0, 4))

        btn_del_g = tk.Button(g_sel_row, text="🗑️ Quitar", font=("Helvetica", 8), bg="#222533", fg="#ff6677", activebackground="#33384f", bd=0, padx=6, pady=2, command=self._remove_current_guardian)
        btn_del_g.pack(side="left", padx=(0, 4))

        btn_probe = tk.Button(g_sel_row, text="🔄 Sondeo", font=("Helvetica", 8, "bold"), bg="#008855", fg="#ffffff", activebackground="#00aa66", bd=0, padx=8, pady=2, command=self._probe_all_guardians)
        btn_probe.pack(side="left")

        # Active Guardian Details Row
        g_info_row = tk.Frame(card_guardian, bg="#141620")
        g_info_row.pack(fill="x", pady=(4, 0))

        self.lbl_guardian_endpoint = tk.Label(g_info_row, text="URL: ...", font=("Monospace", 8), fg="#8899aa", bg="#141620")
        self.lbl_guardian_endpoint.pack(side="left")

        self.lbl_node_detail = tk.Label(g_info_row, text="● Comprobando guardián...", font=("Monospace", 8), fg="#ffaa00", bg="#141620")
        self.lbl_node_detail.pack(side="right")

        self._refresh_guardians_combobox()

        # Card 1: Wallet Destination
        card_wallet = tk.Frame(parent, bg="#141620", highlightthickness=1, highlightbackground="#2a1820", padx=12, pady=8)
        card_wallet.pack(fill="x", pady=(0, 8))

        lbl_w = tk.Label(card_wallet, text="🔑 DIRECCIÓN DESTINO DE RECOMPENSAS (BILLETERA SHIELDED):", font=("Helvetica", 9, "bold"), fg="#ff8899", bg="#141620")
        lbl_w.pack(anchor="w", pady=(0, 4))

        self.ent_address = tk.Entry(card_wallet, bg="#0d0e14", fg="#00e5ff", insertbackground="#00e5ff", font=("Monospace", 8), bd=0, highlightthickness=1, highlightbackground="#331822")
        self.ent_address.insert(0, self.initial_address)
        self.ent_address.pack(fill="x", ipady=3)
        self.ent_address.bind("<KeyRelease>", lambda e: self._validate_address_display())

        w_btn_row = tk.Frame(card_wallet, bg="#141620")
        w_btn_row.pack(fill="x", pady=(6, 2))

        btn_paste = tk.Button(w_btn_row, text="📋 Pegar del Portapapeles", font=("Helvetica", 8), bg="#222533", fg="#ffffff", activebackground="#33384f", bd=0, padx=8, pady=2, command=self._paste_address)
        btn_paste.pack(side="left", padx=(0, 6))

        btn_default = tk.Button(w_btn_row, text="🔄 Dirección Demo", font=("Helvetica", 8), bg="#222533", fg="#8899aa", activebackground="#33384f", bd=0, padx=8, pady=2, command=lambda: self._set_address(DEFAULT_ADDRESS))
        btn_default.pack(side="left")

        self.lbl_address_status = tk.Label(card_wallet, text="", font=("Helvetica", 8), bg="#141620", wraplength=480, justify="left")
        self.lbl_address_status.pack(anchor="w", pady=(4, 0))
        self._validate_address_display()

        # Card 2: Human Touch Presence
        card_touch = tk.Frame(parent, bg="#18141f", highlightthickness=1, highlightbackground="#441a24", padx=12, pady=10)
        card_touch.pack(fill="x", pady=(0, 8))

        touch_top = tk.Frame(card_touch, bg="#18141f")
        touch_top.pack(fill="x")

        tk.Label(touch_top, text="🖐️ PRUEBA DE PRESENCIA HUMANA (ANTI-BOT SYBIL)", font=("Helvetica", 9, "bold"), fg="#ffb800", bg="#18141f").pack(side="left")
        self.lbl_touch_timer = tk.Label(touch_top, text="[120s VALID]", font=("Monospace", 9, "bold"), fg="#00ff88", bg="#18141f")
        self.lbl_touch_timer.pack(side="right")

        # Big interactive Touch / Heartbeat button
        self.btn_touch = tk.Button(card_touch, text="🖐️ HAZ CLIC O MANTÉN PULSADA LA BARRA ESPACIADORA\n(Renueva 120s de validez humana)", font=("Helvetica", 10, "bold"), bg="#2c141d", fg="#ff4466", activebackground="#551a2a", activeforeground="#ffffff", bd=0, highlightthickness=1, highlightbackground="#ff2a44", pady=12, cursor="hand2")
        self.btn_touch.pack(fill="x", pady=6)
        self.btn_touch.bind("<ButtonPress-1>", self._on_touch_press)
        self.btn_touch.bind("<ButtonRelease-1>", self._on_touch_release)

        # Global Spacebar binding
        self.root.bind("<KeyPress-space>", self._on_space_press)
        self.root.bind("<KeyRelease-space>", self._on_space_release)

        # Card 3: Engine Controls & Live Stats
        card_stats = tk.Frame(parent, bg="#141620", highlightthickness=1, highlightbackground="#2a1820", padx=12, pady=8)
        card_stats.pack(fill="x", pady=(0, 8))

        # Thread slider & Start/Stop
        ctrl_row = tk.Frame(card_stats, bg="#141620")
        ctrl_row.pack(fill="x", pady=(0, 8))

        tk.Label(ctrl_row, text="Hilos CPU:", font=("Helvetica", 9, "bold"), fg="#ffffff", bg="#141620").pack(side="left", padx=(0, 6))
        self.spn_threads = tk.Spinbox(ctrl_row, from_=1, to=max(1, os.cpu_count() or 8), width=3, bg="#0d0e14", fg="#ffffff", insertbackground="#ffffff", font=("Helvetica", 10, "bold"), bd=0)
        self.spn_threads.delete(0, "end")
        self.spn_threads.insert(0, str(self.threads_count))
        self.spn_threads.pack(side="left", padx=(0, 16))

        self.btn_toggle_mine = tk.Button(ctrl_row, text="▶ INICIAR MINERÍA CPU", font=("Helvetica", 10, "bold"), bg="#00aa55", fg="#ffffff", activebackground="#00cc66", bd=0, padx=14, pady=4, cursor="hand2", command=self.toggle_mining)
        self.btn_toggle_mine.pack(side="left", fill="x", expand=True)

        # Stats Grid (2x2)
        grid_f = tk.Frame(card_stats, bg="#141620")
        grid_f.pack(fill="x", pady=4)

        # Box 1: Hashrate
        b1 = tk.Frame(grid_f, bg="#0f1118", padx=8, pady=6, highlightthickness=1, highlightbackground="#222533")
        b1.grid(row=0, column=0, sticky="nsew", padx=3, pady=3)
        tk.Label(b1, text="HASHRATE EN VIVO", font=("Helvetica", 7, "bold"), fg="#8899aa", bg="#0f1118").pack(anchor="w")
        self.lbl_hashrate = tk.Label(b1, text="0.0 H/s", font=("Monospace", 14, "bold"), fg="#00e5ff", bg="#0f1118")
        self.lbl_hashrate.pack(anchor="w")

        # Box 2: Target & Difficulty
        b2 = tk.Frame(grid_f, bg="#0f1118", padx=8, pady=6, highlightthickness=1, highlightbackground="#222533")
        b2.grid(row=0, column=1, sticky="nsew", padx=3, pady=3)
        tk.Label(b2, text="BLOQUE & DIFICULTAD", font=("Helvetica", 7, "bold"), fg="#8899aa", bg="#0f1118").pack(anchor="w")
        self.lbl_block_diff = tk.Label(b2, text="#0 (16 Bits)", font=("Monospace", 14, "bold"), fg="#ffb800", bg="#0f1118")
        self.lbl_block_diff.pack(anchor="w")

        # Box 3: Blocks Mined
        b3 = tk.Frame(grid_f, bg="#0f1118", padx=8, pady=6, highlightthickness=1, highlightbackground="#222533")
        b3.grid(row=1, column=0, sticky="nsew", padx=3, pady=3)
        tk.Label(b3, text="BLOQUES SELLADOS (SESIÓN)", font=("Helvetica", 7, "bold"), fg="#8899aa", bg="#0f1118").pack(anchor="w")
        self.lbl_blocks_mined = tk.Label(b3, text="0 BLOQUES", font=("Monospace", 14, "bold"), fg="#00ff88", bg="#0f1118")
        self.lbl_blocks_mined.pack(anchor="w")

        # Box 4: Block Reward
        b4 = tk.Frame(grid_f, bg="#0f1118", padx=8, pady=6, highlightthickness=1, highlightbackground="#222533")
        b4.grid(row=1, column=1, sticky="nsew", padx=3, pady=3)
        tk.Label(b4, text="RECOMPENSA / TIER", font=("Helvetica", 7, "bold"), fg="#8899aa", bg="#0f1118").pack(anchor="w")
        self.lbl_reward = tk.Label(b4, text="6.6600 BIC", font=("Monospace", 14, "bold"), fg="#ff2a44", bg="#0f1118")
        self.lbl_reward.pack(anchor="w")

        grid_f.columnconfigure(0, weight=1)
        grid_f.columnconfigure(1, weight=1)

        # Card 3b: Collaborative Round Status
        card_round = tk.Frame(card_stats, bg="#0d0f17", padx=8, pady=6, highlightthickness=1, highlightbackground="#222533")
        card_round.pack(fill="x", pady=(6, 0))

        round_top = tk.Frame(card_round, bg="#0d0f17")
        round_top.pack(fill="x")
        tk.Label(round_top, text="⏱️ RONDA COLABORATIVA:", font=("Helvetica", 8, "bold"), fg="#00e5ff", bg="#0d0f17").pack(side="left")
        self.lbl_round_timer = tk.Label(round_top, text="30s / 30s", font=("Monospace", 8, "bold"), fg="#ffffff", bg="#0d0f17")
        self.lbl_round_timer.pack(side="right")

        round_bot = tk.Frame(card_round, bg="#0d0f17")
        round_bot.pack(fill="x", pady=(2, 0))
        self.lbl_round_miners = tk.Label(round_bot, text="Mineros activos: 1 | Tus shares: 0", font=("Helvetica", 8), fg="#8899aa", bg="#0d0f17")
        self.lbl_round_miners.pack(side="left")
        self.lbl_wheel_status = tk.Label(round_bot, text="🎡 Suerte: 0 | 🔥 Racha: 0", font=("Helvetica", 8, "bold"), fg="#ffb800", bg="#0d0f17")
        self.lbl_wheel_status.pack(side="right")

        # Card 4: Hashrate Graph (Mini Canvas)
        card_graph = tk.Frame(parent, bg="#141620", highlightthickness=1, highlightbackground="#2a1820", padx=8, pady=6)
        card_graph.pack(fill="both", expand=True)

        tk.Label(card_graph, text="📊 GRÁFICA DE HASHRATE EN TIEMPO REAL (H/s):", font=("Helvetica", 8, "bold"), fg="#8899aa", bg="#141620").pack(anchor="w")
        self.canvas_graph = tk.Canvas(card_graph, bg="#090a0e", height=80, bd=0, highlightthickness=0)
        self.canvas_graph.pack(fill="both", expand=True, pady=(4, 0))

    def _build_esp32_and_logs(self, parent):
        # 1. ESP32 USB Bridge Card
        card_esp = tk.Frame(parent, bg="#141620", highlightthickness=1, highlightbackground="#2a1820", padx=12, pady=8)
        card_esp.pack(fill="x", pady=(0, 8))

        esp_hdr = tk.Frame(card_esp, bg="#141620")
        esp_hdr.pack(fill="x", pady=(0, 4))
        tk.Label(esp_hdr, text="🔌 PUENTE DE HARDWARE ESP32", font=("Helvetica", 9, "bold"), fg="#00e5ff", bg="#141620").pack(side="left")

        esp_ctrl = tk.Frame(card_esp, bg="#141620")
        esp_ctrl.pack(fill="x")

        self.cbo_serial = ttk.Combobox(esp_ctrl, values=["/dev/ttyUSB0", "/dev/ttyUSB1", "/dev/ttyACM0"], width=14)
        self.cbo_serial.set("/dev/ttyUSB0")
        self.cbo_serial.pack(side="left", padx=(0, 6))

        self.btn_serial = tk.Button(esp_ctrl, text="Conectar ESP32", font=("Helvetica", 8, "bold"), bg="#222533", fg="#ffffff", activebackground="#33384f", bd=0, padx=8, pady=2, command=self.toggle_esp32_serial)
        self.btn_serial.pack(side="left")

        self.lbl_serial_stat = tk.Label(esp_ctrl, text="Desconectado", font=("Helvetica", 8), fg="#778899", bg="#141620")
        self.lbl_serial_stat.pack(side="left", padx=8)

        # 2. Terminal Console
        card_log = tk.Frame(parent, bg="#141620", highlightthickness=1, highlightbackground="#2a1820", padx=10, pady=8)
        card_log.pack(fill="both", expand=True)

        log_hdr = tk.Frame(card_log, bg="#141620")
        log_hdr.pack(fill="x", pady=(0, 4))
        tk.Label(log_hdr, text="📜 CONSOLA DEL SISTEMA & MINERÍA:", font=("Helvetica", 9, "bold"), fg="#ffffff", bg="#141620").pack(side="left")
        
        btn_clear = tk.Button(log_hdr, text="Limpiar", font=("Helvetica", 8), bg="#222533", fg="#8899aa", activebackground="#33384f", bd=0, padx=6, pady=1, command=self._clear_log)
        btn_clear.pack(side="right")

        self.txt_log = scrolledtext.ScrolledText(card_log, bg="#08090d", fg="#d0d4e0", font=("Monospace", 8), bd=0, highlightthickness=0)
        self.txt_log.pack(fill="both", expand=True)
        self.txt_log.tag_config("green", foreground="#00ff88")
        self.txt_log.tag_config("cyan", foreground="#00e5ff")
        self.txt_log.tag_config("gold", foreground="#ffb800")
        self.txt_log.tag_config("orange", foreground="#ffaa00")
        self.txt_log.tag_config("red", foreground="#ff2a44")
        self.txt_log.tag_config("gray", foreground="#778899")

        self._log("Black Ink Coin Minero de Escritorio iniciado.", "cyan")
        self._log(f"Pool de guardianes configurado: {len(self.guardians)} nodos disponibles.", "gray")

    def _log(self, text, tag="gray"):
        now = datetime.now().strftime("%H:%M:%S")
        self.txt_log.insert("end", f"[{now}] {text}\n", tag)
        self.txt_log.see("end")

    def _clear_log(self):
        self.txt_log.delete("1.0", "end")

    # Guardian Pool Management Methods
    def _refresh_guardians_combobox(self):
        vals = []
        for idx, g in enumerate(self.guardians):
            url = g["url"]
            stat = self.guardian_statuses.get(url, {})
            if stat.get("is_online"):
                badge = f"🟢 Online ({stat.get('latency_ms', 0)}ms, #{stat.get('height', 0)})"
            elif stat.get("checked"):
                badge = "🔴 Offline"
            else:
                badge = "⚪ Pendiente"
            vals.append(f"{g['name']} | {url} | {badge}")

        self.cbo_guardians["values"] = vals
        if 0 <= self.active_guardian_idx < len(vals):
            self.cbo_guardians.current(self.active_guardian_idx)
        elif len(vals) > 0:
            self.active_guardian_idx = 0
            self.cbo_guardians.current(0)
        
        self._update_guardian_details_ui()

    def _update_guardian_details_ui(self):
        active_g = self.get_active_guardian()
        url = active_g["url"]
        self.lbl_guardian_endpoint.config(text=f"Guardián Activo: {url}")

        stat = self.guardian_statuses.get(url, {})
        if stat.get("is_online"):
            self.lbl_node_detail.config(
                text=f"● En Línea | Altura #{stat.get('height', self.current_height)} | Dif. {stat.get('diff_bits', self.current_diff_bits)}b | {stat.get('latency_ms', 0)}ms",
                fg="#00ff88"
            )
        elif stat.get("checked"):
            self.lbl_node_detail.config(text="❌ Guardián Inaccesible", fg="#ff2a44")
        else:
            self.lbl_node_detail.config(text="● Conectando al guardián...", fg="#ffaa00")

    def _on_guardian_selected(self, event=None):
        sel_idx = self.cbo_guardians.current()
        if 0 <= sel_idx < len(self.guardians):
            self.active_guardian_idx = sel_idx
            new_g = self.guardians[sel_idx]
            self.consecutive_failures = 0
            self._update_guardian_details_ui()
            self._save_config()
            self._log(f"Guardián cambiado manualmente a: {new_g['name']} ({new_g['url']})", "cyan")
            self._fetch_mining_job()

    def _on_failover_toggle(self):
        self.auto_failover_enabled = self.var_auto_failover.get()
        self._save_config()
        state_str = "Habilitado" if self.auto_failover_enabled else "Deshabilitado"
        self._log(f"Auto-Failover entre guardianes: {state_str}", "cyan" if self.auto_failover_enabled else "orange")

    def _prompt_add_guardian(self):
        dlg = tk.Toplevel(self.root)
        dlg.title("Añadir Guardián al Pool")
        dlg.geometry("460x220")
        dlg.configure(bg="#12141d")
        dlg.transient(self.root)
        dlg.grab_set()

        tk.Label(dlg, text="🛡️ Añadir Nuevo Nodo Guardián", font=("Helvetica", 11, "bold"), fg="#00e5ff", bg="#12141d").pack(pady=(12, 6))

        f_inputs = tk.Frame(dlg, bg="#12141d", padx=16)
        f_inputs.pack(fill="x", pady=6)

        tk.Label(f_inputs, text="Nombre / Alias:", font=("Helvetica", 9), fg="#e6e8f0", bg="#12141d").grid(row=0, column=0, sticky="w", pady=4)
        ent_name = tk.Entry(f_inputs, bg="#0d0e14", fg="#ffffff", insertbackground="#ffffff", font=("Helvetica", 9), bd=0, highlightthickness=1, highlightbackground="#33384f")
        ent_name.insert(0, "Nodo Secundario")
        ent_name.grid(row=0, column=1, sticky="ew", padx=(8, 0), pady=4)

        tk.Label(f_inputs, text="URL (IP:Puerto):", font=("Helvetica", 9), fg="#e6e8f0", bg="#12141d").grid(row=1, column=0, sticky="w", pady=4)
        ent_url = tk.Entry(f_inputs, bg="#0d0e14", fg="#00ff88", insertbackground="#00ff88", font=("Monospace", 9), bd=0, highlightthickness=1, highlightbackground="#33384f")
        ent_url.insert(0, "http://192.168.0.XX:6660")
        ent_url.grid(row=1, column=1, sticky="ew", padx=(8, 0), pady=4)

        f_inputs.columnconfigure(1, weight=1)

        f_btns = tk.Frame(dlg, bg="#12141d")
        f_btns.pack(pady=12)

        def do_save():
            name = ent_name.get().strip()
            url = ent_url.get().strip().rstrip("/")
            if not name:
                messagebox.showwarning("Dato Requerido", "Por favor ingresa un nombre para el guardián.", parent=dlg)
                return
            if not url or "XX" in url:
                messagebox.showwarning("URL Requerida", "Por favor introduce una IP y puerto válidos (ej: http://192.168.0.25:6660).", parent=dlg)
                return
            if not url.startswith("http://") and not url.startswith("https://"):
                url = f"http://{url}"

            self.guardians.append({"name": name, "url": url})
            self.active_guardian_idx = len(self.guardians) - 1
            self._save_config()
            self._log(f"Nuevo guardián añadido al pool: {name} ({url})", "green")
            self._refresh_guardians_combobox()
            dlg.destroy()
            self._probe_all_guardians()
            self._fetch_mining_job()

        btn_ok = tk.Button(f_btns, text="Añadir y Conectar", font=("Helvetica", 9, "bold"), bg="#00aa55", fg="#ffffff", activebackground="#00cc66", bd=0, padx=12, pady=4, command=do_save)
        btn_ok.pack(side="left", padx=6)

        btn_cancel = tk.Button(f_btns, text="Cancelar", font=("Helvetica", 9), bg="#222533", fg="#8899aa", activebackground="#33384f", bd=0, padx=12, pady=4, command=dlg.destroy)
        btn_cancel.pack(side="left")

    def _remove_current_guardian(self):
        if len(self.guardians) <= 1:
            messagebox.showwarning("Acción denegada", "Debes mantener al menos un guardián configurado en el pool.")
            return

        active_g = self.get_active_guardian()
        if messagebox.askyesno("Confirmar Eliminación", f"¿Eliminar '{active_g['name']}' ({active_g['url']}) del pool de guardianes?"):
            rem_name = active_g['name']
            self.guardians.pop(self.active_guardian_idx)
            self.active_guardian_idx = max(0, min(self.active_guardian_idx, len(self.guardians) - 1))
            self._save_config()
            self._log(f"Guardián eliminado: {rem_name}. Ahora conectado a: {self.get_active_guardian()['name']}", "orange")
            self._refresh_guardians_combobox()
            self._fetch_mining_job()

    def _probe_all_guardians(self):
        def probe_worker():
            for g in self.guardians:
                url = g["url"].rstrip("/")
                t0 = time.time()
                try:
                    req = urllib.request.Request(f"{url}/api/info", headers={"User-Agent": "BicDesktopMiner/0.666"})
                    with urllib.request.urlopen(req, timeout=2.0) as resp:
                        data = json.loads(resp.read().decode())
                        lat = int((time.time() - t0) * 1000)
                        h = data.get("height", 0)
                        self.guardian_statuses[url] = {
                            "is_online": True,
                            "checked": True,
                            "latency_ms": lat,
                            "height": h,
                            "diff_bits": self.current_diff_bits
                        }
                except Exception:
                    self.guardian_statuses[url] = {
                        "is_online": False,
                        "checked": True,
                        "latency_ms": 0,
                        "height": 0
                    }
            self.schedule_ui(self._refresh_guardians_combobox)

        threading.Thread(target=probe_worker, daemon=True).start()

    # Auto-Failover Logic
    def _trigger_auto_failover(self, reason="Conexión fallida"):
        if not self.auto_failover_enabled or len(self.guardians) <= 1:
            return

        if self.is_failover_active:
            return

        self.is_failover_active = True
        failed_g = self.get_active_guardian()
        current_idx = self.active_guardian_idx

        self._log(f"⚠️ [AUTO-FAILOVER] Guardián actual [{failed_g['name']}] no responde ({reason}).", "orange")
        self._log("🔍 [AUTO-FAILOVER] Buscando siguiente guardián saludable en el pool...", "orange")

        def failover_search():
            found_idx = None
            for offset in range(1, len(self.guardians)):
                cand_idx = (current_idx + offset) % len(self.guardians)
                cand = self.guardians[cand_idx]
                cand_url = cand["url"].rstrip("/")
                try:
                    req = urllib.request.Request(f"{cand_url}/api/mining/job", headers={"User-Agent": "BicDesktopMiner/0.666"})
                    with urllib.request.urlopen(req, timeout=2.5) as resp:
                        if resp.status == 200:
                            found_idx = cand_idx
                            break
                except Exception:
                    continue

            def apply_failover():
                self.is_failover_active = False
                if found_idx is not None:
                    self.active_guardian_idx = found_idx
                    self.consecutive_failures = 0
                    new_g = self.guardians[found_idx]
                    self._log(f"✅ [AUTO-FAILOVER] Conmutado automáticamente a: {new_g['name']} ({new_g['url']}).", "green")
                    self._log("🔄 Sincronizando nuevo bloque y reanudando cálculo de hash sin detener hilos...", "cyan")
                    self._refresh_guardians_combobox()
                    self._save_config()
                    self._fetch_mining_job()
                else:
                    self._log("❌ [AUTO-FAILOVER] Todos los guardianes del pool están temporalmente inaccesibles. Reintentando...", "red")

            self.schedule_ui(apply_failover)

        threading.Thread(target=failover_search, daemon=True).start()

    def _validate_address_display(self):
        addr = self.ent_address.get().strip() if hasattr(self, "ent_address") else self.initial_address
        if addr == DEFAULT_ADDRESS:
            self.lbl_address_status.config(
                text="⚠️ ATENCIÓN: Estás usando la dirección demo de prueba. Las monedas minadas NO irán a tu billetera personal. Pega la dirección de tu billetera (bic666_...).",
                fg="#ffaa00"
            )
        elif addr.startswith("bic666_") and len(addr) > 50:
            self.lbl_address_status.config(
                text=f"✓ Billetera personal configurada ({addr[:16]}...{addr[-8:]}). Las recompensas BIC se enviarán a esta dirección.",
                fg="#00ff88"
            )
        elif not addr:
            self.lbl_address_status.config(
                text="❌ Campo vacío. Debes ingresar una dirección válida 'bic666_...'",
                fg="#ff2a44"
            )
        else:
            self.lbl_address_status.config(
                text="❌ Dirección inválida: debe comenzar por 'bic666_'",
                fg="#ff2a44"
            )

    def _paste_address(self):
        try:
            val = self.root.clipboard_get().strip()
            if val.startswith("bic666_"):
                self.ent_address.delete(0, "end")
                self.ent_address.insert(0, val)
                self._validate_address_display()
                self._save_config()
                self._log(f"Billetera actualizada desde portapapeles: {val[:20]}...", "cyan")
            else:
                messagebox.showwarning("Dirección Inválida", "El portapapeles no contiene una dirección válida de Black Ink Coin (debe iniciar con bic666_).")
        except Exception:
            pass

    def _set_address(self, addr):
        self.ent_address.delete(0, "end")
        self.ent_address.insert(0, addr)
        self._validate_address_display()
        self._save_config()
        self._log("Dirección restablecida a billetera de pruebas.", "gray")

    # Touch Heartbeat Handlers
    def _on_touch_press(self, event=None):
        self.last_human_touch = time.time()
        self.touch_entropy_accumulator = ((self.touch_entropy_accumulator * 31) ^ (int(time.time() * 1000000) & 0xFFFF)) + 1
        self.btn_touch.config(bg="#ff2a44", fg="#ffffff", text="🔥 PRESENCIA HUMANA ACTIVA 🔥\n(Minando al 100% de potencia)")
        self._update_touch_timer_ui()

    def _on_touch_release(self, event=None):
        self.btn_touch.config(bg="#2c141d", fg="#ff4466", text="🖐️ HAZ CLIC O MANTÉN PULSADA LA BARRA ESPACIADORA\n(Renueva 120s de validez humana)")

    def _on_space_press(self, event=None):
        if isinstance(self.root.focus_get(), tk.Entry):
            return
        if not self.is_touch_key_held:
            self.is_touch_key_held = True
            self._on_touch_press()

    def _on_space_release(self, event=None):
        if self.is_touch_key_held:
            self.is_touch_key_held = False
            self._on_touch_release()

    def _update_touch_timer_ui(self):
        rem = max(0, TARGET_VALIDITY_WINDOW - int(time.time() - self.last_human_touch))
        rem_cd = max(0, int(self.cooldown_until - time.time()))

        if rem_cd > 0:
            self.lbl_block_diff.config(text=f"#{self.current_height} (⏳ {rem_cd}s CD)", fg="#ffaa00")
        elif self.current_diff_bits > 0:
            self.lbl_block_diff.config(text=f"#{self.current_height} ({self.current_diff_bits} Bits)", fg="#ffb800")

        if rem > 0:
            self.lbl_touch_timer.config(text=f"[{rem}s VALID]", fg="#00ff88")
        else:
            self.lbl_touch_timer.config(text="[EXPIRADO > 120s]", fg="#ff2a44")

    # Mining Execution
    def toggle_mining(self):
        if not self.is_mining:
            addr = self.ent_address.get().strip()
            if not addr.startswith("bic666_"):
                messagebox.showerror("Dirección Inválida", "Por favor proporciona una dirección válida de BIC que comience por 'bic666_'.")
                return
            
            if addr == DEFAULT_ADDRESS:
                if not messagebox.askyesno(
                    "Dirección de Prueba",
                    "Estás utilizando la dirección de prueba por defecto.\n\nLas monedas minadas NO irán a tu billetera personal.\n\n¿Deseas continuar minando con la dirección de prueba de todos modos?"
                ):
                    return
            
            try:
                self.threads_count = int(self.spn_threads.get())
            except ValueError:
                self.threads_count = 2

            self._save_config()

            self.is_mining = True
            self.btn_toggle_mine.config(text="⏹ DETENER MINERÍA", bg="#d91e36", activebackground="#b0162a")
            self.start_time = time.time()
            active_g = self.get_active_guardian()
            self._log(f"Iniciando {self.threads_count} hilos de minería hacia [{active_g['name']}]...", "cyan")

            # Reset touch window to now
            self.last_human_touch = time.time()

            for t_idx in range(self.threads_count):
                th = threading.Thread(target=self._mining_worker, args=(t_idx,), daemon=True)
                self.miner_threads.append(th)
                th.start()
        else:
            self.is_mining = False
            self.btn_toggle_mine.config(text="▶ INICIAR MINERÍA CPU", bg="#00aa55", activebackground="#00cc66")
            self.lbl_hashrate.config(text="0.0 H/s")
            self._log("Minería detenida por el usuario.", "gray")

    def _fetch_mining_job(self):
        node_url = self.get_node_url()
        try:
            req = urllib.request.Request(f"{node_url}/api/mining/job", headers={"User-Agent": "BicDesktopMiner/0.666"})
            with urllib.request.urlopen(req, timeout=3) as resp:
                data = json.loads(resp.read().decode())
                self.current_job = data
                self.current_height = data.get("height", 1)
                self.current_zeros = data.get("target_zeros", 2)
                self.current_diff_bits = data.get("target_zero_bits", 16)
                self.current_reward = data.get("reward_bic", 6.66)
                self.tier_name = data.get("tier_name", "Standard")
                self.server_time_sync = data.get("server_time", int(time.time()))
                self.server_time_fetch_local = time.time()

                # Parse challenge
                ch = data.get("challenge", [])
                if isinstance(ch, list):
                    self.challenge_bytes = bytes(ch)
                elif isinstance(ch, str):
                    self.challenge_bytes = bytes.fromhex(ch)

                # Parse touch challenge
                tch = data.get("touch_challenge", "")
                if isinstance(tch, list):
                    self.touch_challenge_str = bytes(tch).hex()
                elif isinstance(tch, str):
                    self.touch_challenge_str = tch

                self.round_duration = data.get("round_duration_secs", 30)
                self.round_time_remaining = data.get("time_remaining_secs", 30)
                self.active_miners_count = data.get("active_miners_count", 0)
                if hasattr(self, "lbl_round_timer"):
                    self.lbl_round_timer.config(text=f"{format_time_human(self.round_time_remaining)} / {format_time_human(self.round_duration)}")
                    self.lbl_round_miners.config(text=f"Mineros activos: {self.active_miners_count} | Tus shares: {self.your_shares}")

                self.lbl_block_diff.config(text=f"#{self.current_height} ({self.current_diff_bits}b)")
                self.lbl_reward.config(text=f"{self.current_reward:.4f} BIC")

                # Successful job fetch resets failure counter
                self.consecutive_failures = 0
                self.guardian_statuses[node_url] = {
                    "is_online": True,
                    "checked": True,
                    "latency_ms": self.guardian_statuses.get(node_url, {}).get("latency_ms", 10),
                    "height": self.current_height,
                    "diff_bits": self.current_diff_bits
                }

                active_g = self.get_active_guardian()
                node_disp = self._format_node_display()
                if hasattr(self, "lbl_daemon_status"):
                    self.lbl_daemon_status.config(text=f"● GUARDIÁN: {active_g['name'][:18]} (#{self.current_height})", fg="#00ff88")
                if hasattr(self, "lbl_node_detail"):
                    self.lbl_node_detail.config(text=f"● En Línea | Altura #{self.current_height} | Dif. {self.current_diff_bits}b | Recompensa: {self.current_reward:.4f} BIC", fg="#00ff88")
                return True
        except Exception as e:
            self.consecutive_failures += 1
            self.guardian_statuses[node_url] = {
                "is_online": False,
                "checked": True,
                "latency_ms": 0,
                "height": 0
            }

            active_g = self.get_active_guardian()
            if hasattr(self, "lbl_daemon_status"):
                self.lbl_daemon_status.config(text="● GUARDIÁN: OFFLINE", fg="#ff2a44")
            if hasattr(self, "lbl_node_detail"):
                self.lbl_node_detail.config(text=f"❌ Inaccesible ({active_g['name']})", fg="#ff2a44")

            # Check Auto-Failover trigger
            if self.auto_failover_enabled and self.consecutive_failures >= 2:
                self._trigger_auto_failover(reason=f"Error en {node_url}")

            return False

    def _mining_worker(self, worker_id):
        nonce = worker_id * 1000000 + (int(time.time() * 1000) % 500000)
        miner_addr = self.ent_address.get().strip()

        while self.is_mining:
            # Check 120s Human Touch presence
            if (time.time() - self.last_human_touch) > TARGET_VALIDITY_WINDOW:
                time.sleep(0.4)
                continue

            if not self.challenge_bytes:
                time.sleep(0.5)
                continue

            # Batch 5000 hashes
            for _ in range(5000):
                if not self.is_mining:
                    break

                # If cooldown is active, throttle
                if self.cooldown_until > time.time():
                    time.sleep(0.25)
                    break

                buf = self.challenge_bytes + miner_addr.encode("utf-8") + struct.pack("<Q", nonce) + b"_BIC_HUMAN_MINED"
                h = hashlib.sha256(buf).digest()

                if check_difficulty_bits(h, self.current_diff_bits):
                    self._on_block_found(nonce, h, miner_addr)
                    # Advance nonce to prevent re-submitting same solution
                    nonce += 10000
                    # Stagger share finding in collaborative mode to avoid burning CPU
                    time.sleep(3.5)
                    break

                nonce += 1
                self.total_hashes += 1

    def _on_block_found(self, winning_nonce, hash_bytes, miner_addr):
        node_url = self.get_node_url()
        with self.submit_lock:
            now = time.time()
            rem_cd = int(self.cooldown_until - now)
            if rem_cd > 0:
                if now - self.last_cooldown_log > 3.0:
                    self._log(f"⏳ Cooldown IP activo: esperando {rem_cd}s para enviar nuevo bloque...", "orange")
                    self.last_cooldown_log = now
                return

            if self.last_solved_height == self.current_height and self.last_solved_height > 0:
                return

            active_g = self.get_active_guardian()
            calc_timestamp = int(self.server_time_sync + (time.time() - self.server_time_fetch_local))
            self._log(f"✨ [WINNER] Nonce {winning_nonce} cumple {self.current_diff_bits} bits cero! Enviando a [{active_g['name']}]...", "gold")

            payload = {
                "miner_address": miner_addr,
                "nonce": winning_nonce,
                "hardware_id": f"BIC-DESKTOP-{socket.gethostname()}",
                "human_touch_proof": calc_timestamp,
                "touch_challenge": self.touch_challenge_str,
                "touch_entropy": self.touch_entropy_accumulator if self.touch_entropy_accumulator > 0 else 666
            }

            try:
                req = urllib.request.Request(
                    f"{node_url}/api/mining/submit",
                    data=json.dumps(payload).encode("utf-8"),
                    headers={"Content-Type": "application/json", "User-Agent": "BicDesktopMiner/0.666"},
                    method="POST"
                )
                with urllib.request.urlopen(req, timeout=4) as resp:
                    res_data = json.loads(resp.read().decode())
                    status = res_data.get("status")

                    if status == "share_accepted":
                        self.your_shares = res_data.get("your_shares", self.your_shares + 1)
                        b_height = res_data.get("height", self.current_height)
                        rem_s = res_data.get("time_remaining_secs", 0)
                        dur_s = res_data.get("round_duration_secs", 30)
                        act_cnt = res_data.get("active_miners_count", 1)
                        self.mining_streak += 1

                        if hasattr(self, "lbl_round_timer"):
                            self.lbl_round_timer.config(text=f"{format_time_human(rem_s)} / {format_time_human(dur_s)}")
                            self.lbl_round_miners.config(text=f"Mineros activos: {act_cnt} | Tus shares: {self.your_shares}")
                        if hasattr(self, "lbl_wheel_status"):
                            self.lbl_wheel_status.config(text=f"🎡 Suerte: {self.lucky_wins} | 🔥 Racha: {self.mining_streak}")
                        self._log(f"⏱️ [RONDA #{b_height}] Share aceptado! Shares: {self.your_shares} | Mineros: {act_cnt} | Tiempo: {format_time_human(rem_s)}", "cyan")

                    elif status == "block_sealed":
                        self.blocks_mined += 1
                        b_height = res_data.get("height", self.current_height)
                        total_rew = res_data.get("total_reward_bic", self.current_reward)
                        b_hash = res_data.get("block_hash", hash_bytes.hex())[:16]
                        payouts_cnt = res_data.get("payouts_count", 1)
                        lucky_winner = res_data.get("lucky_winner", "")
                        lucky_amount = res_data.get("lucky_amount_bic", 0.0)

                        my_addr = self.ent_address.get().strip() if hasattr(self, "ent_address") else ""
                        if lucky_winner and my_addr and lucky_winner.lower() == my_addr.lower():
                            self.lucky_wins += 1
                            self._log(f"🎡🎡🎡 ¡¡¡TOQUE DE LA SUERTE 666 GANADO!!! Has obtenido el premio especial de {lucky_amount:.4f} BIC!", "gold")
                        elif lucky_winner:
                            self._log(f"🎡 Toque de la Suerte 666 otorgado a: {lucky_winner[:14]}... (+{lucky_amount:.4f} BIC)", "orange")

                        self._log(f"🎉🎉🎉 ¡BLOQUE COLABORATIVO #{b_height} SELLADO! Mineros: {payouts_cnt} | Recompensa: {total_rew:.4f} BIC (Hash: {b_hash}...)", "green")
                        self.lbl_blocks_mined.config(text=f"{self.blocks_mined} BLOQUES")
                        if hasattr(self, "lbl_wheel_status"):
                            self.lbl_wheel_status.config(text=f"🎡 Suerte: {self.lucky_wins} | 🔥 Racha: {self.mining_streak}")
                        self.your_shares = 0
                        self._fetch_mining_job()
                    else:
                        self._log(f"❌ Envío rechazado por guardián: {res_data}", "red")
            except urllib.error.HTTPError as e:
                try:
                    err_content = e.read().decode()
                    if "finalizada" in err_content or "Invalid mining solution nonce" in err_content or "RoundExpired" in err_content:
                        self._log("🔄 Ronda completada en la red. Sincronizando nuevo bloque...", "orange")
                        self.your_shares = 0
                        self._fetch_mining_job()
                    elif "DuplicateNonce" in err_content or "ya ha sido registrado" in err_content:
                        self._log("⚠️ Nonce ya registrado previamente. Buscando nuevo nonce...", "orange")
                    elif "Por favor espera" in err_content or "espera " in err_content:
                        import re
                        m = re.search(r"espera (\d+)s", err_content)
                        wait_s = int(m.group(1)) if m else 15
                        self.cooldown_until = time.time() + wait_s
                        self._log(f"⏳ Cooldown IP activo: esperando {wait_s}s antes de enviar nuevo bloque.", "orange")
                        self._fetch_mining_job()
                    else:
                        self._log(f"❌ Error {e.code}: {err_content}", "red")
                except Exception:
                    self._log(f"❌ Error HTTP {e.code}", "red")
            except Exception as e:
                self._log(f"❌ Error de red al enviar bloque al guardián {node_url}: {e}", "red")
                if self.auto_failover_enabled:
                    self._trigger_auto_failover(reason="Fallo de red al enviar bloque")

    # ESP32 Serial Monitor (USB Bridge)
    def toggle_esp32_serial(self):
        if not HAS_SERIAL:
            messagebox.showerror("Pyserial Missing", "pyserial library is required for ESP32 monitor. Install with: pip install pyserial")
            return

        if not self.serial_running:
            port = self.cbo_serial.get().strip()
            try:
                self.serial_conn = serial.Serial(port, 115200, timeout=1)
                self.serial_running = True
                self.btn_serial.config(text="Desconectar", bg="#d91e36")
                self.lbl_serial_stat.config(text=f"Conectado ({port})", fg="#00ff88")
                self._log(f"Abierto puerto serial ESP32 en {port} (115200 baud)", "cyan")

                self.serial_thread = threading.Thread(target=self._serial_read_loop, daemon=True)
                self.serial_thread.start()
            except Exception as e:
                messagebox.showerror("Serial Error", f"No se pudo abrir {port}: {e}")
        else:
            self.serial_running = False
            if self.serial_conn:
                try:
                    self.serial_conn.close()
                except Exception:
                    pass
            self.btn_serial.config(text="Conectar ESP32", bg="#222533")
            self.lbl_serial_stat.config(text="Desconectado", fg="#778899")
            self._log("Monitor serie ESP32 desconectado.", "gray")

    def _serial_read_loop(self):
        while self.serial_running and self.serial_conn and self.serial_conn.is_open:
            try:
                line = self.serial_conn.readline()
                if line:
                    decoded = line.decode("utf-8", errors="replace").strip()
                    if decoded:
                        self._log(f"[ESP32] {decoded}", "cyan")
            except Exception:
                break

    # Background UI Update Loop
    def _start_background_loops(self):
        def loop_tick():
            # Process thread-safe UI actions from background threads
            while not self.ui_queue.empty():
                try:
                    cb, args = self.ui_queue.get_nowait()
                    cb(*args)
                except Exception:
                    break

            self._update_touch_timer_ui()
            
            # Calculate Hashrate
            if self.is_mining and self.start_time > 0:
                elapsed = time.time() - self.start_time
                if elapsed > 0:
                    self.current_hashrate = self.total_hashes / elapsed
                    self.lbl_hashrate.config(text=f"{self.current_hashrate:,.1f} H/s")
                    self.hashrate_history.append(self.current_hashrate)
                    if len(self.hashrate_history) > 30:
                        self.hashrate_history.pop(0)
                    self._draw_graph()

            self.root.after(500, loop_tick)

        def poll_node_job():
            self._fetch_mining_job()
            self.root.after(3000, poll_node_job)

        def periodic_probe():
            self._probe_all_guardians()
            # Probe all guardians every 20 seconds
            self.root.after(20000, periodic_probe)

        self.root.after(200, loop_tick)
        self.root.after(100, poll_node_job)
        self.root.after(800, periodic_probe)

    def _draw_graph(self):
        c = self.canvas_graph
        w = c.winfo_width()
        h = c.winfo_height()
        if w <= 10 or h <= 10:
            return

        c.delete("all")
        for y_pct in [0.25, 0.5, 0.75]:
            c.create_line(0, int(h * y_pct), w, int(h * y_pct), fill="#141622", width=1)

        max_hr = max(self.hashrate_history) if max(self.hashrate_history) > 0 else 100.0
        n_pts = len(self.hashrate_history)
        step_x = w / max(1, n_pts - 1)

        points = []
        for idx, hr in enumerate(self.hashrate_history):
            x = idx * step_x
            y = h - (hr / max_hr) * (h - 10) - 5
            points.extend([x, y])

        if len(points) >= 4:
            polygon_pts = [0, h] + points + [w, h]
            c.create_polygon(polygon_pts, fill="#1f141a", outline="")
            c.create_line(points, fill="#ff2a44", width=2, smooth=True)

        c.create_text(w - 8, 8, text=f"Pico: {max_hr:,.0f} H/s", fill="#8899aa", font=("Helvetica", 7), anchor="ne")


def main():
    parser = argparse.ArgumentParser(description="Black Ink Coin Official Desktop Miner with Guardian Failover")
    parser.add_argument("--node", default=None, help="Initial Guardian Node RPC URL (e.g. http://192.168.0.20:6660)")
    parser.add_argument("--address", default=None, help="Destination shielded address (bic666_...)")
    parser.add_argument("--threads", type=int, default=None, help="Number of CPU mining threads")
    args, _ = parser.parse_known_args()

    root = tk.Tk()
    app = BicDesktopMinerApp(root, cli_node=args.node, cli_address=args.address, cli_threads=args.threads)
    root.mainloop()


if __name__ == "__main__":
    main()
