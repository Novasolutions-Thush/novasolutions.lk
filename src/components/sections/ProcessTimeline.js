import Reveal from "@/components/ui/Reveal";
import { processSteps } from "@/data/process";

export default function ProcessTimeline() {
  return (
    <section className="relative py-16 sm:py-24">
      <div
        className="absolute inset-0 -z-10 bg-light-purple/10 dark:bg-deep-purple/10"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-heading text-xs font-semibold uppercase tracking-[0.25em] text-accent sm:text-sm">
              Workflow &amp; Execution
            </p>
            <h2 className="mt-4 text-[clamp(1.9rem,3.6vw,3.5rem)] font-extrabold leading-[1.1]">
              Our Development{" "}
              <span className="bg-gradient-to-r from-deep-purple via-muted-purple to-light-purple bg-clip-text text-transparent">
                Process
              </span>
            </h2>
            <span className="mx-auto mt-5 block h-1 w-24 bg-accent" />
            <p className="mt-5 text-base leading-relaxed text-ink-soft sm:text-lg">
              How we systematically flow your innovative ideas into
              high-performance digital reality.
            </p>
          </div>
        </Reveal>

        <ol className="relative mt-16">
          {/* Vertical line */}
          <div
            className="absolute bottom-0 left-5 top-0 w-0.5 -translate-x-1/2 bg-gradient-to-b from-accent via-accent/60 to-accent/10 md:left-1/2"
            aria-hidden="true"
          />

          {processSteps.map((step, i) => {
            const Icon = step.icon;
            const right = i % 2 === 0; // odd steps on the right (desktop)

            return (
              <li
                key={step.title}
                className={`relative pb-10 pl-14 last:pb-0 md:w-1/2 ${
                  right ? "md:ml-auto md:pl-14" : "md:pl-0 md:pr-14"
                }`}
              >
                {/* Number circle */}
                <span
                  className={`absolute top-6 grid h-10 w-10 place-items-center rounded-full bg-accent font-heading text-sm font-extrabold text-white shadow-[0_0_0_6px_rgb(159_134_192/0.25)] ring-4 ring-surface dark:text-primary-dark ${
                    right
                      ? "left-0 md:-translate-x-1/2"
                      : "left-0 md:left-auto md:right-0 md:translate-x-1/2"
                  }`}
                  aria-hidden="true"
                >
                  {i + 1}
                </span>

                <Reveal delay={0.05}>
                  <div className="group relative border border-line bg-surface p-6 transition-colors duration-300 hover:border-accent sm:p-7">
                    {/* Small accent bar on top */}
                    <span className="absolute left-6 top-0 h-[3px] w-12 bg-accent transition-all duration-500 group-hover:w-24" />

                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-xl font-extrabold">{step.title}</h3>
                      <Icon
                        size={24}
                        className="mt-0.5 shrink-0 text-accent"
                        aria-hidden="true"
                      />
                    </div>

                    <p className="mt-3 text-sm leading-relaxed text-ink-soft sm:text-base">
                      {step.text}
                    </p>

                    <ul className="mt-4 flex flex-wrap gap-2">
                      {step.tags.map((t) => (
                        <li
                          key={t}
                          className="border border-line px-2.5 py-1 text-xs text-ink-soft"
                        >
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}