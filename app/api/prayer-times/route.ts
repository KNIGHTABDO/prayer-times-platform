import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge"; // Edge runtime = much faster cold starts

export async function GET(req: NextRequest) {
  const city = req.nextUrl.searchParams.get("city") || "Casablanca";
  const country = req.nextUrl.searchParams.get("country") || "Morocco";
  const method = req.nextUrl.searchParams.get("method") || "3";

  try {
    const url = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=${method}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error("Aladhan error");
    const data = await res.json();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        "CDN-Cache-Control": "public, max-age=3600",
      },
    });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch prayer times" }, { status: 500 });
  }
}
