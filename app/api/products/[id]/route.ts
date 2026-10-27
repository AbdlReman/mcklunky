import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { serializeProductFromLean, toProductImageDocs } from "@/lib/serializeProduct";
import { slugify } from "@/lib/slugify";
import Category from "@/models/Category";
import Product from "@/models/Product";

type Params = { params: Promise<{ id: string }> };

async function resolveCategoryId(input: unknown): Promise<string | null> {
  const raw = String(input || "").trim();
  if (!raw) return null;
  if (mongoose.Types.ObjectId.isValid(raw) && String(new mongoose.Types.ObjectId(raw)) === raw) {
    return raw;
  }
  const bySlug = await Category.findOne({
    $or: [{ slug: slugify(raw) }, { name: raw }],
  }).lean();
  return bySlug ? String((bySlug as { _id: unknown })._id) : null;
}

function parseTags(input: unknown): string[] {
  if (Array.isArray(input)) return input.map(String).map((t) => t.trim()).filter(Boolean);
  if (typeof input === "string") {
    return input
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }
  return [];
}

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const { id } = await params;
    const product = await Product.findById(id)
      .populate("category", "name slug")
      .populate("subCategory", "name slug")
      .lean();
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({
      product: serializeProductFromLean(product as Record<string, unknown>),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();
    const name = String(body.name || "").trim();
    const categoryId = await resolveCategoryId(body.categoryId || body.category);
    if (!name || !categoryId) {
      return NextResponse.json({ error: "Name and category are required" }, { status: 400 });
    }

    const regularPrice = Number(body.regularPrice ?? body.price ?? 0);
    const salePrice =
      body.salePrice != null && body.salePrice !== ""
        ? Number(body.salePrice)
        : null;
    const onSale = body.onSale === true || (salePrice != null && salePrice > 0 && salePrice < regularPrice);
    const status =
      body.status === "draft" || body.publish === false || body.status === "Draft"
        ? "draft"
        : "publish";

    const images = toProductImageDocs(
      Array.isArray(body.images) && body.images.length > 0
        ? body.images
        : Array.isArray(body.imageUrls)
        ? body.imageUrls
        : []
    );

    const payload = {
      name,
      slug: slugify(String(body.slug || name)),
      description: String(body.description || ""),
      shortDescription: String(body.shortDescription || body.detail || ""),
      category: categoryId,
      subCategory: body.subCategoryId || body.subCategory || null,
      price: onSale && salePrice != null ? salePrice : regularPrice,
      regularPrice,
      salePrice: onSale ? salePrice : null,
      onSale,
      currency: String(body.currency || "GBP"),
      tags: parseTags(body.tags),
      images,
      inStock: body.inStock !== false,
      status,
      order: Number(body.order || 0),
    };

    const product = await Product.findByIdAndUpdate(id, { $set: payload }, {
      new: true,
      runValidators: true,
    })
      .populate("category", "name slug")
      .populate("subCategory", "name slug")
      .lean();

    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({
      product: serializeProductFromLean(product as Record<string, unknown>),
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to update product";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const { id } = await params;
    await Product.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
