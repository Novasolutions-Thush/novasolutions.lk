"use client";

import { useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Clock,
  Inbox,
  Loader2,
  Mail,
  MailOpen,
  MailX,
  Phone,
  Reply,
  Tag,
  Trash2,
  FolderKanban,
} from "lucide-react";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useMessages } from "@/hooks/useMessages";
import {
  deleteMessage,
  formatMessageDate,
  setMessageRead,
} from "@/lib/messages";
import Link from "next/link";

export default function AdminMessagesPage() {
  const { messages, loading, error } = useMessages();
  const [filter, setFilter] = useState("all"); // all | unread
  const [selectedId, setSelectedId] = useState(null);
  const [target, setTarget] = useState(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");

  const unread = messages.filter((m) => !m.read).length;
  const visible =
    filter === "unread" ? messages.filter((m) => !m.read) : messages;
  const selected = messages.find((m) => m.id === selectedId) ?? null;

  const openMessage = (m) => {
    setSelectedId(m.id);
    setNotice("");
    if (!m.read) setMessageRead(m.id, true).catch(() => {});
  };

  const toggleRead = async (m) => {
    setNotice("");
    try {
      await setMessageRead(m.id, !m.read);
    } catch {
      setNotice("Could not update the message. Please try again.");
    }
  };

  const confirmDelete = async () => {
    if (!target) return;
    setBusy(true);
    setNotice("");
    try {
      await deleteMessage(target.id);
      if (selectedId === target.id) setSelectedId(null);
      setTarget(null);
    } catch {
      setNotice("Could not delete the message. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto grid max-w-6xl place-items-center border border-line bg-surface p-16">
        <Loader2 size={30} className="animate-spin text-accent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-xl border border-line bg-surface p-10 text-center">
        <AlertCircle size={40} className="mx-auto text-red-500" />
        <p className="mt-4 font-semibold">Could not load messages.</p>
        <p className="mt-1 text-sm text-ink-soft">
          Check your connection and Firestore rules.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      {notice && (
        <p className="mb-4 flex items-center gap-2 text-sm text-red-500" role="alert">
          <AlertCircle size={16} />
          {notice}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-[23rem_1fr]">
        {/* ---------- List ---------- */}
        <section className={selected ? "hidden lg:block" : ""} aria-label="Message list">
          <div className="flex gap-2" role="tablist" aria-label="Filter messages">
            {[
              { key: "all", label: `All (${messages.length})` },
              { key: "unread", label: `Unread (${unread})` },
            ].map((t) => {
              const active = filter === t.key;
              return (
                <button
                  key={t.key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(t.key)}
                  className={`border px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                    active
                      ? "border-primary-dark bg-primary-dark text-white dark:border-light-purple dark:bg-light-purple dark:text-primary-dark"
                      : "border-line text-ink-soft hover:border-accent hover:text-accent"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          {visible.length === 0 ? (
            <div className="mt-4 border border-line bg-surface p-10 text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center bg-primary-dark text-light-purple dark:bg-deep-purple dark:text-white">
                <Inbox size={26} />
              </div>
              <p className="mt-4 font-semibold">
                {filter === "unread" ? "No unread messages" : "No messages yet"}
              </p>
              <p className="mt-1 text-sm text-ink-soft">
                Messages from the contact form will appear here.
              </p>
            </div>
          ) : (
            <ul className="mt-4 divide-y divide-line border border-line bg-surface">
              {visible.map((m) => {
                const active = m.id === selectedId;
                return (
                  <li key={m.id}>
                    <button
                      type="button"
                      onClick={() => openMessage(m)}
                      className={`flex w-full items-start gap-3 p-4 text-left transition-colors duration-300 ${
                        active ? "bg-accent/10" : "hover:bg-accent/5"
                      }`}
                    >
                      <span
                        className={`mt-2 h-2.5 w-2.5 shrink-0 ${
                          m.read ? "bg-transparent" : "bg-accent"
                        }`}
                        aria-label={m.read ? "Read" : "Unread"}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="flex items-baseline justify-between gap-3">
                          <span
                            className={`truncate ${
                              m.read ? "font-medium" : "font-bold"
                            }`}
                          >
                            {m.name}
                          </span>
                          <span className="shrink-0 text-xs text-ink-soft">
                            {formatMessageDate(m.createdAt)}
                          </span>
                        </span>
                        <span className="mt-0.5 block truncate text-xs text-accent">
                          {m.service || "General enquiry"}
                        </span>
                        <span className="mt-1 line-clamp-2 block text-sm text-ink-soft">
                          {m.message}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* ---------- Detail ---------- */}
        <section className={selected ? "" : "hidden lg:block"} aria-label="Message detail">
          {selected ? (
            <article className="border border-line bg-surface p-6 sm:p-8">
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-accent transition-opacity duration-300 hover:opacity-70 lg:hidden"
              >
                <ArrowLeft size={16} />
                Back to inbox
              </button>

              <h2 className="break-words text-2xl font-extrabold">
                {selected.name}
              </h2>

              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex items-center gap-3 text-ink-soft">
                  <Mail size={16} className="shrink-0 text-accent" />
                  <a
                    href={`mailto:${selected.email}`}
                    className="break-all transition-colors duration-300 hover:text-accent"
                  >
                    {selected.email}
                  </a>
                </li>
                {selected.phone && (
                  <li className="flex items-center gap-3 text-ink-soft">
                    <Phone size={16} className="shrink-0 text-accent" />
                    <a
                      href={`tel:${selected.phone}`}
                      className="transition-colors duration-300 hover:text-accent"
                    >
                      {selected.phone}
                    </a>
                  </li>
                )}
                <li className="flex items-center gap-3 text-ink-soft">
                  <Tag size={16} className="shrink-0 text-accent" />
                  {selected.service || "General enquiry"}
                </li>
                <li className="flex items-center gap-3 text-ink-soft">
                  <Clock size={16} className="shrink-0 text-accent" />
                  {formatMessageDate(selected.createdAt)}
                </li>
              </ul>
              
              {selected.projectId && (
                <li className="flex items-center gap-3 text-ink-soft">
                  <FolderKanban size={16} className="shrink-0 text-accent" />
                  <Link
                    href={`/projects/${selected.projectId}`}
                    target="_blank"
                    className="transition-colors duration-300 hover:text-accent"
                  >
                    Project: {selected.projectTitle}
                  </Link>
                </li>
              )}

              <div className="mt-6 whitespace-pre-wrap break-words border-t border-line pt-6 leading-relaxed">
                {selected.message}
              </div>

              <div className="mt-8 flex flex-wrap gap-3 border-t border-line pt-6">
                <a
                  href={`mailto:${selected.email}?subject=${encodeURIComponent(
                    "Re: Your enquiry to Nova Solutions"
                  )}`}
                  className="inline-flex items-center gap-2 bg-primary-dark px-6 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-deep-purple dark:bg-light-purple dark:text-primary-dark dark:hover:bg-soft-lavender"
                >
                  <Reply size={17} />
                  Reply by Email
                </a>
                <button
                  type="button"
                  onClick={() => toggleRead(selected)}
                  className="inline-flex items-center gap-2 border border-line px-5 py-3 text-sm font-medium transition-colors duration-300 hover:border-accent hover:text-accent"
                >
                  {selected.read ? <MailX size={17} /> : <MailOpen size={17} />}
                  {selected.read ? "Mark as unread" : "Mark as read"}
                </button>
                <button
                  type="button"
                  onClick={() => setTarget(selected)}
                  className="inline-flex items-center gap-2 border border-line px-5 py-3 text-sm font-medium text-red-500 transition-colors duration-300 hover:border-red-500"
                >
                  <Trash2 size={17} />
                  Delete
                </button>
              </div>
            </article>
          ) : (
            <div className="grid h-full min-h-[18rem] place-items-center border border-line bg-surface p-10 text-center">
              <div>
                <MailOpen size={40} className="mx-auto text-ink-soft" />
                <p className="mt-4 font-semibold">Select a message</p>
                <p className="mt-1 text-sm text-ink-soft">
                  Choose a message from the list to read it.
                </p>
              </div>
            </div>
          )}
        </section>
      </div>

      <ConfirmDialog
        open={Boolean(target)}
        title="Delete this message?"
        text={`The message from "${target?.name ?? ""}" will be permanently deleted. This cannot be undone.`}
        busy={busy}
        onConfirm={confirmDelete}
        onCancel={() => setTarget(null)}
      />
    </div>
  );
}