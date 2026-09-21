import ProjectDetail from "@/components/sections/ProjectDetail";

// Reads the project on the server (public read) so link previews
// (WhatsApp, Facebook, Google) show the project's own title and image.
async function fetchProject(id) {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!projectId) return null;

  try {
    const res = await fetch(
      `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/projects/${encodeURIComponent(id)}`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return null;

    const f = (await res.json()).fields || {};
    return {
      title: f.title?.stringValue || "",
      description: f.description?.stringValue || "",
      image: f.image?.stringValue || "",
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const p = await fetchProject(id);
  if (!p?.title) return { title: "Project" };

  const images = p.image ? [{ url: p.image }] : undefined;

  return {
    title: p.title,
    description: p.description,
    alternates: { canonical: `/projects/${id}` },
    openGraph: { title: p.title, description: p.description, images },
    twitter: { title: p.title, description: p.description, images: p.image ? [p.image] : undefined },
  };
}

export default async function ProjectPage({ params }) {
  const { id } = await params;
  return <ProjectDetail id={id} />;
}