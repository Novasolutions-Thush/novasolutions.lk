"use client";

import { useEffect, useRef, useState } from "react";
import { AlertCircle, Loader2, Plus, Save, Trash2 } from "lucide-react";
import { Field, MAX_MB, PhotoPicker, Section, checkImage } from "@/components/admin/FormBits";
import { ongoingStatuses } from "@/data/ongoingStatuses";
import { createOngoing, updateOngoing } from "@/lib/ongoing";
import { deleteProjectImage, uploadProjectImage } from "@/lib/upload";

const MAX_UPDATES = 8;
const uid = () => Math.random().toString(36).slice(2, 10);

export default function OngoingForm({ item = null, onDone, onCancel }) {
  const isEdit = Boolean(item);
  const blobRef = useRef(null);

  const [values, setValues] = useState({
    title: item?.title ?? "",
    description: item?.description ?? "",
    status: item?.status ?? ongoingStatuses[0],
    progress: item?.progress ?? 0,
    launch: item?.launch ?? "",
    tech: (item?.tech ?? []).join(", "),
  });
  const [updates, setUpdates] = useState(() =>
    (item?.updates ?? []).map((u) => ({ key: uid(), date: u.date || "", text: u.text || "" }))
  );
  const [image, setImage] = useState({ file: null, preview: item?.image ?? "" });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    return () => blobRef.current && URL.revokeObjectURL(blobRef.current);
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const onPick = (file) => {
    const msg = checkImage(file);
    if (msg) return setErrors((er) => ({ ...er, image: msg }));
    if (blobRef.current) URL.revokeObjectURL(blobRef.current);
    blobRef.current = URL.createObjectURL(file);
    setImage({ file, preview: blobRef.current });
    setErrors((er) => ({ ...er, image: undefined }));
  };

  const patchUpdate = (key, patch) =>
    setUpdates((list) => list.map((u) => (u.key === key ? { ...u, ...patch } : u)));

  const validate = () => {
    const e = {};
    if (values.title.trim().length < 2) e.title = "Please enter a title.";
    if (values.description.trim().length < 10) e.description = "Description must be at least 10 characters.";
    if (values.description.length > 400) e.description = "Keep the description under 400 characters.";
    const p = Number(values.progress);
    if (Number.isNaN(p) || p < 0 || p > 100) e.progress = "Progress must be between 0 and 100.";
    if (values.launch.length > 40) e.launch = "Keep it under 40 characters.";
    if (updates.some((u) => !u.text.trim())) e.updates = "Every update needs some text (or remove it).";
    return e;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) return;

    setSaving(true);
    let uploaded = null;
    try {
      let url = item?.image ?? "";
      let publicId = item?.imagePublicId ?? "";
      if (image.file) {
        uploaded = await uploadProjectImage(image.file);
        url = uploaded.url;
        publicId = uploaded.publicId;
      }

      const data = {
        title: values.title.trim().slice(0, 120),
        description: values.description.trim(),
        status: values.status,
        progress: Math.round(Number(values.progress)),
        launch: values.launch.trim(),
        tech: values.tech.split(",").map((t) => t.trim()).filter(Boolean).slice(0, 10),
        updates: updates.map((u) => ({ date: u.date, text: u.text.trim().slice(0, 300) })),
        image: url,
        imagePublicId: publicId,
      };

      try {
        if (isEdit) await updateOngoing(item.id, data);
        else await createOngoing(data);
      } catch (err) {
        if (uploaded) await deleteProjectImage(uploaded.publicId);
        throw err;
      }

      if (isEdit && uploaded && item.imagePublicId) await deleteProjectImage(item.imagePublicId);
      onDone();
    } catch {
      setFormError("Could not save. Please try again.");
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <Section title={isEdit ? "Edit Ongoing Project" : "New Ongoing Project"}>
        <Field label="Title *" htmlFor="title" error={errors.title}>
          <input id="title" name="title" type="text" value={values.title} onChange={onChange} className="field" />
        </Field>

        <Field label="Description *" htmlFor="description" error={errors.description} hint="What are we building? (max 400 characters)">
          <textarea id="description" name="description" rows={4} value={values.description} onChange={onChange} className="field resize-y" />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Current Stage" htmlFor="status">
            <select id="status" name="status" value={values.status} onChange={onChange} className="field">
              {ongoingStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Expected Launch" htmlFor="launch" error={errors.launch} hint='Free text, e.g. "December 2026" or "Q1 2027"'>
            <input id="launch" name="launch" type="text" value={values.launch} onChange={onChange} className="field" />
          </Field>
        </div>

        <Field label={`Progress: ${Number(values.progress) || 0}%`} htmlFor="progress" error={errors.progress}>
          <input
            id="progress"
            name="progress"
            type="range"
            min={0}
            max={100}
            step={5}
            value={values.progress}
            onChange={onChange}
            className="w-full accent-deep-purple"
          />
        </Field>

        <Field label="Technologies" htmlFor="tech" hint="Separate with commas: Next.js, Firebase">
          <input id="tech" name="tech" type="text" value={values.tech} onChange={onChange} className="field" />
        </Field>
      </Section>

      <Section title="Preview Image" text={`Optional. JPG, PNG or WebP, max ${MAX_MB} MB. Best size: 1600x900 (16:9).`}>
        <PhotoPicker
          id="ongoing-image"
          preview={image.preview}
          isBlob={Boolean(image.file)}
          onPick={onPick}
          label={image.preview ? "Change image" : "Choose image"}
          boxClass="aspect-[16/9] w-full sm:w-72"
        />
        {errors.image && (
          <p className="flex items-center gap-1.5 text-sm text-red-500" role="alert">
            <AlertCircle size={14} /> {errors.image}
          </p>
        )}
      </Section>

      <Section title="Progress Updates" text={`Short news about this project (max ${MAX_UPDATES}). The newest should be first.`}>
        {updates.map((u, i) => (
          <div key={u.key} className="grid gap-3 border border-line p-4 sm:grid-cols-[11rem_1fr_auto] sm:items-start">
            <input type="date" value={u.date} onChange={(e) => patchUpdate(u.key, { date: e.target.value })} aria-label={`Update ${i + 1} date`} className="field" />
            <input type="text" value={u.text} maxLength={300} onChange={(e) => patchUpdate(u.key, { text: e.target.value })} placeholder="e.g. Payment module completed" aria-label={`Update ${i + 1} text`} className="field" />
            <button type="button" onClick={() => setUpdates((l) => l.filter((x) => x.key !== u.key))} aria-label="Remove update" className="grid h-[3.1rem] w-12 place-items-center border border-line text-red-500 transition-colors duration-300 hover:border-red-500">
              <Trash2 size={16} />
            </button>
          </div>
        ))}

        {updates.length < MAX_UPDATES && (
          <button
            type="button"
            onClick={() => setUpdates((l) => [{ key: uid(), date: new Date().toISOString().slice(0, 10), text: "" }, ...l])}
            className="inline-flex w-fit items-center gap-2 border border-accent px-5 py-3 text-sm font-medium text-accent transition-colors duration-300 hover:bg-accent hover:text-white dark:hover:text-primary-dark"
          >
            <Plus size={17} /> Add update
          </button>
        )}
        {errors.updates && (
          <p className="flex items-center gap-1.5 text-sm text-red-500" role="alert">
            <AlertCircle size={14} /> {errors.updates}
          </p>
        )}
      </Section>

      {formError && (
        <p className="flex items-center gap-2 text-sm text-red-500" role="alert">
          <AlertCircle size={16} /> {formError}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 bg-primary-dark px-8 py-3.5 font-semibold text-white transition-colors duration-300 hover:bg-deep-purple disabled:cursor-not-allowed disabled:opacity-70 dark:bg-light-purple dark:text-primary-dark dark:hover:bg-soft-lavender"
        >
          {saving ? (<><Loader2 size={18} className="animate-spin" /> Saving...</>) : (<><Save size={18} /> {isEdit ? "Save Changes" : "Add Project"}</>)}
        </button>
        <button type="button" onClick={onCancel} disabled={saving} className="border border-line px-8 py-3.5 font-medium transition-colors duration-300 hover:border-accent hover:text-accent disabled:opacity-60">
          Cancel
        </button>
      </div>
    </form>
  );
}