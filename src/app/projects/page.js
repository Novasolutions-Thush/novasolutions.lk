import PageHeader from "@/components/ui/PageHeader";
import Reveal from "@/components/ui/Reveal";
import ProjectsGrid from "@/components/sections/ProjectsGrid";
import CTASection from "@/components/sections/CTASection";

export const metadata = {
  title: "Projects",
  description:
    "Explore recent web, mobile and cloud projects delivered by Nova Solutions.",
};

export default function ProjectsPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Projects"
        title="Real projects, real results"
        description="A selection of work that shows how we solve real business problems with technology and design."
      />

      <section className="py-10 sm:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal>
            <ProjectsGrid />
          </Reveal>
        </div>
      </section>

      <CTASection />
    </main>
  );
}