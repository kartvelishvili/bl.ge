"use client";

import { useEffect, useState, useCallback } from "react";
import { useAdminAuth } from "@/lib/admin-auth";

const bpgCaps = { fontFamily: '"BPG WEB 002 Caps", sans-serif' };

export default function SettingsPage() {
  const { ready, authFetch } = useAdminAuth();
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await authFetch("/api/settings");
      const data = await res.json();
      setVideoEnabled(data.video_enabled !== "false");
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [authFetch]);

  useEffect(() => {
    if (ready) fetchSettings();
  }, [ready, fetchSettings]);

  const toggleVideo = async () => {
    const newValue = !videoEnabled;
    setSaving(true);
    try {
      await authFetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "video_enabled", value: String(newValue) }),
      });
      setVideoEnabled(newValue);
    } catch {
      alert("შეცდომა შენახვისას");
    } finally {
      setSaving(false);
    }
  };

  if (!ready) return null;

  return (
    <div>
      <h1
        className="text-2xl text-[#C9A84C] mb-8"
        style={bpgCaps}
      >
        პარამეტრები
      </h1>

      {loading ? (
        <p className="text-gray-400">იტვირთება...</p>
      ) : (
        <div className="space-y-6 max-w-2xl">
          {/* Video Setting Card */}
          <div className="bg-[#0f1420] rounded-xl border border-[#C9A84C]/15 p-6">
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1">
                <h2 className="text-white text-lg font-medium mb-2" style={bpgCaps}>
                  ინტრო ვიდეო
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed">
                  მთავარ გვერდზე ჩატვირთვამდე გამოჩნდება ინტრო ვიდეო (bolero-last.mp4).
                  გამორთვის შემთხვევაში მომხმარებელი პირდაპირ მთავარ გვერდზე მოხვდება.
                </p>
              </div>
              <button
                onClick={toggleVideo}
                disabled={saving}
                className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 ${
                  videoEnabled ? "bg-[#C9A84C]" : "bg-gray-600"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    videoEnabled ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${videoEnabled ? "bg-green-400" : "bg-gray-500"}`} />
              <span className={`text-sm ${videoEnabled ? "text-green-400" : "text-gray-500"}`}>
                {videoEnabled ? "ჩართულია" : "გამორთულია"}
              </span>
            </div>
          </div>

          {/* Info note */}
          <div className="bg-[#0f1420] rounded-xl border border-[#C9A84C]/15 p-6">
            <h2 className="text-white text-lg font-medium mb-2" style={bpgCaps}>
              ინფორმაცია
            </h2>
            <div className="text-gray-400 text-sm leading-relaxed space-y-2">
              <p>ვიდეო ფაილი: <span className="text-[#C9A84C]">/bolero-last.mp4</span></p>
              <p>ვიდეო ჩაირთვება ერთხელ თითოეული სესიისთვის. მომხმარებლის ბრაუზერი ვიდეოს დასრულების შემდეგ აღარ აჩვენებს მანამ, სანამ ახალ სესიას არ დაიწყებს.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
