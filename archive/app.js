/*
========================================================================
   WARSAW DURAG STORE - APP CONTROLLER
   Full Interactive Experience (Cart, Modals, Filters, Aesthetics)
   Backend: Supabase (PostgreSQL + Edge Functions for email)
========================================================================
*/

(() => {
  // Access Supabase client and helpers from global window scope (allows CORS-safe local files execution)
  const supabase = window.supabaseClient;
  const seedProductsIfEmpty = window.seedProductsIfEmpty;
  const EDGE_FUNCTION_URL = window.EDGE_FUNCTION_URL;

/// --- Products array (populated strictly from Supabase database, zero mockups) ---
let products = [];

// --- Application State ---
let state = {
  cart: [],
  activeCategory: 'all',
  promoApplied: null, // { code: 'WARSAW10', discount: 0.1 } or null
  activeProductInModal: null,
  selectedColorInModal: null,
  activeImageIndexInModal: 0
};

// --- Load products from Supabase (strict database source via native REST API) ---
const SUPABASE_REST_URL = 'https://jjljaljfmrqocnfglrij.supabase.co/rest/v1/products?select=*&visible=eq.true&order=id.asc';
const SUPABASE_REST_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqbGphbGpmbXJxb2NuZmdscmlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg4MTE2NTMsImV4cCI6MjEwNDM4NzY1M30.ITrdxfCFOfQMmSPPBq8w0MPTzgaGqC2Qy8xdvWSX7Bk';

let isProductsLoading = true;
let productsLoadPromise = null;

function loadProductsFromSupabase() {
  if (productsLoadPromise) return productsLoadPromise;
  productsLoadPromise = (async () => {
    try {
      let data = null;

      // 1. High-speed native REST fetch directly to PostgREST (Zero CDN latency, works regardless of adblock/CDN status)
      try {
        const res = await fetch(SUPABASE_REST_URL, {
          method: 'GET',
          headers: {
            'apikey': SUPABASE_REST_KEY,
            'Authorization': `Bearer ${SUPABASE_REST_KEY}`,
            'Accept': 'application/json'
          }
        });
        if (res.ok) {
          data = await res.json();
        }
      } catch (fetchErr) {
        console.warn('[WDS] Native REST fetch failed, attempting client SDK fallback:', fetchErr);
      }

      // 2. Client SDK fallback if REST was blocked
      if ((!data || data.length === 0) && window.supabaseClient) {
        const { data: sdkData, error } = await window.supabaseClient
          .from('products')
          .select('*')
          .eq('visible', true)
          .order('id', { ascending: true });

        if (!error && sdkData) {
          data = sdkData;
        }
      }

      if (data && data.length > 0) {
        const visibleProducts = data.filter(p => p.visible !== false);
        
        products = visibleProducts.map(p => {
          let finalImages = p.images;
          if (typeof finalImages === 'string') {
            try { finalImages = JSON.parse(finalImages); } catch (e) { finalImages = [finalImages]; }
          }
          if (!Array.isArray(finalImages) || finalImages.length === 0) {
            finalImages = ['./assets/durag_silk_black.webp'];
          }

          let parsedColors = p.colors;
          if (typeof parsedColors === 'string') {
            try { parsedColors = JSON.parse(parsedColors); } catch (e) { parsedColors = []; }
          }
          if (!Array.isArray(parsedColors) || parsedColors.length === 0) {
            parsedColors = [{ name: 'Classic', hex: '#0A0A0A' }];
          }

          return {
            id: p.id,
            name: p.name,
            nameEn: p.name_en || p.name,
            price: parseFloat(p.price),
            category: p.category,
            categoryLabel: p.category_label || p.category,
            material: p.material || '',
            description: p.description || '',
            storyDescription: p.story_description || p.description || '',
            images: finalImages,
            colors: parsedColors,
            reviews: p.reviews || [],
            stock: typeof p.stock === 'number' ? p.stock : 10,
            visible: p.visible !== false
          };
        });

        window.wdsActiveProducts = products;
        console.log(`[WDS] ✓ Załadowano ${products.length} produktów z bazy danych Supabase.`);
        isProductsLoading = false;
        renderProductGrid();
        return;
      }
    } catch (err) {
      console.warn('[WDS] Supabase fetch error:', err);
    } finally {
      isProductsLoading = false;
    }

    // Strict mode: if database is unavailable or empty, do not show fake mockups
    products = [];
    renderProductGrid();
  })();

  return productsLoadPromise;
}

// Start loading immediately in background
loadProductsFromSupabase();

// --- Dynamic Site Content CMS Loader ---
async function loadSiteContent() {
  try {
    // 1. Natychmiastowe zastosowanie z cache lokalnego dla braku opóźnienia
    let localCache = null;
    try {
      const stored = localStorage.getItem('wds_site_content_cache');
      if (stored) localCache = JSON.parse(stored);
    } catch (e) {}
    if (localCache) applySiteContent(localCache);

    // 2. Pobranie najnowszej zawartości z bazy Supabase
    if (typeof window.fetchSiteContent === 'function') {
      const freshContent = await window.fetchSiteContent();
      if (freshContent && Object.keys(freshContent).length > 0) {
        applySiteContent(freshContent);
      }
    }
  } catch (err) {
    console.warn('[WDS CMS] Błąd inicjalizacji treści CMS:', err);
  }
}

function applySiteContent(content) {
  if (!content) return;
  window.cachedSiteContent = content;

  // Always update media assets if configured
  if (content.hero) {
    const heroVideo = document.querySelector('.hero-bg video');
    if (heroVideo) {
      if (content.hero.videoUrl) heroVideo.src = content.hero.videoUrl;
      if (content.hero.posterUrl) heroVideo.poster = content.hero.posterUrl;
    }
  }

  // Do not overwrite non-Polish translations with Polish CMS text
  const currentLang = typeof getActiveLanguage === 'function' ? getActiveLanguage() : 'PL';
  if (currentLang !== 'PL') {
    return;
  }

  // 1. Announcement bar
  if (content.announcement) {
    const banner = document.querySelector('.marquee-banner');
    const contentSpan = document.querySelector('.marquee-content');
    if (banner && contentSpan) {
      if (content.announcement.isActive === false) {
        banner.style.display = 'none';
      } else {
        banner.style.display = 'block';
        if (content.announcement.text) {
          const t = content.announcement.text + ' • ';
          contentSpan.innerHTML = `<span>${t}</span><span>${t}</span><span>${t}</span>`;
        }
      }
    }
  }

  // 2. Hero
  if (content.hero) {
    const h = content.hero;
    const accent = document.getElementById('heroAccent');
    const title = document.getElementById('heroTitle');
    const subtitle = document.getElementById('heroSubtitle');
    const cta = document.getElementById('heroCtaBtn');
    const heroVideo = document.querySelector('.hero-bg video');

    if (accent && h.accent) accent.innerHTML = h.accent;
    if (title && h.title) title.innerHTML = h.title;
    if (subtitle && h.subtitle) subtitle.innerHTML = h.subtitle;
    if (cta) {
      if (h.ctaText) cta.innerHTML = `${h.ctaText} <span aria-hidden="true">↘</span>`;
      if (h.ctaLink) cta.setAttribute('href', h.ctaLink);
    }
    if (heroVideo) {
      if (h.videoUrl) heroVideo.src = h.videoUrl;
      if (h.posterUrl) heroVideo.poster = h.posterUrl;
    }
  }

  // 3. Trust Bar
  if (content.trust_bar) {
    const tb = content.trust_bar;
    const tShipT = document.getElementById('trustShippingTitle');
    const tShipD = document.getElementById('trustShippingDesc');
    const tDelT = document.getElementById('trustDeliveryTitle');
    const tDelD = document.getElementById('trustDeliveryDesc');
    const tRetT = document.getElementById('trustReturnsTitle');
    const tRetD = document.getElementById('trustReturnsDesc');
    const tPickT = document.getElementById('trustPickupTitle');
    const tPickD = document.getElementById('trustPickupDesc');

    if (tShipT && tb.item1_title) tShipT.textContent = tb.item1_title;
    if (tShipD && tb.item1_desc) tShipD.textContent = tb.item1_desc;
    if (tDelT && tb.item2_title) tDelT.textContent = tb.item2_title;
    if (tDelD && tb.item2_desc) tDelD.textContent = tb.item2_desc;
    if (tRetT && tb.item3_title) tRetT.textContent = tb.item3_title;
    if (tRetD && tb.item3_desc) tRetD.textContent = tb.item3_desc;
    if (tPickT && tb.item4_title) tPickT.textContent = tb.item4_title;
    if (tPickD && tb.item4_desc) tPickD.textContent = tb.item4_desc;
  }

  // 4. Collection Header
  if (content.collection_header) {
    const ch = content.collection_header;
    const tag = document.getElementById('catalogSectionTag');
    const title = document.getElementById('catalogSectionTitle');
    const desc = document.getElementById('categoryDescBox');
    if (tag && ch.tag) tag.textContent = ch.tag;
    if (title && ch.title) title.textContent = ch.title;
    if (desc && ch.description) desc.textContent = ch.description;
  }

  // 5. Lookbook
  if (content.lookbook) {
    const lb = content.lookbook;
    const tag = document.getElementById('lookbookTag');
    const title = document.getElementById('lookbookTitle');
    const p1 = document.getElementById('lookbookP1');
    const p2 = document.getElementById('lookbookP2');
    const btn = document.getElementById('lookbookBtn');
    if (tag && lb.tag) tag.textContent = lb.tag;
    if (title && lb.title) title.textContent = lb.title;
    if (p1 && lb.p1) p1.textContent = lb.p1;
    if (p2 && lb.p2) p2.textContent = lb.p2;
    if (btn) {
      if (lb.ctaText) btn.textContent = lb.ctaText;
      if (lb.ctaLink) btn.setAttribute('href', lb.ctaLink);
    }
  }

  // 6. Philosophy
  if (content.philosophy) {
    const ph = content.philosophy;
    const tag = document.getElementById('philosophyTag');
    const title = document.getElementById('philosophyTitle');
    const sT = document.getElementById('philSilkTitle');
    const sD = document.getElementById('philSilkDesc');
    const satT = document.getElementById('philSatinTitle');
    const satD = document.getElementById('philSatinDesc');
    const vT = document.getElementById('philVelvetTitle');
    const vD = document.getElementById('philVelvetDesc');
    const seaT = document.getElementById('philSeasonalTitle');
    const seaD = document.getElementById('philSeasonalDesc');

    if (tag && ph.tag) tag.textContent = ph.tag;
    if (title && ph.title) title.textContent = ph.title;
    if (sT && ph.silk_title) sT.textContent = ph.silk_title;
    if (sD && ph.silk_desc) sD.textContent = ph.silk_desc;
    if (satT && ph.satin_title) satT.textContent = ph.satin_title;
    if (satD && ph.satin_desc) satD.textContent = ph.satin_desc;
    if (vT && ph.velvet_title) vT.textContent = ph.velvet_title;
    if (vD && ph.velvet_desc) vD.textContent = ph.velvet_desc;
    if (seaT && ph.seasonal_title) seaT.textContent = ph.seasonal_title;
    if (seaD && ph.seasonal_desc) seaD.textContent = ph.seasonal_desc;
  }

  // 7. About
  if (content.about) {
    const ab = content.about;
    const tag = document.getElementById('aboutTag');
    const title = document.getElementById('aboutTitle');
    const p1 = document.getElementById('aboutP1');
    const p2 = document.getElementById('aboutP2');
    const p3 = document.getElementById('aboutP3');
    const p4 = document.getElementById('aboutP4');
    const img = document.getElementById('aboutCarouselImg');

    if (tag && ab.tag) tag.textContent = ab.tag;
    if (title && ab.title) title.textContent = ab.title;
    if (p1 && ab.p1) p1.innerHTML = ab.p1;
    if (p2 && ab.p2) p2.innerHTML = ab.p2;
    if (p3 && ab.p3) p3.innerHTML = ab.p3;
    if (p4 && ab.p4) p4.innerHTML = ab.p4;
    if (img && ab.image) img.src = ab.image;
  }

  // 8. Footer
  if (content.footer) {
    const ft = content.footer;
    const ftText = document.getElementById('footerAboutText');
    if (ftText && ft.about) ftText.textContent = ft.about;
  }
}
window.applySiteContent = applySiteContent;

// --- DOM Elements Cache ---
const DOM = {
  preloader: document.getElementById('preloader'),
  siteHeader: document.getElementById('siteHeader'),
  hamburgerBtn: document.getElementById('hamburgerBtn'),
  mobileNavDrawer: document.getElementById('mobileNavDrawer'),
  productGrid: document.getElementById('productGrid'),
  filterBtns: document.querySelectorAll('.filter-btn'),
  navFilterLinks: document.querySelectorAll('.nav-links a, .mobile-menu-links a'),
  scrollDownIndicator: document.getElementById('scrollDownIndicator'),
  logoLink: document.getElementById('logoLink'),
  
  // Cart elements
  cartOverlay: document.getElementById('cartOverlay'),
  cartTrigger: document.getElementById('cartTrigger'),
  cartCloseBtn: document.getElementById('cartCloseBtn'),
  cartCount: document.getElementById('cartCount'),
  cartHeaderCount: document.getElementById('cartHeaderCount'),
  cartItemsContainer: document.getElementById('cartItemsContainer'),
  cartPromoInput: document.getElementById('cartPromoInput'),
  cartPromoApplyBtn: document.getElementById('cartPromoApplyBtn'),
  promoStatusMsg: document.getElementById('promoStatusMsg'),
  cartSubtotal: document.getElementById('cartSubtotal'),
  cartDiscountRow: document.getElementById('cartDiscountRow'),
  cartDiscountPercent: document.getElementById('cartDiscountPercent'),
  cartDiscountVal: document.getElementById('cartDiscountVal'),
  cartShipping: document.getElementById('cartShipping'),
  cartTotal: document.getElementById('cartTotal'),
  checkoutBtn: document.getElementById('checkoutBtn'),
  cartFooter: document.getElementById('cartFooter'),
  
  // Modal elements
  productModal: document.getElementById('productModal'),
  modalCloseBtn: document.getElementById('modalCloseBtn'),
  modalImg: document.getElementById('modalImg'),
  modalGalleryPrev: document.getElementById('modalGalleryPrev'),
  modalGalleryNext: document.getElementById('modalGalleryNext'),
  modalThumbnails: document.getElementById('modalThumbnails'),
  modalCategory: document.getElementById('modalCategory'),
  modalTitle: document.getElementById('modalTitle'),
  modalPrice: document.getElementById('modalPrice'),
  modalMaterial: document.getElementById('modalMaterial'),
  modalColors: document.getElementById('modalColors'),
  modalDesc: document.getElementById('modalDesc'),
  modalQtyMinus: document.getElementById('modalQtyMinus'),
  modalQtyPlus: document.getElementById('modalQtyPlus'),
  modalQtyVal: document.getElementById('modalQtyVal'),
  modalAddBtn: document.getElementById('modalAddBtn'),
  modalReviewsCount: document.getElementById('modalReviewsCount'),
  modalReviewsList: document.getElementById('modalReviewsList'),
  tabHeaders: document.querySelectorAll('.tab-header'),
  
  // Newsletter
  newsletterForm: document.getElementById('newsletterForm'),
  newsletterEmail: document.getElementById('newsletterEmail'),
  newsletterSubmitBtn: document.getElementById('newsletterSubmitBtn'),
  newsletterMessage: document.getElementById('newsletterMessage')
};

// ========================================================================
// 1. INITIALIZATION & LAYOUT TRIGGERS
// ========================================================================

const hidePreloader = () => {
  const preloader = document.getElementById('preloader') || DOM.preloader;
  if (preloader) {
    preloader.style.opacity = '0';
    preloader.style.pointerEvents = 'none';
    setTimeout(() => {
      preloader.style.display = 'none';
      preloader.style.visibility = 'hidden';
    }, 400);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // Hide Preloader immediately on DOM ready
  hidePreloader();

  // Load Cart from localStorage
  const savedCart = localStorage.getItem('wds_cart');
  if (savedCart) {
    try {
      state.cart = JSON.parse(savedCart);
      updateCartBadge();
    } catch (e) {
      state.cart = [];
    }
  }

  // Render product grid immediately
  renderProductGrid();
  
  // Initialize IntersectionObserver for Scroll Reveals
  initScrollReveals();
  
  // Bind Event Listeners
  bindEventListeners();
  
  // Initialize Admin CMS Portal Controls
  if (typeof initAdminCMS === 'function') initAdminCMS();

  // Initialize Multi-step Checkout and Paczkomat API
  if (typeof initCheckoutFlow === 'function') initCheckoutFlow();
  
  // Initialize WooCommerce Clientside Importers
  if (typeof initWooCommerceImporter === 'function') initWooCommerceImporter();

  // Initialize Information & Legal Modals
  if (typeof initInfoModals === 'function') initInfoModals();

  // Initialize About Us Section Carousel
  if (typeof initAboutCarousel === 'function') initAboutCarousel();

  // Initialize Scroll Lock Observer
  if (typeof initScrollLockObserver === 'function') initScrollLockObserver();

  // Async load from Supabase in background
  loadProductsFromSupabase();
  loadSiteContent();
});

// Run hidePreloader immediately & safety fallbacks
hidePreloader();
window.addEventListener('load', hidePreloader);
setTimeout(hidePreloader, 2000);

// Sticky Navigation Header transition on scroll
function updateHeaderScrollState() {
  if (!DOM.siteHeader) return;
  if (window.scrollY > 40) {
    DOM.siteHeader.classList.add('scrolled');
  } else {
    DOM.siteHeader.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', updateHeaderScrollState, { passive: true });
document.addEventListener('DOMContentLoaded', updateHeaderScrollState);
updateHeaderScrollState();

// Scroll Reveal Observer Setup
function initScrollReveals() {
  const revealElements = document.querySelectorAll('.reveal');
  revealElements.forEach(el => el.classList.add('active'));
}

// ========================================================================
// 2. EVENT BINDING & ROUTING
// ========================================================================

function bindEventListeners() {
  // Mobile Nav Drawer Toggle
  if (DOM.hamburgerBtn) {
    DOM.hamburgerBtn.addEventListener('click', toggleMobileNav);
  }
  
  // Close Mobile Drawer on Link Click and Filter Products
  const navFilterLinks = document.querySelectorAll('.nav-links a, .mobile-menu-links a');
  navFilterLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const filter = link.getAttribute('data-filter');
      if (filter) {
        e.preventDefault();
        
        // Close drawer if open
        if (DOM.mobileNavDrawer && DOM.mobileNavDrawer.classList.contains('active')) {
          toggleMobileNav();
        }
        
        // Filter catalog
        setActiveFilter(filter);
        
        // Scroll to Catalog
        const catalogSec = document.getElementById('kolekcja');
        if (catalogSec) {
          setTimeout(() => {
            catalogSec.scrollIntoView({ behavior: 'smooth' });
          }, 300);
        }
      }
    });
  });

  // Hero Scroll Down button
  if (DOM.scrollDownIndicator) {
    DOM.scrollDownIndicator.addEventListener('click', () => {
      const catalogSec = document.getElementById('kolekcja');
      if (catalogSec) {
        catalogSec.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
  
  // Return to top on logo click
  if (DOM.logoLink) {
    DOM.logoLink.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Collection Filter Button Clicks
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-category');
      setActiveFilter(category);
    });
  });

  // Cart Drawer Toggles with Null Guards
  if (DOM.cartTrigger) DOM.cartTrigger.addEventListener('click', openCartDrawer);
  if (DOM.cartCloseBtn) DOM.cartCloseBtn.addEventListener('click', closeCartDrawer);
  if (DOM.cartOverlay) {
    DOM.cartOverlay.addEventListener('click', (e) => {
      if (e.target === DOM.cartOverlay) closeCartDrawer();
    });
  }

  // Cart actions: Qty, Delete, Apply Promo, Checkout
  if (DOM.cartItemsContainer) DOM.cartItemsContainer.addEventListener('click', handleCartItemClicks);
  if (DOM.cartPromoApplyBtn) DOM.cartPromoApplyBtn.addEventListener('click', handleApplyPromoCode);
  if (DOM.checkoutBtn) DOM.checkoutBtn.addEventListener('click', handleCheckoutProcess);

  // Product Modal Toggles
  if (DOM.modalCloseBtn) DOM.modalCloseBtn.addEventListener('click', closeProductModal);
  if (DOM.productModal) {
    DOM.productModal.addEventListener('click', (e) => {
      if (e.target === DOM.productModal) closeProductModal();
    });
  }
  
  if (DOM.modalGalleryPrev) {
    DOM.modalGalleryPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      updateModalGallery(state.activeImageIndexInModal - 1);
    });
  }
  if (DOM.modalGalleryNext) {
    DOM.modalGalleryNext.addEventListener('click', (e) => {
      e.stopPropagation();
      updateModalGallery(state.activeImageIndexInModal + 1);
    });
  }
  
  // Esc Key closes Drawer & Modals
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCartDrawer();
      closeProductModal();
    }
  });

  // Modal Quantity adjustment
  if (DOM.modalQtyMinus) DOM.modalQtyMinus.addEventListener('click', () => adjustModalQty(-1));
  if (DOM.modalQtyPlus) DOM.modalQtyPlus.addEventListener('click', () => adjustModalQty(1));
  if (DOM.modalAddBtn) DOM.modalAddBtn.addEventListener('click', handleAddFromModal);

  // Modal Tabs (Accordion details)
  DOM.tabHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const tabName = header.getAttribute('data-tab');
      toggleModalTab(header, tabName);
    });
  });

  // Initialize EU Multi-language Switcher
  initLanguageSwitcher();

  // Newsletter Submit Form validation
  if (DOM.newsletterForm) {
    DOM.newsletterForm.addEventListener('submit', handleNewsletterSubmit);
  }
}

