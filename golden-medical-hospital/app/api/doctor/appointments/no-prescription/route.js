import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Appointment from "@/models/appointment";
import Prescription from "@/models/prescription";
import Doctor from "@/models/doctor";
import mongoose from "mongoose";

export async function GET() {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "doctor") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const candidateId = String(session.user?.id ?? session.user?._id ?? "");
    let doctorObjectId = null;

    if (mongoose.Types.ObjectId.isValid(candidateId)) {
      const d = await Doctor.findById(candidateId).select("_id").lean().catch(() => null);
      if (d) doctorObjectId = d._id;
    }

    if (!doctorObjectId && session.user?.email) {
      const d2 = await Doctor.findOne({ email: session.user.email }).select("_id").lean().catch(() => null);
      if (d2) doctorObjectId = d2._id;
    }

    let appointments = [];
    if (doctorObjectId) {
      appointments = await Appointment.find({ doctorId: doctorObjectId, status: "Confirmed" }).lean();
    } else {
      const all = await Appointment.find({ status: "Confirmed" }).lean();
      appointments = (all || []).filter(a => String(a.doctorId) === candidateId);
    }

    const presQuery = doctorObjectId ? { doctorId: doctorObjectId } : { };
    const prescriptions = await Prescription.find(presQuery).select("appointmentId doctorId").lean();

    const presSet = new Set((prescriptions || []).map(p => String(p.appointmentId)));

    const filtered = (appointments || []).filter(a => !presSet.has(String(a._id)));

    const mapped = filtered.map(a => ({
      id: a._id?.toString?.() ?? null,
      patientId: a.patientId?.toString?.() ?? null,
      name: a.name ?? "",
      email: a.email ?? "",
      phone: a.phone ?? "",
      preferredDate: a.preferredDate ?? null,
      preferredTime: a.preferredTime ?? "",
      symptoms: a.symptoms ?? "",
      status: a.status ?? ""
    }));

    return NextResponse.json(mapped, { status: 200 });
  } catch (err) {
    console.error("[api/doctor/appointments/no-prescription] error", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
