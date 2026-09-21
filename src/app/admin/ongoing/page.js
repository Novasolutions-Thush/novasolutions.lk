"use client";

import Image from "next/image";
import { useState } from "react";
import { AlertCircle, Hammer, Pencil, Plus, RefreshCw, Trash2 } from "lucide-react";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import OngoingForm from "@/components/admin/OngoingForm";
import { useAsyncList } from "@/hooks/useAsyncList";
import { deleteOngoing, getOngoing } from "@/lib/ongoing";
import { deleteProjectImage } from "@/lib/upload";

export default function AdminOngoingPage() {
  const { items, loading, error, reload } = useAsyncList(getOngoing);
  const [editing, setEditing] = useState(null); // null | "new" | item
  const [target, setTarget] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const done = () => {
    setEditing(null);
    reload();
  };

  const confirmDelete = async () => {
    if (!target) return;
    setBusy(true);
    setMessage("");
    try {
      await deleteOngoing(target.id);
      await deleteProjectImage(target.imagePublicId);
      setTarget(null);
      reload();
    } catch {
      setMessage("Could not delete the project. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  if (editing) {
    return (
      <div className="mx-auto max-w-4xl">
        <OngoingForm item={editing === "new" ? null : editing} onDone={done} onCancel={() => setEditing(null)} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-ink-soft">
          {loading ? "Loading..." : `${items.length} ongoing project${items.length === 1 ? "" : "s"}`}
        </p>
        <button type="button" onClick={() => setEditing("new")} className="inline-flex items-center gap-2 bg-primary-dark px-6 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-deep-purple dark:bg-light-purple dark:text-primary-dark dark:hover:bg-soft-lavender">
          <Plus size={18} /> Add Project
        </button>
      </div>

      {message && (
        <p className="mt-5 flex items-center gap-2 text-sm text-red-500" role="alert">
          <AlertCircle size={16} /> {message}
        </p>
      )}

      <div className="mt-6">
        {loading && (
          <ul className="divide-y divide-line border border-line bg-surface">
            {[0, 1, 2].map((i) => (
              <li key={i} className="flex items-center gap-4 p-4">
                <div className="h-20 w-32 animate-pulse bg-line" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/3 animate-pulse bg-line" />
                  <div className="h-3 w-2/3 animate-pulse bg-line" />
                </div>
              </li>
            ))}
          </ul>
        )}

        {!loading && error && (
          <div className="border border-line bg-surface p-10 text-center">
            <AlertCircle size={40} className="mx-auto text-red-500" />
            <p className="mt-4 font-semibold">Could not load ongoing projects.</p>
            <p className="mt-1 text-sm text-ink-soft">Check your connection and Firestore rules.</p>
            <button type="button" onClick={reload} className="mt-6 inline-flex items-center gap-2 border border-accent px-5 py-2.5 text-sm font-medium text-accent transition-colors duration-300 hover:bg-accent hover:text-white dark:hover:text-primary-dark">
              <RefreshCw size={16} /> Try again
            </button>
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="border border-line bg-surface p-10 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center bg-primary-dark text-light-purple dark:bg-deep-purple dark:text-white">
              <Hammer size={26} />
            </div>
            <h2 className="mt-5 text-xl font-bold">No ongoing projects yet</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-ink-soft">Add a project you are building right now, with its progress.</p>
            <button type="button" onClick={() => setEditing("new")} className="mt-6 inline-flex items-center gap-2 bg-primary-dark px-6 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-deep-purple dark:bg-light-purple dark:text-primary-dark dark:hover:bg-soft-lavender">
              <Plus size={18} /> Add Project
            </button>
          </div>
        )}

        {!loading && !error && items.length > 0 && (
          <ul className="divide-y divide-line border border-line bg-surface">
            {items.map((p) => (
              <li key={p.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                <div className="relative h-32 w-full shrink-0 overflow-hidden bg-primary-dark sm:h-20 sm:w-32">
                  {p.image && <Image src={p.image} alt={p.title} fill sizes="(min-width: 640px) 128px, 100vw" className="object-cover" />}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold">{p.title}</h3>
                    <span className="bg-accent/15 px-2 py-0.5 text-xs font-medium text-accent">{p.status}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="h-2 w-full max-w-[14rem] bg-line">
                      <div className="h-full bg-accent" style={{ width: `${p.progress || 0}%` }} />
                    </div>
                    <span className="text-xs font-semibold text-ink-soft">{p.progress || 0}%</span>
                  </div>
                  {p.launch && <p className="mt-1 text-xs text-ink-soft">Launch: {p.launch}</p>}
                </div>

                <div className="flex shrink-0 gap-2">
                  <button type="button" onClick={() => setEditing(p)} className="inline-flex items-center gap-2 border border-line px-4 py-2 text-sm font-medium transition-colors duration-300 hover:border-accent hover:text-accent">
                    <Pencil size={15} /> Edit
                  </button>
                  <button type="button" onClick={() => setTarget(p)} className="inline-flex items-center gap-2 border border-line px-4 py-2 text-sm font-medium text-red-500 transition-colors duration-300 hover:border-red-500">
                    <Trash2 size={15} /> Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(target)}
        title="Delete this project?"
        text={`"${target?.title ?? ""}" will be permanently removed from the website. This cannot be undone.`}
        busy={busy}
        onConfirm={confirmDelete}
        onCancel={() => setTarget(null)}
      />
    </div>
  );
}