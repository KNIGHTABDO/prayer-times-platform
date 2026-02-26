import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/firebase-admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, city, language } = body;

    if (!email || !city || !language) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    if (!["en", "fr", "ar"].includes(language)) {
      return NextResponse.json({ error: "Invalid language." }, { status: 400 });
    }

    let db;
    try {
      db = await getDb();
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 503 });
    }

    const existing = await db.collection("subscribers")
      .where("email", "==", email.toLowerCase())
      .limit(1)
      .get();

    if (!existing.empty) {
      return NextResponse.json({ error: "Already subscribed." }, { status: 409 });
    }

    await db.collection("subscribers").add({
      email: email.toLowerCase(),
      city,
      language,
      active: true,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Subscribe error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
