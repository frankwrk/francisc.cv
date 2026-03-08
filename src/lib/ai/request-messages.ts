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

  return [
    previousUserIndex >= 0 ? toRequestMessage(messages[previousUserIndex]) : null,
    previousAssistantIndex >= 0
      ? toRequestMessage(messages[previousAssistantIndex])
      : null,
    toRequestMessage(messages[latestUserIndex]),
  ].filter((message): message is AssistantChatRequest["messages"][number] => message !== null);
}
