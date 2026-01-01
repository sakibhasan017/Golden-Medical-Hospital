import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Prescription from "@/models/prescription";
import Patient from "@/models/patient";
import Doctor from "@/models/doctor";
import mongoose from "mongoose";

async function resolvePatientObjectId(session) {
  const cand = String(session?.user?._id ?? session?.user?.id ?? "");
  if (mongoose.Types.ObjectId.isValid(cand)) return String(cand);
  if (session?.user?.email) {
    const p = await Patient.findOne({ email: session.user.email }).select("_id").lean().catch(() => null);
    if (p && p._id) return String(p._id);
  }
  return null;
}

async function resolveDoctorObjectId(session) {
  const cand = String(session?.user?._id ?? session?.user?.id ?? "");
  if (mongoose.Types.ObjectId.isValid(cand)) return String(cand);
  if (session?.user?.email) {
    const d = await Doctor.findOne({ email: session.user.email }).select("_id").lean().catch(() => null);
    if (d && d._id) return String(d._id);
  }
  return null;
}

export async function GET(request, { params }) {
  try {
    await connectDB();
    if (params && typeof params.then === "function") params = await params;
    const appointmentIdParam = params?.id;
    if (!appointmentIdParam) return NextResponse.json({ message: "Invalid appointment id" }, { status: 400 });

    const session = await getServerSession(authOptions);
    if (!session || !session.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const query = {};
    if (mongoose.Types.ObjectId.isValid(String(appointmentIdParam))) {
      query.$or = [
        { appointmentId: new mongoose.Types.ObjectId(String(appointmentIdParam)) },
        { appointmentId: String(appointmentIdParam) }
      ];
    } else {
      query.appointmentId = String(appointmentIdParam);
    }

    const pres = await Prescription.findOne(query)
      .populate("appointmentId", "preferredDate preferredTime symptoms")
      .populate("doctorId", "name department email phone image")
      .lean();

    if (!pres) return NextResponse.json({ message: "Not found" }, { status: 404 });

    if (session.user.role === "patient") {
      const patientObjId = await resolvePatientObjectId(session);
      if (!patientObjId) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      if (String(pres.patientId) !== String(patientObjId)) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      }
    } else if (session.user.role === "doctor") {
      const doctorObjId = await resolveDoctorObjectId(session);
      if (!doctorObjId) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      if (String(pres.doctorId?._id ?? pres.doctorId) !== String(doctorObjId)) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      }
    } else if (session.user.role === "admin") {
      // allow
    } else {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const result = {
      id: String(pres._id),
      appointmentId: pres.appointmentId ? String(pres.appointmentId._id ?? pres.appointmentId) : null,
      dateIssued: pres.dateIssued ?? null,
      appointment: pres.appointmentId ? {
        id: String(pres.appointmentId._id ?? pres.appointmentId),
        preferredDate: pres.appointmentId.preferredDate ?? null,
        preferredTime: pres.appointmentId.preferredTime ?? null,
        symptoms: pres.appointmentId.symptoms ?? ""
      } : null,
      doctor: pres.doctorId ? {
        id: String(pres.doctorId._id ?? pres.doctorId),
        name: pres.doctorId.name ?? "",
        department: pres.doctorId.department ?? pres.doctorId.specialization ?? "",
        email: pres.doctorId.email ?? "",
        phone: pres.doctorId.phone ?? "",
        image: pres.doctorId.image ?? null
      } : null,
      patientId: pres.patientId ? String(pres.patientId) : null,
      medicines: Array.isArray(pres.medicines) ? pres.medicines : [],
      notes: pres.notes ?? ""
    };

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.error("[api/prescription/appointment] error", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
