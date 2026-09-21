import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Mail } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { exploreItems } from "@/data/exploreMenu";

export default function ComingSoonPage({ slug }) {
  const item = exploreItems.find((i) => i.slug === slug);
  if (!item) return null;

  const Icon = item.icon;

  return (
    <main className="relative isolate overflow-hidden px-5 pb-20 pt-36 sm:px-8 sm:pt-44">
      {/* Background accents */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(var(--ink) 1px, transparent 1px), linear-gradient(90deg, var(--ink) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(ellipse at 50% 30%, black 15%, transparent 70%)",
            WebkitMaskImage: "radial-gradient(ellipse at 50% 30%, black 15%, transparent 70%)",
          }}
        />
        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-light-purple/35 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-deep-purple/25 blur-3xl" />
      </div>

      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <div className="relative mx-auto grid h-20 w-20 place-items-center bg-primary-dark text-light-purple dark:bg-deep-purple dark:text-white">
            <Icon size={36} />
            <span className="absolute -right-1.5 -top-1.5 h-3.5 w-3.5 animate-ping bg-light-purple" aria-hidden="true" />
            <span className="absolute -right-1.5 -top-1.5 h-3.5 w-3.5 bg-light-purple" aria-hidden="true" />
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <p className="mt-8 inline-block border border-accent px-4 py-1.5 font-heading text-xs font-semibold uppercase tracking-[0.3em] text-accent">
            Coming Soon
          </p>
          <h1 className="mt-6 text-[clamp(2.2rem,5vw,4.25rem)] font-extrabold leading-[1.05]">
            {item.title}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
            {item.description}
          </p>
        </Reveal>

        <Reveal delay={0.16}>
          <div className="mx-auto mt-10 max-w-md border border-line bg-surface p-6 text-left">
            <p className="text-xs font-semibold uppercase tracking-widest text-ink-soft">
              What to expect
            </p>
            <ul className="mt-4 space-y-3">
              {item.points.map((p) => (
                <li key={p} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center bg-accent text-white dark:text-primary-dark">
                    <Check size={14} strokeWidth={3} />
                  </span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.24}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-primary-dark px-7 py-3.5 font-semibold text-white transition-colors duration-300 hover:bg-deep-purple dark:bg-light-purple dark:text-primary-dark dark:hover:bg-soft-lavender"
            >
              <ArrowLeft size={18} />
              Back to Home
            </Link>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 border border-accent px-7 py-3.5 font-medium text-accent transition-colors duration-300 hover:bg-accent hover:text-white dark:hover:text-primary-dark"
            >
              <Mail size={18} />
              Get in touch
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
      </div>
    </main>
  );
}