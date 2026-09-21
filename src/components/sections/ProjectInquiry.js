"use client";

import { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  MessageSquare,
  MonitorPlay,
  Send,
} from "lucide-react";
import { submitProjectInquiry } from "@/lib/inquiry";

const initial = { name: "", email: "", phone: "", message: "", website: "" };

const MODES = {
  question: {
    label: "Ask a Question",
    icon: MessageSquare,
    placeholder: "What would you like to know about this project?",
    button: "Send Question",
    success: "Your question has been sent. We will reply by email soon.",
  },
  demo: {
    label: "Request a Demo",
    icon: MonitorPlay,
    placeholder:
      "Tell us your preferred date and time, and what you would like to see in the demo.",
    button: "Request Demo",
    success: "Your demo request has been sent. We will contact you to arrange it.",
  },
};

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

function Field({ label, htmlFor, error, children }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block text-sm font-medium">
        {label}
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

export default function ProjectInquiry({ project, mode, setMode }) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const current = MODES[mode];

  const onChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const switchMode = (m) => {
    setMode(m);
    setStatus("idle");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (values.website) return; // honeypot

    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) return;

    setStatus("sending");
    try {
      await submitProjectInquiry({ type: mode, project, ...values });
      setValues(initial);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="border border-line bg-surface p-6 sm:p-10">
      {/* Mode tabs */}
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Enquiry type">
        {Object.entries(MODES).map(([key, m]) => {
          const Icon = m.icon;
          const active = key === mode;
          return (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => switchMode(key)}
              className={`inline-flex items-center gap-2 border px-5 py-2.5 text-sm font-medium transition-colors duration-300 ${
                active
                  ? "border-primary-dark bg-primary-dark text-white dark:border-light-purple dark:bg-light-purple dark:text-primary-dark"
                  : "border-line text-ink-soft hover:border-accent hover:text-accent"
              }`}
            >
              <Icon size={16} />
              {m.label}
            </button>
          );
        })}
      </div>

      {status === "success" ? (
        <div className="py-10 text-center">
          <CheckCircle2 size={44} className="mx-auto text-accent" />
          <h3 className="mt-4 text-xl font-bold">Thank you!</h3>
          <p className="mt-2 text-ink-soft">{current.success}</p>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="mt-6 border border-accent px-6 py-3 text-sm font-medium text-accent transition-colors duration-300 hover:bg-accent hover:text-white dark:hover:text-primary-dark"
          >
            Send another
          </button>
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate className="mt-6 space-y-5">
          <p className="text-sm text-ink-soft">
            About: <strong className="text-ink">{project.title}</strong>
          </p>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Full Name *" htmlFor="pi-name" error={errors.name}>
              <input
                id="pi-name"
                name="name"
                type="text"
                autoComplete="name"
                value={values.name}
                onChange={onChange}
                className="field"
              />
            </Field>
            <Field label="Email *" htmlFor="pi-email" error={errors.email}>
              <input
                id="pi-email"
                name="email"
                type="email"
                autoComplete="email"
                value={values.email}
                onChange={onChange}
                className="field"
              />
            </Field>
          </div>

          <Field label="Phone (optional)" htmlFor="pi-phone" error={errors.phone}>
            <input
              id="pi-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              value={values.phone}
              onChange={onChange}
              placeholder="+94 7X XXX XXXX"
              className="field"
            />
          </Field>

          <Field label="Message *" htmlFor="pi-message" error={errors.message}>
            <textarea
              id="pi-message"
              name="message"
              rows={5}
              value={values.message}
              onChange={onChange}
              placeholder={current.placeholder}
              className="field resize-y"
            />
          </Field>

          {/* Honeypot */}
          <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
            <label htmlFor="pi-website">Website</label>
            <input
              id="pi-website"
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
                {current.button}
                <Send size={18} />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}