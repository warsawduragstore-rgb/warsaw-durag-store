-- ========================================================================
-- WARSAW DURAG STORE — SUPABASE SCHEMA (IDEMPOTENT / SAFE TO RE-RUN)
-- Wklej cały ten plik do: Supabase Dashboard → SQL Editor → Run
-- ========================================================================

-- ========================================================================
-- 1. PRODUCTS TABLE
-- ========================================================================
CREATE TABLE IF NOT EXISTS products (
  id            BIGSERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  name_en       TEXT,
  price         NUMERIC(10, 2) NOT NULL DEFAULT 79.00,
  category      TEXT NOT NULL DEFAULT 'silk',
  category_label TEXT NOT NULL DEFAULT '100% Jedwab Morwowy (19 Momme)',
  material      TEXT,
  description   TEXT,
  images        TEXT[] NOT NULL DEFAULT '{}',
  colors        JSONB NOT NULL DEFAULT '[]',
  reviews       JSONB NOT NULL DEFAULT '[]',
  stock         INTEGER NOT NULL DEFAULT 10,
  visible       BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Safe Drop & Recreate Trigger
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- ========================================================================
-- 2. ORDERS TABLE
-- ========================================================================
CREATE TABLE IF NOT EXISTS orders (
  id                BIGSERIAL PRIMARY KEY,
  order_no          TEXT NOT NULL UNIQUE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Customer info
  customer_name     TEXT NOT NULL,
  customer_email    TEXT NOT NULL,
  customer_phone    TEXT NOT NULL,
  
  -- Delivery
  delivery_method   TEXT NOT NULL DEFAULT 'courier',
  locker_code       TEXT,
  locker_address    TEXT,
  
  -- Order contents
  items             JSONB NOT NULL DEFAULT '[]',
  items_summary     TEXT,
  
  -- Pricing
  subtotal          NUMERIC(10, 2) NOT NULL DEFAULT 0,
  discount_code     TEXT,
  discount_pct      NUMERIC(5, 2) NOT NULL DEFAULT 0,
  discount_val      NUMERIC(10, 2) NOT NULL DEFAULT 0,
  total             NUMERIC(10, 2) NOT NULL DEFAULT 0,
  
  -- Status
  status            TEXT NOT NULL DEFAULT 'new'
);

-- ========================================================================
-- 3. PROMO CODES TABLE
-- ========================================================================
CREATE TABLE IF NOT EXISTS promo_codes (
  id          BIGSERIAL PRIMARY KEY,
  code        TEXT NOT NULL UNIQUE,
  rate        NUMERIC(5, 2) NOT NULL,
  active      BOOLEAN NOT NULL DEFAULT true,
  uses_count  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Default promo codes
INSERT INTO promo_codes (code, rate) VALUES
  ('WARSAW10', 0.10),
  ('ELEMENTY', 0.15),
  ('DURAGWAVES', 0.20)
ON CONFLICT (code) DO NOTHING;

-- ========================================================================
-- 4. NEWSLETTER TABLE
-- ========================================================================
CREATE TABLE IF NOT EXISTS newsletter_emails (
  id            BIGSERIAL PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ========================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES (SAFE DROP & CREATE)
-- ========================================================================

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_emails ENABLE ROW LEVEL SECURITY;

-- ---- PRODUCTS POLICIES ----
DROP POLICY IF EXISTS "Public can read visible products" ON products;
DROP POLICY IF EXISTS "Admin full access to products" ON products;
DROP POLICY IF EXISTS "Enable all access for products" ON products;

-- Zezwolenie na odczyt i zarządzanie katalogiem w sklepie i CMS
CREATE POLICY "Enable all access for products"
  ON products FOR ALL
  USING (true)
  WITH CHECK (true);

-- ---- ORDERS POLICIES ----
DROP POLICY IF EXISTS "Anyone can place an order" ON orders;
DROP POLICY IF EXISTS "Admin can read all orders" ON orders;
DROP POLICY IF EXISTS "Admin can update order status" ON orders;
DROP POLICY IF EXISTS "Enable all access for orders" ON orders;

-- Zezwolenie na składanie i odczyt zamówień w panelu CMS
CREATE POLICY "Enable all access for orders"
  ON orders FOR ALL
  USING (true)
  WITH CHECK (true);

-- ---- PROMO CODES POLICIES ----
DROP POLICY IF EXISTS "Public can read active promo codes" ON promo_codes;
DROP POLICY IF EXISTS "Admin full access to promo codes" ON promo_codes;
DROP POLICY IF EXISTS "Enable all access for promo codes" ON promo_codes;

CREATE POLICY "Enable all access for promo codes"
  ON promo_codes FOR ALL
  USING (true)
  WITH CHECK (true);

-- ---- NEWSLETTER POLICIES ----
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON newsletter_emails;
DROP POLICY IF EXISTS "Admin can read newsletter" ON newsletter_emails;
DROP POLICY IF EXISTS "Enable all access for newsletter" ON newsletter_emails;

CREATE POLICY "Enable all access for newsletter"
  ON newsletter_emails FOR ALL
  USING (true)
  WITH CHECK (true);


-- ========================================================================
-- 6. SEED INITIAL PRODUCTS (31 ITEMS)
-- ========================================================================
INSERT INTO products (id, name, name_en, price, category, category_label, material, description, images, colors, reviews, stock, visible)
VALUES (1160, 'Durag Milanówek — Jedwabny Czarny / Biały', 'Durag Milanówek Silk Black / White', 149, 'silk', 'Czysty Jedwab Morwowy', '100% Jedwab Morwowy (19 Momme)', 'Hołd dla legendarnej, polskiej stolicy jedwabnictwa i przedwojennej elegancji. Wykonany z najwyższej klasy naturalnego jedwabiu – luksusowo gładkiego, hipoalergicznego i ultralekkiego. Genialnie oddycha, redukuje tarcie do zera i oferuje prestiżowy, czysty minimalizm w wersji czarnej lub białej.', ARRAY['/assets/product-photos/durag-milanowek/durag-milanowek_1.jpg', '/assets/product-photos/durag-milanowek/durag-milanowek_2.jpg', '/assets/product-photos/durag-milanowek/durag-milanowek_3.jpg', '/assets/product-photos/durag-milanowek/durag-milanowek_4.jpg', '/assets/product-photos/durag-milanowek/durag-milanowek_5.jpg', '/assets/product-photos/durag-milanowek/durag-milanowek_6.jpg'], '[{"name":"Obsidian Black","hex":"#111111"},{"name":"Pure White","hex":"#FFFFFF"}]'::jsonb, '[{"author":"Kamil W.","rating":5,"comment":"Jedyny prawdziwy jedwab w Polsce. Niesamowita gładkość.","date":"14.05.2026"},{"author":"Mateusz R.","rating":5,"comment":"Idealny na noc, zero puszenia włosów.","date":"02.06.2026"}]'::jsonb, 10, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  name_en = EXCLUDED.name_en,
  price = EXCLUDED.price,
  category = EXCLUDED.category,
  category_label = EXCLUDED.category_label,
  material = EXCLUDED.material,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  colors = EXCLUDED.colors;

INSERT INTO products (id, name, name_en, price, category, category_label, material, description, images, colors, reviews, stock, visible)
VALUES (1161, 'Durag Warszawa — Czarna Satyna Ice Silk', 'Durag Warszawa Black Ice Silk Satin', 79, 'satin', 'Satyna Poliestrowa', 'Gładka Satyna Premium Ice Silk', 'Najbardziej uniwersalny i kultowy model Warsaw Durag Store. Inspirowany energią, dynamiką i minimalistyczną elegancją stolicy. Uszyty z lekkiej, chłodnej w dotyku satyny ice silk, która doskonale dopasowuje się do głowy, trzyma fason i chroni strukturę każdego włosa.', ARRAY['/assets/product-photos/durag-warszawa/durag-warszawa_1.jpg', '/assets/product-photos/durag-warszawa/durag-warszawa_2.jpg', '/assets/product-photos/durag-warszawa/durag-warszawa_3.jpg', '/assets/product-photos/durag-warszawa/durag-warszawa_4.jpg', '/assets/product-photos/durag-warszawa/durag-warszawa_5.jpg', '/assets/product-photos/durag-warszawa/durag-warszawa_6.jpg'], '[{"name":"Obsidian Black","hex":"#0A0A0A"}]'::jsonb, '[{"author":"Tomek G.","rating":5,"comment":"Klasyk nad klasykami. Noszę codziennie.","date":"10.06.2026"},{"author":"Oskar B.","rating":5,"comment":"Materiał ice silk jest niesamowicie przyjemny w upały.","date":"22.06.2026"}]'::jsonb, 10, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  name_en = EXCLUDED.name_en,
  price = EXCLUDED.price,
  category = EXCLUDED.category,
  category_label = EXCLUDED.category_label,
  material = EXCLUDED.material,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  colors = EXCLUDED.colors;

INSERT INTO products (id, name, name_en, price, category, category_label, material, description, images, colors, reviews, stock, visible)
VALUES (1335, 'Durag Wrocław — Biała Satyna', 'Durag Wrocław White Satin', 79, 'satin', 'Satyna Poliestrowa', 'Lśniąca Satyna Poliestrowa', 'Inspirowany architektoniczną lekkością i jasną, otwartą przestrzenią miasta mostów. Wykonany z lśniącej, śnieżnobiałej satyny, która gładko otula głowę, chroniąc jej strukturę. Kontrolowana elastyczność i długie pasy gwarantują stabilność bez uczucia napięcia. Czysta, świetlista forma.', ARRAY['/assets/product-photos/durag-wroclaw/durag-wroclaw_1.jpg', '/assets/product-photos/durag-wroclaw/durag-wroclaw_2.jpg', '/assets/product-photos/durag-wroclaw/durag-wroclaw_3.jpg', '/assets/product-photos/durag-wroclaw/durag-wroclaw_4.jpg', '/assets/product-photos/durag-wroclaw/durag-wroclaw_5.jpg', '/assets/product-photos/durag-wroclaw/durag-wroclaw_6.jpg'], '[{"name":"Pure White","hex":"#FFFFFF"}]'::jsonb, '[{"author":"Piotr S.","rating":5,"comment":"Bardzo lekki i świetnie leży.","date":"18.05.2026"}]'::jsonb, 10, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  name_en = EXCLUDED.name_en,
  price = EXCLUDED.price,
  category = EXCLUDED.category,
  category_label = EXCLUDED.category_label,
  material = EXCLUDED.material,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  colors = EXCLUDED.colors;

INSERT INTO products (id, name, name_en, price, category, category_label, material, description, images, colors, reviews, stock, visible)
VALUES (1365, 'Durag Łódź — Czarny Welur', 'Durag Łódź Black Velvet', 89, 'velvet', 'Luksusowy Welur', 'Mięsisty Welur Poliestrowy', 'Nazwany na cześć miasta o głębokich, tekstylnych tradycjach i surowym, postindustrialnym charakterze. Miękki, mięsisty welur w odcieniu głębokiej czerni doskonale magnetyzuje światło. Zapewnia precyzyjne dopasowanie i wyjątkowe poczucie komfortu na co dzień. Teksturowany minimalizm, który broni się sam.', ARRAY['/assets/product-photos/durag-lodz/durag-lodz_1.jpg', '/assets/product-photos/durag-lodz/durag-lodz_2.jpg', '/assets/product-photos/durag-lodz/durag-lodz_3.jpg', '/assets/product-photos/durag-lodz/durag-lodz_4.jpg', '/assets/product-photos/durag-lodz/durag-lodz_5.jpg', '/assets/product-photos/durag-lodz/durag-lodz_6.jpg'], '[{"name":"Deep Black","hex":"#0A0A0A"}]'::jsonb, '[{"author":"Dawid K.","rating":5,"comment":"Super jakość weluru!","date":"20.04.2026"}]'::jsonb, 10, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  name_en = EXCLUDED.name_en,
  price = EXCLUDED.price,
  category = EXCLUDED.category,
  category_label = EXCLUDED.category_label,
  material = EXCLUDED.material,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  colors = EXCLUDED.colors;

INSERT INTO products (id, name, name_en, price, category, category_label, material, description, images, colors, reviews, stock, visible)
VALUES (1369, 'Durag Kraków — Różowy Welur', 'Durag Kraków Velvet Pink', 89, 'velvet', 'Luksusowy Welur', 'Miękki Welur Aksamitny', 'Nasz ikoniczny Velvet Pink Durag to połączenie wyrazistego, modowego akcentu z maksymalną kompresją fal 360 waves. Wyjątkowo miękki aksamitny welur w pudrowo-malinowym odcieniu doskonale leży na głowie i chroni włosy podczas snu i na co dzień.', ARRAY['/assets/product-photos/durag-krakow/durag-krakow_1.jpg', '/assets/product-photos/durag-krakow/durag-krakow_2.jpg', '/assets/product-photos/durag-krakow/durag-krakow_3.jpg', '/assets/product-photos/durag-krakow/durag-krakow_4.jpg', '/assets/product-photos/durag-krakow/durag-krakow_5.jpg', '/assets/product-photos/durag-krakow/durag-krakow_6.jpg'], '[{"name":"Velvet Pink","hex":"#E8829C"}]'::jsonb, '[{"author":"Zuzanna M.","rating":5,"comment":"Kolor w rzeczywistości jest przepiękny! Bardzo miękki materiał.","date":"15.05.2026"}]'::jsonb, 10, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  name_en = EXCLUDED.name_en,
  price = EXCLUDED.price,
  category = EXCLUDED.category,
  category_label = EXCLUDED.category_label,
  material = EXCLUDED.material,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  colors = EXCLUDED.colors;

INSERT INTO products (id, name, name_en, price, category, category_label, material, description, images, colors, reviews, stock, visible)
VALUES (1366, 'Durag Białystok — Brązowy Welur', 'Durag Białystok Brown Velvet', 89, 'velvet', 'Luksusowy Welur', 'Gęsty Welur Poliestrowy', 'Inspirowany surowym krajobrazem Podlasia i leśną, ziemistą paletą barw. Miękki, aksamitny welur w tonacji głębokiego brązu z naturalnym, satynowym połyskiem. Zapewnia doskonałe przyleganie i komfort.', ARRAY['/assets/product-photos/durag-bialystok/durag-bialystok_1.png', '/assets/product-photos/durag-bialystok/durag-bialystok_2.jpg', '/assets/product-photos/durag-bialystok/durag-bialystok_3.jpg', '/assets/product-photos/durag-bialystok/durag-bialystok_4.jpg', '/assets/product-photos/durag-bialystok/durag-bialystok_5.jpg'], '[{"name":"Forest Brown","hex":"#3D2B1F"}]'::jsonb, '[{"author":"Janusz P.","rating":5,"comment":"Niezwykły odcień brązu, polecam.","date":"11.05.2026"}]'::jsonb, 10, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  name_en = EXCLUDED.name_en,
  price = EXCLUDED.price,
  category = EXCLUDED.category,
  category_label = EXCLUDED.category_label,
  material = EXCLUDED.material,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  colors = EXCLUDED.colors;

INSERT INTO products (id, name, name_en, price, category, category_label, material, description, images, colors, reviews, stock, visible)
VALUES (1370, 'Durag Bielsko-Biała — Biały Welur', 'Durag Bielsko-Biała White Velvet', 89, 'velvet', 'Luksusowy Welur', 'Śnieżnobiały Welur Poliestrowy', 'Nawiązuje do górskiego klimatu Beskidów i czystej, zimowej aury. Śnieżnobiały, gęsty welur odbija światło dając wrażenie luksusu. Precyzyjne szwy i wysoka gramatura gwarantują trwałość.', ARRAY['/assets/product-photos/durag-bielsko-biala/durag-bielsko-biala_1.jpg', '/assets/product-photos/durag-bielsko-biala/durag-bielsko-biala_2.jpg', '/assets/product-photos/durag-bielsko-biala/durag-bielsko-biala_3.jpg'], '[{"name":"Snow White","hex":"#FAFAFA"}]'::jsonb, '[{"author":"Sebastian K.","rating":5,"comment":"Biały welur robi niesamowite wrażenie na żywo.","date":"29.04.2026"}]'::jsonb, 10, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  name_en = EXCLUDED.name_en,
  price = EXCLUDED.price,
  category = EXCLUDED.category,
  category_label = EXCLUDED.category_label,
  material = EXCLUDED.material,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  colors = EXCLUDED.colors;

INSERT INTO products (id, name, name_en, price, category, category_label, material, description, images, colors, reviews, stock, visible)
VALUES (1385, 'Durag Bydgoszcz — Miedziany Cupro', 'Durag Bydgoszcz Copper Cupro', 99, 'seasonal', 'Sezonowe Materiały', 'Innowacyjne Tworzywo Cupro', 'Inspirowany industrialnymi spichrzami, rzecznymi kanałami i metalicznymi refleksami nad Brdą. Wykonany z innowacyjnego materiału cupro w szlachetnym, miedzianym odcieniu. Łączy jedwabistą gładkość z naturalną przewiewnością i unikalnym finiszem.', ARRAY['/assets/product-photos/durag-bydgoszcz/durag-bydgoszcz_1.jpg', '/assets/product-photos/durag-bydgoszcz/durag-bydgoszcz_2.jpg', '/assets/product-photos/durag-bydgoszcz/durag-bydgoszcz_3.jpg', '/assets/product-photos/durag-bydgoszcz/durag-bydgoszcz_4.jpg', '/assets/product-photos/durag-bydgoszcz/durag-bydgoszcz_5.jpg', '/assets/product-photos/durag-bydgoszcz/durag-bydgoszcz_6.jpg'], '[{"name":"Copper Cupro","hex":"#B87333"}]'::jsonb, '[{"author":"Igor W.","rating":5,"comment":"Miedź na cupro wygląda zjawiskowo.","date":"13.06.2026"}]'::jsonb, 10, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  name_en = EXCLUDED.name_en,
  price = EXCLUDED.price,
  category = EXCLUDED.category,
  category_label = EXCLUDED.category_label,
  material = EXCLUDED.material,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  colors = EXCLUDED.colors;

INSERT INTO products (id, name, name_en, price, category, category_label, material, description, images, colors, reviews, stock, visible)
VALUES (1378, 'Durag Chałupy — Błękitna Satyna', 'Durag Chałupy Ocean Blue Satin', 79, 'satin', 'Satyna Poliestrowa', 'Lekka Satyna Poliestrowa', 'Zainspirowany surferskim klimatem Półwyspu Helskiego, morskim wiatrem i bezkresem Bałtyku. Błękitna satyna o wysokim połysku daje poczucie lekkości i wolności.', ARRAY['/assets/product-photos/durag-chalupy/durag-chalupy_1.jpg', '/assets/product-photos/durag-chalupy/durag-chalupy_2.jpg', '/assets/product-photos/durag-chalupy/durag-chalupy_3.jpg', '/assets/product-photos/durag-chalupy/durag-chalupy_4.jpg', '/assets/product-photos/durag-chalupy/durag-chalupy_5.jpg', '/assets/product-photos/durag-chalupy/durag-chalupy_6.jpg'], '[{"name":"Ocean Blue","hex":"#4A90E2"}]'::jsonb, '[{"author":"Mikołaj C.","rating":5,"comment":"Świetny kolor na lato.","date":"07.06.2026"}]'::jsonb, 10, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  name_en = EXCLUDED.name_en,
  price = EXCLUDED.price,
  category = EXCLUDED.category,
  category_label = EXCLUDED.category_label,
  material = EXCLUDED.material,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  colors = EXCLUDED.colors;

INSERT INTO products (id, name, name_en, price, category, category_label, material, description, images, colors, reviews, stock, visible)
VALUES (1386, 'Durag Częstochowa — Stalowy Welur', 'Durag Częstochowa Steel Grey Velvet', 89, 'velvet', 'Luksusowy Welur', 'Stalowo-Szary Welur Poliestrowy', 'Wyrazisty, surowy durag wykonany ze szlachetnego weluru w odcieniu stali i grafitu. Gęsty splot zapewnia pewną kompresję fryzury, a aksamitna struktura odbija światło z industrialną elegancją.', ARRAY['/assets/product-photos/durag-czestochowa/durag-czestochowa_1.jpg', '/assets/product-photos/durag-czestochowa/durag-czestochowa_2.jpg', '/assets/product-photos/durag-czestochowa/durag-czestochowa_3.jpg', '/assets/product-photos/durag-czestochowa/durag-czestochowa_4.jpg', '/assets/product-photos/durag-czestochowa/durag-czestochowa_5.jpg'], '[{"name":"Steel Grey","hex":"#7E8287"}]'::jsonb, '[{"author":"Konrad M.","rating":5,"comment":"Idealny odcień szarości, materiał gruby i porządny.","date":"03.06.2026"}]'::jsonb, 10, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  name_en = EXCLUDED.name_en,
  price = EXCLUDED.price,
  category = EXCLUDED.category,
  category_label = EXCLUDED.category_label,
  material = EXCLUDED.material,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  colors = EXCLUDED.colors;

INSERT INTO products (id, name, name_en, price, category, category_label, material, description, images, colors, reviews, stock, visible)
VALUES (1376, 'Durag Elbląg — Niebieskie Military Camo', 'Durag Elbląg Blue Camo Satin', 79, 'satin', 'Satyna Poliestrowa', 'Satyna Poliestrowa z Nadrukiem', 'Dynamiczny durag w morskim kamuflażu, uszyty z gładkiej satyny o lekkim połysku. Łączy militarny charakter z grą wodnych odcieni błękitu i granatu.', ARRAY['/assets/product-photos/durag-elblag/durag-elblag_1.jpg', '/assets/product-photos/durag-elblag/durag-elblag_2.jpg', '/assets/product-photos/durag-elblag/durag-elblag_3.jpg', '/assets/product-photos/durag-elblag/durag-elblag_4.jpg'], '[{"name":"Blue Camo","hex":"#2B4C7E"}]'::jsonb, '[{"author":"Artur N.","rating":5,"comment":"Wzór na żywo robi wrażenie.","date":"24.05.2026"}]'::jsonb, 10, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  name_en = EXCLUDED.name_en,
  price = EXCLUDED.price,
  category = EXCLUDED.category,
  category_label = EXCLUDED.category_label,
  material = EXCLUDED.material,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  colors = EXCLUDED.colors;

INSERT INTO products (id, name, name_en, price, category, category_label, material, description, images, colors, reviews, stock, visible)
VALUES (1382, 'Durag Gdańsk — Niebieski Welur', 'Durag Gdańsk Baltic Blue Velvet', 89, 'velvet', 'Luksusowy Welur', 'Głęboki Morski Welur', 'Nawiązuje do morskich głębin i stoczniowej historii Gdańska. Nasycony, atramentowo-niebieski welur o szlachetnym połysku zapewnia optymalną kompresję fal 360 waves.', ARRAY['/assets/product-photos/durag-gdansk/durag-gdansk_1.jpg', '/assets/product-photos/durag-gdansk/durag-gdansk_2.jpg', '/assets/product-photos/durag-gdansk/durag-gdansk_3.jpg', '/assets/product-photos/durag-gdansk/durag-gdansk_4.jpg', '/assets/product-photos/durag-gdansk/durag-gdansk_5.jpg', '/assets/product-photos/durag-gdansk/durag-gdansk_6.jpg'], '[{"name":"Baltic Deep Blue","hex":"#1A365D"}]'::jsonb, '[{"author":"Jakub T.","rating":5,"comment":"Mega kolor, welur pierwsza klasa.","date":"02.05.2026"}]'::jsonb, 10, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  name_en = EXCLUDED.name_en,
  price = EXCLUDED.price,
  category = EXCLUDED.category,
  category_label = EXCLUDED.category_label,
  material = EXCLUDED.material,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  colors = EXCLUDED.colors;

INSERT INTO products (id, name, name_en, price, category, category_label, material, description, images, colors, reviews, stock, visible)
VALUES (1372, 'Durag Katowice — Fioletowa Satyna', 'Durag Katowice Purple Satin', 79, 'satin', 'Satyna Poliestrowa', 'Połyskująca Satyna Poliestrowa', 'Zainspirowany neonową energią katowickiej Strefy Kultury i industrialnym modernizmem Śląska. Nasycony ametystowy fiolet w satynowym wydaniu przyciąga wzrok i podkreśla indywidualność.', ARRAY['/assets/product-photos/durag-katowice/durag-katowice_1.jpg', '/assets/product-photos/durag-katowice/durag-katowice_2.jpg', '/assets/product-photos/durag-katowice/durag-katowice_3.jpg', '/assets/product-photos/durag-katowice/durag-katowice_4.jpg', '/assets/product-photos/durag-katowice/durag-katowice_5.jpg', '/assets/product-photos/durag-katowice/durag-katowice_6.jpg'], '[{"name":"Neon Purple","hex":"#8A2BE2"}]'::jsonb, '[{"author":"Marcin W.","rating":5,"comment":"Mega wyrazisty kolor. Wyróżnia się w tłumie.","date":"16.05.2026"}]'::jsonb, 10, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  name_en = EXCLUDED.name_en,
  price = EXCLUDED.price,
  category = EXCLUDED.category,
  category_label = EXCLUDED.category_label,
  material = EXCLUDED.material,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  colors = EXCLUDED.colors;

INSERT INTO products (id, name, name_en, price, category, category_label, material, description, images, colors, reviews, stock, visible)
VALUES (1374, 'Durag Kielce — Czerwona Satyna', 'Durag Kielce Crimson Red Satin', 79, 'satin', 'Satyna Poliestrowa', 'Intensywna Satyna Poliestrowa', 'Wyrazista, krwista czerwień o głębokim satynowym blasku. Inspirowana geologyczną energią Gór Świętokrzyskich i bezkompromisowym charakterem miasta.', ARRAY['/assets/product-photos/durag-kielce/durag-kielce_1.jpg', '/assets/product-photos/durag-kielce/durag-kielce_2.jpg', '/assets/product-photos/durag-kielce/durag-kielce_3.jpg', '/assets/product-photos/durag-kielce/durag-kielce_4.jpg', '/assets/product-photos/durag-kielce/durag-kielce_5.jpg', '/assets/product-photos/durag-kielce/durag-kielce_6.jpg'], '[{"name":"Crimson Red","hex":"#C41E3A"}]'::jsonb, '[{"author":"Grzegorz N.","rating":5,"comment":"Czerwień jest bardzo głęboka, satyna super śliska.","date":"21.05.2026"}]'::jsonb, 10, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  name_en = EXCLUDED.name_en,
  price = EXCLUDED.price,
  category = EXCLUDED.category,
  category_label = EXCLUDED.category_label,
  material = EXCLUDED.material,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  colors = EXCLUDED.colors;

INSERT INTO products (id, name, name_en, price, category, category_label, material, description, images, colors, reviews, stock, visible)
VALUES (1377, 'Durag Legionowo — Klasyczne Military Camo', 'Durag Legionowo Classic Camo Satin', 79, 'satin', 'Satyna Poliestrowa', 'Satyna Poliestrowa Military Camo', 'Nawiązanie do wojskowych tradycji garnizonowych Mazowsza. Klasyczny wzór moro w odcieniach oliwki, khaki i czerni przeniesiony na ultragładką satynę.', ARRAY['/assets/product-photos/durag-legionowo/durag-legionowo_1.jpg', '/assets/product-photos/durag-legionowo/durag-legionowo_2.jpg', '/assets/product-photos/durag-legionowo/durag-legionowo_3.jpg'], '[{"name":"Classic Camo","hex":"#4B5320"}]'::jsonb, '[{"author":"Filip Z.","rating":5,"comment":"Najlepsze moro jakie widziałem na duragu.","date":"14.05.2026"}]'::jsonb, 10, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  name_en = EXCLUDED.name_en,
  price = EXCLUDED.price,
  category = EXCLUDED.category,
  category_label = EXCLUDED.category_label,
  material = EXCLUDED.material,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  colors = EXCLUDED.colors;

INSERT INTO products (id, name, name_en, price, category, category_label, material, description, images, colors, reviews, stock, visible)
VALUES (1387, 'Durag Olsztyn — Kobaltowa Satyna', 'Durag Olsztyn Cobalt Satin', 79, 'satin', 'Satyna Poliestrowa', 'Lśniąca Satyna Kobaltowa', 'Inspirowany Krainą Tysiąca Jezior, czystym niebem nad Warmią i głębią nasyconego błękitu. Lśniąca satyna o wyjątkowej gładkości, która doskonale chroni włosy przed łamaniem.', ARRAY['/assets/product-photos/durag-olsztyn/durag-olsztyn_1.jpg', '/assets/product-photos/durag-olsztyn/durag-olsztyn_2.jpg', '/assets/product-photos/durag-olsztyn/durag-olsztyn_3.jpg', '/assets/product-photos/durag-olsztyn/durag-olsztyn_4.jpg', '/assets/product-photos/durag-olsztyn/durag-olsztyn_5.jpg', '/assets/product-photos/durag-olsztyn/durag-olsztyn_6.jpg'], '[{"name":"Royal Cobalt","hex":"#1A3B8B"}]'::jsonb, '[{"author":"Rafał P.","rating":5,"comment":"Cudowny, nasycony błękit. Bardzo wygodny.","date":"05.06.2026"}]'::jsonb, 10, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  name_en = EXCLUDED.name_en,
  price = EXCLUDED.price,
  category = EXCLUDED.category,
  category_label = EXCLUDED.category_label,
  material = EXCLUDED.material,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  colors = EXCLUDED.colors;

INSERT INTO products (id, name, name_en, price, category, category_label, material, description, images, colors, reviews, stock, visible)
VALUES (1384, 'Durag Poznań — Fioletowy Welur', 'Durag Poznań Purple Velvet', 89, 'velvet', 'Luksusowy Welur', 'Nasycony Fioletowy Welur', 'Inspirowany wielkomiejskim rytmem i dumną estetyką stolicy Wielkopolski. Welur w odcieniu nasyconego fioletu to propozycja dla tych, którzy szukają unikalnej faktury.', ARRAY['/assets/product-photos/durag-poznan/durag-poznan_1.jpg', '/assets/product-photos/durag-poznan/durag-poznan_2.jpg', '/assets/product-photos/durag-poznan/durag-poznan_3.jpg', '/assets/product-photos/durag-poznan/durag-poznan_4.jpg', '/assets/product-photos/durag-poznan/durag-poznan_5.jpg', '/assets/product-photos/durag-poznan/durag-poznan_6.jpg'], '[{"name":"Imperial Purple","hex":"#4A0E4E"}]'::jsonb, '[{"author":"Krystian L.","rating":5,"comment":"Niesamowity fiolet, miękki i gęsty materiał.","date":"09.06.2026"}]'::jsonb, 10, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  name_en = EXCLUDED.name_en,
  price = EXCLUDED.price,
  category = EXCLUDED.category,
  category_label = EXCLUDED.category_label,
  material = EXCLUDED.material,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  colors = EXCLUDED.colors;

INSERT INTO products (id, name, name_en, price, category, category_label, material, description, images, colors, reviews, stock, visible)
VALUES (1371, 'Durag Radom — Granatowy Welur', 'Durag Radom Navy Velvet', 89, 'velvet', 'Luksusowy Welur', 'Miękki Welur Poliestrowy', 'Stylowy granatowy durag z mięsistego weluru o delikatnym, szlachetnym połysku. Trwały materiał pozwala na długotrwałe utrzymanie fryzury i świetnie komponuje się ze streetwearowymi stylizacjami.', ARRAY['/assets/product-photos/durag-radom/durag-radom_1.jpg', '/assets/product-photos/durag-radom/durag-radom_2.jpg', '/assets/product-photos/durag-radom/durag-radom_3.jpg'], '[{"name":"Navy Blue","hex":"#1B2A4A"}]'::jsonb, '[{"author":"Bartłomiej S.","rating":5,"comment":"Bardzo dobry welur, pasy odpowiedniej długości.","date":"19.05.2026"}]'::jsonb, 10, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  name_en = EXCLUDED.name_en,
  price = EXCLUDED.price,
  category = EXCLUDED.category,
  category_label = EXCLUDED.category_label,
  material = EXCLUDED.material,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  colors = EXCLUDED.colors;

INSERT INTO products (id, name, name_en, price, category, category_label, material, description, images, colors, reviews, stock, visible)
VALUES (1383, 'Durag Szczecin — Srebrny Welur', 'Durag Szczecin Silver Velvet', 89, 'velvet', 'Luksusowy Welur', 'Srebrzysty Welur Poliestrowy', 'Nawiązanie do portowego i stoczniowego dziedzictwa Szczecina. Welur w odcieniu szczotkowanego srebra i metalicznej szarości, który subtelnie mieni się w słońcu.', ARRAY['/assets/product-photos/durag-szczecin/durag-szczecin_1.jpg', '/assets/product-photos/durag-szczecin/durag-szczecin_2.jpg', '/assets/product-photos/durag-szczecin/durag-szczecin_3.jpg', '/assets/product-photos/durag-szczecin/durag-szczecin_4.jpg', '/assets/product-photos/durag-szczecin/durag-szczecin_5.jpg', '/assets/product-photos/durag-szczecin/durag-szczecin_6.jpg'], '[{"name":"Stocznia Silver","hex":"#A8A9AD"}]'::jsonb, '[{"author":"Norbert D.","rating":5,"comment":"Srebrny welur wygląda bardzo luksusowo.","date":"16.05.2026"}]'::jsonb, 10, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  name_en = EXCLUDED.name_en,
  price = EXCLUDED.price,
  category = EXCLUDED.category,
  category_label = EXCLUDED.category_label,
  material = EXCLUDED.material,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  colors = EXCLUDED.colors;

INSERT INTO products (id, name, name_en, price, category, category_label, material, description, images, colors, reviews, stock, visible)
VALUES (1379, 'Durag Tychy — Granatowa Satyna', 'Durag Tychy Navy Satin', 79, 'satin', 'Satyna Poliestrowa', 'Gładka Satyna Poliestrowa', 'Klasyczny, głęboki granat w satynowym, ultragładkim wykończeniu. Inspirowany modernistyczną architekturą Tychów i harmonią formy. Idealny na co dzień.', ARRAY['/assets/product-photos/durag-tychy/durag-tychy_1.jpg', '/assets/product-photos/durag-tychy/durag-tychy_2.jpg', '/assets/product-photos/durag-tychy/durag-tychy_3.jpg', '/assets/product-photos/durag-tychy/durag-tychy_4.jpg', '/assets/product-photos/durag-tychy/durag-tychy_5.jpg', '/assets/product-photos/durag-tychy/durag-tychy_6.jpg'], '[{"name":"Navy Blue","hex":"#1B2A4A"}]'::jsonb, '[{"author":"Kacper W.","rating":5,"comment":"Klasyczny, elegancki granat. Satyna pierwszej jakości.","date":"28.05.2026"}]'::jsonb, 10, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  name_en = EXCLUDED.name_en,
  price = EXCLUDED.price,
  category = EXCLUDED.category,
  category_label = EXCLUDED.category_label,
  material = EXCLUDED.material,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  colors = EXCLUDED.colors;

INSERT INTO products (id, name, name_en, price, category, category_label, material, description, images, colors, reviews, stock, visible)
VALUES (1381, 'Durag Włocławek — Czerwony Welur', 'Durag Włocławek Red Velvet', 89, 'velvet', 'Luksusowy Welur', 'Intensywny Czerwony Welur', 'Wyrazisty, odważny durag w odcieniu intensywnej szkarłatnej czerwieni. Aksamitny welur miękko układa się na głowie i stanowi najmocniejszy punkt całego fitu.', ARRAY['/assets/product-photos/durag-wloclawek/durag-wloclawek_1.jpg', '/assets/product-photos/durag-wloclawek/durag-wloclawek_2.jpg', '/assets/product-photos/durag-wloclawek/durag-wloclawek_3.jpg', '/assets/product-photos/durag-wloclawek/durag-wloclawek_4.jpg'], '[{"name":"Imperial Red","hex":"#B22222"}]'::jsonb, '[{"author":"Paweł K.","rating":5,"comment":"Robi wrażenie w stylówkach, welur bardzo miękki.","date":"17.05.2026"}]'::jsonb, 10, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  name_en = EXCLUDED.name_en,
  price = EXCLUDED.price,
  category = EXCLUDED.category,
  category_label = EXCLUDED.category_label,
  material = EXCLUDED.material,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  colors = EXCLUDED.colors;

INSERT INTO products (id, name, name_en, price, category, category_label, material, description, images, colors, reviews, stock, visible)
VALUES (1373, 'Durag Zabrze — Srebrna Satyna', 'Durag Zabrze Silver Satin', 79, 'satin', 'Satyna Poliestrowa', 'Srebrzysta Satyna Poliestrowa', 'Inspirowany metalicznym blaskiem przemysłowych maszyn i górniczym sercem Śląska. Nowoczesna, srebrzysta satyna o chłodnym połysku i wyjątkowej gładkości.', ARRAY['/assets/product-photos/durag-zabrze/durag-zabrze_1.jpg', '/assets/product-photos/durag-zabrze/durag-zabrze_2.jpg', '/assets/product-photos/durag-zabrze/durag-zabrze_3.jpg', '/assets/product-photos/durag-zabrze/durag-zabrze_4.jpg', '/assets/product-photos/durag-zabrze/durag-zabrze_5.jpg', '/assets/product-photos/durag-zabrze/durag-zabrze_6.jpg'], '[{"name":"Futuristic Silver","hex":"#C0C0C0"}]'::jsonb, '[{"author":"Damian B.","rating":5,"comment":"Ciekawy, futurystyczny srebrny odcień.","date":"26.05.2026"}]'::jsonb, 10, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  name_en = EXCLUDED.name_en,
  price = EXCLUDED.price,
  category = EXCLUDED.category,
  category_label = EXCLUDED.category_label,
  material = EXCLUDED.material,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  colors = EXCLUDED.colors;

INSERT INTO products (id, name, name_en, price, category, category_label, material, description, images, colors, reviews, stock, visible)
VALUES (1367, 'Durag Żyrardów — Czarny / Beżowy Len', 'Durag Żyrardów Black / Beige Linen', 119, 'seasonal', 'Sezonowe Materiały', '100% Naturalny Len Polski', 'Hołd dla polskiej stolicy lniarstwa. Wykonany z naturalnego, przewiewnego lnu, który gwarantuje doskonałą cyrkulację powietrza w cieplejsze dni. Surowa, naturalna tekstura i niespotykany dotąd w duragach organiczny chłód.', ARRAY['/assets/product-photos/durag-zyrardow/durag-zyrardow_1.jpg', '/assets/product-photos/durag-zyrardow/durag-zyrardow_2.jpg', '/assets/product-photos/durag-zyrardow/durag-zyrardow_3.jpg', '/assets/product-photos/durag-zyrardow/durag-zyrardow_4.jpg', '/assets/product-photos/durag-zyrardow/durag-zyrardow_5.jpg', '/assets/product-photos/durag-zyrardow/durag-zyrardow_6.jpg'], '[{"name":"Linen Black","hex":"#1A1A1A"},{"name":"Natural Beige","hex":"#D2B48C"}]'::jsonb, '[{"author":"Wojciech M.","rating":5,"comment":"Len na lato to totalny gamechanger.","date":"04.06.2026"}]'::jsonb, 10, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  name_en = EXCLUDED.name_en,
  price = EXCLUDED.price,
  category = EXCLUDED.category,
  category_label = EXCLUDED.category_label,
  material = EXCLUDED.material,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  colors = EXCLUDED.colors;

INSERT INTO products (id, name, name_en, price, category, category_label, material, description, images, colors, reviews, stock, visible)
VALUES (1388, 'Durag Biała Podlaska — Szampańska Satyna', 'Durag Biała Podlaska Champagne Satin', 79, 'satin', 'Satyna Poliestrowa', 'Szampańska Satyna Premium', 'Inspirowany delikatnym światłem wschodniego Mazowsza i szlachetną prostotą. Szampańsko-kremowa satyna łączy wysublimowany, ciepły blask z delikatnym, aksamitnym chwytem.', ARRAY['/assets/product-photos/durag-biala-podlaska/durag-biala-podlaska_1.jpg', '/assets/product-photos/durag-biala-podlaska/durag-biala-podlaska_2.jpg', '/assets/product-photos/durag-biala-podlaska/durag-biala-podlaska_3.jpg', '/assets/product-photos/durag-biala-podlaska/durag-biala-podlaska_4.jpg', '/assets/product-photos/durag-biala-podlaska/durag-biala-podlaska_5.jpg'], '[{"name":"Champagne Cream","hex":"#E8E2D5"}]'::jsonb, '[{"author":"Hubert D.","rating":5,"comment":"Świetny szampański kolor, rzadko spotykany.","date":"11.06.2026"}]'::jsonb, 10, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  name_en = EXCLUDED.name_en,
  price = EXCLUDED.price,
  category = EXCLUDED.category,
  category_label = EXCLUDED.category_label,
  material = EXCLUDED.material,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  colors = EXCLUDED.colors;

INSERT INTO products (id, name, name_en, price, category, category_label, material, description, images, colors, reviews, stock, visible)
VALUES (1368, 'Durag Stalowa Wola — Biała / Czarna Mirella', 'Durag Stalowa Wola White / Black Mirella', 99, 'seasonal', 'Sezonowe Materiały', 'Krepa Satynowa Mirella', 'Wykonany ze specjalistycznej krepy satynowej Mirella łączącej mocniejszą strukturę z eleganckim połyskiem. Inspirowany hutniczą tradycją i geometryczną siłą Stalowej Woli.', ARRAY['/assets/products/durag-stalowa-wola_1.jpg', '/assets/products/durag-stalowa-wola_2.jpg', '/assets/products/durag-stalowa-wola_3.jpg'], '[{"name":"Pure White","hex":"#FFFFFF"},{"name":"Deep Black","hex":"#000000"}]'::jsonb, '[{"author":"Michał P.","rating":5,"comment":"Krepa mirella trzyma fason jak żaden inny.","date":"19.05.2026"}]'::jsonb, 10, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  name_en = EXCLUDED.name_en,
  price = EXCLUDED.price,
  category = EXCLUDED.category,
  category_label = EXCLUDED.category_label,
  material = EXCLUDED.material,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  colors = EXCLUDED.colors;

INSERT INTO products (id, name, name_en, price, category, category_label, material, description, images, colors, reviews, stock, visible)
VALUES (13691, 'Durag Barbie — Różowa Satyna', 'Durag Barbie Pink Satin', 79, 'satin', 'Satyna Poliestrowa', 'Lśniąca Satyna Poliestrowa', 'Żywy, energiczny róż inspirowany popkulturą i beztroskim klimatem Y2K. Gładka, połyskująca satyna, która dodaje odwagi każdej stylizacji.', ARRAY['/assets/products/durag-barbie_1.png', '/assets/products/durag-barbie_2.jpg', '/assets/products/durag-barbie_3.jpg'], '[{"name":"Barbie Pink","hex":"#FF69B4"}]'::jsonb, '[{"author":"Wiktoria C.","rating":5,"comment":"Cudowny róż, na imprezy sztos!","date":"27.05.2026"}]'::jsonb, 10, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  name_en = EXCLUDED.name_en,
  price = EXCLUDED.price,
  category = EXCLUDED.category,
  category_label = EXCLUDED.category_label,
  material = EXCLUDED.material,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  colors = EXCLUDED.colors;

INSERT INTO products (id, name, name_en, price, category, category_label, material, description, images, colors, reviews, stock, visible)
VALUES (1375, 'Durag Rzeszów — Wzorzysty Fiolet Satyna', 'Durag Rzeszów Patterned Purple Satin', 79, 'satin', 'Satyna Poliestrowa', 'Wzorzysta Satyna Poliestrowa', 'Wyjątkowy model łączący geometryczne, vintage wzory z głębokim odcieniem fioletu. Dla tych, którzy chcą czegoś więcej niż jednolitego koloru.', ARRAY['/assets/products/durag-rzeszow_1.png', '/assets/products/durag-rzeszow_2.jpg', '/assets/products/durag-rzeszow_3.jpg'], '[{"name":"Pattern Purple","hex":"#6A0DAD"}]'::jsonb, '[{"author":"Kamil B.","rating":5,"comment":"Wzór wygląda genialnie pod światło.","date":"12.05.2026"}]'::jsonb, 10, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  name_en = EXCLUDED.name_en,
  price = EXCLUDED.price,
  category = EXCLUDED.category,
  category_label = EXCLUDED.category_label,
  material = EXCLUDED.material,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  colors = EXCLUDED.colors;

INSERT INTO products (id, name, name_en, price, category, category_label, material, description, images, colors, reviews, stock, visible)
VALUES (1380, 'Durag Sosnowiec — Zielony Welur', 'Durag Sosnowiec Emerald Green Velvet', 89, 'velvet', 'Luksusowy Welur', 'Mięsisty Welur Szmaragdowy', 'Głęboka, szlachetna zieleń welwetu nawiązująca do igliwia sosny i siły natury. Aksamitnie gładki, mocno trzymający fale durag o unikalnym odcieniu.', ARRAY['/assets/products/durag-sosnowiec_1.png', '/assets/products/durag-sosnowiec_2.jpg', '/assets/products/durag-sosnowiec_3.webp'], '[{"name":"Bottle Green","hex":"#004225"}]'::jsonb, '[{"author":"Marcin P.","rating":5,"comment":"Zieleń butelkowa w welurze to po prostu poezja.","date":"08.06.2026"}]'::jsonb, 10, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  name_en = EXCLUDED.name_en,
  price = EXCLUDED.price,
  category = EXCLUDED.category,
  category_label = EXCLUDED.category_label,
  material = EXCLUDED.material,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  colors = EXCLUDED.colors;

INSERT INTO products (id, name, name_en, price, category, category_label, material, description, images, colors, reviews, stock, visible)
VALUES (2001, 'Wave Brush Premium — Szczotka z Włosia Dzika', 'Wave Brush Premium 100% Boar Bristle', 69, 'accessories', 'Akcesoria do Fal', '100% Naturalne Włosie Dzika & Drewno', 'Profesjonalna zakrzywiona szczotka wave brush wykonana z naturalnego włosia dzika o średniej twardości (medium) osadzonego w ergonomicznym drewnianym korpusie. Rozprowadza naturalne olejki skóry głowy, wygładza i buduje perfekcyjne fale 360 waves.', ARRAY['/assets/wave_brush_premium.png'], '[{"name":"Classic Walnut","hex":"#5C3A21"}]'::jsonb, '[{"author":"Damian Z.","rating":5,"comment":"Świetnie leży w dłoni, włosie idealnej twardości do 360.","date":"15.05.2026"}]'::jsonb, 10, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  name_en = EXCLUDED.name_en,
  price = EXCLUDED.price,
  category = EXCLUDED.category,
  category_label = EXCLUDED.category_label,
  material = EXCLUDED.material,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  colors = EXCLUDED.colors;

INSERT INTO products (id, name, name_en, price, category, category_label, material, description, images, colors, reviews, stock, visible)
VALUES (2002, 'Wave Cap Classic — Czepek Kompresyjny', 'Wave Cap Classic Compression Cap', 39, 'accessories', 'Akcesoria do Fal', 'Elastyczny Spandex Kompresyjny', 'Cienki, przewiewny czepek kompresyjny do noszenia pod duragiem lub na noc. Zapewnia podwójną kompresję (double compression method) zapobiegając przesuwaniu się fryzury podczas snu.', ARRAY['/assets/wave_cap_classic.png'], '[{"name":"Pure Black","hex":"#111111"}]'::jsonb, '[{"author":"Patryk K.","rating":5,"comment":"Niezbędny do spania, durag się nie zsuwa.","date":"20.05.2026"}]'::jsonb, 10, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  name_en = EXCLUDED.name_en,
  price = EXCLUDED.price,
  category = EXCLUDED.category,
  category_label = EXCLUDED.category_label,
  material = EXCLUDED.material,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  colors = EXCLUDED.colors;

INSERT INTO products (id, name, name_en, price, category, category_label, material, description, images, colors, reviews, stock, visible)
VALUES (2003, 'Wave Elixir — Organiczny Olejek do Włosów (50ml)', 'Wave Elixir Natural Hair & Scalp Oil (50ml)', 59, 'accessories', 'Akcesoria do Fal', '100% Organiczne Oleje Naturalne', 'Autorska kompozycja tłoczonych na zimno olejów arganowego, jojoba i rycynowego z dodatkiem witaminy E. Zmiękcza strukturę włosa, przyspiesza układanie fal 360 waves i nadaje jedwabisty połysk.', ARRAY['/assets/wave_elixir_bottle.png'], '[{"name":"Amber Gold","hex":"#D4AF37"}]'::jsonb, '[{"author":"Kamil R.","rating":5,"comment":"Włosy są miękkie i fale znacznie szybciej się układają.","date":"01.06.2026"}]'::jsonb, 10, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  name_en = EXCLUDED.name_en,
  price = EXCLUDED.price,
  category = EXCLUDED.category,
  category_label = EXCLUDED.category_label,
  material = EXCLUDED.material,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  colors = EXCLUDED.colors;

SELECT setval('products_id_seq', (SELECT MAX(id) FROM products));
