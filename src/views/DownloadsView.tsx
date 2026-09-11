import React, { useState } from 'react';
import { 
  Package, 
  Download, 
  ShieldCheck, 
  Cpu, 
  Terminal, 
  Key, 
  Copy, 
  Check, 
  Monitor, 
  Apple, 
  Laptop, 
  Microchip,
  ExternalLink
} from 'lucide-react';
import { Language, translations } from '../i18n/translations';
import { sound } from '../utils/audio';
import { copyToClipboard } from '../utils/clipboard';

interface DownloadsViewProps {
  lang: Language;
}

type OperatingSystem = 'windows' | 'linux' | 'macos' | 'esp32';

export const DownloadsView: React.FC<DownloadsViewProps> = ({ lang }) => {
  const t = translations[lang];

  const [activeOS, setActiveOS] = useState<OperatingSystem>('windows');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyCmd = async (id: string, text: string) => {
    await copyToClipboard(text);
    setCopiedId(id);
    sound.playClick();
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getPackageIcon = (id: string) => {
    if (id.includes('miner')) return Terminal;
    if (id.includes('guardian')) return ShieldCheck;
    if (id.includes('wallet')) return Key;
    if (id.includes('firmware')) return Cpu;
    return ExternalLink;
  };

  const getPackageColor = (id: string) => {
    if (id.includes('miner')) return 'text-neon-pink';
    if (id.includes('guardian')) return 'text-neon-purple';
    if (id.includes('wallet')) return 'text-neon-green';
    if (id.includes('firmware')) return 'text-neon-cyan';
    return 'text-neon-gold';
  };

  const currentOSData = t.osPackages[activeOS];

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl glass-panel p-8 sm:p-12 border border-neon-gold/40 shadow-card-glow">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-neon-gold/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neon-gold/10 border border-neon-gold/30 text-neon-gold text-xs font-mono">
            <Package className="w-3.5 h-3.5" />
            <span>OFFICIAL MULTI-OS ECOSYSTEM BINARIES</span>
          </div>

          <h1 className="font-orbitron text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {t.downloadsHeroTitle}
          </h1>

          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            {t.downloadsHeroDesc}
          </p>
        </div>
      </div>

      {/* OS Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 border-b border-white/10 pb-4">
        {[
          { id: 'windows', label: t.osWindows, icon: Monitor, color: 'text-neon-cyan' },
          { id: 'linux', label: t.osLinux, icon: Laptop, color: 'text-neon-green' },
          { id: 'macos', label: t.osMac, icon: Apple, color: 'text-neon-purple' },
          { id: 'esp32', label: t.osEsp32, icon: Microchip, color: 'text-neon-gold' },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeOS === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveOS(tab.id as OperatingSystem);
                sound.playClick();
              }}
              className={`flex items-center justify-center sm:justify-start gap-2 px-4 py-3 rounded-2xl font-orbitron text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-white/15 text-white border border-white/40 shadow-card-glow'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? tab.color : 'opacity-70'}`} />
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* OS Title Banner */}
      <div className="flex items-center gap-3 text-white font-mono">
        <span className="text-xs uppercase tracking-widest text-gray-400">
          OS:
        </span>
        <strong className="text-sm sm:text-base font-orbitron text-neon-cyan">
          {currentOSData.name}
        </strong>
      </div>

      {/* Cards Grid for Selected OS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentOSData.packages.map((item) => {
          const Icon = getPackageIcon(item.id);
          const iconColor = getPackageColor(item.id);
          const isCopied = copiedId === item.id;
          return (
            <div
              key={item.id}
              className="glass-panel glass-panel-hover rounded-3xl p-7 border border-white/10 flex flex-col justify-between space-y-6"
            >
              {/* Card Header & Content */}
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 ${iconColor}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-orbitron text-base font-bold text-white leading-snug">
                        {item.title}
                      </h3>
                      <span className="text-[11px] font-mono text-gray-400">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-white/10 text-gray-300 border border-white/10 shrink-0">
                    {item.badge}
                  </span>
                </div>

                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                  {item.desc}
                </p>

                {/* Features List */}
                <div className="space-y-1.5 pt-3 border-t border-white/5">
                  {item.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-gray-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Box & Command */}
              <div className="space-y-3 pt-4 border-t border-white/5">
                {/* Command Snippet */}
                <div className="p-3 rounded-xl bg-black/60 border border-white/10 flex items-center justify-between gap-2 text-xs font-mono">
                  <div className="truncate text-gray-400">
                    <span className="text-neon-green">$</span> {item.cmd}
                  </div>
                  <button
                    onClick={() => copyCmd(item.id, item.cmd)}
                    className="text-gray-400 hover:text-white shrink-0 p-1 rounded hover:bg-white/10 transition-colors cursor-pointer"
                    title={t.quickStartCommand}
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-neon-green" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Direct Download Button */}
                <a
                  href={item.file}
                  download
                  onClick={() => sound.playClick()}
                  className="w-full py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-orbitron text-xs font-bold tracking-wider transition-all border border-white/20 hover:border-white/50 flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                >
                  <Download className="w-4 h-4 text-neon-gold" />
                  <span>{t.downloadBtn}</span>
                  <span className="text-gray-400 font-mono text-[10px]">({item.size})</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
