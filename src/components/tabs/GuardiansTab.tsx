import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Coins, 
  Radio, 
  HelpCircle,
  Copy,
  Check,
  Server,
  Terminal,
  ExternalLink,
  Lock,
  Activity
} from 'lucide-react';
import { Language, translations } from '../../i18n/translations';
import { NetworkInfo, MiningStats } from '../../types/bic';
import { sound } from '../../utils/audio';
import { copyToClipboard } from '../../utils/clipboard';

interface GuardiansTabProps {
  lang: Language;
  networkInfo: NetworkInfo | null;
  miningStats: MiningStats | null;
  onRefreshInfo: () => void;
}

export const GuardiansTab: React.FC<GuardiansTabProps> = ({
  lang,
  networkInfo,
  miningStats,
  onRefreshInfo,
}) => {
  const t = translations[lang];

  const currentGuardianAddress = 
    networkInfo?.guardian_address ||
    'bic666_5cb78c4a47eed4bca2b3d7dec5bf451cdce2631df4b86b84786b51eb38f884218aa98a8074f0b257b082b8e3d79df0c21a7f0257574e2be3d7a454650008167b';

  const [copied, setCopied] = useState(false);
  const [copiedEndpoint, setCopiedEndpoint] = useState(false);

  const copyAddress = async () => {
    await copyToClipboard(currentGuardianAddress);
    setCopied(true);
    sound.playClick();
    setTimeout(() => setCopied(false), 2000);
  };

  const activeCount = networkInfo?.active_guardians_count ?? 1;
  const totalFeesBic = networkInfo?.total_guardian_fees_bic ?? 0;
  const blockEmissionBic = miningStats?.next_block_reward_bic ?? 6.66;
  const guardianEmissionShare = (blockEmissionBic * 0.0666) / Math.max(activeCount, 1);
  const feeSharePerGuardian = (totalFeesBic / Math.max(activeCount, 1));
  const totalEstimatedPerGuardian = (guardianEmissionShare + feeSharePerGuardian).toFixed(4);

  const rpcUrl = typeof window !== 'undefined'
    ? `${window.location.protocol}//${window.location.hostname}:6660`
    : 'http://192.168.0.20:6660';

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl glass-panel p-6 sm:p-10 border border-neon-purple/30 shadow-card-glow">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-neon-purple/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-purple/10 border border-neon-purple/30 text-neon-purple text-xs font-mono">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>SWARM P2P DE NODOS GUARDIANES — VALIDACIÓN BFT L1</span>
          </div>

          <h1 className="font-orbitron text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {t.guardiansHeroTitle}
          </h1>

          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            Los Nodos Guardianes constituyen la infraestructura soberana de Black Ink Coin: mantienen el libro mayor persistente en disco, validan las firmas anulares RingCT y sirven las plantillas de trabajo a los mineros colaborativos.
          </p>
        </div>
      </div>

      {/* Fee Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 font-mono">
        <div className="glass-panel glass-panel-hover rounded-2xl p-6 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-gray-400 text-xs">
            <span>GUARDIANES ACTIVOS</span>
            <ShieldCheck className="w-4 h-4 text-neon-purple" />
          </div>
          <div className="font-orbitron text-3xl font-extrabold text-white">
            {activeCount} <span className="text-sm font-sans text-neon-purple">NODO{activeCount > 1 ? 'S' : ''}</span>
          </div>
          <div className="text-[11px] font-mono text-gray-400">
            Validando bloques P2P y atendiendo mineros
          </div>
        </div>

        <div className="glass-panel glass-panel-hover rounded-2xl p-6 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-gray-400 text-xs">
            <span>EMISIÓN GUARDIÁN / BLOQUE</span>
            <Coins className="w-4 h-4 text-neon-gold" />
          </div>
          <div className="font-orbitron text-3xl font-extrabold text-neon-gold">
            {(blockEmissionBic * 0.0666).toFixed(4)} <span className="text-sm font-sans">BIC</span>
          </div>
          <div className="text-[11px] font-mono text-neon-gold">
            6.66% garantizado por bloque acuñado
          </div>
        </div>

        <div className="glass-panel glass-panel-hover rounded-2xl p-6 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-gray-400 text-xs">
            <span>COMISIONES ACUMULADAS</span>
            <Radio className="w-4 h-4 text-neon-green" />
          </div>
          <div className="font-orbitron text-3xl font-extrabold text-neon-green">
            ~{totalFeesBic.toFixed(6)} <span className="text-sm font-sans">BIC</span>
          </div>
          <div className="text-[11px] font-mono text-gray-400">
            100% de las tarifas de transacción van a Guardianes
          </div>
        </div>
      </div>

      {/* Guardian Node Mining Connection Endpoint Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-neon-cyan/40 shadow-card-glow space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <h2 className="font-orbitron text-lg font-bold text-white flex items-center gap-2">
              <Server className="w-5 h-5 text-neon-cyan" />
              Punto de Conexión del Guardián (Para Mineros de Escritorio)
            </h2>
            <p className="text-gray-300 text-xs sm:text-sm">
              Conecta tu Minero de Escritorio directamente a este Guardián o agrégalo a tu pool de Auto-Failover.
            </p>
          </div>
          <button
            type="button"
            onClick={async () => {
              await copyToClipboard(rpcUrl);
              setCopiedEndpoint(true);
              sound.playClick();
              setTimeout(() => setCopiedEndpoint(false), 2000);
            }}
            className="px-4 py-2.5 rounded-xl bg-neon-cyan/20 hover:bg-neon-cyan text-neon-cyan hover:text-black font-mono text-xs font-bold transition-all border border-neon-cyan/50 shadow-glow-cyan flex items-center gap-2 shrink-0 cursor-pointer self-start sm:self-auto"
          >
            {copiedEndpoint ? <Check className="w-4 h-4 text-neon-green" /> : <Copy className="w-4 h-4" />}
            <span>{copiedEndpoint ? 'URL Copiada' : 'Copiar URL de Minería'}</span>
          </button>
        </div>

        <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono text-xs text-neon-cyan">
          <span className="break-all">{rpcUrl}</span>
          <span className="text-[10px] text-neon-green px-2 py-0.5 rounded bg-neon-green/10 border border-neon-green/30 shrink-0 self-start sm:self-auto">
            ● PUERTO RPC 6660 ACTIVO
          </span>
        </div>
      </div>

      {/* Active Guardian Node Status & Verification Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-neon-purple/40 shadow-card-glow space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="space-y-1">
            <h2 className="font-orbitron text-xl font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-neon-purple" />
              Nodo Guardián Validador del Servidor
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm">
              Identidad criptográfica y dirección soberana del nodo activo en este servidor.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neon-green/15 border border-neon-green/40 text-neon-green text-xs font-mono font-bold self-start sm:self-auto">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>ONLINE — NODO BLINDADO</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-gray-300">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-neon-gold" />
                Dirección Soberana de Recepción de Comisiones:
              </span>
              <button
                type="button"
                onClick={copyAddress}
                className="text-neon-cyan hover:underline flex items-center gap-1 cursor-pointer font-mono"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-neon-green" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copiada' : 'Copiar Dirección'}
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-black/60 border border-neon-purple/30 font-mono text-xs text-neon-purple break-all select-all">
              {currentGuardianAddress}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
              <div className="text-gray-400">Almacenamiento del Ledger:</div>
              <div className="text-white font-bold">Persistente en Disco (.bic_ledger/)</div>
            </div>
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
              <div className="text-gray-400">Protección Anti-Sybil:</div>
              <div className="text-neon-green font-bold">Activa (Clave Privada de Validador)</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-white/10 text-xs text-gray-300 space-y-2">
            <div className="font-bold text-white flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-neon-cyan" />
              ¿Por qué los Guardianes no se registran mediante formularios web?
            </div>
            <p className="text-gray-400 leading-relaxed text-[11px]">
              Para garantizar una descentralización y seguridad económica real, los Nodos Guardianes no pueden auto-proclamarse rellenando un campo de texto en una web (lo que permitiría ataques Sybil donde atacantes robarían las comisiones sin aportar servidores). Un Guardián es un nodo <code className="text-neon-purple font-mono">bicd</code> real que mantiene la red P2P viva 24/7 y se autentica mediante criptografía de clave pública en el puerto 6666.
            </p>
          </div>
        </div>
      </div>

      {/* How to deploy a new Guardian Node Guide */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
        <h2 className="font-orbitron text-lg font-bold text-white flex items-center gap-2">
          <Terminal className="w-5 h-5 text-neon-gold" />
          ¿Cómo desplegar tu propio Nodo Guardián?
        </h2>
        
        <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
          Cualquier miembro de la comunidad puede montar un Nodo Guardián soberano en un servidor Linux o en su ordenador para validar bloques y recibir una cuota fija de cada bloque y de las comisiones:
        </p>

        <div className="p-4 rounded-xl bg-black/70 border border-white/10 font-mono text-xs text-gray-300 space-y-3">
          <div className="text-gray-400"># Opción 1: En tu PC o servidor local con el asistente interactivo:</div>
          <div className="text-neon-green bg-black/50 p-2 rounded border border-white/5 select-all">
            ./iniciar_guardian.sh
          </div>
          <div className="text-gray-400"># Opción 2: Ejecutar el daemon bicd conectándose al swarm de guardianes:</div>
          <div className="text-neon-green bg-black/50 p-2 rounded border border-white/5 select-all">
            ./target/release/bicd --peer 192.168.0.20:6666
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-mono text-xs border border-white/10 flex items-center gap-2 transition-all"
          >
            <span>Ver Manual Oficial de Guardianes</span>
            <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
          </a>
        </div>
      </div>
    </div>
  );
};
