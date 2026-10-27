import type { IProduct, ProductImage } from "@/types/product";

function refName(value: unknown): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object" && value !== null && "name" in value) {
    return String((value as { name?: unknown }).name || "");
  }
  return "";
}

function refId(value: unknown): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object" && value !== null && "_id" in value) {
    return String((value as { _id: unknown })._id);
  }
  return String(value);
}

function normalizeImages(raw: unknown): ProductImage[] {
  if (!Array.isArray(raw)) return [];
  const out: ProductImage[] = [];
  for (const item of raw) {
    if (typeof item === "string") {
      const url = item.trim();
      if (url) out.push({ url, publicId: "", alt: "" });
      continue;
    }
    if (item && typeof item === "object") {
      const o = item as Record<string, unknown>;
      const url = String(o.url || "").trim();
      if (!url) continue;
      out.push({
        url,
        publicId: String(o.publicId || ""),
        alt: String(o.alt || ""),
        width: o.width != null ? Number(o.width) : undefined,
        height: o.height != null ? Number(o.height) : undefined,
      });
    }
  }
  return out;
}

function effectivePrice(p: Record<string, unknown>): {
  price: number;
  regularPrice: number;
  salePrice: number | null;
  onSale: boolean;
  discount: number;
} {
  const regular = Number(p.regularPrice ?? p.price ?? 0);
  const sale =
    p.salePrice != null && p.salePrice !== ""
      ? Number(p.salePrice)
      : null;
  const onSale =
    p.onSale === true ||
    (sale != null && sale > 0 && sale < regular) ||
    Number(p.discount || 0) > 0;

  // Legacy discount % support
  const legacyDiscount = Number(p.discount || 0);
  if (!onSale && legacyDiscount > 0 && regular > 0) {
    const saleFromDiscount = Math.round(regular * (1 - legacyDiscount / 100) * 100) / 100;
    return {
      price: saleFromDiscount,
      regularPrice: regular,
      salePrice: saleFromDiscount,
      onSale: true,
      discount: legacyDiscount,
    };
  }

  if (onSale && sale != null && sale > 0) {
    const discount =
      regular > 0 ? Math.round((1 - sale / regular) * 100) : 0;
    return {
      price: sale,
      regularPrice: regular || sale,
      salePrice: sale,
      onSale: true,
      discount,
    };
  }

  return {
    price: Number(p.price ?? regular ?? 0),
    regularPrice: regular || Number(p.price || 0),
    salePrice: null,
    onSale: false,
    discount: 0,
  };
}

function normalizeStatus(p: Record<string, unknown>): "publish" | "draft" {
  const s = String(p.status || "").toLowerCase();
  if (s === "publish" || s === "published") return "publish";
  if (s === "draft") return "draft";
  if (p.isActive === false) return "draft";
  return "publish";
}

/** Normalize a Mongo lean product document into `IProduct` (supports old + new schemas). */
export function serializeProductFromLean(p: Record<string, unknown>): IProduct {
  const imageObjects = normalizeImages(p.images);
  const imageUrls = imageObjects.map((img) => img.url);
  const pricing = effectivePrice(p);
  const status = normalizeStatus(p);
  const categoryName = refName(p.category) || String(p.category || "").trim();
  const categoryId = refId(p.category);
  const subName = refName(p.subCategory) || null;
  const subId = p.subCategory ? refId(p.subCategory) : null;
  const tags = Array.isArray(p.tags) ? (p.tags as unknown[]).map(String).filter(Boolean) : [];
  const isFeatured =
    p.isFeatured === true || tags.map((t) => t.toLowerCase()).includes("featured");

  const description = String(
    p.description ||
      p.shortDescription ||
      (typeof (p as { detail?: unknown }).detail === "string"
        ? (p as { detail: string }).detail
        : "") ||
      ""
  );

  return {
    _id: String(p._id),
    wpId: p.wpId != null ? Number(p.wpId) : null,
    name: String(p.name || ""),
    slug: String(p.slug || ""),
    description,
    shortDescription: String(p.shortDescription || ""),
    category: categoryName,
    categoryId,
    subCategory: subName,
    subCategoryId: subId,
    price: pricing.price,
    regularPrice: pricing.regularPrice,
    salePrice: pricing.salePrice,
    onSale: pricing.onSale,
    currency: String(p.currency || "GBP"),
    tags,
    images: imageUrls,
    imageObjects,
    inStock: p.inStock !== false,
    status,
    order: Number(p.order || 0),
    createdAt: String(p.createdAt || ""),
    updatedAt: String(p.updatedAt || ""),

    brand: String(p.brand || "McKlunky"),
    categories: categoryName ? [categoryName] : [],
    discount: pricing.discount,
    detail: String(p.detail || p.shortDescription || ""),
    sizes: Array.isArray(p.sizes) ? (p.sizes as string[]) : [],
    colors: ["Default"],
    colorVariants: [{ color: "Default", images: imageUrls }],
    stockQuantity: p.inStock === false ? 0 : Number(p.stockQuantity ?? 99),
    isActive: status === "publish",
    isFeatured,
    popularityScore: Number(p.popularityScore || 0),
    soldCount: Number(p.soldCount || 0),
    metaTitle: String(p.metaTitle || ""),
    metaDescription: String(p.metaDescription || p.shortDescription || ""),
  };
}

export function toProductImageDocs(urls: unknown): ProductImage[] {
  return normalizeImages(urls);
}
