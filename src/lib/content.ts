import { cache } from "react";
import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type {
  Heading,
  PageEntry,
  PageFrontmatter,
  ProjectEntry,
  ProjectFrontmatter,
  SearchEntry,
  WritingEntry,
  WritingFrontmatter,
} from "@/types/content";
import { estimateReadingTime, normalizeArray, slugify } from "@/lib/utils";

const CONTENT_DIR = path.join(process.cwd(), "content");

function extractHeadings(source: string): Heading[] {
  const lines = source.split("\n");
  const headings: Heading[] = [];

  for (const line of lines) {
    const match = /^(##|###)\s+(.+)$/.exec(line.trim());
    if (!match) {
      continue;
    }

    const level = match[1] === "##" ? 2 : 3;
    const text = match[2]
      .replace(/\[(.*?)\]\(.*?\)/g, "$1")
      .replace(/`(.*?)`/g, "$1")
      .trim();

    headings.push({
      id: slugify(text),
      text,
      level,
    });
  }

  return headings;
}

async function readMdxFile<T>(filePath: string): Promise<{ frontmatter: T; raw: string }> {
  const file = await fs.readFile(filePath, "utf8");
  const parsed = matter(file);
  return {
    frontmatter: parsed.data as T,
    raw: parsed.content,
  };
}

async function readMdxDirectory(directory: string) {
  const fullDirectory = path.join(CONTENT_DIR, directory);
  const entries = await fs.readdir(fullDirectory, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".mdx"))
    .map((entry) => ({
      slug: entry.name.replace(/\.mdx$/, ""),
      fullPath: path.join(fullDirectory, entry.name),
    }));
}

function parseProject(frontmatter: ProjectFrontmatter, slug: string, raw: string): ProjectEntry {
  return {
    slug,
    title: frontmatter.title,
    description: frontmatter.description,
    role: frontmatter.role,
    tags: normalizeArray(frontmatter.tags),
    stack: normalizeArray(frontmatter.stack),
    outcomes: normalizeArray(frontmatter.outcomes),
    links: frontmatter.links,
    featured: Boolean(frontmatter.featured),
    order: typeof frontmatter.order === "number" ? frontmatter.order : undefined,
    raw,
    headings: extractHeadings(raw),
  };
}

function parseWriting(frontmatter: WritingFrontmatter, slug: string, raw: string): WritingEntry {
  return {
    slug,
    title: frontmatter.title,
    description: frontmatter.description,
    date: frontmatter.date,
    tags: normalizeArray(frontmatter.tags),
    takeaways: normalizeArray(frontmatter.takeaways),
    readingTime: estimateReadingTime(raw),
    raw,
    headings: extractHeadings(raw),
  };
}

function sortProjects(a: ProjectEntry, b: ProjectEntry) {
  const orderA = a.order ?? Number.MAX_SAFE_INTEGER;
  const orderB = b.order ?? Number.MAX_SAFE_INTEGER;

  if (orderA !== orderB) {
    return orderA - orderB;
  }

  return a.title.localeCompare(b.title);
}

function sortWriting(a: WritingEntry, b: WritingEntry) {
  return +new Date(b.date) - +new Date(a.date);
}

export const getProjects = cache(async () => {
  const files = await readMdxDirectory("projects");
  const data = await Promise.all(
    files.map(async ({ slug, fullPath }) => {
      const { frontmatter, raw } = await readMdxFile<ProjectFrontmatter>(fullPath);
      return parseProject(frontmatter, slug, raw);
    }),
  );

  return data.sort(sortProjects);
});

export const getProjectBySlug = cache(async (slug: string) => {
  const projects = await getProjects();
  return projects.find((project) => project.slug === slug) ?? null;
});

export const getFeaturedProjects = cache(async () => {
  const projects = await getProjects();
  return projects.filter((project) => project.featured).slice(0, 6);
});

export const getWriting = cache(async () => {
  const files = await readMdxDirectory("writing");
  const data = await Promise.all(
    files.map(async ({ slug, fullPath }) => {
      const { frontmatter, raw } = await readMdxFile<WritingFrontmatter>(fullPath);
      return parseWriting(frontmatter, slug, raw);
    }),
  );

  return data.sort(sortWriting);
});

export const getWritingBySlug = cache(async (slug: string) => {
  const entries = await getWriting();
  return entries.find((entry) => entry.slug === slug) ?? null;
});

export const getLatestWriting = cache(async () => {
  const entries = await getWriting();
  return entries.slice(0, 5);
});

export const getPageContent = cache(async (slug: string) => {
  const filePath = path.join(CONTENT_DIR, "pages", `${slug}.mdx`);
  try {
    const { frontmatter, raw } = await readMdxFile<PageFrontmatter>(filePath);
    const page: PageEntry = {
      slug,
      title: frontmatter.title,
      description: frontmatter.description,
      raw,
    };

    return page;
  } catch {
    return null;
  }
});

export const getSearchEntries = cache(async (): Promise<SearchEntry[]> => {
  const [projects, writing] = await Promise.all([getProjects(), getWriting()]);

  const staticPages: SearchEntry[] = [
    {
      id: "page-home",
      kind: "Page",
      title: "Home",
      description: "Overview of work, writing, and capabilities.",
      href: "/",
    },
    {
      id: "page-projects",
      kind: "Page",
      title: "Projects",
      description: "Product, UX, systems, and platform case studies.",
      href: "/projects",
    },
    {
      id: "page-writing",
      kind: "Page",
      title: "Writing",
      description: "Structured notes on product and engineering systems.",
      href: "/writing",
    },
    {
      id: "page-about",
      kind: "Page",
      title: "About",
      description: "Working style, principles, and collaboration model.",
      href: "/about",
    },
    {
      id: "page-resume",
      kind: "Page",
      title: "Resume",
      description: "Experience timeline and highlights.",
      href: "/resume",
    },
    {
      id: "page-now",
      kind: "Page",
      title: "Now",
      description: "Current priorities and focus areas.",
      href: "/now",
    },
  ];

  const projectEntries: SearchEntry[] = projects.map((project) => ({
    id: `project-${project.slug}`,
    kind: "Project",
    title: project.title,
    description: project.description,
    href: `/projects/${project.slug}`,
    tags: project.tags,
  }));

  const writingEntries: SearchEntry[] = writing.map((post) => ({
    id: `writing-${post.slug}`,
    kind: "Writing",
    title: post.title,
    description: post.description,
    href: `/writing/${post.slug}`,
    tags: post.tags,
  }));

  return [...staticPages, ...projectEntries, ...writingEntries];
});
