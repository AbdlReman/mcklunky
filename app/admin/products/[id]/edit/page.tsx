import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import SubCategory from "@/models/SubCategory";
import { serializeProductFromLean } from "@/lib/serializeProduct";
import ProductForm from "../../../_components/ProductForm";

export const metadata: Metadata = { title: "Edit Product — Admin" };
export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  await connectDB();
  const [raw, categoriesRaw, subsRaw] = await Promise.all([
    Product.findById(id).populate("category", "name slug").populate("subCategory", "name slug").lean(),
    Category.find({}).sort({ order: 1, name: 1 }).lean(),
    SubCategory.find({}).sort({ order: 1, name: 1 }).lean(),
  ]);
  if (!raw) notFound();

  const product = serializeProductFromLean(raw as Record<string, unknown>);
  const categories = (categoriesRaw as Record<string, unknown>[]).map((c) => ({
    _id: String(c._id),
    name: String(c.name || ""),
  }));
  const subcategories = (subsRaw as Record<string, unknown>[]).map((s) => ({
    _id: String(s._id),
    name: String(s.name || ""),
    category: String(s.category || ""),
  }));

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-2 text-slate-500 text-xs uppercase tracking-widest mb-3">
          <Link href="/admin/products" className="hover:text-slate-300 transition-colors">
            Products
          </Link>
          <span>/</span>
          <span className="text-slate-400 truncate max-w-[200px]">{product.name}</span>
          <span>/</span>
          <span className="text-slate-400">Edit</span>
        </div>
        <h1 className="text-3xl font-black uppercase tracking-tight text-white">Edit Product</h1>
        <p className="text-slate-400 text-sm mt-1 truncate">{product.name}</p>
      </div>

      <ProductForm
        mode="edit"
        initialData={product}
        categories={categories}
        subcategories={subcategories}
      />
    </div>
  );
}
