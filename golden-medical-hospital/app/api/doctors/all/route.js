import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Doctor from "@/models/doctor";

// GET: Fetch ALL doctors (not just pending)
export async function GET() {
  try {
    // Check if user is admin
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Fetch ALL doctors regardless of status
    const doctors = await Doctor.find({})
      .select("name email department specialization status phone image")
      .sort({ name: 1 })
      .lean();

    return NextResponse.json(doctors, { status: 200 });
  } catch (error) {
    console.error("ALL DOCTORS FETCH ERROR:", error);
    return NextResponse.json(
      { message: "Failed to fetch doctors" },
      { status: 500 }
    );
  }
}