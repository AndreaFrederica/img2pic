export default {
  // アプリケーションタイトル
  app: {
    title: 'ピクセルアート生成器'
  },

  // ナビゲーションメニュー
  nav: {
    menu: 'ナビゲーションメニュー',
    home: 'ホーム',
    homeCaption: 'プロジェクト紹介',
    pixelArt: 'ピクセルアート生成',
    pixelArtCaption: '画像をピクセルアートに変換',
    toolbox: 'ツールボックス',
    toolboxCaption: '実用的なツールコレクション',
    novelAssistant: '小説ヘルパー',
    novelAssistantCaption: 'VSCodeを小説執筆ツールに',
    checklist: 'チェックリストアシスタント',
    checklistCaption: 'チェックリスト管理ツール',
    blog: 'ブログ',
    blogCaption: '技術ブログ',
    github: 'Github',
    githubCaption: 'github.com/AndreaFrederica'
  },

  // ホームページ
  home: {
    subtitle: 'AI生成された疑似ピクセルアートを本物のピクセルアートに変換',
    description: '先進的なエネルギーアルゴリズムとエッジ検出技術を使用して、画像内のピクセルグリッドをインテリジェントに検出し、本物のピクセルアート作品を生成します。複数のアルゴリズムとカスタムパラメータをサポートします。',
    startConversion: '変換開始',
    learnMore: '詳細を見る',
    features: {
      title: '機能',
      energyAlgorithm: {
        title: 'エネルギーアルゴリズム',
        description: '勾配ベースのエネルギーマップ生成により、ピクセルグリッド境界を自動検出し、方向性強化とカスタムパラメータ調整をサポートします。'
      },
      edgeDetection: {
        title: 'エッジ検出',
        description: 'Sobel演算子を使用して水平・垂直エッジを検出し、ピクセルグリッドラインをインテリジェントに識別し、グリッドサイズを自動調整します。'
      },
      gridSampling: {
        title: 'グリッドサンプリング',
        description: 'ピーク検出を通じて規則的なグリッドを作成し、中心サンプリング、平均サンプリング、加重平均など複数のサンプリングモードをサポートします。'
      },
      colorQuantization: {
        title: 'カラー量子化',
        description: '類似色マージングをサポートするインテリジェントカラー量子化アルゴリズムで、カスタマイズ可能なカラー数と類似度しきい値をサポートします。'
      },
      parameterAdjustment: {
        title: 'パラメータ調整',
        description: '豊富なパラメータオプションとリアルタイムプレビュー効果で、検出されたグリッドラインを表示するデバッグモードをサポートします。'
      },
      oneClickExport: {
        title: 'ワンクリックエクスポート',
        description: '処理完了後、高品質のピクセルアート画像を直接ダウンロードでき、カスタム拡大倍率をサポートします。'
      }
    },
    quickStart: {
      title: 'クイックスタート',
      steps: {
        selectImage: {
          title: '画像を選択',
          description: '変換したい画像をアップロードし、一般的な画像フォーマットをサポートします。'
        },
        selectAlgorithm: {
          title: 'アルゴリズムを選択',
          description: 'ニーズに基づいて適切なアルゴリズムを選択し、パラメータを調整します。'
        },
        processImage: {
          title: '画像を処理',
          description: '処理ボタンをクリックすると、システムが自動的に画像をピクセルアートに変換します。'
        },
        downloadResult: {
          title: '結果をダウンロード',
          description: '結果をプレビューし、高品質のピクセルアート画像をダウンロードします。'
        }
      }
    }
  },

  // タイトルと説明
  title: {
    pixelSettings: 'ピクセル化設定',
    originalImage: '元画像',
    pureEnergyMap: '純粋エネルギーマップ',
    energyMapWithGrid: 'エネルギーマップとグリッド線',
    pixelatedResult: 'ピクセル化結果'
  },

  // ファイルアップロード
  fileUpload: {
    selectImage: '画像を選択',
    selectImageHint: '処理する画像を選択してください'
  },

  // ピクセル化パラメータ
  pixelParams: {
    title: 'ピクセル化パラメータ',
    energyAlgorithmParams: 'エネルギーアルゴリズムパラメータ',
    gaussianBlur: 'ガウスぼかし (σ)',
    gaussianBlurDesc: '画像のぼかしレベルを制御し、値が大きいほどノイズを滑らかにします',
    gapTolerance: 'ギャップ許容度',
    gapToleranceDesc: 'グリッド線の許容ギャップサイズ、値が大きいほど切断された線を接続しやすくなります',
    minEnergyThreshold: '最小エネルギー閾値',
    minEnergyThresholdDesc: 'この閾値より低いエネルギーのピクセルは無視され、弱いエッジのフィルタリングに使用されます',
    smoothWindowSize: '平滑化ウィンドウサイズ',
    smoothWindowSizeDesc: 'エネルギーマップを平滑化するウィンドウサイズ、値が大きいほど平滑化効果が強くなります',
    enableEnergyEnhancement: 'エネルギー強化を有効にする',
    enableEnergyEnhancementDesc: '有効にするとエッジ検出のエネルギー値を強化し、検出精度を向上させます',
    directionalEnhancement: '方向性強化',
    directionalEnhancementDesc: '有効にすると水平・垂直方向の強化強度を別々に調整できます',
    horizontalEnhancement: '水平強化倍率',
    horizontalEnhancementDesc: '水平方向のエッジ検出強度を強化します',
    verticalEnhancement: '垂直強化倍率',
    verticalEnhancementDesc: '垂直方向のエッジ検出強度を強化します',
    pixelSize: 'ピクセルサイズ',
    pixelSizeDesc: '0に設定すると自動検出、手動設定時はピクセルブロックサイズを指定します',
    manualSet: '手動設定',
    autoDetect: '自動検出',
    minPixelSize: '最小ピクセルサイズ',
    minPixelSizeDesc: '自動検出時の許容最小ピクセルサイズ',
    maxPixelSize: '最大ピクセルサイズ',
    maxPixelSizeDesc: '自動検出時の許容最大ピクセルサイズ',
    preprocessInterp: '前処理補間',
    preprocessInterpDesc: '処理前に画像を補間して拡大し、グリッド検出の精度を向上させます。最近傍補間を使用してピクセル境界を鮮明に保ちます。'
  },

  // サンプリングモード
  samplingMode: {
    title: 'サンプリングモード',
    generatePixelArt: 'ピクセルアートを生成',
    generatePixelArtDesc: '有効時は検出されたグリッドに基づいてピクセルアートを生成し、無効時はエネルギーマップのみ表示',
    directProportionalSampling: '直接比例サンプリング（通常の画像用）',
    directProportionalSamplingDesc: '通常の画像をピクセルアートに変換する場合に適しています。エネルギーマップ検出を使用せず、指定されたピクセルサイズで直接サンプリングします',
    energyMapSampling: 'エネルギーマップサンプリングモード',
    energyMapSamplingDesc: '検出されたグリッドから色をサンプリングする方法を選択：中心サンプリング、平均サンプリング、または加重平均',
    centerSampling: '中心サンプリング',
    averageSampling: '平均サンプリング',
    weightedAverage: '加重平均',
    nativeResolution: 'ネイティブ解像度 (1ピクセル=1マス)',
    nativeResolutionDesc: '出力画像の各ピクセルが1つのグリッドに対応し、拡大を適用しません',
    upscaleFactor: '拡大倍率',
    upscaleFactorDesc: '出力画像の拡大倍率、0に設定すると自動計算',
    auto: '自動',
    weightedRatio: '加重比率',
    weightedRatioDesc: '加重平均サンプリング時の中心点重み比率、値が大きいほど中心ピクセルを重視します',
    directSamplingParams: '直接サンプリングパラメータ',
    directSamplingDescription: '直接サンプリングモードは、通常の画像をピクセルアートに変換する場合に適しています。ピクセルサイズを手動で設定する必要があります。'
  },

  // 操作ボタン
  actions: {
    startProcessing: '処理開始',
    startProcessingDesc: '現在のパラメータに基づいて画像を処理し、ピクセルアートを生成',
    showEnergyMapAndGrid: 'エネルギーマップとグリッド線を表示',
    showEnergyMapAndGridDesc: '結果領域にエネルギーマップと検出されたグリッド線を表示し、デバッグと検出効果の確認に使用',
    pureUpscaleMode: '純粋拡大モード',
    pureUpscaleModeDesc: 'すべての検出と処理をスキップし、最近傍補間で画像を直接拡大（既にピクセルアートである画像向け）',
    downloadPureEnergyMap: '純粋エネルギーマップをダウンロード',
    downloadPureEnergyMapDesc: 'グリッド線を含まないエネルギー情報のみのグレースケール画像をダウンロード',
    downloadEnergyMapWithGrid: 'エネルギーマップ+グリッドをダウンロード',
    downloadEnergyMapWithGridDesc: 'エネルギーマップと検出されたグリッド線を含むデバッグ画像をダウンロード',
    downloadPixelArt: 'ピクセルアートをダウンロード',
    downloadPixelArtDesc: '生成された最終的なピクセルアート作品をダウンロード',
    close: '閉じる',
    closeDesc: 'ダイアログを閉じるか操作をキャンセル'
  },

  // ステータス情報
  status: {
    detectedPixelSize: '検出されたピクセルサイズ',
    detectedGridLines: '検出されたグリッド線',
    outputSize: '出力サイズ',
    upscaleFactor: '拡大倍率',
    renderTime: 'レンダリング時間',
    processingComplete: '処理完了！',
    processingFailed: '処理失敗：'
  },

  // デバッグ情報
  debug: {
    info: '情報'
  },

  // WASM アクセラレーション
  wasm: {
    title: 'WASM アクセラレーション',
    enableWasm: 'WASM アクセラレーションを有効にする',
    enableWasmDesc: 'WebAssembly を使用して画像処理を高速化',
    notSupported: 'お使いのブラウザは WebAssembly をサポートしていません',
    loading: 'WASM モジュールをロード中...',
    loaded: 'WASM モジュールが正常にロードされました！',
    error: 'WASM モジュールのロードに失敗しました',
    notLoaded: 'WASM モジュールがロードされていません。下のボタンをクリックしてプリロードしてください',
    preload: 'WASM モジュールをプリロード',
    performanceInfo: 'WASM アクセラレーションは以下の操作のパフォーマンスを向上させます：',
    performanceConvolution: '大画像の畳み込み演算（1.5-3倍速）',
    performanceSobel: 'エッジ検出（1.5-2倍速）',
    performanceSampling: 'ピクセルサンプリング（1.2-1.5倍速）'
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
