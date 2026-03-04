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
          prose-h2:mt-20
          prose-h2:mb-8
          prose-h3:mt-12
          prose-h3:mb-4
          
          prose-p:leading-relaxed
          prose-p:my-4
          
          prose-blockquote:border-l-4
          prose-blockquote:border-slate-300
          prose-blockquote:pl-4
          
          prose-hr:my-16
          
          prose-code:text-slate-700
          prose-pre:bg-slate-50
        "
      >
        {children}
      </article>
    </main>
  );
}