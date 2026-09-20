// Verifies a Firebase ID token on the server using Google's Identity Toolkit
// API, then checks that the email belongs to an admin.
export async function verifyAdmin(request) {
  const header = request.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return null;

  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

  try {
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: token }),
        cache: "no-store",
      }
    );
    if (!res.ok) return null;

    const data = await res.json();
    const email = data.users?.[0]?.email?.toLowerCase();
    if (!email) return null;

    const admins = (
      process.env.ADMIN_EMAILS ||
      process.env.NEXT_PUBLIC_ADMIN_EMAILS ||
      ""
    )
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    return admins.includes(email) ? email : null;
  } catch {
    return null;
  }
}