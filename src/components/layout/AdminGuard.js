"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AdminGuard({ children }) {
  const router = useRouter();
  const { user, isAdmin, loading, logout } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
    } else if (!isAdmin) {
      // Signed in but not an admin
      logout().finally(() => router.replace("/login"));
    }
  }, [loading, user, isAdmin, router, logout]);

  // Never render admin content until admin status is confirmed
  if (loading || !isAdmin) {
    return (
      <div className="grid min-h-screen place-items-center">
        <Loader2 size={32} className="animate-spin text-accent" />
      </div>
    );
  }

  return children;
}