export default {
  // Titre de l'application
  app: {
    title: 'Générateur d\'Art Pixel'
  },

  // Menu de navigation
  nav: {
    menu: 'Menu de Navigation',
    home: 'Accueil',
    homeCaption: 'Introduction du Projet',
    pixelArt: 'Génération d\'Art Pixel',
    pixelArtCaption: 'Convertir les images en art pixel',
    toolbox: 'Boîte à Outils',
    toolboxCaption: 'Collection d\'outils utiles',
    novelAssistant: 'Aide Roman',
    novelAssistantCaption: 'Transformez votre VSCode en outil d\'écriture de roman',
    checklist: 'Assistant Liste de Vérification',
    checklistCaption: 'Outil de gestion de liste de vérification',
    blog: 'Blog',
    blogCaption: 'Blog Technique',
    github: 'Github',
    githubCaption: 'github.com/AndreaFrederica'
  },

  // Page d'accueil
  home: {
    subtitle: 'Convertir les pseudo-pixellisations générées par IA en vrai pixel art',
    description: 'Utilisez des algorithmes d\'énergie avancés et des techniques de détection de contours pour identifier intelligemment les grilles de pixels dans les images, générant des œuvres d\'art pixel authentiques. Prend en charge plusieurs algorithmes et paramètres personnalisés.',
    startConversion: 'Commencer la Conversion',
    learnMore: 'En Savoir Plus',
    features: {
      title: 'Caractéristiques',
      energyAlgorithm: {
        title: 'Algorithme d\'Énergie',
        description: 'Génération de carte d\'énergie basée sur les gradients avec détection automatique des limites de grille de pixels, supportant l\'amélioration directionnelle et les ajustements de paramètres personnalisés.'
      },
      edgeDetection: {
        title: 'Détection de Contours',
        description: 'Utilise l\'opérateur Sobel pour détecter les contours horizontaux et verticaux, identifiant intelligemment les lignes de grille de pixels avec ajustement automatique de la taille de grille.'
      },
      gridSampling: {
        title: 'Échantillonnage de Grille',
        description: 'Crée des grilles régulières par détection de pics, supportant plusieurs modes d\'échantillonnage incluant l\'échantillonnage central, moyen et pondéré.'
      },
      colorQuantization: {
        title: 'Quantification des Couleurs',
        description: 'Algorithme intelligent de quantification des couleurs supportant la fusion de couleurs similaires avec un nombre de couleurs personnalisable et des seuils de similarité.'
      },
      parameterAdjustment: {
        title: 'Ajustement des Paramètres',
        description: 'Options de paramètres riches avec effets de prévisualisation en temps réel, supportant le mode débogage pour afficher les lignes de grille détectées.'
      },
      oneClickExport: {
        title: 'Export en Un Clic',
        description: 'Téléchargez directement des images de pixel art de haute qualité après le traitement, avec support pour des facteurs d\'échelle personnalisés.'
      }
    },
    quickStart: {
      title: 'Démarrage Rapide',
      steps: {
        selectImage: {
          title: 'Sélectionner une Image',
          description: 'Téléchargez l\'image que vous souhaitez convertir, supportant les formats d\'image courants.'
        },
        selectAlgorithm: {
          title: 'Sélectionner l\'Algorithme',
          description: 'Choisissez l\'algorithme approprié basé sur vos besoins et ajustez les paramètres.'
        },
        processImage: {
          title: 'Traiter l\'Image',
          description: 'Cliquez sur le bouton de traitement, et le système convertira automatiquement l\'image en pixel art.'
        },
        downloadResult: {
          title: 'Télécharger le Résultat',
          description: 'Prévisualisez le résultat et téléchargez des images de pixel art de haute qualité.'
        }
      }
    }
  },

  // Titres et descriptions
  title: {
    pixelSettings: 'Paramètres de pixelisation',
    originalImage: 'Image originale',
    pureEnergyMap: 'Carte d\'énergie pure',
    energyMapWithGrid: 'Carte d\'énergie et grille',
    pixelatedResult: 'Résultat pixelisé'
  },

  // Téléchargement de fichier
  fileUpload: {
    selectImage: 'Sélectionner une image',
    selectImageHint: 'Veuillez sélectionner une image à traiter'
  },

  // Paramètres de pixelisation
  pixelParams: {
    title: 'Paramètres de pixelisation',
    energyAlgorithmParams: 'Paramètres de l\'algorithme d\'énergie',
    gaussianBlur: 'Flou gaussien (σ)',
    gaussianBlurDesc: 'Contrôle le degré de flou de l\'image, plus la valeur est élevée, plus le flou est fort, utilisé pour lisser le bruit',
    gapTolerance: 'Tolérance d\'espacement',
    gapToleranceDesc: 'Taille des espaces entre les lignes de grille autorisés, plus la valeur est élevée, plus il est facile de connecter les lignes brisées',
    minEnergyThreshold: 'Seuil d\'énergie minimum',
    minEnergyThresholdDesc: 'Les pixels dont la valeur d\'énergie est inférieure à ce seuil seront ignorés, utilisé pour filtrer les bords faibles',
    smoothWindowSize: 'Taille de la fenêtre de lissage',
    smoothWindowSizeDesc: 'Taille de la fenêtre utilisée pour lisser la carte d\'énergie, plus la valeur est élevée, plus l\'effet de lissage est fort',
    enableEnergyEnhancement: 'Activer l\'amélioration d\'énergie',
    enableEnergyEnhancementDesc: 'Activer l\'amélioration de l\'énergie pour améliorer la détection des bords',
    directionalEnhancement: 'Amélioration directionnelle',
    directionalEnhancementDesc: 'Renforce la détection des bords dans des directions spécifiques',
    horizontalEnhancement: 'Facteur d\'amélioration horizontal',
    horizontalEnhancementDesc: 'Renforce l\'intensité de la détection des bords horizontaux',
    verticalEnhancement: 'Facteur d\'amélioration vertical',
    verticalEnhancementDesc: 'Renforce l\'intensité de la détection des bords verticaux',
    pixelSize: 'Taille de pixel',
    pixelSizeDesc: 'Défini sur 0 pour détection automatique, réglage manuel pour spécifier la taille des blocs de pixels',
    manualSet: 'Réglage manuel',
    autoDetect: 'Détection automatique',
    minPixelSize: 'Taille de pixel minimum',
    minPixelSizeDesc: 'Taille de pixel minimale autorisée lors de la détection automatique',
    maxPixelSize: 'Taille de pixel maximum',
    maxPixelSizeDesc: 'Taille de pixel maximale autorisée lors de la détection automatique'
  },

  // Mode d'échantillonnage
  samplingMode: {
    title: 'Mode d\'échantillonnage',
    generatePixelArt: 'Générer du pixel art',
    generatePixelArtDesc: 'Activé, génère du pixel art à partir de la grille détectée. Désactivé, affiche uniquement la carte d\'énergie',
    directProportionalSampling: 'Échantillonnage proportionnel direct (pour images normales)',
    directProportionalSamplingDesc: 'Convient pour convertir des images normales en pixel art, sans utiliser la détection de carte d\'énergie, échantillonne directement selon la taille de pixel spécifiée',
    energyMapSampling: 'Mode d\'échantillonnage de carte d\'énergie',
    energyMapSamplingDesc: 'Choisissez comment échantillonner les couleurs à partir de la grille détectée : échantillonnage central, moyen ou pondéré',
    centerSampling: 'Échantillonnage central',
    averageSampling: 'Échantillonnage moyen',
    weightedAverage: 'Moyenne pondérée',
    nativeResolution: 'Résolution native (1 pixel = 1 case)',
    nativeResolutionDesc: 'Chaque pixel de l\'image de sortie correspond à une grille, sans agrandissement',
    upscaleFactor: 'Facteur d\'agrandissement',
    upscaleFactorDesc: 'Facteur d\'agrandissement de l\'image de sortie, défini sur 0 pour calcul automatique du meilleur facteur',
    auto: 'Auto',
    weightedRatio: 'Ratio de pondération',
    weightedRatioDesc: 'Ratio de pondération du point central lors de l\'échantillonnage moyen pondéré, plus la valeur est élevée, plus le pixel central est privilégié',
    directSamplingParams: 'Paramètres d\'échantillonnage direct',
    directSamplingDescription: 'Le mode d\'échantillonnage direct convient pour convertir des images normales en pixel art. La taille des pixels doit être définie manuellement.'
  },

  // Boutons d'action
  actions: {
    startProcessing: 'Commencer le traitement',
    startProcessingDesc: 'Traiter l\'image selon les paramètres actuels pour générer du pixel art',
    showEnergyMapAndGrid: 'Afficher la carte d\'énergie et la grille',
    showEnergyMapAndGridDesc: 'Afficher la carte d\'énergie et les lignes de grille détectées dans la zone de résultats, utilisé pour le débogage et la vérification des effets de détection',
    downloadPureEnergyMap: 'Télécharger la carte d\'énergie pure',
    downloadPureEnergyMapDesc: 'Télécharger une image en niveaux de gris contenant uniquement les informations d\'énergie sans les lignes de grille',
    downloadEnergyMapWithGrid: 'Télécharger énergie+grille',
    downloadEnergyMapWithGridDesc: 'Télécharger une image de débogage contenant la carte d\'énergie et les lignes de grille détectées',
    downloadPixelArt: 'Télécharger le pixel art',
    downloadPixelArtDesc: 'Télécharger l\'œuvre de pixel art finale générée',
    close: 'Fermer',
    closeDesc: 'Fermer la boîte de dialogue ou annuler l\'opération'
  },

  // Informations de statut
  status: {
    detectedPixelSize: 'Taille de pixel détectée',
    detectedGridLines: 'Lignes de grille détectées',
    outputSize: 'Taille de sortie',
    upscaleFactor: 'Facteur d\'agrandissement',
    processingComplete: 'Traitement terminé !',
    processingFailed: 'Échec du traitement : '
  },

  // Informations de débogage
  debug: {
    info: 'Information'
  },

  // Changement de langue
  language: {
    title: 'Langue',
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
