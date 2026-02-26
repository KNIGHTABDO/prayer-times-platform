import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prayer Times — أوقات الصلاة",
  description: "Live Islamic prayer times, Jummah countdowns, and weekly email reminders for Muslims worldwide.",
  keywords: ["prayer times", "salat", "jummah", "islamic", "muslim", "أوقات الصلاة"],
  openGraph: {
    title: "Prayer Times — أوقات الصلاة",
    description: "Never miss a prayer. Get live prayer times and weekly Jummah reminders.",
    type: "website",
  },
  themeColor: "#04090e",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className="bg-bg-base antialiased">
        {children}
      </body>
    </html>
  );
}
