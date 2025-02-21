interface CustomWindow extends Window {
  ai: {
    translator: {
      create: (options: {
        sourceLanguage: string;
        targetLanguage: string;
        apiKey: string;
      }) => Promise<TranslatorInstance>;
    };
    languageDetector?: {
      capabilities: () => Promise<{
        languageAvailable: (lang: string) => boolean;
      }>;
    };
  };
}

const TRANSLATOR_API_KEY =
  "Aoeg49e8gXziww8aMaciOT3ocfAg14TCdd6srBr0/ENCVaog72otR4Or4Qjz9qByZNGl2mbK/pxvft9j0jf8sw0AAABReyJvcминаinOiJodHRwOi8vbG9jYWxob3N0OjMwMDAiLCJmZWF0dXJlIjoiVHJhbnNsYXRpb25BUEkiLCJleHBpcnkiOjE3NTMxNDI0MDB9";

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
    apiKey: TRANSLATOR_API_KEY,
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
