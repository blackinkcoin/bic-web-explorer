@echo off
title Black Ink Coin - Minero de Escritorio
echo ==========================================================
echo   ⛏️  MINERO DE ESCRITORIO - BLACK INK COIN (BIC)
echo ==========================================================
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python 3 no se encuentra instalado en Windows.
    echo Descargalo de https://www.python.org/
    pause
    exit /b 1
)

pip install -r requirements.txt --quiet
python bic_miner_desktop.py %*
pause
