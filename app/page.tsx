import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { StatsStrip } from "@/components/sections/StatsStrip";
import { RideCategories } from "@/components/sections/RideCategories";
import { WhyVinride } from "@/components/sections/WhyVinride";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { FareTable } from "@/components/sections/FareTable";
import { DriveWithUs } from "@/components/sections/DriveWithUs";
import { Safety } from "@/components/sections/Safety";
import { AppDownload } from "@/components/sections/AppDownload";

export default function HomePage() {
  return (
    <>
      <a
        href="#ride"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-brand-yellow focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <StatsStrip />
        <RideCategories />
        <WhyVinride />
        <HowItWorks />
        <FareTable />
        <DriveWithUs />
        <Safety />
        <AppDownload />
      </main>
      <Footer />
    </>
  );
}
