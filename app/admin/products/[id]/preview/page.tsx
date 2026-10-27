import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { serializeProductFromLean } from "@/lib/serializeProduct";
import ProductDetailClient from "@/app/(public)/shop/[slug]/ProductDetailClient";

export const metadata: Metadata = { title: "Product Preview — Admin" };
export const dynamic = "force-dynamic";

export default async function AdminProductPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await connectDB();

  const raw = await Product.findById(id)
    .populate("category", "name slug")
    .populate("subCategory", "name slug")
    .lean();
  if (!raw) notFound();

  const product = serializeProductFromLean(raw as Record<string, unknown>);
  return <ProductDetailClient product={product} />;
}
