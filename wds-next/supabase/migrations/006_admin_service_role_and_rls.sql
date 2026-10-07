-- ============================================================================
-- Migration 006: Zabezpieczenie Panelu Administratora i Polityki RLS
-- ============================================================================
-- Opis:
-- Panel administratora Warsaw Durag Store działa z autoryzacją serwerową Next.js,
-- wykorzystując klucz SUPABASE_SERVICE_ROLE_KEY przez dedykowane endpointy /api/admin/*.
--
-- Poniższy skrypt upewnia się, że polityki RLS są w pełni zgodne:
-- 1. Tabele posiadają pełne uprawnienia dla service_role.
-- 2. W razie chęci tymczasowego zezwolenia na operacje zapisu anonimowego
--    (np. przy testach lokalnych bez sesji admina), odkomentuj sekcję OPCJONALNĄ na dole.
-- ============================================================================

-- Upewnienie się, że RLS jest włączone
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;

-- 1. Service role (pełny dostęp dla serwera / API Next.js)
DROP POLICY IF EXISTS "Admin full access products" ON products;
CREATE POLICY "Admin full access products"
  ON products FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Admin full access orders" ON orders;
CREATE POLICY "Admin full access orders"
  ON orders FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Admin full access site_settings" ON site_settings;
CREATE POLICY "Admin full access site_settings"
  ON site_settings FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Admin full access promo_codes" ON promo_codes;
CREATE POLICY "Admin full access promo_codes"
  ON promo_codes FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- 2. Dostęp publiczny dla klientów sklepu (odczyt produktów i składanie zamówień)
DROP POLICY IF EXISTS "Public can view visible products" ON products;
CREATE POLICY "Public can view visible products"
  ON products FOR SELECT
  USING (visible = true);

DROP POLICY IF EXISTS "Public can insert orders" ON orders;
CREATE POLICY "Public can insert orders"
  ON orders FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Public can view orders" ON orders;
CREATE POLICY "Public can view orders"
  ON orders FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Public can view site settings" ON site_settings;
CREATE POLICY "Public can view site settings"
  ON site_settings FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Public can view active promo codes" ON promo_codes;
CREATE POLICY "Public can view active promo codes"
  ON promo_codes FOR SELECT
  USING (active = true);

-- ============================================================================
-- OPCJONALNIE: Odkomentuj poniższe linie, jeśli chcesz pozwolić przeglądarce
-- na bezpośredni zapis bez pośrednictwa API serwerowego (mniej bezpieczne):
--
-- DROP POLICY IF EXISTS "Enable all access for products" ON products;
-- CREATE POLICY "Enable all access for products" ON products FOR ALL USING (true) WITH CHECK (true);
-- ============================================================================
