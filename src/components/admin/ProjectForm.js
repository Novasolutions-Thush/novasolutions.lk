"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  ExternalLink,
  ImagePlus,
  Loader2,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { projectCategories } from "@/data/projectCategories";
import { createProject, updateProject } from "@/lib/projects";
import { deleteProjectImage, uploadProjectImage } from "@/lib/upload";

const MAX_MB = 5;
const MAX_GALLERY = 8;
const MAX_CLIENTS = 6;
const TYPES = ["image/jpeg", "image/png", "image/webp"];

const uid = () => Math.random().toString(36).slice(2, 10);

function checkImage(file) {
  if (!TYPES.includes(file.type)) return "Use JPG, PNG or WebP images.";
  if (file.size > MAX_MB * 1024 * 1024) return `Each image must be under ${MAX_MB} MB.`;
  return "";
}

function Section({ title, text, children }) {
  return (
    <section className="border border-line bg-surface p-6 sm:p-8">
      <h2 className="text-lg font-bold">{title}</h2>
      {text && <p className="mt-1 text-sm text-ink-soft">{text}</p>}
      <div className="mt-6 space-y-5">{children}</div>
    </section>
  );
}

function Field({ label, htmlFor, error, hint, children }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block text-sm font-medium">
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-1.5 text-xs text-ink-soft">{hint}</p>}
      {error && (
        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-red-500" role="alert">
          <AlertCircle size={14} />
          {error}
        </p>
      )}
    </div>
  );
}

function ImagePicker({ id, preview, isBlob, onPick, label, boxClass = "aspect-[16/9] w-full sm:w-72", contain = false }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
      <div className={`relative shrink-0 overflow-hidden border border-line bg-primary-dark/10 ${boxClass}`}>
        {preview ? (
          <Image
            src={preview}
            alt="Preview"
            fill
            sizes="288px"
            unoptimized={isBlob}
            className={contain ? "bg-white object-contain p-1.5" : "object-cover"}
          />
        ) : (
          <div className="grid h-full place-items-center text-ink-soft">
            <ImagePlus size={28} />
          </div>
        )}
      </div>
      <label
        htmlFor={id}
        className="inline-flex w-fit cursor-pointer items-center gap-2 border border-accent px-5 py-3 text-sm font-medium text-accent transition-colors duration-300 hover:bg-accent hover:text-white dark:hover:text-primary-dark"
      >
        <ImagePlus size={17} />
        {label}
        <input
          id={id}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={(e) => {
            const f = e.target.files?.[0];
            e.target.value = "";
            if (f) onPick(f);
          }}
        />
      </label>
    </div>
  );
}

