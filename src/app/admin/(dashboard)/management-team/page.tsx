"use client";

import { useEffect, useState, useCallback } from "react";
import { useAdminAuth } from "@/lib/admin-auth";

type Lang = "ge" | "en" | "ru";
type LocaleField = { en: string; ge: string; ru: string };

interface MemberFile {
  id: number;
  url: string;
}

interface TeamMember {
  id: number;
  firstName: LocaleField;
  lastName: LocaleField;
  profession: LocaleField;
  imageId: number;
  image: MemberFile | null;
  sortOrder: number;
}

const emptyLocale = (): LocaleField => ({ en: "", ge: "", ru: "" });

export default function ManagementTeamPage() {
  const { ready, authFetch } = useAdminAuth();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [search, setSearch] = useState("");
  const [lang, setLang] = useState<Lang>("ge");
  const [loading, setLoading] = useState(true);
  const [savingOrder, setSavingOrder] = useState(false);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [firstName, setFirstName] = useState<LocaleField>(emptyLocale());
  const [lastName, setLastName] = useState<LocaleField>(emptyLocale());
  const [profession, setProfession] = useState<LocaleField>(emptyLocale());
  const [imageId, setImageId] = useState<number | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [tabLang, setTabLang] = useState<Lang>("ge");
  const [saving, setSaving] = useState(false);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await authFetch(`/api/management-team?query=${encodeURIComponent(search)}`);
      const data = await res.json();
      setMembers(Array.isArray(data) ? data : []);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [authFetch, search]);

  useEffect(() => {
    if (ready) fetchMembers();
  }, [ready, fetchMembers]);

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
      setImageId(uploaded[0].id);
      setImagePreview(uploaded[0].url);
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setFirstName(emptyLocale());
    setLastName(emptyLocale());
    setProfession(emptyLocale());
    setImageId(null);
    setImagePreview("");
    setTabLang("ge");
    setModalOpen(true);
  };

  const openEdit = (m: TeamMember) => {
    setEditingId(m.id);
    setFirstName({ ...m.firstName });
    setLastName({ ...m.lastName });
    setProfession({ ...m.profession });
    setImageId(m.imageId);
    setImagePreview(m.image?.url || "");
    setTabLang("ge");
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { firstName, lastName, profession, imageId };
      if (editingId) {
        await authFetch(`/api/management-team/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await authFetch("/api/management-team", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      setModalOpen(false);
      fetchMembers();
    } catch {
      alert("შეცდომა შენახვისას");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("ნამდვილად გსურთ წაშლა?")) return;
    try {
      await authFetch(`/api/management-team/${id}`, { method: "DELETE" });
      fetchMembers();
    } catch {
      alert("წაშლის შეცდომა");
    }
  };

  const moveItem = (index: number, direction: "up" | "down") => {
    const newMembers = [...members];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newMembers.length) return;
    [newMembers[index], newMembers[swapIndex]] = [newMembers[swapIndex], newMembers[index]];
    setMembers(newMembers);
  };

  const saveOrder = async () => {
    setSavingOrder(true);
    try {
      await authFetch("/api/management-team", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds: members.map((m) => m.id) }),
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
        >მენეჯმენტის გუნდი</h1>
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
                <th className="px-4 py-3 text-gray-300 text-sm font-medium">სახელი</th>
                <th className="px-4 py-3 text-gray-300 text-sm font-medium">გვარი</th>
                <th className="px-4 py-3 text-gray-300 text-sm font-medium">პროფესია</th>
                <th className="px-4 py-3 text-gray-300 text-sm font-medium text-right">მოქმედება</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {members.map((m, index) => (
                <tr key={m.id} className="hover:bg-[#C9A84C]/5">
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
                        disabled={index === members.length - 1}
                        className="text-gray-400 hover:text-white disabled:opacity-30 text-lg leading-none"
                        title="ქვევით"
                      >
                        ▼
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {m.image?.url ? (
                      <img src={m.image.url} alt="" className="w-12 h-12 rounded object-cover" />
                    ) : (
                      <div className="w-12 h-12 bg-[#0f1420] rounded" />
                    )}
                  </td>
                  <td className="px-4 py-3 text-white">{m.firstName?.[lang] || "—"}</td>
                  <td className="px-4 py-3 text-white">{m.lastName?.[lang] || "—"}</td>
                  <td className="px-4 py-3 text-gray-400">{m.profession?.[lang] || "—"}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => openEdit(m)}
                      className="px-3 py-1 border border-[#C9A84C]/30 text-[#C9A84C] hover:bg-[#C9A84C]/10 rounded text-xs mr-2 transition-colors"
                    >
                      რედაქტირება
                    </button>
                    <button
                      onClick={() => handleDelete(m.id)}
                      className="px-3 py-1 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded text-xs transition-colors"
                    >
                      წაშლა
                    </button>
                  </td>
                </tr>
              ))}
              {members.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    მონაცემები არ მოიძებნა
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
              {editingId ? "რედაქტირება" : "ახალი წევრი"}
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

            <div className="mb-3">
              <label className="block text-gray-300 text-sm mb-1">სახელი ({tabLang})</label>
              <input
                type="text"
                value={firstName[tabLang]}
                onChange={(e) => setFirstName({ ...firstName, [tabLang]: e.target.value })}
                className="w-full px-3 py-2 bg-[#0f1420] border border-[#C9A84C]/20 rounded-lg text-white text-sm focus:outline-none focus:border-[#C9A84C]/50"
              />
            </div>

            <div className="mb-3">
              <label className="block text-gray-300 text-sm mb-1">გვარი ({tabLang})</label>
              <input
                type="text"
                value={lastName[tabLang]}
                onChange={(e) => setLastName({ ...lastName, [tabLang]: e.target.value })}
                className="w-full px-3 py-2 bg-[#0f1420] border border-[#C9A84C]/20 rounded-lg text-white text-sm focus:outline-none focus:border-[#C9A84C]/50"
              />
            </div>

            <div className="mb-3">
              <label className="block text-gray-300 text-sm mb-1">პროფესია ({tabLang})</label>
              <input
                type="text"
                value={profession[tabLang]}
                onChange={(e) => setProfession({ ...profession, [tabLang]: e.target.value })}
                className="w-full px-3 py-2 bg-[#0f1420] border border-[#C9A84C]/20 rounded-lg text-white text-sm focus:outline-none focus:border-[#C9A84C]/50"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-300 text-sm mb-1">სურათი</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="text-sm text-gray-400 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:bg-[#C9A84C]/20 file:text-white file:cursor-pointer"
              />
              {imagePreview && (
                <img src={imagePreview} alt="" className="mt-2 h-24 rounded object-cover" />
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
