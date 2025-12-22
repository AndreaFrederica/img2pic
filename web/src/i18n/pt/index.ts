export default {
  // Application title
  app: {
    title: 'Gerador de Arte Pixel'
  },

  // Navigation menu
  nav: {
    menu: 'Menu de Navegação',
    home: 'Início',
    homeCaption: 'Introdução do Projeto',
    pixelArt: 'Geração de Arte Pixel',
    pixelArtCaption: 'Converter imagens em arte pixel',
    toolbox: 'Caixa de Ferramentas',
    toolboxCaption: 'Coleção de ferramentas úteis',
    novelAssistant: 'Assistente de Romance',
    novelAssistantCaption: 'Transforme seu VSCode em uma ferramenta de escrita de romances',
    checklist: 'Assistente de Checklist',
    checklistCaption: 'Ferramenta de gerenciamento de checklist',
    blog: 'Blog',
    blogCaption: 'Blog Técnico',
    github: 'Github',
    githubCaption: 'github.com/AndreaFrederica'
  },

  // Titles and descriptions
  title: {
    pixelSettings: 'Configurações de Pixelização',
    originalImage: 'Imagem Original',
    pureEnergyMap: 'Mapa de Energia Puro',
    energyMapWithGrid: 'Mapa de Energia e Grade',
    pixelatedResult: 'Resultado Pixelizado'
  },

  // File upload
  fileUpload: {
    selectImage: 'Selecionar Imagem',
    selectImageHint: 'Por favor selecione uma imagem para processar'
  },

  // Pixelization parameters
  pixelParams: {
    title: 'Parâmetros de Pixelização',
    energyAlgorithmParams: 'Parâmetros do Algoritmo de Energia',
    gaussianBlur: 'Desfoque Gaussiano (σ)',
    gaussianBlurDesc: 'Controla o nível de desfoque da imagem, valores mais altos criam mais desfoque para suavização de ruído',
    gapTolerance: 'Tolerância de Lacuna',
    gapToleranceDesc: 'Tamanho de lacuna permitido para linhas de grade, valores mais altos conectam linhas quebradas mais facilmente',
    minEnergyThreshold: 'Limite Mínimo de Energia',
    minEnergyThresholdDesc: 'Pixels com energia abaixo deste limite serão ignorados, usado para filtrar bordas fracas',
    smoothWindowSize: 'Tamanho da Janela de Suavização',
    smoothWindowSizeDesc: 'Tamanho da janela para suavizar o mapa de energia, valores mais altos criam suavização mais forte',
    enableEnergyEnhancement: 'Habilitar Melhoria de Energia',
    enableEnergyEnhancementDesc: 'Habilita o aprimoramento dos valores de energia para precisão aprimorada na detecção de bordas',
    directionalEnhancement: 'Melhoria Direcional',
    directionalEnhancementDesc: 'Habilita o ajuste separado das intensidades de melhoria horizontal e vertical',
    horizontalEnhancement: 'Fator de Melhoria Horizontal',
    horizontalEnhancementDesc: 'Melhora a intensidade da detecção de bordas horizontais',
    verticalEnhancement: 'Fator de Melhoria Vertical',
    verticalEnhancementDesc: 'Melhora a intensidade da detecção de bordas verticais',
    pixelSize: 'Tamanho do Pixel',
    pixelSizeDesc: 'Defina como 0 para detecção automática, ou especifique manualmente o tamanho do bloco de pixels',
    manualSet: 'Definição Manual',
    autoDetect: 'Detectar Automaticamente',
    minPixelSize: 'Tamanho Mínimo do Pixel',
    minPixelSizeDesc: 'Tamanho mínimo de pixel permitido ao detectar automaticamente',
    maxPixelSize: 'Tamanho Máximo do Pixel',
    maxPixelSizeDesc: 'Tamanho máximo de pixel permitido ao detectar automaticamente'
  },

  // Sampling mode
  samplingMode: {
    title: 'Modo de Amostragem',
    generatePixelArt: 'Gerar Arte Pixel',
    generatePixelArtDesc: 'Quando habilitado, gera arte pixel baseada em grades detectadas; quando desabilitado, mostra apenas o mapa de energia',
    directProportionalSampling: 'Amostragem Proporcional Direta (para imagens normais)',
    directProportionalSamplingDesc: 'Adequado para converter imagens normais em arte pixel sem usar detecção de mapa de energia, amostra diretamente no tamanho de pixel especificado',
    energyMapSampling: 'Modo de Amostragem de Mapa de Energia',
    energyMapSamplingDesc: 'Selecione como amostrar cores de grades detectadas: amostragem central, amostragem média ou média ponderada',
    centerSampling: 'Amostragem Central',
    averageSampling: 'Amostragem Média',
    weightedAverage: 'Média Ponderada',
    nativeResolution: 'Resolução Nativa (1 pixel = 1 grade)',
    nativeResolutionDesc: 'Imagem de saída onde cada pixel corresponde a uma célula de grade, nenhuma escala aplicada',
    upscaleFactor: 'Fator de Ampliação',
    upscaleFactorDesc: 'Fator de ampliação da imagem de saída, defina como 0 para cálculo automático',
    auto: 'Automático',
    weightedRatio: 'Razão Ponderada',
    weightedRatioDesc: 'Razão de peso do ponto central para amostragem de média ponderada, valores mais altos enfatizam mais os pixels centrais',
    directSamplingParams: 'Parâmetros de Amostragem Direta',
    directSamplingDescription: 'O modo de amostragem direta é adequado para converter imagens normais em arte pixel. O tamanho do pixel precisa ser definido manualmente.'
  },

  // Action buttons
  actions: {
    startProcessing: 'Iniciar Processamento',
    startProcessingDesc: 'Iniciar o processamento da imagem para gerar arte pixel baseada nos parâmetros atuais',
    showEnergyMapAndGrid: 'Mostrar Mapa de Energia e Grade',
    showEnergyMapAndGridDesc: 'Mostrar mapa de energia e linhas de grade detectadas na área de resultados para depurar e visualizar efeitos de detecção',
    downloadPureEnergyMap: 'Baixar Mapa de Energia Puro',
    downloadPureEnergyMapDesc: 'Baixar imagem em tons de cinza contendo apenas informações de energia, sem linhas de grade',
    downloadEnergyMapWithGrid: 'Baixar Mapa de Energia+Grade',
    downloadEnergyMapWithGridDesc: 'Baixar imagem de depuração contendo mapa de energia e linhas de grade detectadas',
    downloadPixelArt: 'Baixar Arte Pixel',
    downloadPixelArtDesc: 'Baixar a obra de arte pixel final gerada',
    close: 'Fechar',
    closeDesc: 'Fechar diálogo ou cancelar operação'
  },

  // Status information
  status: {
    detectedPixelSize: 'Tamanho de Pixel Detectado',
    detectedGridLines: 'Linhas de Grade Detectadas',
    outputSize: 'Tamanho de Saída',
    upscaleFactor: 'Fator de Ampliação',
    processingComplete: 'Processamento Concluído!',
    processingFailed: 'Processamento Falhou: '
  },

  // Debug information
  debug: {
    info: 'Info'
  },

  // Home page
  home: {
    subtitle: 'Converte arte pixel pseudo gerada por IA em arte pixel real',
    description: 'Use algoritmos avançados de energia e tecnologia de detecção de bordas para identificar inteligentemente grades de pixels em imagens, gerando arte pixel autêntica. Suporta múltiplos algoritmos e parâmetros personalizados.',
    startConversion: 'Iniciar Conversão',
    learnMore: 'Saiba Mais',
    features: {
      title: 'Recursos',
      energyAlgorithm: {
        title: 'Algoritmo de Energia',
        description: 'Geração de mapa de energia baseada em gradiente com detecção automática de limites de grade de pixels, suportando melhoria direcional e ajustes de parâmetros personalizados.'
      },
      edgeDetection: {
        title: 'Detecção de Bordas',
        description: 'Usa o operador Sobel para detectar bordas horizontais e verticais, identificando inteligentemente linhas de grade de pixels com ajuste automático do tamanho da grade.'
      },
      gridSampling: {
        title: 'Amostragem de Grade',
        description: 'Cria grades regulares através da detecção de picos, suportando múltiplos modos de amostragem incluindo amostragem central, amostragem média e média ponderada.'
      },
      colorQuantization: {
        title: 'Quantização de Cor',
        description: 'Algoritmo inteligente de quantização de cor suportando fusão de cores semelhantes com contagem de cores e limiares de similaridade personalizáveis.'
      },
      parameterAdjustment: {
        title: 'Ajuste de Parâmetros',
        description: 'Opções ricas de parâmetros com efeitos de visualização em tempo real, suportando modo de depuração para mostrar linhas de grade detectadas.'
      },
      oneClickExport: {
        title: 'Exportação de Um Clique',
        description: 'Baixe diretamente imagens de arte pixel de alta qualidade após o processamento, com suporte para fatores de ampliação personalizados.'
      }
    },
    quickStart: {
      title: 'Início Rápido',
      steps: {
        selectImage: {
          title: 'Selecionar Imagem',
          description: 'Carregue a imagem que você deseja converter, suportando formatos de imagem comuns.'
        },
        selectAlgorithm: {
          title: 'Selecionar Algoritmo',
          description: 'Escolha o algoritmo apropriado baseado em suas necessidades e ajuste os parâmetros.'
        },
        processImage: {
          title: 'Processar Imagem',
          description: 'Clique no botão processar, e o sistema converterá automaticamente a imagem em arte pixel.'
        },
        downloadResult: {
          title: 'Baixar Resultado',
          description: 'Visualize o resultado e baixe imagens de arte pixel de alta qualidade.'
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