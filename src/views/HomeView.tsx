import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Cpu, 
  Flame, 
  Lock, 
  ArrowRight, 
  Box, 
  Coins, 
  CheckCircle2, 
  Zap,
  Globe,
  Radio,
  Fingerprint,
  Layers,
  Server,
  Sparkles,
  HelpCircle,
  Terminal,
  Activity,
  Calculator,
  EyeOff,
  Scale,
  Wallet
} from 'lucide-react';
import { Language, translations } from '../i18n/translations';
import { NetworkInfo, MiningStats } from '../types/bic';
import { sound } from '../utils/audio';

interface HomeViewProps {
  lang: Language;
  networkInfo: NetworkInfo | null;
  miningStats: MiningStats | null;
}

export const HomeView: React.FC<HomeViewProps> = ({
  lang,
  networkInfo,
  miningStats,
}) => {
  const t = translations[lang];

  // Interactive Simulator Device Selector
  const [selectedDevice, setSelectedDevice] = useState<'esp32' | 'laptop' | 'monster'>('esp32');

  const deviceData = {
    esp32: {
      name: t.calcDeviceEsp32,
      cost: '3 € / $4 USD',
      power: '0.8 Watts',
      hashrate: '2.5 kH/s',
      sharesPerRound: '1 Human Share (1/N)',
      payoutPercentage: '50% (N=2)',
      advantageFactor: '1/N',
      verdict: t.calcResultNotice,
      badgeColor: 'text-neon-cyan border-neon-cyan/40 bg-neon-cyan/10',
    },
    laptop: {
      name: t.calcDeviceLaptop,
      cost: '600 € / $650 USD',
      power: '25 Watts',
      hashrate: '450 kH/s',
      sharesPerRound: '1 Human Share (1/N)',
      payoutPercentage: '50% (N=2)',
      advantageFactor: '1/N',
      verdict: t.calcResultNotice,
      badgeColor: 'text-neon-purple border-neon-purple/40 bg-neon-purple/10',
    },
    monster: {
      name: t.calcDeviceMonster,
      cost: '3.500 € / $3,800 USD',
      power: '1.400 Watts',
      hashrate: '85.000 kH/s',
      sharesPerRound: '1 Human Share (1/N)',
      payoutPercentage: '50% (N=2)',
      advantageFactor: '0%',
      verdict: t.calcResultNotice,
      badgeColor: 'text-neon-pink border-neon-pink/40 bg-neon-pink/10',
    },
  };

  const currentDev = deviceData[selectedDevice];

  return (
    <div className="space-y-12 sm:space-y-16 animate-in fade-in duration-300 pb-12">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl glass-panel p-6 sm:p-12 lg:p-16 border border-neon-cyan/30 shadow-card-glow">
        <div className="absolute -right-20 -top-20 w-80 sm:w-96 h-80 sm:h-96 bg-neon-cyan/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 sm:w-96 h-80 sm:h-96 bg-neon-pink/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Typography & CTAs */}
          <div className="lg:col-span-8 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan text-xs font-mono">
              <Fingerprint className="w-4 h-4 text-neon-pink animate-pulse" />
              <span className="font-semibold tracking-wide uppercase">{t.homeHeroBadge}</span>
            </div>

            <h1 className="font-orbitron text-2xl xs:text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight sm:leading-none">
              {t.homeHeroTitle}
            </h1>

            <p className="text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl">
              {t.homeHeroDesc}
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap gap-3.5 pt-2">
              <Link
                to="/mining"
                onClick={() => sound.playClick()}
                className="w-full sm:w-auto px-6 sm:px-8 py-3.5 rounded-2xl bg-gradient-to-r from-neon-cyan via-white to-neon-cyan text-black font-orbitron text-xs sm:text-sm font-black tracking-wider hover:opacity-95 transition-all shadow-glow-cyan flex items-center justify-center gap-2"
              >
                <Cpu className="w-4 h-4" />
                <span>{t.howItWorksTitle}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/downloads"
                onClick={() => sound.playClick()}
                className="w-full sm:w-auto px-6 sm:px-8 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-orbitron text-xs sm:text-sm font-bold tracking-wider transition-all border border-white/20 hover:border-neon-pink/50 flex items-center justify-center gap-2"
              >
                <span>{t.downloadSoftwareBtn}</span>
              </Link>

              <Link
                to="/impact"
                onClick={() => sound.playClick()}
                className="w-full sm:w-auto px-6 sm:px-8 py-3.5 rounded-2xl bg-black/40 hover:bg-white/5 text-gray-300 hover:text-white font-mono text-xs sm:text-sm transition-all border border-white/10 flex items-center justify-center gap-2"
              >
                <Globe className="w-4 h-4 text-neon-pink" />
                <span>{t.learnImpactBtn}</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Floating 3D Transparent Coin */}
          <div className="lg:col-span-4 flex items-center justify-center pt-4 lg:pt-0">
            <div className="relative group cursor-pointer">
              {/* Outer Neon Glow Rings */}
              <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-neon-cyan/30 via-neon-purple/20 to-neon-pink/30 blur-2xl opacity-75 group-hover:opacity-100 transition-opacity animate-pulse" />
              <div className="absolute -inset-1 rounded-full border border-neon-cyan/40 animate-spin" style={{ animationDuration: '24s' }} />
              
              {/* Coin Asset */}
              <img 
                src="/black_ink_coin.png" 
                alt="Black Ink Coin L1 Physical Token" 
                className="relative z-10 w-48 sm:w-60 lg:w-72 h-48 sm:h-60 lg:h-72 object-contain drop-shadow-[0_15px_35px_rgba(0,240,255,0.4)] transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. LIVE NETWORK PULSE BAR */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 font-mono">
        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-white/5 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-gray-400">
            <span>{t.blockNum}</span>
            <Box className="w-3.5 h-3.5 text-neon-cyan" />
          </div>
          <div className="text-xl sm:text-2xl lg:text-3xl font-orbitron font-extrabold text-neon-cyan">
            #{networkInfo?.height ?? '...'}
          </div>
          <div className="text-[10px] text-neon-green flex items-center gap-1 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-ping" />
            Fast BFT (1.66s)
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-white/5 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-gray-400">
            <span>{t.tabGuardians}</span>
            <ShieldCheck className="w-3.5 h-3.5 text-neon-purple" />
          </div>
          <div className="text-xl sm:text-2xl lg:text-3xl font-orbitron font-extrabold text-neon-purple">
            {networkInfo?.active_guardians_count ?? 1}
          </div>
          <div className="text-[10px] text-gray-400">
            24/7 BFT Nodes
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-white/5 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-gray-400">
            <span>{t.maxSupply}</span>
            <Coins className="w-3.5 h-3.5 text-neon-pink" />
          </div>
          <div className="text-xl sm:text-2xl lg:text-3xl font-orbitron font-extrabold text-white truncate">
            {(networkInfo?.circulating_supply_bic ?? 44400026.64).toLocaleString('en-US', { maximumFractionDigits: 0 })}
          </div>
          <div className="text-[10px] text-neon-pink">
            BIC (Cap: {t.maxSupplyVal})
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-white/5 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-gray-400">
            <span>{t.rewardBic}</span>
            <Zap className="w-3.5 h-3.5 text-neon-gold" />
          </div>
          <div className="text-xl sm:text-2xl lg:text-3xl font-orbitron font-extrabold text-neon-gold">
            {(miningStats?.next_block_reward_bic ?? 6.993).toFixed(3)}
          </div>
          <div className="text-[10px] text-gray-400">
            {t.minersRatio}
          </div>
        </div>
      </section>

      {/* 2b. THE 9 METHODOLOGIES SPOTLIGHT */}
      <section className="relative overflow-hidden rounded-3xl glass-panel p-6 sm:p-8 border border-neon-cyan/30 bg-gradient-to-r from-neon-cyan/10 via-black/40 to-neon-pink/10 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-cyan/15 border border-neon-cyan/30 text-neon-cyan text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5 text-neon-pink" />
              <span>{lang === 'es' ? 'METODOLOGÍAS DEL PROTOCOLO' : 'PROTOCOL METHODOLOGIES'}</span>
            </div>
            <h2 className="font-orbitron text-xl sm:text-2xl lg:text-3xl font-bold text-white">
              {lang === 'es' ? '9 Grandes Metodologías Explicadas para Humanos' : '9 Core Methodologies Explained for Humans'}
            </h2>
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
              {lang === 'es' 
                ? 'Descubre cómo Black Ink Coin elimina las granjas industriales millonarias con el Sueldo Base 1/N, el Bote Acumulativo Rollover, el Escudo Anti-Sniper, el Consorcio P2P 50/50 y la Privacidad Militar Shielded.'
                : 'Discover how Black Ink Coin ends mining monopolies through 1/N Base Pay, Rolling Jackpots, Anti-Sniper Filters, 50/50 P2P Consortiums, and Zero-Knowledge Privacy.'}
            </p>
          </div>

          <Link
            to="/mining"
            onClick={() => sound.playClick()}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-neon-cyan to-white text-black font-orbitron text-xs font-bold tracking-wider hover:opacity-95 transition-all shadow-glow-cyan flex items-center justify-center gap-2 shrink-0 self-start lg:self-auto"
          >
            <span>{lang === 'es' ? 'Ver Explicación Completa' : 'Explore Methodologies'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 4 Key Highlight Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 font-mono text-xs">
          <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <div className="text-neon-cyan font-bold">1. Sueldo Base 70%</div>
            <div className="text-[11px] text-gray-400">{lang === 'es' ? '1 humano = 1 parte igual' : '1 human = 1 exact share'}</div>
          </div>
          <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <div className="text-neon-gold font-bold">2. Bote Rollover</div>
            <div className="text-[11px] text-gray-400">{lang === 'es' ? 'Jackpot que se acumula' : 'Rolling unawarded pot'}</div>
          </div>
          <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <div className="text-neon-pink font-bold">3. Escudo Anti-Sniper</div>
            <div className="text-[11px] text-gray-400">{lang === 'es' ? 'Permanencia obligatoria' : 'Compulsory duration'}</div>
          </div>
          <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <div className="text-neon-purple font-bold">4. Consorcio 50/50</div>
            <div className="text-[11px] text-gray-400">{lang === 'es' ? 'Comisiones a medias' : '50/50 fee sharing'}</div>
          </div>
        </div>
      </section>

      {/* 3. SYMBIOTIC ARCHITECTURE (Miners & Guardians) */}
      <section className="space-y-6">
        <div className="text-center max-w-3xl mx-auto space-y-2 px-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neon-purple/10 border border-neon-purple/30 text-neon-purple text-xs font-mono">
            <Scale className="w-3.5 h-3.5 text-neon-cyan" />
            <span>{t.symbiosisBadge}</span>
          </div>
          <h2 className="font-orbitron text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white">
            {t.symbiosisTitle}
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm">
            {t.symbiosisSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Engine A: The Human Miner */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-neon-pink/30 space-y-5 relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-neon-pink/10 border border-neon-pink/30 text-neon-pink">
                  <Fingerprint className="w-7 h-7 animate-pulse" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono bg-neon-pink/15 text-neon-pink border border-neon-pink/30 font-bold">
                  {t.symbiosisMinerShare}
                </span>
              </div>

              <div>
                <h3 className="font-orbitron text-xl font-bold text-white">
                  {t.symbiosisMinerTitle}
                </h3>
                <div className="text-xs font-mono text-neon-pink/80 mt-0.5">
                  Proof-of-Human-Touch (1/N)
                </div>
              </div>

              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                {t.symbiosisMinerDesc}
              </p>

              <div className="p-4 rounded-2xl bg-black/50 border border-white/5 space-y-2 text-xs font-mono text-gray-300">
                <div className="text-neon-pink font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-neon-pink" /> {t.minerDistTitle}:
                </div>
                <div>• {t.minerDistItem1}</div>
                <div>• {t.minerDistItem2}</div>
                <div>• {t.minerDistItem3}</div>
                <div>• {t.modalMinersShare}</div>
              </div>
            </div>

            <Link
              to="/mining"
              onClick={() => sound.playClick()}
              className="mt-4 inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-neon-pink/15 hover:bg-neon-pink/25 text-white border border-neon-pink/40 text-xs font-orbitron font-bold transition-all"
            >
              <span>{t.howItWorksTitle}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Engine B: The Guardian Node */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-neon-purple/30 space-y-5 relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-neon-purple/10 border border-neon-purple/30 text-neon-purple">
                  <Server className="w-7 h-7" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono bg-neon-purple/15 text-neon-purple border border-neon-purple/30 font-bold">
                  {t.symbiosisGuardianShare}
                </span>
              </div>

              <div>
                <h3 className="font-orbitron text-xl font-bold text-white">
                  {t.symbiosisGuardianTitle}
                </h3>
                <div className="text-xs font-mono text-neon-purple/80 mt-0.5">
                  24/7 Sled Ledger Engine
                </div>
              </div>

              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                {t.symbiosisGuardianDesc}
              </p>

              <div className="p-4 rounded-2xl bg-black/50 border border-white/5 space-y-2 text-xs font-mono text-gray-300">
                <div className="text-neon-purple font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-neon-purple" /> {t.guardianDistTitle}:
                </div>
                <div>• {t.guardianDistItem1}</div>
                <div>• {t.guardianDistItem2}</div>
                <div>• {t.guardianDistItem3}</div>
                <div>• {t.modalGuardiansShare}</div>
              </div>
            </div>

            <Link
              to="/guardians"
              onClick={() => sound.playClick()}
              className="mt-4 inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-neon-purple/15 hover:bg-neon-purple/25 text-white border border-neon-purple/40 text-xs font-orbitron font-bold transition-all"
            >
              <span>{t.registerGuardianTitle}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE CONSENSUS SIMULATOR */}
      <section className="glass-panel rounded-3xl p-6 sm:p-10 border border-white/10 space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-gold/10 border border-neon-gold/30 text-neon-gold text-xs font-mono">
            <Calculator className="w-3.5 h-3.5" />
            <span className="uppercase">Interactive Demo</span>
          </div>
          <h2 className="font-orbitron text-xl sm:text-3xl font-extrabold text-white">
            {t.calcTitle}
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm max-w-2xl">
            {t.calcSubtitle}
          </p>
        </div>

        {/* Device Selector Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
          <button
            onClick={() => {
              setSelectedDevice('esp32');
              sound.playClick();
            }}
            className={`p-4 rounded-2xl border text-left transition-all ${
              selectedDevice === 'esp32'
                ? 'bg-neon-cyan/15 border-neon-cyan text-white shadow-glow-cyan'
                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/20'
            }`}
          >
            <div className="text-[10px] text-neon-cyan font-bold">DEVICE A</div>
            <div className="font-orbitron text-sm font-bold text-white mt-1">{t.calcDeviceEsp32}</div>
            <div className="text-[11px] text-gray-400 mt-0.5">0.8W</div>
          </button>

          <button
            onClick={() => {
              setSelectedDevice('laptop');
              sound.playClick();
            }}
            className={`p-4 rounded-2xl border text-left transition-all ${
              selectedDevice === 'laptop'
                ? 'bg-neon-purple/15 border-neon-purple text-white shadow-glow-purple'
                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/20'
            }`}
          >
            <div className="text-[10px] text-neon-purple font-bold">DEVICE B</div>
            <div className="font-orbitron text-sm font-bold text-white mt-1">{t.calcDeviceLaptop}</div>
            <div className="text-[11px] text-gray-400 mt-0.5">25W</div>
          </button>

          <button
            onClick={() => {
              setSelectedDevice('monster');
              sound.playClick();
            }}
            className={`p-4 rounded-2xl border text-left transition-all ${
              selectedDevice === 'monster'
                ? 'bg-neon-pink/15 border-neon-pink text-white shadow-glow-pink'
                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/20'
            }`}
          >
            <div className="text-[10px] text-neon-pink font-bold">DEVICE C</div>
            <div className="font-orbitron text-sm font-bold text-white mt-1">{t.calcDeviceMonster}</div>
            <div className="text-[11px] text-gray-400 mt-0.5">1400W</div>
          </button>
        </div>

        {/* Dynamic Simulator Results Display */}
        <div className="p-5 sm:p-7 rounded-2xl bg-black/60 border border-white/10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <span className="text-xs text-gray-400 font-mono">{t.calcSelectDevice}:</span>
              <div className="font-orbitron text-lg font-extrabold text-white">{currentDev.name}</div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${currentDev.badgeColor}`}>
              {t.calcEqualityBadge}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
            <div>
              <span className="text-gray-500">Hardware:</span>
              <div className="text-base font-bold text-white mt-0.5">{currentDev.cost}</div>
            </div>
            <div>
              <span className="text-gray-500">Power:</span>
              <div className="text-base font-bold text-white mt-0.5">{currentDev.power}</div>
            </div>
            <div>
              <span className="text-gray-500">Hashrate:</span>
              <div className="text-base font-bold text-gray-300 mt-0.5">{currentDev.hashrate}</div>
            </div>
            <div>
              <span className="text-gray-500">{t.calcEqualityBadge}:</span>
              <div className="text-base font-bold text-neon-green mt-0.5">{currentDev.advantageFactor}</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-neon-cyan/5 border border-neon-cyan/20 text-xs sm:text-sm text-gray-200 leading-relaxed">
            <strong className="text-neon-cyan font-orbitron">{t.calcEqualityBadge}: </strong> 
            {currentDev.verdict}
          </div>
        </div>
      </section>

      {/* 5. REVOLUTIONARY COMPARISON TABLE */}
      <section className="space-y-6">
        <div className="text-center max-w-3xl mx-auto space-y-2 px-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neon-green/10 border border-neon-green/30 text-neon-green text-xs font-mono">
            <Activity className="w-3.5 h-3.5" />
            <span>{t.compTechBadge}</span>
          </div>
          <h2 className="font-orbitron text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white">
            {t.compTechTitle}
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm">
            {t.compTechSubtitle}
          </p>
        </div>

        {/* Responsive Table for Desktop, Cards for Mobile */}
        <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden">
          <div className="responsive-table-container">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-gray-300 text-[11px] uppercase tracking-wider">
                  <th className="p-4 sm:p-5">{t.compThCriterion}</th>
                  <th className="p-4 sm:p-5 text-gray-400">{t.compThTrad}</th>
                  <th className="p-4 sm:p-5 text-neon-cyan bg-neon-cyan/5 font-extrabold">{t.compThBic}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300">
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="p-4 sm:p-5 font-bold text-white">{t.compRow1Title}</td>
                  <td className="p-4 sm:p-5 text-red-400">{t.compRow1Trad}</td>
                  <td className="p-4 sm:p-5 text-neon-green bg-neon-cyan/5 font-bold">{t.compRow1Bic}</td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="p-4 sm:p-5 font-bold text-white">{t.compRow2Title}</td>
                  <td className="p-4 sm:p-5 text-red-400">{t.compRow2Trad}</td>
                  <td className="p-4 sm:p-5 text-neon-green bg-neon-cyan/5 font-bold">{t.compRow2Bic}</td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="p-4 sm:p-5 font-bold text-white">{t.compRow3Title}</td>
                  <td className="p-4 sm:p-5 text-yellow-400">{t.compRow3Trad}</td>
                  <td className="p-4 sm:p-5 text-neon-cyan bg-neon-cyan/5 font-bold">{t.compRow3Bic}</td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="p-4 sm:p-5 font-bold text-white">{t.compRow4Title}</td>
                  <td className="p-4 sm:p-5 text-gray-400">{t.compRow4Trad}</td>
                  <td className="p-4 sm:p-5 text-neon-purple bg-neon-cyan/5 font-bold">{t.compRow4Bic}</td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="p-4 sm:p-5 font-bold text-white">{t.compRow5Title}</td>
                  <td className="p-4 sm:p-5 text-red-400">{t.compRow5Trad}</td>
                  <td className="p-4 sm:p-5 text-neon-green bg-neon-cyan/5 font-bold">{t.compRow5Bic}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 6. SOVEREIGNTY MANIFESTO */}
      <section className="relative overflow-hidden rounded-3xl glass-panel p-6 sm:p-12 border border-neon-pink/30 space-y-6">
        <div className="absolute right-0 bottom-0 w-80 h-80 bg-neon-pink/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-pink/10 border border-neon-pink/30 text-neon-pink text-xs font-mono">
            <EyeOff className="w-3.5 h-3.5 text-neon-pink" />
            <span>{t.manifestoBadge}</span>
          </div>

          <h2 className="font-orbitron text-2xl sm:text-4xl font-extrabold text-white leading-tight">
            {t.manifestoTitle}
          </h2>

          <p className="text-gray-300 text-xs sm:text-base leading-relaxed">
            {t.manifestoP1}
          </p>

          <p className="text-gray-300 text-xs sm:text-base leading-relaxed">
            {t.manifestoP2}
          </p>

          <div className="pt-2 flex flex-wrap gap-4">
            <Link
              to="/wallet"
              onClick={() => sound.playClick()}
              className="px-6 py-3 rounded-xl bg-neon-pink text-white font-orbitron text-xs font-bold hover:bg-neon-pink/90 transition-all shadow-glow-pink flex items-center gap-2"
            >
              <Wallet className="w-4 h-4" />
              <span>CREAR BILLETERA PRIVADA</span>
            </Link>

            <Link
              to="/impact"
              onClick={() => sound.playClick()}
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-mono text-xs transition-all border border-white/20 flex items-center gap-2"
            >
              <span>Leer análisis geopolítico</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
