import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

const ongoingRef = () => collection(db, "ongoing");

export async function getOngoing() {
  const snap = await getDocs(query(ongoingRef(), orderBy("createdAt", "desc")));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function createOngoing(data) {
  const ref = await addDoc(ongoingRef(), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateOngoing(id, data) {
  await updateDoc(doc(db, "ongoing", id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteOngoing(id) {
  await deleteDoc(doc(db, "ongoing", id));
}

// "2026-09-21" -> "21 Sep 2026"
export function formatUpdateDate(value) {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(date);
}