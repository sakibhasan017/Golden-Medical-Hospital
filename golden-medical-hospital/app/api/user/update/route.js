// app/api/user/update/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Patient from "@/models/patient";
import Doctor from "@/models/doctor";
import bcrypt from "bcryptjs";
import fs from "fs/promises";
import path from "path";

const UPLOADS_DIR = path.resolve(process.cwd(), "public", "uploads");

async function safeUnlink(publicPath) {
  if (!publicPath) return;
  const rel = publicPath.replace(/^\/+/, ""); 

  let candidate;
  if (rel.startsWith("public" + path.sep) || rel.startsWith("public/")) {
    candidate = path.resolve(process.cwd(), rel);
  } else {
    candidate = path.resolve(process.cwd(), "public", rel);
  }
  if (!candidate.startsWith(UPLOADS_DIR)) return;
  try {
    await fs.unlink(candidate);
  } catch (err) {
    if (err.code === "ENOENT") {
      
      return;
    }
    console.warn("safeUnlink error:", err);
  }
}

export async function PATCH(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }

    await connectDB();

    const body = await req.json();
    const email = session.user.email;
    const role = session.user.role || body.role || "patient";

    const Model = role === "doctor" ? Doctor : Patient;

    const existing = await Model.findOne({ email }).select("+password").lean();
    if (!existing) {
      return new Response(JSON.stringify({ message: `${role} not found` }), { status: 404 });
    }

    const updates = {};

    if (body.name !== undefined) updates.name = body.name;
    if (body.phone !== undefined) updates.phone = body.phone;

    if (role === "patient") {
      if (body.age !== undefined) updates.age = body.age === "" ? undefined : Number(body.age);
      if (body.bloodGroup !== undefined) updates.bloodGroup = body.bloodGroup;
    } else if (role === "doctor") {
      if (body.designation !== undefined) updates.designation = body.designation;
      if (body.department !== undefined) updates.department = body.department;
      if (body.bio !== undefined) updates.bio = body.bio;
    }

    if (body.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(body.password, salt);
    }

    let newImage = undefined;
    let newCertificate = undefined;
    if (body.image !== undefined) {
      newImage = body.image || "";
      updates.image = newImage;
    }
    if (body.certificate !== undefined) {
      newCertificate = body.certificate || "";
      updates.certificate = newCertificate;
    }

    if (role === "doctor") {
  
      updates.profileComplete = true;
    }

    const updated = await Model.findOneAndUpdate({ email }, { $set: updates }, { new: true }).select("-password").lean();
    if (!updated) {
      return new Response(JSON.stringify({ message: "Update failed" }), { status: 500 });
    }

    
    (async () => {
      try {
        if (newImage !== undefined) {
          const oldImage = existing.image;
          if (oldImage && oldImage !== newImage) await safeUnlink(oldImage);
        }
        if (newCertificate !== undefined) {
          const oldCert = existing.certificate;
          if (oldCert && oldCert !== newCertificate) await safeUnlink(oldCert);
        }
      } catch (err) {
        console.warn("post-update cleanup error:", err);
      }
    })();

    return new Response(JSON.stringify(updated), { status: 200 });
  } catch (err) {
    console.error("user update error:", err);
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
  }
}
