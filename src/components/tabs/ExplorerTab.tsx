import React, { useState } from 'react';
import { 
  Box, 
  Layers, 
  ShieldCheck, 
  Cpu, 
  Zap, 
  Activity, 
  ArrowUpRight,
  Sparkles,
  Lock,
  Copy,
  Check,
  Search,
  Filter
} from 'lucide-react';
import { Language, translations } from '../../i18n/translations';
import { NetworkInfo, MiningStats, RecentBlock } from '../../types/bic';
import { sound } from '../../utils/audio';
import { copyToClipboard as doCopyToClipboard } from '../../utils/clipboard';

interface ExplorerTabProps {
  lang: Language;
  networkInfo: NetworkInfo | null;
  miningStats: MiningStats | null;
  blocks: RecentBlock[];
  onSelectBlock: (block: RecentBlock) => void;
}

export const ExplorerTab: React.FC<ExplorerTabProps> = ({
  lang,
  networkInfo,
  miningStats,
  blocks,
  onSelectBlock,
}) => {
  const t = translations[lang];
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const copyToClipboard = async (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await doCopyToClipboard(text);
    setCopiedHash(text);
    sound.playClick();
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div className="space-y-8 sm:space-y-10 animate-in fade-in duration-300 pb-10">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl glass-panel p-6 sm:p-10 border border-neon-cyan/30 shadow-card-glow">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-neon-cyan/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-neon-pink/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>L1 ZERO-KNOWLEDGE SHIELDED LEDGER</span>
          </div>

          <h1 className="font-orbitron text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {t.explorerHeroTitle}
          </h1>

          <p className="text-gray-300 text-xs sm:text-base leading-relaxed">
            {t.explorerHeroDesc}
          </p>
        </div>
      </div>

      {/* Network Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 font-mono">
        {/* Block Height */}
        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-white/5 space-y-2">
          <div className="flex items-center justify-between text-gray-400 text-xs">
            <span>{t.blockHeight}</span>
            <Box className="w-4 h-4 text-neon-cyan" />
          </div>
          <div className="font-orbitron text-xl sm:text-3xl font-extrabold text-white">
            #{networkInfo?.height ?? '...'}
          </div>
          <div className="text-[10px] sm:text-[11px] text-neon-cyan/80 truncate">
            Tip: {networkInfo?.tip_hash ? `${networkInfo.tip_hash.slice(0, 8)}...` : 'Syncing'}
          </div>
        </div>

        {/* Circulating Supply */}
        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-white/5 space-y-2">
          <div className="flex items-center justify-between text-gray-400 text-xs">
            <span>{t.circulatingSupply}</span>
            <Zap className="w-4 h-4 text-neon-pink" />
          </div>
          <div className="font-orbitron text-xl sm:text-3xl font-extrabold text-white truncate">
            {networkInfo?.circulating_supply_bic ? networkInfo.circulating_supply_bic.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : '44,400,000'} <span className="text-xs font-sans text-neon-pink">BIC</span>
          </div>
          <div className="text-[10px] sm:text-[11px] text-gray-400">
            Cap: 666,666,666 BIC
          </div>
        </div>

        {/* Active Guardians */}
        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-white/5 space-y-2">
          <div className="flex items-center justify-between text-gray-400 text-xs">
            <span>{t.activeGuardians}</span>
            <ShieldCheck className="w-4 h-4 text-neon-purple" />
          </div>
          <div className="font-orbitron text-xl sm:text-3xl font-extrabold text-white">
            {networkInfo?.active_guardians_count ?? 1} <span className="text-xs font-sans text-neon-purple">NODOS</span>
          </div>
          <div className="text-[10px] sm:text-[11px] text-neon-purple">
            Pool: {(networkInfo?.total_guardian_fees_bic ?? 0).toFixed(4)} BIC
          </div>
        </div>

        {/* Dynamic Difficulty */}
        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-white/5 space-y-2">
          <div className="flex items-center justify-between text-gray-400 text-xs">
            <span>{t.roundDifficulty}</span>
            <Activity className="w-4 h-4 text-neon-green" />
          </div>
          <div className="font-orbitron text-xl sm:text-3xl font-extrabold text-white">
            {miningStats?.difficulty_bits ?? 16} <span className="text-xs font-sans text-neon-green">BITS</span>
          </div>
          <div className="text-[10px] sm:text-[11px] text-gray-400">
            {t.targetBlockTime}: 60s
          </div>
        </div>
      </div>

      {/* Block Stream Ribbon */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-orbitron text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-neon-cyan animate-pulse" />
            {t.liveBlockStream}
          </h2>
          <span className="text-xs text-gray-400 font-mono">
            {blocks.length} L1 Blocks
          </span>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-3 pt-1 scrollbar-thin">
          {blocks.map((b) => (
            <div
              key={b.height}
              onClick={() => {
                onSelectBlock(b);
                sound.playClick();
              }}
              className="flex-shrink-0 w-60 sm:w-64 glass-panel glass-panel-hover rounded-2xl p-4 border border-white/10 cursor-pointer space-y-2 group transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="font-orbitron text-sm font-bold text-neon-cyan group-hover:text-glow-cyan">
                  #{b.height}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-neon-green/10 text-neon-green border border-neon-green/20 font-semibold">
                  {b.tier}
                </span>
              </div>

              <div className="text-[11px] font-mono text-gray-400 truncate">
                Hash: {b.hash.slice(0, 14)}...
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-white/5 font-mono">
                <span className="text-gray-400">{t.emissionReward}:</span>
                <span className="text-white font-bold">
                  {b.reward_bic.toFixed(3)} <span className="text-neon-gold text-[10px]">BIC</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Blocks List Section: Mobile Cards (< 768px) + Desktop Table (>= 768px) */}
      <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden space-y-4">
        <div className="p-5 border-b border-white/5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-neon-purple/10 border border-neon-purple/30 text-neon-purple">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-orbitron text-base font-bold text-white">
                {t.latestBlocks}
              </h3>
              <p className="text-xs text-gray-400 font-mono">
                Verificación Criptográfica Zero-Knowledge (RingCT)
              </p>
            </div>
          </div>

          <div className="text-xs font-mono text-neon-green flex items-center gap-1.5 bg-neon-green/5 px-3 py-1 rounded-full border border-neon-green/20">
            <Lock className="w-3.5 h-3.5 text-neon-green" />
            <span>Salidas Confidenciales Pedersen</span>
          </div>
        </div>

        {/* 1. Mobile Cards View (Visible on small screens < md) */}
        <div className="md:hidden divide-y divide-white/5 px-4 pb-2">
          {blocks.map((b) => (
            <div
              key={b.height}
              onClick={() => {
                onSelectBlock(b);
                sound.playClick();
              }}
              className="py-4 space-y-2.5 cursor-pointer hover:bg-white/5 rounded-xl px-2 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-orbitron text-sm font-bold text-neon-cyan">
                    #{b.height}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-neon-green/15 text-neon-green border border-neon-green/30 font-bold">
                    {b.tier}
                  </span>
                </div>

                <span className="text-xs font-mono font-bold text-white">
                  {b.reward_bic.toFixed(4)} <span className="text-neon-pink">BIC</span>
                </span>
              </div>

              {/* Hash snippet with quick copy */}
              <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-black/50 border border-white/5 text-[11px] font-mono">
                <span className="text-gray-400 truncate">
                  {b.hash.slice(0, 16)}...{b.hash.slice(-8)}
                </span>
                <button
                  onClick={(e) => copyToClipboard(b.hash, e)}
                  title={t.modalCopyHash}
                  className="p-1 rounded text-gray-400 hover:text-neon-cyan transition-colors"
                >
                  {copiedHash === b.hash ? <Check className="w-3.5 h-3.5 text-neon-green" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-gray-400 pt-1">
                <span>{b.tx_count} {t.zkShielded}</span>
                <span className="text-neon-cyan inline-flex items-center gap-1">
                  {t.viewDetails} <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* 2. Desktop Table View (Visible on >= md) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-black/40 text-gray-400 border-b border-white/5 uppercase">
              <tr>
                <th className="py-3 px-5">{t.blockNum}</th>
                <th className="py-3 px-5">{t.blockHash}</th>
                <th className="py-3 px-5">{t.rewardBic}</th>
                <th className="py-3 px-5">{t.feeShare}</th>
                <th className="py-3 px-5">{t.transactions}</th>
                <th className="py-3 px-5 text-right">{t.viewDetails}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {blocks.map((b) => (
                <tr 
                  key={b.height} 
                  className="hover:bg-white/5 transition-colors cursor-pointer"
                  onClick={() => {
                    onSelectBlock(b);
                    sound.playClick();
                  }}
                >
                  <td className="py-4 px-5 font-bold text-neon-cyan font-orbitron">
                    #{b.height}
                  </td>
                  <td className="py-4 px-5 text-gray-300">
                    <div className="flex items-center gap-2">
                      <span className="text-neon-cyan">{b.hash.slice(0, 10)}</span>
                      <span className="text-gray-500">{b.hash.slice(10, 36)}...</span>
                      <button
                        onClick={(e) => copyToClipboard(b.hash, e)}
                        title={t.modalCopyHash}
                        className="p-1 rounded hover:bg-white/10 text-gray-500 hover:text-white transition-colors"
                      >
                        {copiedHash === b.hash ? <Check className="w-3 h-3 text-neon-green" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </td>
                  <td className="py-4 px-5 font-bold text-white">
                    {b.reward_bic.toFixed(4)} <span className="text-neon-pink text-[10px]">BIC</span>
                  </td>
                  <td className="py-4 px-5 text-neon-purple font-semibold">
                    {((b.reward_bic * 0.0666) + b.fees_bic).toFixed(4)} BIC
                  </td>
                  <td className="py-4 px-5 text-gray-300">
                    {b.tx_count} {t.zkShielded}
                  </td>
                  <td className="py-4 px-5 text-right">
                    <button className="inline-flex items-center gap-1 text-neon-cyan hover:underline text-xs">
                      {t.viewDetails} <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
