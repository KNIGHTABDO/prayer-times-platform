import PrayerClient from "./components/PrayerClient";

// SSR: pre-fetch Casablanca using the accurate Morocco method
// (Fajr 19.1°, Isha 17°, Dhuhr+5min, Maghrib+7min — Ministry of Habous parameters)
async function getCasablancaPrayers() {
  try {
    const res = await fetch(
      "https://api.aladhan.com/v1/timingsByCity?city=Casablanca&country=Morocco&method=99&methodSettings=19.1,null,17&tune=0,0,0,5,0,7,0,0,0",
      { next: { revalidate: 3600 } }
    );
    const data = await res.json();
    return data?.data?.timings ?? null;
  } catch {
    return null;
  }
}

export default async function Home() {
  const initialTimings = await getCasablancaPrayers();
  return (
    <PrayerClient
      initialCity="Casablanca"
      initialCountry="Morocco"
      initialTimings={initialTimings}
    />
  );
}
