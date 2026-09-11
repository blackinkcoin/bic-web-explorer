@echo off
REM ==============================================================================
REM BLACK INK COIN (BIC) - DESKTOP MINER LAUNCHER FOR WINDOWS
REM ==============================================================================
echo ================================================================================
echo   STARTING DESKTOP MINER - BLACK INK COIN (BIC)
echo ================================================================================
python -m pip install -r requirements.txt --quiet
python bic_miner_desktop.py
pause
