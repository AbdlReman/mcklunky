import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import { serializeProductFromLean } from "@/lib/serializeProduct";
import Product from "@/models/Product";
import type { IProduct } from "@/types/product";
import ProductDetailClient from "./ProductDetailClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  await connectDB();
  const raw = await Product.findOne({ slug, status: "publish" })
    .populate("category", "name slug")
    .lean();
  if (!raw) return {};

  const product = serializeProductFromLean(raw as Record<string, unknown>);
  const finalPrice = product.price;

  const title = product.metaTitle?.trim()
    ? product.metaTitle.trim()
    : `${product.name} | McKlunky Menu | UK Food`;

  const description = product.metaDescription?.trim()
    ? product.metaDescription.trim()
    : `Order ${product.name} from McKlunky for £${finalPrice.toFixed(2)}. Bold British food${product.onSale ? `, ${product.discount}% off` : ""}. Delivery across the UK.`;
  const image = product.images?.[0] || "/images/ham-and-bacon-burger-2983098.jpg";
  const url = `https://mcklunky.co.uk/shop/${slug}`;

  return {
    title,
    description,
    keywords: [
      `McKlunky ${product.name}`,
      `${product.name} UK`,
      "McKlunky menu",
      "UK food delivery",
      "British burgers",
      "order food online UK",
    ],
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: [{ url: image, width: 800, height: 800, alt: product.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  await connectDB();
  const raw = await Product.findOne({ slug, status: "publish" })
    .populate("category", "name slug")
    .populate("subCategory", "name slug")
    .lean();
  if (!raw) notFound();

  const product = serializeProductFromLean(raw as Record<string, unknown>);

  const baseFilter: Record<string, unknown> = {
    slug: { $ne: slug },
    status: "publish",
  };

  const categoryFilter: Record<string, unknown> = product.categoryId
    ? { ...baseFilter, category: product.categoryId }
    : baseFilter;

  let relatedLean = await Product.find(categoryFilter)
    .populate("category", "name slug")
    .sort({ order: 1, createdAt: -1 })
    .limit(8)
    .lean();

  if (relatedLean.length < 4 && product.categoryId) {
    relatedLean = await Product.find(baseFilter)
      .populate("category", "name slug")
      .sort({ order: 1, createdAt: -1 })
      .limit(8)
      .lean();
  }

  const seen = new Set<string>();
  const relatedProducts: IProduct[] = [];
  for (const doc of relatedLean) {
    const rp = serializeProductFromLean(doc as Record<string, unknown>);
    if (seen.has(rp._id)) continue;
    seen.add(rp._id);
    relatedProducts.push(rp);
    if (relatedProducts.length >= 4) break;
  }

  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "";
  const proto = h.get("x-forwarded-proto") ?? "https";
  const siteUrl = host ? `${proto}://${host}` : "";

  return <ProductDetailClient product={product} relatedProducts={relatedProducts} siteUrl={siteUrl} />;
}
