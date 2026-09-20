import { Check } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Reveal from "@/components/ui/Reveal";
import CTASection from "@/components/sections/CTASection";
import ProcessTimeline from "@/components/sections/ProcessTimeline";
import ToolsSection from "@/components/sections/ToolsSection";
import { services } from "@/data/services";

export const metadata = {
  title: "Services",
  description:
    "Web development, mobile apps, cloud, UI/UX design, custom software and support from Nova Solutions.",
};

export default function ServicesPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Services"
        title="Complete software services under one roof"
        description="From the first sketch to the final launch and beyond, we cover the whole software lifecycle."
      />

      {/* Detailed services */}
      <section className="py-10 sm:py-16">
        <div className="mx-auto max-w-7xl space-y-6 px-5 sm:px-8">
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <Reveal key={service.id}>
                <article className="group grid gap-8 border border-line bg-surface p-7 transition-colors duration-300 hover:border-accent sm:p-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
                  <div>
                    <div className="flex items-center gap-5">
                      <div className="grid h-16 w-16 shrink-0 place-items-center bg-primary-dark text-light-purple transition-colors duration-300 group-hover:bg-light-purple group-hover:text-primary-dark dark:bg-deep-purple dark:text-white dark:group-hover:bg-light-purple dark:group-hover:text-primary-dark">
                        <Icon size={30} />
                      </div>
                      <span className="font-heading text-5xl font-extrabold text-accent/20">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h2 className="mt-6 text-2xl font-extrabold sm:text-3xl">
                      {service.title}
                    </h2>
                    <p className="mt-3 leading-relaxed text-ink-soft">
                      {service.description}
                    </p>
                  </div>

                  <ul className="grid content-center gap-3">
                    {service.features.map((f) => (
                      <li key={f} className="flex items-start gap-3">
                        <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center bg-accent text-white dark:text-primary-dark">
                          <Check size={14} strokeWidth={3} />
                        </span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      <ProcessTimeline />
      <ToolsSection />
      <CTASection />
    </main>
  );
}