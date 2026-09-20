"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { adminNav } from "@/data/adminNav";

function SidebarContent({ pathname, user, onLogout, onNavigate }) {
  const isActive = (href) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <div className="flex h-full flex-col bg-primary-dark text-white">
      {/* Brand */}
      <div className="border-b border-white/10 px-6 py-6">
        <Link href="/admin" onClick={onNavigate} className="block">
          <p className="font-brand text-3xl font-bold text-soft-lavender">
            Nova Solutions
          </p>
          <p className="mt-1 text-xs uppercase tracking-[0.25em] text-light-purple">
            Admin Panel
          </p>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-5" aria-label="Admin menu">
        <ul className="space-y-1">
          {adminNav.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors duration-300 ${
                    active
                      ? "bg-light-purple text-primary-dark"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon size={19} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 border-t border-white/10 pt-5">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={onNavigate}
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-white/70 transition-colors duration-300 hover:bg-white/10 hover:text-white"
          >
            <ExternalLink size={19} />
            View Website
          </Link>
        </div>
      </nav>

      {/* User */}
      <div className="border-t border-white/10 p-4">
        <p className="truncate text-xs text-white/50">Signed in as</p>
        <p className="mt-0.5 truncate text-sm font-medium">{user?.email}</p>
        <button
          type="button"
          onClick={onLogout}
          className="mt-4 flex w-full items-center justify-center gap-2 border border-white/25 px-4 py-2.5 text-sm font-medium text-white transition-colors duration-300 hover:border-white hover:bg-white/10"
        >
          <LogOut size={17} />
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default function AdminShell({ children }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const current =
    adminNav.find((n) =>
      n.href === "/admin" ? pathname === "/admin" : pathname.startsWith(n.href)
    ) ?? adminNav[0];

  // Lock page scroll and allow Escape key while the mobile drawer is open
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

  return (
    <div className="min-h-screen">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:block">
        <SidebarContent pathname={pathname} user={user} onLogout={logout} />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
              aria-hidden="true"
            />
            <motion.aside
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] lg:hidden"
            >
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="absolute right-3 top-4 z-10 grid h-9 w-9 place-items-center text-white/80 transition-colors duration-300 hover:text-white"
              >
                <X size={22} />
              </button>
              <SidebarContent
                pathname={pathname}
                user={user}
                onLogout={logout}
                onNavigate={() => setOpen(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main area */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 border-b border-line bg-page/85 backdrop-blur-md">
          <div className="flex items-center justify-between gap-4 px-5 py-3 sm:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label="Open menu"
                className="grid h-10 w-10 shrink-0 place-items-center border border-line text-ink transition-colors duration-300 hover:border-accent hover:text-accent lg:hidden"
              >
                <Menu size={20} />
              </button>
              <div className="min-w-0">
                <h1 className="truncate font-heading text-lg font-extrabold sm:text-xl">
                  {current.label}
                </h1>
                <p className="hidden truncate text-xs text-ink-soft sm:block">
                  {current.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <span className="mx-1 hidden h-6 w-px bg-line sm:block" />
              <button
                type="button"
                onClick={logout}
                aria-label="Sign out"
                className="inline-flex items-center gap-2 border border-line px-3 py-2 text-sm font-medium text-ink transition-colors duration-300 hover:border-accent hover:text-accent sm:px-4"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </header>

        <main className="px-5 py-8 sm:px-8 sm:py-10">{children}</main>
      </div>
    </div>
  );
}