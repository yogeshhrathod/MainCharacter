import type { Metadata, Viewport } from "next";
import { VT323, Inter, Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const pixel = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const display = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const SITE_URL = "https://maincharacter.one";

const basePath = process.env.BASE_PATH?.trim() ?? "";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Main Character — Services & Products",
    template: "%s · Main Character",
  },
  description:
    "Main Character is a product and service company building AI-first products, interfaces, and business experiences with standout presence.",
  applicationName: "Main Character",
  keywords: [
    "Main Character",
    "ai design",
    "product company",
    "product studio",
    "services",
    "consulting",
    "software products",
    "ai products",
  ],
  authors: [{ name: "Main Character" }],
  creator: "Main Character",
  publisher: "Main Character",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Main Character",
    title: "Main Character — Services & Products",
    description:
      "A product and service company building AI-first products, interfaces, and business experiences with standout presence.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Main Character — Services & Products",
    description:
      "A product and service company building AI-first products, interfaces, and business experiences with standout presence.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  icons: { icon: `${basePath}/favicon.svg` },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf9" },
    { media: "(prefers-color-scheme: dark)", color: "#090909" },
  ],
  width: "device-width",
  initialScale: 1,
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Main Character",
  url: SITE_URL,
  email: "founder@maincharacter.one",
  description:
    "A product and service company building AI-first products, interfaces, and business experiences with standout presence.",
  sameAs: [],
};

const themeScript = `
(() => {
  try {
    const key = "main-character:theme";
    const saved = window.localStorage.getItem(key);
    const theme = saved === "light" || saved === "dark"
      ? saved
      : window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  } catch {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${pixel.variable} ${mono.variable} ${sans.variable} ${display.variable}`}
    >
      <body className="min-h-dvh antialiased">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <main className="min-h-dvh">
          {children}
        </main>
      </body>
    </html>
  );
}
