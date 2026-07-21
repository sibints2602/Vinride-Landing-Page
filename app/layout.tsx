import type { Metadata, Viewport } from "next";
import { Geist, Instrument_Serif } from "next/font/google";
import { ThemeScript } from "@/components/layout/ThemeScript";
import "./globals.css";

// Variable font (wght 100-900), so `weight` is omitted deliberately.
const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
});

// Instrument Serif is NOT variable and ships weight 400 only, so `weight` is
// required here and "400" is the only value that typechecks. Never pair it
// with a font-bold/semibold utility: there is no bold cut, so the browser
// would synthesise one and smear the serif's contrast.
const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-instrument-serif",
});

export const metadata: Metadata = {
  title: "Vinride — Book a ride in minutes",
  description:
    "Vinride is a ride-hailing service for bikes, autos, sedans and SUVs. Upfront fares, verified captains, 24/7 support.",
  openGraph: {
    title: "Vinride — Book a ride in minutes",
    description:
      "Bikes, autos, sedans and SUVs. Upfront fares, verified captains, 24/7 support.",
    type: "website",
  },
};

// These two values duplicate --bg (light) and --bg (dark) from app/globals.css.
// <meta name="theme-color"> cannot read a CSS custom property, so they must be
// literals. If the --bg tokens change, update these in the same commit.
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf8" },
    { media: "(prefers-color-scheme: dark)", color: "#0e1412" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-theme="light"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${geist.variable} ${instrumentSerif.variable} h-full`}
    >
      <head>
        <ThemeScript />
      </head>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
