'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_SITE_SETTINGS, fetchSiteSettings } from '@/lib/supabase';

export type Language = 'PL' | 'EN';

export interface Translations {
  // Navigation
  navHome: string;
  navAll: string;
  navSilk: string;
  navSatin: string;
  navVelvet: string;
  navSeasonal: string;
  navAccessories: string;
  navGuide: string;
  navAbout: string;

  // Announcement
  announcement: string;

  // Trust Banner
  trustFacts: [string, string, string, string];

  // Cart Drawer & Page
  cartTitle: string;
  cartEmpty: string;
  cartSubtotal: string;
  cartShipping: string;
  cartShippingFree: string;
  cartDiscount2plus1: string;
  cartPromoCode: string;
  cartTotal: string;
  cartCheckout: string;
  cartViewFull: string;
  cartPromoBannerTitle: string;
  cartPromoBannerDesc0: string;
  cartPromoBannerDesc1: string;
  cartPromoBannerDesc2: string;
  cartPromoBannerSuccess: string;
  cartFreeShippingInfo: string;

  // Product Card & Details
  addToCart: string;
  addedToCart: string;
  addedConfirmation: string;
  goToCart: string;
  outOfStock: string;
  inStock: string;
  deliveryNote: string;
  factStraps: string;
  factSeam: string;
  factHandmade: string;
  factReturns: string;

  // Accordions
  tabShippingTitle: string;
  tabShippingLine1: string;
  tabShippingLine2: string;
  tabShippingLine3: string;
  tabReturnsTitle: string;
  tabReturnsLine1: string;
  tabReturnsLine2: string;
  tabMaterialTitle: string;
  tabMaterialLine1: string;
  tabMaterialLine2: string;

  // Catalog
  catalogTitle: string;
  catalogEmpty: string;
  catAll: string;
  catSilk: string;
  catSatin: string;
  catVelvet: string;
  catSeasonal: string;
  catAccessories: string;

  // Home Hero & Promo
  heroTitle: string;
  heroDesc: string;
  heroCta: string;
  bestsellersTitle: string;
  promoStripTitle: string;
  promoStripDesc: string;
  promoStripCta: string;
  chooseFabricTitle: string;
  chooseFabricDesc: string;
}

