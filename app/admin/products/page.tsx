import type { Metadata } from "next";
import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { serializeProductFromLean } from "@/lib/serializeProduct";
import ProductTable from "../_components/ProductTable";
import type { IProduct } from "@/types/product";

export const metadata: Metadata = { title: "Products — Admin" };
export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  await connectDB();
  const raw = await Product.find({})
    .populate("category", "name slug")
    .populate("subCategory", "name slug")
    .sort({ order: 1, createdAt: -1 })
    .lean();

  const products: IProduct[] = (raw as Record<string, unknown>[]).map((p) =>
    serializeProductFromLean(p)
  );

  const inStockCount = products.filter((p) => p.inStock).length;

  return (
    <div>
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white">Products</h1>
          <p className="text-slate-400 text-sm mt-1">
            {products.length} total · {inStockCount} in stock
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-widest px-5 py-3 rounded-lg"
        >
          Add product
        </Link>
      </div>

      <ProductTable products={products} />
    </div>
  );
}
