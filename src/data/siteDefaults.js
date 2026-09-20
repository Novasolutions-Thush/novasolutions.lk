import {
  FaFacebookF,
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
  FaTiktok,
  FaWhatsapp,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";


export const defaultSettings = {
  tagline: "Code. Create. Elevate.",
  legalName: "Nova Solutions (Pvt) Ltd",
  description:
    "We design and build modern web, mobile and cloud solutions that help businesses grow.",
  email: "hello@novasolutions.lk",
  phone: "+94 00 000 0000",
  address: "Sri Lanka",
  workingHours: "Mon - Fri, 9:00 AM - 5:30 PM",
  socials: {
    facebook: "",
    instagram: "",
    linkedin: "",
    x: "",
    youtube: "",
    tiktok: "",
    github: "",
    whatsapp: "",
  },
};

// `color` is the official brand colour used on hover.
export const socialPlatforms = [
  { key: "facebook", label: "Facebook", icon: FaFacebookF, color: "#1877F2", placeholder: "https://facebook.com/yourpage" },
  { key: "instagram", label: "Instagram", icon: FaInstagram, color: "#E4405F", placeholder: "https://instagram.com/yourprofile" },
  { key: "linkedin", label: "LinkedIn", icon: FaLinkedinIn, color: "#0A66C2", placeholder: "https://linkedin.com/company/yourcompany" },
  { key: "x", label: "X (Twitter)", icon: FaXTwitter, color: "#14171A", placeholder: "https://x.com/yourprofile" },
  { key: "youtube", label: "YouTube", icon: FaYoutube, color: "#FF0000", placeholder: "https://youtube.com/@yourchannel" },
  { key: "tiktok", label: "TikTok", icon: FaTiktok, color: "#FE2C55", placeholder: "https://tiktok.com/@yourprofile" },
  { key: "github", label: "GitHub", icon: FaGithub, color: "#6E5494", placeholder: "https://github.com/yourorganization" },
  { key: "whatsapp", label: "WhatsApp", icon: FaWhatsapp, color: "#25D365", placeholder: "+94771234567", isPhone: true },
];

// Builds a safe link. Only https:// links are allowed (blocks javascript: links).
export function socialHref(platform, value) {
  const v = (value || "").trim();
  if (!v) return "";

  if (platform.isPhone) {
    const digits = v.replace(/\D/g, "");
    return digits ? `https://wa.me/${digits}` : "";
  }
  return /^https:\/\//i.test(v) ? v : "";
}

export function telHref(phone) {
  return `tel:${(phone || "").replace(/[^\d+]/g, "")}`;
}