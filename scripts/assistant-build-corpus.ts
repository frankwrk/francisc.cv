import { buildPublicCorpus, writePublicCorpusArtifacts } from "@/lib/ai/build-public-corpus";

async function main() {
  const build = await buildPublicCorpus();
  writePublicCorpusArtifacts(build);

  console.log(
    `Built assistant corpus with ${build.documents.length} documents at ${build.generatedAt}.`,
  );
}

main().catch((error) => {
  console.error("Failed to build assistant corpus.");
  console.error(error);
  process.exitCode = 1;
});
