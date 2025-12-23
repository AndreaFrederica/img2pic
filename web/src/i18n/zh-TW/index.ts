export default {
  // 應用標題
  app: {
    title: '像素藝術生成器'
  },

  // 導覽菜單
  nav: {
    menu: '導覽菜單',
    home: '首頁',
    homeCaption: '項目介紹',
    pixelArt: '像素藝術生成',
    pixelArtCaption: '將圖片轉換為像素藝術',
    toolbox: '工具箱',
    toolboxCaption: '實用工具集合',
    novelAssistant: '小說助手',
    novelAssistantCaption: '讓你的VSCode變成小說寫作利器',
    checklist: '檢查單助手',
    checklistCaption: '檢查單管理工具',
    blog: '部落格',
    blogCaption: '技術部落格',
    github: 'Github',
    githubCaption: 'github.com/AndreaFrederica'
  },

  // 首頁
  home: {
    subtitle: '將AI生成的偽像素畫轉換成真像素畫',
    description: '使用先進的能量演算法和邊緣檢測技術，智能識別圖片中的像素網格，生成真正的像素藝術作品。支援多種演算法和自定義參數。',
    startConversion: '開始轉換',
    learnMore: '了解更多',
    features: {
      title: '功能特點',
      energyAlgorithm: {
        title: '能量演算法',
        description: '基於梯度的能量圖生成，自動檢測像素網格邊界，支援方向性增強和自定義參數調整。'
      },
      edgeDetection: {
        title: '邊緣檢測',
        description: '使用Sobel算子檢測水平和垂直邊緣，智能識別像素網格線，自動調整網格大小。'
      },
      gridSampling: {
        title: '網格採樣',
        description: '通過峰值檢測創建規律網格，支援多種採樣模式，包括中心採樣、平均採樣和加權平均。'
      },
      colorQuantization: {
        title: '顏色量化',
        description: '智能顏色量化演算法，支援相似顏色合併，可自定義顏色數量和相似度閾值。'
      },
      parameterAdjustment: {
        title: '參數調節',
        description: '豐富的參數選項，即時預覽效果，支援除錯模式顯示檢測到的網格線。'
      },
      oneClickExport: {
        title: '一鍵匯出',
        description: '處理完成後可直接下載高品質的像素藝術圖片，支援自定義放大倍數。'
      }
    },
    quickStart: {
      title: '快速開始',
      steps: {
        selectImage: {
          title: '選擇圖片',
          description: '上傳您想要轉換的圖片，支援常見圖片格式。'
        },
        selectAlgorithm: {
          title: '選擇演算法',
          description: '根據您的需求選擇合適的演算法，並調整參數。'
        },
        processImage: {
          title: '處理圖片',
          description: '點擊處理按鈕，系統將自動將圖片轉換為像素藝術。'
        },
        downloadResult: {
          title: '下載結果',
          description: '預覽結果並下載高品質的像素藝術圖片。'
        }
      }
    }
  },

  // 標題和說明
  title: {
    pixelSettings: '像素化設定',
    originalImage: '原始圖片',
    pureEnergyMap: '純能量圖',
    energyMapWithGrid: '能量圖和網格線',
    pixelatedResult: '像素化結果'
  },

  // 檔案上傳
  fileUpload: {
    selectImage: '選擇圖片',
    selectImageHint: '請選擇要處理的圖片'
  },

  // 像素化參數
  pixelParams: {
    title: '像素化參數',
    pixelSizeParams: '像素大小參數',
    energyAlgorithmParams: '能量演算法參數',
    gaussianBlur: '高斯模糊 (σ)',
    gaussianBlurDesc: '控制圖像模糊程度，值越大越模糊，用於平滑噪聲',
    gapTolerance: '間隙容忍度',
    gapToleranceDesc: '允許網格線間隙大小，值越大越容易連接斷裂線',
    interpThreshold: '插值線閾值',
    interpThresholdDesc: '控制何時在兩條紅線之間插入藍色插值線，間距大於典型間距×此值時插入',
    minEnergyThreshold: '最小能量閾值',
    minEnergyThresholdDesc: '能量值低於此閾值之像素將被忽略，用於過濾弱邊緣',
    smoothWindowSize: '平滑視窗大小',
    smoothWindowSizeDesc: '用於平滑能量圖之視窗大小，值越大平滑效果越強',
    enableEnergyEnhancement: '啟用能量增強',
    enableEnergyEnhancementDesc: '啟用能量增強以改進邊緣檢測效果',
    directionalEnhancement: '方向性增強',
    directionalEnhancementDesc: '針對特定方向增強邊緣檢測',
    horizontalEnhancement: '水平增強倍數',
    horizontalEnhancementDesc: '增強水平方向之邊緣檢測強度',
    verticalEnhancement: '垂直增強倍數',
    verticalEnhancementDesc: '增強垂直方向之邊緣檢測強度',
    pixelSize: '像素大小',
    pixelSizeDesc: '設置為0時自動檢測，手動設置時指定像素塊大小',
    manualSet: '手動設定',
    autoDetect: '自動偵測',
    minPixelSize: '最小像素大小',
    minPixelSizeDesc: '自動檢測時允許之最小像素大小',
    maxPixelSize: '最大像素大小',
    maxPixelSizeDesc: '自動檢測時允許之最大像素大小',
    preprocessInterp: '預處理插值',
    preprocessInterpDesc: '在處理前先對圖片進行插值放大，可以提高網格識別效果。使用最近鄰插值保持像素邊緣清晰。'
  },

  // 採樣模式
  samplingMode: {
    mode: '處理模式',
    title: '採樣模式',
    energyMode: '能量演算法模式',
    energyModeDesc: '使用能量演算法進行像素化處理，支援多種採樣方式',
    directSamplingMode: '直接按比例採樣',
    directSamplingModeDesc: '直接按比例網格採樣，生成像素畫',
    pureUpscaleMode: '純比例放大',
    pureUpscaleModeDesc: '純比例放大圖片，不做像素化處理',
    generatePixelArt: '生成像素畫',
    generatePixelArtDesc: '啟用時根據檢測之網格生成像素畫，禁用時僅顯示能量圖',
    directProportionalSampling: '直接按比例採樣（適用於普通圖片）',
    directProportionalSamplingDesc: '適合普通圖片轉換為像素畫，不使用能量圖檢測，直接按指定像素大小採樣',
    energyMapSampling: '能量圖採樣模式',
    energyMapSamplingDesc: '選擇如何從檢測之網格中採樣顏色：中心採樣、平均採樣或加權平均',
    centerSampling: '中心採樣',
    averageSampling: '平均採樣',
    weightedAverage: '加權平均',
    nativeResolution: '原生解析度 (1像素=1格)',
    nativeResolutionDesc: '輸出圖像之每個像素對應一個網格，不進行放大',
    upscaleFactor: '放大倍數',
    upscaleFactorDesc: '輸出圖像之放大倍數，設置為0時自動計算最佳倍數',
    auto: '自動',
    native: '原生',
    upscaleParams: '放大倍數',
    weightedRatio: '加權比例',
    weightedRatioDesc: '加權平均採樣時中心點權重比例，值越大越重視中心像素',
    directSamplingParams: '直接採樣參數',
    directSamplingDescription: '直接採樣模式適用於普通圖片轉換為像素畫。需要手動設定像素大小。'
  },

  // 操作按鈕
  actions: {
    startProcessing: '開始處理',
    startProcessingDesc: '根據當前參數處理圖像，生成像素藝術',
    showEnergyMapAndGrid: '顯示能量圖和網格線',
    showEnergyMapAndGridDesc: '在結果區域顯示能量圖與檢測到之網格線，用於調試與檢查檢測效果',
    pureUpscaleMode: '純比例放大模式',
    pureUpscaleModeDesc: '跳過所有檢測和處理，直接用最近鄰插值放大圖片（適用於已經是像素畫的圖片）',
    downloadPureEnergyMap: '下載純能量圖',
    downloadPureEnergyMapDesc: '下載僅含能量信息之灰度圖像，不含網格線',
    downloadEnergyMapWithGrid: '下載能量圖+網格',
    downloadEnergyMapWithGridDesc: '下載含能量圖與檢測到之網格線之調試圖像',
    downloadPixelArt: '下載像素畫',
    downloadPixelArtDesc: '下載生成之最終像素藝術作品',
    close: '關閉',
    closeDesc: '關閉對話框或取消操作'
  },

  // 狀態資訊
  status: {
    detectedPixelSize: '偵測到像素大小',
    detectedGridLines: '偵測到網格線',
    outputSize: '輸出尺寸',
    upscaleFactor: '放大倍數',
    renderTime: '渲染用時',
    processingComplete: '處理完成！',
    processingFailed: '處理失敗：'
  },

  // 除錯資訊
  debug: {
    info: '提示'
  },

  // WASM 加速
  wasm: {
    title: 'WASM 加速',
    enableWasm: '啟用 WASM 加速',
    enableWasmDesc: '使用 WebAssembly 加速圖像處理',
    notSupported: '您的瀏覽器不支持 WebAssembly',
    loading: '正在加載 WASM 模組...',
    loaded: 'WASM 模組加載成功！',
    error: 'WASM 模組加載失敗',
    notLoaded: 'WASM 模組未加載，點擊下方按鈕預加載',
    preload: '預加載 WASM 模組',
    performanceInfo: 'WASM 加速可提升以下操作之性能：',
    performanceConvolution: '大圖像卷積運算（1.5-3倍速度）',
    performanceSobel: '邊緣檢測（1.5-2倍速度）',
    performanceSampling: '像素採樣（1.2-1.5倍速度）'
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
    light: '淺色模式',
    dark: '深色模式',
    auto: '跟隨系統'
  }
};
