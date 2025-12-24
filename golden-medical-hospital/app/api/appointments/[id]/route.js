import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Appointment from "@/models/appointment";
import mongoose from "mongoose";
import { sendConfirmMail } from "@/lib/mail";

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

    if (session.user.role === "doctor") {
      const docIdStr = appointment.doctorId?.toString?.() ?? null;
      const userId = session.user?.id ?? session.user?._id ?? null;
      const userEmail = session.user?.email ?? null;
      if (docIdStr && userId && docIdStr === String(userId)) {
        // ok
      } else {
        const pop = await Appointment.findById(id).populate("doctorId").lean();
        const doctorEmail = pop?.doctorId?.email ?? null;
        if (!doctorEmail || !userEmail || doctorEmail !== userEmail) {
          return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }
      }
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

    if (session.user.role === "doctor") {
      const docIdStr = appointment.doctorId?.toString?.() ?? null;
      const userId = session.user?.id ?? session.user?._id ?? null;
      const userEmail = session.user?.email ?? null;
      if (docIdStr && userId && docIdStr === String(userId)) {
        
      } else {
        await appointment.populate("doctorId");
        const doctorEmail = appointment.doctorId?.email ?? null;
        if (!doctorEmail || !userEmail || doctorEmail !== userEmail) {
          return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }
      }
    }

    const prevStatus = appointment.status;

    if (body.status) appointment.status = body.status;
    if (body.additionalInfo !== undefined) appointment.additionalInfo = body.additionalInfo;
    if (body.preferredDate !== undefined && body.preferredDate !== null && body.preferredDate !== "") {
      appointment.preferredDate = new Date(body.preferredDate);
    }
    if (body.preferredTime !== undefined) appointment.preferredTime = body.preferredTime;

    await appointment.save();
    //console.log(appointment.status, prevStatus);
    if (prevStatus !== "Confirmed" && appointment.status === "Confirmed") {
      try {
        await appointment.populate("doctorId");
        const doctor = appointment.doctorId;
        const doctorName = appointment.doctorName || doctor?.name || doctor?.fullName || "Doctor";
        await sendConfirmMail({
          to: appointment.email,
          patientName: appointment.name,
          doctorName,
          date: appointment.preferredDate,
          time: appointment.preferredTime,
        });
      } catch (mailErr) {
        console.error("Failed sending confirmation mail", mailErr);
      }
    }

    const apptObj = appointment.toObject();
    apptObj.id = appointment._id.toString();
    return NextResponse.json({ message: "Updated", appointment: apptObj }, { status: 200 });
  } catch (err) {
    console.error("PATCH /api/appointments/[id] error", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
