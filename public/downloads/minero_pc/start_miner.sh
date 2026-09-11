#!/usr/bin/env bash
# ==============================================================================
# BLACK INK COIN (BIC) - OFFICIAL DESKTOP MINER LAUNCHER
# ==============================================================================
set -e
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"

echo "================================================================================"
echo "  ⛏️  STARTING DESKTOP MINER - BLACK INK COIN (BIC)"
echo "================================================================================"
echo "Checking Python dependencies..."

if ! command -v python3 &> /dev/null; then
    echo "❌ Error: Python 3 is not installed. Please install Python 3 to continue."
    exit 1
fi

python3 -m pip install -r requirements.txt --quiet 2>/dev/null || true

echo "Launching graphical miner..."
python3 bic_miner_desktop.py "$@"
