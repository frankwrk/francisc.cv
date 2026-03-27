export type SiteProfileConfig = {
  name: string;
  initials: string;
  avatarAlt: string;
  avatarSources: string[];
  introParagraphs: string[];
  contact: {
    email: string;
    subject: string;
    ctaLabel: string;
  };
};

const contactEmail =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "contact@example.com";

// Central profile content and media sources for the home intro section.
export const siteProfileConfig: SiteProfileConfig = {
  name: "Francisc Furdui",
  initials: "FF",
  avatarAlt: "Portrait of Francisc Furdui",
  avatarSources: [
    "/images/francisc-furdui.jpg",
    "/images/francisc-furdui.jpeg",
  ],
  introParagraphs: [
    "I'm Francisc. I reduce complexity before I add features — it's the habit that keeps me useful when scope grows.",
    "Most of my current work is around AI adoption: what happens after the demo, when a team has to absorb a new capability into real workflows. That usually means rollout structure, the knowledge layer that keeps agents in context, and the coordination work that can be made repeatable without turning brittle.",
    "If you're working on something in that space, or just need someone who can move between product, engineering, and design, I'd like to hear about it.",
  ],
  contact: {
    email: contactEmail,
    subject: "Project Inquiry",
    ctaLabel: "Send email",
  },
};
