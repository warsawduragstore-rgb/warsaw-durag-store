# SEO – zadania dla agenta (Warsaw Durag Store)

> Plik dla Google Antigravity. Umieść w katalogu głównym repozytorium (np. jako `SEO_AUDIT_TASKS.md`) i poproś agenta: *„Przeczytaj SEO_AUDIT_TASKS.md, zaproponuj plan, a potem wykonuj zadania po kolei, zaczynając od Fazy 0.”*

## Kontekst

- Projekt: sklep internetowy z duragami (ręcznie szyte, jedwab morwowy 19 momme, satyna, welur, materiały sezonowe), Warszawa, rynek polski.
- Domeny: `warsawduragstore.com` i `warsawduragstore.pl`.
- Stan obecny (wynik audytu strony głównej):
  - cała witryna to **jedna strona** – menu, blog, regulamin, polityka prywatności, kontakt i „O nas” to kotwice `#` lub sekcje w tym samym HTML-u; jedyny osobny URL to `/koszyk`,
  - `canonical`, `og:url`, `og:image` wskazują na `.pl`, a obrazy, logo i koszyk ładują się z `.com`,
  - przełącznik 7 języków (PL, EN, DE, FR, ES, CZ, LT) bez widocznych osobnych URL-i i `hreflang`,
  - brak widocznego JSON-LD,
  - powtarzające się lub placeholderowe zdjęcia produktów,
  - niespójne informacje (czas wysyłki, produkty wspomniane w tekście, ale nieobecne w siatce).

## Zasady pracy agenta

1. **Najpierw zbadaj repozytorium**: ustal stack (statyczny HTML/JS, framework, generator), strukturę katalogów, sposób renderowania treści i obsługi koszyka. Nie zakładaj technologii.
2. Przedstaw krótki plan (lista plików do zmiany/utworzenia) i dopiero potem wprowadzaj zmiany.
3. Zmiany rób małymi, osobnymi commitami (jeden temat = jeden commit).
4. **Nie wymyślaj** danych firmowych (NIP, KRS, adres prawny), opinii klientów, ocen ani cen. Tam, gdzie brakuje danych, wstaw wyraźny placeholder `TODO:` i wypisz go w podsumowaniu.
5. Nie usuwaj istniejącej treści merytorycznej (opisy tkanin, przewodnik 360 waves, Duragopedia) – przenieś ją na właściwe podstrony.
6. Zachowaj działanie koszyka i procesu zamówienia; po zmianach sprawdź, że dodawanie do koszyka i checkout nadal działają.
7. Wszystkie URL-e absolutne (canonical, og:url, sitemap, JSON-LD) używają **jednej domeny głównej** (patrz Faza 0).

## Definicja ukończenia (dla każdego zadania)

- Zmiana działa lokalnie, bez błędów w konsoli.
- Każda nowa podstrona ma: unikalny `<title>`, `<meta name="description">`, jeden `<h1>`, `canonical`, poprawne `lang="pl"`.
- Brak martwych linków i linków typu `href="#"` w nawigacji i stopce.
- Agent zapisuje krótkie podsumowanie: co zrobiono, co wymaga decyzji człowieka (`TODO:`).

---

## Faza 0 – Decyzja domenowa (blokuje resztę)

**Zadanie 0.1** – Zapytaj użytkownika, która domena ma być główna (rekomendacja: `https://warsawduragstore.pl`). Do czasu odpowiedzi nie zmieniaj adresów absolutnych.

**Zadanie 0.2** – Po decyzji:
- ustaw przekierowanie 301 z domeny drugorzędnej na główną (zależnie od hostingu: `_redirects`, `netlify.toml`, `vercel.json`, `.htaccess`, konfiguracja serwera – ustal po zbadaniu repo),
- ujednolić wszystkie adresy absolutne w kodzie (canonical, og:url, og:image, linki do assetów i koszyka) do domeny głównej,
- wymuś HTTPS i jedną wersję hosta (z `www` albo bez – spójnie).

**Kryterium:** żaden plik w repo nie zawiera mieszanki `.com` i `.pl` (poza komentarzem dokumentującym przekierowanie).

---

## Faza 1 – Struktura URL (największy wpływ)

**Zadanie 1.1 – Podstrony.** Wydziel z jednostronicowego HTML-a osobne strony. Proponowana struktura (dostosuj do stacku):

