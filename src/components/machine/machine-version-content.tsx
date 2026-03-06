import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { homepageCapabilities, homepageIdentitySupport, homepageSelectedWork, homepageSystemsDiagram, profileSummary } from "@/config/site-home";
import { siteProfileConfig } from "@/config/site-profile";
import { resumeData } from "@/config/site-resume";
import { getAllArticles, getAllProjects } from "@/lib/content";
import { MachineLink } from "@/components/machine/machine-mode-controller";
import { MachineMdxContent } from "@/components/machine/machine-mdx-content";

function asciiBox(lines: string[]) {
  const width = Math.max(...lines.map((line) => line.length));
  const top = `+${"-".repeat(width + 2)}+`;

  return [top, ...lines.map((line) => `| ${line.padEnd(width, " ")} |`), top].join("\n");
}

function asciiTable(headers: string[], rows: string[][]) {
  const widths = headers.map((header, index) =>
    Math.max(
      header.length,
      ...rows.map((row) => (row[index] ?? "").length)
    )
  );

  const border = `+${widths.map((width) => "-".repeat(width + 2)).join("+")}+`;
  const renderRow = (row: string[]) =>
    `| ${row
      .map((cell, index) => (cell ?? "").padEnd(widths[index], " "))
      .join(" | ")} |`;

  return [border, renderRow(headers), border, ...rows.map(renderRow), border].join("\n");
}

function buildMachineSource({
  projectLinks,
  articleLinks,
}: {
  projectLinks: Array<{ title: string; href: string; description: string }>;
  articleLinks: Array<{ title: string; href: string; description: string; date: string }>;
}) {
  const capabilityTable = asciiTable(
    ["SYSTEM", "EVIDENCE"],
    homepageCapabilities.map((capability) => [
      capability.title,
      capability.evidenceLabel ?? "-",
    ])
  );

  const resumeTable = asciiTable(
    ["AREA", "CAPABILITIES"],
    resumeData.skills.map((row) => [row.area, row.capabilities])
  );

  const selectedWork = homepageSelectedWork
    .map((item) => {
      const linkLine = item.href ? `- Link: [open](${item.href})` : "- Link: not public yet";

      return [
        `### ${item.title}`,
        `- Status: ${item.status}`,
        `- Type: ${item.kind}`,
        `- Summary: ${item.description}`,
        linkLine,
      ].join("\n");
    })
    .join("\n\n");

  const projectIndex = projectLinks
    .map((project) => `- [${project.title}](${project.href}) — ${project.description}`)
    .join("\n");

  const articleIndex = articleLinks
    .map((article) => `- [${article.title}](${article.href}) — ${article.date} — ${article.description}`)
    .join("\n");

  return `\`\`\`text
${asciiBox([
  "FRANCISC.CV :: MACHINE VIEW",
  "mode = machine",
  "purpose = text-first site index",
  "switch = HUMAN to return to the interface",
])}
\`\`\`

# francisc.cv

This is a machine-readable pass over the site. The goal here is structure, links, and signal density rather than presentation.

## Navigation

- [Home](/)
- [Work](/work)
- [Resume](/resume)
- [Thinking](/thinking)
- [profile.json](/profile.json)

## Profile

| Field | Value |
| --- | --- |
| Name | ${profileSummary.name} |
| Role | ${profileSummary.role} |
| Location | ${profileSummary.location} |

## Human Intro

${siteProfileConfig.introParagraphs.join("\n\n")}

## Positioning

${homepageIdentitySupport.description}

Tags: ${homepageIdentitySupport.signalLine.join(" · ")}

## Capability Matrix

\`\`\`text
${capabilityTable}
\`\`\`

${homepageCapabilities
  .map(
    (capability) =>
      `### ${capability.title}\n${capability.description}${capability.href ? `\n\nReference: [${capability.evidenceLabel}](${capability.href})` : ""}`
  )
  .join("\n\n")}

## System Path

\`${homepageSystemsDiagram.join(" -> ")}\`

## Selected Work

${selectedWork}

## Portfolio Index

${projectIndex}

## Thinking Index

${articleIndex}

## Resume Snapshot

\`\`\`text
${resumeTable}
\`\`\`

Education: ${resumeData.education.degree}, ${resumeData.education.institution} (${resumeData.education.year})

Certifications: ${resumeData.certifications}
`;
}

export async function MachineVersionContent() {
  const [projects, articles] = await Promise.all([getAllProjects(), getAllArticles()]);

  const source = buildMachineSource({
    projectLinks: projects.map((project) => ({
      title: project.title,
      href: `/work/${project.slug}`,
      description: project.description,
    })),
    articleLinks: articles.map((article) => ({
      title: article.title,
      href: `/thinking/${article.slug}`,
      description: article.description,
      date: article.date,
    })),
  });

  return (
    <MachineMdxContent>
      <MDXRemote
        source={source}
        components={{
          a: MachineLink,
        }}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
          },
        }}
      />
    </MachineMdxContent>
  );
}
