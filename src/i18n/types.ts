export type Language = 'es' | 'en' | 'zh' | 'hi' | 'fr' | 'ar' | 'pt' | 'ru' | 'ja' | 'de';

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
  dir?: 'ltr' | 'rtl';
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'es', name: 'Español', nativeName: 'Español', flag: '🇪🇸', dir: 'ltr' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', dir: 'ltr' },
  { code: 'zh', name: 'Chinese', nativeName: '中文 (简体)', flag: '🇨🇳', dir: 'ltr' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', dir: 'ltr' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷', dir: 'ltr' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', dir: 'ltr' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', dir: 'ltr' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', dir: 'ltr' },
];

export interface PackageData {
  id: string;
  title: string;
  category: string;
  desc: string;
  size: string;
  badge: string;
  file: string;
  features: string[];
  cmd: string;
}

export interface OsPackages {
  name: string;
  packages: PackageData[];
}

export interface TranslationSchema {
  // Navigation & Brand
  brandTitle: string;
  brandSubtitle: string;
  tabHome: string;
  tabExplorer: string;
  tabMining: string;
  tabGuardians: string;
  tabWallet: string;
  tabDownloads: string;
  tabTokenomics: string;
  tabImpact: string;
  networkOnline: string;
  networkConnecting: string;
  audioOn: string;
  audioOff: string;

  // Header stats
  blockHeight: string;
  activeGuardians: string;
  activeMiners: string;
  circulatingSupply: string;
  mempoolPending: string;
  guardianFeePool: string;
  fastBft: string;
  nodes247: string;
  issuedBic: string;
  blockReward: string;

  // Command Center Menu
  menuCommandCenter: string;
  menuClose: string;
  menuCloseTitle: string;
  menuHeadingTag: string;
  menuHeadingTitle: string;
  menuHeadingDesc: string;
  menuCol1Title: string;
  menuCol1Count: string;
  menuCol2Title: string;
  menuCol3Title: string;
  menuCoreDesc: string;
  menuExplorerDesc: string;
  menuMiningDesc: string;
  menuGuardiansDesc: string;
  menuWalletDesc: string;
  menuDownloadsDesc: string;
  menuTokenomicsDesc: string;
  menuImpactDesc: string;
  menuQuickActionWallet: string;
  menuQuickActionDownloads: string;
  menuLangSelector: string;

  // Home View
  homeHeroBadge: string;
  homeHeroTitle: string;
  homeHeroDesc: string;
  exploreNetworkBtn: string;
  downloadSoftwareBtn: string;
  learnImpactBtn: string;
  pillar1Title: string;
  pillar1Desc: string;
  pillar2Title: string;
  pillar2Desc: string;
  pillar3Title: string;
  pillar3Desc: string;
  pillar4Title: string;
  pillar4Desc: string;

  // Symbiosis & Architecture
  symbiosisBadge: string;
  symbiosisTitle: string;
  symbiosisSubtitle: string;
  symbiosisMinerTitle: string;
  symbiosisMinerShare: string;
  symbiosisMinerDesc: string;
  symbiosisGuardianTitle: string;
  symbiosisGuardianShare: string;
  symbiosisGuardianDesc: string;

  // Simulator
  calcTitle: string;
  calcSubtitle: string;
  calcSelectDevice: string;
  calcDeviceEsp32: string;
  calcDeviceLaptop: string;
  calcDeviceMonster: string;
  calcEqualityBadge: string;
  calcResultNotice: string;

  // Comparison Matrix (Home)
  compTechBadge: string;
  compTechTitle: string;
  compTechSubtitle: string;
  compThCriterion: string;
  compThTrad: string;
  compThBic: string;
  compRow1Title: string;
  compRow1Trad: string;
  compRow1Bic: string;
  compRow2Title: string;
  compRow2Trad: string;
  compRow2Bic: string;
  compRow3Title: string;
  compRow3Trad: string;
  compRow3Bic: string;
  compRow4Title: string;
  compRow4Trad: string;
  compRow4Bic: string;
  compRow5Title: string;
  compRow5Trad: string;
  compRow5Bic: string;

  // Manifesto
  manifestoBadge: string;
  manifestoTitle: string;
  manifestoSubtitle: string;
  manifestoP1: string;
  manifestoP2: string;

  // World Impact View
  impactHeroBadge: string;
  impactHeroTitle: string;
  impactHeroDesc: string;
  whyPrivacyTitle: string;
  whyPrivacyP1: string;
  whyPrivacyP2: string;
  pillarShieldTitle: string;
  pillarShieldDesc: string;
  pillarImmunityTitle: string;
  pillarImmunityDesc: string;
  pillarDemoTitle: string;
  pillarDemoDesc: string;

  comparisonTitle: string;
  compFeature: string;
  compFiat: string;
  compCbdc: string;
  compPublicCrypto: string;
  compBic: string;
  row1Feat: string;
  row1Fiat: string;
  row1Cbdc: string;
  row1Public: string;
  row1Bic: string;
  row2Feat: string;
  row2Fiat: string;
  row2Cbdc: string;
  row2Public: string;
  row2Bic: string;
  row3Feat: string;
  row3Fiat: string;
  row3Cbdc: string;
  row3Public: string;
  row3Bic: string;
  row4Feat: string;
  row4Fiat: string;
  row4Cbdc: string;
  row4Public: string;
  row4Bic: string;
  row5Feat: string;
  row5Fiat: string;
  row5Cbdc: string;
  row5Public: string;
  row5Bic: string;

