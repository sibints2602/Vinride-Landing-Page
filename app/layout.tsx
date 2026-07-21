import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import { ThemeScript } from "@/components/layout/ThemeScript";
import "./globals.css";

// Poppins is NOT a variable font, so `weight` is required and each cut listed
// here is downloaded separately. Keep this list to the weights actually used
// (400 body, 500 font-medium, 600 font-semibold, 700 display) — every extra
// entry is another font file on the critical path.
const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
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
      className={`${poppins.variable} h-full`}
    >
      <head>
        <ThemeScript />
      </head>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
