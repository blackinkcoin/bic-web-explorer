import React, { useEffect, useState } from 'react';
import { X, Box, Shield, Cpu, Hash, Clock, CheckCircle2, Copy, Check } from 'lucide-react';
import { Language, translations } from '../i18n/translations';
import { RecentBlock } from '../types/bic';
import { copyToClipboard } from '../utils/clipboard';

interface BlockModalProps {
  block: RecentBlock | null;
  onClose: () => void;
  lang: Language;
}

export const BlockModal: React.FC<BlockModalProps> = ({ block, onClose, lang }) => {
  const t = translations[lang];
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!block) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl glass-panel rounded-2xl border border-neon-cyan/40 p-6 sm:p-8 shadow-2xl shadow-neon-cyan/20 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top glow line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink" />

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan">
              <Box className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-orbitron text-xl font-bold text-white">
                  {t.blockNum} #{block.height}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-neon-green/20 text-neon-green border border-neon-green/30">
                  {block.tier}
                </span>
              </div>
              <p className="text-xs text-gray-400 font-mono mt-0.5">
                {t.modalConsensusTag}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Details */}
        <div className="space-y-4 text-sm font-mono">
          {/* Hash */}
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-neon-cyan" /> {t.blockHash}
              </span>
              <button
                onClick={async () => {
                  await copyToClipboard(block.hash);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="text-[11px] text-neon-cyan hover:underline transition-all flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-neon-green" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copiado' : t.modalCopyHash}</span>
              </button>
            </div>
            <div className="text-xs text-neon-cyan font-bold break-all selection:bg-neon-cyan/30">
              {block.hash}
            </div>
          </div>

          {/* Grid Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-neon-pink" /> {t.rewardBic}
              </span>
              <div className="text-base font-bold text-white mt-1">
                {block.reward_bic.toFixed(6)} <span className="text-xs text-neon-pink">BIC</span>
              </div>
              <div className="text-[10px] text-gray-400">{t.modalMinersShare}</div>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-neon-purple" /> {t.feeShare}
              </span>
              <div className="text-base font-bold text-white mt-1">
                {block.fees_bic.toFixed(6)} <span className="text-xs text-neon-purple">BIC</span>
              </div>
              <div className="text-[10px] text-gray-400">{t.modalGuardiansShare}</div>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/5 col-span-2 sm:col-span-1">
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-neon-gold" /> {t.transactions}
              </span>
              <div className="text-base font-bold text-white mt-1">
                {block.tx_count} <span className="text-xs text-gray-400">{t.zkShielded}</span>
              </div>
              <div className="text-[10px] text-gray-400">{t.privacyStatus}: RingCT</div>
            </div>
          </div>

          {/* Validation Notice */}
          <div className="p-4 rounded-xl bg-neon-green/5 border border-neon-green/20 flex items-start gap-3 text-xs text-gray-300">
            <CheckCircle2 className="w-5 h-5 text-neon-green shrink-0 mt-0.5" />
            <div>
              <strong className="text-neon-green block">Proof-of-Human-Touch (Fast BFT)</strong>
              ZK-Shielded Pedersen & RingCT.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            {t.menuClose}
          </button>
        </div>
      </div>
    </div>
  );
};
