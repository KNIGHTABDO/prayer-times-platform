import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/firebase-admin";

export async function GET(req: NextRequest) {
  try {
    let db;
    try { db = await getDb(); } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 503 }); }
    const snap = await db.collection("subscribers").orderBy("createdAt", "desc").get();
    const subscribers = snap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ subscribers });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch subscribers." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id." }, { status: 400 });
  try {
    let db;
    try { db = await getDb(); } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 503 }); }
    await db.collection("subscribers").doc(id).delete();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Delete failed." }, { status: 500 });
  }
}
