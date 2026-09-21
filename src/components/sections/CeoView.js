"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Loader2, Quote, Target } from "lucide-react";
import { FaLinkedinIn } from "react-icons/fa6";
import Reveal from "@/components/ui/Reveal";
import RichText from "@/components/ui/RichText";
import PageHeader from "@/components/ui/PageHeader";
import CTASection from "@/components/sections/CTASection";
import ComingSoonPage from "@/components/sections/ComingSoonPage";
import { getCeo } from "@/lib/ceo";

function initials(name = "") {
  return name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");
}

export default function CeoView() {
  const [state, setState] = useState({ loading: true, ceo: null });

  useEffect(() => {
    let active = true;
    getCeo()
      .then((ceo) => active && setState({ loading: false, ceo }))
      .catch(() => active && setState({ loading: false, ceo: null }));
    return () => {
      active = false;
    };
  }, []);

  if (state.loading) {
    return (
      <main className="grid min-h-[70vh] place-items-center pt-32">
        <Loader2 size={34} className="animate-spin text-accent" />
      </main>
    );
  }

  const c = state.ceo;
  // Nothing saved yet (or could not load): keep showing the Coming Soon page
  if (!c || !c.name || !c.message) return <ComingSoonPage slug="ceo" />;

  const linkedin = /^https:\/\//i.test(c.linkedin || "") ? c.linkedin : "";

  return (
    <main>
      <PageHeader
        eyebrow="CEO's Message"
        title="A message from our founder"
        description="Our vision, our values and the road ahead, in our CEO's own words."
      />

      <section className="py-8 sm:py-14">
        <div className="mx-auto grid max-w-7xl items-start gap-12 px-5 sm:px-8 lg:grid-cols-[22rem_1fr] lg:gap-16">
          {/* Photo */}
          <Reveal>
            <div className="mx-auto w-full max-w-sm lg:sticky lg:top-28 lg:max-w-none">
              <div className="relative">
                <div
                  className="absolute inset-0 translate-x-4 translate-y-4 border-2 border-deep-purple/60 dark:border-light-purple/60"
                  aria-hidden="true"
                />
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-primary-dark">
                  {c.photo ? (
                    <Image src={c.photo} alt={c.name} fill priority sizes="(min-width: 1024px) 352px, 90vw" className="object-cover" />
                  ) : (
                    <div className="grid h-full place-items-center font-heading text-6xl font-extrabold text-light-purple">
                      {initials(c.name)}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="break-words font-heading text-xl font-extrabold">{c.name}</p>
                  <p className="text-sm font-medium text-accent">{c.role}</p>
                </div>
                {linkedin && (
                  <a
                    href={linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${c.name} on LinkedIn`}
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line text-ink-soft transition-colors duration-300 hover:border-accent hover:bg-accent hover:text-white dark:hover:text-primary-dark"
                  >
                    <FaLinkedinIn size={15} />
                  </a>
                )}
              </div>
            </div>
          </Reveal>

          {/* Message */}
          <div className="min-w-0">
            {c.quote && (
              <Reveal>
                <blockquote className="relative border-l-4 border-accent bg-surface p-6 sm:p-8">
                  <Quote size={30} className="text-accent" />
                  <p className="mt-3 font-heading text-xl font-extrabold leading-snug sm:text-2xl lg:text-3xl">
                    {c.quote}
                  </p>
                </blockquote>
              </Reveal>
            )}

            <Reveal delay={0.05}>
              <div className="mt-10 text-base sm:text-lg">
                <RichText text={c.message} />
              </div>
            </Reveal>

            {c.vision && (
              <Reveal>
                <div className="mt-10 border border-line bg-surface p-6 sm:p-8">
                  <div className="flex items-center gap-4">
                    <span className="grid h-12 w-12 shrink-0 place-items-center bg-primary-dark text-light-purple dark:bg-deep-purple dark:text-white">
                      <Target size={22} />
                    </span>
                    <h2 className="text-xl font-extrabold sm:text-2xl">Our Vision</h2>
                  </div>
                  <p className="mt-4 whitespace-pre-line leading-relaxed text-ink-soft">{c.vision}</p>
                </div>
              </Reveal>
            )}

            {(c.signature || c.name) && (
              <Reveal>
                <div className="mt-10 border-t border-line pt-8">
                  <p className="font-brand text-4xl font-bold italic text-accent sm:text-5xl">
                    {c.signature || c.name}
                  </p>
                  <p className="mt-2 text-sm text-ink-soft">
                    {c.name}, {c.role}
                  </p>
                </div>
              </Reveal>
            )}

            <Reveal>
              <Link
                href="/team"
                className="group mt-10 inline-flex items-center gap-2 font-semibold text-accent"
              >
                Meet the whole team
                <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <CTASection />
    </main>
  );
}