"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "./ImageUploader";
import RichTextEditor from "./RichTextEditor";
import type { IProduct } from "@/types/product";

type CatOption = { _id: string; name: string };
type SubOption = { _id: string; name: string; category: string };

interface ProductFormProps {
  initialData?: IProduct;
  mode: "create" | "edit";
  categories: CatOption[];
  subcategories: SubOption[];
}

export default function ProductForm({
  initialData,
  mode,
  categories,
  subcategories,
}: ProductFormProps) {
  const router = useRouter();
  const fallbackCategoryId = categories[0]?._id || "";

  const [form, setForm] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    categoryId: initialData?.categoryId || fallbackCategoryId,
    subCategoryId: initialData?.subCategoryId || "",
    regularPrice: initialData?.regularPrice ?? initialData?.price ?? ("" as unknown as number),
    salePrice: (initialData?.salePrice ?? "") as number | "",
    onSale: initialData?.onSale ?? false,
    shortDescription: initialData?.shortDescription || initialData?.detail || "",
    description: initialData?.description || "",
    tagsInput: (initialData?.tags || []).join(", "),
    inStock: initialData?.inStock ?? true,
    publish: initialData ? initialData.status === "publish" : true,
    order: initialData?.order ?? 0,
  });
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const filteredSubs = useMemo(
    () => subcategories.filter((s) => s.category === form.categoryId),
    [subcategories, form.categoryId]
  );

  useEffect(() => {
    if (form.subCategoryId && !filteredSubs.some((s) => s._id === form.subCategoryId)) {
      setForm((f) => ({ ...f, subCategoryId: "" }));
    }
  }, [filteredSubs, form.subCategoryId]);

  const set = (key: keyof typeof form, value: unknown) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.categoryId) {
      setError("Please select a category.");
      return;
    }
    if (images.length === 0) {
      setError("Please add at least one image.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const url = mode === "create" ? "/api/products" : `/api/products/${initialData!._id}`;
      const method = mode === "create" ? "POST" : "PUT";
      const payload = {
        name: form.name,
        slug: form.slug,
        categoryId: form.categoryId,
        subCategoryId: form.subCategoryId || null,
        regularPrice: Number(form.regularPrice || 0),
        salePrice: form.salePrice === "" ? null : Number(form.salePrice),
        onSale: form.onSale,
        shortDescription: form.shortDescription,
        description: form.description,
        tags: form.tagsInput,
        imageUrls: images,
        images: images.map((url) => ({ url, alt: form.name })),
        inStock: form.inStock,
        status: form.publish ? "publish" : "draft",
        publish: form.publish,
        order: Number(form.order || 0),
        currency: "GBP",
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save product");

      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-slate-800 border border-slate-600 text-slate-100 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder-slate-500";
  const labelClass = "block text-slate-300 text-xs font-semibold uppercase tracking-widest mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-5">
          Basic information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className={labelClass}>Product name *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. McKlunky Classic Smash Burger"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Slug</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => set("slug", e.target.value)}
              placeholder="auto from name if empty"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Order</label>
            <input
              type="number"
              value={form.order}
              onChange={(e) => set("order", Number(e.target.value))}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Category *</label>
            <select
              required
              value={form.categoryId}
              onChange={(e) => set("categoryId", e.target.value)}
              className={inputClass}
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Subcategory</label>
            <select
              value={form.subCategoryId}
              onChange={(e) => set("subCategoryId", e.target.value)}
              className={inputClass}
              disabled={filteredSubs.length === 0}
            >
              <option value="">None</option>
              {filteredSubs.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Regular price (GBP) *</label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={form.regularPrice}
              onChange={(e) => set("regularPrice", parseFloat(e.target.value))}
              placeholder="9.00"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Sale price (GBP)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.salePrice}
              onChange={(e) =>
                set("salePrice", e.target.value === "" ? "" : parseFloat(e.target.value))
              }
              placeholder="7.50"
              className={inputClass}
            />
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>Tags (comma separated)</label>
            <input
              type="text"
              value={form.tagsInput}
              onChange={(e) => set("tagsInput", e.target.value)}
              placeholder="featured, spicy, vegan"
              className={inputClass}
            />
            <p className="mt-1 text-xs text-slate-500">Use tag &quot;featured&quot; to show on homepage.</p>
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>Short description</label>
            <textarea
              rows={3}
              value={form.shortDescription}
              onChange={(e) => set("shortDescription", e.target.value)}
              className={inputClass}
              placeholder="One-line menu blurb"
            />
          </div>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-5">
          Full description
        </h2>
        <RichTextEditor
          value={form.description}
          onChange={(html) => set("description", html)}
        />
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-5">
          Images *
        </h2>
        <ImageUploader initialUrls={images} onChange={setImages} />
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-5">
          Availability
        </h2>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm text-slate-200">
            <input
              type="checkbox"
              checked={form.onSale}
              onChange={(e) => set("onSale", e.target.checked)}
              className="accent-indigo-500"
            />
            On sale
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-200">
            <input
              type="checkbox"
              checked={form.inStock}
              onChange={(e) => set("inStock", e.target.checked)}
              className="accent-indigo-500"
            />
            In stock
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-200">
            <input
              type="checkbox"
              checked={form.publish}
              onChange={(e) => set("publish", e.target.checked)}
              className="accent-indigo-500"
            />
            Published
          </label>
        </div>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-700 bg-red-900/30 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-bold uppercase tracking-widest px-6 py-3 rounded-lg"
        >
          {loading ? "Saving…" : mode === "create" ? "Create product" : "Save changes"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="border border-slate-600 text-slate-300 text-sm font-semibold px-6 py-3 rounded-lg hover:bg-slate-800"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
