"use client";

import { useEffect, useState, useCallback } from "react";
import { useAdminAuth } from "@/lib/admin-auth";

interface CompanyFile {
  id: number;
  url: string;
}

interface Company {
  id: number;
  name: string;
  file: CompanyFile | null;
  secondaryFile: CompanyFile | null;
  activeFile: CompanyFile | null;
}

export default function CompaniesPage() {
  const { ready, authFetch } = useAdminAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [fileId, setFileId] = useState<number | null>(null);
  const [filePreview, setFilePreview] = useState("");
  const [secondaryFileId, setSecondaryFileId] = useState<number | null>(null);
  const [secondaryPreview, setSecondaryPreview] = useState("");
  const [activeFileId, setActiveFileId] = useState<number | null>(null);
  const [activePreview, setActivePreview] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    try {
      const res = await authFetch(`/api/companies?name=${encodeURIComponent(search)}`);
      const data = await res.json();
      setCompanies(Array.isArray(data) ? data : []);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [authFetch, search]);

  useEffect(() => {
    if (ready) fetchCompanies();
  }, [ready, fetchCompanies]);

  const uploadFile = async (file: File): Promise<{ id: number; url: string }[]> => {
    const fd = new FormData();
    fd.append("files", file);
    const res = await authFetch("/api/storage/upload-image", { method: "POST", body: fd });
    return res.json();
  };

  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setId: (id: number | null) => void,
    setPreview: (url: string) => void,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const uploaded = await uploadFile(file);
    if (uploaded.length > 0) {
      setId(uploaded[0].id);
      setPreview(uploaded[0].url);
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setName("");
    setFileId(null);
    setFilePreview("");
    setSecondaryFileId(null);
    setSecondaryPreview("");
    setActiveFileId(null);
    setActivePreview("");
    setModalOpen(true);
  };

  const openEdit = (c: Company) => {
    setEditingId(c.id);
    setName(c.name);
    setFileId(c.file?.id ?? null);
    setFilePreview(c.file?.url || "");
    setSecondaryFileId(c.secondaryFile?.id ?? null);
    setSecondaryPreview(c.secondaryFile?.url || "");
    setActiveFileId(c.activeFile?.id ?? null);
    setActivePreview(c.activeFile?.url || "");
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload: Record<string, unknown> = { name, fileId, secondaryFileId, activeFileId };
      if (editingId) {
        await authFetch(`/api/companies/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await authFetch("/api/companies", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      setModalOpen(false);
      fetchCompanies();
    } catch {
      alert("შეცდომა შენახვისას");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("ნამდვილად გსურთ წაშლა?")) return;
    try {
      await authFetch(`/api/companies/${id}`, { method: "DELETE" });
      fetchCompanies();
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
        >სავაჭრო ნიშნები</h1>
        <button
          onClick={openCreate}
          className="px-5 py-2.5 bg-[#C9A84C] hover:bg-[#d4b65e] text-[#0a0e17] rounded-lg text-sm font-medium transition-colors"
        >
          + დამატება
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="ძიება..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-2 bg-[#0f1420] border border-[#C9A84C]/20 rounded-lg text-white focus:outline-none focus:border-[#C9A84C]/50"
        />
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
                <th className="px-4 py-3 text-gray-300 text-sm font-medium text-right">მოქმედება</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {companies.map((c) => (
                <tr key={c.id} className="hover:bg-[#C9A84C]/5">
                  <td className="px-4 py-3">
                    {c.file?.url ? (
                      <img src={c.file.url} alt="" className="w-12 h-12 rounded object-cover" />
                    ) : (
                      <div className="w-12 h-12 bg-[#0f1420] rounded" />
                    )}
                  </td>
                  <td className="px-4 py-3 text-white">{c.name}</td>
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
              {companies.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                    სავაჭრო ნიშნები არ მოიძებნა
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
          <div className="bg-[#0f1420] rounded-lg border border-[#C9A84C]/20 w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-bold text-white mb-4">
              {editingId ? "რედაქტირება" : "ახალი სავაჭრო ნიშანი"}
            </h2>

            <div className="mb-3">
              <label className="block text-gray-300 text-sm mb-1">სახელი</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-[#0f1420] border border-[#C9A84C]/20 rounded-lg text-white text-sm focus:outline-none focus:border-[#C9A84C]/50"
              />
            </div>

            {/* Main Image */}
            <div className="mb-3">
              <label className="block text-gray-300 text-sm mb-1">მთავარი სურათი</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleUpload(e, setFileId, setFilePreview)}
                className="text-sm text-gray-400 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:bg-[#C9A84C]/20 file:text-white file:cursor-pointer"
              />
              {filePreview && (
                <img src={filePreview} alt="" className="mt-2 h-20 rounded object-cover" />
              )}
            </div>

            {/* Secondary Image */}
            <div className="mb-3">
              <label className="block text-gray-300 text-sm mb-1">მეორადი სურათი</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleUpload(e, setSecondaryFileId, setSecondaryPreview)}
                className="text-sm text-gray-400 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:bg-[#C9A84C]/20 file:text-white file:cursor-pointer"
              />
              {secondaryPreview && (
                <img src={secondaryPreview} alt="" className="mt-2 h-20 rounded object-cover" />
              )}
            </div>

            {/* Active Image */}
            <div className="mb-4">
              <label className="block text-gray-300 text-sm mb-1">აქტიური სურათი</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleUpload(e, setActiveFileId, setActivePreview)}
                className="text-sm text-gray-400 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:bg-[#C9A84C]/20 file:text-white file:cursor-pointer"
              />
              {activePreview && (
                <img src={activePreview} alt="" className="mt-2 h-20 rounded object-cover" />
              )}
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
