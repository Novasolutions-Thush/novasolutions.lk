import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

export default function PageHeader({ eyebrow, title, description }) {
  return (
    <section className="relative isolate overflow-hidden pb-14 pt-40 sm:pb-20 sm:pt-48">
      {/* Background accents */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(var(--ink) 1px, transparent 1px), linear-gradient(90deg, var(--ink) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage:
              "radial-gradient(ellipse at 20% 30%, black 15%, transparent 70%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at 20% 30%, black 15%, transparent 70%)",
          }}
        />
        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-light-purple/35 blur-3xl" />
        <div className="absolute -right-20 top-24 h-80 w-80 rounded-full bg-deep-purple/25 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal y={16}>
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-sm text-ink-soft"
          >
            <Link href="/" className="transition-colors duration-300 hover:text-accent">
              Home
            </Link>
            <ChevronRight size={14} />
            <span className="text-accent">{eyebrow}</span>
          </nav>
        </Reveal>

        <Reveal delay={0.08}>
          <h1 className="mt-5 max-w-4xl text-[clamp(2.25rem,5vw,4.5rem)] font-extrabold leading-[1.05]">
            {title}
          </h1>
        </Reveal>

        {description && (
          <Reveal delay={0.16}>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-soft sm:text-lg">
              {description}
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
