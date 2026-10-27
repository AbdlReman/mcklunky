import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { slugify } from "@/lib/slugify";
import SubCategory from "@/models/SubCategory";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const categoryId = req.nextUrl.searchParams.get("category");
    const query: Record<string, unknown> = {};
    if (categoryId) query.category = categoryId;

    const items = await SubCategory.find(query)
      .populate("category", "name slug")
      .sort({ order: 1, name: 1 })
      .lean();

    const serialized = items.map((c: Record<string, unknown>) => {
      const cat = c.category as { _id?: unknown; name?: string } | string | null;
      return {
        ...c,
        _id: String(c._id),
        category: typeof cat === "object" && cat?._id ? String(cat._id) : String(c.category || ""),
        categoryName: typeof cat === "object" ? String(cat?.name || "") : "",
        image: c.image || { url: "", publicId: "" },
        createdAt: String(c.createdAt),
        updatedAt: String(c.updatedAt),
      };
    });
    return NextResponse.json({ subcategories: serialized });
  } catch (error) {
    console.error("GET /api/subcategories error:", error);
    return NextResponse.json({ error: "Failed to fetch subcategories" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const name = String(body.name || "").trim();
    const category = String(body.category || "").trim();
    if (!name || !category) {
      return NextResponse.json({ error: "Name and category are required" }, { status: 400 });
    }
    const slug = slugify(String(body.slug || name));
    const item = await SubCategory.create({
      wpId: body.wpId != null ? Number(body.wpId) : undefined,
      name,
      slug,
      category,
      description: String(body.description || ""),
      image: {
        url: String(body.image?.url || body.imageUrl || ""),
        publicId: String(body.image?.publicId || ""),
      },
      order: Number(body.order || 0),
    });
    return NextResponse.json(
      { subcategory: { ...item.toObject(), _id: String(item._id) } },
      { status: 201 }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to create subcategory";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
