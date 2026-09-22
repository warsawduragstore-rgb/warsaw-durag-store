-- ========================================================================
-- WARSAW DURAG STORE — TECH SPEC MIGRATION (IDEMPOTENT / SAFE TO RUN)
-- Wklej do: Supabase Dashboard → SQL Editor → Run
-- ========================================================================

-- 1. Dodanie pola promo_eligible do tabeli products (wymóg ze specyfikacji dla promocji 3 gratis)
ALTER TABLE products 
  ADD COLUMN IF NOT EXISTS promo_eligible BOOLEAN NOT NULL DEFAULT true;

-- Akcesoria (wave brush, wave capy) domyślnie wyłączone z promocji BOGO na duragi
UPDATE products 
  SET promo_eligible = false 
  WHERE category = 'accessories';

-- 2. Dodanie pola point_id do tabeli orders (identyfikator paczkomatu InPost wg specyfikacji)
ALTER TABLE orders 
  ADD COLUMN IF NOT EXISTS point_id TEXT;

-- 3. Indeks na kolumnę promo_eligible i category dla wydajności filtrowania
CREATE INDEX IF NOT EXISTS idx_products_promo_eligible ON products(promo_eligible);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
