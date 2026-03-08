import fs from "node:fs";
import path from "node:path";
import type {
  AssistantVectorStoreManifest,
  PublicCorpusBuild,
} from "@/lib/ai/types";

export const assistantDataDir = path.join(process.cwd(), "data/assistant");
export const assistantFilesDir = path.join(assistantDataDir, "files");
export const assistantCorpusJsonPath = path.join(
  assistantDataDir,
  "public-corpus.json",
);
export const assistantVectorStoreManifestPath = path.join(
  assistantDataDir,
  "vector-store-manifest.json",
);

function readJsonFile<T>(filePath: string) {
  if (!fs.existsSync(filePath)) {
    return null;
  }

  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

export function readPublicCorpusBuild() {
  return readJsonFile<PublicCorpusBuild>(assistantCorpusJsonPath);
}

export function readAssistantVectorStoreManifest() {
  return readJsonFile<AssistantVectorStoreManifest>(
    assistantVectorStoreManifestPath,
  );
}
