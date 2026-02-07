import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { MetaLine, Panel, PanelHeader, PanelRow } from "@/components/ui/panel";
import { getWriting, getWritingBySlug } from "@/lib/content";
import { renderMdx } from "@/lib/mdx";
import { formatDate } from "@/lib/utils";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = await getWriting();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getWritingBySlug(slug);

  if (!post) {
    return {
      title: "Writing",
    };
  }

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `/writing/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `/writing/${post.slug}`,
      type: "article",
    },
  };
}

export default async function WritingPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getWritingBySlug(slug);

  if (!post) {
    notFound();
  }

  const content = await renderMdx(post.raw);

  return (
    <div className="mx-auto grid w-full max-w-[1100px] gap-6 px-4 pb-20 pt-10 lg:grid-cols-12 lg:pt-12 sm:px-6">
      <article className="space-y-6 lg:col-span-8">
        <Panel>
          <PanelHeader label="Writing" title={post.title} description={post.description} />
          <PanelRow>
            <div className="space-y-3">
              <MetaLine>
                {formatDate(post.date)} · {post.readingTime} min read
              </MetaLine>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} value={tag} />
                ))}
              </div>
            </div>
          </PanelRow>
        </Panel>

        {post.takeaways && post.takeaways.length > 0 ? (
          <Panel>
            <PanelHeader label="Takeaways" title="Key takeaways" />
            <PanelRow>
              <ul className="space-y-2 text-sm text-fg">
                {post.takeaways.map((takeaway) => (
                  <li key={takeaway}>• {takeaway}</li>
                ))}
              </ul>
            </PanelRow>
          </Panel>
        ) : null}

        <Panel>
          <PanelRow className="prose-shell">{content}</PanelRow>
        </Panel>
      </article>

      <aside className="space-y-6 lg:col-span-4">
        <Panel className="lg:sticky lg:top-20">
          <PanelHeader label="Outline" title="On this page" />
          {post.headings.length > 0 ? (
            post.headings.map((heading) => (
              <PanelRow key={heading.id} className={heading.level === 3 ? "pl-10" : undefined}>
                <a href={`#${heading.id}`} className="text-sm text-muted transition-colors hover:text-fg">
                  {heading.text}
                </a>
              </PanelRow>
            ))
          ) : (
            <PanelRow>
              <p className="text-sm text-muted">No section headings available.</p>
            </PanelRow>
          )}
        </Panel>

        <Panel>
          <PanelHeader label="More" title="Next" />
          <PanelRow>
            <Link href="/writing" className="text-sm text-accent hover:text-fg">
              Back to all writing
            </Link>
          </PanelRow>
          <PanelRow>
            <Link href="/projects" className="text-sm text-accent hover:text-fg">
              View project case studies
            </Link>
          </PanelRow>
        </Panel>
      </aside>
    </div>
  );
}
