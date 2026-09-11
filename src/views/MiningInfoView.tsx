import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Cpu, 
  Fingerprint, 
  Clock, 
  Users, 
  Award, 
  Zap, 
  Terminal, 
  Download, 
  CheckCircle2, 
  ArrowRight,
  Radio,
  Layers,
  Activity,
  Sparkles
} from 'lucide-react';
import { Language, translations } from '../i18n/translations';
import { MiningStats, MiningJob } from '../types/bic';
import { sound } from '../utils/audio';

interface MiningInfoViewProps {
  lang: Language;
  miningStats: MiningStats | null;
  miningJob: MiningJob | null;
}

export const MiningInfoView: React.FC<MiningInfoViewProps> = ({
  lang,
  miningStats,
  miningJob,
}) => {
  const t = translations[lang];

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl glass-panel p-8 sm:p-12 border border-neon-pink/40 shadow-card-glow">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-neon-pink/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neon-pink/10 border border-neon-pink/30 text-neon-pink text-xs font-mono">
            <Fingerprint className="w-4 h-4 text-neon-pink animate-pulse" />
            <span>{t.miningHeroBadge}</span>
          </div>

          <h1 className="font-orbitron text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {t.miningHeroTitle}
          </h1>

          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            {t.miningHeroDesc}
          </p>
        </div>
      </div>

      {/* Live Mining Telemetry Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="glass-panel glass-panel-hover rounded-2xl p-5 border border-white/5 space-y-2">
          <div className="flex items-center justify-between text-gray-400 text-xs">
            <span>{t.currentRoundTime}</span>
            <Clock className="w-4 h-4 text-neon-cyan" />
          </div>
          <div className="font-orbitron text-2xl sm:text-3xl font-extrabold text-neon-cyan">
            {miningJob?.round_time_remaining_secs ?? 0}s
          </div>
          <div className="text-[11px] font-mono text-gray-400">
            {t.roundWindowLabel}: {miningStats?.round_duration_secs ?? 30}s
          </div>
        </div>

        <div className="glass-panel glass-panel-hover rounded-2xl p-5 border border-white/5 space-y-2">
          <div className="flex items-center justify-between text-gray-400 text-xs">
            <span>{t.roundDifficulty}</span>
            <Activity className="w-4 h-4 text-neon-pink" />
          </div>
          <div className="font-orbitron text-2xl sm:text-3xl font-extrabold text-neon-pink">
            {miningStats?.difficulty_bits ?? 16} <span className="text-xs font-sans">BITS</span>
          </div>
          <div className="text-[11px] font-mono text-gray-400">
            {t.targetBlockTime}: {miningStats?.target_block_time_secs ?? 60}s
          </div>
        </div>

        <div className="glass-panel glass-panel-hover rounded-2xl p-5 border border-white/5 space-y-2">
          <div className="flex items-center justify-between text-gray-400 text-xs">
            <span>{t.activeCollabMiners}</span>
            <Users className="w-4 h-4 text-neon-green" />
          </div>
          <div className="font-orbitron text-2xl sm:text-3xl font-extrabold text-neon-green">
            {miningStats?.active_collaborative_miners ?? 0}
          </div>
          <div className="text-[11px] font-mono text-gray-400">
            {t.workingOnBlock}
          </div>
        </div>

        <div className="glass-panel glass-panel-hover rounded-2xl p-5 border border-white/5 space-y-2">
          <div className="flex items-center justify-between text-gray-400 text-xs">
            <span>{t.emissionReward}</span>
            <Zap className="w-4 h-4 text-neon-gold" />
          </div>
          <div className="font-orbitron text-2xl sm:text-3xl font-extrabold text-white">
            {(miningStats?.next_block_reward_bic ?? 6.66).toFixed(4)} <span className="text-xs font-sans text-neon-gold">BIC</span>
          </div>
          <div className="text-[11px] font-mono text-neon-gold">
            {t.minersRatio}
          </div>
        </div>
      </div>

      {/* 4-Step Consensus Explanation */}
      <div className="glass-panel rounded-3xl p-8 sm:p-10 border border-white/10 space-y-8">
        <div className="max-w-2xl space-y-2">
          <h2 className="font-orbitron text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
            <Fingerprint className="w-6 h-6 text-neon-pink" />
            {t.howItWorksTitle}
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm">
            Un protocolo diseñado para que minar sea colaborativo y accesible, no una carrera armamentística de hardware caro.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-3">
            <div className="w-8 h-8 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan font-orbitron font-bold flex items-center justify-center text-sm">
              1
            </div>
            <h3 className="font-orbitron text-base font-bold text-white">{t.howStep1Title}</h3>
            <p className="text-xs text-gray-300 leading-relaxed">{t.howStep1Desc}</p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-3">
            <div className="w-8 h-8 rounded-xl bg-neon-pink/10 border border-neon-pink/30 text-neon-pink font-orbitron font-bold flex items-center justify-center text-sm">
              2
            </div>
            <h3 className="font-orbitron text-base font-bold text-white">{t.howStep2Title}</h3>
            <p className="text-xs text-gray-300 leading-relaxed">{t.howStep2Desc}</p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-3">
            <div className="w-8 h-8 rounded-xl bg-neon-purple/10 border border-neon-purple/30 text-neon-purple font-orbitron font-bold flex items-center justify-center text-sm">
              3
            </div>
            <h3 className="font-orbitron text-base font-bold text-white">{t.howStep3Title}</h3>
            <p className="text-xs text-gray-300 leading-relaxed">{t.howStep3Desc}</p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-3">
            <div className="w-8 h-8 rounded-xl bg-neon-green/10 border border-neon-green/30 text-neon-green font-orbitron font-bold flex items-center justify-center text-sm">
              4
            </div>
            <h3 className="font-orbitron text-base font-bold text-white">{t.howStep4Title}</h3>
            <p className="text-xs text-gray-300 leading-relaxed">{t.howStep4Desc}</p>
          </div>
        </div>
      </div>

      {/* Hardware Miners Guides */}
      <div className="space-y-6">
        <h2 className="font-orbitron text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <Terminal className="w-5 h-5 text-neon-cyan" />
          {t.gettingStartedTitle}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Desktop PC Miner */}
          <div className="glass-panel glass-panel-hover rounded-3xl p-8 border border-white/10 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-neon-pink/10 border border-neon-pink/30 text-neon-pink">
                    <Terminal className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-orbitron text-lg font-bold text-white">{t.desktopGuideTitle}</h3>
                    <span className="text-xs font-mono text-gray-400">Windows, Linux y macOS</span>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono bg-neon-pink/10 text-neon-pink border border-neon-pink/20">
                  Software
                </span>
              </div>

              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                {t.pcGuideSummary} Aprovecha todos los núcleos de tu procesador mediante subprocesos concurrentes y te avisa acústicamente cuando debes pulsar la barra espaciadora para inyectar entropía humana.
              </p>

              <div className="p-4 rounded-xl bg-black/50 border border-white/5 font-mono text-xs text-gray-300 space-y-1.5">
                <div className="text-neon-pink font-bold">Instrucciones de uso:</div>
                <div>1. Descarga el paquete de tu SO (Windows, Linux o Mac)</div>
                <div>2. Ejecuta el lanzador de 1 clic</div>
                <div>3. Introduce tu dirección <span className="text-neon-cyan">bic666_...</span></div>
                <div>4. Presiona espacio en consola al encontrar shares</div>
              </div>
            </div>

            <Link
              to="/downloads"
              onClick={() => sound.playClick()}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-neon-pink/20 hover:bg-neon-pink text-neon-pink hover:text-white font-orbitron text-xs font-bold tracking-wider border border-neon-pink/50 transition-all shadow-glow-pink"
            >
              <Download className="w-4 h-4" />
              Descargar Minero PC para tu Sistema
            </Link>
          </div>

          {/* ESP32 Hardware Miner */}
          <div className="glass-panel glass-panel-hover rounded-3xl p-8 border border-white/10 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan">
                    <Cpu className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-orbitron text-lg font-bold text-white">{t.esp32GuideTitle}</h3>
                    <span className="text-xs font-mono text-gray-400">Microcontroladores WiFi</span>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20">
                  Hardware
                </span>
              </div>

              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                {t.esp32GuideSummary} Dispositivo físico autónomo con sensor táctil capacitivo en el pin GPIO 32. Consume menos de 1 vatio y mina directamente conectado a tu WiFi sin necesitar un ordenador encendido.
              </p>

              <div className="p-4 rounded-xl bg-black/50 border border-white/5 font-mono text-xs text-gray-300 space-y-1.5">
                <div className="text-neon-cyan font-bold">Especificaciones técnicas:</div>
                <div>• Chip: ESP32 Dual Core 240MHz Xtensa LX6</div>
                <div>• Pin sensor táctil: GPIO 32 (touchRead)</div>
                <div>• Pantalla soportada: ST7789 TFT o SSD1306 OLED</div>
                <div>• Protocolo: HTTP REST client nativo</div>
              </div>
            </div>

            <Link
              to="/downloads"
              onClick={() => sound.playClick()}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-neon-cyan/20 hover:bg-neon-cyan text-neon-cyan hover:text-black font-orbitron text-xs font-bold tracking-wider border border-neon-cyan/50 transition-all shadow-glow-cyan"
            >
              <Download className="w-4 h-4" />
              Descargar Firmware ESP32 (.ino)
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
