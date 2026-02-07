import Link from "next/link";
import { HeroSpectrum } from "@/components/site/hero-spectrum";
import { Badge } from "@/components/ui/badge";
import { MetaLine, Panel, PanelHeader, PanelRow } from "@/components/ui/panel";
import { getFeaturedProjects, getLatestWriting } from "@/lib/content";
import { siteConfig } from "@/lib/site";

function DotIcon({ className }: { className?: string }) {
  return <span className={`inline-block h-2 w-2 rounded-full bg-accent ${className ?? ""}`} aria-hidden />;
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden>
      <path d="M3.5 8h9M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default async function HomePage() {
  const [featuredProjects, latestWriting] = await Promise.all([
    getFeaturedProjects(),
    getLatestWriting(),
  ]);

  return (
    <div className="mx-auto w-full max-w-[1100px] px-4 pb-20 pt-8 sm:px-6 sm:pt-12">
      <section className="grid gap-8 lg:grid-cols-12 lg:items-end">
        <div className="space-y-6 lg:col-span-7">
        <p className="font-pixel text-[11px] uppercase tracking-[0.18em] text-muted">Product + Platform</p>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">Francisc Furdui</h1>
        <p className="max-w-[74ch] text-base leading-7 text-muted sm:text-lg">
            Product-oriented technologist with 9+ years across UX, WordPress engineering,
            platform systems, and security-aware delivery.
        </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 rounded-md border border-accent/45 bg-accent-muted px-4 py-2 text-sm font-medium text-fg transition-colors hover:border-accent hover:text-accent"
            >
              <DotIcon />
              View Projects
            </Link>
            <Link
              href="/writing"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-fg transition-colors hover:border-accent/40"
            >
              Read Writing
              <ArrowIcon />
            </Link>
            <a
              href="/resume.pdf"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-fg transition-colors hover:border-accent/40"
              download
            >
              Download Resume
            </a>
          </div>

          <div className="grid gap-2 border-y border-border py-4 sm:grid-cols-3">
            <div>
              <p className="font-mono text-[11px] text-muted">Focus</p>
              <p className="text-sm text-fg">Requirements quality</p>
            </div>
            <div>
              <p className="font-mono text-[11px] text-muted">Bias</p>
              <p className="text-sm text-fg">60+ shipped web products</p>
            </div>
            <div>
              <p className="font-mono text-[11px] text-muted">Execution</p>
              <p className="text-sm text-fg">Product + UX + systems</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <HeroSpectrum />
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Panel className="bg-transparent">
            <PanelHeader
              label="Featured"
              title="Selected projects"
              description="Outcome-focused case studies across product, UX, and systems work."
              action={
                <Link href="/projects" className="inline-flex items-center gap-1 text-sm text-accent hover:text-fg">
                  All projects
                  <ArrowIcon />
                </Link>
              }
            />

            {featuredProjects.map((project) => (
              <PanelRow key={project.slug} className="group hover:bg-accent-muted/25">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="inline-flex items-center gap-2 text-base font-semibold tracking-tight text-fg transition-colors group-hover:text-accent"
                    >
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-sm border border-accent/30 bg-accent-muted/50 text-[10px] text-accent">
                        ●
                      </span>
                      {project.title}
                    </Link>
                    <MetaLine>{project.role}</MetaLine>
                  </div>

                  <p className="text-sm text-muted">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <Badge key={`${project.slug}-${tag}`} value={tag} />
                    ))}
                  </div>
                </div>
              </PanelRow>
            ))}
          </Panel>
        </div>

        <div className="space-y-6 lg:col-span-5">
          <Panel className="bg-transparent">
            <PanelHeader
              label="Latest"
              title="Writing"
              description="Systems notes on product, docs, and engineering collaboration."
              action={
                <Link href="/writing" className="inline-flex items-center gap-1 text-sm text-accent hover:text-fg">
                  All posts
                  <ArrowIcon />
                </Link>
              }
            />
            {latestWriting.slice(0, 4).map((post) => (
              <PanelRow key={post.slug} className="hover:bg-accent-muted/20">
                <Link
                  href={`/writing/${post.slug}`}
                  className="text-sm font-medium tracking-tight text-fg transition-colors hover:text-accent"
                >
                  {post.title}
                </Link>
                <MetaLine className="mt-2">{post.readingTime} min read</MetaLine>
              </PanelRow>
            ))}
          </Panel>

          <div>
            <div className="mb-3 flex items-center gap-3">
              <span className="font-pixel text-[11px] uppercase tracking-[0.18em] text-muted">Signals</span>
              <span className="h-px flex-1 bg-border2" aria-hidden />
            </div>
            <div className="flex flex-wrap gap-2">
              {siteConfig.signals.map((signal) => (
                <Badge key={signal} value={signal} />
              ))}
            </div>
          </div>

          <div className="tone-border rounded-md border border-border bg-card/70 p-4">
            <p className="font-pixel text-[10px] uppercase tracking-[0.14em] text-muted">Terminal</p>
            <pre className="mt-2 overflow-x-auto rounded-sm bg-card2 p-3 font-mono text-xs text-muted">
              <code>{`$ focus --week\n- tighten delivery docs\n- standardize acceptance criteria\n- improve onboarding runbooks`}</code>
            </pre>
          </div>
        </div>
      </section>
    </div>
  );
}
