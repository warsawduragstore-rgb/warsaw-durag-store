# Warsaw Durag Store — specyfikacja techniczna dla AI/dewelopera

> Ten plik jest instrukcją dla asystenta/AI piszącego kod tego sklepu. Traktuj każdy punkt jako wymaganie, nie sugestię. Priorytet #1: **wydajność i szybkość ładowania strony**. Priorytet #2: brak generycznego, szablonowego wyglądu ("AI slop").

## 1. Stack technologiczny (wymagany)

- **Next.js (App Router)**, TypeScript, wyłącznie.
- Stylowanie: Tailwind CSS (bez ciężkich UI-kitów typu MUI/Ant — generują zbędny JS).
- Baza danych: Postgres (Supabase lub Neon) + Prisma lub Drizzle ORM.
- Płatności: Stripe (Checkout Session + webhooks).
- Dostawa: InPost Geowidget v5 (mapa Paczkomatów) w fazie 1; InPost Pay w fazie 2.
- i18n: `next-intl`.
- Hosting: Vercel (edge caching, automatyczna optymalizacja obrazów).
- Stan koszyka: Zustand + `localStorage`, **nie** Redux (zbędny narzut).

## 2. Twarde wymagania wydajnościowe

Cele Core Web Vitals — kod ma być pisany tak, żeby to osiągnąć, nie "zoptymalizowany później":

| Metryka | Cel |
|---|---|
| LCP (Largest Contentful Paint) | < 2.0s |
| INP (Interaction to Next Paint) | < 200ms |
| CLS (Cumulative Layout Shift) | < 0.1 |
| Rozmiar JS wysyłanego do klienta na stronie produktu | < 150KB (gzip) |
| Lighthouse Performance (mobile) | ≥ 90 |

### Zasady, których należy przestrzegać przy pisaniu każdego komponentu:

1. **Domyślnie Server Components.** `"use client"` tylko tam, gdzie faktycznie potrzebna jest interaktywność (koszyk, formularze, widget mapy). Nie oznaczać całych stron jako client.
2. **Statyczne generowanie / ISR** dla stron produktów i katalogu (`generateStaticParams` + `revalidate`), zamiast pełnego SSR przy każdym requeście.
3. **Obrazy wyłącznie przez `next/image`** — automatyczny lazy-loading, `srcset`, format AVIF/WebP. Zakaz `<img>` bez konwersji.
4. **Zero niepotrzebnych zależności.** Przed dodaniem paczki npm — sprawdzić rozmiar (bundlephobia). Zakaz dodawania bibliotek animacji typu Framer Motion na całą stronę, jeśli wystarczy CSS transition.
5. **Code splitting po trasie** — Next robi to automatycznie, ale nie importować całych bibliotek tam, gdzie potrzebny jest jeden fragment (np. `import { z } from 'zod'` ok, ale unikać `import _ from 'lodash'` — używać `lodash-es` z importem pojedynczej funkcji albo natywnego JS).
6. **Fonty:** `next/font` z self-hostingiem (nie Google Fonts CDN w `<link>`), `font-display: swap`, max 2 rodziny fontów, max 3 grubości.
7. **Third-party scripty** (analytics, piksele reklamowe) — ładowane przez `next/script` ze strategią `afterInteractive` lub `lazyOnload`, nigdy blokująco w `<head>`.
8. **Widget InPost Geowidget** — ładować dopiero na stronie `/checkout`, leniwie (nie na każdej podstronie), najlepiej w iframe/dynamic import, żeby nie obciążał strony głównej i katalogu.
9. **Stripe.js** — ładować dynamicznie tylko na `/checkout`, nigdy globalnie w layout.
10. **Baza/API:** paginacja katalogu (nie ładować wszystkich produktów naraz), indeksy na kolumnach używanych do filtrowania/sortowania.
11. **Cache:** nagłówki cache dla statycznych assetów, `revalidate` dla stron produktowych (np. co 60 min lub on-demand po edycji w panelu), edge caching na Vercel.
12. **CLS:** zawsze deklarować `width`/`height` (lub `aspect-ratio`) dla obrazów i wideo, rezerwować miejsce na banery/komunikaty ładowane asynchronicznie (np. cookie banner, promocje).
13. **Krytyczny CSS** — Tailwind + Next automatycznie to ogarnia (purge nieużywanych klas), ale pilnować, żeby nie importować całych plików CSS bibliotek UI.

