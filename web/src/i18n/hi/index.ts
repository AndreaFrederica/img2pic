export default {
  // Application title
  app: {
    title: 'पिक्सेल आर्ट जेनरेटर'
  },

  // Navigation menu
  nav: {
    menu: 'नेविगेशन मेनू',
    home: 'होम',
    homeCaption: 'परियोजना परिचय',
    pixelArt: 'पिक्सेल आर्ट जेनरेशन',
    pixelArtCaption: 'चित्रों को पिक्सेल आर्ट में बदलें',
    toolbox: 'टूलबॉक्स',
    toolboxCaption: 'उपयोगी उपकरणों का संग्रह',
    novelAssistant: 'उपन्यास सहायक',
    novelAssistantCaption: 'अपने VSCode को उपन्यास लेखन उपकरण में बदलें',
    checklist: 'चेकलिस्ट सहायक',
    checklistCaption: 'चेकलिस्ट प्रबंधन उपकरण',
    blog: 'ब्लॉग',
    blogCaption: 'तकनीकी ब्लॉग',
    github: 'Github',
    githubCaption: 'github.com/AndreaFrederica'
  },

  // Titles and descriptions
  title: {
    pixelSettings: 'पिक्सेलाइज़ेशन सेटिंग्स',
    originalImage: 'मूल चित्र',
    pureEnergyMap: 'शुद्ध ऊर्जा मैप',
    energyMapWithGrid: 'ऊर्जा मैप और ग्रिड',
    pixelatedResult: 'पिक्सेलेटेड परिणाम'
  },

  // File upload
  fileUpload: {
    selectImage: 'चित्र चुनें',
    selectImageHint: 'कृपया प्रसंस्करण के लिए एक चित्र चुनें'
  },

  // Pixelization parameters
  pixelParams: {
    title: 'पिक्सेलाइज़ेशन पैरामीटर',
    pixelSizeParams: 'पिक्सेल साइज़ पैरामीटर',
    energyAlgorithmParams: 'ऊर्जा एल्गोरिथ्म पैरामीटर',
    gaussianBlur: 'गाऊसीयन ब्लर (σ)',
    gaussianBlurDesc: 'चित्र के ब्लर स्तर को नियंत्रित करता है, उच्च मान शोर सुधार के लिए अधिक ब्लर बनाते हैं',
    gapTolerance: 'अंतर सहिष्णुता',
    gapToleranceDesc: 'ग्रिड लाइनों के लिए अनुमत अंतर आकार, उच्च मान टूटी हुई लाइनों को आसानी से जोड़ते हैं',
    interpThreshold: 'इंटरपोलेशन थ्रेसहोल्ड',
    interpThresholdDesc: 'दो लाल लाइनों के बीच नीली इंटरपोलेशन लाइनें कब डाली जाएं, यह नियंत्रित करता है, जब अंतर विशिष्ट अंतर × यह मान से अधिक हो तो डाला जाता है',
    minEnergyThreshold: 'न्यूनतम ऊर्जा थ्रेशहोल्ड',
    minEnergyThresholdDesc: 'इस थ्रेशहोल्ड से कम ऊर्जा वाले पिक्सेल अनदेखे कर दिए जाएंगे, कमजोर किनारों को फ़िल्टर करने के लिए उपयोग किया जाता है',
    smoothWindowSize: 'स्मूथ विंडो साइज़',
    smoothWindowSizeDesc: 'ऊर्जा मैप को स्मूथ करने के लिए विंडो साइज़, उच्च मान अधिक मजबूत स्मूथिंग बनाते हैं',
    enableEnergyEnhancement: 'ऊर्जा एन्हांसमेंट सक्षम करें',
    enableEnergyEnhancementDesc: 'बेहतर किनारा डिटेक्शन एक्यूरेसी के लिए ऊर्जा मानों के एन्हांसमेंट को सक्षम बनाता है',
    directionalEnhancement: 'दिशात्मक एन्हांसमेंट',
    directionalEnhancementDesc: 'क्षैतिज और ऊर्ध्वाधर एन्हांसमेंट तीव्रताओं के अलग-अलग समायोजन को सक्षम बनाता है',
    horizontalEnhancement: 'क्षैतिज एन्हांसमेंट फैक्टर',
    horizontalEnhancementDesc: 'क्षैतिज किनारा डिटेक्शन तीव्रता को बढ़ाता है',
    verticalEnhancement: 'ऊर्ध्वाधर एन्हांसमेंट फैक्टर',
    verticalEnhancementDesc: 'ऊर्ध्वाधर किनारा डिटेक्शन तीव्रता को बढ़ाता है',
    pixelSize: 'पिक्सेल साइज़',
    pixelSizeDesc: 'ऑटो-डिटेक्शन के लिए 0 पर सेट करें, या मैन्युअल रूप से पिक्सेल ब्लॉक साइज़ निर्दिष्ट करें',
    manualSet: 'मैनुअल सेट',
    autoDetect: 'ऑटो डिटेक्ट',
    minPixelSize: 'न्यूनतम पिक्सेल साइज़',
    minPixelSizeDesc: 'ऑटो-डिटेक्ट करते समय न्यूनतम अनुमत पिक्सेल साइज़',
    maxPixelSize: 'अधिकतम पिक्सेल साइज़',
    maxPixelSizeDesc: 'ऑटो-डिटेक्ट करते समय अधिकतम अनुमत पिक्सेल साइज़',
    preprocessInterp: 'प्रीप्रोसेसिंग इंटरपोलेशन',
    preprocessInterpDesc: 'ग्रिड डिटेक्शन में सुधार के लिए प्रोसेसिंग से पहले छवि को इंटरपोलेट और अपस्केल करें। पिक्सेल किनारों को तीक्ष्ण रखने के लिए नियरेस्ट-नेबर इंटरपोलेशन का उपयोग करता है।'
  },

  // Sampling mode
  samplingMode: {
    mode: 'प्रोसेसिंग मोड',
    title: 'सैंपलिंग मोड',
    energyMode: 'ऊर्जा एल्गोरिथ्म मोड',
    energyModeDesc: 'पिक्सेलाइज़ेशन के लिए ऊर्जा एल्गोरिथ्म का उपयोग करें, कई सैंपलिंग विधियों का समर्थन करता है',
    directSamplingMode: 'प्रत्यक्ष आनुपातिक सैंपलिंग',
    directSamplingModeDesc: 'पिक्सेल आर्ट उत्पन्न करने के लिए प्रत्यक्ष आनुपातिक ग्रिड सैंपलिंग',
    pureUpscaleMode: 'शुद्ध अपस्केल',
    pureUpscaleModeDesc: 'बिना पिक्सेलाइज़ेशन के शुद्ध छवि अपस्केल',
    generatePixelArt: 'पिक्सेल आर्ट जेनरेट करें',
    generatePixelArtDesc: 'जब सक्षम होता है, तो डिटेक्टेड ग्रिड पर आधारित पिक्सेल आर्ट जेनरेट करता है; जब अक्षम होता है, तो केवल ऊर्जा मैप दिखाता है',
    directProportionalSampling: 'प्रत्यक्ष आनुपातिक सैंपलिंग (सामान्य चित्रों के लिए)',
    directProportionalSamplingDesc: 'सामान्य चित्रों को पिक्सेल आर्ट में बदलने के लिए उपयुक्त, ऊर्जा मैप डिटेक्शन का उपयोग किए बिना, निर्दिष्ट पिक्सेल साइज़ पर सीधे सैंपल करता है',
    energyMapSampling: 'ऊर्जा मैप सैंपलिंग मोड',
    energyMapSamplingDesc: 'डिटेक्टेड ग्रिड से रंगों को कैसे सैंपल करें: केंद्र सैंपलिंग, औसत सैंपलिंग, या वेटेड औसत',
    centerSampling: 'केंद्र सैंपलिंग',
    averageSampling: 'औसत सैंपलिंग',
    weightedAverage: 'वेटेड औसत',
    nativeResolution: 'नेटिव रिज़ॉल्यूशन (1 पिक्सेल = 1 ग्रिड)',
    nativeResolutionDesc: 'आउटपुट चित्र जहां प्रत्येक पिक्सेल एक ग्रिड सेल के अनुरूप होता है, कोई स्केलिंग लागू नहीं होती',
    upscaleFactor: 'अपस्केल फैक्टर',
    upscaleFactorDesc: 'आउटपुट चित्र स्केलिंग फैक्टर, स्वचालित गणना के लिए 0 पर सेट करें',
    auto: 'ऑटो',
    native: 'नेटिव',
    upscaleParams: 'अपस्केल फैक्टर',
    weightedRatio: 'वेटेड रेशियो',
    weightedRatioDesc: 'वेटेड औसत सैंपलिंग के लिए केंद्र बिंदु वेट अनुपात, उच्च मान केंद्र पिक्सेलों को अधिक जोर देते हैं',
    directSamplingParams: 'प्रत्यक्ष सैंपलिंग पैरामीटर',
    directSamplingDescription: 'प्रत्यक्ष सैंपलिंग मोड सामान्य चित्रों को पिक्सेल आर्ट में बदलने के लिए उपयुक्त है। पिक्सेल साइज़ को मैन्युअल रूप से सेट करने की आवश्यकता है।'
  },

  // Action buttons
  actions: {
    startProcessing: 'प्रसंस्करण प्रारंभ करें',
    startProcessingDesc: 'वर्तमान पैरामीटर के आधार पर पिक्सेल आर्ट जेनरेट करने के लिए चित्र प्रसंस्करण प्रारंभ करें',
    showEnergyMapAndGrid: 'ऊर्जा मैप और ग्रिड दिखाएं',
    showEnergyMapAndGridDesc: 'डिबग करने और डिटेक्शन प्रभाव देखने के लिए परिणाम क्षेत्र में ऊर्जा मैप और डिटेक्टेड ग्रिड लाइनें प्रदर्शित करें',
    pureUpscaleMode: 'शुद्ध अपस्केल मोड',
    pureUpscaleModeDesc: 'सभी पहचान और प्रसंस्करण को छोड़ें, निकटतम-पड़ोसी इंटरपोलेशन का उपयोग करके सीधे छवि को अपस्केल करें (जो छवियों के लिए जो पहले से पिक्सेल आर्ट हैं)',
    downloadPureEnergyMap: 'शुद्ध ऊर्जा मैप डाउनलोड करें',
    downloadPureEnergyMapDesc: 'केवल ऊर्जा जानकारी युक्त ग्रेस्केल चित्र डाउनलोड करें, बिना ग्रिड लाइनों के',
    downloadEnergyMapWithGrid: 'ऊर्जा मैप+ग्रिड डाउनलोड करें',
    downloadEnergyMapWithGridDesc: 'ऊर्जा मैप और डिटेक्टेड ग्रिड लाइनों युक्त डिबग चित्र डाउनलोड करें',
    downloadPixelArt: 'पिक्सेल आर्ट डाउनलोड करें',
    downloadPixelArtDesc: 'जेनरेट किए गए अंतिम पिक्सेल आर्ट कलाकृति डाउनलोड करें',
    close: 'बंद करें',
    closeDesc: 'डायलॉग बंद करें या ऑपरेशन रद्द करें'
  },

  // Status information
  status: {
    detectedPixelSize: 'डिटेक्टेड पिक्सेल साइज़',
    detectedGridLines: 'डिटेक्टेड ग्रिड लाइनें',
    outputSize: 'आउटपुट साइज़',
    upscaleFactor: 'अपस्केल फैक्टर',
    renderTime: 'रेंडरिंग समय',
    processingComplete: 'प्रसंस्करण पूर्ण!',
    processingFailed: 'प्रसंस्करण विफल: '
  },

  // Debug information
  debug: {
    info: 'जानकारी'
  },

  // WASM त्वरण
  wasm: {
    title: 'WASM त्वरण',
    enableWasm: 'WASM त्वरण सक्षम करें',
    enableWasmDesc: 'तेजी से छवि प्रसंस्करण के लिए WebAssembly का उपयोग करें',
    notSupported: 'WebAssembly आपके ब्राउज़र में समर्थित नहीं है',
    loading: 'WASM मॉड्यूल लोड हो रहा है...',
    loaded: 'WASM मॉड्यूल सफलतापूर्वक लोड हो गया!',
    error: 'WASM मॉड्यूल लोड करने में विफल',
    notLoaded: 'WASM मॉड्यूल लोड नहीं हुआ',
    preload: 'WASM मॉड्यूल प्रीलोड करें',
    performanceInfo: 'WASM त्वरण निम्नलिखित के प्रदर्शन में सुधार करता है:',
    performanceConvolution: 'बड़ा छवि कनवल्शन (1.5-3x तेज)',
    performanceSobel: 'किनारा का पता लगाना (1.5-2x तेज)',
    performanceSampling: 'पिक्सेल नमूनाकरण (1.2-1.5x तेज)'
  },

  // Home page
  home: {
    subtitle: 'AI द्वारा जेनरेट किए गए छद्म पिक्सेल आर्ट को वास्तविक पिक्सेल आर्ट में बदलें',
    description: 'उन्नत ऊर्जा एल्गोरिदम और किनारा डिटेक्शन तकनीक का उपयोग करके चित्रों में पिक्सेल ग्रिड को बुद्धिमानी से पहचानें, प्रामाणिक पिक्सेल आर्ट जेनरेट करना। कई एल्गोरिदम और कस्टम पैरामीटर का समर्थन करता है।',
    startConversion: 'रूपांतरण प्रारंभ करें',
    learnMore: 'और अधिक जानें',
    features: {
      title: 'विशेषताएं',
      energyAlgorithm: {
        title: 'ऊर्जा एल्गोरिथ्म',
        description: 'स्वचालित पिक्सेल ग्रिड सीमा डिटेक्शन के साथ ग्रेडिएंट-आधारित ऊर्जा मैप जेनरेशन, दिशात्मक एन्हांसमेंट और कस्टम पैरामीटर एडजस्टमेंट का समर्थन करता है।'
      },
      edgeDetection: {
        title: 'किनारा डिटेक्शन',
        description: 'क्षैतिज और ऊर्ध्वाधर किनारों को डिटेक्ट करने के लिए सोबल ऑपरेटर का उपयोग करता है, स्वचालित ग्रिड साइज़ एडजस्टमेंट के साथ पिक्सेल ग्रिड लाइनों को बुद्धिमानी से पहचानता है।'
      },
      gridSampling: {
        title: 'ग्रिड सैंपलिंग',
        description: 'पीक डिटेक्शन के माध्यम से नियमित ग्रिड बनाता है, केंद्र सैंपलिंग, औसत सैंपलिंग और वेटेड औसत सहित कई सैंपलिंग मोड का समर्थन करता है।'
      },
      colorQuantization: {
        title: 'कलर क्वांटाइज़ेशन',
        description: 'समान रंगों को मर्ज करने के लिए बुद्धिमान कलर क्वांटाइज़ेशन एल्गोरिदम जो कस्टमाइज़ेबल कलर काउंट और सिमिलैरिटी थ्रेशोल्ड का समर्थन करता है।'
      },
      parameterAdjustment: {
        title: 'पैरामीटर एडजस्टमेंट',
        description: 'रीयल-टाइम प्रीव्यू इफेक्ट्स के साथ समृद्ध पैरामीटर विकल्प, डिटेक्टेड ग्रिड लाइनों को दिखाने के लिए डिबग मोड का समर्थन करता है।'
      },
      oneClickExport: {
        title: 'वन-क्लिक एक्सपोर्ट',
        description: 'प्रसंस्करण के बाद सीधे उच्च-गुणवत्ता वाले पिक्सेल आर्ट चित्र डाउनलोड करें, कस्टम स्केलिंग फैक्टर्स का समर्थन के साथ।'
      }
    },
    quickStart: {
      title: 'त्वरित प्रारंभ',
      steps: {
        selectImage: {
          title: 'चित्र चुनें',
          description: 'वह चित्र अपलोड करें जिसे आप बदलना चाहते हैं, सामान्य चित्र प्रारूपों का समर्थन करता है।'
        },
        selectAlgorithm: {
          title: 'एल्गोरिथ्म चुनें',
          description: 'अपनी आवश्यकताओं के आधार पर उपयुक्त एल्गोरिथ्म चुनें और पैरामीटर समायोजित करें।'
        },
        processImage: {
          title: 'चित्र प्रसंस्करण',
          description: 'प्रसंस्करण बटन पर क्लिक करें, और सिस्टम स्वचालित रूप से चित्र को पिक्सेल आर्ट में बदल देगा।'
        },
        downloadResult: {
          title: 'परिणाम डाउनलोड करें',
          description: 'परिणाम पूर्वावलोकन करें और उच्च-गुणवत्ता वाले पिक्सेल आर्ट चित्र डाउनलोड करें।'
        }
      }
    }
  },

  // Language switching
  language: {
    title: 'भाषा',
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

  // थीम स्विचिंग
  theme: {
    title: 'थीम',
    light: 'लाइट मोड',
    dark: 'डार्क मोड',
    auto: 'सिस्टम फॉलो'
  }
};