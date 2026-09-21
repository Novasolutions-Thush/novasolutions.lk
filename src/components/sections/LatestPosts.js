"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { useAsyncList } from "@/hooks/useAsyncList";
import { formatPostDate, getPublishedPosts, readMinutes } from "@/lib/posts";

export default function LatestPosts() {
  const { items, loading, error } = useAsyncList(getPublishedPosts);

  if (!loading && (error || items.length === 0)) return null;

  const list = items.slice(0, 3);

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <Reveal>
            <SectionHeading
              eyebrow="From the Blog"
              title="Latest ideas and insights"
              description="Practical articles on software, design and technology from our team."
            />
          </Reveal>
          <Reveal delay={0.1}>
            <Link href="/blog" className="group inline-flex items-center gap-2 font-semibold text-accent">
              Read all articles
              <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {loading &&
            [0, 1, 2].map((i) => (
              <div key={i}>
                <div className="aspect-[16/9] w-full animate-pulse bg-line" />
                <div className="mt-5 h-5 w-2/3 animate-pulse bg-line" />
                <div className="mt-3 h-4 w-full animate-pulse bg-line" />
              </div>
            ))}

          {!loading &&
            list.map((post, i) => (
              <Reveal key={post.id} delay={(i % 3) * 0.08}>
                <Link href={`/blog/${post.id}`} className="group block">
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-primary-dark">
                    {post.coverImage ? (
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        className="object-cover transition-transform duration-700 ease-smooth group-hover:scale-105"
                      />
                    ) : (
                      <div className="grid h-full place-items-center bg-gradient-to-br from-primary-dark to-deep-purple font-brand text-2xl font-bold text-soft-lavender">
                        Nova Solutions
                      </div>
                    )}
                    <span className="glass absolute bottom-3 left-3 px-3 py-1.5 text-xs font-medium text-ink">
                      {post.category}
                    </span>
                  </div>

                  <p className="mt-4 flex flex-wrap items-center gap-x-3 text-xs text-ink-soft">
                    {formatPostDate(post) && <span>{formatPostDate(post)}</span>}
                    <span className="inline-flex items-center gap-1">
                      <Clock size={12} /> {readMinutes(post.content)} min read
                    </span>
                  </p>
                  <h3 className="mt-2 text-xl font-bold transition-colors duration-300 group-hover:text-accent">
                    {post.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-soft sm:text-base">
                    {post.excerpt}
                  </p>
                </Link>
              </Reveal>
            ))}
        </div>
      </div>
    </section>
  );
}