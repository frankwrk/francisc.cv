import fs from "fs";
import path from "path";
import matter from "gray-matter";

const projectsDir = path.join(process.cwd(), "content/projects");
const writingDir = path.join(process.cwd(), "content/writing");
const pagesDir = path.join(process.cwd(), "content/pages");

export type ProjectMeta = {
  slug: string;
  title: string;
  description: string;
  role?: string;
  tags?: string[];
  stack?: string[];
  outcomes?: string[];
  featured?: boolean;
  order?: number;
};

export type ProjectData = {
  meta: ProjectMeta;
  source: string;
};

export type ArticleMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags?: string[];
  takeaways?: string[];
};

export type ArticleData = {
  meta: ArticleMeta;
  source: string;
};

export type StaticPageMeta = {
  slug: string;
  title: string;
  description: string;
};

export type StaticPageData = {
  meta: StaticPageMeta;
  source: string;
};

export type ArtTargetType = "work" | "thinking";

export function getArtAssignmentKey(type: ArtTargetType, slug: string) {
  return `${type}:${slug}`;
}

export type ArtTarget = {
  slug: string;
  title: string;
  type: ArtTargetType;
  assignmentKey: string;
};

function getMdxFiles(dir: string) {
  return fs.readdirSync(dir).filter((file) => file.endsWith(".mdx"));
}

function readMdxFile(dir: string, slug: string) {
  return matter(fs.readFileSync(path.join(dir, `${slug}.mdx`), "utf8"));
}

export async function getAllProjects(): Promise<ProjectMeta[]> {
  const files = getMdxFiles(projectsDir);
  const projects = files.map((file) => {
    const slug = file.replace(/\.mdx$/, "");
    const { data } = readMdxFile(projectsDir, slug);
    return {
      slug,
      title: data.title ?? slug,
      description: data.description ?? "",
      role: data.role,
      tags: data.tags,
      stack: data.stack,
      outcomes: data.outcomes,
      featured: data.featured,
      order: data.order,
    } as ProjectMeta;
  });
  return projects.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
}

export async function getProjectBySlug(slug: string): Promise<ProjectData> {
  const { data, content } = readMdxFile(projectsDir, slug);
  return {
    meta: {
      slug,
      title: data.title ?? slug,
      description: data.description ?? "",
      role: data.role,
      tags: data.tags,
      stack: data.stack,
      outcomes: data.outcomes,
      featured: data.featured,
      order: data.order,
    },
    source: content,
  };
}

export async function getAllArticles(): Promise<ArticleMeta[]> {
  const files = getMdxFiles(writingDir);
  const articles = files.map((file) => {
    const slug = file.replace(/\.mdx$/, "");
    const { data } = readMdxFile(writingDir, slug);
    return {
      slug,
      title: data.title ?? slug,
      description: data.description ?? "",
      date: data.date ?? "",
      tags: data.tags,
      takeaways: data.takeaways,
    } as ArticleMeta;
  });
  return articles.sort((a, b) => (a.date > b.date ? -1 : 1));
}

export async function getArticleBySlug(slug: string): Promise<ArticleData> {
  const { data, content } = readMdxFile(writingDir, slug);
  return {
    meta: {
      slug,
      title: data.title ?? slug,
      description: data.description ?? "",
      date: data.date ?? "",
      tags: data.tags,
      takeaways: data.takeaways,
    },
    source: content,
  };
}

export async function getAllStaticPages(): Promise<StaticPageMeta[]> {
  const files = getMdxFiles(pagesDir);
  const pages = files.map((file) => {
    const slug = file.replace(/\.mdx$/, "");
    const { data } = readMdxFile(pagesDir, slug);

    return {
      slug,
      title: data.title ?? slug,
      description: data.description ?? "",
    } as StaticPageMeta;
  });

  return pages.sort((a, b) => a.title.localeCompare(b.title));
}

export async function getStaticPageBySlug(slug: string): Promise<StaticPageData> {
  const { data, content } = readMdxFile(pagesDir, slug);

  return {
    meta: {
      slug,
      title: data.title ?? slug,
      description: data.description ?? "",
    },
    source: content,
  };
}

export async function getAllArtTargets(): Promise<ArtTarget[]> {
  const [projects, articles] = await Promise.all([
    getAllProjects(),
    getAllArticles(),
  ]);

  return [
    ...projects.map((project) => ({
      slug: project.slug,
      title: project.title,
      type: "work" as const,
      assignmentKey: getArtAssignmentKey("work", project.slug),
    })),
    ...articles.map((article) => ({
      slug: article.slug,
      title: article.title,
      type: "thinking" as const,
      assignmentKey: getArtAssignmentKey("thinking", article.slug),
    })),
  ];
}
