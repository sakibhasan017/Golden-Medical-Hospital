import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Feedback from "@/models/feedback";
import Patient from "@/models/patient";
import mongoose from "mongoose";

export async function POST(request) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'patient') {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Get patient ID from session
    let patientId = session.user._id || session.user.id;
    
    // If not a valid ObjectId, try to find by email
    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      const patient = await Patient.findOne({ email: session.user.email }).select("_id").lean();
      if (!patient) {
        return NextResponse.json({ message: "Patient not found" }, { status: 400 });
      }
      patientId = patient._id;
    }

    const { doctorId, message } = await request.json();
    
    // Validation
    if (!doctorId || !mongoose.Types.ObjectId.isValid(doctorId)) {
      return NextResponse.json({ message: "Valid doctor ID required" }, { status: 400 });
    }
    
    if (!message || message.trim().length === 0) {
      return NextResponse.json({ message: "Feedback message required" }, { status: 400 });
    }

    const doctorObjId = new mongoose.Types.ObjectId(doctorId);
    const patientObjId = new mongoose.Types.ObjectId(patientId);
    
    // Check if patient already gave feedback to this doctor today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const existingFeedback = await Feedback.findOne({
      doctorId: doctorObjId,
      patientId: patientObjId,
      createdAt: { $gte: today }
    });

    if (existingFeedback) {
      return NextResponse.json(
        { message: "You have already submitted feedback for this doctor today" }, 
        { status: 400 }
      );
    }

    // Create feedback (using your exact model)
    const feedback = await Feedback.create({
      doctorId: doctorObjId,
      patientId: patientObjId,
      message: message.trim(),
      createdAt: new Date()
    });

    return NextResponse.json(
      { 
        message: "Feedback submitted successfully", 
        feedbackId: feedback._id 
      }, 
      { status: 201 }
    );
  } catch (err) {
    console.error("[api/feedback] error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}