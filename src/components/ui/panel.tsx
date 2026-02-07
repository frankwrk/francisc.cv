import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Panel({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <section className={cn("panel tone-border", className)}>{children}</section>;
}

export function PanelHeader({
  label,
  title,
  description,
  action,
}: {
  label: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <header className="border-b border-border px-5 py-4 sm:px-6">
      <div className="mb-3 flex items-center gap-3">
        <span className="font-pixel text-[11px] uppercase tracking-[0.18em] text-muted">
          {label}
        </span>
        <span className="h-px flex-1 bg-border2" aria-hidden />
      </div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold tracking-tight text-fg sm:text-xl">{title}</h2>
          {description ? <p className="max-w-2xl text-sm text-muted">{description}</p> : null}
        </div>
        {action}
      </div>
    </header>
  );
}

export function PanelRow({
  className,
  href,
  children,
}: {
  className?: string;
  href?: string;
  children: ReactNode;
}) {
  const shared = cn(
    "group border-t border-border px-5 py-4 transition-colors duration-150 first:border-t-0 sm:px-6",
    "hover:bg-accent-muted/20 hover:[box-shadow:inset_0_1px_0_var(--border2)]",
    className,
  );

  if (!href) {
    return <div className={shared}>{children}</div>;
  }

  return (
    <a href={href} className={shared}>
      {children}
    </a>
  );
}

export function MetaLine({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <p className={cn("font-mono text-[11px] tracking-wide text-muted", className)}>{children}</p>
  );
}
