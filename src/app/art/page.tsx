import { getAllProjects, getAllArticles } from "@/lib/content";
import { ArtPageClient } from "./art-page-client";

export default async function ArtPage() {
  const [projects, articles] = await Promise.all([
    getAllProjects(),
    getAllArticles(),
  ]);

  const contentSlugs = [
    ...projects.map((p) => ({ slug: p.slug, type: "work" as const })),
    ...articles.map((a) => ({ slug: a.slug, type: "thinking" as const })),
  ];

  return <ArtPageClient contentSlugs={contentSlugs} />;
}
