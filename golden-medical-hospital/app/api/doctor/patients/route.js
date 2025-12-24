import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Appointment from "@/models/appointment";
import mongoose from "mongoose";

export async function GET() {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "doctor") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const userId = session.user?.id ?? session.user?._id ?? null;
    const userEmail = session.user?.email ?? null;

    let appts = [];

    if (userId && mongoose.Types.ObjectId.isValid(String(userId))) {
      appts = await Appointment.find({
        doctorId: String(userId),
        status: "Confirmed",
      })
        .select("patientId name email phone preferredDate preferredTime doctorId")
        .lean();
    } else {
      const raw = await Appointment.find({ status: "Confirmed" })
        .select("patientId name email phone preferredDate preferredTime doctorId")
        .populate("doctorId", "email")
        .lean();
      appts = Array.isArray(raw) ? raw.filter(a => a.doctorId && a.doctorId.email === userEmail) : [];
    }

    if (!Array.isArray(appts)) appts = [];

    const mapped = appts.map(a => ({
      id: a._id?.toString?.() ?? a.id ?? null,
      patientId: a.patientId?.toString?.() ?? null,
      name: a.name ?? "",
      email: a.email ?? "",
      phone: a.phone ?? "",
      preferredDate: a.preferredDate ?? null,
      preferredTime: a.preferredTime ?? "",
    }));

    return NextResponse.json(mapped);
  } catch (err) {
    console.error("[api/doctor/patients] error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
