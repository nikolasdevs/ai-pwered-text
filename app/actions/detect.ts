interface CustomWindow extends Window {
  ai: {
    languageDetector?: {
      create: (options: { apiKey: string }) => Promise<{
        detect: (
          text: string
        ) => Promise<Array<{ language: string; confidence: number }>>;
      }>;
      capabilities: () => Promise<{
        languageAvailable: (lang: string) => boolean;
      }>;
    };
  };
}

const LANGUAGE_DETECTOR_API_KEY =
  "AlvnQOgXEaDkm1KTvW3ZasTnP5EAdLCnhbhfTzwAE2D5V1t2jyJ3+jjnQWgXOtgO40FeJ2rt7V69DIsxHW/7uA4AAABXeyJvcmlnaW4iOiJodHRwOi8vbG9jYWxob3N0OjMwMDAiLCJmZWF0dXJlIjoiTGFuZ3VhZ2VEZXRlY3Rpb25BUEkiLCJleHBpcnkiOjE3NDk5OTk5OTl9";

export interface DetectionResult {
  language: string;
  confidence: number;
}

export const detectLanguage = async (
  text: string
): Promise<DetectionResult[] | null> => {
  if (!text.trim()) return null;

  try {
    const window = self as unknown as CustomWindow;
    if (!window.ai?.languageDetector) {
      console.error("AI language detector not available");
      return null;
    }

    // Check language detection capabilities
    const languageDetectorCapabilities =
      await window.ai.languageDetector.capabilities();
    if (!languageDetectorCapabilities.languageAvailable("en")) {
      console.error("English language detection not supported");
      return null;
    }

    const detector = await window.ai.languageDetector.create({
      apiKey: LANGUAGE_DETECTOR_API_KEY,
    });

    const results = await detector.detect(text);
    return results
      .filter(({ language }) => language !== "unknown")
      .map(({ language, confidence }) => ({
        language,
        confidence,
      }));
  } catch (error) {
    console.error("Language detection error:", error);
    return null;
  }
};
