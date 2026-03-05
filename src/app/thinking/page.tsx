import type { Metadata } from "next";
import Link from "next/link";
import { getAllArticles } from "@/lib/content";
import { ArtCanvas } from "@/components/ui/art-canvas";

export const metadata: Metadata = {
  title: "Thinking",
  description:
    "Writing and notes on product, systems, and design by Francisc Furdui.",
  openGraph: {
    title: "Thinking — francisc.cv",
    description:
      "Writing and notes on product, systems, and design by Francisc Furdui.",
    url: "/thinking",
  },
  alternates: { canonical: "/thinking" },
};

export default async function ThinkingPage() {
  const articles = await getAllArticles();

  return (
    <article className="space-y-8 pt-2 [font-family:var(--font-geist-sans)]">
      <header className="space-y-1">
        <p className="text-[10px] tracking-[0.22em] text-[var(--scaffold-ruler)] [font-family:var(--font-geist-pixel-square)]">
          THINKING
        </p>
        <h1 className="text-2xl tracking-tight text-[var(--scaffold-toggle-text-active)]">
          Writing and notes
        </h1>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/thinking/${article.slug}`}
            className="group block overflow-hidden border border-[var(--scaffold-line)] transition-colors hover:border-[var(--scaffold-ruler)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--scaffold-ruler)]"
          >
            <div className="border-b border-[var(--scaffold-line)] transition-opacity group-hover:opacity-90">
              <ArtCanvas slug={article.slug} height={110} />
            </div>

            <div className="space-y-2.5 p-4">
              <div className="space-y-1">
                {article.date && (
                  <time
                    dateTime={article.date}
                    className="block text-[10px] tracking-[0.1em] text-[var(--scaffold-ruler)] [font-family:var(--font-geist-pixel-square)]"
                  >
                    {new Date(article.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </time>
                )}
                <h2 className="text-[15px] font-medium leading-snug text-[var(--scaffold-toggle-text-active)] group-hover:underline">
                  {article.title}
                </h2>
              </div>

              {article.description && (
                <p className="text-[13px] leading-relaxed text-[var(--scaffold-ruler)]">
                  {article.description}
                </p>
              )}

              {article.tags && article.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="border border-[var(--scaffold-line)] px-2 py-0.5 text-[10px] tracking-[0.08em] text-[var(--scaffold-ruler)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </article>
  );
}
