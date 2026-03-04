export type ResumeRole = "tpm" | "ux" | "security" | "wordpress" | "general";

export const resumeRoleLabels: Record<ResumeRole, string> = {
  tpm: "TPM",
  ux: "UI/UX",
  security: "Security",
  wordpress: "WordPress",
  general: "General",
};

export const resumePDFs: Record<ResumeRole, string> = {
  tpm: "/resumes/francisc-furdui-technical-product-manager.pdf",
  ux: "/resumes/francisc-furdui-ui-ux.pdf",
  security: "/resumes/francisc-furdui-cybersecurity-analyst.pdf",
  wordpress: "/resumes/francisc-furdui-wordpress-developer.pdf",
  general: "/resumes/francisc-furdui-general.pdf",
};

export type ExperienceEntry = {
  title: string;
  company: string;
  location: string;
  period: string;
  bullets: string[];
  roles: ResumeRole[];
};

export type SkillRow = {
  area: string;
  capabilities: string;
};

export const resumeData = {
  summary:
    "Product-oriented technologist with 9+ years of experience working across business requirements, UX decisions, and technical delivery. I build clarity in complex environments through strong documentation, explicit scope, and durable implementation patterns.",

  highlights: [
    "9+ years across product, UX, web engineering, and systems/security operations.",
    "60+ websites and platform implementations delivered for SMEs and research organizations.",
    "Technical lead on a secure accounting integration platform (Sage50 context).",
    "Hands-on infrastructure and security work across Cloudflare, AWS, Linux, and monitoring pipelines.",
  ],

  experience: [
    {
      title: "Product & Technical Consultant / Founder",
      company: "SYNQ Group LLC",
      location: "Boston, MA",
      period: "2020 — Present",
      bullets: [
        "Act as the bridge between stakeholders, designers, and engineers.",
        "Define problem statements, user stories, acceptance criteria, and delivery constraints.",
        "Deliver handover documentation: system overviews, setup guides, and maintenance instructions.",
        "Architect and maintain WordPress environments focused on performance, reliability, and security.",
      ],
      roles: ["tpm", "wordpress", "general"] as ResumeRole[],
    },
    {
      title: "Digital Experience Designer / Technical Generalist",
      company: "Independent",
      location: "Dublin, Ireland",
      period: "2016 — 2020",
      bullets: [
        "Designed and delivered 60+ web products across multiple industries.",
        "Built IA, user flows, and UX decisions aligned with technical constraints.",
        "Implemented conversion and analytics instrumentation (Hotjar, Clarity, GA/GTM) and iterative UX improvements.",
      ],
      roles: ["ux", "general"] as ResumeRole[],
    },
    {
      title: "Technical Lead",
      company: "Suntico Holdings",
      location: "Dublin, Ireland",
      period: "2014 — 2017",
      bullets: [
        "Led delivery for a secure, web-based accounting integration platform.",
        "Coordinated engineering, compliance, and business requirements.",
        "Defined internal API usage, access models, and governance documentation.",
      ],
      roles: ["tpm", "security", "general"] as ResumeRole[],
    },
  ] as ExperienceEntry[],

  skills: [
    {
      area: "Product execution",
      capabilities: "Requirements definition, user stories, acceptance criteria, trade-off analysis",
    },
    {
      area: "UX and design",
      capabilities: "Information architecture, wireframing, usability testing, stakeholder workshops",
    },
    {
      area: "WordPress engineering",
      capabilities: "WooCommerce, Elementor, ACF, custom integrations, migration and scaling",
    },
    {
      area: "Infrastructure and security",
      capabilities: "Cloudflare WAF, SSL/TLS, DNS, NGINX, Redis, MySQL, vulnerability and incident workflows",
    },
    {
      area: "Automation and tooling",
      capabilities: "Bash, Python, JavaScript, Git, monitoring and reporting automation",
    },
  ] as SkillRow[],

  education: {
    degree: "BEng/BSc in Enterprise Computing",
    institution: "Dublin City University",
    year: "2024",
    coursework:
      "Software Engineering, Enterprise Systems, System Integration, Cloud Platforms, Data Security, Human-Computer Interaction.",
  },

  certifications: "In progress: CompTIA Security+, ISC2 Certified in Cybersecurity.",
};