## 3. Struktura stron

```
/                     - strona główna
/produkty             - katalog (z filtrami, paginacja)
/produkt/[slug]       - karta produktu
/koszyk               - osobna podstrona koszyka (localStorage)
/checkout             - wybór dostawy (Paczkomat) + płatność (Stripe)
/zamowienie/[id]      - potwierdzenie zamówienia
/regulamin
/polityka-prywatnosci
/zwroty
```

## 4. Koszyk — logika

- Stan koszyka w Zustand, persystowany do `localStorage` (middleware `persist`).
- Struktura pozycji: `{ productId, variant, qty }` — **nie** trzymać ceny w localStorage, tylko referencję do produktu.
- Przy wejściu na `/koszyk` i `/checkout` — dociągnąć aktualne ceny/dostępność z API (server action lub route handler), żeby uniemożliwić manipulację ceną w devtoolsach.

## 5. Promocja "kup 2, trzeci gratis"

- Logika **wyłącznie po stronie serwera** (server action / API route), nigdy nie ufać wartościom przesłanym z frontendu.
- Przy tworzeniu Stripe Checkout Session: backend przelicza `line_items`, dodając trzecią sztukę z `unit_amount: 0` i etykietą "GRATIS".
- Reguła aplikowana per produkt kwalifikujący się do promocji (dodać pole `promo_eligible: boolean` w tabeli produktów).

## 6. Płatności i dostawa

- Stripe Checkout Session tworzona przez server action, z metodami płatności: `card`, `blik`.
- Webhook `checkout.session.completed` — weryfikacja podpisu (`stripe-signature`), aktualizacja statusu zamówienia w bazie, wysyłka e-maila potwierdzającego (Resend), dekrement stanu magazynowego.
- InPost Geowidget v5 wpięty tylko na `/checkout`, wybrany Paczkomat zapisywany jako `pointId` przy zamówieniu.
- InPost Pay — do wdrożenia w fazie 2, po weryfikacji konta firmowego w panelu InPost Pay.

## 7. i18n

- `next-intl`, routing z prefiksem języka (`/pl/...`, `/en/...`).
- Treści produktów w bazie jako osobne kolumny/tabela `product_translations` (`locale`, `name`, `description`).
- Statyczne generowanie stron produktowych dla każdego języka (`generateStaticParams` po locale × slug).

## 8. Design — wymagania

- Zakaz: domyślne gradienty fioletowo-niebieskie, generyczne zaokrąglone karty z cieniem bez charakteru, stockowe ikony bez przemyślenia, font Inter/Poppins jako jedyny wybór, symetryczny 3-kolumnowy grid wszędzie.
- Wymagane: własna paleta (czerń/kontrast, estetyka streetwear), własna typografia z charakterem, prawdziwe zdjęcia produktowe (nie generowane), asymetryczne layouty, mikro-interakcje na hover/scroll zamiast fade-in.

## 9. Zgodność prawna (PL)

- Regulamin zgodny z ustawą o prawach konsumenta, formularz odstąpienia od umowy (14 dni).
- Polityka prywatności + zgodność z RODO.
- Cookie consent banner przed załadowaniem nieistotnych trackerów (analytics ładowany dopiero po zgodzie).

## 10. Nie zapomnieć

- E-maile transakcyjne (potwierdzenie zamówienia, status wysyłki).
- Blokada nadsprzedaży — dekrement stanu magazynowego przy opłaceniu, nie przy dodaniu do koszyka.
- Panel admina do zarządzania produktami/zamówieniami (rozważyć Payload CMS zamiast pisania od zera).
- SEO: meta tagi per język, sitemap, structured data (`Product` schema).
- Testy checkoutu na urządzeniach mobilnych — większość ruchu w tej branży to mobile.

## 11. Checklist przed wdrożeniem (performance audit)

- [ ] Lighthouse mobile ≥ 90 na stronie głównej, katalogu i karcie produktu
- [ ] Brak `"use client"` na stronach, które nie tego nie wymagają
- [ ] Wszystkie obrazy przez `next/image`
- [ ] Stripe.js i InPost Geowidget ładowane tylko tam, gdzie potrzebne
- [ ] Zero nieużywanych zależności w `package.json`
- [ ] Fonty self-hosted przez `next/font`
- [ ] Paginacja katalogu produktów
- [ ] CLS = 0 na stronach z dynamicznymi elementami (banery, promocje)
