import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import { ThemeScript } from "@/components/layout/ThemeScript";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import "./globals.css";

// Poppins is not a variable font — each weight is a separate download, so list only weights in use.
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

// Literals duplicating --bg from globals.css (theme-color can't read CSS vars) — keep in sync.
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
      <body className="flex min-h-full flex-col">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