| URL | Zawartość |
|---|---|
| `/` | strona główna: hero, wyróżnione produkty, skrót „O nas”, linki do kategorii |
| `/kolekcja/` | wszystkie produkty |
| `/kolekcja/jedwabne/` | duragi jedwabne |
| `/kolekcja/satynowe/` | duragi satynowe |
| `/kolekcja/welurowe/` | duragi welurowe |
| `/kolekcja/sezonowe/` | len, cupro, krepa satynowa |
| `/kolekcja/akcesoria/` | akcesoria |
| `/produkt/<slug>/` | karta produktu (po jednej na produkt) |
| `/blog/` | lista artykułów Duragopedii |
| `/blog/<slug>/` | pojedynczy artykuł |
| `/o-nas/` | historia założycieli |
| `/kontakt-i-odbior-osobisty/` | kontakt, punkty odbioru, mapa |
| `/dostawa-i-zwroty/` | dostawa, zwroty, czas wysyłki |
| `/tabela-rozmiarow-i-tkanin/` | rozmiary i materiały |
| `/regulamin/` | regulamin |
| `/polityka-prywatnosci/` | polityka prywatności i RODO |
| `/koszyk` | koszyk (istnieje) |

**Zadanie 1.2 – Nawigacja.** Zamień wszystkie kotwice `#kolekcja`, `#o-nas`, `#` w menu, stopce i kartach na prawdziwe linki do powyższych podstron. Zachowaj płynne przewijanie tylko tam, gdzie kotwica jest naprawdę potrzebna (np. skok do sekcji na tej samej stronie).

**Zadanie 1.3 – Artykuły blogu.** Przenieś sześć artykułów jako osobne strony:
1. Czym są 360 waves? Kompleksowy przewodnik dla początkujących → `/blog/fale-360-przewodnik/`
2. Durag w sporcie – siłownia, deskorolka i motocykl → `/blog/durag-w-sporcie/`
3. Ochrona włosów podczas snu i jazdy autem → `/blog/ochrona-wlosow-sen-jazda/`
4. Z czym ubrać durag? Stylizacje streetwear i eleganckie → `/blog/z-czym-ubrac-durag/`
5. Różnice między duragiem, bandaną i czepkiem → `/blog/durag-bandana-czepek-roznice/`
6. Pochodzenie duraga i fenomen kulturowy → `/blog/pochodzenie-duraga/`

Każdy artykuł: pełna treść (rozwiń istniejące zajawki do wartościowych tekstów 600–1200 słów lub zostaw `TODO:` z outline), wewnętrzne linki do odpowiednich produktów i kategorii, breadcrumbs.

**Zadanie 1.4 – Sitemap i robots.**
- wygeneruj `sitemap.xml` ze wszystkimi indeksowalnymi URL-ami (bez `/koszyk`),
- utwórz/uzupełnij `robots.txt`: zezwól na crawl, zablokuj `/koszyk` i ewentualne ścieżki techniczne, dodaj linię `Sitemap: https://<domena-główna>/sitemap.xml`.

**Kryterium:** każdy produkt, kategoria i artykuł ma własny, dostępny po wejściu URL i znajduje się w sitemap.

---

## Faza 2 – Meta tagi i nagłówki

**Zadanie 2.1 – Title/description per strona.** Zasady: title do ~60 znaków, description 140–160 znaków, bez duplikatów, zawierają frazę główną strony. Przykłady dla strony głównej i kategorii (do dopracowania):

- `/` – title: `Durag jedwabny, satynowy, welurowy – sklep Warszawa | Warsaw Durag Store`
- `/` – description: `Ręcznie szyte duragi z jedwabiu morwowego 19 momme, satyny i weluru. Darmowa dostawa w Polsce, wysyłka z Warszawy, odbiór osobisty. Od 79 zł.`
- `/kolekcja/jedwabne/` – title: `Durag jedwabny 19 momme – kup w Warsaw Durag Store`
- `/kolekcja/satynowe/` – title: `Durag satynowy – ręcznie szyty w Polsce`

**Zadanie 2.2 – H1.** Zmień H1 strony głównej z „Ręcznie szyte. Stworzone do ruchu.” na wariant zawierający słowo kluczowe, np. `Duragi szyte ręcznie w Polsce`; dotychczasowe hasło zostaje jako podtytuł (`<p>`). Zachowaj hierarchię H1 → H2 → H3, jeden H1 na stronę.

**Zadanie 2.3 – Social/Open Graph.** Dodaj komplet OG i Twitter Card na każdej stronie (`og:title`, `og:description`, `og:image`, `og:url`, `og:type`, `twitter:card=summary_large_image`). Dla produktów `og:image` = zdjęcie produktu 1200×630; dla strony głównej – zdjęcie produktowe zamiast samego logo.

---

## Faza 3 – Dane strukturalne (JSON-LD)

**Zadanie 3.1** – Dodaj JSON-LD i zwaliduj składnię:

