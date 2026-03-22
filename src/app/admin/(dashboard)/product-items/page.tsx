"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/lib/admin-auth";

type Lang = "ge" | "en" | "ru";
type LocaleField = { en: string; ge: string; ru: string };

interface ItemFile {
  id: number;
  url: string;
}

interface ProductItem {
  id: number;
  name: LocaleField;
  image: ItemFile | null;
  alcohol: number;
  temperature: string;
  productCategory?: { name: LocaleField };
}

export default function ProductItemsPage() {
  const router = useRouter();
  const { ready, authFetch } = useAdminAuth();
  const [items, setItems] = useState<ProductItem[]>([]);
  const [search, setSearch] = useState("");
  const [lang, setLang] = useState<Lang>("ge");
  const [loading, setLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await authFetch(`/api/product-items?name=${encodeURIComponent(search)}`);
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [authFetch, search]);

  useEffect(() => {
    if (ready) fetchItems();
  }, [ready, fetchItems]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("ნამდვილად გსურთ წაშლა?")) return;
    try {
      await authFetch(`/api/product-items/${id}`, { method: "DELETE" });
      fetchItems();
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
        >სასმელები</h1>
        <button
          onClick={() => router.push("/admin/product-items/create")}
          className="px-5 py-2.5 bg-[#C9A84C] hover:bg-[#d4b65e] text-[#0a0e17] rounded-lg text-sm font-medium transition-colors"
        >
          + დამატება
        </button>
      </div>

      {/* Search + Language */}
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="ძიება..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 bg-[#0f1420] border border-[#C9A84C]/20 rounded-lg text-white focus:outline-none focus:border-[#C9A84C]/50"
        />
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
                <th className="px-4 py-3 text-gray-300 text-sm font-medium">სურათი</th>
                <th className="px-4 py-3 text-gray-300 text-sm font-medium">სახელი</th>
                <th className="px-4 py-3 text-gray-300 text-sm font-medium">კატეგორია</th>
                <th className="px-4 py-3 text-gray-300 text-sm font-medium">ალკოჰოლი</th>
                <th className="px-4 py-3 text-gray-300 text-sm font-medium">ტემპერატურა</th>
                <th className="px-4 py-3 text-gray-300 text-sm font-medium text-right">მოქმედება</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-[#C9A84C]/5">
                  <td className="px-4 py-3">
                    {item.image?.url ? (
                      <img src={item.image.url} alt="" className="w-12 h-12 rounded object-cover" />
                    ) : (
                      <div className="w-12 h-12 bg-[#0f1420] rounded" />
                    )}
                  </td>
                  <td className="px-4 py-3 text-white">{item.name?.[lang] || "—"}</td>
                  <td className="px-4 py-3 text-gray-400">
                    {item.productCategory?.name?.[lang] || "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-400">{item.alcohol ?? "—"}%</td>
                  <td className="px-4 py-3 text-gray-400">{item.temperature || "—"}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => router.push(`/admin/product-items/edit/${item.id}`)}
                      className="px-3 py-1 border border-[#C9A84C]/30 text-[#C9A84C] hover:bg-[#C9A84C]/10 rounded text-xs mr-2 transition-colors"
                    >
                      რედაქტირება
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="px-3 py-1 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded text-xs transition-colors"
                    >
                      წაშლა
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    სასმელები არ მოიძებნა
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
