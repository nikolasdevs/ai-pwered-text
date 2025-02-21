interface CustomWindow extends Window {
  ai: {
    languageDetector?: {
      create: (options: { apiKey: string }) => Promise<{
        detect: (
          text: string
        ) => Promise<Array<{ language: string; confidence: number }>>;
      }>;
    };
  };
}

const LANGUAGE_DETECTOR_API_KEY =
  "AlvnQOgXEaDkm1KTvW3ZasTnP5EAdLCnhbhfTzwAE2D5V1t2jyJ3+jjnQWgXOtgO40FeJ2rt7V69DIsxHW/7uA4AAABXeyJvcmlnaW4iOiJodHRwOi8vbG9jYWxob3N0OjMwMDAiLCJmZWF0dXJlIjoiTGFuZ3VhZ2VEZXRlY3Rpb25BUEkiLCJleHBpcnkiOjE3NDk5OTk5OTl9";

declare const self: CustomWindow;

export interface DetectionResult {
  language: string;
  confidence: number;
}

export const detectLanguage = async (
  text: string
): Promise<DetectionResult[] | null> => {
  if (!text.trim()) {
    return null;
  }

  if (!("ai" in self) || !self.ai.languageDetector) {
    return null;
  }

  try {
    const detector = await self.ai.languageDetector.create({
      apiKey: LANGUAGE_DETECTOR_API_KEY,
    });
    const results = await detector.detect(text);
    return results.map((result: { language: string; confidence: number }) => ({
      language: result.language,
      confidence: result.confidence,
    }));
  } catch (error) {
    console.error("Language detection error:", error);
    return null;
  }
};
