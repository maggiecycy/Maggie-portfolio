import createMDX from "@next/mdx";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. 保留你原有的 MDX 扩展名配置
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  
  // 2. 新增：Supabase 图片域名的安全授权
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mhgdzgqbchpsczgwpbyr.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

const withMDX = createMDX({
  // 在这里添加特定的 MDX 插件（可选）
});

// 3. 最后依然使用 withMDX 包装合并后的配置
export default withMDX(nextConfig);