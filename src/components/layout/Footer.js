"use client";

import Link from "next/link";
import {
  ArrowUp,
  Clock,
  FileText,
  Lock,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { telHref } from "@/data/siteDefaults";
import { services } from "@/data/services";
import { legalLinks } from "@/data/legalLinks";
import SocialLinks from "@/components/ui/SocialLinks";
import LogoMark from "@/components/ui/LogoMark";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/contact" },
];

const legalIcons = {
  "/privacy": Lock,
  "/terms": FileText,
  "/security": ShieldCheck,
};

function FooterLink({ href, children }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-0 text-sm text-white/70 transition-all duration-300 hover:gap-2 hover:text-soft-lavender"
    >
      <span className="h-px w-0 bg-soft-lavender transition-all duration-300 group-hover:w-3" />
      {children}
    </Link>
  );
}

function Heading({ children }) {
  return (
    <h3 className="font-heading text-sm font-semibold uppercase tracking-widest text-light-purple">
      {children}
    </h3>
  );
}

// Slowly scrolling ribbon of service names
function Ribbon() {
  const row = (hidden) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden}>
      {services.map((s) => (
        <li key={s.id} className="flex items-center">
          <span className="px-6 font-heading text-sm font-semibold uppercase tracking-[0.25em] text-white/60 sm:px-8 sm:text-base">
            {s.title}
          </span>
          <span className="text-light-purple">&#10022;</span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="marquee relative overflow-hidden border-y border-white/10 py-5">
      <div className="marquee-track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}

export default function Footer() {
  const { settings } = useSettings();
  const company = settings.legalName || "Nova Solutions";

  const contactItems = [
    { icon: Mail, value: settings.email, href: settings.email ? `mailto:${settings.email}` : "" },
    { icon: Phone, value: settings.phone, href: settings.phone ? telHref(settings.phone) : "" },
    { icon: MapPin, value: settings.address },
    { icon: Clock, value: settings.workingHours },
  ].filter((item) => item.value);

  return (
    <footer className="relative mt-24 overflow-hidden bg-primary-dark text-white">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-deep-purple/40 blur-3xl" />
        <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-light-purple/15 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
      </div>

      {/* Services ribbon */}
      <div className="relative">
        <Ribbon />
      </div>

      {/* Main columns */}
      <div className="relative mx-auto grid max-w-7xl gap-12 px-6 pb-12 pt-16 sm:px-8 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.3fr]">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3">
            <LogoMark size={44} className="ring-1 ring-white/25" />
            <p className="font-brand text-4xl font-bold text-soft-lavender">
              Nova Solutions
            </p>
          </div>
          {settings.tagline && (
            <p className="mt-2 font-brand text-lg italic text-light-purple">
              {settings.tagline}
            </p>
          )}
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
            {settings.description}
          </p>

          <SocialLinks socials={settings.socials} variant="dark" className="mt-7" />

          <p className="mt-6 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-white/50">
            {company} &bull; {new Date().getFullYear()}
          </p>
        </div>

        {/* Quick links */}
        <div>
          <Heading>Quick Links</Heading>
          <ul className="mt-5 space-y-3">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <FooterLink href={link.href}>{link.label}</FooterLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div>
          <Heading>Services</Heading>
          <ul className="mt-5 space-y-3">
            {services.map((service) => (
              <li key={service.id}>
                <FooterLink href="/services">{service.title}</FooterLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <Heading>Contact</Heading>
          <ul className="mt-5 space-y-4 text-sm text-white/70">
            {contactItems.map((item, i) => {
              const Icon = item.icon;
              const content = (
                <>
                  <span className="grid h-9 w-9 shrink-0 place-items-center border border-white/20 text-light-purple transition-colors duration-300 group-hover:border-light-purple group-hover:bg-light-purple group-hover:text-primary-dark">
                    <Icon size={16} />
                  </span>
                  <span className="min-w-0 break-words pt-1.5">{item.value}</span>
                </>
              );
              return (
                <li key={i}>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="group flex items-start gap-3 transition-colors duration-300 hover:text-soft-lavender"
                    >
                      {content}
                    </a>
                  ) : (
                    <div className="group flex items-start gap-3">{content}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Giant wordmark (gradient, flowing, fades out at the bottom) */}
      <div className="relative select-none overflow-hidden px-2 pt-4" aria-hidden="true">
        <p className="wordmark whitespace-nowrap text-center font-brand text-[clamp(3rem,14.5vw,18rem)] font-bold leading-[0.85] tracking-tight">
          Nova Solutions
        </p>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-6 py-6 text-xs text-white/50 sm:px-8 lg:flex-row lg:justify-between">
          <p className="text-center lg:text-left">
            &copy; {new Date().getFullYear()} {company}. All rights reserved.
          </p>

          <nav
            aria-label="Legal"
            className="flex flex-wrap items-center justify-center gap-2"
          >
            {legalLinks.map((link) => {
              const Icon = legalIcons[link.href];
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="inline-flex items-center gap-2 border border-white/15 px-3.5 py-2 font-medium text-white/75 transition-colors duration-300 hover:border-light-purple hover:bg-light-purple hover:text-primary-dark"
                >
                  {Icon && <Icon size={13} />}
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center gap-2 border border-white/20 px-4 py-2 font-medium text-white/80 transition-colors duration-300 hover:border-light-purple hover:bg-light-purple hover:text-primary-dark"
          >
            Back to top
            <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
}