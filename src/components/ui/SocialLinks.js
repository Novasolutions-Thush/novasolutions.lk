"use client";

import { socialHref, socialPlatforms } from "@/data/siteDefaults";

const VARIANTS = {
  // For the always-dark Footer
  dark: "border-white/15 bg-white/10 text-white/75 shadow-[0_4px_14px_rgb(0_0_0/0.25)] hover:border-white hover:bg-white hover:text-[color:var(--brand)]",
  // For normal pages (follows the light/dark theme)
  theme:
    "border-line bg-surface text-ink-soft shadow-[0_4px_14px_rgb(35_25_66/0.08)] hover:border-[color:var(--brand)] hover:bg-[color:var(--brand)] hover:text-white",
};

export default function SocialLinks({ socials, variant = "theme", className = "" }) {
  const items = socialPlatforms
    .map((platform) => ({
      platform,
      href: socialHref(platform, socials?.[platform.key]),
    }))
    .filter((item) => item.href);

  if (items.length === 0) return null;

  return (
    <ul className={`flex flex-wrap gap-3 ${className}`}>
      {items.map(({ platform, href }) => {
        const Icon = platform.icon;
        return (
          <li key={platform.key}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={platform.label}
              title={platform.label}
              style={{ "--brand": platform.color }}
              className={`grid h-11 w-11 place-items-center rounded-full border transition-colors duration-300 ${VARIANTS[variant]}`}
            >
              <Icon size={17} />
            </a>
          </li>
        );
      })}
    </ul>
  );
}