import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

type CalloutProps = {
  type?: "note" | "warning";
  title?: string;
  children: ReactNode;
};

export function Callout({ type = "note", title, children }: CalloutProps) {
  return (
    <aside
      role={type === "warning" ? "alert" : "note"}
      aria-label={title ? `${type}: ${title}` : type}
      className={cn(
        "my-6 border-l-2 py-3 pl-4 pr-3 text-[14px] leading-relaxed",
        "bg-[var(--scaffold-bg)]",
        type === "warning"
          ? "border-[var(--scaffold-toggle-text-active)]"
          : "border-[var(--scaffold-line)]",
      )}
      data-oid="tpjv-yn"
    >
      {title && (
        <p
          className="mb-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--scaffold-toggle-text-active)] [font-family:var(--font-geist-pixel-square)]"
          data-oid="1a1wr6:"
        >
          {title}
        </p>
      )}
      <div className="text-[var(--scaffold-ruler)]" data-oid="2jur3_p">
        {children}
      </div>
    </aside>
  );
}
