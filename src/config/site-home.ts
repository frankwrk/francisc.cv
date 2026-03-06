import type { LucideIcon } from "lucide-react";
import {
  Bot,
  BrainCircuit,
  Network,
  Workflow,
} from "lucide-react";
import { siteUrl } from "@/config/site-url";

export type HomepageIdentitySupport = {
  eyebrow: string;
  title: string;
  description: string;
  signalLine: string[];
};

export type CapabilityCard = {
  title: string;
  description: string;
  icon: LucideIcon;
  evidenceLabel?: string;
  href?: string;
};

export type SelectedWorkItem = {
  title: string;
  description: string;
  href?: string;
  kind: "external" | "current" | "documented";
  status: string;
};

export type ProfileSummary = {
  name: string;
  role: string;
  focus: string[];
  projects: string[];
  location: string;
  links?: {
    github?: string;
    website?: string;
    externalProject?: string;
  };
};

export const homepageIdentitySupport: HomepageIdentitySupport = {
  eyebrow: "WHAT I DO",
  title: "I work on the systems around AI adoption.",
  description:
    "What interests me is the part after the demo. How does a team introduce a new capability, keep context intact, and turn one-off experiments into something people can actually use? That usually leads me to workflow design, knowledge structure, and the operational details that keep a system from drifting.",
  signalLine: ["Boston", "AI workflows", "Technical program management"],
};

export const homepageCapabilities: CapabilityCard[] = [
  {
    title: "AI Adoption Systems",
    description:
      "I build the structure around adoption: rollout paths, ownership, and the guardrails that keep a new tool useful after the first week.",
    icon: BrainCircuit,
    evidenceLabel: "Current work",
  },
  {
    title: "Agent Infrastructure",
    description:
      "I care about the layer behind the interface: how agents get context, use tools, and fit inside the constraints of a real operating environment.",
    icon: Bot,
    evidenceLabel: "SYNQ Engine",
    href: "https://synqengine.com",
  },
  {
    title: "Knowledge Systems",
    description:
      "Good automation depends on clean context. I design the docs, content models, and decision trails that make systems easier to trust and extend.",
    icon: Network,
    evidenceLabel: "Requirements system",
    href: "/work/docs-as-product-playbook",
  },
  {
    title: "Workflow Automation",
    description:
      "A lot of coordination work is still manual. I look for the parts that can be made repeatable without making the process brittle.",
    icon: Workflow,
    evidenceLabel: "Security resilience",
    href: "/work/secure-release-gates",
  },
];

export const homepageSystemsDiagram = [
  "Knowledge",
  "Systems",
  "Automation",
  "Scale",
];

export const homepageSelectedWork: SelectedWorkItem[] = [
  {
    title: "SYNQ Engine",
    description: "Agent orchestration runtime built for WordPress-heavy environments.",
    href: "https://synqengine.com",
    kind: "external",
    status: "Live system",
  },
  {
    title: "STARTLINE",
    description: "Working framework for enterprise AI adoption and workflow change.",
    kind: "current",
    status: "Current work",
  },
  {
    title: "Cycl",
    description: "Current exploration in AI-assisted credit planning and optimization.",
    kind: "current",
    status: "Current work",
  },
  {
    title: "Requirements and handover documentation system",
    description:
      "Documentation framework for scoping work, making trade-offs explicit, and handing systems over cleanly.",
    href: "/work/docs-as-product-playbook",
    kind: "documented",
    status: "Documented case study",
  },
  {
    title: "WordPress migration and platform modernization",
    description:
      "Migration playbook focused on performance, governance, and cleaner long-term maintenance.",
    href: "/work/platform-onboarding-accelerator",
    kind: "documented",
    status: "Documented case study",
  },
  {
    title: "Security hardening and incident resilience",
    description:
      "Security and monitoring routines designed to reduce avoidable incidents and speed up response.",
    href: "/work/secure-release-gates",
    kind: "documented",
    status: "Documented case study",
  },
];

export const profileSummary: ProfileSummary = {
  name: "Francisc Furdui",
  role: "Technical Program Manager focused on AI adoption systems",
  focus: [
    "AI adoption in enterprises",
    "agent architectures",
    "technical program management",
    "knowledge systems",
    "workflow automation",
    "governance and auditability",
  ],
  projects: homepageSelectedWork.slice(0, 3).map((project) => project.title),
  location: "Boston",
  links: {
    github: "https://github.com/frankwrk",
    website: siteUrl,
    externalProject: "https://synqengine.com",
  },
};

export function createPersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profileSummary.name,
    url: siteUrl,
    email: "francisc.frd@gmail.com",
    image: `${siteUrl}/images/francisc-furdui.jpg`,
    jobTitle: profileSummary.role,
    description: homepageIdentitySupport.description,
    knowsAbout: profileSummary.focus,
    sameAs: [profileSummary.links?.github].filter(Boolean),
  };
}
