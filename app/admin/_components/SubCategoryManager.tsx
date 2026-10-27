"use client";

import { useState } from "react";

type Cat = { _id: string; name: string };
type Item = {
  _id: string;
  name: string;
  category: string;
  categoryName?: string;
  order?: number;
};

export default function SubCategoryManager({
  categories,
  initialItems,
}: {
  categories: Cat[];
  initialItems: Item[];
}) {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?._id || "");
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<{ id: string; name: string; category: string } | null>(
    null
  );

  const refresh = async () => {
    const res = await fetch("/api/subcategories");
    const data = await res.json();
    setItems(data.subcategories || []);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !categoryId) return;
    setLoading(true);
    await fetch("/api/subcategories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), category: categoryId }),
    });
    setName("");
    await refresh();
    setLoading(false);
  };

  const handleSaveEdit = async () => {
    if (!editing) return;
    setLoading(true);
    await fetch(`/api/subcategories/${editing.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editing.name.trim(), category: editing.category }),
    });
    setEditing(null);
    await refresh();
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this subcategory?")) return;
    setLoading(true);
    await fetch(`/api/subcategories/${id}`, { method: "DELETE" });
    await refresh();
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tight text-white">Subcategories</h1>
        <p className="text-slate-400 text-sm mt-1">Nest menu groups under a parent category.</p>
      </div>

      <form
        onSubmit={handleCreate}
        className="bg-slate-800 border border-slate-700 rounded-xl p-5 flex flex-col sm:flex-row gap-3"
      >
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="bg-slate-900 border border-slate-600 text-slate-100 rounded-lg px-3 py-2.5 text-sm"
          required
        >
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Add new subcategory..."
          className="flex-1 bg-slate-900 border border-slate-600 text-slate-100 rounded-lg px-3 py-2.5 text-sm"
          required
        />
        <button
          disabled={loading || categories.length === 0}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg disabled:opacity-50"
        >
          Add
        </button>
      </form>

      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-700/60 text-slate-400 text-xs uppercase tracking-widest">
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Category</th>
              <th className="text-left px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {items.map((item) => (
              <tr key={item._id} className="hover:bg-slate-700/20">
                <td className="px-4 py-3">
                  {editing?.id === item._id ? (
                    <input
                      value={editing.name}
                      onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-600 rounded px-2 py-1.5 text-slate-100"
                    />
                  ) : (
                    <span className="text-slate-100 font-medium">{item.name}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-400">
                  {editing?.id === item._id ? (
                    <select
                      value={editing.category}
                      onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                      className="bg-slate-900 border border-slate-600 rounded px-2 py-1.5 text-slate-100"
                    >
                      {categories.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    item.categoryName || "—"
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-3">
                    {editing?.id === item._id ? (
                      <>
                        <button
                          type="button"
                          onClick={handleSaveEdit}
                          className="text-indigo-400 hover:text-indigo-300 text-xs font-semibold"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditing(null)}
                          className="text-slate-400 hover:text-slate-200 text-xs"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() =>
                            setEditing({
                              id: item._id,
                              name: item.name,
                              category: item.category,
                            })
                          }
                          className="text-slate-300 hover:text-white text-xs font-semibold"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item._id)}
                          className="text-red-400 hover:text-red-300 text-xs font-semibold"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-slate-500">
                  No subcategories yet. Create a category first, then add subs here.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
