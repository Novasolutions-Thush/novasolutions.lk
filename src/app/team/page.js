import PageHeader from "@/components/ui/PageHeader";
import TeamGrid from "@/components/sections/TeamGrid";
import CTASection from "@/components/sections/CTASection";

export const metadata = {
  title: "Our Team",
  description:
    "Meet the founder, developers and designers behind Nova Solutions.",
};

export default function TeamPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Team"
        title="Meet the people behind Nova Solutions"
        description="A small, focused team of developers, designers and engineers who care about building software properly."
      />
      <section className="pb-10 pt-4 sm:pb-16">
        <TeamGrid />
      </section>
      <CTASection />
    </main>
  );
}