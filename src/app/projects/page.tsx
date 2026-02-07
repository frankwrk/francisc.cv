import type { Metadata } from "next";
import { ProjectsBrowser } from "@/components/projects/projects-browser";
import { getProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Projects",
  description: "Case studies across product delivery, UX systems, and platform architecture.",
  alternates: {
    canonical: "/projects",
  },
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="mx-auto w-full max-w-[1100px] px-4 pb-20 pt-10 sm:px-6 sm:pt-12">
      <ProjectsBrowser projects={projects} />
    </div>
  );
}
