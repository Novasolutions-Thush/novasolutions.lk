"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ImagePlus,
  Images,
  Loader2,
  Pencil,
  RefreshCw,
  Save,
  Trash2,
  X,
} from "lucide-react";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { MAX_MB, checkImage } from "@/components/admin/FormBits";
import { galleryCategories } from "@/data/galleryCategories";
import { useAsyncList } from "@/hooks/useAsyncList";
import {
  addGalleryItem,
  deleteGalleryItem,
  getGallery,
  updateGalleryItem,
} from "@/lib/gallery";
import { deleteProjectImage, uploadProjectImage } from "@/lib/upload";

const MAX_BATCH = 20;

export default function AdminGalleryPage() {
  const { items, loading, error, reload } = useAsyncList(getGallery);
  const blobs = useRef([]);

  // Upload panel
  const [category, setCategory] = useState(galleryCategories[0]);
  const [picked, setPicked] = useState([]); // [{ file, preview }]
  const [progress, setProgress] = useState(null); // null | { done, total }
  const [notice, setNotice] = useState({ type: "", text: "" });

  // Edit / delete
  const [editId, setEditId] = useState(null);
  const [edit, setEdit] = useState({ caption: "", category: "" });
  const [savingEdit, setSavingEdit] = useState(false);
  const [target, setTarget] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const list = blobs.current;
    return () => list.forEach((u) => URL.revokeObjectURL(u));
  }, []);

  const onPick = (e) => {
    const files = [...(e.target.files || [])];
    e.target.value = "";
    setNotice({ type: "", text: "" });

    const room = MAX_BATCH - picked.length;
    let err = files.length > room ? `Maximum ${MAX_BATCH} images at once.` : "";
    const added = [];

    files.slice(0, Math.max(room, 0)).forEach((file) => {
      const msg = checkImage(file);
      if (msg) {
        err = `${file.name}: ${msg}`;
        return;
      }
      const preview = URL.createObjectURL(file);
      blobs.current.push(preview);
      added.push({ file, preview, caption: "" });
    });

    if (err) setNotice({ type: "error", text: err });
    if (added.length) setPicked((p) => [...p, ...added]);
  };

  const upload = async () => {
    if (!picked.length) return;
    setNotice({ type: "", text: "" });
    setProgress({ done: 0, total: picked.length });

    let done = 0;
    const failed = [];

    for (const p of picked) {
      let uploaded = null;
      try {
        uploaded = await uploadProjectImage(p.file);
        await addGalleryItem({
          url: uploaded.url,
          publicId: uploaded.publicId,
          caption: p.caption.trim().slice(0, 150),
          category,
        });
        done += 1;
        setProgress({ done, total: picked.length });
      } catch {
        if (uploaded) await deleteProjectImage(uploaded.publicId);
        failed.push(p);
      }
    }

    setProgress(null);
    setPicked(failed);
    reload();
    setNotice(
      failed.length
        ? { type: "error", text: `${done} uploaded, ${failed.length} failed. The failed images are still listed, try again.` }
        : { type: "ok", text: `${done} image${done === 1 ? "" : "s"} uploaded.` }
    );
  };

  const startEdit = (item) => {
    setEditId(item.id);
    setEdit({ caption: item.caption || "", category: item.category || galleryCategories[0] });
  };

  const saveEdit = async () => {
    setSavingEdit(true);
    try {
      await updateGalleryItem(editId, {
        caption: edit.caption.trim().slice(0, 150),
        category: edit.category,
      });
      setEditId(null);
      reload();
    } catch {
      setNotice({ type: "error", text: "Could not save the changes." });
    } finally {
      setSavingEdit(false);
    }
  };

  const confirmDelete = async () => {
    if (!target) return;
    setBusy(true);
    try {
      await deleteGalleryItem(target.id);
      await deleteProjectImage(target.publicId);
      setTarget(null);
      reload();
    } catch {
      setNotice({ type: "error", text: "Could not delete the image." });
    } finally {
      setBusy(false);
    }
  };

  const uploading = progress !== null;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Upload panel */}
      <section className="border border-line bg-surface p-6 sm:p-8">
        <h2 className="text-lg font-bold">Upload Photos</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Choose up to {MAX_BATCH} images at once (JPG, PNG or WebP, max {MAX_MB} MB each).
        </p>

        <div className="mt-6 grid gap-5 sm:grid-cols-[14rem_1fr] sm:items-end">
          <div>
            <label htmlFor="g-category" className="mb-2 block text-sm font-medium">
              Category for this batch
            </label>
            <select
              id="g-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={uploading}
              className="field"
            >
              {galleryCategories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <label
            htmlFor="g-files"
            className={`inline-flex w-fit cursor-pointer items-center gap-2 border border-accent px-5 py-3 text-sm font-medium text-accent transition-colors duration-300 hover:bg-accent hover:text-white dark:hover:text-primary-dark ${uploading ? "pointer-events-none opacity-60" : ""}`}
          >
            <ImagePlus size={17} />
            Choose images
            <input id="g-files" type="file" multiple accept="image/jpeg,image/png,image/webp" onChange={onPick} className="sr-only" />
          </label>
        </div>

        {picked.length > 0 && (
          <>
            <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {picked.map((p, i) => (
                <li key={p.preview} className="border border-line p-2">
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-primary-dark/10">
                    <Image src={p.preview} alt="Selected" fill sizes="200px" unoptimized className="object-cover" />
                    <button
                      type="button"
                      disabled={uploading}
                      onClick={() => setPicked((x) => x.filter((_, j) => j !== i))}
                      aria-label="Remove"
                      className="absolute right-1.5 top-1.5 grid h-8 w-8 place-items-center bg-primary-dark/80 text-white transition-colors duration-300 hover:bg-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={p.caption}
                    disabled={uploading}
                    maxLength={150}
                    onChange={(e) =>
                      setPicked((x) => x.map((y, j) => (j === i ? { ...y, caption: e.target.value } : y)))
                    }
                    placeholder="Caption (optional)"
                    aria-label={`Caption for image ${i + 1}`}
                    className="field mt-2"
                  />
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={upload}
                disabled={uploading}
                className="inline-flex items-center gap-2 bg-primary-dark px-8 py-3.5 font-semibold text-white transition-colors duration-300 hover:bg-deep-purple disabled:cursor-not-allowed disabled:opacity-70 dark:bg-light-purple dark:text-primary-dark dark:hover:bg-soft-lavender"
              >
                {uploading ? (
                  <><Loader2 size={18} className="animate-spin" /> Uploading {progress.done} / {progress.total}</>
                ) : (
                  <>Upload {picked.length} image{picked.length === 1 ? "" : "s"}</>
                )}
              </button>
              {!uploading && (
                <button type="button" onClick={() => setPicked([])} className="border border-line px-6 py-3.5 font-medium transition-colors duration-300 hover:border-accent hover:text-accent">
                  Clear
                </button>
              )}
            </div>
          </>
        )}

        {notice.text && (
          <p
            className={`mt-5 flex items-center gap-2 text-sm ${notice.type === "ok" ? "text-accent" : "text-red-500"}`}
            role={notice.type === "ok" ? "status" : "alert"}
          >
            {notice.type === "ok" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            {notice.text}
          </p>
        )}
      </section>

      {/* Library */}
      <section>
        <p className="text-sm text-ink-soft">
          {loading ? "Loading..." : `${items.length} photo${items.length === 1 ? "" : "s"}`}
        </p>

        <div className="mt-4">
          {loading && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {[0, 1, 2, 3].map((i) => <div key={i} className="aspect-[4/3] animate-pulse bg-line" />)}
            </div>
          )}

          {!loading && error && (
            <div className="border border-line bg-surface p-10 text-center">
              <AlertCircle size={40} className="mx-auto text-red-500" />
              <p className="mt-4 font-semibold">Could not load the gallery.</p>
              <button type="button" onClick={reload} className="mt-6 inline-flex items-center gap-2 border border-accent px-5 py-2.5 text-sm font-medium text-accent transition-colors duration-300 hover:bg-accent hover:text-white dark:hover:text-primary-dark">
                <RefreshCw size={16} /> Try again
              </button>
            </div>
          )}

          {!loading && !error && items.length === 0 && (
            <div className="border border-line bg-surface p-10 text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center bg-primary-dark text-light-purple dark:bg-deep-purple dark:text-white">
                <Images size={26} />
              </div>
              <h2 className="mt-5 text-xl font-bold">No photos yet</h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-ink-soft">Use the upload panel above to add your first photos.</p>
            </div>
          )}

          {!loading && !error && items.length > 0 && (
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => {
                const editing = editId === item.id;
                return (
                  <li key={item.id} className="border border-line bg-surface p-3">
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-primary-dark">
                      <Image src={item.url} alt={item.caption || "Gallery photo"} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
                    </div>

                    {editing ? (
                      <div className="mt-3 space-y-3">
                        <input type="text" value={edit.caption} maxLength={150} onChange={(e) => setEdit((v) => ({ ...v, caption: e.target.value }))} placeholder="Caption" aria-label="Caption" className="field" />
                        <select value={edit.category} onChange={(e) => setEdit((v) => ({ ...v, category: e.target.value }))} aria-label="Category" className="field">
                          {galleryCategories.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <div className="flex gap-2">
                          <button type="button" onClick={saveEdit} disabled={savingEdit} className="inline-flex items-center gap-2 bg-primary-dark px-4 py-2 text-sm font-semibold text-white transition-colors duration-300 hover:bg-deep-purple disabled:opacity-70 dark:bg-light-purple dark:text-primary-dark">
                            {savingEdit ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />} Save
                          </button>
                          <button type="button" onClick={() => setEditId(null)} className="border border-line px-4 py-2 text-sm font-medium transition-colors duration-300 hover:border-accent hover:text-accent">
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="mt-3 truncate text-sm font-medium">{item.caption || "No caption"}</p>
                        <p className="text-xs uppercase tracking-wider text-accent">{item.category}</p>
                        <div className="mt-3 flex gap-2">
                          <button type="button" onClick={() => startEdit(item)} className="inline-flex items-center gap-2 border border-line px-3 py-1.5 text-sm font-medium transition-colors duration-300 hover:border-accent hover:text-accent">
                            <Pencil size={14} /> Edit
                          </button>
                          <button type="button" onClick={() => setTarget(item)} className="inline-flex items-center gap-2 border border-line px-3 py-1.5 text-sm font-medium text-red-500 transition-colors duration-300 hover:border-red-500">
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      </>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      <ConfirmDialog
        open={Boolean(target)}
        title="Delete this photo?"
        text="The photo will be permanently removed from the website. This cannot be undone."
        busy={busy}
        onConfirm={confirmDelete}
        onCancel={() => setTarget(null)}
      />
    </div>
  );
}