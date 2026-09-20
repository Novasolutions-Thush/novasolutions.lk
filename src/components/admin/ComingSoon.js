import { Hammer } from "lucide-react";

export default function ComingSoon({ title, text }) {
  return (
    <div className="mx-auto max-w-xl border border-line bg-surface p-10 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center bg-primary-dark text-light-purple dark:bg-deep-purple dark:text-white">
        <Hammer size={26} />
      </div>
      <h2 className="mt-5 text-2xl font-extrabold">{title}</h2>
      <p className="mt-3 text-ink-soft">{text}</p>
    </div>
  );
}