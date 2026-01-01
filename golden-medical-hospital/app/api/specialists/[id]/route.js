import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Specialist from "@/models/specialist";
import mongoose from "mongoose";

// GET: Fetch single specialist by ID
export async function GET(request, { params }) {
  try {
    await connectDB();

    if (params && typeof params.then === 'function') params = await params;
    const id = params?.id;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid specialist ID" }, { status: 400 });
    }

    const specialist = await Specialist.findById(id)
      .populate({
        path: 'doctorList',
        select: 'name department specialization email phone image experience',
        model: 'Doctor'
      })
      .lean();

    if (!specialist) {
      return NextResponse.json({ message: "Specialist not found" }, { status: 404 });
    }

    return NextResponse.json(specialist, { status: 200 });
  } catch (err) {
    console.error("[api/specialists/[id]] error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// PUT: Update a specialist
export async function PUT(request, { params }) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (params && typeof params.then === 'function') params = await params;
    const id = params?.id;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid specialist ID" }, { status: 400 });
    }

    // Parse request body
    const body = await request.json();
    const { title, description, contact, doctorList } = body;

    // Validate required fields
    if (!title?.trim() || !description?.trim() || !contact?.trim()) {
      return NextResponse.json(
        { message: "Title, description, and contact are required" },
        { status: 400 }
      );
    }

    // Check if specialist exists
    const existingSpecialist = await Specialist.findById(id);
    if (!existingSpecialist) {
      return NextResponse.json({ message: "Specialist not found" }, { status: 404 });
    }

    // Convert doctor IDs to ObjectId if provided
    const updatedDoctorList = Array.isArray(doctorList) 
      ? doctorList.map(id => new mongoose.Types.ObjectId(id))
      : existingSpecialist.doctorList;

    // Update the specialist
    const updatedSpecialist = await Specialist.findByIdAndUpdate(
      id,
      {
        title: title.trim(),
        description: description.trim(),
        contact: contact.trim(),
        doctorList: updatedDoctorList
      },
      { 
        new: true, // Return the updated document
        runValidators: true // Run schema validators
      }
    ).populate({
      path: 'doctorList',
      select: 'name department specialization email phone image experience',
      model: 'Doctor'
    });

    return NextResponse.json(
      { 
        message: "Specialist updated successfully",
        specialist: updatedSpecialist 
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[api/specialists/[id]] PUT error:", err);
    
    // Handle duplicate key error (if title must be unique)
    if (err.code === 11000) {
      return NextResponse.json(
        { message: "Specialist with this title already exists" },
        { status: 409 }
      );
    }
    
    // Handle validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(error => error.message);
      return NextResponse.json(
        { message: "Validation error", errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}

// DELETE: Delete a specialist
export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (params && typeof params.then === 'function') params = await params;
    const id = params?.id;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid specialist ID" }, { status: 400 });
    }

    await Specialist.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Specialist deleted successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("[api/specialists/[id]] DELETE error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}