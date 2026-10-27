import type { Metadata } from "next";
import { Bebas_Neue, Outfit } from "next/font/google";
import Script from "next/script";
import "../globals.css";
import PublicChrome from "@/components/PublicChrome";
import { IMG } from "@/lib/siteImages";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mcklunky.co.uk"),
  title: {
    default: "McKlunky | Bold British Food Delivered Across the UK",
    template: "%s | McKlunky",
  },
  description:
    "McKlunky — bold British comfort food, fresh burgers, sides & combos. Order online for delivery across the United Kingdom.",
  keywords: [
    "McKlunky",
    "UK food delivery",
    "British burgers",
    "order food online UK",
    "comfort food UK",
    "burger delivery UK",
    "McKlunky menu",
    "takeaway UK",
    "food delivery England",
  ],
  authors: [{ name: "McKlunky", url: "https://mcklunky.co.uk" }],
  creator: "McKlunky",
  publisher: "McKlunky",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://mcklunky.co.uk",
    siteName: "McKlunky",
    title: "McKlunky | Bold British Food Delivered Across the UK",
    description:
      "Bold British comfort food — burgers, sides & combos. Order online for delivery across the UK.",
    images: [
      {
        url: IMG.hero,
        width: 1200,
        height: 630,
        alt: "McKlunky — Bold British Food",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "McKlunky | Bold British Food Delivered Across the UK",
    description:
      "Bold British comfort food — burgers, sides & combos. Order online for delivery across the UK.",
    images: [IMG.hero],
  },
  icons: {
    icon: "/favicon.png",
  },
};

export default function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB" className={`h-full ${bebas.variable} ${outfit.variable}`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col antialiased font-[family-name:var(--font-body)]" suppressHydrationWarning>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-Y7DEMZ1WL5"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-Y7DEMZ1WL5');
          `}
        </Script>
        <PublicChrome>{children}</PublicChrome>
      </body>
    </html>
  );
}
