import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // 这里可以自定义 Markdown 标签的样式，比如让 h1 变大
    h1: ({ children }) => <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>{children}</h1>,
    ...components,
  };
}