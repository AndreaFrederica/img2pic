export default {
  // Application title
  app: {
    title: 'مولد فن البكسل'
  },

  // Navigation menu
  nav: {
    menu: 'قائمة التنقل',
    home: 'الرئيسية',
    homeCaption: 'مقدمة المشروع',
    pixelArt: 'توليد فن البكسل',
    pixelArtCaption: 'تحويل الصور إلى فن البكسل',
    toolbox: 'صندوق الأدوات',
    toolboxCaption: 'مجموعة من الأدوات المفيدة',
    novelAssistant: 'مساعد الرواية',
    novelAssistantCaption: 'حول محرر VSCode الخاص بك إلى أداة لكتابة الروايات',
    checklist: 'مساعد قائمة التحقق',
    checklistCaption: 'أداة إدارة قائمة التحقق',
    blog: 'المدونة',
    blogCaption: 'المدونة التقنية',
    github: 'Github',
    githubCaption: 'github.com/AndreaFrederica'
  },

  // Titles and descriptions
  title: {
    pixelSettings: 'إعدادات البكسلة',
    originalImage: 'الصورة الأصلية',
    pureEnergyMap: 'خريطة الطاقة النقية',
    energyMapWithGrid: 'خريطة الطاقة والشبكة',
    pixelatedResult: 'النتيجة المبكسلة'
  },

  // File upload
  fileUpload: {
    selectImage: 'اختر صورة',
    selectImageHint: 'الرجاء اختيار صورة لمعالجتها'
  },

  // Pixelization parameters
  pixelParams: {
    title: 'معلمات البكسلة',
    energyAlgorithmParams: 'معلمات خوارزمية الطاقة',
    gaussianBlur: 'التمويه الغاوسي (σ)',
    gaussianBlurDesc: 'يcontrol مستوى تمويه الصورة، القيم الأعلى تخلق تمويهًا أكثر لتنعيم الضوضاء',
    gapTolerance: 'تسامح الفجوة',
    gapToleranceDesc: 'حجم الفجوة المسموح به لخطوط الشبكة، القيم الأعلى تربط الخطوط المكسورة بسهولة أكبر',
    minEnergyThreshold: 'عتبة الطاقة الدنيا',
    minEnergyThresholdDesc: 'ستتم تجاهل البكسلات ذات الطاقة أقل من هذه العتبة، تُستخدم لتصفية الحواف الضعيفة',
    smoothWindowSize: 'حجم النافذة للتنعيم',
    smoothWindowSizeDesc: 'حجم النافذة لتنعيم خريطة الطاقة، القيم الأعلى تخلق تنعيمًا أقوى',
    enableEnergyEnhancement: 'تمكين تعزيز الطاقة',
    enableEnergyEnhancementDesc: 'يمكّن تعزيز قيم الطاقة لتحسين دقة كشف الحواف',
    directionalEnhancement: 'التعزيز الاتجاهي',
    directionalEnhancementDesc: 'يمكّن التعديل المنفصل لشدد التعزيز الأفقي والعمودي',
    horizontalEnhancement: 'عامل التعزيز الأفقي',
    horizontalEnhancementDesc: 'يعزز شدة كشف الحواف الأفقية',
    verticalEnhancement: 'عامل التعزيز العمودي',
    verticalEnhancementDesc: 'يعزز شدة كشف الحواف العمودية',
    pixelSize: 'حجم البكسل',
    pixelSizeDesc: 'اضبط على 0 للكشف التلقائي، أو حدد يدويًا حجم كتلة البكسل',
    manualSet: 'ضبط يدوي',
    autoDetect: 'كشف تلقائي',
    minPixelSize: 'الحد الأدنى لحجم البكسل',
    minPixelSizeDesc: 'الحد الأدنى المسموح به لحجم البكسل عند الكشف التلقائي',
    maxPixelSize: 'الحد الأقصى لحجم البكسل',
    maxPixelSizeDesc: 'الحد الأقصى المسموح به لحجم البكسل عند الكشف التلقائي'
  },

  // Sampling mode
  samplingMode: {
    title: 'وضع العينات',
    generatePixelArt: 'توليد فن البكسل',
    generatePixelArtDesc: 'عند التمكين، يولد فن البكسل بناءً على الشبكات المكتشفة؛ عند التعطيل، يظهر فقط خريطة الطاقة',
    directProportionalSampling: 'العيّنات النسبية المباشرة (للصور العادية)',
    directProportionalSamplingDesc: 'مناسب لتحويل الصور العادية إلى فن البكسل دون استخدام كشف خريطة الطاقة، ويأخذ عينات مباشرة عند حجم البكسل المحدد',
    energyMapSampling: 'وضع عينات خريطة الطاقة',
    energyMapSamplingDesc: 'اختر كيفية أخذ عينات الألوان من الشبكات المكتشفة: عينات المركز، عينات المتوسط، أو المتوسط الموزون',
    centerSampling: 'عينات المركز',
    averageSampling: 'عينات المتوسط',
    weightedAverage: 'المتوسط الموزون',
    nativeResolution: 'الدقة الأصلية (1 بكسل = 1 شبكة)',
    nativeResolutionDesc: 'صورة الإخراج حيث كل بكسل يتوافق مع خلية شبكة، لا يتم تطبيق تحجيم',
    upscaleFactor: 'عامل التحجيم',
    upscaleFactorDesc: 'عامل تحجيم صورة الإخراج، اضبط على 0 للحساب التلقائي',
    auto: 'تلقائي',
    weightedRatio: 'النسبة الموزونة',
    weightedRatioDesc: 'نسبة وزن نقطة المركز لعينات المتوسط الموزون، القيم الأعلى تؤكد على البكسلات المركزية أكثر',
    directSamplingParams: 'معلمات العينات المباشرة',
    directSamplingDescription: 'وضع العينات المباشر مناسب لتحويل الصور العادية إلى فن البكسل. يجب ضبط حجم البكسل يدويًا.'
  },

  // Action buttons
  actions: {
    startProcessing: 'بدء المعالجة',
    startProcessingDesc: 'بدء معالجة الصورة لتوليد فن البكسل بناءً على المعلمات الحالية',
    showEnergyMapAndGrid: 'إظهار خريطة الطاقة والشبكة',
    showEnergyMapAndGridDesc: 'عرض خريطة الطاقة وخطوط الشبكة المكتشفة في منطقة النتائج لتصحيح الأخطاء وعرض آثار الكشف',
    downloadPureEnergyMap: 'تنزيل خريطة الطاقة النقية',
    downloadPureEnergyMapDesc: 'تنزيل صورة بالدرجات الرمادية تحتوي فقط على معلومات الطاقة، بدون خطوط شبكة',
    downloadEnergyMapWithGrid: 'تنزيل خريطة الطاقة+الشبكة',
    downloadEnergyMapWithGridDesc: 'تنزيل صورة تصحيح تحتوي على خريطة الطاقة وخطوط الشبكة المكتشفة',
    downloadPixelArt: 'تنزيل فن البكسل',
    downloadPixelArtDesc: 'تنزيل عمل فن البكسل النهائي المولد',
    close: 'إغلاق',
    closeDesc: 'إغلاق مربع الحوار أو إلغاء العملية'
  },

  // Status information
  status: {
    detectedPixelSize: 'حجم البكسل المكتشف',
    detectedGridLines: 'خطوط الشبكة المكتشفة',
    outputSize: 'حجم الإخراج',
    upscaleFactor: 'عامل التحجيم',
    processingComplete: 'اكتملت المعالجة!',
    processingFailed: 'فشلت المعالجة: '
  },

  // Debug information
  debug: {
    info: 'معلومات'
  },

  // Home page
  home: {
    subtitle: 'تحويل فن البكسل الزائف المولد بواسطة الذكاء الاصطناعي إلى فن البكسل الحقيقي',
    description: 'استخدم خوارزميات الطاقة المتقدمة وتقنية كشف الحواف لتحديد شبكات البكسل في الصور بذكاء، وتوليد فن البكسل الأصيل. يدعم خوارزميات متعددة ومعلمات مخصصة.',
    startConversion: 'بدء التحويل',
    learnMore: 'تعلم المزيد',
    features: {
      title: 'الميزات',
      energyAlgorithm: {
        title: 'خوارزمية الطاقة',
        description: 'توليد خريطة الطاقة القائمة على التدرج مع كشف تلقائي لحدود شبكة البكسل، يدعم التعزيز الاتجاهي وتعديلات المعلمات المخصصة.'
      },
      edgeDetection: {
        title: 'كشف الحواف',
        description: 'يستخدم عامل Sobel للكشف عن الحواف الأفقية والعمودية، ويحدد بذكاء خطوط شبكة البكسل مع ضبط تلقائي لحجم الشبكة.'
      },
      gridSampling: {
        title: 'عيّنات الشبكة',
        description: 'ينشئ شبكات منتظمة من خلال كشف القمم، ويدعم أوضاع عينات متعددة بما في ذلك عينات المركز، عينات المتوسط، والمتوسط الموزون.'
      },
      colorQuantization: {
        title: 'تكميم اللون',
        description: 'خوارزمية ذكية لتكميم اللون تدعم دمج الألوان المتشابهة مع عدد ألوان وعتبات تشابه قابلة للتخصيص.'
      },
      parameterAdjustment: {
        title: 'ضبط المعلمات',
        description: 'خيارات معلمات غنية مع آثار معاينة فورية، تدعم وضع التصحيح لعرض خطوط الشبكة المكتشفة.'
      },
      oneClickExport: {
        title: 'تصدير بنقرة واحدة',
        description: 'قم بتنزيل مباشر لصور فن البكسل عالية الجودة بعد المعالجة، مع دعم عوامل التحجيم المخصصة.'
      }
    },
    quickStart: {
      title: 'بداية سريعة',
      steps: {
        selectImage: {
          title: 'اختر صورة',
          description: 'ارفع الصورة التي تريد تحويلها، تدعم تنسيقات الصور الشائعة.'
        },
        selectAlgorithm: {
          title: 'اختر الخوارزمية',
          description: 'اختر الخوارزمية المناسبة بناءً على احتياجاتك واضبط المعلمات.'
        },
        processImage: {
          title: 'معالجة الصورة',
          description: 'انقر على زر المعالجة، والنظام سيحول الصورة تلقائيًا إلى فن البكسل.'
        },
        downloadResult: {
          title: 'تنزيل النتيجة',
          description: 'معاينة النتيجة وتنزيل صور فن البكسل عالية الجودة.'
        }
      }
    }
  },

  // Language switching
  language: {
    title: 'اللغة',
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