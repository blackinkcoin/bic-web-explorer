================================================================================
           NETWORK GUARDIAN NODE GUIDE - BLACK INK COIN (BIC)
================================================================================

Welcome to the most vital role for network sovereignty and censorship resistance!

1. WHAT IS A GUARDIAN NODE?
--------------------------------------------------------------------------------
The Guardian runs the 'bicd' daemon, the core engine of the protocol.
Your machine validates incoming blocks, defends the network against spam,
and immutably stores the blockchain history on your local drive.

2. WHAT IS YOUR REWARD?
--------------------------------------------------------------------------------
In Black Ink Coin, 100% of all transaction fees are distributed equally
among all active Guardian nodes that validate each block.
In addition, Guardians receive 6.66% of the new fixed block emission.
You earn BIC continuously simply for keeping your node online and validating!

3. HOW TO RUN THE NODE ON LINUX / MACOS
--------------------------------------------------------------------------------
Open a terminal in this directory and execute:

    ./start_guardian.sh

Or directly:

    ./bicd --data-dir .bic_ledger

4. AUTOMATIC & INTERACTIVE GUARDIAN WALLET
--------------------------------------------------------------------------------
When running interactively, the node will guide you through setup:
- Option 1: Provide your existing public address (bic666_...).
- Option 2: Generate a new wallet by entering your personal 13th secret word.
            The system provides your 12 deterministic BIP-39 words.

Your configuration is safely saved to:

    .bic_ledger/guardian_wallet.json

All transaction fees and guardian rewards collected by your node will be
automatically credited to this address.

5. ADVANCED PARAMETERS
--------------------------------------------------------------------------------
To specify your guardian address explicitly via CLI:

    ./bicd --guardian-address bic666_your_address_here...

To run headless/daemon with a 13th word passphrase:

    ./bicd --guardian-passphrase "your_13th_word"

To change the RPC port (default: 6660) or P2P port (default: 6666):

    ./bicd --rpc-port 6660 --p2p-port 6666

================================================================================
                 Sovereignty, Privacy, and Absolute Freedom.
================================================================================