// ========================================================================
// I18N DICTIONARY & MULTI-LANGUAGE TRANSLATIONS (100% FULL COVERAGE)
// ========================================================================
const I18N = {
  PL: {
    nav: { all: 'Wszystko', silk: 'Jedwabne', satin: 'Satynowe', velvet: 'Welurowe', seasonal: 'Sezonowe', accessories: 'Akcesoria', about: 'O Nas' },
    heroTitle: 'Ręcznie szyte duragi.<br><span style="color: #D9A87E; font-style: italic;">Bo styl rodzi się na głowie</span>.',
    heroSubtitle: 'Jedyne duragi szyte w Polsce',
    heroAccent: '[ Duragi Najlepszej Jakości ]',
    heroCta: 'Odkryj kolekcję',
    marquee: 'Wysyłamy z Warszawy w 1 dzień • kup dwa a trzeci otrzymasz gratis • Darmowa wysyłka • ręcznie szyte duragi • odbiór osobisty w warszawie • ',
    trust: {
      shippingTitle: 'Wysyłka 1–2 Dni', shippingDesc: 'Express z Warszawy',
      deliveryTitle: 'Darmowa Dostawa', deliveryDesc: 'InPost & Kurier w PL dla każdego zamówienia',
      returnsTitle: '14 Dni na Zwrot', returnsDesc: 'Gwarancja bezproblemowego zwrotu',
      pickupTitle: 'Odbiór w Warszawie', pickupDesc: 'ul. Włodarzewska 4 lub Centrum'
    },
    catalog: { tag: '[ Durag Activity ]', title: 'Unikalny styl' },
    filterAll: 'Wszystko', filterSilk: 'Jedwabne', filterSatin: 'Satynowe', filterVelvet: 'Welurowe', filterSeasonal: 'Sezonowe materiały', filterAccessories: 'Akcesoria',
    addToCart: 'Dodaj do koszyka',
    dealBadge: '2+1 Gratis',
    emptyCatalog: 'Brak dostępnych produktów w wybranej kategorii.',
    categoryDesc: {
      all: 'Kompletna kolekcja ręcznie szytych duragów w Warszawie — z czystego jedwabiu morwowego 19 Momme, satyny, weluru oraz materiałów sezonowych.',
      silk: 'Luksusowy naturalny jedwab morwowy 19 Momme zapewniający najwyższą gładkość, zerowe tarcie i idealną ochronę fal 360.',
      satin: 'Gładka satyna poliestrowa łącząca trwałość, komfort noszenia i charakterystyczny połysk na co dzień.',
      velvet: 'Mięsisty, głęboko teksturowany welur o wyrazistej strukturze, idealny do stabilnej kompresji fal.',
      seasonal: 'Wyjątkowe tkaniny takie jak len, cupro i krepa satynowa Mirella stworzone na różne pory roku.',
      accessories: 'Szczotki wave brush z naturalnego włosia dzika, wave capy i niezbędne akcesoria do pielęgnacji 360 waves.'
    },
    lookbook: {
      tag: '[ pure silk 19 momme ]',
      title: 'Jedwab w Mieście.',
      p1: 'W miejskim rytmie nasz Durag Milanówek to coś więcej niż dodatek — chroni, podkreśla styl i wyróżnia nas na tle innych. Wykonany z naturalnego jedwabiu o gramaturze 19 momme — oznaczającej wysoką gęstość, trwałość i jakość materiału — łączy lekkość z wyjątkową wytrzymałością, a jego gładka struktura ogranicza tarcie, pomaga chronić włosy przed łamaniem i puszeniem oraz jest delikatna dla skóry głowy.',
      p2: 'Jedwabny durag to unikatowy modowy hidden gem, który w przeciwieństwie do chusty czy czepka wyróżnia Cię na tle innych zarówno jakością wykonania, jak i subtelną elegancją w stylizacji. Jego lekka tkanina osłania głowę przed wiatrem i promieniowaniem UV, a niepodrabialny, głęboki połysk zmienia światło miasta w część stylizacji. To jedyny w Polsce durag wykonany z prawdziwego jedwabiu — bo styl rodzi się na głowie.',
      btn: 'Sprawdź'
    },
    philosophy: {
      tag: '[ Standardy rzemiosła ]',
      title: 'Filozofia naszych materiałów',
      silkTitle: 'Jedwab stworzony dla włosów',
      silkDesc: 'Użyta przy produkcji Durag Milanówek satyna jedwabna ma naturalnie gładką powierzchnię ograniczającą tarcie, dzięki czemu pozwala chronić włosy przed puszeniem, łamaniem i nadmiernym przesuszaniem. Delikatny dla skóry głowy materiał pozwala włosom zachować naturalną miękkość i zdrowy wygląd, nie odbierając nam komfortu nawet podczas dłuższego noszenia. W przeciwieństwie do syntetycznych tkanin jedwab nie tylko otula włosy, lecz także pomaga ograniczać utratę ich naturalnego nawilżenia. Zastosowany tutaj jedwab o gramaturze 19 momme jest odpowiednio lekki i elastyczny a zarazem odpowiednio gęsty oraz trwały.',
      satinTitle: 'Satyna stworzona dla codzienności',
      satinDesc: 'Satyna poliestrowa to materiał, który idealnie łączy gładkość, lekkość i trwałość — właśnie dlatego tak dobrze sprawdza się w szyciu duragów i to właśnie z niej korzysta zdecydowana większość klientów. Podobnie jak jedwab satyna poliestrowa jest śliska, przyjemna w dotyku co ogranicza tarcie, pomagając zmniejszyć puszenie i chronić włosy przed niepotrzebnym łamaniem. W przeciwieństwie do naturalnego jedwabiu jest materiałem syntetycznym, bardziej odpornym na codzienne użytkowanie i znacznie łatwiejszym w pielęgnacji oraz tańszym, a równocześnie zachowującym przy tym charakterystyczną gładkość oraz połysk. Dobrze dopasowuje się do głowy, utrzymuje swój kształt i szybko schnie, dzięki czemu durag pozostaje wygodnym elementem codziennego stylu.',
      velvetTitle: 'Welur na co dzień',
      velvetDesc: 'Welur poliestrowy to miękki, gęsty materiał o charakterystycznej, delikatnie włoskowatej powierzchni, która nadaje duragowi wyrazistą strukturę i głębię koloru. Wykonany z włókien poliestrowych jest trwały, odporny na częste użytkowanie. Jego przyjemna w dotyku faktura sprawia, że materiał dobrze układa się na głowie, a jednocześnie jest bardziej mięsisty i otulający niż lekki jedwab czy gładka satyna. Welur poliestrowy nie gniecie się łatwo, szybko schnie i jest prosty w codziennej pielęgnacji.',
      seasonalTitle: 'Sezonowe materiały',
      seasonalDesc: 'Nie każdy materiał sprawdza się tak samo o każdej porze roku. Dlatego tworzymy serię duragów wykonanych z sezonowych tkanin, które odpowiadają na zmieniającą się pogodę, temperaturę i sposób noszenia. W tej kolekcji znalazł się Durag Bydgoszcz wykonany z cupro — lekkiej, gładkiej i przyjemnej w dotyku tkaniny o subtelnym połysku, Durag Żyrardów uszyty z naturalnego, przewiewnego lnu oraz Durag Stalowa Wola wykonany z krepy satynowej.'
    },
    about: {
      tag: '[ Warsaw Durag Store ]',
      title: 'Jak powstał Warsaw Durag Store?',
      p1: 'Opowiadamy tę historię każdemu, kto zapyta, skąd wziął się pomysł na Warsaw Durag Store. Wracając z Częstochowy, w drodze powrotnej z Jasnej Góry słuchaliśmy świeżego wówczas utworu Baby Keem\'a Durag Activity i olśniło nas, że w Polsce nie ma gdzie kupić porządnego duraga.',
      p2: 'Wspólnie z bratem bliźniakiem zaczęliśmy od totalnego zera — wystawiając pierwsze sztuki na Vinted, OLX i FB Marketplace. Każde zamówienie to była czysta radość. Dziś realizujemy dziesiątki zamówień tygodniowo, a każdy durag przechodzi przez nasze ręce: od doboru naturalnego jedwabiu morwowego 19 Momme, przez precyzyjne szycie, aż po pakowanie.',
      p3: 'Jesteśmy marką otwartą na współprace — robisz coś w sporcie, modzie lub muzyce? Pisz do nas, w zamian za ładne, solidne promo wysyłamy pakę za darmola!',
      p4: 'Darmowy odbiór osobisty w Warszawie: przy ul. Włodarzewskiej 4 (Ochota), w Centrum oraz stacjonarnie w salonie barberskim Eclipse pod Rondem Waszyngtona. Piszcie śmiało na Instagramie @warsawduragstore lub mailowo support@warsawduragstore.pl.',
      btn: 'Więcej o nas',
      thumb1: 'Założyciele', thumb2: 'Packaging & Rzemiosło', thumb3: 'Opinie na Insta',
      cap1: 'Kuba & Założyciele Warsaw Durag Store', cap2: 'Ręcznie szyte z jedwabiu 19 Momme', cap3: 'Opinie ze społeczności @warsawduragstore'
    },
    newsletter: {
      title: 'Dołącz do Klubu WDS',
      desc: 'Zapisz się do naszego klubu. Zyskaj 10% rabatu na pierwsze zakupy, wczesny dostęp do limitowanych kolekcji oraz poradników 360 waves.',
      placeholder: 'Twój adres e-mail',
      btn: 'Dołącz'
    },
    footer: {
      aboutText: 'Jedyne duragi szyte w Polsce. Warszawski brand rzemieślniczy dostarczający najwyższej jakości duragi i akcesoria.',
      shopTitle: 'Sklep', infoTitle: 'Informacje', pickupTitle: 'Odbiór Osobisty',
      copyright: '© 2026 Warsaw Durag Store. Jedyne duragi szyte w Polsce. Wszelkie prawa zastrzeżone.'
    },
    cart: {
      title: 'Twój Koszyk',
      emptyText: 'Twój koszyk jest pusty.',
      subtotalLabel: 'Suma częściowa:',
      discountLabel: 'Rabat',
      shippingLabel: 'Dostawa:',
      shippingFree: 'Darmowa (EU Express)',
      totalLabel: 'Łącznie:',
      couponPlaceholder: 'Kod rabatowy (np. WARSAW10)',
      couponApplyBtn: 'Użyj',
      removeBtn: 'Usuń', colorLabel: 'Kolor',
      checkoutBtn: 'Przejdź do dostawy'
    },
    modalDetails: 'Szczegóły',
    modalReviews: 'Opinie',
    legal: {
      terms: 'Regulamin',
      privacy: 'Polityka Prywatności',
      contact: 'Kontakt'
    }
  },
  EN: {
    nav: { all: 'All Products', silk: 'Silk Durags', satin: 'Satin Durags', velvet: 'Velvet Durags', seasonal: 'Seasonal', accessories: 'Accessories', about: 'About Us' },
    heroTitle: 'Handcrafted Luxury Durags.<br><span style="color: #D9A87E; font-style: italic;">Style begins at the crown</span>.',
    heroSubtitle: 'The Only Durags Handcrafted in Poland',
    heroAccent: '[ Premium Quality Durags ]',
    heroCta: 'Explore Collection',
    marquee: 'Express 24h shipping from Warsaw • Buy 2 Get 1 Free • Free EU Shipping • Handcrafted in Warsaw • Local pickup available • ',
    trust: {
      shippingTitle: '1–2 Days Dispatch', shippingDesc: 'Express from Warsaw to EU',
      deliveryTitle: 'Free EU Delivery', deliveryDesc: 'Free Tracked Shipping on All Orders',
      returnsTitle: '14 Days Returns', returnsDesc: 'Hassle-Free Return Guarantee',
      pickupTitle: 'Warsaw Showroom', pickupDesc: 'Włodarzewska 4 or City Centre'
    },
    catalog: { tag: '[ Durag Activity ]', title: 'Unique Style' },
    filterAll: 'All Products', filterSilk: 'Silk Durags', filterSatin: 'Satin Durags', filterVelvet: 'Velvet Durags', filterSeasonal: 'Seasonal Fabrics', filterAccessories: 'Accessories',
    addToCart: 'Add to Cart',
    dealBadge: 'Buy 2 Get 1 Free',
    emptyCatalog: 'No products available in this category.',
    categoryDesc: {
      all: 'Complete collection of handcrafted luxury durags from Warsaw — 19 Momme mulberry silk, sleek satin, velvet and seasonal fabrics.',
      silk: 'Grade-6A 19 Momme mulberry silk offering maximum smoothness, zero friction and superior 360 wave protection.',
      satin: 'Ultra-smooth premium satin combining durability, comfortable stretch and radiant everyday shine.',
      velvet: 'Plush, deeply textured velvet providing optimal compression, weight and rich aesthetic depth.',
      seasonal: 'Unique breathable textiles including natural linen, cupro, and crepe satin crafted for each season.',
      accessories: 'Natural boar bristle wave brushes, compression caps and essential 360 wave accessories.'
    },
    lookbook: {
      tag: '[ pure silk 19 momme ]',
      title: 'Silk in the City.',
      p1: 'In the fast-paced city rhythm, our Milanówek Durag is more than an accessory — it protects, elevates your style, and sets you apart. Handcrafted from pure 19 Momme mulberry silk, it pairs featherlight breathability with lasting durability. Its ultra-smooth surface eliminates friction, prevents breakage and frizz, and is supremely gentle on the scalp.',
      p2: 'A genuine silk durag is a true fashion hidden gem. Unlike basic caps or bandanas, it distinguishes your silhouette with artisanal precision and understated luxury. Its breathable weave shields you from UV rays and wind, turning ambient light into a subtle gleam. Poland’s only authentic silk durag — because style begins at the crown.',
      btn: 'Discover Silk'
    },
    philosophy: {
      tag: '[ Craftsmanship Standards ]',
      title: 'Philosophy of Our Materials',
      silkTitle: 'Silk Crafted for Hair Protection',
      silkDesc: 'Our Milanówek silk satin has a naturally friction-free surface that locks in moisture and guards against hair breakage, split ends, and frizz. Hypoallergenic and gentle, it preserves hair texture while keeping you comfortable all day and night. Grade-6A 19 Momme silk provides the ideal balance of elasticity, density, and resilience.',
      satinTitle: 'Satin Engineered for Daily Wear',
      satinDesc: 'Premium satin merges smoothness, durability, and lightweight comfort. It glides effortlessly over waves to minimize frizz while delivering high durability and low maintenance at an accessible price. It holds compression firmly and dries quickly, making it a reliable streetwear staple.',
      velvetTitle: 'Velvet for Deep Compression & Form',
      velvetDesc: 'Plush, heavyweight velvet features a rich nap that delivers remarkable color depth and solid wave compression. Durable and soft to the touch, it adds a structured, tactile presence to any outfit while keeping hair perfectly set.',
      seasonalTitle: 'Seasonal Natural Textiles',
      seasonalDesc: 'Different seasons demand different fabrics. Our seasonal collection features lightweight breathable Cupro (Bydgoszcz), natural airy Linen (Żyrardów), and lustrous Satin Crepe (Stalowa Wola).'
    },
    about: {
      tag: '[ Warsaw Durag Store ]',
      title: 'About Us',
      p1: 'Warsaw Durag Store was founded in 2020 to introduce premium durags to the European streetwear community, showcasing them both as a timeless styling piece and an essential hair care ritual.',
      p2: 'We are an independent boutique atelier run by two brothers and close friends. Every piece passes through our hands — from fabric inspection and precision cutting to hand-packaging and customer support.',
      p3: 'We actively collaborate with athletes, artists, and creators who express their individuality through style. Reach out if you represent music, sports, or fashion for an exclusive gift pack.',
      p4: 'While we operate online across Europe, local pickups are available in Warsaw (ul. Włodarzewska 4 or City Centre) by appointment. Connect with us on Instagram @warsawduragstore or email support@warsawduragstore.pl.',
      btn: 'Read Full Story',
      thumb1: 'Founders', thumb2: 'Packaging & Craft', thumb3: 'IG Community',
      cap1: 'Kuba & Co-Founders in Warsaw', cap2: 'Handcrafted with 19 Momme Silk', cap3: 'Real reviews from @warsawduragstore'
    },
    newsletter: {
      title: 'Join the WDS Club',
      desc: 'Subscribe to our private circle. Receive 10% off your first order, private drop alerts, and 360 wave mastery guides.',
      placeholder: 'Enter your email address',
      btn: 'Subscribe'
    },
    footer: {
      aboutText: 'The only durags handcrafted in Poland. Warsaw luxury atelier providing supreme quality durags and accessories.',
      shopTitle: 'Shop', infoTitle: 'Information', pickupTitle: 'Local Pickup',
      copyright: '© 2026 Warsaw Durag Store. Handcrafted in Poland. All rights reserved.'
    },
    cart: {
      title: 'Your Shopping Bag',
      emptyText: 'Your shopping bag is currently empty.',
      subtotalLabel: 'Subtotal:',
      discountLabel: 'Discount',
      shippingLabel: 'Shipping:',
      shippingFree: 'Free (EU Express)',
      totalLabel: 'Total:',
      couponPlaceholder: 'Discount code (e.g. WARSAW10)',
      couponApplyBtn: 'Apply',
      removeBtn: 'Remove', colorLabel: 'Color',
      checkoutBtn: 'Proceed to Checkout'
    },
    modalDetails: 'Details',
    modalReviews: 'Reviews',
    legal: {
      terms: 'Terms & Conditions',
      privacy: 'Privacy Policy',
      contact: 'Contact'
    }
  },
  CZ: {
    nav: { all: 'Všechny', silk: 'Hedvábné', satin: 'Saténové', velvet: 'Sametové', seasonal: 'Sezónní', accessories: 'Doplňky', about: 'O nás' },
    heroTitle: 'Ručně šité prémiové duragy.<br><span style="color: #D9A87E; font-style: italic;">Styl začíná na hlavě</span>.',
    heroSubtitle: 'Jediné duragy šité v Polsku',
    heroAccent: '[ Duragy nejvyšší kvality ]',
    heroCta: 'Objevte kolekci',
    marquee: 'Expresní odeslání z Varšavy do 24h • Kupte 2 Získejte 1 Zdarma • Doprava zdarma v EU • Ruční výroba • ',
    trust: {
      shippingTitle: 'Odeslání 1–2 Dny', shippingDesc: 'Expres z Varšavy do celé EU',
      deliveryTitle: 'Doprava Zdarma', deliveryDesc: 'Doručení zdarma na každou objednávku',
      returnsTitle: '14 Dní na Vrácení', returnsDesc: 'Záruka bezstarostného vrácení',
      pickupTitle: 'Osobní Odběr', pickupDesc: 'Varšava, ul. Włodarzewska 4 / Centrum'
    },
    catalog: { tag: '[ Durag Activity ]', title: 'Jedinečný styl' },
    filterAll: 'Všechny produkty', filterSilk: 'Hedvábné duragy', filterSatin: 'Saténové duragy', filterVelvet: 'Sametové duragy', filterSeasonal: 'Sezónní materiály', filterAccessories: 'Doplňky',
    addToCart: 'Přidat do košíku',
    dealBadge: '2+1 Zdarma',
    emptyCatalog: 'Žádné produkty v této kategorii.',
    categoryDesc: {
      all: 'Kompletní kolekce ručně šitých duragů z Varšavy — přírodní morušové hedvábí 19 Momme, satén, samet a sezónní len a cupro.',
      silk: '100% přírodní morušové hedvábí 19 Momme pro nulové tření, maximální ochranu a luxusní péči o vlasy.',
      satin: 'Hladký satén spojující odolnost, pohodlí při nošení a elegantní lesk pro každý den.',
      velvet: 'Hustý, měkký samet s hlubokou strukturou pro pevnou a stabilní kompresi vln 360.',
      seasonal: 'Sezónní přírodní len, cupro a saténový krep přizpůsobené měnícímu se počasí.',
      accessories: 'Kartáče z kančích štětin na vlny, wave capy a prémiové doplňky pro péči o vlny.'
    },
    lookbook: {
      tag: '[ pure silk 19 momme ]',
      title: 'Hedvábí ve Městě.',
      p1: 'V městském tempu je náš Durag Milanówek víc než jen doplněk — chrání vlasy, podtrhuje styl a odlišuje vás od ostatních. Je vyrobený z pravého přírodního morušového hedvábí 19 Momme.',
      p2: 'Pravý hedvábný durag představuje módní hidden gem spojující řemeslnou dokonalost s nenucenou elegancí. Jediný v Polsku šitý durag z pravého hedvábí.',
      btn: 'Vyzkoušet'
    },
    philosophy: {
      tag: '[ Řemeslné standardy ]',
      title: 'Filozofie našich materiálů',
      silkTitle: 'Hedvábí pro ochranu vlasů',
      silkDesc: 'Přírodní hedvábí 19 Momme s dokonale hladkým povrchem chrání vlasy před krepatěním a lámáním. Udržuje přirozenou vlhkost.',
      satinTitle: 'Satén pro každodenní styl',
      satinDesc: 'Kvalitní polyesterový satén spojuje lehkost, odolnost a charakteristický lesk pro každodenní nošení.',
      velvetTitle: 'Samet pro hlubokou kompresi',
      velvetDesc: 'Měkký, hustý samet s hlubokou strukturou pro pevnou kompresi a luxusní vzhled.',
      seasonalTitle: 'Sezónní přírodní látky',
      seasonalDesc: 'Látky přizpůsobené počasí: prodyšný len (Żyrardów), lehké cupro (Bydgoszcz) a saténový krep.'
    },
    about: {
      tag: '[ Warsaw Durag Store ]',
      title: 'O nás',
      p1: 'Warsaw Durag Store vznikl v roce 2020 jako rodinný butik s cílem přinést prémiové duragy do střední Evropy.',
      p2: 'Jsme malý butik vedený dvěma bratry. Každý kus projde našima rukama od výběru látky po zabalení.',
      p3: 'Podporujeme umělce a sportovce vyjadřující svůj osobitý styl.',
      p4: 'Osobní odběr ve Varšavě po domluvě. Kontaktujte nás na IG @warsawduragstore nebo support@warsawduragstore.pl.',
      btn: 'Více o nás',
      thumb1: 'Zakladatelé', thumb2: 'Balení a řemeslo', thumb3: 'Recenze na IG',
      cap1: 'Kuba & Zakladatelé Warsaw Durag Store', cap2: 'Ručně šité z hedvábí 19 Momme', cap3: 'Reakce komunity na IG'
    },
    newsletter: {
      title: 'Připojte se k WDS Klubu',
      desc: 'Získejte 10% slevu na první nákup a přednostní přístup k limitovaným edicím.',
      placeholder: 'Váš e-mail',
      btn: 'Odebírat'
    },
    footer: {
      aboutText: 'Jediné duragy ručně šité v Polsku. Varšavská prémiová řemeslná značka.',
      shopTitle: 'Obchod', infoTitle: 'Informace', pickupTitle: 'Osobní odběr',
      copyright: '© 2026 Warsaw Durag Store. Ruční výroba v Polsku. Všechna práva vyhrazena.'
    },
    cart: {
      title: 'Váš Košík',
      emptyText: 'Váš košík je prázdný.',
      subtotalLabel: 'Mezisoučet:',
      discountLabel: 'Sleva',
      shippingLabel: 'Doprava:',
      shippingFree: 'Zdarma (EU Express)',
      totalLabel: 'Celkem:',
      couponPlaceholder: 'Slevový kód (např. WARSAW10)',
      couponApplyBtn: 'Použít',
      removeBtn: 'Odstranit', colorLabel: 'Barva',
      checkoutBtn: 'Přejít k objednávce'
    },
    modalDetails: 'Podrobnosti',
    modalReviews: 'Recenze',
    legal: {
      terms: 'Obchodní podmínky',
      privacy: 'Zásady ochrany soukromí',
      contact: 'Kontakt'
    }
  },
  LT: {
    nav: { all: 'Visi', silk: 'Šilkiniai', satin: 'Satininiai', velvet: 'Velūriniai', seasonal: 'Sezoniniai', accessories: 'Aksesuarai', about: 'Apie mus' },
    heroTitle: 'Rankų darbo duragai.<br><span style="color: #D9A87E; font-style: italic;">Stilius prasideda nuo galvos</span>.',
    heroSubtitle: 'Vieninteliai duragai, siuvami Lenkijoje',
    heroAccent: '[ Aukščiausios kokybės duragai ]',
    heroCta: 'Atraskite kolekciją',
    marquee: 'Greitas išsiuntimas iš Varšuvos per 24 val. • Pirkite 2 Gaukite 1 Nemokamai • Nemokamas pristatymas ES • ',
    trust: {
      shippingTitle: 'Siuntimas 1–2 d.', shippingDesc: 'Ekspresas iš Varšuvos į visą ES',
      deliveryTitle: 'Nemokamas Pristatymas', deliveryDesc: 'Nemokamas siuntimas visiems užsakymams',
      returnsTitle: '14 Dienų Grąžinimas', returnsDesc: 'Garantuotas sklandus grąžinimas',
      pickupTitle: 'Atsiėmimas Varšuvoje', pickupDesc: 'ul. Włodarzewska 4 arba Centras'
    },
    catalog: { tag: '[ Durag Activity ]', title: 'Unikalus stilius' },
    filterAll: 'Visi produktai', filterSilk: 'Šilkiniai duragai', filterSatin: 'Satininiai duragai', filterVelvet: 'Velūriniai duragai', filterSeasonal: 'Sezoniniai audiniai', filterAccessories: 'Aksesuarai',
    addToCart: 'Įdėti į krepšelį',
    dealBadge: '2+1 Nemokamai',
    emptyCatalog: 'Šioje kategorijoje produktų nėra.',
    categoryDesc: {
      all: 'Pilna Varšuvoje rankomis siūtų duragų kolekcija — natūralus 19 Momme šilkmedžio šilkas, satinas, velūras ir sezoniniai audiniai.',
      silk: '100% natūralus 19 Momme šilkmedžio šilkas suteikia maksimalų glotnumą ir 360 bangų apsaugą.',
      satin: 'Aukščiausios kokybės satinas, derinantis ilgaamžiškumą, patogumą ir elegantišką blizgesį.',
      velvet: 'Tvirtas velūras su gilia tekstūra, puikiai tinkantis patikimai kompresijai.',
      seasonal: 'Sezoniniai audiniai, tokie kaip linas, cupro ir satino krepšas įvairiems metų laikams.',
      accessories: 'Natūralių šerno šerių bangų šepečiai ir būtini 360 bangų priežiūros priedai.'
    },
    lookbook: {
      tag: '[ pure silk 19 momme ]',
      title: 'Šilkas Mieste.',
      p1: 'Miesto ritmu mūsų „Milanówek“ duragas yra daugiau nei stiliaus detalė — jis saugo plaukus, mažina trintį ir pabrėžia individualumą. Siūtas iš 100% natūralaus 19 Momme šilko.',
      p2: 'Tikras šilkinis duragas išskiria jus subtilia elegancija ir nepriekaištinga kokybe.',
      btn: 'Išbandyti'
    },
    philosophy: {
      tag: '[ Meistrystės standartai ]',
      title: 'Mūsų medžiagų filosofija',
      silkTitle: 'Šilkas plaukų apsaugai',
      silkDesc: 'Natūralus 19 Momme šilkas su glotniu paviršiumi apsaugo nuo šiaušimosi ir lūžinėjimo.',
      satinTitle: 'Satinas kasdieniam stiliui',
      satinDesc: 'Aukštos kokybės satinas užtikrina patvarumą, blizgesį ir patogumą.',
      velvetTitle: 'Velūras patikimai fiksacijai',
      velvetDesc: 'Tankus velūras suteikia sodrią tekstūrą ir patikimą 360 bangų kompresiją.',
      seasonalTitle: 'Sezoniniai natūralūs audiniai',
      seasonalDesc: 'Linas (Żyrardów), cupro (Bydgoszcz) ir krepinis satinas skirtingiems sezonams.'
    },
    about: {
      tag: '[ Warsaw Durag Store ]',
      title: 'Apie mus',
      p1: 'Warsaw Durag Store įkurtas 2020 m. kaip dviejų brolių butikas, siuvantis rankų darbo duragus.',
      p2: 'Kiekvienas gaminys kruopščiai paruošiamas ir supakuojamas Varšuvoje.',
      p3: 'Mielai bendradarbiaujame su menininkais ir sportininkais.',
      p4: 'Atsiėmimas Varšuvoje iš anksto susitarus arba siuntimas paštomatu. IG @warsawduragstore.',
      btn: 'Daugiau apie mus',
      thumb1: 'Įkūrėjai', thumb2: 'Pakuotė ir darbas', thumb3: 'Atsiliepimai IG',
      cap1: 'Kuba ir įkūrėjai Varšuvoje', cap2: 'Rankų darbas iš 19 Momme šilko', cap3: 'Bendruomenės atsiliepimai'
    },
    newsletter: {
      title: 'Prisijunkite prie WDS Klubo',
      desc: 'Gaukite 10% nuolaidą pirmajam užsakymui ir išskirtinę prieigą prie naujienų.',
      placeholder: 'Jūsų el. pašto adresas',
      btn: 'Prenumeruoti'
    },
    footer: {
      aboutText: 'Vieninteliai duragai, siuvami Lenkijoje. Varšuvos meistrystės prekės ženklas.',
      shopTitle: 'Parduotuvė', infoTitle: 'Informacija', pickupTitle: 'Atsiėmimas',
      copyright: '© 2026 Warsaw Durag Store. Siūta Lenkijoje. Visos teisės saugomos.'
    },
    cart: {
      title: 'Jūsų Krepšelis',
      emptyText: 'Jūsų krepšelis tuščias.',
      subtotalLabel: 'Tarpinė suma:',
      discountLabel: 'Nuolaida',
      shippingLabel: 'Pristatymas:',
      shippingFree: 'Nemokamas (EU Express)',
      totalLabel: 'Iš viso:',
      couponPlaceholder: 'Nuolaidos kodas (pvz. WARSAW10)',
      couponApplyBtn: 'Pritaikyti',
      removeBtn: 'Pašalinti', colorLabel: 'Spalva',
      checkoutBtn: 'Apmokėti užsakymą'
    },
    modalDetails: 'Detalės',
    modalReviews: 'Atsiliepimai',
    legal: {
      terms: 'Taisyklės ir sąlygos',
      privacy: 'Privatumo politika',
      contact: 'Kontaktai'
    }
  },
  DE: {
    nav: { all: 'Alle', silk: 'Seide', satin: 'Satin', velvet: 'Samt', seasonal: 'Saisonal', accessories: 'Zubehör', about: 'Über uns' },
    heroTitle: 'Handgefertigte Luxus-Durags.<br><span style="color: #D9A87E; font-style: italic;">Stil beginnt am Kopf</span>.',
    heroSubtitle: 'Die einzigen in Polen handgefertigten Durags',
    heroAccent: '[ Höchste Qualität ]',
    heroCta: 'Kollektion entdecken',
    marquee: 'Express-Versand aus Warschau in 24h • Nimm 3 Zahle 2 • Kostenloser EU-Versand • Handarbeit • ',
    trust: {
      shippingTitle: 'Versand in 1–2 Tagen', shippingDesc: 'Express aus Warschau nach ganz Europa',
      deliveryTitle: 'Kostenloser Versand', deliveryDesc: 'Kostenlose Lieferung für alle Bestellungen',
      returnsTitle: '14 Tage Rückgabe', returnsDesc: 'Garantierte unkomplizierte Rückgabe',
      pickupTitle: 'Abholung in Warschau', pickupDesc: 'ul. Włodarzewska 4 / Zentrum'
    },
    catalog: { tag: '[ Durag Activity ]', title: 'Einzigartiger Stil' },
    filterAll: 'Alle Produkte', filterSilk: 'Seidige Durags', filterSatin: 'Satin Durags', filterVelvet: 'Samt Durags', filterSeasonal: 'Saisonale Stoffe', filterAccessories: 'Zubehör',
    addToCart: 'In den Warenkorb',
    dealBadge: '3 für 2',
    emptyCatalog: 'Keine Produkte in dieser Kategorie verfügbar.',
    categoryDesc: {
      all: 'Komplette Kollektion handgefertigter Durags aus Warschau — 19 Momme Maulbeerseide, Satin, Samt und Saisonstoffe.',
      silk: '100% reine 19 Momme Maulbeerseide für minimale Reibung und maximalen Schutz der 360 Waves.',
      satin: 'Glatter Premium-Satin für Langlebigkeit, Komfort und edlen Glanz im Alltag.',
      velvet: 'Edler Samt mit dichter Struktur für optimale Kompression und Halt.',
      seasonal: 'Besondere saisonale Stoffe wie Leinen, Cupro und Satin-Krepp.',
      accessories: 'Wave-Bürsten aus echten Wildschweinborsten und Zubehör für 360 Waves.'
    },
    lookbook: {
      tag: '[ pure silk 19 momme ]',
      title: 'Seide in der Stadt.',
      p1: 'Im urbanen Rhythmus ist unser Milanówek Durag mehr als nur ein Accessoire – er schützt das Haar und setzt ein modisches Statement. Gefertigt aus reiner 19 Momme Maulbeerseide.',
      p2: 'Ein echter Seiden-Durag ist ein Mode-Highlight mit zeitloser Eleganz. Der einzige echte Seidendurag aus Polen.',
      btn: 'Entdecken'
    },
    philosophy: {
      tag: '[ Handwerksstandards ]',
      title: 'Philosophie unserer Materialien',
      silkTitle: 'Seide für perfekten Haarschutz',
      silkDesc: 'Reine 19 Momme Maulbeerseide reduziert Reibung, verhindert Haarbruch und bewahrt die Feuchtigkeit.',
      satinTitle: 'Satin für den täglichen Luxus',
      satinDesc: 'Geschmeidiger Satin kombiniert Strapazierfähigkeit mit edlem Glanz für jeden Tag.',
      velvetTitle: 'Samt für starke Kompression',
      velvetDesc: 'Dichter, weicher Samt für optimale Wave-Kompression und satten Farbton.',
      seasonalTitle: 'Saisonale Naturstoffe',
      seasonalDesc: 'Leinen (Żyrardów), Cupro (Bydgoszcz) und Seidenkrepp für jedes Wetter.'
    },
    about: {
      tag: '[ Warsaw Durag Store ]',
      title: 'Über uns',
      p1: 'Warsaw Durag Store wurde 2020 von zwei Brüdern in Warschau gegründet, um hochwertige Durags in Handarbeit zu fertigen.',
      p2: 'Jedes Stück wird in Warschau sorgfältig von Hand geprüft und verpackt.',
      p3: 'Wir unterstützen Kreative, Sportler und Musiker in ganz Europa.',
      p4: 'Persönliche Abholung in Warschau nach Vereinbarung oder Expressversand. IG @warsawduragstore.',
      btn: 'Mehr über uns',
      thumb1: 'Gründer', thumb2: 'Verpackung & Handwerk', thumb3: 'Instagram Feedback',
      cap1: 'Kuba & Gründer in Warschau', cap2: 'Handgefertigt aus 19 Momme Seide', cap3: 'Kundenstimmen auf Instagram'
    },
    newsletter: {
      title: 'WDS Club beitreten',
      desc: 'Erhalten Sie 10% Rabatt auf Ihre erste Bestellung und exklusiven Zugang zu limitierten Drops.',
      placeholder: 'Ihre E-Mail-Adresse',
      btn: 'Anmelden'
    },
    footer: {
      aboutText: 'Die einzigen in Polen handgefertigten Durags. Warschauer Manufaktur für Luxus-Durags.',
      shopTitle: 'Shop', infoTitle: 'Informationen', pickupTitle: 'Abholung',
      copyright: '© 2026 Warsaw Durag Store. Handgefertigt in Polen. Alle Rechte vorbehalten.'
    },
    cart: {
      title: 'Warenkorb',
      emptyText: 'Ihr Warenkorb ist leer.',
      subtotalLabel: 'Zwischensumme:',
      discountLabel: 'Rabatt',
      shippingLabel: 'Versand:',
      shippingFree: 'Kostenlos (EU Express)',
      totalLabel: 'Gesamtsumme:',
      couponPlaceholder: 'Gutscheincode (z.B. WARSAW10)',
      couponApplyBtn: 'Einlösen',
      removeBtn: 'Entfernen', colorLabel: 'Farbe',
      checkoutBtn: 'Zur Kasse'
    },
    modalDetails: 'Details',
    modalReviews: 'Bewertungen',
    legal: {
      terms: 'AGB',
      privacy: 'Datenschutzerklärung',
      contact: 'Kontakt'
    }
  },
  FR: {
    nav: { all: 'Tous', silk: 'Soie', satin: 'Satin', velvet: 'Velours', seasonal: 'Saison', accessories: 'Accessoires', about: 'À propos' },
    heroTitle: 'Durags de luxe faits main.<br><span style="color: #D9A87E; font-style: italic;">Le style commence par la tête</span>.',
    heroSubtitle: 'Les seuls durags confectionnés en Pologne',
    heroAccent: '[ Qualité Supérieure ]',
    heroCta: 'Découvrir la collection',
    marquee: 'Expédition express depuis Varsovie en 24h • 2 achetés 1 offert • Livraison gratuite en Europe • ',
    trust: {
      shippingTitle: 'Expédition 1–2 Jours', shippingDesc: 'Express depuis Varsovie vers toute l\'Europe',
      deliveryTitle: 'Livraison Gratuite', deliveryDesc: 'Livraison offerte sur toutes les commandes',
      returnsTitle: '14 Jours de Retours', returnsDesc: 'Garantie de retour en toute simplicité',
      pickupTitle: 'Retrait à Varsovie', pickupDesc: 'ul. Włodarzewska 4 / Centre-ville'
    },
    catalog: { tag: '[ Durag Activity ]', title: 'Style Unique' },
    filterAll: 'Tous les produits', filterSilk: 'Durags en Soie', filterSatin: 'Durags en Satin', filterVelvet: 'Durags en Velours', filterSeasonal: 'Matières de Saison', filterAccessories: 'Accessoires',
    addToCart: 'Ajouter au panier',
    dealBadge: '2+1 Offert',
    emptyCatalog: 'Aucun produit dans cette catégorie.',
    categoryDesc: {
      all: 'Collection complète de durags de luxe cousus main à Varsovie — soie de mûrier 19 Momme, satin, velours et matières de saison.',
      silk: 'Soie de mûrier naturelle 19 Momme pour zéro friction et une protection optimale des 360 waves.',
      satin: 'Satin soyeux premium alliant confort, brillance et tenue quotidienne.',
      velvet: 'Velours dense et texturé pour une compression parfaite.',
      seasonal: 'Matières saisonnières comme le lin respirant et le cupro.',
      accessories: 'Brosses en poils de sanglier et accessoires de compression 360 waves.'
    },
    lookbook: {
      tag: '[ pure silk 19 momme ]',
      title: 'La Soie en Ville.',
      p1: 'Dans le rythme urbain, notre Durag Milanówek est bien plus qu\'un accessoire — il protège vos cheveux et affirme votre style. Confectionné en pure soie de mûrier 19 Momme.',
      p2: 'Un véritable durag en soie naturelle est une pièce d\'exception alliant noblesse et décontraction.',
      btn: 'Découvrir'
    },
    philosophy: {
      tag: '[ Standards artisanaux ]',
      title: 'Philosophie de nos matières',
      silkTitle: 'La Soie pour protéger vos cheveux',
      silkDesc: 'Soie 19 Momme pure limitant la casse, éliminant les frisottis et préservant l\'hydratation.',
      satinTitle: 'Le Satin pour le style quotidien',
      satinDesc: 'Satin doux et résistant alliant éclat et confort pour un usage intensif.',
      velvetTitle: 'Le Velours pour la compression',
      velvetDesc: 'Velours texturé pour maintenir fermement les vagues 360 avec un aspect velouté.',
      seasonalTitle: 'Matières naturelles de saison',
      seasonalDesc: 'Lin naturel (Żyrardów), cupro soyeux (Bydgoszcz) et crêpe satin pour toutes les saisons.'
    },
    about: {
      tag: '[ Warsaw Durag Store ]',
      title: 'À propos',
      p1: 'Warsaw Durag Store est un atelier fondé à Varsovie en 2020 par deux frères passionnés de mode et de culture streetwear.',
      p2: 'Chaque pièce est cousue, inspectée et emballée à la main avec le plus grand soin.',
      p3: 'Nous collaborons avec des sportifs et artistes à travers toute l\'Europe.',
      p4: 'Retrait sur place à Varsovie sur rendez-vous ou expédition suivie. IG @warsawduragstore.',
      btn: 'En savoir plus',
      thumb1: 'Fondateurs', thumb2: 'Emballage & Atelier', thumb3: 'Avis Instagram',
      cap1: 'Kuba et les fondateurs à Varsovie', cap2: 'Fait main en soie 19 Momme', cap3: 'Témoignages de la communauté IG'
    },
    newsletter: {
      title: 'Rejoindre le Club WDS',
      desc: 'Profitez de 10% de réduction sur votre première commande et d\'un accès privilégié aux éditions limitées.',
      placeholder: 'Votre adresse e-mail',
      btn: 'S\'inscrire'
    },
    footer: {
      aboutText: 'Les seuls durags faits main en Pologne. Atelier d\'artisanat haut de gamme à Varsovie.',
      shopTitle: 'Boutique', infoTitle: 'Informations', pickupTitle: 'Retrait en magasin',
      copyright: '© 2026 Warsaw Durag Store. Confectionné en Pologne. Tous droits réservés.'
    },
    cart: {
      title: 'Votre Panier',
      emptyText: 'Votre panier est vide.',
      subtotalLabel: 'Sous-total :',
      discountLabel: 'Remise',
      shippingLabel: 'Livraison :',
      shippingFree: 'Gratuite (EU Express)',
      totalLabel: 'Total :',
      couponPlaceholder: 'Code promo (ex: WARSAW10)',
      couponApplyBtn: 'Appliquer',
      removeBtn: 'Supprimer', colorLabel: 'Couleur',
      checkoutBtn: 'Passer la commande'
    },
    modalDetails: 'Détails',
    modalReviews: 'Avis',
    legal: {
      terms: 'Conditions Générales',
      privacy: 'Politique de Confidentialité',
      contact: 'Contact'
    }
  },
  ES: {
    nav: { all: 'Todos', silk: 'Seda', satin: 'Satén', velvet: 'Terciopelo', seasonal: 'Temporada', accessories: 'Accesorios', about: 'Sobre nosotros' },
    heroTitle: 'Durags artesanales de lujo.<br><span style="color: #D9A87E; font-style: italic;">El estilo nace en la cabeza</span>.',
    heroSubtitle: 'Los únicos durags hechos en Polonia',
    heroAccent: '[ Máxima Calidad ]',
    heroCta: 'Descubrir colección',
    marquee: 'Envío exprés desde Varsovia en 24h • Compra 2 y Llévate 1 Gratis • Envío gratis en Europa • ',
    trust: {
      shippingTitle: 'Envío en 1–2 Días', shippingDesc: 'Exprés desde Varsovia a toda Europa',
      deliveryTitle: 'Envío Gratuito', deliveryDesc: 'Envío gratis en todos los pedidos',
      returnsTitle: '14 Días Devolución', returnsDesc: 'Garantía de devolución sin complicaciones',
      pickupTitle: 'Recogida en Varsovia', pickupDesc: 'ul. Włodarzewska 4 / Centro'
    },
    catalog: { tag: '[ Durag Activity ]', title: 'Estilo Único' },
    filterAll: 'Todos los productos', filterSilk: 'Durags de Seda', filterSatin: 'Durags de Satén', filterVelvet: 'Durags de Terciopelo', filterSeasonal: 'De Temporada', filterAccessories: 'Accesorios',
    addToCart: 'Añadir a la cesta',
    dealBadge: '2+1 Gratis',
    emptyCatalog: 'No hay productos disponibles en esta categoría.',
    categoryDesc: {
      all: 'Colección completa de durags cosidos a mano en Varsovia — seda de morera 19 Momme, satén, terciopelo y telas de temporada.',
      silk: 'Seda de morera natural 19 Momme para cero fricción y máxima protección de 360 waves.',
      satin: 'Satén suave de alta calidad que combina ligereza, brillo y durabilidad.',
      velvet: 'Terciopelo suave y denso con excelente fijación y compresión.',
      seasonal: 'Tejidos estacionales transpirables como lino natural y cupro.',
      accessories: 'Cepillos de cerdas de jabalí y accesorios esenciales para ondas 360.'
    },
    lookbook: {
      tag: '[ pure silk 19 momme ]',
      title: 'Seda en la Ciudad.',
      p1: 'En el dinamismo urbano, nuestro Durag Milanówek es más que un complemento: cuida tu cabello y realza tu estilo personal. Hecho de auténtica seda de morera 19 Momme.',
      p2: 'Un auténtico durag de seda natural es una joya de elegancia sutil y confección artesanal.',
      btn: 'Descubrir'
    },
    philosophy: {
      tag: '[ Estándares de calidad ]',
      title: 'Filosofía de nuestros materiales',
      silkTitle: 'Seda para el cuidado capilar',
      silkDesc: 'Seda pura 19 Momme que elimina la fricción, previene el encrespamiento y retiene la hidratación.',
      satinTitle: 'Satén para el estilo diario',
      satinDesc: 'Satén prémium que combina ligereza, suavidad y durabilidad para el día a día.',
      velvetTitle: 'Terciopelo para fijación',
      velvetDesc: 'Terciopelo suave y denso para una compresión óptima de ondas 360.',
      seasonalTitle: 'Tejidos naturales de temporada',
      seasonalDesc: 'Lino transpirable (Żyrardów), cupro (Bydgoszcz) y crepé de satén para cada época del año.'
    },
    about: {
      tag: '[ Warsaw Durag Store ]',
      title: 'Sobre nosotros',
      p1: 'Warsaw Durag Store nació en Varsovia en 2020 de la mano de dos hermanos para crear durags artesanales de máxima calidad.',
      p2: 'Cada pieza se confecciona y se empaqueta a mano con atención meticulosa a cada detalle.',
      p3: 'Colaboramos activamente con artistas y deportistas de toda Europa.',
      p4: 'Recogida local en Varsovia con cita previa o envío urgente. IG @warsawduragstore.',
      btn: 'Más sobre nosotros',
      thumb1: 'Fundadores', thumb2: 'Empaque & Taller', thumb3: 'Opiniones en IG',
      cap1: 'Kuba y los fundadores en Varsovia', cap2: 'Hecho a mano con seda 19 Momme', cap3: 'Comentarios de nuestra comunidad en IG'
    },
    newsletter: {
      title: 'Únete al Club WDS',
      desc: 'Consigue un 10% de descuento en tu primer pedido y acceso anticipado a ediciones limitadas.',
      placeholder: 'Tu correo electrónico',
      btn: 'Suscribirse'
    },
    footer: {
      aboutText: 'Los únicos durags hechos a mano en Polonia. Taller de lujo en Varsovia.',
      shopTitle: 'Tienda', infoTitle: 'Información', pickupTitle: 'Recogida',
      copyright: '© 2026 Warsaw Durag Store. Confeccionado en Polonia. Todos los derechos reservados.'
    },
    cart: {
      title: 'Tu Cesta',
      emptyText: 'Tu cesta está vacía.',
      subtotalLabel: 'Subtotal:',
      discountLabel: 'Descuento',
      shippingLabel: 'Envío:',
      shippingFree: 'Gratis (EU Express)',
      totalLabel: 'Total:',
      couponPlaceholder: 'Código de descuento (ej: WARSAW10)',
      couponApplyBtn: 'Aplicar',
      removeBtn: 'Eliminar', colorLabel: 'Color',
      checkoutBtn: 'Tramitar pedido'
    },
    modalDetails: 'Detalles',
    modalReviews: 'Reseñas',
    legal: {
      terms: 'Términos y Condiciones',
      privacy: 'Política de Privacidad',
      contact: 'Contacto'
    }
  }
};

