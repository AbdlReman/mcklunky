import type { Metadata } from "next";
import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";
import SubCategory from "@/models/SubCategory";
import ProductForm from "../../_components/ProductForm";

export const metadata: Metadata = { title: "Add Product — Admin" };
export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  await connectDB();
  const [categoriesRaw, subsRaw] = await Promise.all([
    Category.find({}).sort({ order: 1, name: 1 }).lean(),
    SubCategory.find({}).sort({ order: 1, name: 1 }).lean(),
  ]);

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
          <span className="text-slate-400">Add New</span>
        </div>
        <h1 className="text-3xl font-black uppercase tracking-tight text-white">Add Product</h1>
        <p className="text-slate-400 text-sm mt-1">Add a menu item with category, pricing, and images.</p>
      </div>

      <ProductForm mode="create" categories={categories} subcategories={subcategories} />
    </div>
  );
}
