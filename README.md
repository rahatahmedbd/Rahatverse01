# 🌌 RahatVerse 2.0

> সর্বোচ্চ মানের ইন্টারঅ্যাকটিভ পোর্টফোলিও ও ওয়েবসাইট অর্ডারিং প্ল্যাটফর্ম

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16 + TypeScript + Tailwind CSS v4 |
| **Backend** | Supabase (Auth + DB + Storage + Realtime) |
| **Media** | Cloudinary |
| **Hosting** | Vercel |
| **Animation** | Framer Motion + GSAP + Lenis |
| **3D** | React Three Fiber (R3F) |
| **State** | Zustand |
| **i18n** | next-intl |
| **Icons** | Lucide React |

## 📂 Project Structure

```
src/
├── app/
│   ├── [locale]/          # Multi-language routes
│   │   ├── (marketing)/   # Public pages
│   │   ├── (dashboard)/   # Admin area
│   │   └── (auth)/        # Login/Register
│   ├── api/               # API routes
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Root redirect
│   └── globals.css        # Global styles
├── components/
│   ├── ui/                # Base UI components
│   ├── layout/            # Navbar, footer, bottom-nav
│   ├── sections/          # Page sections
│   ├── three/             # 3D components (R3F)
│   ├── animations/        # Animation wrappers
│   └── interactive/       # Gamified elements
├── lib/
│   ├── supabase/          # Supabase clients
│   ├── cloudinary/        # Media utils
│   ├── constants.ts       # App constants
│   └── utils.ts           # Utility functions
├── hooks/                 # Custom React hooks
├── store/                 # Zustand state management
├── i18n/                  # Translations (bn, en)
├── styles/                # Additional styles
├── types/                 # TypeScript type definitions
└── middleware.ts          # Auth + locale middleware
```

## 🚀 Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Type checking
npm run type-check
```

## 📋 Development Phases

| Phase | Name | Description |
|-------|------|-------------|
| 01 | জেনেসিস (Genesis) | Foundation setup |
| 02 | প্রিজম (Prism) | Design system |
| 03 | মোশন ক্যানভাস | Animation engine |
| 04 | দ্য বিগিনিং | Hero + Navigation |
| 05 | গল্পের পাতা | About + Education |
| 06 | কর্মভূমি | Experience + Services |
| 07 | স্মৃতির আলবাম | Gallery + Media |
| 08 | নিউরো নেটওয়ার্ক | Supabase Backend |
| 09 | বাবেল টাওয়ার | Multi-language |
| 10 | ড্রিম ফ্যাক্টরি | Ordering System |
| 11 | সংযোগ সেতু | Contact + Booking |
| 12 | কলমের আঁচড় | Blog + Resources |
| 13 | কমান্ড সেন্টার | Admin Dashboard |
| 14 | অ্যাপভার্স | PWA + Mobile |
| 15 | সার্চলাইট | Search + Legal |
| 16 | মিশন কন্ট্রোল | SEO + Deploy |
| 17 | ম্যাজিক টাচ | Interactive Extras |
| 18 | ক্রাউন জুয়েল | Final Launch |

## 👤 Author

**Rahat Ahmed** — রাহাত আহমেদ
- 📍 Sunamganj, Bangladesh
- 🎓 HSC Student (Science)
- 💻 Web Developer
- 🩸 Blood Donor (A+)
- 🎖️ BNCC Cadet

## 📄 License

Private project. All rights reserved.
