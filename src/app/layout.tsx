import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { GeistPixelSquare } from "geist/font/pixel";
import { AppShell } from "@/components/site/app-shell";
import { getSearchEntries } from "@/lib/content";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const themeInitScript = `
(function() {
  try {
    var key = 'francisc-theme';
    var theme = localStorage.getItem(key);
    if (theme === 'dark' || theme === 'light') {
      document.documentElement.classList.add(theme);
    }
  } catch (e) {}
})();
`;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} · Product-minded technologist`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    title: `${siteConfig.name} · Product-minded technologist`,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.domain,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} portfolio`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} · Product-minded technologist`,
    description: siteConfig.description,
    images: ["/opengraph-image"],
  },
  alternates: {
    canonical: "/",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const searchEntries = await getSearchEntries();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable} ${GeistPixelSquare.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="bg-bg font-sans text-fg antialiased">
        <AppShell searchEntries={searchEntries}>{children}</AppShell>
      </body>
    </html>
  );
}
