import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { CyberCanvas } from './components/CyberCanvas';
import { Navbar } from './components/Navbar';
import { BlockModal } from './components/BlockModal';
import { HomeView } from './views/HomeView';
import { ImpactView } from './views/ImpactView';
import { MiningInfoView } from './views/MiningInfoView';
import { DownloadsView } from './views/DownloadsView';
import { ExplorerTab } from './components/tabs/ExplorerTab';
import { GuardiansTab } from './components/tabs/GuardiansTab';
import { WalletTab } from './components/tabs/WalletTab';
import { TokenomicsTab } from './components/tabs/TokenomicsTab';
import { Language } from './i18n/translations';
import { NetworkInfo, MiningStats, MiningJob, RecentBlock } from './types/bic';
import { bicRpc } from './services/bicRpc';
import { sound } from './utils/audio';

export const App: React.FC = () => {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('bic_lang') as Language;
    return (saved && ['es', 'en', 'zh', 'hi', 'fr', 'ar', 'pt', 'ru', 'ja', 'de'].includes(saved)) ? saved : 'es';
  });
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(sound.isMuted);

  const [networkInfo, setNetworkInfo] = useState<NetworkInfo | null>(null);
  const [miningStats, setMiningStats] = useState<MiningStats | null>(null);
  const [miningJob, setMiningJob] = useState<MiningJob | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<RecentBlock | null>(null);

  const [blocks, setBlocks] = useState<RecentBlock[]>([]);

  // Polling network telemetry in real-time
  const refreshData = useCallback(async () => {
    try {
      const [info, stats, job, blockList] = await Promise.all([
        bicRpc.getInfo(),
        bicRpc.getMiningStats(),
        bicRpc.getMiningJob(),
        bicRpc.getBlocks(),
      ]);
      setNetworkInfo(info);
      setMiningStats(stats);
      setMiningJob(job);
      if (blockList && blockList.length > 0) {
        setBlocks(blockList);
      }
    } catch {
      // Handled gracefully in bicRpc fallback
    }
  }, []);

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 1500);
    return () => clearInterval(interval);
  }, [refreshData]);

  // Update HTML lang and direction
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('bic_lang', lang);
  }, [lang]);

  const toggleAudio = () => {
    const muted = sound.toggleMute();
    setIsAudioMuted(muted);
  };

  const changeLanguage = (newLang: Language) => {
    setLang(newLang);
  };

  return (
    <BrowserRouter>
      <div className="relative min-h-screen flex flex-col justify-between selection:bg-neon-cyan/30 selection:text-neon-cyan">
        {/* Dynamic Background */}
        <CyberCanvas />

        {/* Main App Container */}
        <div className="relative z-10 flex flex-col min-h-screen">
          {/* Navigation Bar */}
          <Navbar
            lang={lang}
            onChangeLang={changeLanguage}
            networkInfo={networkInfo}
            miningStats={miningStats}
            isAudioMuted={isAudioMuted}
            onToggleAudio={toggleAudio}
          />

          {/* Router Views */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
            <Routes>
              <Route 
                path="/" 
                element={
                  <HomeView 
                    lang={lang}
                    networkInfo={networkInfo}
                    miningStats={miningStats}
                  />
                } 
              />
              <Route 
                path="/impact" 
                element={
                  <ImpactView 
                    lang={lang}
                  />
                } 
              />
              <Route 
                path="/explorer" 
                element={
                  <ExplorerTab
                    lang={lang}
                    networkInfo={networkInfo}
                    miningStats={miningStats}
                    blocks={blocks}
                    onSelectBlock={setSelectedBlock}
                  />
                } 
              />
              <Route 
                path="/mining" 
                element={
                  <MiningInfoView
                    lang={lang}
                    miningStats={miningStats}
                    miningJob={miningJob}
                  />
                } 
              />
              <Route 
                path="/guardians" 
                element={
                  <GuardiansTab
                    lang={lang}
                    networkInfo={networkInfo}
                    miningStats={miningStats}
                    onRefreshInfo={refreshData}
                  />
                } 
              />
              <Route 
                path="/wallet" 
                element={
                  <WalletTab 
                    lang={lang}
                  />
                } 
              />
              <Route 
                path="/downloads" 
                element={
                  <DownloadsView 
                    lang={lang}
                  />
                } 
              />
              <Route 
                path="/tokenomics" 
                element={
                  <TokenomicsTab
                    lang={lang}
                    networkInfo={networkInfo}
                    miningStats={miningStats}
                  />
                } 
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Footer */}
          <footer className="border-t border-white/5 bg-black/70 backdrop-blur-xl py-8 px-4 mt-12 text-xs font-mono text-gray-500">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-neon-green" />
                <span className="text-gray-300 font-bold">Black Ink Coin</span>
                <span>— Soberanía Financiera Blindada (Protocolo 0.666)</span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-[11px]">
                <Link to="/impact" className="text-gray-400 hover:text-neon-cyan transition-colors">
                  Manifiesto & Ventajas
                </Link>
                <span>•</span>
                <Link to="/downloads" className="text-gray-400 hover:text-neon-gold transition-colors">
                  Descargas Multi-SO
                </Link>
                <span>•</span>
                <Link to="/tokenomics" className="text-gray-400 hover:text-neon-pink transition-colors">
                  Tokenomía 666
                </Link>
                <span>•</span>
                <span className="text-gray-500">RPC: <strong className="text-neon-purple">http://127.0.0.1:6660</strong></span>
              </div>
            </div>
          </footer>
        </div>

        {/* Block Inspection Modal */}
        <BlockModal
          block={selectedBlock}
          onClose={() => setSelectedBlock(null)}
          lang={lang}
        />
      </div>
    </BrowserRouter>
  );
};
export default App;
