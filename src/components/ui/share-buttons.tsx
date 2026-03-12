import { RiTwitterXFill, RiLinkedinFill } from "@remixicon/react";
import { cn } from "@/utils/cn";

type ShareButtonsProps = {
  url: string;
  title: string;
  variant?: "inline" | "section";
  className?: string;
};

const linkCls =
  "inline-flex items-center justify-center text-[var(--scaffold-ruler)] transition-colors hover:text-[var(--scaffold-toggle-text-active)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--scaffold-ruler)] rounded-sm";

export function ShareButtons({
  url,
  title,
  variant = "inline",
  className,
}: ShareButtonsProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    {
      label: "Share on X",
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      icon: <RiTwitterXFill className="h-[14px] w-[14px]" aria-hidden />,
    },
    {
      label: "Share on LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: <RiLinkedinFill className="h-[14px] w-[14px]" aria-hidden />,
    },
    {
      label: "Submit to Hacker News",
      href: `https://news.ycombinator.com/submitlink?u=${encodedUrl}&t=${encodedTitle}`,
      icon: (
        <span className="text-[10px] font-medium leading-none tracking-wide" aria-hidden>
          HN
        </span>
      ),
    },
  ] as const;

  if (variant === "section") {
    return (
      <div
        className={cn(
          "flex items-center gap-4 border-t border-[var(--scaffold-line)] pt-6",
          className,
        )}
      >
        <span className="text-[10px] tracking-[0.18em] text-[var(--scaffold-ruler)]">
          SHARE
        </span>
        <div className="flex items-center gap-3">
          {links.map(({ label, href, icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className={cn(linkCls, "h-7 w-7")}
            >
              {icon}
            </a>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="text-[10px] tracking-[0.18em] text-[var(--scaffold-ruler)]">
        SHARE
      </span>
      <div className="flex items-center gap-2">
        {links.map(({ label, href, icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={label}
            className={cn(linkCls, "h-6 w-6")}
          >
            {icon}
          </a>
        ))}
      </div>
    </div>
  );
}
