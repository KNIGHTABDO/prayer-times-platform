"use client";
// @ts-nocheck
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Translations ────────────────────────────────────────────────────────────
const T = {
  en: {
    dir: "ltr",
    nav_title: "Prayer Times",
    nav_cta: "Subscribe",
    hero_pre: "🕌 Jummah Reminder Service",
    hero_title: "أوقات الصلاة",
    hero_subtitle: "Prayer Times",
    hero_desc: "Live prayer times for your city. Never miss Jummah — get a weekly reminder straight to your inbox.",
    countdown_label: "Next Jummah in",
    days: "Days", hours: "Hours", mins: "Mins", secs: "Secs",
    prayer_section: "Today's Prayers",
    prayer_city: "Prayer times for",
    change_city: "Change",
    fajr: "Fajr", dhuhr: "Dhuhr", asr: "Asr", maghrib: "Maghrib", isha: "Isha",
    subscribe_pre: "Never Miss Jummah",
    subscribe_title: "Get Weekly Reminders",
    subscribe_desc: "Receive the Jummah prayer time for your city every Friday morning, in your language.",
    email_label: "Email address",
    email_placeholder: "you@example.com",
    city_label: "Your city",
    city_placeholder: "e.g. Casablanca",
    lang_label: "Language preference",
    subscribe_btn: "Subscribe Free",
    subscribing: "Subscribing...",
    success_title: "You're in! بارك الله فيك 🎉",
    success_desc: "You'll receive your first Jummah reminder this Friday.",
    already_sub: "You're already subscribed with this email.",
    trust: "Free forever · Unsubscribe anytime · No spam",
    footer_tagline: "Built with ❤️ for the Muslim community.",
    footer_rights: "All rights reserved.",
    current: "Current", next: "Next",
    loading_prayers: "Updating location...",
    city_form_title: "Enter your city",
    city_form_btn: "Get Prayer Times",
  },
  fr: {
    dir: "ltr",
    nav_title: "Horaires de Prière",
    nav_cta: "S'abonner",
    hero_pre: "🕌 Service de Rappel Jummah",
    hero_title: "أوقات الصلاة",
    hero_subtitle: "Horaires de Prière",
    hero_desc: "Horaires de prière en direct pour votre ville. Ne ratez jamais le Jummah — recevez un rappel hebdomadaire.",
    countdown_label: "Prochain Jummah dans",
    days: "Jours", hours: "Heures", mins: "Min", secs: "Sec",
    prayer_section: "Prières du Jour",
    prayer_city: "Horaires pour",
    change_city: "Changer",
    fajr: "Fajr", dhuhr: "Dhohr", asr: "Asr", maghrib: "Maghrib", isha: "Ichaa",
    subscribe_pre: "Ne Ratez Plus le Jummah",
    subscribe_title: "Rappels Hebdomadaires",
    subscribe_desc: "Recevez l'heure du Jummah pour votre ville chaque vendredi matin, dans votre langue.",
    email_label: "Adresse email",
    email_placeholder: "vous@exemple.com",
    city_label: "Votre ville",
    city_placeholder: "ex: Casablanca",
    lang_label: "Langue préférée",
    subscribe_btn: "S'abonner Gratuitement",
    subscribing: "Inscription...",
    success_title: "C'est fait! بارك الله فيك 🎉",
    success_desc: "Vous recevrez votre premier rappel ce vendredi.",
    already_sub: "Vous êtes déjà abonné avec cet email.",
    trust: "Gratuit · Se désabonner à tout moment · Zéro spam",
    footer_tagline: "Fait avec ❤️ pour la communauté musulmane.",
    footer_rights: "Tous droits réservés.",
    current: "Actuelle", next: "Prochaine",
    loading_prayers: "Mise à jour...",
    city_form_title: "Entrez votre ville",
    city_form_btn: "Voir les Horaires",
  },
  ar: {
    dir: "rtl",
    nav_title: "أوقات الصلاة",
    nav_cta: "اشترك",
    hero_pre: "🕌 خدمة تذكير الجمعة",
    hero_title: "أوقات الصلاة",
    hero_subtitle: "مواقيت الصلاة",
    hero_desc: "مواقيت الصلاة الحية لمدينتك. لا تفوّت صلاة الجمعة — تلقّ تذكيراً أسبوعياً على بريدك.",
    countdown_label: "الجمعة القادمة بعد",
    days: "أيام", hours: "ساعات", mins: "دقائق", secs: "ثوان",
    prayer_section: "صلوات اليوم",
    prayer_city: "مواقيت",
    change_city: "تغيير",
    fajr: "الفجر", dhuhr: "الظهر", asr: "العصر", maghrib: "المغرب", isha: "العشاء",
    subscribe_pre: "لا تفوّت صلاة الجمعة",
    subscribe_title: "تذكيرات أسبوعية",
    subscribe_desc: "تلقّ موعد صلاة الجمعة لمدينتك كل جمعة صباحاً.",
    email_label: "البريد الإلكتروني",
    email_placeholder: "you@example.com",
    city_label: "مدينتك",
    city_placeholder: "مثال: الدار البيضاء",
    lang_label: "اللغة المفضلة",
    subscribe_btn: "اشترك مجاناً",
    subscribing: "جارٍ الاشتراك...",
    success_title: "تم التسجيل! بارك الله فيك 🎉",
    success_desc: "ستتلقى تذكيرك الأول هذا الجمعة.",
    already_sub: "هذا البريد مسجل مسبقاً.",
    trust: "مجاني دائماً · إلغاء الاشتراك في أي وقت · بدون رسائل مزعجة",
    footer_tagline: "بُني بـ ❤️ للمجتمع المسلم.",
    footer_rights: "جميع الحقوق محفوظة.",
    current: "الحالية", next: "القادمة",
    loading_prayers: "جارٍ التحديث...",
    city_form_title: "أدخل مدينتك",
    city_form_btn: "عرض المواقيت",
  },
};

