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

function SupportTone({
  supportLevel,
}: {
  supportLevel: AssistantChatResponse["supportLevel"];
}) {
  const label =
    supportLevel === "grounded"
      ? "Grounded in source material"
      : supportLevel === "partial"
        ? "Partly inferred from source material"
        : "Limited source support";

  return (
    <p className="text-[10px] tracking-[0.12em] text-[var(--scaffold-ruler)] [font-family:var(--font-geist-pixel-square)]">
      {label}
    </p>
  );
}

export function ChatMessage(props: ChatMessageProps) {
  if (props.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[70%] rounded-[18px] border border-[var(--scaffold-line)] bg-[color-mix(in_oklab,var(--scaffold-surface)_90%,transparent)] px-4 py-3 text-[14px] leading-6 text-[var(--scaffold-toggle-text-active)] shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--scaffold-line)_35%,transparent)]">
          {props.content}
        </div>
      </div>
    );
  }

  const { response, onCitationClick } = props;

  return (
    <div className="flex justify-start">
      <div className="max-w-full space-y-4 rounded-[22px] border border-[var(--scaffold-line)] bg-[color-mix(in_oklab,var(--scaffold-surface)_94%,var(--scaffold-bg))] px-5 py-4 md:px-6 md:py-5">
        <SupportTone supportLevel={response.supportLevel} />

        <div className="space-y-3">
          <p className="text-[15px] leading-8 text-[var(--scaffold-toggle-text-active)] md:text-[16px]">
            {response.answer}
          </p>

          {response.caveat && response.supportLevel !== "grounded" ? (
            <p className="border-l border-[var(--scaffold-line)] pl-4 text-[12px] leading-6 text-[var(--scaffold-ruler)]">
              {response.caveat}
            </p>
          ) : null}

          {response.citations.length > 0 ? (
            <div className="flex flex-wrap gap-2 pt-2">
              {response.citations.map((citation) => (
                <Link
                  key={`${citation.sourceType}:${citation.canonicalUrl}`}
                  href={citation.canonicalUrl}
                  onClick={() => onCitationClick?.(citation)}
                  className={cn(
                    "inline-flex items-center rounded-full border border-[var(--scaffold-line)] bg-[color-mix(in_oklab,var(--scaffold-surface)_88%,transparent)] px-3 py-1.5 text-[10px] tracking-[0.08em] text-[var(--scaffold-ruler)] transition-colors hover:text-[var(--scaffold-toggle-text-active)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--scaffold-ruler)]",
                  )}
                >
                  {citation.title}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
