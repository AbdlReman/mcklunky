import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";
import SubCategory from "@/models/SubCategory";
import SubCategoryManager from "../_components/SubCategoryManager";

export const dynamic = "force-dynamic";

export default async function AdminSubCategoriesPage() {
  await connectDB();
  const [catsRaw, subsRaw] = await Promise.all([
    Category.find({}).sort({ order: 1, name: 1 }).lean(),
    SubCategory.find({}).populate("category", "name").sort({ order: 1, name: 1 }).lean(),
  ]);

  const categories = (catsRaw as Record<string, unknown>[]).map((c) => ({
    _id: String(c._id),
    name: String(c.name || ""),
  }));

  const subcategories = (subsRaw as Record<string, unknown>[]).map((s) => {
    const cat = s.category as { _id?: unknown; name?: string } | string | null;
    return {
      _id: String(s._id),
      name: String(s.name || ""),
      category: typeof cat === "object" && cat?._id ? String(cat._id) : String(s.category || ""),
      categoryName: typeof cat === "object" ? String(cat?.name || "") : "",
      order: Number(s.order || 0),
    };
  });

  return <SubCategoryManager categories={categories} initialItems={subcategories} />;
}
