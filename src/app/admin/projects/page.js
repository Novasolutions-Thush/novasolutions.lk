"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  AlertCircle,
  Database,
  FolderKanban,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Star,
  Trash2,
} from "lucide-react";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useProjects } from "@/hooks/useProjects";
import { deleteProject, seedProjects, syncSampleDetails } from "@/lib/projects";
import { deleteProjectImage } from "@/lib/upload";
import { projects as sampleProjects } from "@/data/projects";
import { ExternalLink, Sparkles } from "lucide-react";

export default function AdminProjectsPage() {
  const { projects, loading, error, reload } = useProjects();
  const [target, setTarget] = useState(null);
  const [busy, setBusy] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [message, setMessage] = useState("");
  const [syncing, setSyncing] = useState(false);

  const confirmDelete = async () => {
    if (!target) return;
    setBusy(true);
    setMessage("");
    try {
      await deleteProject(target.id);
      await deleteProjectImage(target.imagePublicId);
      setTarget(null);
      reload();
    } catch {
      setMessage("Could not delete the project. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const onSeed = async () => {
    setSeeding(true);
    setMessage("");
    try {
      await seedProjects(sampleProjects);
      reload();
    } catch {
      setMessage("Could not import the sample projects. Check your Firestore rules.");
    } finally {
      setSeeding(false);
    }
  };

  const needsSync = projects.some(
    (p) => !p.longDescription && sampleProjects.some((s) => s.title === p.title)
  );

  const onSync = async () => {
    setSyncing(true);
    setMessage("");
    try {
      await syncSampleDetails(projects, sampleProjects);
      reload();
    } catch {
      setMessage("Could not add the sample details. Check your Firestore rules.");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-ink-soft">
          {loading ? "Loading..." : `${projects.length} project${projects.length === 1 ? "" : "s"}`}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          {needsSync && (
            <button
              type="button"
              onClick={onSync}
              disabled={syncing}
              className="inline-flex items-center gap-2 border border-accent px-5 py-3 text-sm font-medium text-accent transition-colors duration-300 hover:bg-accent hover:text-white disabled:opacity-60 dark:hover:text-primary-dark"
            >
              {syncing ? <Loader2 size={17} className="animate-spin" /> : <Sparkles size={17} />}
              Add sample details
            </button>
          )}
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-2 bg-primary-dark px-6 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-deep-purple dark:bg-light-purple dark:text-primary-dark dark:hover:bg-soft-lavender"
          >
            <Plus size={18} />
            Add Project
          </Link>
        </div>
      </div>

      {message && (
        <p className="mt-5 flex items-center gap-2 text-sm text-red-500" role="alert">
          <AlertCircle size={16} />
          {message}
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
            <p className="mt-4 font-semibold">Could not load projects.</p>
            <p className="mt-1 text-sm text-ink-soft">
              Check your connection and Firestore rules.
            </p>
            <button
              type="button"
              onClick={reload}
              className="mt-6 inline-flex items-center gap-2 border border-accent px-5 py-2.5 text-sm font-medium text-accent transition-colors duration-300 hover:bg-accent hover:text-white dark:hover:text-primary-dark"
            >
              <RefreshCw size={16} />
              Try again
            </button>
          </div>
        )}

        {!loading && !error && projects.length === 0 && (
          <div className="border border-line bg-surface p-10 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center bg-primary-dark text-light-purple dark:bg-deep-purple dark:text-white">
              <FolderKanban size={26} />
            </div>
            <h2 className="mt-5 text-xl font-bold">No projects yet</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-ink-soft">
              Add your first project, or import the 6 sample projects to see how
              the public site looks. You can edit or delete them afterwards.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/admin/projects/new"
                className="inline-flex items-center gap-2 bg-primary-dark px-6 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-deep-purple dark:bg-light-purple dark:text-primary-dark dark:hover:bg-soft-lavender"
              >
                <Plus size={18} />
                Add Project
              </Link>
              <button
                type="button"
                onClick={onSeed}
                disabled={seeding}
                className="inline-flex items-center gap-2 border border-accent px-6 py-3 text-sm font-medium text-accent transition-colors duration-300 hover:bg-accent hover:text-white disabled:opacity-60 dark:hover:text-primary-dark"
              >
                {seeding ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Database size={18} />
                )}
                Import sample projects
              </button>
            </div>
          </div>
        )}

        {!loading && !error && projects.length > 0 && (
          <ul className="divide-y divide-line border border-line bg-surface">
            {projects.map((p) => (
              <li
                key={p.id}
                className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center"
              >
                <div className="relative h-32 w-full shrink-0 overflow-hidden bg-primary-dark sm:h-20 sm:w-32">
                  {p.image && (
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      sizes="(min-width: 640px) 128px, 100vw"
                      className="object-cover"
                    />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold">{p.title}</h3>
                    {p.featured && (
                      <span className="inline-flex items-center gap-1 bg-light-purple/30 px-2 py-0.5 text-xs font-medium text-accent">
                        <Star size={12} />
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs font-medium uppercase tracking-wider text-accent">
                    {p.category}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm text-ink-soft">
                    {p.description}
                  </p>
                </div>

                <div className="flex shrink-0 gap-2">
                  <Link
                    href={`/projects/${p.id}`}
                    target="_blank"
                    className="inline-flex items-center gap-2 border border-line px-4 py-2 text-sm font-medium transition-colors duration-300 hover:border-accent hover:text-accent"
                  >
                    <ExternalLink size={15} />
                    View
                  </Link>
                  <Link
                    href={`/admin/projects/${p.id}`}
                    className="inline-flex items-center gap-2 border border-line px-4 py-2 text-sm font-medium transition-colors duration-300 hover:border-accent hover:text-accent"
                  >
                    <Pencil size={15} />
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => setTarget(p)}
                    className="inline-flex items-center gap-2 border border-line px-4 py-2 text-sm font-medium text-red-500 transition-colors duration-300 hover:border-red-500"
                  >
                    <Trash2 size={15} />
                    Delete
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