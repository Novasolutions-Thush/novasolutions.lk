import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { verifyAdmin } from "@/lib/verifyAdmin";

export const runtime = "nodejs";

const FOLDER = "nova-solutions/projects";

export async function POST(request) {
  const admin = await verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const publicId = body?.publicId;

  // Only allow deleting images inside our own project folder
  if (typeof publicId !== "string" || !publicId.startsWith(`${FOLDER}/`)) {
    return NextResponse.json({ error: "Invalid public id" }, { status: 400 });
  }

  await cloudinary.uploader.destroy(publicId, { invalidate: true });
  return NextResponse.json({ ok: true });
}