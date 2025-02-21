"use client";
import { useState } from "react";

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

  const langToChange = (value: string): void => {
    setLangTo(value);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    setCharCount(newText.length);
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

  return (
    <div className="w-full flex flex-col items-center justify-center bg-purple-200 h-svh">
      <main className="max-w-7xl m-auto p-8 w-full h-full">
        <form className="flex gap-8 flex-col w-full h-full">
          <div className="flex gap-8 flex-col justify-between h-full">
            <div className="flex flex-col gap-2">
              <LangDropdown
                name={langOptions[0].label}
                value={langTo}
                onChange={langToChange}
                options={langOptions}
              />
              <div className="relative">
                <textarea
                  aria-label="Translated text"
                  className="w-full h-20 p-3 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-neutral-700"
                  value={error ? error : translatedText}
                  readOnly
                  style={{ color: error ? "red" : "inherit" }}
                  tabIndex={0}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <textarea
                aria-label="Text to translate"
                className="w-full h-20 p-3 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-neutral-700"
                value={text}
                onChange={handleTextChange}
                maxLength={5000}
                tabIndex={0}
              />
              {detectionResults && (
                <div className="bg-white p-2 rounded shadow">
                  <div className=" text-base text-gray-800 mb-2">
                    Detected Language:{" "}
                    {detectionResults[0]?.language || "Unknown"}
                  </div>
                  {detectionResults.map((result, index) => (
                    <div
                      key={index}
                      className="text-lg font-bold text-blue-700"
                    >
                      {
                        langOptions.find((opt) => opt.value === result.language)
                          ?.label
                      }
                    </div>
                  ))}
                </div>
              )}
              <div className="flex justify-between items-center mt-1">
                <button
                  type="button"
                  onClick={handleDetectLanguage}
                  disabled={!text.trim() || isDetecting}
                  className="px-4 py-2 rounded transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-neutral-700 hover:bg-neutral-600 text-white hover:shadow-md cursor-pointer font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {isDetecting ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Detecting...
                    </>
                  ) : (
                    "Detect Language"
                  )}
                </button>
                <span className="text-sm text-gray-500">
                  {charCount}/5000 characters
                </span>
              </div>
            </div>
          </div>
          <button
            type="button"
            aria-label={isLoading ? "Translating..." : "Translate text"}
            onClick={async () => {
              if (!text.trim()) {
                setError("Please enter text to translate");
                return;
              }
              setIsLoading(true);
              setError(null);
              try {
                if (!detectedLang) {
                  const detection = await detectLanguage(text);
                  if (detection && detection.length > 0) {
                    setDetectedLang(detection[0].language);
                  } else {
                    throw new Error("Could not detect input language");
                  }
                }
                const translation = await translate(
                  text,
                  detectedLang || "en",
                  langTo
                );
                setTranslatedText(translation);
              } catch (err) {
                setError(
                  "Translation failed. Please check your internet connection and try again."
                );
                console.error(err);
              } finally {
                setIsLoading(false);
              }
            }}
            disabled={isLoading || !text.trim()}
            className={`px-4 py-3 rounded transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isLoading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-neutral-700 hover:bg-neutral-600 text-white hover:shadow-md cursor-pointer font-semibold"
            }`}
            tabIndex={0}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Translating...
              </>
            ) : (
              "Translate"
            )}
          </button>
        </form>
      </main>
    </div>
  );
}
