import Link from "next/link";
import { getAllArticles } from "@/lib/content";

export default async function ThinkingPage() {
  const articles = await getAllArticles();

  return (
    <article className="max-w-2xl space-y-8 pt-2 [font-family:var(--font-geist-sans)]">
      <header className="space-y-1">
        <p className="text-[10px] tracking-[0.22em] text-[var(--scaffold-ruler)] [font-family:var(--font-geist-pixel-square)]">
          THINKING
        </p>
        <h1 className="text-2xl tracking-tight text-[var(--scaffold-toggle-text-active)]">
          Writing and notes
        </h1>
      </header>

      <ol className="space-y-8">
        {articles.map((article) => (
          <li key={article.slug} className="group space-y-1.5">
            <div className="flex items-baseline gap-3">
              {article.date && (
                <time
                  dateTime={article.date}
                  className="shrink-0 text-[10px] tracking-[0.1em] text-[var(--scaffold-ruler)] [font-family:var(--font-geist-pixel-square)]"
                >
                  {new Date(article.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </time>
              )}
              <Link
                href={`/thinking/${article.slug}`}
                className="text-[17px] font-medium leading-snug tracking-tight text-[var(--scaffold-toggle-text-active)] hover:underline"
              >
                {article.title}
              </Link>
            </div>

            {article.description && (
              <p className="text-[14px] leading-relaxed text-[var(--scaffold-ruler)]">
                {article.description}
              </p>
            )}

            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-0.5">
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
          </li>
        ))}
      </ol>
    </article>
  );
}
