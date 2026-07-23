import { SKIP_LINK_LABEL } from "@/content/site";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { Hero } from "@/components/sections/Hero";
import { StatsStrip } from "@/components/sections/StatsStrip";
import { RideOptions } from "@/components/sections/RideOptions";
import { WhyVinride } from "@/components/sections/WhyVinride";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { CustomerStories } from "@/components/sections/CustomerStories";
import { DriveSafety } from "@/components/sections/DriveSafety";
import { AppDownload } from "@/components/sections/AppDownload";

export default function HomePage() {
  return (
    <>
      <a
        href="#top"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-brand-yellow focus:px-4 focus:py-2 focus:text-ink"
      >
        {SKIP_LINK_LABEL}
      </a>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <StatsStrip />
        <RideOptions />
        <WhyVinride />
        <HowItWorks />
        <CustomerStories />
        <DriveSafety />
        <AppDownload />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
