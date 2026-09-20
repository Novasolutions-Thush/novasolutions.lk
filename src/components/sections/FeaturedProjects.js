"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { useProjects } from "@/hooks/useProjects";

export default function FeaturedProjects() {
  const { projects, loading, error } = useProjects();

  // Featured first (sort is stable, so newest stays first inside each group)
  const list = [...projects]
    .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)))
    .slice(0, 3);

  // Hide the whole section if there is nothing to show
  if (!loading && (error || list.length === 0)) return null;

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <Reveal>
            <SectionHeading
              eyebrow="Featured Projects"
              title="Work we are proud of"
              description="A selection of recent projects that show how we solve real business problems."
            />
          </Reveal>

          <Reveal delay={0.1}>
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 font-semibold text-accent"
            >
              See all projects
              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {loading &&
            [0, 1, 2].map((i) => (
              <div key={i}>
                <div className="aspect-[4/3] w-full animate-pulse bg-line" />
                <div className="mt-5 h-5 w-2/3 animate-pulse bg-line" />
                <div className="mt-3 h-4 w-full animate-pulse bg-line" />
              </div>
            ))}

          {!loading &&
            list.map((project, i) => (
              <Reveal key={project.id} delay={(i % 3) * 0.08}>
                <Link href="/projects" className="group block">
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-primary-dark">
                    {project.image && (
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        className="object-cover transition-transform duration-700 ease-smooth group-hover:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 bg-primary-dark/0 transition-colors duration-500 group-hover:bg-primary-dark/55" />
                    <span className="absolute right-4 top-4 grid h-11 w-11 place-items-center bg-light-purple text-primary-dark opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <ArrowUpRight size={20} />
                    </span>
                    <span className="glass absolute bottom-4 left-4 px-3 py-1.5 text-xs font-medium text-ink">
                      {project.category}
                    </span>
                  </div>

                  <h3 className="mt-5 text-xl font-bold transition-colors duration-300 group-hover:text-accent">
                    {project.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft sm:text-base">
                    {project.description}
                  </p>
                </Link>
              </Reveal>
            ))}
        </div>
      </div>
    </section>
  );
} 