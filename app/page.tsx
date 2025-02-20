"use client";
import { useState } from "react";
import { LangDropdown } from "./components/LangDropdown";
import { translate } from "./actions/translate";

export default function Home() {
  const langOptions = [
    { value: "en", label: "English" },
    { value: "es", label: "Spanish" },
    { value: "fr", label: "French" },
    { value: "pt", label: "Portuguese" },
    { value: "tr", label: "Turkish" },
    { value: "ru", label: "Russian" },
  ];

  //  const [lang, setLang] = useState(langOptions[0].value);
  const [langFrom, setLangFrom] = useState("en");
  const [langTo, setLangTo] = useState("es");
  const [text, setText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // const [langDropdown, setLangDropdown] = useState(false);
  // const [langDropdownOptions, setLangDropdownOptions] = useState(langOptions);
  // const [langDropdownValue, setLangDropdownValue] = useState();
  // const [langTo, setLangTo] = useState(langOptions[1].value);

  // interface LangOption {
  //   value: string;
  //   label: string;
  // }

  // interface LangDropdownProps {
  //   name: string;
  //   value: string;
  //   onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  //   options: LangOption[];
  // }

  const langFromChange = (value: string): void => {
    setLangFrom(value);
  };
  const langToChange = (value: string): void => {
    setLangTo(value);
  };

  //const translatedText = (value: string): void => {};
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
  };

  return (
    <div className="grid  grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <form className="flex gap-8">
          <div className="flex gap-8 bg-green -700 ">
            <div className="flex flex-col gap-2">
              <LangDropdown
                name={langOptions[0].label}
                value={langFrom}
                onChange={langFromChange}
                options={langOptions}
              />
              <textarea
                className="w-full"
                value={text}
                onChange={handleTextChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <LangDropdown
                name={langOptions[0].label}
                value={langTo}
                onChange={langToChange}
                options={langOptions}
              />
              <textarea
                className="w-full"
                value={error ? error : translatedText}
                readOnly
                style={{ color: error ? "red" : "inherit" }}
              />
            </div>
          </div>
          <button
            type="button"
            onClick={async () => {
              if (!text.trim()) return;
              setIsLoading(true);
              setError(null);
              try {
                const translation = await translate(text, langFrom, langTo);
                setTranslatedText(translation);
              } catch (err) {
                setError("Translation failed. Please try again.");
                console.error(err);
              } finally {
                setIsLoading(false);
              }
            }}
            disabled={isLoading}
            className={`px-4 py-2 rounded ${
              isLoading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {isLoading ? "Translating..." : "Translate"}
          </button>
        </form>
      </main>
    </div>
  );
}
