import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Panel, PanelHeader, PanelRow } from "@/components/ui/panel";
import { getPageContent } from "@/lib/content";
import { renderMdx } from "@/lib/mdx";

export const metadata: Metadata = {
  title: "Resume",
  description: "Highlights and experience timeline.",
  alternates: {
    canonical: "/resume",
  },
};

export default async function ResumePage() {
  const page = await getPageContent("resume");

  if (!page) {
    notFound();
  }

  const content = await renderMdx(page.raw);

  return (
    <div className="mx-auto w-full max-w-[1100px] px-4 pb-20 pt-10 sm:px-6 sm:pt-12">
      <Panel>
        <PanelHeader
          label="Resume"
          title={page.title}
          description={page.description}
          action={
            <a
              href="/resume.pdf"
              download
              className="rounded-md border border-border bg-card px-3 py-1.5 text-sm text-fg transition-colors hover:border-accent/40 hover:bg-card2"
            >
              Download PDF
            </a>
          }
        />
        <PanelRow className="prose-shell">{content}</PanelRow>
      </Panel>
    </div>
  );
}
