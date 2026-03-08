import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import {
  homepageCapabilities,
  homepageIdentitySupport,
  homepageSelectedWork,
  profileSummary,
} from "@/config/site-home";
import {
  resumeData,
  resumeRoleLabels,
  type ResumeRole,
} from "@/config/site-resume";
import {
  getAllArticles,
  getAllProjects,
  getAllStaticPages,
  getArticleBySlug,
  getProjectBySlug,
  getStaticPageBySlug,
} from "@/lib/content";
import { assistantCorpusJsonPath, assistantFilesDir } from "@/lib/ai/sources";
import type { PublicCorpusBuild, PublicCorpusDocument } from "@/lib/ai/types";

const assistantContentDir = path.join(process.cwd(), "content/assistant");

type AssistantDocFrontmatter = {
  title?: string;
  sourceType?: PublicCorpusDocument["sourceType"];
  canonicalUrl?: string;
  topics?: string[];
  audiences?: string[];
  priority?: number;
  public?: boolean;
};

const resumeRoleMap: Record<ResumeRole, string> = {
  general: "general",
  security: "security",
  tpm: "tpm",
  ux: "ux-ui",
  wordpress: "wordpress",
};

function ensureLeadingSlash(value: string) {
  return value.startsWith("/") ? value : `/${value}`;
}

function normaliseWhitespace(value: string) {
  return value.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}

function stripMdxArtifacts(value: string) {
  return normaliseWhitespace(
    value
      .replace(/<Figure[\s\S]*?\/>/g, "")
      .replace(/<ContactForm[\s\S]*?\/>/g, "")
      .replace(/<[^>\n]+>/g, ""),
  );
}

function toExcerpt(value: string) {
  const excerpt = value.replace(/\s+/g, " ").trim();
  return excerpt.length <= 220 ? excerpt : `${excerpt.slice(0, 217)}...`;
}

function toFilename(id: string) {
  return `${id.replace(/:/g, "--")}.md`;
}

function serializeDocument(document: PublicCorpusDocument) {
  const frontmatter = [
    "---",
    `id: "${document.id}"`,
    `title: "${document.title.replace(/"/g, '\\"')}"`,
    `sourceType: "${document.sourceType}"`,
    `canonicalUrl: "${document.canonicalUrl}"`,
    `priority: ${document.priority}`,
    `topics: [${document.topics.map((topic) => `"${topic}"`).join(", ")}]`,
    `audiences: [${document.audiences
      .map((audience) => `"${audience}"`)
      .join(", ")}]`,
    "---",
    "",
  ].join("\n");

  return `${frontmatter}${document.content}\n`;
}

function buildDocument(
  input: Omit<PublicCorpusDocument, "excerpt" | "filename" | "attributes">,
): PublicCorpusDocument {
  return {
    ...input,
    excerpt: toExcerpt(input.content),
    filename: toFilename(input.id),
    attributes: {
      id: input.id,
      slug: input.slug,
      title: input.title,
      sourceType: input.sourceType,
      canonicalUrl: input.canonicalUrl,
      priority: input.priority,
      topics: input.topics.join("|"),
      audience: input.audiences.join("|"),
    },
  };
}

function walkMarkdownFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) {
    return [];
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return walkMarkdownFiles(entryPath);
    }

    return entry.name.endsWith(".md") ? [entryPath] : [];
  });
}

function readAssistantDocument(filePath: string): PublicCorpusDocument | null {
  const slug = path
    .relative(assistantContentDir, filePath)
    .replace(/\.md$/, "")
    .replace(/\\/g, "/");
  const { data, content } = matter(
    fs.readFileSync(filePath, "utf8"),
  ) as { data: AssistantDocFrontmatter; content: string };

  if (data.public === false) {
    return null;
  }

  const title = data.title ?? slug;
  const canonicalUrl = data.canonicalUrl
    ? ensureLeadingSlash(data.canonicalUrl)
    : "/";
  const sourceType = data.sourceType ?? (slug.startsWith("resume/") ? "resume" : "faq");

  return buildDocument({
    id: `${sourceType}:${slug.replace(/\//g, "-")}`,
    slug,
    title,
    sourceType,
    canonicalUrl,
    priority: data.priority ?? (slug.startsWith("resume/") ? 2 : 1),
    topics: data.topics ?? ["portfolio"],
    audiences: data.audiences ?? ["recruiter", "hiring-manager"],
    content: stripMdxArtifacts(content),
  });
}

function buildProfileSummaryDocument() {
  const content = [
    "# Profile summary",
    "",
    `Name: ${profileSummary.name}`,
    `Role: ${profileSummary.role}`,
    `Location: ${profileSummary.location}`,
    "",
    "## Positioning",
    "",
    homepageIdentitySupport.description,
    "",
    "## Focus",
    "",
    ...profileSummary.focus.map((item) => `- ${item}`),
    "",
    "## Capability signals",
    "",
    ...homepageCapabilities.map(
      (capability) =>
        `- ${capability.title}: ${capability.description}${capability.evidenceLabel ? ` Evidence: ${capability.evidenceLabel}.` : ""}`,
    ),
    "",
    "## Selected work",
    "",
    ...homepageSelectedWork.map(
      (item) => `- ${item.title}: ${item.description} (${item.status})`,
    ),
  ].join("\n");

  return buildDocument({
    id: "profile:summary",
    slug: "profile-summary",
    title: "Profile summary",
    sourceType: "profile",
    canonicalUrl: "/profile.json",
    priority: 1,
    topics: ["profile", "positioning", "portfolio"],
    audiences: ["recruiter", "hiring-manager", "technical-peer"],
    content,
  });
}

