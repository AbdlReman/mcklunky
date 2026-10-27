import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";
import TaxonomyManager from "../_components/TaxonomyManager";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  await connectDB();
  const raw = await Category.find({}).sort({ order: 1, name: 1 }).lean();
  const categories = (raw as Record<string, unknown>[]).map((c) => ({
    _id: String(c._id),
    name: String(c.name || ""),
    slug: String(c.slug || ""),
    order: Number(c.order || 0),
  }));

  return <TaxonomyManager title="Categories" apiBase="/api/categories" initialItems={categories} />;
}
