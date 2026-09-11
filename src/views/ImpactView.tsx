import React from 'react';
import { 
  Globe, 
  ShieldAlert, 
  Lock, 
  CheckCircle2, 
  XCircle, 
  EyeOff, 
  Flame, 
  Coins, 
  Cpu, 
  Scale
} from 'lucide-react';
import { Language, translations } from '../i18n/translations';

interface ImpactViewProps {
  lang: Language;
}

export const ImpactView: React.FC<ImpactViewProps> = ({ lang }) => {
  const t = translations[lang];

  return (
    <div className="space-y-12 animate-in fade-in duration-300">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl glass-panel p-8 sm:p-12 border border-neon-pink/40 shadow-card-glow">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-neon-pink/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neon-pink/10 border border-neon-pink/30 text-neon-pink text-xs font-mono">
            <Globe className="w-3.5 h-3.5" />
            <span>{t.impactHeroBadge}</span>
          </div>

          <h1 className="font-orbitron text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {t.impactHeroTitle}
          </h1>

          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            {t.impactHeroDesc}
          </p>
        </div>
      </div>

      {/* Human Rights & Philosophical Manifesto */}
      <div className="glass-panel rounded-3xl p-8 sm:p-10 border border-white/10 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan">
            <Scale className="w-6 h-6" />
          </div>
          <h2 className="font-orbitron text-xl sm:text-2xl font-bold text-white">
            {t.whyPrivacyTitle}
          </h2>
        </div>

        <div className="space-y-4 text-gray-300 text-sm sm:text-base leading-relaxed">
          <p>{t.whyPrivacyP1}</p>
          <p>{t.whyPrivacyP2}</p>
        </div>

        {/* 3 Pillars of Defense */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-2">
            <div className="text-neon-cyan font-orbitron font-bold text-sm flex items-center gap-2">
              <EyeOff className="w-4 h-4" />
              {t.pillarShieldTitle}
            </div>
            <p className="text-xs text-gray-400">
              {t.pillarShieldDesc}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-2">
            <div className="text-neon-pink font-orbitron font-bold text-sm flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" />
              {t.pillarImmunityTitle}
            </div>
            <p className="text-xs text-gray-400">
              {t.pillarImmunityDesc}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-2">
            <div className="text-neon-green font-orbitron font-bold text-sm flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              {t.pillarDemoTitle}
            </div>
            <p className="text-xs text-gray-400">
              {t.pillarDemoDesc}
            </p>
          </div>
        </div>
      </div>

      {/* Comparative Matrix Across Monetary Systems */}
      <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden space-y-4 p-6 sm:p-8">
        <div className="space-y-1">
          <h2 className="font-orbitron text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-neon-gold" />
            {t.comparisonTitle}
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 font-mono">
            Análisis comparativo de soberanía, privacidad, política de emisión e incentivos.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm font-mono border-collapse">
            <thead className="bg-black/50 text-gray-400 border-b border-white/10 uppercase">
              <tr>
                <th className="py-4 px-4">{t.compFeature}</th>
                <th className="py-4 px-4 text-red-400">{t.compFiat}</th>
                <th className="py-4 px-4 text-orange-400">{t.compCbdc}</th>
                <th className="py-4 px-4 text-yellow-400">{t.compPublicCrypto}</th>
                <th className="py-4 px-4 text-neon-green font-bold bg-neon-green/5 border-l border-r border-neon-green/20">
                  {t.compBic}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {/* Row 1: Privacy */}
              <tr className="hover:bg-white/5 transition-colors">
                <td className="py-4 px-4 font-bold text-white">{t.row1Feat}</td>
                <td className="py-4 px-4 text-gray-400">{t.row1Fiat}</td>
                <td className="py-4 px-4 text-gray-400">{t.row1Cbdc}</td>
                <td className="py-4 px-4 text-gray-400">{t.row1Public}</td>
                <td className="py-4 px-4 text-neon-green font-bold bg-neon-green/5 border-l border-r border-neon-green/20 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-neon-green" />
                  {t.row1Bic}
                </td>
              </tr>

              {/* Row 2: Freezes */}
              <tr className="hover:bg-white/5 transition-colors">
                <td className="py-4 px-4 font-bold text-white">{t.row2Feat}</td>
                <td className="py-4 px-4 text-gray-400">{t.row2Fiat}</td>
                <td className="py-4 px-4 text-gray-400">{t.row2Cbdc}</td>
                <td className="py-4 px-4 text-gray-300">{t.row2Public}</td>
                <td className="py-4 px-4 text-neon-green font-bold bg-neon-green/5 border-l border-r border-neon-green/20 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-neon-green" />
                  {t.row2Bic}
                </td>
              </tr>

              {/* Row 3: Inflation */}
              <tr className="hover:bg-white/5 transition-colors">
                <td className="py-4 px-4 font-bold text-white">{t.row3Feat}</td>
                <td className="py-4 px-4 text-gray-400">{t.row3Fiat}</td>
                <td className="py-4 px-4 text-gray-400">{t.row3Cbdc}</td>
                <td className="py-4 px-4 text-gray-300">{t.row3Public}</td>
                <td className="py-4 px-4 text-neon-cyan font-bold bg-neon-green/5 border-l border-r border-neon-green/20">
                  {t.row3Bic}
                </td>
              </tr>

              {/* Row 4: Mining Access */}
              <tr className="hover:bg-white/5 transition-colors">
                <td className="py-4 px-4 font-bold text-white">{t.row4Feat}</td>
                <td className="py-4 px-4 text-gray-400">{t.row4Fiat}</td>
                <td className="py-4 px-4 text-gray-400">{t.row4Cbdc}</td>
                <td className="py-4 px-4 text-gray-400">{t.row4Public}</td>
                <td className="py-4 px-4 text-neon-pink font-bold bg-neon-green/5 border-l border-r border-neon-green/20">
                  {t.row4Bic}
                </td>
              </tr>

              {/* Row 5: Fees */}
              <tr className="hover:bg-white/5 transition-colors">
                <td className="py-4 px-4 font-bold text-white">{t.row5Feat}</td>
                <td className="py-4 px-4 text-gray-400">{t.row5Fiat}</td>
                <td className="py-4 px-4 text-gray-400">{t.row5Cbdc}</td>
                <td className="py-4 px-4 text-gray-400">{t.row5Public}</td>
                <td className="py-4 px-4 text-neon-purple font-bold bg-neon-green/5 border-l border-r border-neon-green/20">
                  {t.row5Bic}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