const PRAYERS = [
  { key: "Fajr",    icon: "🌙", color: "#6366f1", tKey: "fajr"    },
  { key: "Dhuhr",   icon: "☀️", color: "#f59e0b", tKey: "dhuhr"   },
  { key: "Asr",     icon: "🌤️", color: "#10b981", tKey: "asr"     },
  { key: "Maghrib", icon: "🌅", color: "#f97316", tKey: "maghrib"  },
  { key: "Isha",    icon: "🌌", color: "#8b5cf6", tKey: "isha"     },
];

const CACHE_KEY = "pt_cache";
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

function getCached(city: string, country: string) {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const cache = JSON.parse(raw);
    const key = `${city}__${country}`.toLowerCase();
    const entry = cache[key];
    if (!entry) return null;
    if (Date.now() - entry.ts > CACHE_TTL) return null;
    return entry.timings;
  } catch { return null; }
}

function setCache(city: string, country: string, timings: any) {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    const cache = raw ? JSON.parse(raw) : {};
    const key = `${city}__${country}`.toLowerCase();
    cache[key] = { timings, ts: Date.now() };
    const keys = Object.keys(cache);
    if (keys.length > 5) delete cache[keys[0]];
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {}
}

function getTimeUntilJummah() {
  const now = new Date();
  const next = new Date(now);
  const daysUntilFriday = (5 - now.getDay() + 7) % 7 || 7;
  next.setDate(now.getDate() + daysUntilFriday);
  next.setHours(12, 30, 0, 0);
  const diff = next.getTime() - now.getTime();
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    mins: Math.floor((diff % 3600000) / 60000),
    secs: Math.floor((diff % 60000) / 1000),
    total: diff,
  };
}

function getCurrentPrayer(timings: any) {
  const now = new Date();
  const nowMins = now.getHours() * 60 + now.getMinutes();
  const times = PRAYERS.map((p) => {
    const t = timings[p.key] || "00:00";
    const [h, m] = t.split(":").map(Number);
    return { ...p, mins: h * 60 + m };
  }).sort((a, b) => a.mins - b.mins);

  let current = times[times.length - 1];
  let next = times[0];
  for (let i = 0; i < times.length; i++) {
    if (nowMins >= times[i].mins) {
      current = times[i];
      next = times[(i + 1) % times.length];
    }
  }
  return { current: current.key, next: next.key };
}

