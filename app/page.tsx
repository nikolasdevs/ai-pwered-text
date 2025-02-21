"use client";
import { useState } from "react";
import logo from "./../public/e-logo.svg";
import { summarizeText } from "./actions/summarizer";

import Image from "next/image";
import enter from "./../public/free-enter-icon-download-in-svg-png-gif-file-formats--arrow-direction-turn-down-left-arrows-pack-sign-symbols-icons-1216131.webp";
import { detectLanguage } from "./actions/detect";
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
  const [error, setError] = useState<string | null>(null);
  const [charCount, setCharCount] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [, setCanTranslate] = useState(false);

  const langToChange = (value: string): void => {
    setLangTo(value);
  };

  const [summary, setSummary] = useState<string | null>(null);

  const handleSummarizeText = async () => {
    if (!text.trim() || text.split(" ").length < 150) {
      setError("Please enter at least 150 words to summarize");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const summaryResult = await summarizeText(text);
      setSummary(summaryResult);
    } catch (err) {
      setError("Summarization failed. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    setCharCount(newText.length);
    setShowTranslation(false);
    setCanTranslate(false);
  };

  const handleTranslate = async () => {
    if (!text.trim()) {
      setError("Please enter text to translate");
      return;
    }
    if (!langTo) {
      setError("Please select a target language");
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

      if (detectedLang === langTo) {
        setError("Source and target languages cannot be the same.");
        return;
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
      setCanTranslate(true);
    }
  };
  return (
    <div className="w-full flex flex-col items-center justify-center bg-neutral-300 h-svh">
      <header className="my-8 bg-neutral-200 w-full p-4 px-16 text-center shadow-md flex gap-2 items-center  justify-between">
        <Image src={logo} alt="logo" width="64" height="64" />
        <div className=" flex flex-col gap-1 items-end">
          <h1 className="text-3xl font-semibold text-neutral-600 ">
            AI Powered Text
          </h1>
          <p className="text-neutral-500 text-sm">
            Translate and Summarize Text with Ease
          </p>
        </div>
      </header>
      <main className="max-w-7xl m-auto p-8 w-full h-full">
        <form className="flex gap-8 flex-col w-full h-full">
          <div className="flex gap-8 flex-col justify-between h-full ">
            <div className=" shadow-lg">
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

                    <div className="flex gap-2 items-center">
                      {detectedLang && (
                        <span className="text-sm text-gray-500">
                          Detected language: {detectedLang}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={handleSummarizeText}
                        disabled={!text.trim() || isLoading}
                        className="px-4 py-2 rounded transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-neutral-500 bg-neutral-700 hover:bg-neutral-600 text-white hover:shadow-md cursor-pointer font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        {isLoading ? "Summarizing..." : "Summarize"}
                      </button>

                      {summary && summary.length > 0 && (
                        <div className="bg-white p-2 rounded shadow">
                          <div className="font-medium text-sm text-gray-700">
                            Summary:
                          </div>
                          <div className="text-sm text-gray-900">{summary}</div>
                        </div>
                      )}
                      <div className=" my-4 ">
                        <LangDropdown
                          name="Target Language"
                          value={langTo}
                          onChange={langToChange}
                          options={langOptions}
                        />
                      </div>
                      <p
                        aria-label="Translated text"
                        className="w-full px-3 py-3 rounded resize-none focus:outline-none focus:ring-2 focus:ring-gray-500 text-neutral-600  bg-transparent border border-neutral-400"
                        style={{ color: "inherit" }}
                        tabIndex={0}
                      >
                        {translatedText}
                      </p>
                      <span className="text-sm text-gray-500">
                        Translated to:{" "}
                        {langOptions.find((l) => l.value === langTo)?.label}
                      </span>
                      <button
                        type="button"
                        onClick={handleTranslate}
                        className="px-4 py-3 rounded transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-neutral-500 bg-neutral-700 hover:bg-neutral-600 text-white hover:shadow-md cursor-pointer font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed mt-10"
                      >
                        Translate
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2 relative justify-center">
              <div className="flex items-center w-full justify-between">
                <p className="text-neutral-500">Input Text</p>
                {error && <span className=" text-red-500">{error}</span>}

                <span className="text-sm text-gray-500">
                  Press Enter to translate
                </span>
              </div>
              <textarea
                aria-label="Text to translate"
                className="items-center w-full border border-neutral-400 rounded resize-none focus:outline-none focus:ring-1 focus:ring-gray-500 text-neutral-700 bg-transparent ps-4 pt-5 px-16"
                value={text}
                onChange={handleTextChange}
                onKeyDown={handleKeyPress}
                maxLength={5000}
                tabIndex={0}
              />
              <button
                type="button"
                onClick={handleTranslate}
                className="transition-all flex items-center justify-center p-2 focus:outline-none text-white cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed absolute right-2 top-1/2 transform  -translate-y-1/2  hover-shadow-1 bg-transparent hover:shadow-md"
              >
                <Image src={enter} alt="Translate" width={24} height={24} />
              </button>

              <div className="flex justify-between items-center mt-1">
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
//
