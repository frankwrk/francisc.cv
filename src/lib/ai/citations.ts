import type { ResponseOutputItem } from "openai/resources/responses/responses";
import type {
  AssistantVectorStoreManifest,
  AssistantVectorStoreManifestFile,
} from "@/lib/ai/types";
import type { AssistantCitation } from "@/lib/ai/schema";

type CitationState = {
  citations: AssistantCitation[];
  resultCount: number;
  topScore: number;
};

type ResponseWithOutput = {
  output: ResponseOutputItem[];
};

function dedupeCitations(
  entries: AssistantVectorStoreManifestFile[],
): AssistantCitation[] {
  const seen = new Set<string>();
  const citations: AssistantCitation[] = [];

  for (const entry of entries) {
    const key = `${entry.sourceType}:${entry.canonicalUrl}`;
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    citations.push({
      title: entry.title,
      canonicalUrl: entry.canonicalUrl,
      sourceType: entry.sourceType,
    });
  }

  return citations;
}

function getManifestEntry(
  manifest: AssistantVectorStoreManifest | null,
  fileId: string | null | undefined,
  filename?: string | null,
) {
  if (!manifest) {
    return null;
  }

  if (fileId) {
    const byFileId = manifest.files.find((entry) => entry.fileId === fileId);
    if (byFileId) {
      return byFileId;
    }
  }

  if (!filename) {
    return null;
  }

  return manifest.files.find((entry) => entry.filename === filename) ?? null;
}

export function extractCitationState(
  response: ResponseWithOutput,
  manifest: AssistantVectorStoreManifest | null,
) {
  const manifestEntries: AssistantVectorStoreManifestFile[] = [];
  let topScore = 0;
  let resultCount = 0;

  for (const item of response.output) {
    if (item.type === "file_search_call") {
      for (const result of item.results ?? []) {
        resultCount += 1;
        if (typeof result.score === "number") {
          topScore = Math.max(topScore, result.score);
        }

        const entry = getManifestEntry(manifest, result.file_id, result.filename);
        if (entry) {
          manifestEntries.push(entry);
        }
      }

      continue;
    }

    if (item.type !== "message") {
      continue;
    }

    for (const content of item.content) {
      if (content.type !== "output_text") {
        continue;
      }

      for (const annotation of content.annotations) {
        if (
          annotation.type === "file_citation" ||
          annotation.type === "container_file_citation"
        ) {
          const entry = getManifestEntry(
            manifest,
            annotation.file_id,
            annotation.filename,
          );
          if (entry) {
            manifestEntries.push(entry);
          }
        }
      }
    }
  }

  return {
    citations: dedupeCitations(manifestEntries).slice(0, 4),
    resultCount,
    topScore,
  } satisfies CitationState;
}
