"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { toolCategories, tools } from "@/data/tools";

export default function ToolsSection() {
  const [active, setActive] = useState("All");

  const visible =
    active === "All" ? tools : tools.filter((t) => t.category === active);

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="Our Tech Stack"
            title="Technologies & Tools We Master"
            description="The modern, proven technologies we use to build fast, secure and scalable products."
          />
        </Reveal>

        {/* Category tabs */}
        <Reveal delay={0.08}>
          <div
            className="mt-10 flex flex-wrap justify-center gap-2"
            role="tablist"
            aria-label="Technology categories"
          >
            {toolCategories.map((cat) => {
              const isActive = cat === active;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActive(cat)}
                  className={`border px-4 py-2 text-sm font-medium transition-colors duration-300 ${
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
        </Reveal>

        {/* Tool tiles */}
        <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          <AnimatePresence mode="popLayout">
            {visible.map((tool) => {
              const Icon = tool.icon;
              return (
                <motion.li
                  key={tool.name}
                  layout
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.3 }}
                  className="group flex items-center gap-3 border border-line bg-surface px-3.5 py-3 transition-colors duration-300 hover:border-accent"
                >
                  <Icon
                    size={24}
                    style={{ color: tool.adaptive ? "var(--ink)" : tool.color }}
                    className="shrink-0"
                    aria-hidden="true"
                  />
                  <span className="truncate text-sm font-medium">{tool.name}</span>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      </div>
    </section>
  );
}