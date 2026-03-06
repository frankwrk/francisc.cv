import Link from "next/link";
import { ProfileAvatar } from "@/components/profile/profile-avatar";
import { Signature } from "@/components/brand/signature";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
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
    <article
      className="max-w-4xl space-y-12 pt-2 [font-family:var(--font-geist-sans)]"
      data-oid="2m1v1ei"
    >
      <div className="max-w-2xl space-y-8" data-oid="il4j:f-">
        <header className="space-y-5" data-oid="14h4r9e">
          <ProfileAvatar
            sources={siteProfileConfig.avatarSources}
            alt={siteProfileConfig.avatarAlt}
            initials={siteProfileConfig.initials}
            data-oid="w_vkdyt"
          />

          <h1
            className="text-3xl tracking-tight text-[var(--scaffold-toggle-text-active)] md:text-4xl"
            data-oid="g3hkezd"
          >
            {siteProfileConfig.name}
          </h1>
        </header>

        <section
          className="space-y-4 text-[15px] leading-7 text-[var(--scaffold-ruler)]"
          data-oid="etm8xao"
        >
          {siteProfileConfig.introParagraphs.map((paragraph) => (
            <p key={paragraph} data-oid="cw9xyk3">
              {paragraph}
            </p>
          ))}

          <div
            className="flex flex-wrap items-center justify-between gap-4 pt-2"
            data-oid="s97l0k-"
          >
            <HoverBorderGradient
              as="a"
              href={mailtoHref}
              containerClassName="rounded-full border-[var(--scaffold-line)] bg-[var(--scaffold-surface)] hover:bg-[var(--scaffold-surface)]"
              className="bg-[var(--scaffold-surface)] text-[var(--scaffold-toggle-text-active)]"
              data-oid="yl8..b0"
            >
              <span
                className="text-sm font-medium tracking-[0.01em]"
                data-oid="yb38.cs"
              >
                {siteProfileConfig.contact.ctaLabel}
              </span>
            </HoverBorderGradient>

            <Signature
              className="w-[123px] max-w-full text-[var(--scaffold-ruler)]"
              data-oid="01gz7il"
            />
          </div>
        </section>
      </div>

      <SpotlightPanel className="px-5 py-6 md:px-7 md:py-7" data-oid="r2:od02">
        <div className="space-y-3" data-oid="61ick89">
          <p
            className="text-[10px] tracking-[0.22em] text-[var(--scaffold-ruler)] [font-family:var(--font-geist-pixel-square)]"
            data-oid="o.4f-f8"
          >
            {homepageIdentitySupport.eyebrow}
          </p>
          <h2
            className="max-w-2xl text-xl tracking-tight text-[var(--scaffold-toggle-text-active)] md:text-2xl"
            data-oid="wvd:on:"
          >
            {homepageIdentitySupport.title}
          </h2>
          <p
            className="max-w-3xl text-[14px] leading-7 text-[var(--scaffold-ruler)] md:text-[15px]"
            data-oid="-fzzrbw"
          >
            {homepageIdentitySupport.description}
          </p>
          <div className="flex flex-wrap gap-2 pt-1" data-oid="phd.awv">
            {homepageIdentitySupport.signalLine.map((signal) => (
              <span
                key={signal}
                className="border border-[var(--scaffold-line)] px-2.5 py-1 text-[10px] tracking-[0.12em] text-[var(--scaffold-ruler)] [font-family:var(--font-geist-pixel-square)]"
                data-oid="rk75_ns"
              >
                {signal}
              </span>
            ))}
          </div>
        </div>
      </SpotlightPanel>

      <section className="space-y-5" data-oid="ng572od">
        <div className="space-y-2" data-oid="91dzzv8">
          <p
            className="text-[10px] tracking-[0.22em] text-[var(--scaffold-ruler)] [font-family:var(--font-geist-pixel-square)]"
            data-oid="gz8i8b:"
          >
            SYSTEMS I BUILD
          </p>
          <h2
            className="text-2xl tracking-tight text-[var(--scaffold-toggle-text-active)]"
            data-oid="p4lub7f"
          >
            Capability before abstraction.
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2" data-oid="fx88bwb">
          {homepageCapabilities.map((capability) => {
            const Icon = capability.icon;

            return (
              <SpotlightPanel
                key={capability.title}
                className="min-h-[204px] p-5"
                data-oid="2d2axn5"
              >
                <div
                  className="flex h-full flex-col justify-between gap-8"
                  data-oid="orm8blp"
                >
                  <div className="space-y-4" data-oid="ce81117">
                    <div
                      className="flex h-10 w-10 items-center justify-center border border-[var(--scaffold-line)] text-[var(--scaffold-toggle-text-active)]"
                      data-oid="kuwq9_e"
                    >
                      <Icon
                        className="h-4 w-4"
                        strokeWidth={1.75}
                        data-oid="hzy1hpg"
                      />
                    </div>
                    <div className="space-y-2" data-oid="tnldihs">
                      <h3
                        className="text-[16px] font-medium text-[var(--scaffold-toggle-text-active)]"
                        data-oid="v1040da"
                      >
                        {capability.title}
                      </h3>
                      <p
                        className="text-[13px] leading-6 text-[var(--scaffold-ruler)]"
                        data-oid="wi62qli"
                      >
                        {capability.description}
                      </p>
                    </div>
                  </div>

                  {capability.evidenceLabel ? (
                    capability.href ? (
                      <Link
                        href={capability.href}
                        className="inline-flex w-fit items-center gap-2 border border-[var(--scaffold-line)] px-2.5 py-1 text-[10px] tracking-[0.1em] text-[var(--scaffold-ruler)] transition-colors hover:text-[var(--scaffold-toggle-text-active)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--scaffold-ruler)]"
                        data-oid="qcv59dp"
                      >
                        <span data-oid="4li8sl9">
                          {capability.evidenceLabel}
                        </span>
                        <span aria-hidden data-oid="wbwo4tb">
                          ↗
                        </span>
                      </Link>
                    ) : (
                      <span
                        className="inline-flex w-fit items-center border border-[var(--scaffold-line)] px-2.5 py-1 text-[10px] tracking-[0.1em] text-[var(--scaffold-ruler)]"
                        data-oid="e-h_f2r"
                      >
                        {capability.evidenceLabel}
                      </span>
                    )
                  ) : null}
                </div>
              </SpotlightPanel>
            );
          })}
        </div>

        <div
          className="border border-[var(--scaffold-line)] px-4 py-4 md:px-5"
          data-oid="s:zfz24"
        >
          <p
            className="text-[10px] tracking-[0.18em] text-[var(--scaffold-ruler)] [font-family:var(--font-geist-pixel-square)]"
            data-oid="u_j8.rg"
          >
            SYSTEM PATH
          </p>
          <div
            className="mt-3 flex flex-wrap items-center gap-2 text-[12px] tracking-[0.12em] text-[var(--scaffold-toggle-text-active)] [font-family:var(--font-geist-pixel-circle)] md:text-[13px]"
            data-oid="a9qat4."
          >
            {homepageSystemsDiagram.map((step, index) => (
              <div
                key={step}
                className="flex items-center gap-2"
                data-oid="5_-blbj"
              >
                <span
                  className="border border-[var(--scaffold-line)] px-2.5 py-1.5"
                  data-oid="jvbj7nw"
                >
                  {step}
                </span>
                {index < homepageSystemsDiagram.length - 1 ? (
                  <span
                    className="text-[var(--scaffold-ruler)]"
                    aria-hidden
                    data-oid="_kxaosu"
                  >
                    →
                  </span>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-5 pb-6" data-oid="_s0c0h7">
        <div className="space-y-2" data-oid="ij5u_6z">
          <p
            className="text-[10px] tracking-[0.22em] text-[var(--scaffold-ruler)] [font-family:var(--font-geist-pixel-square)]"
            data-oid="cmrobf-"
          >
            SELECTED WORK
          </p>
          <h2
            className="text-2xl tracking-tight text-[var(--scaffold-toggle-text-active)]"
            data-oid="q_qweda"
          >
            Proof artifacts and current systems.
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2" data-oid="bllwd5h">
          {homepageSelectedWork.map((item) => {
            const content = (
              <SpotlightPanel className="h-full p-5" data-oid="uj4_74_">
                <div
                  className="flex h-full flex-col justify-between gap-6"
                  data-oid="1.my9-i"
                >
                  <div className="space-y-3" data-oid="q57zxjc">
                    <div
                      className="flex flex-wrap items-center gap-2"
                      data-oid="0l6jj15"
                    >
                      <span
                        className="border border-[var(--scaffold-line)] px-2 py-0.5 text-[10px] tracking-[0.08em] text-[var(--scaffold-ruler)]"
                        data-oid="rwd-ndy"
                      >
                        {item.status}
                      </span>
                      <span
                        className="text-[10px] tracking-[0.08em] text-[var(--scaffold-ruler)] opacity-70"
                        data-oid="tilo74g"
                      >
                        {item.kind === "documented"
                          ? "Portfolio artifact"
                          : item.kind === "external"
                            ? "External system"
                            : "In progress"}
                      </span>
                    </div>
                    <div className="space-y-2" data-oid="3n.pbi8">
                      <h3
                        className="text-[16px] font-medium text-[var(--scaffold-toggle-text-active)]"
                        data-oid="rugn48l"
                      >
                        {item.title}
                      </h3>
                      <p
                        className="text-[13px] leading-6 text-[var(--scaffold-ruler)]"
                        data-oid="l4ojbsz"
                      >
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <div
                    className="text-[11px] tracking-[0.08em] text-[var(--scaffold-ruler)]"
                    data-oid="k0g2yo1"
                  >
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
              return (
                <div key={item.title} data-oid="uw_h9.r">
                  {content}
                </div>
              );
            }

            const isExternal = item.kind === "external";

            return (
              <Link
                key={item.title}
                href={item.href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noreferrer" : undefined}
                className="block transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--scaffold-ruler)]"
                data-oid="xn8a84m"
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
