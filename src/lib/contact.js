import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function submitContact(data) {
  await addDoc(collection(db, "messages"), {
    name: data.name.trim().slice(0, 100),
    email: data.email.trim().slice(0, 200),
    phone: (data.phone || "").trim().slice(0, 30),
    service: (data.service || "").slice(0, 100),
    message: data.message.trim().slice(0, 3000),
    read: false,
    createdAt: serverTimestamp(),
  });
  return { ok: true };
}