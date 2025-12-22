export default {
  // Application title
  app: {
    title: '픽셀 아트 생성기'
  },

  // Navigation menu
  nav: {
    menu: '내비게이션 메뉴',
    home: '홈',
    homeCaption: '프로젝트 소개',
    pixelArt: '픽셀 아트 생성',
    pixelArtCaption: '이미지를 픽셀 아트로 변환',
    toolbox: '도구 상자',
    toolboxCaption: '유용한 도구 모음',
    novelAssistant: '소설 도우미',
    novelAssistantCaption: 'VSCode를 소설 작성 도구로 바꾸세요',
    checklist: '체크리스트 도우미',
    checklistCaption: '체크리스트 관리 도구',
    blog: '블로그',
    blogCaption: '기술 블로그',
    github: 'Github',
    githubCaption: 'github.com/AndreaFrederica'
  },

  // Titles and descriptions
  title: {
    pixelSettings: '픽셀화 설정',
    originalImage: '원본 이미지',
    pureEnergyMap: '순수 에너지 맵',
    energyMapWithGrid: '에너지 맵 및 그리드',
    pixelatedResult: '픽셀화된 결과'
  },

  // File upload
  fileUpload: {
    selectImage: '이미지 선택',
    selectImageHint: '처리할 이미지를 선택해주세요'
  },

  // Pixelization parameters
  pixelParams: {
    title: '픽셀화 매개변수',
    energyAlgorithmParams: '에너지 알고리즘 매개변수',
    gaussianBlur: '가우시안 블러 (σ)',
    gaussianBlurDesc: '이미지 블러 레벨을 제어합니다. 값이 높을수록 노이즈 평활화를 위해 더 많은 블러를 생성합니다.',
    gapTolerance: '간격 허용 오차',
    gapToleranceDesc: '그리드 라인의 허용된 간격 크기입니다. 값이 높을수록 끊어진 라인을 더 쉽게 연결합니다.',
    minEnergyThreshold: '최소 에너지 임계값',
    minEnergyThresholdDesc: '이 임계값보다 에너지가 낮은 픽셀은 무시됩니다. 약한 에지를 필터링하는 데 사용됩니다.',
    smoothWindowSize: '평활화 창 크기',
    smoothWindowSizeDesc: '에너지 맵을 평활화하기 위한 창 크기입니다. 값이 높을수록 더 강한 평활화를 생성합니다.',
    enableEnergyEnhancement: '에너지 향상 활성화',
    enableEnergyEnhancementDesc: '에지 감지 정확도 향상을 위해 에너지 값 향상을 활성화합니다.',
    directionalEnhancement: '방향성 향상',
    directionalEnhancementDesc: '수평 및 수직 향상 강도의 별도 조정을 활성화합니다.',
    horizontalEnhancement: '수평 향상 계수',
    horizontalEnhancementDesc: '수평 에지 감지 강도를 향상시킵니다.',
    verticalEnhancement: '수직 향상 계수',
    verticalEnhancementDesc: '수직 에지 감지 강도를 향상시킵니다.',
    pixelSize: '픽셀 크기',
    pixelSizeDesc: '자동 감지를 위해 0으로 설정하거나 픽셀 블록 크기를 수동으로 지정하세요.',
    manualSet: '수동 설정',
    autoDetect: '자동 감지',
    minPixelSize: '최소 픽셀 크기',
    minPixelSizeDesc: '자동 감지 시 허용되는 최소 픽셀 크기입니다.',
    maxPixelSize: '최대 픽셀 크기',
    maxPixelSizeDesc: '자동 감지 시 허용되는 최대 픽셀 크기입니다.',
    preprocessInterp: '전처리 보간',
    preprocessInterpDesc: '처리 전에 이미지를 보간하여 업스케일하여 그리드 감지를 개선합니다. 최근접 이웃 보간을 사용하여 픽셀 가장자리를 선명하게 유지합니다.'
  },

  // Sampling mode
  samplingMode: {
    title: '샘플링 모드',
    generatePixelArt: '픽셀 아트 생성',
    generatePixelArtDesc: '활성화된 경우 감지된 그리드를 기반으로 픽셀 아트를 생성합니다. 비활성화된 경우 에너지 맵만 표시합니다.',
    directProportionalSampling: '직접 비례 샘플링 (일반 이미지용)',
    directProportionalSamplingDesc: '에너지 맵 감지를 사용하지 않고 일반 이미지를 픽셀 아트로 변환하는 데 적합하며, 지정된 픽셀 크기로 직접 샘플링합니다.',
    energyMapSampling: '에너지 맵 샘플링 모드',
    energyMapSamplingDesc: '감지된 그리드에서 색상을 샘플링하는 방법을 선택하세요: 중심 샘플링, 평균 샘플링 또는 가중 평균',
    centerSampling: '중심 샘플링',
    averageSampling: '평균 샘플링',
    weightedAverage: '가중 평균',
    nativeResolution: '네이티브 해상도 (1픽셀 = 1그리드)',
    nativeResolutionDesc: '각 픽셀이 하나의 그리드 셀에 해당하는 출력 이미지로, 스케일링이 적용되지 않습니다.',
    upscaleFactor: '업스케일 계수',
    upscaleFactorDesc: '출력 이미지 스케일링 계수로, 자동 계산을 위해 0으로 설정하세요.',
    auto: '자동',
    weightedRatio: '가중 비율',
    weightedRatioDesc: '가중 평균 샘플링을 위한 중심점 가중 비율로, 값이 높을수록 중심 픽셀을 더 강조합니다.',
    directSamplingParams: '직접 샘플링 매개변수',
    directSamplingDescription: '직접 샘플링 모드는 일반 이미지를 픽셀 아트로 변환하는 데 적합합니다. 픽셀 크기를 수동으로 설정해야 합니다.'
  },

  // Action buttons
  actions: {
    startProcessing: '처리 시작',
    startProcessingDesc: '현재 매개변수를 기반으로 픽셀 아트를 생성하기 위해 이미지 처리를 시작합니다.',
    showEnergyMapAndGrid: '에너지 맵 및 그리드 표시',
    showEnergyMapAndGridDesc: '디버깅 및 감지 효과 보기를 위해 결과 영역에 에너지 맵과 감지된 그리드 라인을 표시합니다.',
    pureUpscaleMode: '순수 업스케일 모드',
    pureUpscaleModeDesc: '모든 감지와 처리를 건너뛰고, 최근접 이웃 보간을 사용하여 이미지를 직접 업스케일합니다 (이미 픽셀 아트인 이미지용)',
    downloadPureEnergyMap: '순수 에너지 맵 다운로드',
    downloadPureEnergyMapDesc: '그리드 라인 없이 에너지 정보만 포함하는 그레이스케일 이미지를 다운로드합니다.',
    downloadEnergyMapWithGrid: '에너지 맵+그리드 다운로드',
    downloadEnergyMapWithGridDesc: '에너지 맵과 감지된 그리드 라인을 포함하는 디버그 이미지를 다운로드합니다.',
    downloadPixelArt: '픽셀 아트 다운로드',
    downloadPixelArtDesc: '생성된 최종 픽셀 아트 작품을 다운로드합니다.',
    close: '닫기',
    closeDesc: '대화상자 닫기 또는 작업 취소'
  },

  // Status information
  status: {
    detectedPixelSize: '감지된 픽셀 크기',
    detectedGridLines: '감지된 그리드 라인',
    outputSize: '출력 크기',
    upscaleFactor: '업스케일 계수',
    renderTime: '렌더링 시간',
    processingComplete: '처리 완료!',
    processingFailed: '처리 실패: '
  },

  // Debug information
  debug: {
    info: '정보'
  },

  // WASM 가속
  wasm: {
    title: 'WASM 가속',
    enableWasm: 'WASM 가속 활성화',
    enableWasmDesc: 'WebAssembly를 사용하여 이미지 처리 속도 향상',
    notSupported: '브라우저가 WebAssembly를 지원하지 않습니다',
    loading: 'WASM 모듈 로딩 중...',
    loaded: 'WASM 모듈이 성공적으로 로드되었습니다!',
    error: 'WASM 모듈 로드 실패',
    notLoaded: 'WASM 모듈이 로드되지 않음',
    preload: 'WASM 모듈 사전 로드',
    performanceInfo: 'WASM 가속은 다음 작업의 성능을 향상시킵니다:',
    performanceConvolution: '대형 이미지 컨볼루션 (1.5-3배 더 빠름)',
    performanceSobel: '에지 감지 (1.5-2배 더 빠름)',
    performanceSampling: '픽셀 샘플링 (1.2-1.5배 더 빠름)'
  },

  // Home page
  home: {
    subtitle: 'AI 생성 가짜 픽셀 아트를 실제 픽셀 아트로 변환',
    description: '고급 에너지 알고리즘과 에지 감지 기술을 사용하여 이미지에서 픽셀 그리드를 지능적으로 식별하고, 진정한 픽셀 아트를 생성합니다. 여러 알고리즘과 사용자 정의 매개변수를 지원합니다.',
    startConversion: '변환 시작',
    learnMore: '더 알아보기',
    features: {
      title: '기능',
      energyAlgorithm: {
        title: '에너지 알고리즘',
        description: '자동 픽셀 그리드 경계 감지와 함께 그래디언트 기반 에너지 맵 생성으로, 방향성 향상 및 사용자 정의 매개변수 조정을 지원합니다.'
      },
      edgeDetection: {
        title: '에지 감지',
        description: '소벨 연산자를 사용하여 수평 및 수직 에지를 감지하고, 자동 그리드 크기 조정으로 픽셀 그리드 라인을 지능적으로 식별합니다.'
      },
      gridSampling: {
        title: '그리드 샘플링',
        description: '피크 감지를 통해 정규 그리드를 생성하고, 중심 샘플링, 평균 샘플링 및 가중 평균을 포함한 여러 샘플링 모드를 지원합니다.'
      },
      colorQuantization: {
        title: '색상 양자화',
        description: '사용자 정의 가능한 색상 수와 유사성 임계값으로 유사한 색상 병합을 지원하는 지능형 색상 양자화 알고리즘입니다.'
      },
      parameterAdjustment: {
        title: '매개변수 조정',
        description: '실시간 미리보기 효과가 있는 풍부한 매개변수 옵션으로, 감지된 그리드 라인을 표시하는 디버그 모드를 지원합니다.'
      },
      oneClickExport: {
        title: '원클릭 내보내기',
        description: '처리 후 직접 고품질 픽셀 아트 이미지를 다운로드하고, 사용자 정의 스케일링 계수를 지원합니다.'
      }
    },
    quickStart: {
      title: '빠른 시작',
      steps: {
        selectImage: {
          title: '이미지 선택',
          description: '변환하려는 이미지를 업로드하세요. 일반적인 이미지 형식을 지원합니다.'
        },
        selectAlgorithm: {
          title: '알고리즘 선택',
          description: '필요에 따라 적절한 알고리즘을 선택하고 매개변수를 조정하세요.'
        },
        processImage: {
          title: '이미지 처리',
          description: '처리 버튼을 클릭하면 시스템이 자동으로 이미지를 픽셀 아트로 변환합니다.'
        },
        downloadResult: {
          title: '결과 다운로드',
          description: '결과를 미리보고 고품질 픽셀 아트 이미지를 다운로드하세요.'
        }
      }
    }
  },

  // Language switching
  language: {
    title: '언어',
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