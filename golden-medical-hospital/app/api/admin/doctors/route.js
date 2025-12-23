import { connectDB } from "@/lib/db";
import Doctor from "@/models/doctor";

export async function GET() {
  try {
    await connectDB();

    const doctors = await Doctor.find({ status: "pending" })
      .select("name email status")
      .sort({ createdAt: -1 });

    return Response.json(doctors, { status: 200 });
  } catch (error) {
    console.error("ADMIN DOCTOR FETCH ERROR:", error);
    return Response.json(
      { message: "Failed to fetch doctor requests" },
      { status: 500 }
    );
  }
}

