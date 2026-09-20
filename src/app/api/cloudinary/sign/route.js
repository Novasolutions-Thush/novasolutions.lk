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

  const timestamp = Math.round(Date.now() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    { folder: FOLDER, timestamp },
    process.env.CLOUDINARY_API_SECRET
  );

  return NextResponse.json({
    signature,
    timestamp,
    folder: FOLDER,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  });
}