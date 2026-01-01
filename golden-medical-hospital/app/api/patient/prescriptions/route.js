import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Prescription from "@/models/prescription";
import Patient from "@/models/patient";
import mongoose from "mongoose";

export async function GET() {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "patient") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const candidate = String(session.user._id ?? session.user.id ?? "");
    let patientObjectId = null;

    if (mongoose.Types.ObjectId.isValid(candidate)) {
      patientObjectId = candidate;
    } else if (session.user?.email) {
      const p = await Patient.findOne({ email: session.user.email }).select("_id").lean().catch(() => null);
      if (p && p._id) patientObjectId = String(p._id);
    }

    if (!patientObjectId) {
      return NextResponse.json([], { status: 200 });
    }

    const prescriptions = await Prescription.find({ patientId: patientObjectId })
      .populate("doctorId", "name department specialization")
      .populate("appointmentId", "preferredDate preferredTime symptoms")
      .lean();

    const formatted = (Array.isArray(prescriptions) ? prescriptions : []).map(p => ({
      id: String(p._id),
      doctor: p.doctorId?.name ?? "Unknown Doctor",
      department: p.doctorId?.department ?? p.doctorId?.specialization ?? "General",
      date: p.appointmentId?.preferredDate ? (new Date(p.appointmentId.preferredDate)).toISOString().split("T")[0] : "",
      summary: p.appointmentId?.symptoms ?? "",
      medicines: (Array.isArray(p.medicines) ? p.medicines : []).map(m => ({
        name: m.name,
        dosage: [m.dosage, m.frequency, m.duration].filter(Boolean).join(" • ")
      })),
      notes: p.notes ?? ""
    }));

    return NextResponse.json(formatted, { status: 200 });
  } catch (err) {
    console.error("[Patient Prescription GET error]", err);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
