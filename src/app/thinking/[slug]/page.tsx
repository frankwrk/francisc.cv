import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { getAllArticles, getArticleBySlug } from "@/lib/content";
import { Callout } from "@/components/mdx/callout";
import { Figure } from "@/components/mdx/figure";
import { MdxContent } from "@/components/mdx/mdx-content";

export async function generateStaticParams() {
  const articles = await getAllArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export default async function ThinkingDetailPage({ params }: Props) {
  const { slug } = await params;
  const { meta, source } = await getArticleBySlug(slug);

  return (
    <article className="max-w-2xl space-y-8 pt-2 [font-family:var(--font-geist-sans)]">
      <header className="space-y-4">
        <p className="text-[10px] tracking-[0.22em] text-[var(--scaffold-ruler)] [font-family:var(--font-geist-pixel-square)]">
          THINKING
        </p>
        <h1 className="text-2xl tracking-tight text-[var(--scaffold-toggle-text-active)]">
          {meta.title}
        </h1>

        <div className="flex flex-wrap items-center gap-3 border-t border-[var(--scaffold-line)] pt-3">
          {meta.date && (
            <time
              dateTime={meta.date}
              className="text-[10px] tracking-[0.1em] text-[var(--scaffold-ruler)] [font-family:var(--font-geist-pixel-square)]"
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
              className="border border-[var(--scaffold-line)] px-2 py-0.5 text-[10px] tracking-[0.08em] text-[var(--scaffold-ruler)]"
            >
              {tag}
            </span>
          ))}
        </div>

        {meta.takeaways && meta.takeaways.length > 0 && (
          <Callout type="note" title="Key takeaways">
            <ul className="list-disc space-y-1 pl-4">
              {meta.takeaways.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </Callout>
        )}
      </header>

      <MdxContent>
        <MDXRemote
          source={source}
          components={{ Callout, Figure }}
          options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
        />
      </MdxContent>
    </article>
  );
}
