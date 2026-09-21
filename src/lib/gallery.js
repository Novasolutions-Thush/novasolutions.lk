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

const galleryRef = () => collection(db, "gallery");

export async function getGallery() {
  const snap = await getDocs(query(galleryRef(), orderBy("createdAt", "desc")));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function addGalleryItem(data) {
  const ref = await addDoc(galleryRef(), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateGalleryItem(id, data) {
  await updateDoc(doc(db, "gallery", id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteGalleryItem(id) {
  await deleteDoc(doc(db, "gallery", id));
}