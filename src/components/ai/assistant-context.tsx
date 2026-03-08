"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { track } from "@vercel/analytics";
import {
  type AssistantChatRequest,
  type AssistantChatResponse,
} from "@/lib/ai/schema";
import {
  getSuggestedQuestions,
  resolveAssistantRouteContext,
} from "@/lib/ai/suggestions";
import { parseAssistantResponse } from "@/lib/ai/assistant-http";
import { useMachineMode } from "@/components/machine/machine-mode-controller";
import { createId } from "@/utils/create-id";

type UiMessage =
  | {
      id: string;
      role: "user";
      content: string;
    }
  | {
      id: string;
      role: "assistant";
      response: AssistantChatResponse;
    };

type AssistantContextValue = {
  isOpen: boolean;
  pathname: string;
  routeLabel: string;
  messages: UiMessage[];
  input: string;
  error: string | null;
  isPending: boolean;
  prompts: string[];
  openAssistant: () => void;
  closeAssistant: () => void;
  setInput: (value: string) => void;
  submitQuestion: (rawQuestion?: string) => Promise<void>;
  trackPromptClick: (prompt: string) => void;
  trackCitationClick: (
    citation: AssistantChatResponse["citations"][number],
  ) => void;
};

const AssistantContext = createContext<AssistantContextValue | null>(null);

const SESSION_STORAGE_KEY = "portfolio-assistant-session";

function getRouteLabel(pathname: string) {
  const context = resolveAssistantRouteContext(pathname);

  switch (context.routeType) {
    case "home":
      return "Home";
    case "about":
      return "About";
    case "now":
      return "Now";
    case "resume":
      return "Resume";
    case "work-index":
      return "Work";
    case "work-detail":
      return "Work detail";
    case "thinking-index":
      return "Thinking";
    case "thinking-detail":
      return "Thinking detail";
    default:
      return "Portfolio";
  }
}

function serialiseMessages(messages: UiMessage[]) {
  return JSON.stringify(messages);
}

function hydrateMessages(value: string | null): UiMessage[] {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as UiMessage[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function buildRequestMessages(messages: UiMessage[]): AssistantChatRequest["messages"] {
  return messages.map((message) =>
    message.role === "user"
      ? { role: "user", content: message.content }
      : { role: "assistant", content: message.response.answer },
  );
}

export function AssistantProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { displayMode } = useMachineMode();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<UiMessage[]>([]);
  const [input, setInput] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");

  const routeContext = useMemo(
    () => resolveAssistantRouteContext(pathname, title),
    [pathname, title],
  );
  const routeLabel = useMemo(() => getRouteLabel(pathname), [pathname]);
  const prompts = useMemo(() => {
    const lastAssistant = [...messages]
      .reverse()
      .find((message) => message.role === "assistant");

    return lastAssistant?.role === "assistant"
      ? lastAssistant.response.suggestedQuestions
      : getSuggestedQuestions(routeContext);
  }, [messages, routeContext]);

  useEffect(() => {
    setTitle(document.title);
  }, [pathname]);

  useEffect(() => {
    const stored = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
    setMessages(hydrateMessages(stored));
  }, []);

  useEffect(() => {
    window.sessionStorage.setItem(
      SESSION_STORAGE_KEY,
      serialiseMessages(messages),
    );
  }, [messages]);

  useEffect(() => {
    if (displayMode === "machine") {
      setIsOpen(false);
    }
  }, [displayMode]);

  async function submitQuestion(rawQuestion?: string) {
    const question = (rawQuestion ?? input).trim();
    if (!question || isPending) {
      return;
    }

    const userMessage: UiMessage = {
      id: createId(),
      role: "user",
      content: question,
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setError(null);
    setIsPending(true);
    setIsOpen(true);
    track("assistant_message_sent", {
      pathname,
      routeType: routeContext.routeType,
    });

    try {
      const response = await fetch("/api/assistant/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: buildRequestMessages(nextMessages),
          context: {
            pathname,
            title: document.title,
          },
        } satisfies AssistantChatRequest),
      });

      const json = await parseAssistantResponse(response);

      if (!response.ok || !("answer" in json)) {
        const failureMessage =
          "message" in json && typeof json.message === "string"
            ? json.message
            : "The assistant could not answer right now.";
        throw new Error(failureMessage);
      }

      setMessages((current) => [
        ...current,
        {
          id: json.requestId,
          role: "assistant",
          response: json,
        },
      ]);
      track("assistant_answer_received", {
        pathname,
        routeType: routeContext.routeType,
        supportLevel: json.supportLevel,
        citationCount: json.citations.length,
      });
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "The assistant could not answer right now.",
      );
    } finally {
      setIsPending(false);
    }
  }

  function openAssistant() {
    setIsOpen(true);
    track("assistant_opened", {
      pathname,
      routeType: routeContext.routeType,
    });
  }

  function closeAssistant() {
    setIsOpen(false);
  }

  function trackPromptClick(prompt: string) {
    track("assistant_prompt_clicked", {
      pathname,
      routeType: routeContext.routeType,
      prompt,
    });
  }

  function trackCitationClick(
    citation: AssistantChatResponse["citations"][number],
  ) {
    track("assistant_source_clicked", {
      pathname,
      routeType: routeContext.routeType,
      sourceType: citation.sourceType,
      canonicalUrl: citation.canonicalUrl,
    });
  }

  const value: AssistantContextValue = {
    isOpen: isOpen && displayMode !== "machine",
    pathname,
    routeLabel,
    messages,
    input,
    error,
    isPending,
    prompts,
    openAssistant,
    closeAssistant,
    setInput,
    submitQuestion,
    trackPromptClick,
    trackCitationClick,
  };

  return (
    <AssistantContext.Provider value={value}>
      {children}
    </AssistantContext.Provider>
  );
}

export function useAssistant() {
  const value = useContext(AssistantContext);

  if (!value) {
    throw new Error("useAssistant must be used within AssistantProvider");
  }

  return value;
}
