interface CustomWindow extends Window {
  ai: {
    translator: {
      create: (options: {
        sourceLanguage: string;
        targetLanguage: string;
      }) => Promise<TranslatorInstance>;
    };
    languageDetector?: {
      capabilities: () => Promise<{
        languageAvailable: (lang: string) => boolean;
      }>;
    };
  };
}

declare const self: CustomWindow;

interface TranslatorInstance {
  sourceLanguage: string;
  targetLanguage: string;
  translate: (text: string) => Promise<string>;
}

let translatorInstance: TranslatorInstance | null = null;

export const createTranslator = async (
  sourceLanguage: string,
  targetLanguage: string
) => {
  translatorInstance = await self.ai.translator.create({
    sourceLanguage,
    targetLanguage,
  });
  return translatorInstance;
};

export const translate = async (
  text: string,
  sourceLanguage: string,
  targetLanguage: string
): Promise<string> => {
  if (
    !translatorInstance ||
    translatorInstance.sourceLanguage !== sourceLanguage ||
    translatorInstance.targetLanguage !== targetLanguage
  ) {
    await createTranslator(sourceLanguage, targetLanguage);
  }
  if (!translatorInstance) {
    throw new Error("Translator instance not initialized");
  }
  const response = await translatorInstance.translate(text);
  return response;
};
