import { auth } from "@/lib/firebase";

async function authHeader() {
  const user = auth.currentUser;
  if (!user) throw new Error("Not signed in");
  const token = await user.getIdToken();
  return { Authorization: `Bearer ${token}` };
}

// Uploads directly from the browser to Cloudinary using a server-made signature
export async function uploadProjectImage(file) {
  const signRes = await fetch("/api/cloudinary/sign", {
    method: "POST",
    headers: await authHeader(),
  });
  if (!signRes.ok) throw new Error("Could not authorize the upload");

  const { signature, timestamp, folder, apiKey, cloudName } =
    await signRes.json();

  const form = new FormData();
  form.append("file", file);
  form.append("api_key", apiKey);
  form.append("timestamp", String(timestamp));
  form.append("signature", signature);
  form.append("folder", folder);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: form }
  );
  if (!res.ok) throw new Error("Image upload failed");

  const data = await res.json();
  return { url: data.secure_url, publicId: data.public_id };
}

// Best effort: a failed image delete should never block the main action
export async function deleteProjectImage(publicId) {
  if (!publicId) return;
  try {
    await fetch("/api/cloudinary/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(await authHeader()) },
      body: JSON.stringify({ publicId }),
    });
  } catch {
    // ignore
  }
}