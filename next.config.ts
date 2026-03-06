import createMDX from "@next/mdx";

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mhgdzgqbchpsczgwpbyr.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },

  // 新增
  allowedDevOrigins: ["127.0.0.1"],
};

const withMDX = createMDX({});

export default withMDX(nextConfig);