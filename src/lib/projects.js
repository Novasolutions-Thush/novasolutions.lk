import {
  Timestamp,
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
  writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

const projectsRef = () => collection(db, "projects");

export async function getProjects() {
  const snap = await getDocs(query(projectsRef(), orderBy("createdAt", "desc")));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getProject(id) {
  const snap = await getDoc(doc(db, "projects", id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function createProject(data) {
  const ref = await addDoc(projectsRef(), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateProject(id, data) {
  await updateDoc(doc(db, "projects", id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteProject(id) {
  await deleteDoc(doc(db, "projects", id));
}

// The detailed fields of a sample project (Firestore never accepts undefined)
const detailFields = (p) => ({
  longDescription: p.longDescription || "",
  gallery: p.gallery || [],
  features: p.features || [],
  clients: p.clients || [],
  demoUrl: p.demoUrl || "",
  year: p.year || "",
  duration: p.duration || "",
});

// One-time helper: copies the sample projects from the static data file
export async function seedProjects(list) {
  const batch = writeBatch(db);
  const base = Date.now();

  list.forEach((p, i) => {
    batch.set(doc(projectsRef()), {
      title: p.title,
      category: p.category,
      description: p.description,
      tech: p.tech,
      image: p.image,
      imagePublicId: "",
      featured: i < 3,
      ...detailFields(p),
      createdAt: Timestamp.fromMillis(base - i * 1000),
      updatedAt: serverTimestamp(),
    });
  });

  await batch.commit();
}

// For sample projects imported BEFORE this step: adds the new detail fields
// (matched by title). Images and everything else stay untouched.
export async function syncSampleDetails(existing, samples) {
  const batch = writeBatch(db);
  let count = 0;

  existing.forEach((p) => {
    if (p.longDescription) return;
    const sample = samples.find((s) => s.title === p.title);
    if (!sample) return;
    batch.update(doc(db, "projects", p.id), {
      ...detailFields(sample),
      updatedAt: serverTimestamp(),
    });
    count += 1;
  });

  if (count) await batch.commit();
  return count;
}