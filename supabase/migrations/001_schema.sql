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
