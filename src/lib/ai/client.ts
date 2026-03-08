import OpenAI from "openai";
import { readAssistantVectorStoreManifest } from "@/lib/ai/sources";

let client: OpenAI | null = null;

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

export function getAssistantVectorStoreId() {
  const manifest = readAssistantVectorStoreManifest();
  return process.env.OPENAI_VECTOR_STORE_ID ?? manifest?.vectorStoreId ?? null;
}
