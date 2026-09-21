"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  AlertCircle,
  ExternalLink,
  Newspaper,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import PostForm from "@/components/admin/PostForm";
import { useAsyncList } from "@/hooks/useAsyncList";
import { deletePost, formatPostDate, getAllPosts } from "@/lib/posts";
import { deleteProjectImage } from "@/lib/upload";

export default function AdminBlogPage() {
  const { items: posts, loading, error, reload } = useAsyncList(getAllPosts);
  const [editing, setEditing] = useState(null); // null | "new" | post
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
      await deletePost(target.id);
      await deleteProjectImage(target.coverPublicId);
      setTarget(null);
      reload();
    } catch {
      setMessage("Could not delete the article. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  if (editing) {
    return (
      <div className="mx-auto max-w-4xl">
        <PostForm
          post={editing === "new" ? null : editing}
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
          {loading ? "Loading..." : `${posts.length} article${posts.length === 1 ? "" : "s"}`}
        </p>
        <button
          type="button"
          onClick={() => setEditing("new")}
          className="inline-flex items-center gap-2 bg-primary-dark px-6 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-deep-purple dark:bg-light-purple dark:text-primary-dark dark:hover:bg-soft-lavender"
        >
          <Plus size={18} /> New Article
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
            <p className="mt-4 font-semibold">Could not load articles.</p>
            <p className="mt-1 text-sm text-ink-soft">Check your connection and Firestore rules.</p>
            <button type="button" onClick={reload} className="mt-6 inline-flex items-center gap-2 border border-accent px-5 py-2.5 text-sm font-medium text-accent transition-colors duration-300 hover:bg-accent hover:text-white dark:hover:text-primary-dark">
              <RefreshCw size={16} /> Try again
            </button>
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <div className="border border-line bg-surface p-10 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center bg-primary-dark text-light-purple dark:bg-deep-purple dark:text-white">
              <Newspaper size={26} />
            </div>
            <h2 className="mt-5 text-xl font-bold">No articles yet</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-ink-soft">
              Write your first article. Save it as a draft first if you are not ready to publish.
            </p>
            <button type="button" onClick={() => setEditing("new")} className="mt-6 inline-flex items-center gap-2 bg-primary-dark px-6 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-deep-purple dark:bg-light-purple dark:text-primary-dark dark:hover:bg-soft-lavender">
              <Plus size={18} /> New Article
            </button>
          </div>
        )}

        {!loading && !error && posts.length > 0 && (
          <ul className="divide-y divide-line border border-line bg-surface">
            {posts.map((p) => (
              <li key={p.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                <div className="relative h-32 w-full shrink-0 overflow-hidden bg-primary-dark sm:h-20 sm:w-32">
                  {p.coverImage && <Image src={p.coverImage} alt={p.title} fill sizes="(min-width: 640px) 128px, 100vw" className="object-cover" />}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold">{p.title}</h3>
                    <span className={`px-2 py-0.5 text-xs font-medium ${p.published ? "bg-accent/15 text-accent" : "border border-line text-ink-soft"}`}>
                      {p.published ? "Published" : "Draft"}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs font-medium uppercase tracking-wider text-accent">
                    {p.category}
                    {formatPostDate(p) && <span className="ml-2 normal-case tracking-normal text-ink-soft">{formatPostDate(p)}</span>}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm text-ink-soft">{p.excerpt}</p>
                </div>

                <div className="flex shrink-0 flex-wrap gap-2">
                  {p.published && (
                    <Link href={`/blog/${p.id}`} target="_blank" className="inline-flex items-center gap-2 border border-line px-4 py-2 text-sm font-medium transition-colors duration-300 hover:border-accent hover:text-accent">
                      <ExternalLink size={15} /> View
                    </Link>
                  )}
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
        title="Delete this article?"
        text={`"${target?.title ?? ""}" will be permanently deleted. This cannot be undone.`}
        busy={busy}
        onConfirm={confirmDelete}
        onCancel={() => setTarget(null)}
      />
    </div>
  );
}