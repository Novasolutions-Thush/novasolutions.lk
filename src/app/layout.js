import { Roboto, Plus_Jakarta_Sans, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { SettingsProvider } from "@/context/SettingsContext";
import SiteShell from "@/components/layout/SiteShell";
import { siteConfig, siteUrl } from "@/lib/site";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteConfig.title,
    template: "%s | Nova Solutions",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.name, url: siteUrl }],
  creator: siteConfig.name,
  publisher: siteConfig.legalName,
  // "./" makes every page point to its own URL as the canonical link
  alternates: { canonical: "./" },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: "en_LK",
    title: siteConfig.title,
    description: siteConfig.description,
    url: "./",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  ...(process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION
    ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION } }
    : {}),
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#edf2f4" },
    { media: "(prefers-color-scheme: dark)", color: "#120d24" },
  ],
};

// Structured data: tells Google the site name, the organisation and its logo
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: siteConfig.name,
      legalName: siteConfig.legalName,
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
        width: 512,
        height: 512,
      },
      email: siteConfig.email,
      areaServed: "LK",
      sameAs: siteConfig.sameAs,
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: siteConfig.name,
      alternateName: siteConfig.alternateNames,
      inLanguage: "en",
      publisher: { "@id": `${siteUrl}/#organization` },
    },
  ],
};

// Runs before first paint to prevent a theme flash.
const themeScript = `
(function () {
  try {
    var theme = null;
    var raw = localStorage.getItem('nova-theme-override');
    if (raw) {
      var o = JSON.parse(raw);
      if ((o.theme === 'light' || o.theme === 'dark') && Date.now() < o.until) {
        theme = o.theme;
      }
    }
    if (!theme) {
      var h = new Date().getHours();
      theme = h >= 6 && h < 18 ? 'light' : 'dark';
    }
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();
`;

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${roboto.variable} ${jakarta.variable} ${cormorant.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider>
          <AuthProvider>
            <SettingsProvider>
              <SiteShell>{children}</SiteShell>
            </SettingsProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}