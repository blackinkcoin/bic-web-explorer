#!/usr/bin/env bash
# ==============================================================================
# BLACK INK COIN (BIC) - LANZADOR OFICIAL DEL NODO GUARDIÁN L1
# ==============================================================================
# Valida bloques en la red P2P Swarm, asegura la persistencia en disco del ledger
# y recauda el 100% de las comisiones de transacciones y el 6.66% de emisión.
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
echo -e "${RED}  🛡️  BLACK INK COIN - NODO GUARDIÁN DE LA RED (L1)                             ${NC}"
echo -e "${RED}================================================================================${NC}"
echo -e "  * Rol: Validación BFT, almacenamiento distribuido y retransmisión P2P."
echo -e "  * Recompensa: ${GREEN}100% de las comisiones de transacción${NC} + ${YELLOW}6.66% de la nueva emisión${NC}."
echo -e "  * Directorio de base de datos: ${CYAN}$DIR/.bic_ledger${NC}"
echo -e "${RED}================================================================================${NC}"
echo ""

# Verificar binario bicd
BICD_BIN=""
if [ -f "$DIR/bicd" ]; then
    BICD_BIN="$DIR/bicd"
elif [ -f "$DIR/target/release/bicd" ]; then
    BICD_BIN="$DIR/target/release/bicd"
elif command -v bicd >/dev/null 2>&1; then
    BICD_BIN="$(command -v bicd)"
else
    echo -e "${RED}❌ Error: No se encontró el ejecutable 'bicd'.${NC}"
    echo "Asegúrate de compilar el proyecto (cargo build --release) o descargar el paquete oficial."
    exit 1
fi

chmod +x "$BICD_BIN"
LEDGER_DIR="$DIR/.bic_ledger"
mkdir -p "$LEDGER_DIR"
GUARDIAN_WALLET="$LEDGER_DIR/guardian_wallet.json"

# Comprobar si se pasaron argumentos de guardián directamente
HAS_GUARDIAN_FLAG=false
for arg in "$@"; do
    if [[ "$arg" == *"--guardian-address"* ]]; then
        HAS_GUARDIAN_FLAG=true
        break
    fi
done

# Si ya existe una billetera guardada o se pasó por flag, arrancar directamente
if [ "$HAS_GUARDIAN_FLAG" = false ] && [ -f "$GUARDIAN_WALLET" ]; then
    SAVED_ADDR=$(grep -o '"address": "[^"]*' "$GUARDIAN_WALLET" | cut -d'"' -f4 || echo "")
    if [ -n "$SAVED_ADDR" ]; then
        echo -e "${GREEN}✓ Billetera de Guardián cargada:${NC} ${CYAN}$SAVED_ADDR${NC}"
        echo -e "  Las comisiones y recompensas se enviarán a esta dirección."
        echo ""
    fi
fi

# Iniciar nodo bicd (si no existe wallet, bicd ejecutará el asistente interactivo)
exec "$BICD_BIN" --data-dir "$LEDGER_DIR" "$@"
