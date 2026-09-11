import React, { useState } from 'react';
import { 
  Wallet, 
  Key, 
  Eye, 
  EyeOff,
  Send, 
  Copy, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  AlertCircle,
  ShieldAlert,
  HelpCircle,
  Info,
  ArrowRight
} from 'lucide-react';
import { Language, translations } from '../../i18n/translations';
import { WalletData, WalletBalance, ViewKeyBalance } from '../../types/bic';
import { bicRpc } from '../../services/bicRpc';
import { sound } from '../../utils/audio';
import { copyToClipboard } from '../../utils/clipboard';

interface WalletTabProps {
  lang: Language;
}

export const WalletTab: React.FC<WalletTabProps> = ({ lang }) => {
  const t = translations[lang];

  const [subTab, setSubTab] = useState<'create' | 'restore' | 'viewKey' | 'send'>('create');

  // Create Wallet State
  const [createdWallet, setCreatedWallet] = useState<WalletData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [createWalletError, setCreateWalletError] = useState<string | null>(null);
  const [copiedMnemonic, setCopiedMnemonic] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [customPassphrase, setCustomPassphrase] = useState('');
  const [showPassphraseText, setShowPassphraseText] = useState(false);

  // Restore Wallet State
  const [restoreMnemonic, setRestoreMnemonic] = useState('');
  const [restorePassphrase, setRestorePassphrase] = useState('');
  const [showRestorePassphraseText, setShowRestorePassphraseText] = useState(false);
  const [walletBalance, setWalletBalance] = useState<WalletBalance | null>(null);
  const [isCheckingBalance, setIsCheckingBalance] = useState(false);
  const [balanceError, setBalanceError] = useState<string | null>(null);

  // View-Key State
  const [viewKey, setViewKey] = useState('');
  const [spendPub, setSpendPub] = useState('');
  const [viewBalance, setViewBalance] = useState<ViewKeyBalance | null>(null);
  const [isScanningView, setIsScanningView] = useState(false);
  const [viewError, setViewError] = useState<string | null>(null);

  // Send State
  const [sendMnemonic, setSendMnemonic] = useState('');
  const [sendPassphrase, setSendPassphrase] = useState('');
  const [showSendPassphraseText, setShowSendPassphraseText] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('1.0');
  const [ringSize, setRingSize] = useState('11');
  const [isSending, setIsSending] = useState(false);
  const [sendResult, setSendResult] = useState<{ status: string; tx_hash?: string; message?: string } | null>(null);
  const [copiedSpendPub, setCopiedSpendPub] = useState(false);
  const [copiedViewKey, setCopiedViewKey] = useState(false);
  const [showCreatedViewKey, setShowCreatedViewKey] = useState(false);

  // Quick Action: Use keys in View-Key Audit tab
  const handleUseKeysForAudit = (vk: string, sp: string) => {
    setViewKey(vk);
    setSpendPub(sp);
    setSubTab('viewKey');
    sound.playClick();
  };

  // Handlers
  const handleGenerateWallet = async () => {
    setIsGenerating(true);
    setCreateWalletError(null);
    sound.playClick();
    try {
      const w = await bicRpc.generateWallet(customPassphrase.trim());
      setCreatedWallet({
        ...w,
        passphrase: customPassphrase.trim(),
        has_passphrase: !customPassphrase.trim().length ? false : true
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setCreateWalletError(msg);
      setCreatedWallet(null);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCheckBalance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restoreMnemonic.trim()) return;

    setIsCheckingBalance(true);
    setBalanceError(null);
    setWalletBalance(null);
    sound.playClick();

    try {
      const bal = await bicRpc.getWalletBalance(restoreMnemonic.trim(), restorePassphrase.trim());
      setWalletBalance(bal);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setBalanceError(msg);
      setWalletBalance(null);
    } finally {
      setIsCheckingBalance(false);
    }
  };

  const handleScanViewKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!viewKey.trim() || !spendPub.trim()) return;

    setIsScanningView(true);
    setViewError(null);
    setViewBalance(null);
    sound.playClick();

    try {
      const res = await bicRpc.scanWithViewKey(viewKey.trim(), spendPub.trim());
      setViewBalance(res);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setViewError(msg);
      setViewBalance(null);
    } finally {
      setIsScanningView(false);
    }
  };

  const handleSendTx = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sendMnemonic.trim() || !recipient.trim()) return;

    setIsSending(true);
    setSendResult(null);
    sound.playClick();

    try {
      const res = await bicRpc.sendShieldedTx({
        mnemonic: sendMnemonic.trim(),
        passphrase: sendPassphrase.trim(),
        to_address: recipient.trim(),
        amount_bic: parseFloat(amount),
      });
      sound.playBlockSealed();
      setSendResult({
        status: 'success',
        tx_hash: res.tx_hash,
        message: 'Transacción blindada transmitida con éxito al mempool de la red.',
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setSendResult({
        status: 'error',
        message: msg,
      });
    } finally {
      setIsSending(false);
    }
  };

  const tabs = [
    { id: 'create', label: t.tabCreateWallet, icon: Wallet },
    { id: 'restore', label: t.tabRestoreWallet, icon: Key },
    { id: 'viewKey', label: t.tabViewKeyAudit, icon: Eye },
    { id: 'send', label: t.tabSendTx, icon: Send },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-neon-green font-semibold">
          <ShieldCheck className="w-4 h-4 text-neon-green" />
          <span>Soberanía Financiera Absoluta</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-orbitron font-extrabold text-white">
          Billetera Privada <span className="bg-gradient-to-r from-neon-green via-neon-cyan to-neon-purple bg-clip-text text-transparent">Zero-Knowledge</span>
        </h1>
        <p className="text-gray-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
          Tus fondos están custodiados exclusivamente por criptografía de curva elíptica. Nadie puede congelar, auditar ni rastrear tus monedas sin tu consentimiento explícito.
        </p>
      </div>

      {/* Subtabs Selector (Mobile Responsive 2x2 Grid) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 rounded-2xl bg-black/40 border border-white/10">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = subTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setSubTab(tab.id as typeof subTab);
                sound.playClick();
              }}
              className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl font-mono text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-neon-green/20 text-white border border-neon-green/50 shadow-glow-green'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-transparent'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Subtab 1: Create Wallet */}
      {subTab === 'create' && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6 animate-in fade-in">
          <div className="space-y-1">
            <h2 className="font-orbitron text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-neon-green" />
              {t.tabCreateWallet}
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm">
              Genera un par de claves criptográficas deterministas bajo el estándar BIP-39 con 12 palabras clave y la opción de blindaje de la 13ª palabra personal.
            </p>
          </div>

          {/* 13th Word Paranoia Mode Input */}
          <div className="p-4 sm:p-5 rounded-2xl bg-black/40 border border-neon-pink/30 space-y-3 shadow-glow-pink/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-neon-pink">
                <Lock className="w-4 h-4 text-neon-pink" />
                <span>{t.paranoiaBadge}</span>
              </div>
              <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded border font-bold self-start sm:self-auto ${
                customPassphrase.trim()
                  ? 'bg-neon-pink text-white border-neon-pink shadow-glow-pink'
                  : 'bg-white/5 text-gray-400 border-white/10'
              }`}>
                {customPassphrase.trim() ? t.paranoiaActive : 'OPTIONAL'}
              </span>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              {t.paranoiaDesc}
            </p>

            <div className="relative">
              <input
                type={showPassphraseText ? 'text' : 'password'}
                value={customPassphrase}
                onChange={(e) => setCustomPassphrase(e.target.value)}
                placeholder={t.paranoiaPlaceholder}
                className="w-full px-4 py-3 rounded-xl bg-black/70 border border-white/15 text-xs font-mono text-white focus:outline-none focus:border-neon-pink transition-colors pr-10 placeholder:text-gray-600"
              />
              <button
                type="button"
                onClick={() => setShowPassphraseText(!showPassphraseText)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
                title={showPassphraseText ? "Ocultar" : "Mostrar"}
              >
                {showPassphraseText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            onClick={handleGenerateWallet}
            disabled={isGenerating}
            className="px-6 py-3.5 rounded-xl bg-neon-green/20 hover:bg-neon-green text-neon-green hover:text-black font-orbitron text-xs font-bold tracking-wider transition-all border border-neon-green/50 shadow-glow-green flex items-center gap-2 cursor-pointer"
          >
            <Wallet className="w-4 h-4" />
            {isGenerating ? t.generatingCrypto : (customPassphrase.trim() ? t.paranoiaBtnGenerate : t.generateWalletBtn)}
          </button>

          {createWalletError && (
            <div className="p-3.5 rounded-xl bg-neon-pink/10 border border-neon-pink/30 text-neon-pink text-xs font-mono">
              {createWalletError}
            </div>
          )}

          {createdWallet && (
            <div className="space-y-5 pt-4 border-t border-white/5">
              {/* 13th Word Badge Alert */}
              {createdWallet.has_passphrase && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-neon-pink/15 to-neon-purple/15 border border-neon-pink/50 flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-neon-pink shrink-0 mt-0.5" />
                  <div className="space-y-1 text-xs">
                    <div className="font-orbitron font-bold text-white flex items-center gap-2">
                      <span>{t.paranoiaAlertTitle}</span>
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-neon-pink text-white font-extrabold">
                        {t.paranoiaActive}
                      </span>
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                      {t.paranoiaAlertDesc}
                    </p>
                    {createdWallet.passphrase && (
                      <div className="pt-1 font-mono text-xs text-neon-pink">
                        {t.paranoiaYourWord} <strong className="text-white bg-black/60 px-2 py-0.5 rounded border border-white/10">{createdWallet.passphrase}</strong>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 12 Words Grid */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-gray-300 font-bold">{t.yourSeedWords}</span>
                  <button
                    onClick={async () => {
                      await copyToClipboard(createdWallet.mnemonic);
                      setCopiedMnemonic(true);
                      sound.playClick();
                      setTimeout(() => setCopiedMnemonic(false), 2000);
                    }}
                    className="text-neon-cyan hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {copiedMnemonic ? <Check className="w-3.5 h-3.5 text-neon-green" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedMnemonic ? t.copiedMnemonic : t.copyMnemonic}
                  </button>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5 p-4 rounded-2xl bg-black/60 border border-white/10">
                  {createdWallet.mnemonic.split(' ').map((word, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-white/5 border border-white/5 font-mono text-xs flex items-center gap-2"
                    >
                      <span className="text-[10px] text-gray-500 font-bold w-4">
                        {idx + 1}.
                      </span>
                      <span className="text-neon-green font-semibold">{word}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Public Stealth Address */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-gray-300">{t.yourPublicAddress}</span>
                  <button
                    onClick={async () => {
                      await copyToClipboard(createdWallet.address);
                      setCopiedAddress(true);
                      sound.playClick();
                      setTimeout(() => setCopiedAddress(false), 2000);
                    }}
                    className="text-neon-cyan hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {copiedAddress ? <Check className="w-3.5 h-3.5 text-neon-green" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedAddress ? 'Copiada' : 'Copiar dirección'}
                  </button>
                </div>
                <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 font-mono text-xs text-neon-cyan break-all">
                  {createdWallet.address}
                </div>
              </div>

              {/* Cold Audit View-Key & Spend-Pub Section */}
              <div className="p-4 sm:p-5 rounded-2xl bg-black/40 border border-neon-cyan/30 space-y-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-neon-cyan">
                    <Eye className="w-4 h-4 text-neon-cyan" />
                    <span>Claves de Auditoría en Frío (Solo Lectura)</span>
                  </div>
                  {createdWallet.view_key && (
                    <button
                      type="button"
                      onClick={() => handleUseKeysForAudit(createdWallet.view_key!, createdWallet.spend_pub)}
                      className="px-3 py-1.5 rounded-lg bg-neon-cyan/10 hover:bg-neon-cyan/20 border border-neon-cyan/40 text-[11px] font-mono text-neon-cyan hover:text-white flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
                    >
                      <span>Auditar con View-Key</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <p className="text-[11px] text-gray-400 leading-relaxed">
                  Estas dos claves permiten auditar saldos y cobros en cualquier equipo sin riesgo: <strong>no pueden mover fondos ni transferir monedas</strong>.
                </p>

                <div className="space-y-2.5 font-mono text-xs">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-gray-400 mb-1">
                      <span>Spend Public Key (32 bytes hex — primeros 64 hex de tu dirección)</span>
                      <button
                        type="button"
                        onClick={async () => {
                          await copyToClipboard(createdWallet.spend_pub);
                          setCopiedSpendPub(true);
                          sound.playClick();
                          setTimeout(() => setCopiedSpendPub(false), 2000);
                        }}
                        className="text-neon-cyan hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        {copiedSpendPub ? <Check className="w-3 h-3 text-neon-green" /> : <Copy className="w-3 h-3" />}
                        {copiedSpendPub ? 'Copiada' : 'Copiar'}
                      </button>
                    </div>
                    <div className="p-2.5 rounded-xl bg-black/60 border border-white/10 text-white break-all text-[11px]">
                      {createdWallet.spend_pub}
                    </div>
                  </div>

                  {createdWallet.view_key && (
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-gray-400 mb-1">
                        <span>Private View-Key (Clave de Lectura — 32 bytes hex)</span>
                        <div className="flex items-center gap-2.5">
                          <button
                            type="button"
                            onClick={() => setShowCreatedViewKey(!showCreatedViewKey)}
                            className="text-gray-400 hover:text-white flex items-center gap-1 cursor-pointer"
                          >
                            {showCreatedViewKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            <span>{showCreatedViewKey ? 'Ocultar' : 'Mostrar'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              if (createdWallet.view_key) {
                                await copyToClipboard(createdWallet.view_key);
                                setCopiedViewKey(true);
                                sound.playClick();
                                setTimeout(() => setCopiedViewKey(false), 2000);
                              }
                            }}
                            className="text-neon-cyan hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            {copiedViewKey ? <Check className="w-3 h-3 text-neon-green" /> : <Copy className="w-3 h-3" />}
                            {copiedViewKey ? 'Copiada' : 'Copiar'}
                          </button>
                        </div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-black/60 border border-white/10 text-neon-cyan break-all text-[11px]">
                        {showCreatedViewKey ? createdWallet.view_key : '•'.repeat(48)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Subtab 2: Restore Wallet */}
      {subTab === 'restore' && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6 animate-in fade-in">
          <div className="space-y-1">
            <h2 className="font-orbitron text-lg font-bold text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-neon-green" />
              {t.tabRestoreWallet}
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm">
              Introduce tus 12 palabras (y tu 13ª palabra si creaste la cartera en Modo Paranoia) para restaurar tus claves y consultar tu balance.
            </p>
          </div>

          <form onSubmit={handleCheckBalance} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-gray-300">
                Frase Mnemónica (12 palabras separadas por espacios)
              </label>
              <textarea
                value={restoreMnemonic}
                onChange={(e) => setRestoreMnemonic(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-xs font-mono text-neon-green focus:outline-none focus:border-neon-green transition-colors placeholder:text-gray-600"
                placeholder="shadow dark cipher ghost flame phantom..."
                required
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-gray-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-neon-pink" />
                  <span>{t.paranoiaRestoreLabel}</span>
                </span>
                <span className="text-[10px] text-gray-500">{t.paranoiaRestoreHint}</span>
              </div>
              <div className="relative">
                <input
                  type={showRestorePassphraseText ? 'text' : 'password'}
                  value={restorePassphrase}
                  onChange={(e) => setRestorePassphrase(e.target.value)}
                  placeholder={t.paranoiaRestorePlaceholder}
                  className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-xs font-mono text-neon-pink focus:outline-none focus:border-neon-pink transition-colors pr-10 placeholder:text-gray-600"
                />
                <button
                  type="button"
                  onClick={() => setShowRestorePassphraseText(!showRestorePassphraseText)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
                  title={showRestorePassphraseText ? "Ocultar" : "Mostrar"}
                >
                  {showRestorePassphraseText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isCheckingBalance}
              className="px-6 py-3.5 rounded-xl bg-neon-green/20 hover:bg-neon-green text-neon-green hover:text-black font-orbitron text-xs font-bold tracking-wider transition-all border border-neon-green/50 shadow-glow-green flex items-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              {isCheckingBalance ? t.checkingBalance : t.checkBalanceBtn}
            </button>
          </form>

          {balanceError && (
            <div className="p-3.5 rounded-xl bg-neon-pink/10 border border-neon-pink/30 text-neon-pink text-xs font-mono">
              {balanceError}
            </div>
          )}

          {walletBalance && (
            <div className="space-y-4 pt-4 border-t border-white/5 font-mono">
              {walletBalance.has_passphrase && (
                <div className="px-3 py-1.5 rounded-lg bg-neon-pink/10 border border-neon-pink/30 text-[11px] text-neon-pink flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5" />
                  <span>{t.paranoiaDecryptedBadge}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-xs text-gray-400">{t.totalBalance}</span>
                  <div className="text-2xl font-bold text-neon-green mt-1">
                    {walletBalance.balance_bic.toFixed(4)} <span className="text-xs">BIC</span>
                  </div>
                  <div className="text-[10px] text-gray-400">
                    {walletBalance.balance_hells} Hells
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-xs text-gray-400">{t.unspentOutputs}</span>
                  <div className="text-2xl font-bold text-white mt-1">
                    {walletBalance.unspent_utxos} <span className="text-xs">UTXOs</span>
                  </div>
                  <div className="text-[10px] text-gray-400">Listas para gastar</div>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-xs text-gray-400">Total Detectadas</span>
                  <div className="text-2xl font-bold text-neon-cyan mt-1">
                    {walletBalance.total_detected_utxos}
                  </div>
                  <div className="text-[10px] text-gray-400">Salidas stealth en cadena</div>
                </div>
              </div>

              {/* Public Stealth Address for Restored Wallet */}
              {walletBalance.address && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-gray-300">{t.yourPublicAddress}</span>
                    <button
                      type="button"
                      onClick={async () => {
                        await copyToClipboard(walletBalance.address!);
                        setCopiedAddress(true);
                        sound.playClick();
                        setTimeout(() => setCopiedAddress(false), 2000);
                      }}
                      className="text-neon-cyan hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {copiedAddress ? <Check className="w-3.5 h-3.5 text-neon-green" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedAddress ? 'Copiada' : 'Copiar dirección'}
                    </button>
                  </div>
                  <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 font-mono text-xs text-neon-cyan break-all">
                    {walletBalance.address}
                  </div>
                </div>
              )}

              {/* Cold Audit Keys for Restored Wallet */}
              {walletBalance.spend_pub && (
                <div className="p-4 sm:p-5 rounded-2xl bg-black/40 border border-neon-cyan/30 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-neon-cyan">
                      <Eye className="w-4 h-4 text-neon-cyan" />
                      <span>Claves de Auditoría en Frío (Solo Lectura)</span>
                    </div>
                    {walletBalance.view_key && (
                      <button
                        type="button"
                        onClick={() => handleUseKeysForAudit(walletBalance.view_key!, walletBalance.spend_pub!)}
                        className="px-3 py-1.5 rounded-lg bg-neon-cyan/10 hover:bg-neon-cyan/20 border border-neon-cyan/40 text-[11px] font-mono text-neon-cyan hover:text-white flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
                      >
                        <span>Auditar con View-Key</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="space-y-2 font-mono text-xs">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-gray-400 mb-1">
                        <span>Spend Public Key (32 bytes hex)</span>
                        <button
                          type="button"
                          onClick={async () => {
                            if (walletBalance.spend_pub) {
                              await copyToClipboard(walletBalance.spend_pub);
                              setCopiedSpendPub(true);
                              sound.playClick();
                              setTimeout(() => setCopiedSpendPub(false), 2000);
                            }
                          }}
                          className="text-neon-cyan hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          {copiedSpendPub ? <Check className="w-3 h-3 text-neon-green" /> : <Copy className="w-3 h-3" />}
                          {copiedSpendPub ? 'Copiada' : 'Copiar'}
                        </button>
                      </div>
                      <div className="p-2 rounded-lg bg-black/60 border border-white/10 text-white break-all text-[11px]">
                        {walletBalance.spend_pub}
                      </div>
                    </div>

                    {walletBalance.view_key && (
                      <div>
                        <div className="flex items-center justify-between text-[11px] text-gray-400 mb-1">
                          <span>Private View-Key (Clave de Lectura)</span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setShowCreatedViewKey(!showCreatedViewKey)}
                              className="text-gray-400 hover:text-white flex items-center gap-1 cursor-pointer"
                            >
                              {showCreatedViewKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                              <span>{showCreatedViewKey ? 'Ocultar' : 'Mostrar'}</span>
                            </button>
                            <button
                              type="button"
                              onClick={async () => {
                                if (walletBalance.view_key) {
                                  await copyToClipboard(walletBalance.view_key);
                                  setCopiedViewKey(true);
                                  sound.playClick();
                                  setTimeout(() => setCopiedViewKey(false), 2000);
                                }
                              }}
                              className="text-neon-cyan hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              {copiedViewKey ? <Check className="w-3 h-3 text-neon-green" /> : <Copy className="w-3 h-3" />}
                              {copiedViewKey ? 'Copiada' : 'Copiar'}
                            </button>
                          </div>
                        </div>
                        <div className="p-2 rounded-lg bg-black/60 border border-white/10 text-neon-cyan break-all text-[11px]">
                          {showCreatedViewKey ? walletBalance.view_key : '•'.repeat(48)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Subtab 3: View-Key Audit */}
      {subTab === 'viewKey' && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6 animate-in fade-in">
          <div className="space-y-1">
            <h2 className="font-orbitron text-lg font-bold text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-neon-cyan" />
              {t.tabViewKeyAudit}
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm">
              Auditoría segura sin riesgo: escanea todas las transacciones de la cadena usando únicamente tu View-Key y Spend-Pub, sin revelar jamás tu capacidad de gasto.
            </p>
          </div>

          {/* Helpful guide: Where to get these keys */}
          <div className="p-4 sm:p-5 rounded-2xl bg-neon-cyan/5 border border-neon-cyan/20 space-y-2.5">
            <div className="font-orbitron font-bold text-white text-xs flex items-center gap-2">
              <Info className="w-4 h-4 text-neon-cyan" />
              <span>¿De dónde saco estas dos claves?</span>
            </div>
            <div className="text-gray-300 space-y-2 text-xs leading-relaxed">
              <div className="flex items-start gap-2">
                <span className="text-neon-cyan font-bold font-mono">1.</span>
                <p>
                  <strong className="text-white">Spend Public Key:</strong> Son los <strong>primeros 64 caracteres hexadecimales</strong> de tu dirección pública (justo después de <code className="text-neon-cyan font-mono bg-black/60 px-1 py-0.5 rounded">bic666_</code>). Es una clave 100% pública.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-neon-cyan font-bold font-mono">2.</span>
                <p>
                  <strong className="text-white">View-Key (Clave de Lectura):</strong> Es la clave secreta de 32 bytes (64 caracteres hex) que se deriva de tus 12 palabras (y de tu 13ª palabra si usaste el Modo Paranoia). La puedes ver y copiar directamente en las pestañas <em>"Crear Billetera"</em> o <em>"Restaurar / Balance"</em>, o en la terminal ejecutando <code className="text-neon-purple font-mono bg-black/60 px-1 py-0.5 rounded">bic-cli address</code>.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleScanViewKey} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-gray-300">View-Key (32 bytes hex)</label>
              <input
                type="text"
                value={viewKey}
                onChange={(e) => setViewKey(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-xs font-mono text-neon-cyan focus:outline-none focus:border-neon-cyan transition-colors"
                placeholder="8aa98a8074f0b257b082b8e3d79df0c2..."
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-gray-300">Spend Public Key (32 bytes hex)</label>
              <input
                type="text"
                value={spendPub}
                onChange={(e) => setSpendPub(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-xs font-mono text-neon-cyan focus:outline-none focus:border-neon-cyan transition-colors"
                placeholder="5cb78c4a47eed4bca2b3d7dec5bf451c..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={isScanningView}
              className="px-6 py-3.5 rounded-xl bg-neon-cyan/20 hover:bg-neon-cyan text-neon-cyan hover:text-black font-orbitron text-xs font-bold tracking-wider transition-all border border-neon-cyan/50 shadow-glow-cyan flex items-center gap-2 cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              {isScanningView ? 'Descifrando salidas stealth...' : 'Escanear con View-Key'}
            </button>
          </form>

          {viewError && (
            <div className="p-3.5 rounded-xl bg-neon-pink/10 border border-neon-pink/30 text-neon-pink text-xs font-mono">
              {viewError}
            </div>
          )}

          {viewBalance && (
            <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-2 font-mono">
              <div className="text-xs text-gray-400">Balance Auditado con View-Key:</div>
              <div className="text-3xl font-bold text-neon-cyan">
                {viewBalance.balance_bic.toFixed(6)} <span className="text-xs font-sans">BIC</span>
              </div>
              <div className="text-xs text-neon-green">
                ✓ {viewBalance.security_mode}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Subtab 4: Send Shielded Coins */}
      {subTab === 'send' && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6 animate-in fade-in">
          <div className="space-y-1">
            <h2 className="font-orbitron text-lg font-bold text-white flex items-center gap-2">
              <Send className="w-5 h-5 text-neon-pink" />
              {t.tabSendTx}
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm">
              Transfiere monedas de forma 100% anónima con RingCT (firmas anulares de tamaño 11+ y direcciones stealth de un solo uso).
            </p>
          </div>

          <form onSubmit={handleSendTx} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-gray-300">Tu Frase Semilla de Autorización (12 Palabras)</label>
              <input
                type="password"
                value={sendMnemonic}
                onChange={(e) => setSendMnemonic(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-xs font-mono text-neon-pink focus:outline-none focus:border-neon-pink transition-colors"
                placeholder="12 palabras BIP-39..."
                required
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-gray-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-neon-pink" />
                  <span>{t.paranoiaSendLabel}</span>
                </span>
                <span className="text-[10px] text-gray-500">{t.paranoiaRestoreHint}</span>
              </div>
              <div className="relative">
                <input
                  type={showSendPassphraseText ? 'text' : 'password'}
                  value={sendPassphrase}
                  onChange={(e) => setSendPassphrase(e.target.value)}
                  placeholder={t.paranoiaSendPlaceholder}
                  className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-xs font-mono text-neon-pink focus:outline-none focus:border-neon-pink transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowSendPassphraseText(!showSendPassphraseText)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
                  title={showSendPassphraseText ? "Ocultar" : "Mostrar"}
                >
                  {showSendPassphraseText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-gray-300">{t.sendToAddress}</label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-neon-cyan transition-colors"
                placeholder="bic666_..."
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-gray-300">{t.amountToSend}</label>
                <input
                  type="number"
                  step="0.000001"
                  min="0.000001"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-neon-cyan transition-colors"
                  placeholder="0.000000"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-gray-300">{t.ringSize}</label>
                <select
                  value={ringSize}
                  onChange={(e) => setRingSize(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-neon-cyan transition-colors"
                >
                  <option value="11">11 Decoys (RingCT)</option>
                  <option value="16">16 Decoys (High Shield)</option>
                  <option value="21">21 Decoys (Max Paranoia)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSending}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-neon-pink to-neon-purple hover:opacity-90 text-white font-orbitron text-xs font-bold tracking-wider transition-all shadow-glow-pink flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              {isSending ? t.sendingTx : t.sendTxBtn}
            </button>
          </form>

          {sendResult && (
            <div className={`p-4 rounded-xl border flex items-start gap-3 text-xs font-mono ${
              sendResult.status === 'success' 
                ? 'bg-neon-green/10 border-neon-green/30 text-neon-green' 
                : 'bg-neon-pink/10 border-neon-pink/30 text-neon-pink'
            }`}>
              {sendResult.status === 'success' ? (
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <div>{sendResult.message}</div>
                {sendResult.tx_hash && (
                  <div className="text-[11px] text-gray-300 break-all">
                    Tx Hash: {sendResult.tx_hash}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
