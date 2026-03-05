import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { getAllArticles, getArticleBySlug } from "@/lib/content";
import { Callout } from "@/components/mdx/callout";
import { Figure } from "@/components/mdx/figure";
import { MdxContent } from "@/components/mdx/mdx-content";
import { ArtCanvas } from "@/components/ui/art-canvas";
import { siteUrl } from "@/config/site-url";
import { artAssignments } from "@/config/art-assignments";

export async function generateStaticParams() {
  const articles = await getAllArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { meta } = await getArticleBySlug(slug);
  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `/thinking/${slug}`,
      type: "article",
      publishedTime: meta.date,
      authors: ["Francisc Furdui"],
    },
    twitter: {
      title: meta.title,
      description: meta.description,
    },
    alternates: { canonical: `/thinking/${slug}` },
  };
}

export default async function ThinkingDetailPage({ params }: Props) {
  const { slug } = await params;
  const { meta, source } = await getArticleBySlug(slug);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: meta.title,
    description: meta.description,
    datePublished: meta.date,
    author: {
      "@type": "Person",
      name: "Francisc Furdui",
      url: siteUrl,
    },
    url: `${siteUrl}/thinking/${slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <article className="space-y-8 pt-2 [font-family:var(--font-geist-sans)]">

        {/* Hero header — art canvas background with text overlaid */}
        <header className="relative overflow-hidden border border-[var(--scaffold-line)]">
          {/* Background art canvas */}
          <div className="absolute inset-0" aria-hidden="true">
            <ArtCanvas slug={slug} height={280} serverConfig={artAssignments[slug] ?? null} />
          </div>

          {/* Gradient overlay: dark bottom-left → transparent top-right */}
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
            style={{
              background:
                "linear-gradient(to top right, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.50) 35%, rgba(0,0,0,0.18) 65%, transparent 100%)",
            }}
          />

          {/* Text content pinned to the bottom-left */}
          <div
            className="relative z-10 flex flex-col justify-end px-5 pb-5 pt-32 space-y-2"
            style={{ minHeight: 280 }}
          >
            <p className="text-[10px] tracking-[0.22em] text-white/60 [font-family:var(--font-geist-pixel-square)]">
              THINKING
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              {meta.title}
            </h1>
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              {meta.date && (
                <time
                  dateTime={meta.date}
                  className="text-[10px] tracking-[0.1em] text-white/60 [font-family:var(--font-geist-pixel-square)]"
                >
                  {new Date(meta.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              )}
              {meta.tags?.map((tag) => (
                <span
                  key={tag}
                  className="border border-white/25 px-2 py-0.5 text-[10px] tracking-[0.08em] text-white/70"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </header>

        {/* Prose body — constrained width, centered */}
        <div className="mx-auto max-w-2xl space-y-8">
          {meta.takeaways && meta.takeaways.length > 0 && (
            <Callout type="note" title="Key takeaways">
              <ul className="list-disc space-y-1 pl-4">
                {meta.takeaways.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </Callout>
          )}

          <MdxContent>
            <MDXRemote
              source={source}
              components={{ Callout, Figure }}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                  rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: "append" }]],
                },
              }}
            />
          </MdxContent>
        </div>
      </article>
    </>
  );
}
