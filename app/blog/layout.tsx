export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-white">
      {/* prose 类现在会生效了，因为它已经在 globals.css 里被加载了 */}
      <article className="max-w-2xl mx-auto px-6 py-32 prose prose-slate lg:prose-lg">
        {children}
      </article>
    </main>
  );
}