"use client";

import type { FormEvent } from "react";
import { LoaderCircle, SendHorizontal, Sparkles, X } from "lucide-react";
import type { AssistantChatResponse } from "@/lib/ai/schema";
import { ChatMessage } from "@/components/ai/chat-message";
import { SuggestedPrompts } from "@/components/ai/suggested-prompts";

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

type ChatPanelProps = {
  isOpen: boolean;
  routeLabel: string;
  messages: UiMessage[];
  input: string;
  error: string | null;
  isPending: boolean;
  prompts: string[];
  onInputChange: (value: string) => void;
  onPromptSelect: (prompt: string) => void;
  onSubmit: () => void;
  onClose: () => void;
  onCitationClick: (citation: AssistantChatResponse["citations"][number]) => void;
};

function EmptyState({
  routeLabel,
  prompts,
  disabled,
  onPromptSelect,
}: {
  routeLabel: string;
  prompts: string[];
  disabled: boolean;
  onPromptSelect: (prompt: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--scaffold-line)] bg-[color-mix(in_oklab,var(--scaffold-surface)_88%,transparent)] px-3 py-1.5 text-[10px] tracking-[0.18em] text-[var(--scaffold-ruler)] [font-family:var(--font-geist-pixel-circle)]">
          <Sparkles className="h-3.5 w-3.5" />
          Public portfolio assistant
        </div>
        <div className="space-y-2">
          <h2
            id="portfolio-assistant-title"
            className="max-w-[24ch] text-[22px] leading-[1.25] text-[var(--scaffold-toggle-text-active)] md:text-[28px]"
          >
            Calm, grounded answers from the portfolio.
          </h2>
          <p className="max-w-[46ch] text-[14px] leading-7 text-[var(--scaffold-ruler)]">
            Ask about projects, methods, or professional fit. Answers stay within the public material behind this site.
          </p>
          <p className="text-[11px] tracking-[0.14em] text-[var(--scaffold-ruler)] [font-family:var(--font-geist-pixel-square)]">
            Context: {routeLabel}
          </p>
        </div>
      </div>

      <SuggestedPrompts
        prompts={prompts}
        disabled={disabled}
        onSelect={onPromptSelect}
      />
    </div>
  );
}

export function ChatPanel({
  isOpen,
  routeLabel,
  messages,
  input,
  error,
  isPending,
  prompts,
  onInputChange,
  onPromptSelect,
  onSubmit,
  onClose,
  onCitationClick,
}: ChatPanelProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        aria-label="Close portfolio assistant"
        onClick={onClose}
        className="fixed inset-0 z-[82] bg-[color-mix(in_oklab,var(--scaffold-bg)_38%,transparent)] backdrop-blur-md"
      />

      <section
        id="portfolio-assistant-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="portfolio-assistant-title"
        className="fixed left-1/2 top-1/2 z-[83] flex h-[min(82dvh,840px)] w-[min(52rem,calc(100vw-1.5rem))] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[28px] border border-[var(--scaffold-line)] bg-[color-mix(in_oklab,var(--scaffold-surface)_92%,var(--scaffold-bg))] shadow-[0_32px_100px_-42px_rgba(15,23,42,0.58)] backdrop-blur-xl"
      >
        <header className="flex items-start justify-between gap-4 border-b border-[var(--scaffold-line)] px-5 py-5 md:px-7 md:py-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--scaffold-line)] bg-[color-mix(in_oklab,var(--scaffold-surface)_88%,transparent)] px-3 py-1.5 text-[10px] tracking-[0.18em] text-[var(--scaffold-ruler)] [font-family:var(--font-geist-pixel-circle)]">
              <Sparkles className="h-3.5 w-3.5" />
              Ask about my work
            </div>
            <div className="space-y-1.5">
              <h2
                id="portfolio-assistant-title"
                className="text-[20px] leading-tight text-[var(--scaffold-toggle-text-active)] md:text-[24px]"
              >
                Calm, grounded answers from the portfolio
              </h2>
              <p className="text-[13px] leading-6 text-[var(--scaffold-ruler)]">
                Context: {routeLabel}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--scaffold-line)] text-[var(--scaffold-ruler)] transition-colors hover:text-[var(--scaffold-toggle-text-active)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--scaffold-ruler)]"
            aria-label="Close portfolio assistant"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 md:px-7 md:py-6">
          {messages.length === 0 ? (
            <EmptyState
              routeLabel={routeLabel}
              prompts={prompts}
              disabled={isPending}
              onPromptSelect={onPromptSelect}
            />
          ) : (
            <div className="space-y-4">
              {messages.map((message) =>
                message.role === "user" ? (
                  <ChatMessage
                    key={message.id}
                    role="user"
                    content={message.content}
                  />
                ) : (
                  <ChatMessage
                    key={message.id}
                    role="assistant"
                    response={message.response}
                    onCitationClick={onCitationClick}
                  />
                ),
              )}

              {isPending ? (
                <div className="flex justify-start">
                  <div className="inline-flex items-center gap-2 rounded-full border border-[var(--scaffold-line)] bg-[color-mix(in_oklab,var(--scaffold-surface)_90%,transparent)] px-3 py-2 text-[12px] text-[var(--scaffold-ruler)]">
                    <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                    Checking the portfolio corpus
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>

        <div className="space-y-4 border-t border-[var(--scaffold-line)] px-5 py-5 md:px-7 md:py-6">
          {error ? (
            <p className="text-[12px] leading-5 text-[var(--scaffold-ruler)]">
              {error}
            </p>
          ) : null}

          {messages.length > 0 && prompts.length > 0 ? (
            <SuggestedPrompts
              prompts={prompts}
              disabled={isPending}
              onSelect={onPromptSelect}
            />
          ) : null}

          <form className="space-y-3" onSubmit={handleSubmit}>
            <label className="sr-only" htmlFor="portfolio-assistant-input">
              Ask about Francisc&apos;s work
            </label>
            <div className="rounded-[24px] border border-[var(--scaffold-line)] bg-[color-mix(in_oklab,var(--scaffold-surface)_90%,transparent)] p-3">
              <textarea
                id="portfolio-assistant-input"
                rows={4}
                value={input}
                onChange={(event) => onInputChange(event.target.value)}
                placeholder="Ask about projects, methods, or professional fit."
                className="w-full resize-none bg-transparent px-2 py-1 text-[15px] leading-7 text-[var(--scaffold-toggle-text-active)] outline-none placeholder:text-[var(--scaffold-ruler)]"
              />
            </div>

            <div className="flex items-center justify-between gap-3">
              <p className="max-w-[24rem] text-[10px] leading-5 text-[var(--scaffold-ruler)] [font-family:var(--font-geist-pixel-square)]">
                Public material only. Unsupported questions get a narrow answer.
              </p>
              <button
                type="submit"
                disabled={isPending || input.trim().length === 0}
                className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[var(--scaffold-line)] bg-[color-mix(in_oklab,var(--scaffold-surface)_92%,transparent)] px-4 py-2.5 text-[10px] tracking-[0.16em] text-[var(--scaffold-toggle-text-active)] transition-colors hover:border-[var(--scaffold-ruler)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--scaffold-ruler)] disabled:cursor-not-allowed disabled:opacity-50 [font-family:var(--font-geist-pixel-circle)]"
              >
                <span>ASK</span>
                <SendHorizontal className="h-3.5 w-3.5" />
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
