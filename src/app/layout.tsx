import type { Metadata, Viewport } from "next";
import React, { type ReactNode } from "react";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import {
  GeistPixelSquare,
  GeistPixelGrid,
  GeistPixelCircle,
  GeistPixelTriangle,
  GeistPixelLine,
} from "geist/font/pixel";
import { AppShell } from "@/components/layout/app-shell";
import { MachineVersionContent } from "@/components/machine/machine-version-content";
import {
  createPersonSchema,
} from "@/config/site-home";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { siteUrl } from "@/config/site-url";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Agentation } from "agentation";
import "./globals.css";
const siteName = "francisc.cv";
const defaultTitle = "AI adoption & workflow systems — Francisc Furdui";
const siteDescription =
  "Technical program manager focused on AI adoption systems, workflow design, and knowledge structures teams can actually use.";
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: `%s — ${siteName}`,
  },
  description: siteDescription,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName,
    title: siteName,
    description: siteDescription,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "francisc.cv — portfolio by Francisc Furdui",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
    images: ["/opengraph-image"],
  },
  icons: {
    icon: "/images/favicon.jpg",
    shortcut: "/images/favicon.jpg",
    apple: "/images/favicon.jpg",
  },
  alternates: {
    canonical: siteUrl,
  },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    {
      media: "(prefers-color-scheme: light)",
      color: "oklch(100% 0 89.88)",
    },
    {
      media: "(prefers-color-scheme: dark)",
      color: "oklch(26.0325% 0 89.88)",
    },
  ],
};
const personSchema = createPersonSchema();
export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personSchema),
          }}
        />
      </head>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} ${GeistPixelSquare.variable} ${GeistPixelGrid.variable} ${GeistPixelCircle.variable} ${GeistPixelTriangle.variable} ${GeistPixelLine.variable}`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AppShell
            machineContent={<MachineVersionContent />}
          >
            {children}
          </AppShell>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
        {process.env.NODE_ENV === "development" && <Agentation />}
      </body>
    </html>
  );
}
