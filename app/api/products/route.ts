import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { serializeProductFromLean, toProductImageDocs } from "@/lib/serializeProduct";
import { slugify } from "@/lib/slugify";
import Category from "@/models/Category";
import Product from "@/models/Product";

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

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const searchParams = req.nextUrl.searchParams;
    const categoryParam = searchParams.get("category");
    const subCategory = searchParams.get("subCategory");
    const search = searchParams.get("search");
    const tag = searchParams.get("tag");
    const onSale = searchParams.get("sale") === "true";
    const minPrice = Number(searchParams.get("minPrice") || 0);
    const maxPrice = Number(searchParams.get("maxPrice") || Number.MAX_SAFE_INTEGER);
    const sort = searchParams.get("sort") || "latest";

    const query: Record<string, unknown> = {
      status: "publish",
    };

    if (categoryParam) {
      const categoryId = await resolveCategoryId(categoryParam);
      if (categoryId) {
        query.category = categoryId;
      } else {
        // Fallback: no match → empty
        return NextResponse.json({ products: [] });
      }
    }
    if (subCategory && mongoose.Types.ObjectId.isValid(subCategory)) {
      query.subCategory = subCategory;
    }
    if (tag) query.tags = tag;
    if (onSale) query.onSale = true;
    if (search) query.name = { $regex: search, $options: "i" };
    query.price = { $gte: minPrice, $lte: maxPrice };

    let sortQuery: Record<string, 1 | -1> = { order: 1, createdAt: -1 };
    if (sort === "priceLow") sortQuery = { price: 1 };
    if (sort === "priceHigh") sortQuery = { price: -1 };
    if (sort === "latest") sortQuery = { createdAt: -1 };

    const products = await Product.find(query)
      .populate("category", "name slug")
      .populate("subCategory", "name slug")
      .sort(sortQuery)
      .lean();

    return NextResponse.json({
      products: (products as Record<string, unknown>[]).map((p) => serializeProductFromLean(p)),
    });
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const name = String(body.name || "").trim();
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const categoryId = await resolveCategoryId(body.categoryId || body.category);
    if (!categoryId) {
      return NextResponse.json({ error: "Valid category is required" }, { status: 400 });
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

    const product = new Product({
      wpId: body.wpId != null ? Number(body.wpId) : undefined,
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
    });
    await product.save();
    const lean = await Product.findById(product._id)
      .populate("category", "name slug")
      .populate("subCategory", "name slug")
      .lean();
    return NextResponse.json(
      { product: serializeProductFromLean(lean as Record<string, unknown>) },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("POST /api/products error:", error);
    const msg = error instanceof Error ? error.message : "Failed to create product";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    if (body?.action !== "publishAllDrafts") {
      return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
    }
    const result = await Product.updateMany(
      { status: "draft" },
      { $set: { status: "publish" } }
    );
    return NextResponse.json({ updatedCount: result.modifiedCount || 0 });
  } catch (error: unknown) {
    console.error("PATCH /api/products error:", error);
    const msg = error instanceof Error ? error.message : "Failed to publish draft products";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
