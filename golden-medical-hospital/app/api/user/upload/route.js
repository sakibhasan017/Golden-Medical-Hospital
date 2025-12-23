// app/api/user/upload/route.js
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

const ALLOWED_EXT = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".pdf", ".zip"];
const MAX_BYTES = 20 * 1024 * 1024;

export async function POST(request) {
  try {
    const formData = await request.formData();
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    // Expect single file field (name can be anything, we'll pick the first file).
    let pickedFile = null;
    for (const entry of formData.entries()) {
      const value = entry[1];
      if (value && typeof value === "object" && typeof value.arrayBuffer === "function" && value.name) {
        pickedFile = value;
        break;
      }
    }

    if (!pickedFile) {
      return new Response(JSON.stringify({ message: "No file uploaded" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const originalName = pickedFile.name;
    const ext = path.extname(originalName).toLowerCase();
    if (!ALLOWED_EXT.includes(ext)) {
      return new Response(JSON.stringify({ message: "Invalid file type" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const buffer = Buffer.from(await pickedFile.arrayBuffer());
    if (buffer.length > MAX_BYTES) {
      return new Response(JSON.stringify({ message: "File too large" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const filename = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`;
    const filePath = path.join(uploadDir, filename);
    await fs.writeFile(filePath, buffer);

    const publicPath = `/uploads/${filename}`;
    return new Response(JSON.stringify({ path: publicPath }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("upload error", err);
    return new Response(JSON.stringify({ message: "Upload failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
