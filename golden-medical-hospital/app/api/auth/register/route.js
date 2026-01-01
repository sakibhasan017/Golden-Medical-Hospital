import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Patient from "@/models/patient";
import Doctor from "@/models/doctor";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import { v4 as uuid } from "uuid";

export async function POST(req) {
  try {
    await connectDB();

    const form = await req.formData();
    const role = form.get("role");

    const saveFile = async (file) => {
      if (!file) return null;

      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = uuid() + "-" + file.name;
      const uploadDir = path.join(process.cwd(), "public", "uploads");

      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

      fs.writeFileSync(path.join(uploadDir, filename), buffer);
      return "/uploads/" + filename;
    };

    const hashedPassword = await bcrypt.hash(form.get("password"), 10);

  
    if (role === "patient") {
      const image = await saveFile(form.get("image"));

      await Patient.create({
        name: form.get("name"),
        email: form.get("email"),
        phone: form.get("phone"),
        age: form.get("age"),
        bloodGroup: form.get("bloodGroup"),
        password: hashedPassword,
        image,
      });

      return NextResponse.json(
        { message: "Patient registered successfully!" },
        { status: 201 }
      );
    }

    if (role === "doctor") {
      const image = await saveFile(form.get("image"));
      const certificate = await saveFile(form.get("certificate"));

      await Doctor.create({
        name: form.get("name"),
        email: form.get("email"),
        phone: form.get("phone"),
        age: form.get("age"),
        Designation: form.get("designation"),
        Department: form.get("department"),
        Bio: form.get("bio"),
        password: hashedPassword,
        image,
        certificate,
      });

      return NextResponse.json(
        { message: "Doctor registered. Await admin verification." },
        { status: 201 }
      );
    }

    return NextResponse.json({ message: "Invalid role" }, { status: 400 });
  } catch (error) {
    console.log("REGISTER ERROR", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
