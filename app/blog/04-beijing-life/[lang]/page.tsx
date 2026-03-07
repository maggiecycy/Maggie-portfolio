import Zh from "../zh.mdx";
import En from "../en.mdx";
import Fr from "../fr.mdx";
import De from "../de.mdx";
import Link from "next/link";

export default async function BlogPost({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  // 根据路由参数匹配对应的语言内容，默认回退到 Zh
  let Content = Zh;
  if (lang === "en") Content = En;
  if (lang === "fr") Content = Fr;
  if (lang === "de") Content = De;

  return (
    <div className="relative">
      {/* 语言切换器：完整包含 zh, en, fr, de */}
      <div className="flex gap-2 mb-12 not-prose">
        {["zh", "en", "fr", "de"].map((l) => (
          <Link
            key={l}
            href={`/blog/04-beijing-life/${l}`}
            prefetch={false}
            className={`px-3 py-1 text-sm rounded-md border transition-all ${
              l === lang
                ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            {l.toUpperCase()}
          </Link>
        ))}
      </div>

      {/* 渲染对应的 MDX 内容 */}
      <Content />
    </div>
  );
}