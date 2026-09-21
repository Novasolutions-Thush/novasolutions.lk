export default function RichText({ text }) {
  const blocks = (text || "")
    .replace(/\r/g, "")
    // make sure every "## heading" stands alone
    .replace(/^(## .*)$/gm, "\n\n$1\n\n")
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean);

  return (
    <div className="space-y-5 leading-relaxed text-ink-soft">
      {blocks.map((block, i) => {
        if (block.startsWith("## ")) {
          return (
            <h3 key={i} className="pt-3 text-xl font-extrabold text-ink sm:text-2xl">
              {block.slice(3)}
            </h3>
          );
        }

        const lines = block.split("\n");
        if (lines.every((l) => l.trim().startsWith("- "))) {
          return (
            <ul key={i} className="space-y-2.5">
              {lines.map((l, j) => (
                <li key={j} className="flex gap-3">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 bg-accent" />
                  <span>{l.trim().slice(2)}</span>
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p key={i} className="whitespace-pre-line">
            {block}
          </p>
        );
      })}
    </div>
  );
}