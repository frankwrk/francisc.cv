import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Panel, PanelHeader, PanelRow } from "@/components/ui/panel";
import { getPageContent } from "@/lib/content";
import { renderMdx } from "@/lib/mdx";

export const metadata: Metadata = {
  title: "Now",
  description: "Current priorities and active focus areas.",
  alternates: {
    canonical: "/now",
  },
};

export default async function NowPage() {
  const page = await getPageContent("now");

  if (!page) {
    notFound();
  }

  const content = await renderMdx(page.raw);

  return (
    <div className="mx-auto w-full max-w-[1100px] px-4 pb-20 pt-10 sm:px-6 sm:pt-12">
      <Panel>
        <PanelHeader label="Now" title={page.title} description={page.description} />
        <PanelRow className="prose-shell">{content}</PanelRow>
      </Panel>
    </div>
  );
}
