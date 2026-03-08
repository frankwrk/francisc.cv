"use client";

import { useEffect, useRef, type FormEvent } from "react";
import { LoaderCircle, SendHorizontal, X } from "lucide-react";
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
  prompts,
  disabled,
  onPromptSelect,
}: {
  prompts: string[];
  disabled: boolean;
  onPromptSelect: (prompt: string) => void;
}) {
  return (
    <div className="flex h-full items-center justify-center px-2">
      <div className="max-w-[32rem]">
        <SuggestedPrompts
          prompts={prompts}
          disabled={disabled}
          onSelect={onPromptSelect}
        />
      </div>
    </div>
  );
}

export function ChatPanel({
  isOpen,
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
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const messagesViewportRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const showPromptChips = messages.length === 0 && input.trim().length === 0;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  function handleTextareaKeyDown(
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) {
    if (event.key !== "Enter" || event.shiftKey) {
      return;
    }

    event.preventDefault();
    if (isPending || input.trim().length === 0) {
      return;
    }

    onSubmit();
  }

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) {
      return;
    }

    textarea.style.height = "0px";
    const nextHeight = Math.min(textarea.scrollHeight, 144);
    textarea.style.height = `${nextHeight}px`;
  }, [input, isOpen]);

  useEffect(() => {
    if (!isOpen || showPromptChips) {
      return;
    }

    const viewport = messagesViewportRef.current;
    const end = messagesEndRef.current;
    if (!viewport || !end) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      end.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [isOpen, isPending, messages.length, showPromptChips]);

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
        aria-label="Ask about my work"
        className="fixed left-1/2 top-1/2 z-[83] flex h-[min(82dvh,840px)] w-[min(42rem,calc(100vw-1rem))] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[30px] bg-[color-mix(in_oklab,var(--scaffold-surface)_86%,var(--scaffold-bg))] shadow-[0_42px_110px_-40px_rgba(0,0,0,0.34)]"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-[84] inline-flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-sm transition-colors focus-visible:outline-none focus-visible:ring-2"
          style={{
            background:
              "color-mix(in oklab, var(--scaffold-surface) 72%, transparent)",
            color:
              "color-mix(in oklab, var(--scaffold-ruler) 78%, transparent)",
            boxShadow: "0 8px 20px -16px rgba(0, 0, 0, 0.22)",
          }}
          aria-label="Close portfolio assistant"
        >
          <X className="h-4 w-4" />
        </button>

        <div
          ref={messagesViewportRef}
          className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 pt-14 md:px-5 md:pb-5 md:pt-16"
        >
          {showPromptChips ? (
            <EmptyState
              prompts={prompts}
              disabled={isPending}
              onPromptSelect={onPromptSelect}
            />
          ) : messages.length > 0 ? (
            <div className="space-y-2.5">
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
                  <div
                    className="inline-flex items-center gap-2 rounded-full px-3 py-2 font-[var(--font-geist-sans)] text-[14px] font-normal leading-5"
                    style={{
                      background:
                        "color-mix(in oklab, var(--scaffold-surface) 84%, var(--scaffold-bg))",
                      color:
                        "color-mix(in oklab, var(--scaffold-ruler) 90%, transparent)",
                    }}
                  >
                    <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                    Checking the portfolio corpus
                  </div>
                </div>
              ) : null}

              <div ref={messagesEndRef} aria-hidden="true" />
            </div>
          ) : null}
        </div>

        <div
          className="space-y-3 px-4 py-4 md:px-5 md:py-5"
          style={{
            background:
              "linear-gradient(to top, color-mix(in oklab, var(--scaffold-bg) 96%, var(--scaffold-surface)) 0%, color-mix(in oklab, var(--scaffold-bg) 68%, transparent) 30%, color-mix(in oklab, var(--scaffold-bg) 28%, transparent) 56%, transparent 100%)",
          }}
        >
          {error ? (
            <p className="px-1 font-[var(--font-geist-sans)] text-[12px] leading-5 text-[var(--scaffold-ruler)]">
              {error}
            </p>
          ) : null}

          <form
            className="rounded-[30px] border p-3"
            onSubmit={handleSubmit}
            style={{
              background:
                "color-mix(in oklab, var(--scaffold-surface) 92%, var(--scaffold-bg))",
              borderColor:
                "color-mix(in oklab, var(--scaffold-line) 72%, transparent)",
            }}
          >
            <label className="sr-only" htmlFor="portfolio-assistant-input">
              Ask about Francisc&apos;s work
            </label>
            <div className="space-y-3">
              <div className="min-w-0 rounded-[24px]">
                <textarea
                  ref={textareaRef}
                  id="portfolio-assistant-input"
                  rows={1}
                  value={input}
                  onChange={(event) => onInputChange(event.target.value)}
                  onKeyDown={handleTextareaKeyDown}
                  placeholder="Ask about projects, methods, or professional fit."
                  className="max-h-36 w-full resize-none overflow-y-auto bg-transparent px-2 py-1 font-[var(--font-geist-sans)] text-[14px] font-normal leading-5 text-[var(--scaffold-toggle-text-active)] outline-none placeholder:text-[var(--scaffold-ruler)]"
                />
              </div>
              <div className="flex items-end justify-between gap-3">
                <p className="min-w-0 flex-1 px-2 font-[var(--font-geist-sans)] text-[11px] leading-4 text-[var(--scaffold-ruler)]">
                  Grounded in the available source material. Out-of-scope questions may receive a limited answer.
                </p>
                <button
                  type="submit"
                  disabled={isPending || input.trim().length === 0}
                  className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#016CFF] px-4 py-2.5 font-[var(--font-geist-sans)] text-[14px] font-normal leading-5 text-white shadow-[0_18px_34px_-20px_rgba(1,108,255,0.95)] transition-[transform,background-color,box-shadow] duration-150 hover:bg-[#1978ff] hover:shadow-[0_22px_36px_-20px_rgba(1,108,255,1)] active:translate-y-[1px] active:scale-[0.985] active:bg-[#015fe0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 disabled:cursor-not-allowed disabled:bg-[#0147ab] disabled:text-white/60 disabled:shadow-none"
                >
                  <span>Send</span>
                  <SendHorizontal className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
