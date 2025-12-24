import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Prescription from "@/models/prescription";
import Appointment from "@/models/appointment";
import Doctor from "@/models/doctor";
import mongoose from "mongoose";

export async function POST(request) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "doctor") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { appointmentId, patientId, medicines, notes } = body || {};

    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      return NextResponse.json({ message: "Invalid appointmentId" }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      return NextResponse.json({ message: "Invalid patientId" }, { status: 400 });
    }

    if (!Array.isArray(medicines) || medicines.length === 0) {
      return NextResponse.json({ message: "Medicines required" }, { status: 400 });
    }

    const doctor = await Doctor.findOne({ email: session.user.email }).select("_id");
    if (!doctor) {
      return NextResponse.json({ message: "Doctor not found" }, { status: 403 });
    }

    const appt = await Appointment.findById(appointmentId);
    if (!appt) {
      return NextResponse.json({ message: "Appointment not found" }, { status: 404 });
    }

    if (String(appt.doctorId) !== String(doctor._id)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const existing = await Prescription.findOne({ appointmentId });
    if (existing) {
      return NextResponse.json({ message: "Already written" }, { status: 409 });
    }

    const prescription = await Prescription.create({
      appointmentId,
      patientId,
      doctorId: doctor._id,
      medicines,
      notes: notes ?? "",
    });

    return NextResponse.json(
      { message: "Created", id: prescription._id.toString() },
      { status: 201 }
    );
  } catch (err) {
    console.error("[api/prescriptions] POST error", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
