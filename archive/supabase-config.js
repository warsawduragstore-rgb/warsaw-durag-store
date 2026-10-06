// ========================================================================
// WARSAW DURAG STORE — SUPABASE CLIENT CONFIGURATION
//
// !! UZUPEŁNIJ SWOJE KLUCZE PONIŻEJ !!
// Znajdziesz je w: Supabase Dashboard → Settings → API
(() => {


  // Inicjalizacja klienta Supabase z obsługą CDN w przeglądarce i fallbacku offline
  const createClient = window.supabase ? window.supabase.createClient : null;

  // 🔑 TWOJE KLUCZE SUPABASE — wklej tutaj wartości z dashboardu
  const SUPABASE_URL = 'https://jjljaljfmrqocnfglrij.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqbGphbGpmbXJxb2NuZmdscmlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg4MTE2NTMsImV4cCI6MjEwNDM4NzY1M30.ITrdxfCFOfQMmSPPBq8w0MPTzgaGqC2Qy8xdvWSX7Bk';

  // 🔗 URL Twojej Edge Function do wysyłki maili
  const EDGE_FUNCTION_URL = `${SUPABASE_URL}/functions/v1/send-order-email`;
  window.EDGE_FUNCTION_URL = EDGE_FUNCTION_URL;

  // 📦 INPOST GEOWIDGET TOKEN (Paczkomaty 24/7 mapa)
  const INPOST_GEOWIDGET_TOKEN = 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJzQlpXVzFNZzVlQnpDYU1XU3JvTlBjRWFveFpXcW9Ua2FuZVB3X291LWxvIn0.eyJleHAiOjIxMDEzNjM0NDIsImlhdCI6MTc4NjAwMzQ0MiwianRpIjoiNmE3ZTFkMDItNzg5YS00YTg3LThkOTQtMGMxMDc3MjE0YWI3IiwiaXNzIjoiaHR0cHM6Ly9sb2dpbi5pbnBvc3QucGwvYXV0aC9yZWFsbXMvZXh0ZXJuYWwiLCJzdWIiOiJmOjEyNDc1MDUxLTFjMDMtNGU1OS1iYTBjLTJiNDU2OTVlZjUzNTppbkdveXh5UldVdFVYZnZNcW83U0Q1T1RId3VwMnZPYm5nelkwWnBmdkQwIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoic2hpcHgiLCJzZXNzaW9uX3N0YXRlIjoiODkxZDE2OWYtYTFiMC00NjExLTk2NmEtNmJmMjg0ZmFhYjkyIiwic2NvcGUiOiJvcGVuaWQgYXBpOmFwaXBvaW50cyBhcGk6c2hpcHgiLCJzaWQiOiI4OTFkMTY5Zi1hMWIwLTQ2MTEtOTY2YS02YmYyODRmYWFiOTIiLCJhbGxvd2VkX3JlZmVycmVycyI6IiIsInV1aWQiOiJiZWQyMDU2NS1hNmM2LTRjNDItODVmNC1iMzdkMTZmOGU4NDciLCJlbWFpbCI6Im1pY2hhbHcxODZAZ21haWwuY29tIn0.aWnsGeifyk6Sxm0FhPLAe5ase-l0o4NPF63Cb1QGpnNFIsmMSdkVPV7ZWdxQcNuNPp6PXXiwlthYjpIkSjunElRnlcJfJmOtnX5C1mQxjnu0ZBu-OdOwxy2IVqc5hzCYcKzyEUdI4J_ftnFVDO8YR2-4Lay7P8Gsr_IgiNXm4FQL2AvrRTZapAuPWEWO0jSYNRWFw7EL8IFlbAiP-vUqR70DOFsL_F2LOzegMCUpuE3Qf8vq4Lf8ZdJ3lQ2DGpRphNJvDoOBU-khtV2wUVtsH4rEJyh9xuLBZ8XS_1tewtD3aJSU3j-TFbulb1SzwmcoP7nDP3ekQLNH9O_IZxVP9g';
  window.INPOST_GEOWIDGET_TOKEN = INPOST_GEOWIDGET_TOKEN;

  const supabase = createClient ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false
    }
  }) : null;
  window.supabaseClient = supabase;

  // ========================================================================
  // SEED FUNCTION — wykonuje się TYLKO RAZ przy całkowicie pustej bazie
  // Nie nadpisuje żadnych zmian wprowadzonych w bazie przez administratora!
  // ========================================================================
  async function seedProductsIfEmpty() {
    if (!supabase) {
      console.warn('[WDS] Supabase client is not initialized (offline fallback).');
      return false;
    }
    try {
      // Check if products table has any products
      const { count, error } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.warn('Supabase products check note:', error.message);
        return false;
      }

      // Jeśli w bazie są już jakiekolwiek produkty, nie nadpisujemy ich! Baza to źródło prawdy.
      if (count && count > 0) {
        console.log(`[WDS] ✓ Baza Supabase zawiera już ${count} produktów. Baza jest nadrzędnym źródłem prawdy.`);
        return true;
      }

      if (!window.products || window.products.length === 0) {
        console.warn('[WDS] Brak produktów do początkowego seedowania.');
        return false;
      }

      // Initial insert for clean empty database only
      const rows = window.products.map(p => ({
        id: p.id,
        name: p.name,
        name_en: p.nameEn || p.name,
        price: p.price,
        category: p.category,
        category_label: p.categoryLabel,
        material: p.material || '',
        description: p.description || '',
        images: p.images || [],
        colors: p.colors || [],
        reviews: p.reviews || [],
        stock: 10,
        visible: true
      }));

      const { error: insertError } = await supabase
        .from('products')
        .insert(rows);

      if (insertError) {
        console.warn('[WDS] Supabase initial seed note:', insertError.message);
      } else {
        console.log(`[WDS] ✓ Zainicjalizowano bazę danych Supabase ${rows.length} produktami.`);
      }
      return true;
    } catch (err) {
      console.warn('[WDS] Seed function error:', err);
      return false;
    }
  }
  window.seedProductsIfEmpty = seedProductsIfEmpty;

  // ========================================================================
  // CMS SITE CONTENT HELPERS — Zarządzanie treścią strony głównej
  // ========================================================================
  const CMS_STORAGE_KEY = 'wds_site_content_cache';

  // Pobieranie całej treści lub sekcji (z fallbackiem do localStorage i domyślnych)
  async function fetchSiteContent() {
    let cached = {};
    try {
      const local = localStorage.getItem(CMS_STORAGE_KEY);
      if (local) cached = JSON.parse(local);
    } catch (e) {}

    if (!supabase) {
      return cached;
    }

    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('*');

      if (!error && data && data.length > 0) {
        const result = { ...cached };
        data.forEach(item => {
          result[item.section_key] = item.content;
        });
        try {
          localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(result));
        } catch (e) {}
        return result;
      }
    } catch (err) {
      console.warn('[WDS] Nie udało się pobrać site_content z Supabase, używam cache lokalnego:', err);
    }

    return cached;
  }
  window.fetchSiteContent = fetchSiteContent;

  // Zapisywanie sekcji treści do Supabase i cache lokalnego
  async function saveSiteContent(sectionKey, content) {
    try {
      // 1. Zapisz natychmiast w localStorage dla zerowego opóźnienia
      let localCache = {};
      try {
        const local = localStorage.getItem(CMS_STORAGE_KEY);
        if (local) localCache = JSON.parse(local);
      } catch (e) {}
      localCache[sectionKey] = content;
      localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(localCache));

      // 2. Jeśli Supabase jest dostępne, zapisz w bazie
      if (supabase) {
        const { error } = await supabase
          .from('site_content')
          .upsert({
            section_key: sectionKey,
            content: content,
            updated_at: new Date().toISOString()
          }, { onConflict: 'section_key' });

        if (error) {
          console.warn(`[WDS CMS] Błąd zapisu sekcji ${sectionKey} do Supabase:`, error.message);
          return { success: false, error: error.message, cachedLocally: true };
        }
      }
      return { success: true };
    } catch (err) {
      console.error(`[WDS CMS] Błąd zapisu sekcji ${sectionKey}:`, err);
      return { success: false, error: err.message };
    }
  }
  window.saveSiteContent = saveSiteContent;

  // ========================================================================
  // HELPER: Sprawdź czy użytkownik jest zalogowany jako admin
  // ========================================================================
  async function getAdminSession() {
    if (!supabase) return null;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    } catch (e) {
      return null;
    }
  }
  window.getAdminSession = getAdminSession;
})();
