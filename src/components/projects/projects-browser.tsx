"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { ProjectEntry } from "@/types/content";
import { Badge } from "@/components/ui/badge";
import { MetaLine, Panel, PanelHeader, PanelRow } from "@/components/ui/panel";
import { SearchInput } from "@/components/ui/search-input";

const FILTER_TAGS = ["All", "Product", "DevEx", "UX", "Systems", "Security", "WordPress", "Next.js"];

export function ProjectsBrowser({ projects }: { projects: ProjectEntry[] }) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState("All");

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    return projects.filter((project) => {
      const inTag = activeTag === "All" || project.tags.includes(activeTag);
      const inText =
        !q ||
        `${project.title} ${project.description} ${project.role} ${project.tags.join(" ")} ${project.stack.join(" ")}`
          .toLowerCase()
          .includes(q);

      return inTag && inText;
    });
  }, [activeTag, projects, query]);

  return (
    <div className="space-y-6">
      <Panel>
        <PanelHeader
          label="Projects"
          title="Case studies and platform work"
          description="Filter by scope and discipline to quickly find relevant work."
        />
        <div className="flex flex-col gap-4 border-t border-border px-5 py-4 sm:px-6">
          <SearchInput value={query} onChange={setQuery} placeholder="Search projects" />
          <div className="flex flex-wrap gap-2">
            {FILTER_TAGS.map((tag) => {
              const active = tag === activeTag;
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setActiveTag(tag)}
                  className={`rounded-md border px-2.5 py-1.5 font-mono text-[11px] transition-colors ${
                    active
                      ? "border-accent/60 bg-accent-muted/70 text-fg"
                      : "border-border text-muted hover:border-accent/40 hover:text-fg"
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>
      </Panel>

      <Panel>
        {results.length > 0 ? (
          results.map((project) => (
            <PanelRow key={project.slug}>
              <div className="space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <Link
                      href={`/projects/${project.slug}`}
                      className="text-base font-semibold tracking-tight text-fg transition-colors hover:text-accent"
                    >
                      {project.title}
                    </Link>
                    <p className="mt-1 max-w-[74ch] text-sm text-muted">{project.description}</p>
                  </div>
                  <MetaLine>{project.role}</MetaLine>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {project.tags.map((tag) => (
                    <Badge key={tag} value={tag} />
                  ))}
                </div>

                <p className="font-mono text-xs text-muted">Stack: {project.stack.join(" · ")}</p>
                <ul className="space-y-1 text-sm text-fg">
                  {project.outcomes.map((outcome) => (
                    <li key={outcome}>• {outcome}</li>
                  ))}
                </ul>
              </div>
            </PanelRow>
          ))
        ) : (
          <PanelRow>
            <p className="text-sm text-muted">No projects match the current filter.</p>
          </PanelRow>
        )}
      </Panel>
    </div>
  );
}
