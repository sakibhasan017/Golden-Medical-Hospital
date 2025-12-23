
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Doctor from "@/models/doctor";
import Appointment from "@/models/appointment";

export async function GET() {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    const doc = await Doctor.findOne({ email: session.user.email }).select("_id").lean();
    if (!doc) {
      return NextResponse.json({ message: "Doctor not found" }, { status: 404 });
    }

    const appointments = await Appointment.find({ doctorId: doc._id })
      .sort({ preferredDate: 1 })
      .populate("patientId", "name email")
      .lean();

    const out = appointments.map((a) => ({
      id: a._id.toString(),
      patient: a.patientId ? { id: a.patientId._id?.toString?.(), name: a.patientId.name, email: a.patientId.email } : null,
      name: a.name,
      email: a.email,
      phone: a.phone,
      preferredDate: a.preferredDate ? a.preferredDate.toISOString().split("T")[0] : null,
      preferredTime: a.preferredTime,
      symptoms: a.symptoms,
      additionalInfo: a.additionalInfo,
      status: a.status,
    }));

    return NextResponse.json(out, { status: 200 });
  } catch (err) {
    console.error("GET /api/appointments/doctor/me error", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
