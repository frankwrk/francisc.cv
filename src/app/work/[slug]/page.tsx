import type { Metadata } from "next";
import { RiHashtag } from "@remixicon/react";
import * as Badge from "@/components/ui/badge";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { getAllProjects, getArtAssignmentKey, getProjectBySlug } from "@/lib/content";
import { Figure } from "@/components/mdx/figure";
import { Callout } from "@/components/mdx/callout";
import { MdxContent } from "@/components/mdx/mdx-content";
import { ArtCanvas } from "@/components/ui/art-canvas";
import { ShareButtons } from "@/components/ui/share-buttons";
import { siteUrl } from "@/config/site-url";
import { artAssignments } from "@/config/art-assignments";
import { getAssignmentRecordValue } from "@/lib/art-assignments";

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { meta } = await getProjectBySlug(slug);
  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `/work/${slug}`,
      type: "article",
    },
    twitter: {
      title: meta.title,
      description: meta.description,
    },
    alternates: { canonical: `/work/${slug}` },
  };
}

export default async function WorkDetailPage({ params }: Props) {
  const { slug } = await params;
  const { meta, source } = await getProjectBySlug(slug);
  const assignmentKey = getArtAssignmentKey("work", slug);

  return (
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
            WORK
          </p>
          <h1
            className="text-4xl font-medium tracking-tight text-white [font-family:var(--font-geist-pixel-square)] md:text-5xl"
           
          >
            {meta.title}
          </h1>
          <div
            className="flex flex-wrap items-center gap-2 pt-1"
           
          >
            {meta.role && (
              <span
                className="text-[10px] tracking-[0.1em] text-white/70 [font-family:var(--font-geist-sans)]"
               
              >
                {meta.role}
              </span>
            )}
            {meta.role && meta.stack && meta.stack.length > 0 && (
              <span className="text-white/30">
                ·
              </span>
            )}
            {meta.stack?.map((item) => (
              <Badge.Root key={item} color="teal">
                <Badge.Icon as={RiHashtag} />
                {item}
              </Badge.Root>
            ))}
          </div>
        </div>
      </header>

      {/* Prose body — constrained width, centered */}
      <div className="mx-auto max-w-2xl space-y-8">
        <ShareButtons url={`${siteUrl}/work/${slug}`} title={meta.title} variant="inline" />
        {(meta.description || (meta.outcomes && meta.outcomes.length > 0)) && (
          <div
            className="space-y-4 border-b border-[var(--scaffold-line)] pb-6"
           
          >
            {meta.description && (
              <p
                className="text-[15px] leading-relaxed text-[var(--scaffold-ruler)]"
               
              >
                {meta.description}
              </p>
            )}
            {meta.outcomes && meta.outcomes.length > 0 && (
              <div className="space-y-2">
                <p
                  className="text-[10px] uppercase tracking-[0.18em] text-[var(--scaffold-ruler)] [font-family:var(--font-geist-sans)]"
                 
                >
                  Outcomes
                </p>
                <ul className="space-y-1">
                  {meta.outcomes.map((outcome) => (
                    <li
                      key={outcome}
                      className="flex gap-2 text-[13px] leading-relaxed text-[var(--scaffold-ruler)]"
                     
                    >
                      <span
                        className="mt-0.5 shrink-0 text-[var(--scaffold-line)]"
                       
                      >
                        —
                      </span>
                      {outcome}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <MdxContent>
          <MDXRemote
            source={source}
            components={{ Figure, Callout }}
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

        <ShareButtons url={`${siteUrl}/work/${slug}`} title={meta.title} variant="section" />
      </div>
    </article>
  );
}
