#!/bin/bash

# 检查是否输入了参数
if [ -z "$1" ]; then
  echo "❌ 错误: 请提供博文的目录名（例如: npm run new 08-my-post）"
  exit 1
fi

SLUG=$1
BASE_DIR="app/blog/$SLUG"
LANG_DIR="$BASE_DIR/[lang]"

# 1. 创建多层级目录
mkdir -p "$LANG_DIR"

# 2. 创建四种语言的空白 mdx 文件
touch "$BASE_DIR/zh.mdx" "$BASE_DIR/en.mdx" "$BASE_DIR/fr.mdx" "$BASE_DIR/de.mdx"

# 3. 写入根目录的重定向 page.tsx
cat <<EOF > "$BASE_DIR/page.tsx"
import { redirect } from "next/navigation";

export default function Page() {
  // 默认引导用户进入中文版路径
  redirect("/blog/$SLUG/zh");
}
EOF

# 4. 写入多语言切换的 [lang]/page.tsx
cat <<EOF > "$LANG_DIR/page.tsx"
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
            href={\`/blog/$SLUG/\${l}\`}
            prefetch={false}
            className={\`px-3 py-1 text-sm rounded-md border transition-all \${
              l === lang
                ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }\`}
          >
            {l.toUpperCase()}
          </Link>
        ))}
      </div>

      <Content />
    </div>
  );
}
EOF

echo "✅ 成功！博文基础结构已生成: $BASE_DIR"
echo "👉 现在你可以直接去编辑 $BASE_DIR/zh.mdx 了"