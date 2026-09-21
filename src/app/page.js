import Hero from "@/components/sections/Hero";
import AboutPreview from "@/components/sections/AboutPreview";
import ServicesSection from "@/components/sections/ServicesSection";
import FeaturedProjects from "@/components/sections/FeaturedProjects";
import OngoingPreview from "@/components/sections/OngoingPreview";
import TeamPreview from "@/components/sections/TeamPreview";
import GalleryPreview from "@/components/sections/GalleryPreview";
import LatestPosts from "@/components/sections/LatestPosts";
import CTASection from "@/components/sections/CTASection";

export default function Home() {
  return (
    <main>
      <Hero />
      <AboutPreview />
      <ServicesSection />
      <FeaturedProjects />
      <OngoingPreview />
      <TeamPreview />
      <GalleryPreview />
      <LatestPosts />
      <CTASection />
    </main>
  );
}