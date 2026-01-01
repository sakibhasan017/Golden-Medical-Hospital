import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Healthcheck from "@/models/healthcheck";

// GET: Fetch all healthcheck packages (public)
export async function GET() {
  try {
    await connectDB();

    const healthchecks = await Healthcheck.find()
      .select("title description tests price")
      .sort({ title: 1 })
      .lean();

    return NextResponse.json(healthchecks, { status: 200 });
  } catch (error) {
    console.error("[api/health-check] GET error:", error);
    return NextResponse.json(
      { message: "Failed to fetch healthcheck packages" },
      { status: 500 }
    );
  }
}

// POST: Create new healthcheck package (admin only)
export async function POST(request) {
  try {
    await connectDB();

    // Check admin authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { title, description, tests, price } = await request.json();

    // Validate required fields
    if (!title?.trim() || !description?.trim() || !tests?.length || !price) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Create new healthcheck package
    const healthcheck = await Healthcheck.create({
      title: title.trim(),
      description: description.trim(),
      tests: tests.map(test => test.trim()),
      price: Number(price)
    });

    return NextResponse.json(
      { 
        message: "Healthcheck package created successfully",
        healthcheck 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[api/health-check] POST error:", error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { message: "Healthcheck package with this title already exists" },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { message: "Failed to create healthcheck package" },
      { status: 500 }
    );
  }
}