"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Clock, RefreshCw } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { useAsyncList } from "@/hooks/useAsyncList";
import { formatPostDate, getPublishedPosts, readMinutes } from "@/lib/posts";

function Cover({ post, sizes, className = "aspect-[16/9]" }) {
  return (
    <div className={`relative w-full overflow-hidden bg-primary-dark ${className}`}>
      {post.coverImage ? (
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          sizes={sizes}
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
  );
}

function Meta({ post }) {
  return (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-soft">
      {formatPostDate(post) && <span>{formatPostDate(post)}</span>}
      <span className="inline-flex items-center gap-1">
        <Clock size={12} /> {readMinutes(post.content)} min read
      </span>
    </p>
  );
}

export default function BlogList() {
  const { items: posts, loading, error, reload } = useAsyncList(getPublishedPosts);
  const [active, setActive] = useState("All");

  const categories = useMemo(
    () => ["All", ...new Set(posts.map((p) => p.category).filter(Boolean))],
    [posts]
  );

  const visible = active === "All" ? posts : posts.filter((p) => p.category === active);
  const [first, ...rest] = visible;

  if (loading) {
    return (
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i}>
            <div className="aspect-[16/9] w-full animate-pulse bg-line" />
            <div className="mt-5 h-5 w-2/3 animate-pulse bg-line" />
            <div className="mt-3 h-4 w-full animate-pulse bg-line" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-line bg-surface p-10 text-center">
        <p className="font-semibold">Articles could not be loaded right now.</p>
        <button type="button" onClick={reload} className="mt-5 inline-flex items-center gap-2 border border-accent px-5 py-2.5 text-sm font-medium text-accent transition-colors duration-300 hover:bg-accent hover:text-white dark:hover:text-primary-dark">
          <RefreshCw size={16} /> Try again
        </button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="border border-line bg-surface p-10 text-center">
        <p className="font-semibold">Our first articles are on the way.</p>
        <p className="mt-1 text-sm text-ink-soft">Please check back soon.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Blog categories">
        {categories.map((cat) => {
          const isActive = cat === active;
          return (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(cat)}
              className={`border px-5 py-2.5 text-sm font-medium transition-colors duration-300 ${
                isActive
                  ? "border-primary-dark bg-primary-dark text-white dark:border-light-purple dark:bg-light-purple dark:text-primary-dark"
                  : "border-line text-ink-soft hover:border-accent hover:text-accent"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Latest article (large) */}
      {first && (
        <Reveal>
          <Link
            href={`/blog/${first.id}`}
            className="group mt-10 grid gap-6 border border-line bg-surface p-4 transition-colors duration-300 hover:border-accent lg:grid-cols-[1.3fr_1fr] lg:gap-10 lg:p-6"
          >
            <Cover post={first} sizes="(min-width: 1024px) 55vw, 100vw" />
            <div className="flex flex-col justify-center">
              <Meta post={first} />
              <h2 className="mt-3 text-2xl font-extrabold transition-colors duration-300 group-hover:text-accent sm:text-3xl">
                {first.title}
              </h2>
              <p className="mt-3 leading-relaxed text-ink-soft">{first.excerpt}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent">
                Read article
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        </Reveal>
      )}

      {/* Other articles */}
      {rest.length > 0 && (
        <ul className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((post, i) => (
            <Reveal key={post.id} delay={(i % 3) * 0.07}>
              <li>
                <Link href={`/blog/${post.id}`} className="group block">
                  <Cover post={post} sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" />
                  <div className="mt-4"><Meta post={post} /></div>
                  <h3 className="mt-2 text-xl font-bold transition-colors duration-300 group-hover:text-accent">
                    {post.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-soft sm:text-base">
                    {post.excerpt}
                  </p>
                </Link>
              </li>
            </Reveal>
          ))}
        </ul>
      )}
    </div>
  );
}