  // Mining Info View
  miningHeroBadge: string;
  miningHeroTitle: string;
  miningHeroDesc: string;
  currentRoundTime: string;
  roundWindowLabel: string;
  roundDifficulty: string;
  targetBlockTime: string;
  activeCollabMiners: string;
  workingOnBlock: string;
  emissionReward: string;
  minersRatio: string;
  howItWorksTitle: string;
  howStep1Title: string;
  howStep1Desc: string;
  howStep2Title: string;
  howStep2Desc: string;
  howStep3Title: string;
  howStep3Desc: string;
  howStep4Title: string;
  howStep4Desc: string;
  telemetryTitle: string;
  gettingStartedTitle: string;
  desktopGuideTitle: string;
  esp32GuideTitle: string;
  pcGuideSummary: string;
  esp32GuideSummary: string;

  // Explorer View & Modal
  explorerHeroTitle: string;
  explorerHeroDesc: string;
  liveBlockStream: string;
  latestBlocks: string;
  blockNum: string;
  blockHash: string;
  rewardBic: string;
  feeShare: string;
  transactions: string;
  timeAgo: string;
  viewDetails: string;
  networkMetrics: string;
  blockTimeTarget: string;
  difficultyBits: string;
  privacyStatus: string;
  zkShielded: string;
  modalConsensusTag: string;
  modalMinersShare: string;
  modalGuardiansShare: string;
  modalCopyHash: string;
  modalCopied: string;

  // Guardians View
  guardiansHeroBadge: string;
  guardiansHeroTitle: string;
  guardiansHeroDesc: string;
  feePolicyTitle: string;
  feePolicyDesc: string;
  formula: string;
  guardianEmissionSub: string;
  guaranteedBlock: string;
  estPerGuardian: string;
  estPerGuardianDesc: string;
  symbiosisExplainerTitle: string;
  symbiosisExplainerDesc: string;
  registerGuardianTitle: string;
  registerGuardianDesc: string;
  guardianAddressInput: string;
  copyAddressBtn: string;
  copiedBtn: string;
  registerBtn: string;
  registerBtnLoading: string;
  guardianSuccess: string;
  autoWalletNotice: string;

  // Wallet View
  walletHeroTitle: string;
  walletHeroDesc: string;
  tabCreateWallet: string;
  tabRestoreWallet: string;
  tabViewKeyAudit: string;
  tabSendTx: string;
  generateWalletBtn: string;
  generatingCrypto: string;
  yourSeedWords: string;
  copyMnemonic: string;
  copiedMnemonic: string;
  yourPublicAddress: string;
  checkBalanceBtn: string;
  checkingBalance: string;
  totalBalance: string;
  unspentOutputs: string;
  sendToAddress: string;
  amountToSend: string;
  ringSize: string;
  sendTxBtn: string;
  sendingTx: string;

  // 13th Word Paranoia Mode
  paranoiaBadge: string;
  paranoiaActive: string;
  paranoiaDesc: string;
  paranoiaPlaceholder: string;
  paranoiaBtnGenerate: string;
  paranoiaAlertTitle: string;
  paranoiaAlertDesc: string;
  paranoiaYourWord: string;
  paranoiaRestoreLabel: string;
  paranoiaRestoreHint: string;
  paranoiaRestorePlaceholder: string;
  paranoiaDecryptedBadge: string;
  paranoiaSendLabel: string;
  paranoiaSendPlaceholder: string;

  // Downloads View
  downloadsHeroTitle: string;
  downloadsHeroDesc: string;
  osWindows: string;
  osLinux: string;
  osMac: string;
  osEsp32: string;
  downloadBtn: string;
  quickStartCommand: string;
  osPackages: {
    windows: OsPackages;
    linux: OsPackages;
    macos: OsPackages;
    esp32: OsPackages;
  };

  // Tokenomics View
  tokenomicsHeroTitle: string;
  tokenomicsHeroDesc: string;
  maxSupply: string;
  maxSupplyVal: string;
  halvingSchedule: string;
  halvingScheduleVal: string;
  emissionCurve: string;
  emissionCurveVal: string;
  feeIncentive: string;
  feeIncentiveVal: string;
  minerIncentive: string;
  minerIncentiveVal: string;
  completedHalvings: string;
  blocksUntilNextHalving: string;
  hardLimitLabel: string;
  gradualYearsLabel: string;
  reductionLabel: string;
  minerIncentiveDesc: string;
  minerDistTitle: string;
  minerDistItem1: string;
  minerDistItem2: string;
  minerDistItem3: string;
  guardianIncentiveDesc: string;
  guardianDistTitle: string;
  guardianDistItem1: string;
  guardianDistItem2: string;
  guardianDistItem3: string;
  halvingTableTitle: string;
  currentBlockLabel: string;
  thEra: string;
  thRange: string;
  thReward: string;
  thTotal: string;
  thStatus: string;
  statusInProgress: string;
  statusFuture: string;
  statusFinal: string;
}
