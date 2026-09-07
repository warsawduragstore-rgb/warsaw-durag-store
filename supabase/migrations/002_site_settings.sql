-- ========================================================================
-- WARSAW DURAG STORE — SITE SETTINGS CMS MIGRATION
-- Wklej do: Supabase Dashboard → SQL Editor → Run
-- ========================================================================

CREATE TABLE IF NOT EXISTS site_settings (
  id            BIGSERIAL PRIMARY KEY,
  key           TEXT NOT NULL UNIQUE,
  value         TEXT NOT NULL,
  label         TEXT NOT NULL,
  category      TEXT NOT NULL DEFAULT 'general',
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable all access for site_settings" ON site_settings;
CREATE POLICY "Enable all access for site_settings"
  ON site_settings FOR ALL
  USING (true)
  WITH CHECK (true);

-- Domyślne wartości CMS dla strony
INSERT INTO site_settings (key, value, label, category) VALUES
  ('announcement_bar', 'Darmowa wysyłka InPost od 150 PLN • Ręczne pakowanie w Warszawie • Wysyłka w 24h', 'Pasek ogłoszeń u góry strony', 'header'),
  ('hero_badge', 'Atelier Warszawa 2026 • 100% Mulberry Silk', 'Odznaka w sekcji Hero', 'hero'),
  ('hero_title', 'Ręcznie Szyte Duragi Jedwabne i Satynowe', 'Główny tytuł sklepu', 'hero'),
  ('hero_subtitle', 'Stworzone z myślą o perfekcyjnych falach 360 waves i ochronie włosów. Prawdziwy jedwab morwowy 19 Momme, szyty w warszawskim atelier.', 'Podtytuł sekcji Hero', 'hero'),
  ('contact_email', 'kontakt@warsawduragstore.pl', 'Adres E-mail kontaktowy', 'contact'),
  ('contact_phone', '+48 500 000 000', 'Telefon kontaktowy', 'contact'),
  ('instagram_handle', '@warsawduragstore', 'Konto Instagram', 'social')
ON CONFLICT (key) DO UPDATE SET
  label = EXCLUDED.label,
  category = EXCLUDED.category;
