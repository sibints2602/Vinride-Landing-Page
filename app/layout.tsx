import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import { ThemeScript } from "@/components/layout/ThemeScript";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
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
      className={`${inter.variable} ${outfit.variable} h-full`}
    >
      <head>
        <ThemeScript />
      </head>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