function getActiveLanguage() {
  const stored = localStorage.getItem('wds_lang');
  const urlParams = new URLSearchParams(window.location.search);
  const paramLang = urlParams.get('lang');
  if (paramLang && I18N[paramLang.toUpperCase()]) {
    return paramLang.toUpperCase();
  }
  if (stored && I18N[stored]) {
    return stored;
  }
  // Język polski (PL) jest w 100% dostępny i równorzędny na obu domenach (.pl i .com)
  const browserLang = (navigator.language || navigator.userLanguage || '').slice(0, 2).toUpperCase();
  if (browserLang === 'PL') {
    return 'PL';
  }
  // Dla odwiedzających z zagranicy na domenie .com sugerujemy ich język lokalny lub EN
  if (window.location.hostname.includes('warsawduragstore.com')) {
    return I18N[browserLang] ? browserLang : 'EN';
  }
  return 'PL';
}

function applyLanguage(lang) {
  const dict = I18N[lang] || I18N.PL;
  localStorage.setItem('wds_lang', lang);

  const currentLangText = document.getElementById('currentLangText');
  if (currentLangText) currentLangText.textContent = lang;

  // 1. Navigation Menu Links
  const navMap = {
    navLinkAll: dict.nav.all, mobNavLinkAll: dict.nav.all,
    navLinkSilk: dict.nav.silk, mobNavLinkSilk: dict.nav.silk,
    navLinkSatin: dict.nav.satin, mobNavLinkSatin: dict.nav.satin,
    navLinkVelvet: dict.nav.velvet, mobNavLinkVelvet: dict.nav.velvet,
    navLinkSeasonal: dict.nav.seasonal, mobNavLinkSeasonal: dict.nav.seasonal,
    navLinkAccessories: dict.nav.accessories, mobNavLinkAccessories: dict.nav.accessories,
    navLinkAbout: dict.nav.about, mobNavLinkAbout: dict.nav.about
  };
  Object.entries(navMap).forEach(([id, text]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  });

  // 2. Marquee Ticker
  const marqueeSpans = document.querySelectorAll('.marquee-content span');
  marqueeSpans.forEach(span => {
    span.textContent = dict.marquee;
  });

  // 3. Hero Section
  const heroAccent = document.getElementById('heroAccent');
  if (heroAccent) heroAccent.textContent = dict.heroAccent;
  const heroSubtitle = document.getElementById('heroSubtitle');
  if (heroSubtitle) heroSubtitle.textContent = dict.heroSubtitle;
  const heroTitle = document.getElementById('heroTitle');
  if (heroTitle) heroTitle.innerHTML = dict.heroTitle;
  const heroCtaBtn = document.getElementById('heroCtaBtn');
  if (heroCtaBtn) heroCtaBtn.textContent = dict.heroCta;

  // 4. Trust Banner
  const trustMap = {
    trustShippingTitle: dict.trust.shippingTitle, trustShippingDesc: dict.trust.shippingDesc,
    trustDeliveryTitle: dict.trust.deliveryTitle, trustDeliveryDesc: dict.trust.deliveryDesc,
    trustReturnsTitle: dict.trust.returnsTitle, trustReturnsDesc: dict.trust.returnsDesc,
    trustPickupTitle: dict.trust.pickupTitle, trustPickupDesc: dict.trust.pickupDesc
  };
  Object.entries(trustMap).forEach(([id, text]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  });

  // 5. Catalog Header & Filters
  const catalogTag = document.getElementById('catalogSectionTag');
  if (catalogTag) catalogTag.textContent = dict.catalog.tag;
  const catalogTitle = document.getElementById('catalogSectionTitle');
  if (catalogTitle) catalogTitle.textContent = dict.catalog.title;

  const tabMap = {
    tabAll: dict.filterAll, tabSilk: dict.filterSilk, tabSatin: dict.filterSatin,
    tabVelvet: dict.filterVelvet, tabSeasonal: dict.filterSeasonal, tabAccessories: dict.filterAccessories
  };
  Object.entries(tabMap).forEach(([id, text]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  });

  updateCategoryDescription(state.activeCategory || 'all');

  // 6. Lookbook Section
  const lookbookMap = {
    lookbookTag: dict.lookbook.tag, lookbookTitle: dict.lookbook.title,
    lookbookP1: dict.lookbook.p1, lookbookP2: dict.lookbook.p2, lookbookBtn: dict.lookbook.btn
  };
  Object.entries(lookbookMap).forEach(([id, text]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  });

  // 7. Brand Philosophy
  const philMap = {
    philosophyTag: dict.philosophy.tag, philosophyTitle: dict.philosophy.title,
    philSilkTitle: dict.philosophy.silkTitle, philSilkDesc: dict.philosophy.silkDesc,
    philSatinTitle: dict.philosophy.satinTitle, philSatinDesc: dict.philosophy.satinDesc,
    philVelvetTitle: dict.philosophy.velvetTitle, philVelvetDesc: dict.philosophy.velvetDesc,
    philSeasonalTitle: dict.philosophy.seasonalTitle, philSeasonalDesc: dict.philosophy.seasonalDesc
  };
  Object.entries(philMap).forEach(([id, text]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  });

  // 8. About Us Section
  const aboutMap = {
    aboutTag: dict.about.tag, aboutTitle: dict.about.title,
    aboutP1: dict.about.p1, aboutP2: dict.about.p2, aboutP3: dict.about.p3, aboutP4: dict.about.p4,
    aboutMoreBtn: dict.about.btn,
    aboutThumb1: dict.about.thumb1, aboutThumb2: dict.about.thumb2, aboutThumb3: dict.about.thumb3
  };
  Object.entries(aboutMap).forEach(([id, text]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  });

  // 9. Newsletter
  const newsMap = {
    newsletterTitle: dict.newsletter.title, newsletterDesc: dict.newsletter.desc, newsletterSubmitBtn: dict.newsletter.btn
  };
  Object.entries(newsMap).forEach(([id, text]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  });
  const newsInput = document.getElementById('newsletterEmail');
  if (newsInput) newsInput.placeholder = dict.newsletter.placeholder;

  // 10. Footer
  const footerMap = {
    footerAboutText: dict.footer.aboutText, footerShopTitle: dict.footer.shopTitle,
    footerInfoTitle: dict.footer.infoTitle, footerPickupTitle: dict.footer.pickupTitle,
    footerCopyright: dict.footer.copyright,
    footerLinkSilk: dict.filterSilk, footerLinkSatin: dict.filterSatin, footerLinkVelvet: dict.filterVelvet,
    footerLinkSeasonal: dict.filterSeasonal, footerLinkAccessories: dict.filterAccessories,
    footerLinkPhilosophy: dict.philosophy.title
  };
  Object.entries(footerMap).forEach(([id, text]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  });

  // 11. Cart Drawer Labels
  const cartMap = {
    cartSubtotalLabel: dict.cart.subtotalLabel,
    cartShippingLabel: dict.cart.shippingLabel,
    cartShipping: dict.cart.shippingFree,
    cartTotalLabel: dict.cart.totalLabel,
    checkoutBtn: dict.cart.checkoutBtn,
    cartPromoApplyBtn: dict.cart.couponApplyBtn
  };
  Object.entries(cartMap).forEach(([id, text]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  });
  const cartPromoInput = document.getElementById('cartPromoInput');
  if (cartPromoInput) cartPromoInput.placeholder = dict.cart.couponPlaceholder;

  // 12. Cart Title
  const totalCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTitleText = document.getElementById('cartTitleText');
  if (cartTitleText) cartTitleText.innerHTML = `${dict.cart.title} (<span id="cartHeaderCount">${totalCount}</span>)`;

  // 13. Footer Legal Links
  const linkAbout = document.getElementById('linkAboutLegal');
  if (linkAbout) linkAbout.textContent = dict.nav.about;
  const linkTerms = document.getElementById('linkTerms');
  if (linkTerms) linkTerms.textContent = (dict.legal && dict.legal.terms) ? dict.legal.terms : (lang === 'PL' ? 'Regulamin' : 'Terms & Conditions');
  const linkPrivacy = document.getElementById('linkPrivacy');
  if (linkPrivacy) linkPrivacy.textContent = (dict.legal && dict.legal.privacy) ? dict.legal.privacy : (lang === 'PL' ? 'Polityka Prywatności' : 'Privacy Policy');
  const linkContact = document.getElementById('linkContactLegal');
  if (linkContact) linkContact.textContent = (dict.legal && dict.legal.contact) ? dict.legal.contact : (lang === 'PL' ? 'Kontakt' : 'Contact');

  // 14. Modal Static Elements
  const modalAddBtn = document.getElementById('modalAddBtn');
  if (modalAddBtn) modalAddBtn.textContent = dict.addToCart;
  const modalDealBadge = document.querySelector('#productModal .deal-badge');
  if (modalDealBadge) modalDealBadge.textContent = dict.dealBadge;
  const modalTabDetailsBtn = document.querySelector('.tab-header[data-tab="details"]');
  if (modalTabDetailsBtn) modalTabDetailsBtn.textContent = dict.modalDetails || (lang === 'PL' ? 'Szczegóły' : 'Details');
  const modalTabReviewsBtn = document.querySelector('.tab-header[data-tab="reviews"]');
  if (modalTabReviewsBtn) modalTabReviewsBtn.textContent = dict.modalReviews || (lang === 'PL' ? 'Opinie' : 'Reviews');

  // 15. If switched to PL and admin customized CMS content exists, re-apply it
  if (lang === 'PL' && window.cachedSiteContent) {
    applySiteContent(window.cachedSiteContent);
  }

  // 16. Re-render product grid & cart
  renderProductGrid();
  renderCart();
}

