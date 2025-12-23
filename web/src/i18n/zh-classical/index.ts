export default {
  // 應用標題
  app: {
    title: '像素畫生成器'
  },

  // 導航菜單
  nav: {
    menu: '導航菜單',
    home: '首頁',
    homeCaption: '項目介紹',
    pixelArt: '像素畫生成',
    pixelArtCaption: '圖像轉像素畫',
    toolbox: '工具箱',
    toolboxCaption: '實用工具集合',
    novelAssistant: '小說助手',
    novelAssistantCaption: '化VSCode為小說寫作利器',
    checklist: '清單助手',
    checklistCaption: '清單管理工具',
    blog: '博客',
    blogCaption: '技術博客',
    github: 'Github',
    githubCaption: 'github.com/AndreaFrederica'
  },

  // 首頁
  home: {
    subtitle: '化AI偽像素畫為真像素畫',
    description: '用先進能量算法與邊緣檢測技術，智能識別圖像中像素網格，生成真正像素藝術作品。支持多種算法與自定義參數。',
    startConversion: '開始轉換',
    learnMore: '了解更多',
    features: {
      title: '功能特點',
      energyAlgorithm: {
        title: '能量算法',
        description: '基於梯度之能量圖生成，自動檢測像素網格邊界，支持方向性增強與自定義參數調整。'
      },
      edgeDetection: {
        title: '邊緣檢測',
        description: '用Sobel算子檢測水平與垂直邊緣，智能識別像素網格線，自動調整網格大小。'
      },
      gridSampling: {
        title: '網格採樣',
        description: '通過峰值檢測創建規律網格，支持多種採樣模式，包括中心採樣、平均採樣與加權平均。'
      },
      colorQuantization: {
        title: '顏色量化',
        description: '智能顏色量化算法，支持相似顏色合併，可自定義顏色數量與相似度閾值。'
      },
      parameterAdjustment: {
        title: '參數調整',
        description: '豐富參數選項，實時預覽效果，支持調試模式顯示檢測到之網格線。'
      },
      oneClickExport: {
        title: '一鍵導出',
        description: '處理完成後可直接下載高質量像素藝術圖像，支持自定義放大倍數。'
      }
    },
    quickStart: {
      title: '快速開始',
      steps: {
        selectImage: {
          title: '選擇圖像',
          description: '上傳您想要轉換之圖像，支持常見圖像格式。'
        },
        selectAlgorithm: {
          title: '選擇算法',
          description: '根據您的需求選擇合適之算法，並調整參數。'
        },
        processImage: {
          title: '處理圖像',
          description: '點擊處理按鈕，系統將自動將圖像轉換為像素藝術。'
        },
        downloadResult: {
          title: '下載結果',
          description: '預覽結果並下載高質量像素藝術圖像。'
        }
      }
    }
  },

  // 標題與說明
  title: {
    pixelSettings: '像素化設置',
    originalImage: '原始圖像',
    pureEnergyMap: '純淨能量圖',
    energyMapWithGrid: '能量圖與網格線',
    pixelatedResult: '像素化結果'
  },

  // 文件上傳
  fileUpload: {
    selectImage: '選擇圖像',
    selectImageHint: '請選擇要處理之圖像'
  },

  // 像素化參數
  pixelParams: {
    title: '像素化參數',
    pixelSizeParams: '像素大小參數',
    energyAlgorithmParams: '能量算法參數',
    gaussianBlur: '高斯模糊 (σ)',
    gaussianBlurDesc: '制圖像模糊之度，值大則模糊甚，用以平噪聲',
    gapTolerance: '間隙容差',
    gapToleranceDesc: '允網格線間隙之大小，值大則易連斷線',
    interpThreshold: '插值線閾值',
    interpThresholdDesc: '制兩紅線間插藍線之機，間距大於常距乘此值則插',
    minEnergyThreshold: '最小能量閾值',
    minEnergyThresholdDesc: '能量值低於此閾值之像素將被忽略，用以濾弱邊',
    smoothWindowSize: '平滑窗口大小',
    smoothWindowSizeDesc: '用以平能量圖之窗口大小，值大則平效強',
    enableEnergyEnhancement: '啟用能量增強',
    enableEnergyEnhancementDesc: '啟用能量增強以改進邊緣檢測效果',
    directionalEnhancement: '方向性增強',
    directionalEnhancementDesc: '針對特定方向增強邊緣檢測',
    horizontalEnhancement: '水平增強係數',
    horizontalEnhancementDesc: '增水平方向邊檢之強度',
    verticalEnhancement: '垂直增強係數',
    verticalEnhancementDesc: '增垂直方向邊檢之強度',
    pixelSize: '像素大小',
    pixelSizeDesc: '設為0則自檢，手設時定像素塊之大小',
    manualSet: '手動設置',
    autoDetect: '自動檢測',
    minPixelSize: '最小像素大小',
    minPixelSizeDesc: '自檢時允最小像素之大小',
    maxPixelSize: '最大像素大小',
    maxPixelSizeDesc: '自檢時允最大像素之大小',
    preprocessInterp: '預處理插值',
    preprocessInterpDesc: '處理前先插值放大圖像，以增網格識別之效。用最近鄰插值以保像素邊緣清晰。'
  },

  // 採樣模式
  samplingMode: {
    mode: '處理模式',
    title: '採樣模式',
    energyMode: '能量算法模式',
    energyModeDesc: '用能量算法行像素化，支持多種採樣方式',
    directSamplingMode: '直接按比例採樣',
    directSamplingModeDesc: '直接按比例網格採樣，生像素畫',
    pureUpscaleMode: '純比例放大',
    pureUpscaleModeDesc: '純比例放大圖像，不行像素化處理',
    generatePixelArt: '生成像素藝術',
    generatePixelArtDesc: '啟用時根據檢測之網格生成像素藝術，禁用時僅顯示能量圖',
    directProportionalSampling: '直接比例採樣（用於普通圖像）',
    directProportionalSamplingDesc: '適合普通圖像轉換為像素藝術，不使用能量圖檢測，直接按指定像素大小採樣',
    energyMapSampling: '能量圖採樣模式',
    energyMapSamplingDesc: '選擇如何從檢測之網格中採樣顏色：中心採樣、平均採樣或加權平均',
    centerSampling: '中心採樣',
    averageSampling: '平均採樣',
    weightedAverage: '加權平均',
    nativeResolution: '原生分辨率（1像素=1格子）',
    nativeResolutionDesc: '輸出圖像之每個像素對應一個網格，不進行放大',
    upscaleFactor: '放大倍數',
    upscaleFactorDesc: '輸出圖像之放大倍數，設為0時自計最佳倍數',
    auto: '自動',
    native: '原生',
    upscaleParams: '放大倍數',
    weightedRatio: '加權比例',
    weightedRatioDesc: '加權平均採樣時中心點權重比例，值大則重中心像素',
    directSamplingParams: '直接採樣參數',
    directSamplingDescription: '直接採樣模式適合將普通圖像轉換為像素藝術，需要手動設置像素大小。'
  },

  // 操作按鈕
  actions: {
    startProcessing: '開始處理',
    startProcessingDesc: '根據當前參數處理圖像，生成像素藝術',
    showEnergyMapAndGrid: '顯示能量圖與網格線',
    showEnergyMapAndGridDesc: '在結果區域顯示能量圖與檢測到之網格線，用於調試與檢查檢測效果',
    pureUpscaleMode: '純比例放大模式',
    pureUpscaleModeDesc: '跳過所有檢測與處理，直接用最近鄰插值放大圖片（用於已為像素畫之圖片）',
    downloadPureEnergyMap: '下載純淨能量圖',
    downloadPureEnergyMapDesc: '下載僅含能量信息之灰度圖像，不含網格線',
    downloadEnergyMapWithGrid: '下載能量圖+網格線',
    downloadEnergyMapWithGridDesc: '下載含能量圖與檢測到之網格線之調試圖像',
    downloadPixelArt: '下載像素藝術',
    downloadPixelArtDesc: '下載生成之最終像素藝術作品',
    close: '關閉',
    closeDesc: '關閉對話框或取消操作'
  },

  // 狀態信息
  status: {
    detectedPixelSize: '檢測到之像素大小',
    detectedGridLines: '檢測到之網格線',
    outputSize: '輸出大小',
    upscaleFactor: '放大倍數',
    renderTime: '渲染用時',
    processingComplete: '處理完成！',
    processingFailed: '處理失敗：'
  },

  // 調試信息
  debug: {
    info: '信息'
  },

  // WASM 加速
  wasm: {
    title: 'WASM 加速',
    enableWasm: '啟 WASM 加速',
    enableWasmDesc: '用 WebAssembly 以速圖像處理',
    notSupported: '汝之瀏覽器不支持 WebAssembly',
    loading: '正在載入 WASM 模塊...',
    loaded: 'WASM 模塊載入成功！',
    error: 'WASM 模塊載入失敗',
    notLoaded: 'WASM 模塊未載入',
    preload: '預載入 WASM 模塊',
    performanceInfo: 'WASM 加速可提升以下操作之性能：',
    performanceConvolution: '大圖像卷積運算（一點五至三倍速）',
    performanceSobel: '邊緣檢測（一點五至二倍速）',
    performanceSampling: '像素採樣（一點二至一點五倍速）'
  },

  // 語言切換
  language: {
    title: '語言',
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
  },

  // 主題切換
  theme: {
    title: '主題',
    light: '淺色',
    dark: '深色',
    auto: '隨系統'
  }
};