export default function ProjectForm({ project = null }) {
  const router = useRouter();
  const isEdit = Boolean(project);
  const blobs = useRef([]);

  const [values, setValues] = useState({
    title: project?.title ?? "",
    category: project?.category ?? projectCategories[0],
    description: project?.description ?? "",
    longDescription: project?.longDescription ?? "",
    tech: project?.tech?.join(", ") ?? "",
    features: (project?.features ?? []).join("\n"),
    demoUrl: project?.demoUrl ?? "",
    year: project?.year ?? "",
    duration: project?.duration ?? "",
    featured: project?.featured ?? false,
  });

  const [main, setMain] = useState({ file: null, preview: project?.image ?? "" });

  const [gallery, setGallery] = useState(() =>
    (project?.gallery ?? []).map((g) => ({
      key: uid(),
      url: g.url,
      publicId: g.publicId || "",
      caption: g.caption || "",
      file: null,
      preview: g.url,
    }))
  );

  const [clients, setClients] = useState(() =>
    (project?.clients ?? []).map((c) => ({
      key: uid(),
      name: c.name || "",
      industry: c.industry || "",
      comment: c.comment || "",
      author: c.author || "",
      logo: c.logo || "",
      logoPublicId: c.logoPublicId || "",
      file: null,
      preview: c.logo || "",
    }))
  );

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | saving
  const [formError, setFormError] = useState("");

  // Free temporary preview URLs when leaving the page
  useEffect(() => {
    const list = blobs.current;
    return () => list.forEach((u) => URL.revokeObjectURL(u));
  }, []);

  const blob = (file) => {
    const url = URL.createObjectURL(file);
    blobs.current.push(url);
    return url;
  };

  const clearError = (name) => errors[name] && setErrors((er) => ({ ...er, [name]: undefined }));

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues((v) => ({ ...v, [name]: type === "checkbox" ? checked : value }));
    clearError(name);
  };

  // ----- Main image -----
  const onMainPick = (file) => {
    const msg = checkImage(file);
    if (msg) return setErrors((er) => ({ ...er, image: msg }));
    setMain({ file, preview: blob(file) });
    clearError("image");
  };

  // ----- Gallery -----
  const onGalleryPick = (e) => {
    const files = [...(e.target.files || [])];
    e.target.value = "";
    const room = MAX_GALLERY - gallery.length;
    const added = [];
    let err = files.length > room ? `Maximum ${MAX_GALLERY} gallery images.` : "";

    files.slice(0, Math.max(room, 0)).forEach((f) => {
      const msg = checkImage(f);
      if (msg) {
        err = msg;
        return;
      }
      added.push({ key: uid(), url: "", publicId: "", caption: "", file: f, preview: blob(f) });
    });

    setErrors((er) => ({ ...er, gallery: err || undefined }));
    if (added.length) setGallery((g) => [...g, ...added]);
  };

  const patchGallery = (key, patch) =>
    setGallery((g) => g.map((x) => (x.key === key ? { ...x, ...patch } : x)));

  const moveGallery = (index, dir) =>
    setGallery((g) => {
      const next = [...g];
      const target = index + dir;
      if (target < 0 || target >= next.length) return g;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });

  // ----- Clients -----
  const addClient = () =>
    setClients((c) => [
      ...c,
      { key: uid(), name: "", industry: "", comment: "", author: "", logo: "", logoPublicId: "", file: null, preview: "" },
    ]);

  const patchClient = (key, patch) =>
    setClients((c) => c.map((x) => (x.key === key ? { ...x, ...patch } : x)));

  const onLogoPick = (key, file) => {
    const msg = checkImage(file);
    if (msg) return setErrors((er) => ({ ...er, clients: msg }));
    patchClient(key, { file, preview: blob(file) });
    clearError("clients");
  };

  // ----- Validation -----
  const validate = () => {
    const e = {};
    if (values.title.trim().length < 2) e.title = "Please enter a title.";
    if (values.description.trim().length < 10)
      e.description = "Short description must be at least 10 characters.";
    if (values.description.trim().length > 220)
      e.description = "Keep the short description under 220 characters.";
    if (values.longDescription.length > 8000)
      e.longDescription = "Keep the long description under 8000 characters.";
    if (!main.file && !project?.image) e.image = "Please choose a main image.";
    if (values.demoUrl.trim() && !/^https:\/\/\S+\.\S+/i.test(values.demoUrl.trim()))
      e.demoUrl = "Demo link must start with https://";
    if (values.year.trim() && !/^\d{4}$/.test(values.year.trim()))
      e.year = "Enter a 4-digit year, e.g. 2025.";

    const lines = values.features.split("\n").map((s) => s.trim()).filter(Boolean);
    if (lines.length > 12) e.features = "Maximum 12 features.";
    if (lines.some((l) => l.length > 120)) e.features = "Each feature must be under 120 characters.";

    if (clients.some((c) => !c.name.trim())) e.clients = "Every client needs a name.";
    else if (clients.some((c) => c.comment.length > 500))
      e.clients = "Client comments must be under 500 characters.";
    return e;
  };

  // ----- Save -----
  const onSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) return;

    setStatus("saving");
    const uploadedIds = []; // for rollback if saving fails

    try {
      // Main image
      let image = project?.image ?? "";
      let imagePublicId = project?.imagePublicId ?? "";
      if (main.file) {
        const u = await uploadProjectImage(main.file);
        uploadedIds.push(u.publicId);
        image = u.url;
        imagePublicId = u.publicId;
      }

      // Gallery
      const galleryOut = [];
      for (const g of gallery) {
        let url = g.url;
        let publicId = g.publicId;
        if (g.file) {
          const u = await uploadProjectImage(g.file);
          uploadedIds.push(u.publicId);
          url = u.url;
          publicId = u.publicId;
        }
        galleryOut.push({ url, publicId, caption: g.caption.trim().slice(0, 150) });
      }

      // Clients
      const clientsOut = [];
      for (const c of clients) {
        let logo = c.logo;
        let logoPublicId = c.logoPublicId;
        if (c.file) {
          const u = await uploadProjectImage(c.file);
          uploadedIds.push(u.publicId);
          logo = u.url;
          logoPublicId = u.publicId;
        }
        clientsOut.push({
          name: c.name.trim().slice(0, 100),
          industry: c.industry.trim().slice(0, 100),
          comment: c.comment.trim().slice(0, 500),
          author: c.author.trim().slice(0, 100),
          logo,
          logoPublicId,
        });
      }

      const data = {
        title: values.title.trim(),
        category: values.category,
        description: values.description.trim(),
        longDescription: values.longDescription.trim(),
        tech: values.tech.split(",").map((t) => t.trim()).filter(Boolean).slice(0, 12),
        features: values.features.split("\n").map((s) => s.trim()).filter(Boolean).slice(0, 12),
        demoUrl: values.demoUrl.trim(),
        year: values.year.trim(),
        duration: values.duration.trim().slice(0, 50),
        featured: values.featured,
        image,
        imagePublicId,
        gallery: galleryOut,
        clients: clientsOut,
      };

      try {
        if (isEdit) await updateProject(project.id, data);
        else await createProject(data);
      } catch (err) {
        await Promise.all(uploadedIds.map(deleteProjectImage));
        throw err;
      }

      // Remove images that are no longer used
      const keep = new Set(
        [imagePublicId, ...galleryOut.map((g) => g.publicId), ...clientsOut.map((c) => c.logoPublicId)].filter(Boolean)
      );
      const old = [
        project?.imagePublicId,
        ...(project?.gallery ?? []).map((g) => g.publicId),
        ...(project?.clients ?? []).map((c) => c.logoPublicId),
      ].filter(Boolean);
      await Promise.all(old.filter((id) => !keep.has(id)).map(deleteProjectImage));

      router.replace("/admin/projects");
    } catch {
      setFormError("Could not save the project. Please try again.");
      setStatus("idle");
    }
  };

  const saving = status === "saving";

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      {/* 1. Basic info */}
      <Section title="1. Basic Information" text="Shown on the /projects page card.">
        <Field label="Title *" htmlFor="title" error={errors.title}>
          <input id="title" name="title" type="text" value={values.title} onChange={onChange} placeholder="e.g. Retail Management System" className="field" />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Category" htmlFor="category">
            <select id="category" name="category" value={values.category} onChange={onChange} className="field">
              {projectCategories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field label="Technologies" htmlFor="tech" hint="Separate with commas: Next.js, Firebase">
            <input id="tech" name="tech" type="text" value={values.tech} onChange={onChange} className="field" />
          </Field>
        </div>

        <Field label="Short Description *" htmlFor="description" error={errors.description} hint="One or two sentences (max 220 characters). Shown on the project cards.">
          <textarea id="description" name="description" rows={3} value={values.description} onChange={onChange} className="field resize-y" />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Year" htmlFor="year" error={errors.year}>
            <input id="year" name="year" type="text" maxLength={4} value={values.year} onChange={onChange} placeholder="2025" className="field" />
          </Field>
          <Field label="Duration" htmlFor="duration">
            <input id="duration" name="duration" type="text" value={values.duration} onChange={onChange} placeholder="4 months" className="field" />
          </Field>
        </div>
      </Section>

      {/* 2. Full description */}
      <Section title="2. Full Description" text="Shown on the project's own detail page.">
        <Field
          label="Long Description"
          htmlFor="longDescription"
          error={errors.longDescription}
          hint={'Blank line = new paragraph. Start a line with "- " for bullet points. Start with "## " for a heading.'}
        >
          <textarea id="longDescription" name="longDescription" rows={14} value={values.longDescription} onChange={onChange} className="field resize-y font-mono text-sm" />
        </Field>

        <Field label="Key Features" htmlFor="features" error={errors.features} hint="One feature per line (max 12).">
          <textarea id="features" name="features" rows={6} value={values.features} onChange={onChange} className="field resize-y" />
        </Field>
      </Section>

      {/* 3. Main image */}
      <Section title="3. Main Image" text={`JPG, PNG or WebP, max ${MAX_MB} MB. Best size: 1920x1080 (16:9).`}>
        <ImagePicker
          id="main-image"
          preview={main.preview}
          isBlob={Boolean(main.file)}
          onPick={onMainPick}
          label={main.preview ? "Change image" : "Choose image"}
        />
        {errors.image && (
          <p className="flex items-center gap-1.5 text-sm text-red-500" role="alert">
            <AlertCircle size={14} /> {errors.image}
          </p>
        )}
      </Section>

      {/* 4. Gallery */}
      <Section title="4. System View Images" text={`Screenshots of the system (max ${MAX_GALLERY}). Use the arrows to change the order.`}>
        {gallery.length > 0 && (
          <ul className="grid gap-4 sm:grid-cols-2">
            {gallery.map((g, i) => (
              <li key={g.key} className="border border-line p-3">
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-primary-dark/10">
                  <Image src={g.preview} alt="Gallery preview" fill sizes="320px" unoptimized={Boolean(g.file)} className="object-cover" />
                </div>
                <input
                  type="text"
                  value={g.caption}
                  onChange={(e) => patchGallery(g.key, { caption: e.target.value })}
                  placeholder="Caption (e.g. Sales dashboard)"
                  maxLength={150}
                  aria-label={`Caption for image ${i + 1}`}
                  className="field mt-3"
                />
                <div className="mt-3 flex gap-2">
                  <button type="button" onClick={() => moveGallery(i, -1)} disabled={i === 0} aria-label="Move earlier" className="grid h-9 w-9 place-items-center border border-line transition-colors duration-300 hover:border-accent hover:text-accent disabled:opacity-40">
                    <ArrowUp size={16} />
                  </button>
                  <button type="button" onClick={() => moveGallery(i, 1)} disabled={i === gallery.length - 1} aria-label="Move later" className="grid h-9 w-9 place-items-center border border-line transition-colors duration-300 hover:border-accent hover:text-accent disabled:opacity-40">
                    <ArrowDown size={16} />
                  </button>
                  <button type="button" onClick={() => setGallery((x) => x.filter((y) => y.key !== g.key))} className="ml-auto inline-flex items-center gap-2 border border-line px-3 text-sm text-red-500 transition-colors duration-300 hover:border-red-500">
                    <Trash2 size={15} /> Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {gallery.length < MAX_GALLERY && (
          <label
            htmlFor="gallery-input"
            className="inline-flex w-fit cursor-pointer items-center gap-2 border border-accent px-5 py-3 text-sm font-medium text-accent transition-colors duration-300 hover:bg-accent hover:text-white dark:hover:text-primary-dark"
          >
            <ImagePlus size={17} />
            Add images
            <input id="gallery-input" type="file" multiple accept="image/jpeg,image/png,image/webp" onChange={onGalleryPick} className="sr-only" />
          </label>
        )}
        {errors.gallery && (
          <p className="flex items-center gap-1.5 text-sm text-red-500" role="alert">
            <AlertCircle size={14} /> {errors.gallery}
          </p>
        )}
      </Section>

      {/* 5. Clients */}
      <Section title="5. Clients" text={`Who the system was built for (max ${MAX_CLIENTS}). Logo and comment are optional.`}>
        {clients.map((c, i) => (
          <div key={c.key} className="space-y-4 border border-line p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Client {i + 1}</p>
              <button type="button" onClick={() => setClients((x) => x.filter((y) => y.key !== c.key))} className="inline-flex items-center gap-2 border border-line px-3 py-1.5 text-sm text-red-500 transition-colors duration-300 hover:border-red-500">
                <Trash2 size={15} /> Remove
              </button>
            </div>

            <ImagePicker
              id={`logo-${c.key}`}
              preview={c.preview}
              isBlob={Boolean(c.file)}
              onPick={(f) => onLogoPick(c.key, f)}
              label={c.preview ? "Change logo" : "Upload logo"}
              boxClass="h-20 w-20"
              contain
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <input type="text" value={c.name} onChange={(e) => patchClient(c.key, { name: e.target.value })} placeholder="Client name *" aria-label="Client name" maxLength={100} className="field" />
              <input type="text" value={c.industry} onChange={(e) => patchClient(c.key, { industry: e.target.value })} placeholder="Industry (e.g. Retail)" aria-label="Industry" maxLength={100} className="field" />
            </div>
            <textarea value={c.comment} onChange={(e) => patchClient(c.key, { comment: e.target.value })} rows={3} placeholder="Client's comment / feedback (max 500 characters)" aria-label="Client comment" maxLength={500} className="field resize-y" />
            <input type="text" value={c.author} onChange={(e) => patchClient(c.key, { author: e.target.value })} placeholder="Comment by (e.g. Operations Manager)" aria-label="Comment author" maxLength={100} className="field" />
          </div>
        ))}

        {clients.length < MAX_CLIENTS && (
          <button type="button" onClick={addClient} className="inline-flex w-fit items-center gap-2 border border-accent px-5 py-3 text-sm font-medium text-accent transition-colors duration-300 hover:bg-accent hover:text-white dark:hover:text-primary-dark">
            <Plus size={17} /> Add client
          </button>
        )}
        {errors.clients && (
          <p className="flex items-center gap-1.5 text-sm text-red-500" role="alert">
            <AlertCircle size={14} /> {errors.clients}
          </p>
        )}
      </Section>

      {/* 6. Demo & options */}
      <Section title="6. Demo Link and Options">
        <Field label="Live Demo Link" htmlFor="demoUrl" error={errors.demoUrl} hint="Optional. Must start with https://. Leave empty if there is no public demo (visitors can still request one).">
          <input id="demoUrl" name="demoUrl" type="url" value={values.demoUrl} onChange={onChange} placeholder="https://demo.example.com" className="field" />
        </Field>

        <label className="flex cursor-pointer items-start gap-3">
          <input type="checkbox" name="featured" checked={values.featured} onChange={onChange} className="mt-1 h-5 w-5 accent-deep-purple" />
          <span>
            <span className="block text-sm font-medium">Show on the Home page</span>
            <span className="block text-xs text-ink-soft">Featured projects appear first in the Home page section (max 3).</span>
          </span>
        </label>
      </Section>

      {formError && (
        <p className="flex items-center gap-2 text-sm text-red-500" role="alert">
          <AlertCircle size={16} /> {formError}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 bg-primary-dark px-8 py-3.5 font-semibold text-white transition-colors duration-300 hover:bg-deep-purple disabled:cursor-not-allowed disabled:opacity-70 dark:bg-light-purple dark:text-primary-dark dark:hover:bg-soft-lavender"
        >
          {saving ? (
            <>
              <Loader2 size={18} className="animate-spin" /> Saving... (uploading images)
            </>
          ) : (
            <>
              <Save size={18} /> {isEdit ? "Save Changes" : "Add Project"}
            </>
          )}
        </button>
        <button type="button" onClick={() => router.push("/admin/projects")} disabled={saving} className="border border-line px-8 py-3.5 font-medium transition-colors duration-300 hover:border-accent hover:text-accent disabled:opacity-60">
          Cancel
        </button>
        {isEdit && (
          <Link href={`/projects/${project.id}`} target="_blank" className="ml-auto inline-flex items-center gap-2 text-sm font-medium text-accent transition-opacity duration-300 hover:opacity-70">
            <ExternalLink size={16} /> View public page
          </Link>
        )}
      </div>
    </form>
  );
}