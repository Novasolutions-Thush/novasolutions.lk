"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CalendarClock } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { useAsyncList } from "@/hooks/useAsyncList";
import { getOngoing } from "@/lib/ongoing";

export default function OngoingPreview() {
  const { items, loading, error } = useAsyncList(getOngoing);

  // Hide the whole section when there is nothing to show
  if (!loading && (error || items.length === 0)) return null;

  const list = items.slice(0, 2);

  return (
    <section className="relative py-20 sm:py-28">
      <div className="absolute inset-0 -z-10 bg-light-purple/10 dark:bg-deep-purple/10" aria-hidden="true" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <Reveal>
            <SectionHeading
              eyebrow="Ongoing Projects"
              title="What we are building right now"
              description="A live look at the products our team is currently designing and developing."
            />
          </Reveal>
          <Reveal delay={0.1}>
            <Link href="/ongoing-projects" className="group inline-flex items-center gap-2 font-semibold text-accent">
              See all ongoing projects
              <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          {loading &&
            [0, 1].map((i) => <div key={i} className="h-80 animate-pulse bg-line" />)}

          {!loading &&
            list.map((p, i) => {
              const pct = Math.min(100, Math.max(0, Number(p.progress) || 0));
              return (
                <Reveal key={p.id} delay={(i % 2) * 0.08}>
                  <Link
                    href="/ongoing-projects"
                    className="group grid h-full gap-5 border border-line bg-surface p-4 transition-colors duration-300 hover:border-accent sm:grid-cols-[13rem_1fr]"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-primary-dark sm:aspect-auto sm:h-full sm:min-h-[11rem]">
                      {p.image ? (
                        <Image
                          src={p.image}
                          alt={p.title}
                          fill
                          sizes="(min-width: 640px) 208px, 100vw"
                          className="object-cover transition-transform duration-700 ease-smooth group-hover:scale-105"
                        />
                      ) : (
                        <div className="grid h-full place-items-center bg-gradient-to-br from-primary-dark to-deep-purple font-brand text-xl font-bold text-soft-lavender">
                          Nova Solutions
                        </div>
                      )}
                    </div>

                    <div className="flex min-w-0 flex-col">
                      <span className="w-fit bg-accent/15 px-2 py-0.5 text-xs font-medium text-accent">
                        {p.status}
                      </span>
                      <h3 className="mt-2 text-xl font-bold transition-colors duration-300 group-hover:text-accent">
                        {p.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-soft">
                        {p.description}
                      </p>

                      <div className="mt-auto pt-4">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium">Progress</span>
                          <span className="font-heading font-extrabold text-accent">{pct}%</span>
                        </div>
                        <div className="mt-1.5 h-2 w-full bg-line" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${p.title} progress`}>
                          <motion.div
                            className="h-full bg-gradient-to-r from-deep-purple to-light-purple"
                            initial={{ width: 0 }}
                            whileInView={{ width: `${pct}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                          />
                        </div>
                        {p.launch && (
                          <p className="mt-3 inline-flex items-center gap-2 text-xs text-ink-soft">
                            <CalendarClock size={14} className="text-accent" />
                            Launch: {p.launch}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
        </div>
      </div>
    </section>
  );
}