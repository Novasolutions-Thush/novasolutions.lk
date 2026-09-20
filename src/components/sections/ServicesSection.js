import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { services } from "@/data/services";

export default function ServicesSection() {
  return (
    <section className="relative py-20 sm:py-28">
      {/* Soft background band */}
      <div
        className="absolute inset-0 -z-10 bg-light-purple/10 dark:bg-deep-purple/10"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="Our Services"
            title="Everything you need to build and grow"
            description="From the first sketch to the final launch and beyond, we cover the complete software lifecycle."
          />
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <Reveal key={service.id} delay={(i % 3) * 0.08}>
                <article className="group relative h-full overflow-hidden border border-line bg-surface p-7 transition-colors duration-300 hover:border-accent">
                  {/* Number */}
                  <span className="absolute right-5 top-4 font-heading text-4xl font-extrabold text-accent/15 transition-colors duration-300 group-hover:text-accent/35">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* Icon */}
                  <div className="grid h-14 w-14 place-items-center bg-primary-dark text-light-purple transition-colors duration-300 group-hover:bg-light-purple group-hover:text-primary-dark dark:bg-deep-purple dark:text-white dark:group-hover:bg-light-purple dark:group-hover:text-primary-dark">
                    <Icon size={26} />
                  </div>

                  <h3 className="mt-6 text-xl font-bold">{service.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft sm:text-base">
                    {service.description}
                  </p>

                  <Link
                    href="/services"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent"
                  >
                    Learn more
                    <ArrowRight
                      size={16}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </Link>

                  {/* Bottom line that grows on hover */}
                  <span className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-deep-purple to-light-purple transition-transform duration-500 ease-smooth group-hover:scale-x-100" />
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-12 text-center">
            <Link
              href="/services"
              className="group inline-flex items-center gap-2 border border-accent px-7 py-3.5 font-medium text-accent transition-colors duration-300 hover:bg-accent hover:text-white dark:hover:text-primary-dark"
            >
              View All Services
              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}