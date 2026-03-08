import fs from "node:fs";
import path from "node:path";
import {
  buildPublicCorpus,
  writePublicCorpusArtifacts,
} from "@/lib/ai/build-public-corpus";
import { getOpenAIClient } from "@/lib/ai/client";
import {
  assistantFilesDir,
  assistantVectorStoreManifestPath,
  readAssistantVectorStoreManifest,
} from "@/lib/ai/sources";
import type { AssistantVectorStoreManifest } from "@/lib/ai/types";

async function ensureCorpusFiles() {
  if (fs.existsSync(assistantFilesDir)) {
    const existing = fs.readdirSync(assistantFilesDir).filter((file) =>
      file.endsWith(".md"),
    );

    if (existing.length > 0) {
      return;
    }
  }

  const build = await buildPublicCorpus();
  writePublicCorpusArtifacts(build);
}

async function resolveVectorStoreId() {
  const client = getOpenAIClient();
  const existing = process.env.OPENAI_VECTOR_STORE_ID
    ?? readAssistantVectorStoreManifest()?.vectorStoreId;

  if (existing) {
    return existing;
  }

  const created = await client.vectorStores.create({
    name: "francisc.cv portfolio assistant",
    description: "Public portfolio corpus for the francisc.cv assistant.",
    expires_after: {
      anchor: "last_active_at",
      days: 30,
    },
  });

  return created.id;
}

async function deletePreviousFiles() {
  const client = getOpenAIClient();
  const manifest = readAssistantVectorStoreManifest();

  if (!manifest) {
    return;
  }

  for (const entry of manifest.files) {
    try {
      await client.files.delete(entry.fileId);
    } catch (error) {
      console.warn(`Skipping cleanup for ${entry.fileId}.`);
      console.warn(error);
    }
  }
}

async function main() {
  await ensureCorpusFiles();
  await deletePreviousFiles();

  const client = getOpenAIClient();
  const vectorStoreId = await resolveVectorStoreId();
  const files = fs
    .readdirSync(assistantFilesDir)
    .filter((file) => file.endsWith(".md"))
    .sort();

  const uploadedFiles = [];

  for (const filename of files) {
    const upload = await client.files.create({
      file: fs.createReadStream(path.join(assistantFilesDir, filename)),
      purpose: "user_data",
    });

    uploadedFiles.push({ filename, fileId: upload.id });
  }

  const corpus = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "data/assistant/public-corpus.json"), "utf8"),
  ) as { documents: Array<{ filename: string; attributes: Record<string, string | number | boolean>; id: string; title: string; sourceType: string; canonicalUrl: string }> };

  const docsByFilename = new Map(
    corpus.documents.map((document) => [document.filename, document]),
  );

  await client.vectorStores.fileBatches.createAndPoll(vectorStoreId, {
    files: uploadedFiles.map((upload) => {
      const document = docsByFilename.get(upload.filename);

      if (!document) {
        throw new Error(`Missing corpus document metadata for ${upload.filename}.`);
      }

      return {
        file_id: upload.fileId,
        attributes: document.attributes,
        chunking_strategy: {
          type: "static",
          static: {
            max_chunk_size_tokens: 1000,
            chunk_overlap_tokens: 200,
          },
        },
      };
    }),
  });

  const manifest: AssistantVectorStoreManifest = {
    generatedAt: new Date().toISOString(),
    vectorStoreId,
    files: uploadedFiles.map((upload) => {
      const document = docsByFilename.get(upload.filename);

      if (!document) {
        throw new Error(`Missing manifest metadata for ${upload.filename}.`);
      }

      return {
        id: document.id,
        title: document.title,
        sourceType: document.sourceType as AssistantVectorStoreManifest["files"][number]["sourceType"],
        canonicalUrl: document.canonicalUrl,
        filename: upload.filename,
        fileId: upload.fileId,
        attributes: document.attributes,
      };
    }),
  };

  fs.writeFileSync(
    assistantVectorStoreManifestPath,
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf8",
  );

  console.log(`Uploaded ${uploadedFiles.length} assistant corpus files.`);
  console.log(`Vector store ID: ${vectorStoreId}`);
}

main().catch((error) => {
  console.error("Failed to upload assistant corpus.");
  console.error(error);
  process.exitCode = 1;
});
