import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Query from "@/models/query";
import mongoose from "mongoose";

// PUT: Update query with answer
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
      return NextResponse.json({ message: "Valid query ID required" }, { status: 400 });
    }

    const { answer } = await request.json();
    
    if (!answer || answer.trim().length === 0) {
      return NextResponse.json({ message: "Answer is required" }, { status: 400 });
    }

    const query = await Query.findByIdAndUpdate(
      id,
      {
        answer: answer.trim()
      },
      { new: true }
    ).lean();

    if (!query) {
      return NextResponse.json({ message: "Query not found" }, { status: 404 });
    }

    return NextResponse.json(query, { status: 200 });
  } catch (err) {
    console.error("[api/admin/queries/[id]] error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// DELETE: Delete a query
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
      return NextResponse.json({ message: "Valid query ID required" }, { status: 400 });
    }

    const query = await Query.findByIdAndDelete(id).lean();

    if (!query) {
      return NextResponse.json({ message: "Query not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      message: "Query deleted successfully",
      deletedId: id
    }, { status: 200 });
  } catch (err) {
    console.error("[api/admin/queries/[id]] DELETE error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}