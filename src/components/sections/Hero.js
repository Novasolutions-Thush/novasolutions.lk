"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, Pause, Play } from "lucide-react";
import { heroSlides } from "@/data/heroSlides";

const AUTOPLAY_MS = 6000;
const EASE = [0.22, 1, 0.36, 1];

// Image reveal: new image wipes in, old image fades out
const imageVariants = {
  enter: (dir) => ({
    clipPath: dir > 0 ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)",
    zIndex: 2,
  }),
  center: {
    clipPath: "inset(0 0 0 0%)",
    zIndex: 2,
    transition: { duration: 1.1, ease: EASE },
  },
  exit: {
    opacity: 0,
    zIndex: 1,
    transition: { duration: 1.1, ease: EASE },
  },
};

// Text: staggered entrance
const textContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
  exit: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
};

const textItem = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.25 } },
};

export default function Hero() {
  const total = heroSlides.length;
  const [{ index, dir }, setSlide] = useState({ index: 0, dir: 1 });
  const [paused, setPaused] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const reduceMotion = useReducedMotion();

  const go = useCallback(
    (target, direction) =>
      setSlide({ index: (target + total) % total, dir: direction }),
    [total]
  );

  const next = useCallback(() => go(index + 1, 1), [go, index]);
  const prev = useCallback(() => go(index - 1, -1), [go, index]);

  const slide = heroSlides[index];
  const counter = String(index + 1).padStart(2, "0");
  const totalLabel = String(total).padStart(2, "0");

  return (
    <section
      className="relative isolate overflow-hidden pb-12 pt-28 sm:pt-32"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Nova Solutions highlights"
    >
      {/* ---------- Background accents ---------- */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(var(--ink) 1px, transparent 1px), linear-gradient(90deg, var(--ink) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage:
              "radial-gradient(ellipse at 30% 40%, black 20%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at 30% 40%, black 20%, transparent 75%)",
          }}
        />

        {/* Floating blobs */}
        <motion.div
          className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-light-purple/40 blur-3xl sm:h-96 sm:w-96"
          animate={reduceMotion ? {} : { x: [0, 60, 0], y: [0, 40, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-deep-purple/30 blur-3xl sm:h-[28rem] sm:w-[28rem]"
          animate={reduceMotion ? {} : { x: [0, -50, 0], y: [0, -50, 0] }}
          transition={{ duration: 17, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute left-1/3 top-1/2 h-56 w-56 rounded-full bg-soft-lavender/40 blur-3xl"
          animate={reduceMotion ? {} : { x: [0, 40, -30, 0], y: [0, -30, 30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Giant outlined slide number */}
        <AnimatePresence mode="wait">
          <motion.span
            key={counter}
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="absolute -bottom-6 left-2 select-none font-heading text-[clamp(8rem,22vw,22rem)] font-extrabold leading-none text-transparent opacity-[0.12] sm:left-6"
            style={{ WebkitTextStroke: "2px var(--accent)" }}
          >
            {counter}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* ---------- Content ---------- */}
      <div className="mx-auto grid min-h-[calc(100svh-9rem)] max-w-7xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
        {/* Left: text */}
        <div className="order-2 lg:order-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              variants={textContainer}
              initial="hidden"
              animate="show"
              exit="exit"
            >
              <motion.div variants={textItem} className="flex items-center gap-3">
                <span className="h-px w-10 bg-accent" />
                <span className="font-heading text-xs font-semibold uppercase tracking-[0.25em] text-accent sm:text-sm">
                  {slide.tag}
                </span>
              </motion.div>

              <motion.h1
                variants={textItem}
                className="mt-5 text-[clamp(2.25rem,4.4vw,5.25rem)] font-extrabold leading-[1.05]"
              >
                {slide.title}
                <span className="mt-1 block bg-gradient-to-r from-deep-purple via-muted-purple to-light-purple bg-clip-text text-transparent">
                  {slide.highlight}
                </span>
              </motion.h1>

              <motion.p
                variants={textItem}
                className="mt-6 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg"
              >
                {slide.description}
              </motion.p>
            </motion.div>
          </AnimatePresence>

          {/* Buttons (square) */}
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 bg-primary-dark px-7 py-3.5 font-medium text-white transition-colors duration-300 hover:bg-deep-purple dark:bg-light-purple dark:text-primary-dark dark:hover:bg-soft-lavender"
            >
              Get Started
              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 border border-accent px-7 py-3.5 font-medium text-accent transition-colors duration-300 hover:bg-accent hover:text-white dark:hover:text-primary-dark"
            >
              Our Projects
              <ArrowUpRight
                size={18}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          {/* Slider controls */}
          <div className="mt-10 flex items-center gap-5">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={prev}
                aria-label="Previous slide"
                className="grid h-11 w-11 place-items-center border border-accent text-accent transition-colors duration-300 hover:bg-accent hover:text-white dark:hover:text-primary-dark"
              >
                <ArrowLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => setUserPaused((v) => !v)}
                aria-label={userPaused ? "Play slideshow" : "Pause slideshow"}
                className="grid h-11 w-11 place-items-center border border-accent text-accent transition-colors duration-300 hover:bg-accent hover:text-white dark:hover:text-primary-dark"
              >
                {userPaused ? <Play size={18} /> : <Pause size={18} />}
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next slide"
                className="grid h-11 w-11 place-items-center border border-accent text-accent transition-colors duration-300 hover:bg-accent hover:text-white dark:hover:text-primary-dark"
              >
                <ArrowRight size={18} />
              </button>
            </div>

            {/* Progress bars */}
            <div className="flex flex-1 items-center gap-2 sm:max-w-xs">
              {heroSlides.map((s, i) => {
                const active = i === index;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => go(i, i > index ? 1 : -1)}
                    aria-label={`Go to slide ${i + 1}`}
                    aria-current={active}
                    className="relative h-6 flex-1"
                  >
                    <span className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 bg-accent/25" />
                    {active && (
                      <span
                        key={`${index}-${dir}`}
                        className={`absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 bg-accent ${
                          reduceMotion ? "" : "hero-progress"
                        }`}
                        style={{
                          animationDuration: `${AUTOPLAY_MS}ms`,
                          animationPlayState: paused || userPaused ? "paused" : "running",
                        }}
                        onAnimationEnd={next}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <span className="hidden font-heading text-sm font-semibold text-ink-soft sm:block">
              {counter} / {totalLabel}
            </span>
          </div>
        </div>

        {/* Right: image (square) */}
        <div className="order-1 lg:order-2">
          <div className="relative mx-auto h-[46svh] min-h-[18rem] w-full sm:h-[52svh] lg:h-[min(72svh,46rem)]">
            {/* Offset decorative frame */}
            <div
              className="absolute inset-0 translate-x-3 translate-y-3 border-2 border-deep-purple/60 sm:translate-x-5 sm:translate-y-5 dark:border-light-purple/60"
              aria-hidden="true"
            />
            {/* Solid accent block */}
            <div
              className="absolute -left-3 -top-3 h-20 w-20 bg-light-purple sm:-left-5 sm:-top-5 sm:h-28 sm:w-28"
              aria-hidden="true"
            />

            {/* Image stage */}
            <div className="absolute inset-0 overflow-hidden bg-primary-dark">
              <AnimatePresence initial={false} custom={dir}>
                <motion.div
                  key={slide.id}
                  custom={dir}
                  variants={imageVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute inset-0"
                >
                  <motion.div
                    className="absolute inset-0"
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.6, ease: EASE }}
                  >
                    <Image
                      src={slide.image}
                      alt={slide.alt}
                      fill
                      priority={index === 0}
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </motion.div>
                  {/* Soft gradient for readability of overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/60 via-transparent to-transparent" />
                </motion.div>
              </AnimatePresence>

              {/* Overlay: slide tag + counter */}
              <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between p-4 sm:p-6">
                <div className="glass px-4 py-2 text-sm font-medium text-ink">
                  {slide.tag}
                </div>
                <span className="font-heading text-3xl font-extrabold text-white sm:text-4xl">
                  {counter}
                  <span className="text-lg font-medium text-white/60">
                    /{totalLabel}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}