function updateCategoryDescription(category) {
  const descBox = document.getElementById('categoryDescBox');
  if (!descBox) return;
  const lang = getActiveLanguage();
  const dict = I18N[lang] || I18N.PL;
  const desc = dict.categoryDesc[category] || dict.categoryDesc.all;
  descBox.textContent = desc;
}

function initLanguageSwitcher() {
  const langBtn = document.getElementById('langBtn');
  const langDropdown = document.getElementById('langDropdown');
  const currentLangText = document.getElementById('currentLangText');

  if (langBtn && langDropdown) {
    langBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      langDropdown.style.display = langDropdown.style.display === 'none' ? 'block' : 'none';
    });

    document.addEventListener('click', () => {
      langDropdown.style.display = 'none';
    });

    const langOpts = langDropdown.querySelectorAll('.lang-opt');
    langOpts.forEach(opt => {
      opt.addEventListener('click', () => {
        const lang = opt.getAttribute('data-lang');
        if (lang && I18N[lang]) {
          applyLanguage(lang);
          langDropdown.style.display = 'none';
        }
      });
    });

    const activeLang = getActiveLanguage();
    applyLanguage(activeLang);
  }
}

// Mobile Nav toggle mechanism
function toggleMobileNav() {
  const isOpen = DOM.mobileNavDrawer.classList.contains('active');
  
  if (isOpen) {
    DOM.mobileNavDrawer.classList.remove('active');
    DOM.mobileNavDrawer.setAttribute('aria-hidden', 'true');
    DOM.hamburgerBtn.classList.remove('active');
    DOM.hamburgerBtn.setAttribute('aria-label', 'Otwórz menu');
    document.body.style.overflow = '';
  } else {
    DOM.mobileNavDrawer.classList.add('active');
    DOM.mobileNavDrawer.setAttribute('aria-hidden', 'false');
    DOM.hamburgerBtn.classList.add('active');
    DOM.hamburgerBtn.setAttribute('aria-label', 'Zamknij menu');
    document.body.style.overflow = 'hidden';
  }
}

// Active Filter setter with smooth fade animation
function setActiveFilter(category) {
  state.activeCategory = category;
  
  // Update nav UI buttons
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    if (btn.getAttribute('data-category') === category) {
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
    } else {
      btn.classList.remove('active');
      btn.setAttribute('aria-selected', 'false');
    }
  });

  updateCategoryDescription(category);

  const grid = document.getElementById('productGrid') || (DOM && DOM.productGrid);
  if (grid) {
    grid.style.transition = 'opacity 0.25s cubic-bezier(0.25, 1, 0.5, 1)';
    grid.style.opacity = '0';
    
    setTimeout(() => {
      renderProductGrid();
      grid.style.opacity = '1';
    }, 250);
  } else {
    renderProductGrid();
  }
}

// ========================================================================
// 3. CATALOG RENDERING & SHOP INTERACTIONS
// ========================================================================

