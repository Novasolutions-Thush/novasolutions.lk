"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CalendarDays, Mail, MapPin, Phone } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Reveal from "@/components/ui/Reveal";
import { useSettings } from "@/context/SettingsContext";
import { telHref } from "@/data/siteDefaults";
import { LEGAL_UPDATED, legalLinks } from "@/data/legalLinks";

export default function LegalLayout({ content }) {
  const pathname = usePathname();
  const { settings } = useSettings();
  const company = settings.legalName || "Nova Solutions";

  // Replaces {company} and {email} tokens with the values from Settings
  const fill = (text) =>
    text.replaceAll("{company}", company).replaceAll("{email}", settings.email);

  const toc = [
    ...content.sections.map((s) => ({ id: s.id, title: s.title })),
    { id: "contact", title: "Contact Us" },
  ];

  const [active, setActive] = useState(toc[0].id);

  // Highlights the section that is currently being read
  useEffect(() => {
    const elements = toc
      .map((t) => document.getElementById(t.id))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -65% 0px" }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  return (
    <main>
      <PageHeader
        eyebrow={content.eyebrow}
        title={fill(content.title)}
        description={fill(content.description)}
      />

      <section className="pb-10 pt-2 sm:pb-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          {/* Switch between the 3 legal pages */}
          <nav aria-label="Legal pages" className="flex flex-wrap gap-2">
            {legalLinks.map((link) => {
              const current = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={current ? "page" : undefined}
                  className={`border px-5 py-2.5 text-sm font-medium transition-colors duration-300 ${
                    current
                      ? "border-primary-dark bg-primary-dark text-white dark:border-light-purple dark:bg-light-purple dark:text-primary-dark"
                      : "border-line text-ink-soft hover:border-accent hover:text-accent"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-10 grid gap-10 lg:grid-cols-[16rem_1fr] lg:gap-16">
            {/* Table of contents (desktop) */}
            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <p className="text-xs font-semibold uppercase tracking-widest text-ink-soft">
                  On this page
                </p>
                <ul className="mt-4 border-l border-line">
                  {toc.map((t) => {
                    const isActive = t.id === active;
                    return (
                      <li key={t.id}>
                        <a
                          href={`#${t.id}`}
                          className={`-ml-px block border-l-2 py-2 pl-4 text-sm transition-colors duration-300 ${
                            isActive
                              ? "border-accent font-semibold text-accent"
                              : "border-transparent text-ink-soft hover:text-ink"
                          }`}
                        >
                          {t.title}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </aside>

            {/* Content */}
            <article className="min-w-0">
              <Reveal y={16}>
                <p className="mb-8 inline-flex items-center gap-2 border border-line bg-surface px-4 py-2 text-sm text-ink-soft">
                  <CalendarDays size={16} className="text-accent" />
                  Last updated: {LEGAL_UPDATED}
                </p>
              </Reveal>

              {content.sections.map((section, i) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-32 border-t border-line py-8 first-of-type:border-t-0 first-of-type:pt-0"
                >
                  <div className="flex items-baseline gap-4">
                    <span className="font-heading text-sm font-extrabold text-accent">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h2 className="text-xl font-extrabold sm:text-2xl">
                      {section.title}
                    </h2>
                  </div>

                  <div className="mt-4 space-y-4 leading-relaxed text-ink-soft">
                    {section.paragraphs?.map((p) => (
                      <p key={p}>{fill(p)}</p>
                    ))}

                    {section.items && (
                      <ul className="space-y-2.5">
                        {section.items.map((item) => (
                          <li key={item} className="flex gap-3">
                            <span className="mt-2.5 h-1.5 w-1.5 shrink-0 bg-accent" />
                            <span>{fill(item)}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {section.after?.map((p) => (
                      <p key={p}>{fill(p)}</p>
                    ))}
                  </div>
                </section>
              ))}

              {/* Contact */}
              <section
                id="contact"
                className="scroll-mt-32 border-t border-line pt-8"
              >
                <div className="flex items-baseline gap-4">
                  <span className="font-heading text-sm font-extrabold text-accent">
                    {String(content.sections.length + 1).padStart(2, "0")}
                  </span>
                  <h2 className="text-xl font-extrabold sm:text-2xl">Contact Us</h2>
                </div>
                <p className="mt-4 leading-relaxed text-ink-soft">
                  If you have any questions about this page, please contact us:
                </p>

                <div className="mt-5 space-y-3 border border-line bg-surface p-6">
                  <p className="font-heading font-bold">{company}</p>
                  {settings.email && (
                    <p className="flex items-center gap-3 text-sm text-ink-soft">
                      <Mail size={16} className="shrink-0 text-accent" />
                      <a
                        href={`mailto:${settings.email}`}
                        className="break-all transition-colors duration-300 hover:text-accent"
                      >
                        {settings.email}
                      </a>
                    </p>
                  )}
                  {settings.phone && (
                    <p className="flex items-center gap-3 text-sm text-ink-soft">
                      <Phone size={16} className="shrink-0 text-accent" />
                      <a
                        href={telHref(settings.phone)}
                        className="transition-colors duration-300 hover:text-accent"
                      >
                        {settings.phone}
                      </a>
                    </p>
                  )}
                  {settings.address && (
                    <p className="flex items-center gap-3 text-sm text-ink-soft">
                      <MapPin size={16} className="shrink-0 text-accent" />
                      {settings.address}
                    </p>
                  )}
                </div>
              </section>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}