import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Resume",
  description:
    "Distilled experience across technical product management, UX design, and web engineering by Francisc Furdui.",
  openGraph: {
    title: "Resume — francisc.cv",
    description:
      "Distilled experience across technical product management, UX design, and web engineering by Francisc Furdui.",
    url: "/resume",
  },
  alternates: { canonical: "/resume" },
};

export default function ResumeLayout({ children }: { children: ReactNode }) {
  return children;
}
