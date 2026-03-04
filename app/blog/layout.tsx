export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-white text-slate-800">
      <article
        className="
          mx-auto
          max-w-3xl
          px-6
          py-20
          lg:py-28
          
          prose
          prose-slate
          lg:prose-lg
          
          prose-headings:font-semibold
          prose-headings:tracking-tight
          prose-p:leading-relaxed
          prose-blockquote:border-l-4
          prose-blockquote:border-slate-300
          prose-code:text-slate-700
          prose-pre:bg-slate-50
        "
      >
        {children}
      </article>
    </main>
  );
}