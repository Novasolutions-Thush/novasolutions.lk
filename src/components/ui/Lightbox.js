"use client";

import Image from "next/image";
import { useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export default function Lightbox({ items, index, onClose, onChange }) {
  const open = index !== null && Boolean(items[index]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onChange((index + 1) % items.length);
      if (e.key === "ArrowLeft") onChange((index - 1 + items.length) % items.length);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, index, items.length, onClose, onChange]);

  if (!open) return null;
  const item = items[index];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      className="fixed inset-0 z-[70] flex flex-col bg-black/90"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center border border-white/30 text-white transition-colors duration-300 hover:bg-white hover:text-black"
      >
        <X size={22} />
      </button>

      <div className="relative m-4 mt-16 flex-1 sm:mx-16">
        <Image
          src={item.url}
          alt={item.caption || "Project screenshot"}
          fill
          sizes="100vw"
          className="object-contain"
        />
      </div>

      {items.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange((index - 1 + items.length) % items.length);
            }}
            aria-label="Previous image"
            className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center border border-white/30 text-white transition-colors duration-300 hover:bg-white hover:text-black"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange((index + 1) % items.length);
            }}
            aria-label="Next image"
            className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center border border-white/30 text-white transition-colors duration-300 hover:bg-white hover:text-black"
          >
            <ChevronRight size={22} />
          </button>
        </>
      )}

      <p className="pb-5 text-center text-sm text-white/80">
        {item.caption && <span className="mr-3">{item.caption}</span>}
        <span className="text-white/50">
          {index + 1} / {items.length}
        </span>
      </p>
    </div>
  );
}