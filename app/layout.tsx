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
    "Main Character is a service and product studio. We design, build, and ship work that puts our clients in the lead role.",
  applicationName: "Main Character",
  keywords: [
    "Main Character",
    "design studio",
    "product studio",
    "services",
    "consulting",
    "software products",
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
      "A service and product studio building work that puts our clients in the lead role.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Main Character — Services & Products",
    description:
      "A service and product studio building work that puts our clients in the lead role.",
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
  themeColor: "#fafaf9",
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
    "A service and product studio building work that puts our clients in the lead role.",
  sameAs: [],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${pixel.variable} ${mono.variable} ${sans.variable} ${display.variable}`}>
      <body className="min-h-dvh antialiased">
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
