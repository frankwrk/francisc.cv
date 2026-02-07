import Link from "next/link";
import { siteConfig } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border pb-10 pt-8">
      <div className="mx-auto grid w-full max-w-[1100px] gap-6 px-4 sm:grid-cols-2 sm:px-6">
        <div className="space-y-2">
          <p className="text-sm font-medium text-fg">{siteConfig.name}</p>
          <p className="font-mono text-xs text-muted">{siteConfig.email}</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 sm:justify-end">
          {siteConfig.socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-muted transition-colors duration-150 hover:text-fg"
            >
              {social.label}
            </a>
          ))}
          <Link href="/resume" className="text-sm text-muted transition-colors duration-150 hover:text-fg">
            Resume
          </Link>
        </div>
      </div>
    </footer>
  );
}
