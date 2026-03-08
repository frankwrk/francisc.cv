export type AssistantRouteType =
  | "home"
  | "about"
  | "now"
  | "resume"
  | "work-index"
  | "work-detail"
  | "thinking-index"
  | "thinking-detail"
  | "other";

export type AssistantRouteContext = {
  pathname: string;
  title?: string;
  routeType: AssistantRouteType;
  slug?: string;
};

export type PublicCorpusSourceType =
  | "page"
  | "project"
  | "writing"
  | "resume"
  | "profile"
  | "positioning"
  | "faq";

export type PublicCorpusDocument = {
  id: string;
  slug: string;
  title: string;
  sourceType: PublicCorpusSourceType;
  canonicalUrl: string;
  priority: number;
  topics: string[];
  audiences: string[];
  excerpt: string;
  content: string;
  filename: string;
  attributes: Record<string, string | number | boolean>;
};

export type PublicCorpusBuild = {
  generatedAt: string;
  documents: PublicCorpusDocument[];
};

export type AssistantVectorStoreManifestFile = {
  id: string;
  title: string;
  sourceType: PublicCorpusSourceType;
  canonicalUrl: string;
  filename: string;
  fileId: string;
  attributes: Record<string, string | number | boolean>;
};

export type AssistantVectorStoreManifest = {
  generatedAt: string;
  vectorStoreId: string;
  files: AssistantVectorStoreManifestFile[];
};
