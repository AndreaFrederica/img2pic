export default {
  // Application title
  app: {
    title: 'Generatore di Arte Pixel'
  },

  // Navigation menu
  nav: {
    menu: 'Menu di Navigazione',
    home: 'Home',
    homeCaption: 'Introduzione al Progetto',
    pixelArt: 'Generazione Arte Pixel',
    pixelArtCaption: 'Converti immagini in arte pixel',
    toolbox: 'Cassetta degli Attrezzi',
    toolboxCaption: 'Raccolta di strumenti utili',
    novelAssistant: 'Assistente Romanzo',
    novelAssistantCaption: 'Trasforma il tuo VSCode in uno strumento di scrittura di romanzi',
    checklist: 'Assistente Checklist',
    checklistCaption: 'Strumento di gestione checklist',
    blog: 'Blog',
    blogCaption: 'Blog Tecnico',
    github: 'Github',
    githubCaption: 'github.com/AndreaFrederica'
  },

  // Titles and descriptions
  title: {
    pixelSettings: 'Impostazioni di Pixelizzazione',
    originalImage: 'Immagine Originale',
    pureEnergyMap: 'Mappa Energia Pura',
    energyMapWithGrid: 'Mappa Energia e Griglia',
    pixelatedResult: 'Risultato Pixelizzato'
  },

  // File upload
  fileUpload: {
    selectImage: 'Seleziona Immagine',
    selectImageHint: 'Per favore seleziona un\'immagine da elaborare'
  },

  // Pixelization parameters
  pixelParams: {
    title: 'Parametri di Pixelizzazione',
    energyAlgorithmParams: 'Parametri Algoritmo Energia',
    gaussianBlur: 'Sfocatura Gaussiana (σ)',
    gaussianBlurDesc: 'Controlla il livello di sfocatura dell\'immagine, valori più alti creano più sfocatura per eliminare il rumore',
    gapTolerance: 'Tolleranza Gap',
    gapToleranceDesc: 'Dimensione del gap consentita per le linee della griglia, valori più alti collegano più facilmente le linee interrotte',
    interpThreshold: 'Soglia Interpolazione',
    interpThresholdDesc: 'Controlla quando inserire linee di interpolazione blu tra due linee rosse, inserite quando lo spazio supera lo spazio tipico × questo valore',
    minEnergyThreshold: 'Soglia Minima Energia',
    minEnergyThresholdDesc: 'Pixel con energia sotto questa soglia verranno ignorati, usati per filtrare bordi deboli',
    smoothWindowSize: 'Dimensione Finestra Levigamento',
    smoothWindowSizeDesc: 'Dimensione della finestra per levigare la mappa energia, valori più alti creano un levigamento più forte',
    enableEnergyEnhancement: 'Abilita Miglioramento Energia',
    enableEnergyEnhancementDesc: 'Abilita il miglioramento dei valori di energia per una precisione migliorata nel rilevamento dei bordi',
    directionalEnhancement: 'Miglioramento Direzionale',
    directionalEnhancementDesc: 'Abilita l\'aggiustamento separato delle intensità di miglioramento orizzontale e verticale',
    horizontalEnhancement: 'Fattore Miglioramento Orizzontale',
    horizontalEnhancementDesc: 'Migliora l\'intensità del rilevamento dei bordi orizzontali',
    verticalEnhancement: 'Fattore Miglioramento Verticale',
    verticalEnhancementDesc: 'Migliora l\'intensità del rilevamento dei bordi verticali',
    pixelSize: 'Dimensione Pixel',
    pixelSizeDesc: 'Imposta su 0 per rilevamento automatico, o specifica manualmente la dimensione del blocco pixel',
    manualSet: 'Impostazione Manuale',
    autoDetect: 'Rileva Automaticamente',
    minPixelSize: 'Dimensione Minima Pixel',
    minPixelSizeDesc: 'Dimensione minima pixel consentita durante il rilevamento automatico',
    maxPixelSize: 'Dimensione Massima Pixel',
    maxPixelSizeDesc: 'Dimensione massima pixel consentita durante il rilevamento automatico',
    preprocessInterp: 'Interpolazione Preelaborazione',
    preprocessInterpDesc: 'Interpola e scala l\'immagine prima dell\'elaborazione per migliorare il rilevamento della griglia. Usa l\'interpolazione nearest-neighbor per mantenere nitidi i bordi dei pixel.'
  },

  // Sampling mode
  samplingMode: {
    title: 'Modalità Campionamento',
    generatePixelArt: 'Genera Arte Pixel',
    generatePixelArtDesc: 'Quando abilitato, genera arte pixel basata su griglie rilevate; quando disabilitato, mostra solo la mappa energia',
    directProportionalSampling: 'Campionamento Proporzionale Diretto (per immagini normali)',
    directProportionalSamplingDesc: 'Adatto per convertire immagini normali in arte pixel senza usare il rilevamento mappa energia, campiona direttamente alla dimensione pixel specificata',
    energyMapSampling: 'Modalità Campionamento Mappa Energia',
    energyMapSamplingDesc: 'Seleziona come campionare colori da griglie rilevate: campionamento centro, campionamento media o media ponderata',
    centerSampling: 'Campionamento Centro',
    averageSampling: 'Campionamento Media',
    weightedAverage: 'Media Ponderata',
    nativeResolution: 'Risoluzione Nativa (1 pixel = 1 griglia)',
    nativeResolutionDesc: 'Immagine di output dove ogni pixel corrisponde a una cella griglia, nessuna scalatura applicata',
    upscaleFactor: 'Fattore Scalatura',
    upscaleFactorDesc: 'Fattore di scalatura immagine di output, imposta su 0 per calcolo automatico',
    auto: 'Automatico',
    weightedRatio: 'Rapporto Ponderato',
    weightedRatioDesc: 'Rapporto peso punto centrale per campionamento media ponderata, valori più alti enfatizzano di più i pixel centrali',
    directSamplingParams: 'Parametri Campionamento Diretto',
    directSamplingDescription: 'La modalità campionamento diretto è adatta per convertire immagini normali in arte pixel. La dimensione pixel deve essere impostata manualmente.'
  },

  // Action buttons
  actions: {
    startProcessing: 'Avvia Elaborazione',
    startProcessingDesc: 'Avvia l\'elaborazione dell\'immagine per generare arte pixel basata sui parametri attuali',
    showEnergyMapAndGrid: 'Mostra Mappa Energia e Griglia',
    showEnergyMapAndGridDesc: 'Mostra mappa energia e linee griglia rilevate nell\'area risultati per debug e visualizzare gli effetti di rilevamento',
    pureUpscaleMode: 'Modalità Upscale Puro',
    pureUpscaleModeDesc: 'Salta tutto il rilevamento e l\'elaborazione, scala direttamente l\'immagine usando l\'interpolazione nearest-neighbor (per immagini che sono già pixel art)',
    downloadPureEnergyMap: 'Scarica Mappa Energia Pura',
    downloadPureEnergyMapDesc: 'Scarica immagine in scala di grigi contenente solo informazioni energetiche, senza linee griglia',
    downloadEnergyMapWithGrid: 'Scarica Mappa Energia+Griglia',
    downloadEnergyMapWithGridDesc: 'Scarica immagine di debug contenente mappa energia e linee griglia rilevate',
    downloadPixelArt: 'Scarica Arte Pixel',
    downloadPixelArtDesc: 'Scarica l\'opera d\'arte pixel finale generata',
    close: 'Chiudi',
    closeDesc: 'Chiudi dialogo o annulla operazione'
  },

  // Status information
  status: {
    detectedPixelSize: 'Dimensione Pixel Rilevata',
    detectedGridLines: 'Linee Griglia Rilevate',
    outputSize: 'Dimensione Output',
    upscaleFactor: 'Fattore Scalatura',
    renderTime: 'Tempo di Rendering',
    processingComplete: 'Elaborazione Completata!',
    processingFailed: 'Elaborazione Fallita: '
  },

  // Debug information
  debug: {
    info: 'Info'
  },

  // Accelerazione WASM
  wasm: {
    title: 'Accelerazione WASM',
    enableWasm: 'Abilita accelerazione WASM',
    enableWasmDesc: 'Usa WebAssembly per un\'elaborazione immagini più veloce',
    notSupported: 'WebAssembly non è supportato dal tuo browser',
    loading: 'Caricamento modulo WASM...',
    loaded: 'Modulo WASM caricato con successo!',
    error: 'Impossibile caricare il modulo WASM',
    notLoaded: 'Modulo WASM non caricato',
    preload: 'Precarica modulo WASM',
    performanceInfo: 'L\'accelerazione WASM migliora le prestazioni di:',
    performanceConvolution: 'Grande convoluzione immagini (1.5-3x più veloce)',
    performanceSobel: 'Rilevamento bordi (1.5-2x più veloce)',
    performanceSampling: 'Campionamento pixel (1.2-1.5x più veloce)'
  },

  // Home page
  home: {
    subtitle: 'Converti arte pixel pseudo generata da IA in vera arte pixel',
    description: 'Usa algoritmi avanzati di energia e tecnologia di rilevamento bordi per identificare intelligentemente griglie pixel nelle immagini, generando arte pixel autentica. Supporta algoritmi multipli e parametri personalizzati.',
    startConversion: 'Avvia Conversione',
    learnMore: 'Scopri di Più',
    features: {
      title: 'Caratteristiche',
      energyAlgorithm: {
        title: 'Algoritmo Energia',
        description: 'Generazione mappa energia basata su gradiente con rilevamento automatico dei limiti della griglia pixel, supportando miglioramento direzionale e regolazioni di parametri personalizzati.'
      },
      edgeDetection: {
        title: 'Rilevamento Bordi',
        description: 'Usa l\'operatore Sobel per rilevare bordi orizzontali e verticali, identificando intelligentemente linee griglia pixel con regolazione automatica dimensione griglia.'
      },
      gridSampling: {
        title: 'Campionamento Griglia',
        description: 'Crea griglie regolari attraverso il rilevamento dei picchi, supportando modalità di campionamento multiple incluse campionamento centro, campionamento media e media ponderata.'
      },
      colorQuantization: {
        title: 'Quantizzazione Colore',
        description: 'Algoritmo intelligente di quantizzazione colore supportando la fusione di colori simili con conteggio colori e soglie di somiglianza personalizzabili.'
      },
      parameterAdjustment: {
        title: 'Regolazione Parametri',
        description: 'Opzioni parametri ricche con effetti anteprima in tempo reale, supportando modalità debug per mostrare linee griglia rilevate.'
      },
      oneClickExport: {
        title: 'Esportazione Un Clic',
        description: 'Scarica direttamente immagini arte pixel di alta qualità dopo l\'elaborazione, con supporto per fattori di scalatura personalizzati.'
      }
    },
    quickStart: {
      title: 'Avvio Rapido',
      steps: {
        selectImage: {
          title: 'Seleziona Immagine',
          description: 'Carica l\'immagine che vuoi convertire, supportando formati immagine comuni.'
        },
        selectAlgorithm: {
          title: 'Seleziona Algoritmo',
          description: 'Scegli l\'algoritmo appropriato basato sulle tue esigenze e regola i parametri.'
        },
        processImage: {
          title: 'Elabora Immagine',
          description: 'Fai clic sul pulsante elabora, e il sistema convertirà automaticamente l\'immagine in arte pixel.'
        },
        downloadResult: {
          title: 'Scarica Risultato',
          description: 'Anteprima del risultato e scarica immagini arte pixel di alta qualità.'
        }
      }
    }
  },

  // Language switching
  language: {
    title: 'Lingua',
    options: {
      'zh-CN': '简体中文',
      'zh-TW': '繁體中文',
      'zh-classical': '文言文',
      'ja': '日本語',
      'ja-h': '日本語(漢字)',
      'en': 'English',
      'es': 'Español',
      'de': 'Deutsch',
      'it': 'Italiano',
      'pt': 'Português',
      'fr': 'Français',
      'ru': 'Русский',
      'ko': '한국어',
      'ar': 'العربية',
      'hi': 'हिन्दी'
    }
  }
};