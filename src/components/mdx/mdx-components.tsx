import type { ComponentPropsWithoutRef, ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { CodeBlock } from "@/components/ui/code-block";
import { Badge } from "@/components/ui/badge";
import { ContactForm } from "@/components/mdx/contact-form";
import { cn } from "@/lib/utils";

function Callout({
  type = "note",
  title,
  children,
}: {
  type?: "note" | "tip" | "warning";
  title?: string;
  children: ReactNode;
}) {
  const tones: Record<string, string> = {
    note: "border-accent/30 bg-accent-muted/40",
    tip: "border-emerald-500/30 bg-emerald-500/10",
    warning: "border-amber-500/40 bg-amber-500/10",
  };

  return (
    <aside className={cn("my-6 rounded-md border p-4", tones[type])}>
      {title ? <p className="mb-2 text-sm font-semibold tracking-tight text-fg">{title}</p> : null}
      <div className="text-sm text-muted">{children}</div>
    </aside>
  );
}

function Figure({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  return (
    <figure className="not-prose my-8 space-y-3">
      <div className="tone-border overflow-hidden rounded-md bg-card2 p-2">
        <Image
          src={src}
          alt={alt}
          width={1280}
          height={720}
          className="h-auto w-full rounded-sm"
        />
      </div>
      {caption ? <figcaption className="text-center text-xs text-muted">{caption}</figcaption> : null}
    </figure>
  );
}

function InlineCode(props: ComponentPropsWithoutRef<"code">) {
  return (
    <code
      {...props}
      className={cn(
        "rounded-sm border border-border bg-card2 px-1.5 py-0.5 font-mono text-[0.9em] text-fg",
        props.className,
      )}
    />
  );
}

function Steps({ children }: { children: ReactNode }) {
  return <ol className="my-6 list-decimal space-y-3 pl-5 marker:text-muted">{children}</ol>;
}

function Table(props: ComponentPropsWithoutRef<"table">) {
  return (
    <div className="my-6 overflow-x-auto">
      <table {...props} className={cn("w-full border-collapse text-left text-sm", props.className)} />
    </div>
  );
}

function LinkCard({ href, title, description }: { href: string; title: string; description?: string }) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
      className="tone-border my-6 block rounded-md bg-card px-4 py-3 transition-colors duration-150 hover:bg-card2"
    >
      <p className="text-sm font-semibold text-fg">{title}</p>
      {description ? <p className="mt-1 text-sm text-muted">{description}</p> : null}
    </a>
  );
}

export const mdxComponents = {
  h2: (props: ComponentPropsWithoutRef<"h2">) => (
    <h2 {...props} className={cn("group mt-10 scroll-mt-28 text-2xl font-semibold tracking-tight", props.className)} />
  ),
  h3: (props: ComponentPropsWithoutRef<"h3">) => (
    <h3 {...props} className={cn("group mt-8 scroll-mt-28 text-xl font-semibold tracking-tight", props.className)} />
  ),
  p: (props: ComponentPropsWithoutRef<"p">) => (
    <p {...props} className={cn("my-4 max-w-[76ch] text-[15px] leading-7 text-fg", props.className)} />
  ),
  ul: (props: ComponentPropsWithoutRef<"ul">) => (
    <ul {...props} className={cn("my-4 list-disc space-y-2 pl-5 text-[15px] leading-7", props.className)} />
  ),
  ol: (props: ComponentPropsWithoutRef<"ol">) => (
    <ol {...props} className={cn("my-4 list-decimal space-y-2 pl-5 text-[15px] leading-7", props.className)} />
  ),
  li: (props: ComponentPropsWithoutRef<"li">) => <li {...props} className={cn("text-fg", props.className)} />,
  a: ({ href = "", ...props }: ComponentPropsWithoutRef<"a">) => {
    const className = cn(
      "link-underline text-accent decoration-2 underline-offset-4 transition-colors hover:text-fg",
      props.className,
    );

    if (href.startsWith("/")) {
      return <Link href={href} {...props} className={className} />;
    }

    return <a href={href} target="_blank" rel="noreferrer" {...props} className={className} />;
  },
  code: InlineCode,
  pre: ({ children }: ComponentPropsWithoutRef<"pre">) => <CodeBlock>{children}</CodeBlock>,
  blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote
      {...props}
      className={cn("my-6 border-l-2 border-accent pl-4 text-[15px] italic text-muted", props.className)}
    />
  ),
  table: Table,
  th: (props: ComponentPropsWithoutRef<"th">) => (
    <th {...props} className={cn("border border-border bg-card2 px-3 py-2 font-semibold", props.className)} />
  ),
  td: (props: ComponentPropsWithoutRef<"td">) => (
    <td {...props} className={cn("border border-border px-3 py-2 align-top", props.className)} />
  ),
  hr: (props: ComponentPropsWithoutRef<"hr">) => <hr {...props} className={cn("my-10 border-border", props.className)} />,
  Callout,
  Badge,
  Figure,
  InlineCode,
  Steps,
  Table,
  LinkCard,
  ContactForm,
};
