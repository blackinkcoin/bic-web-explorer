#!/usr/bin/env bash
# ==============================================================================
# BLACK INK COIN (BIC) - OFFICIAL GUARDIAN NODE L1 LAUNCHER
# ==============================================================================
# Validates blocks on the P2P Swarm, secures persistent ledger storage on disk,
# and collects 100% of transaction fees plus 6.66% block emission.
# ==============================================================================

set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${RED}================================================================================${NC}"
echo -e "${RED}  🛡️  BLACK INK COIN - NETWORK GUARDIAN NODE (L1)                               ${NC}"
echo -e "${RED}================================================================================${NC}"
echo -e "  * Role: Consensus validation, distributed storage, and P2P relaying."
echo -e "  * Reward: ${GREEN}100% of transaction fees${NC} + ${YELLOW}6.66% of new block emission${NC}."
echo -e "  * Database Directory: ${CYAN}$DIR/.bic_ledger${NC}"
echo -e "${RED}================================================================================${NC}"
echo ""

# Find bicd binary
BICD_BIN=""
if [ -f "$DIR/bicd" ]; then
    BICD_BIN="$DIR/bicd"
elif [ -f "$DIR/target/release/bicd" ]; then
    BICD_BIN="$DIR/target/release/bicd"
elif command -v bicd >/dev/null 2>&1; then
    BICD_BIN="$(command -v bicd)"
else
    echo -e "${RED}❌ Error: 'bicd' binary not found.${NC}"
    echo "Please build the project with 'cargo build --release' or download the official release package."
    exit 1
fi

chmod +x "$BICD_BIN"
LEDGER_DIR="$DIR/.bic_ledger"
mkdir -p "$LEDGER_DIR"
GUARDIAN_WALLET="$LEDGER_DIR/guardian_wallet.json"

# Check if guardian parameters were passed
HAS_GUARDIAN_FLAG=false
for arg in "$@"; do
    if [[ "$arg" == *"--guardian-address"* ]]; then
        HAS_GUARDIAN_FLAG=true
        break
    fi
done

# If wallet already exists and no flag provided, report it
if [ "$HAS_GUARDIAN_FLAG" = false ] && [ -f "$GUARDIAN_WALLET" ]; then
    SAVED_ADDR=$(grep -o '"address": "[^"]*' "$GUARDIAN_WALLET" | cut -d'"' -f4 || echo "")
    if [ -n "$SAVED_ADDR" ]; then
        echo -e "${GREEN}✓ Guardian Wallet loaded:${NC} ${CYAN}$SAVED_ADDR${NC}"
        echo -e "  Transaction fees and rewards will be credited to this address."
        echo ""
    fi
fi

# Launch bicd daemon (if no wallet exists, bicd will run the interactive setup wizard)
exec "$BICD_BIN" --data-dir "$LEDGER_DIR" "$@"
