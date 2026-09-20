"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ImagePlus, Loader2, Save } from "lucide-react";
import { projectCategories } from "@/data/projectCategories";
import { createProject, updateProject } from "@/lib/projects";
import { deleteProjectImage, uploadProjectImage } from "@/lib/upload";

const MAX_MB = 5;
const TYPES = ["image/jpeg", "image/png", "image/webp"];

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

export default function ProjectForm({ project = null }) {
  const router = useRouter();
  const isEdit = Boolean(project);

  const [values, setValues] = useState({
    title: project?.title ?? "",
    category: project?.category ?? projectCategories[0],
    description: project?.description ?? "",
    tech: project?.tech?.join(", ") ?? "",
    featured: project?.featured ?? false,
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(project?.image ?? "");
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | saving
  const [formError, setFormError] = useState("");
  const blobRef = useRef(null);

  // Free the temporary preview URL when leaving the page
  useEffect(() => {
    return () => {
      if (blobRef.current) URL.revokeObjectURL(blobRef.current);
    };
  }, []);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues((v) => ({ ...v, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const onFile = (e) => {
    const picked = e.target.files?.[0];
    if (!picked) return;

    if (!TYPES.includes(picked.type)) {
      setErrors((er) => ({ ...er, image: "Use a JPG, PNG or WebP image." }));
      return;
    }
    if (picked.size > MAX_MB * 1024 * 1024) {
      setErrors((er) => ({ ...er, image: `Image must be under ${MAX_MB} MB.` }));
      return;
    }

    if (blobRef.current) URL.revokeObjectURL(blobRef.current);
    blobRef.current = URL.createObjectURL(picked);
    setFile(picked);
    setPreview(blobRef.current);
    setErrors((er) => ({ ...er, image: undefined }));
  };

  const validate = () => {
    const e = {};
    if (values.title.trim().length < 2) e.title = "Please enter a title.";
    if (values.description.trim().length < 10)
      e.description = "Description must be at least 10 characters.";
    if (!file && !project?.image) e.image = "Please choose a project image.";
    return e;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) return;

    setStatus("saving");
    let uploaded = null;

    try {
      let image = project?.image ?? "";
      let imagePublicId = project?.imagePublicId ?? "";

      if (file) {
        uploaded = await uploadProjectImage(file);
        image = uploaded.url;
        imagePublicId = uploaded.publicId;
      }

      const data = {
        title: values.title.trim(),
        category: values.category,
        description: values.description.trim(),
        tech: values.tech
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
          .slice(0, 10),
        featured: values.featured,
        image,
        imagePublicId,
      };

      try {
        if (isEdit) await updateProject(project.id, data);
        else await createProject(data);
      } catch (err) {
        // Saving failed: remove the image we just uploaded
        if (uploaded) await deleteProjectImage(uploaded.publicId);
        throw err;
      }

      // Replaced the image: remove the old one from Cloudinary
      if (isEdit && uploaded && project.imagePublicId) {
        await deleteProjectImage(project.imagePublicId);
      }

      router.replace("/admin/projects");
    } catch {
      setFormError("Could not save the project. Please try again.");
      setStatus("idle");
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="space-y-6 border border-line bg-surface p-6 sm:p-10"
    >
      <Field label="Title *" htmlFor="title" error={errors.title}>
        <input
          id="title"
          name="title"
          type="text"
          value={values.title}
          onChange={onChange}
          placeholder="e.g. Retail Management System"
          className="field"
        />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Category" htmlFor="category">
          <select
            id="category"
            name="category"
            value={values.category}
            onChange={onChange}
            className="field"
          >
            {projectCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>

        <Field
          label="Technologies"
          htmlFor="tech"
          hint="Separate with commas: Next.js, Firebase, Tailwind CSS"
        >
          <input
            id="tech"
            name="tech"
            type="text"
            value={values.tech}
            onChange={onChange}
            placeholder="Next.js, Firebase"
            className="field"
          />
        </Field>
      </div>

      <Field label="Description *" htmlFor="description" error={errors.description}>
        <textarea
          id="description"
          name="description"
          rows={5}
          value={values.description}
          onChange={onChange}
          placeholder="Briefly describe the project..."
          className="field resize-y"
        />
      </Field>

      {/* Image */}
      <Field
        label="Project Image *"
        htmlFor="image"
        error={errors.image}
        hint={`JPG, PNG or WebP, max ${MAX_MB} MB. Best size: 1600x1200 (4:3).`}
      >
        <div className="grid gap-4 sm:grid-cols-[14rem_1fr] sm:items-start">
          <div className="relative aspect-[4/3] w-full overflow-hidden border border-line bg-primary-dark/10">
            {preview ? (
              <Image
                src={preview}
                alt="Project image preview"
                fill
                sizes="224px"
                unoptimized={Boolean(file)}
                className="object-cover"
              />
            ) : (
              <div className="grid h-full place-items-center text-ink-soft">
                <ImagePlus size={32} />
              </div>
            )}
          </div>

          <label
            htmlFor="image"
            className="inline-flex w-fit cursor-pointer items-center gap-2 border border-accent px-5 py-3 text-sm font-medium text-accent transition-colors duration-300 hover:bg-accent hover:text-white dark:hover:text-primary-dark"
          >
            <ImagePlus size={18} />
            {preview ? "Change image" : "Choose image"}
            <input
              id="image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={onFile}
              className="sr-only"
            />
          </label>
        </div>
      </Field>

      {/* Featured */}
      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          name="featured"
          checked={values.featured}
          onChange={onChange}
          className="mt-1 h-5 w-5 accent-deep-purple"
        />
        <span>
          <span className="block text-sm font-medium">Show on the Home page</span>
          <span className="block text-xs text-ink-soft">
            Featured projects appear first in the Home page section (max 3).
          </span>
        </span>
      </label>

      {formError && (
        <p className="flex items-center gap-2 text-sm text-red-500" role="alert">
          <AlertCircle size={16} />
          {formError}
        </p>
      )}

      <div className="flex flex-wrap gap-3 border-t border-line pt-6">
        <button
          type="submit"
          disabled={status === "saving"}
          className="inline-flex items-center gap-2 bg-primary-dark px-8 py-3.5 font-semibold text-white transition-colors duration-300 hover:bg-deep-purple disabled:cursor-not-allowed disabled:opacity-70 dark:bg-light-purple dark:text-primary-dark dark:hover:bg-soft-lavender"
        >
          {status === "saving" ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={18} />
              {isEdit ? "Save Changes" : "Add Project"}
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/projects")}
          disabled={status === "saving"}
          className="border border-line px-8 py-3.5 font-medium transition-colors duration-300 hover:border-accent hover:text-accent disabled:opacity-60"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}