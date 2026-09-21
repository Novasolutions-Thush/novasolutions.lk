"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { RefreshCw, ZoomIn } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import Lightbox from "@/components/ui/Lightbox";
import PageHeader from "@/components/ui/PageHeader";
import CTASection from "@/components/sections/CTASection";
import ComingSoonPage from "@/components/sections/ComingSoonPage";
import { useAsyncList } from "@/hooks/useAsyncList";
import { getGallery } from "@/lib/gallery";

export default function GalleryView() {
  const { items, loading, error, reload } = useAsyncList(getGallery);
  const [active, setActive] = useState("All");
  const [lightbox, setLightbox] = useState(null);

  const categories = useMemo(
    () => ["All", ...new Set(items.map((i) => i.category).filter(Boolean))],
    [items]
  );

  const visible = active === "All" ? items : items.filter((i) => i.category === active);

  // Nothing uploaded yet: keep the Coming Soon page
  if (!loading && !error && items.length === 0) return <ComingSoonPage slug="gallery" />;

  return (
    <main>
      <PageHeader
        eyebrow="Gallery"
        title="Moments from Nova Solutions"
        description="Our office, events, workshops and the team behind the work."
      />

      <section className="py-10 sm:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          {loading && (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2, 3, 4, 5].map((i) => <div key={i} className="aspect-[4/3] animate-pulse bg-line" />)}
            </div>
          )}

          {!loading && error && (
            <div className="border border-line bg-surface p-10 text-center">
              <p className="font-semibold">The gallery could not be loaded right now.</p>
              <button type="button" onClick={reload} className="mt-5 inline-flex items-center gap-2 border border-accent px-5 py-2.5 text-sm font-medium text-accent transition-colors duration-300 hover:bg-accent hover:text-white dark:hover:text-primary-dark">
                <RefreshCw size={16} /> Try again
              </button>
            </div>
          )}

          {!loading && !error && (
            <>
              <div className="flex flex-wrap gap-2" role="tablist" aria-label="Gallery categories">
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

              <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {visible.map((item, i) => (
                  <Reveal key={item.id} delay={(i % 3) * 0.06}>
                    <li>
                      <button
                        type="button"
                        onClick={() => setLightbox(i)}
                        aria-label={`View photo${item.caption ? `: ${item.caption}` : ""}`}
                        className="group relative block aspect-[4/3] w-full overflow-hidden bg-primary-dark"
                      >
                        <Image
                          src={item.url}
                          alt={item.caption || "Nova Solutions gallery photo"}
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover transition-transform duration-700 ease-smooth group-hover:scale-105"
                        />
                        <span className="absolute inset-0 bg-primary-dark/0 transition-colors duration-500 group-hover:bg-primary-dark/50" />
                        <span className="absolute right-3 top-3 grid h-10 w-10 place-items-center bg-light-purple text-primary-dark opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          <ZoomIn size={18} />
                        </span>
                        {item.caption && (
                          <span className="glass absolute bottom-3 left-3 max-w-[85%] truncate px-3 py-1.5 text-xs font-medium text-ink">
                            {item.caption}
                          </span>
                        )}
                      </button>
                    </li>
                  </Reveal>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>

      <CTASection />

      <Lightbox items={visible} index={lightbox} onClose={() => setLightbox(null)} onChange={setLightbox} />
    </main>
  );
}