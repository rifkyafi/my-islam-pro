<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project: my-islam-pro — Hadith & Quran learning app

## Key Architecture
- `app/hadis/page.tsx` — SSG page (`○ /hadis`), async server component that fetches book list at build time, wraps `<HadisClientView>` in `<Suspense>`
- `app/hadis/HadisClientView.tsx` — "use client" — renders sidebar + hadith content; book/page derived from `useSearchParams()` (NOT state); single `useEffect` fetch with `requestedRef` stale guard; hash scroll detection with staggered retries (100/300/600/1000/2000/4000ms)
- `app/pages/components/AIModal.tsx` — "use client" — chat UI with `linkifyReferences()` that converts hadith references in AI response text to markdown links; custom `a` component uses `router.push(href)` (NOT `window.location.href`) for client-side navigation
- `app/api/chat/route.ts` — proxies Groq API; system prompt with hadith format `[Label](/hadis?book=[id]&page=[Halaman]#hadith-[Nomor])` where Halaman = ceil(Nomor/50)
- `app/api/hadits/route.ts` — proxies `api.hadith.gading.dev` with `?id=` and `?range=` params

## Critical Gotchas
1. **SSG + `useSearchParams`**: Page `○ /hadis` is prerendered static. First client render has empty `searchParams` → falls back to first book + page 1. Then async update triggers correct fetch. Use `requestedRef` guard to ignore stale responses.
2. **`router.push` NOT `window.location.href`**: Always use `router.push(href)` for AI hadith links — full page reload clears hash and causes wasted SSG hydration cycle. `router.push` preserves hash and gives immediate `searchParams`.
3. **Hash detection**: Staggered retries because data loads async. Effect re-fires when `activeBookId | activePage | bookData` changes. Depends on `window.location.hash` — ensure hash survives navigation.
4. **`linkifyReferences`**: Runs on AI response text BEFORE ReactMarkdown parsing. Handles both plain text references (`HR. Muslim No. 125`) and existing markdown links. Injects `&page=XX` when missing. Book name → ID mapping in `bookNameToId` dict.
5. **System prompt categories**: A(Iman) B(Ibadah) C(Akhlak) D(Keluarga) E(Muamalah) F(Motivasi) G(Kisah) H(Al-Qur'an) — each with suggested Surahs and Hadith books. AI MUST explain hadith meaning/context after citing.
6. **Sidebar**: Matches Quran UI — badge number in circle, kitab name, hadith count subtitle, backdrop-blur. `handleBookChange` uses `router.push(href, { scroll: false })`.
7. **Mini pagination removed** from sidebar (only bottom-of-page pagination remains).
8. **Dark/Light mode**: Custom `ThemeProvider` in `app/pages/components/ThemeProvider.tsx` (no external library). Uses inline `<script>` in `<head>` to set class before hydration (no flash). `html.dark` CSS selector in `globals.css` overrides `:root` CSS variables. Toggle button in `NavBar.tsx` (`ThemeToggle` component). Default follows system `prefers-color-scheme`. Add `suppressHydrationWarning` to `<html>`.
9. **Homepage animations**: Uses `motion/react` (v12.40.0) with `Variants` type for container stagger + children animations. Key sections animated: HeroSection (staggered fade-up), ThemesSection (staggered card grid), StatsStrip (staggered items), FeaturedHadith (fade-in), CtaBanner (fly-in). All use `whileInView` with `viewport: { once: true }` for scroll-triggered animations. Import pattern: `import { motion, type Variants } from 'motion/react'`.
