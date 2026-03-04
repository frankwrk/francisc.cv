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

// Central profile content and media sources for the home intro section.
export const siteProfileConfig: SiteProfileConfig = {
  name: "Francisc Furdui",
  initials: "FF",
  avatarAlt: "Portrait of Francisc Furdui",
  avatarSources: [
    "/images/francisc-furdui.png",
    "/images/francisc-furdui.jpg",
    "/images/francisc-furdui.jpeg",
    "/images/profile.jpg",
    "/images/profile.jpeg",
    "/images/profile.png",
  ],
  introParagraphs: [
    "I build clear, structured digital products where strategy, systems, and execution stay tightly connected. I care about making complexity navigable, not performative.",
    "Recently, I have been focused on shaping this portfolio into a living operating artifact: documenting work with evidence, clarifying decisions, and designing interfaces that support thinking as much as presentation.",
    "I am always interested in collaborating with thoughtful people who value rigor, craft, and practical outcomes. If you are working on meaningful product or platform challenges, I would welcome the conversation.",
  ],
  contact: {
    email: "francisc.frd@gmail.com",
    subject: "Project Inquiry",
    ctaLabel: "Send email",
  },
};
