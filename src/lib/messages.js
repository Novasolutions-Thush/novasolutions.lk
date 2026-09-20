import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

const messagesRef = () => collection(db, "messages");

// Real-time list of all messages (newest first)
export function subscribeMessages(onData, onError) {
  const q = query(messagesRef(), orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snap) => onData(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    onError
  );
}

// Real-time count of unread messages
export function subscribeUnreadCount(onData, onError) {
  const q = query(messagesRef(), where("read", "==", false));
  return onSnapshot(q, (snap) => onData(snap.size), onError);
}

export function setMessageRead(id, read) {
  return updateDoc(doc(db, "messages", id), { read });
}

export function deleteMessage(id) {
  return deleteDoc(doc(db, "messages", id));
}

export function formatMessageDate(createdAt) {
  const date = createdAt?.toDate?.();
  if (!date) return "";
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}