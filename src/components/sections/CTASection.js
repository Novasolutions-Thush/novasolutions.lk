"use client";

import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { useSettings } from "@/context/SettingsContext";

export default function CTASection() {

  const { settings } = useSettings();

  return (
    <section className="px-5 py-10 sm:px-8">
      <Reveal>
        <div className="relative mx-auto max-w-7xl overflow-hidden bg-primary-dark px-6 py-16 text-center sm:px-12 sm:py-24">
          {/* Decorative blobs */}
          <div
            className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-deep-purple/50 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-light-purple/30 blur-3xl"
            aria-hidden="true"
          />
          {/* Grid pattern */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            aria-hidden="true"
            style={{
              backgroundImage:
                "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />

          <div className="relative">
            <p className="font-heading text-xs font-semibold uppercase tracking-[0.25em] text-light-purple sm:text-sm">
              Let&apos;s Work Together
            </p>
            <h2 className="mx-auto mt-4 max-w-3xl text-[clamp(1.9rem,4vw,3.5rem)] font-extrabold leading-[1.1] text-white">
              Have a project in mind? Let&apos;s build it{" "}
              <span className="text-soft-lavender">together.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base text-white/70 sm:text-lg">
              Tell us about your idea and our team will get back to you within
              one business day.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 bg-light-purple px-8 py-4 font-semibold text-primary-dark transition-colors duration-300 hover:bg-soft-lavender"
              >
                Start a Project
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
              <a
                  href={`mailto:${settings.email}`}
                  className="inline-flex items-center gap-2 border border-white/30 px-8 py-4 font-medium text-white transition-colors duration-300 hover:border-white hover:bg-white/10"
                >
                  <Mail size={18} />
                  {settings.email}
                </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}