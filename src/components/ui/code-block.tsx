import type { ReactNode } from "react";
import { CopyButton } from "@/components/ui/copy-button";

function extractText(node: ReactNode): string {
  if (typeof node === "string") {
    return node;
  }

  if (Array.isArray(node)) {
    return node.map(extractText).join("");
  }

  if (node && typeof node === "object" && "props" in node) {
    const typed = node as { props?: { children?: ReactNode } };
    return extractText(typed.props?.children ?? "");
  }

  return "";
}

export function CodeBlock({ children }: { children: ReactNode }) {
  const value = extractText(children).trimEnd();

  return (
    <div className="tone-border code-block not-prose relative my-6 overflow-hidden rounded-md">
      <span className="absolute inset-x-0 top-0 h-px bg-accent/55" aria-hidden />
      <div className="flex items-center justify-between border-b border-border bg-card2 px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#ff5f57]" aria-hidden />
          <span className="h-2 w-2 rounded-full bg-[#febc2e]" aria-hidden />
          <span className="h-2 w-2 rounded-full bg-[#28c840]" aria-hidden />
          <span className="ml-1 font-pixel text-[10px] uppercase tracking-[0.16em] text-muted">Snippet</span>
        </div>
        <CopyButton value={value} />
      </div>
      <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed">{children}</pre>
    </div>
  );
}
