export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}) {
  const center = align === "center";

  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <div
        className={`flex items-center gap-3 ${center ? "justify-center" : ""}`}
      >
        <span className="h-px w-10 bg-accent" />
        <span className="font-heading text-xs font-semibold uppercase tracking-[0.25em] text-accent sm:text-sm">
          {eyebrow}
        </span>
        {center && <span className="h-px w-10 bg-accent" />}
      </div>

      <h2 className="mt-4 text-[clamp(1.9rem,3.2vw,3.25rem)] font-extrabold leading-[1.1]">
        {title}
      </h2>

      {description && (
        <p className="mt-4 text-base leading-relaxed text-ink-soft sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}