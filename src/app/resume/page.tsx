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
     
    >
      <header className="space-y-1">
        <p
          className="text-[10px] tracking-[0.22em] text-[var(--scaffold-ruler)] [font-family:var(--font-geist-sans)]"
         
        >
          RESUME
        </p>
        <h1
          className="text-4xl font-medium tracking-tight text-[var(--scaffold-toggle-text-active)] [font-family:var(--font-geist-pixel-square)] md:text-5xl"
         
        >
          Francisc Furdui
        </h1>
      </header>

      {/* Role selector */}
      <div className="space-y-3">
        <p
          className="text-[10px] uppercase tracking-[0.18em] text-[var(--scaffold-ruler)] [font-family:var(--font-geist-sans)]"
         
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
         
        >
          <SegmentedControl.List
            className="h-8 w-full rounded-full border border-[var(--scaffold-line)] bg-[var(--scaffold-toggle-track)] p-0.5"
            floatingBgClassName="inset-y-0.5 rounded-full border border-[var(--scaffold-line)] bg-[var(--scaffold-toggle-thumb)] shadow-none"
           
          >
            <SegmentedControl.Trigger
              value="all"
              className="h-7 rounded-full px-2 text-[10px] tracking-[0.12em] text-[var(--scaffold-toggle-text-inactive)] data-[state=active]:text-[var(--scaffold-toggle-text-active)] [font-family:var(--font-geist-sans)]"
             
            >
              All
            </SegmentedControl.Trigger>
            {roles.map((role) => (
              <SegmentedControl.Trigger
                key={role}
                value={role}
                className="h-7 rounded-full px-2 text-[10px] tracking-[0.12em] text-[var(--scaffold-toggle-text-inactive)] data-[state=active]:text-[var(--scaffold-toggle-text-active)] [font-family:var(--font-geist-sans)]"
               
              >
                {resumeRoleLabels[role]}
              </SegmentedControl.Trigger>
            ))}
          </SegmentedControl.List>
        </SegmentedControl.Root>
      </div>

      {/* Summary */}
      <section className="space-y-2">
        <p
          className="text-[10px] uppercase tracking-[0.18em] text-[var(--scaffold-ruler)] [font-family:var(--font-geist-sans)]"
         
        >
          Summary
        </p>
        <p
          className="text-[15px] leading-7 text-[var(--scaffold-ruler)]"
         
        >
          {resumeData.summary}
        </p>
      </section>

      {/* Experience */}
      <section className="space-y-4">
        <p
          className="text-[10px] uppercase tracking-[0.18em] text-[var(--scaffold-ruler)] [font-family:var(--font-geist-sans)]"
         
        >
          Experience
        </p>
        <div className="space-y-5">
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
               
              >
                <div
                  className="flex flex-wrap items-baseline justify-between gap-2"
                 
                >
                  <h3
                    className="text-[15px] font-medium text-[var(--scaffold-toggle-text-active)]"
                   
                  >
                    {entry.title}
                  </h3>
                  <span
                    className="text-[11px] tracking-[0.06em] text-[var(--scaffold-ruler)] [font-family:var(--font-geist-sans)]"
                   
                  >
                    {entry.period}
                  </span>
                </div>
                <p
                  className="mb-2 text-[13px] text-[var(--scaffold-ruler)]"
                 
                >
                  {entry.company} · {entry.location}
                </p>
                <ul className="space-y-1">
                  {entry.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex gap-2 text-[13px] leading-relaxed text-[var(--scaffold-ruler)]"
                     
                    >
                      <span
                        className="mt-0.5 shrink-0 text-[var(--scaffold-line)]"
                       
                      >
                        —
                      </span>
                      <span className="min-w-0">
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
      <section className="space-y-3">
        <p
          className="text-[10px] uppercase tracking-[0.18em] text-[var(--scaffold-ruler)] [font-family:var(--font-geist-sans)]"
         
        >
          Skills
        </p>
        <div
          className="border border-[var(--scaffold-line)]"
         
        >
          {resumeData.skills.map((row, i) => (
            <div
              key={row.area}
              className={cn(
                "grid grid-cols-[1fr_2fr] gap-4 px-4 py-2.5 text-[13px]",
                i > 0 && "border-t border-[var(--scaffold-line)]",
              )}
             
            >
              <span
                className="font-medium text-[var(--scaffold-toggle-text-active)]"
               
              >
                {row.area}
              </span>
              <span className="text-[var(--scaffold-ruler)]">
                {row.capabilities}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className="space-y-2">
        <p
          className="text-[10px] uppercase tracking-[0.18em] text-[var(--scaffold-ruler)] [font-family:var(--font-geist-sans)]"
         
        >
          Education
        </p>
        <div
          className="border-l-2 border-[var(--scaffold-line)] pl-4"
         
        >
          <p
            className="text-[15px] font-medium text-[var(--scaffold-toggle-text-active)]"
           
          >
            {resumeData.education.degree}
          </p>
          <p
            className="text-[13px] text-[var(--scaffold-ruler)]"
           
          >
            {resumeData.education.institution} · {resumeData.education.year}
          </p>
          <p
            className="mt-1 text-[13px] leading-relaxed text-[var(--scaffold-ruler)]"
           
          >
            {resumeData.education.coursework}
          </p>
        </div>
      </section>

      {/* Certifications */}
      <section className="space-y-2">
        <p
          className="text-[10px] uppercase tracking-[0.18em] text-[var(--scaffold-ruler)] [font-family:var(--font-geist-sans)]"
         
        >
          Certifications
        </p>
        <p
          className="text-[13px] leading-relaxed text-[var(--scaffold-ruler)]"
         
        >
          {resumeData.certifications}
        </p>
      </section>

      {/* Download */}
      <div className="pb-4 pt-2">
        <HoverBorderGradient
          as="a"
          href={pdfHref}
          download
          containerClassName="rounded-full border-[var(--scaffold-line)] bg-[var(--scaffold-surface)]"
          className="bg-[var(--scaffold-surface)] text-[var(--scaffold-toggle-text-active)]"
         
        >
          <span
            className="text-sm font-medium tracking-[0.01em]"
           
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
    <Suspense>
      <ResumeContent />
    </Suspense>
  );
}
