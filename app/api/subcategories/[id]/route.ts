import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { slugify } from "@/lib/slugify";
import SubCategory from "@/models/SubCategory";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();
    const name = String(body.name || "").trim();
    const payload: Record<string, unknown> = {
      name,
      description: String(body.description || ""),
      order: Number(body.order || 0),
      image: {
        url: String(body.image?.url || body.imageUrl || ""),
        publicId: String(body.image?.publicId || ""),
      },
    };
    if (body.category) payload.category = String(body.category);
    if (body.slug || name) payload.slug = slugify(String(body.slug || name));
    if (body.wpId != null) payload.wpId = Number(body.wpId);

    const item = await SubCategory.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    }).lean();
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const c = item as Record<string, unknown>;
    return NextResponse.json({ subcategory: { ...c, _id: String(c._id) } });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to update subcategory";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const { id } = await params;
    await SubCategory.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/subcategories/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete subcategory" }, { status: 500 });
  }
}
