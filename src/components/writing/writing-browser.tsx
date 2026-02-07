"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { WritingEntry } from "@/types/content";
import { SearchInput } from "@/components/ui/search-input";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { MetaLine, Panel, PanelHeader, PanelRow } from "@/components/ui/panel";

export function WritingBrowser({ posts }: { posts: WritingEntry[] }) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    return posts.filter((post) => {
      if (!q) return true;
      const haystack = `${post.title} ${post.description} ${post.tags.join(" ")}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [posts, query]);

  return (
    <div className="space-y-6">
      <Panel>
        <PanelHeader
          label="Writing"
          title="Systems and product notes"
          description="Short essays on decision quality, architecture, and delivery behavior."
        />
        <div className="border-t border-border px-5 py-4 sm:px-6">
          <SearchInput value={query} onChange={setQuery} placeholder="Search writing" />
        </div>
      </Panel>

      <Panel>
        {results.length > 0 ? (
          results.map((post) => (
            <PanelRow key={post.slug}>
              <div className="space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <Link
                      href={`/writing/${post.slug}`}
                      className="text-base font-semibold tracking-tight text-fg transition-colors hover:text-accent"
                    >
                      {post.title}
                    </Link>
                    <p className="mt-1 max-w-[74ch] text-sm text-muted">{post.description}</p>
                  </div>
                  <MetaLine>
                    {formatDate(post.date)} · {post.readingTime} min read
                  </MetaLine>
                </div>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} value={tag} />
                  ))}
                </div>
              </div>
            </PanelRow>
          ))
        ) : (
          <PanelRow>
            <p className="text-sm text-muted">No posts match this search.</p>
          </PanelRow>
        )}
      </Panel>
    </div>
  );
}
