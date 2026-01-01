import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Prescription from "@/models/prescription";
import Doctor from "@/models/doctor";
import Patient from "@/models/patient";
import mongoose from "mongoose";

async function resolvePatientObjectId(session) {
  const candidate = String(session.user?._id ?? session.user?.id ?? "");
  if (mongoose.Types.ObjectId.isValid(candidate)) return candidate;
  if (session.user?.email) {
    const p = await Patient.findOne({ email: session.user.email }).select("_id").lean().catch(() => null);
    if (p && p._id) return String(p._id);
  }
  return null;
}

export async function GET() {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "patient") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const patientId = await resolvePatientObjectId(session);
    if (!patientId || !mongoose.Types.ObjectId.isValid(String(patientId))) {
      return NextResponse.json([], { status: 200 });
    }

    const patientObjId = new mongoose.Types.ObjectId(String(patientId));

    const agg = await Prescription.aggregate([
      { $match: { patientId: patientObjId } },
      { $group: { _id: "$doctorId", count: { $sum: 1 }, lastService: { $max: "$dateIssued" } } },
      {
        $lookup: {
          from: "doctors",
          localField: "_id",
          foreignField: "_id",
          as: "doctor"
        }
      },
      { $unwind: { path: "$doctor", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          doctorId: { $toString: "$_id" },
          count: 1,
          lastService: 1,
          "doctor.name": 1,
          "doctor.email": 1,
          "doctor.phone": 1,
          "doctor.department": 1,
          "doctor.specialization": 1,
          "doctor.image": 1
        }
      },
      { $sort: { lastService: -1 } }
    ]).exec();

    const mapped = (Array.isArray(agg) ? agg : []).map(r => ({
      doctorId: r.doctorId,
      name: r.doctor?.name ?? "Unknown Doctor",
      email: r.doctor?.email ?? "",
      phone: r.doctor?.phone ?? "",
      department: r.doctor?.department ?? r.doctor?.specialization ?? "",
      image: r.doctor?.image ?? null,
      prescriptionCount: r.count ?? 0,
      lastService: r.lastService ?? null
    }));

    return NextResponse.json(mapped, { status: 200 });
  } catch (err) {
    console.error("[api/patient/doctors] error", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
