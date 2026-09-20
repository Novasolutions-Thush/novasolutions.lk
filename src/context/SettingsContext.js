"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getSettings, mergeSettings } from "@/lib/settings";

const CACHE_KEY = "nova-settings-cache";
const SettingsContext = createContext(null);

function writeCache(settings) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(settings));
  } catch {}
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => mergeSettings());

  useEffect(() => {
    let active = true;

    // 1) Instant: last known values
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) setSettings(mergeSettings(JSON.parse(cached)));
    } catch {}

    // 2) Fresh values from Firestore
    getSettings()
      .then((fresh) => {
        if (!active) return;
        setSettings(fresh);
        writeCache(fresh);
      })
      .catch(() => {
        // Keep defaults/cached values if Firestore is unreachable
      });

    return () => {
      active = false;
    };
  }, []);

  // Used by the admin Settings page after saving
  const update = useCallback((next) => {
    const merged = mergeSettings(next);
    setSettings(merged);
    writeCache(merged);
  }, []);

  const value = useMemo(() => ({ settings, update }), [settings, update]);

  return (
    <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used inside <SettingsProvider>");
  return ctx;
}