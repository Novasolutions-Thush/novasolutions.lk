import Image from "next/image";
import { AlertCircle, ImagePlus } from "lucide-react";

export const MAX_MB = 5;
const TYPES = ["image/jpeg", "image/png", "image/webp"];

export function checkImage(file) {
  if (!TYPES.includes(file.type)) return "Use a JPG, PNG or WebP image.";
  if (file.size > MAX_MB * 1024 * 1024) return `Image must be under ${MAX_MB} MB.`;
  return "";
}

export function Section({ title, text, children }) {
  return (
    <section className="border border-line bg-surface p-6 sm:p-8">
      <h2 className="text-lg font-bold">{title}</h2>
      {text && <p className="mt-1 text-sm text-ink-soft">{text}</p>}
      <div className="mt-6 space-y-5">{children}</div>
    </section>
  );
}

export function Field({ label, htmlFor, error, hint, children }) {
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

export function PhotoPicker({
  id,
  preview,
  isBlob,
  onPick,
  label,
  boxClass = "aspect-[4/5] w-40",
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
      <div className={`relative shrink-0 overflow-hidden border border-line bg-primary-dark/10 ${boxClass}`}>
        {preview ? (
          <Image src={preview} alt="Preview" fill sizes="320px" unoptimized={isBlob} className="object-cover" />
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