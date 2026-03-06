"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useWebHaptics } from "web-haptics/react";
import * as SegmentedControl from "@/components/ui/segmented-control";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import {
  resumeData,
  resumePDFs,
  resumeRoleLabels,
  type ResumeRole,
} from "@/config/site-resume";
import { cn } from "@/utils/cn";

const roles: ResumeRole[] = ["tpm", "ux", "security", "wordpress", "general"];

function ResumeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { trigger } = useWebHaptics();

  const roleParam = searchParams.get("role") as ResumeRole | null;
  const selectedRole = roles.includes(roleParam as ResumeRole)
    ? roleParam
    : null;

  function setSelectedRole(role: ResumeRole | null) {
    const params = new URLSearchParams();
    if (role) params.set("role", role);
    router.replace(role ? `?role=${role}` : "/resume", { scroll: false });
  }

  const pdfHref = selectedRole ? resumePDFs[selectedRole] : resumePDFs.general;
  const downloadLabel = selectedRole
    ? `Download ${resumeRoleLabels[selectedRole]} Resume PDF`
    : "Download Resume PDF";

  return (
    <article
      className="max-w-2xl space-y-10 pt-2 [font-family:var(--font-geist-sans)]"
      data-oid=":fjgvsh"
    >
      <header className="space-y-1" data-oid=":fbhkm_">
        <p
          className="text-[10px] tracking-[0.22em] text-[var(--scaffold-ruler)] [font-family:var(--font-geist-pixel-square)]"
          data-oid="t0o8o4x"
        >
          RESUME
        </p>
        <h1
          className="text-2xl tracking-tight text-[var(--scaffold-toggle-text-active)]"
          data-oid="hc9_1cx"
        >
          Francisc Furdui
        </h1>
      </header>

      {/* Role selector */}
      <div className="space-y-3" data-oid="he63_va">
        <p
          className="text-[10px] uppercase tracking-[0.18em] text-[var(--scaffold-ruler)] [font-family:var(--font-geist-pixel-square)]"
          data-oid="t37s9p7"
        >
          Filter by role
        </p>
        <SegmentedControl.Root
          value={selectedRole ?? "all"}
          onValueChange={(v) => {
            trigger([20]);
            setSelectedRole(v === "all" ? null : (v as ResumeRole));
          }}
          aria-label="Resume role filter"
          data-oid="g-6cbxd"
        >
          <SegmentedControl.List
            className="h-8 w-full rounded-full border border-[var(--scaffold-line)] bg-[var(--scaffold-toggle-track)] p-0.5"
            floatingBgClassName="inset-y-0.5 rounded-full border border-[var(--scaffold-line)] bg-[var(--scaffold-toggle-thumb)] shadow-none"
            data-oid="dkjjce_"
          >
            <SegmentedControl.Trigger
              value="all"
              className="h-7 rounded-full px-2 text-[10px] tracking-[0.12em] text-[var(--scaffold-toggle-text-inactive)] data-[state=active]:text-[var(--scaffold-toggle-text-active)] [font-family:var(--font-geist-pixel-circle)]"
              data-oid="u7vbskq"
            >
              All
            </SegmentedControl.Trigger>
            {roles.map((role) => (
              <SegmentedControl.Trigger
                key={role}
                value={role}
                className="h-7 rounded-full px-2 text-[10px] tracking-[0.12em] text-[var(--scaffold-toggle-text-inactive)] data-[state=active]:text-[var(--scaffold-toggle-text-active)] [font-family:var(--font-geist-pixel-circle)]"
                data-oid="28dwd8x"
              >
                {resumeRoleLabels[role]}
              </SegmentedControl.Trigger>
            ))}
          </SegmentedControl.List>
        </SegmentedControl.Root>
      </div>

      {/* Summary */}
      <section className="space-y-2" data-oid="w_p3acs">
        <p
          className="text-[10px] uppercase tracking-[0.18em] text-[var(--scaffold-ruler)] [font-family:var(--font-geist-pixel-square)]"
          data-oid="y7e0dsp"
        >
          Summary
        </p>
        <p
          className="text-[15px] leading-7 text-[var(--scaffold-ruler)]"
          data-oid="wcj_gwm"
        >
          {resumeData.summary}
        </p>
      </section>

      {/* Experience */}
      <section className="space-y-4" data-oid="guc2ztq">
        <p
          className="text-[10px] uppercase tracking-[0.18em] text-[var(--scaffold-ruler)] [font-family:var(--font-geist-pixel-square)]"
          data-oid="z5bmgnq"
        >
          Experience
        </p>
        <div className="space-y-5" data-oid="h0l7ed_">
          {resumeData.experience.map((entry) => {
            const isHighlighted =
              selectedRole === null || entry.roles.includes(selectedRole);
            return (
              <div
                key={entry.company}
                className={cn(
                  "border-l-2 pl-4 transition-opacity duration-300",
                  isHighlighted
                    ? "border-[var(--scaffold-toggle-text-active)] opacity-100"
                    : "border-[var(--scaffold-line)] opacity-30",
                )}
                data-oid="7i_7i5_"
              >
                <div
                  className="flex flex-wrap items-baseline justify-between gap-2"
                  data-oid=".tg3n_4"
                >
                  <h3
                    className="text-[15px] font-medium text-[var(--scaffold-toggle-text-active)]"
                    data-oid="t5terkb"
                  >
                    {entry.title}
                  </h3>
                  <span
                    className="text-[11px] tracking-[0.06em] text-[var(--scaffold-ruler)] [font-family:var(--font-geist-pixel-square)]"
                    data-oid="qdckv7g"
                  >
                    {entry.period}
                  </span>
                </div>
                <p
                  className="mb-2 text-[13px] text-[var(--scaffold-ruler)]"
                  data-oid=":-i8bhl"
                >
                  {entry.company} · {entry.location}
                </p>
                <ul className="space-y-1" data-oid="vr3ygzj">
                  {entry.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex gap-2 text-[13px] leading-relaxed text-[var(--scaffold-ruler)]"
                      data-oid="9l_mlob"
                    >
                      <span
                        className="mt-0.5 shrink-0 text-[var(--scaffold-line)]"
                        data-oid="vf6etni"
                      >
                        —
                      </span>
                      <span className="min-w-0" data-oid="f36-.8l">
                        {bullet}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* Skills */}
      <section className="space-y-3" data-oid="s1_dgvo">
        <p
          className="text-[10px] uppercase tracking-[0.18em] text-[var(--scaffold-ruler)] [font-family:var(--font-geist-pixel-square)]"
          data-oid="dr22ij-"
        >
          Skills
        </p>
        <div
          className="border border-[var(--scaffold-line)]"
          data-oid="iu7zi5d"
        >
          {resumeData.skills.map((row, i) => (
            <div
              key={row.area}
              className={cn(
                "grid grid-cols-[1fr_2fr] gap-4 px-4 py-2.5 text-[13px]",
                i > 0 && "border-t border-[var(--scaffold-line)]",
              )}
              data-oid="91p.s11"
            >
              <span
                className="font-medium text-[var(--scaffold-toggle-text-active)]"
                data-oid="io_y:ff"
              >
                {row.area}
              </span>
              <span className="text-[var(--scaffold-ruler)]" data-oid="rncmlsf">
                {row.capabilities}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className="space-y-2" data-oid="5w.oj3q">
        <p
          className="text-[10px] uppercase tracking-[0.18em] text-[var(--scaffold-ruler)] [font-family:var(--font-geist-pixel-square)]"
          data-oid="2iihqlw"
        >
          Education
        </p>
        <div
          className="border-l-2 border-[var(--scaffold-line)] pl-4"
          data-oid="16c7k1:"
        >
          <p
            className="text-[15px] font-medium text-[var(--scaffold-toggle-text-active)]"
            data-oid="hu.533-"
          >
            {resumeData.education.degree}
          </p>
          <p
            className="text-[13px] text-[var(--scaffold-ruler)]"
            data-oid="kw6-de2"
          >
            {resumeData.education.institution} · {resumeData.education.year}
          </p>
          <p
            className="mt-1 text-[13px] leading-relaxed text-[var(--scaffold-ruler)]"
            data-oid="7gxe2dw"
          >
            {resumeData.education.coursework}
          </p>
        </div>
      </section>

      {/* Certifications */}
      <section className="space-y-2" data-oid="1wyj2sl">
        <p
          className="text-[10px] uppercase tracking-[0.18em] text-[var(--scaffold-ruler)] [font-family:var(--font-geist-pixel-square)]"
          data-oid="v35hudj"
        >
          Certifications
        </p>
        <p
          className="text-[13px] leading-relaxed text-[var(--scaffold-ruler)]"
          data-oid="l41ckf0"
        >
          {resumeData.certifications}
        </p>
      </section>

      {/* Download */}
      <div className="pb-4 pt-2" data-oid="4u38d.q">
        <HoverBorderGradient
          as="a"
          href={pdfHref}
          download
          containerClassName="rounded-full border-[var(--scaffold-line)] bg-[var(--scaffold-surface)]"
          className="bg-[var(--scaffold-surface)] text-[var(--scaffold-toggle-text-active)]"
          data-oid="cpq6753"
        >
          <span
            className="text-sm font-medium tracking-[0.01em]"
            data-oid="920d:e0"
          >
            {downloadLabel}
          </span>
        </HoverBorderGradient>
      </div>
    </article>
  );
}

export default function ResumePage() {
  return (
    <Suspense data-oid="1qh6nfz">
      <ResumeContent data-oid="ikzhf14" />
    </Suspense>
  );
}
