"use client";

import Link from "next/link";
import type { AssistantChatResponse } from "@/lib/ai/schema";
import { cn } from "@/utils/cn";

type UserMessageProps = {
  role: "user";
  content: string;
};

type AssistantMessageProps = {
  role: "assistant";
  response: AssistantChatResponse;
  onCitationClick?: (citation: AssistantChatResponse["citations"][number]) => void;
};

type ChatMessageProps = UserMessageProps | AssistantMessageProps;

function formatAssistantAnswer(answer: string) {
  return answer
    .replace(/\r\n/g, "\n")
    .replace(/\s+-\s+(?=[A-Z])/g, "\n\n")
    .replace(/\s+Caveat:\s+/g, "\n\nCaveat: ")
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export function ChatMessage(props: ChatMessageProps) {
  if (props.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[78%] rounded-[22px] bg-[#016CFF] px-4 py-3 font-[var(--font-geist-sans)] text-[14px] font-normal leading-5 text-white shadow-[0_14px_28px_-20px_rgba(1,108,255,0.9)]">
          {props.content}
        </div>
      </div>
    );
  }

  const { response, onCitationClick } = props;
  const answerParagraphs = formatAssistantAnswer(response.answer);

  return (
    <div className="flex justify-start">
      <div className="max-w-[74%] space-y-2 md:max-w-[72%]">
        <div className="rounded-[22px] bg-[#262729] px-4 py-3 font-[var(--font-geist-sans)] text-[14px] font-normal leading-5 text-white shadow-[0_18px_36px_-28px_rgba(0,0,0,0.88)]">
          <div className="space-y-3">
            {answerParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          {response.caveat && response.supportLevel === "insufficient" ? (
            <p className="mt-3 text-[12px] leading-5 text-[color-mix(in_oklab,var(--scaffold-ruler)_88%,transparent)]">
              {response.caveat}
            </p>
          ) : null}
        </div>

        <div className="space-y-1.5 px-1">
          {response.citations.length > 0 ? (
            <div className="space-y-1.5">
              <p className="text-[10px] leading-4 tracking-[0.08em] text-[color-mix(in_oklab,var(--scaffold-ruler)_74%,transparent)]">
                Sources
              </p>
              <div className="flex flex-wrap gap-2">
                {response.citations.map((citation) => (
                  <Link
                    key={`${citation.sourceType}:${citation.canonicalUrl}`}
                    href={citation.canonicalUrl}
                    onClick={() => onCitationClick?.(citation)}
                    className={cn(
                      "inline-flex items-center rounded-full px-3 py-1.5 text-[11px] leading-4 transition-colors focus-visible:outline-none focus-visible:ring-2",
                      "border border-[color-mix(in_oklab,var(--scaffold-line)_58%,transparent)] bg-[color-mix(in_oklab,var(--scaffold-surface)_84%,var(--scaffold-bg))] text-[color-mix(in_oklab,var(--scaffold-ruler)_90%,transparent)] shadow-[0_10px_22px_-20px_rgba(0,0,0,0.32)] hover:bg-[color-mix(in_oklab,var(--scaffold-surface)_94%,var(--scaffold-bg))] hover:text-[var(--scaffold-toggle-text-active)] focus-visible:ring-[color-mix(in_oklab,var(--scaffold-ruler)_45%,transparent)]",
                    )}
                  >
                    {citation.title}
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
