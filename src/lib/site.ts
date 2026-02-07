export const siteConfig = {
  name: "Francisc Furdui",
  domain: "francisc.cv",
  url: "https://francisc.cv",
  email: "francisc.frd@gmail.com",
  description:
    "Product-oriented technologist with 9+ years across UX, WordPress engineering, platform systems, and security-aware delivery.",
  nav: [
    { href: "/", label: "Home" },
    { href: "/projects", label: "Projects" },
    { href: "/writing", label: "Writing" },
    { href: "/about", label: "About" },
    { href: "/resume", label: "Resume" },
    { href: "/now", label: "Now" },
  ],
  socials: [
    { label: "GitHub", href: "https://github.com/francisc" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/francisc/" },
    { label: "X", href: "https://x.com/francisc" },
  ],
  signals: [
    "Requirements",
    "User stories",
    "Acceptance criteria",
    "Docs as product",
    "WordPress architecture",
    "Cloud + security operations",
    "UX information architecture",
    "Developer experience",
  ],
} as const;

export const paletteHint = "Press ⌘K";
