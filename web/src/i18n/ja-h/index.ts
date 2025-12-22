export default {
  // アプリケーションタイトル
  app: {
    title: '画素芸術生成器'
  },

  // ナビゲーションメニュー
  nav: {
    menu: '導航目録',
    home: '首頁',
    homeCaption: '概要',
    pixelArt: '画素芸術生成',
    pixelArtCaption: '画像を画素芸術へ変換',
    toolbox: '工具箱',
    toolboxCaption: '実用工具集',
    novelAssistant: '小説支援',
    novelAssistantCaption: 'VS Code を小説執筆工具へ',
    checklist: '確認表支援',
    checklistCaption: '確認表管理工具',
    blog: '日誌',
    blogCaption: '技術日誌',
    github: 'GitHub',
    githubCaption: 'github.com/AndreaFrederica'
  },

  // ホームページ
  home: {
    subtitle: 'AI生成の疑似画素芸術を、真正の画素芸術へ変換',
    description:
      '先進的なエネルギー算法と縁検出技術を用い、画像内の画素格子を知的に検出して真正な画素芸術を生成します。複数の算法と詳細参数調整に対応します。',
    startConversion: '変換開始',
    learnMore: '詳細',
    features: {
      title: '機能',
      energyAlgorithm: {
        title: 'エネルギー算法',
        description:
          '勾配に基づくエネルギー地図を生成し、画素格子境界を自動検出します。方向性強化と参数調整に対応します。'
      },
      edgeDetection: {
        title: '縁検出',
        description:
          'Sobel 演算子で水平・垂直の縁を検出し、画素格子線を知的に識別します。格子寸法の自動調整にも対応します。'
      },
      gridSampling: {
        title: '格子抽出',
        description:
          '頂点検出により規則格子を構築し、中心抽出・平均抽出・加重平均など複数の抽出方式に対応します。'
      },
      colorQuantization: {
        title: '色彩量子化',
        description:
          '類似色彩の統合に対応した知的色彩量子化算法を搭載します。色数と類似度閾値を任意に設定できます。'
      },
      parameterAdjustment: {
        title: '参数調整',
        description:
          '豊富な参数選択と即時プレビューを提供します。格子線表示などの検証（調試）機能にも対応します。'
      },
      oneClickExport: {
        title: '一鍵出力',
        description:
          '処理完了後、高品質な画素芸術画像を直接ダウンロードできます。拡大倍率の指定にも対応します。'
      }
    },
    quickStart: {
      title: '迅速開始',
      steps: {
        selectImage: {
          title: '画像選択',
          description: '変換したい画像をアップロードします。一般的な画像形式に対応します。'
        },
        selectAlgorithm: {
          title: '算法選択',
          description: '目的に応じて算法を選び、必要に応じて参数を調整します。'
        },
        processImage: {
          title: '画像処理',
          description: '処理開始を押すと、系統が自動で画素芸術へ変換します。'
        },
        downloadResult: {
          title: '結果取得',
          description: '結果をプレビューし、高品質な画素芸術画像をダウンロードします。'
        }
      }
    }
  },

  // タイトルと説明
  title: {
    pixelSettings: '画素化設定',
    originalImage: '原画像',
    pureEnergyMap: '純粋エネルギー地図',
    energyMapWithGrid: 'エネルギー地図＋格子線',
    pixelatedResult: '画素化結果'
  },

  // ファイルアップロード
  fileUpload: {
    selectImage: '画像選択',
    selectImageHint: '処理対象の画像を選択してください'
  },

  // ピクセル化パラメータ
  pixelParams: {
    title: '画素化参数',
    energyAlgorithmParams: 'エネルギー算法参数',
    gaussianBlur: '高斯ぼかし (σ)',
    gaussianBlurDesc:
      '画像のぼかし量を制御します。値が大きいほど強くぼけ、ノイズ平滑化に有効です。',
    gapTolerance: '間隙許容度',
    gapToleranceDesc:
      '格子線の途切れを連結する許容間隙です。値が大きいほど断線を繋ぎやすくなります。',
    minEnergyThreshold: '最小エネルギー閾値',
    minEnergyThresholdDesc:
      'この閾値未満のエネルギー画素は無視し、弱い縁を除去します。',
    smoothWindowSize: '平滑窓寸法',
    smoothWindowSizeDesc:
      'エネルギー地図を平滑化する窓の大きさです。値が大きいほど平滑化が強くなります。',
    enableEnergyEnhancement: 'エネルギー強化 有効',
    enableEnergyEnhancementDesc: 'エネルギー値の強化を有効にし、縁検出の精度を向上させます。',
    directionalEnhancement: '方向性強化',
    directionalEnhancementDesc: '水平・垂直強化強度を個別に調整することを有効にします。',
    horizontalEnhancement: '水平強化倍率',
    horizontalEnhancementDesc: '水平方向の縁検出強度を強化します。',
    verticalEnhancement: '垂直強化倍率',
    verticalEnhancementDesc: '垂直方向の縁検出強度を強化します。',
    pixelSize: '画素寸法',
    pixelSizeDesc:
      '0 の場合は自動検出します。手動指定時は画素塊の寸法を設定します。',
    manualSet: '手動設定',
    autoDetect: '自動検出',
    minPixelSize: '最小画素寸法',
    minPixelSizeDesc: '自動検出時に許容する最小の画素寸法です。',
    maxPixelSize: '最大画素寸法',
    maxPixelSizeDesc: '自動検出時に許容する最大の画素寸法です。'
  },

  // サンプリングモード
  samplingMode: {
    title: '抽出方式',
    generatePixelArt: '画素芸術生成',
    generatePixelArtDesc:
      '有効時は検出した格子に基づいて画素芸術を生成します。無効時はエネルギー地図のみを表示します。',
    directProportionalSampling: '比例直接抽出（通常画像向）',
    directProportionalSamplingDesc:
      '通常画像を画素芸術へ変換する場合に適します。エネルギー地図による検出は行わず、指定した画素寸法で直接抽出します。',
    energyMapSampling: 'エネルギー地図抽出方式',
    energyMapSamplingDesc:
      '検出した格子から色彩を抽出する方式を選択します（中心抽出／平均抽出／加重平均）。',
    centerSampling: '中心抽出',
    averageSampling: '平均抽出',
    weightedAverage: '加重平均',
    nativeResolution: '原解像度 (1画素=1格子)',
    nativeResolutionDesc:
      '出力画像の各画素を格子 1 つに対応させます。拡大は行いません。',
    upscaleFactor: '拡大倍率',
    upscaleFactorDesc:
      '出力画像の拡大倍率です。0 の場合は最適倍率を自動計算します。',
    auto: '自動',
    weightedRatio: '加重比率',
    weightedRatioDesc:
      '加重平均時の中心重み比率です。値が大きいほど中心画素を重視します。',
    directSamplingParams: '直接抽出参数',
    directSamplingDescription:
      '直接抽出方式は通常画像の画素芸術変換に適します。画素寸法は手動設定が必要です。'
  },

  // 操作ボタン
  actions: {
    startProcessing: '処理開始',
    startProcessingDesc:
      '現在の参数に基づいて画像を処理し、画素芸術を生成します。',
    showEnergyMapAndGrid: 'エネルギー地図＋格子線を表示',
    showEnergyMapAndGridDesc:
      '結果領域にエネルギー地図と検出した格子線を表示します。調試や検出効果の確認に使用します。',
    downloadPureEnergyMap: '純粋エネルギー地図をダウンロード',
    downloadPureEnergyMapDesc:
      '格子線を含まない、エネルギー情報のみの灰階画像をダウンロードします。',
    downloadEnergyMapWithGrid: 'エネルギー地図＋格子線をダウンロード',
    downloadEnergyMapWithGridDesc:
      'エネルギー地図と検出した格子線を含む調試用画像をダウンロードします。',
    downloadPixelArt: '画素芸術をダウンロード',
    downloadPixelArtDesc:
      '生成した最終的な画素芸術作品をダウンロードします。',
    close: '閉鎖',
    closeDesc: '対話窓を閉じる、または操作を取消します。'
  },

  // ステータス情報
  status: {
    detectedPixelSize: '検出画素寸法',
    detectedGridLines: '検出格子線',
    outputSize: '出力寸法',
    upscaleFactor: '拡大倍率',
    processingComplete: '処理完了！',
    processingFailed: '処理失敗：'
  },

  // デバッグ情報
  debug: {
    info: '情報'
  },

  // 言語切り替え
  language: {
    title: '言語',
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
