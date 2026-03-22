"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        setError("არასწორი ელ-ფოსტა ან პაროლი");
        return;
      }

      const data = await res.json();
      localStorage.setItem("user", JSON.stringify(data));
      router.push("/admin/blogs");
    } catch {
      setError("სერვერის შეცდომა");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e17] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1
            className="text-3xl text-[#C9A84C] tracking-wider mb-2"
            style={{ fontFamily: '"BPG WEB 002 Caps", sans-serif' }}
          >
            BOLERO
          </h1>
          <div className="h-[1px] w-24 mx-auto bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent" />
        </div>
        <div className="bg-[#0f1420] rounded-xl border border-[#C9A84C]/20 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-400 text-sm mb-2">ელ-ფოსტა</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[#0a0e17] border border-[#C9A84C]/20 rounded-lg text-white text-sm focus:outline-none focus:border-[#C9A84C]/60 transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">პაროლი</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#0a0e17] border border-[#C9A84C]/20 rounded-lg text-white text-sm focus:outline-none focus:border-[#C9A84C]/60 transition-colors"
                required
              />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-medium text-sm transition-all duration-200 disabled:opacity-50 bg-[#C9A84C] hover:bg-[#d4b65e] text-[#0a0e17]"
            >
              {loading ? "იტვირთება..." : "შესვლა"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
