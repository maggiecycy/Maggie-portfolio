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

  const Content =
    lang === "en" ? En : lang === "fr" ? Fr : lang === "de" ? De : Zh;

  return (
    <div className="relative">
      <div className="flex gap-2 mb-12 not-prose">
        {["zh", "en", "fr", "de"].map((l) => (
          <Link
            key={l}
            href={`/blog/02-zero-cm/${l}`}
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

      <Content />
    </div>
  );
}