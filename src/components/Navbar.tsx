import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { 
  Shield, 
  Cpu, 
  Wallet, 
  Package, 
  BarChart3, 
  Globe, 
  Volume2, 
  VolumeX, 
  Flame, 
  Radio, 
  Home, 
  Sparkles, 
  Menu, 
  X, 
  ChevronRight, 
  ChevronDown,
  Check,
  Activity,
  Terminal,
  ArrowRight,
  Compass,
  Command
} from 'lucide-react';
import { 
  Language, 
  translations, 
  SUPPORTED_LANGUAGES, 
  getLanguageMeta 
} from '../i18n/translations';
import { NetworkInfo, MiningStats } from '../types/bic';
import { sound } from '../utils/audio';

interface NavbarProps {
  lang: Language;
  onChangeLang: (newLang: Language) => void;
  networkInfo: NetworkInfo | null;
  miningStats?: MiningStats | null;
  isAudioMuted: boolean;
  onToggleAudio: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  onChangeLang,
  networkInfo,
  miningStats,
  isAudioMuted,
  onToggleAudio,
}) => {
  const t = translations[lang];
  const [isMenuMounted, setIsMenuMounted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Close language dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsLangDropdownOpen(false);
      }
    };
    if (isLangDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLangDropdownOpen]);

  const protocolLinks = [
    { 
      to: '/', 
      label: t.tabHome, 
      icon: Home, 
      desc: t.menuCoreDesc,
      badge: 'L1 CORE',
      color: 'cyan'
    },
    { 
      to: '/explorer', 
      label: t.tabExplorer, 
      icon: Globe, 
      desc: t.menuExplorerDesc,
      badge: 'LEDGER',
      color: 'purple'
    },
    { 
      to: '/mining', 
      label: t.tabMining, 
      icon: Cpu, 
      desc: t.menuMiningDesc,
      badge: '93.34%',
      color: 'pink'
    },
    { 
      to: '/guardians', 
      label: t.tabGuardians, 
      icon: Shield, 
      desc: t.menuGuardiansDesc,
      badge: '6.66% + FEES',
      color: 'green'
    },
  ];

  const toolsLinks = [
    { 
      to: '/wallet', 
      label: t.tabWallet, 
      icon: Wallet, 
      desc: t.menuWalletDesc,
      badge: 'PRIVACY',
      color: 'pink'
    },
    { 
      to: '/downloads', 
      label: t.tabDownloads, 
      icon: Package, 
      desc: t.menuDownloadsDesc,
      badge: 'BIN',
      color: 'cyan'
    },
    { 
      to: '/tokenomics', 
      label: t.tabTokenomics, 
      icon: BarChart3, 
      desc: t.menuTokenomicsDesc,
      badge: '666M CAP',
      color: 'gold'
    },
    { 
      to: '/impact', 
      label: t.tabImpact, 
      icon: Sparkles, 
      desc: t.menuImpactDesc,
      badge: 'MANIFESTO',
      color: 'purple'
    },
  ];

  // Open with cinematic animation and sound
  const handleOpenMenu = useCallback(() => {
    sound.playMenuOpen();
    setIsClosing(false);
    setIsMenuMounted(true);
  }, []);

  // Close smoothly with exit animation
  const handleCloseMenu = useCallback((afterClose?: () => void) => {
    sound.playMenuClose();
    setIsClosing(true);
    setTimeout(() => {
      setIsMenuMounted(false);
      setIsClosing(false);
      if (afterClose) afterClose();
    }, 220);
  }, []);

  // Lock body scroll when menu is active
  useEffect(() => {
    if (isMenuMounted) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuMounted]);

  // Keyboard shortcut: Escape to close, 'm' or 'M' to toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea') return;

      if (e.key === 'Escape') {
        if (isLangDropdownOpen) {
          setIsLangDropdownOpen(false);
        } else if (isMenuMounted && !isClosing) {
          handleCloseMenu();
        }
      } else if ((e.key === 'm' || e.key === 'M') && !e.ctrlKey && !e.metaKey && !e.altKey) {
        if (isMenuMounted && !isClosing) {
          handleCloseMenu();
        } else if (!isMenuMounted) {
          handleOpenMenu();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuMounted, isClosing, isLangDropdownOpen, handleCloseMenu, handleOpenMenu]);

  const handleNavClick = () => {
    sound.playClick();
    handleCloseMenu();
  };

  const getBadgeColor = (color: string) => {
    switch (color) {
      case 'cyan': return 'border-neon-cyan/40 bg-neon-cyan/10 text-neon-cyan';
      case 'purple': return 'border-neon-purple/40 bg-neon-purple/10 text-neon-purple';
      case 'pink': return 'border-neon-pink/40 bg-neon-pink/10 text-neon-pink';
      case 'green': return 'border-neon-green/40 bg-neon-green/10 text-neon-green';
      case 'gold': return 'border-neon-gold/40 bg-neon-gold/10 text-neon-gold';
      default: return 'border-white/20 bg-white/5 text-gray-300';
    }
  };

  const currentLangMeta = getLanguageMeta(lang);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-2xl bg-[#020306]/85 border-b border-white/10 shadow-2xl transition-all">
      {/* Top Telemetry & Controls Mini-Bar */}
      <div className="border-b border-white/5 bg-black/40 px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Real-Time Telemetry Badges */}
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-0.5 text-[11px]">
            <span className="flex items-center gap-1.5 text-neon-green font-mono font-bold tracking-wider shrink-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-green"></span>
              </span>
              <span className="hidden xs:inline">{t.networkOnline}</span>
              <span className="xs:hidden">L1 LIVE</span>
            </span>

            <span className="text-gray-600 font-mono">|</span>

            <span className="text-gray-300 font-mono">
              <span className="text-gray-500">Alt:</span> <strong className="text-neon-cyan font-bold">#{networkInfo?.height ?? '...'}</strong>
            </span>

            <span className="text-gray-600 font-mono hidden sm:inline">|</span>

            <span className="text-gray-400 font-mono hidden sm:inline">
              <span className="text-gray-500">{t.activeGuardians}:</span> <strong className="text-neon-purple">{networkInfo?.active_guardians_count ?? 1}</strong>
            </span>

            <span className="text-gray-600 font-mono hidden md:inline">|</span>

            <span className="text-gray-400 font-mono hidden md:inline">
              <span className="text-gray-500">{t.mempoolPending}:</span> <strong className="text-neon-pink">{networkInfo?.mempool_pending ?? 0} tx</strong>
            </span>
          </div>

          {/* Audio and Multi-Language Dropdown Switchers */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Audio Mute/Unmute */}
            <button
              onClick={() => {
                onToggleAudio();
                sound.playClick();
              }}
              title={isAudioMuted ? t.audioOff : t.audioOn}
              className="flex items-center gap-1 text-gray-400 hover:text-neon-cyan transition-colors px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 hover:border-neon-cyan/40 cursor-pointer"
            >
              {isAudioMuted ? <VolumeX className="w-3.5 h-3.5 text-gray-500" /> : <Volume2 className="w-3.5 h-3.5 text-neon-cyan animate-pulse" />}
              <span className="font-mono uppercase text-[10px] hidden xs:inline">{isAudioMuted ? 'MUTE' : 'AUDIO'}</span>
            </button>

            {/* Interactive Multi-Language Dropdown Selector */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => {
                  setIsLangDropdownOpen(!isLangDropdownOpen);
                  sound.playClick();
                }}
                className="flex items-center gap-1.5 font-mono text-[11px] px-2.5 py-0.5 rounded-lg bg-white/5 hover:bg-neon-purple/20 text-gray-200 hover:text-white border border-white/10 hover:border-neon-purple/50 transition-all font-semibold cursor-pointer"
                title={t.menuLangSelector}
              >
                <span>{currentLangMeta.flag}</span>
                <span>{lang.toUpperCase()}</span>
                <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${isLangDropdownOpen ? 'rotate-180 text-neon-cyan' : ''}`} />
              </button>

              {/* Dropdown Menu with all 10 languages */}
              {isLangDropdownOpen && (
                <div className="absolute right-0 mt-2 z-50 w-52 rounded-xl bg-[#070b14]/98 border border-white/15 p-1.5 shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150 space-y-0.5 max-h-80 overflow-y-auto font-mono text-xs">
                  <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400 border-b border-white/5 mb-1 flex items-center justify-between">
                    <span>{t.menuLangSelector}</span>
                    <span className="text-neon-purple">10 IDIOMAS</span>
                  </div>

                  {SUPPORTED_LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        onChangeLang(l.code);
                        setIsLangDropdownOpen(false);
                        sound.playClick();
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-all ${
                        lang === l.code
                          ? 'bg-neon-purple/25 text-white font-bold border border-neon-purple/50'
                          : 'text-gray-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{l.flag}</span>
                        <span className="truncate">{l.nativeName}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-gray-400 uppercase font-mono">{l.code}</span>
                        {lang === l.code && <Check className="w-3.5 h-3.5 text-neon-green" />}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar - Universal on All Screens */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <Link 
          to="/"
          onClick={() => {
            sound.playClick();
            if (isMenuMounted) handleCloseMenu();
          }}
          className="flex items-center gap-3 group shrink-0"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-full transition-all group-hover:scale-110 group-hover:rotate-6">
            <img 
              src="/black_ink_coin.png" 
              alt="Black Ink Coin" 
              className="w-10 h-10 object-contain drop-shadow-[0_0_12px_rgba(0,240,255,0.5)]" 
            />
          </div>
          <div>
            <div className="font-orbitron font-extrabold text-base sm:text-lg tracking-wider bg-gradient-to-r from-neon-cyan via-white to-neon-pink bg-clip-text text-transparent">
              {t.brandTitle}
            </div>
            <div className="text-[9px] font-mono tracking-widest text-neon-purple/90 uppercase font-semibold">
              {t.brandSubtitle}
            </div>
          </div>
        </Link>

        {/* Quick Route Shortcuts for Desktop (>= 1024px) */}
        <div className="hidden lg:flex items-center gap-2">
          <NavLink
            to="/explorer"
            onClick={() => sound.playClick()}
            className={({ isActive }) => `flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-all border ${
              isActive ? 'bg-neon-cyan/20 border-neon-cyan text-white shadow-glow-cyan font-semibold' : 'text-gray-300 border-white/10 hover:border-neon-cyan/40 hover:bg-white/5'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-neon-cyan" />
            <span>{t.tabExplorer}</span>
          </NavLink>

          <NavLink
            to="/mining"
            onClick={() => sound.playClick()}
            className={({ isActive }) => `flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-all border ${
              isActive ? 'bg-neon-pink/20 border-neon-pink text-white shadow-glow-pink font-semibold' : 'text-gray-300 border-white/10 hover:border-neon-pink/40 hover:bg-white/5'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-neon-pink" />
            <span>{t.tabMining}</span>
          </NavLink>

          <NavLink
            to="/guardians"
            onClick={() => sound.playClick()}
            className={({ isActive }) => `flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-all border ${
              isActive ? 'bg-neon-green/20 border-neon-green text-white shadow-glow-green font-semibold' : 'text-gray-300 border-white/10 hover:border-neon-green/40 hover:bg-white/5'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-neon-green" />
            <span>{t.tabGuardians}</span>
          </NavLink>

          <NavLink
            to="/wallet"
            onClick={() => sound.playClick()}
            className={({ isActive }) => `flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-all border ${
              isActive ? 'bg-neon-purple/20 border-neon-purple text-white shadow-glow-purple font-semibold' : 'text-gray-300 border-white/10 hover:border-neon-purple/40 hover:bg-white/5'
            }`}
          >
            <Wallet className="w-3.5 h-3.5 text-neon-purple" />
            <span>{t.tabWallet}</span>
          </NavLink>
        </div>

        {/* Grand Universal Command Center Menu Trigger */}
        <div className="flex items-center gap-2">
          <button
            onClick={isMenuMounted ? () => handleCloseMenu() : handleOpenMenu}
            aria-label="Menu"
            className="flex items-center gap-2.5 sm:gap-3 px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-neon-cyan/20 via-neon-purple/20 to-neon-pink/20 border border-neon-cyan/60 hover:border-neon-cyan text-white shadow-glow-cyan transition-all hover:scale-105 active:scale-95 group cursor-pointer"
          >
            <div className="relative">
              <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-neon-cyan group-hover:rotate-90 transition-transform duration-300" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-neon-pink animate-ping" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-neon-pink" />
            </div>

            <div className="text-left">
              <div className="font-orbitron text-xs sm:text-sm font-extrabold tracking-wider bg-gradient-to-r from-white to-neon-cyan bg-clip-text text-transparent uppercase">
                MENU
              </div>
              <div className="text-[9px] font-mono text-neon-cyan/80 tracking-widest hidden sm:block">
                8 ROUTES
              </div>
            </div>

            <div className="hidden md:flex items-center gap-1 pl-1 border-l border-white/15 text-[10px] font-mono text-gray-400">
              <kbd className="px-1.5 py-0.5 rounded bg-black/50 border border-white/20 text-neon-cyan font-bold">M</kbd>
            </div>
          </button>
        </div>
      </div>

      {/* Cinematic Full-Screen Portal Command Center Navigation Menu */}
      {isMenuMounted && createPortal(
        <div 
          className={`fixed inset-0 z-[9999] w-screen h-screen flex flex-col bg-[#020306]/95 text-gray-100 overflow-y-auto ${
            isClosing ? 'animate-menu-backdrop-out' : 'animate-menu-backdrop-in'
          }`}
          role="dialog"
          aria-modal="true"
        >
          {/* Animated Neon Light Sweep at Top Edge */}
          <div className="animate-neon-sweep pointer-events-none" />

          {/* Cyber Ambient Floating Orbs */}
          <div className="absolute top-10 left-1/4 w-[420px] h-[420px] bg-neon-cyan/12 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-10 right-1/4 w-[420px] h-[420px] bg-neon-pink/12 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-purple/10 rounded-full blur-[120px] pointer-events-none" />

          {/* Animated Main Content Panel */}
          <div className={`relative z-10 flex-1 flex flex-col justify-between ${
            isClosing ? 'animate-menu-panel-out' : 'animate-menu-panel-in'
          }`}>
            {/* Sticky Command Header */}
            <div className="sticky top-0 z-20 w-full border-b border-white/10 bg-[#04060a]/90 backdrop-blur-2xl px-4 sm:px-8 py-4 shadow-xl">
              <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                {/* Brand Title */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-cyan/20 to-neon-pink/20 border border-neon-cyan/50 flex items-center justify-center shadow-glow-cyan">
                    <Flame className="w-5 h-5 text-neon-pink animate-pulse" />
                  </div>
                  <div>
                    <div className="font-orbitron font-extrabold text-base sm:text-lg tracking-wider bg-gradient-to-r from-neon-cyan via-white to-neon-pink bg-clip-text text-transparent">
                      {t.brandTitle}
                    </div>
                    <div className="text-[10px] font-mono text-neon-cyan/90 tracking-widest flex items-center gap-1.5 font-semibold">
                      <Command className="w-3 h-3 text-neon-cyan" />
                      <span>{t.menuCommandCenter}</span>
                    </div>
                  </div>
                </div>

                {/* Status Pill & Big Animated Close Button */}
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 font-mono text-xs">
                    <span className="w-2 h-2 rounded-full bg-neon-green animate-ping" />
                    <span className="text-gray-400">Mainnet L1:</span>
                    <strong className="text-neon-cyan font-bold">#{networkInfo?.height ?? 0}</strong>
                  </div>

                  <button
                    onClick={() => handleCloseMenu()}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-neon-pink/25 text-gray-200 hover:text-white border border-white/20 hover:border-neon-pink transition-all shadow-glow-pink cursor-pointer group"
                    title={t.menuCloseTitle}
                  >
                    <span className="font-orbitron text-xs font-bold hidden sm:inline">{t.menuClose}</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-black/40 border border-white/20 text-[10px] font-mono text-gray-300 group-hover:text-neon-pink">ESC</kbd>
                    <X className="w-5 h-5 text-neon-pink transition-transform group-hover:rotate-90 duration-300" />
                  </button>
                </div>
              </div>
            </div>

            {/* Menu Main Body Grid */}
            <div className="max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 sm:py-10 space-y-8 flex-1">
              {/* Header Headline */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-neon-cyan font-semibold mb-2">
                    <Compass className="w-4 h-4 text-neon-cyan animate-pulse" />
                    <span>{t.menuHeadingTag}</span>
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-orbitron font-extrabold text-white">
                    {t.menuHeadingTitle} <span className="bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink bg-clip-text text-transparent">666</span>
                  </h2>
                </div>

                <p className="text-xs sm:text-sm text-gray-400 max-w-md font-mono">
                  {t.menuHeadingDesc}
                </p>
              </div>

              {/* 3 Columns Grid with Staggered Entrance */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Column 1: Core Protocol (Stagger 1) */}
                <div className="space-y-3 animate-stagger-1">
                  <div className="flex items-center justify-between px-2 text-xs font-mono uppercase tracking-wider text-neon-cyan font-bold">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-4 h-4" />
                      <span>{t.menuCol1Title}</span>
                    </div>
                    <span className="text-[10px] text-gray-500">{t.menuCol1Count}</span>
                  </div>

                  <div className="space-y-2.5">
                    {protocolLinks.map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.to;
                      return (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={handleNavClick}
                          className={`group block p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
                            isActive
                              ? 'bg-gradient-to-r from-neon-cyan/15 to-transparent border-neon-cyan shadow-glow-cyan'
                              : 'bg-white/[0.03] hover:bg-white/[0.08] border-white/10 hover:border-neon-cyan/60'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-start gap-3.5">
                              <div className={`p-2.5 rounded-xl border shrink-0 transition-transform group-hover:scale-110 duration-300 ${
                                isActive ? 'bg-neon-cyan/20 border-neon-cyan text-neon-cyan' : 'bg-black/50 border-white/10 text-gray-300 group-hover:text-neon-cyan'
                              }`}>
                                <Icon className="w-5 h-5" />
                              </div>
                              <div>
                                <div className="font-orbitron text-sm font-bold text-white group-hover:text-neon-cyan transition-colors flex items-center gap-2">
                                  <span>{item.label}</span>
                                  <span className={`px-2 py-0.5 rounded-md text-[9px] font-mono border font-bold ${getBadgeColor(item.color)}`}>
                                    {item.badge}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                                  {item.desc}
                                </p>
                              </div>
                            </div>
                            <ChevronRight className={`w-4 h-4 shrink-0 transition-transform group-hover:translate-x-1.5 ${isActive ? 'text-neon-cyan' : 'text-gray-500'}`} />
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Column 2: Ecosystem & Tools (Stagger 2) */}
                <div className="space-y-3 animate-stagger-2">
                  <div className="flex items-center justify-between px-2 text-xs font-mono uppercase tracking-wider text-neon-pink font-bold">
                    <div className="flex items-center gap-2">
                      <Wallet className="w-4 h-4" />
                      <span>{t.menuCol2Title}</span>
                    </div>
                    <span className="text-[10px] text-gray-500">{t.menuCol1Count}</span>
                  </div>

                  <div className="space-y-2.5">
                    {toolsLinks.map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.to;
                      return (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={handleNavClick}
                          className={`group block p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
                            isActive
                              ? 'bg-gradient-to-r from-neon-pink/15 to-transparent border-neon-pink shadow-glow-pink'
                              : 'bg-white/[0.03] hover:bg-white/[0.08] border-white/10 hover:border-neon-pink/60'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-start gap-3.5">
                              <div className={`p-2.5 rounded-xl border shrink-0 transition-transform group-hover:scale-110 duration-300 ${
                                isActive ? 'bg-neon-pink/20 border-neon-pink text-neon-pink' : 'bg-black/50 border-white/10 text-gray-300 group-hover:text-neon-pink'
                              }`}>
                                <Icon className="w-5 h-5" />
                              </div>
                              <div>
                                <div className="font-orbitron text-sm font-bold text-white group-hover:text-neon-pink transition-colors flex items-center gap-2">
                                  <span>{item.label}</span>
                                  <span className={`px-2 py-0.5 rounded-md text-[9px] font-mono border font-bold ${getBadgeColor(item.color)}`}>
                                    {item.badge}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                                  {item.desc}
                                </p>
                              </div>
                            </div>
                            <ChevronRight className={`w-4 h-4 shrink-0 transition-transform group-hover:translate-x-1.5 ${isActive ? 'text-neon-pink' : 'text-gray-500'}`} />
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Column 3: Live Telemetry & Fast Direct Actions & Multi-Language Selector */}
                <div className="space-y-4 animate-stagger-3">
                  <div className="flex items-center justify-between px-2 text-xs font-mono uppercase tracking-wider text-neon-purple font-bold">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      <span>{t.menuCol3Title}</span>
                    </div>
                    <span className="text-neon-green flex items-center gap-1 text-[10px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" /> P2P LIVE
                    </span>
                  </div>

                  {/* Network Live Metrics Card */}
                  <div className="p-5 rounded-2xl bg-black/60 border border-white/10 space-y-3 font-mono shadow-card-glow">
                    <div className="flex items-center justify-between text-xs pb-3 border-b border-white/5">
                      <span className="text-gray-400">STATUS:</span>
                      <span className="text-neon-green flex items-center gap-1.5 font-bold">
                        <span className="w-2 h-2 rounded-full bg-neon-green animate-ping" />
                        MAINNET L1
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                        <div className="text-[10px] text-gray-500 uppercase">{t.blockHeight}</div>
                        <div className="text-base font-orbitron font-bold text-neon-cyan mt-0.5">
                          #{networkInfo?.height ?? 0}
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                        <div className="text-[10px] text-gray-500 uppercase">{t.activeGuardians}</div>
                        <div className="text-base font-orbitron font-bold text-neon-purple mt-0.5">
                          {networkInfo?.active_guardians_count ?? 1}
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                        <div className="text-[10px] text-gray-500 uppercase">{t.activeMiners}</div>
                        <div className="text-base font-orbitron font-bold text-neon-pink mt-0.5">
                          {miningStats?.active_collaborative_miners ?? 0}
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                        <div className="text-[10px] text-gray-500 uppercase">{t.mempoolPending}</div>
                        <div className="text-base font-orbitron font-bold text-neon-gold mt-0.5">
                          {networkInfo?.mempool_pending ?? 0} tx
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 text-[11px] text-gray-400 flex items-center justify-between border-t border-white/5">
                      <span>L1 Privacy:</span>
                      <span className="text-gray-200">RingCT + Stealth Addresses</span>
                    </div>
                  </div>

                  {/* Fast Action Buttons */}
                  <div className="space-y-2.5">
                    <Link
                      to="/wallet"
                      onClick={handleNavClick}
                      className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-neon-pink to-neon-purple text-white font-orbitron text-xs font-bold hover:brightness-110 transition-all shadow-glow-pink flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Wallet className="w-4 h-4" />
                      <span>{t.menuQuickActionWallet}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <Link
                      to="/downloads"
                      onClick={handleNavClick}
                      className="w-full py-3.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-mono text-xs font-semibold border border-white/15 hover:border-neon-cyan transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Package className="w-4 h-4 text-neon-cyan" />
                      <span>{t.menuQuickActionDownloads}</span>
                    </Link>
                  </div>

                  {/* 10-Language Grid inside Menu */}
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5">
                    <div className="flex items-center justify-between text-[11px] font-mono text-gray-400 uppercase tracking-wider">
                      <span className="flex items-center gap-1.5 text-neon-purple font-bold">
                        <Radio className="w-3.5 h-3.5" />
                        {t.menuLangSelector}
                      </span>
                      <span className="text-[10px] text-gray-500">10 GLOBAL</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                      {SUPPORTED_LANGUAGES.map((l) => (
                        <button
                          key={l.code}
                          onClick={() => {
                            onChangeLang(l.code);
                            sound.playClick();
                          }}
                          className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
                            lang === l.code
                              ? 'bg-gradient-to-r from-neon-purple/30 to-neon-pink/30 border-neon-purple text-white font-bold shadow-glow-purple scale-[1.02]'
                              : 'bg-white/5 border-white/10 text-gray-300 hover:text-white hover:bg-white/10 hover:border-white/25'
                          }`}
                        >
                          <span className="flex items-center gap-1.5 truncate">
                            <span>{l.flag}</span>
                            <span className="truncate">{l.nativeName}</span>
                          </span>
                          <span className="text-[9px] uppercase text-gray-400 font-bold ml-1">{l.code}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Audio Quick Switcher */}
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                    <span className="text-xs font-mono text-gray-400">AUDIO SYNTH:</span>
                    <button
                      onClick={() => {
                        onToggleAudio();
                        sound.playClick();
                      }}
                      className="py-1.5 px-4 rounded-lg bg-white/5 hover:bg-neon-cyan/20 text-gray-200 font-mono text-xs font-semibold border border-white/10 flex items-center gap-2 transition-all cursor-pointer"
                    >
                      {isAudioMuted ? <VolumeX className="w-3.5 h-3.5 text-gray-500" /> : <Volume2 className="w-3.5 h-3.5 text-neon-cyan" />}
                      <span>{isAudioMuted ? 'MUTE (OFF)' : 'AUDIO (ON)'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Footer Notice */}
            <div className="border-t border-white/10 bg-[#020306]/80 px-4 sm:px-8 py-3 text-center text-xs font-mono text-gray-500">
              Black Ink Coin Core Protocol &bull; 666 Sovereign Privacy Consensus &bull; Zero-Knowledge L1
            </div>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
};