- `Organization` (nazwa, URL, logo, `sameAs` → Instagram `@warsawduragstore`, kontakt `support@warsawduragstore.pl`),
- `WebSite`,
- `BreadcrumbList` na podstronach,
- `Product` + `Offer` na każdej karcie produktu: nazwa, opis, zdjęcia, `sku`, `brand`, `price` + `priceCurrency=PLN`, `availability`, `shippingDetails` (darmowa dostawa w PL), `hasMerchantReturnPolicy` (14 dni),
- `Article` na artykułach blogu (autor, data publikacji, obraz),
- `FAQPage` na `/dostawa-i-zwroty/` (tylko dla pytań faktycznie obecnych na stronie).

**Zadanie 3.2 – Uwaga o ocenach.** **Nie dodawaj** `AggregateRating` ani `Review`, dopóki w sklepie nie istnieją prawdziwe, zweryfikowane opinie. Jeśli widget „★★★★★ 5.0” jest statycznym szablonem, usuń go z widoku albo oznacz `TODO:` do podmiany na prawdziwe opinie.

**Kryterium:** zero błędów w Rich Results Test i Schema Markup Validator dla stron produktu.

---

## Faza 4 – Obrazy i wydajność

**Zadanie 4.1 – Unikalne zdjęcia.** Obecnie ten sam plik `durag_silk_champagne.webp` jest użyty przy Milanówku (detal), Wrocławiu i Żyrardowie, a Łódź używa `durag_velvet_emerald.webp` dla czarnego weluru. Zinwentaryzuj użycie plików w `assets/`, wypisz konflikty i stwórz listę brakujących zdjęć (`TODO:` – dostarcza człowiek). Nie generuj sztucznych zdjęć produktów.

**Zadanie 4.2 – Nazwy plików i alt.** Zmień nazwy plików na opisowe (np. `durag-jedwabny-czarny-19-momme.webp`), zaktualizuj odwołania, uzupełnij `alt` unikalnym opisem każdego zdjęcia. Napraw pusty obrazek w oknie szybkiego podglądu produktu (`<img src="">` / `![Product Image](<>)`).

**Zadanie 4.3 – Wydajność.**
- `width` i `height` (lub `aspect-ratio`) przy wszystkich obrazach,
- `loading="lazy"` dla obrazów poniżej pierwszego ekranu, `fetchpriority="high"` dla obrazu LCP,
- wideo hero: dodaj `poster`, `preload="metadata"`, `playsinline muted loop`, rozważ lżejszy format/rozdzielczość na mobile,
- zmierz przed/po Lighthouse (mobile): LCP, CLS, INP; zapisz wyniki w podsumowaniu.

---

## Faza 5 – Wersje językowe

**Zadanie 5.1** – Ustal, jak działa obecny przełącznik 7 języków.

- Jeśli tłumaczy tekst JavaScriptem na tym samym URL-u: **wyłącz widoczność przełącznika** (lub zostaw tylko PL) i opisz w podsumowaniu, bo takie tłumaczenia nie mają wartości SEO.
- Jeśli użytkownik chce wersji zagranicznych: zaproponuj osobne ścieżki (`/en/`, `/de/` …), pełne tłumaczenia treści (nie auto-JS), tagi `hreflang` (wraz z `x-default`) i osobne `canonical` per wersja. Najpierw zapytaj o zakres i priorytet języków.

---

## Faza 6 – Spójność treści i zaufanie

**Zadanie 6.1 – Czas wysyłki.** Obecnie występuje 5 sformułowań: „1 dzień”, „1–2 dni”, „24h”, „24–48 godzin”, „1–2 dni robocze”. Ustal jedno (zapytaj użytkownika, który jest prawdziwy) i ujednolić na stronie głównej, w koszyku, w stopce, w regulaminie i w JSON-LD.

**Zadanie 6.2 – Produkty vs opisy.** W tekście o materiałach sezonowych pojawiają się Durag Bydgoszcz (cupro) i Durag Stalowa Wola (krepa satynowa), których nie ma w siatce produktów. Zapytaj użytkownika: dodać produkty czy usunąć wzmianki.

**Zadanie 6.3 – Opis tkanin.** W opisie Milanówka występują równolegle „czysty jedwab morwowy 19 momme” i „satyna jedwabna”. Zaznacz do decyzji człowieka, która nazwa materiału jest prawdziwa, i ujednolić we wszystkich miejscach.

