import type { Metadata } from "next";
import { ArtPageClient } from "./art-page-client";
import { artAssignments } from "@/config/art-assignments";
import { getAllArtTargets } from "@/lib/content";
import { normalizeArtAssignment, normalizeArtAssignments } from "@/lib/art-assignments";
import { parseArtEditorSearchParams } from "@/lib/art-config-url";

export const metadata: Metadata = {
  title: "Art Lab",
  description:
    "Algorithmic hero-art editor for assigning article and project canvas designs.",
  robots: {
    index: false,
    follow: false,
  },
};

type Props = {
  searchParams?: Promise<{
    slug?: string | string[];
    heroCanvasIndex?: string | string[];
    config?: string | string[];
  }>;
};

export default async function ArtPage({ searchParams }: Props) {
  const [targets, rawSearchParams] = await Promise.all([
    getAllArtTargets(),
    searchParams ?? Promise.resolve({}),
  ]);

  const committedAssignments = normalizeArtAssignments(artAssignments);
  const parsed = parseArtEditorSearchParams(rawSearchParams);
  const initialSlug =
    parsed.slug && targets.some((target) => target.slug === parsed.slug)
      ? parsed.slug
      : null;
  const initialAssignment =
    parsed.assignment ??
    normalizeArtAssignment(
      initialSlug ? artAssignments[initialSlug] ?? null : null,
    );

  return (
    <ArtPageClient
      committedAssignments={committedAssignments}
      hasInitialQueryAssignment={Boolean(parsed.assignment)}
      initialAssignment={initialAssignment}
      initialSlug={initialSlug}
      targets={targets}
    />
  );
}
