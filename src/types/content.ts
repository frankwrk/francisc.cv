export type LinkMap = {
  github?: string;
  live?: string;
  doc?: string;
};

export type ProjectFrontmatter = {
  title: string;
  description: string;
  role: string;
  tags: string[];
  stack: string[];
  outcomes: string[];
  links?: LinkMap;
  featured?: boolean;
  order?: number;
};

export type WritingFrontmatter = {
  title: string;
  description: string;
  date: string;
  tags: string[];
  takeaways?: string[];
};

export type PageFrontmatter = {
  title: string;
  description: string;
};

export type Heading = {
  id: string;
  text: string;
  level: 2 | 3;
};

export type ProjectEntry = ProjectFrontmatter & {
  slug: string;
  raw: string;
  headings: Heading[];
};

export type WritingEntry = WritingFrontmatter & {
  slug: string;
  raw: string;
  readingTime: number;
  headings: Heading[];
};

export type PageEntry = PageFrontmatter & {
  slug: string;
  raw: string;
};

export type SearchEntry = {
  id: string;
  kind: "Page" | "Project" | "Writing";
  title: string;
  description: string;
  href: string;
  tags?: string[];
};
