import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Specialist from "@/models/specialist";
import Doctor from "@/models/doctor";
import mongoose from "mongoose";

// GET: Fetch all specialists
export async function GET() {
  try {
    await connectDB();

    const specialists = await Specialist.find()
      .populate({
        path: 'doctorList',
        select: 'name department specialization email phone image',
        model: 'Doctor'
      })
      .sort({ title: 1 })
      .lean();

    return NextResponse.json(specialists, { status: 200 });
  } catch (err) {
    console.error("[api/specialists] error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// POST: Create new specialist (for admin)
export async function POST(request) {
  try {
    await connectDB();

    const { title, description, doctorList, contact } = await request.json();
    
    const specialist = await Specialist.create({
      title,
      description,
      doctorList: doctorList.map(id => new mongoose.Types.ObjectId(id)),
      contact
    });

    return NextResponse.json(
      { message: "Specialist created successfully", specialist },
      { status: 201 }
    );
  } catch (err) {
    console.error("[api/specialists] error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}