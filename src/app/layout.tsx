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
import { SiteScaffold } from "@/components/layout/site-scaffold";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { siteUrl } from "@/config/site-url";
import { DialRoot } from "dialkit";
import "dialkit/styles.css";
import "./globals.css";

const siteName = "francisc.cv";
const siteDescription = "Portfolio and systems-thinking artifact by Francisc Furdui.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "oklch(100% 0 89.88)" },
    { media: "(prefers-color-scheme: dark)", color: "oklch(26.0325% 0 89.88)" },
  ],
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Francisc Furdui",
  url: siteUrl,
  email: "francisc.frd@gmail.com",
  image: `${siteUrl}/images/francisc-furdui.jpg`,
  jobTitle: "Technical Product Manager",
  description: siteDescription,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </head>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} ${GeistPixelSquare.variable} ${GeistPixelGrid.variable} ${GeistPixelCircle.variable} ${GeistPixelTriangle.variable} ${GeistPixelLine.variable}`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <SiteScaffold>{children}</SiteScaffold>
          <DialRoot />
        </ThemeProvider>
      </body>
    </html>
  );
}
