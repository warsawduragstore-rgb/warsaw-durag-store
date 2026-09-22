# Warsaw Durag Store — Reguły Techniczne i Architektura

> Źródło: TECH_SPEC.md. Każdy punkt jest wymaganiem, nie sugestią.
> Priorytet #1: **wydajność i szybkość ładowania strony (Core Web Vitals)**.
> Priorytet #2: **brak generycznego, szablonowego wyglądu ("AI slop")** — streetwear, autentyczność, asymetria, mikrointerakcje.

## Zasady implementacji

1. **Stack**: Next.js App Router (w `wds-next`), TypeScript, Tailwind CSS, Postgres (Supabase/Neon) + Drizzle/Prisma, Stripe, InPost Geowidget v5, next-intl, Zustand + localStorage (`{ productId, variant, qty }`).
2. **Server Components domyślnie**: `"use client"` wyłącznie w liściach drzewa wymagających event listenerów / stanu UI.
3. **Statyczne generowanie / ISR**: `generateStaticParams` + `revalidate` dla produktów i katalogu.
4. **Obrazy**: Wyłącznie `next/image` ze zdefiniowanymi wymiarami/aspect ratio, format AVIF/WebP.
5. **Ceny i promocje (Kup 2, 3 gratis)**: Przeliczane WYŁĄCZNIE po stronie serwera w Server Action / API Route przed sesją Stripe. Nigdy nie ufać cenom z klienta. Trzecia sztuka jako gratis (`unit_amount: 0`).
6. **InPost Geowidget & Stripe.js**: Ładowane leniwie i wyłącznie na ścieżce `/checkout`.
7. **Brak niepotrzebnych bibliotek**: Zakaz całych bibliotek animacji, jeśli wystarcza Tailwind CSS transitions.