function buildResumeOverviewDocument() {
  const content = [
    "# Resume overview",
    "",
    resumeData.summary,
    "",
    "## Highlights",
    "",
    ...resumeData.highlights.map((item) => `- ${item}`),
    "",
    "## Experience",
    "",
    ...resumeData.experience.flatMap((entry) => [
      `### ${entry.title}`,
      `${entry.company} · ${entry.location} · ${entry.period}`,
      ...entry.bullets.map((bullet) => `- ${bullet}`),
      "",
    ]),
    "## Skills",
    "",
    ...resumeData.skills.map(
      (row) => `- ${row.area}: ${row.capabilities}`,
    ),
  ].join("\n");

  return buildDocument({
    id: "resume:overview",
    slug: "resume-overview",
    title: "Resume overview",
    sourceType: "resume",
    canonicalUrl: "/resume",
    priority: 1,
    topics: ["resume", "experience", "skills"],
    audiences: ["recruiter", "hiring-manager"],
    content,
  });
}

async function buildStaticPageDocuments() {
  const pages = await getAllStaticPages();

  return Promise.all(
    pages.map(async (page) => {
      const { source } = await getStaticPageBySlug(page.slug);
      const canonicalUrl =
        page.slug === "resume" ? "/resume" : `/${page.slug}`;

      return buildDocument({
        id: `page:${page.slug}`,
        slug: page.slug,
        title: page.title,
        sourceType: "page",
        canonicalUrl,
        priority: page.slug === "about" ? 1 : 2,
        topics:
          page.slug === "now"
            ? ["current-direction", "learning"]
            : ["background", "method", "portfolio"],
        audiences: ["recruiter", "hiring-manager", "technical-peer"],
        content: stripMdxArtifacts(source),
      });
    }),
  );
}

async function buildProjectDocuments() {
  const projects = await getAllProjects();

  return Promise.all(
    projects.map(async (project) => {
      const { source } = await getProjectBySlug(project.slug);
      return buildDocument({
        id: `project:${project.slug}`,
        slug: project.slug,
        title: project.title,
        sourceType: "project",
        canonicalUrl: `/work/${project.slug}`,
        priority: project.featured ? 1 : 2,
        topics: project.tags ?? ["project", "delivery"],
        audiences: ["recruiter", "hiring-manager", "technical-peer"],
        content: stripMdxArtifacts(source),
      });
    }),
  );
}

async function buildWritingDocuments() {
  const articles = await getAllArticles();

  return Promise.all(
    articles.map(async (article) => {
      const { source } = await getArticleBySlug(article.slug);
      return buildDocument({
        id: `writing:${article.slug}`,
        slug: article.slug,
        title: article.title,
        sourceType: "writing",
        canonicalUrl: `/thinking/${article.slug}`,
        priority: 2,
        topics: article.tags ?? ["writing", "systems"],
        audiences: ["technical-peer", "hiring-manager"],
        content: stripMdxArtifacts(source),
      });
    }),
  );
}

async function buildAssistantDocuments(): Promise<PublicCorpusDocument[]> {
  return walkMarkdownFiles(assistantContentDir)
    .map((filePath) => readAssistantDocument(filePath))
    .filter((document): document is PublicCorpusDocument => document !== null);
}

export async function buildPublicCorpus() {
  const documents = [
    buildProfileSummaryDocument(),
    buildResumeOverviewDocument(),
    ...(await buildStaticPageDocuments()),
    ...(await buildProjectDocuments()),
    ...(await buildWritingDocuments()),
    ...(await buildAssistantDocuments()),
  ].sort((a, b) => a.id.localeCompare(b.id));

  return {
    generatedAt: new Date().toISOString(),
    documents,
  } satisfies PublicCorpusBuild;
}

export function writePublicCorpusArtifacts(build: PublicCorpusBuild) {
  fs.mkdirSync(assistantFilesDir, { recursive: true });

  for (const existingFile of fs.readdirSync(assistantFilesDir)) {
    fs.unlinkSync(path.join(assistantFilesDir, existingFile));
  }

  for (const document of build.documents) {
    fs.writeFileSync(
      path.join(assistantFilesDir, document.filename),
      serializeDocument(document),
      "utf8",
    );
  }

  fs.mkdirSync(path.dirname(assistantCorpusJsonPath), { recursive: true });
  fs.writeFileSync(
    assistantCorpusJsonPath,
    `${JSON.stringify(build, null, 2)}\n`,
    "utf8",
  );
}

export function getResumeAssistantFiles() {
  return Object.entries(resumeRoleLabels).map(([role, label]) => ({
    role: role as ResumeRole,
    slug: resumeRoleMap[role as ResumeRole],
    label,
  }));
}
