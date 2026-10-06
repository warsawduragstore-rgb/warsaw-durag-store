-- ========================================================================
-- WARSAW DURAG STORE — SUPABASE MIGRATION 003: SITE CONTENT CMS
-- Umożliwia edycję całej zawartości strony głównej przez panel CMS
-- ========================================================================

CREATE TABLE IF NOT EXISTS site_content (
  section_key TEXT PRIMARY KEY,
  content     JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_site_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS trg_site_content_updated_at ON site_content;
CREATE TRIGGER trg_site_content_updated_at
  BEFORE UPDATE ON site_content
  FOR EACH ROW EXECUTE PROCEDURE update_site_content_updated_at();

-- RLS Policies
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read site content" ON site_content;
DROP POLICY IF EXISTS "Enable all access for site content" ON site_content;

CREATE POLICY "Enable all access for site content"
  ON site_content FOR ALL
  USING (true)
  WITH CHECK (true);

-- Wstawienie domyślnych danych początkowych (idempotentnie)
INSERT INTO site_content (section_key, content) VALUES
(
  'announcement',
  '{
    "text": "Wysyłamy z Warszawy w 1 dzień • Kup dwa a trzeci otrzymasz gratis • Darmowa wysyłka w Polsce • Ręcznie szyte duragi atelier",
    "isActive": true
  }'::jsonb
),
(
  'hero',
  '{
    "accent": "Warsaw Atelier / 52.2297° N",
    "title": "Ręcznie szyte.<br><span>Stworzone do ruchu</span>.",
    "subtitle": "Jedyne duragi szyte w Polsce z naturalnego jedwabiu morwowego 19 Momme",
    "ctaText": "Odkryj kolekcję",
    "ctaLink": "#kolekcja",
    "videoUrl": "./assets/hero_video.mp4",
    "posterUrl": "./assets/durag_silk_black.png"
  }'::jsonb
),
(
  'trust_bar',
  '{
    "item1_title": "Wysyłka 1–2 Dni",
    "item1_desc": "Ekspresowa realizacja z warszawskiego atelier",
    "item2_title": "Darmowa Dostawa",
    "item2_desc": "Paczkomaty InPost i kurier dla każdego zamówienia w PL",
    "item3_title": "14 Dni na Zwrot",
    "item3_desc": "Gwarancja bezproblemowego zwrotu i wymiany",
    "item4_title": "Odbiór w Warszawie",
    "item4_desc": "ul. Włodarzewska 4, Śródmieście lub salon Eclipse"
  }'::jsonb
),
(
  'collection_header',
  '{
    "tag": "01 — Kolekcja",
    "title": "Wybierz swój materiał",
    "description": "Kompletna kolekcja ręcznie szytych duragów w Warszawie — z czystego jedwabiu morwowego 19 Momme, satyny, weluru oraz materiałów sezonowych."
  }'::jsonb
),
(
  'lookbook',
  '{
    "tag": "[ pure silk 19 momme ]",
    "title": "Jedwab w Mieście.",
    "p1": "W miejskim rytmie nasz Durag Milanówek to coś więcej niż dodatek — chroni, podkreśla styl i wyróżnia nas na tle innych. Wykonany z naturalnego jedwabiu o gramaturze 19 momme — oznaczającej wysoką gęstość, trwałość i jakość materiału — łączy lekkość z wyjątkową wytrzymałością, a jego gładka struktura ogranicza tarcie, pomaga chronić włosy przed łamaniem i puszeniem oraz jest delikatna dla skóry głowy.",
    "p2": "Jedwabny durag to unikatowy modowy hidden gem, który w przeciwieństwie do chusty czy czepka wyróżnia Cię na tle innych zarówno jakością wykonania, jak i subtelną elegancją w stylizacji. Jego lekka tkanina osłania głowę przed wiatrem i promieniowaniem UV, a niepodrabialny, głęboki połysk zmienia światło miasta w część stylizacji. To jedyny w Polsce durag wykonany z prawdziwego jedwabiu — bo styl rodzi się na głowie.",
    "ctaText": "Sprawdź kolekcję jedwabiu",
    "ctaLink": "#kolekcja"
  }'::jsonb
),
(
  'philosophy',
  '{
    "tag": "[ Standardy rzemiosła ]",
    "title": "Filozofia naszych materiałów",
    "silk_title": "Jedwab stworzony dla włosów",
    "silk_desc": "Użyta przy produkcji Durag Milanówek satyna jedwabna ma naturalnie gładką powierzchnię ograniczającą tarcie, dzięki czemu pozwala chronić włosy przed puszeniem, łamaniem i nadmiernym przesuszaniem. Zastosowany tutaj jedwab o gramaturze 19 momme jest odpowiednio lekki i elastyczny a zarazem gęsty oraz trwały.",
    "satin_title": "Satyna stworzona dla codzienności",
    "satin_desc": "Satyna poliestrowa to materiał, który idealnie łączy gładkość, lekkość i trwałość — właśnie dlatego tak dobrze sprawdza się w szyciu duragów. Ogranicza tarcie, jest odporna na codzienne użytkowanie i prosta w pielęgnacji.",
    "velvet_title": "Welur na co dzień",
    "velvet_desc": "Welur poliestrowy to miękki, gęsty materiał o charakterystycznej strukturze nadający głębię koloru. Bardziej mięsisty i otulający niż lekki jedwab czy gładka satyna.",
    "seasonal_title": "Sezonowe materiały",
    "seasonal_desc": "Seria duragów wykonanych z sezonowych tkanin — cupro, przewiewny len z Żyrardowa oraz krepa satynowa, odpowiadające na zmieniającą się pogodę i indywidualny styl."
  }'::jsonb
),
(
  'about',
  '{
    "tag": "[ Warsaw Durag Store ]",
    "title": "O nas",
    "p1": "Opowiadamy tę historię każdemu, kto zapyta, skąd wziął się pomysł na Warsaw Durag Store. Wracając z Częstochowy, w drodze powrotnej z Jasnej Góry słuchaliśmy utworu Baby Keema Durag Activity i olśniło nas, że w Polsce nie ma gdzie kupić porządnego duraga.",
    "p2": "Wspólnie z bratem bliźniakiem zaczęliśmy od totalnego zera. Dziś realizujemy dziesiątki zamówień tygodniowo, a każdy durag przechodzi przez nasze ręce: od doboru naturalnego jedwabiu morwowego 19 Momme, przez szycie, aż po staranne pakowanie.",
    "p3": "Jesteśmy marką otwartą na współprace — robisz coś w sporcie, modzie lub muzyce? Pisz do nas, w zamian za solidne promo wysyłamy pakę z duragiem!",
    "p4": "Darmowy odbiór osobisty w Warszawie: przy ul. Włodarzewskiej 4 (Ochota), w Centrum oraz stacjonarnie w salonie barberskim Eclipse pod Rondem Waszyngtona. Piszcie śmiało na Instagramie @warsawduragstore lub mailowo support@warsawduragstore.pl.",
    "image": "./assets/founders.jpg"
  }'::jsonb
),
(
  'footer',
  '{
    "about": "Jedyne duragi szyte w Polsce. Warszawskie atelier rzemieślnicze dostarczające najwyższej klasy duragi z jedwabiu 19 Momme oraz akcesoria do pielęgnacji fal 360.",
    "email": "support@warsawduragstore.pl",
    "instagram": "https://instagram.com/warsawduragstore",
    "address": "ul. Włodarzewska 4, 02-384 Warszawa"
  }'::jsonb
)
ON CONFLICT (section_key) DO NOTHING;
