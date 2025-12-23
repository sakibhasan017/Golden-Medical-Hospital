
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Appointment from "@/models/appointment";
import Patient from "@/models/patient";
import Doctor from "@/models/doctor";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

function toObjectIdOrNull(val) {
  if (!val) return null;
  
  if (val instanceof mongoose.Types.ObjectId) return val;
  
  if (val && typeof val === "object" && val._id) {
    const s = String(val._id);
    return mongoose.isValidObjectId(s) ? new mongoose.Types.ObjectId(s) : null;
  }

  if (typeof val === "string" && mongoose.isValidObjectId(val)) {
    return new mongoose.Types.ObjectId(val);
  }
  return null;
}

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json().catch(() => ({}));

    const session = await getServerSession(authOptions);

    let patientId = null;
    if (session?.user?.email) {
      const p = await Patient.findOne({ email: session.user.email }).select("_id").lean();
      if (p) patientId = p._id;
    }

    if (!patientId && body.patientId) {
      patientId = body.patientId;
    }

    const pid = toObjectIdOrNull(patientId);
    if (!pid) {
      return NextResponse.json({ message: "Unable to determine valid patientId. Please login as a patient or provide a valid patientId." }, { status: 400 });
    }

    
    let doctorId = body.doctorId || body.doctor || null;
    
    if ((!doctorId || !mongoose.isValidObjectId(String(doctorId))) && body.doctorEmail) {
      const d = await Doctor.findOne({ email: body.doctorEmail }).select("_id").lean();
      if (d) doctorId = d._id;
    }

    const did = toObjectIdOrNull(doctorId);
    if (!did) {
      return NextResponse.json({ message: "Invalid or missing doctorId." }, { status: 400 });
    }

    const name = body.name || session?.user?.name || "";
    const email = body.email || session?.user?.email || "";
    const phone = body.phone || "";
    const preferredDate = body.preferredDate || body.requestedDate || body.date;
    const preferredTime = body.preferredTime || body.requestedTime || body.time;

    if (!preferredDate || !preferredTime) {
      return NextResponse.json({ message: "preferredDate and preferredTime are required." }, { status: 400 });
    }

    const appointmentData = {
      patientId: pid,
      doctorId: did,
      name,
      email,
      phone,
      preferredDate: new Date(preferredDate),
      preferredTime,
      symptoms: body.symptoms || "",
      additionalInfo: body.additionalInfo || body.message || "",
      status: body.status || "Pending",
    };

    const appointment = await Appointment.create(appointmentData);

    return NextResponse.json(appointment, { status: 201 });
  } catch (err) {
    console.error("POST /api/appointment error", err);

    if (err?.errors) {
      return NextResponse.json({ message: "Validation failed", errors: err.errors }, { status: 400 });
    }
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
