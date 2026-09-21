"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { useAsyncList } from "@/hooks/useAsyncList";
import { getGallery } from "@/lib/gallery";

export default function GalleryPreview() {
  const { items, loading, error } = useAsyncList(getGallery);

  if (!loading && (error || items.length === 0)) return null;

  const list = items.slice(0, 6);

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <Reveal>
            <SectionHeading
              eyebrow="Gallery"
              title="Life at Nova Solutions"
              description="Moments from our office, events, workshops and team activities."
            />
          </Reveal>
          <Reveal delay={0.1}>
            <Link href="/gallery" className="group inline-flex items-center gap-2 font-semibold text-accent">
              View full gallery
              <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        <ul className="mt-14 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
          {loading &&
            [0, 1, 2, 3, 4, 5].map((i) => (
              <li key={i} className="aspect-[4/3] animate-pulse bg-line" />
            ))}

          {!loading &&
            list.map((item, i) => (
              <Reveal key={item.id} delay={(i % 3) * 0.06}>
                <li>
                  <Link
                    href="/gallery"
                    aria-label={item.caption ? `Gallery: ${item.caption}` : "Open the gallery"}
                    className="group relative block aspect-[4/3] w-full overflow-hidden bg-primary-dark"
                  >
                    <Image
                      src={item.url}
                      alt={item.caption || "Nova Solutions gallery photo"}
                      fill
                      sizes="(min-width: 1024px) 33vw, 50vw"
                      className="object-cover transition-transform duration-700 ease-smooth group-hover:scale-105"
                    />
                    <span className="absolute inset-0 bg-primary-dark/0 transition-colors duration-500 group-hover:bg-primary-dark/45" />
                    {item.caption && (
                      <span className="glass absolute bottom-3 left-3 max-w-[85%] truncate px-3 py-1.5 text-xs font-medium text-ink">
                        {item.caption}
                      </span>
                    )}
                  </Link>
                </li>
              </Reveal>
            ))}
        </ul>
      </div>
    </section>
  );
}