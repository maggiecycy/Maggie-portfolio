"use client";

import { useState } from "react";

type Props = {
  zh: React.ReactNode;
  en: React.ReactNode;
  fr: React.ReactNode;
  de: React.ReactNode;   // ✅ 新增
};

export default function Lang({ zh, en, fr, de }: Props) {
  const [lang, setLang] = useState<"zh" | "en" | "fr" | "de">("zh");

  return (
    <div>
      {/* 顶部按钮 */}
      <div className="flex gap-2 mb-12 not-prose">
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

        {/* ✅ 新增 German 按钮 */}
        <button
          onClick={() => setLang("de")}
          className={`px-3 py-1 text-sm rounded-md border ${
            lang === "de"
              ? "bg-slate-900 text-white"
              : "bg-white text-slate-600"
          }`}
        >
          DE
        </button>
      </div>

      {/* 内容 */}
      {lang === "zh" && zh}
      {lang === "en" && en}
      {lang === "fr" && fr}
      {lang === "de" && de}
    </div>
  );
}