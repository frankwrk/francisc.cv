import type { Metadata } from "next";
import { RiHashtag } from "@remixicon/react";
import * as Badge from "@/components/ui/badge";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { getAllArticles, getArtAssignmentKey, getArticleBySlug } from "@/lib/content";
import { Callout } from "@/components/mdx/callout";
import { Figure } from "@/components/mdx/figure";
import { MdxContent } from "@/components/mdx/mdx-content";
import { ArtCanvas } from "@/components/ui/art-canvas";
import { ShareButtons } from "@/components/ui/share-buttons";
import { siteUrl } from "@/config/site-url";
import { artAssignments } from "@/config/art-assignments";
import { getAssignmentRecordValue } from "@/lib/art-assignments";

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
  const assignmentKey = getArtAssignmentKey("thinking", slug);

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

      <article
        className="space-y-8 [font-family:var(--font-geist-sans)]"
       
      >
        {/* Hero header — art canvas background with text overlaid */}
        <header
          className="relative overflow-hidden -mx-(--scaffold-main-padding-x) -mt-(--scaffold-main-padding-y) md:-mx-(--scaffold-main-padding-x-md) md:-mt-(--scaffold-main-padding-y-md)"
         
        >
          {/* Background art canvas */}
          <div className="absolute inset-0">
            <ArtCanvas
              slug={slug}
              assignmentKey={assignmentKey}
              height={280}
              serverConfig={getAssignmentRecordValue(
                artAssignments,
                assignmentKey,
                slug,
              )}
              showEditorLink
             
            />
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
            className="pointer-events-none relative z-10 flex flex-col justify-end px-(--scaffold-main-padding-x) pb-(--scaffold-main-padding-y) pt-32 space-y-2 md:px-(--scaffold-main-padding-x-md) md:pb-(--scaffold-main-padding-y-md)"
            style={{ minHeight: 280 }}
           
          >
            <p
              className="text-[10px] tracking-[0.22em] text-white/60 [font-family:var(--font-geist-sans)]"
             
            >
              THINKING
            </p>
            <h1
              className="text-balance text-4xl font-medium tracking-tight text-white [font-family:var(--font-geist-pixel-square)] md:text-5xl"
             
            >
              {meta.title}
            </h1>
            <div
              className="flex flex-wrap items-center gap-2.5 pt-1"
             
            >
              {meta.date && (
                <time
                  dateTime={meta.date}
                  className="text-[10px] tracking-[0.1em] text-white/60 [font-family:var(--font-geist-sans)]"
                 
                >
                  {new Date(meta.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              )}
              {meta.tags?.map((tag) => (
                <Badge.Root key={tag} color="purple">
                  <Badge.Icon as={RiHashtag} />
                  {tag}
                </Badge.Root>
              ))}
            </div>
          </div>
        </header>

        {/* Prose body — constrained width, centered */}
        <div className="mx-auto max-w-2xl space-y-8">
          <ShareButtons url={`${siteUrl}/thinking/${slug}`} title={meta.title} variant="inline" />

          {meta.takeaways && meta.takeaways.length > 0 && (
            <Callout type="note" title="Key takeaways">
              <ul className="list-disc space-y-1 pl-4">
                {meta.takeaways.map((t) => (
                  <li key={t}>
                    {t}
                  </li>
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
                  rehypePlugins: [
                    rehypeSlug,
                    [rehypeAutolinkHeadings, { behavior: "append" }],
                  ],
                },
              }}

            />
          </MdxContent>

          <ShareButtons url={`${siteUrl}/thinking/${slug}`} title={meta.title} variant="section" />
        </div>
      </article>
    </>
  );
}
