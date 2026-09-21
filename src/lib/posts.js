import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

const postsRef = () => collection(db, "posts");

const time = (p) => (p.publishedAt ?? p.createdAt)?.toMillis?.() ?? 0;

// Public: published posts only (newest first)
export async function getPublishedPosts() {
  const snap = await getDocs(query(postsRef(), where("published", "==", true)));
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .sort((a, b) => time(b) - time(a));
}

// Admin: everything
export async function getAllPosts() {
  const snap = await getDocs(query(postsRef(), orderBy("createdAt", "desc")));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getPost(id) {
  const snap = await getDoc(doc(db, "posts", id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function createPost(data) {
  const ref = await addDoc(postsRef(), {
    ...data,
    publishedAt: data.published ? serverTimestamp() : null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

// `hadPublishedAt`: keeps the original publish date when editing
export async function updatePost(id, data, hadPublishedAt) {
  const payload = { ...data, updatedAt: serverTimestamp() };
  if (data.published && !hadPublishedAt) payload.publishedAt = serverTimestamp();
  await updateDoc(doc(db, "posts", id), payload);
}

export async function deletePost(id) {
  await deleteDoc(doc(db, "posts", id));
}

export function formatPostDate(post) {
  const date = (post.publishedAt ?? post.createdAt)?.toDate?.();
  if (!date) return "";
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(date);
}

export function readMinutes(text = "") {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}