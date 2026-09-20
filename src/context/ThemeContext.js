"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const STORAGE_KEY = "nova-theme-override";

// 6:00 AM - 5:59 PM => light, 6:00 PM - 5:59 AM => dark
export function getAutoTheme(date = new Date()) {
  const hour = date.getHours();
  return hour >= 6 && hour < 18 ? "light" : "dark";
}

// Timestamp of the next automatic switch (next 6:00 AM or 6:00 PM)
function getNextSwitchTime(date = new Date()) {
  const next = new Date(date);
  const hour = date.getHours();

  if (hour < 6) {
    next.setHours(6, 0, 0, 0);
  } else if (hour < 18) {
    next.setHours(18, 0, 0, 0);
  } else {
    next.setDate(next.getDate() + 1);
    next.setHours(6, 0, 0, 0);
  }
  return next.getTime();
}

// Returns the manual theme if it is still valid, otherwise null
function readOverride() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const { theme, until } = JSON.parse(raw);
    if ((theme === "light" || theme === "dark") && Date.now() < until) {
      return theme;
    }
    localStorage.removeItem(STORAGE_KEY);
    return null;
  } catch {
    return null;
  }
}

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const [isManual, setIsManual] = useState(false);
  const [mounted, setMounted] = useState(false);

  const resolveTheme = useCallback(() => {
    const override = readOverride();
    setIsManual(Boolean(override));
    setTheme(override ?? getAutoTheme());
  }, []);

  // Initial resolve + re-check every 30 seconds (handles 6 AM / 6 PM switch)
  useEffect(() => {
    resolveTheme();
    setMounted(true);
    const id = setInterval(resolveTheme, 30000);
    return () => clearInterval(id);
  }, [resolveTheme]);

  // Apply the theme to <html>
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    const next = theme === "dark" ? "light" : "dark";
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ theme: next, until: getNextSwitchTime() })
      );
    } catch {}
    setTheme(next);
    setIsManual(true);
  }, [theme]);

  const resetToAuto = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    resolveTheme();
  }, [resolveTheme]);

  return (
    <ThemeContext.Provider
      value={{ theme, isManual, mounted, toggleTheme, resetToAuto }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}