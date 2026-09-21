import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const ceoRef = () => doc(db, "settings", "ceo");

export const ceoDefaults = {
  name: "",
  role: "Founder & CEO",
  quote: "",
  message: "",
  vision: "",
  signature: "",
  linkedin: "",
  photo: "",
  photoPublicId: "",
};

export async function getCeo() {
  const snap = await getDoc(ceoRef());
  return { ...ceoDefaults, ...(snap.exists() ? snap.data() : {}) };
}

export async function saveCeo(values) {
  await setDoc(ceoRef(), { ...values, updatedAt: serverTimestamp() }, { merge: true });
}