"use client";

import { useEffect, useRef, useState } from "react";
import { AlertCircle, Loader2, Save } from "lucide-react";
import { Field, PhotoPicker, Section, checkImage, MAX_MB } from "@/components/admin/FormBits";
import { blogCategories } from "@/data/blogCategories";
import { createPost, updatePost } from "@/lib/posts";
import { deleteProjectImage, uploadProjectImage } from "@/lib/upload";

export default function PostForm({ post = null, onDone, onCancel }) {
  const isEdit = Boolean(post);
  const blobRef = useRef(null);

  const [values, setValues] = useState({
    title: post?.title ?? "",
    category: post?.category ?? blogCategories[0],
    excerpt: post?.excerpt ?? "",
    content: post?.content ?? "",
    tags: (post?.tags ?? []).join(", "),
    author: post?.author ?? "",
    published: post?.published ?? false,
  });
  const [cover, setCover] = useState({ file: null, preview: post?.coverImage ?? "" });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    return () => blobRef.current && URL.revokeObjectURL(blobRef.current);
  }, []);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues((v) => ({ ...v, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const onPick = (file) => {
    const msg = checkImage(file);
    if (msg) return setErrors((er) => ({ ...er, cover: msg }));
    if (blobRef.current) URL.revokeObjectURL(blobRef.current);
    blobRef.current = URL.createObjectURL(file);
    setCover({ file, preview: blobRef.current });
    setErrors((er) => ({ ...er, cover: undefined }));
  };

  const validate = () => {
    const e = {};
    if (values.title.trim().length < 3) e.title = "Please enter a title.";
    if (values.title.trim().length > 150) e.title = "Keep the title under 150 characters.";
    if (values.excerpt.trim().length < 10) e.excerpt = "Summary must be at least 10 characters.";
    if (values.excerpt.trim().length > 250) e.excerpt = "Keep the summary under 250 characters.";
    if (values.content.trim().length < 30) e.content = "Please write the article content.";
    if (values.content.length > 30000) e.content = "Keep the content under 30,000 characters.";
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
      let coverImage = post?.coverImage ?? "";
      let coverPublicId = post?.coverPublicId ?? "";
      if (cover.file) {
        uploaded = await uploadProjectImage(cover.file);
        coverImage = uploaded.url;
        coverPublicId = uploaded.publicId;
      }

      const data = {
        title: values.title.trim(),
        category: values.category,
        excerpt: values.excerpt.trim(),
        content: values.content.trim(),
        tags: values.tags.split(",").map((t) => t.trim()).filter(Boolean).slice(0, 8),
        author: values.author.trim().slice(0, 100),
        published: values.published,
        coverImage,
        coverPublicId,
      };

      try {
        if (isEdit) await updatePost(post.id, data, Boolean(post.publishedAt));
        else await createPost(data);
      } catch (err) {
        if (uploaded) await deleteProjectImage(uploaded.publicId);
        throw err;
      }

      if (isEdit && uploaded && post.coverPublicId) {
        await deleteProjectImage(post.coverPublicId);
      }
      onDone();
    } catch {
      setFormError("Could not save. Please try again.");
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <Section title={isEdit ? "Edit Article" : "New Article"}>
        <Field label="Title *" htmlFor="title" error={errors.title}>
          <input id="title" name="title" type="text" value={values.title} onChange={onChange} className="field" />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Category" htmlFor="category">
            <select id="category" name="category" value={values.category} onChange={onChange} className="field">
              {blogCategories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field label="Author" htmlFor="author">
            <input id="author" name="author" type="text" value={values.author} onChange={onChange} placeholder="e.g. Nova Solutions Team" className="field" />
          </Field>
        </div>

        <Field label="Summary *" htmlFor="excerpt" error={errors.excerpt} hint="1-2 sentences (max 250 characters). Shown on the blog list and in Google.">
          <textarea id="excerpt" name="excerpt" rows={3} value={values.excerpt} onChange={onChange} className="field resize-y" />
        </Field>

        <Field
          label="Content *"
          htmlFor="content"
          error={errors.content}
          hint={'Blank line = new paragraph. Start a line with "- " for bullet points. Start with "## " for a heading.'}
        >
          <textarea id="content" name="content" rows={18} value={values.content} onChange={onChange} className="field resize-y font-mono text-sm" />
        </Field>

        <Field label="Tags" htmlFor="tags" hint="Separate with commas (max 8): Next.js, Firebase">
          <input id="tags" name="tags" type="text" value={values.tags} onChange={onChange} className="field" />
        </Field>
      </Section>

      <Section title="Cover Image" text={`Optional. JPG, PNG or WebP, max ${MAX_MB} MB. Best size: 1600x900 (16:9).`}>
        <PhotoPicker
          id="post-cover"
          preview={cover.preview}
          isBlob={Boolean(cover.file)}
          onPick={onPick}
          label={cover.preview ? "Change image" : "Choose image"}
          boxClass="aspect-[16/9] w-full sm:w-72"
        />
        {errors.cover && (
          <p className="flex items-center gap-1.5 text-sm text-red-500" role="alert">
            <AlertCircle size={14} /> {errors.cover}
          </p>
        )}
      </Section>

      <Section title="Visibility">
        <label className="flex cursor-pointer items-start gap-3">
          <input type="checkbox" name="published" checked={values.published} onChange={onChange} className="mt-1 h-5 w-5 accent-deep-purple" />
          <span>
            <span className="block text-sm font-medium">Publish this article</span>
            <span className="block text-xs text-ink-soft">Unticked = Draft (only you can see it in the admin panel).</span>
          </span>
        </label>
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
          {saving ? (<><Loader2 size={18} className="animate-spin" /> Saving...</>) : (<><Save size={18} /> {isEdit ? "Save Changes" : "Save Article"}</>)}
        </button>
        <button type="button" onClick={onCancel} disabled={saving} className="border border-line px-8 py-3.5 font-medium transition-colors duration-300 hover:border-accent hover:text-accent disabled:opacity-60">
          Cancel
        </button>
      </div>
    </form>
  );
}