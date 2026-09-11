export interface NetworkInfo {
  network: string;
  protocol_version: string;
  height: number;
  tip_hash: string;
  max_supply_bic: number;
  circulating_supply_bic?: number;
  circulating_supply_hells?: number;
  genesis_reserve_bic?: number;
  total_guardian_fees_hells: number;
  total_guardian_fees_bic: number;
  total_burned_fees_hells: number;
  total_burned_fees_bic: number;
  active_guardians_count: number;
  active_guardians?: string[];
  guardian_address?: string;
  total_transactions: number;
  mempool_pending: number;
  block_time_ms: number;
  privacy_mode: string;
}

export interface GuardianNodeItem {
  address: string;
  is_local: boolean;
  role: string;
  share_percentage: number;
  status: string;
}

export interface GuardiansResponse {
  status: string;
  active_guardians_count: number;
  local_guardian_address: string;
  guardians: GuardianNodeItem[];
}

export interface MiningStats {
  current_height: number;
  difficulty_bits: number;
  next_block_reward_bic: number;
  next_block_reward_hells: number;
  next_reward_tier: string;
  base_reward_bic: number;
  reward_floor_bic: number;
  reward_ceiling_bic: number;
  halvings_completed: number;
  next_halving_block: number;
  blocks_until_next_halving: number;
  target_block_time_secs: number;
  round_duration_secs: number;
  round_time_remaining_secs: number;
  active_collaborative_miners: number;
  active_guardians_count: number;
  fee_distribution_policy: string;
  min_cooldown_secs: number;
  proof_of_human_touch_active: boolean;
  anti_sybil_active: boolean;
  active_devices_on_your_ip: number;
  client_ip: string;
  jackpot_rollover_bic?: number;
  current_jackpot_bic?: number;
}

export interface MiningJob {
  height: number;
  previous_hash: string;
  merkle_root: string;
  difficulty_bits: number;
  timestamp: number;
  round_time_remaining_secs: number;
  active_miners_count: number;
  active_guardians_count: number;
  round_fees_hells: number;
  touch_challenge: number[];
  jackpot_rollover_bic?: number;
  lucky_pot_bic?: number;
}

export interface MiningSubmitResult {
  status: 'share_accepted' | 'block_sealed' | 'rejected' | 'error';
  message: string;
  height?: number;
  nonce?: number;
  round_duration_secs?: number;
  time_remaining_secs?: number;
  active_miners_count?: number;
  your_shares?: number;
  block_hash?: string;
  total_reward_bic?: number;
  total_fees_bic?: number;
  tier?: string;
  payouts_count?: number;
  payouts?: Array<{ address: string; reward_hells: number; reward_bic: number }>;
  guardian_payouts_count?: number;
  guardian_payouts?: Array<{ guardian_address: string; fee_hells: number; fee_bic: number }>;
  lucky_winner?: string;
  lucky_amount_bic?: number;
  jackpot_triggered?: boolean;
  jackpot_rollover_bic?: number;
  miners_fee_share_bic?: number;
  miner_ip?: string;
  error?: string;
}

export interface WalletData {
  mnemonic: string;
  passphrase?: string;
  has_passphrase?: boolean;
  address: string;
  spend_pub: string;
  view_key?: string;
  view_pub: string;
}

export interface WalletBalance {
  address: string;
  spend_pub?: string;
  view_key?: string;
  view_pub?: string;
  balance_bic: number;
  balance_hells: number;
  total_detected_utxos: number;
  unspent_utxos: number;
  spent_utxos: number;
  has_passphrase?: boolean;
}

export interface ViewKeyBalance {
  balance_bic: number;
  balance_hells: number;
  total_detected_utxos: number;
  security_mode: string;
}

export interface GuardianRegisterResult {
  status: string;
  guardian_address: string;
  active_guardians_count: number;
  message: string;
  error?: string;
}

export interface RecentBlock {
  height: number;
  hash: string;
  prev_hash?: string;
  merkle_root?: string;
  timestamp: number;
  tx_count: number;
  transactions?: string[];
  reward_bic: number;
  reward_hells?: number;
  fees_bic: number;
  fees_hells?: number;
  miners_count: number;
  guardians_count: number;
  tier: string;
  validator_pubkey?: string;
}
