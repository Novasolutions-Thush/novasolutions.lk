import BlogPostView from "@/components/sections/BlogPostView";

async function fetchPost(id) {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!projectId) return null;

  try {
    const res = await fetch(
      `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/posts/${encodeURIComponent(id)}`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return null;

    const f = (await res.json()).fields || {};
    return {
      title: f.title?.stringValue || "",
      excerpt: f.excerpt?.stringValue || "",
      image: f.coverImage?.stringValue || "",
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const p = await fetchPost(id);
  if (!p?.title) return { title: "Blog" };

  const images = p.image ? [{ url: p.image }] : undefined;

  return {
    title: p.title,
    description: p.excerpt,
    alternates: { canonical: `/blog/${id}` },
    openGraph: { type: "article", title: p.title, description: p.excerpt, images },
    twitter: { title: p.title, description: p.excerpt, images: p.image ? [p.image] : undefined },
  };
}

export default async function BlogPostPage({ params }) {
  const { id } = await params;
  return <BlogPostView id={id} />;
}