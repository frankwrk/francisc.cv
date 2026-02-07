import type { MetadataRoute } from "next";
import { getProjects, getWriting } from "@/lib/content";
import { siteConfig } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, writing] = await Promise.all([getProjects(), getWriting()]);

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/projects",
    "/writing",
    "/about",
    "/resume",
    "/now",
  ].map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: new Date(),
  }));

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${siteConfig.url}/projects/${project.slug}`,
    lastModified: new Date(),
  }));

  const writingRoutes: MetadataRoute.Sitemap = writing.map((post) => ({
    url: `${siteConfig.url}/writing/${post.slug}`,
    lastModified: new Date(post.date),
  }));

  return [...staticRoutes, ...projectRoutes, ...writingRoutes];
}
