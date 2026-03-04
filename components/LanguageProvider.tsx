"use client";

import { useState } from "react";

type Props = {
  zh: React.ReactNode;
  en: React.ReactNode;
  fr: React.ReactNode;
};

export default function Lang({ zh, en, fr }: Props) {
  const [lang, setLang] = useState<"zh" | "en" | "fr">("zh");

  return (
    <div>
      {/* 顶部切换按钮 */}
      <div className="flex gap-2 mb-12">
        <button
          onClick={() => setLang("zh")}
          className={`px-3 py-1 text-sm rounded-md border ${
            lang === "zh"
              ? "bg-slate-900 text-white"
              : "bg-white text-slate-600"
          }`}
        >
          中文
        </button>
        <button
          onClick={() => setLang("en")}
          className={`px-3 py-1 text-sm rounded-md border ${
            lang === "en"
              ? "bg-slate-900 text-white"
              : "bg-white text-slate-600"
          }`}
        >
          EN
        </button>
        <button
          onClick={() => setLang("fr")}
          className={`px-3 py-1 text-sm rounded-md border ${
            lang === "fr"
              ? "bg-slate-900 text-white"
              : "bg-white text-slate-600"
          }`}
        >
          FR
        </button>
      </div>

      {/* 整篇文章 */}
      <div>
        {lang === "zh" && zh}
        {lang === "en" && en}
        {lang === "fr" && fr}
      </div>
    </div>
  );
}