interface StorageSettings {
  language?: string;
  pixelSettings?: {
    gaussianBlur: number;
    gapTolerance: number;
    minEnergyThreshold: number;
    smoothWindowSize: number;
    enableEnergyEnhancement: boolean;
    directionalEnhancement: boolean;
    horizontalEnhancement: number;
    verticalEnhancement: number;
    pixelSizeMode: 'manual' | 'auto';
    pixelSize: number;
    minPixelSize: number;
    maxPixelSize: number;
    sampleMode: string;
    upScaleFactor: number;
    weightedRatio: number;
    nativeResolution: boolean;
    showOriginalImage: boolean;
    showEnergyMap: boolean;
    showGridLines: boolean;
    showPixelatedResult: boolean;
  };
}

class StorageService {
  private readonly STORAGE_KEY = 'img2pic-settings';

  saveSettings(settings: StorageSettings): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.warn('Failed to save settings to localStorage:', error);
    }
  }

  loadSettings(): Partial<StorageSettings> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load settings from localStorage:', error);
    }
    return {};
  }

  saveLanguage(language: string): void {
    const currentSettings = this.loadSettings();
    this.saveSettings({
      ...currentSettings,
      language
    });
  }

  loadLanguage(): string | null {
    const settings = this.loadSettings();
    return settings.language || null;
  }

  savePixelSettings(pixelSettings: StorageSettings['pixelSettings']): void {
    const currentSettings = this.loadSettings();
    this.saveSettings({
      ...currentSettings,
      pixelSettings
    } as StorageSettings);
  }

  loadPixelSettings(): StorageSettings['pixelSettings'] | undefined {
    const settings = this.loadSettings();
    return settings.pixelSettings;
  }

  clearSettings(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear settings from localStorage:', error);
    }
  }
}

export const storageService = new StorageService();
export type { StorageSettings };