"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Circle,
  ExternalLink,
  FolderKanban,
  Hammer,
  Images,
  Inbox,
  Newspaper,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import StatCard from "@/components/admin/StatCard";
import { useProjects } from "@/hooks/useProjects";
import { useMessages } from "@/hooks/useMessages";
import { useAsyncList } from "@/hooks/useAsyncList";
import { getTeam } from "@/lib/team";
import { getAllPosts } from "@/lib/posts";
import { getGallery } from "@/lib/gallery";
import { getOngoing } from "@/lib/ongoing";
import { getCeo } from "@/lib/ceo";

const roadmap = [
  { label: "Admin authentication and security", done: true },
  { label: "Projects with detail pages", done: true },
  { label: "Contact messages inbox", done: true },
  { label: "Site settings and social links", done: true },
  { label: "Team, CEO page and blog", done: true },
  { label: "Gallery and ongoing projects", done: true },
];

const actions = [
  { icon: FolderKanban, title: "Manage Projects", text: "Add or edit portfolio projects.", href: "/admin/projects" },
  { icon: Newspaper, title: "Write an Article", text: "Publish a new blog post.", href: "/admin/blog" },
  { icon: Images, title: "Upload Photos", text: "Add photos to the gallery.", href: "/admin/gallery" },
  { icon: Inbox, title: "Open Inbox", text: "Read messages from visitors.", href: "/admin/messages" },
  { icon: ExternalLink, title: "View Website", text: "See the live public website.", href: "/", external: true },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const name = user?.email?.split("@")[0] ?? "Admin";

  const { projects, loading: projectsLoading } = useProjects();
  const { messages, loading: messagesLoading } = useMessages();
  const { items: team, loading: teamLoading } = useAsyncList(getTeam);
  const { items: posts, loading: postsLoading } = useAsyncList(getAllPosts);
  const { items: gallery, loading: galleryLoading } = useAsyncList(getGallery);
  const { items: ongoing, loading: ongoingLoading } = useAsyncList(getOngoing);

  const [ceo, setCeo] = useState({ loading: true, ready: false });
  useEffect(() => {
    let active = true;
    getCeo()
      .then((c) => active && setCeo({ loading: false, ready: Boolean(c.name && c.message) }))
      .catch(() => active && setCeo({ loading: false, ready: false }));
    return () => {
      active = false;
    };
  }, []);

  const dots = (loading, value) => (loading ? "…" : value);
  const unread = messages.filter((m) => !m.read).length;
  const published = posts.filter((p) => p.published).length;
  const drafts = posts.length - published;
  const leaders = team.filter((m) => m.leader).length;
  const avgProgress = ongoing.length
    ? Math.round(ongoing.reduce((sum, p) => sum + (Number(p.progress) || 0), 0) / ongoing.length)
    : 0;

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      {/* Welcome */}
      <section className="relative overflow-hidden bg-primary-dark px-6 py-8 text-white sm:px-10 sm:py-10">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-light-purple/25 blur-3xl" aria-hidden="true" />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-light-purple">Welcome back</p>
          <h2 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">
            Hello, <span className="capitalize text-soft-lavender">{name}</span>
          </h2>
          <p className="mt-2 max-w-xl text-sm text-white/70 sm:text-base">
            Manage the Nova Solutions website from here. Everything you change appears on the public site straight away.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section aria-label="Statistics">
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={FolderKanban} label="Projects" value={dots(projectsLoading, projects.length)} note="Shown in the portfolio" />
          <StatCard
            icon={Hammer}
            label="Ongoing Projects"
            value={dots(ongoingLoading, ongoing.length)}
            note={ongoingLoading ? "Loading..." : ongoing.length ? `Average progress ${avgProgress}%` : "None added yet"}
          />
          <StatCard
            icon={Users}
            label="Team Members"
            value={dots(teamLoading, team.length)}
            note={teamLoading ? "Loading..." : `${leaders} in leadership`}
          />
          <StatCard
            icon={Newspaper}
            label="Blog Articles"
            value={dots(postsLoading, published)}
            note={postsLoading ? "Loading..." : `${published} published, ${drafts} draft${drafts === 1 ? "" : "s"}`}
          />
          <StatCard icon={Images} label="Gallery Photos" value={dots(galleryLoading, gallery.length)} note="Shown on /gallery" />
          <StatCard
            icon={Inbox}
            label="Messages"
            value={dots(messagesLoading, messages.length)}
            note={messagesLoading ? "Loading..." : `${unread} unread`}
          />
          <StatCard
            icon={UserRound}
            label="CEO Page"
            value={dots(ceo.loading, ceo.ready ? "Live" : "Not set")}
            note={ceo.ready ? "Message is published" : "Add the CEO's message"}
          />
          <StatCard icon={ShieldCheck} label="Security" value="Active" note="Admin-only access enforced" />
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        {/* Quick actions */}
        <section aria-label="Quick actions">
          <h3 className="text-lg font-bold">Quick Actions</h3>
          <div className="mt-4 space-y-3">
            {actions.map((a) => {
              const Icon = a.icon;
              return (
                <Link
                  key={a.title}
                  href={a.href}
                  target={a.external ? "_blank" : undefined}
                  rel={a.external ? "noopener noreferrer" : undefined}
                  className="group flex items-center gap-5 border border-line bg-surface p-5 transition-colors duration-300 hover:border-accent"
                >
                  <div className="grid h-12 w-12 shrink-0 place-items-center bg-primary-dark text-light-purple transition-colors duration-300 group-hover:bg-light-purple group-hover:text-primary-dark dark:bg-deep-purple dark:text-white dark:group-hover:bg-light-purple dark:group-hover:text-primary-dark">
                    <Icon size={22} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{a.title}</p>
                    <p className="text-sm text-ink-soft">{a.text}</p>
                  </div>
                  <ArrowRight size={18} className="shrink-0 text-accent transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              );
            })}
          </div>
        </section>

        {/* Roadmap */}
        <section aria-label="Setup progress">
          <h3 className="text-lg font-bold">Setup Progress</h3>
          <ul className="mt-4 divide-y divide-line border border-line bg-surface">
            {roadmap.map((item) => (
              <li key={item.label} className="flex items-start gap-3 p-4">
                {item.done ? (
                  <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-accent" />
                ) : (
                  <Circle size={20} className="mt-0.5 shrink-0 text-ink-soft" />
                )}
                <span className={`text-sm ${item.done ? "text-ink" : "text-ink-soft"}`}>{item.label}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}