"use client";

import { useEffect } from "react";
import { ChatPanel } from "@/components/ai/chat-panel";
import { useAssistant } from "@/components/ai/assistant-context";

export function AssistantShell() {
  const {
    isOpen,
    messages,
    input,
    error,
    isPending,
    prompts,
    closeAssistant,
    setInput,
    submitQuestion,
    trackPromptClick,
    trackCitationClick,
  } = useAssistant();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeAssistant();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeAssistant, isOpen]);

  function handlePromptSelect(prompt: string) {
    trackPromptClick(prompt);
    void submitQuestion(prompt, "prompt");
  }

  return (
    <ChatPanel
      isOpen={isOpen}
      messages={messages}
      input={input}
      error={error}
      isPending={isPending}
      prompts={prompts}
      onInputChange={setInput}
      onPromptSelect={handlePromptSelect}
      onSubmit={() => void submitQuestion()}
      onClose={closeAssistant}
      onCitationClick={trackCitationClick}
    />
  );
}
