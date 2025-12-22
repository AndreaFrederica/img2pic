export default {
  // Application title
  app: {
    title: 'Pixel-Art Generator'
  },

  // Navigation menu
  nav: {
    menu: 'Navigationsmenü',
    home: 'Startseite',
    homeCaption: 'Projektvorstellung',
    pixelArt: 'Pixel-Art Generierung',
    pixelArtCaption: 'Bilder in Pixel-Art umwandeln',
    toolbox: 'Werkzeugkasten',
    toolboxCaption: 'Sammlung nützlicher Werkzeuge',
    novelAssistant: 'Roman-Assistent',
    novelAssistantCaption: 'Verwandeln Sie Ihr VSCode in ein Roman-Schreibwerkzeug',
    checklist: 'Checklisten-Assistent',
    checklistCaption: 'Verwaltungs-tool für Checklisten',
    blog: 'Blog',
    blogCaption: 'Technischer Blog',
    github: 'Github',
    githubCaption: 'github.com/AndreaFrederica'
  },

  // Titles and descriptions
  title: {
    pixelSettings: 'Pixelisierungseinstellungen',
    originalImage: 'Originalbild',
    pureEnergyMap: 'Reine Energiekarte',
    energyMapWithGrid: 'Energiekarte und Gitter',
    pixelatedResult: 'Pixeliertes Ergebnis'
  },

  // File upload
  fileUpload: {
    selectImage: 'Bild auswählen',
    selectImageHint: 'Bitte wählen Sie ein Bild zum Verarbeiten aus'
  },

  // Pixelization parameters
  pixelParams: {
    title: 'Pixelisierungsparameter',
    energyAlgorithmParams: 'Parameter des Energiealgorithmus',
    gaussianBlur: 'Gaußscher Weichzeichner (σ)',
    gaussianBlurDesc: 'Steuert den Unschärfegrad des Bildes, höhere Werte erzeugen mehr Unschärfe zur Rauschunterdrückung',
    gapTolerance: 'Lückentoleranz',
    gapToleranceDesc: 'Erlaubte Lückengröße für Gitterlinien, höhere Werte verbinden unterbrochene Linien leichter',
    minEnergyThreshold: 'Mindestenergieschwellenwert',
    minEnergyThresholdDesc: 'Pixel mit Energie unter diesem Schwellenwert werden ignoriert, zum Filtern schwacher Kanten verwendet',
    smoothWindowSize: 'Fenstergröße für Glättung',
    smoothWindowSizeDesc: 'Fenstergröße zum Glätten der Energiekarte, höhere Werte erzeugen stärkere Glättung',
    enableEnergyEnhancement: 'Energieverbesserung aktivieren',
    enableEnergyEnhancementDesc: 'Aktiviert die Verbesserung der Energiewerte für verbesserte Kantenerkennungsgenauigkeit',
    directionalEnhancement: 'Richtungsverbesserung',
    directionalEnhancementDesc: 'Aktiviert separate Anpassung der horizontalen und vertikalen Verbesserungsintensitäten',
    horizontalEnhancement: 'Horizontaler Verbesserungsfaktor',
    horizontalEnhancementDesc: 'Verbessert die Intensität der horizontalen Kantenerkennung',
    verticalEnhancement: 'Vertikaler Verbesserungsfaktor',
    verticalEnhancementDesc: 'Verbessert die Intensität der vertikalen Kantenerkennung',
    pixelSize: 'Pixelgröße',
    pixelSizeDesc: 'Auf 0 für automatische Erkennung einstellen, oder manuell die Pixelblockgröße angeben',
    manualSet: 'Manuell einstellen',
    autoDetect: 'Automatisch erkennen',
    minPixelSize: 'Mindestpixelgröße',
    minPixelSizeDesc: 'Mindestzulässige Pixelgröße bei automatischer Erkennung',
    maxPixelSize: 'Maximale Pixelgröße',
    maxPixelSizeDesc: 'Maximal zulässige Pixelgröße bei automatischer Erkennung'
  },

  // Sampling mode
  samplingMode: {
    title: 'Abtastmodus',
    generatePixelArt: 'Pixel-Art generieren',
    generatePixelArtDesc: 'Wenn aktiviert, generiert Pixel-Art basierend auf erkannten Gittern; wenn deaktiviert, zeigt nur die Energiekarte',
    directProportionalSampling: 'Direkt proportionale Abtastung (für normale Bilder)',
    directProportionalSamplingDesc: 'Geeignet für die Umwandlung normaler Bilder in Pixel-Art ohne Verwendung der Energiekartenerkennung, tastet direkt bei angegebener Pixelgröße ab',
    energyMapSampling: 'Energiekarten-Abtastmodus',
    energyMapSamplingDesc: 'Wählen Sie, wie Farben von erkannten Gittern abgetastet werden: Zentrumsabtastung, Durchschnittsabtastung oder gewichteter Durchschnitt',
    centerSampling: 'Zentrumsabtastung',
    averageSampling: 'Durchschnittsabtastung',
    weightedAverage: 'Gewichteter Durchschnitt',
    nativeResolution: 'Native Auflösung (1 Pixel = 1 Gitter)',
    nativeResolutionDesc: 'Ausgabebild, bei dem jeder Pixel einer Gitterzelle entspricht, keine Skalierung angewendet',
    upscaleFactor: 'Skalierungsfaktor',
    upscaleFactorDesc: 'Skalierungsfaktor für Ausgabebild, auf 0 für automatische Berechnung einstellen',
    auto: 'Automatisch',
    weightedRatio: 'Gewichtungsverhältnis',
    weightedRatioDesc: 'Gewichtsverhältnis des Mittelpunkts für gewichtete Durchschnittsabtastung, höhere Werte betonen Mittelpixel stärker',
    directSamplingParams: 'Parameter der direkten Abtastung',
    directSamplingDescription: 'Der Direktabtastmodus eignet sich für die Umwandlung normaler Bilder in Pixel-Art. Die Pixelgröße muss manuell eingestellt werden.'
  },

  // Action buttons
  actions: {
    startProcessing: 'Verarbeitung starten',
    startProcessingDesc: 'Bildverarbeitung starten, um Pixel-Art basierend auf aktuellen Parametern zu generieren',
    showEnergyMapAndGrid: 'Energiekarte und Gitter anzeigen',
    showEnergyMapAndGridDesc: 'Energiekarte und erkannte Gitterlinien im Ergebnisbereich anzeigen zum Debuggen und Anzeigen der Erkennungseffekte',
    downloadPureEnergyMap: 'Reine Energiekarte herunterladen',
    downloadPureEnergyMapDesc: 'Graustufenbild herunterladen, das nur Energieinformationen enthält, ohne Gitterlinien',
    downloadEnergyMapWithGrid: 'Energiekarte+Gitter herunterladen',
    downloadEnergyMapWithGridDesc: 'Debug-Bild herunterladen, das Energiekarte und erkannte Gitterlinien enthält',
    downloadPixelArt: 'Pixel-Art herunterladen',
    downloadPixelArtDesc: 'Das generierte finale Pixel-Art-Kunstwerk herunterladen',
    close: 'Schließen',
    closeDesc: 'Dialog schließen oder Vorgang abbrechen'
  },

  // Status information
  status: {
    detectedPixelSize: 'Erkannte Pixelgröße',
    detectedGridLines: 'Erkannte Gitterlinien',
    outputSize: 'Ausgabegröße',
    upscaleFactor: 'Skalierungsfaktor',
    processingComplete: 'Verarbeitung abgeschlossen!',
    processingFailed: 'Verarbeitung fehlgeschlagen: '
  },

  // Debug information
  debug: {
    info: 'Info'
  },

  // Home page
  home: {
    subtitle: 'KI-generiertes Pseudo-Pixel-Art in echtes Pixel-Art umwandeln',
    description: 'Verwenden Sie fortschrittliche Energiealgorithmen und Kantenerkennungstechnologie, um Pixelgitter in Bildern intelligent zu identifizieren und authentisches Pixel-Art zu generieren. Unterstützt mehrere Algorithmen und benutzerdefinierte Parameter.',
    startConversion: 'Konvertierung starten',
    learnMore: 'Mehr erfahren',
    features: {
      title: 'Funktionen',
      energyAlgorithm: {
        title: 'Energiealgorithmus',
        description: 'Gradientenbasierte Energiekartengenerierung mit automatischer Pixelgittergrenzerkennung, unterstützt richtungsabhängige Verbesserung und benutzerdefinierte Parameteranpassungen.'
      },
      edgeDetection: {
        title: 'Kantenerkennung',
        description: 'Verwendet den Sobel-Operator zur Erkennung horizontaler und vertikaler Kanten, identifiziert intelligent Pixelgitterlinien mit automatischer Gittergrößenanpassung.'
      },
      gridSampling: {
        title: 'Gitterabtastung',
        description: 'Erzeugt regelmäßige Gitter durch Spitzenwerterkennung, unterstützt mehrere Abtastmodi einschließlich Zentrumsabtastung, Durchschnittsabtastung und gewichteten Durchschnitt.'
      },
      colorQuantization: {
        title: 'Farbquantisierung',
        description: 'Intelligenter Farbquantisierungsalgorithmus, der die Zusammenführung ähnlicher Farben mit anpassbarer Farbzahl und Ähnlichkeitsschwellen unterstützt.'
      },
      parameterAdjustment: {
        title: 'Parameteranpassung',
        description: 'Reiche Parameteroptionen mit Echtzeit-Vorschau-Effekten, unterstützt Debug-Modus zum Anzeigen erkannter Gitterlinien.'
      },
      oneClickExport: {
        title: 'Ein-Klick-Export',
        description: 'Laden Sie direkt hochwertige Pixel-Art-Bilder nach der Verarbeitung herunter, mit Unterstützung für benutzerdefinierte Skalierungsfaktoren.'
      }
    },
    quickStart: {
      title: 'Schnellstart',
      steps: {
        selectImage: {
          title: 'Bild auswählen',
          description: 'Laden Sie das Bild hoch, das Sie umwandeln möchten, unterstützt gängige Bildformate.'
        },
        selectAlgorithm: {
          title: 'Algorithmus auswählen',
          description: 'Wählen Sie den entsprechenden Algorithmus basierend auf Ihren Bedürfnissen und passen Sie die Parameter an.'
        },
        processImage: {
          title: 'Bild verarbeiten',
          description: 'Klicken Sie auf die Verarbeitungsschaltfläche, und das System wandelt das Bild automatisch in Pixel-Art um.'
        },
        downloadResult: {
          title: 'Ergebnis herunterladen',
          description: 'Vorschau des Ergebnisses und Herunterladen hochwertiger Pixel-Art-Bilder.'
        }
      }
    }
  },

  // Language switching
  language: {
    title: 'Sprache',
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