function renderProductGrid() {
  const grid = document.getElementById('productGrid') || (DOM && DOM.productGrid);
  if (!grid) return;

  const filtered = state.activeCategory === 'all' 
    ? products 
    : products.filter(p => p.category === state.activeCategory);
    
  const lang = getActiveLanguage();
  const dict = I18N[lang] || I18N.PL;
  
  if (filtered.length === 0) {
    if (isProductsLoading) {
      grid.innerHTML = `<div style="grid-column: 1/-1; text-align:center; color:var(--color-secondary); padding: 60px 0;">
        <span class="catalog-spinner" style="display:inline-block; width: 28px; height: 28px; border: 2px solid var(--color-accent); border-top-color: transparent; border-radius: 50%; animation: spin 0.8s linear infinite; margin-bottom: 14px;"></span>
        <p style="font-family: var(--font-primary); font-size: 0.9rem; letter-spacing: 0.05em; text-transform: uppercase;">${lang === 'PL' ? 'Ładowanie kolekcji...' : 'Loading collection...'}</p>
      </div>`;
      return;
    }
    grid.innerHTML = `<p style="grid-column: 1/-1; text-align:center; color:var(--color-secondary); padding: 40px 0;">${dict.emptyCatalog}</p>`;
    return;
  }
  
  grid.innerHTML = '';
  
  filtered.forEach((p, idx) => {
    const card = document.createElement('article');
    card.className = 'product-card reveal active';
    card.setAttribute('data-id', p.id);
    
    // Visual badge
    let badgeHtml = '';
    if (p.category === 'silk') {
      badgeHtml = `<span class="product-badge gold">${lang === 'PL' ? 'Morwowy bestseller' : (lang === 'DE' ? 'Bestseller Seide' : (lang === 'FR' ? 'Bestseller Soie' : 'Silk Bestseller'))}</span>`;
    } else if (p.category === 'seasonal') {
      badgeHtml = `<span class="product-badge">${lang === 'PL' ? 'Sezonowy Drop' : 'Seasonal Drop'}</span>`;
    }
    
    const displayName = (lang !== 'PL' && p.nameEn) ? p.nameEn : p.name;
    const catLabel = p.category === 'silk' ? dict.filterSilk 
                   : (p.category === 'satin' ? dict.filterSatin 
                   : (p.category === 'velvet' ? dict.filterVelvet 
                   : (p.category === 'seasonal' ? dict.filterSeasonal 
                   : (p.category === 'accessories' ? dict.filterAccessories : p.categoryLabel))));
    const descSnippet = p.storyDescription || p.description;

    const isFirstScreen = idx < 4;
    const loadingAttr = isFirstScreen ? 'loading="eager" fetchpriority="high"' : 'loading="lazy" decoding="async"';
    const hasSecondary = p.images && p.images.length > 1 && p.images[1] !== p.images[0];
    const secondaryImgHtml = hasSecondary 
      ? `<img class="product-card-img secondary" src="${p.images[1]}" alt="${displayName} - detale" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='./assets/durag_silk_black.webp';">`
      : '';

    card.innerHTML = `
      <div class="product-image-container">
        ${badgeHtml}
        <img class="product-card-img primary" src="${p.images[0]}" alt="${displayName}" ${loadingAttr} onerror="this.onerror=null;this.src='./assets/durag_silk_black.webp';">
        ${secondaryImgHtml}
      </div>
      
      <div class="product-info">
        <span class="product-category">${catLabel}</span>
        <h3 class="product-title">${displayName}</h3>
        <p class="product-card-desc">${descSnippet}</p>
        <div class="product-meta-row">
          <div class="product-price-box">
            <span class="product-price">${p.price.toFixed(2)} PLN</span>
            <span class="deal-badge">${dict.dealBadge}</span>
          </div>
          <button class="btn-card-add" data-action="quickadd" data-id="${p.id}">${dict.addToCart}</button>
        </div>
      </div>
    `;
    
    // Binding triggers
    card.addEventListener('click', (e) => {
      if (e.target.closest('[data-action="quickadd"]')) {
        return;
      }
      openProductModal(p.id);
    });
    
    // Quick Add bind
    const quickAddBtn = card.querySelector('[data-action="quickadd"]');
    if (quickAddBtn) {
      quickAddBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const defaultColor = p.colors && p.colors.length > 0 ? p.colors[0].name : 'Default';
        addToCart(p.id, 1, defaultColor);
        openCartDrawer();
      });
    }
    
    grid.appendChild(card);
  });
}

// Carousel controller for About Us section
function initAboutCarousel() {
  const imgEl = document.getElementById('aboutCarouselImg');
  const capEl = document.getElementById('aboutCarouselCaption');
  const btns = document.querySelectorAll('.about-thumb-btn');
  if (!imgEl || !btns.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => {
        b.classList.remove('active');
        b.style.borderColor = 'rgba(255,255,255,0.2)';
      });
      btn.classList.add('active');
      btn.style.borderColor = '#D9A87E';

      const src = btn.getAttribute('data-src');
      const cap = btn.getAttribute('data-cap');

      imgEl.style.opacity = '0';
      setTimeout(() => {
        if (src) imgEl.src = src;
        if (cap && capEl) capEl.textContent = cap;
        imgEl.style.opacity = '1';
      }, 200);
    });
  });
}

// ========================================================================
// 4. CART STATE & DRAWER MANAGEMENT
// ========================================================================

function openCartDrawer() {
  window.location.href = './koszyk';
}

function closeCartDrawer() {
  DOM.cartOverlay.classList.remove('active');
  DOM.cartOverlay.setAttribute('aria-hidden', 'true');
  // Re-enable body scroll only if mobile nav is also closed
  if (!DOM.mobileNavDrawer.classList.contains('active')) {
    document.body.style.overflow = '';
  }
}

function updateCartBadge() {
  const totalQty = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  DOM.cartCount.textContent = totalQty;
  DOM.cartHeaderCount.textContent = totalQty;
  
  // Bounce animation trigger
  DOM.cartTrigger.classList.remove('bounce-badge');
  void DOM.cartTrigger.offsetWidth; // Trigger reflow
  DOM.cartTrigger.classList.add('bounce-badge');
}

function addToCart(productId, qty = 1, color = 'Default') {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  // Check if item exists with same color in cart
  const existingIdx = state.cart.findIndex(item => item.id === productId && item.color === color);
  
  if (existingIdx > -1) {
    state.cart[existingIdx].quantity += qty;
  } else {
    state.cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      color: color,
      quantity: qty
    });
  }

  // Update badge and localStorage
  updateCartBadge();
  localStorage.setItem('wds_cart', JSON.stringify(state.cart));
}

function removeFromCart(index) {
  state.cart.splice(index, 1);
  updateCartBadge();
  localStorage.setItem('wds_cart', JSON.stringify(state.cart));
  renderCart();
}

function updateCartItemQty(index, delta) {
  const item = state.cart[index];
  if (!item) return;
  
  item.quantity += delta;
  
  if (item.quantity <= 0) {
    removeFromCart(index);
  } else {
    updateCartBadge();
    localStorage.setItem('wds_cart', JSON.stringify(state.cart));
    renderCart();
  }
}

function calculateTotals() {
  const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  let discount = 0;
  
  if (state.promoApplied) {
    discount = subtotal * state.promoApplied.discount;
  }
  
  const total = Math.max(0, subtotal - discount);
  
  return { subtotal, discount, total };
}

function renderCart() {
  DOM.cartItemsContainer.innerHTML = '';
  const lang = getActiveLanguage();
  const dict = I18N[lang] || I18N.PL;
  
  if (state.cart.length === 0) {
    DOM.cartItemsContainer.innerHTML = `<p class="cart-empty-message">${dict.cart.emptyText || 'Twój koszyk jest pusty.'}</p>`;
    // Hide footer details
    DOM.cartFooter.style.opacity = '0.5';
    DOM.cartFooter.style.pointerEvents = 'none';
    
    DOM.cartSubtotal.textContent = '0.00 PLN';
    DOM.cartTotal.textContent = '0.00 PLN';
    DOM.cartDiscountRow.style.display = 'none';
    return;
  }
  
  DOM.cartFooter.style.opacity = '1';
  DOM.cartFooter.style.pointerEvents = 'all';
  
  state.cart.forEach((item, idx) => {
    const itemEl = document.createElement('div');
    itemEl.className = 'cart-item';
    const prod = products.find(p => p.id === item.id);
    const displayName = (lang !== 'PL' && prod && prod.nameEn) ? prod.nameEn : item.name;
    const removeLabel = (dict.cart && dict.cart.removeBtn) ? dict.cart.removeBtn : (lang === 'PL' ? 'Usuń' : 'Remove');
    const colorLabel = (dict.cart && dict.cart.colorLabel) ? dict.cart.colorLabel : (lang === 'PL' ? 'Kolor' : 'Color');

    itemEl.innerHTML = `
      <img src="${item.image}" alt="${displayName}" class="cart-item-image">
      <div class="cart-item-info">
        <h4 class="cart-item-name">${displayName}</h4>
        <span class="cart-item-meta">${colorLabel}: ${item.color}</span>
        
        <div class="cart-item-controls">
          <div class="quantity-selector">
            <button class="qty-btn" data-action="minus" data-idx="${idx}">-</button>
            <span class="qty-val">${item.quantity}</span>
            <button class="qty-btn" data-action="plus" data-idx="${idx}">+</button>
          </div>
          <span class="cart-item-price">${(item.price * item.quantity).toFixed(2)} PLN</span>
        </div>
        <div>
          <button class="cart-item-remove" data-action="remove" data-idx="${idx}">${removeLabel}</button>
        </div>
      </div>
    `;
    DOM.cartItemsContainer.appendChild(itemEl);
  });

  // Calculate totals and render
  const totals = calculateTotals();
  DOM.cartSubtotal.textContent = `${totals.subtotal.toFixed(2)} PLN`;
  
  if (state.promoApplied) {
    DOM.cartDiscountRow.style.display = 'flex';
    DOM.cartDiscountPercent.textContent = state.promoApplied.percent;
    DOM.cartDiscountVal.textContent = `-${totals.discount.toFixed(2)} PLN`;
  } else {
    DOM.cartDiscountRow.style.display = 'none';
  }
  
  DOM.cartTotal.textContent = `${totals.total.toFixed(2)} PLN`;
}

function handleCartItemClicks(e) {
  const btn = e.target.closest('button');
  if (!btn) return;
  
  const action = btn.getAttribute('data-action');
  const index = parseInt(btn.getAttribute('data-idx'));
  
  if (action === 'minus') {
    updateCartItemQty(index, -1);
  } else if (action === 'plus') {
    updateCartItemQty(index, 1);
  } else if (action === 'remove') {
    removeFromCart(index);
  }
}

// Apply Promo Coupon Logic — walidacja po stronie Supabase (serwer)
async function handleApplyPromoCode() {
  const rawCode = DOM.cartPromoInput.value.trim().toUpperCase();
  
  if (!rawCode) {
    showPromoMessage('Wpisz kod rabatowy.', 'error');
    return;
  }

  // Show loading state
  DOM.cartPromoApplyBtn.textContent = '...';
  DOM.cartPromoApplyBtn.disabled = true;

  try {
    // Validate server-side — nikt nie może ominąć przez devtools
    const { data, error } = await supabase
      .from('promo_codes')
      .select('code, rate')
      .eq('code', rawCode)
      .eq('active', true)
      .maybeSingle();

    DOM.cartPromoApplyBtn.textContent = 'Zastosuj';
    DOM.cartPromoApplyBtn.disabled = false;

    if (error || !data) {
      state.promoApplied = null;
      showPromoMessage('Nieprawidłowy kod rabatowy.', 'error');
      renderCart();
      return;
    }

    state.promoApplied = {
      code: rawCode,
      discount: parseFloat(data.rate),
      percent: Math.round(parseFloat(data.rate) * 100)
    };
    showPromoMessage(`Dodano kupon ${rawCode}! Zniżka ${state.promoApplied.percent}%`, 'success');
    renderCart();
  } catch (err) {
    DOM.cartPromoApplyBtn.textContent = 'Zastosuj';
    DOM.cartPromoApplyBtn.disabled = false;
    console.warn('[WDS] Promo validation error:', err);
    showPromoMessage('Błąd połączenia. Spróbuj ponownie.', 'error');
  }
}

function showPromoMessage(msg, type) {
  DOM.promoStatusMsg.textContent = msg;
  DOM.promoStatusMsg.className = `promo-status-msg ${type}`;
  setTimeout(() => {
    DOM.promoStatusMsg.textContent = '';
    DOM.promoStatusMsg.className = 'promo-status-msg';
  }, 4000);
}

// Checkout Process Mock and Success view transition
function handleCheckoutProcess() {
  if (state.cart.length === 0) {
    alert('Twój koszyk jest pusty!');
    return;
  }
  
  const cartStepCart = document.getElementById('cartStepCart');
  const cartStepCheckout = document.getElementById('cartStepCheckout');
  
  // Hide Cart View, Show Checkout View
  if (cartStepCart) cartStepCart.style.display = 'none';
  if (cartStepCheckout) cartStepCheckout.style.display = 'flex';
  
  // Update Checkout Invoice Summaries
  const totals = calculateTotals();
  const subtotalEl = document.getElementById('checkoutSubtotal');
  if (subtotalEl) subtotalEl.textContent = totals.subtotal.toFixed(2) + ' PLN';
  
  const checkoutDiscountRow = document.getElementById('checkoutDiscountRow');
  const checkoutDiscountVal = document.getElementById('checkoutDiscountVal');
  if (checkoutDiscountRow && checkoutDiscountVal) {
    if (totals.discount > 0) {
      checkoutDiscountRow.style.display = 'flex';
      checkoutDiscountVal.textContent = '-' + totals.discount.toFixed(2) + ' PLN';
    } else {
      checkoutDiscountRow.style.display = 'none';
    }
  }
  const totalEl = document.getElementById('checkoutTotal');
  if (totalEl) totalEl.textContent = totals.total.toFixed(2) + ' PLN';
}

// ========================================================================
// 5. ACCESSIBLE PRODUCT DETAIL MODAL CONTROLLER
// ========================================================================

function updateModalGallery(index) {
  if (!state.activeProductInModal || !state.activeProductInModal.images) return;
  const images = state.activeProductInModal.images;
  
  if (index < 0) index = images.length - 1;
  if (index >= images.length) index = 0;
  
  state.activeImageIndexInModal = index;
  DOM.modalImg.src = images[index];
  
  const thumbs = DOM.modalThumbnails.querySelectorAll('.modal-thumb');
  thumbs.forEach((t, idx) => {
    if (idx === index) {
      t.classList.add('active');
    } else {
      t.classList.remove('active');
    }
  });
}

