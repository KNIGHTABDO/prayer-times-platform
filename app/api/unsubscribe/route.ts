import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/firebase-admin";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  if (!email) return NextResponse.redirect(new URL("/", req.url));
  try {
    const db = await getDb();
    const snap = await db.collection("subscribers").where("email", "==", email.toLowerCase()).limit(1).get();
    if (!snap.empty) { await snap.docs[0].ref.delete(); }
    return NextResponse.redirect(new URL("/?unsubscribed=1", req.url));
  } catch {
    return NextResponse.redirect(new URL("/", req.url));
  }
}
