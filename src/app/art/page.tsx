import type { Metadata } from "next";
import { ArtPageClient } from "./art-page-client";

export const metadata: Metadata = {
  title: "Art Lab",
  description:
    "Standalone instrument lab for generating and tuning article art assignments.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ArtPage() {
  return <ArtPageClient />;
}
