import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Appointment from "@/models/appointment";

export async function GET(request, { params }) {
  try {
    await connectDB();
    if (params && typeof params.then === "function") params = await params;
    const id = params?.id;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json([], { status: 200 });
    }

    const history = await Appointment.find({
      patientId: id,
      status: "Confirmed"
    })
      .select("preferredDate preferredTime doctorId symptoms")
      .sort({ preferredDate: -1 })
      .lean();

    const mapped = (Array.isArray(history) ? history : []).map(h => ({
      id: h._id?.toString?.() ?? null,
      preferredDate: h.preferredDate ?? null,
      preferredTime: h.preferredTime ?? "",
      doctorId: h.doctorId?.toString?.() ?? null,
      symptoms: h.symptoms ?? ""
    }));

    return NextResponse.json(mapped, { status: 200 });
  } catch (err) {
    console.error("[api/patient/history/[id]]", err);
    return NextResponse.json([], { status: 500 });
  }
}