const TRANSLATIONS: Record<Language, Translations> = {
  PL: {
    navHome: 'Start',
    navAll: 'Wszystkie',
    navSilk: 'Jedwab',
    navSatin: 'Satyna',
    navVelvet: 'Welur',
    navSeasonal: 'Tkaniny sezonowe',
    navAccessories: 'Akcesoria',
    navGuide: 'Wave Guide',
    navAbout: 'O nas',

    announcement: 'Darmowa dostawa w Polsce · Kup 2, trzeci durag za 1 zł',

    trustFacts: [
      'Wysyłka z Warszawy w 1–2 dni robocze',
      'Darmowa dostawa w Polsce',
      '14 dni na zwrot',
      'Odbiór osobisty w Warszawie po umówieniu',
    ],

    cartTitle: 'Twój Koszyk',
    cartEmpty: 'Twój koszyk jest pusty',
    cartSubtotal: 'Suma częściowa',
    cartShipping: 'Dostawa w Polsce',
    cartShippingFree: '0 zł (darmowa dostawa)',
    cartDiscount2plus1: 'Rabat 2+1',
    cartPromoCode: 'Kod rabatowy',
    cartTotal: 'Do zapłaty',
    cartCheckout: 'Przejdź do kasy',
    cartViewFull: 'Zobacz pełny koszyk',
    cartPromoBannerTitle: 'Promocja: kup 2, trzeci losowy durag za 1 zł',
    cartPromoBannerDesc0: 'Wybierz 2 duragi, a trzeci model otrzymasz za 1 zł.',
    cartPromoBannerDesc1: 'Dodaj jeszcze 1 durag, aby odebrać kolejny za 1 zł.',
    cartPromoBannerDesc2: 'Dodaj jeszcze 2 duragi, aby odebrać kolejny za 1 zł.',
    cartPromoBannerSuccess: 'Naliczono rabat na trzeci durag w koszyku!',
    cartFreeShippingInfo: 'Darmowa dostawa dla wszystkich zamówień w Polsce.',

    addToCart: 'Do koszyka',
    addedToCart: 'Dodano',
    addedConfirmation: 'Produkt został dodany do koszyka.',
    goToCart: 'Przejdź do koszyka',
    outOfStock: 'Brak w magazynie',
    inStock: 'Dostępny w magazynie',
    deliveryNote: 'Darmowa dostawa w Polsce · Wysyłka z Warszawy w 1–2 dni robocze',
    factStraps: '• Pasy: 100 cm',
    factSeam: '• Bezodciskowy szew na zewnątrz',
    factHandmade: '• Szyte ręcznie w Warszawie',
    factReturns: '• 14 dni na zwrot',

    tabShippingTitle: 'Dostawa i odbiór osobisty',
    tabShippingLine1: 'Wysyłka z Warszawy w 1–2 dni robocze',
    tabShippingLine2: 'Darmowa dostawa w Polsce: Paczkomaty InPost i kurier dla każdego zamówienia',
    tabShippingLine3: 'Odbiór osobisty w Warszawie: ul. Włodarzewska 4 po umówieniu',
    tabReturnsTitle: 'Zwroty i 14 dni na odstąpienie',
    tabReturnsLine1: 'Masz pełne 14 dni na zwrot od momentu odebrania przesyłki',
    tabReturnsLine2: 'Produkt nie może nosić śladów użytkowania, w oryginalnym opakowaniu',
    tabMaterialTitle: 'Tkanina i pielęgnacja',
    tabMaterialLine1: 'Prać ręcznie w chłodnej wodzie (max 30°C) z delikatnym detergentem',
    tabMaterialLine2: 'Suszyć na płasko, nie wykręcać, prasować na najniższej temperaturze',

    catalogTitle: 'Katalog duragów',
    catalogEmpty: 'Brak produktów w tej kategorii.',
    catAll: 'Wszystkie',
    catSilk: 'Jedwab',
    catSatin: 'Satyna',
    catVelvet: 'Welur',
    catSeasonal: 'Tkaniny sezonowe',
    catAccessories: 'Akcesoria',

    heroTitle: 'Duragi szyte w Warszawie z jedwabiu morwowego',
    heroDesc: 'Szyte ręcznie w Warszawie z naturalnego jedwabiu morwowego, satyny i weluru. Bezodciskowy szew zewnętrzny i długie pasy.',
    heroCta: 'Zobacz duragi',
    bestsellersTitle: 'Bestsellery',
    promoStripTitle: 'Kup 2, trzeci losowy durag za 1 zł',
    promoStripDesc: 'Wybierz dwa dowolne duragi do koszyka, a trzeci losowy model otrzymasz za 1 zł. Rabat nalicza się automatycznie.',
    promoStripCta: 'Zobacz duragi',
    chooseFabricTitle: 'Wybierz tkaninę',
    chooseFabricDesc: 'Materiały: jedwab, satyna, welur, tkaniny sezonowe.',
  },

  EN: {
    navHome: 'Home',
    navAll: 'All durags',
    navSilk: 'Silk',
    navSatin: 'Satin',
    navVelvet: 'Velvet',
    navSeasonal: 'Seasonal',
    navAccessories: 'Accessories',
    navGuide: 'Wave Guide',
    navAbout: 'About us',

    announcement: 'Free shipping across Poland · Buy 2, get 3rd durag for 1 PLN / €0.25',

    trustFacts: [
      'Dispatched from Warsaw in 1–2 business days',
      'Free shipping across Poland',
      '14-day return policy',
      'Warsaw local pickup by appointment',
    ],

    cartTitle: 'Your Cart',
    cartEmpty: 'Your shopping cart is empty',
    cartSubtotal: 'Subtotal',
    cartShipping: 'Shipping in Poland',
    cartShippingFree: 'Free shipping (0 PLN)',
    cartDiscount2plus1: 'Buy 2 Get 1 Promo',
    cartPromoCode: 'Promo code',
    cartTotal: 'Total',
    cartCheckout: 'Checkout',
    cartViewFull: 'View full cart',
    cartPromoBannerTitle: 'Offer: Buy 2, get 3rd random durag for 1 PLN',
    cartPromoBannerDesc0: 'Add 2 durags to receive a 3rd durag for 1 PLN.',
    cartPromoBannerDesc1: 'Add 1 more durag to unlock your next durag for 1 PLN.',
    cartPromoBannerDesc2: 'Add 2 more durags to unlock your next durag for 1 PLN.',
    cartPromoBannerSuccess: 'Discount applied to the 3rd durag in cart!',
    cartFreeShippingInfo: 'Free shipping across Poland on all orders.',

    addToCart: 'Add to cart',
    addedToCart: 'Added',
    addedConfirmation: 'Item has been added to your cart.',
    goToCart: 'Go to cart',
    outOfStock: 'Out of stock',
    inStock: 'In stock',
    deliveryNote: 'Free shipping in Poland · Dispatched from Warsaw in 1–2 business days',
    factStraps: '• Straps: 100 cm',
    factSeam: '• Seamless exterior flat stitch',
    factHandmade: '• Handcrafted in Warsaw',
    factReturns: '• 14-day returns',

    tabShippingTitle: 'Shipping & Pickup',
    tabShippingLine1: 'Dispatched from Warsaw in 1–2 business days',
    tabShippingLine2: 'Free shipping across Poland: InPost Paczkomat and courier on all orders',
    tabShippingLine3: 'Local pickup in Warsaw: ul. Włodarzewska 4 by appointment',
    tabReturnsTitle: 'Returns & 14-Day Guarantee',
    tabReturnsLine1: 'Full 14 days to return your order from the delivery date',
    tabReturnsLine2: 'Product must be unworn in its original packaging',
    tabMaterialTitle: 'Fabric & Garment Care',
    tabMaterialLine1: 'Hand wash in cold water (max 30°C / 86°F) with delicate silk detergent',
    tabMaterialLine2: 'Dry flat, do not wring or tumble dry, iron on lowest silk setting',

    catalogTitle: 'Durag Collection',
    catalogEmpty: 'No items in this category.',
    catAll: 'All',
    catSilk: 'Silk',
    catSatin: 'Satin',
    catVelvet: 'Velvet',
    catSeasonal: 'Seasonal',
    catAccessories: 'Accessories',

    heroTitle: 'Handcrafted in Warsaw from Natural Mulberry Silk',
    heroDesc: 'Sewn by hand in Warsaw from natural 19 Momme mulberry silk, satin and velvet. Seamless exterior stitch and 100 cm straps.',
    heroCta: 'Explore durags',
    bestsellersTitle: 'Bestsellers',
    promoStripTitle: 'Buy 2, get the 3rd durag for 1 PLN',
    promoStripDesc: 'Add any two durags to your cart and the third random durag is automatically discounted to 1 PLN at checkout.',
    promoStripCta: 'Explore durags',
    chooseFabricTitle: 'Choose Fabric',
    chooseFabricDesc: 'Curated textiles: mulberry silk, satin, velvet, seasonal weaves.',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: 'PLN' | 'EUR';
  setCurrency: (curr: 'PLN' | 'EUR') => void;
  formatPrice: (pricePln: number, priceEur?: number) => string;
  t: Translations;
  isEn: boolean;
  siteSettings: Record<string, string>;
  getSetting: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('PL');
  const [currency, setCurrencyState] = useState<'PLN' | 'EUR'>('PLN');
  const [siteSettings, setSiteSettings] = useState<Record<string, string>>(DEFAULT_SITE_SETTINGS);

  useEffect(() => {
    // 1. Initial cached settings
    try {
      const cached = localStorage.getItem('wds_site_settings');
      if (cached) {
        setSiteSettings((prev) => ({ ...prev, ...JSON.parse(cached) }));
      }
    } catch {
      // ignore
    }

    // 2. Fetch fresh settings from Supabase
    fetchSiteSettings().then((remote) => {
      if (remote && Object.keys(remote).length > 0) {
        setSiteSettings((prev) => ({ ...prev, ...remote }));
        try {
          localStorage.setItem('wds_site_settings', JSON.stringify(remote));
        } catch {
          // ignore
        }
      }
    });

    // 3. Listen for CMS updates from Admin
    const handleSettingsUpdate = () => {
      try {
        const cached = localStorage.getItem('wds_site_settings');
        if (cached) {
          setSiteSettings((prev) => ({ ...prev, ...JSON.parse(cached) }));
        }
      } catch {
        // ignore
      }
    };
    window.addEventListener('wds_settings_updated', handleSettingsUpdate);
    window.addEventListener('storage', handleSettingsUpdate);

    return () => {
      window.removeEventListener('wds_settings_updated', handleSettingsUpdate);
      window.removeEventListener('storage', handleSettingsUpdate);
    };
  }, []);

  useEffect(() => {
    try {
      const urlLang = new URLSearchParams(window.location.search).get('lang')?.toUpperCase();
      if (urlLang === 'PL' || urlLang === 'EN') {
        setLanguageState(urlLang as Language);
        localStorage.setItem('wds_lang', urlLang);
        if (urlLang === 'EN') {
          setCurrencyState('EUR');
          localStorage.setItem('wds_currency', 'EUR');
        }
        return;
      }

      const saved = localStorage.getItem('wds_lang') as Language;
      if (saved === 'PL' || saved === 'EN') {
        setLanguageState(saved);
        if (saved === 'EN') {
          setCurrencyState('EUR');
        }
      }
      const savedCurr = localStorage.getItem('wds_currency') as 'PLN' | 'EUR';
      if (savedCurr === 'PLN' || savedCurr === 'EUR') {
        setCurrencyState(savedCurr);
      }
    } catch {
      // ignore
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('wds_lang', lang);
      if (lang === 'PL') {
        setCurrencyState('PLN');
        localStorage.setItem('wds_currency', 'PLN');
      } else {
        setCurrencyState('EUR');
        localStorage.setItem('wds_currency', 'EUR');
      }
    } catch {
      // ignore
    }
  };

  const setCurrency = (curr: 'PLN' | 'EUR') => {
    setCurrencyState(curr);
    try {
      localStorage.setItem('wds_currency', curr);
    } catch {
      // ignore
    }
  };

  const formatPrice = (pricePln: number, priceEur?: number): string => {
    if (currency === 'EUR') {
      const val = priceEur !== undefined && priceEur > 0 ? priceEur : Math.round((pricePln / 4.3) * 100) / 100;
      const locale = language === 'PL' ? 'pl-PL' : 'en-US';
      const hasDecimals = val % 1 !== 0;
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: hasDecimals ? 2 : 0,
        minimumFractionDigits: hasDecimals ? 2 : 0,
      }).format(val);
    }
    const hasDecimals = pricePln % 1 !== 0;
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      maximumFractionDigits: hasDecimals ? 2 : 0,
      minimumFractionDigits: hasDecimals ? 2 : 0,
    }).format(pricePln);
  };

  const baseT = TRANSLATIONS[language] || TRANSLATIONS.PL;
  const isEn = language === 'EN';

  const getSetting = (key: string, fallback: string = ''): string => {
    return siteSettings[key] || fallback;
  };

  // Dynamically overlay CMS settings on top of default translations
  const t: Translations = {
    ...baseT,
    announcement: isEn
      ? (siteSettings.announcement_bar_en || siteSettings.announcement_bar || baseT.announcement)
      : (siteSettings.announcement_bar || baseT.announcement),
    heroTitle: isEn
      ? (siteSettings.hero_title_en || baseT.heroTitle)
      : (siteSettings.hero_title || baseT.heroTitle),
    heroDesc: isEn
      ? (siteSettings.hero_subtitle_en || baseT.heroDesc)
      : (siteSettings.hero_subtitle || baseT.heroDesc),
    heroCta: isEn
      ? (siteSettings.hero_cta_text_en || baseT.heroCta)
      : (siteSettings.hero_cta_text || baseT.heroCta),
    promoStripTitle: isEn
      ? (siteSettings.promo_strip_title_en || baseT.promoStripTitle)
      : (siteSettings.promo_strip_title || baseT.promoStripTitle),
    promoStripDesc: isEn
      ? (siteSettings.promo_strip_desc_en || baseT.promoStripDesc)
      : (siteSettings.promo_strip_desc || baseT.promoStripDesc),
    promoStripCta: isEn
      ? (siteSettings.promo_strip_cta_en || baseT.promoStripCta)
      : (siteSettings.promo_strip_cta || baseT.promoStripCta),
    bestsellersTitle: isEn
      ? (siteSettings.bestsellers_title_en || baseT.bestsellersTitle)
      : (siteSettings.bestsellers_title || baseT.bestsellersTitle),
    chooseFabricTitle: isEn
      ? (siteSettings.choose_fabric_title_en || baseT.chooseFabricTitle)
      : (siteSettings.choose_fabric_title || baseT.chooseFabricTitle),
    chooseFabricDesc: isEn
      ? (siteSettings.choose_fabric_desc_en || baseT.chooseFabricDesc)
      : (siteSettings.choose_fabric_desc || baseT.chooseFabricDesc),
    trustFacts: [
      isEn ? (siteSettings.trust_fact_1_en || baseT.trustFacts[0]) : (siteSettings.trust_fact_1 || baseT.trustFacts[0]),
      isEn ? (siteSettings.trust_fact_2_en || baseT.trustFacts[1]) : (siteSettings.trust_fact_2 || baseT.trustFacts[1]),
      isEn ? (siteSettings.trust_fact_3_en || baseT.trustFacts[2]) : (siteSettings.trust_fact_3 || baseT.trustFacts[2]),
      isEn ? (siteSettings.trust_fact_4_en || baseT.trustFacts[3]) : (siteSettings.trust_fact_4 || baseT.trustFacts[3]),
    ],
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        currency,
        setCurrency,
        formatPrice,
        t,
        isEn,
        siteSettings,
        getSetting,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
