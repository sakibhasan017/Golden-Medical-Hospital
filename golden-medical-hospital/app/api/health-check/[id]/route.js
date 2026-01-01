import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Healthcheck from "@/models/healthcheck";
import mongoose from "mongoose";

// GET: Fetch single healthcheck package by ID (public)
export async function GET(request, { params }) {
  try {
    await connectDB();

    if (params && typeof params.then === "function") {
      params = await params;
    }
    
    const id = params?.id;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid healthcheck package ID" },
        { status: 400 }
      );
    }

    const healthcheck = await Healthcheck.findById(id).lean();

    if (!healthcheck) {
      return NextResponse.json(
        { message: "Healthcheck package not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(healthcheck, { status: 200 });
  } catch (error) {
    console.error("[api/health-check/[id]] GET error:", error);
    return NextResponse.json(
      { message: "Failed to fetch healthcheck package" },
      { status: 500 }
    );
  }
}

// PUT: Update healthcheck package (admin only)
export async function PUT(request, { params }) {
  try {
    await connectDB();

    // Check admin authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (params && typeof params.then === "function") {
      params = await params;
    }
    
    const id = params?.id;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid healthcheck package ID" },
        { status: 400 }
      );
    }

    const { title, description, tests, price } = await request.json();

    // Check if healthcheck package exists
    const existingPackage = await Healthcheck.findById(id);
    if (!existingPackage) {
      return NextResponse.json(
        { message: "Healthcheck package not found" },
        { status: 404 }
      );
    }

    // Update healthcheck package
    const updatedPackage = await Healthcheck.findByIdAndUpdate(
      id,
      {
        title: title?.trim() || existingPackage.title,
        description: description?.trim() || existingPackage.description,
        tests: tests?.map(test => test.trim()) || existingPackage.tests,
        price: price || existingPackage.price
      },
      { new: true, runValidators: true }
    ).lean();

    return NextResponse.json(
      { 
        message: "Healthcheck package updated successfully",
        healthcheck: updatedPackage 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[api/health-check/[id]] PUT error:", error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { message: "Healthcheck package with this title already exists" },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { message: "Failed to update healthcheck package" },
      { status: 500 }
    );
  }
}

// DELETE: Delete healthcheck package (admin only)
export async function DELETE(request, { params }) {
  try {
    await connectDB();

    // Check admin authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (params && typeof params.then === "function") {
      params = await params;
    }
    
    const id = params?.id;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid healthcheck package ID" },
        { status: 400 }
      );
    }

    // Check if healthcheck package exists
    const existingPackage = await Healthcheck.findById(id);
    if (!existingPackage) {
      return NextResponse.json(
        { message: "Healthcheck package not found" },
        { status: 404 }
      );
    }

    // Delete healthcheck package
    await Healthcheck.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Healthcheck package deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[api/health-check/[id]] DELETE error:", error);
    return NextResponse.json(
      { message: "Failed to delete healthcheck package" },
      { status: 500 }
    );
  }
}