"use client";
// @ts-nocheck
import { useState, useEffect, useCallback } from "react";

const PRAYERS = [
  { key: "Fajr",    label: "Fajr",    icon: "🌙" },
  { key: "Dhuhr",   label: "Dhuhr",   icon: "☀️" },
  { key: "Asr",     label: "Asr",     icon: "🌤️" },
  { key: "Maghrib", label: "Maghrib", icon: "🌅" },
  { key: "Isha",    label: "Isha",    icon: "🌌" },
];

const CACHE_KEY = "pt_v3";
const CACHE_TTL = 3600000;

function getCached(key) {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const cache = JSON.parse(raw);
    const entry = cache[key];
    if (!entry || Date.now() - entry.ts > CACHE_TTL) return null;
    return entry.timings;
  } catch { return null; }
}

function setCache(key, timings) {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    const cache = raw ? JSON.parse(raw) : {};
    cache[key] = { timings, ts: Date.now() };
    const keys = Object.keys(cache);
    if (keys.length > 10) delete cache[keys[0]];
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {}
}

function makeKey(params) {
  return Object.values(params).join("__").toLowerCase();
}

function getCurrentAndNext(timings) {
  const now = new Date();
  const nowMins = now.getHours() * 60 + now.getMinutes();
  const times = PRAYERS.map((p) => {
    const [h, m] = (timings[p.key] || "00:00").split(":").map(Number);
    return { key: p.key, mins: h * 60 + m };
  }).sort((a, b) => a.mins - b.mins);
  let current = times[times.length - 1], next = times[0];
  for (let i = 0; i < times.length; i++) {
    if (nowMins >= times[i].mins) {
      current = times[i];
      next = times[(i + 1) % times.length];
    }
  }
  return { current: current.key, next: next.key };
}

