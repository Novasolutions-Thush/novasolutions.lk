"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "framer-motion";
import { ArrowRight, Mail, Menu, Phone, X } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import LogoMark from "@/components/ui/LogoMark";
import SocialLinks from "@/components/ui/SocialLinks";
import ExploreMenu from "@/components/layout/ExploreMenu";
import { useSettings } from "@/context/SettingsContext";
import { telHref } from "@/data/siteDefaults";
import { exploreItems, exploreLabel } from "@/data/exploreMenu";

const links = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/contact" },
];

const EASE = [0.22, 1, 0.36, 1];

// 1. Logo size එක 50% කින් වැඩි කරන ලදී (52 -> 78)
function Brand({ onClick, size = 52 }) {
  return (
    <Link
      href="/"
      onClick={onClick}
      aria-label="Nova Solutions home"
      className="group flex items-center gap-4"
    >
      <LogoMark
        size={size}
        className="transition-transform duration-500 ease-smooth group-hover:scale-105"
      />
      <span className="whitespace-nowrap font-logo text-[1.25rem] font-bold uppercase leading-none tracking-[0.1em] text-ink sm:text-[1.45rem]">
        Nova Solutions
      </span>
    </Link>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const { settings } = useSettings();

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Scroll progress line
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    mass: 0.3,
  });

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 10);
  });

  // Close the mobile panel when the page changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock page scroll and allow Escape while the panel is open
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b border-line bg-page transition-all duration-500 ${
          scrolled ? "shadow-[0_6px_24px_rgb(35_25_66/0.14)]" : ""
        }`}
      >
        <nav
          aria-label="Main"
          className={`relative mx-auto flex w-full items-center justify-between gap-4 px-4 transition-[padding] duration-500 ease-smooth sm:px-8 xl:px-12 ${
            scrolled ? "py-4" : "py-6"
          }`}
        >
          {/* Left Side: Brand (Logo එක scroll පරිදි 66 / 78 ලෙස 50% කින් ලොකු කර ඇත) */}
          <div className="pl-0 sm:pl-8 md:pl-14 xl:pl-20 transition-all duration-500">
            <Brand size={scrolled ? 46 : 52} />
          </div>

          {/* Desktop links */}
          <ul className="hidden items-center xl:flex">
            {links.map((link) => {
              const active = isActive(link.href);
              return (
                <li key={link.href} className="flex items-center">
                  {link.href === "/contact" && <ExploreMenu />}
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`group relative block px-4 py-2.5 text-base font-medium transition-colors duration-300 ${
                      active ? "text-ink" : "text-ink-soft hover:text-ink"
                    }`}
                  >
                    {link.label}

                    {active && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute inset-x-4 bottom-0.5 h-[2px] bg-accent"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}

                    {!active && (
                      <span className="absolute inset-x-4 bottom-0.5 h-[2px] origin-left scale-x-0 bg-accent/60 transition-transform duration-300 ease-smooth group-hover:scale-x-100" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right Side: Quote Button & Controls */}
          <div className="flex items-center gap-3 pr-0 sm:pr-8 md:pr-14 xl:pr-20 transition-all duration-500">
            <ThemeToggle />

            <Link
              href="/contact"
              className="group hidden items-center gap-2 bg-primary-dark px-6 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-deep-purple sm:inline-flex dark:bg-light-purple dark:text-primary-dark dark:hover:bg-soft-lavender"
            >
              Get a Quote
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              className="grid h-11 w-11 place-items-center border border-line text-ink transition-colors duration-300 hover:border-accent hover:text-accent xl:hidden"
            >
              <Menu size={22} />
            </button>
          </div>

          {/* Scroll progress line */}
          <motion.span
            style={{ scaleX: progress }}
            className="absolute inset-x-0 -bottom-px h-[2px] origin-left bg-gradient-to-r from-deep-purple via-muted-purple to-light-purple"
            aria-hidden="true"
          />
        </nav>
      </header>

      {/* Mobile panel */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[60] bg-black/60 xl:hidden"
              aria-hidden="true"
            />

            <motion.aside
              key="panel"
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35, ease: EASE }}
              className="fixed inset-y-0 right-0 z-[70] flex w-[88vw] max-w-sm flex-col border-l border-line bg-surface xl:hidden"
            >
              <div className="flex items-center justify-between border-b border-line px-5 py-4">
                <Brand size={44} onClick={() => setOpen(false)} />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="grid h-10 w-10 place-items-center border border-line text-ink transition-colors duration-300 hover:border-accent hover:text-accent"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto px-5 py-6" aria-label="Mobile">
                <ul>
                  {links.map((link, i) => {
                    const active = isActive(link.href);
                    return (
                      <motion.li
                        key={link.href}
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.06 + i * 0.05, duration: 0.4, ease: EASE }}
                        className="border-b border-line"
                      >
                        <Link
                          href={link.href}
                          onClick={() => setOpen(false)}
                          aria-current={active ? "page" : undefined}
                          className={`group flex items-center gap-4 py-4 transition-colors duration-300 ${
                            active ? "text-accent" : "text-ink hover:text-accent"
                          }`}
                        >
                          <span className="font-heading text-xs font-extrabold text-accent/60">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="flex-1 font-heading text-2xl font-extrabold">
                            {link.label}
                          </span>
                          <ArrowRight
                            size={20}
                            className="transition-transform duration-300 group-hover:translate-x-1"
                          />
                        </Link>
                      </motion.li>
                    );
                  })}
                </ul>

                <div className="mt-8">
                  <p className="text-xs font-semibold uppercase tracking-widest text-ink-soft">
                    {exploreLabel}
                  </p>
                  <ul className="mt-3 space-y-1">
                    {exploreItems.map((item) => {
                      const Icon = item.icon;
                      const current = pathname.startsWith(item.href);
                      return (
                        <li key={item.slug}>
                          <Link
                            href={item.href}
                            onClick={() => setOpen(false)}
                            aria-current={current ? "page" : undefined}
                            className={`flex items-center gap-3 border px-3 py-3 transition-colors duration-300 ${
                              current
                                ? "border-accent text-accent"
                                : "border-line text-ink hover:border-accent hover:text-accent"
                            }`}
                          >
                            <Icon size={18} className="shrink-0 text-accent" />
                            <span className="flex-1 text-sm font-medium">{item.label}</span>
                            {!item.live && (
                              <span className="border border-accent/50 px-1.5 py-px text-[0.6rem] font-semibold uppercase tracking-wider text-accent">
                                Soon
                              </span>
                            )}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </nav>

              <div className="space-y-5 border-t border-line px-5 py-5">
                <Link
                  href="/contact"
                  onClick={() => setOpen(false)}
                  className="group flex items-center justify-center gap-2 bg-primary-dark px-5 py-3.5 font-semibold text-white transition-colors duration-300 hover:bg-deep-purple dark:bg-light-purple dark:text-primary-dark dark:hover:bg-soft-lavender"
                >
                  Get a Quote
                  <ArrowRight
                    size={18}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>

                <ul className="space-y-2 text-sm text-ink-soft">
                  {settings.email && (
                    <li>
                      <a
                        href={`mailto:${settings.email}`}
                        className="flex items-center gap-3 transition-colors duration-300 hover:text-accent"
                      >
                        <Mail size={16} className="shrink-0 text-accent" />
                        <span className="break-all">{settings.email}</span>
                      </a>
                    </li>
                  )}
                  {settings.phone && (
                    <li>
                      <a
                        href={telHref(settings.phone)}
                        className="flex items-center gap-3 transition-colors duration-300 hover:text-accent"
                      >
                        <Phone size={16} className="shrink-0 text-accent" />
                        {settings.phone}
                      </a>
                    </li>
                  )}
                </ul>

                <SocialLinks socials={settings.socials} variant="theme" />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
