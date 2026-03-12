import Link from "next/link";
import { RiFlashlightFill } from "@remixicon/react";
import { ProfileAvatar } from "@/components/profile/profile-avatar";
import { Signature } from "@/components/brand/signature";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import * as Badge from "@/components/ui/badge";
import { badgeVariants } from "@/components/ui/badge";
import { cn } from "@/utils/cn";
import { siteProfileConfig } from "@/config/site-profile";
import {
  homepageCapabilities,
  homepageIdentitySupport,
  homepageSelectedWork,
  homepageSystemsDiagram,
} from "@/config/site-home";
import { SpotlightPanel } from "@/components/ui/spotlight-panel";

export default function Home() {
  const mailtoHref = `mailto:${siteProfileConfig.contact.email}?subject=${encodeURIComponent(siteProfileConfig.contact.subject)}`;

  return (
    <article className="max-w-4xl space-y-12 pt-2 [font-family:var(--font-geist-sans)]">
      <div className="max-w-2xl space-y-8">
        <header className="space-y-5">
          <ProfileAvatar
            sources={siteProfileConfig.avatarSources}
            alt={siteProfileConfig.avatarAlt}
            initials={siteProfileConfig.initials}
          />

          <h1 className="text-4xl font-medium tracking-tight text-[var(--scaffold-toggle-text-active)] [font-family:var(--font-geist-pixel-square)] md:text-5xl">
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
      </div>

      <SpotlightPanel className="px-5 py-6 md:px-7 md:py-7">
        <div className="space-y-3">
          <p className="text-[10px] tracking-[0.22em] text-[var(--scaffold-ruler)] [font-family:var(--font-geist-sans)]">
            {homepageIdentitySupport.eyebrow}
          </p>
          <h2 className="max-w-2xl text-xl tracking-tight text-[var(--scaffold-toggle-text-active)] md:text-2xl">
            {homepageIdentitySupport.title}
          </h2>
          <p className="max-w-3xl text-[14px] leading-7 text-[var(--scaffold-ruler)] md:text-[15px]">
            {homepageIdentitySupport.description}
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {homepageIdentitySupport.signalLine.map((signal) => (
              <Badge.Root key={signal} color="teal">
                {signal}
              </Badge.Root>
            ))}
          </div>
        </div>
      </SpotlightPanel>

      <section className="space-y-5">
        <div className="space-y-2">
          <p className="text-[10px] tracking-[0.22em] text-[var(--scaffold-ruler)] [font-family:var(--font-geist-sans)]">
            SYSTEMS I BUILD
          </p>
          <h2 className="text-2xl tracking-tight text-[var(--scaffold-toggle-text-active)] md:text-3xl">
            Capability before abstraction.
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {homepageCapabilities.map((capability) => {
            const Icon = capability.icon;

            return (
              <SpotlightPanel
                key={capability.title}
                className="min-h-[204px] p-5"
              >
                <div className="flex h-full flex-col justify-between gap-8">
                  <div className="space-y-4">
                    <div className="flex h-10 w-10 items-center justify-center text-[var(--scaffold-toggle-text-active)]">
                      <Icon className="h-4 w-4" strokeWidth={1.75} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-[16px] font-medium text-[var(--scaffold-toggle-text-active)]">
                        {capability.title}
                      </h3>
                      <p className="text-[13px] leading-6 text-[var(--scaffold-ruler)]">
                        {capability.description}
                      </p>
                    </div>
                  </div>

                  {capability.evidenceLabel ? (
                    capability.href ? (
                      <Link
                        href={capability.href}
                        className={cn(
                          badgeVariants({ color: "gray" }).root(),
                          "self-start gap-1.5 hover:opacity-80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--scaffold-ruler)]",
                        )}
                      >
                        {capability.evidenceLabel}
                        <span aria-hidden>↗</span>
                      </Link>
                    ) : (
                      <Badge.Root color="blue" className="self-start">
                        <Badge.Icon as={RiFlashlightFill} />
                        {capability.evidenceLabel}
                      </Badge.Root>
                    )
                  ) : null}
                </div>
              </SpotlightPanel>
            );
          })}
        </div>

        <div className="border border-[var(--scaffold-line)] px-4 py-4 md:px-5">
          <p className="text-[10px] tracking-[0.18em] text-[var(--scaffold-ruler)] [font-family:var(--font-geist-sans)]">
            SYSTEM PATH
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {homepageSystemsDiagram.map((step, index) => (
              <div key={step} className="flex items-center gap-2">
                <Badge.Root color="gray" size="medium">
                  {step}
                </Badge.Root>
                {index < homepageSystemsDiagram.length - 1 ? (
                  <span className="text-[var(--scaffold-ruler)]" aria-hidden>
                    →
                  </span>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-5 pb-6">
        <div className="space-y-2">
          <p className="text-[10px] tracking-[0.22em] text-[var(--scaffold-ruler)] [font-family:var(--font-geist-sans)]">
            SELECTED WORK
          </p>
          <h2 className="text-2xl tracking-tight text-[var(--scaffold-toggle-text-active)] md:text-3xl">
            Proof artifacts and current systems.
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {homepageSelectedWork.map((item) => {
            const content = (
              <SpotlightPanel className="h-full p-5">
                <div className="flex h-full flex-col justify-between gap-6">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {item.kind === "external" ? (
                        <Badge.Root color="green">
                          <Badge.Icon as={RiFlashlightFill} />
                          {item.status}
                        </Badge.Root>
                      ) : item.kind === "current" ? (
                        <Badge.Root color="blue">
                          <Badge.Icon as={RiFlashlightFill} />
                          {item.status}
                        </Badge.Root>
                      ) : (
                        <Badge.Root color="gray">
                          {item.status}
                        </Badge.Root>
                      )}
                      <span className="text-[10px] tracking-[0.08em] text-[var(--scaffold-ruler)] opacity-70">
                        {item.kind === "documented"
                          ? "Portfolio artifact"
                          : item.kind === "external"
                            ? "External system"
                            : "In progress"}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-[16px] font-medium text-[var(--scaffold-toggle-text-active)]">
                        {item.title}
                      </h3>
                      <p className="text-[13px] leading-6 text-[var(--scaffold-ruler)]">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-[11px] tracking-[0.08em] text-[var(--scaffold-ruler)]">
                    {item.href
                      ? item.kind === "external"
                        ? "Open live system"
                        : "Open case study"
                      : "Case study in progress"}
                  </div>
                </div>
              </SpotlightPanel>
            );

            if (!item.href) {
              return <div key={item.title}>{content}</div>;
            }

            const isExternal = item.kind === "external";

            return (
              <Link
                key={item.title}
                href={item.href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noreferrer" : undefined}
                className="block transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--scaffold-ruler)]"
              >
                {content}
              </Link>
            );
          })}
        </div>
      </section>
    </article>
  );
}
