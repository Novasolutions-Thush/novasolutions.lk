"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, ExternalLink, Loader2, RefreshCw, Save } from "lucide-react";
import { Field, MAX_MB, PhotoPicker, Section, checkImage } from "@/components/admin/FormBits";
import { getCeo, saveCeo } from "@/lib/ceo";
import { deleteProjectImage, uploadProjectImage } from "@/lib/upload";

export default function AdminCeoPage() {
  const blobRef = useRef(null);
  const [values, setValues] = useState(null);
  const [photo, setPhoto] = useState({ file: null, preview: "" });
  const [original, setOriginal] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [nonce, setNonce] = useState(0);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | saving | saved | error

  useEffect(() => {
    let active = true;
    setLoadError(false);
    getCeo()
      .then((c) => {
        if (!active) return;
        setValues(c);
        setOriginal(c);
        setPhoto({ file: null, preview: c.photo || "" });
      })
      .catch(() => active && setLoadError(true));
    return () => {
      active = false;
    };
  }, [nonce]);

  useEffect(() => {
    return () => blobRef.current && URL.revokeObjectURL(blobRef.current);
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
    if (status !== "idle") setStatus("idle");
  };

  const onPick = (file) => {
    const msg = checkImage(file);
    if (msg) return setErrors((er) => ({ ...er, photo: msg }));
    if (blobRef.current) URL.revokeObjectURL(blobRef.current);
    blobRef.current = URL.createObjectURL(file);
    setPhoto({ file, preview: blobRef.current });
    setErrors((er) => ({ ...er, photo: undefined }));
    setStatus("idle");
  };

  const validate = () => {
    const e = {};
    if (values.name.trim().length < 2) e.name = "Please enter the name.";
    if (values.role.trim().length < 2) e.role = "Please enter the role.";
    if (values.quote.length > 220) e.quote = "Keep the quote under 220 characters.";
    if (values.message.trim().length < 30) e.message = "Please write the message.";
    if (values.message.length > 6000) e.message = "Keep the message under 6000 characters.";
    if (values.vision.length > 1200) e.vision = "Keep the vision under 1200 characters.";
    if (values.signature.length > 60) e.signature = "Keep the signature under 60 characters.";
    if (values.linkedin.trim() && !/^https:\/\/\S+\.\S+/i.test(values.linkedin.trim()))
      e.linkedin = "Link must start with https://";
    return e;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) return;

    setStatus("saving");
    let uploaded = null;
    try {
      let url = values.photo;
      let publicId = values.photoPublicId;
      if (photo.file) {
        uploaded = await uploadProjectImage(photo.file);
        url = uploaded.url;
        publicId = uploaded.publicId;
      }

      const data = {
        name: values.name.trim(),
        role: values.role.trim(),
        quote: values.quote.trim(),
        message: values.message.trim(),
        vision: values.vision.trim(),
        signature: values.signature.trim(),
        linkedin: values.linkedin.trim(),
        photo: url,
        photoPublicId: publicId,
      };

      try {
        await saveCeo(data);
      } catch (err) {
        if (uploaded) await deleteProjectImage(uploaded.publicId);
        throw err;
      }

      if (uploaded && original?.photoPublicId) {
        await deleteProjectImage(original.photoPublicId);
      }
      setValues(data);
      setOriginal(data);
      setPhoto({ file: null, preview: url });
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  };

  if (loadError) {
    return (
      <div className="mx-auto max-w-xl border border-line bg-surface p-10 text-center">
        <AlertCircle size={40} className="mx-auto text-red-500" />
        <p className="mt-4 font-semibold">Could not load the CEO page data.</p>
        <button
          type="button"
          onClick={() => setNonce((n) => n + 1)}
          className="mt-6 inline-flex items-center gap-2 border border-accent px-5 py-2.5 text-sm font-medium text-accent transition-colors duration-300 hover:bg-accent hover:text-white dark:hover:text-primary-dark"
        >
          <RefreshCw size={16} /> Try again
        </button>
      </div>
    );
  }

  if (!values) {
    return (
      <div className="mx-auto grid max-w-3xl place-items-center border border-line bg-surface p-16">
        <Loader2 size={30} className="animate-spin text-accent" />
      </div>
    );
  }

  const saving = status === "saving";

  return (
    <form onSubmit={onSubmit} noValidate className="mx-auto max-w-3xl space-y-6">
      <Section title="Profile" text="The Founder / CEO shown on the /ceo page.">
        <Field
          label="Photo"
          htmlFor="ceo-photo"
          error={errors.photo}
          hint={`JPG, PNG or WebP, max ${MAX_MB} MB. Best: portrait 4:5 (e.g. 1000x1250).`}
        >
          <PhotoPicker
            id="ceo-photo"
            preview={photo.preview}
            isBlob={Boolean(photo.file)}
            onPick={onPick}
            label={photo.preview ? "Change photo" : "Choose photo"}
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Full Name *" htmlFor="name" error={errors.name}>
            <input id="name" name="name" type="text" value={values.name} onChange={onChange} className="field" />
          </Field>
          <Field label="Role *" htmlFor="role" error={errors.role}>
            <input id="role" name="role" type="text" value={values.role} onChange={onChange} className="field" />
          </Field>
        </div>

        <Field label="LinkedIn (optional)" htmlFor="linkedin" error={errors.linkedin}>
          <input id="linkedin" name="linkedin" type="url" value={values.linkedin} onChange={onChange} placeholder="https://linkedin.com/in/..." className="field" />
        </Field>
      </Section>

      <Section title="Message" text="Shown on the /ceo page.">
        <Field label="Highlighted Quote" htmlFor="quote" error={errors.quote} hint="One powerful sentence (max 220 characters). Shown large at the top.">
          <textarea id="quote" name="quote" rows={2} value={values.quote} onChange={onChange} className="field resize-y" />
        </Field>

        <Field
          label="Message *"
          htmlFor="message"
          error={errors.message}
          hint={'Blank line = new paragraph. Start a line with "- " for bullets, "## " for a heading.'}
        >
          <textarea id="message" name="message" rows={12} value={values.message} onChange={onChange} className="field resize-y" />
        </Field>

        <Field label="Vision (optional)" htmlFor="vision" error={errors.vision} hint="Shown in a highlighted box (max 1200 characters).">
          <textarea id="vision" name="vision" rows={4} value={values.vision} onChange={onChange} className="field resize-y" />
        </Field>

        <Field label="Signature (optional)" htmlFor="signature" error={errors.signature} hint="Usually the name. Shown in the elegant brand font.">
          <input id="signature" name="signature" type="text" value={values.signature} onChange={onChange} className="field" />
        </Field>
      </Section>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 bg-primary-dark px-8 py-3.5 font-semibold text-white transition-colors duration-300 hover:bg-deep-purple disabled:cursor-not-allowed disabled:opacity-70 dark:bg-light-purple dark:text-primary-dark dark:hover:bg-soft-lavender"
        >
          {saving ? (<><Loader2 size={18} className="animate-spin" /> Saving...</>) : (<><Save size={18} /> Save</>)}
        </button>

        <Link href="/ceo" target="_blank" className="inline-flex items-center gap-2 text-sm font-medium text-accent transition-opacity duration-300 hover:opacity-70">
          <ExternalLink size={16} /> View public page
        </Link>

        {status === "saved" && (
          <p className="flex items-center gap-2 text-sm text-accent" role="status">
            <CheckCircle2 size={17} /> Saved. The page is updated.
          </p>
        )}
        {status === "error" && (
          <p className="flex items-center gap-2 text-sm text-red-500" role="alert">
            <AlertCircle size={17} /> Could not save. Please try again.
          </p>
        )}
      </div>
    </form>
  );
}