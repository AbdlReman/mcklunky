import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";

export async function GET() {
  try {
    await connectDB();
    const raw = await Category.find({}).sort({ order: 1, name: 1 }).select("name slug").lean();
    const categories = (raw as { name?: string }[])
      .map((c) => String(c.name || "").trim())
      .filter(Boolean);
    return NextResponse.json({ categories });
  } catch (error) {
    console.error("GET /api/navigation/collections error:", error);
    return NextResponse.json({ categories: [] }, { status: 200 });
  }
}