**Zadanie 6.4 – Deklaracje wyłączności.** Frazy „Jedyne duragi szyte w Polsce” i „jedyny w Polsce durag z prawdziwego jedwabiu” oznacz `TODO:` do weryfikacji przez właściciela (ryzyko wprowadzenia w błąd). Zaproponuj bezpieczniejsze warianty (np. „Duragi szyte ręcznie w Warszawie”), ale nie podmieniaj bez zgody.

**Zadanie 6.5 – Dane firmy.** W regulaminie i stopce przygotuj miejsce na pełne dane sprzedawcy: pełna nazwa, forma prawna, adres, NIP, REGON, e-mail, telefon. Wstaw `TODO:` zamiast wymyślonych wartości.

**Zadanie 6.6 – Pasek marquee.** Usuń trzykrotne powielanie tego samego tekstu w kodzie (zostaw efekt wizualny, ale bez kopiowania treści w DOM tam, gdzie to możliwe, lub oznacz `aria-hidden="true"` dla duplikatów).

**Zadanie 6.7 – Dostawa „EU Express”.** W koszyku widnieje „Darmowa (EU Express)”, a oferta dotyczy głównie Polski. Ujednolić etykiety zgodnie z faktyczną ofertą (zapytaj użytkownika).

---

## Faza 7 – SEO lokalne

**Zadanie 7.1** – Stwórz stronę `/kontakt-i-odbior-osobisty/` z:
- punktami odbioru (ul. Włodarzewska 4 – Ochota; Centrum; salon barberski Eclipse pod Rondem Waszyngtona),
- informacją „po wcześniejszym umówieniu”,
- osadzoną mapą (bez ciężkiego skryptu – najlepiej link lub lekki embed ładowany leniwie),
- spójnymi danymi NAP (nazwa, adres, telefon) takimi samymi jak w stopce i JSON-LD.

**Zadanie 7.2** – Dodaj `LocalBusiness` (lub `Store`) w JSON-LD z `areaServed: Warszawa` i godzinami/zasadami odbioru (jeśli brak danych – `TODO:`).

**Zadanie poza kodem (dla człowieka):** założyć Profil Firmy w Google, zgłosić się do lokalnych katalogów, ustalić z salonem Eclipse wzmiankę/link.

---

## Faza 8 – Analityka i weryfikacja

**Zadanie 8.1** – Dodaj (jeśli brak) integrację Google Analytics 4 i weryfikację Google Search Console (meta tag lub plik) – ID dostarcza człowiek, wstaw `TODO:`.

**Zadanie 8.2 – Kontrola końcowa.** Uruchom (lub wypisz komendy do uruchomienia):
- lokalne sprawdzenie linków (brak 404, brak linków `#` w nawigacji),
- Lighthouse (mobile) dla `/`, kategorii, produktu i artykułu,
- walidacja JSON-LD,
- sprawdzenie, że `sitemap.xml` i `robots.txt` są dostępne,
- podsumowanie wszystkich `TODO:` w jednym miejscu (`SEO_TODO_SUMMARY.md`).

---

## Słowa kluczowe (do użycia w tytułach, nagłówkach i treści – zweryfikować wolumeny)

- **Transakcyjne:** durag, durag kup, durag jedwabny, durag satynowy, durag welurowy, durag Warszawa, durag 19 momme
- **Informacyjne:** jak zawiązać durag, fale 360 jak zrobić, durag vs czepek jedwabny, durag do spania, czy durag niszczy włosy
- **Długi ogon:** durag pod kask, durag na siłownię, prezent durag

Pisz naturalnie; nie upychaj fraz kluczowych.

## Kolejność wykonania

1. Faza 0 (decyzja domeny) → 2. Faza 1 (podstrony, sitemap, robots) → 3. Faza 2 (meta, H1) → 4. Faza 3 (JSON-LD) → 5. Faza 4 (obrazy, wydajność) → 6. Faza 6 (spójność treści) → 7. Faza 7 (lokalne) → 8. Faza 5 (języki, po decyzji) → 9. Faza 8 (analityka i kontrola).

## Pytania do człowieka (zadaj na początku, jednym blokiem)

1. Która domena jest główna (`.pl` czy `.com`)?
2. Jaki jest faktyczny czas wysyłki?
3. Czy Durag Bydgoszcz i Durag Stalowa Wola mają być dodane do sklepu?
4. Czy Milanówek to czysty jedwab morwowy 19 momme, czy satyna jedwabna?
5. Czy wersje obcojęzyczne mają działać jako osobne strony, czy wyłączamy przełącznik?
6. Dane firmy do regulaminu i stopki (nazwa, NIP, adres, telefon).
7. Czy istnieją prawdziwe opinie klientów, które można wyświetlić?
8. Dostarczenie unikalnych zdjęć każdego produktu i wariantu kolorystycznego.
