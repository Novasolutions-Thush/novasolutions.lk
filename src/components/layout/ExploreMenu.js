"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, ChevronDown } from "lucide-react";
import { exploreItems, exploreLabel } from "@/data/exploreMenu";

export default function ExploreMenu() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const active = exploreItems.some((i) => pathname.startsWith(i.href));

  // Close on page change
  useEffect(() => setOpen(false), [pathname]);

  // Close on Escape or outside click
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    const onClick = (e) =>
      ref.current && !ref.current.contains(e.target) && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={`relative flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors duration-300 ${
          active || open ? "text-ink" : "text-ink-soft hover:text-ink"
        }`}
      >
        {exploreLabel}
        <ChevronDown
          size={15}
          className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
        {active && (
          <motion.span
            layoutId="nav-underline"
            className="absolute inset-x-4 bottom-0.5 h-[2px] bg-accent"
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
          />
        )}
      </button>

      {/* Mega panel: anchored to the full-width header (fixed, right under it) */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-x-0 top-[var(--nav-h,4.75rem)] z-40 px-4 pt-0 sm:px-8 xl:px-12">
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              className="mx-auto grid max-w-6xl overflow-hidden border border-line bg-page shadow-[0_24px_60px_rgb(35_25_66/0.22)] lg:grid-cols-[17rem_1fr]"
            >
              {/* Intro (always dark) */}
              <div className="relative hidden overflow-hidden bg-primary-dark p-7 text-white lg:block">
                <div
                  className="pointer-events-none absolute -left-10 -top-10 h-44 w-44 rounded-full bg-deep-purple/50 blur-3xl"
                  aria-hidden="true"
                />
                <div className="relative">
                  <p className="font-heading text-xs font-semibold uppercase tracking-[0.25em] text-light-purple">
                    {exploreLabel}
                  </p>
                  <h3 className="mt-3 font-heading text-2xl font-extrabold leading-tight text-white">
                    More from Nova Solutions
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/70">
                    Our team, our work in progress, our stories and the people
                    behind the products.
                  </p>
                  <Link
                    href="/contact"
                    className="group mt-6 inline-flex items-center gap-2 bg-light-purple px-5 py-2.5 text-sm font-semibold text-primary-dark transition-colors duration-300 hover:bg-soft-lavender"
                  >
                    Get in touch
                    <ArrowRight
                      size={15}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </Link>
                </div>
              </div>

              {/* Cards */}
              <ul
                role="menu"
                className="grid gap-px bg-line sm:grid-cols-2 xl:grid-cols-3"
              >
                {exploreItems.map((item) => {
                  const Icon = item.icon;
                  const current = pathname.startsWith(item.href);
                  return (
                    <li key={item.slug} role="none" className="bg-page">
                      <Link
                        href={item.href}
                        role="menuitem"
                        className={`group flex h-full items-start gap-4 p-5 transition-colors duration-300 ${
                          current ? "bg-accent/10" : "hover:bg-accent/10"
                        }`}
                      >
                        <span className="grid h-11 w-11 shrink-0 place-items-center bg-primary-dark text-light-purple transition-colors duration-300 group-hover:bg-light-purple group-hover:text-primary-dark dark:bg-deep-purple dark:text-white dark:group-hover:bg-light-purple dark:group-hover:text-primary-dark">
                          <Icon size={20} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-2">
                            <span className="text-sm font-bold">{item.label}</span>
                            {!item.live && (
                              <span className="border border-accent/50 px-1.5 py-px text-[0.6rem] font-semibold uppercase tracking-wider text-accent">
                                Soon
                              </span>
                            )}
                          </span>
                          <span className="mt-1 block text-xs leading-relaxed text-ink-soft">
                            {item.short}
                          </span>
                        </span>
                        <ArrowUpRight
                          size={16}
                          className="shrink-0 text-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}