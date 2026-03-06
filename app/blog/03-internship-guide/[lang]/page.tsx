import Zh from "../zh.mdx";
import En from "../en.mdx";
import Link from "next/link";

export default async function BlogPost({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  // 仅在中英之间切换，默认回退到 Zh
  const Content = lang === "en" ? En : Zh;

  return (
    <div className="relative">
      {/* 语言切换器：仅保留 zh 和 en */}
      <div className="flex gap-2 mb-12 not-prose">
        {["zh", "en"].map((l) => (
          <Link
            key={l}
            href={`/blog/03-internship-guide/${l}`} // 这里的路径记得对应文件夹名
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

      {/* 渲染 MDX 内容 */}
      <Content />
    </div>
  );
}