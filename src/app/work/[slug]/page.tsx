import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { getAllProjects, getProjectBySlug } from "@/lib/content";
import { Figure } from "@/components/mdx/figure";
import { Callout } from "@/components/mdx/callout";
import { MdxContent } from "@/components/mdx/mdx-content";

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export default async function WorkDetailPage({ params }: Props) {
  const { slug } = await params;
  const { meta, source } = await getProjectBySlug(slug);

  return (
    <article className="max-w-2xl space-y-8 pt-2 [font-family:var(--font-geist-sans)]">
      <header className="space-y-4">
        <p className="text-[10px] tracking-[0.22em] text-[var(--scaffold-ruler)] [font-family:var(--font-geist-pixel-square)]">
          WORK
        </p>
        <h1 className="text-2xl tracking-tight text-[var(--scaffold-toggle-text-active)]">
          {meta.title}
        </h1>
        <p className="text-[15px] leading-relaxed text-[var(--scaffold-ruler)]">
          {meta.description}
        </p>

        <div className="flex flex-wrap items-center gap-2 border-t border-[var(--scaffold-line)] pt-4">
          {meta.role && (
            <span className="text-[11px] tracking-[0.1em] text-[var(--scaffold-toggle-text-active)] [font-family:var(--font-geist-pixel-square)]">
              {meta.role}
            </span>
          )}
          {meta.role && meta.stack && meta.stack.length > 0 && (
            <span className="text-[var(--scaffold-line)]">·</span>
          )}
          {meta.stack?.map((item) => (
            <span
              key={item}
              className="border border-[var(--scaffold-line)] px-2 py-0.5 text-[10px] tracking-[0.08em] text-[var(--scaffold-ruler)]"
            >
              {item}
            </span>
          ))}
        </div>

        {meta.outcomes && meta.outcomes.length > 0 && (
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--scaffold-ruler)] [font-family:var(--font-geist-pixel-square)]">
              Outcomes
            </p>
            <ul className="space-y-1">
              {meta.outcomes.map((outcome) => (
                <li
                  key={outcome}
                  className="flex gap-2 text-[13px] leading-relaxed text-[var(--scaffold-ruler)]"
                >
                  <span className="mt-0.5 shrink-0 text-[var(--scaffold-line)]">—</span>
                  {outcome}
                </li>
              ))}
            </ul>
          </div>
        )}
      </header>

      <MdxContent>
        <MDXRemote
          source={source}
          components={{ Figure, Callout }}
          options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
        />
      </MdxContent>
    </article>
  );
}
