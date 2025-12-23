
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Doctor from "@/models/doctor"; 

async function extractId(request, context) {
  let params = context?.params;
  if (params && typeof params.then === "function") {
    params = await params;
  }
  let id = params?.id;
  if (!id) {
    try {
      const url = new URL(request.url);
      const parts = url.pathname.split("/").filter(Boolean);
      id = parts[parts.length - 1];
    } catch (e) {
    }
  }
  return id;
}

export async function GET(request, context) {
  try {
    await connectDB();

    const id = await extractId(request, context);

    if (!id) {
      return Response.json({ message: "Doctor ID missing in route" }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json({ message: "Invalid doctor ID format" }, { status: 400 });
    }

    const doctor = await Doctor.findById(id).select("-password").lean();

    if (!doctor) {
      return Response.json({ message: "Doctor not found" }, { status: 404 });
    }

    return Response.json(doctor, { status: 200 });
  } catch (error) {
    console.error("GET /api/admin/doctors/[id] error:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request, context) {
  try {
    await connectDB();

    const id = await extractId(request, context);

    if (!id) {
      return Response.json({ message: "Doctor ID missing in route" }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json({ message: "Invalid doctor ID format" }, { status: 400 });
    }

  
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return Response.json({ message: "Invalid JSON body" }, { status: 400 });
    }

    const { status } = body || {};

    const ALLOWED = ["pending", "approved", "rejected"];
    if (!status || !ALLOWED.includes(status)) {
      return Response.json(
        { message: `Invalid status. Allowed: ${ALLOWED.join(", ")}` },
        { status: 400 }
      );
    }

    const updated = await Doctor.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    )
      .select("-password")
      .lean();

    if (!updated) {
      return Response.json({ message: "Doctor not found" }, { status: 404 });
    }

    return Response.json(updated, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/admin/doctors/[id] error:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
