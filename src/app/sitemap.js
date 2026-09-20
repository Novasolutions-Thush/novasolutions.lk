import { siteUrl } from "@/lib/site";

export default function sitemap() {
  const lastModified = new Date();

  const pages = [
    { path: "", priority: 1, changeFrequency: "weekly" },
    { path: "/about", priority: 0.8, changeFrequency: "monthly" },
    { path: "/services", priority: 0.9, changeFrequency: "monthly" },
    { path: "/projects", priority: 0.9, changeFrequency: "weekly" },
    { path: "/contact", priority: 0.8, changeFrequency: "yearly" },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
    { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
    { path: "/security", priority: 0.3, changeFrequency: "yearly" },
  ];

  return pages.map((p) => ({
    url: `${siteUrl}${p.path}`,
    lastModified,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));
}