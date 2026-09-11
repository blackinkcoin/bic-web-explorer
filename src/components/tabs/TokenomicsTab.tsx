import React from 'react';
import { 
  BarChart3, 
  Flame, 
  Coins, 
  Cpu, 
  ShieldCheck, 
  TrendingDown, 
  Clock, 
  CheckCircle2
} from 'lucide-react';
import { Language, translations } from '../../i18n/translations';
import { NetworkInfo, MiningStats } from '../../types/bic';

interface TokenomicsTabProps {
  lang: Language;
  networkInfo: NetworkInfo | null;
  miningStats: MiningStats | null;
}

export const TokenomicsTab: React.FC<TokenomicsTabProps> = ({
  lang,
  networkInfo,
  miningStats,
}) => {
  const t = translations[lang];

  const halvingsCompleted = miningStats?.halvings_completed ?? 0;
  const blocksUntilNext = miningStats?.blocks_until_next_halving ?? 665997;
  const currentHeight = networkInfo?.height ?? 0;

  // Emission phases
  const phases = [
    { era: `${t.thEra} 1`, range: '0 - 66,666', reward: '6.6600 BIC', total: '~444,000 BIC', status: t.statusInProgress },
    { era: `${t.thEra} 2`, range: '66,667 - 133,332', reward: '3.1312 BIC', total: '~208,750 BIC', status: t.statusFuture },
    { era: `${t.thEra} 3`, range: '133,333 - 199,998', reward: '1.5656 BIC', total: '~104,375 BIC', status: t.statusFuture },
    { era: `${t.thEra} 4`, range: '199,999 - 266,664', reward: '0.7828 BIC', total: '~52,187 BIC', status: t.statusFuture },
    { era: `${t.thEra} 10 (${t.statusFinal})`, range: '666,666+', reward: '0.0122 BIC', total: '666M BIC', status: t.statusFinal },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl glass-panel p-6 sm:p-10 border border-neon-cyan/30 shadow-card-glow">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-neon-cyan/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan text-xs font-mono">
            <Flame className="w-3.5 h-3.5 text-neon-pink" />
            <span className="uppercase">666 Mathematical Monetary Policy</span>
          </div>

          <h1 className="font-orbitron text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {t.tokenomicsHeroTitle}
          </h1>

          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            {t.tokenomicsHeroDesc}
          </p>
        </div>
      </div>

      {/* 4 Pillars of 666 Economics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="glass-panel glass-panel-hover rounded-2xl p-6 border border-white/5 space-y-2">
          <span className="text-xs text-gray-400">{t.maxSupply}</span>
          <div className="text-2xl sm:text-3xl font-orbitron font-bold text-neon-cyan">
            {t.maxSupplyVal}
          </div>
          <div className="text-[11px] text-gray-400">{t.hardLimitLabel}</div>
        </div>

        <div className="glass-panel glass-panel-hover rounded-2xl p-6 border border-white/5 space-y-2">
          <span className="text-xs text-gray-400">{t.emissionCurve}</span>
          <div className="text-2xl sm:text-3xl font-orbitron font-bold text-neon-pink">
            {t.emissionCurveVal}
          </div>
          <div className="text-[11px] text-gray-400">{t.gradualYearsLabel}</div>
        </div>

        <div className="glass-panel glass-panel-hover rounded-2xl p-6 border border-white/5 space-y-2">
          <span className="text-xs text-gray-400">{t.halvingSchedule}</span>
          <div className="text-2xl sm:text-3xl font-orbitron font-bold text-neon-gold">
            {t.halvingScheduleVal}
          </div>
          <div className="text-[11px] text-gray-400">{t.reductionLabel}</div>
        </div>

        <div className="glass-panel glass-panel-hover rounded-2xl p-6 border border-white/5 space-y-2">
          <span className="text-xs text-gray-400">{t.completedHalvings}</span>
          <div className="text-2xl sm:text-3xl font-orbitron font-bold text-neon-green">
            {halvingsCompleted} / 10
          </div>
          <div className="text-[11px] text-gray-400">{blocksUntilNext} {t.blocksUntilNextHalving}</div>
        </div>
      </div>

      {/* Dual Incentive Protocol Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mineros */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-neon-pink/30 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-neon-pink/10 border border-neon-pink/30 text-neon-pink">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-orbitron text-lg font-bold text-white">{t.minerIncentive}</h3>
              <span className="text-xs font-mono text-neon-pink">{t.minerIncentiveVal}</span>
            </div>
          </div>

          <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
            {t.minerIncentiveDesc}
          </p>

          <div className="p-4 rounded-xl bg-black/40 border border-white/5 font-mono text-xs space-y-1">
            <div className="text-neon-pink font-bold">{t.minerDistTitle}</div>
            <div>• {t.minerDistItem1}</div>
            <div>• {t.minerDistItem2}</div>
            <div>• {t.minerDistItem3}</div>
          </div>
        </div>

        {/* Guardianes */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-neon-purple/30 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-neon-purple/10 border border-neon-purple/30 text-neon-purple">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-orbitron text-lg font-bold text-white">{t.feeIncentive}</h3>
              <span className="text-xs font-mono text-neon-purple">{t.feeIncentiveVal}</span>
            </div>
          </div>

          <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
            {t.guardianIncentiveDesc}
          </p>

          <div className="p-4 rounded-xl bg-black/40 border border-white/5 font-mono text-xs space-y-1">
            <div className="text-neon-purple font-bold">{t.guardianDistTitle}</div>
            <div>• {t.guardianDistItem1}</div>
            <div>• {t.guardianDistItem2}</div>
            <div>• {t.guardianDistItem3}</div>
          </div>
        </div>
      </div>

      {/* Halving Phases Table */}
      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <h3 className="font-orbitron text-base font-bold text-white flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-neon-gold" />
            {t.halvingTableTitle}
          </h3>
          <span className="text-xs font-mono text-gray-400">
            {t.currentBlockLabel}: #{currentHeight}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-black/40 text-gray-400 border-b border-white/5 uppercase">
              <tr>
                <th className="py-3 px-4">{t.thEra}</th>
                <th className="py-3 px-4">{t.thRange}</th>
                <th className="py-3 px-4">{t.thReward}</th>
                <th className="py-3 px-4">{t.thTotal}</th>
                <th className="py-3 px-4 text-right">{t.thStatus}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {phases.map((p, idx) => (
                <tr key={idx} className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">{p.era}</td>
                  <td className="py-3.5 px-4 text-gray-300">{p.range}</td>
                  <td className="py-3.5 px-4 font-bold text-neon-cyan">{p.reward}</td>
                  <td className="py-3.5 px-4 text-gray-400">{p.total}</td>
                  <td className="py-3.5 px-4 text-right">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      p.status === t.statusInProgress 
                        ? 'bg-neon-green/20 text-neon-green border border-neon-green/40 animate-pulse'
                        : 'bg-white/10 text-gray-400'
                    }`}>
                      {p.status}
                    </span>
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
