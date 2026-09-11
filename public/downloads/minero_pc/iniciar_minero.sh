#!/usr/bin/env bash
# ==============================================================================
# BLACK INK COIN (BIC) - LAUNCHER MINERO DE ESCRITORIO
# ==============================================================================
set -e
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"

echo "================================================================================"
echo "  ⛏️  INICIANDO MINERO DE ESCRITORIO - BLACK INK COIN (BIC)"
echo "================================================================================"
echo "Comprobando dependencias de Python..."

if ! command -v python3 &> /dev/null; then
    echo "❌ Error: Python 3 no está instalado. Instálalo para continuar."
    exit 1
fi

python3 -m pip install -r requirements.txt --quiet 2>/dev/null || true

echo "Arrancando minero con interfaz gráfica..."
python3 bic_miner_desktop.py "$@"
