"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, RefreshCw } from "lucide-react";
import { useProjects } from "@/hooks/useProjects";

function Skeleton() {
  return (
    <div>
      <div className="aspect-[4/3] w-full animate-pulse bg-line" />
      <div className="mt-5 h-5 w-2/3 animate-pulse bg-line" />
      <div className="mt-3 h-4 w-full animate-pulse bg-line" />
    </div>
  );
}

export default function ProjectsGrid() {
  const { projects, loading, error, reload } = useProjects();
  const [active, setActive] = useState("All");

  const categories = useMemo(
    () => ["All", ...new Set(projects.map((p) => p.category))],
    [projects]
  );

  const visible =
    active === "All" ? projects : projects.filter((p) => p.category === active);

  if (loading) {
    return (
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-line bg-surface p-10 text-center">
        <p className="font-semibold">Projects could not be loaded right now.</p>
        <button
          type="button"
          onClick={reload}
          className="mt-5 inline-flex items-center gap-2 border border-accent px-5 py-2.5 text-sm font-medium text-accent transition-colors duration-300 hover:bg-accent hover:text-white dark:hover:text-primary-dark"
        >
          <RefreshCw size={16} />
          Try again
        </button>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="border border-line bg-surface p-10 text-center">
        <p className="font-semibold">New projects are coming soon.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Project categories">
        {categories.map((cat) => {
          const isActive = cat === active;
          return (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(cat)}
              className={`border px-5 py-2.5 text-sm font-medium transition-colors duration-300 ${
                isActive
                  ? "border-primary-dark bg-primary-dark text-white dark:border-light-purple dark:bg-light-purple dark:text-primary-dark"
                  : "border-line text-ink-soft hover:border-accent hover:text-accent"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <motion.div layout className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visible.map((project) => (
            <motion.article
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link href={`/projects/${project.id}`} className="group block">
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
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-soft sm:text-base">
                  {project.description}
                </p>

                {project.tech?.length > 0 && (
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {project.tech.slice(0, 4).map((t) => (
                      <li key={t} className="border border-line px-2.5 py-1 text-xs text-ink-soft">
                        {t}
                      </li>
                    ))}
                  </ul>
                )}

                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent">
                  View full details
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}