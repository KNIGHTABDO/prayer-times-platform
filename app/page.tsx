import PrayerClient from "./components/PrayerClient";

async function getCasablancaPrayers() {
  try {
    const res = await fetch(
      "https://api.aladhan.com/v1/timingsByCity?city=Casablanca&country=Morocco&method=3",
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
