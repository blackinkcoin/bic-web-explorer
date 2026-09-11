================================================================================
       SOVEREIGN WALLET TOOLS - BLACK INK COIN (BIC)
================================================================================

This package contains the official tools to create, store, and manage
your Black Ink Coin funds with maximum privacy and zero-knowledge protection.

1. AIR-GAPPED OFFLINE COLD WALLET (billetera_fria_offline.html)
--------------------------------------------------------------------------------
- Open this HTML file in any modern web browser (Chrome, Firefox, Brave, Safari)
  completely offline (Airplane Mode / Air-Gapped machine).
- Cryptographically generates your 12 mnemonic words, your personal 13th word,
  your public stealth address (starts with 'bic666_...'), and your audit View Key.
- Print your Paper Wallet directly to keep in a secure physical vault.
- Your private keys NEVER touch the internet.

2. COMMAND LINE WALLET (bic-cli)
--------------------------------------------------------------------------------
For power users, administrators, and terminal automation:
- Generate or restore wallets with 12 words + 13th word (Paranoia Mode).
- Query balances by scanning the blockchain via stealth addresses & Pedersen commitments.
- Send confidential Zero-Knowledge RingCT transactions.

Usage on Linux / macOS:
    ./bic-cli --help

3. WEB EXPLORER WALLET
--------------------------------------------------------------------------------
You can also use the integrated wallet inside the Web Explorer
under the 'Wallet' tab without installing external software.
================================================================================
