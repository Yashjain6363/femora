import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { ModuleTiles } from "@/components/sections/ModuleTiles";
import { MenstrualTrackerModule } from "@/components/modules/MenstrualTrackerModule";
import { CravingControlModule } from "@/components/modules/CravingControlModule";
import { HealthJournalModule } from "@/components/modules/HealthJournalModule";
import { HealthReminderModule } from "@/components/modules/HealthReminderModule";
import { PeriodPlanningModule } from "@/components/modules/PeriodPlanningModule";
import { FAQ } from "@/components/sections/FAQ";
import { ScrollProgress } from "@/components/shared/ScrollProgress";

export default function HomePage() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main id="main-content" className="bg-[#F8F3E9] text-[#101F3B] min-h-screen">
        {/* 1. Hero Experience (Centered Logo, Large FERMORA, Slogan) */}
        <Hero />

        {/* 2. Interactive Menu Tiles (5 Main Modules with Alternating Accents) */}
        <ModuleTiles />

        {/* 3. Core Module A: Menstrual Tracker */}
        <MenstrualTrackerModule />

        {/* 4. Core Module B: Craving Control */}
        <CravingControlModule />

        {/* 5. Core Module C: Health Journal */}
        <HealthJournalModule />

        {/* 6. Core Module D: Health Reminder */}
        <HealthReminderModule />

        {/* 7. Core Module E: Period-aware Planning */}
        <PeriodPlanningModule />

        {/* 8. Common Questions & Transparency */}
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
