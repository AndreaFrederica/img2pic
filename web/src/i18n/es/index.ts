export default {
  // Application title
  app: {
    title: 'Generador de Arte Píxel'
  },

  // Navigation menu
  nav: {
    menu: 'Menú de Navegación',
    home: 'Inicio',
    homeCaption: 'Introducción del Proyecto',
    pixelArt: 'Generación de Arte Píxel',
    pixelArtCaption: 'Convertir imágenes a arte píxel',
    toolbox: 'Caja de Herramientas',
    toolboxCaption: 'Colección de herramientas útiles',
    novelAssistant: 'Asistente de Novela',
    novelAssistantCaption: 'Convierte tu VSCode en una herramienta de escritura de novelas',
    checklist: 'Asistente de Lista de Verificación',
    checklistCaption: 'Herramienta de gestión de listas de verificación',
    blog: 'Blog',
    blogCaption: 'Blog Técnico',
    github: 'Github',
    githubCaption: 'github.com/AndreaFrederica'
  },

  // Titles and descriptions
  title: {
    pixelSettings: 'Configuración de Pixelización',
    originalImage: 'Imagen Original',
    pureEnergyMap: 'Mapa de Energía Puro',
    energyMapWithGrid: 'Mapa de Energía y Cuadrícula',
    pixelatedResult: 'Resultado Pixelado'
  },

  // File upload
  fileUpload: {
    selectImage: 'Seleccionar Imagen',
    selectImageHint: 'Por favor selecciona una imagen para procesar'
  },

  // Pixelization parameters
  pixelParams: {
    title: 'Parámetros de Pixelización',
    energyAlgorithmParams: 'Parámetros del Algoritmo de Energía',
    gaussianBlur: 'Desenfoque Gaussiano (σ)',
    gaussianBlurDesc: 'Controla el nivel de desenfoque de la imagen, valores más altos crean más desenfoque para suavizar el ruido',
    gapTolerance: 'Tolerancia de Huecos',
    gapToleranceDesc: 'Tamaño de hueco permitido para líneas de cuadrícula, valores más altos conectan líneas rotas más fácilmente',
    minEnergyThreshold: 'Umbral Mínimo de Energía',
    minEnergyThresholdDesc: 'Píxeles con energía por debajo de este umbral serán ignorados, usado para filtrar bordes débiles',
    smoothWindowSize: 'Tamaño de Ventana de Suavizado',
    smoothWindowSizeDesc: 'Tamaño de ventana para suavizar el mapa de energía, valores más altos crean un suavizado más fuerte',
    enableEnergyEnhancement: 'Habilitar Mejora de Energía',
    enableEnergyEnhancementDesc: 'Habilita la mejora de valores de energía para una mejor precisión en la detección de bordes',
    directionalEnhancement: 'Mejora Direccional',
    directionalEnhancementDesc: 'Habilita el ajuste separado de intensidades de mejora horizontal y vertical',
    horizontalEnhancement: 'Factor de Mejora Horizontal',
    horizontalEnhancementDesc: 'Mejora la intensidad de detección de bordes horizontales',
    verticalEnhancement: 'Factor de Mejora Vertical',
    verticalEnhancementDesc: 'Mejora la intensidad de detección de bordes verticales',
    pixelSize: 'Tamaño de Píxel',
    pixelSizeDesc: 'Establecer en 0 para autodetección, o especificar manualmente el tamaño del bloque de píxeles',
    manualSet: 'Configuración Manual',
    autoDetect: 'Detectar Automáticamente',
    minPixelSize: 'Tamaño Mínimo de Píxel',
    minPixelSizeDesc: 'Tamaño mínimo de píxel permitido al detectar automáticamente',
    maxPixelSize: 'Tamaño Máximo de Píxel',
    maxPixelSizeDesc: 'Tamaño máximo de píxel permitido al detectar automáticamente',
    preprocessInterp: 'Interpolación de Preprocesamiento',
    preprocessInterpDesc: 'Interpolar y escalar la imagen antes del procesamiento para mejorar la detección de cuadrícula. Usa interpolación de vecino más cercano para mantener los bordes de píxeles nítidos.'
  },

  // Sampling mode
  samplingMode: {
    title: 'Modo de Muestreo',
    generatePixelArt: 'Generar Arte Píxel',
    generatePixelArtDesc: 'Cuando está habilitado, genera arte píxel basado en cuadrículas detectadas; cuando está deshabilitado, solo muestra el mapa de energía',
    directProportionalSampling: 'Muestreo Proporcional Directo (para imágenes normales)',
    directProportionalSamplingDesc: 'Adecuado para convertir imágenes normales a arte píxel sin usar detección de mapa de energía, muestrea directamente en el tamaño de píxel especificado',
    energyMapSampling: 'Modo de Muestreo de Mapa de Energía',
    energyMapSamplingDesc: 'Selecciona cómo muestrear colores de cuadrículas detectadas: muestreo central, muestreo promedio o promedio ponderado',
    centerSampling: 'Muestreo Central',
    averageSampling: 'Muestreo Promedio',
    weightedAverage: 'Promedio Ponderado',
    nativeResolution: 'Resolución Nativa (1 píxel = 1 cuadrícula)',
    nativeResolutionDesc: 'Imagen de salida donde cada píxel corresponde a una celda de cuadrícula, sin escalado aplicado',
    upscaleFactor: 'Factor de Escalado',
    upscaleFactorDesc: 'Factor de escalado de imagen de salida, establecer en 0 para cálculo automático',
    auto: 'Automático',
    weightedRatio: 'Relación Ponderada',
    weightedRatioDesc: 'Relación de peso del punto central para muestreo de promedio ponderado, valores más altos enfatizan más los píxeles centrales',
    directSamplingParams: 'Parámetros de Muestreo Directo',
    directSamplingDescription: 'El modo de muestreo directo es adecuado para convertir imágenes normales a arte píxel. El tamaño de píxel necesita ser configurado manualmente.'
  },

  // Action buttons
  actions: {
    startProcessing: 'Iniciar Procesamiento',
    startProcessingDesc: 'Iniciar el procesamiento de la imagen para generar arte píxel basado en los parámetros actuales',
    showEnergyMapAndGrid: 'Mostrar Mapa de Energía y Cuadrícula',
    showEnergyMapAndGridDesc: 'Mostrar mapa de energía y líneas de cuadrícula detectadas en el área de resultados para depurar y ver efectos de detección',
    pureUpscaleMode: 'Modo de Escalado Puro',
    pureUpscaleModeDesc: 'Omitir toda la detección y el procesamiento, escalar directamente la imagen usando interpolación de vecino más cercano (para imágenes que ya son arte píxel)',
    downloadPureEnergyMap: 'Descargar Mapa de Energía Puro',
    downloadPureEnergyMapDesc: 'Descargar imagen en escala de grises que contiene solo información de energía, sin líneas de cuadrícula',
    downloadEnergyMapWithGrid: 'Descargar Mapa de Energía+Cuadrícula',
    downloadEnergyMapWithGridDesc: 'Descargar imagen de depuración que contiene mapa de energía y líneas de cuadrícula detectadas',
    downloadPixelArt: 'Descargar Arte Píxel',
    downloadPixelArtDesc: 'Descargar el arte píxel final generado',
    close: 'Cerrar',
    closeDesc: 'Cerrar diálogo o cancelar operación'
  },

  // Status information
  status: {
    detectedPixelSize: 'Tamaño de Píxel Detectado',
    detectedGridLines: 'Líneas de Cuadrícula Detectadas',
    outputSize: 'Tamaño de Salida',
    upscaleFactor: 'Factor de Escalado',
    renderTime: 'Tiempo de Renderizado',
    processingComplete: '¡Procesamiento Completo!',
    processingFailed: 'Procesamiento Fallido: '
  },

  // Debug information
  debug: {
    info: 'Información'
  },

  // WASM Acceleration
  wasm: {
    title: 'Aceleración WASM',
    enableWasm: 'Habilitar aceleración WASM',
    enableWasmDesc: 'Usar WebAssembly para procesamiento de imágenes más rápido',
    notSupported: 'WebAssembly no está soportado en tu navegador',
    loading: 'Cargando módulo WASM...',
    loaded: '¡Módulo WASM cargado con éxito!',
    error: 'Error al cargar el módulo WASM',
    notLoaded: 'Módulo WASM no cargado',
    preload: 'Precargar módulo WASM',
    performanceInfo: 'La aceleración WASM mejora el rendimiento de:',
    performanceConvolution: 'Convolución de imágenes grandes (1.5-3x más rápido)',
    performanceSobel: 'Detección de bordes (1.5-2x más rápido)',
    performanceSampling: 'Muestreo de píxeles (1.2-1.5x más rápido)'
  },

  // Home page
  home: {
    subtitle: 'Convierte arte píxel pseudo generado por IA en arte píxel real',
    description: 'Usa algoritmos avanzados de energía y tecnología de detección de bordes para identificar inteligently cuadrículas de píxeles en imágenes, generando arte píxel auténtico. Soporta múltiples algoritmos y parámetros personalizados.',
    startConversion: 'Iniciar Conversión',
    learnMore: 'Aprender Más',
    features: {
      title: 'Características',
      energyAlgorithm: {
        title: 'Algoritmo de Energía',
        description: 'Generación de mapa de energía basado en gradiente con detección automática de límites de cuadrícula de píxeles, soportando mejora direccional y ajustes de parámetros personalizados.'
      },
      edgeDetection: {
        title: 'Detección de Bordes',
        description: 'Usa el operador Sobel para detectar bordes horizontales y verticales, identificando inteligentemente líneas de cuadrícula de píxeles con ajuste automático del tamaño de cuadrícula.'
      },
      gridSampling: {
        title: 'Muestreo de Cuadrícula',
        description: 'Crea cuadrículas regulares a través de detección de picos, soportando múltiples modos de muestreo incluyendo muestreo central, muestreo promedio y promedio ponderado.'
      },
      colorQuantization: {
        title: 'Cuantización de Color',
        description: 'Algoritmo inteligente de cuantización de color soportando fusión de colores similares con recuento de colores y umbrales de similitud personalizables.'
      },
      parameterAdjustment: {
        title: 'Ajuste de Parámetros',
        description: 'Opciones de parámetros ricas con efectos de vista previa en tiempo real, soportando modo de depuración para mostrar líneas de cuadrícula detectadas.'
      },
      oneClickExport: {
        title: 'Exportación de Un Clic',
        description: 'Descarga directamente imágenes de arte píxel de alta calidad después del procesamiento, con soporte para factores de escalado personalizados.'
      }
    },
    quickStart: {
      title: 'Inicio Rápido',
      steps: {
        selectImage: {
          title: 'Seleccionar Imagen',
          description: 'Sube la imagen que quieres convertir, soportando formatos de imagen comunes.'
        },
        selectAlgorithm: {
          title: 'Seleccionar Algoritmo',
          description: 'Elige el algoritmo apropiado basado en tus necesidades y ajusta los parámetros.'
        },
        processImage: {
          title: 'Procesar Imagen',
          description: 'Haz clic en el botón de procesar, y el sistema convertirá automáticamente la imagen a arte píxel.'
        },
        downloadResult: {
          title: 'Descargar Resultado',
          description: 'Previsualiza el resultado y descarga imágenes de arte píxel de alta calidad.'
        }
      }
    }
  },

  // Language switching
  language: {
    title: 'Idioma',
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