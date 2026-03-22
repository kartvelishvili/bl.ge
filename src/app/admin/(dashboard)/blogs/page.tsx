"use client";

import { useEffect, useState, useCallback } from "react";
import { useAdminAuth } from "@/lib/admin-auth";

type Lang = "ge" | "en" | "ru";
type LocaleField = { en: string; ge: string; ru: string };

interface BlogFile {
  id: number;
  url: string;
}

interface Blog {
  id: number;
  title: LocaleField;
  description: LocaleField;
  fileId: number;
  file: BlogFile | null;
  type: string;
  gallery: BlogFile[];
  visibleOnHome: boolean;
  createdAt: string;
  sortOrder: number;
}

const emptyLocale = (): LocaleField => ({ en: "", ge: "", ru: "" });

export default function BlogsPage() {
  const { ready, authFetch } = useAdminAuth();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [search, setSearch] = useState("");
  const [lang, setLang] = useState<Lang>("ge");
  const [loading, setLoading] = useState(true);
  const [savingOrder, setSavingOrder] = useState(false);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState<LocaleField>(emptyLocale());
  const [description, setDescription] = useState<LocaleField>(emptyLocale());
  const [type, setType] = useState<string>("normal");
  const [visibleOnHome, setVisibleOnHome] = useState(false);
  const [fileId, setFileId] = useState<number | null>(null);
  const [filePreview, setFilePreview] = useState<string>("");
  const [galleryIds, setGalleryIds] = useState<number[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [tabLang, setTabLang] = useState<Lang>("ge");
  const [saving, setSaving] = useState(false);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await authFetch(`/api/blogs?name=${encodeURIComponent(search)}`);
      const data = await res.json();
      setBlogs(Array.isArray(data) ? data : []);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [authFetch, search]);

  useEffect(() => {
    if (ready) fetchBlogs();
  }, [ready, fetchBlogs]);

  const uploadFile = async (file: File): Promise<{ id: number; url: string }[]> => {
    const fd = new FormData();
    fd.append("files", file);
    const res = await authFetch("/api/storage/upload-image", { method: "POST", body: fd });
    return res.json();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const uploaded = await uploadFile(file);
    if (uploaded.length > 0) {
      setFileId(uploaded[0].id);
      setFilePreview(uploaded[0].url);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    for (const file of Array.from(files)) {
      const uploaded = await uploadFile(file);
      if (uploaded.length > 0) {
        setGalleryIds((prev) => [...prev, uploaded[0].id]);
        setGalleryPreviews((prev) => [...prev, uploaded[0].url]);
      }
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setTitle(emptyLocale());
    setDescription(emptyLocale());
    setType("normal");
    setVisibleOnHome(false);
    setFileId(null);
    setFilePreview("");
    setGalleryIds([]);
    setGalleryPreviews([]);
    setTabLang("ge");
    setModalOpen(true);
  };

  const openEdit = (blog: Blog) => {
    setEditingId(blog.id);
    setTitle({ ...blog.title });
    setDescription({ ...blog.description });
    setType(blog.type);
    setVisibleOnHome(blog.visibleOnHome);
    setFileId(blog.fileId);
    setFilePreview(blog.file?.url || "");
    setGalleryIds(blog.gallery?.map((g) => g.id) || []);
    setGalleryPreviews(blog.gallery?.map((g) => g.url) || []);
    setTabLang("ge");
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        title,
        description,
        type,
        visibleOnHome,
        fileId,
        galleryIds,
      };

      if (editingId) {
        await authFetch(`/api/blogs/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await authFetch("/api/blogs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      setModalOpen(false);
      fetchBlogs();
    } catch {
      alert("შეცდომა შენახვისას");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("ნამდვილად გსურთ წაშლა?")) return;
    try {
      await authFetch(`/api/blogs/${id}`, { method: "DELETE" });
      fetchBlogs();
    } catch {
      alert("წაშლის შეცდომა");
    }
  };

  const moveItem = (index: number, direction: "up" | "down") => {
    const newBlogs = [...blogs];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newBlogs.length) return;
    [newBlogs[index], newBlogs[swapIndex]] = [newBlogs[swapIndex], newBlogs[index]];
    setBlogs(newBlogs);
  };

  const saveOrder = async () => {
    setSavingOrder(true);
    try {
      await authFetch("/api/blogs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds: blogs.map((b) => b.id) }),
      });
    } catch {
      alert("თანმიმდევრობის შენახვის შეცდომა");
    } finally {
      setSavingOrder(false);
    }
  };

  if (!ready) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1
          className="text-2xl text-[#C9A84C]"
          style={{ fontFamily: '"BPG WEB 002 Caps", sans-serif' }}
        >ბლოგები</h1>
        <div className="flex gap-2">
          <button
            onClick={saveOrder}
            disabled={savingOrder}
            className="px-4 py-2.5 rounded-lg text-sm font-medium disabled:opacity-50 border border-[#C9A84C]/30 text-[#C9A84C] hover:bg-[#C9A84C]/10 transition-colors"
          >
            {savingOrder ? "ინახება..." : "თანმიმდევრობის შენახვა"}
          </button>
          <button
            onClick={openCreate}
            className="px-5 py-2.5 bg-[#C9A84C] hover:bg-[#d4b65e] text-[#0a0e17] rounded-lg text-sm font-medium transition-colors"
          >
            + დამატება
          </button>
        </div>
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
                <th className="px-4 py-3 text-gray-300 text-sm font-medium w-20">რიგი</th>
                <th className="px-4 py-3 text-gray-300 text-sm font-medium">სურათი</th>
                <th className="px-4 py-3 text-gray-300 text-sm font-medium">სათაური</th>
                <th className="px-4 py-3 text-gray-300 text-sm font-medium">ტიპი</th>
                <th className="px-4 py-3 text-gray-300 text-sm font-medium">მთავარი</th>
                <th className="px-4 py-3 text-gray-300 text-sm font-medium text-right">მოქმედება</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {blogs.map((blog, index) => (
                <tr key={blog.id} className="hover:bg-[#C9A84C]/5">
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => moveItem(index, "up")}
                        disabled={index === 0}
                        className="text-gray-400 hover:text-white disabled:opacity-30 text-lg leading-none"
                        title="ზევით"
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => moveItem(index, "down")}
                        disabled={index === blogs.length - 1}
                        className="text-gray-400 hover:text-white disabled:opacity-30 text-lg leading-none"
                        title="ქვევით"
                      >
                        ▼
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {blog.file?.url ? (
                      <img src={blog.file.url} alt="" className="w-12 h-12 rounded object-cover" />
                    ) : (
                      <div className="w-12 h-12 bg-[#0f1420] rounded" />
                    )}
                  </td>
                  <td className="px-4 py-3 text-white">{blog.title?.[lang] || "—"}</td>
                  <td className="px-4 py-3 text-gray-400">{blog.type}</td>
                  <td className="px-4 py-3 text-gray-400">{blog.visibleOnHome ? "✓" : "—"}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => openEdit(blog)}
                      className="px-3 py-1 border border-[#C9A84C]/30 text-[#C9A84C] hover:bg-[#C9A84C]/10 rounded text-xs mr-2 transition-colors"
                    >
                      რედაქტირება
                    </button>
                    <button
                      onClick={() => handleDelete(blog.id)}
                      className="px-3 py-1 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded text-xs transition-colors"
                    >
                      წაშლა
                    </button>
                  </td>
                </tr>
              ))}
              {blogs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    ბლოგები არ მოიძებნა
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
          <div className="bg-[#0f1420] rounded-lg border border-[#C9A84C]/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-bold text-white mb-4">
              {editingId ? "რედაქტირება" : "ახალი ბლოგი"}
            </h2>

            {/* Language Tabs */}
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

            {/* Title */}
            <div className="mb-3">
              <label className="block text-gray-300 text-sm mb-1">სათაური ({tabLang})</label>
              <input
                type="text"
                value={title[tabLang]}
                onChange={(e) => setTitle({ ...title, [tabLang]: e.target.value })}
                className="w-full px-3 py-2 bg-[#0f1420] border border-[#C9A84C]/20 rounded-lg text-white text-sm focus:outline-none focus:border-[#C9A84C]/50"
              />
            </div>

            {/* Description */}
            <div className="mb-3">
              <label className="block text-gray-300 text-sm mb-1">აღწერა ({tabLang})</label>
              <textarea
                value={description[tabLang]}
                onChange={(e) => setDescription({ ...description, [tabLang]: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 bg-[#0f1420] border border-[#C9A84C]/20 rounded-lg text-white text-sm focus:outline-none focus:border-[#C9A84C]/50"
              />
            </div>

            {/* Type */}
            <div className="mb-3">
              <label className="block text-gray-300 text-sm mb-1">ტიპი</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2 bg-[#0f1420] border border-[#C9A84C]/20 rounded-lg text-white text-sm focus:outline-none focus:border-[#C9A84C]/50"
              >
                <option value="normal">Normal</option>
                <option value="about-us">About Us</option>
              </select>
            </div>

            {/* Visible on home */}
            <div className="mb-3 flex items-center gap-2">
              <input
                type="checkbox"
                checked={visibleOnHome}
                onChange={(e) => setVisibleOnHome(e.target.checked)}
                className="rounded bg-[#0f1420] border-[#C9A84C]/20"
              />
              <label className="text-gray-300 text-sm">მთავარ გვერდზე ჩვენება</label>
            </div>

            {/* Cover Image */}
            <div className="mb-3">
              <label className="block text-gray-300 text-sm mb-1">სურათი</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="text-sm text-gray-400 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:bg-[#C9A84C]/20 file:text-white file:cursor-pointer"
              />
              {filePreview && (
                <img src={filePreview} alt="cover" className="mt-2 h-24 rounded object-cover" />
              )}
            </div>

            {/* Gallery */}
            <div className="mb-4">
              <label className="block text-gray-300 text-sm mb-1">გალერეა</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleGalleryUpload}
                className="text-sm text-gray-400 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:bg-[#C9A84C]/20 file:text-white file:cursor-pointer"
              />
              {galleryPreviews.length > 0 && (
                <div className="flex gap-2 mt-2 flex-wrap">
                  {galleryPreviews.map((url, i) => (
                    <div key={i} className="relative">
                      <img src={url} alt="" className="h-16 rounded object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setGalleryIds((p) => p.filter((_, j) => j !== i));
                          setGalleryPreviews((p) => p.filter((_, j) => j !== i));
                        }}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white rounded-full text-xs flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
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
