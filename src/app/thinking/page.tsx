import type { Metadata } from "next";
import Link from "next/link";
import { RiHashtag } from "@remixicon/react";
import { getAllArticles, getArtAssignmentKey } from "@/lib/content";
import * as Badge from "@/components/ui/badge";
import { ArtCanvas } from "@/components/ui/art-canvas";
import { artAssignments } from "@/config/art-assignments";
import { getAssignmentRecordValue } from "@/lib/art-assignments";

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
    <article
      className="space-y-8 pt-2 [font-family:var(--font-geist-sans)]"
     
    >
      <header className="space-y-1">
        <p
          className="text-[10px] tracking-[0.22em] text-[var(--scaffold-ruler)] [font-family:var(--font-geist-sans)]"
         
        >
          THINKING
        </p>
        <h1
          className="text-balance text-4xl font-medium tracking-tight text-[var(--scaffold-toggle-text-active)] [font-family:var(--font-geist-pixel-square)] md:text-5xl"
         
        >
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
            <div
              className="border-b border-[var(--scaffold-line)] transition-opacity group-hover:opacity-90"
             
            >
              <ArtCanvas
                slug={article.slug}
                assignmentKey={getArtAssignmentKey("thinking", article.slug)}
                height={110}
                serverConfig={getAssignmentRecordValue(
                  artAssignments,
                  getArtAssignmentKey("thinking", article.slug),
                  article.slug,
                )}
               
              />
            </div>

            <div className="space-y-2.5 p-4">
              <div className="space-y-1">
                {article.date && (
                  <time
                    dateTime={article.date}
                    className="block text-[10px] tracking-[0.1em] text-[var(--scaffold-ruler)] [font-family:var(--font-geist-sans)]"
                   
                  >
                    {new Date(article.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </time>
                )}
                <h2
                  className="text-[15px] font-medium leading-snug text-[var(--scaffold-toggle-text-active)] group-hover:underline"
                 
                >
                  {article.title}
                </h2>
              </div>

              {article.description && (
                <p
                  className="text-[13px] leading-relaxed text-[var(--scaffold-ruler)]"
                 
                >
                  {article.description}
                </p>
              )}

              {article.tags && article.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {article.tags.map((tag) => (
                    <Badge.Root key={tag} color="purple">
                      <Badge.Icon as={RiHashtag} />
                      {tag}
                    </Badge.Root>
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
