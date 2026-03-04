import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  // 配置允许编译的扩展名
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
};

const withMDX = createMDX({
  // 在这里添加特定的 MDX 插件（可选）
});

export default withMDX(nextConfig);