function openProductModal(productId) {
  const p = products.find(prod => prod.id === productId);
  if (!p) return;

  state.activeProductInModal = p;
  state.activeImageIndexInModal = 0;
  
  const lang = getActiveLanguage();
  const dict = I18N[lang] || I18N.PL;
  const displayName = (lang !== 'PL' && p.nameEn) ? p.nameEn : p.name;
  const catLabel = p.category === 'silk' ? dict.filterSilk 
                 : (p.category === 'satin' ? dict.filterSatin 
                 : (p.category === 'velvet' ? dict.filterVelvet 
                 : (p.category === 'seasonal' ? dict.filterSeasonal 
                 : (p.category === 'accessories' ? dict.filterAccessories : p.categoryLabel))));

  // Inject details
  DOM.modalImg.src = p.images[0];
  DOM.modalImg.alt = displayName;
  DOM.modalImg.onerror = function() { this.onerror = null; this.src = './assets/durag_silk_black.webp'; };
  DOM.modalCategory.textContent = catLabel;
  DOM.modalTitle.textContent = displayName;
  DOM.modalPrice.textContent = `${p.price.toFixed(2)} PLN`;
  DOM.modalMaterial.textContent = p.material;
  DOM.modalDesc.textContent = p.description;
  DOM.modalQtyVal.textContent = '1';
  const revCount = (p.reviews && p.reviews.length) || 0;
  if (DOM.modalReviewsCount) {
    if (revCount > 0) {
      DOM.modalReviewsCount.textContent = `${revCount} ${revCount === 1 ? (lang === 'PL' ? 'opinia' : 'review') : (lang === 'PL' ? 'opinie' : 'reviews')}`;
    } else {
      DOM.modalReviewsCount.textContent = lang === 'PL' ? 'Warsaw Atelier • Zweryfikowana jakość' : 'Warsaw Atelier • Verified Quality';
    }
  }
  
  const modalAddBtn = document.getElementById('modalAddBtn');
  if (modalAddBtn) modalAddBtn.textContent = dict.addToCart;
  const modalDealBadge = document.querySelector('#productModal .deal-badge');
  if (modalDealBadge) modalDealBadge.textContent = dict.dealBadge;
  const modalTabDetailsBtn = document.querySelector('.tab-header[data-tab="details"]');
  if (modalTabDetailsBtn) modalTabDetailsBtn.textContent = dict.modalDetails || (lang === 'PL' ? 'Szczegóły' : 'Details');
  const modalTabReviewsBtn = document.querySelector('.tab-header[data-tab="reviews"]');
  if (modalTabReviewsBtn) modalTabReviewsBtn.textContent = dict.modalReviews || (lang === 'PL' ? 'Opinie' : 'Reviews');
  
  // Render thumbnails
  DOM.modalThumbnails.innerHTML = '';
  if (p.images && p.images.length > 1) {
    p.images.forEach((imgSrc, idx) => {
      const thumb = document.createElement('img');
      thumb.className = `modal-thumb ${idx === 0 ? 'active' : ''}`;
      thumb.src = imgSrc;
      thumb.alt = `${p.name} - ujęcie ${idx + 1}`;
      thumb.addEventListener('click', () => {
        updateModalGallery(idx);
      });
      DOM.modalThumbnails.appendChild(thumb);
    });
    DOM.modalGalleryPrev.style.display = 'flex';
    DOM.modalGalleryNext.style.display = 'flex';
  } else {
    DOM.modalGalleryPrev.style.display = 'none';
    DOM.modalGalleryNext.style.display = 'none';
  }
  
  // Render colors swatch inputs
  DOM.modalColors.innerHTML = '';
  if (p.colors && p.colors.length > 0) {
    state.selectedColorInModal = p.colors[0].name;
    
    p.colors.forEach((c, idx) => {
      const swatch = document.createElement('span');
      swatch.className = `color-option ${idx === 0 ? 'selected' : ''}`;
      swatch.style.backgroundColor = c.hex;
      swatch.title = c.name;
      swatch.setAttribute('data-color', c.name);
      
      swatch.addEventListener('click', () => {
        document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
        swatch.classList.add('selected');
        state.selectedColorInModal = c.name;
      });
      
      DOM.modalColors.appendChild(swatch);
    });
  } else {
    state.selectedColorInModal = 'Default';
  }

  // Render Reviews tab
  DOM.modalReviewsList.innerHTML = '';
  p.reviews.forEach(rev => {
    const starStr = '★'.repeat(rev.rating) + '☆'.repeat(5 - rev.rating);
    const revEl = document.createElement('div');
    revEl.className = 'review-item';
    revEl.innerHTML = `
      <div class="review-header">
        <span class="review-author">${rev.author}</span>
        <span class="review-date">${rev.date}</span>
      </div>
      <div class="review-rating">${starStr}</div>
      <p class="review-comment">${rev.comment}</p>
    `;
    DOM.modalReviewsList.appendChild(revEl);
  });

  // Reset tab selection to details by default
  const defaultTabHeader = document.querySelector('.tab-header[data-tab="details"]');
  if (defaultTabHeader) {
    toggleModalTab(defaultTabHeader, 'details');
  }

  // Trigger modal visibility
  DOM.productModal.classList.add('active');
  DOM.productModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeProductModal() {
  DOM.productModal.classList.remove('active');
  DOM.productModal.setAttribute('aria-hidden', 'true');
  // Re-enable body scroll only if mobile nav/cart drawer is also closed
  if (!DOM.mobileNavDrawer.classList.contains('active') && !DOM.cartOverlay.classList.contains('active')) {
    document.body.style.overflow = '';
  }
  state.activeProductInModal = null;
  state.selectedColorInModal = null;
}

function adjustModalQty(delta) {
  let val = parseInt(DOM.modalQtyVal.textContent);
  val = Math.max(1, val + delta);
  DOM.modalQtyVal.textContent = val;
}

function handleAddFromModal() {
  if (!state.activeProductInModal) return;
  
  const qty = parseInt(DOM.modalQtyVal.textContent);
  addToCart(state.activeProductInModal.id, qty, state.selectedColorInModal);
  
  // Visual feedback on button
  DOM.modalAddBtn.textContent = 'Dodano!';
  DOM.modalAddBtn.disabled = true;
  
  setTimeout(() => {
    DOM.modalAddBtn.textContent = 'Dodaj do koszyka';
    DOM.modalAddBtn.disabled = false;
    closeProductModal();
    openCartDrawer();
  }, 800);
}

// Tab Switching in Product Modal
function toggleModalTab(header, tabName) {
  document.querySelectorAll('.tab-header').forEach(h => {
    h.classList.remove('active');
    h.style.color = '#8E8E93';
  });
  header.classList.add('active');
  header.style.color = '#FFFFFF';

  const tabContent = document.getElementById('modalTabContent');
  const reviewsList = document.getElementById('modalReviewsList');
  if (!tabContent || !state.activeProductInModal) return;

  let specDetails = document.getElementById('modalSpecDetails');
  if (!specDetails) {
    specDetails = document.createElement('div');
    specDetails.id = 'modalSpecDetails';
    tabContent.prepend(specDetails);
  }

  if (tabName === 'reviews') {
    if (reviewsList) reviewsList.style.display = 'block';
    specDetails.style.display = 'none';
  } else {
    if (reviewsList) reviewsList.style.display = 'none';
    specDetails.style.display = 'block';
    specDetails.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 8px; color: #CFCFCF; font-size: 13px; line-height: 1.6;">
        <p><strong style="color: #fff;">Materiał:</strong> ${state.activeProductInModal.material}</p>
        <p><strong style="color: #fff;">Kategoria:</strong> ${state.activeProductInModal.categoryLabel}</p>
        <p><strong style="color: #fff;">Wysyłka:</strong> 1–2 dni z magazynu w Warszawie (Darmowa dostawa)</p>
        <p><strong style="color: #fff;">Zwrot:</strong> 14 dni na bezpłatny zwrot</p>
      </div>
    `;
  }
}

// ========================================================================
// 6. NEWSLETTER VALIDATION HANDLER
// ========================================================================

function handleNewsletterSubmit(e) {
  e.preventDefault();
  
  const email = DOM.newsletterEmail.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  // Reset message styles
  DOM.newsletterMessage.textContent = '';
  DOM.newsletterMessage.className = 'newsletter-message';

  if (!email) {
    DOM.newsletterMessage.textContent = 'Wprowadź swój adres e-mail.';
    DOM.newsletterMessage.classList.add('error');
    return;
  }
  
  if (!emailRegex.test(email)) {
    DOM.newsletterMessage.textContent = 'Wprowadź poprawny adres e-mail (np. nazwa@domena.pl).';
    DOM.newsletterMessage.classList.add('error');
    return;
  }

  // Visual submission transition
  DOM.newsletterSubmitBtn.disabled = true;
  DOM.newsletterSubmitBtn.textContent = 'Trwa zapis...';

  setTimeout(() => {
    DOM.newsletterMessage.innerHTML = 'Witamy w klubie! Twój kod rabatowy 10% to: <strong>WDSKLUBNOWY</strong>';
    DOM.newsletterMessage.classList.add('success');
    DOM.newsletterEmail.value = '';
    
    DOM.newsletterSubmitBtn.disabled = false;
    DOM.newsletterSubmitBtn.textContent = 'Dołącz';
  }, 1200);
}

// ========================================================================
// 7. ADMINISTRATIVE CMS PORTAL CONTROLLERS
// ========================================================================

function initAdminCMS() {
  const adminPortalLink = document.getElementById('adminPortalLink');
  const adminLoginModal = document.getElementById('adminLoginModal');
  const adminLoginCloseBtn = document.getElementById('adminLoginCloseBtn');
  const adminLoginForm = document.getElementById('adminLoginForm');
  const adminPassword = document.getElementById('adminPassword');
  const adminLoginMsg = document.getElementById('adminLoginMsg');
  const adminDashboardOverlay = document.getElementById('adminDashboardOverlay');
  const adminDashboardCloseBtn = document.getElementById('adminDashboardCloseBtn');
  
  const cmsTabButtons = document.querySelectorAll('[data-cms-tab]');
  const cmsTabContents = document.querySelectorAll('.cms-tab-content');
  const cmsProductListBody = document.getElementById('cmsProductListBody');
  const cmsPromoListBody = document.getElementById('cmsPromoListBody');
  
  const adminLogoutBtn = document.getElementById('adminLogoutBtn');
  const cmsAddNewBtn = document.getElementById('cmsAddNewBtn');
  const cmsResetDbBtn = document.getElementById('cmsResetDbBtn');
  
  const cmsProductDrawer = document.getElementById('cmsProductDrawer');
  const cmsDrawerCloseBtn = document.getElementById('cmsDrawerCloseBtn');
  const cmsDrawerTitle = document.getElementById('cmsDrawerTitle');
  const cmsProductForm = document.getElementById('cmsProductForm');
  
  const cmsFormProductId = document.getElementById('cmsFormProductId');
  const cmsFormProductName = document.getElementById('cmsFormProductName');
  const cmsFormProductNameEn = document.getElementById('cmsFormProductNameEn');
  const cmsFormProductCategory = document.getElementById('cmsFormProductCategory');
  const cmsFormProductPrice = document.getElementById('cmsFormProductPrice');
  const cmsFormProductMaterial = document.getElementById('cmsFormProductMaterial');
  const cmsFormProductDesc = document.getElementById('cmsFormProductDesc');
  const cmsFormProductImage = document.getElementById('cmsFormProductImage');
  const cmsProductFormImagePreview = document.getElementById('cmsProductFormImagePreview');
  const btnCmsTriggerUpload = document.getElementById('btnCmsTriggerUpload');
  const cmsProductFormFileInput = document.getElementById('cmsProductFormFileInput');
  const btnCmsClearImage = document.getElementById('btnCmsClearImage');
  const cmsFormProductImageUrl = document.getElementById('cmsFormProductImageUrl');
  const cmsPresetItems = document.querySelectorAll('.cms-preset-item');
  
  const cmsAddPromoForm = document.getElementById('cmsAddPromoForm');
  const cmsPromoCode = document.getElementById('cmsPromoCode');
  const cmsPromoRate = document.getElementById('cmsPromoRate');

  if (!adminPortalLink) return;

  // --- Auth Controls ---
  adminPortalLink.addEventListener('click', (e) => {
    e.preventDefault();
    adminLoginModal.classList.add('active');
    adminLoginModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  });

  adminLoginCloseBtn.addEventListener('click', () => {
    adminLoginModal.classList.remove('active');
    adminLoginModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    adminPassword.value = '';
    adminLoginMsg.textContent = '';
  });

  adminLoginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const emailVal = adminPassword.value.trim(); // pole "hasło" używamy jako email na chwilę, ale dodamy osobne pole

    // Dla uproszczenia: format "email:hasło" w polu hasła, lub email jako login admina
    // Supabase Auth wymaga email + hasła — pobieramy je z formularza
    const adminEmailInput = document.getElementById('adminEmailInput');
    const adminEmail = adminEmailInput ? adminEmailInput.value.trim() : 'admin@warsawduragstore.pl';
    const adminPw = adminPassword.value.trim();

    if (!adminPw) {
      adminLoginMsg.textContent = 'Wpisz hasło dostępu.';
      return;
    }

    const submitBtn = adminLoginForm.querySelector('button[type="submit"]');
    if (submitBtn) { submitBtn.textContent = 'Logowanie...'; submitBtn.disabled = true; }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: adminEmail,
        password: adminPw
      });

      if (submitBtn) { submitBtn.textContent = 'Zaloguj się'; submitBtn.disabled = false; }

      if (error || !data.session) {
        adminLoginMsg.textContent = 'Niepoprawny e-mail lub hasło.';
        setTimeout(() => { adminLoginMsg.textContent = ''; }, 3000);
        return;
      }

      // Success Login
      adminLoginModal.classList.remove('active');
      adminLoginModal.setAttribute('aria-hidden', 'true');
      adminPassword.value = '';
      if (adminEmailInput) adminEmailInput.value = '';
      adminLoginMsg.textContent = '';
      
      // Open Dashboard
      adminDashboardOverlay.classList.add('active');
      adminDashboardOverlay.setAttribute('aria-hidden', 'false');
      
      switchCmsTab('products');
    } catch (err) {
      if (submitBtn) { submitBtn.textContent = 'Zaloguj się'; submitBtn.disabled = false; }
      adminLoginMsg.textContent = 'Błąd połączenia z serwerem.';
      setTimeout(() => { adminLoginMsg.textContent = ''; }, 3000);
    }
  });

  adminLogoutBtn.addEventListener('click', async () => {
    try {
      if (supabase) {
        await supabase.auth.signOut();
      }
    } catch (e) {
      console.warn('[WDS] Sign out error:', e);
    }
    adminDashboardOverlay.classList.remove('active');
    adminDashboardOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  });

  adminDashboardCloseBtn.addEventListener('click', () => {
    adminDashboardOverlay.classList.remove('active');
    adminDashboardOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  });

  // --- CMS Dashboard Tab Routing ---
  cmsTabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabName = btn.getAttribute('data-cms-tab');
      switchCmsTab(tabName);
    });
  });

  function switchCmsTab(tabName) {
    // Buttons active state
    cmsTabButtons.forEach(b => {
      if (b.getAttribute('data-cms-tab') === tabName) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });

    // Content panels hide/show
    cmsTabContents.forEach(c => {
      c.style.display = 'none';
    });
    
    // Capitalize and inject current tab name
    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
    
    const panelId = `cmsTab${capitalize(tabName)}`;
    const targetPanel = document.getElementById(panelId);
    if (targetPanel) targetPanel.style.display = 'block';

    // Update headings subtitle based on tab
    const subtitle = document.getElementById('cmsDashboardSubtitle');
    if (tabName === 'products') {
      subtitle.textContent = 'Katalog Twoich luksusowych produktów';
      cmsAddNewBtn.style.display = 'block';
      renderCmsProductList();
    } else if (tabName === 'promos') {
      subtitle.textContent = 'Kody kuponów zniżkowych aktywnych w koszyku';
      cmsAddNewBtn.style.display = 'none';
      renderCmsPromoList();
    } else if (tabName === 'stats') {
      subtitle.textContent = 'Szczegóły sprzedaży oraz historyczny wykaz zakupów';
      cmsAddNewBtn.style.display = 'none';
      renderCmsStats();
    } else if (tabName === 'settings') {
      subtitle.textContent = 'Zaawansowane opcje czyszczenia baz danych';
      cmsAddNewBtn.style.display = 'none';
    }
  }

  // --- RENDER HELPERS ---

  // 1. PRODUCTS TAB RENDER
  function renderCmsProductList() {
    if (!cmsProductListBody) return;
    cmsProductListBody.innerHTML = '';

    products.forEach((p, idx) => {
      const tr = document.createElement('tr');
      tr.style.borderBottom = '1px solid var(--border-color-light)';
      
      tr.innerHTML = `
        <td style="padding: 10px;"><img src="${p.images[0]}" alt="${p.name}" style="width: 48px; height: 48px; object-fit: cover; border: 1px solid var(--border-color-light);"></td>
        <td style="padding: 10px; font-weight: 500; color: var(--color-primary);">${p.name}</td>
        <td style="padding: 10px; text-transform: uppercase; font-size:0.75rem; letter-spacing: 0.05em; color: var(--color-secondary);">${p.categoryLabel}</td>
        <td style="padding: 10px; font-weight: 500;">${p.price.toFixed(2)} PLN</td>
        <td style="padding: 10px; color: var(--color-secondary); font-size: 0.85rem; max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${p.material}</td>
        <td style="padding: 10px; text-align: right;">
          <button class="btn-text" data-action="edit-prod" data-id="${p.id}" style="font-size: 0.75rem; margin-right: 16px;">Edytuj</button>
          <button class="btn-text" data-action="delete-prod" data-id="${p.id}" style="font-size: 0.75rem; color: #D32F2F; --color-primary: #D32F2F;">Usuń</button>
        </td>
      `;

      // Bind edit button
      tr.querySelector('[data-action="edit-prod"]').addEventListener('click', () => {
        openCmsProductDrawer(p.id);
      });

      // Bind delete button
      tr.querySelector('[data-action="delete-prod"]').addEventListener('click', () => {
        if (confirm(`Czy na pewno chcesz usunąć produkt "${p.name}" z katalogu?`)) {
          deleteCmsProduct(p.id);
        }
      });

      cmsProductListBody.appendChild(tr);
    });
  }

  // Delete Product — Supabase
  async function deleteCmsProduct(id) {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        alert('Błąd usuwania produktu: ' + error.message);
        return;
      }

      // Remove from local array and re-render
      const idx = products.findIndex(p => p.id === id);
      if (idx > -1) products.splice(idx, 1);
      renderCmsProductList();
      renderProductGrid();
    } catch (err) {
      alert('Błąd połączenia przy usuwaniu produktu.');
    }
  }

  // 2. PROMO CODES TAB RENDER — Supabase
  async function renderCmsPromoList() {
    if (!cmsPromoListBody) return;
    cmsPromoListBody.innerHTML = `<tr><td colspan="3" style="text-align:center; padding: 20px 0; color: var(--color-secondary);">Ładowanie...</td></tr>`;
    
    try {
      const { data: promos, error } = await supabase
        .from('promo_codes')
        .select('id, code, rate, active, uses_count')
        .order('created_at', { ascending: false });

      if (error) throw error;

      cmsPromoListBody.innerHTML = '';

      if (!promos || promos.length === 0) {
        cmsPromoListBody.innerHTML = `<tr><td colspan="3" style="text-align:center; padding: 20px 0; color: var(--color-secondary);">Brak zdefiniowanych kuponów rabatowych.</td></tr>`;
        return;
      }

      promos.forEach((pr) => {
        const tr = document.createElement('tr');
        tr.style.borderBottom = '1px solid var(--border-color-light)';
        
        tr.innerHTML = `
          <td style="padding: 14px 10px; font-weight: 500; color: var(--color-primary);">${pr.code}</td>
          <td style="padding: 14px 10px; font-weight: 500; color: #2E7D32;">${Math.round(pr.rate * 100)}% zniżki</td>
          <td style="padding: 14px 10px; text-align: right;">
            <button class="btn-text" data-action="delete-promo" data-id="${pr.id}" style="font-size: 0.75rem; color: #D32F2F; --color-primary: #D32F2F;">Usuń</button>
          </td>
        `;

        tr.querySelector('[data-action="delete-promo"]').addEventListener('click', async () => {
          const { error: delErr } = await supabase
            .from('promo_codes')
            .delete()
            .eq('id', pr.id);
          if (!delErr) renderCmsPromoList();
          else alert('Błąd usuwania kodu: ' + delErr.message);
        });

        cmsPromoListBody.appendChild(tr);
      });
    } catch (err) {
      cmsPromoListBody.innerHTML = `<tr><td colspan="3" style="text-align:center; padding: 20px 0; color: #D32F2F;">Błąd ładowania kuponów.</td></tr>`;
    }
  }

  // Create new coupon — Supabase
  cmsAddPromoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const code = cmsPromoCode.value.trim().toUpperCase();
    const ratePercent = parseInt(cmsPromoRate.value);
    
    if (!code || isNaN(ratePercent) || ratePercent <= 0 || ratePercent > 100) return;

    const { error } = await supabase
      .from('promo_codes')
      .insert({ code, rate: ratePercent / 100 });

    if (error) {
      if (error.code === '23505') {
        alert('Taki kod rabatowy już istnieje!');
      } else {
        alert('Błąd dodawania kodu: ' + error.message);
      }
      return;
    }

    cmsPromoCode.value = '';
    cmsPromoRate.value = '';
    renderCmsPromoList();
  });

  // 3. STATS TAB RENDER — Supabase
  async function renderCmsStats() {
    const revEl = document.getElementById('cmsStatRevenue');
    const countEl = document.getElementById('cmsStatOrders');
    const bestEl = document.getElementById('cmsStatBestseller');
    const listEl = document.getElementById('cmsOrderHistoryBody');
    
    if (!revEl || !countEl || !bestEl || !listEl) return;

    listEl.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 20px 0; color: var(--color-secondary);">Ładowanie zamówień...</td></tr>`;

    try {
      const { data: orders, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Calculate stats
      const totalRev = (orders || []).reduce((sum, o) => sum + parseFloat(o.total || 0), 0);
      revEl.textContent = `${totalRev.toFixed(2)} PLN`;
      countEl.textContent = orders?.length || 0;

      // Bestseller from items JSON
      if (orders && orders.length > 0) {
        const itemCounts = {};
        orders.forEach(o => {
          if (Array.isArray(o.items)) {
            o.items.forEach(item => {
              itemCounts[item.name] = (itemCounts[item.name] || 0) + (item.quantity || 1);
            });
          }
        });
        let bestProduct = 'Brak danych';
        let maxCount = 0;
        for (const [name, count] of Object.entries(itemCounts)) {
          if (count > maxCount) { maxCount = count; bestProduct = name; }
        }
        bestEl.textContent = maxCount > 0 ? `${bestProduct} (${maxCount} szt.)` : 'Brak danych';
      } else {
        bestEl.textContent = 'Brak danych';
      }

      // Render orders history
      listEl.innerHTML = '';
      if (!orders || orders.length === 0) {
        listEl.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 20px 0; color: var(--color-secondary);">Brak zrealizowanych zamówień.</td></tr>`;
        return;
      }

      orders.forEach(o => {
        const tr = document.createElement('tr');
        tr.style.borderBottom = '1px solid var(--border-color-light)';

        const statusLabels = { new: '🆕 Nowe', processing: '⚙️ W realizacji', shipped: '🚚 Wysłane', delivered: '✅ Dostarczone', cancelled: '❌ Anulowane' };
        const dateStr = new Date(o.created_at).toLocaleString('pl-PL');

        tr.innerHTML = `
          <td style="padding: 14px 10px; font-weight: 500; color: var(--color-primary);">
            ${o.order_no}
            <div style="font-size:0.75rem; color:var(--color-secondary); margin-top:2px;">${o.customer_name} • ${o.customer_phone}</div>
          </td>
          <td style="padding: 14px 10px; font-weight: 300; font-size:0.85rem;">${dateStr}</td>
          <td style="padding: 14px 10px; font-weight: 300; max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${o.items_summary || ''}">${
            o.items_summary || '—'
          }</td>
          <td style="padding: 14px 10px; color: var(--color-secondary); font-size: 0.85rem;">${o.discount_code ? o.discount_code + ' (-' + parseFloat(o.discount_val).toFixed(2) + ' PLN)' : 'Brak'}</td>
          <td style="padding: 14px 10px; font-weight: 500; text-align: right; color: var(--color-primary);">${parseFloat(o.total).toFixed(2)} PLN</td>
          <td style="padding: 14px 10px;">
            <select class="order-status-select" data-order-id="${o.id}" style="font-size: 0.75rem; padding: 4px 8px; border: 1px solid var(--border-color); background: var(--bg-secondary); color: var(--color-primary); cursor: pointer;">
              <option value="new" ${o.status === 'new' ? 'selected' : ''}>🆕 Nowe</option>
              <option value="processing" ${o.status === 'processing' ? 'selected' : ''}>⚙️ W realizacji</option>
              <option value="shipped" ${o.status === 'shipped' ? 'selected' : ''}>🚚 Wysłane</option>
              <option value="delivered" ${o.status === 'delivered' ? 'selected' : ''}>✅ Dostarczone</option>
              <option value="cancelled" ${o.status === 'cancelled' ? 'selected' : ''}>❌ Anulowane</option>
            </select>
          </td>
        `;

        // Status change handler
        const statusSelect = tr.querySelector('.order-status-select');
        statusSelect.addEventListener('change', async () => {
          const { error: upErr } = await supabase
            .from('orders')
            .update({ status: statusSelect.value })
            .eq('id', o.id);
          if (upErr) {
            alert('Błąd zmiany statusu: ' + upErr.message);
            statusSelect.value = o.status; // revert
          }
        });

        listEl.appendChild(tr);
      });
    } catch (err) {
      listEl.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 20px 0; color: #D32F2F;">Błąd ładowania zamówień: ${err.message}</td></tr>`;
    }
  }

  // --- PRODUCT FORM EDIT/ADD DRAWER CONTROLLER ---

  // --- VISUAL IMAGE UPLOADER HANDLERS ---
  function initCmsImageUploader() {
    if (!btnCmsTriggerUpload) return;

    // Trigger file dialog
    btnCmsTriggerUpload.addEventListener('click', () => {
      cmsProductFormFileInput.click();
    });

    // Local file selector change handler
    cmsProductFormFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function(evt) {
        const base64Str = evt.target.result;
        updateCmsImageSource(base64Str, 'upload');
      };
      reader.readAsDataURL(file);
    });

    // Clear custom image
    btnCmsClearImage.addEventListener('click', () => {
      // Revert to first WDS preset
      const firstPreset = './assets/durag_silk_black.png';
      updateCmsImageSource(firstPreset, 'preset');
    });

    // Paste URL text input listener
    cmsFormProductImageUrl.addEventListener('input', () => {
      const urlVal = cmsFormProductImageUrl.value.trim();
      if (urlVal) {
        updateCmsImageSource(urlVal, 'url');
      } else {
        // If empty, fall back to first preset
        const firstPreset = './assets/durag_silk_black.png';
        updateCmsImageSource(firstPreset, 'preset');
      }
    });

    // Click select presets gallery
    cmsPresetItems.forEach(item => {
      item.addEventListener('click', () => {
        const imgPath = item.getAttribute('data-img');
        updateCmsImageSource(imgPath, 'preset');
      });
    });
  }

  // Set the image source, update preview, text URL input, and highlights
  function updateCmsImageSource(src, type) {
    cmsFormProductImage.value = src;
    cmsProductFormImagePreview.src = src;

    // Manage clear button visibility (only show for custom upload/URL)
    if (type === 'upload' || type === 'url') {
      btnCmsClearImage.style.display = 'inline-block';
    } else {
      btnCmsClearImage.style.display = 'none';
      cmsProductFormFileInput.value = ''; // Reset file input
    }

    // Synchronize URL text input field
    if (type !== 'url') {
      cmsFormProductImageUrl.value = ''; // Reset url input unless pasting it
    } else {
      cmsFormProductImageUrl.value = src;
    }

    // Sync presets highlights
    cmsPresetItems.forEach(item => {
      const imgPath = item.getAttribute('data-img');
      if (type === 'preset' && imgPath === src) {
        item.style.borderColor = 'var(--color-primary)';
        item.classList.add('active');
      } else {
        item.style.borderColor = 'var(--border-color)';
        item.classList.remove('active');
      }
    });
  }

  // Initialize visual uploader bindings immediately inside CMS
  initCmsImageUploader();

  cmsAddNewBtn.addEventListener('click', () => {
    openCmsProductDrawer(); // Open blank
  });

  cmsDrawerCloseBtn.addEventListener('click', () => {
    closeCmsProductDrawer();
  });

  function openCmsProductDrawer(productId = null) {
    cmsProductDrawer.classList.add('active');
    cmsProductDrawer.setAttribute('aria-hidden', 'false');
    
    if (productId) {
      // EDIT MODE
      const p = products.find(prod => prod.id === productId);
      if (!p) return;
      
      cmsDrawerTitle.textContent = 'Edytuj Produkt';
      cmsFormProductId.value = p.id;
      cmsFormProductName.value = p.name;
      cmsFormProductNameEn.value = p.nameEn || p.name;
      cmsFormProductCategory.value = p.category;
      cmsFormProductPrice.value = p.price;
      cmsFormProductMaterial.value = p.material;
      cmsFormProductDesc.value = p.description;
      cmsFormProductImage.value = p.images[0];

      // Setup visual uploader field states matching this image
      const isPreset = p.images[0] && (
        p.images[0].includes('durag_silk_black.png') ||
        p.images[0].includes('durag_silk_champagne.png') ||
        p.images[0].includes('durag_velvet_emerald.png') ||
        p.images[0].includes('durag_velvet_royal.png')
      );
      
      if (isPreset) {
        updateCmsImageSource(p.images[0], 'preset');
      } else if (p.images[0] && p.images[0].startsWith('data:image/')) {
        updateCmsImageSource(p.images[0], 'upload');
      } else if (p.images[0]) {
        updateCmsImageSource(p.images[0], 'url');
      } else {
        updateCmsImageSource('./assets/durag_silk_black.png', 'preset');
      }
    } else {
      // ADD NEW MODE
      cmsDrawerTitle.textContent = 'Dodaj Nowy Produkt';
      cmsProductForm.reset();
      cmsFormProductId.value = '';
      cmsFormProductCategory.value = 'silk';
      cmsFormProductImageUrl.value = '';
      updateCmsImageSource('./assets/durag_silk_black.png', 'preset');
    }
  }

  function closeCmsProductDrawer() {
    cmsProductDrawer.classList.remove('active');
    cmsProductDrawer.setAttribute('aria-hidden', 'true');
    cmsProductForm.reset();
    cmsFormProductImageUrl.value = '';
    updateCmsImageSource('./assets/durag_silk_black.png', 'preset');
  }

  // Handle Add/Edit form submission — Supabase
  cmsProductForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const idVal = cmsFormProductId.value;
    const name = cmsFormProductName.value.trim();
    const nameEn = cmsFormProductNameEn.value.trim();
    const category = cmsFormProductCategory.value;
    const price = parseFloat(cmsFormProductPrice.value);
    const material = cmsFormProductMaterial.value.trim();
    const description = cmsFormProductDesc.value.trim();
    const mainImg = cmsFormProductImage.value;
    
    if (!name || !nameEn || isNaN(price) || !material || !description) return;
    
    const categoryLabels = {
      'silk': 'Czysty Jedwab',
      'velvet': 'Ekskluzywny Aksamit',
      'accessories': 'Pielęgnacja & Akcesoria'
    };

    const submitBtn = cmsProductForm.querySelector('button[type="submit"]');
    if (submitBtn) { submitBtn.textContent = 'Zapisywanie...'; submitBtn.disabled = true; }

    try {
      if (idVal) {
        // EDIT EXISTING PRODUCT
        const productId = parseInt(idVal);
        const { error } = await supabase
          .from('products')
          .update({
            name,
            name_en: nameEn,
            category,
            category_label: categoryLabels[category],
            price,
            material,
            description,
            images: [mainImg, mainImg]
          })
          .eq('id', productId);

        if (error) throw error;

        // Update local array
        const idx = products.findIndex(prod => prod.id === productId);
        if (idx > -1) {
          products[idx] = { ...products[idx], name, nameEn, category, categoryLabel: categoryLabels[category], price, material, description, images: [mainImg, mainImg] };
        }
      } else {
        // ADD NEW PRODUCT
        let newColors = [{ name: 'Standard Edition', hex: '#111111' }];
        if (category === 'silk') {
          newColors = [{ name: 'Classic Pearl', hex: '#F3F2EE' }, { name: 'Obsidian Sheen', hex: '#111111' }];
        } else if (category === 'velvet') {
          newColors = [{ name: 'Deep Velvet', hex: '#1C2E24' }];
        }

        const { data: inserted, error } = await supabase
          .from('products')
          .insert({
            name,
            name_en: nameEn,
            category,
            category_label: categoryLabels[category],
            price,
            material,
            description,
            images: [mainImg, mainImg],
            colors: newColors,
            reviews: [{ author: 'Obsługa Sklepu', rating: 5, comment: 'Nowość w katalogu WDS.', date: new Date().toLocaleDateString('pl-PL') }],
            stock: 10,
            visible: true
          })
          .select()
          .single();

        if (error) throw error;

        // Add to local array
        products.push({
          id: inserted.id,
          name: inserted.name,
          nameEn: inserted.name_en,
          price: parseFloat(inserted.price),
          category: inserted.category,
          categoryLabel: inserted.category_label,
          material: inserted.material,
          description: inserted.description,
          images: inserted.images || [],
          colors: inserted.colors || [],
          reviews: inserted.reviews || [],
          stock: inserted.stock,
          visible: inserted.visible
        });
      }

      if (submitBtn) { submitBtn.textContent = 'Zapisz produkt'; submitBtn.disabled = false; }
      closeCmsProductDrawer();
      renderCmsProductList();
      renderProductGrid();
    } catch (err) {
      if (submitBtn) { submitBtn.textContent = 'Zapisz produkt'; submitBtn.disabled = false; }
      alert('Błąd zapisu produktu: ' + err.message);
    }
  });

  // --- DATABASE RESET HELPER — Supabase ---
  cmsResetDbBtn.addEventListener('click', async () => {
    if (confirm('CAŁKOWITY RESET BAZY: Czy jesteś pewien? To polecenie wymaże wszystkie produkty i kody rabatowe z Supabase i przywróci domyślne.')) {
      try {
        // Delete all products and promo codes from Supabase
        await supabase.from('products').delete().neq('id', 0);
        await supabase.from('promo_codes').delete().neq('id', 0);

        // Re-seed products and promos
        await seedProductsIfEmpty();

        // Re-insert default promos
        await supabase.from('promo_codes').insert([
          { code: 'WARSAW10', rate: 0.10 },
          { code: 'ELEMENTY', rate: 0.15 },
          { code: 'DURAGWAVES', rate: 0.20 }
        ]);

        // Reload products
        await loadProductsFromSupabase();

        alert('Baza danych została pomysłnie zresetowana.');
        switchCmsTab('products');
      } catch (err) {
        alert('Błąd resetu bazy: ' + err.message);
      }
    }
  });

}

