import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Doctor from "@/models/doctor";

export async function GET(request, context) {
  try {
    await connectDB();

    let params = context?.params;
    if (params && typeof params.then === "function") {
      params = await params;
    }

    const id = params?.id;
    if (!id) {
      return NextResponse.json({ message: "Doctor ID missing" }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid doctor ID" }, { status: 400 });
    }

    const doctor = await Doctor.findById(id).select("-password").lean();

    if (!doctor) {
      return NextResponse.json({ message: "Doctor not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: doctor._id.toString(),
      name: doctor.name,
      email: doctor.email,
      phone: doctor.phone,
      designation: doctor.designation ?? doctor.Designation ?? "",
      department: doctor.department ?? doctor.Department ?? "",
      bio: doctor.bio ?? doctor.Bio ?? "",
      image: doctor.image ?? "/placeholder-doctor.png",
      certificate: doctor.certificate ?? "",
      status: doctor.status ?? "pending",
    });
  } catch (err) {
    console.error("GET /api/doctors/[id] error:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
