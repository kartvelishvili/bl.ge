"use client";

import { useEffect, useState, useCallback } from "react";
import { useAdminAuth } from "@/lib/admin-auth";

interface AdminUser {
  id: number;
  userName: string;
  email: string;
  createdAt: string;
}

export default function UsersPage() {
  const { ready, authFetch } = useAdminAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await authFetch("/api/auth/users");
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [authFetch]);

  useEffect(() => {
    if (ready) fetchUsers();
  }, [ready, fetchUsers]);

  const openCreate = () => {
    setEditId(null);
    setUserName("");
    setEmail("");
    setPassword("");
    setFormError("");
    setModalOpen(true);
  };

  const openEdit = (u: AdminUser) => {
    setEditId(u.id);
    setUserName(u.userName);
    setEmail(u.email);
    setPassword("");
    setFormError("");
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!userName || !email) {
      setFormError("სახელი და ელ-ფოსტა სავალდებულოა");
      return;
    }
    if (!editId && !password) {
      setFormError("პაროლი სავალდებულოა");
      return;
    }
    if (password && password.length < 6) {
      setFormError("პაროლი მინიმუმ 6 სიმბოლო");
      return;
    }
    setSaving(true);
    setFormError("");
    try {
      const isEdit = editId !== null;
      const payload: Record<string, unknown> = { userName, email };
      if (password) payload.password = password;
      if (isEdit) payload.id = editId;

      const res = await authFetch("/api/auth/users", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.status === 409) {
        setFormError("ეს ელ-ფოსტა უკვე არსებობს");
        return;
      }
      if (!res.ok) {
        setFormError("შეცდომა შენახვისას");
        return;
      }
      setModalOpen(false);
      fetchUsers();
    } catch {
      setFormError("სერვერის შეცდომა");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("ნამდვილად გსურთ ადმინისტრატორის წაშლა?")) return;
    try {
      const res = await authFetch("/api/auth/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.status === 400) {
        const data = await res.json();
        alert(data.message === "Cannot delete yourself" ? "საკუთარი თავის წაშლა შეუძლებელია" : data.message);
        return;
      }
      fetchUsers();
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
        >
          ადმინისტრატორები
        </h1>
        <button
          onClick={openCreate}
          className="px-5 py-2.5 bg-[#C9A84C] hover:bg-[#d4b65e] text-[#0a0e17] rounded-lg text-sm font-medium transition-colors"
        >
          + დამატება
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">იტვირთება...</p>
      ) : (
        <div className="bg-[#0f1420] rounded-xl border border-[#C9A84C]/15 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#C9A84C]/15">
                <th className="px-5 py-4 text-[#C9A84C]/70 text-xs uppercase tracking-wider">სახელი</th>
                <th className="px-5 py-4 text-[#C9A84C]/70 text-xs uppercase tracking-wider">ელ-ფოსტა</th>
                <th className="px-5 py-4 text-[#C9A84C]/70 text-xs uppercase tracking-wider">თარიღი</th>
                <th className="px-5 py-4 text-[#C9A84C]/70 text-xs uppercase tracking-wider text-right">მოქმედება</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-4 text-white text-sm">{u.userName}</td>
                  <td className="px-5 py-4 text-gray-400 text-sm">{u.email}</td>
                  <td className="px-5 py-4 text-gray-500 text-sm">
                    {new Date(u.createdAt).toLocaleDateString("ka-GE")}
                  </td>
                  <td className="px-5 py-4 text-right space-x-2">
                    <button
                      onClick={() => openEdit(u)}
                      className="px-3 py-1.5 text-xs rounded-lg border border-[#C9A84C]/30 text-[#C9A84C] hover:bg-[#C9A84C]/10 transition-colors"
                    >
                      რედაქტირება
                    </button>
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="px-3 py-1.5 text-xs rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      წაშლა
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center text-gray-600">
                    ადმინისტრატორები არ მოიძებნა
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f1420] rounded-xl border border-[#C9A84C]/20 w-full max-w-md p-6">
            <h2
              className="text-lg text-[#C9A84C] mb-5"
              style={{ fontFamily: '"BPG WEB 002 Caps", sans-serif' }}
            >
              {editId ? "რედაქტირება" : "ახალი ადმინისტრატორი"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-1.5">სახელი</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#0a0e17] border border-[#C9A84C]/20 rounded-lg text-white text-sm focus:outline-none focus:border-[#C9A84C]/60 transition-colors"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1.5">ელ-ფოსტა</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#0a0e17] border border-[#C9A84C]/20 rounded-lg text-white text-sm focus:outline-none focus:border-[#C9A84C]/60 transition-colors"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1.5">
                  {editId ? "ახალი პაროლი (ცარიელი = უცვლელი)" : "პაროლი"}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={editId ? "დატოვეთ ცარიელი თუ არ გსურთ შეცვლა" : ""}
                  className="w-full px-4 py-2.5 bg-[#0a0e17] border border-[#C9A84C]/20 rounded-lg text-white text-sm focus:outline-none focus:border-[#C9A84C]/60 transition-colors placeholder:text-gray-600"
                />
              </div>
            </div>

            {formError && <p className="text-red-400 text-sm mt-3">{formError}</p>}

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2.5 rounded-lg text-sm text-gray-400 border border-white/10 hover:bg-white/5 transition-colors"
              >
                გაუქმება
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2.5 bg-[#C9A84C] hover:bg-[#d4b65e] text-[#0a0e17] rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
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
