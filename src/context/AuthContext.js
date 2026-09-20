"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { isAdminEmail } from "@/lib/admin";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = useCallback(async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);

    // Valid Firebase account but not an admin: sign out immediately
    if (!isAdminEmail(cred.user.email)) {
      await signOut(auth);
      const error = new Error("Not an admin account");
      error.code = "app/not-admin";
      throw error;
    }
    return cred.user;
  }, []);

  const logout = useCallback(() => signOut(auth), []);

  const resetPassword = useCallback(
    (email) => sendPasswordResetEmail(auth, email),
    []
  );

  const value = useMemo(
    () => ({
      user,
      loading,
      isAdmin: Boolean(user) && isAdminEmail(user.email),
      login,
      logout,
      resetPassword,
    }),
    [user, loading, login, logout, resetPassword]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}