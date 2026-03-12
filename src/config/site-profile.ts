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
    "I work on digital products where strategy and execution are treated as the same problem. My instinct is to reduce complexity before adding features.",
    "Right now I'm building this portfolio as something I actually use — a place to document decisions and present work with evidence, not just outcomes.",
    "If you're working on something hard and need someone who can move between design, engineering, and product without losing the thread, I'd like to hear about it.",
  ],
  contact: {
    email: contactEmail,
    subject: "Project Inquiry",
    ctaLabel: "Send email",
  },
};
