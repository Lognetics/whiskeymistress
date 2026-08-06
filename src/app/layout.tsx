import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";
import { siteUrl } from "@/lib/site-url";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-poppins",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});


export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Whiskey Mistress — Luxury Dining, Lounge & Entertainment in Abuja",
    template: "%s · Whiskey Mistress",
  },
  description:
    "Abuja's premier luxury dining and entertainment destination. Fine dining, signature cocktails, VIP lounges, live entertainment and private events in Wuse II. Reserve your table.",
  keywords: [
    "Abuja restaurant",
    "luxury dining Abuja",
    "Wuse II lounge",
    "private dining Abuja",
    "fine dining Nigeria",
    "cocktail bar Abuja",
    "Whiskey Mistress",
  ],
  applicationName: "Whiskey Mistress",
  authors: [{ name: "Whiskey Mistress" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: siteUrl,
    siteName: "Whiskey Mistress",
    title: "Whiskey Mistress — Luxury Dining, Lounge & Entertainment in Abuja",
    description:
      "Exceptional cuisine, elegant hospitality and immersive entertainment in the heart of Abuja. Reserve a table or plan a private celebration.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Whiskey Mistress — Luxury Dining & Entertainment, Abuja",
    description:
      "Fine dining, signature cocktails, VIP lounges and live entertainment in Wuse II, Abuja.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  category: "restaurant",
};

export const viewport: Viewport = {
  themeColor: "#0b0b0b",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-NG"
      className={`${playfair.variable} ${poppins.variable} ${inter.variable}`}
    >
      <body className="antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-200 focus:rounded-full focus:bg-gold focus:px-6 focus:py-3 focus:font-ui focus:text-sm focus:font-medium focus:text-ink"
        >
          Skip to content
        </a>
        {children}
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ? (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');`,
              }}
            />
          </>
        ) : null}
      </body>
    </html>
  );
}
