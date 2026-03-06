import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { getAllProjects, getProjectBySlug } from "@/lib/content";
import { Figure } from "@/components/mdx/figure";
import { Callout } from "@/components/mdx/callout";
import { MdxContent } from "@/components/mdx/mdx-content";
import { ArtCanvas } from "@/components/ui/art-canvas";
import { artAssignments } from "@/config/art-assignments";

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

  return (
    <article
      className="space-y-8 pt-2 [font-family:var(--font-geist-sans)]"
      data-oid="tt-el6t"
    >
      {/* Hero header — art canvas background with text overlaid */}
      <header
        className="relative overflow-hidden border border-[var(--scaffold-line)]"
        data-oid="kmxd7:x"
      >
        {/* Background art canvas */}
        <div className="absolute inset-0" aria-hidden="true" data-oid="smd8p.j">
          <ArtCanvas
            slug={slug}
            height={280}
            serverConfig={artAssignments[slug] ?? null}
            data-oid="l8yjw-w"
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
          data-oid=":ilvvmq"
        />

        {/* Text content pinned to the bottom-left */}
        <div
          className="relative z-10 flex flex-col justify-end px-5 pb-5 pt-32 space-y-2"
          style={{ minHeight: 280 }}
          data-oid="xxsedc_"
        >
          <p
            className="text-[10px] tracking-[0.22em] text-white/60 [font-family:var(--font-geist-pixel-square)]"
            data-oid="deigtq2"
          >
            WORK
          </p>
          <h1
            className="text-2xl font-semibold tracking-tight text-white"
            data-oid="694x3c_"
          >
            {meta.title}
          </h1>
          <div
            className="flex flex-wrap items-center gap-2 pt-1"
            data-oid="e21rxg."
          >
            {meta.role && (
              <span
                className="text-[10px] tracking-[0.1em] text-white/70 [font-family:var(--font-geist-pixel-square)]"
                data-oid="7:e.:18"
              >
                {meta.role}
              </span>
            )}
            {meta.role && meta.stack && meta.stack.length > 0 && (
              <span className="text-white/30" data-oid="a5ae99k">
                ·
              </span>
            )}
            {meta.stack?.map((item) => (
              <span
                key={item}
                className="border border-white/25 px-2 py-0.5 text-[10px] tracking-[0.08em] text-white/70"
                data-oid="ye9812t"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* Prose body — constrained width, centered */}
      <div className="mx-auto max-w-2xl space-y-8" data-oid="byyuqtx">
        {(meta.description || (meta.outcomes && meta.outcomes.length > 0)) && (
          <div
            className="space-y-4 border-b border-[var(--scaffold-line)] pb-6"
            data-oid="eyp2vdu"
          >
            {meta.description && (
              <p
                className="text-[15px] leading-relaxed text-[var(--scaffold-ruler)]"
                data-oid=".axucdg"
              >
                {meta.description}
              </p>
            )}
            {meta.outcomes && meta.outcomes.length > 0 && (
              <div className="space-y-2" data-oid="dyso_2h">
                <p
                  className="text-[10px] uppercase tracking-[0.18em] text-[var(--scaffold-ruler)] [font-family:var(--font-geist-pixel-square)]"
                  data-oid="8ifk0qg"
                >
                  Outcomes
                </p>
                <ul className="space-y-1" data-oid="4lh0hzj">
                  {meta.outcomes.map((outcome) => (
                    <li
                      key={outcome}
                      className="flex gap-2 text-[13px] leading-relaxed text-[var(--scaffold-ruler)]"
                      data-oid="s09l0i."
                    >
                      <span
                        className="mt-0.5 shrink-0 text-[var(--scaffold-line)]"
                        data-oid="qza_6hz"
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

        <MdxContent data-oid="o0m0v21">
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
            data-oid="jx96aun"
          />
        </MdxContent>
      </div>
    </article>
  );
}
