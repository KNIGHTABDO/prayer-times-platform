"use client";
// @ts-nocheck
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

const LANG_MAP = { en: "English", fr: "Français", ar: "العربية" };
const LANG_COLOR = { en: "bg-blue-500/20 text-blue-300", fr: "bg-purple-500/20 text-purple-300", ar: "bg-emerald-500/20 text-emerald-300" };

function StatCard({ icon, label, value, sub, color }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-5">
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${color}20`, color }}>
          {sub}
        </span>
      </div>
      <p className="text-3xl font-bold text-white mb-0.5">{value}</p>
      <p className="text-white/40 text-xs">{label}</p>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterLang, setFilterLang] = useState("all");
  const [sending, setSending] = useState(null);
  const [bulkSending, setBulkSending] = useState(false);
  const [toast, setToast] = useState(null);
  const [preview, setPreview] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [tab, setTab] = useState("subscribers");

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadSubscribers = async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/subscribers");
      const data = await r.json();
      setSubscribers(data.subscribers || []);
    } catch { showToast("Failed to load subscribers", "error"); }
    setLoading(false);
  };

  useEffect(() => { loadSubscribers(); }, []);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const handleSendSingle = async (sub) => {
    setSending(sub.id);
    try {
      const r = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: sub.email, city: sub.city, language: sub.language }),
      });
      const d = await r.json();
      if (r.ok) showToast(`✓ Email sent to ${sub.email}`);
      else showToast(d.error || "Failed to send", "error");
    } catch { showToast("Network error", "error"); }
    setSending(null);
  };

  const handleBulkSend = async (target = "all") => {
    setBulkSending(true);
    let count = 0;
    const targets = target === "all"
      ? subscribers
      : subscribers.filter((s) => s.language === target);
    for (const sub of targets) {
      try {
        await fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: sub.email, city: sub.city, language: sub.language }),
        });
        count++;
      } catch {}
    }
    showToast(`✓ Sent ${count}/${targets.length} emails`);
    setBulkSending(false);
  };

  const handleDelete = async (sub) => {
    try {
      const r = await fetch(`/api/subscribers?id=${sub.id}`, { method: "DELETE" });
      if (r.ok) {
        setSubscribers((prev) => prev.filter((s) => s.id !== sub.id));
        showToast(`Deleted ${sub.email}`);
      }
    } catch { showToast("Delete failed", "error"); }
    setDeleteConfirm(null);
  };

  const handleExportCSV = () => {
    const rows = [["Email", "City", "Language", "Joined"], ...subscribers.map((s) => [s.email, s.city, s.language, s.createdAt])];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `subscribers-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  };

  const filtered = subscribers.filter((s) => {
    const matchSearch = !search || s.email.includes(search) || s.city?.toLowerCase().includes(search.toLowerCase());
    const matchLang = filterLang === "all" || s.language === filterLang;
    return matchSearch && matchLang;
  });

  const stats = {
    total: subscribers.length,
    ar: subscribers.filter((s) => s.language === "ar").length,
    fr: subscribers.filter((s) => s.language === "fr").length,
    en: subscribers.filter((s) => s.language === "en").length,
  };

  const topCities = Object.entries(
    subscribers.reduce((acc, s) => { acc[s.city] = (acc[s.city] || 0) + 1; return acc; }, {})
  ).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const getJummahDate = () => {
    const now = new Date();
    const days = (5 - now.getDay() + 7) % 7 || 7;
    const next = new Date(now);
    next.setDate(next.getDate() + days);
    return next.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
  };

  return (
    <div className="min-h-screen bg-bg-base text-white">
      <div className="fixed inset-0 pointer-events-none pattern-bg opacity-30" />
      {/* Ambient */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-emerald-dark/4 rounded-full blur-[120px] pointer-none" />

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-[99] px-4 py-3 rounded-xl text-sm font-medium shadow-lg ${
              toast.type === "error" ? "bg-red-900/90 text-red-200 border border-red-700/50" : "bg-emerald/90 text-white border border-emerald-dark/50"
            }`}>
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete confirm modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-black/70 flex items-center justify-center px-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="glass rounded-2xl p-6 max-w-sm w-full">
              <h3 className="font-bold text-white mb-2">Delete Subscriber?</h3>
              <p className="text-white/60 text-sm mb-5">{deleteConfirm.email}</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-2.5 rounded-xl glass text-white/60 text-sm hover:text-white transition-all">Cancel</button>
                <button onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-all">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Email preview modal */}
      <AnimatePresence>
        {preview && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              className="glass rounded-2xl p-6 max-w-lg w-full my-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white">Email Preview</h3>
                <button onClick={() => setPreview(null)} className="text-white/40 hover:text-white transition-colors">✕</button>
              </div>
              <div className="bg-bg-base rounded-xl p-4 text-sm space-y-2 mb-4 max-h-60 overflow-y-auto">
                <p className="text-white/60"><span className="text-white/30">To:</span> {preview.email}</p>
                <p className="text-white/60"><span className="text-white/30">City:</span> {preview.city}</p>
                <p className="text-white/60"><span className="text-white/30">Language:</span> {LANG_MAP[preview.language]}</p>
                <p className="text-white/60"><span className="text-white/30">Subject:</span> {preview.language === "ar" ? "🕌 موعد صلاة الجمعة" : preview.language === "fr" ? "🕌 Rappel Jummah" : "🕌 Jummah Reminder"}</p>
                <hr className="border-white/10" />
                <p className="text-white/50 text-xs">This email contains the Jummah prayer time for {preview.city} in {LANG_MAP[preview.language]}.</p>
              </div>
              <button onClick={() => { handleSendSingle(preview); setPreview(null); }}
                className="w-full py-3 rounded-xl bg-emerald text-white text-sm font-semibold hover:bg-emerald-dark transition-all">
                Send Now
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="glass border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-gold text-lg">☽</span>
            <div>
              <span className="font-semibold text-white text-sm">Admin Dashboard</span>
              <span className="text-white/30 text-xs ml-2">Prayer Times Platform</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href="/" className="text-white/40 text-xs hover:text-white/70 transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5">← Site</a>
            <button onClick={handleLogout} className="px-3 py-1.5 rounded-lg text-red-400/70 text-xs hover:text-red-400 hover:bg-red-500/10 transition-all">Logout</button>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Next Jummah Banner */}
        <div className="glass-emerald rounded-2xl p-4 flex items-center gap-3 mb-6">
          <span className="text-2xl">📬</span>
          <div>
            <p className="text-emerald font-semibold text-sm">Next Jummah: {getJummahDate()}</p>
            <p className="text-white/40 text-xs">You have {stats.total} subscribers waiting for reminders.</p>
          </div>
          <button onClick={() => handleBulkSend("all")} disabled={bulkSending || stats.total === 0}
            className={`ml-auto px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              bulkSending ? "bg-emerald/20 text-white/30" : "bg-emerald text-white hover:bg-emerald-dark active:scale-95"
            }`}>
            {bulkSending ? "Sending..." : "Send to All"}
          </button>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <StatCard icon="👥" label="Total Subscribers" value={stats.total} sub="All time" color="#d4af37" />
          <StatCard icon="🇬🇧" label="English" value={stats.en} sub="EN" color="#3b82f6" />
          <StatCard icon="🇫🇷" label="French" value={stats.fr} sub="FR" color="#8b5cf6" />
          <StatCard icon="🕌" label="Arabic" value={stats.ar} sub="AR" color="#10b981" />
        </div>

        {/* Top cities */}
        {topCities.length > 0 && (
          <div className="glass rounded-2xl p-5 mb-6">
            <h3 className="text-white/60 text-xs uppercase tracking-widest mb-4">Top Cities</h3>
            <div className="space-y-2.5">
              {topCities.map(([city, count]) => (
                <div key={city} className="flex items-center gap-3">
                  <span className="text-white/80 text-sm w-32 truncate">{city}</span>
                  <div className="flex-1 bg-bg-base rounded-full h-2 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald to-gold rounded-full transition-all"
                      style={{ width: `${(count / stats.total) * 100}%` }} />
                  </div>
                  <span className="text-white/50 text-xs w-8 text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Subscriber table */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="flex gap-2 flex-1 w-full sm:w-auto">
              <input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search email or city..."
                className="flex-1 bg-bg-base/60 border border-white/8 rounded-xl px-3 py-2 text-white placeholder-white/25 focus:outline-none focus:border-gold/30 text-sm" />
              <select value={filterLang} onChange={(e) => setFilterLang(e.target.value)}
                className="bg-bg-base/60 border border-white/8 rounded-xl px-3 py-2 text-white/70 focus:outline-none text-sm">
                <option value="all">All langs</option>
                <option value="en">English</option>
                <option value="fr">French</option>
                <option value="ar">Arabic</option>
              </select>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={handleExportCSV}
                className="px-3 py-2 rounded-xl glass text-white/60 text-xs hover:text-white transition-all">
                ↓ CSV
              </button>
              <div className="flex gap-1">
                {["en","fr","ar"].map((l) => (
                  <button key={l} onClick={() => handleBulkSend(l)}
                    disabled={bulkSending}
                    className="px-3 py-2 rounded-xl glass text-white/60 text-xs hover:text-white transition-all">
                    Send {l.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="text-3xl animate-spin inline-block mb-3">☽</div>
              <p className="text-white/40 text-sm">Loading subscribers...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-3xl mb-3">📭</div>
              <p className="text-white/40 text-sm">No subscribers found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    {["Email", "Language", "City", "Joined", "Actions"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-white/30 text-xs uppercase tracking-wider font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/4">
                  {filtered.map((sub, i) => (
                    <motion.tr key={sub.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                      className="hover:bg-white/2 transition-colors">
                      <td className="px-4 py-3 text-white/80 text-sm font-mono">{sub.email}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${LANG_COLOR[sub.language] || "bg-white/10 text-white/50"}`}>
                          {LANG_MAP[sub.language] || sub.language}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-white/60 text-sm">{sub.city}</td>
                      <td className="px-4 py-3 text-white/40 text-xs">
                        {sub.createdAt ? new Date(sub.createdAt).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => setPreview(sub)}
                            className="px-2.5 py-1 rounded-lg glass text-white/50 text-xs hover:text-white transition-all">Preview</button>
                          <button onClick={() => handleSendSingle(sub)} disabled={!!sending}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                              sending === sub.id ? "bg-emerald/20 text-emerald/50" : "bg-emerald/15 text-emerald hover:bg-emerald/25"
                            }`}>
                            {sending === sub.id ? "Sending..." : "Send"}
                          </button>
                          <button onClick={() => setDeleteConfirm(sub)}
                            className="px-2.5 py-1 rounded-lg text-xs text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-all">✕</button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
