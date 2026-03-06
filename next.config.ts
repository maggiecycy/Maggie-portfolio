import type { NextConfig } from "next";
import createMDX from "@next/mdx";

// 🌟 这里是重点：手动定义配置对象，并强制指定 RemotePattern 的字面量类型
const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  images: {
    remotePatterns: [
      {
        protocol: 'https' as const, // 强制 TS 识别为字面量 'https' 而非泛指 string
        hostname: 'mhgdzgqbchpsczgwpbyr.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);