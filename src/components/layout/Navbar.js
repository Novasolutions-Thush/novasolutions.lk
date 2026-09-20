"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, LogIn, Menu, X } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useAuth } from "@/context/AuthContext";
import LogoMark from "@/components/ui/LogoMark";

const links = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAdmin } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4">
      <nav
        className={`glass mx-auto flex max-w-6xl items-center justify-between rounded-full px-4 transition-all duration-500 ease-smooth sm:px-6 ${
          scrolled ? "py-1.5" : "py-2.5"
        }`}
      >
        {/* Brand */}
        <Link
          href="/"
          onClick={() => setOpen(false)}  
          className="group flex items-center gap-2"
          aria-label="Nova Solutions home"
        >
          <LogoMark
            size={36}
            className="transition-transform duration-500 ease-smooth group-hover:scale-110"
          />
          <span className="font-brand text-2xl font-bold tracking-wide text-ink sm:text-[1.7rem]">
            Nova Solutions
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((link) => {
            const active = isActive(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`relative block px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                    active
                      ? "text-white dark:text-primary-dark"
                      : "text-ink-soft hover:text-ink"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-full bg-primary-dark dark:bg-light-purple"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 32,
                      }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right side actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          <ThemeToggle />

          <Link
            href={isAdmin ? "/admin" : "/login"}
            className="group hidden items-center gap-2 rounded-full bg-deep-purple px-5 py-2 text-sm font-medium text-white transition-colors duration-300 hover:bg-primary-dark sm:inline-flex dark:hover:bg-muted-purple"
          >
            <LogIn size={16} />
            {isAdmin ? "Dashboard" : "Login"}
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="grid h-10 w-10 place-items-center rounded-full text-ink transition-colors duration-300 hover:bg-deep-purple/15 lg:hidden"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="glass mx-auto mt-2 max-w-6xl rounded-3xl p-3 lg:hidden"
          >
            <ul className="flex flex-col">
              {links.map((link, i) => {
                const active = isActive(link.href);
                return (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * i }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center justify-between rounded-2xl px-4 py-3 text-base font-medium transition-colors duration-300 ${
                        active
                          ? "bg-primary-dark text-white dark:bg-light-purple dark:text-primary-dark"
                          : "text-ink hover:bg-deep-purple/15"
                      }`}
                    >
                      {link.label}
                      <ArrowRight size={18} />
                    </Link>
                  </motion.li>
                );
              })}
            </ul>

            <Link
              href={isAdmin ? "/admin" : "/login"}
              onClick={() => setOpen(false)}
              className="mt-2 flex items-center justify-center gap-2 rounded-2xl bg-deep-purple px-4 py-3 font-medium text-white transition-colors duration-300 hover:bg-primary-dark sm:hidden"
            >
              <LogIn size={18} />
              {isAdmin ? "Dashboard" : "Login"}
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}