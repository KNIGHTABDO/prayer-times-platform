"use client";
// @ts-nocheck
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const r = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (r.ok) {
        router.push("/admin");
      } else {
        setError("Invalid password.");
      }
    } catch {
      setError("Network error.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-bg-base pattern-bg flex items-center justify-center px-4">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-emerald-dark/6 rounded-full blur-[100px]" />
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="glass rounded-3xl p-8 w-full max-w-sm relative z-10">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">☽</div>
          <h1 className="font-bold text-xl text-white mb-1">Admin Dashboard</h1>
          <p className="text-white/40 text-sm">Prayer Times Platform</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-white/50 text-xs uppercase tracking-widest mb-1.5">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
              placeholder="Enter admin password"
              className="w-full bg-bg-base/60 border border-white/8 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-gold/40 text-sm" />
          </div>
          {error && <p className="text-red-400 text-xs text-center">{error}</p>}
          <button type="submit" disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
              loading ? "bg-gold/20 text-white/30" : "bg-gold text-bg-base hover:bg-gold-light active:scale-[0.98]"
            }`}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="mt-6 text-center">
          <a href="/" className="text-white/25 text-xs hover:text-white/50 transition-colors">← Back to site</a>
        </div>
      </motion.div>
    </div>
  );
}
