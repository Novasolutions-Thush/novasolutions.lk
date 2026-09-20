"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  RefreshCw,
  Save,
} from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { socialPlatforms } from "@/data/siteDefaults";
import { getSettings, saveSettings } from "@/lib/settings";
import SocialLinks from "@/components/ui/SocialLinks";

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

function validate(v) {
  const e = {};
  if (v.legalName.trim().length > 100) e.legalName = "Keep it under 100 characters."; 
  if (v.tagline.trim().length > 80) e.tagline = "Keep it under 80 characters.";
  if (v.description.trim().length > 300) e.description = "Keep it under 300 characters.";
  if (v.email.trim() && !/^\S+@\S+\.\S+$/.test(v.email.trim()))
    e.email = "Please enter a valid email.";
  if (v.phone.trim() && !/^[+\d][\d\s-]{6,}$/.test(v.phone.trim()))
    e.phone = "Please enter a valid phone number.";

  socialPlatforms.forEach((p) => {
    const value = (v.socials[p.key] || "").trim();
    if (!value) return;
    if (p.isPhone) {
      const digits = value.replace(/\D/g, "");
      if (digits.length < 8 || digits.length > 15)
        e[p.key] = "Enter the number with country code, e.g. +94771234567.";
    } else if (!/^https:\/\/\S+\.\S+/i.test(value)) {
      e[p.key] = "Link must start with https://";
    }
  });
  return e;
}

export default function AdminSettingsPage() {
  const { update } = useSettings();
  const [values, setValues] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | saving | saved | error
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let active = true;
    setLoadError(false);
    getSettings()
      .then((s) => active && setValues(s))
      .catch(() => active && setLoadError(true));
    return () => {
      active = false;
    };
  }, [nonce]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
    if (status !== "idle") setStatus("idle");
  };

  const onSocial = (key, value) => {
    setValues((v) => ({ ...v, socials: { ...v.socials, [key]: value } }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
    if (status !== "idle") setStatus("idle");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) return;

    const clean = {
      tagline: values.tagline.trim(),
      legalName: values.legalName.trim(),
      description: values.description.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      address: values.address.trim(),
      workingHours: values.workingHours.trim(),
      socials: Object.fromEntries(
        socialPlatforms.map((p) => [p.key, (values.socials[p.key] || "").trim()])
      ),
    };

    setStatus("saving");
    try {
      await saveSettings(clean);
      update(clean); // refresh Footer / Contact / CTA immediately
      setValues(clean);
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  };

  if (loadError) {
    return (
      <div className="mx-auto max-w-xl border border-line bg-surface p-10 text-center">
        <AlertCircle size={40} className="mx-auto text-red-500" />
        <p className="mt-4 font-semibold">Could not load settings.</p>
        <p className="mt-1 text-sm text-ink-soft">
          Check your connection and Firestore rules.
        </p>
        <button
          type="button"
          onClick={() => setNonce((n) => n + 1)}
          className="mt-6 inline-flex items-center gap-2 border border-accent px-5 py-2.5 text-sm font-medium text-accent transition-colors duration-300 hover:bg-accent hover:text-white dark:hover:text-primary-dark"
        >
          <RefreshCw size={16} />
          Try again
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

  return (
    <form onSubmit={onSubmit} noValidate className="mx-auto max-w-3xl space-y-6">
      {/* Site details */}
      <Section
        title="Site Details"
        text="Shown in the website footer under the company name."
      >
        <Field
          label="Legal Company Name"
          htmlFor="legalName"
          error={errors.legalName}
          hint='Shown in the footer and legal pages, e.g. "Nova Solutions (Pvt) Ltd".'
        >
          <input
            id="legalName"
            name="legalName"
            type="text"
            value={values.legalName}
            onChange={onChange}
            className="field"
          />
        </Field>
        <Field label="Tagline" htmlFor="tagline" error={errors.tagline} hint="A short slogan (max 80 characters).">
          <input
            id="tagline"
            name="tagline"
            type="text"
            value={values.tagline}
            onChange={onChange}
            className="field"
          />
        </Field>
        <Field label="Short Description" htmlFor="description" error={errors.description} hint="Max 300 characters.">
          <textarea
            id="description"
            name="description"
            rows={3}
            value={values.description}
            onChange={onChange}
            className="field resize-y"
          />
        </Field>
      </Section>

      {/* Contact info */}
      <Section
        title="Contact Information"
        text="Shown in the Footer, the Contact page and the call-to-action banner."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Email" htmlFor="email" error={errors.email}>
            <input
              id="email"
              name="email"
              type="email"
              value={values.email}
              onChange={onChange}
              className="field"
            />
          </Field>
          <Field label="Phone" htmlFor="phone" error={errors.phone}>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={values.phone}
              onChange={onChange}
              className="field"
            />
          </Field>
        </div>
        <Field label="Address" htmlFor="address">
          <input
            id="address"
            name="address"
            type="text"
            value={values.address}
            onChange={onChange}
            className="field"
          />
        </Field>
        <Field label="Working Hours" htmlFor="workingHours">
          <input
            id="workingHours"
            name="workingHours"
            type="text"
            value={values.workingHours}
            onChange={onChange}
            className="field"
          />
        </Field>
      </Section>

      {/* Social links */}
      <Section
        title="Social Media Links"
        text="Leave a field empty to hide that icon from the website."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          {socialPlatforms.map((p) => {
            const Icon = p.icon;
            return (
              <Field
                key={p.key}
                label={p.label}
                htmlFor={`social-${p.key}`}
                error={errors[p.key]}
              >
                <div className="relative">
                  <Icon
                    size={16}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft"
                  />
                  <input
                    id={`social-${p.key}`}
                    type={p.isPhone ? "tel" : "url"}
                    value={values.socials[p.key] || ""}
                    onChange={(e) => onSocial(p.key, e.target.value)}
                    placeholder={p.placeholder}
                    className="field"
                    style={{ paddingLeft: "2.75rem" }}
                  />
                </div>
              </Field>
            );
          })}
        </div>

        <div className="border-t border-line pt-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink-soft">
            Preview
          </p>
          {Object.values(values.socials).some((v) => v && v.trim()) ? (
            <SocialLinks socials={values.socials} variant="theme" />
          ) : (
            <p className="text-sm text-ink-soft">No social links added yet.</p>
          )}
        </div>
      </Section>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-4">
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
              Save Settings
            </>
          )}
        </button>

        {status === "saved" && (
          <p className="flex items-center gap-2 text-sm text-accent" role="status">
            <CheckCircle2 size={17} />
            Saved. The website is updated.
          </p>
        )}
        {status === "error" && (
          <p className="flex items-center gap-2 text-sm text-red-500" role="alert">
            <AlertCircle size={17} />
            Could not save. Check your Firestore rules and try again.
          </p>
        )}
      </div>
    </form>
  );
}