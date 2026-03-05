import { ProfileAvatar } from "@/components/profile/profile-avatar";
import { Signature } from "@/components/brand/signature";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { siteProfileConfig } from "@/config/site-profile";

export default function Home() {
  const mailtoHref = `mailto:${siteProfileConfig.contact.email}?subject=${encodeURIComponent(siteProfileConfig.contact.subject)}`;

  return (
    <article className="max-w-2xl space-y-8 pt-2 [font-family:var(--font-geist-sans)]">
      <header className="space-y-5">
        <ProfileAvatar
          sources={siteProfileConfig.avatarSources}
          alt={siteProfileConfig.avatarAlt}
          initials={siteProfileConfig.initials}
        />

        <h1 className="text-3xl tracking-tight text-[var(--scaffold-toggle-text-active)] md:text-4xl">
          {siteProfileConfig.name}
        </h1>
      </header>

      <section className="space-y-4 text-[15px] leading-7 text-[var(--scaffold-ruler)]">
        {siteProfileConfig.introParagraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <HoverBorderGradient
            as="a"
            href={mailtoHref}
            containerClassName="rounded-full border-[var(--scaffold-line)] bg-[var(--scaffold-surface)] hover:bg-[var(--scaffold-surface)]"
            className="bg-[var(--scaffold-surface)] text-[var(--scaffold-toggle-text-active)]"
          >
            <span className="text-sm font-medium tracking-[0.01em]">
              {siteProfileConfig.contact.ctaLabel}
            </span>
          </HoverBorderGradient>

          <Signature className="w-[123px] max-w-full text-[var(--scaffold-ruler)]" />
        </div>
      </section>
    </article>
  );
}