export default function Home() {
  const [lang, setLang] = useState("fr");
  const [jummah, setJummah] = useState(getTimeUntilJummah());
  const [city, setCity] = useState("Casablanca");
  const [country, setCountry] = useState("Morocco");
  const [prayers, setPrayers] = useState<any>(null);
  const [prayerStatus, setPrayerStatus] = useState<any>(null);
  const [loadingPrayers, setLoadingPrayers] = useState(false);
  const [cityInput, setCityInput] = useState("");
  const [showCityForm, setShowCityForm] = useState(false);
  const [subEmail, setSubEmail] = useState("");
  const [subCity, setSubCity] = useState("");
  const [subLang, setSubLang] = useState("fr");
  const [subLoading, setSubLoading] = useState(false);
  const [subSuccess, setSubSuccess] = useState(false);
  const [subError, setSubError] = useState("");
  const [scrolled, setScrolled] = useState(false);

  const t = T[lang];

  useEffect(() => {
    const id = setInterval(() => setJummah(getTimeUntilJummah()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const fetchPrayersByCity = useCallback(async (c: string, co: string, silent = false) => {
    const cached = getCached(c, co);
    if (cached) {
      setPrayers(cached);
      setPrayerStatus(getCurrentPrayer(cached));
      return;
    }
    if (!silent) setLoadingPrayers(true);
    try {
      const r = await fetch(`/api/prayer-times?city=${encodeURIComponent(c)}&country=${encodeURIComponent(co)}`);
      const data = await r.json();
      if (data?.data?.timings) {
        setPrayers(data.data.timings);
        setPrayerStatus(getCurrentPrayer(data.data.timings));
        setCache(c, co, data.data.timings);
      }
    } catch {}
    if (!silent) setLoadingPrayers(false);
  }, []);

  useEffect(() => {
    fetchPrayersByCity("Casablanca", "Morocco", true).then(() => {
      fetch("https://ip-api.com/json/?fields=city,country,countryCode")
        .then((r) => r.json())
        .then((geo) => {
          const detectedCity = geo.city || "Casablanca";
          const detectedCountry = geo.country || "Morocco";
          if (detectedCity.toLowerCase() !== "casablanca") {
            setCity(detectedCity);
            setCountry(detectedCountry);
            fetchPrayersByCity(detectedCity, detectedCountry, true);
          }
        })
        .catch(() => {});
    });
  }, [fetchPrayersByCity]);

  const handleCityChange = (e: any) => {
    e.preventDefault();
    if (!cityInput.trim()) return;
    setCity(cityInput.trim());
    setShowCityForm(false);
    setCityInput("");
    fetchPrayersByCity(cityInput.trim(), "");
  };

  const handleSubscribe = async (e: any) => {
    e.preventDefault();
    setSubError("");
    if (!subEmail || !subCity) return;
    setSubLoading(true);
    try {
      const r = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: subEmail, city: subCity, language: subLang }),
      });
      const data = await r.json();
      if (!r.ok) {
        if (r.status === 409) setSubError(t.already_sub);
        else setSubError(data.error || "Something went wrong.");
      } else {
        setSubSuccess(true);
      }
    } catch {
      setSubError("Network error. Please try again.");
    }
    setSubLoading(false);
  };

  const countdownParts = [
    { label: t.days,  val: jummah.days  },
    { label: t.hours, val: jummah.hours },
    { label: t.mins,  val: jummah.mins  },
    { label: t.secs,  val: jummah.secs  },
  ];

  return (
    <div className="min-h-screen bg-bg-base pattern-bg" dir={t.dir}>
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-emerald-dark/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-gold/4 rounded-full blur-[100px]" />
      </div>

      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "glass shadow-card" : "bg-transparent"}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">☽</span>
            <span className="font-semibold text-white text-sm sm:text-base">{t.nav_title}</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center bg-bg-card/80 rounded-full p-0.5 border border-gold/10">
              {["en", "fr", "ar"].map((l) => (
                <button key={l} onClick={() => setLang(l)}
                  className={`px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    lang === l ? "bg-gold text-bg-base" : "text-white/50 hover:text-white/80"
                  }`}>
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <a href="#subscribe" className="hidden sm:block px-4 py-2 rounded-full bg-emerald text-white text-xs font-semibold hover:bg-emerald-dark transition-all">
              {t.nav_cta}
            </a>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 pt-16">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald/10 border border-emerald/25 text-emerald text-xs font-medium mb-6">
              {t.hero_pre}
            </div>
            <div className="mb-2">
              <h1 className="font-arabic text-6xl sm:text-8xl font-bold gold-shimmer leading-tight">{t.hero_title}</h1>
            </div>
            <h2 className="text-xl sm:text-3xl font-semibold text-white/80 mb-4">{t.hero_subtitle}</h2>
            <p className="text-white/50 text-sm sm:text-base max-w-xl mx-auto mb-10 leading-relaxed">{t.hero_desc}</p>

            <div className="glass rounded-3xl p-6 sm:p-8 mb-8 glow-gold max-w-lg mx-auto">
              <p className="text-gold/70 text-xs font-medium tracking-widest uppercase mb-5">{t.countdown_label}</p>
              <div className="grid grid-cols-4 gap-3">
                {countdownParts.map(({ label, val }) => (
                  <div key={label} className="bg-bg-base/60 rounded-2xl p-3 sm:p-4">
                    <AnimatePresence mode="wait">
                      <motion.div key={val} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.2 }} className="text-2xl sm:text-4xl font-bold text-white font-mono tabular-nums">
                        {String(val).padStart(2, "0")}
                      </motion.div>
                    </AnimatePresence>
                    <div className="text-gold/50 text-[10px] mt-1 uppercase tracking-wide">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            <a href="#subscribe" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-emerald text-white font-semibold hover:bg-emerald-dark transition-all hover:scale-105 active:scale-95 shadow-emerald glow-emerald text-sm sm:text-base">
              {t.nav_cta} →
            </a>
          </motion.div>

          <div className="absolute right-8 top-24 text-6xl sm:text-8xl text-gold/8 animate-float select-none pointer-events-none">☽</div>
          <div className="absolute left-4 bottom-24 text-4xl text-emerald/8 animate-float select-none pointer-events-none" style={{ animationDelay: "2s" }}>✦</div>
        </section>

        <section className="py-16 sm:py-24 px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
              <p className="text-gold/60 text-xs tracking-widest uppercase mb-2">{t.prayer_section}</p>
              <div className="flex items-center justify-center gap-2">
                <h2 className="text-2xl sm:text-4xl font-bold text-white">{t.prayer_city} {city}</h2>
                <button onClick={() => setShowCityForm(!showCityForm)}
                  className="text-emerald text-xs font-medium hover:text-emerald-dark transition-colors border border-emerald/30 rounded-full px-2.5 py-0.5">
                  {t.change_city}
                </button>
              </div>
            </motion.div>

            <AnimatePresence>
              {showCityForm && (
                <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                  onSubmit={handleCityChange} className="flex gap-2 max-w-sm mx-auto mb-8 overflow-hidden">
                  <input value={cityInput} onChange={(e) => setCityInput(e.target.value)} placeholder={t.city_placeholder}
                    className="flex-1 bg-bg-card border border-gold/20 rounded-xl px-4 py-2.5 text-white placeholder-white/25 focus:outline-none focus:border-gold/50 text-sm" />
                  <button type="submit" className="px-4 py-2.5 rounded-xl bg-emerald text-white text-sm font-medium hover:bg-emerald-dark transition-all">
                    {t.city_form_btn}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            {loadingPrayers ? (
              <div className="text-center py-10">
                <div className="inline-block text-4xl animate-spin mb-3">☽</div>
                <p className="text-white/40 text-sm">{t.loading_prayers}</p>
              </div>
            ) : prayers ? (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {PRAYERS.map((p, i) => {
                  const isCurrent = prayerStatus?.current === p.key;
                  const isNext = prayerStatus?.next === p.key;
                  return (
                    <motion.div key={p.key} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                      className={`glass rounded-2xl p-4 sm:p-5 text-center transition-all ${
                        isCurrent ? "prayer-active" : isNext ? "prayer-next" : ""
                      }`}
                      style={isCurrent ? { borderColor: `${p.color}60` } : isNext ? { borderColor: "rgba(16,185,129,0.4)" } : {}}>
                      <div className="text-2xl sm:text-3xl mb-2">{p.icon}</div>
                      <p className="font-arabic text-sm sm:text-base mb-0.5" style={{ color: isCurrent ? p.color : "rgba(255,255,255,0.7)" }}>
                        {t[p.tKey]}
                      </p>
                      <p className="text-white/40 text-xs font-medium">{p.key}</p>
                      <p className="text-white font-bold text-sm sm:text-lg mt-2 font-mono">{prayers[p.key]?.slice(0, 5) || "—"}</p>
                      {isCurrent && (
                        <span className="mt-2 inline-block text-[10px] px-2 py-0.5 rounded-full" style={{ background: `${p.color}20`, color: p.color }}>
                          {t.current}
                        </span>
                      )}
                      {isNext && !isCurrent && (
                        <span className="mt-2 inline-block text-[10px] px-2 py-0.5 rounded-full bg-emerald/15 text-emerald">{t.next}</span>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            ) : null}
          </div>
        </section>

        <section id="subscribe" className="py-16 sm:py-24 px-4">
          <div className="max-w-2xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
              <p className="text-emerald text-xs tracking-widest uppercase mb-2">{t.subscribe_pre}</p>
              <h2 className="text-3xl sm:text-5xl font-bold text-white mb-3">{t.subscribe_title}</h2>
              <p className="text-white/50 text-sm">{t.subscribe_desc}</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
              className="gradient-border rounded-3xl p-6 sm:p-8 glow-emerald">
              <AnimatePresence mode="wait">
                {subSuccess ? (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
                    <div className="text-5xl mb-4">🎉</div>
                    <h3 className="font-bold text-xl text-white mb-2">{t.success_title}</h3>
                    <p className="text-white/60 text-sm">{t.success_desc}</p>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={handleSubscribe} className="space-y-4">
                    <div>
                      <label className="block text-white/60 text-xs font-medium uppercase tracking-widest mb-1.5">{t.email_label}</label>
                      <input type="email" value={subEmail} onChange={(e) => setSubEmail(e.target.value)} required
                        placeholder={t.email_placeholder}
                        className="w-full bg-bg-base/60 border border-white/8 rounded-xl px-4 py-3 text-white placeholder-white/25 focus:outline-none focus:border-gold/40 transition-all text-sm" />
                    </div>
                    <div>
                      <label className="block text-white/60 text-xs font-medium uppercase tracking-widest mb-1.5">{t.city_label}</label>
                      <input type="text" value={subCity} onChange={(e) => setSubCity(e.target.value)} required
                        placeholder={t.city_placeholder}
                        className="w-full bg-bg-base/60 border border-white/8 rounded-xl px-4 py-3 text-white placeholder-white/25 focus:outline-none focus:border-gold/40 transition-all text-sm" />
                    </div>
                    <div>
                      <label className="block text-white/60 text-xs font-medium uppercase tracking-widest mb-2">{t.lang_label}</label>
                      <div className="flex gap-2">
                        {[{k:"en",l:"English"},{k:"fr",l:"Français"},{k:"ar",l:"العربية"}].map(({ k, l }) => (
                          <button key={k} type="button" onClick={() => setSubLang(k)}
                            className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                              subLang === k ? "bg-emerald text-white" : "glass text-white/50 hover:text-white/80"
                            }`}>{l}
                          </button>
                        ))}
                      </div>
                    </div>
                    {subError && <p className="text-red-400 text-xs text-center">{subError}</p>}
                    <button type="submit" disabled={subLoading}
                      className={`w-full py-4 rounded-xl font-semibold text-sm transition-all ${
                        subLoading ? "bg-emerald/30 text-white/40 cursor-not-allowed" : "bg-emerald text-white hover:bg-emerald-dark active:scale-[0.98] shadow-emerald"
                      }`}>
                      {subLoading ? t.subscribing : t.subscribe_btn}
                    </button>
                    <p className="text-center text-white/25 text-xs">{t.trust}</p>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>

        <section className="py-12 sm:py-20 px-4">
          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: "🕌", title: "5 Daily Prayers", desc: "Accurate times for Fajr, Dhuhr, Asr, Maghrib & Isha based on your exact location." },
              { icon: "📬", title: "Jummah Reminders", desc: "Receive the Friday prayer time every week in Arabic, French, or English." },
              { icon: "🌍", title: "Any City, Worldwide", desc: "Works for any city on earth. Change your city anytime with one click." },
            ].map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="glass rounded-2xl p-6 text-center">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-8 px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-gold text-lg">☽</span>
          <span className="text-white/60 text-sm">{t.footer_tagline}</span>
        </div>
        <p className="text-white/25 text-xs">© {new Date().getFullYear()} Prayer Times. {t.footer_rights}</p>
        <div className="mt-3 flex items-center justify-center gap-4">
          <a href="/admin/login" className="text-white/15 text-xs hover:text-white/30 transition-colors">Admin</a>
        </div>
      </footer>
    </div>
  );
}
