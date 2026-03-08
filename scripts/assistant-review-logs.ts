import { readFile } from "node:fs/promises";

type AssistantLogRecord = {
  scope?: string;
  level?: string;
  event?: string;
  requestId?: string;
  pathname?: string;
  latencyMs?: number | null;
  interactionSource?: "prompt" | "typed" | string | null;
  supportLevel?: "grounded" | "partial" | "insufficient" | string | null;
  userQuestionPreview?: string | null;
  answerPreview?: string | null;
  caveatPreview?: string | null;
  citationTitles?: string[] | null;
  inputTokens?: number | null;
  cachedInputTokens?: number | null;
  outputTokens?: number | null;
  reasoningTokens?: number | null;
  totalTokens?: number | null;
  failureStage?: string | null;
  message?: string | null;
};

type CountEntry = [label: string, count: number];

function incrementCount(map: Map<string, number>, key: string | null | undefined) {
  if (!key) {
    return;
  }

  map.set(key, (map.get(key) ?? 0) + 1);
}

function average(values: number[]) {
  if (values.length === 0) {
    return null;
  }

  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function sum(values: number[]) {
  return values.reduce((total, value) => total + value, 0);
}

function sortCounts(map: Map<string, number>) {
  return [...map.entries()].sort((left, right) => right[1] - left[1]);
}

function printSection(title: string, entries: CountEntry[], limit = 5) {
  console.log(`\n${title}`);

  if (entries.length === 0) {
    console.log("  none");
    return;
  }

  for (const [label, count] of entries.slice(0, limit)) {
    console.log(`  ${count}  ${label}`);
  }
}

async function readInput(pathArg?: string) {
  if (pathArg) {
    return await readFile(pathArg, "utf8");
  }

  let rawText = "";

  for await (const chunk of process.stdin) {
    rawText += chunk;
  }

  return rawText;
}

function parseAssistantLogs(rawText: string) {
  const parsed: AssistantLogRecord[] = [];
  const lines = rawText.split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed.startsWith("{")) {
      continue;
    }

    try {
      const candidate = JSON.parse(trimmed) as AssistantLogRecord;

      if (candidate.scope === "portfolio-assistant") {
        parsed.push(candidate);
      }
    } catch {
      // Ignore non-JSON or mixed log lines.
    }
  }

  return parsed;
}

async function main() {
  const pathArg = process.argv[2];
  const rawText = await readInput(pathArg);
  const records = parseAssistantLogs(rawText);

  if (records.length === 0) {
    console.error(
      "No portfolio assistant JSON logs found. Pass a log file path or pipe newline-delimited logs into stdin.",
    );
    process.exitCode = 1;
    return;
  }

  const answered = records.filter((record) => record.event === "assistant_answered");
  const failed = records.filter((record) => record.event === "assistant_failed");
  const promptCounts = new Map<string, number>();
  const weakPromptCounts = new Map<string, number>();
  const continuationCounts = new Map<string, number>();
  const repeatedAnswerCounts = new Map<string, number>();
  const supportCounts = new Map<string, number>();
  const failureCounts = new Map<string, number>();
  const latencyValues: number[] = [];
  const tokenTotals: number[] = [];
  const inputTokenTotals: number[] = [];
  const outputTokenTotals: number[] = [];

  for (const record of answered) {
    incrementCount(supportCounts, record.supportLevel ?? "unknown");

    if (typeof record.latencyMs === "number") {
      latencyValues.push(record.latencyMs);
    }

    if (typeof record.totalTokens === "number") {
      tokenTotals.push(record.totalTokens);
    }

    if (typeof record.inputTokens === "number") {
      inputTokenTotals.push(record.inputTokens);
    }

    if (typeof record.outputTokens === "number") {
      outputTokenTotals.push(record.outputTokens);
    }

    if (record.interactionSource === "prompt") {
      incrementCount(promptCounts, record.userQuestionPreview);
    }

    if (record.supportLevel === "insufficient") {
      incrementCount(weakPromptCounts, record.userQuestionPreview);
    }

    if (
      record.interactionSource === "typed" &&
      record.userQuestionPreview?.includes(
        "Continue with the follow-up I agreed to.",
      )
    ) {
      incrementCount(continuationCounts, record.userQuestionPreview);
      incrementCount(repeatedAnswerCounts, record.answerPreview);
    }
  }

  for (const record of failed) {
    incrementCount(
      failureCounts,
      record.failureStage ?? record.message ?? "unknown failure",
    );
  }

  console.log("Portfolio Assistant Weekly Log Review");
  console.log(`Records parsed: ${records.length}`);
  console.log(`Answered: ${answered.length}`);
  console.log(`Failed: ${failed.length}`);
  console.log(
    `Average latency: ${average(latencyValues) ?? "n/a"} ms`,
  );
  console.log(
    `Average tokens: ${average(tokenTotals) ?? "n/a"} total / ${average(inputTokenTotals) ?? "n/a"} input / ${average(outputTokenTotals) ?? "n/a"} output`,
  );
  console.log(
    `Token totals: ${sum(tokenTotals)} total / ${sum(inputTokenTotals)} input / ${sum(outputTokenTotals)} output`,
  );

  printSection("Support levels", sortCounts(supportCounts), 10);
  printSection("Top prompt-chip questions", sortCounts(promptCounts), 10);
  printSection("Weak-support prompts", sortCounts(weakPromptCounts), 10);
  printSection("Repeated continuation replies", sortCounts(continuationCounts), 10);
  printSection("Repeated answers to continuation replies", sortCounts(repeatedAnswerCounts), 10);
  printSection("Failure stages", sortCounts(failureCounts), 10);
}

main().catch((error) => {
  console.error("Failed to review assistant logs.");
  console.error(error);
  process.exitCode = 1;
});
