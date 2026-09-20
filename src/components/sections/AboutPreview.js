import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import CountUp from "@/components/ui/CountUp";
import SectionHeading from "@/components/ui/SectionHeading";

const highlights = [
  "Experienced team of developers and designers",
  "Modern, secure and scalable technology",
  "Transparent communication from day one",
];

const stats = [
  { value: 50, suffix: "+", label: "Projects Delivered" },
  { value: 30, suffix: "+", label: "Happy Clients" },
  { value: 12, suffix: "", label: "Team Members" },
  { value: 5, suffix: "+", label: "Years of Experience" },
];

export default function AboutPreview() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20">
        {/* Image */}
        <Reveal>
          <div className="relative mx-auto max-w-md lg:max-w-none">
            <div
              className="absolute inset-0 -translate-x-4 translate-y-4 border-2 border-deep-purple/60 sm:-translate-x-6 sm:translate-y-6 dark:border-light-purple/60"
              aria-hidden="true"
            />
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-primary-dark">
              <Image
                src="/images/about/about-1.jpg"
                alt="The Nova Solutions team at work"
                fill
                sizes="(min-width: 1024px) 45vw, 90vw"
                className="object-cover"
              />
            </div>

            {/* Floating badge */}
            <div className="glass absolute -bottom-5 -right-2 px-6 py-4 sm:-right-6">
              <p className="font-heading text-3xl font-extrabold text-accent">
                5+
              </p>
              <p className="text-xs font-medium uppercase tracking-widest text-ink-soft">
                Years of Excellence
              </p>
            </div>
          </div>
        </Reveal>

        {/* Text */}
        <div>
          <Reveal>
            <SectionHeading
              eyebrow="About Us"
              title="We turn ideas into powerful digital products"
              description="Nova Solutions is a software development company that helps businesses grow through carefully crafted web, mobile and cloud solutions. We combine creative design with solid engineering to deliver results that last."
            />
          </Reveal>

          <Reveal delay={0.1}>
            <ul className="mt-8 space-y-3">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center bg-accent text-white dark:text-primary-dark">
                    <Check size={14} strokeWidth={3} />
                  </span>
                  <span className="text-ink">{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Stats */}
          <Reveal delay={0.2}>
            <div className="mt-10 grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="bg-surface px-4 py-5">
                  <p className="font-heading text-3xl font-extrabold text-accent">
                    <CountUp to={s.value} suffix={s.suffix} />
                  </p>
                  <p className="mt-1 text-xs leading-snug text-ink-soft">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <Link
              href="/about"
              className="group mt-10 inline-flex items-center gap-2 bg-primary-dark px-7 py-3.5 font-medium text-white transition-colors duration-300 hover:bg-deep-purple dark:bg-light-purple dark:text-primary-dark dark:hover:bg-soft-lavender"
            >
              Learn More About Us
              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}