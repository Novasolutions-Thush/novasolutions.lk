import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { defaultSettings } from "@/data/siteDefaults";

const settingsRef = () => doc(db, "settings", "site");

// Combines saved values with defaults so nothing is ever undefined
export function mergeSettings(data = {}) {
  return {
    ...defaultSettings,
    ...data,
    socials: { ...defaultSettings.socials, ...(data.socials || {}) },
  };
}

export async function getSettings() {
  const snap = await getDoc(settingsRef());
  return mergeSettings(snap.exists() ? snap.data() : {});
}

export async function saveSettings(values) {
  await setDoc(
    settingsRef(),
    { ...values, updatedAt: serverTimestamp() },
    { merge: true }
  );
}