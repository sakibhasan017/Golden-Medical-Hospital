import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Patient from "@/models/patient";

export async function GET(request, { params }) {
  try {
    await connectDB();
    if (params && typeof params.then === "function") params = await params;
    const id = params?.id;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }
    const p = await Patient.findById(id).select("-password").lean();
    if (!p) return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json({
      id: p._id.toString(),
      name: p.name,
      email: p.email,
      phone: p.phone,
      age: p.age,
      bloodGroup: p.bloodGroup,
      image: p.image ?? null,
      profileComplete: !!p.profileComplete
    }, { status: 200 });
  } catch (err) {
    console.error("[api/patient/[id]]", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
