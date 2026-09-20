"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  LogIn,
  Lock,
  Mail,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

function errorMessage(code) {
  switch (code) {
    case "app/not-admin":
      return "This account does not have admin access.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a few minutes and try again.";
    case "auth/network-request-failed":
      return "Network error. Please check your connection.";
    case "auth/user-disabled":
      return "This account has been disabled.";
    default:
      // Same message for wrong email / wrong password / unknown account
      return "Invalid email or password.";
  }
}

export default function LoginForm() {
  const router = useRouter();
  const { login, resetPassword, isAdmin, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | sending
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  // Already signed in as admin: go straight to the dashboard
  useEffect(() => {
    if (!loading && isAdmin) router.replace("/admin");
  }, [loading, isAdmin, router]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Please enter your password.");
      return;
    }

    setStatus("sending");
    try {
      await login(email.trim(), password);
      router.replace("/admin");
    } catch (err) {
      setError(errorMessage(err.code));
      setStatus("idle");
    }
  };

  const onForgot = async () => {
    setError("");
    setInfo("");
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Enter your email above first, then click 'Forgot password'.");
      return;
    }
    try {
      await resetPassword(email.trim());
    } catch {
      // Ignore errors on purpose: never reveal whether an account exists
    }
    setInfo("If this email is registered, a reset link has been sent.");
  };

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="space-y-5 border border-line bg-surface p-6 sm:p-10"
    >
      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium">
          Email
        </label>
        <div className="relative">
          <Mail
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft"
          />
          <input
            id="email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@novasolutions.lk"
            className="field"
            style={{ paddingLeft: "2.75rem" }}
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="mb-2 block text-sm font-medium">
          Password
        </label>
        <div className="relative">
          <Lock
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft"
          />
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            className="field"
            style={{ paddingLeft: "2.75rem", paddingRight: "3rem" }}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center text-ink-soft transition-colors duration-300 hover:text-accent"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {error && (
        <p className="flex items-start gap-2 text-sm text-red-500" role="alert">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          {error}
        </p>
      )}
      {info && (
        <p className="flex items-start gap-2 text-sm text-accent" role="status">
          <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
          {info}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex w-full items-center justify-center gap-2 bg-primary-dark px-8 py-4 font-semibold text-white transition-colors duration-300 hover:bg-deep-purple disabled:cursor-not-allowed disabled:opacity-70 dark:bg-light-purple dark:text-primary-dark dark:hover:bg-soft-lavender"
      >
        {status === "sending" ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Signing in...
          </>
        ) : (
          <>
            <LogIn size={18} />
            Sign In
          </>
        )}
      </button>

      <button
        type="button"
        onClick={onForgot}
        className="text-sm text-accent transition-opacity duration-300 hover:opacity-70"
      >
        Forgot password?
      </button>
    </form>
  );
}