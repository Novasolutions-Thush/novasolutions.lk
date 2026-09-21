"use client";

import Image from "next/image";
import { useState } from "react";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  Pencil,
  Plus,
  RefreshCw,
  Star,
  Trash2,
  Users,
} from "lucide-react";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import TeamForm from "@/components/admin/TeamForm";
import { useAsyncList } from "@/hooks/useAsyncList";
import { deleteMember, getTeam, swapOrder } from "@/lib/team";
import { deleteProjectImage } from "@/lib/upload";

export default function AdminTeamPage() {
  const { items: team, loading, error, reload } = useAsyncList(getTeam);
  const [editing, setEditing] = useState(null); // null | "new" | member
  const [target, setTarget] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const done = () => {
    setEditing(null);
    reload();
  };

  const move = async (index, dir) => {
    const other = team[index + dir];
    if (!other) return;
    setMessage("");
    try {
      await swapOrder(team[index], other);
      reload();
    } catch {
      setMessage("Could not change the order. Please try again.");
    }
  };

  const confirmDelete = async () => {
    if (!target) return;
    setBusy(true);
    setMessage("");
    try {
      await deleteMember(target.id);
      await deleteProjectImage(target.photoPublicId);
      setTarget(null);
      reload();
    } catch {
      setMessage("Could not delete the member. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  if (editing) {
    return (
      <div className="mx-auto max-w-3xl">
        <TeamForm
          member={editing === "new" ? null : editing}
          onDone={done}
          onCancel={() => setEditing(null)}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-ink-soft">
          {loading ? "Loading..." : `${team.length} member${team.length === 1 ? "" : "s"}`}
        </p>
        <button
          type="button"
          onClick={() => setEditing("new")}
          className="inline-flex items-center gap-2 bg-primary-dark px-6 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-deep-purple dark:bg-light-purple dark:text-primary-dark dark:hover:bg-soft-lavender"
        >
          <Plus size={18} /> Add Member
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
                <div className="h-20 w-16 animate-pulse bg-line" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/3 animate-pulse bg-line" />
                  <div className="h-3 w-1/2 animate-pulse bg-line" />
                </div>
              </li>
            ))}
          </ul>
        )}

        {!loading && error && (
          <div className="border border-line bg-surface p-10 text-center">
            <AlertCircle size={40} className="mx-auto text-red-500" />
            <p className="mt-4 font-semibold">Could not load the team.</p>
            <p className="mt-1 text-sm text-ink-soft">Check your connection and Firestore rules.</p>
            <button type="button" onClick={reload} className="mt-6 inline-flex items-center gap-2 border border-accent px-5 py-2.5 text-sm font-medium text-accent transition-colors duration-300 hover:bg-accent hover:text-white dark:hover:text-primary-dark">
              <RefreshCw size={16} /> Try again
            </button>
          </div>
        )}

        {!loading && !error && team.length === 0 && (
          <div className="border border-line bg-surface p-10 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center bg-primary-dark text-light-purple dark:bg-deep-purple dark:text-white">
              <Users size={26} />
            </div>
            <h2 className="mt-5 text-xl font-bold">No team members yet</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-ink-soft">
              Start with the Founder / CEO (tick &quot;Leadership&quot;), then add your developers.
            </p>
            <button type="button" onClick={() => setEditing("new")} className="mt-6 inline-flex items-center gap-2 bg-primary-dark px-6 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-deep-purple dark:bg-light-purple dark:text-primary-dark dark:hover:bg-soft-lavender">
              <Plus size={18} /> Add Member
            </button>
          </div>
        )}

        {!loading && !error && team.length > 0 && (
          <ul className="divide-y divide-line border border-line bg-surface">
            {team.map((m, i) => (
              <li key={m.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                <div className="relative h-28 w-24 shrink-0 overflow-hidden bg-primary-dark">
                  {m.photo && <Image src={m.photo} alt={m.name} fill sizes="96px" className="object-cover" />}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold">{m.name}</h3>
                    {m.leader && (
                      <span className="inline-flex items-center gap-1 bg-light-purple/30 px-2 py-0.5 text-xs font-medium text-accent">
                        <Star size={12} /> Leadership
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm text-accent">{m.role}</p>
                  {m.bio && <p className="mt-1 line-clamp-2 text-sm text-ink-soft">{m.bio}</p>}
                </div>

                <div className="flex shrink-0 flex-wrap gap-2">
                  <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up" className="grid h-10 w-10 place-items-center border border-line transition-colors duration-300 hover:border-accent hover:text-accent disabled:opacity-40">
                    <ArrowUp size={16} />
                  </button>
                  <button type="button" onClick={() => move(i, 1)} disabled={i === team.length - 1} aria-label="Move down" className="grid h-10 w-10 place-items-center border border-line transition-colors duration-300 hover:border-accent hover:text-accent disabled:opacity-40">
                    <ArrowDown size={16} />
                  </button>
                  <button type="button" onClick={() => setEditing(m)} className="inline-flex items-center gap-2 border border-line px-4 py-2 text-sm font-medium transition-colors duration-300 hover:border-accent hover:text-accent">
                    <Pencil size={15} /> Edit
                  </button>
                  <button type="button" onClick={() => setTarget(m)} className="inline-flex items-center gap-2 border border-line px-4 py-2 text-sm font-medium text-red-500 transition-colors duration-300 hover:border-red-500">
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
        title="Remove this team member?"
        text={`"${target?.name ?? ""}" will be permanently removed from the website. This cannot be undone.`}
        busy={busy}
        onConfirm={confirmDelete}
        onCancel={() => setTarget(null)}
      />
    </div>
  );
}