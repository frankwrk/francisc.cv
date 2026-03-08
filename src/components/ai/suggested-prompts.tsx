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
    <div className="flex flex-wrap gap-2.5">
      {prompts.map((prompt) => (
        <button
          key={prompt}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(prompt)}
          className="rounded-full border border-[var(--scaffold-line)] bg-[color-mix(in_oklab,var(--scaffold-surface)_88%,transparent)] px-3.5 py-2 text-left text-[11px] leading-5 text-[var(--scaffold-ruler)] transition-colors hover:text-[var(--scaffold-toggle-text-active)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--scaffold-ruler)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {prompt}
        </button>
      ))}
    </div>
  );
}
