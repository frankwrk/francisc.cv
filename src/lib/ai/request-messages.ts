import type { AssistantChatRequest } from "@/lib/ai/schema";

type UiMessage =
  | {
      role: "user";
      content: string;
    }
  | {
      role: "assistant";
      response: {
        answer: string;
      };
    };

export type AssistantInteractionSource = "prompt" | "typed";

function toRequestMessage(message: UiMessage): AssistantChatRequest["messages"][number] {
  return message.role === "user"
    ? { role: "user", content: message.content }
    : { role: "assistant", content: message.response.answer };
}

function extractTrailingQuestion(answer: string) {
  const normalized = answer.replace(/\r\n/g, "\n").trim();
  const paragraphs = normalized
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  const lastParagraph = paragraphs.at(-1);

  if (!lastParagraph || !lastParagraph.endsWith("?")) {
    return null;
  }

  return lastParagraph;
}

function isShortAffirmation(value: string) {
  const normalized = value.trim().toLowerCase();

  return [
    "yes",
    "yeah",
    "yep",
    "sure",
    "ok",
    "okay",
    "please do",
    "go ahead",
    "sounds good",
  ].includes(normalized);
}

function rewriteContinuationReply(
  latestUserMessage: UiMessage & { role: "user" },
  previousAssistantMessage: Extract<UiMessage, { role: "assistant" }> | null,
) {
  if (!previousAssistantMessage || !isShortAffirmation(latestUserMessage.content)) {
    return latestUserMessage.content;
  }

  const previousQuestion = extractTrailingQuestion(
    previousAssistantMessage.response.answer,
  );

  if (!previousQuestion) {
    return latestUserMessage.content;
  }

  return `Yes. Continue with the follow-up I agreed to. The previous assistant follow-up question was: "${previousQuestion}"`;
}

function findLastIndex<T>(
  items: T[],
  predicate: (item: T) => boolean,
  fromIndex = items.length - 1,
) {
  for (let index = fromIndex; index >= 0; index -= 1) {
    if (predicate(items[index])) {
      return index;
    }
  }

  return -1;
}

export function buildAssistantRequestMessages(
  messages: UiMessage[],
  interactionSource: AssistantInteractionSource,
) {
  const latestUserIndex = findLastIndex(messages, (message) => message.role === "user");

  if (latestUserIndex === -1) {
    return [];
  }

  if (interactionSource === "prompt") {
    return [toRequestMessage(messages[latestUserIndex])];
  }

  const previousAssistantIndex = findLastIndex(
    messages,
    (message) => message.role === "assistant",
    latestUserIndex - 1,
  );
  const previousUserIndex =
    previousAssistantIndex === -1
      ? -1
      : findLastIndex(
          messages,
          (message) => message.role === "user",
          previousAssistantIndex - 1,
        );
  const latestUserMessage = messages[latestUserIndex];
  const previousAssistantMessage =
    previousAssistantIndex >= 0 && messages[previousAssistantIndex]?.role === "assistant"
      ? messages[previousAssistantIndex]
      : null;
  const latestRequestMessage: AssistantChatRequest["messages"][number] = {
    role: "user",
    content: rewriteContinuationReply(
      latestUserMessage as UiMessage & { role: "user" },
      previousAssistantMessage,
    ),
  };

  return [
    previousUserIndex >= 0 ? toRequestMessage(messages[previousUserIndex]) : null,
    previousAssistantMessage ? toRequestMessage(previousAssistantMessage) : null,
    latestRequestMessage,
  ].filter((message): message is AssistantChatRequest["messages"][number] => message !== null);
}
