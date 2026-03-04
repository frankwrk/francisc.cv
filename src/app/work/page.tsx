import type { Metadata } from "next";
import Link from "next/link";
import { getAllProjects } from "@/lib/content";
import { DiscreteFieldPreview } from "@/components/ui/discrete-field-preview";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected projects across technical product management, UX design, and web engineering by Francisc Furdui.",
  openGraph: {
    title: "Work — francisc.cv",
    description:
      "Selected projects across technical product management, UX design, and web engineering by Francisc Furdui.",
    url: "/work",
  },
  alternates: { canonical: "/work" },
};

export default async function WorkPage() {
  const projects = await getAllProjects();

  return (
    <article className="max-w-2xl space-y-8 pt-2 [font-family:var(--font-geist-sans)]">
      <header className="space-y-1">
        <p className="text-[10px] tracking-[0.22em] text-[var(--scaffold-ruler)] [font-family:var(--font-geist-pixel-square)]">
          WORK
        </p>
        <h1 className="text-2xl tracking-tight text-[var(--scaffold-toggle-text-active)]">
          Selected projects
        </h1>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <Link
            key={project.slug}
            href={`/work/${project.slug}`}
            className="group block overflow-hidden border border-[var(--scaffold-line)] transition-colors hover:border-[var(--scaffold-ruler)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--scaffold-ruler)]"
          >
            {/* Discrete Field thumbnail */}
            <div className="border-b border-[var(--scaffold-line)] transition-opacity group-hover:opacity-90">
              <DiscreteFieldPreview slug={project.slug} height={110} />
            </div>

            <div className="space-y-3 p-5">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-[15px] font-medium leading-snug text-[var(--scaffold-toggle-text-active)] group-hover:underline">
                  {project.title}
                </h2>
                {project.role && (
                  <span className="shrink-0 text-[10px] tracking-[0.1em] text-[var(--scaffold-ruler)] [font-family:var(--font-geist-pixel-square)]">
                    {project.role}
                  </span>
                )}
              </div>

              <p className="text-[13px] leading-relaxed text-[var(--scaffold-ruler)]">
                {project.description}
              </p>

              {project.tags && project.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="border border-[var(--scaffold-line)] px-2 py-0.5 text-[10px] tracking-[0.08em] text-[var(--scaffold-ruler)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {project.outcomes && project.outcomes.length > 0 && (
                <p className="text-[11px] tracking-[0.06em] text-[var(--scaffold-ruler)] opacity-50">
                  {project.outcomes.length} outcome
                  {project.outcomes.length !== 1 ? "s" : ""}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </article>
  );
}
