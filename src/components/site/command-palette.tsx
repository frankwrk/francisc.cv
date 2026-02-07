"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { SearchEntry } from "@/types/content";
import { cn } from "@/lib/utils";

type CommandPaletteProps = {
  entries: SearchEntry[];
  open: boolean;
  onClose: () => void;
};

function normalize(value: string) {
  return value.toLowerCase().trim();
}

export function CommandPalette({ entries, open, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open) return;

    window.setTimeout(() => inputRef.current?.focus(), 40);
  }, [open]);

  const filtered = useMemo(() => {
    const q = normalize(query);
    if (!q) {
      return entries.slice(0, 9);
    }

    return entries
      .filter((entry) => {
        const haystack = `${entry.title} ${entry.description} ${entry.tags?.join(" ") ?? ""}`.toLowerCase();
        return haystack.includes(q);
      })
      .slice(0, 12);
  }, [entries, query]);

  const openEntry = useCallback(
    (href: string) => {
      router.push(href);
      onClose();
    },
    [onClose, router],
  );

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
      }

      if (event.key === "Enter" && filtered[0]) {
        openEntry(filtered[0].href);
      }

      if (event.key === "Escape") {
        onClose();
      }
    }

    if (open) {
      window.addEventListener("keydown", onKeyDown);
      return () => window.removeEventListener("keydown", onKeyDown);
    }
  }, [filtered, open, onClose, openEntry]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/55 px-4 pt-[10vh] backdrop-blur-[1px]"
      onClick={onClose}
    >
      <div
        className={cn(
          "tone-border w-full max-w-2xl rounded-md bg-bg transition-all duration-150",
          "motion-reduce:transition-none",
        )}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
      >
        <div className="border-b border-border px-4 py-3">
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search pages, projects, writing..."
            className="w-full bg-transparent text-sm text-fg placeholder:text-muted focus:outline-none"
          />
        </div>

        <ul className="max-h-[50vh] overflow-auto p-2">
          {filtered.length > 0 ? (
            filtered.map((entry) => (
              <li key={entry.id}>
                <button
                  type="button"
                  onClick={() => openEntry(entry.href)}
                  className="flex w-full items-start justify-between rounded-sm px-3 py-2 text-left transition-colors duration-100 hover:bg-card2"
                >
                  <span>
                    <span className="block text-sm font-medium text-fg">{entry.title}</span>
                    <span className="block text-xs text-muted">{entry.description}</span>
                  </span>
                  <span className="ml-3 mt-0.5 font-mono text-[11px] text-muted">{entry.kind}</span>
                </button>
              </li>
            ))
          ) : (
            <li className="px-3 py-6 text-center text-sm text-muted">No matches found.</li>
          )}
        </ul>
      </div>
      <button type="button" className="sr-only" onClick={onClose}>
        Close
      </button>
    </div>
  );
}
