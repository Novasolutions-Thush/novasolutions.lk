"use client";

import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { telHref } from "@/data/siteDefaults";
import SocialLinks from "@/components/ui/SocialLinks";

export default function ContactInfo() {
  const { settings } = useSettings();
  const company = (settings.legalName || "Nova Solutions").toUpperCase();

  const items = [
    { icon: Mail, label: "Email", value: settings.email, href: settings.email ? `mailto:${settings.email}` : "" },
    { icon: Phone, label: "Phone", value: settings.phone, href: settings.phone ? telHref(settings.phone) : "" },
    { icon: MapPin, label: "Location", value: settings.address },
    { icon: Clock, label: "Working Hours", value: settings.workingHours },
  ].filter((item) => item.value);

  const hasSocials = Object.values(settings.socials || {}).some((v) => v && v.trim());

  return (
    <aside className="space-y-4">
      {items.map((item) => {
        const Icon = item.icon;
        const content = (
          <div className="group flex items-center gap-5 border border-line bg-surface p-5 transition-colors duration-300 hover:border-accent">
            <div className="grid h-12 w-12 shrink-0 place-items-center bg-primary-dark text-light-purple transition-colors duration-300 group-hover:bg-light-purple group-hover:text-primary-dark dark:bg-deep-purple dark:text-white dark:group-hover:bg-light-purple dark:group-hover:text-primary-dark">
              <Icon size={22} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-widest text-ink-soft">
                {item.label}
              </p>
              <p className="mt-0.5 break-words font-medium">{item.value}</p>
            </div>
          </div>
        );

        return item.href ? (
          <a key={item.label} href={item.href} className="block">
            {content}
          </a>
        ) : (
          <div key={item.label}>{content}</div>
        );
      })}

      {hasSocials && (
        <div className="border border-line bg-surface p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-ink-soft">
            Follow Us
          </p>
          <SocialLinks socials={settings.socials} variant="theme" className="mt-4" />
          <p className="mt-5 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-ink-soft">
            {company} &bull; {new Date().getFullYear()}
          </p>
        </div>
      )}
    </aside>
  );
}