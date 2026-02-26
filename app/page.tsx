import PrayerClient from "./components/PrayerClient";

async function getPrayerTimes(city: string, country: string) {
  try {
    const res = await fetch(
      `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=3`,
      { next: { revalidate: 3600 } }
    );
    const data = await res.json();
    return data?.data?.timings ?? null;
  } catch {
    return null;
  }
}

export default async function Home() {
  const initialTimings = await getPrayerTimes("Casablanca", "Morocco");
  return (
    <PrayerClient
      initialCity="Casablanca"
      initialCountry="Morocco"
      initialTimings={initialTimings}
    />
  );
}
