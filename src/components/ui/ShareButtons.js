"use client";

import { useEffect, useState } from "react";
import { Check, Link2, Share2 } from "lucide-react";
import { FaFacebookF, FaLinkedinIn, FaWhatsapp, FaXTwitter } from "react-icons/fa6";
import { siteUrl } from "@/lib/site";

const btn =
  "grid h-11 w-11 place-items-center rounded-full border border-line bg-surface text-ink-soft shadow-[0_4px_14px_rgb(35_25_66/0.08)] transition-colors duration-300 hover:border-[color:var(--brand)] hover:bg-[color:var(--brand)] hover:text-white";

export default function ShareButtons({ title, path, label = "Share this article" }) {
  const url = `${siteUrl}${path}`;
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    setCanShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
  }, []);

  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);

  const links = [
    { label: "WhatsApp", Icon: FaWhatsapp, color: "#25D365", href: `https://wa.me/?text=${t}%20${u}` },
    { label: "Facebook", Icon: FaFacebookF, color: "#1877F2", href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
    { label: "LinkedIn", Icon: FaLinkedinIn, color: "#0A66C2", href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
    { label: "X", Icon: FaXTwitter, color: "#14171A", href: `https://twitter.com/intent/tweet?text=${t}&url=${u}` },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link:", url);
    }
  };

  const nativeShare = () => navigator.share({ title, url }).catch(() => {});

  return (
    <div className="mt-10 border-t border-line pt-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-ink-soft">{label}</p>
      <ul className="mt-4 flex flex-wrap items-center gap-3">
        {links.map(({ label, Icon, color, href }) => (
          <li key={label}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Share on ${label}`}
              title={`Share on ${label}`}
              style={{ "--brand": color }}
              className={btn}
            >
              <Icon size={17} />
            </a>
          </li>
        ))}

        <li>
          <button
            type="button"
            onClick={copy}
            aria-label="Copy link"
            title="Copy link"
            style={{ "--brand": "#5e548e" }}
            className={btn}
          >
            {copied ? <Check size={17} /> : <Link2 size={17} />}
          </button>
        </li>

        {canShare && (
          <li>
            <button
              type="button"
              onClick={nativeShare}
              aria-label="Share"
              title="Share"
              style={{ "--brand": "#5e548e" }}
              className={btn}
            >
              <Share2 size={17} />
            </button>
          </li>
        )}

        {copied && (
          <li className="text-sm text-accent" role="status">Link copied</li>
        )}
      </ul>
    </div>
  );
}