export default function PrayerClient({ initialCity, initialCountry, initialTimings }) {
  const [city, setCity] = useState(initialCity);
  const [country, setCountry] = useState(initialCountry);
  const [prayers, setPrayers] = useState(initialTimings);
  const [status, setStatus] = useState(() => initialTimings ? getCurrentAndNext(initialTimings) : null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cityInput, setCityInput] = useState("");
  const [countryInput, setCountryInput] = useState("");

  const fetchByUrl = useCallback(async (url, cacheKey, silent = false) => {
    const cached = getCached(cacheKey);
    if (cached) {
      setPrayers(cached);
      setStatus(getCurrentAndNext(cached));
      return true;
    }
    if (!silent) setLoading(true);
    setError("");
    try {
      const r = await fetch(url);
      const data = await r.json();
      if (data?.data?.timings) {
        setPrayers(data.data.timings);
        setStatus(getCurrentAndNext(data.data.timings));
        setCache(cacheKey, data.data.timings);
        return true;
      } else {
        if (!silent) setError("City not found. Check spelling and try again.");
      }
    } catch {
      if (!silent) setError("Network error. Please try again.");
    } finally {
      if (!silent) setLoading(false);
    }
    return false;
  }, []);

  // Seed cache with SSR data, then upgrade to precise coordinates via IP
  useEffect(() => {
    const ssrKey = makeKey({ city: initialCity, country: initialCountry });
    if (initialTimings) setCache(ssrKey, initialTimings);

    // Detect real location via IP — get lat/lon + country for accurate method selection
    fetch("https://ip-api.com/json/?fields=city,country,lat,lon")
      .then(r => r.json())
      .then(geo => {
        const c   = geo.city    || initialCity;
        const co  = geo.country || initialCountry;
        const lat = geo.lat;
        const lon = geo.lon;

        // Build coordinate-based URL for maximum accuracy
        const params = new URLSearchParams({ city: c, country: co });
        if (lat && lon) { params.set("lat", lat); params.set("lon", lon); }
        const url = `/api/prayer-times?${params.toString()}`;
        const key = makeKey({ city: c, country: co, lat: lat || "", lon: lon || "" });

        const isSameCity = c.toLowerCase() === initialCity.toLowerCase();

        if (!isSameCity || (lat && lon)) {
          // Different city OR we have precise coords — silently upgrade
          setCity(c);
          setCountry(co);
          fetchByUrl(url, key, true);
        }
      })
      .catch(() => {});
  }, [fetchByUrl, initialCity, initialCountry, initialTimings]);

  // Update prayer status every minute
  useEffect(() => {
    if (!prayers) return;
    const id = setInterval(() => setStatus(getCurrentAndNext(prayers)), 60000);
    return () => clearInterval(id);
  }, [prayers]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const c  = cityInput.trim();
    const co = countryInput.trim();
    if (!c) return;
    setCity(c);
    setCountry(co);
    const params = new URLSearchParams({ city: c, country: co });
    const key = makeKey({ city: c, country: co, lat: "", lon: "" });
    fetchByUrl(`/api/prayer-times?${params.toString()}`, key);
  };

  const date = new Date().toLocaleDateString("en-GB", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div style={{ minHeight: "100vh", background: "#040a0e", color: "#e8e0d0", fontFamily: "system-ui, sans-serif", padding: "24px 16px" }}>
      {/* Header */}
      <div style={{ maxWidth: 480, margin: "0 auto 28px" }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#fff", margin: 0 }}>☽ Prayer Times</h1>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", margin: "4px 0 0" }}>{date}</p>
      </div>

      {/* City/Country form */}
      <form onSubmit={handleSubmit} style={{ maxWidth: 480, margin: "0 auto 28px", display: "flex", gap: 8 }}>
        <input
          value={cityInput}
          onChange={e => setCityInput(e.target.value)}
          placeholder="City"
          style={inputStyle}
        />
        <input
          value={countryInput}
          onChange={e => setCountryInput(e.target.value)}
          placeholder="Country"
          style={inputStyle}
        />
        <button type="submit" disabled={loading} style={btnStyle(loading)}>
          {loading ? "..." : "Go"}
        </button>
      </form>

      {error && (
        <p style={{ maxWidth: 480, margin: "-12px auto 20px", fontSize: 13, color: "#f87171", textAlign: "center" }}>{error}</p>
      )}

      {/* Current location label */}
      {city && (
        <p style={{ maxWidth: 480, margin: "0 auto 16px", fontSize: 13, color: "rgba(255,255,255,0.35)", textAlign: "center" }}>
          Showing times for{" "}
          <strong style={{ color: "rgba(255,255,255,0.6)" }}>
            {city}{country ? `, ${country}` : ""}
          </strong>
        </p>
      )}

      {/* Prayer cards */}
      {prayers ? (
        <div style={{ maxWidth: 480, margin: "0 auto", display: "flex", flexDirection: "column", gap: 10 }}>
          {PRAYERS.map((p) => {
            const isCurrent = status?.current === p.key;
            const isNext    = status?.next === p.key;
            return (
              <div
                key={p.key}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "16px 20px", borderRadius: 16,
                  background: isCurrent ? "rgba(212,175,55,0.12)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${
                    isCurrent ? "rgba(212,175,55,0.4)"
                    : isNext  ? "rgba(16,185,129,0.3)"
                    :           "rgba(255,255,255,0.07)"
                  }`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ fontSize: 22 }}>{p.icon}</span>
                  <div>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: 15, color: isCurrent ? "#d4af37" : "#fff" }}>
                      {p.label}
                    </p>
                    {isCurrent && <span style={{ fontSize: 11, color: "#d4af37", fontWeight: 500 }}>Current</span>}
                    {isNext && !isCurrent && <span style={{ fontSize: 11, color: "#10b981", fontWeight: 500 }}>Next</span>}
                  </div>
                </div>
                <span style={{ fontFamily: "monospace", fontSize: 20, fontWeight: 700, letterSpacing: 1, color: isCurrent ? "#d4af37" : "rgba(255,255,255,0.9)" }}>
                  {prayers[p.key]?.slice(0, 5) || "—"}
                </span>
              </div>
            );
          })}
        </div>
      ) : loading ? (
        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: 14 }}>Loading...</p>
      ) : null}
    </div>
  );
}

const inputStyle = {
  flex: 1, background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12,
  padding: "10px 14px", color: "#fff", fontSize: 14, outline: "none", minWidth: 0,
};

const btnStyle = (disabled) => ({
  padding: "10px 18px", borderRadius: 12,
  background: disabled ? "rgba(16,185,129,0.3)" : "#10b981",
  color: "#fff", fontWeight: 600, fontSize: 14, border: "none",
  cursor: disabled ? "not-allowed" : "pointer", whiteSpace: "nowrap",
});
