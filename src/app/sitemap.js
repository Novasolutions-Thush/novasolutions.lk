import { siteUrl } from "@/lib/site";
import { listProjectEntries, listPublishedPostEntries } from "@/lib/serverFirestore";

// Rebuilt at most once an hour
export const revalidate = 3600;

export default async function sitemap() {
  const now = new Date();

  const pages = [
    { path: "", priority: 1, changeFrequency: "weekly" },
    { path: "/about", priority: 0.8, changeFrequency: "monthly" },
    { path: "/services", priority: 0.9, changeFrequency: "monthly" },
    { path: "/projects", priority: 0.9, changeFrequency: "weekly" },
    { path: "/blog", priority: 0.7, changeFrequency: "weekly" },
    { path: "/team", priority: 0.6, changeFrequency: "monthly" },
    { path: "/ceo", priority: 0.5, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.8, changeFrequency: "yearly" },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
    { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
    { path: "/security", priority: 0.3, changeFrequency: "yearly" },
    { path: "/gallery", priority: 0.5, changeFrequency: "monthly" },
    { path: "/ongoing-projects", priority: 0.6, changeFrequency: "weekly" },
    
  ].map((p) => ({
    url: `${siteUrl}${p.path}`,
    lastModified: now,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));

  const [projects, posts] = await Promise.all([
    listProjectEntries(),
    listPublishedPostEntries(),
  ]);

  const projectPages = projects.map((p) => ({
    url: `${siteUrl}/projects/${p.id}`,
    lastModified: p.updated ? new Date(p.updated) : now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const postPages = posts.map((p) => ({
    url: `${siteUrl}/blog/${p.id}`,
    lastModified: p.updated ? new Date(p.updated) : now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...pages, ...projectPages, ...postPages];
}