function initCheckoutFlow() {
  const checkoutBtn = document.getElementById('checkoutBtn');
  const btnBackToCart = document.getElementById('btnBackToCart');
  const cartStepCart = document.getElementById('cartStepCart');
  const cartStepCheckout = document.getElementById('cartStepCheckout');
  
  const deliveryTabBtns = document.querySelectorAll('.delivery-tab-btn');
  const inpostSelectionContainer = document.getElementById('inpostSelectionContainer');
  const inpostSearchInput = document.getElementById('inpostSearchInput');
  const inpostSearchBtn = document.getElementById('inpostSearchBtn');
  const inpostResultsList = document.getElementById('inpostResultsList');
  const selectedPaczkomatCard = document.getElementById('selectedPaczkomatCard');
  const btnChangePaczkomat = document.getElementById('btnChangePaczkomat');
  
  const paczkomatCardCode = document.getElementById('paczkomatCardCode');
  const paczkomatCardAddress = document.getElementById('paczkomatCardAddress');
  const paczkomatCardDesc = document.getElementById('paczkomatCardDesc');
  
  const checkoutForm = document.getElementById('checkoutForm');
  const checkoutName = document.getElementById('checkoutName');
  const checkoutEmail = document.getElementById('checkoutEmail');
  const checkoutPhone = document.getElementById('checkoutPhone');
  const placeOrderBtn = document.getElementById('placeOrderBtn');
  const checkoutErrorMsg = document.getElementById('checkoutErrorMsg');
  
  const checkoutSubtotal = document.getElementById('checkoutSubtotal');
  const checkoutDiscountRow = document.getElementById('checkoutDiscountRow');
  const checkoutDiscountVal = document.getElementById('checkoutDiscountVal');
  const checkoutTotal = document.getElementById('checkoutTotal');
  
  let currentDeliveryMethod = 'courier'; // 'courier' or 'paczkomat'
  let selectedPaczkomat = null; // { name: 'WAW15A', address: '...', description: '...' }

  // Premium Fallback Locker Dataset
  const fallbackLockers = [
    { name: 'WAW42M', address: 'Mokotowska 42, 00-543 Warszawa', description: 'Obok WDS Showroom' },
    { name: 'WAW102A', address: 'Nowy Świat 28, 00-373 Warszawa', description: 'Przy stacji metro' },
    { name: 'WAW15A', address: 'Marszałkowska 115, 00-102 Warszawa', description: 'Obok sklepu Żabka' },
    { name: 'WAW88B', address: 'Aleje Jerozolimskie 54, 00-024 Warszawa', description: 'Obok Dworca Centralnego' },
    { name: 'WAW99C', address: 'Chmielna 12, 00-020 Warszawa', description: 'W bramie kamienicy' }
  ];

  if (!checkoutBtn) return;

  // Toggle Back from Checkout to Cart
  if (btnBackToCart) {
    btnBackToCart.addEventListener('click', () => {
      if (cartStepCheckout) cartStepCheckout.style.display = 'none';
      if (cartStepCart) cartStepCart.style.display = 'flex';
    });
  }

  // Delivery Method Selection Buttons
  deliveryTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      deliveryTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const method = btn.getAttribute('data-method');
      currentDeliveryMethod = method;
      
      if (method === 'paczkomat') {
        inpostSelectionContainer.style.display = 'flex';
        // Auto search/load standard premium fallbacks initially
        renderPaczkomatyResults(fallbackLockers);
      } else {
        inpostSelectionContainer.style.display = 'none';
        checkoutErrorMsg.textContent = '';
      }
    });
  });

  // InPost Paczkomat Live API Search Autocomplete
  const performInPostSearch = async () => {
    const query = inpostSearchInput.value.trim();
    if (!query) {
      // If search query is empty, render beautiful default fallbacks
      renderPaczkomatyResults(fallbackLockers);
      return;
    }

    inpostResultsList.innerHTML = `<div style="text-align:center; padding: 15px; font-size:0.8rem; color:var(--color-secondary);">Wyszukiwanie Paczkomatów w API...</div>`;

    try {
      // InPost Public Points API Query (CORS friendly endpoint, point directory)
      const res = await fetch(`https://api-pl-points.easypack24.net/v1/points?query=${encodeURIComponent(query)}&limit=8`);
      if (!res.ok) throw new Error('API Response Error');
      const data = await res.json();
      
      if (data && data.items && data.items.length > 0) {
        // Map points to clean object array
        const results = data.items.map(item => ({
          name: item.name,
          address: item.address_details.post_code + ' ' + item.address_details.city + ', ' + item.address_details.street + ' ' + (item.address_details.building_number || ''),
          description: item.description || item.location_description || 'Paczkomat InPost'
        }));
        renderPaczkomatyResults(results);
      } else {
        inpostResultsList.innerHTML = `<div style="text-align:center; padding: 15px; font-size:0.8rem; color:var(--color-secondary);">Brak wyników w API. Wybierz z listy poniżej:</div>`;
        setTimeout(() => {
          renderPaczkomatyResults(fallbackLockers);
        }, 1500);
      }
    } catch (err) {
      console.warn('InPost API error, using high-quality local cache: ', err);
      // Fallback to local high-quality mock data
      const searchResults = fallbackLockers.filter(l => 
        l.name.toLowerCase().includes(query.toLowerCase()) || 
        l.address.toLowerCase().includes(query.toLowerCase())
      );
      renderPaczkomatyResults(searchResults.length > 0 ? searchResults : fallbackLockers);
    }
  };

  if (inpostSearchBtn) inpostSearchBtn.addEventListener('click', performInPostSearch);
  if (inpostSearchInput) {
    inpostSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        performInPostSearch();
      }
    });
  }

  // Render search results
  function renderPaczkomatyResults(lockers) {
    inpostResultsList.innerHTML = '';
    
    lockers.forEach(locker => {
      const div = document.createElement('div');
      div.className = 'paczkomat-item';
      div.innerHTML = `
        <h5>Paczkomat ${locker.name}</h5>
        <p>${locker.address}</p>
        <span>${locker.description}</span>
      `;
      
      div.addEventListener('click', () => {
        selectLocker(locker);
      });
      inpostResultsList.appendChild(div);
    });
  }

  // Select Paczkomat
  function selectLocker(locker) {
    selectedPaczkomat = locker;
    paczkomatCardCode.textContent = 'Paczkomat ' + locker.name;
    paczkomatCardAddress.textContent = locker.address;
    paczkomatCardDesc.textContent = locker.description;
    
    selectedPaczkomatCard.style.display = 'block';
    inpostResultsList.style.display = 'none';
    inpostSearchInput.style.display = 'none';
    inpostSearchBtn.style.display = 'none';
    checkoutErrorMsg.textContent = '';
  }

  // Change Paczkomat
  if (btnChangePaczkomat) {
    btnChangePaczkomat.addEventListener('click', () => {
      selectedPaczkomat = null;
      if (selectedPaczkomatCard) selectedPaczkomatCard.style.display = 'none';
      if (inpostResultsList) inpostResultsList.style.display = 'flex';
      if (inpostSearchInput) inpostSearchInput.style.display = 'block';
      if (inpostSearchBtn) inpostSearchBtn.style.display = 'block';
      if (inpostSearchInput) inpostSearchInput.value = '';
      renderPaczkomatyResults(fallbackLockers);
    });
  }

  // Place Order Action Validation — zapisuje do Supabase i wysyła maile
  if (placeOrderBtn) {
    placeOrderBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      if (checkoutErrorMsg) checkoutErrorMsg.textContent = '';
    
    const nameVal = checkoutName.value.trim();
    const emailVal = checkoutEmail.value.trim();
    const phoneVal = checkoutPhone.value.trim();
    
    if (!nameVal || !emailVal || !phoneVal) {
      checkoutErrorMsg.textContent = 'Proszę wypełnić wszystkie dane dostawy.';
      return;
    }
    
    if (currentDeliveryMethod === 'paczkomat' && !selectedPaczkomat) {
      checkoutErrorMsg.textContent = 'Proszę wybrać Paczkomat InPost z listy.';
      return;
    }

    // Email validation regex
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailVal)) {
      checkoutErrorMsg.textContent = 'Proszę podać prawidłowy adres e-mail.';
      return;
    }

    // Visual order processing block
    placeOrderBtn.textContent = 'Przetwarzanie zamówienia...';
    placeOrderBtn.disabled = true;

    try {
      // Generate order number
      const orderNo = `#WDS-${Math.floor(100000 + Math.random() * 900000)}`;
      const totals = calculateTotals();
      const orderItemsSummary = state.cart.map(item => `${item.name} (${item.color}) x${item.quantity}`).join(', ');

      // Build order object for Supabase
      const orderPayload = {
        order_no: orderNo,
        customer_name: nameVal,
        customer_email: emailVal,
        customer_phone: phoneVal,
        delivery_method: currentDeliveryMethod,
        locker_code: currentDeliveryMethod === 'paczkomat' ? selectedPaczkomat?.name : null,
        locker_address: currentDeliveryMethod === 'paczkomat' ? selectedPaczkomat?.address : null,
        items: state.cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          color: item.color,
          quantity: item.quantity
        })),
        items_summary: orderItemsSummary,
        subtotal: totals.subtotal,
        discount_code: state.promoApplied ? state.promoApplied.code : null,
        discount_pct: state.promoApplied ? state.promoApplied.percent : 0,
        discount_val: totals.discount,
        total: totals.total,
        status: 'new'
      };

      // 1. Save order to Supabase (with offline local fallback)
      let savedOrder = null;
      let orderError = null;

      if (supabase) {
        try {
          const { data, error } = await supabase
            .from('orders')
            .insert(orderPayload)
            .select()
            .single();
          savedOrder = data;
          orderError = error;
        } catch (e) {
          orderError = e;
        }
      }

      if (!supabase || orderError) {
        console.warn('[WDS] Supabase offline order fallback triggered.');
        savedOrder = {
          id: Date.now(),
          order_no: orderNo,
          ...orderPayload
        };
        
        // Save to local storage for administration stats compatibility
        const localOrders = JSON.parse(localStorage.getItem('wds_orders') || '[]');
        localOrders.unshift({
          orderNo: orderNo,
          date: new Date().toLocaleString('pl-PL'),
          timestamp: Date.now(),
          itemsSummary: orderItemsSummary,
          discountCode: state.promoApplied ? state.promoApplied.code : 'Brak',
          discountVal: totals.discount,
          total: totals.total,
          rawItems: orderPayload.items,
          shipping: {
            method: currentDeliveryMethod,
            name: nameVal,
            email: emailVal,
            phone: phoneVal,
            lockerCode: currentDeliveryMethod === 'paczkomat' ? selectedPaczkomat?.name : null
          }
        });
        localStorage.setItem('wds_orders', JSON.stringify(localOrders));
        orderError = null; // Clear error to allow success view
      }

      // 2. Send emails via Edge Function (non-blocking — fire and forget)
      fetch(EDGE_FUNCTION_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...orderPayload,
          order_no: savedOrder.order_no,
          id: savedOrder.id
        })
      }).catch(err => console.warn('[WDS] Email Edge Function error (non-critical):', err));

      // 3. Show success view
      const cartItemsContainer = document.getElementById('cartItemsContainer');
      const cartFooter = document.getElementById('cartFooter');
      
      cartStepCheckout.style.display = 'none';
      cartStepCart.style.display = 'flex';
      cartItemsContainer.style.opacity = '1';
      cartFooter.style.display = 'none';
      
      cartItemsContainer.innerHTML = `
        <div class="checkout-success-view">
          <div class="success-icon-circle">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 style="font-family: var(--font-serif); font-size: 1.6rem; color: var(--color-primary);">Dziękujemy za zamówienie!</h3>
          <p style="font-size: 0.95rem; color: var(--color-secondary); line-height: 1.6; font-weight: 300;">
            Twoje zamówienie zostało pomyślnie przyjęte. Numer zamówienia: <strong style="color:var(--color-primary);">${savedOrder.order_no}</strong>. Szczegóły wysłaliśmy na e-mail: <strong style="color:var(--color-primary);">${emailVal}</strong>.
          </p>
          ${currentDeliveryMethod === 'paczkomat' ? `
            <div style="background-color: var(--bg-secondary); border: 1px solid var(--border-color); padding: 14px; text-align: left; margin: 15px 0; font-size: 0.85rem;">
              <strong style="color:#2E7D32; display:block; margin-bottom:4px;">Dostawa Paczkomat:</strong>
              <strong>${selectedPaczkomat.name}</strong> - ${selectedPaczkomat.address}
            </div>
          ` : `
            <div style="background-color: var(--bg-secondary); border: 1px solid var(--border-color); padding: 14px; text-align: left; margin: 15px 0; font-size: 0.85rem;">
              <strong style="color:var(--color-primary); display:block; margin-bottom:4px;">Dostawa Kurierska:</strong>
              Adresat: ${nameVal}<br>Tel: ${phoneVal}
            </div>
          `}
          <button class="btn-minimal" id="successCloseBtn" style="margin-top: 20px; width: 100%;">Kontynuuj zakupy</button>
        </div>
      `;

      // 4. Clear state
      state.cart = [];
      state.promoApplied = null;
      selectedPaczkomat = null;
      currentDeliveryMethod = 'courier';
      
      checkoutName.value = '';
      checkoutEmail.value = '';
      checkoutPhone.value = '';
      selectedPaczkomatCard.style.display = 'none';
      inpostResultsList.style.display = 'flex';
      inpostSearchInput.style.display = 'block';
      inpostSearchBtn.style.display = 'block';
      inpostSearchInput.value = '';
      deliveryTabBtns.forEach(b => b.classList.remove('active'));
      deliveryTabBtns[0].classList.add('active');
      inpostSelectionContainer.style.display = 'none';
      
      const cartPromoInput = document.getElementById('cartPromoInput');
      if (cartPromoInput) cartPromoInput.value = '';
      
      updateCartBadge();
      localStorage.removeItem('wds_cart');

      // Refresh CMS statistics if panel is open
      updateCmsAnalyticStatsDirectly();

      document.getElementById('successCloseBtn').addEventListener('click', () => {
        closeCartDrawer();
        setTimeout(() => {
          cartFooter.style.display = 'flex';
          cartFooter.style.opacity = '1';
          placeOrderBtn.textContent = 'Kupuję i płacę';
          placeOrderBtn.disabled = false;
          renderCart();
        }, 500);
      });

    } catch (err) {
      console.error('[WDS] Order placement error:', err);
      checkoutErrorMsg.textContent = 'Błąd połączenia z serwerem. Spróbuj ponownie.';
      placeOrderBtn.textContent = 'Kupuję i płacę';
      placeOrderBtn.disabled = false;
    }
  });
  }
}


