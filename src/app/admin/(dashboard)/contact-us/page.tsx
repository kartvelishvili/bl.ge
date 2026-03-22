"use client";

import { useEffect, useState, useCallback } from "react";
import { useAdminAuth } from "@/lib/admin-auth";

interface ContactEntry {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  text: string;
  createdAt: string;
  isRead: boolean;
}

export default function ContactUsPage() {
  const { ready, authFetch } = useAdminAuth();
  const [entries, setEntries] = useState<ContactEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    try {
      const res = await authFetch("/api/contact-us");
      const data = await res.json();
      setEntries(Array.isArray(data) ? data : []);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [authFetch]);

  useEffect(() => {
    if (ready) fetchEntries();
  }, [ready, fetchEntries]);

  const toggleExpand = async (entry: ContactEntry) => {
    if (expandedId === entry.id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(entry.id);
    if (!entry.isRead) {
      try {
        await authFetch("/api/contact-us", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: entry.id, isRead: true }),
        });
        setEntries((prev) =>
          prev.map((e) => (e.id === entry.id ? { ...e, isRead: true } : e))
        );
      } catch {
        /* ignore */
      }
    }
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("ნამდვილად გსურთ ამ ლიდის წაშლა?")) return;
    try {
      await authFetch("/api/contact-us", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setEntries((prev) => prev.filter((entry) => entry.id !== id));
      if (expandedId === id) setExpandedId(null);
    } catch {
      alert("წაშლის შეცდომა");
    }
  };

  const unreadCount = entries.filter((e) => !e.isRead).length;
  const filtered = entries.filter((e) => {
    if (filter === "unread") return !e.isRead;
    if (filter === "read") return e.isRead;
    return true;
  });

  if (!ready) return null;

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h1
            className="text-2xl text-[#C9A84C]"
            style={{ fontFamily: '"BPG WEB 002 Caps", sans-serif' }}
          >
            ლიდები
          </h1>
          {unreadCount > 0 && (
            <span className="px-3 py-1 bg-[#C9A84C]/15 text-[#C9A84C] text-sm rounded-full border border-[#C9A84C]/30">
              {unreadCount} ახალი
            </span>
          )}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 bg-[#0f1420] rounded-lg p-1 border border-[#C9A84C]/10">
          {([
            { key: "all", label: `ყველა (${entries.length})` },
            { key: "unread", label: `ახალი (${unreadCount})` },
            { key: "read", label: `წაკითხული (${entries.length - unreadCount})` },
          ] as const).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-3 py-1.5 rounded-md text-xs transition-colors ${
                filter === tab.key
                  ? "bg-[#C9A84C]/15 text-[#C9A84C]"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500">იტვირთება...</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((entry) => (
            <div
              key={entry.id}
              className={`rounded-xl overflow-hidden transition-all duration-200 border ${
                !entry.isRead
                  ? "bg-[#0f1420] border-[#C9A84C]/25"
                  : "bg-[#0f1420]/60 border-white/5"
              }`}
            >
              {/* Row header */}
              <button
                onClick={() => toggleExpand(entry)}
                className="w-full text-left px-5 py-4 flex items-center gap-4 hover:bg-white/[0.02] transition-colors"
              >
                {/* Unread indicator */}
                <div className="w-2 flex-shrink-0">
                  {!entry.isRead && (
                    <span className="block w-2 h-2 bg-[#C9A84C] rounded-full" />
                  )}
                </div>

                {/* Avatar */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 ${
                  !entry.isRead
                    ? "bg-[#C9A84C]/15 text-[#C9A84C]"
                    : "bg-white/5 text-gray-500"
                }`}>
                  {entry.firstName?.[0]}{entry.lastName?.[0]}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <span className={`text-sm font-medium ${!entry.isRead ? "text-white" : "text-gray-400"}`}>
                    {entry.firstName} {entry.lastName}
                  </span>
                  <p className="text-gray-600 text-xs mt-0.5 line-clamp-1">{entry.text}</p>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-gray-600 text-xs">
                    {new Date(entry.createdAt).toLocaleDateString("ka-GE")}
                  </span>
                  <button
                    onClick={(e) => handleDelete(entry.id, e)}
                    className="p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="წაშლა"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                  <span className={`text-gray-600 text-xs transition-transform duration-200 ${expandedId === entry.id ? "rotate-180" : ""}`}>
                    &#9660;
                  </span>
                </div>
              </button>

              {/* Expanded content */}
              {expandedId === entry.id && (
                <div className="px-5 pb-5 border-t border-white/5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div>
                      <span className="text-[#C9A84C]/50 text-xs uppercase tracking-wider block mb-1">სახელი</span>
                      <span className="text-white text-sm">{entry.firstName}</span>
                    </div>
                    <div>
                      <span className="text-[#C9A84C]/50 text-xs uppercase tracking-wider block mb-1">გვარი</span>
                      <span className="text-white text-sm">{entry.lastName}</span>
                    </div>
                    <div>
                      <span className="text-[#C9A84C]/50 text-xs uppercase tracking-wider block mb-1">ელ-ფოსტა</span>
                      <a href={`mailto:${entry.email}`} className="text-[#C9A84C] hover:underline text-sm break-all">{entry.email}</a>
                    </div>
                    <div>
                      <span className="text-[#C9A84C]/50 text-xs uppercase tracking-wider block mb-1">ტელეფონი</span>
                      <a href={`tel:${entry.phoneNumber}`} className="text-[#C9A84C] hover:underline text-sm">{entry.phoneNumber}</a>
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-[#C9A84C]/50 text-xs uppercase tracking-wider block mb-2">შეტყობინება</span>
                    <div className="bg-[#0a0e17] rounded-lg p-4 border border-white/5">
                      <p className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed break-words">{entry.text}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-gray-600 text-xs">
                      {new Date(entry.createdAt).toLocaleString("ka-GE")}
                    </span>
                    <button
                      onClick={(e) => handleDelete(entry.id, e)}
                      className="px-3 py-1.5 text-xs rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      წაშლა
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-600">
                {filter === "unread" ? "ახალი ლიდები არ არის" : filter === "read" ? "წაკითხული ლიდები არ არის" : "ლიდები არ მოიძებნა"}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
