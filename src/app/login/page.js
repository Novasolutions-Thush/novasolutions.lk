import { ShieldCheck } from "lucide-react";
import LoginForm from "@/components/sections/LoginForm";
import Reveal from "@/components/ui/Reveal";

export const metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className="relative isolate overflow-hidden px-5 pb-16 pt-32 sm:px-8 sm:pt-40">
      {/* Background accents */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-light-purple/35 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-deep-purple/25 blur-3xl" />
      </div>

      <div className="mx-auto max-w-md">
        <Reveal>
          <div className="mb-8 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center bg-primary-dark text-light-purple dark:bg-deep-purple dark:text-white">
              <ShieldCheck size={28} />
            </div>
            <h1 className="mt-5 text-3xl font-extrabold sm:text-4xl">
              Admin Login
            </h1>
            <p className="mt-2 text-ink-soft">
              Sign in to manage the Nova Solutions website.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <LoginForm />
        </Reveal>
      </div>
    </main>
  );
}