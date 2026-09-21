import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

// type: "question" | "demo"
export async function submitProjectInquiry({ type, project, name, email, phone, message }) {
  const prefix = type === "demo" ? "Demo request: " : "Project question: ";

  await addDoc(collection(db, "messages"), {
    name: name.trim().slice(0, 100),
    email: email.trim().slice(0, 200),
    phone: (phone || "").trim().slice(0, 30),
    service: `${prefix}${project.title}`.slice(0, 100),
    message: message.trim().slice(0, 3000),
    read: false,
    createdAt: serverTimestamp(),
    type,
    projectId: String(project.id).slice(0, 60),
    projectTitle: String(project.title).slice(0, 150),
  });
  return { ok: true };
}