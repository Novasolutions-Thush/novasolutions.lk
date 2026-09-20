"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";
import { services } from "@/data/services";
import { submitContact } from "@/lib/contact";

const initial = { name: "", email: "", phone: "", service: "", message: "", website: "" };

function validate(v) {
  const e = {};
  if (v.name.trim().length < 2) e.name = "Please enter your name.";
  if (!/^\S+@\S+\.\S+$/.test(v.email)) e.email = "Please enter a valid email.";
  if (v.phone && !/^[+\d][\d\s-]{6,}$/.test(v.phone))
    e.phone = "Please enter a valid phone number.";
  if (v.message.trim().length < 10)
    e.message = "Message must be at least 10 characters.";
  return e;
}

function Field({ label, error, required, children, htmlFor }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block text-sm font-medium">
        {label} {required && <span className="text-accent">*</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-red-500" role="alert">
          <AlertCircle size={14} />
          {error}
        </p>
      )}
    </div>
  );
}

export default function ContactForm() {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | success | error

  const onChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // Honeypot: bots fill hidden fields, humans do not
    if (values.website) return;

    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) return;

    setStatus("sending");
    try {
      const { website, ...data } = values;
      await submitContact(data);
      setStatus("success");
      setValues(initial);
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="border border-line bg-surface p-10 text-center">
        <CheckCircle2 size={48} className="mx-auto text-accent" />
        <h3 className="mt-5 text-2xl font-bold">Message sent!</h3>
        <p className="mt-3 text-ink-soft">
          Thank you for reaching out. Our team will reply within one business
          day.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-8 border border-accent px-6 py-3 font-medium text-accent transition-colors duration-300 hover:bg-accent hover:text-white dark:hover:text-primary-dark"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="space-y-5 border border-line bg-surface p-6 sm:p-10"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full Name" required error={errors.name} htmlFor="name">
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            value={values.name}
            onChange={onChange}
            placeholder="Your name"
            className="field"
          />
        </Field>

        <Field label="Email" required error={errors.email} htmlFor="email">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={onChange}
            placeholder="you@example.com"
            className="field"
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Phone" error={errors.phone} htmlFor="phone">
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={onChange}
            placeholder="+94 7X XXX XXXX"
            className="field"
          />
        </Field>

        <Field label="Service" htmlFor="service">
          <select
            id="service"
            name="service"
            value={values.service}
            onChange={onChange}
            className="field"
          >
            <option value="">Select a service</option>
            {services.map((s) => (
              <option key={s.id} value={s.title}>
                {s.title}
              </option>
            ))}
            <option value="Other">Other</option>
          </select>
        </Field>
      </div>

      <Field label="Message" required error={errors.message} htmlFor="message">
        <textarea
          id="message"
          name="message"
          rows={6}
          value={values.message}
          onChange={onChange}
          placeholder="Tell us about your project..."
          className="field resize-y"
        />
      </Field>

      {/* Honeypot (hidden from humans) */}
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={onChange}
        />
      </div>

      {status === "error" && (
        <p className="flex items-center gap-2 text-sm text-red-500" role="alert">
          <AlertCircle size={16} />
          Something went wrong. Please try again.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex w-full items-center justify-center gap-2 bg-primary-dark px-8 py-4 font-semibold text-white transition-colors duration-300 hover:bg-deep-purple disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto dark:bg-light-purple dark:text-primary-dark dark:hover:bg-soft-lavender"
      >
        {status === "sending" ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Sending...
          </>
        ) : (
          <>
            Send Message
            <Send size={18} />
          </>
        )}
      </button>
    </form>
  );
}