import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Query from "@/models/query";

// GET: Fetch only answered queries for public viewing
export async function GET() {
  try {
    await connectDB();

    // Fetch only queries that have an answer
    const queries = await Query.find({ 
      answer: { $exists: true, $ne: null, $ne: "" } 
    })
      .sort({ createdAt: -1 })
      .select('question answer createdAt')
      .lean();

    return NextResponse.json(queries, { status: 200 });
  } catch (err) {
    console.error("[api/queries/public] error:", err);
    return NextResponse.json(
      { message: "Server error" }, 
      { status: 500 }
    );
  }
}