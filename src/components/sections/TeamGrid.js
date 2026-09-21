"use client";

import Image from "next/image";
import { RefreshCw } from "lucide-react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa6";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { useAsyncList } from "@/hooks/useAsyncList";
import { getTeam } from "@/lib/team";

function initials(name = "") {
  return name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");
}

function safe(url) {
  return /^https:\/\//i.test(url || "") ? url : "";
}

function Socials({ member }) {
  const items = [
    { href: safe(member.linkedin), label: "LinkedIn", Icon: FaLinkedinIn },
    { href: safe(member.github), label: "GitHub", Icon: FaGithub },
  ].filter((i) => i.href);

  if (!items.length) return null;

  return (
    <ul className="flex gap-2">
      {items.map(({ href, label, Icon }) => (
        <li key={label}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${member.name} on ${label}`}
            className="grid h-9 w-9 place-items-center rounded-full border border-line text-ink-soft transition-colors duration-300 hover:border-accent hover:bg-accent hover:text-white dark:hover:text-primary-dark"
          >
            <Icon size={14} />
          </a>
        </li>
      ))}
    </ul>
  );
}

function Photo({ member, sizes }) {
  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden bg-primary-dark">
      {member.photo ? (
        <Image
          src={member.photo}
          alt={member.name}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-700 ease-smooth group-hover:scale-105"
        />
      ) : (
        <div className="grid h-full place-items-center font-heading text-5xl font-extrabold text-light-purple">
          {initials(member.name)}
        </div>
      )}
    </div>
  );
}

function Skeleton() {
  return (
    <div>
      <div className="aspect-[4/5] w-full animate-pulse bg-line" />
      <div className="mt-4 h-5 w-2/3 animate-pulse bg-line" />
      <div className="mt-2 h-4 w-1/2 animate-pulse bg-line" />
    </div>
  );
}

export default function TeamGrid() {
  const { items, loading, error, reload } = useAsyncList(getTeam);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => <Skeleton key={i} />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-5 sm:px-8">
        <div className="border border-line bg-surface p-10 text-center">
          <p className="font-semibold">The team could not be loaded right now.</p>
          <button type="button" onClick={reload} className="mt-5 inline-flex items-center gap-2 border border-accent px-5 py-2.5 text-sm font-medium text-accent transition-colors duration-300 hover:bg-accent hover:text-white dark:hover:text-primary-dark">
            <RefreshCw size={16} /> Try again
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-5 sm:px-8">
        <div className="border border-line bg-surface p-10 text-center">
          <p className="font-semibold">Team profiles are coming soon.</p>
        </div>
      </div>
    );
  }

  const leaders = items.filter((m) => m.leader);
  const others = items.filter((m) => !m.leader);

  return (
    <div className="mx-auto max-w-7xl space-y-20 px-5 sm:px-8">
      {/* Leadership */}
      {leaders.length > 0 && (
        <section aria-label="Leadership">
          <Reveal>
            <SectionHeading eyebrow="Leadership" title="The people who lead Nova Solutions" />
          </Reveal>
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {leaders.map((m, i) => (
              <Reveal key={m.id} delay={(i % 2) * 0.08}>
                <article className="group grid h-full gap-6 border border-line bg-surface p-5 transition-colors duration-300 hover:border-accent sm:grid-cols-[13rem_1fr] sm:p-6">
                  <Photo member={m} sizes="(min-width: 640px) 208px, 90vw" />
                  <div className="flex flex-col">
                    <h3 className="text-2xl font-extrabold">{m.name}</h3>
                    <p className="mt-1 font-heading text-sm font-semibold uppercase tracking-widest text-accent">
                      {m.role}
                    </p>
                    {m.bio && <p className="mt-4 leading-relaxed text-ink-soft">{m.bio}</p>}
                    {m.skills?.length > 0 && (
                      <ul className="mt-4 flex flex-wrap gap-2">
                        {m.skills.map((s) => (
                          <li key={s} className="border border-line px-2.5 py-1 text-xs text-ink-soft">{s}</li>
                        ))}
                      </ul>
                    )}
                    <div className="mt-auto pt-5"><Socials member={m} /></div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Developer team */}
      {others.length > 0 && (
        <section aria-label="Team">
          <Reveal>
            <SectionHeading eyebrow="The Team" title="Developers, designers and engineers" />
          </Reveal>
          <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((m, i) => (
              <Reveal key={m.id} delay={(i % 4) * 0.07}>
                <li className="group">
                  <Photo member={m} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" />
                  <h3 className="mt-4 text-lg font-bold">{m.name}</h3>
                  <p className="text-sm font-medium text-accent">{m.role}</p>
                  {m.bio && <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-soft">{m.bio}</p>}
                  {m.skills?.length > 0 && (
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {m.skills.slice(0, 4).map((s) => (
                        <li key={s} className="border border-line px-2 py-0.5 text-xs text-ink-soft">{s}</li>
                      ))}
                    </ul>
                  )}
                  <div className="mt-4"><Socials member={m} /></div>
                </li>
              </Reveal>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}