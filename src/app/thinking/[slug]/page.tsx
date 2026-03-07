import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { getAllArticles, getArtAssignmentKey, getArticleBySlug } from "@/lib/content";
import { Callout } from "@/components/mdx/callout";
import { Figure } from "@/components/mdx/figure";
import { MdxContent } from "@/components/mdx/mdx-content";
import { ArtCanvas } from "@/components/ui/art-canvas";
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
        data-oid="-.ukucw"
      />

      <article
        className="space-y-8 pt-2 [font-family:var(--font-geist-sans)]"
        data-oid="ajn9c75"
      >
        {/* Hero header — art canvas background with text overlaid */}
        <header
          className="relative overflow-hidden border border-[var(--scaffold-line)]"
          data-oid="bsa9zad"
        >
          {/* Background art canvas */}
          <div className="absolute inset-0" data-oid="ivtv9fl">
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
              data-oid="un6n2a4"
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
            data-oid="u75obx8"
          />

          {/* Text content pinned to the bottom-left */}
          <div
            className="pointer-events-none relative z-10 flex flex-col justify-end px-5 pb-5 pt-32 space-y-2"
            style={{ minHeight: 280 }}
            data-oid="-7jn2bv"
          >
            <p
              className="text-[10px] tracking-[0.22em] text-white/60 [font-family:var(--font-geist-pixel-square)]"
              data-oid="6vxs9ke"
            >
              THINKING
            </p>
            <h1
              className="text-2xl font-semibold tracking-tight text-white"
              data-oid="z.cg19f"
            >
              {meta.title}
            </h1>
            <div
              className="flex flex-wrap items-center gap-2.5 pt-1"
              data-oid="3jmbj_h"
            >
              {meta.date && (
                <time
                  dateTime={meta.date}
                  className="text-[10px] tracking-[0.1em] text-white/60 [font-family:var(--font-geist-pixel-square)]"
                  data-oid="s3v:igi"
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
                  data-oid="mu_8lpd"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </header>

        {/* Prose body — constrained width, centered */}
        <div className="mx-auto max-w-2xl space-y-8" data-oid="yuan6.b">
          {meta.takeaways && meta.takeaways.length > 0 && (
            <Callout type="note" title="Key takeaways" data-oid="21cb8e-">
              <ul className="list-disc space-y-1 pl-4" data-oid="o2xqlfy">
                {meta.takeaways.map((t) => (
                  <li key={t} data-oid="zxq:qzq">
                    {t}
                  </li>
                ))}
              </ul>
            </Callout>
          )}

          <MdxContent data-oid="n04mi1v">
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
              data-oid="q-a-r1y"
            />
          </MdxContent>
        </div>
      </article>
    </>
  );
}
