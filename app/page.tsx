"use client";
import { useState } from "react";

import Image from "next/image";
import enter from "./../public/free-enter-icon-download-in-svg-png-gif-file-formats--arrow-direction-turn-down-left-arrows-pack-sign-symbols-icons-1216131.webp";
import { detectLanguage, type DetectionResult } from "./actions/detect";
import { translate } from "./actions/translate";
import { LangDropdown } from "./components/LangDropdown";

export default function Home() {
  const langOptions = [
    { value: "en", label: "English" },
    { value: "es", label: "Spanish" },
    { value: "fr", label: "French" },
    { value: "pt", label: "Portuguese" },
    { value: "tr", label: "Turkish" },
    { value: "ru", label: "Russian" },
  ];

  const [langTo, setLangTo] = useState("es");
  const [detectedLang, setDetectedLang] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [charCount, setCharCount] = useState(0);
  const [detectionResults, setDetectionResults] = useState<
    DetectionResult[] | null
  >(null);
  const [showTranslation, setShowTranslation] = useState(false);
  const [canTranslate, setCanTranslate] = useState(false); // Track if translation can be triggered

  const langToChange = (value: string): void => {
    setLangTo(value);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    setCharCount(newText.length);
    setShowTranslation(false);
    setCanTranslate(false); // Reset translate button until Enter is pressed
  };

  const handleDetectLanguage = async () => {
    if (!text.trim()) return;
    setIsDetecting(true);
    setError(null);
    try {
      const results = await detectLanguage(text);
      setDetectionResults(results);
      if (results && results.length > 0) {
        setDetectedLang(results[0].language);
      }
    } catch (error) {
      console.error("Language detection failed:", error);
      setError("Language detection failed. Please try again.");
    } finally {
      setIsDetecting(false);
    }
  };

  const handleTranslate = async () => {
    if (!text.trim()) {
      setError("Please enter text to translate");
      return;
    }
    setIsLoading(true);
    setError(null);
    setShowTranslation(false);
    try {
      if (!detectedLang) {
        const detection = await detectLanguage(text);
        if (detection && detection.length > 0) {
          setDetectedLang(detection[0].language);
        } else {
          throw new Error("Could not detect input language");
        }
      }
      const translation = await translate(text, detectedLang || "en", langTo);
      setTranslatedText(translation);
      setShowTranslation(true);
    } catch (err) {
      setError(
        "Translation failed. Please check your internet connection and try again."
      );
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      setCanTranslate(true); // Enable translation
    }
  };
  return (
    <div className="w-full flex flex-col items-center justify-center bg-neutral-300 h-svh">
      <header></header>
      <main className="max-w-7xl m-auto p-8 w-full h-full">
        <form className="flex gap-8 flex-col w-full h-full">
          <div className="flex gap-8 flex-col justify-between h-full">
            <div>
              {showTranslation && (
                <div className="flex flex-col gap-2 text-neutral-700 bg-neutral-200 rounded-lg p-6">
                  <div className=" flex flex-col gap-2">
                    <textarea
                      aria-label="Original text"
                      className="outline-none resize-none bg-transparent text-neutral-500"
                      value={text}
                      readOnly
                      tabIndex={0}
                    />
                    {/* show language of the input text */}
                    <div className="flex gap-2 items-center">
                      {detectedLang && (
                        <span className="text-sm text-gray-500">
                          Detected language: {detectedLang}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="w-16 rounded-xl">
                        <LangDropdown
                          name={langOptions[3].label}
                          value={langTo}
                          onChange={langToChange}
                          options={langOptions}
                          // disabled={!canTranslate} // Disable dropdown until Enter is pressed
                        />
                      </div>
                      <textarea
                        aria-label="Translated text"
                        className="w-full h-20 p-3 rounded resize-none focus:outline-none focus:ring-2 focus:ring-gray-500 text-neutral-600"
                        value={error ? error : translatedText}
                        readOnly
                        style={{ color: error ? "red" : "inherit" }}
                        tabIndex={0}
                      />
                      <span className="text-sm text-gray-500">
                        Translated to:{" "}
                        {langOptions.find((l) => l.value === langTo)?.label}
                      </span>
                      <button
                        type="button"
                        onClick={handleTranslate}
                        //disabled={!canTranslate || isLoading} // Ensure it's enabled after Enter is pressed
                        className="px-4 py-3 rounded transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-neutral-700 hover:bg-neutral-600 text-white hover:shadow-md cursor-pointer font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        Translate
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2 relative">
              <textarea
                aria-label="Text to translate"
                className="w-full h-20 p-3 rounded resize-none focus:outline-none focus:ring-2 focus:ring-gray-500 text-neutral-700"
                value={text}
                onChange={handleTextChange}
                onKeyDown={handleKeyPress}
                maxLength={5000}
                tabIndex={0}
              />
              <button
                type="button"
                onClick={handleTranslate}
                //disabled={!canTranslate || isLoading} // Ensure it's enabled after Enter is pressed
                className="transition-all flex items-center px-3 focus:outline-none  text-white cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed absolute right-0 bottom-20"
              >
                <Image src={enter} alt="Translate" width={24} height={24} />
              </button>
              <div className="flex justify-between items-center mt-1">
                <button
                  type="button"
                  onClick={handleDetectLanguage}
                  disabled={!text.trim() || isDetecting}
                  className="px-4 py-2 rounded transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-neutral-700 hover:bg-neutral-600 text-white hover:shadow-md cursor-pointer font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {isDetecting ? "Detecting..." : "Detect Language"}
                </button>
                <span className="text-sm text-gray-500">
                  {charCount}/5000 characters
                </span>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
