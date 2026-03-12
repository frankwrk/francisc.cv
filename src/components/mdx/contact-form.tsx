import { siteProfileConfig } from "@/config/site-profile";

export function ContactForm() {
  const mailtoHref = `mailto:${siteProfileConfig.contact.email}?subject=${encodeURIComponent(siteProfileConfig.contact.subject)}`;

  return (
    <div
      className="mt-6 rounded-sm border border-[var(--scaffold-line)] p-4"
     
    >
      <p
        className="text-[10px] tracking-[0.18em] text-[var(--scaffold-ruler)] [font-family:var(--font-geist-pixel-square)]"
       
      >
        CONTACT
      </p>
      <p
        className="mt-2 text-[14px] leading-6 text-[var(--scaffold-ruler)]"
       
      >
        Email works best for roles and collaborations.
      </p>
      <a
        href={mailtoHref}
        className="mt-3 inline-flex items-center rounded-full border border-[var(--scaffold-line)] px-3 py-1.5 text-[11px] tracking-[0.08em] text-[var(--scaffold-toggle-text-active)] transition-colors hover:border-[var(--scaffold-ruler)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--scaffold-ruler)]"
       
      >
        {siteProfileConfig.contact.email}
      </a>
    </div>
  );
}
