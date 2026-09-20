import Hero from "@/components/sections/Hero";
import AboutPreview from "@/components/sections/AboutPreview";
import ServicesSection from "@/components/sections/ServicesSection";
import FeaturedProjects from "@/components/sections/FeaturedProjects";
import CTASection from "@/components/sections/CTASection";

export default function Home() {
  return (
    <main>
      <Hero />
      <AboutPreview />
      <ServicesSection />
      <FeaturedProjects />
      <CTASection />
    </main>
  );
}