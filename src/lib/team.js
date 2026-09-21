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
  writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

const teamRef = () => collection(db, "team");

export async function getTeam() {
  const snap = await getDocs(query(teamRef(), orderBy("order", "asc")));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function createMember(data) {
  const ref = await addDoc(teamRef(), {
    ...data,
    order: Date.now(), // new members go to the end
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateMember(id, data) {
  await updateDoc(doc(db, "team", id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteMember(id) {
  await deleteDoc(doc(db, "team", id));
}

// Swaps the display order of two members
export async function swapOrder(a, b) {
  const batch = writeBatch(db);
  batch.update(doc(db, "team", a.id), { order: b.order });
  batch.update(doc(db, "team", b.id), { order: a.order });
  await batch.commit();
}