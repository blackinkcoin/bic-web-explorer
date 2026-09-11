import React, { useState } from 'react';
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
  Sparkles,
  Dice5,
  Ticket,
  HeartHandshake,
  Gift,
  Scale,
  EyeOff,
  Coins,
  Flame,
  ShieldCheck,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Sliders,
  HelpCircle,
  Info,
  Lock
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
  const isEs = lang === 'es';

  // Category filter for the 9 methodologies
  const [activeCategory, setActiveCategory] = useState<'all' | 'mining' | 'p2p' | 'security'>('all');
  const [expandedId, setExpandedId] = useState<string | null>('sueldo-base');

  // Interactive Simulator state
  const [simDevice, setSimDevice] = useState<'esp32' | 'laptop' | 'gamer' | 'farm'>('esp32');
  const [simArrival, setSimArrival] = useState<'early' | 'mid' | 'sniper'>('early');
  const [simStreak, setSimStreak] = useState<number>(2);
  const [simIpCount, setSimIpCount] = useState<number>(1);

  // 9 Methodologies Data Structure
  const methodologies = [
    {
      id: 'sueldo-base',
      category: 'mining',
      icon: Users,
      badge: '70% Emisión + 50% Fees',
      badgeColor: 'text-neon-cyan border-neon-cyan/40 bg-neon-cyan/10',
      title: isEs ? '1. Sueldo Base Minero (Reparto Igualitario 1/N)' : '1. Base Miner Salary (Strict 1/N Equal Split)',
      analogy: isEs 
        ? 'Como un sueldo base garantizado por estar sentado a la mesa de trabajo.' 
        : 'Like a guaranteed base salary for simply being seated at the collaborative work table.',
      humanDesc: isEs
        ? 'En otras criptomonedas, quien compra naves industriales con miles de tarjetas gráficas se queda con todo el dinero y la persona corriente no saca nada. En Black Ink Coin es al revés: el 70% de las nuevas monedas de cada bloque más el 50% de las comisiones de transacciones se reparten a partes exactamente iguales (1/N) entre todos los humanos que estén minando en la ronda de 30 segundos. Da igual si tu máquina costó 3€ o 3.000€: si aportas presencia y trabajo, cobras la misma cuota.'
        : 'In traditional cryptocurrencies, industrial mining farms take 99.9% of rewards. In Black Ink Coin, 70% of new block emission plus 50% of transaction fees are distributed in strictly identical equal shares (1/N) to every active human miner in the 30-second round. Whether your device costs $4 or $4,000, you receive the exact same base salary.',
      problemSolved: isEs
        ? 'Erradica el monopolio de las granjas multimillonarias. Minar vuelve a ser rentable y justo para cualquier persona con un ordenador o un chip económico en su habitación.'
        : 'Eliminates industrial mining farm monopolies. Mining becomes genuinely democratic, rewarding ordinary humans equally.',
      techDetail: isEs
        ? 'La función calculate_wheel_payouts calcula total_base_pot = (emisión * 70%) + (fees * 50%) y divide exactamente total_base_pot / N entre todas las direcciones validadas.'
        : 'Engine executes calculate_wheel_payouts dividing 70% block emission + 50% transaction fees evenly across all verified participant addresses.',
    },
    {
      id: 'jackpot-rollover',
      category: 'mining',
      icon: Dice5,
      badge: '23.34% + Rollover Acumulado',
      badgeColor: 'text-neon-gold border-neon-gold/40 bg-neon-gold/10',
      title: isEs ? '2. Bote Acumulativo de la Suerte (Jackpot Rollover 666)' : '2. Lucky Cumulative Jackpot (Rollover 666)',
      analogy: isEs
        ? 'Como el bote del Euromillones que no caduca: si nadie se lo lleva, se acumula para el siguiente.'
        : 'Like a rolling lottery jackpot: if no one wins it in this block, it carries over and doubles for the next.',
      humanDesc: isEs
        ? 'El 23.34% de cada bloque se reserva para un Bote Especial de la Suerte (1.5544 BIC de base). En cada bloque, la red tira un dado criptográfico determinista (~50% de probabilidad de caer). Si cae, un minero afortunado de la ronda se lleva el bote entero. Y si no cae en esa ronda, ¡el dinero no se pierde ni se quema!: se acumula al bote del siguiente bloque (1.55 BIC, luego 3.10 BIC, 4.66 BIC...), creando botes acumulados transparentes y llenos de emoción.'
        : '23.34% of block emission (1.5544 BIC base) goes into the Lucky Pot. Every 30s block, a deterministic cryptographic trigger rolls a ~50% chance to drop. If triggered, one qualifying miner takes the entire pot. If it does not trigger, the pot rolls over to the next block (1.55 → 3.10 → 4.66 BIC), producing huge, transparent rolling jackpots.',
      problemSolved: isEs
        ? 'Añade un incentivo emocionante y premios extraordinarios para los mineros constantes, con una lotería 100% matemática, abierta y sin trampas.'
        : 'Introduces massive gamified rewards without compromising equality, powered by 100% auditable on-chain entropy.',
      techDetail: isEs
        ? 'Activador criptográfico derivado de blake3(prev_hash || height || "_BIC_JACKPOT_TRIGGER_666"). Si el trigger es impar, el pote se acumula en ConsensusEngine.lucky_rollover_pot_hells.'
        : 'Blake3 cryptographic trigger determines rollover activation. Unawarded pots accumulate persistently in ConsensusEngine.lucky_rollover_pot_hells.',
    },
    {
      id: 'anti-sniper',
      category: 'mining',
      icon: Clock,
      badge: 'Filtro Anti-Sniper Δt',
      badgeColor: 'text-neon-pink border-neon-pink/40 bg-neon-pink/10',
      title: isEs ? '3. Fidelidad de Ronda y Escudo Anti-Sniper' : '3. Round Fidelity & Anti-Sniper Shield',
      analogy: isEs
        ? 'No puedes presentarte al último minuto de la jornada laboral y pretender cobrar el día entero.'
        : 'You cannot show up at the very last second of the workday and expect a full day salary.',
      humanDesc: isEs
        ? 'Un "sniper" es alguien con un procesador potente que espera al segundo 29.9 de una ronda de 30 segundos, manda una sola solución y pretende llevarse una tajada del sueldo de los demás sin haber colaborado. Black Ink Coin tiene un filtro estricto de permanencia: para cobrar en el bloque debes haber estado presente al menos 3 segundos (Δt ≥ 3s), o haber enviado más de 1 solución, o haber llegado en el primer 85% del tiempo de la ronda. Quien llega al último segundo con 1 sola solución queda fuera de ese reparto.'
        : 'A "sniper" is a fast computer that waits until second 29.9 of a 30s round to submit 1 share and siphon rewards from honest peers. Black Ink Coin strictly filters out snipers: miners must prove duration (Δt ≥ 3s), submit multiple shares, or arrive before the 85% round cutoff. Last-second snipers receive 0 for that round.',
      problemSolved: isEs
        ? 'Protege a los mineros fieles y constantes frente a bots oportunistas de última milésima de segundo.'
        : 'Protects honest continuous miners from opportunistic automated last-second snipers.',
      techDetail: isEs
        ? 'BlockRoundTracker verifica si active_duration_secs() >= 3 || valid_shares > 1 || first_seen_ts <= round_start + (duration * 0.85). Los snipers no entran en qualifying_addrs.'
        : 'BlockRoundTracker filters contributions by duration and arrival timestamps, disqualifying late 1-share arrivals from qualifying_addrs.',
    },
    {
      id: 'tickets-suerte',
      category: 'mining',
      icon: Ticket,
      badge: 'Techo Anti-ASIC (Máx. 3)',
      badgeColor: 'text-neon-green border-neon-green/40 bg-neon-green/10',
      title: isEs ? '4. Tickets de Suerte por Fidelidad (Techo Infranqueable: 1 a 3)' : '4. Fidelity Lucky Tickets (Anti-ASIC Cap: 1 to 3)',
      analogy: isEs
        ? 'Una rifa de pueblo donde nadie puede comprar más de 3 papeletas, por mucho dinero que tenga.'
        : 'A community raffle where no one can buy more than 3 tickets, no matter how rich they are.',
      humanDesc: isEs
        ? 'Para ganar el Bote de la Suerte, los mineros reciben tickets en cada bloque según su fidelidad: 1 ticket por aportar trabajo y presencia humana; +1 ticket extra si estuviste minando al menos la mitad de la ronda (≥ 15s) o enviaste 2 o más soluciones; y +1 ticket extra si mantienes una racha fiel minando de continuo (2 o más bloques seguidos). Pero con un límite de hierro: nadie en el mundo puede tener más de 3 tickets. Un usuario normal en su casa con racha tiene exactamente la misma probabilidad máxima que una multinacional.'
        : 'To win the Lucky Pot, miners earn tickets based on fidelity: 1 ticket for base qualification; +1 extra ticket for sustained round presence (≥ 15s or ≥ 2 shares); +1 extra ticket for active block streaks (≥ 2 consecutive blocks). Hard cap: maximum 3 tickets per miner. A home user with a streak has the exact same top probability as a multi-million dollar data center.',
      problemSolved: isEs
        ? 'Neutraliza por completo el poder del hardware especializado (ASICs) y de los grandes capitales en los sorteos de la red.'
        : 'Completely neutralizes ASIC advantages and capital concentration in network prize draws.',
      techDetail: isEs
        ? 'El algoritmo asigna min(tickets, 3) al bombo virtual y extrae el ganador mediante una semilla determinista Blake3 derivada del hash del bloque.'
        : 'Consensus engine assigns tickets with min(tickets, 3) ceiling, selecting winners pseudo-randomly via Blake3 entropy.',
    },
    {
      id: 'consorcio-p2p',
      category: 'p2p',
      icon: HeartHandshake,
      badge: 'Comisiones 50% / 50%',
      badgeColor: 'text-neon-purple border-neon-purple/40 bg-neon-purple/10',
      title: isEs ? '5. Consorcio P2P Minero-Guardián (Comisiones 50/50)' : '5. P2P Consortium (50/50 Transaction Fees)',
      analogy: isEs
        ? 'Los que fabrican el producto y los que cuidan la tienda se reparten las ganancias a medias.'
        : 'Those who craft the product and those who keep the store open 24/7 split profits 50/50.',
      humanDesc: isEs
        ? 'La red necesita a los Mineros (crean monedas con entropía humana) y a los Guardianes (nodos servidores 24/7 que guardan el libro de cuentas y procesan transferencias). En Black Ink Coin son socios al 50%: los guardianes reciben un 6.66% de emisión fija para cubrir costes de servidor desde el primer día, y el 100% de las comisiones de transferencias se divide al 50%: la mitad va directa a los mineros de la ronda y la otra mitad a los guardianes activos. Si la red se usa mucho, todos ganan más.'
        : 'The network needs Miners (minting coins with human entropy) and Guardians (24/7 nodes securing the ledger and serving jobs). In Black Ink Coin they are 50/50 partners: guardians receive 6.66% block emission subsidy, and 100% of transaction fees are split 50% to active miners and 50% to active guardians. When adoption rises, everyone profits together.',
      problemSolved: isEs
        ? 'Elimina la guerra histórica entre mineros y nodos. Crea una alianza económica donde ambos estamentos prosperan juntos.'
        : 'Eliminates traditional conflicts between miners and node operators, uniting them in shared fee prosperity.',
      techDetail: isEs
        ? 'Las comisiones de transacciones se dividen: 50% al fondo de mineros (añadido al Sueldo Base) y 50% dividido equitativamente entre los guardianes registrados en active_guardians.'
        : 'Fees are split: 50% to miner base pot and 50% divided equally among all registered active guardian nodes.',
    },
    {
      id: 'toque-humano',
      category: 'mining',
      icon: Fingerprint,
      badge: 'Biometría Física Real',
      badgeColor: 'text-neon-pink border-neon-pink/40 bg-neon-pink/10',
      title: isEs ? '6. Prueba de Toque Humano (Proof of Human Touch)' : '6. Proof of Human Touch (Biological Entropy)',
      analogy: isEs
        ? 'El ordenador propone la solución matemática, pero solo la mano de un ser vivo puede firmarla.'
        : 'The computer finds the math, but only a living human hand has the power to seal it.',
      humanDesc: isEs
        ? 'Para evitar que centros de datos invisibles y bots automáticos minen en la sombra sin personas, el protocolo exige una firma biológica física: en el ordenador, cuando encuentras un share pulsas la barra espaciadora (el tiempo de reacción de tus neuronas genera una micro-entropía imposible de simular); y en el chip ESP32 de 3€ apoyas el dedo sobre su pin táctil (GPIO 32), usando la capacitancia electrostática natural de tu cuerpo como firma de vida.'
        : 'To prevent headless server farms and AI bots from silently mining without humans, the protocol requires a physical biological signature: on PC, pressing spacebar captures neural reaction-time entropy; on an ESP32 microchip, touching GPIO 32 injects real physical electrostatic capacitance from your fingertip.',
      problemSolved: isEs
        ? 'Garantiza que el dinero nuevo va a parar a personas de carne y hueso, no a algoritmos de inteligencia artificial o granjas de bots.'
        : 'Ensures new currency flows into real human hands rather than unmanned corporate data centers.',
      techDetail: isEs
        ? 'Verificación de challenge touch_challenge en cada submit. En ESP32 se muestrea touchRead(32) < 40; en PC se calcula la variación temporal de pulsación de tecla.'
        : 'Touch challenge verification on each submission, measuring capacitive touchRead(32) on microcontrollers and reaction delta-time on desktop clients.',
    },
    {
      id: 'anti-sybil',
      category: 'security',
      icon: ShieldAlert,
      badge: 'Subdivisión 1/N por IP',
      badgeColor: 'text-neon-cyan border-neon-cyan/40 bg-neon-cyan/10',
      title: isEs ? '7. Escudo Anti-Granjas (Anti-Sybil por Subdivisión de IP)' : '7. Anti-Farm Shield (Sublinear IP Subdivision)',
      analogy: isEs
        ? 'Si compras 20 billetes de tren para ti solo, no ocupas 20 asientos ni te pagan 20 sueldos.'
        : 'Buying 20 train tickets for yourself does not grant you 20 seats or 20 salaries.',
      humanDesc: isEs
        ? '¿Y si alguien compra 50 chips ESP32 de 3€ y los conecta todos en el salón de su casa a la misma red WiFi? El sistema rastrea las IPs de origen. Si detecta 50 dispositivos en una misma IP, divide la recompensa de esa conexión entre 50. Los 50 aparatos juntos ganarán en total exactamente lo mismo que una persona normal con un solo chip en su mesita de noche. Montar granjas masivas en casa no genera ningún beneficio extra.'
        : 'What if someone buys 50 cheap ESP32 boards and connects all of them to their home WiFi? The network groups devices by public IP. If 50 devices connect from 1 IP, the reward quota for that IP is divided by 50. All 50 devices combined earn the exact same total as a single device on a neighbor home.',
      problemSolved: isEs
        ? 'Desactiva por completo el incentivo de acaparar hardware en masa para intentar secuestrar las recompensas de la red.'
        : 'Destroys any financial incentive to hoard cheap hardware in home farms to extract unfair payouts.',
      techDetail: isEs
        ? 'IpMiningTracker monitoriza dispositivos concurrentes por IP y aplica una función sublineal inversa al número de clientes registrados en la misma IP pública.'
        : 'IpMiningTracker tracks devices per public IP, applying inverse sublinear reward weighting to prevent Sybil attacks.',
    },
    {
      id: 'privacidad-zero-knowledge',
      category: 'security',
      icon: Lock,
      badge: 'Stealth + Pedersen Cifrado',
      badgeColor: 'text-neon-purple border-neon-purple/40 bg-neon-purple/10',
      title: isEs ? '8. Privacidad Militar de Nivel Cero-Conocimiento (Shielded L1)' : '8. Military-Grade Zero-Knowledge Privacy (Shielded L1)',
      analogy: isEs
        ? 'Pagar en efectivo con un sobre lacrado: nadie sabe cuánto dinero hay dentro ni quién lo mandó, pero el banco comprueba matemáticamente que no son billetes falsos.'
        : 'Paying in cash inside a sealed envelope: no bystander knows the amount or sender, yet the network mathematically verifies it is not counterfeit.',
      humanDesc: isEs
        ? 'En las criptomonedas abiertas habituales, tu saldo y todos tus pagos son públicos: cualquiera con tu dirección puede ver lo que gastas y lo que tienes. En Black Ink Coin es como el dinero en efectivo: tus pagos van a Direcciones Invisibles (Stealth Addresses) de un solo uso que nunca revelan tu identidad, los importes van Cifrados con Compromisos de Pedersen (solo tú y el receptor sabéis cuánto dinero se envió), y dispones de una Clave de Auditoría (View-Key) para que un gestor pueda revisar tus cuentas sin poder gastar jamás un céntimo.'
        : 'In public blockchains, anyone who knows your address can see your balance and payment history. Black Ink Coin operates like physical cash: payments use one-time Stealth Addresses (your real address is never on-chain), amounts are encrypted via Pedersen Commitments, and optional View-Keys allow audit-only scanning without spend authority.',
      problemSolved: isEs
        ? 'Protege tu privacidad financiera personal frente a espionaje, filtraciones de datos, empresas rastreadoras y delincuentes.'
        : 'Protects fundamental financial privacy against commercial surveillance, data brokers, and extortion.',
      techDetail: isEs
        ? 'Criptografía Ristretto255 / Curve25519 con firmas Schnorr Ed25519, compromisos homomórficos de Pedersen y nullifiers para prevenir doble gasto sin revelar el historial UTXO.'
        : 'Ristretto255 / Curve25519 cryptography with Pedersen homomorphic commitments, stealth addresses, and cryptographic nullifiers.',
    },
    {
      id: 'dilatacion-geometrica',
      category: 'p2p',
      icon: Flame,
      badge: '666M Capped + Rondas Elásticas',
      badgeColor: 'text-neon-gold border-neon-gold/40 bg-neon-gold/10',
      title: isEs ? '9. Política Monetaria 666 y Rondas Elásticas (Dilatación Geométrica)' : '9. 666 Monetary Policy & Elastic Dilatation',
      analogy: isEs
        ? 'Un reloj cósmico que estira el tiempo para que el libro de cuentas quepa en cualquier ordenador durante medio siglo.'
        : 'A cosmic clock that gently dilates block time so the ledger fits on ordinary computers for over 50 years.',
      humanDesc: isEs
        ? 'Black Ink Coin tiene un límite inmutable de 666,666,666 BIC (nadie puede imprimir más dinero jamás). Pero además soluciona el gran problema del almacenamiento: al principio los bloques duran 30 segundos para ser rápidos, pero con el paso de los años y las 10 Eras de Halving, la duración de los bloques se alarga suavemente de forma geométrica. Así la red emite monedas de forma gradual durante más de 55 años sin que el historial de transacciones pese terabytes, permitiendo que cualquier persona con un ordenador modesto siga siendo guardián sin comprar discos duros gigantes.'
        : 'Black Ink Coin enforces an immutable 666,666,666 BIC hard cap (no inflation ever). To solve the blockchain storage bloat problem, early blocks run at 30 seconds for agility, while block duration geometrically dilates over 10 halving eras (~55 years). The entire ledger remains lightweight and runnable on ordinary hardware.',
      problemSolved: isEs
        ? 'Evita que el tamaño gigante de la blockchain expulse a los usuarios normales y centralice los nodos en servidores de corporaciones.'
        : 'Prevents blockchain bloat from forcing node operation into corporate cloud servers, keeping sovereign verification accessible.',
      techDetail: isEs
        ? 'Fórmula geométrica: T_round(h) = T_0 * (1 + h / H_halving)^1.666 limitada a 16.648s (~4.6h), manteniendo el ledger ligero y sostenible.'
        : 'Geometric dilatation formula scales block duration up to 16,648s cap across 10 halving eras over 55+ years.',
    },
  ];

  const filteredMethodologies = activeCategory === 'all' 
    ? methodologies 
    : methodologies.filter(m => m.category === activeCategory);

  // Calculate live simulator outputs
  const simIsSniper = simArrival === 'sniper';
  const simQualifies = !simIsSniper;
  
  let simTickets = 1;
  if (simArrival === 'early') simTickets += 1;
  if (simStreak >= 2) simTickets += 1;
  simTickets = Math.min(simTickets, 3); // Anti-ASIC cap

  const baseBlockReward = miningStats?.next_block_reward_bic ?? 6.66;
  const baseMinerPool = baseBlockReward * 0.70;
  const luckyJackpotPot = miningStats?.current_jackpot_bic ?? 1.5544;
  
  // Simulated share if N=5 miners
  const simMinerCount = 5;
  const simRawPayout = simQualifies ? (baseMinerPool / simMinerCount) : 0;
  const simEffectivePayout = simRawPayout / simIpCount;

  return (
    <div className="space-y-12 animate-in fade-in duration-300 pb-16">
      {/* 1. HERO HEADER */}
      <div className="relative overflow-hidden rounded-3xl glass-panel p-8 sm:p-12 border border-neon-cyan/40 shadow-card-glow">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-neon-cyan/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-neon-pink/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan text-xs font-mono">
            <Sparkles className="w-4 h-4 text-neon-pink animate-pulse" />
            <span>{isEs ? 'PROTOCOLO DE CONSENSO REVOLUCIONARIO' : 'REVOLUTIONARY DEMOCRATIC CONSENSUS'}</span>
          </div>

          <h1 className="font-orbitron text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {isEs ? 'Metodologías y Funcionamiento de Black Ink Coin' : 'Black Ink Coin Methodologies & Inner Mechanics'}
          </h1>

          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            {isEs 
              ? 'Explicado de manera sencilla y transparente para cualquier persona: descubre cómo funciona la tecnología que elimina las granjas industriales millonarias y devuelve el poder financiero a los seres humanos.'
              : 'Explained in clear, accessible terms for ordinary humans: discover how democratic consensus neutralizes industrial mining cartels and puts financial sovereignty back in human hands.'}
          </p>
        </div>
      </div>

      {/* 2. LIVE TELEMETRY BAR */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4 font-mono text-xs">
        {/* Current Round Timer */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-4 sm:p-5 border border-white/5 space-y-1.5">
          <div className="flex items-center justify-between text-gray-400 text-[11px]">
            <span>{isEs ? 'TIEMPO RONDA' : 'ROUND TIMER'}</span>
            <Clock className="w-4 h-4 text-neon-cyan" />
          </div>
          <div className="font-orbitron text-xl sm:text-2xl font-extrabold text-neon-cyan">
            {miningJob?.round_time_remaining_secs ?? 0}s <span className="text-xs text-gray-400">/ {miningStats?.round_duration_secs ?? 30}s</span>
          </div>
          <div className="text-[10px] text-gray-400">
            {isEs ? 'Ventana elástica de consenso' : 'Elastic consensus window'}
          </div>
        </div>

        {/* Current Jackpot Pot */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-4 sm:p-5 border border-neon-gold/30 bg-neon-gold/5 space-y-1.5">
          <div className="flex items-center justify-between text-neon-gold text-[11px] font-bold">
            <span>{isEs ? '🎰 BOTE DE LA SUERTE' : '🎰 LUCKY JACKPOT'}</span>
            <Dice5 className="w-4 h-4 text-neon-gold animate-bounce" />
          </div>
          <div className="font-orbitron text-xl sm:text-2xl font-extrabold text-white">
            {(miningStats?.current_jackpot_bic ?? 1.5544).toFixed(4)} <span className="text-xs text-neon-gold">BIC</span>
          </div>
          <div className="text-[10px] text-neon-gold font-mono">
            {miningStats?.jackpot_rollover_bic && miningStats.jackpot_rollover_bic > 0
              ? `${isEs ? '🔥 ¡ROLLOVER ACTIVO!' : '🔥 ROLLOVER ACTIVE!'} (+${miningStats.jackpot_rollover_bic.toFixed(2)} BIC)`
              : (isEs ? '23.34% base + Rollover' : '23.34% base + Rollover')}
          </div>
        </div>

        {/* Base Salary Pot */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-4 sm:p-5 border border-white/5 space-y-1.5">
          <div className="flex items-center justify-between text-gray-400 text-[11px]">
            <span>{isEs ? 'SUELDO BASE (70%)' : 'BASE SALARY (70%)'}</span>
            <Users className="w-4 h-4 text-neon-pink" />
          </div>
          <div className="font-orbitron text-xl sm:text-2xl font-extrabold text-neon-pink">
            {((miningStats?.next_block_reward_bic ?? 6.66) * 0.70).toFixed(4)} <span className="text-xs text-white">BIC</span>
          </div>
          <div className="text-[10px] text-gray-400">
            {isEs ? 'Reparto 1/N garantizado' : 'Guaranteed 1/N equal split'}
          </div>
        </div>

        {/* Active Miners */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-4 sm:p-5 border border-white/5 space-y-1.5">
          <div className="flex items-center justify-between text-gray-400 text-[11px]">
            <span>{isEs ? 'MINEROS ACTIVOS' : 'ACTIVE MINERS'}</span>
            <Activity className="w-4 h-4 text-neon-green" />
          </div>
          <div className="font-orbitron text-xl sm:text-2xl font-extrabold text-neon-green">
            {miningStats?.active_collaborative_miners ?? 0}
          </div>
          <div className="text-[10px] text-gray-400">
            {isEs ? 'Humanos colaborando' : 'Humans collaborating'}
          </div>
        </div>

        {/* Fee Split */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-4 sm:p-5 border border-white/5 space-y-1.5 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-gray-400 text-[11px]">
            <span>{isEs ? 'CONSORCIO FEES' : 'P2P FEE SPLIT'}</span>
            <HeartHandshake className="w-4 h-4 text-neon-purple" />
          </div>
          <div className="font-orbitron text-lg sm:text-xl font-extrabold text-neon-purple">
            50% / 50%
          </div>
          <div className="text-[10px] text-gray-400 truncate">
            {isEs ? 'Mineros & Guardianes' : 'Miners & Guardians'}
          </div>
        </div>
      </div>

      {/* 3. VISUAL 100% BLOCK REWARD DISTRIBUTION */}
      <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-white/10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-orbitron text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
              <Scale className="w-6 h-6 text-neon-cyan" />
              {isEs ? '¿Cómo se Reparte Exactamente Cada Bloque? (100% Transparente)' : 'Exact Block Reward Breakdown (100% Transparent)'}
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm">
              {isEs 
                ? 'Ninguna entidad central, fundación ni empresa se queda con nada. Todo se divide matemáticamente en la blockchain:'
                : 'Zero foundation pre-mines or corporate cuts. Everything is split strictly by protocol math:'}
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-mono bg-white/10 text-white font-bold border border-white/20 self-start sm:self-auto">
            100% On-Chain
          </span>
        </div>

        {/* Multi-segment Progress Bar */}
        <div className="space-y-2">
          <div className="h-6 w-full rounded-xl overflow-hidden flex bg-black/60 border border-white/10 p-0.5">
            <div 
              style={{ width: '70%' }} 
              className="h-full bg-gradient-to-r from-neon-cyan to-blue-500 rounded-l-lg flex items-center justify-center text-[11px] font-mono font-bold text-black"
              title="70.00% Sueldo Base Minero"
            >
              70% Base Minero (1/N)
            </div>
            <div 
              style={{ width: '23.34%' }} 
              className="h-full bg-gradient-to-r from-neon-gold to-amber-500 flex items-center justify-center text-[11px] font-mono font-bold text-black truncate px-1"
              title="23.34% Bote de la Suerte Rollover"
            >
              23.34% Bote Rollover
            </div>
            <div 
              style={{ width: '6.66%' }} 
              className="h-full bg-gradient-to-r from-neon-purple to-purple-600 rounded-r-lg flex items-center justify-center text-[10px] font-mono font-bold text-white"
              title="6.66% Guardián Subsidio"
            >
              6.66%
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs pt-2">
            <div className="p-3.5 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 text-gray-300 space-y-1">
              <div className="text-neon-cyan font-bold flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-neon-cyan" />
                {isEs ? '70.00% Sueldo Base Minero' : '70.00% Miner Base Pay'}
              </div>
              <p className="text-[11px] text-gray-400">
                {isEs 
                  ? 'Se divide en partes iguales (1/N) entre todos los mineros con presencia real en la ronda.'
                  : 'Divided strictly equally (1/N) among all miners with proven round presence.'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-neon-gold/10 border border-neon-gold/30 text-gray-300 space-y-1">
              <div className="text-neon-gold font-bold flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-neon-gold" />
                {isEs ? '23.34% Bote de la Suerte (Rollover)' : '23.34% Lucky Pot (Rollover)'}
              </div>
              <p className="text-[11px] text-gray-400">
                {isEs 
                  ? 'Sorteo por tickets de fidelidad (~50% probabilidad). Si no cae, se acumula para el siguiente.'
                  : 'Fidelity lottery (~50% chance). If unawarded, rolls over and accumulates indefinitely.'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-neon-purple/10 border border-neon-purple/30 text-gray-300 space-y-1">
              <div className="text-neon-purple font-bold flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-neon-purple" />
                {isEs ? '6.66% Subsidio de Guardián' : '6.66% Guardian Subsidies'}
              </div>
              <p className="text-[11px] text-gray-400">
                {isEs 
                  ? 'Ingreso fijo para nodos que mantienen el Ledger 24/7 y alimentan a los mineros.'
                  : 'Fixed revenue for 24/7 nodes maintaining ledger persistence and serving mining jobs.'}
              </p>
            </div>
          </div>
        </div>

        {/* Plus 50/50 Transaction Fees Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-neon-green/15 via-emerald-950/40 to-neon-green/15 border border-neon-green/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-neon-green/20 text-neon-green">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-bold text-sm">
                {isEs ? '⚡ + 100% de las Comisiones de Transacción repartidas al 50/50' : '⚡ + 100% of Transaction Fees Shared 50/50'}
              </div>
              <div className="text-gray-300 text-[11px]">
                {isEs 
                  ? 'La mitad de las fees va a engordar el Sueldo Base de los mineros y la otra mitad a los guardianes.'
                  : 'Half the fee pool boosts miner base salary and half is distributed to active guardians.'}
              </div>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-neon-green/20 text-neon-green font-bold text-xs shrink-0">
            {isEs ? 'Consorcio P2P Activo' : 'P2P Consortium Active'}
          </span>
        </div>
      </div>

      {/* 4. THE 9 METHODOLOGIES EXPLAINED FOR HUMANS */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-pink/10 border border-neon-pink/30 text-neon-pink text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isEs ? 'GUÍA COMPLETA Y TRANSPARENTE' : 'COMPLETE TRANSPARENT GUIDE'}</span>
            </div>
            <h2 className="font-orbitron text-2xl sm:text-3xl font-extrabold text-white">
              {isEs ? 'Las 9 Grandes Metodologías de Black Ink Coin' : 'The 9 Core Black Ink Coin Methodologies'}
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm">
              {isEs 
                ? 'Haz clic en cada tarjeta para ver la analogía cotidiana, la explicación en lenguaje sencillo y cómo soluciona los fallos de las criptomonedas antiguas.'
                : 'Click any card to read everyday analogies, plain-language human explanations, and the exact legacy flaws they solve.'}
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap gap-2 font-mono text-xs">
            {[
              { id: 'all', label: isEs ? 'Todas (9)' : 'All (9)' },
              { id: 'mining', label: isEs ? 'Minería Democrática' : 'Democratic Mining' },
              { id: 'p2p', label: isEs ? 'Consorcio P2P' : 'P2P Consortium' },
              { id: 'security', label: isEs ? 'Privacidad & Escudos' : 'Privacy & Security' },
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id as any);
                  sound.playClick();
                }}
                className={`px-3 py-1.5 rounded-xl border transition-all ${
                  activeCategory === cat.id
                    ? 'bg-neon-cyan/20 border-neon-cyan text-neon-cyan shadow-glow-cyan font-bold'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 gap-4">
          {filteredMethodologies.map((m) => {
            const isExpanded = expandedId === m.id;
            const IconComponent = m.icon;

            return (
              <div 
                key={m.id}
                className={`glass-panel rounded-3xl border transition-all duration-300 overflow-hidden ${
                  isExpanded ? 'border-neon-cyan/50 shadow-card-glow bg-white/[0.04]' : 'border-white/10 hover:border-white/20'
                }`}
              >
                {/* Clickable Header */}
                <div 
                  onClick={() => {
                    setExpandedId(isExpanded ? null : m.id);
                    sound.playClick();
                  }}
                  className="p-6 cursor-pointer flex items-center justify-between gap-4 select-none"
                >
                  <div className="flex items-start sm:items-center gap-4">
                    <div className={`p-3 rounded-2xl border shrink-0 ${m.badgeColor}`}>
                      <IconComponent className="w-6 h-6" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-orbitron text-base sm:text-lg font-bold text-white">
                          {m.title}
                        </h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${m.badgeColor}`}>
                          {m.badge}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-neon-gold italic font-mono">
                        "{m.analogy}"
                      </p>
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 shrink-0">
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-neon-cyan" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>

                {/* Expandable Body */}
                {isExpanded && (
                  <div className="px-6 pb-6 pt-2 border-t border-white/5 space-y-5 animate-in fade-in duration-200">
                    {/* Plain Human Explanation */}
                    <div className="space-y-2">
                      <div className="text-xs font-orbitron font-bold text-neon-cyan uppercase flex items-center gap-1.5">
                        <Info className="w-4 h-4" />
                        {isEs ? 'Explicación para Humanos Corrientes' : 'Plain-Language Human Explanation'}
                      </div>
                      <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                        {m.humanDesc}
                      </p>
                    </div>

                    {/* Problem Solved & Tech Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 font-mono text-xs">
                      <div className="p-4 rounded-2xl bg-black/50 border border-neon-pink/30 space-y-1.5">
                        <div className="text-neon-pink font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-neon-pink" />
                          {isEs ? '¿Qué fallo histórico soluciona?' : 'What legacy flaw does this solve?'}
                        </div>
                        <p className="text-gray-300 text-[11px] leading-relaxed">
                          {m.problemSolved}
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-1.5">
                        <div className="text-gray-300 font-bold flex items-center gap-1.5">
                          <Terminal className="w-4 h-4 text-neon-cyan" />
                          {isEs ? 'Detalle Técnico Criptográfico' : 'Underlying Cryptographic Mechanism'}
                        </div>
                        <p className="text-gray-400 text-[11px] leading-relaxed font-mono">
                          {m.techDetail}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. INTERACTIVE PARTICIPATION SIMULATOR */}
      <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-neon-gold/30 shadow-card-glow space-y-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-gold/10 border border-neon-gold/30 text-neon-gold text-xs font-mono">
            <Sliders className="w-3.5 h-3.5" />
            <span>{isEs ? 'SIMULADOR EN VIVO' : 'LIVE PARTICIPATION SIMULATOR'}</span>
          </div>
          <h2 className="font-orbitron text-2xl sm:text-3xl font-extrabold text-white">
            {isEs ? 'Simula Tu Minería: Comprueba Tu Sueldo y Tus Tickets' : 'Simulate Your Mining: Check Salary & Tickets'}
          </h2>
          <p className="text-gray-300 text-xs sm:text-sm max-w-3xl">
            {isEs 
              ? 'Prueba tú mismo las reglas democráticas: selecciona tu hardware, tu tiempo de llegada y tu racha para ver al instante cómo te califica el algoritmo de consenso.'
              : 'Test the democratic rules yourself: choose your hardware, arrival timing, and streak to see exactly how consensus logic evaluates your payout.'}
          </p>
        </div>

        {/* Simulator Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
          {/* 1. Device Selection */}
          <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-3">
            <label className="text-gray-300 font-bold block">{isEs ? '1. Tu Dispositivo:' : '1. Your Device:'}</label>
            <div className="space-y-2">
              {[
                { id: 'esp32', label: 'ESP32 (3 €)', desc: 'Sensor biológico' },
                { id: 'laptop', label: 'Portátil común', desc: 'CPU 4 núcleos' },
                { id: 'gamer', label: 'PC Gaming potente', desc: 'CPU 16 núcleos' },
                { id: 'farm', label: 'Granja 50.000 €', desc: 'Supercomputador' },
              ].map(d => (
                <button
                  key={d.id}
                  onClick={() => { setSimDevice(d.id as any); sound.playClick(); }}
                  className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                    simDevice === d.id ? 'bg-neon-cyan/20 border-neon-cyan text-white font-bold' : 'bg-white/5 border-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  <span>{d.label}</span>
                  <span className="text-[10px] text-gray-400">{d.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Arrival Timing */}
          <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-3">
            <label className="text-gray-300 font-bold block">{isEs ? '2. Momento de Llegada:' : '2. Round Arrival:'}</label>
            <div className="space-y-2">
              {[
                { id: 'early', label: isEs ? 'Toda la ronda (30s)' : 'Full round (30s)', badge: '+1 Ticket' },
                { id: 'mid', label: isEs ? 'Mitad de ronda (15s)' : 'Mid round (15s)', badge: 'Pasa filtro' },
                { id: 'sniper', label: isEs ? 'Último seg (Sniper)' : 'Last sec (Sniper)', badge: '❌ Sniper' },
              ].map(a => (
                <button
                  key={a.id}
                  onClick={() => { setSimArrival(a.id as any); sound.playClick(); }}
                  className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                    simArrival === a.id 
                      ? (a.id === 'sniper' ? 'bg-red-500/20 border-red-500 text-red-300 font-bold' : 'bg-neon-pink/20 border-neon-pink text-white font-bold')
                      : 'bg-white/5 border-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  <span>{a.label}</span>
                  <span className={`text-[10px] ${a.id === 'sniper' ? 'text-red-400 font-bold' : 'text-neon-cyan'}`}>{a.badge}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Mining Streak */}
          <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-3">
            <label className="text-gray-300 font-bold block">{isEs ? '3. Racha Consecutiva:' : '3. Mining Streak:'}</label>
            <div className="space-y-2">
              {[
                { count: 1, label: isEs ? '1er Bloque (Inicio)' : '1st Block (Start)', desc: '1 ticket base' },
                { count: 2, label: isEs ? '2 Bloques seguidos' : '2 Consecutive', desc: '+1 Ticket racha' },
                { count: 5, label: isEs ? '5+ Bloques seguidos' : '5+ Streak', desc: 'Racha máxima' },
              ].map(s => (
                <button
                  key={s.count}
                  onClick={() => { setSimStreak(s.count); sound.playClick(); }}
                  className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                    simStreak === s.count ? 'bg-neon-gold/20 border-neon-gold text-white font-bold' : 'bg-white/5 border-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  <span>{s.label}</span>
                  <span className="text-[10px] text-neon-gold">{s.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 4. IP Devices count */}
          <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-3">
            <label className="text-gray-300 font-bold block">{isEs ? '4. Aparatos en tu IP:' : '4. Devices on IP:'}</label>
            <div className="space-y-2">
              {[
                { count: 1, label: isEs ? '1 Dispositivo (Normal)' : '1 Device (Honest)', desc: '100% Cuota' },
                { count: 5, label: isEs ? '5 Dispositivos' : '5 Devices', desc: 'Cuota ÷ 5' },
                { count: 50, label: isEs ? '50 Dispositivos (Granja)' : '50 Devices (Farm)', desc: 'Cuota ÷ 50' },
              ].map(ip => (
                <button
                  key={ip.count}
                  onClick={() => { setSimIpCount(ip.count); sound.playClick(); }}
                  className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                    simIpCount === ip.count ? 'bg-neon-purple/20 border-neon-purple text-white font-bold' : 'bg-white/5 border-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  <span>{ip.label}</span>
                  <span className="text-[10px] text-gray-400">{ip.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Simulator Results Dashboard */}
        <div className="p-6 rounded-3xl bg-black/70 border border-white/10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <div className="text-xs font-mono text-gray-400">{isEs ? 'RESULTADO DEL PROTOCOLO EN ESTE BLOQUE:' : 'CONSENSUS EVALUATION RESULT:'}</div>
              <div className="text-lg font-orbitron font-bold text-white flex items-center gap-2">
                {simQualifies ? (
                  <span className="text-neon-green flex items-center gap-1.5">
                    <CheckCircle2 className="w-5 h-5" /> {isEs ? 'CALIFICADO PARA RECOMPENSA' : 'QUALIFIED FOR REWARDS'}
                  </span>
                ) : (
                  <span className="text-red-400 flex items-center gap-1.5">
                    <ShieldAlert className="w-5 h-5" /> {isEs ? 'RECHAZADO POR FILTRO ANTI-SNIPER' : 'REJECTED BY ANTI-SNIPER SHIELD'}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-gray-400">{isEs ? 'Tickets de la Suerte:' : 'Lucky Tickets:'}</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3].map(tNum => (
                  <span 
                    key={tNum} 
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${
                      simQualifies && tNum <= simTickets 
                        ? 'bg-neon-gold text-black shadow-glow-gold' 
                        : 'bg-white/10 text-gray-500'
                    }`}
                  >
                    🎟️ #{tNum}
                  </span>
                ))}
              </div>
              {simTickets === 3 && (
                <span className="text-[10px] font-mono text-neon-green font-bold">
                  ({isEs ? 'TECHO MÁXIMO ANTI-ASIC' : 'TOP ANTI-ASIC CAP'})
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
              <span className="text-gray-400">{isEs ? 'Sueldo Base Estimado:' : 'Estimated Base Pay:'}</span>
              <div className="font-orbitron text-2xl font-bold text-neon-cyan">
                {simEffectivePayout.toFixed(4)} <span className="text-xs text-white">BIC</span>
              </div>
              <div className="text-[10px] text-gray-400">
                {simQualifies 
                  ? (simIpCount > 1 ? `${isEs ? 'Dividido por' : 'Split by'} ${simIpCount} ${isEs ? 'en tu IP' : 'on IP'}` : (isEs ? '100% íntegro (1 humano = 1 parte)' : '100% full share'))
                  : (isEs ? '0 BIC (Sniper no cobra)' : '0 BIC (Sniper penalty)')}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
              <span className="text-gray-400">{isEs ? 'Bote Rollover al que Optas:' : 'Eligible Rolling Jackpot:'}</span>
              <div className="font-orbitron text-2xl font-bold text-neon-gold">
                {luckyJackpotPot.toFixed(4)} <span className="text-xs text-white">BIC</span>
              </div>
              <div className="text-[10px] text-neon-gold">
                {simQualifies 
                  ? `${simTickets} ${isEs ? 'tickets de suerte asignados' : 'lucky tickets assigned'}`
                  : (isEs ? 'Sin derecho a tickets' : 'No tickets earned')}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
              <span className="text-gray-400">{isEs ? 'Ventaja de Granja / ASIC:' : 'ASIC / Hardware Advantage:'}</span>
              <div className="font-orbitron text-2xl font-bold text-neon-green">
                0.00 %
              </div>
              <div className="text-[10px] text-gray-400">
                {simDevice === 'farm'
                  ? (isEs ? '¡Un supercomputador gana exactamente lo mismo que el chip de 3€!' : 'A supercomputer earns the exact same as a $4 chip!')
                  : (isEs ? 'Igualdad matemática garantizada' : 'Strict mathematical equality')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6. HARDWARE CLIENTS & GETTING STARTED */}
      <div className="space-y-6">
        <h2 className="font-orbitron text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <Terminal className="w-5 h-5 text-neon-cyan" />
          {isEs ? 'Empieza a Minar en 2 Minutos (Cero Complicaciones)' : 'Start Mining in 2 Minutes (Zero Complexity)'}
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
                {isEs 
                  ? 'Aplicación con interfaz gráfica en tiempo real. Muestra el Bote Acumulativo en vivo, tu racha de bloques, selector de guardianes con Auto-Failover y sonido acústico para pulsar la barra espaciadora cuando encuentres una share.'
                  : 'Desktop client with real-time GUI. Displays rolling jackpots, mining streaks, guardian pool auto-failover, and audio alerts to press spacebar when a share is found.'}
              </p>

              <div className="p-4 rounded-xl bg-black/50 border border-white/5 font-mono text-xs text-gray-300 space-y-1.5">
                <div className="text-neon-pink font-bold">{isEs ? 'Paso a paso:' : 'Quick Steps:'}</div>
                <div>1. {isEs ? 'Descarga el paquete para tu sistema operativo' : 'Download package for your OS'}</div>
                <div>2. {isEs ? 'Ejecuta el archivo del minero' : 'Run the miner executable'}</div>
                <div>3. {isEs ? 'Introduce tu dirección' : 'Enter your address'} <span className="text-neon-cyan">bic666_...</span></div>
                <div>4. {isEs ? 'Pulsa espacio cuando te avise la pantalla' : 'Press spacebar when prompted'}</div>
              </div>
            </div>

            <Link
              to="/downloads"
              onClick={() => sound.playClick()}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-neon-pink/20 hover:bg-neon-pink text-neon-pink hover:text-white font-orbitron text-xs font-bold tracking-wider border border-neon-pink/50 transition-all shadow-glow-pink"
            >
              <Download className="w-4 h-4" />
              {isEs ? 'Descargar Minero Oficial de Escritorio' : 'Download Desktop Miner Package'}
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
                    <span className="text-xs font-mono text-gray-400">{isEs ? 'Chip de 3€ / Autónomo' : '$4 Autonomous Chip'}</span>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20">
                  Hardware
                </span>
              </div>

              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                {isEs 
                  ? 'Dispositivo físico independiente que se conecta a tu WiFi y consume menos de 1 vatio. Cuando toca sellar el bloque, apoyas la yema del dedo en el pin GPIO 32 para inyectar tu capacitancia biológica real.'
                  : 'Independent IoT hardware connecting directly to your WiFi, consuming less than 1 Watt. Touch GPIO 32 with your fingertip to inject biological electrostatic capacitance.'}
              </p>

              <div className="p-4 rounded-xl bg-black/50 border border-white/5 font-mono text-xs text-gray-300 space-y-1.5">
                <div className="text-neon-cyan font-bold">{isEs ? 'Especificaciones técnicas:' : 'Hardware Specs:'}</div>
                <div>• Chip: ESP32 Dual Core 240MHz (3€)</div>
                <div>• Pin táctil: GPIO 32 (touchRead)</div>
                <div>• Consumo: &lt; 0.8 Watts (0.15€ al año)</div>
                <div>• {isEs ? 'Protocolo: HTTP REST nativo hacia el guardián' : 'Protocol: Native HTTP REST to guardian'}</div>
              </div>
            </div>

            <Link
              to="/downloads"
              onClick={() => sound.playClick()}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-neon-cyan/20 hover:bg-neon-cyan text-neon-cyan hover:text-black font-orbitron text-xs font-bold tracking-wider border border-neon-cyan/50 transition-all shadow-glow-cyan"
            >
              <Download className="w-4 h-4" />
              {isEs ? 'Descargar Firmware ESP32 (.ino)' : 'Download ESP32 Firmware (.ino)'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
