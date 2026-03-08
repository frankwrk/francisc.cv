import OpenAI from "openai";
import { readAssistantVectorStoreManifest } from "@/lib/ai/sources";

let client: OpenAI | null = null;

function isEnabled(value: string | undefined, fallback = false) {
  if (value == null) {
    return fallback;
  }

  const normalized = value.trim().toLowerCase();
  return normalized === "1" || normalized === "true" || normalized === "yes";
}

export function getOpenAIClient() {
  if (client) {
    return client;
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  client = new OpenAI({
    apiKey,
    project: process.env.OPENAI_PROJECT_ID,
  });

  return client;
}

export function getResponsesModel() {
  return process.env.OPENAI_RESPONSES_MODEL ?? "gpt-5-mini";
}

export function getAssistantEnvironmentLabel() {
  return process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "development";
}

export function getResponsesStoreEnabled() {
  return isEnabled(
    process.env.OPENAI_RESPONSES_STORE,
    getAssistantEnvironmentLabel() === "development",
  );
}

export function getAssistantContentLoggingEnabled() {
  return isEnabled(
    process.env.ASSISTANT_LOG_CONTENT,
    getAssistantEnvironmentLabel() === "development",
  );
}

export function getAssistantVectorStoreId() {
  const manifest = readAssistantVectorStoreManifest();
  return process.env.OPENAI_VECTOR_STORE_ID ?? manifest?.vectorStoreId ?? null;
}
