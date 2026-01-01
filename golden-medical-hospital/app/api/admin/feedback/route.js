import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Feedback from "@/models/feedback";
import mongoose from "mongoose";

export async function GET(request) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get('doctorId');
    const search = searchParams.get('search');

    let matchStage = {};
    
    // Filter by doctor if provided
    if (doctorId && mongoose.Types.ObjectId.isValid(doctorId)) {
      matchStage.doctorId = new mongoose.Types.ObjectId(doctorId);
    }

    const feedbacks = await Feedback.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: 'doctors',
          localField: 'doctorId',
          foreignField: '_id',
          as: 'doctor'
        }
      },
      { $unwind: { path: '$doctor', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'patients',
          localField: 'patientId',
          foreignField: '_id',
          as: 'patient'
        }
      },
      { $unwind: { path: '$patient', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          doctorId: 1,
          patientId: 1,
          message: 1,
          createdAt: 1,
          'doctor._id': 1,
          'doctor.name': 1,
          'doctor.email': 1,
          'doctor.department': 1,
          'patient._id': 1,
          'patient.name': 1,
          'patient.email': 1
        }
      },
      { $sort: { createdAt: -1 } }
    ]);

    return NextResponse.json(feedbacks, { status: 200 });
  } catch (err) {
    console.error("[api/admin/feedback] error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}