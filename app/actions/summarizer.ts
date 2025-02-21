interface CustomWindow extends Window {
  ai: {
    summarizer?: {
      create: (options: { apiKey: string }) => Promise<{
        summarize: (text: string) => Promise<string>;
      }>;
      capabilities: () => Promise<{
        available: string;
      }>;
    };
  };
}

const LANGUAGE_DETECTOR_API_KEY =
  "ApywZEcawPu3bp6OLLTdoGZKtPjN5sKcNOYQ7FrAJbcOp/vfx7SNIZu8Zxj9gqcIPXzkGd5/KiS1HpvUvKee5gwAAABVeyJvcmlnaW4iOiJodHRwOi8vbG9jYWxob3N0OjMwMDAiLCJmZWF0dXJlIjoiQUlTdW1tYXJpemF0aW9uQVBJIiwiZXhwaXJ5IjoxNzUzMTQyNDAwfQ==";

export const summarizeText = async (text: string): Promise<string | null> => {
  try {
    const window = self as unknown as CustomWindow;
    if (!window.ai?.summarizer) {
      console.error("AI summarizer not available");
      return null;
    }

    const capabilities = await window.ai.summarizer.capabilities();
    let summarizer;

    if (capabilities.available === "readily") {
      summarizer = await window.ai.summarizer.create({
        apiKey: LANGUAGE_DETECTOR_API_KEY,
      });
    } else {
      summarizer = await window.ai.summarizer.create({
        apiKey: LANGUAGE_DETECTOR_API_KEY,
      });
    }

    const summary = await summarizer.summarize(text);
    return summary;
  } catch (error) {
    console.error("Error initializing summarizer:", error);
    return null;
  }
};
