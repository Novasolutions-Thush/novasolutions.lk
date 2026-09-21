"use client";

import { useEffect, useRef, useState } from "react";
import { AlertCircle, Loader2, Save } from "lucide-react";
import { Field, PhotoPicker, Section, checkImage, MAX_MB } from "@/components/admin/FormBits";
import { createMember, updateMember } from "@/lib/team";
import { deleteProjectImage, uploadProjectImage } from "@/lib/upload";

export default function TeamForm({ member = null, onDone, onCancel }) {
  const isEdit = Boolean(member);
  const blobRef = useRef(null);

  const [values, setValues] = useState({
    name: member?.name ?? "",
    role: member?.role ?? "",
    bio: member?.bio ?? "",
    skills: (member?.skills ?? []).join(", "),
    linkedin: member?.linkedin ?? "",
    github: member?.github ?? "",
    leader: member?.leader ?? false,
  });
  const [photo, setPhoto] = useState({ file: null, preview: member?.photo ?? "" });
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
    if (msg) return setErrors((er) => ({ ...er, photo: msg }));
    if (blobRef.current) URL.revokeObjectURL(blobRef.current);
    blobRef.current = URL.createObjectURL(file);
    setPhoto({ file, preview: blobRef.current });
    setErrors((er) => ({ ...er, photo: undefined }));
  };

  const validate = () => {
    const e = {};
    if (values.name.trim().length < 2) e.name = "Please enter the name.";
    if (values.role.trim().length < 2) e.role = "Please enter the role.";
    if (values.bio.length > 600) e.bio = "Keep the bio under 600 characters.";
    if (!photo.file && !member?.photo) e.photo = "Please choose a photo.";
    ["linkedin", "github"].forEach((k) => {
      const v = values[k].trim();
      if (v && !/^https:\/\/\S+\.\S+/i.test(v)) e[k] = "Link must start with https://";
    });
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
      let photoUrl = member?.photo ?? "";
      let photoPublicId = member?.photoPublicId ?? "";
      if (photo.file) {
        uploaded = await uploadProjectImage(photo.file);
        photoUrl = uploaded.url;
        photoPublicId = uploaded.publicId;
      }

      const data = {
        name: values.name.trim().slice(0, 100),
        role: values.role.trim().slice(0, 100),
        bio: values.bio.trim(),
        skills: values.skills.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 8),
        linkedin: values.linkedin.trim(),
        github: values.github.trim(),
        leader: values.leader,
        photo: photoUrl,
        photoPublicId,
      };

      try {
        if (isEdit) await updateMember(member.id, data);
        else await createMember(data);
      } catch (err) {
        if (uploaded) await deleteProjectImage(uploaded.publicId);
        throw err;
      }

      if (isEdit && uploaded && member.photoPublicId) {
        await deleteProjectImage(member.photoPublicId);
      }
      onDone();
    } catch {
      setFormError("Could not save. Please try again.");
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <Section title={isEdit ? "Edit Team Member" : "Add Team Member"}>
        <Field label="Photo *" htmlFor="member-photo" error={errors.photo} hint={`JPG, PNG or WebP, max ${MAX_MB} MB. Best: portrait 4:5 (e.g. 800x1000).`}>
          <PhotoPicker
            id="member-photo"
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
            <input id="role" name="role" type="text" value={values.role} onChange={onChange} placeholder="e.g. Founder & CEO, Full-Stack Developer" className="field" />
          </Field>
        </div>

        <Field label="Short Bio" htmlFor="bio" error={errors.bio} hint="Max 600 characters.">
          <textarea id="bio" name="bio" rows={4} value={values.bio} onChange={onChange} className="field resize-y" />
        </Field>

        <Field label="Skills" htmlFor="skills" hint="Separate with commas (max 8): React, Node.js, UI Design">
          <input id="skills" name="skills" type="text" value={values.skills} onChange={onChange} className="field" />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="LinkedIn (optional)" htmlFor="linkedin" error={errors.linkedin}>
            <input id="linkedin" name="linkedin" type="url" value={values.linkedin} onChange={onChange} placeholder="https://linkedin.com/in/..." className="field" />
          </Field>
          <Field label="GitHub (optional)" htmlFor="github" error={errors.github}>
            <input id="github" name="github" type="url" value={values.github} onChange={onChange} placeholder="https://github.com/..." className="field" />
          </Field>
        </div>

        <label className="flex cursor-pointer items-start gap-3">
          <input type="checkbox" name="leader" checked={values.leader} onChange={onChange} className="mt-1 h-5 w-5 accent-deep-purple" />
          <span>
            <span className="block text-sm font-medium">Show in the Leadership section</span>
            <span className="block text-xs text-ink-soft">Use this for the Founder / CEO and other leaders. They appear at the top in a larger card.</span>
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
          {saving ? (<><Loader2 size={18} className="animate-spin" /> Saving...</>) : (<><Save size={18} /> {isEdit ? "Save Changes" : "Add Member"}</>)}
        </button>
        <button type="button" onClick={onCancel} disabled={saving} className="border border-line px-8 py-3.5 font-medium transition-colors duration-300 hover:border-accent hover:text-accent disabled:opacity-60">
          Cancel
        </button>
      </div>
    </form>
  );
}