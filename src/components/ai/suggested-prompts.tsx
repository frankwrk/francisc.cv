"use client";

type SuggestedPromptsProps = {
  prompts: string[];
  disabled?: boolean;
  onSelect: (prompt: string) => void;
};

export function SuggestedPrompts({
  prompts,
  disabled = false,
  onSelect,
}: SuggestedPromptsProps) {
  if (prompts.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap justify-center gap-2.5">
      {prompts.map((prompt) => (
        <button
          key={prompt}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(prompt)}
          className="rounded-full border px-3.5 py-2 font-[var(--font-geist-sans)] text-left text-[14px] font-normal leading-5 transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
          style={{
            borderColor:
              "color-mix(in oklab, var(--scaffold-line) 66%, transparent)",
            background:
              "color-mix(in oklab, var(--scaffold-surface) 88%, var(--scaffold-bg))",
            color:
              "color-mix(in oklab, var(--scaffold-ruler) 92%, var(--scaffold-toggle-text-active))",
            boxShadow: "0 10px 26px -22px rgba(0, 0, 0, 0.28)",
          }}
        >
          {prompt}
        </button>
      ))}
    </div>
  );
}
