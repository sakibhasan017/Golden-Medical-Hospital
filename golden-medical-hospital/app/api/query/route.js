import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Query from "@/models/query";
import mongoose from "mongoose";

export async function POST(request) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { question } = await request.json();
    
    if (!question || question.trim().length === 0) {
      return NextResponse.json({ message: "Question is required" }, { status: 400 });
    }

    const query = await Query.create({
      question: question.trim(),
      createdAt: new Date()
    });

    return NextResponse.json(
      { 
        message: "Query sent successfully", 
        queryId: query._id 
      }, 
      { status: 201 }
    );
  } catch (err) {
    console.error("[api/query] error:", err);
    return NextResponse.json(
      { message: "Server error" }, 
      { status: 500 }
    );
  }
}