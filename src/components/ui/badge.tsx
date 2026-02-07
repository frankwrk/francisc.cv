import { cn } from "@/lib/utils";

export function Badge({ value, className }: { value: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border border-border px-2 py-1 font-mono text-[11px] text-muted transition-colors duration-150",
        "bg-accent-muted/20 hover:border-accent/40 hover:bg-accent-muted/45 hover:text-fg",
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-accent/70" aria-hidden />
      {value}
    </span>
  );
}
