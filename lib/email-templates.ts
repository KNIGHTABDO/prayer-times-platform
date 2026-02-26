export function getPrayerTimesHtml(params: {
  city: string;
  language: string;
  jummahTime: string;
  email: string;
}) {
  const { city, language, jummahTime, email } = params;

  const content = {
    en: {
      subject: "🕌 Jummah Reminder",
      greeting: "Assalamu Alaikum,",
      intro: `Jummah prayer this Friday in ${city} is at`,
      time_label: "Prayer Time",
      footer_note: "May Allah accept your prayers.",
      unsubscribe: "Unsubscribe",
      reminder: "Don't forget to read Surah Al-Kahf this Friday! 📖",
    },
    fr: {
      subject: "🕌 Rappel Jummah",
      greeting: "Assalamu Alaikum,",
      intro: `La prière du Jummah ce vendredi à ${city} est à`,
      time_label: "Heure de Prière",
      footer_note: "Qu'Allah accepte vos prières.",
      unsubscribe: "Se désabonner",
      reminder: "N'oubliez pas de lire Sourate Al-Kahf ce vendredi! 📖",
    },
    ar: {
      subject: "🕌 تذكير صلاة الجمعة",
      greeting: "السلام عليكم ورحمة الله وبركاته،",
      intro: `موعد صلاة الجمعة هذا الجمعة في ${city} هو الساعة`,
      time_label: "وقت الصلاة",
      footer_note: "تقبّل الله صلاتكم.",
      unsubscribe: "إلغاء الاشتراك",
      reminder: "لا تنسَ قراءة سورة الكهف هذا الجمعة! 📖",
    },
  };

  const c = content[language as keyof typeof content] || content.en;
  const dir = language === "ar" ? "rtl" : "ltr";
  const unsubUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "https://prayer-times-platform.vercel.app"}/api/unsubscribe?email=${encodeURIComponent(email)}`;

  return {
    subject: c.subject,
    html: `<!DOCTYPE html>
<html lang="${language}" dir="${dir}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${c.subject}</title>
</head>
<body style="margin:0;padding:0;background:#04090e;font-family:${language === "ar" ? "Georgia,serif" : "Inter,-apple-system,sans-serif"};">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#04090e;min-height:100vh;">
<tr><td align="center" style="padding:40px 16px;">
<table width="100%" style="max-width:520px;" cellpadding="0" cellspacing="0">

<!-- Header -->
<tr><td style="background:linear-gradient(135deg,#0a1520,#0d1f30);border-radius:20px 20px 0 0;padding:32px;text-align:center;border:1px solid rgba(212,175,55,0.2);border-bottom:none;">
  <div style="font-size:48px;margin-bottom:8px;">☽</div>
  <h1 style="margin:0;font-size:22px;color:#d4af37;font-weight:700;letter-spacing:0.05em;">أوقات الصلاة</h1>
  <p style="margin:4px 0 0;font-size:13px;color:rgba(255,255,255,0.4);letter-spacing:0.1em;">PRAYER TIMES</p>
</td></tr>

<!-- Geometric divider -->
<tr><td style="background:linear-gradient(90deg,transparent,rgba(212,175,55,0.4),transparent);height:1px;"></td></tr>

<!-- Body -->
<tr><td style="background:#0a1520;padding:32px;border:1px solid rgba(212,175,55,0.12);border-top:none;border-bottom:none;">
  <p style="color:rgba(255,255,255,0.8);font-size:15px;margin:0 0 20px;direction:${dir};">${c.greeting}</p>
  <p style="color:rgba(255,255,255,0.6);font-size:14px;margin:0 0 28px;line-height:1.6;direction:${dir};">${c.intro}:</p>

  <!-- Time box -->
  <div style="background:linear-gradient(135deg,rgba(16,185,129,0.1),rgba(212,175,55,0.08));border:1px solid rgba(212,175,55,0.3);border-radius:16px;padding:24px;text-align:center;margin-bottom:24px;">
    <p style="margin:0 0 8px;color:rgba(255,255,255,0.4);font-size:11px;text-transform:uppercase;letter-spacing:0.15em;">${c.time_label} — ${city}</p>
    <p style="margin:0;color:#f0cc55;font-size:52px;font-weight:700;font-family:monospace;letter-spacing:0.05em;">${jummahTime}</p>
    <p style="margin:8px 0 0;color:rgba(255,255,255,0.3);font-size:12px;">${new Date().toLocaleDateString(language === "ar" ? "ar-MA" : language === "fr" ? "fr-FR" : "en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
  </div>

  <div style="background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.2);border-radius:12px;padding:16px;margin-bottom:24px;">
    <p style="margin:0;color:rgba(255,255,255,0.7);font-size:13px;text-align:center;direction:${dir};">${c.reminder}</p>
  </div>

  <p style="margin:0;color:rgba(255,255,255,0.4);font-size:13px;text-align:center;direction:${dir};">${c.footer_note}</p>
</td></tr>

<!-- Footer -->
<tr><td style="background:#060e16;padding:20px 32px;text-align:center;border-radius:0 0 20px 20px;border:1px solid rgba(212,175,55,0.12);border-top:none;">
  <p style="margin:0 0 8px;color:rgba(255,255,255,0.2);font-size:11px;">© ${new Date().getFullYear()} Prayer Times Platform</p>
  <a href="${unsubUrl}" style="color:rgba(255,255,255,0.2);font-size:11px;text-decoration:underline;">${c.unsubscribe}</a>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`,
  };
}
