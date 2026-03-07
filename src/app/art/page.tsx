import type { Metadata } from "next";
import { ArtPageClient } from "./art-page-client";
import { artAssignments } from "@/config/art-assignments";
import { getAllArtTargets } from "@/lib/content";
import {
  getAssignmentRecordValue,
  normalizeArtAssignment,
  type ArtAssignment,
} from "@/lib/art-assignments";
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

  const committedAssignments = targets.reduce<Record<string, ArtAssignment>>(
    (result, target) => {
      const assignment = normalizeArtAssignment(
        getAssignmentRecordValue(
          artAssignments,
          target.assignmentKey,
          target.slug,
        ),
      );

      if (assignment) {
        result[target.assignmentKey] = assignment;
      }

      return result;
    },
    {},
  );
  const parsed = parseArtEditorSearchParams(rawSearchParams);
  const initialTarget =
    parsed.slug
      ? targets.find((target) => target.slug === parsed.slug) ?? null
      : null;
  const initialSlug = initialTarget?.slug ?? null;
  const initialAssignment =
    parsed.assignment ??
    normalizeArtAssignment(
      initialTarget
        ? getAssignmentRecordValue(
            artAssignments,
            initialTarget.assignmentKey,
            initialTarget.slug,
          )
        : null,
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
