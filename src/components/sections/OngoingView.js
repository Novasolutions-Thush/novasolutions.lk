"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CalendarClock, ChevronDown, RefreshCw } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import PageHeader from "@/components/ui/PageHeader";
import CTASection from "@/components/sections/CTASection";
import ComingSoonPage from "@/components/sections/ComingSoonPage";
import { useAsyncList } from "@/hooks/useAsyncList";
import { formatUpdateDate, getOngoing } from "@/lib/ongoing";

function Card({ p }) {
  const pct = Math.min(100, Math.max(0, Number(p.progress) || 0));
  const updates = p.updates ?? [];

  return (
    <article className="flex h-full flex-col border border-line bg-surface transition-colors duration-300 hover:border-accent">
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-primary-dark">
        {p.image ? (
          <Image
            src={p.image}
            alt={p.title}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="grid h-full place-items-center bg-gradient-to-br from-primary-dark to-deep-purple font-brand text-2xl font-bold text-soft-lavender">
            Nova Solutions
          </div>
        )}
        <span className="glass absolute left-3 top-3 px-3 py-1.5 text-xs font-semibold text-ink">
          {p.status}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h2 className="text-xl font-extrabold sm:text-2xl">{p.title}</h2>
        <p className="mt-3 leading-relaxed text-ink-soft">{p.description}</p>

        {/* Progress */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Progress</span>
            <span className="font-heading font-extrabold text-accent">{pct}%</span>
          </div>
          <div
            className="mt-2 h-2.5 w-full bg-line"
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${p.title} progress`}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-deep-purple to-light-purple"
              initial={{ width: 0 }}
              whileInView={{ width: `${pct}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>

        {p.launch && (
          <p className="mt-4 inline-flex items-center gap-2 text-sm text-ink-soft">
            <CalendarClock size={16} className="text-accent" />
            Expected launch: <strong className="text-ink">{p.launch}</strong>
          </p>
        )}

        {p.tech?.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2">
            {p.tech.map((t) => (
              <li key={t} className="border border-line px-2.5 py-1 text-xs text-ink-soft">{t}</li>
            ))}
          </ul>
        )}

        {updates.length > 0 && (
          <details className="group mt-6 border-t border-line pt-4">
            <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-accent">
              Latest updates ({updates.length})
              <ChevronDown size={18} className="transition-transform duration-300 group-open:rotate-180" />
            </summary>
            <ol className="mt-4 space-y-4 border-l border-line pl-5">
              {updates.map((u, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[1.6rem] top-1.5 h-2 w-2 bg-accent" aria-hidden="true" />
                  {u.date && <p className="text-xs font-medium text-ink-soft">{formatUpdateDate(u.date)}</p>}
                  <p className="text-sm">{u.text}</p>
                </li>
              ))}
            </ol>
          </details>
        )}
      </div>
    </article>
  );
}

export default function OngoingView() {
  const { items, loading, error, reload } = useAsyncList(getOngoing);

  if (!loading && !error && items.length === 0) return <ComingSoonPage slug="ongoing-projects" />;

  return (
    <main>
      <PageHeader
        eyebrow="Ongoing Projects"
        title="What we are building right now"
        description="A live look at the products our team is currently designing and developing."
      />

      <section className="py-10 sm:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          {loading && (
            <div className="grid gap-8 lg:grid-cols-2">
              {[0, 1].map((i) => <div key={i} className="h-96 animate-pulse bg-line" />)}
            </div>
          )}

          {!loading && error && (
            <div className="border border-line bg-surface p-10 text-center">
              <p className="font-semibold">Ongoing projects could not be loaded right now.</p>
              <button type="button" onClick={reload} className="mt-5 inline-flex items-center gap-2 border border-accent px-5 py-2.5 text-sm font-medium text-accent transition-colors duration-300 hover:bg-accent hover:text-white dark:hover:text-primary-dark">
                <RefreshCw size={16} /> Try again
              </button>
            </div>
          )}

          {!loading && !error && (
            <div className="grid gap-8 lg:grid-cols-2">
              {items.map((p, i) => (
                <Reveal key={p.id} delay={(i % 2) * 0.08}>
                  <Card p={p} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <CTASection />
    </main>
  );
}