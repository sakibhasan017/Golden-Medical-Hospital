import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Query from "@/models/query";

// GET: Fetch all queries
export async function GET(request) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const queries = await Query.find()
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(queries, { status: 200 });
  } catch (err) {
    console.error("[api/admin/queries] error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}