import type { Metadata } from "next";
import { connectDB } from "@/lib/mongodb";
import { serializeProductFromLean } from "@/lib/serializeProduct";
import Product from "@/models/Product";
import type { IProduct } from "@/types/product";
import ShopClient from "./ShopClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Menu | Burgers, Sides & Combos",
  description:
    "Browse the McKlunky menu — bold British burgers, crispy sides & loaded combos. Order online for delivery across the UK.",
  keywords: [
    "McKlunky menu",
    "UK burgers online",
    "order sides UK",
    "food combos UK",
    "British comfort food",
    "burger delivery UK",
    "McKlunky deals",
    "takeaway menu UK",
  ],
  alternates: { canonical: "https://mcklunky.co.uk/shop" },
  openGraph: {
    title: "Menu | McKlunky",
    description:
      "Bold British burgers, sides & combos — order online for delivery across the UK.",
    url: "https://mcklunky.co.uk/shop",
  },
};

export default async function ShopPage() {
  await connectDB();
  const raw = await Product.find({ status: "publish" })
    .populate("category", "name slug")
    .populate("subCategory", "name slug")
    .sort({ order: 1, createdAt: -1 })
    .lean();
  const products: IProduct[] = (raw as Record<string, unknown>[]).map((p) => serializeProductFromLean(p));

  return <ShopClient products={products} />;
}
