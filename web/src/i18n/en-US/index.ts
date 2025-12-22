export default {
  // Application title
  app: {
    title: 'Pixel Art Generator'
  },

  // Navigation menu
  nav: {
    menu: 'Navigation Menu',
    home: 'Home',
    homeCaption: 'Project Introduction',
    pixelArt: 'Pixel Art Generation',
    pixelArtCaption: 'Convert images to pixel art',
    toolbox: 'Toolbox',
    toolboxCaption: 'Collection of useful tools',
    novelAssistant: 'Novel Helper',
    novelAssistantCaption: 'Turn your VSCode into a novel writing tool',
    checklist: 'Checklist Assistant',
    checklistCaption: 'Checklist management tool',
    blog: 'Blog',
    blogCaption: 'Technical Blog',
    github: 'Github',
    githubCaption: 'github.com/AndreaFrederica'
  },

  // Titles and descriptions
  title: {
    pixelSettings: 'Pixelization Settings',
    originalImage: 'Original Image',
    pureEnergyMap: 'Pure Energy Map',
    energyMapWithGrid: 'Energy Map and Grid',
    pixelatedResult: 'Pixelated Result'
  },

  // File upload
  fileUpload: {
    selectImage: 'Select Image',
    selectImageHint: 'Please select an image to process'
  },

  // Pixelization parameters
  pixelParams: {
    title: 'Pixelization Parameters',
    energyAlgorithmParams: 'Energy Algorithm Parameters',
    gaussianBlur: 'Gaussian Blur (σ)',
    gaussianBlurDesc: 'Controls image blur level, higher values create more blur for noise smoothing',
    gapTolerance: 'Gap Tolerance',
    gapToleranceDesc: 'Allowed gap size for grid lines, higher values connect broken lines more easily',
    interpThreshold: 'Interpolation Threshold',
    interpThresholdDesc: 'Controls when to insert blue interpolation lines between two red lines, inserted when gap exceeds typical gap × this value',
    minEnergyThreshold: 'Minimum Energy Threshold',
    minEnergyThresholdDesc: 'Pixels with energy below this threshold will be ignored, used to filter weak edges',
    smoothWindowSize: 'Smooth Window Size',
    smoothWindowSizeDesc: 'Window size for smoothing energy map, higher values create stronger smoothing',
    enableEnergyEnhancement: 'Enable Energy Enhancement',
    enableEnergyEnhancementDesc: 'Enables enhancement of energy values for improved edge detection accuracy',
    directionalEnhancement: 'Directional Enhancement',
    directionalEnhancementDesc: 'Enables separate adjustment of horizontal and vertical enhancement intensities',
    horizontalEnhancement: 'Horizontal Enhancement Factor',
    horizontalEnhancementDesc: 'Enhances horizontal edge detection intensity',
    verticalEnhancement: 'Vertical Enhancement Factor',
    verticalEnhancementDesc: 'Enhances vertical edge detection intensity',
    pixelSize: 'Pixel Size',
    pixelSizeDesc: 'Set to 0 for auto-detection, or manually specify pixel block size',
    manualSet: 'Manual Set',
    autoDetect: 'Auto Detect',
    minPixelSize: 'Minimum Pixel Size',
    minPixelSizeDesc: 'Minimum allowed pixel size when auto-detecting',
    maxPixelSize: 'Maximum Pixel Size',
    maxPixelSizeDesc: 'Maximum allowed pixel size when auto-detecting',
    preprocessInterp: 'Preprocess Interpolation',
    preprocessInterpDesc: 'Interpolate and upscale the image before processing to improve grid detection. Uses nearest-neighbor interpolation to keep pixel edges sharp.'
  },

  // Sampling mode
  samplingMode: {
    title: 'Sampling Mode',
    generatePixelArt: 'Generate Pixel Art',
    generatePixelArtDesc: 'When enabled, generates pixel art based on detected grids; when disabled, only shows energy map',
    directProportionalSampling: 'Direct Proportional Sampling (for normal images)',
    directProportionalSamplingDesc: 'Suitable for converting normal images to pixel art without using energy map detection, samples directly at specified pixel size',
    energyMapSampling: 'Energy Map Sampling Mode',
    energyMapSamplingDesc: 'Select how to sample colors from detected grids: center sampling, average sampling, or weighted average',
    centerSampling: 'Center Sampling',
    averageSampling: 'Average Sampling',
    weightedAverage: 'Weighted Average',
    nativeResolution: 'Native Resolution (1 pixel = 1 grid)',
    nativeResolutionDesc: 'Output image where each pixel corresponds to one grid cell, no scaling applied',
    upscaleFactor: 'Upscale Factor',
    upscaleFactorDesc: 'Output image scaling factor, set to 0 for automatic calculation',
    auto: 'Auto',
    weightedRatio: 'Weighted Ratio',
    weightedRatioDesc: 'Center point weight ratio for weighted average sampling, higher values emphasize center pixels more',
    directSamplingParams: 'Direct Sampling Parameters',
    directSamplingDescription: 'Direct sampling mode is suitable for converting normal images to pixel art. Pixel size needs to be set manually.'
  },

  // Action buttons
  actions: {
    startProcessing: 'Start Processing',
    startProcessingDesc: 'Start processing the image to generate pixel art based on current parameters',
    showEnergyMapAndGrid: 'Show Energy Map and Grid',
    showEnergyMapAndGridDesc: 'Display energy map and detected grid lines in the results area for debugging and viewing detection effects',
    pureUpscaleMode: 'Pure Upscale Mode',
    pureUpscaleModeDesc: 'Skip all detection and processing, directly upscale image using nearest-neighbor interpolation (for images that are already pixel art)',
    downloadPureEnergyMap: 'Download Pure Energy Map',
    downloadPureEnergyMapDesc: 'Download grayscale image containing only energy information, without grid lines',
    downloadEnergyMapWithGrid: 'Download Energy Map+Grid',
    downloadEnergyMapWithGridDesc: 'Download debug image containing energy map and detected grid lines',
    downloadPixelArt: 'Download Pixel Art',
    downloadPixelArtDesc: 'Download the generated final pixel art artwork',
    close: 'Close',
    closeDesc: 'Close dialog or cancel operation'
  },

  // Status information
  status: {
    detectedPixelSize: 'Detected Pixel Size',
    detectedGridLines: 'Detected Grid Lines',
    outputSize: 'Output Size',
    upscaleFactor: 'Upscale Factor',
    renderTime: 'Render Time',
    processingComplete: 'Processing Complete!',
    processingFailed: 'Processing Failed: '
  },

  // Debug information
  debug: {
    info: 'Info'
  },

  // WASM Acceleration
  wasm: {
    title: 'WASM Acceleration',
    enableWasm: 'Enable WASM Acceleration',
    enableWasmDesc: 'Use WebAssembly for faster image processing',
    notSupported: 'WebAssembly is not supported in your browser',
    loading: 'Loading WASM module...',
    loaded: 'WASM module loaded successfully!',
    error: 'Failed to load WASM module',
    notLoaded: 'WASM module not loaded, click the button below to preload',
    preload: 'Preload WASM Module',
    performanceInfo: 'WASM acceleration improves performance for:',
    performanceConvolution: 'Large image convolution (1.5-3x faster)',
    performanceSobel: 'Edge detection (1.5-2x faster)',
    performanceSampling: 'Pixel sampling (1.2-1.5x faster)'
  },

  // Home page
  home: {
    subtitle: 'Convert AI-generated pseudo pixel art into real pixel art',
    description: 'Use advanced energy algorithms and edge detection technology to intelligently identify pixel grids in images, generating authentic pixel art. Supports multiple algorithms and custom parameters.',
    startConversion: 'Start Conversion',
    learnMore: 'Learn More',
    features: {
      title: 'Features',
      energyAlgorithm: {
        title: 'Energy Algorithm',
        description: 'Gradient-based energy map generation with automatic pixel grid boundary detection, supporting directional enhancement and custom parameter adjustments.'
      },
      edgeDetection: {
        title: 'Edge Detection',
        description: 'Uses Sobel operator to detect horizontal and vertical edges, intelligently identifying pixel grid lines with automatic grid size adjustment.'
      },
      gridSampling: {
        title: 'Grid Sampling',
        description: 'Creates regular grids through peak detection, supporting multiple sampling modes including center sampling, average sampling, and weighted average.'
      },
      colorQuantization: {
        title: 'Color Quantization',
        description: 'Intelligent color quantization algorithm supporting similar color merging with customizable color count and similarity thresholds.'
      },
      parameterAdjustment: {
        title: 'Parameter Adjustment',
        description: 'Rich parameter options with real-time preview effects, supporting debug mode to display detected grid lines.'
      },
      oneClickExport: {
        title: 'One-Click Export',
        description: 'Directly download high-quality pixel art images after processing, with support for custom scaling factors.'
      }
    },
    quickStart: {
      title: 'Quick Start',
      steps: {
        selectImage: {
          title: 'Select Image',
          description: 'Upload the image you want to convert, supporting common image formats.'
        },
        selectAlgorithm: {
          title: 'Select Algorithm',
          description: 'Choose the appropriate algorithm based on your needs and adjust parameters.'
        },
        processImage: {
          title: 'Process Image',
          description: 'Click the process button, and the system will automatically convert the image to pixel art.'
        },
        downloadResult: {
          title: 'Download Result',
          description: 'Preview the result and download high-quality pixel art images.'
        }
      }
    }
  },

  // Language switching
  language: {
    title: 'Language',
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
