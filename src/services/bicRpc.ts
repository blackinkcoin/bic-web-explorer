import {
  NetworkInfo,
  MiningStats,
  MiningJob,
  MiningSubmitResult,
  WalletData,
  WalletBalance,
  ViewKeyBalance,
  GuardianRegisterResult,
  RecentBlock,
} from '../types/bic';

// Dynamic RPC host resolver supporting 127.0.0.1, localhost, LAN IPs, and proxies
const getRpcBase = (): string => {
  if (typeof window === 'undefined') return 'http://127.0.0.1:6660';
  if (window.location.port === '6660') return '';
  const host = window.location.hostname || '127.0.0.1';
  return `${window.location.protocol}//${host}:6660`;
};

async function fetchRpc<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : '/' + endpoint;
  const primaryUrl = `${getRpcBase()}${normalizedEndpoint}`;

  try {
    const res = await fetch(primaryUrl, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (res.ok) {
      return (await res.json()) as T;
    }

    let errorMsg = `HTTP Error ${res.status}`;
    try {
      const errJson = await res.json();
      if (errJson.error) errorMsg = errJson.error;
      else if (errJson.message) errorMsg = errJson.message;
    } catch {
      // ignore
    }
    throw new Error(errorMsg);
  } catch (primaryErr) {
    // If primary direct connection failed and base was not empty, attempt relative path
    if (getRpcBase() !== '') {
      try {
        const fallbackRes = await fetch(normalizedEndpoint, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
          },
        });
        if (fallbackRes.ok) {
          return (await fallbackRes.json()) as T;
        }
      } catch {
        // ignore fallback failure
      }
    }
    throw primaryErr;
  }
}

export const bicRpc = {
  async getInfo(): Promise<NetworkInfo> {
    try {
      return await fetchRpc<NetworkInfo>('/api/info');
    } catch {
      // Fallback local mock state if node is offline
      return {
        network: "Black Ink Coin Mainnet",
        protocol_version: "0.666.0",
        height: 2,
        tip_hash: "000000666a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d",
        max_supply_bic: 66600000,
        total_guardian_fees_hells: 250000,
        total_guardian_fees_bic: 0.25,
        total_burned_fees_hells: 250000,
        total_burned_fees_bic: 0.25,
        active_guardians_count: 1,
        guardian_address: "bic666_5cb78c4a47eed4bca2b3d7dec5bf451cdce2631df4b86b84786b51eb38f884218aa98a8074f0b257b082b8e3d79df0c21a7f0257574e2be3d7a454650008167b",
        total_transactions: 18,
        mempool_pending: 0,
        block_time_ms: 1666,
        privacy_mode: "Zero-Knowledge Shielded (Mandatory)"
      };
    }
  },

  async getMiningStats(): Promise<MiningStats> {
    try {
      return await fetchRpc<MiningStats>('/api/mining/stats');
    } catch {
      return {
        current_height: 2,
        difficulty_bits: 20,
        next_block_reward_bic: 6.2625,
        next_block_reward_hells: 6262500,
        next_reward_tier: "Normal Collaborative Block",
        base_reward_bic: 6.2625,
        reward_floor_bic: 3.13125,
        reward_ceiling_bic: 9.39375,
        halvings_completed: 0,
        next_halving_block: 66666,
        blocks_until_next_halving: 66664,
        target_block_time_secs: 60,
        round_duration_secs: 60,
        round_time_remaining_secs: 42,
        active_collaborative_miners: 1,
        active_guardians_count: 1,
        fee_distribution_policy: "100% to active Guardian Nodes",
        min_cooldown_secs: 3,
        proof_of_human_touch_active: true,
        anti_sybil_active: true,
        active_devices_on_your_ip: 1,
        client_ip: "127.0.0.1"
      };
    }
  },

  async getMiningJob(): Promise<MiningJob> {
    try {
      return await fetchRpc<MiningJob>('/api/mining/job');
    } catch {
      return {
        height: 3,
        previous_hash: "000000666a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d",
        merkle_root: "9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e",
        difficulty_bits: 20,
        timestamp: Math.floor(Date.now() / 1000),
        round_time_remaining_secs: 35,
        active_miners_count: 1,
        active_guardians_count: 1,
        round_fees_hells: 50000,
        touch_challenge: Array.from({ length: 32 }, (_, i) => (i * 7 + 13) % 256)
      };
    }
  },

  async getBlocks(): Promise<RecentBlock[]> {
    try {
      return await fetchRpc<RecentBlock[]>('/api/blocks');
    } catch {
      return [];
    }
  },

  async getBlock(id: string | number): Promise<RecentBlock | null> {
    try {
      return await fetchRpc<RecentBlock>(`/api/block/${id}`);
    } catch {
      return null;
    }
  },

  async solveAndSubmitMining(payload: {
    miner_address: string;
    hardware_id?: string;
    human_touch_proof?: number;
    touch_challenge?: number[];
    touch_entropy?: number;
  }): Promise<MiningSubmitResult> {
    return fetchRpc<MiningSubmitResult>('/api/mining/solve_and_submit', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async registerGuardian(guardian_address: string): Promise<GuardianRegisterResult> {
    return fetchRpc<GuardianRegisterResult>('/api/guardian/register', {
      method: 'POST',
      body: JSON.stringify({ guardian_address }),
    });
  },

  async generateWallet(passphrase?: string): Promise<WalletData> {
    return fetchRpc<WalletData>('/api/wallet/generate', {
      method: 'POST',
      body: JSON.stringify({ passphrase: passphrase || '' }),
    });
  },

  async restoreWallet(mnemonic: string, passphrase?: string): Promise<WalletData> {
    return fetchRpc<WalletData>('/api/wallet/restore', {
      method: 'POST',
      body: JSON.stringify({ mnemonic, passphrase: passphrase || '' }),
    });
  },

  async getWalletBalance(mnemonic: string, passphrase?: string): Promise<WalletBalance> {
    return fetchRpc<WalletBalance>('/api/wallet/balance', {
      method: 'POST',
      body: JSON.stringify({ mnemonic, passphrase: passphrase || '' }),
    });
  },

  async scanWithViewKey(view_key: string, spend_pub: string): Promise<ViewKeyBalance> {
    return fetchRpc<ViewKeyBalance>('/api/wallet/scan_view', {
      method: 'POST',
      body: JSON.stringify({ view_key, spend_pub }),
    });
  },

  async sendShieldedTx(payload: {
    mnemonic: string;
    passphrase?: string;
    to_address: string;
    amount_bic: number;
    fee_bic?: number;
  }): Promise<{ status: string; tx_hash: string; message: string }> {
    return fetchRpc('/api/wallet/send', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }
};
