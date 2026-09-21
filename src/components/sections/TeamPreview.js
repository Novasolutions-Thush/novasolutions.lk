"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { useAsyncList } from "@/hooks/useAsyncList";
import { getTeam } from "@/lib/team";

function initials(name = "") {
  return name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");
}

export default function TeamPreview() {
  const { items, loading, error } = useAsyncList(getTeam);

  // Hide the whole section when there is nothing to show
  if (!loading && (error || items.length === 0)) return null;

  // Leaders first, then the rest (max 4 people)
  const list = [...items.filter((m) => m.leader), ...items.filter((m) => !m.leader)].slice(0, 4);

  return (
    <section className="relative py-20 sm:py-28">
      <div className="absolute inset-0 -z-10 bg-light-purple/10 dark:bg-deep-purple/10" aria-hidden="true" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <Reveal>
            <SectionHeading
              eyebrow="Our Team"
              title="Meet the people behind the work"
              description="A focused team of developers, designers and engineers who care about building software properly."
            />
          </Reveal>
          <Reveal delay={0.1}>
            <Link href="/team" className="group inline-flex items-center gap-2 font-semibold text-accent">
              Meet the whole team
              <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {loading &&
            [0, 1, 2, 3].map((i) => (
              <div key={i}>
                <div className="aspect-[4/5] w-full animate-pulse bg-line" />
                <div className="mt-4 h-5 w-2/3 animate-pulse bg-line" />
                <div className="mt-2 h-4 w-1/2 animate-pulse bg-line" />
              </div>
            ))}

          {!loading &&
            list.map((m, i) => (
              <Reveal key={m.id} delay={(i % 4) * 0.07}>
                <Link href="/team" className="group block">
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-primary-dark">
                    {m.photo ? (
                      <Image
                        src={m.photo}
                        alt={m.name}
                        fill
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-700 ease-smooth group-hover:scale-105"
                      />
                    ) : (
                      <div className="grid h-full place-items-center font-heading text-5xl font-extrabold text-light-purple">
                        {initials(m.name)}
                      </div>
                    )}
                    {m.leader && (
                      <span className="glass absolute left-3 top-3 px-3 py-1 text-xs font-semibold text-ink">
                        Leadership
                      </span>
                    )}
                  </div>
                  <h3 className="mt-4 text-lg font-bold transition-colors duration-300 group-hover:text-accent">
                    {m.name}
                  </h3>
                  <p className="text-sm font-medium text-accent">{m.role}</p>
                </Link>
              </Reveal>
            ))}
        </div>
      </div>
    </section>
  );
}