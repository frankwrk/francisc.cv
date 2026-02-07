import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Panel, PanelHeader, PanelRow } from "@/components/ui/panel";
import { getPageContent } from "@/lib/content";
import { renderMdx } from "@/lib/mdx";

export const metadata: Metadata = {
  title: "About",
  description: "Working style, principles, and collaboration model.",
  alternates: {
    canonical: "/about",
  },
};

export default async function AboutPage() {
  const page = await getPageContent("about");

  if (!page) {
    notFound();
  }

  const content = await renderMdx(page.raw);

  return (
    <div className="mx-auto w-full max-w-[1100px] px-4 pb-20 pt-10 sm:px-6 sm:pt-12">
      <Panel>
        <PanelHeader label="About" title={page.title} description={page.description} />
        <PanelRow className="prose-shell">{content}</PanelRow>
      </Panel>
    </div>
  );
}
