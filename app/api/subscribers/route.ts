import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";

export async function GET(req: NextRequest) {
  try {
    const snap = await db.collection("subscribers").orderBy("createdAt", "desc").get();
    const subscribers = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ subscribers });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch subscribers." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id." }, { status: 400 });
  try {
    await db.collection("subscribers").doc(id).delete();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Delete failed." }, { status: 500 });
  }
}
