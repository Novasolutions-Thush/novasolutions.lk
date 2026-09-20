"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Circle,
  ExternalLink,
  FolderKanban,
  Inbox,
  Layers,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import StatCard from "@/components/admin/StatCard";
import { projects } from "@/data/projects";
import { services } from "@/data/services";
import { useProjects } from "@/hooks/useProjects";
import { useMessages } from "@/hooks/useMessages";  

const roadmap = [
  { label: "Admin authentication and security", done: true },
  { label: "Admin panel layout (sidebar and top bar)", done: true },
  { label: "Manage projects (Firestore + Cloudinary upload)", done: true },
  { label: "Contact messages inbox", done: true },
  { label: "Site settings", done: true },
];

const actions = [
  {
    icon: FolderKanban,
    title: "Manage Projects",
    text: "Add or edit portfolio projects.",
    href: "/admin/projects",
  },
  {
    icon: Inbox,
    title: "Open Inbox",
    text: "Read messages from the contact form.",
    href: "/admin/messages",
  },
  {
    icon: ExternalLink,
    title: "View Website",
    text: "See the live public website.",
    href: "/",
    external: true,
  },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const name = user?.email?.split("@")[0] ?? "Admin";
  const { projects, loading: projectsLoading } = useProjects();
  const { messages, loading: messagesLoading } = useMessages();
  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      {/* Welcome */}
      <section className="relative overflow-hidden bg-primary-dark px-6 py-8 text-white sm:px-10 sm:py-10">
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-light-purple/25 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-light-purple">
            Welcome back
          </p>
          <h2 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">
            Hello, <span className="capitalize text-soft-lavender">{name}</span>
          </h2>
          <p className="mt-2 max-w-xl text-sm text-white/70 sm:text-base">
            Manage the Nova Solutions website from here. Everything you change
            will appear on the public site.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section aria-label="Statistics">
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
              icon={FolderKanban}
              label="Projects"
              value={projectsLoading ? "…" : projects.length}
              note="Stored in Firestore"
            />
          <StatCard
            icon={Layers}
            label="Services"
            value={services.length}
            note="Shown on the public website"
          />
          <StatCard
            icon={Inbox}
            label="Messages"
            value={messagesLoading ? "…" : messages.length}
            note={messagesLoading ? "Loading..." : `${unreadCount} unread`}
          />
          <StatCard
            icon={ShieldCheck}
            label="Security"
            value="Active"
            note="Admin-only access enforced"
          />
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
                  <ArrowRight
                    size={18}
                    className="shrink-0 text-accent transition-transform duration-300 group-hover:translate-x-1"
                  />
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
                <span
                  className={`text-sm ${
                    item.done ? "text-ink" : "text-ink-soft"
                  }`}
                >
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}