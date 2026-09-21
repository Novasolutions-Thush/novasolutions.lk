"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  Calendar,
  Check,
  ChevronRight,
  Clock,
  Loader2,
  MessageSquare,
  MonitorPlay,
  Quote,
  Tag,
  Users,
  ZoomIn,
} from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import RichText from "@/components/ui/RichText";
import Lightbox from "@/components/ui/Lightbox";
import SectionHeading from "@/components/ui/SectionHeading";
import ProjectInquiry from "@/components/sections/ProjectInquiry";
import { useProjects } from "@/hooks/useProjects";
import { getProject } from "@/lib/projects";
import ShareButtons from "@/components/ui/ShareButtons";

function initials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

export default function ProjectDetail({ id }) {
  const [state, setState] = useState({ loading: true, project: null, error: false });
  const [lightbox, setLightbox] = useState(null);
  const [mode, setMode] = useState("question");
  const inquiryRef = useRef(null);
  const { projects: all } = useProjects();

  useEffect(() => {
    let active = true;
    getProject(id)
      .then((project) => active && setState({ loading: false, project, error: false }))
      .catch(() => active && setState({ loading: false, project: null, error: true }));
    return () => {
      active = false;
    };
  }, [id]);

  const { loading, project: p, error } = state;

  if (loading) {
    return (
      <main className="grid min-h-[70vh] place-items-center pt-32">
        <Loader2 size={34} className="animate-spin text-accent" />
      </main>
    );
  }

  if (error || !p) {
    return (
      <main className="mx-auto max-w-2xl px-5 pb-20 pt-40 text-center">
        <AlertCircle size={44} className="mx-auto text-accent" />
        <h1 className="mt-5 text-3xl font-extrabold">
          {error ? "Could not load this project" : "Project not found"}
        </h1>
        <p className="mt-3 text-ink-soft">
          It may have been removed, or the link is incorrect.
        </p>
        <Link
          href="/projects"
          className="mt-8 inline-flex items-center gap-2 bg-primary-dark px-7 py-3.5 font-medium text-white transition-colors duration-300 hover:bg-deep-purple dark:bg-light-purple dark:text-primary-dark dark:hover:bg-soft-lavender"
        >
          View all projects
        </Link>
      </main>
    );
  }

  const gallery = p.gallery ?? [];
  const clients = p.clients ?? [];
  const features = p.features ?? [];
  const tech = p.tech ?? [];
  const demo = /^https?:\/\//i.test(p.demoUrl || "") ? p.demoUrl : "";

  const related = all
    .filter((x) => x.id !== p.id)
    .sort((a, b) => Number(b.category === p.category) - Number(a.category === p.category))
    .slice(0, 3);

  const details = [
    { icon: Tag, label: "Category", value: p.category },
    clients[0]?.name && { icon: Users, label: "Client", value: clients[0].name },
    p.year && { icon: Calendar, label: "Year", value: p.year },
    p.duration && { icon: Clock, label: "Duration", value: p.duration },
  ].filter(Boolean);

  const goInquiry = (m) => {
    setMode(m);
    inquiryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const btnPrimary =
    "inline-flex items-center gap-2 bg-primary-dark px-6 py-3.5 font-semibold text-white transition-colors duration-300 hover:bg-deep-purple dark:bg-light-purple dark:text-primary-dark dark:hover:bg-soft-lavender";
  const btnOutline =
    "inline-flex items-center gap-2 border border-accent px-6 py-3.5 font-medium text-accent transition-colors duration-300 hover:bg-accent hover:text-white dark:hover:text-primary-dark";

  return (
    <main>
      {/* ---------- Header ---------- */}
      <section className="relative isolate overflow-hidden pb-10 pt-36 sm:pb-14 sm:pt-44">
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-light-purple/35 blur-3xl" />
          <div className="absolute -right-20 top-24 h-80 w-80 rounded-full bg-deep-purple/25 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-ink-soft">
            <Link href="/" className="transition-colors duration-300 hover:text-accent">
              Home
            </Link>
            <ChevronRight size={14} />
            <Link href="/projects" className="transition-colors duration-300 hover:text-accent">
              Projects
            </Link>
            <ChevronRight size={14} />
            <span className="text-accent">{p.title}</span>
          </nav>

          <Reveal>
            <p className="mt-6 inline-block bg-light-purple/30 px-3 py-1 font-heading text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              {p.category}
            </p>
            <h1 className="mt-4 max-w-4xl text-[clamp(2.1rem,4.6vw,4rem)] font-extrabold leading-[1.08]">
              {p.title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-soft sm:text-lg">
              {p.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {demo && (
                <a href={demo} target="_blank" rel="noopener noreferrer" className={btnPrimary}>
                  Live Demo
                  <ArrowUpRight size={18} />
                </a>
              )}
              <button
                type="button"
                onClick={() => goInquiry("demo")}
                className={demo ? btnOutline : btnPrimary}
              >
                <MonitorPlay size={18} />
                Request a Demo
              </button>
              <button type="button" onClick={() => goInquiry("question")} className={btnOutline}>
                <MessageSquare size={18} />
                Ask a Question
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- Main image ---------- */}
      <section className="pb-10 sm:pb-14">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal>
            <div className="relative">
              <div
                className="absolute inset-0 translate-x-3 translate-y-3 border-2 border-deep-purple/60 sm:translate-x-5 sm:translate-y-5 dark:border-light-purple/60"
                aria-hidden="true"
              />
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-primary-dark">
                {p.image && (
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    priority
                    sizes="(min-width: 1280px) 1200px, 100vw"
                    className="object-cover"
                  />
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- Overview ---------- */}
      <section className="py-10 sm:py-14">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_21rem] lg:gap-16">
          <div className="min-w-0">
            <Reveal>
              <SectionHeading eyebrow="Overview" title="About this project" />
              <div className="mt-6">
                <RichText text={p.longDescription || p.description} />
              </div>
            </Reveal>

            {features.length > 0 && (
              <Reveal>
                <h3 className="mt-12 text-xl font-extrabold sm:text-2xl">Key Features</h3>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {features.map((f) => (
                    <li key={f} className="flex items-start gap-3 border border-line bg-surface p-4">
                      <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center bg-accent text-white dark:text-primary-dark">
                        <Check size={14} strokeWidth={3} />
                      </span>
                      <span className="text-sm sm:text-base">{f}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}
          </div>
          <Reveal>
            <ShareButtons
              title={p.title}
              path={`/projects/${p.id}`}
              label="Share this project"
            />
          </Reveal>

          {/* Sidebar */}
          <aside>
            <div className="space-y-6 lg:sticky lg:top-28">
              <div className="border border-line bg-surface p-6">
                <h3 className="font-heading text-sm font-semibold uppercase tracking-widest text-accent">
                  Project Details
                </h3>
                <ul className="mt-5 space-y-4">
                  {details.map((d) => {
                    const Icon = d.icon;
                    return (
                      <li key={d.label} className="flex items-start gap-3">
                        <Icon size={18} className="mt-0.5 shrink-0 text-accent" />
                        <div className="min-w-0">
                          <p className="text-xs uppercase tracking-widest text-ink-soft">{d.label}</p>
                          <p className="break-words font-medium">{d.value}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                {tech.length > 0 && (
                  <>
                    <p className="mt-6 text-xs uppercase tracking-widest text-ink-soft">Technologies</p>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {tech.map((t) => (
                        <li key={t} className="border border-line px-2.5 py-1 text-xs text-ink-soft">
                          {t}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>

              <div className="border border-line bg-surface p-6">
                <p className="font-heading font-bold">Interested in this system?</p>
                <p className="mt-2 text-sm text-ink-soft">
                  See it in action or ask us anything about it.
                </p>
                <div className="mt-5 flex flex-col gap-3">
                  {demo && (
                    <a href={demo} target="_blank" rel="noopener noreferrer" className={`${btnPrimary} justify-center`}>
                      Live Demo <ArrowUpRight size={17} />
                    </a>
                  )}
                  <button type="button" onClick={() => goInquiry("demo")} className={`${demo ? btnOutline : btnPrimary} justify-center`}>
                    <MonitorPlay size={17} /> Request a Demo
                  </button>
                  <button type="button" onClick={() => goInquiry("question")} className={`${btnOutline} justify-center`}>
                    <MessageSquare size={17} /> Ask a Question
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* ---------- Gallery ---------- */}
      {gallery.length > 0 && (
        <section className="relative py-14 sm:py-20">
          <div className="absolute inset-0 -z-10 bg-light-purple/10 dark:bg-deep-purple/10" aria-hidden="true" />
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal>
              <SectionHeading
                eyebrow="System Views"
                title="A look inside the system"
                description="Click any image to view it full size."
              />
            </Reveal>

            <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {gallery.map((g, i) => (
                <Reveal key={`${g.url}-${i}`} delay={(i % 3) * 0.07}>
                  <li>
                    <button
                      type="button"
                      onClick={() => setLightbox(i)}
                      aria-label={`View image ${i + 1}${g.caption ? `: ${g.caption}` : ""}`}
                      className="group relative block aspect-[16/10] w-full overflow-hidden bg-primary-dark"
                    >
                      <Image
                        src={g.url}
                        alt={g.caption || `${p.title} screenshot ${i + 1}`}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-700 ease-smooth group-hover:scale-105"
                      />
                      <span className="absolute inset-0 bg-primary-dark/0 transition-colors duration-500 group-hover:bg-primary-dark/50" />
                      <span className="absolute right-3 top-3 grid h-10 w-10 place-items-center bg-light-purple text-primary-dark opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <ZoomIn size={18} />
                      </span>
                      {g.caption && (
                        <span className="glass absolute bottom-3 left-3 px-3 py-1.5 text-xs font-medium text-ink">
                          {g.caption}
                        </span>
                      )}
                    </button>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ---------- Clients ---------- */}
      {clients.length > 0 && (
        <section className="py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal>
              <SectionHeading
                eyebrow={clients.length > 1 ? "Our Clients" : "Our Client"}
                title="Who we built it for"
              />
            </Reveal>

            <ul className="mt-10 grid gap-6 md:grid-cols-2">
              {clients.map((c, i) => (
                <Reveal key={`${c.name}-${i}`} delay={(i % 2) * 0.08}>
                  <li className="h-full border border-line bg-surface p-6 sm:p-8">
                    <div className="flex items-center gap-4">
                      <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden border border-line bg-white">
                        {c.logo ? (
                          <Image
                            src={c.logo}
                            alt={`${c.name} logo`}
                            width={64}
                            height={64}
                            className="h-full w-full object-contain p-1.5"
                          />
                        ) : (
                          <span className="font-heading text-lg font-extrabold text-primary-dark">
                            {initials(c.name)}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="break-words font-heading text-lg font-bold">{c.name}</p>
                        {c.industry && <p className="text-sm text-ink-soft">{c.industry}</p>}
                      </div>
                    </div>

                    {c.comment && (
                      <blockquote className="mt-6 border-l-2 border-accent pl-5">
                        <Quote size={20} className="text-accent" />
                        <p className="mt-2 leading-relaxed text-ink-soft">{c.comment}</p>
                        {c.author && (
                          <footer className="mt-3 text-sm font-semibold">{c.author}</footer>
                        )}
                      </blockquote>
                    )}
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ---------- Inquiry ---------- */}
      <section
        id="inquiry"
        ref={inquiryRef}
        className="relative scroll-mt-24 py-14 sm:py-20"
      >
        <div className="absolute inset-0 -z-10 bg-light-purple/10 dark:bg-deep-purple/10" aria-hidden="true" />
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <Reveal>
            <SectionHeading
              eyebrow="Get in touch"
              title="Questions about this project?"
              description="Ask us anything about how it works, what it costs, or request a live demo. Our team replies within one business day."
            />
          </Reveal>
          <Reveal delay={0.1}>
            <ProjectInquiry project={p} mode={mode} setMode={setMode} />
          </Reveal>
        </div>
      </section>

      {/* ---------- Related ---------- */}
      {related.length > 0 && (
        <section className="py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <SectionHeading eyebrow="More Work" title="Other projects" />
                <Link
                  href="/projects"
                  className="group inline-flex items-center gap-2 font-semibold text-accent"
                >
                  All projects
                  <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </Reveal>

            <ul className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <li key={r.id}>
                  <Link href={`/projects/${r.id}`} className="group block">
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-primary-dark">
                      {r.image && (
                        <Image
                          src={r.image}
                          alt={r.title}
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                          className="object-cover transition-transform duration-700 ease-smooth group-hover:scale-105"
                        />
                      )}
                      <span className="glass absolute bottom-4 left-4 px-3 py-1.5 text-xs font-medium text-ink">
                        {r.category}
                      </span>
                    </div>
                    <h3 className="mt-4 text-lg font-bold transition-colors duration-300 group-hover:text-accent">
                      {r.title}
                    </h3>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <Lightbox
        items={gallery}
        index={lightbox}
        onClose={() => setLightbox(null)}
        onChange={setLightbox}
      />
    </main>
  );
}