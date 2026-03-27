import Link from "next/link";
import { ProfileAvatar } from "@/components/profile/profile-avatar";
import { Signature } from "@/components/brand/signature";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { siteProfileConfig } from "@/config/site-profile";
import { homepageProjects } from "@/config/site-home";
import { getAllArticles } from "@/lib/content";

function DocumentIcon() {
  return (
    <div
      className="flex h-12 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-[var(--scaffold-line)] bg-[var(--scaffold-surface)]"
      aria-hidden="true"
    >
      <svg
        width="16"
        height="20"
        viewBox="0 0 16 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-[var(--scaffold-ruler)]"
      >
        <rect x="0" y="1" width="9" height="1.5" rx="0.75" fill="currentColor" opacity="0.5" />
        <rect x="0" y="5.5" width="14" height="1.5" rx="0.75" fill="currentColor" opacity="0.5" />
        <rect x="0" y="10" width="11" height="1.5" rx="0.75" fill="currentColor" opacity="0.5" />
        <rect x="0" y="14.5" width="13" height="1.5" rx="0.75" fill="currentColor" opacity="0.5" />
        <rect x="0" y="19" width="7" height="1.5" rx="0.75" fill="currentColor" opacity="0.5" />
      </svg>
    </div>
  );
}

function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function Home() {
  const articles = getAllArticles();
  const mailtoHref = `mailto:${siteProfileConfig.contact.email}?subject=${encodeURIComponent(siteProfileConfig.contact.subject)}`;

  return (
    <article className="w-full space-y-16 pt-2">
      {/* Intro */}
      <div className="max-w-2xl space-y-8">
        <header className="space-y-5">
          <ProfileAvatar
            sources={siteProfileConfig.avatarSources}
            alt={siteProfileConfig.avatarAlt}
            initials={siteProfileConfig.initials}
          />
          <h1 className="text-balance text-4xl font-medium tracking-tight text-[var(--scaffold-toggle-text-active)] [font-family:var(--font-geist-pixel-square)] md:text-5xl">
            {siteProfileConfig.name}
          </h1>
        </header>

        <section className="space-y-4 text-[var(--scaffold-ruler)]">
          {siteProfileConfig.introParagraphs.map((paragraph) => (
            <p key={paragraph} className="text-sm font-light leading-[1.5] tracking-[0.025em]">{paragraph}</p>
          ))}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <HoverBorderGradient
              as="a"
              href={mailtoHref}
              containerClassName="rounded-full border-[var(--scaffold-line)] bg-[var(--scaffold-surface)] hover:bg-[var(--scaffold-surface)]"
              className="bg-[var(--scaffold-surface)] text-[var(--scaffold-toggle-text-active)]"
            >
              <span className="text-sm font-medium tracking-[0.01em]">
                {siteProfileConfig.contact.ctaLabel}
              </span>
            </HoverBorderGradient>
            <Signature className="w-[123px] max-w-full text-[var(--scaffold-ruler)]" />
          </div>
        </section>
      </div>

      {/* Projects */}
      <section className="space-y-4">
        <h2 className="text-[13px] font-medium text-[var(--scaffold-toggle-text-active)]">
          Projects
        </h2>
        <div className="grid grid-cols-3 gap-px border border-[var(--scaffold-line)] bg-[var(--scaffold-line)]">
          {homepageProjects.map((project) => {
            const card = (
              <div className="flex min-h-[140px] flex-col justify-between bg-[var(--scaffold-surface)] p-4">
                <div className="flex flex-1 items-center justify-center py-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--scaffold-bg)] text-[13px] font-medium tracking-wide text-[var(--scaffold-toggle-text-active)]">
                    {project.initial}
                  </div>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[14px] font-medium text-[var(--scaffold-toggle-text-active)]">
                    {project.title}
                  </p>
                  <p className="text-[12px] leading-5 text-[var(--scaffold-ruler)]">
                    {project.description}
                  </p>
                </div>
              </div>
            );

            if (!project.href) {
              return <div key={project.title}>{card}</div>;
            }

            return (
              <Link
                key={project.title}
                href={project.href}
                target="_blank"
                rel="noreferrer"
                className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--scaffold-ruler)]"
              >
                {card}
              </Link>
            );
          })}
        </div>
      </section>

      {/* Work */}
      <section className="space-y-4 pb-6">
        <h2 className="text-[13px] font-medium text-[var(--scaffold-toggle-text-active)]">
          Work
        </h2>
        <div className="-mx-2">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/thinking/${article.slug}`}
              className="flex items-center gap-4 rounded-lg px-2 py-3 transition-colors hover:bg-[var(--scaffold-surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--scaffold-ruler)]"
            >
              <DocumentIcon />
              <div className="min-w-0">
                <p className="text-[14px] text-[var(--scaffold-toggle-text-active)]">
                  {article.title}
                </p>
                <p className="text-[13px] text-[var(--scaffold-ruler)]">
                  {formatDate(article.date)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
}
