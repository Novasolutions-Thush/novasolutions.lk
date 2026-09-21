"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AlertCircle, ArrowLeft, ArrowRight, ChevronRight, Clock, Loader2, User } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import RichText from "@/components/ui/RichText";
import CTASection from "@/components/sections/CTASection";
import { useAsyncList } from "@/hooks/useAsyncList";
import { useAuth } from "@/context/AuthContext";
import { formatPostDate, getPost, getPublishedPosts, readMinutes } from "@/lib/posts";
import ShareButtons from "@/components/ui/ShareButtons";

export default function BlogPostView({ id }) {
  const { isAdmin } = useAuth();
  const { items: all } = useAsyncList(getPublishedPosts);
  const [state, setState] = useState({ loading: true, post: null });

  useEffect(() => {
    let active = true;
    // Rules deny reading drafts for visitors, so an error also means "not found"
    getPost(id)
      .then((post) => active && setState({ loading: false, post }))
      .catch(() => active && setState({ loading: false, post: null }));
    return () => {
      active = false;
    };
  }, [id]);

  const { loading, post: p } = state;

  if (loading) {
    return (
      <main className="grid min-h-[70vh] place-items-center pt-32">
        <Loader2 size={34} className="animate-spin text-accent" />
      </main>
    );
  }

  if (!p) {
    return (
      <main className="mx-auto max-w-2xl px-5 pb-20 pt-40 text-center">
        <AlertCircle size={44} className="mx-auto text-accent" />
        <h1 className="mt-5 text-3xl font-extrabold">Article not found</h1>
        <p className="mt-3 text-ink-soft">It may have been removed, or the link is incorrect.</p>
        <Link href="/blog" className="mt-8 inline-flex items-center gap-2 bg-primary-dark px-7 py-3.5 font-medium text-white transition-colors duration-300 hover:bg-deep-purple dark:bg-light-purple dark:text-primary-dark dark:hover:bg-soft-lavender">
          <ArrowLeft size={18} /> Back to blog
        </Link>
      </main>
    );
  }

  const related = all.filter((x) => x.id !== p.id).slice(0, 3);

  return (
    <main>
      <section className="relative isolate overflow-hidden pb-8 pt-36 sm:pb-12 sm:pt-44">
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-light-purple/35 blur-3xl" />
          <div className="absolute -right-20 top-24 h-80 w-80 rounded-full bg-deep-purple/25 blur-3xl" />
        </div>

        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-ink-soft">
            <Link href="/" className="transition-colors duration-300 hover:text-accent">Home</Link>
            <ChevronRight size={14} />
            <Link href="/blog" className="transition-colors duration-300 hover:text-accent">Blog</Link>
          </nav>

          <Reveal>
            {!p.published && isAdmin && (
              <p className="mt-6 inline-block border border-accent px-3 py-1 text-xs font-semibold uppercase tracking-widest text-accent">
                Draft preview (only you can see this)
              </p>
            )}
            <p className="mt-6 inline-block bg-light-purple/30 px-3 py-1 font-heading text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              {p.category}
            </p>
            <h1 className="mt-4 text-[clamp(2rem,4.4vw,3.5rem)] font-extrabold leading-[1.1]">{p.title}</h1>
            <p className="mt-5 text-base leading-relaxed text-ink-soft sm:text-lg">{p.excerpt}</p>

            <p className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-soft">
              {p.author && (
                <span className="inline-flex items-center gap-1.5"><User size={15} className="text-accent" />{p.author}</span>
              )}
              {formatPostDate(p) && <span>{formatPostDate(p)}</span>}
              <span className="inline-flex items-center gap-1.5">
                <Clock size={15} className="text-accent" /> {readMinutes(p.content)} min read
              </span>
            </p>
          </Reveal>
        </div>
      </section>

      {p.coverImage && (
        <section className="pb-8">
          <div className="mx-auto max-w-5xl px-5 sm:px-8">
            <Reveal>
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-primary-dark">
                <Image src={p.coverImage} alt={p.title} fill priority sizes="(min-width: 1024px) 1024px, 100vw" className="object-cover" />
              </div>
            </Reveal>
          </div>
        </section>
      )}

      <article className="py-8 sm:py-12">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <RichText text={p.content} />

          {p.tags?.length > 0 && (
            <ul className="mt-10 flex flex-wrap gap-2 border-t border-line pt-6">
              {p.tags.map((t) => (
                <li key={t} className="border border-line px-3 py-1 text-xs text-ink-soft">#{t}</li>
              ))}
            </ul>
          )}
          
          {p.published && (
            <ShareButtons title={p.title} path={`/blog/${p.id}`} />
          )}

          <Link href="/blog" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-accent transition-opacity duration-300 hover:opacity-70">
            <ArrowLeft size={16} /> Back to all articles
          </Link>
        </div>
      </article>

      {related.length > 0 && (
        <section className="relative py-14 sm:py-20">
          <div className="absolute inset-0 -z-10 bg-light-purple/10 dark:bg-deep-purple/10" aria-hidden="true" />
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <h2 className="text-2xl font-extrabold sm:text-3xl">More articles</h2>
            <ul className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <li key={r.id}>
                  <Link href={`/blog/${r.id}`} className="group block">
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-primary-dark">
                      {r.coverImage && (
                        <Image src={r.coverImage} alt={r.title} fill sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-700 ease-smooth group-hover:scale-105" />
                      )}
                    </div>
                    <h3 className="mt-4 text-lg font-bold transition-colors duration-300 group-hover:text-accent">{r.title}</h3>
                    <span className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-accent">
                      Read <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <CTASection />
    </main>
  );
}