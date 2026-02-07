import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { MetaLine, Panel, PanelHeader, PanelRow } from "@/components/ui/panel";
import { getProjectBySlug, getProjects } from "@/lib/content";
import { renderMdx } from "@/lib/mdx";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project",
    };
  }

  return {
    title: project.title,
    description: project.description,
    alternates: {
      canonical: `/projects/${project.slug}`,
    },
    openGraph: {
      title: project.title,
      description: project.description,
      url: `/projects/${project.slug}`,
      type: "article",
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const content = await renderMdx(project.raw);

  return (
    <div className="mx-auto grid w-full max-w-[1100px] gap-6 px-4 pb-20 pt-10 lg:grid-cols-12 lg:pt-12 sm:px-6">
      <article className="space-y-6 lg:col-span-8">
        <Panel>
          <PanelHeader label="Case Study" title={project.title} description={project.description} />
          <PanelRow>
            <div className="space-y-3">
              <MetaLine>{project.role}</MetaLine>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Badge key={tag} value={tag} />
                ))}
              </div>
              <p className="font-mono text-xs text-muted">Stack: {project.stack.join(" · ")}</p>
              {project.links ? (
                <div className="flex flex-wrap gap-3 text-sm">
                  {project.links.live ? (
                    <a className="link-underline text-accent" href={project.links.live} target="_blank" rel="noreferrer">
                      Live
                    </a>
                  ) : null}
                  {project.links.github ? (
                    <a className="link-underline text-accent" href={project.links.github} target="_blank" rel="noreferrer">
                      GitHub
                    </a>
                  ) : null}
                  {project.links.doc ? (
                    <a className="link-underline text-accent" href={project.links.doc} target="_blank" rel="noreferrer">
                      Doc
                    </a>
                  ) : null}
                </div>
              ) : null}
            </div>
          </PanelRow>
        </Panel>

        <Panel>
          <PanelRow className="prose-shell">{content}</PanelRow>
        </Panel>
      </article>

      <aside className="space-y-6 lg:col-span-4">
        <Panel className="lg:sticky lg:top-20">
          <PanelHeader label="Outline" title="On this page" />
          {project.headings.length > 0 ? (
            project.headings.map((heading) => (
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
          <PanelHeader label="More" title="Explore" />
          <PanelRow>
            <Link href="/projects" className="text-sm text-accent hover:text-fg">
              Back to all projects
            </Link>
          </PanelRow>
          <PanelRow>
            <Link href="/writing" className="text-sm text-accent hover:text-fg">
              Read related writing
            </Link>
          </PanelRow>
        </Panel>
      </aside>
    </div>
  );
}
