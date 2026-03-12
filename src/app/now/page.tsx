import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { Figure } from "@/components/mdx/figure";
import { MdxContent } from "@/components/mdx/mdx-content";
import { getStaticPageBySlug } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await getStaticPageBySlug("now");

  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: "/now",
      type: "website",
    },
    twitter: {
      title: meta.title,
      description: meta.description,
    },
    alternates: { canonical: "/now" },
  };
}

export default async function NowPage() {
  const { meta, source } = await getStaticPageBySlug("now");

  return (
    <article
      className="max-w-2xl space-y-8 pt-2 [font-family:var(--font-geist-sans)]"
     
    >
      <header className="space-y-1">
        <p
          className="text-[10px] tracking-[0.22em] text-[var(--scaffold-ruler)] [font-family:var(--font-geist-sans)]"
         
        >
          NOW
        </p>
        <h1
          className="text-4xl font-medium tracking-tight text-[var(--scaffold-toggle-text-active)] [font-family:var(--font-geist-pixel-square)] md:text-5xl"
         
        >
          {meta.title}
        </h1>
        {meta.description ? (
          <p
            className="max-w-[42rem] text-[14px] leading-6 text-[var(--scaffold-ruler)]"
           
          >
            {meta.description}
          </p>
        ) : null}
      </header>

      <MdxContent>
        <MDXRemote
          source={source}
          components={{ Figure }}
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
    </article>
  );
}
