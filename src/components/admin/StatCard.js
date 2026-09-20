export default function StatCard({ icon: Icon, label, value, note }) {
  return (
    <div className="group border border-line bg-surface p-6 transition-colors duration-300 hover:border-accent">
      <div className="flex items-start justify-between">
        <div className="grid h-12 w-12 place-items-center bg-primary-dark text-light-purple transition-colors duration-300 group-hover:bg-light-purple group-hover:text-primary-dark dark:bg-deep-purple dark:text-white dark:group-hover:bg-light-purple dark:group-hover:text-primary-dark">
          <Icon size={22} />
        </div>
      </div>
      <p className="mt-5 font-heading text-4xl font-extrabold">{value}</p>
      <p className="mt-1 text-sm font-medium">{label}</p>
      {note && <p className="mt-1 text-xs text-ink-soft">{note}</p>}
    </div>
  );
}