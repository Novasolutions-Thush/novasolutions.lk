const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const base = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;

const idOf = (name) => name.split("/").pop();

// All projects (public read)
export async function listProjectEntries() {
  if (!projectId) return [];
  try {
    const res = await fetch(`${base}/projects?pageSize=300`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.documents || []).map((d) => ({ id: idOf(d.name), updated: d.updateTime }));
  } catch {
    return [];
  }
}

// Published articles only (the filter is required by the security rules)
export async function listPublishedPostEntries() {
  if (!projectId) return [];
  try {
    const res = await fetch(`${base}:runQuery`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({
        structuredQuery: {
          from: [{ collectionId: "posts" }],
          where: {
            fieldFilter: {
              field: { fieldPath: "published" },
              op: "EQUAL",
              value: { booleanValue: true },
            },
          },
          limit: 300,
        },
      }),
    });
    if (!res.ok) return [];
    const rows = await res.json();
    return rows
      .filter((r) => r.document)
      .map((r) => ({ id: idOf(r.document.name), updated: r.document.updateTime }));
  } catch {
    return [];
  }
}