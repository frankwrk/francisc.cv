import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { Figure } from "@/components/mdx/figure";
import { MdxContent } from "@/components/mdx/mdx-content";
import { ContactForm } from "@/components/mdx/contact-form";
import { getStaticPageBySlug } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await getStaticPageBySlug("about");

  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: "/about",
      type: "website",
    },
    twitter: {
      title: meta.title,
      description: meta.description,
    },
    alternates: { canonical: "/about" },
  };
}

export default async function AboutPage() {
  const { meta, source } = await getStaticPageBySlug("about");

  return (
    <article
      className="max-w-2xl space-y-8 pt-2 [font-family:var(--font-geist-sans)]"
      data-oid="6ejja1w"
    >
      <header className="space-y-1" data-oid="nch:1ho">
        <p
          className="text-[10px] tracking-[0.22em] text-[var(--scaffold-ruler)] [font-family:var(--font-geist-pixel-square)]"
          data-oid="7q7x1jq"
        >
          ABOUT
        </p>
        <h1
          className="text-2xl tracking-tight text-[var(--scaffold-toggle-text-active)]"
          data-oid="4202ajc"
        >
          {meta.title}
        </h1>
        {meta.description ? (
          <p
            className="max-w-[42rem] text-[14px] leading-6 text-[var(--scaffold-ruler)]"
            data-oid="uor3hu."
          >
            {meta.description}
          </p>
        ) : null}
      </header>

      <MdxContent data-oid="4r_a6hz">
        <MDXRemote
          source={source}
          components={{ Figure, ContactForm }}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [
                rehypeSlug,
                [rehypeAutolinkHeadings, { behavior: "append" }],
              ],
            },
          }}
          data-oid="k_hobft"
        />
      </MdxContent>
    </article>
  );
}
