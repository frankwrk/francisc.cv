import fs from "fs";
import path from "path";
import matter from "gray-matter";

const projectsDir = path.join(process.cwd(), "content/projects");
const writingDir = path.join(process.cwd(), "content/writing");

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

export type ArtTarget = {
  slug: string;
  title: string;
  type: "work" | "thinking";
};

export async function getAllProjects(): Promise<ProjectMeta[]> {
  const files = fs.readdirSync(projectsDir).filter((f) => f.endsWith(".mdx"));
  const projects = files.map((file) => {
    const slug = file.replace(/\.mdx$/, "");
    const { data } = matter(fs.readFileSync(path.join(projectsDir, file), "utf8"));
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
  const { data, content } = matter(
    fs.readFileSync(path.join(projectsDir, `${slug}.mdx`), "utf8")
  );
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
  const files = fs.readdirSync(writingDir).filter((f) => f.endsWith(".mdx"));
  const articles = files.map((file) => {
    const slug = file.replace(/\.mdx$/, "");
    const { data } = matter(fs.readFileSync(path.join(writingDir, file), "utf8"));
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
  const { data, content } = matter(
    fs.readFileSync(path.join(writingDir, `${slug}.mdx`), "utf8")
  );
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
    })),
    ...articles.map((article) => ({
      slug: article.slug,
      title: article.title,
      type: "thinking" as const,
    })),
  ];
}
