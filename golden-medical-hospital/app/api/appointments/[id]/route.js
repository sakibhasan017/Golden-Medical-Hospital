
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Appointment from "@/models/appointment";
import mongoose from "mongoose";

export async function GET(request, { params }) {
  try {
    await connectDB();
    if (params && typeof params.then === "function") params = await params;
    const id = params?.id;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid appointment id" }, { status: 400 });
    }

    const appointment = await Appointment.findById(id).lean();
    if (!appointment) return NextResponse.json({ message: "Not found" }, { status: 404 });

    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    if (session.user.role !== "admin" && session.user.role !== "doctor") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    if (session.user.role === "doctor" && session.user.id !== appointment.doctorId.toString()) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ ...appointment, id: appointment._id.toString() }, { status: 200 });
  } catch (err) {
    console.error("GET /api/appointments/[id] error", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    await connectDB();
    if (params && typeof params.then === "function") params = await params;
    const id = params?.id;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid appointment id" }, { status: 400 });
    }

    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = await request.json();

    const allowedStatuses = ["Pending", "Confirmed", "Completed", "Cancelled"];
    if (body.status && !allowedStatuses.includes(body.status)) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 });
    }

    const appointment = await Appointment.findById(id);
    if (!appointment) return NextResponse.json({ message: "Not found" }, { status: 404 });

    if (session.user.role !== "admin" && session.user.role !== "doctor") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    if (session.user.role === "doctor" && session.user.id !== appointment.doctorId.toString()) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    if (body.status) appointment.status = body.status;
    if (body.additionalInfo !== undefined) appointment.additionalInfo = body.additionalInfo;
    

    await appointment.save();

    return NextResponse.json({ message: "Updated", appointment }, { status: 200 });
  } catch (err) {
    console.error("PATCH /api/appointments/[id] error", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
