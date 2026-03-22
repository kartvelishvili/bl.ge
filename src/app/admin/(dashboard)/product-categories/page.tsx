"use client";

import { useEffect, useState, useCallback } from "react";
import { useAdminAuth } from "@/lib/admin-auth";

type Lang = "ge" | "en" | "ru";
type LocaleField = { en: string; ge: string; ru: string };

interface Product {
  id: number;
  name: LocaleField;
}

interface ProductCategory {
  id: number;
  name: LocaleField;
  productId: number;
  product?: Product;
}

const emptyLocale = (): LocaleField => ({ en: "", ge: "", ru: "" });

export default function ProductCategoriesPage() {
  const { ready, authFetch } = useAdminAuth();
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [filterProductId, setFilterProductId] = useState("");
  const [lang, setLang] = useState<Lang>("ge");
  const [loading, setLoading] = useState(true);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState<LocaleField>(emptyLocale());
  const [productId, setProductId] = useState<number | string>("");
  const [tabLang, setTabLang] = useState<Lang>("ge");
  const [saving, setSaving] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await authFetch("/api/products");
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      /* ignore */
    }
  }, [authFetch]);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("name", search);
      if (filterProductId) params.set("productId", filterProductId);
      const res = await authFetch(`/api/product-category?${params.toString()}`);
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [authFetch, search, filterProductId]);

  useEffect(() => {
    if (ready) {
      fetchProducts();
      fetchCategories();
    }
  }, [ready, fetchProducts, fetchCategories]);

  const openCreate = () => {
    setEditingId(null);
    setName(emptyLocale());
    setProductId("");
    setTabLang("ge");
    setModalOpen(true);
  };

  const openEdit = (c: ProductCategory) => {
    setEditingId(c.id);
    setName({ ...c.name });
    setProductId(c.productId);
    setTabLang("ge");
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { name, productId: Number(productId) };
      if (editingId) {
        await authFetch(`/api/product-category/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await authFetch("/api/product-category", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      setModalOpen(false);
      fetchCategories();
    } catch {
      alert("შეცდომა შენახვისას");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("ნამდვილად გსურთ წაშლა?")) return;
    try {
      await authFetch(`/api/product-category/${id}`, { method: "DELETE" });
      fetchCategories();
    } catch {
      alert("წაშლის შეცდომა");
    }
  };

  if (!ready) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1
          className="text-2xl text-[#C9A84C]"
          style={{ fontFamily: '"BPG WEB 002 Caps", sans-serif' }}
        >სასმელების კატეგორია</h1>
        <button
          onClick={openCreate}
          className="px-5 py-2.5 bg-[#C9A84C] hover:bg-[#d4b65e] text-[#0a0e17] rounded-lg text-sm font-medium transition-colors"
        >
          + დამატება
        </button>
      </div>

      {/* Search + Filter + Language */}
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="ძიება..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 bg-[#0f1420] border border-[#C9A84C]/20 rounded-lg text-white focus:outline-none focus:border-[#C9A84C]/50"
        />
        <select
          value={filterProductId}
          onChange={(e) => setFilterProductId(e.target.value)}
          className="px-3 py-2 bg-[#0f1420] border border-[#C9A84C]/20 rounded-lg text-white text-sm focus:outline-none focus:border-[#C9A84C]/50"
        >
          <option value="">ყველა პროდუქცია</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name?.[lang] || p.name?.ge}
            </option>
          ))}
        </select>
        <div className="flex gap-1">
          {(["ge", "en", "ru"] as Lang[]).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-3 py-2 rounded text-sm font-medium ${
                lang === l ? "bg-[#C9A84C] text-[#0a0e17]" : "bg-[#0f1420] text-gray-400 border border-[#C9A84C]/20 hover:bg-[#C9A84C]/10"
              }`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-gray-400">იტვირთება...</p>
      ) : (
        <div className="bg-[#0f1420] rounded-lg overflow-hidden border border-[#C9A84C]/10">
          <table className="w-full text-left">
            <thead className="bg-[#0f1420]">
              <tr>
                <th className="px-4 py-3 text-gray-300 text-sm font-medium">სახელი</th>
                <th className="px-4 py-3 text-gray-300 text-sm font-medium">პროდუქცია</th>
                <th className="px-4 py-3 text-gray-300 text-sm font-medium text-right">მოქმედება</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {categories.map((c) => (
                <tr key={c.id} className="hover:bg-[#C9A84C]/5">
                  <td className="px-4 py-3 text-white">{c.name?.[lang] || "—"}</td>
                  <td className="px-4 py-3 text-gray-400">
                    {c.product?.name?.[lang] || c.productId}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => openEdit(c)}
                      className="px-3 py-1 border border-[#C9A84C]/30 text-[#C9A84C] hover:bg-[#C9A84C]/10 rounded text-xs mr-2 transition-colors"
                    >
                      რედაქტირება
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="px-3 py-1 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded text-xs transition-colors"
                    >
                      წაშლა
                    </button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                    კატეგორიები არ მოიძებნა
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f1420] rounded-lg border border-[#C9A84C]/20 w-full max-w-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">
              {editingId ? "რედაქტირება" : "ახალი კატეგორია"}
            </h2>

            <div className="flex gap-1 mb-4">
              {(["ge", "en", "ru"] as Lang[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setTabLang(l)}
                  className={`px-3 py-1.5 rounded text-sm font-medium ${
                    tabLang === l ? "bg-[#C9A84C] text-[#0a0e17]" : "bg-[#0f1420] text-gray-400 border border-[#C9A84C]/20"
                  }`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="mb-3">
              <label className="block text-gray-300 text-sm mb-1">სახელი ({tabLang})</label>
              <input
                type="text"
                value={name[tabLang]}
                onChange={(e) => setName({ ...name, [tabLang]: e.target.value })}
                className="w-full px-3 py-2 bg-[#0f1420] border border-[#C9A84C]/20 rounded-lg text-white text-sm focus:outline-none focus:border-[#C9A84C]/50"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-300 text-sm mb-1">პროდუქცია</label>
              <select
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="w-full px-3 py-2 bg-[#0f1420] border border-[#C9A84C]/20 rounded-lg text-white text-sm focus:outline-none focus:border-[#C9A84C]/50"
              >
                <option value="">აირჩიეთ...</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name?.ge || p.name?.en}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 border border-[#C9A84C]/30 text-[#C9A84C] hover:bg-[#C9A84C]/10 rounded-lg text-sm transition-colors"
              >
                გაუქმება
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-[#C9A84C] hover:bg-[#d4b65e] text-[#0a0e17] rounded-lg text-sm font-medium disabled:opacity-50 transition-colors"
              >
                {saving ? "ინახება..." : "შენახვა"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
