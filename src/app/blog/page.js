import PageHeader from "@/components/ui/PageHeader";
import Reveal from "@/components/ui/Reveal";
import BlogList from "@/components/sections/BlogList";
import CTASection from "@/components/sections/CTASection";

export const metadata = {
  title: "Blog",
  description:
    "Articles, guides and insights on software development, design and technology from Nova Solutions.",
};

export default function BlogPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Blog"
        title="Ideas, guides and insights"
        description="Practical articles on software, design and technology from the Nova Solutions team."
      />
      <section className="py-10 sm:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal>
            <BlogList />
          </Reveal>
        </div>
      </section>
      <CTASection />
    </main>
  );
}