import { NextRequest, NextResponse } from "next/server";
import { getPrayerTimesHtml } from "@/lib/email-templates";

async function getJummahTime(city: string): Promise<string> {
  try {
    const res = await fetch(
      `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=&method=3`
    );
    const data = await res.json();
    return data?.data?.timings?.Jumu_ah || data?.data?.timings?.Dhuhr || "12:30";
  } catch {
    return "12:30";
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email, city, language } = await req.json();

    if (!email || !city || !language) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey || apiKey === "placeholder") {
      return NextResponse.json({ error: "Email service not configured yet. Set RESEND_API_KEY in environment variables." }, { status: 503 });
    }

    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);

    const jummahTime = await getJummahTime(city);
    const { subject, html } = getPrayerTimesHtml({ city, language, jummahTime, email });

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "Prayer Times <onboarding@resend.dev>",
      to: email,
      subject,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: (error as any).message }, { status: 500 });
    }

    return NextResponse.json({ success: true, messageId: data?.id });
  } catch (err) {
    console.error("Send email error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
