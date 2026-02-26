# 🕌 Prayer Times Platform

A full-stack Islamic prayer times platform built with Next.js 15, Firebase, Tailwind CSS, and Resend.

## Features

### 🌐 Public Site
- **Live prayer times** — auto-detect location via browser geolocation, fallback to manual city entry
- **Jummah countdown** — live timer to next Friday prayer
- **3-language support** — Arabic (RTL), French, English with instant toggle
- **Email subscription** — weekly Jummah reminder delivery via Resend
- **Beautiful Islamic design** — geometric patterns, gold/emerald palette, dark mode

### ⚙️ Admin Dashboard
- Password-protected admin panel (`/admin`)
- Subscriber stats (total, by language, top cities)
- Full subscriber table with search and filter
- Per-subscriber email send + preview modal
- Bulk send (all / by language)
- CSV export
- Delete subscribers

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS + Framer Motion |
| Database | Firebase Firestore |
| Email | Resend |
| Prayer API | Aladhan API |
| Hosting | Vercel |

## Setup

### 1. Firebase
1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Firestore** (Native mode)
3. Create a **Service Account**: Project Settings → Service Accounts → Generate New Private Key
4. Copy the credentials to your `.env.local`

### 2. Resend
1. Sign up at [resend.com](https://resend.com) (free tier: 100 emails/day)
2. Create an API key
3. Add your sending domain (or use the free `onboarding@resend.dev` for testing)

### 3. Environment variables

```bash
cp .env.example .env.local
# Fill in your values
```

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
RESEND_API_KEY=re_xxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@yourdomain.com
ADMIN_PASSWORD=your-secure-password
ADMIN_SECRET_KEY=your-32-char-secret-key
NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app
```

### 4. Run locally

```bash
npm install
npm run dev
```

### 5. Deploy to Vercel
```bash
vercel --prod
```
Add all env vars in Vercel dashboard → Settings → Environment Variables.

## Firestore Schema

**Collection: `subscribers`**

| Field | Type | Example |
|-------|------|---------|
| email | string | user@example.com |
| city | string | Casablanca |
| language | string | fr |
| active | boolean | true |
| createdAt | string (ISO) | 2026-02-26T12:00:00Z |

## License
MIT
