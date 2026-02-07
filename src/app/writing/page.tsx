import type { Metadata } from "next";
import { WritingBrowser } from "@/components/writing/writing-browser";
import { getWriting } from "@/lib/content";

export const metadata: Metadata = {
  title: "Writing",
  description: "Structured notes on systems thinking, documentation, and product engineering.",
  alternates: {
    canonical: "/writing",
  },
};

export default async function WritingPage() {
  const posts = await getWriting();

  return (
    <div className="mx-auto w-full max-w-[1100px] px-4 pb-20 pt-10 sm:px-6 sm:pt-12">
      <WritingBrowser posts={posts} />
    </div>
  );
}
