import Image from "next/image";
import { Eye, Heart, Lightbulb, Rocket, ShieldCheck, Target, Users } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Reveal from "@/components/ui/Reveal";
import CountUp from "@/components/ui/CountUp";
import SectionHeading from "@/components/ui/SectionHeading";
import CTASection from "@/components/sections/CTASection";

export const metadata = {
  title: "About Us",
  description:
    "Learn about Nova Solutions, our mission, our values and the team behind our software.",
};

const values = [
  {
    icon: Lightbulb,
    title: "Creativity",
    text: "We look for fresh, original ways to solve every problem.",
  },
  {
    icon: ShieldCheck,
    title: "Integrity",
    text: "Honest advice, clear pricing and promises we keep.",
  },
  {
    icon: Users,
    title: "Collaboration",
    text: "We work as one team with our clients, not just for them.",
  },
  {
    icon: Rocket,
    title: "Excellence",
    text: "Clean code, careful testing and attention to every detail.",
  },
];

const stats = [
  { value: 50, suffix: "+", label: "Projects Delivered" },
  { value: 30, suffix: "+", label: "Happy Clients" },
  { value: 12, suffix: "", label: "Team Members" },
  { value: 5, suffix: "+", label: "Years of Experience" },
];

export default function AboutPage() {
  return (
    <main>
      <PageHeader
        eyebrow="About Us"
        title="A team that builds software with purpose"
        description="Nova Solutions is a Sri Lankan software company that turns ideas into reliable, beautiful digital products."
      />

      {/* Story */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div
                className="absolute inset-0 translate-x-4 translate-y-4 border-2 border-deep-purple/60 sm:translate-x-6 sm:translate-y-6 dark:border-light-purple/60"
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
            </div>
          </Reveal>

          <div>
            <Reveal>
              <SectionHeading
                eyebrow="Our Story"
                title="From a small idea to a trusted technology partner"
              />
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-ink-soft sm:text-lg">
                <p>
                  Nova Solutions started with a simple belief: every business,
                  big or small, deserves software that is fast, secure and a
                  pleasure to use.
                </p>
                <p>
                  Today our team of developers, designers and engineers builds
                  web, mobile and cloud solutions for clients across many
                  industries. We combine creative design with solid engineering
                  to deliver results that last.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="relative py-14 sm:py-20">
        <div
          className="absolute inset-0 -z-10 bg-light-purple/10 dark:bg-deep-purple/10"
          aria-hidden="true"
        />
        <div className="mx-auto grid max-w-7xl gap-6 px-5 sm:px-8 md:grid-cols-2">
          {[
            {
              icon: Target,
              title: "Our Mission",
              text: "To empower businesses with dependable, modern software that saves time, reduces cost and creates real growth.",
            },
            {
              icon: Eye,
              title: "Our Vision",
              text: "To become the most trusted software partner in the region, known for quality, creativity and long-term relationships.",
            },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} delay={i * 0.1}>
                <div className="h-full border border-line bg-surface p-8 transition-colors duration-300 hover:border-accent">
                  <div className="grid h-14 w-14 place-items-center bg-primary-dark text-light-purple dark:bg-deep-purple dark:text-white">
                    <Icon size={26} />
                  </div>
                  <h3 className="mt-6 text-2xl font-bold">{item.title}</h3>
                  <p className="mt-3 leading-relaxed text-ink-soft">{item.text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Values */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal>
            <SectionHeading
              align="center"
              eyebrow="Our Values"
              title="The principles behind everything we build"
            />
          </Reveal>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <Reveal key={v.title} delay={i * 0.08}>
                  <div className="group h-full border border-line bg-surface p-7 transition-colors duration-300 hover:border-accent">
                    <Icon
                      size={30}
                      className="text-accent transition-colors duration-300"
                    />
                    <h3 className="mt-5 text-lg font-bold">{v.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                      {v.text}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats band */}
      <section className="px-5 py-6 sm:px-8">
        <Reveal>
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-white/10 md:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="bg-primary-dark px-6 py-10 text-center sm:py-14"
              >
                <p className="font-heading text-4xl font-extrabold text-soft-lavender sm:text-5xl">
                  <CountUp to={s.value} suffix={s.suffix} />
                </p>
                <p className="mt-2 text-sm text-white/70">{s.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <CTASection />
    </main>
  );
}