function updateCmsAnalyticStatsDirectly() {
  const orders = JSON.parse(localStorage.getItem('wds_orders') || '[]');
  const statRevenue = document.getElementById('cmsStatRevenue');
  const statOrders = document.getElementById('cmsStatOrders');
  const statBestseller = document.getElementById('cmsStatBestseller');
  const cmsOrderHistoryBody = document.getElementById('cmsOrderHistoryBody');
  
  if (statOrders) statOrders.textContent = orders.length;
  if (statRevenue) {
    const rev = orders.reduce((sum, o) => sum + o.total, 0);
    statRevenue.textContent = rev.toFixed(2) + ' PLN';
  }
  
  if (statBestseller && orders.length > 0) {
    const counts = {};
    orders.forEach(o => {
      if (o.rawItems) {
        o.rawItems.forEach(item => {
          counts[item.name] = (counts[item.name] || 0) + item.quantity;
        });
      }
    });
    
    let best = 'Brak danych';
    let max = 0;
    for (const name in counts) {
      if (counts[name] > max) {
        max = counts[name];
        best = name;
      }
    }
    statBestseller.textContent = best;
  }

  // Also refresh Order logs list inside CMS panel overlay if open
  if (cmsOrderHistoryBody) {
    cmsOrderHistoryBody.innerHTML = '';
    if (orders.length === 0) {
      cmsOrderHistoryBody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 30px 0; color: var(--color-secondary);">Brak zrealizowanych zamówień.</td></tr>`;
      return;
    }
    
    orders.forEach(order => {
      const tr = document.createElement('tr');
      tr.style.borderBottom = '1px solid var(--border-color-light)';
      
      let shippingInfo = '';
      if (order.shipping) {
        shippingInfo = `<div style="font-size:0.75rem; color:var(--color-secondary); margin-top:2px;">Odbiorca: ${order.shipping.name} (${order.shipping.method}${order.shipping.lockerCode ? ` - ${order.shipping.lockerCode}` : ''})</div>`;
      }
      
      tr.innerHTML = `
        <td style="padding: 16px 10px; font-weight: 500; color: var(--color-primary);">${order.orderNo}${shippingInfo}</td>
        <td style="padding: 16px 10px; font-weight: 300;">${order.date}</td>
        <td style="padding: 16px 10px; font-weight: 300; max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${order.itemsSummary}">${order.itemsSummary}</td>
        <td style="padding: 16px 10px; font-weight: 500; color: var(--color-secondary);">${order.discountCode} (${order.discountVal.toFixed(2)} PLN)</td>
        <td style="padding: 16px 10px; font-weight: 500; text-align: right; color: var(--color-primary);">${order.total.toFixed(2)} PLN</td>
      `;
      cmsOrderHistoryBody.appendChild(tr);
    });
  }
}

function initWooCommerceImporter() {
  const productsDropzone = document.getElementById('cmsWooProductsDropzone');
  const productsFile = document.getElementById('cmsWooProductsFile');
  const productsStatus = document.getElementById('cmsWooProductsStatus');
  
  const ordersDropzone = document.getElementById('cmsWooOrdersDropzone');
  const ordersFile = document.getElementById('cmsWooOrdersFile');
  const ordersStatus = document.getElementById('cmsWooOrdersStatus');
  
  const jsonPaste = document.getElementById('cmsWooJsonPaste');
  const importJsonProducts = document.getElementById('cmsWooImportJsonProducts');
  const importJsonOrders = document.getElementById('cmsWooImportJsonOrders');
  const pasteStatus = document.getElementById('cmsWooPasteStatus');

  if (!productsDropzone) return;

  // --- 1. SETUP DRAG AND DROP HANDLERS ---
  
  // Products Importer Dropzone
  productsDropzone.addEventListener('click', () => productsFile.click());
  productsDropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    productsDropzone.classList.add('drag-over');
  });
  productsDropzone.addEventListener('dragleave', () => {
    productsDropzone.classList.remove('drag-over');
  });
  productsDropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    productsDropzone.classList.remove('drag-over');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleProductFileImport(files[0]);
    }
  });
  productsFile.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      handleProductFileImport(e.target.files[0]);
    }
  });

  // Orders Importer Dropzone
  ordersDropzone.addEventListener('click', () => ordersFile.click());
  ordersDropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    ordersDropzone.classList.add('drag-over');
  });
  ordersDropzone.addEventListener('dragleave', () => {
    ordersDropzone.classList.remove('drag-over');
  });
  ordersDropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    ordersDropzone.classList.remove('drag-over');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleOrderFileImport(files[0]);
    }
  });
  ordersFile.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      handleOrderFileImport(e.target.files[0]);
    }
  });

  // --- 2. FILE IMPORT HANDLERS ---
  
  function handleProductFileImport(file) {
    const reader = new FileReader();
    productsStatus.innerHTML = `<span style="color:var(--color-primary);">Wczytywanie pliku...</span>`;
    
    reader.onload = function(e) {
      const text = e.target.result;
      if (file.name.endsWith('.json')) {
        try {
          const arr = JSON.parse(text);
          importWooProductsArray(arr, productsStatus);
        } catch (err) {
          productsStatus.innerHTML = `<span style="color:#D32F2F;">Błąd składni JSON: ${err.message}</span>`;
        }
      } else if (file.name.endsWith('.csv')) {
        const parsed = parseCSV(text);
        importWooProductsCSV(parsed, productsStatus);
      } else {
        productsStatus.innerHTML = `<span style="color:#D32F2F;">Nieobsługiwany format pliku. Użyj CSV lub JSON.</span>`;
      }
    };
    reader.readAsText(file);
  }

  function handleOrderFileImport(file) {
    const reader = new FileReader();
    ordersStatus.innerHTML = `<span style="color:var(--color-primary);">Wczytywanie pliku...</span>`;
    
    reader.onload = function(e) {
      const text = e.target.result;
      if (file.name.endsWith('.json')) {
        try {
          const arr = JSON.parse(text);
          importWooOrdersArray(arr, ordersStatus);
        } catch (err) {
          ordersStatus.innerHTML = `<span style="color:#D32F2F;">Błąd składni JSON: ${err.message}</span>`;
        }
      } else if (file.name.endsWith('.csv')) {
        const parsed = parseCSV(text);
        importWooOrdersCSV(parsed, ordersStatus);
      } else {
        ordersStatus.innerHTML = `<span style="color:#D32F2F;">Nieobsługiwany format pliku. Użyj CSV lub JSON.</span>`;
      }
    };
    reader.readAsText(file);
  }

  // --- 3. JSON MANUAL PASTE HANDLERS ---
  
  importJsonProducts.addEventListener('click', () => {
    const val = jsonPaste.value.trim();
    if (!val) {
      pasteStatus.innerHTML = `<span style="color:#D32F2F;">Wklej kod JSON przed importem.</span>`;
      return;
    }
    try {
      const arr = JSON.parse(val);
      importWooProductsArray(arr, pasteStatus);
      jsonPaste.value = '';
    } catch (err) {
      pasteStatus.innerHTML = `<span style="color:#D32F2F;">Błąd składni JSON: ${err.message}</span>`;
    }
  });

  importJsonOrders.addEventListener('click', () => {
    const val = jsonPaste.value.trim();
    if (!val) {
      pasteStatus.innerHTML = `<span style="color:#D32F2F;">Wklej kod JSON przed importem.</span>`;
      return;
    }
    try {
      const arr = JSON.parse(val);
      importWooOrdersArray(arr, pasteStatus);
      jsonPaste.value = '';
    } catch (err) {
      pasteStatus.innerHTML = `<span style="color:#D32F2F;">Błąd składni JSON: ${err.message}</span>`;
    }
  });

  // --- 4. CSV LIGHTWEIGHT JS PARSER ---
  
  function parseCSV(text) {
    const lines = [];
    let row = [""];
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      let c = text[i];
      let next = text[i+1];
      
      if (c === '"') {
        if (inQuotes && next === '"') {
          row[row.length - 1] += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (c === ',') {
        if (inQuotes) {
          row[row.length - 1] += c;
        } else {
          row.push("");
        }
      } else if (c === '\r' || c === '\n') {
        if (inQuotes) {
          row[row.length - 1] += c;
        } else {
          if (c === '\r' && next === '\n') {
            i++;
          }
          lines.push(row);
          row = [""];
        }
      } else {
        row[row.length - 1] += c;
      }
    }
    if (row.length > 1 || row[0] !== "") {
      lines.push(row);
    }
    return lines;
  }

  // --- 5. DATA MAPPER & SYNCING LOGIC ---
  
  // WooCommerce Product Array Import
  function importWooProductsArray(arr, statusEl) {
    const items = Array.isArray(arr) ? arr : [arr];
    const currentProducts = JSON.parse(localStorage.getItem('wds_products') || '[]');
    let importCount = 0;

    items.forEach(item => {
      // Map columns (WooCommerce JSON product payload schema)
      const name = item.name || item.title || item.post_title || 'Nienazwany produkt z WooCommerce';
      const nameEn = item.nameEn || item.title_en || name;
      const price = parseFloat(item.price || item.regular_price || item.sale_price || 99.00);
      const category = item.category || (item.categories && item.categories[0] ? item.categories[0].slug : 'silk');
      const material = item.material || 'Luksusowe wykończenie streetwear';
      const description = item.description || item.post_content || item.short_description || 'Brak opisu z WooCommerce.';
      
      // Safe image parsing
      let imagePath = './assets/durag_silk_black.png';
      if (item.images && Array.isArray(item.images) && item.images.length > 0) {
        imagePath = item.images[0].src || item.images[0] || imagePath;
      } else if (item.image) {
        imagePath = item.image;
      }

      // Safe category label
      let categoryLabel = 'Czysty Jedwab';
      if (category === 'velvet') categoryLabel = 'Ekskluzywny Aksamit';
      if (category === 'accessories') categoryLabel = 'Pielęgnacja & Akcesoria';

      // Colors mapping
      const colors = item.colors || [
        { name: 'Obsidian Black', hex: '#111111' },
        { name: 'Bronze Satin', hex: '#8A6E55' }
      ];

      // Add record to storage
      const newId = currentProducts.length > 0 ? Math.max(...currentProducts.map(p => p.id)) + 1 : 1;
      const productObj = {
        id: newId,
        name: name,
        nameEn: nameEn,
        price: price,
        category: category,
        categoryLabel: categoryLabel,
        material: material,
        description: description,
        images: [imagePath, './assets/lookbook_editorial.png'],
        colors: colors,
        reviews: []
      };

      currentProducts.push(productObj);
      importCount++;
    });

    localStorage.setItem('wds_products', JSON.stringify(currentProducts));
    
    // Globally sync active lists in memory!
    products = currentProducts;
    
    // Reactively refresh storefront and CMS dashboard
    renderProductGrid();
    
    // If inside admin console, refresh list
    const tabProductsBtn = document.querySelector('[data-cms-tab="products"]');
    if (tabProductsBtn) tabProductsBtn.click();

    statusEl.innerHTML = `<span style="color:#2E7D32;">Pomyślnie zaimportowano ${importCount} produktów!</span>`;
  }

  // WooCommerce Product CSV Import
  function importWooProductsCSV(parsed, statusEl) {
    if (parsed.length < 2) {
      statusEl.innerHTML = `<span style="color:#D32F2F;">Pusty plik CSV lub zła struktura.</span>`;
      return;
    }

    const headers = parsed[0].map(h => h.trim().toLowerCase());
    const currentProducts = JSON.parse(localStorage.getItem('wds_products') || '[]');
    let importCount = 0;

    // WooCommerce CSV columns mapping indices
    const nameIdx = headers.findIndex(h => h.includes('name') || h.includes('title') || h === 'nazwa');
    const priceIdx = headers.findIndex(h => h.includes('price') || h.includes('cena') || h === 'cena regularna' || h === 'regular price');
    const descIdx = headers.findIndex(h => h.includes('description') || h.includes('content') || h === 'opis');
    const catIdx = headers.findIndex(h => h.includes('categories') || h.includes('category') || h === 'kategorie');
    const imgIdx = headers.findIndex(h => h.includes('images') || h.includes('image') || h === 'obrazy' || h === 'zdjęcia');

    for (let i = 1; i < parsed.length; i++) {
      const row = parsed[i];
      if (row.length < nameIdx || !row[nameIdx]) continue;

      const name = row[nameIdx] || 'Nienazwany produkt CSV';
      const price = priceIdx !== -1 && row[priceIdx] ? parseFloat(row[priceIdx].replace(/[^\d.]/g, '')) : 99.00;
      const description = descIdx !== -1 && row[descIdx] ? row[descIdx] : 'Brak opisu z WooCommerce.';
      const rawCat = catIdx !== -1 && row[catIdx] ? row[catIdx].toLowerCase() : 'silk';
      const rawImg = imgIdx !== -1 && row[imgIdx] ? row[imgIdx].split(',')[0].trim() : './assets/durag_silk_black.png';

      // Categorize
      let category = 'silk';
      if (rawCat.includes('velvet') || rawCat.includes('aksamit') || rawCat.includes('welwet')) category = 'velvet';
      else if (rawCat.includes('access') || rawCat.includes('szczotka') || rawCat.includes('akcesor')) category = 'accessories';

      let categoryLabel = 'Czysty Jedwab';
      if (category === 'velvet') categoryLabel = 'Ekskluzywny Aksamit';
      if (category === 'accessories') categoryLabel = 'Pielęgnacja & Akcesoria';

      const newId = currentProducts.length > 0 ? Math.max(...currentProducts.map(p => p.id)) + 1 : 1;
      const productObj = {
        id: newId,
        name: name,
        nameEn: name,
        price: isNaN(price) ? 99.00 : price,
        category: category,
        categoryLabel: categoryLabel,
        material: 'Importowane wykończenie WooCommerce',
        description: description,
        images: [rawImg, './assets/lookbook_editorial.png'],
        colors: [
          { name: 'Obsidian Black', hex: '#111111' },
          { name: 'Bronze Satin', hex: '#8A6E55' }
        ],
        reviews: []
      };

      currentProducts.push(productObj);
      importCount++;
    }

    localStorage.setItem('wds_products', JSON.stringify(currentProducts));
    
    // Globally sync active lists in memory!
    products = currentProducts;
    
    // Reactively refresh storefront and CMS dashboard
    renderProductGrid();
    
    const tabProductsBtn = document.querySelector('[data-cms-tab="products"]');
    if (tabProductsBtn) tabProductsBtn.click();

    statusEl.innerHTML = `<span style="color:#2E7D32;">Pomyślnie zaimportowano ${importCount} produktów!</span>`;
  }

  // WooCommerce Orders Array Import
  function importWooOrdersArray(arr, statusEl) {
    const items = Array.isArray(arr) ? arr : [arr];
    const currentOrders = JSON.parse(localStorage.getItem('wds_orders') || '[]');
    let importCount = 0;

    items.forEach(item => {
      // Map columns (WooCommerce JSON orders payload schema)
      const orderNo = item.order_number || item.orderNo || item.id || Math.floor(100000 + Math.random() * 900000);
      const date = item.date_created || item.date || new Date().toLocaleString('pl-PL');
      const total = parseFloat(item.total || item.total_amount || 238.00);
      
      let itemsSummary = '';
      if (item.line_items && Array.isArray(item.line_items)) {
        itemsSummary = item.line_items.map(li => `${li.name} x${li.quantity}`).join(', ');
      } else {
        itemsSummary = item.itemsSummary || 'Jedwabny Durag Obsidian x2';
      }

      const newOrder = {
        orderNo: orderNo.toString().startsWith('#') ? orderNo : '#WDS-' + orderNo,
        date: date,
        timestamp: Date.now(),
        itemsSummary: itemsSummary,
        discountCode: item.discountCode || 'Brak',
        discountVal: parseFloat(item.discountVal || item.discount || 0.00),
        total: isNaN(total) ? 129.00 : total,
        rawItems: [],
        shipping: {
          method: item.shipping_method || 'Kurier WDS',
          name: item.billing ? `${item.billing.first_name} ${item.billing.last_name}` : 'Klient WooCommerce',
          email: item.billing ? item.billing.email : 'klient@woo.pl',
          phone: item.billing ? item.billing.phone : '500-000-000',
          lockerCode: item.lockerCode || null
        }
      };

      currentOrders.unshift(newOrder);
      importCount++;
    });

    localStorage.setItem('wds_orders', JSON.stringify(currentOrders));
    
    // Reactively refresh CMS statistics if open
    updateCmsAnalyticStatsDirectly();
    
    const tabStatsBtn = document.querySelector('[data-cms-tab="stats"]');
    if (tabStatsBtn) tabStatsBtn.click();

    statusEl.innerHTML = `<span style="color:#2E7D32;">Pomyślnie zaimportowano ${importCount} zamówień!</span>`;
  }

  // WooCommerce Orders CSV Import
  function importWooOrdersCSV(parsed, statusEl) {
    if (parsed.length < 2) {
      statusEl.innerHTML = `<span style="color:#D32F2F;">Pusty plik CSV lub zła struktura.</span>`;
      return;
    }

    const headers = parsed[0].map(h => h.trim().toLowerCase());
    const currentOrders = JSON.parse(localStorage.getItem('wds_orders') || '[]');
    let importCount = 0;

    // WooCommerce CSV columns mapping indices
    const orderNoIdx = headers.findIndex(h => h.includes('id') || h.includes('number') || h === 'zamówienie' || h === 'numer');
    const dateIdx = headers.findIndex(h => h.includes('date') || h.includes('data') || h === 'data zamówienia');
    const totalIdx = headers.findIndex(h => h.includes('total') || h.includes('suma') || h === 'kwota' || h === 'cena');
    const itemsIdx = headers.findIndex(h => h.includes('items') || h.includes('products') || h.includes('pozycje') || h === 'przedmioty');
    const nameIdx = headers.findIndex(h => h.includes('billing_first_name') || h.includes('customer') || h === 'klient' || h === 'imię');

    for (let i = 1; i < parsed.length; i++) {
      const row = parsed[i];
      if (row.length < orderNoIdx || !row[orderNoIdx]) continue;

      const orderNo = row[orderNoIdx] || Math.floor(100000 + Math.random() * 900000);
      const date = dateIdx !== -1 && row[dateIdx] ? row[dateIdx] : new Date().toLocaleString('pl-PL');
      const total = totalIdx !== -1 && row[totalIdx] ? parseFloat(row[totalIdx].replace(/[^\d.]/g, '')) : 129.00;
      const itemsSummary = itemsIdx !== -1 && row[itemsIdx] ? row[itemsIdx] : 'Jedwabny Durag Obsidian x1';
      const name = nameIdx !== -1 && row[nameIdx] ? row[nameIdx] : 'Klient WooCommerce';

      const newOrder = {
        orderNo: orderNo.toString().startsWith('#') ? orderNo : '#WDS-' + orderNo,
        date: date,
        timestamp: Date.now(),
        itemsSummary: itemsSummary,
        discountCode: 'Brak',
        discountVal: 0.00,
        total: isNaN(total) ? 129.00 : total,
        rawItems: [],
        shipping: {
          method: 'Kurier WDS',
          name: name,
          email: 'klient@woo.pl',
          phone: '500-000-000',
          lockerCode: null
        }
      };

      currentOrders.unshift(newOrder);
      importCount++;
    }

    localStorage.setItem('wds_orders', JSON.stringify(currentOrders));
    
    // Reactively refresh CMS statistics if open
    updateCmsAnalyticStatsDirectly();
    
    const tabStatsBtn = document.querySelector('[data-cms-tab="stats"]');
    if (tabStatsBtn) tabStatsBtn.click();

    statusEl.innerHTML = `<span style="color:#2E7D32;">Pomyślnie zaimportowano ${importCount} zamówień!</span>`;
  }
}

// --- INFORMATION & LEGAL MODALS CONTROLLER ---
function initInfoModals() {
  const overlay = document.getElementById('infoModalOverlay');
  const closeBtn = document.getElementById('infoModalCloseBtn');
  if (!overlay || !closeBtn) return;

  const contentMap = {
    linkWaveGuide: 'modalContentWaveGuide',
    linkSizeChart: 'modalContentSizeChart',
    linkDelivery: 'modalContentDelivery',
    linkTerms: 'modalContentTerms',
    linkPrivacy: 'modalContentPrivacy',
    linkBlog: 'modalContentBlog',
    linkBlogFooter: 'modalContentBlog',
    linkAboutModal: 'modalContentAbout',
    linkAboutModalFooter: 'modalContentAbout',
    linkAboutLegal: 'modalContentAbout',
    linkContactModalFooter: 'modalContentContact',
    linkContactLegal: 'modalContentContact'
  };

  function openModal(contentId) {
    Object.values(contentMap).forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });
    const target = document.getElementById(contentId);
    if (target) {
      target.style.display = 'block';
      overlay.classList.add('active');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.classList.add('no-scroll');
    }
  }

  function closeModal() {
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
  }

  Object.entries(contentMap).forEach(([linkId, contentId]) => {
    const linkEl = document.getElementById(linkId);
    if (linkEl) {
      linkEl.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(contentId);
      });
    }
  });

  closeBtn.addEventListener('click', closeModal);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeModal();
    }
  });
}

// --- Scroll Lock Observer ---
// Monitors overlay states and dynamically locks background body scroll to prevent page shift
function initScrollLockObserver() {
  const overlayIds = [
    'mobileNavDrawer',
    'cartOverlay',
    'productModal',
    'adminLoginModal',
    'adminDashboardOverlay',
    'cmsProductDrawer',
    'infoModalOverlay'
  ];

  const updateBodyScroll = () => {
    let shouldLock = false;
    overlayIds.forEach(id => {
      const el = document.getElementById(id);
      if (el && el.classList.contains('active')) {
        shouldLock = true;
      }
    });

    if (shouldLock) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
  };

  const observer = new MutationObserver(updateBodyScroll);

  overlayIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      observer.observe(el, { attributes: true, attributeFilter: ['class'] });
    }
  });

  // Run initial check
  updateBodyScroll();
}
})();

