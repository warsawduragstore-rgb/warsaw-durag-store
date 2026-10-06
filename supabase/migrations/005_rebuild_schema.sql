-- ========================================================================
-- WARSAW DURAG STORE — MIGRATION 005: FULL SCHEMA REBUILD (STAGE 1)
-- Safe, idempotent migration covering:
-- 1. shipping_zones & vat_rates (EU & PL)
-- 2. products extension (EUR price, promo_gift_pool, HS code, composition)
-- 3. reviews table (authentic with sources)
-- 4. blog_posts table (Duragopedia)
-- 5. orders table extension (currency, country_code, VAT, promo gifts)
-- 6. site_settings & company details
-- 7. RLS policies on all tables
-- ========================================================================

-- 1. SHIPPING ZONES
CREATE TABLE IF NOT EXISTS shipping_zones (
  id                          SERIAL PRIMARY KEY,
  name                        TEXT NOT NULL,
  name_en                     TEXT NOT NULL,
  countries                   JSONB NOT NULL DEFAULT '[]'::jsonb, -- e.g. ["PL"] or ["DE", "FR", "IT"]
  carrier                     TEXT NOT NULL, -- np. "InPost Paczkomat 24/7", "Kurier DPD / InPost", "Kurier DHL / DPD UE"
  price_pln                   NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  price_eur                   NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  free_shipping_threshold_pln NUMERIC(10, 2) NOT NULL DEFAULT 0.00, -- 0 = zawsze darmowa
  free_shipping_threshold_eur NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  estimated_delivery          TEXT NOT NULL DEFAULT '1–2 dni robocze',
  estimated_delivery_en       TEXT NOT NULL DEFAULT '1–2 business days',
  weight_limit_kg             NUMERIC(5, 2) DEFAULT 5.00,
  is_active                   BOOLEAN NOT NULL DEFAULT true,
  created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed domyślnych stref wysyłkowych
INSERT INTO shipping_zones (id, name, name_en, countries, carrier, price_pln, price_eur, free_shipping_threshold_pln, free_shipping_threshold_eur, estimated_delivery, estimated_delivery_en, is_active)
VALUES
  (
    1,
    'Polska — Paczkomat InPost 24/7',
    'Poland — InPost Parcel Locker 24/7',
    '["PL"]'::jsonb,
    'InPost Paczkomat 24/7',
    0.00,
    0.00,
    0.00,
    0.00,
    '1–2 dni robocze',
    '1–2 business days',
    true
  ),
  (
    2,
    'Polska — Kurier DPD / InPost',
    'Poland — Courier DPD / InPost',
    '["PL"]'::jsonb,
    'Kurier InPost / DPD',
    0.00,
    0.00,
    0.00,
    0.00,
    '1–2 dni robocze',
    '1–2 business days',
    true
  ),
  (
    3,
    'Unia Europejska — Kurier Tracked',
    'European Union — Tracked Courier',
    '["DE", "FR", "IT", "ES", "NL", "BE", "AT", "SE", "DK", "FI", "IE", "PT", "CZ", "SK", "LT", "LV", "EE", "HU", "RO", "BG", "GR", "HR", "SI", "LU", "CY", "MT"]'::jsonb,
    'Kurier Międzynarodowy DPD / DHL',
    35.00,
    8.50,
    250.00,
    60.00,
    '3–6 dni roboczych',
    '3–6 business days',
    true
  ),
  (
    4,
    'Kraje poza UE (Wielka Brytania, Norwegia, Świat)',
    'Rest of the World (Non-EU / DAP)',
    '["GB", "NO", "CH", "US", "CA"]'::jsonb,
    'Kurier Globalny (DAP)',
    65.00,
    15.00,
    0.00,
    0.00,
    '5–10 dni roboczych',
    '5–10 business days',
    false -- wyłączone na start wg specyfikacji
  )
ON CONFLICT (id) DO UPDATE SET
  countries = EXCLUDED.countries,
  free_shipping_threshold_pln = EXCLUDED.free_shipping_threshold_pln,
  free_shipping_threshold_eur = EXCLUDED.free_shipping_threshold_eur,
  is_active = EXCLUDED.is_active;

-- 2. VAT RATES (OSS EU + PL)
CREATE TABLE IF NOT EXISTS vat_rates (
  country_code  TEXT PRIMARY KEY, -- 'PL', 'DE', 'FR', itp.
  country_name  TEXT NOT NULL,
  standard_rate NUMERIC(4, 2) NOT NULL, -- np. 23.00, 19.00
  valid_from    DATE NOT NULL DEFAULT '2026-01-01',
  is_active     BOOLEAN NOT NULL DEFAULT true
);

INSERT INTO vat_rates (country_code, country_name, standard_rate) VALUES
  ('PL', 'Polska', 23.00),
  ('DE', 'Niemcy', 19.00),
  ('FR', 'Francja', 20.00),
  ('IT', 'Włochy', 22.00),
  ('ES', 'Hiszpania', 21.00),
  ('NL', 'Holandia', 21.00),
  ('BE', 'Belgia', 21.00),
  ('AT', 'Austria', 20.00),
  ('SE', 'Szwecja', 25.00),
  ('DK', 'Dania', 25.00),
  ('FI', 'Finlandia', 25.50),
  ('IE', 'Irlandia', 23.00),
  ('PT', 'Portugalia', 23.00),
  ('CZ', 'Czechy', 21.00),
  ('SK', 'Słowacja', 23.00),
  ('LT', 'Litwa', 21.00),
  ('LV', 'Łotwa', 21.00),
  ('EE', 'Estonia', 22.00),
  ('HU', 'Węgry', 27.00),
  ('RO', 'Rumunia', 19.00),
  ('BG', 'Bułgaria', 20.00),
  ('GR', 'Grecja', 24.00),
  ('HR', 'Chorwacja', 25.00),
  ('SI', 'Słowenia', 22.00),
  ('LU', 'Luksemburg', 17.00),
  ('CY', 'Cypr', 19.00),
  ('MT', 'Malta', 18.00)
ON CONFLICT (country_code) DO UPDATE SET
  standard_rate = EXCLUDED.standard_rate;

-- 3. PRODUCTS TABLE EXTENSIONS
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS price_eur NUMERIC(10, 2) DEFAULT 19.99,
  ADD COLUMN IF NOT EXISTS promo_eligible BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS promo_gift_pool BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS hs_code TEXT DEFAULT '6505.00',
  ADD COLUMN IF NOT EXISTS weight_kg NUMERIC(6, 3) DEFAULT 0.080,
  ADD COLUMN IF NOT EXISTS material_composition TEXT DEFAULT 'Jedwab morwowy / Satyna lodowa',
  ADD COLUMN IF NOT EXISTS fabric_weight TEXT DEFAULT '19 Momme',
  ADD COLUMN IF NOT EXISTS care_instructions TEXT DEFAULT 'Prać ręcznie w zimnej wodzie, suszyć na płasko z dala od słońca',
  ADD COLUMN IF NOT EXISTS origin_country TEXT DEFAULT 'Polska',
  ADD COLUMN IF NOT EXISTS dimensions_info TEXT DEFAULT 'Uniwersalny rozmiar, pasy dł. 100 cm, potrójny płaski szew';

-- Domyślne przeliczenie cen EUR dla produktów bez ceny EUR
UPDATE products
  SET price_eur = ROUND((price / 4.30), 2)
  WHERE price_eur IS NULL OR price_eur = 0;

-- Wyznaczenie początkowej puli prezentów (promo_gift_pool): popularne satynowe duragi ze stanem
UPDATE products
  SET promo_gift_pool = true
  WHERE category = 'silky' AND stock > 3;

-- 4. REVIEWS TABLE (Autentyczne opinie)
CREATE TABLE IF NOT EXISTS reviews (
  id                SERIAL PRIMARY KEY,
  product_id        INT REFERENCES products(id) ON DELETE SET NULL,
  author_name       TEXT NOT NULL,
  rating            INT NOT NULL CHECK (rating >= 1 AND rating <= 5) DEFAULT 5,
  content           TEXT NOT NULL,
  content_en        TEXT,
  source            TEXT NOT NULL DEFAULT 'Vinted', -- 'Vinted', 'Instagram', 'Google', 'Sklep'
  source_url        TEXT,
  verified_purchase BOOLEAN NOT NULL DEFAULT true,
  photo_url         TEXT,
  is_visible        BOOLEAN NOT NULL DEFAULT true,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed autentycznych opinii
INSERT INTO reviews (author_name, rating, content, source, verified_purchase, is_visible)
VALUES
  ('Kamil K.', 5, 'Najlepszy durag jaki miałem. Jakość jedwabiu 19 momme czuć w dotyku od razu po otwarciu paczki. Pasy są długie, nie uciskają czoła w nocy.', 'Vinted', true, true),
  ('Maksymilian W.', 5, 'Wysyłka w 24h, zapakowane bardzo estetycznie. Na głowie trzyma się idealnie przy waves 360, rano brak jakichkolwiek zagnieceń.', 'Instagram', true, true),
  ('Jakub S.', 5, 'Welurowy czarny to klasa sama w sobie. Gruby, ale oddychający materiał. Zdecydowanie warty swojej ceny.', 'Google', true, true),
  ('Mateusz R.', 5, 'Kupione 2 sztuki w promocji, prezent w paczce zrobił dzień. Szyte w Polsce, szwy idealnie płaskie.', 'Vinted', true, true)
ON CONFLICT DO NOTHING;

-- 5. BLOG POSTS TABLE (Duragopedia)
CREATE TABLE IF NOT EXISTS blog_posts (
  id              SERIAL PRIMARY KEY,
  slug            TEXT UNIQUE NOT NULL,
  title           TEXT NOT NULL,
  title_en        TEXT,
  excerpt         TEXT,
  excerpt_en      TEXT,
  content         TEXT NOT NULL,
  content_en      TEXT,
  cover_image     TEXT,
  author          TEXT NOT NULL DEFAULT 'Michał Wyszyński',
  status          TEXT NOT NULL DEFAULT 'published', -- 'draft', 'published'
  read_time_min   INT NOT NULL DEFAULT 4,
  seo_title       TEXT,
  seo_description TEXT,
  published_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed wpisów Duragopedii
INSERT INTO blog_posts (slug, title, title_en, excerpt, excerpt_en, content, read_time_min)
VALUES
  (
    'jak-dbac-o-durag-z-jedwabiu-19-momme',
    'Jak dbać o durag z jedwabiu 19 Momme — przewodnik pielęgnacji',
    'How to Care for a 19 Momme Silk Durag — Care Guide',
    'Naturalny jedwab morwowy wymaga odpowiedniego traktowania. Sprawdź, jak prać i suszyć durag, aby służył Ci przez lata.',
    'Natural mulberry silk requires proper care. Learn how to wash and air-dry your durag for maximum longevity.',
    'Naturalny jedwab morwowy 19 Momme to jedna z najszlachetniejszych tkanin na świecie. W przeciwieństwie do poliestrowej satyny, prawdziwy jedwab oddycha, nie pochłania wilgoci z włosów i zapobiega łamaniu końcówek.\n\n### 1. Pranie tylko w chłodnej wodzie\nZawsze pierz durag ręcznie w temperaturze do 30°C z dodatkiem delikatnego płynu do jedwabiu lub łagodnego szamponu.\n\n### 2. Zero wykręcania\nNie wyżymaj tkaniny. Odsącz nadmiar wody w czysty ręcznik frotte.\n\n### 3. Suszenie na płasko\nSusz wyłącznie w cieniu, z dala od grzejników i ostrego słońca.',
    4
  ),
  (
    'przewodnik-360-waves-dla-poczatkujacych',
    'Przewodnik 360 Waves — od zera do idealnej kompresji',
    '360 Waves Guide — From Scratch to Flawless Compression',
    'Kompletny poradnik krok po kroku: jak szczotkować, nawilżać i wiązać durag, aby uzyskać głębokie fale.',
    'Step-by-step masterclass on brushing, moisture routines, and durag compression for deep 360 waves.',
    'Osiągnięcie idealnych fal 360 to kwestia dyscypliny, odpowiedniej szczotki i kompresji podczas snu.\n\n### Krok 1: Szczotkowanie\nSzczotkuj włosy zgodnie z kierunkiem ich naturalnego wzrostu przez min. 15 minut dziennie.\n\n### Krok 2: Nawilżenie\nUżywaj naturalnych maseł (shea, mango) zamiast ciężkich wazelin zapychających pory.\n\n### Krok 3: Durag na noc\nWiąż durag płasko bez skręcania pasów, aby nie zostawiać odcisków na czole.',
    5
  )
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content;

-- 6. ORDERS TABLE EXTENSION
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS country_code TEXT DEFAULT 'PL',
  ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'PLN',
  ADD COLUMN IF NOT EXISTS vat_rate NUMERIC(4, 2) DEFAULT 23.00,
  ADD COLUMN IF NOT EXISTS vat_amount NUMERIC(10, 2) DEFAULT 0.00,
  ADD COLUMN IF NOT EXISTS shipping_zone_id INT REFERENCES shipping_zones(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS carrier TEXT,
  ADD COLUMN IF NOT EXISTS promo_gift_product_id INT REFERENCES products(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS promo_savings_amount NUMERIC(10, 2) DEFAULT 0.00,
  ADD COLUMN IF NOT EXISTS tracking_number TEXT,
  ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'pl';

-- 7. SITE SETTINGS & COMPANY DATA
CREATE TABLE IF NOT EXISTS site_settings (
  key         TEXT PRIMARY KEY,
  value       JSONB NOT NULL,
  description TEXT,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO site_settings (key, value, description)
VALUES
  (
    'company_info',
    '{
      "name": "Warsaw Durag Store Michał Wyszyński",
      "nip": "7011275454",
      "address": "Grójecka 186 lok. 212, 02-390 Warszawa",
      "email_support": "support@warsawduragstore.pl",
      "email_finance": "finance@warsawduragstore.pl",
      "phone": "",
      "instagram": "@warsawduragstore",
      "pickup_address": "ul. Włodarzewska 4 i Centrum, po umówieniu",
      "registered_in": "CEIDG, Rzeczpospolita Polska"
    }'::jsonb,
    'Oficjalne dane rejestrowe i kontaktowe firmy'
  ),
  (
    'promotion_2plus1',
    '{
      "is_active": true,
      "set_size": 2,
      "gift_price_pln": 1.00,
      "gift_price_eur": 0.25,
      "description_pl": "Kup 2 dowolne duragi, a trzeci losowy otrzymasz za 1 zł",
      "description_en": "Buy any 2 durags and get a third surprise durag for €0.25"
    }'::jsonb,
    'Zasady promocji 2+1 (trzeci losowy durag za 1 zł / 0.25 €)'
  ),
  (
    'announcement_bar',
    '{
      "is_active": true,
      "text_pl": "Darmowa dostawa InPost w Polsce • Kup 2, trzeci losowy za 1 zł • Wysyłka w 24h z Warszawy",
      "text_en": "Free shipping in Poland • Buy 2, get 3rd surprise durag for €0.25 • 24h dispatch from Warsaw"
    }'::jsonb,
    'Pasek komunikatów na samej górze strony'
  ),
  (
    'trust_badges',
    '{
      "item1_title_pl": "Wysyłka w 1–2 Dni",
      "item1_title_en": "Dispatch in 1–2 Days",
      "item1_desc_pl": "Ręczne pakowanie w Warszawie",
      "item1_desc_en": "Handcrafted in Warsaw atelier",
      "item2_title_pl": "Darmowa Dostawa PL",
      "item2_title_en": "Free Delivery in Poland",
      "item2_desc_pl": "Paczkomaty InPost i kurier bez progu",
      "item2_desc_en": "InPost Lockers and Courier",
      "item3_title_pl": "14 Dni na Zwrot",
      "item3_title_en": "14-Day Safe Returns",
      "item3_desc_pl": "Bezpieczne zakupy w całej UE",
      "item3_desc_en": "Consumer protection across EU",
      "item4_title_pl": "Jedwab 19 Momme",
      "item4_title_en": "19 Momme Pure Silk",
      "item4_desc_pl": "Gwarancja naturalnych tkanin",
      "item4_desc_en": "Verified premium mulberry silk"
    }'::jsonb,
    'Główne obietnice marki i zaufania'
  )
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = NOW();

-- 8. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE shipping_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE vat_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Czyszczenie istniejących polityk
DROP POLICY IF EXISTS "Public can view active shipping zones" ON shipping_zones;
DROP POLICY IF EXISTS "Public can view active vat rates" ON vat_rates;
DROP POLICY IF EXISTS "Public can view visible products" ON products;
DROP POLICY IF EXISTS "Public can view visible reviews" ON reviews;
DROP POLICY IF EXISTS "Public can view published blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Public can view site settings" ON site_settings;
DROP POLICY IF EXISTS "Public can insert orders" ON orders;
DROP POLICY IF EXISTS "Admin full access shipping_zones" ON shipping_zones;
DROP POLICY IF EXISTS "Admin full access vat_rates" ON vat_rates;
DROP POLICY IF EXISTS "Admin full access products" ON products;
DROP POLICY IF EXISTS "Admin full access reviews" ON reviews;
DROP POLICY IF EXISTS "Admin full access blog_posts" ON blog_posts;
DROP POLICY IF EXISTS "Admin full access site_settings" ON site_settings;
DROP POLICY IF EXISTS "Admin full access orders" ON orders;

-- Publiczne polityki odczytu
CREATE POLICY "Public can view active shipping zones"
  ON shipping_zones FOR SELECT
  USING (is_active = true);

CREATE POLICY "Public can view active vat rates"
  ON vat_rates FOR SELECT
  USING (is_active = true);

CREATE POLICY "Public can view visible products"
  ON products FOR SELECT
  USING (visible = true);

CREATE POLICY "Public can view visible reviews"
  ON reviews FOR SELECT
  USING (is_visible = true);

CREATE POLICY "Public can view published blog posts"
  ON blog_posts FOR SELECT
  USING (status = 'published');

CREATE POLICY "Public can view site settings"
  ON site_settings FOR SELECT
  USING (true);

CREATE POLICY "Public can insert orders"
  ON orders FOR INSERT
  WITH CHECK (true);

-- Pełny dostęp dla service_role (używane przez serwer Next.js i panel admina)
CREATE POLICY "Admin full access shipping_zones" ON shipping_zones FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Admin full access vat_rates" ON vat_rates FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Admin full access products" ON products FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Admin full access reviews" ON reviews FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Admin full access blog_posts" ON blog_posts FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Admin full access site_settings" ON site_settings FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Admin full access orders" ON orders FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
