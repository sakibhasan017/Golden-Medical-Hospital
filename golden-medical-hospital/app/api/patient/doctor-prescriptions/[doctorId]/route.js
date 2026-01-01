import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Prescription from "@/models/prescription";
import Patient from "@/models/patient";
import Appointment from "@/models/appointment"; // Add this import
import mongoose from "mongoose";

export async function GET(request, { params }) {
  try {
    await connectDB();

    if (params && typeof params.then === "function") params = await params;
    const doctorIdParam = params?.doctorId;
    if (!doctorIdParam) return NextResponse.json([], { status: 200 });

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

    if (!patientObjectId) return NextResponse.json([], { status: 200 });

    // Just importing Appointment at the top might fix it, but if it doesn't,
    // you can also register it explicitly:
    if (!mongoose.models.Appointment) {
      // This ensures the Appointment model is registered
      // The import above should handle this, but this is a backup
      mongoose.model("Appointment", require("@/models/appointment").schema);
    }

    const prescriptions = await Prescription.find({ patientId: patientObjectId })
      .populate("appointmentId", "preferredDate preferredTime symptoms")
      .sort({ dateIssued: -1 })
      .lean();

    const filtered = (Array.isArray(prescriptions) ? prescriptions : []).filter(p => {
      const docId = p.doctorId ? String(p.doctorId) : null;
      return docId && String(docId) === String(doctorIdParam);
    });

    const mapped = filtered.map(p => ({
      id: String(p._id),
      dateIssued: p.dateIssued ?? null,
      appointment: p.appointmentId ? {
        id: String(p.appointmentId._id ?? p.appointmentId),
        preferredDate: p.appointmentId.preferredDate ?? null,
        preferredTime: p.appointmentId.preferredTime ?? null,
        symptoms: p.appointmentId.symptoms ?? ""
      } : null,
      medicines: Array.isArray(p.medicines) ? p.medicines : [],
      notes: p.notes ?? ""
    }));

    return NextResponse.json(mapped, { status: 200 });
  } catch (err) {
    console.error("[api/patient/doctor-prescriptions] error", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}