import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

// Country → best calculation method mapping
// Method 3  = Muslim World League (global fallback)
// Method 5  = Egypt: General Authority of Survey
// Method 8  = Gulf Region
// Method 15 = North America: ISNA
// Method 16 = UAE: Ministry of Awqaf & Islamic Affairs
// Method 18 = Kuwait: Ministry of Awqaf
// Method 99 = Custom (used for Morocco, Algeria, Tunisia, etc.)
const COUNTRY_METHOD: Record<string, { method: number; params?: string; tune?: string }> = {
  // Morocco - Ministry of Habous official parameters
  Morocco: { method: 99, params: "19.1,null,17", tune: "0,0,0,5,0,7,0,0,0" },
  // Algeria - similar Maghreb parameters
  Algeria: { method: 99, params: "18,null,17", tune: "0,0,0,0,0,0,0,0,0" },
  // Tunisia
  Tunisia: { method: 3, tune: "0,0,0,0,0,0,0,0,0" },
  // Egypt
  Egypt: { method: 5 },
  // Saudi Arabia
  "Saudi Arabia": { method: 4 },
  // Kuwait
  Kuwait: { method: 9 },
  // UAE
  "United Arab Emirates": { method: 16 },
  // Turkey
  Turkey: { method: 13 },
  // Pakistan/Afghanistan (Karachi)
  Pakistan: { method: 1 },
  Afghanistan: { method: 1 },
  // France/Europe (UOIF)
  France: { method: 12 },
  // Default: MWL
};

function getMethodParams(country: string) {
  return COUNTRY_METHOD[country] ?? { method: 3 };
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const city    = searchParams.get("city")    || "Casablanca";
  const country = searchParams.get("country") || "Morocco";
  const lat     = searchParams.get("lat");
  const lon     = searchParams.get("lon");

  const { method, params, tune } = getMethodParams(country);

  try {
    let url: string;

    if (lat && lon) {
      // Coordinate-based endpoint — more accurate than city name
      const timestamp = Math.floor(Date.now() / 1000);
      url = `https://api.aladhan.com/v1/timings/${timestamp}?latitude=${lat}&longitude=${lon}&method=${method}`;
      if (params) url += `&methodSettings=${params}`;
      if (tune)   url += `&tune=${tune}`;
    } else {
      // City-name fallback
      url = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=${method}`;
      if (params) url += `&methodSettings=${params}`;
      if (tune)   url += `&tune=${tune}`;
    }

    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`Aladhan ${res.status}`);
    const data = await res.json();

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        "CDN-Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch prayer times" }, { status: 500 });
  }
}
