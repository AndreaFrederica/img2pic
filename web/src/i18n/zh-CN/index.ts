export default {
  // 应用标题
  app: {
    title: '像素艺术生成器'
  },

  // 导航菜单
  nav: {
    menu: '导航菜单',
    home: '首页',
    homeCaption: '项目介绍',
    pixelArt: '像素艺术生成',
    pixelArtCaption: '将图片转换为像素艺术',
    toolbox: '工具箱',
    toolboxCaption: '实用工具集合',
    novelAssistant: '小说助手',
    novelAssistantCaption: '让你的VSCode变成小说写作利器',
    checklist: '检查单助手',
    checklistCaption: '检查单管理工具',
    blog: '博客',
    blogCaption: '技术博客',
    github: 'Github',
    githubCaption: 'github.com/AndreaFrederica'
  },

  // 首页
  home: {
    subtitle: '将AI生成的伪像素画转换成真像素画',
    description: '使用先进的能量算法和边缘检测技术，智能识别图片中的像素网格，生成真正的像素艺术作品。支持多种算法和自定义参数。',
    startConversion: '开始转换',
    learnMore: '了解更多',
    features: {
      title: '功能特点',
      energyAlgorithm: {
        title: '能量算法',
        description: '基于梯度的能量图生成，自动检测像素网格边界，支持方向性增强和自定义参数调整。'
      },
      edgeDetection: {
        title: '边缘检测',
        description: '使用Sobel算子检测水平和垂直边缘，智能识别像素网格线，自动调整网格大小。'
      },
      gridSampling: {
        title: '网格采样',
        description: '通过峰值检测创建规律网格，支持多种采样模式，包括中心采样、平均采样和加权平均。'
      },
      colorQuantization: {
        title: '颜色量化',
        description: '智能颜色量化算法，支持相似颜色合并，可自定义颜色数量和相似度阈值。'
      },
      parameterAdjustment: {
        title: '参数调节',
        description: '丰富的参数选项，实时预览效果，支持调试模式显示检测到的网格线。'
      },
      oneClickExport: {
        title: '一键导出',
        description: '处理完成后可直接下载高质量的像素艺术图片，支持自定义放大倍数。'
      }
    },
    quickStart: {
      title: '快速开始',
      steps: {
        selectImage: {
          title: '选择图片',
          description: '上传您想要转换的图片，支持常见图片格式。'
        },
        selectAlgorithm: {
          title: '选择算法',
          description: '根据您的需求选择合适的算法，并调整参数。'
        },
        processImage: {
          title: '处理图片',
          description: '点击处理按钮，系统将自动将图片转换为像素艺术。'
        },
        downloadResult: {
          title: '下载结果',
          description: '预览结果并下载高质量的像素艺术图片。'
        }
      }
    }
  },

  // 标题和说明
  title: {
    pixelSettings: '像素化设置',
    originalImage: '原始图片',
    pureEnergyMap: '纯能量图',
    energyMapWithGrid: '能量图和网格线',
    pixelatedResult: '像素化结果'
  },

  // 文件上传
  fileUpload: {
    selectImage: '选择图片',
    selectImageHint: '请选择要处理的图片'
  },

  // 像素化参数
  pixelParams: {
    title: '像素化参数',
    pixelSizeParams: '像素大小参数',
    energyAlgorithmParams: '能量算法参数',
    gaussianBlur: '高斯模糊 (σ)',
    gaussianBlurDesc: '控制图像模糊程度，值越大越模糊，用于平滑噪声',
    gapTolerance: '间隙容忍度',
    gapToleranceDesc: '允许的网格线间隙大小，值越大越容易连接断裂的线',
    interpThreshold: '插值线阈值',
    interpThresholdDesc: '控制何时在两条红线之间插入蓝色插值线，间距大于典型间距×此值时插入',
    minEnergyThreshold: '最小能量阈值',
    minEnergyThresholdDesc: '能量值低于此阈值的像素将被忽略，用于过滤弱边缘',
    smoothWindowSize: '平滑窗口大小',
    smoothWindowSizeDesc: '用于平滑能量图的窗口大小，值越大平滑效果越强',
    enableEnergyEnhancement: '启用能量增强',
    enableEnergyEnhancementDesc: '启用后可以增强边缘检测的能量值，提高检测精度',
    directionalEnhancement: '方向性增强',
    directionalEnhancementDesc: '启用后可以分别调整水平和垂直方向的增强强度',
    horizontalEnhancement: '水平增强倍数',
    horizontalEnhancementDesc: '增强水平方向的边缘检测强度',
    verticalEnhancement: '垂直增强倍数',
    verticalEnhancementDesc: '增强垂直方向的边缘检测强度',
    pixelSize: '像素大小',
    pixelSizeDesc: '设置为0时自动检测，手动设置时指定像素块大小',
    manualSet: '手动设置',
    autoDetect: '自动检测',
    minPixelSize: '最小像素大小',
    minPixelSizeDesc: '自动检测时允许的最小像素大小',
    maxPixelSize: '最大像素大小',
    maxPixelSizeDesc: '自动检测时允许的最大像素大小',
    preprocessInterp: '预处理插值',
    preprocessInterpDesc: '在处理前先对图片进行插值放大，可以提高网格识别效果。使用最近邻插值保持像素边缘清晰。'
  },

  // 采样模式
  samplingMode: {
    mode: '处理模式',
    title: '采样模式',
    energyMode: '能量算法模式',
    energyModeDesc: '使用能量算法进行像素化处理，支持多种采样方式',
    directSamplingMode: '直接按比例采样',
    directSamplingModeDesc: '直接按比例网格采样，生成像素画',
    pureUpscaleMode: '纯比例放大',
    pureUpscaleModeDesc: '纯比例放大图片，不做像素化处理',
    generatePixelArt: '生成像素画',
    generatePixelArtDesc: '启用后将根据检测到的网格生成像素画，关闭则只显示能量图',
    directProportionalSampling: '直接按比例采样（适用于普通图片）',
    directProportionalSamplingDesc: '适用于普通图片转换为像素画，不使用能量图检测，直接按指定像素大小采样',
    energyMapSampling: '能量图采样模式',
    energyMapSamplingDesc: '选择如何从检测到的网格中采样颜色：中心采样、平均采样或加权平均',
    centerSampling: '中心采样',
    averageSampling: '平均采样',
    weightedAverage: '加权平均',
    nativeResolution: '原生分辨率 (1像素=1格)',
    nativeResolutionDesc: '输出图像的每个像素对应一个网格，不进行放大',
    native: '原生',
    upscaleFactor: '放大倍数',
    upscaleFactorDesc: '输出图像的放大倍数，设置为0时自动计算最佳倍数',
    upscaleParams: '放大倍数',
    auto: '自动',
    weightedRatio: '加权比例',
    weightedRatioDesc: '加权平均采样时的中心点权重比例，值越大越重视中心像素',
    directSamplingParams: '直接采样参数',
    directSamplingDescription: '直接采样模式适用于普通图片转换为像素画。需要手动设置像素大小。'
  },

  // 操作按钮
  actions: {
    startProcessing: '开始处理',
    startProcessingDesc: '开始处理图片，根据当前参数生成像素画',
    showEnergyMapAndGrid: '显示能量图和网格线',
    showEnergyMapAndGridDesc: '在结果区域显示能量图和检测到的网格线，用于调试和查看检测效果',
    pureUpscaleMode: '纯比例放大模式',
    pureUpscaleModeDesc: '跳过所有检测和处理，直接用最近邻插值放大图片（适用于已经是像素画的图片）',
    downloadPureEnergyMap: '下载纯能量图',
    downloadPureEnergyMapDesc: '下载只包含能量信息的灰度图，不包含网格线',
    downloadEnergyMapWithGrid: '下载能量图+网格',
    downloadEnergyMapWithGridDesc: '下载包含能量图和检测到的网格线的调试图像',
    downloadPixelArt: '下载像素画',
    downloadPixelArtDesc: '下载生成的最终像素画作品',
    close: '关闭',
    closeDesc: '关闭对话框或取消操作'
  },

  // 状态信息
  status: {
    detectedPixelSize: '检测到像素大小',
    detectedGridLines: '检测到网格线',
    outputSize: '输出尺寸',
    upscaleFactor: '放大倍数',
    renderTime: '渲染用时',
    processingComplete: '处理完成！',
    processingFailed: '处理失败：'
  },

  // 调试信息
  debug: {
    info: '提示'
  },

  // WASM 加速
  wasm: {
    title: 'WASM 加速',
    enableWasm: '启用 WASM 加速',
    enableWasmDesc: '使用 WebAssembly 加速图像处理',
    notSupported: '您的浏览器不支持 WebAssembly',
    loading: '正在加载 WASM 模块...',
    loaded: 'WASM 模块加载成功！',
    error: 'WASM 模块加载失败',
    notLoaded: 'WASM 模块未加载，点击下方按钮预加载',
    preload: '预加载 WASM 模块',
    performanceInfo: 'WASM 加速可提升以下操作的性能：',
    performanceConvolution: '大图像卷积运算（1.5-3倍速度）',
    performanceSobel: '边缘检测（1.5-2倍速度）',
    performanceSampling: '像素采样（1.2-1.5倍速度）'
  },

  // 语言切换
  language: {
    title: '语言',
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

  // 主题切换
  theme: {
    title: '主题',
    light: '浅色模式',
    dark: '深色模式',
    auto: '跟随系统'
  }
};
