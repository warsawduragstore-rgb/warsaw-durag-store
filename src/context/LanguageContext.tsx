'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'PL' | 'EN' | 'DE' | 'FR' | 'ES' | 'CZ' | 'LT';

export interface Translations {
  // Navigation
  navAll: string;
  navSilk: string;
  navSatin: string;
  navVelvet: string;
  navSeasonal: string;
  navAccessories: string;
  navGuide: string;

  // Announcement
  announcement: string;

  // Cart
  cartTitle: string;
  cartEmpty: string;
  cartSubtotal: string;
  cartShipping: string;
  cartShippingFree: string;
  cartTotal: string;
  cartCheckout: string;
  cartPromoPlaceholder: string;
  cartPromoApply: string;
  cartFreeShippingInfo: string;

  // Product
  addToCart: string;
  addedToCart: string;
  outOfStock: string;
  inStock: string;
  selectColor: string;
  descriptionTab: string;
  materialTab: string;
  reviewsTab: string;
  ratingAverage: string;

  // Trust Banner
  trustHandmadeTitle: string;
  trustHandmadeDesc: string;
  trustSilkTitle: string;
  trustSilkDesc: string;
  trustShippingTitle: string;
  trustShippingDesc: string;
  trustReturnsTitle: string;
  trustReturnsDesc: string;

  // Footer
  footerAbout: string;
  footerShop: string;
  footerInfo: string;
  footerNewsletterTitle: string;
  footerNewsletterDesc: string;
  footerEmailPlaceholder: string;
  footerSubscribeBtn: string;
  footerRights: string;
}

const TRANSLATIONS: Record<Language, Translations> = {
  PL: {
    navAll: 'Wszystko',
    navSilk: 'Jedwabne',
    navSatin: 'Satynowe',
    navVelvet: 'Welurowe',
    navSeasonal: 'Sezonowe',
    navAccessories: 'Akcesoria',
    navGuide: 'Wave Guide',

    announcement: 'Wysyłamy z Warszawy w 1 dzień • Kup dwa a trzeci otrzymasz gratis • Darmowa dostawa w Europie • Ręcznie szyte duragi • Odbiór osobisty w Warszawie • ',

    cartTitle: 'Twój Koszyk',
    cartEmpty: 'Twój koszyk jest pusty',
    cartSubtotal: 'Suma częściowa',
    cartShipping: 'Wysyłka',
    cartShippingFree: 'Darmowa',
    cartTotal: 'Łącznie',
    cartCheckout: 'Przejdź do dostawy i płatności',
    cartPromoPlaceholder: 'Kod rabatowy (np. WARSAW10)',
    cartPromoApply: 'Zastosuj',
    cartFreeShippingInfo: 'Brakuje Ci {amount} PLN do darmowej dostawy!',

    addToCart: 'Dodaj do koszyka',
    addedToCart: 'Dodano do koszyka!',
    outOfStock: 'Brak w magazynie',
    inStock: 'Dostępny w magazynie',
    selectColor: 'Wybierz kolor',
    descriptionTab: 'Opis i Historia',
    materialTab: 'Materiał i Pielęgnacja',
    reviewsTab: 'Opinie Klientów',
    ratingAverage: 'Średnia ocena',

    trustHandmadeTitle: 'Szyte w Warszawie',
    trustHandmadeDesc: 'Każdy durag powstaje lokalnie z pasją i precyzją.',
    trustSilkTitle: 'Jedwab 19 Momme',
    trustSilkDesc: 'Naturalny jedwab morwowy najwyższej próby.',
    trustShippingTitle: 'Wysyłka w 24h w EU',
    trustShippingDesc: 'Szybka dostawa kurierem z Warszawy do całej Europy.',
    trustReturnsTitle: '14 Dni na Zwrot',
    trustReturnsDesc: 'Gwarancja bezpiecznych i prostych zwrotów.',

    footerAbout: 'Jedyne duragi szyte w Polsce z jedwabiu morwowego, satyny i weluru. Warszawski kunszt i luksusowa pielęgnacja fal 360.',
    footerShop: 'Kolekcja',
    footerInfo: 'Obsługa Klienta',
    footerNewsletterTitle: 'Dołącz do WDS Club',
    footerNewsletterDesc: 'Otrzymaj 10% rabatu na pierwsze zamówienie i dostęp do limitowanych dropów.',
    footerEmailPlaceholder: 'Twój adres e-mail',
    footerSubscribeBtn: 'Zapisz się',
    footerRights: 'Wszelkie prawa zastrzeżone.',
  },

  EN: {
    navAll: 'All Products',
    navSilk: 'Silk Durags',
    navSatin: 'Satin Durags',
    navVelvet: 'Velvet Durags',
    navSeasonal: 'Seasonal',
    navAccessories: 'Accessories',
    navGuide: 'Wave Guide',

    announcement: 'Express shipping from Warsaw in 24h • Buy 2 Get 1 Free • Free shipping in EU • Handcrafted Premium Durags • ',

    cartTitle: 'Your Cart',
    cartEmpty: 'Your shopping cart is empty',
    cartSubtotal: 'Subtotal',
    cartShipping: 'Shipping',
    cartShippingFree: 'Free',
    cartTotal: 'Total',
    cartCheckout: 'Proceed to Checkout',
    cartPromoPlaceholder: 'Promo Code (e.g. WARSAW10)',
    cartPromoApply: 'Apply',
    cartFreeShippingInfo: 'Add {amount} PLN more for Free Express EU Shipping!',

    addToCart: 'Add to Cart',
    addedToCart: 'Added to Cart!',
    outOfStock: 'Out of Stock',
    inStock: 'In Stock',
    selectColor: 'Select Color',
    descriptionTab: 'Description & Story',
    materialTab: 'Material & Care',
    reviewsTab: 'Customer Reviews',
    ratingAverage: 'Average Rating',

    trustHandmadeTitle: 'Handmade in Warsaw',
    trustHandmadeDesc: 'Crafted locally with passion and ultimate precision.',
    trustSilkTitle: '19 Momme Mulberry Silk',
    trustSilkDesc: 'Natural grade-A Mulberry silk for 360 wave protection.',
    trustShippingTitle: '24h EU Shipping',
    trustShippingDesc: 'Fast tracked courier delivery from Warsaw across Europe.',
    trustReturnsTitle: '14-Day Easy Returns',
    trustReturnsDesc: 'Hassle-free return guarantee on all orders.',

    footerAbout: 'The premier European luxury durag brand. Handcrafted in Warsaw using 19 Momme mulberry silk, satin and velvet.',
    footerShop: 'Collection',
    footerInfo: 'Customer Care',
    footerNewsletterTitle: 'Join the WDS Club',
    footerNewsletterDesc: 'Get 10% off your first order and exclusive access to limited drops.',
    footerEmailPlaceholder: 'Enter your email',
    footerSubscribeBtn: 'Subscribe',
    footerRights: 'All Rights Reserved.',
  },

  DE: {
    navAll: 'Alle Produkte',
    navSilk: 'Seide Durags',
    navSatin: 'Satin Durags',
    navVelvet: 'Samt Durags',
    navSeasonal: 'Saisonal',
    navAccessories: 'Zubehör',
    navGuide: 'Wave Guide',

    announcement: 'Express-Versand aus Warschau in 24 Std. • Nimm 3 Zahle 2 • Kostenloser Versand in Europa • Handgefertigte Durags • ',

    cartTitle: 'Ihr Warenkorb',
    cartEmpty: 'Ihr Warenkorb ist leer',
    cartSubtotal: 'Zwischensumme',
    cartShipping: 'Versand',
    cartShippingFree: 'Kostenlos',
    cartTotal: 'Gesamtsumme',
    cartCheckout: 'Zur Kasse gehen',
    cartPromoPlaceholder: 'Gutscheincode',
    cartPromoApply: 'Einlösen',
    cartFreeShippingInfo: 'Noch {amount} PLN bis zum kostenlosen Versand!',

    addToCart: 'In den Warenkorb',
    addedToCart: 'Hinzugefügt!',
    outOfStock: 'Ausverkauft',
    inStock: 'Auf Lager',
    selectColor: 'Farbe wählen',
    descriptionTab: 'Beschreibung & Geschichte',
    materialTab: 'Material & Pflege',
    reviewsTab: 'Kundenbewertungen',
    ratingAverage: 'Durchschnittliche Bewertung',

    trustHandmadeTitle: 'Handgefertigt in Warschau',
    trustHandmadeDesc: 'Lokal gefertigt mit Leidenschaft und Präzision.',
    trustSilkTitle: '19 Momme Maulbeerseide',
    trustSilkDesc: 'Natürliche Maulbeerseide höchster Qualität.',
    trustShippingTitle: '24h EU Versand',
    trustShippingDesc: 'Schnelle Kurierzustellung aus Warschau europaweit.',
    trustReturnsTitle: '14 Tage Rückgaberecht',
    trustReturnsDesc: 'Garantie für einfache Rücksendungen.',

    footerAbout: 'Premium Durag-Marke aus Europa. Handgefertigt in Warschau aus 19 Momme Maulbeerseide, Satin und Samt.',
    footerShop: 'Kollektion',
    footerInfo: 'Kundenservice',
    footerNewsletterTitle: 'WDS Club beitreten',
    footerNewsletterDesc: 'Erhalten Sie 10% Rabatt auf Ihre erste Bestellung.',
    footerEmailPlaceholder: 'Ihre E-Mail-Adresse',
    footerSubscribeBtn: 'Abonnieren',
    footerRights: 'Alle Rechte vorbehalten.',
  },

  FR: {
    navAll: 'Tous les produits',
    navSilk: 'Durags en Soie',
    navSatin: 'Durags en Satin',
    navVelvet: 'Durags en Velours',
    navSeasonal: 'Saisonnier',
    navAccessories: 'Accessoires',
    navGuide: 'Guide Wave',

    announcement: 'Expédition express depuis Varsovie en 24h • 2 achetés 1 offert • Livraison gratuite en Europe • ',

    cartTitle: 'Votre Panier',
    cartEmpty: 'Votre panier est vide',
    cartSubtotal: 'Sous-total',
    cartShipping: 'Livraison',
    cartShippingFree: 'Gratuite',
    cartTotal: 'Total',
    cartCheckout: 'Commander',
    cartPromoPlaceholder: 'Code promo',
    cartPromoApply: 'Appliquer',
    cartFreeShippingInfo: 'Plus que {amount} PLN pour la livraison gratuite !',

    addToCart: 'Ajouter au panier',
    addedToCart: 'Ajouté !',
    outOfStock: 'Rupture de stock',
    inStock: 'En stock',
    selectColor: 'Sélectionner la couleur',
    descriptionTab: 'Description et Histoire',
    materialTab: 'Matériau et Entretien',
    reviewsTab: 'Avis clients',
    ratingAverage: 'Note moyenne',

    trustHandmadeTitle: 'Fabriqué à Varsovie',
    trustHandmadeDesc: 'Fait main avec passion et précision.',
    trustSilkTitle: 'Soie de Mûrier 19 Momme',
    trustSilkDesc: 'Soie naturelle de qualité supérieure pour vagues 360.',
    trustShippingTitle: 'Livraison 24h Europe',
    trustShippingDesc: 'Expédition rapide par courrier depuis Varsovie.',
    trustReturnsTitle: 'Retours sous 14 jours',
    trustReturnsDesc: 'Garantie de retour facile sur toutes vos commandes.',

    footerAbout: 'Marque européenne de durags de luxe. Fabriqué à la main à Varsovie.',
    footerShop: 'Collection',
    footerInfo: 'Service Client',
    footerNewsletterTitle: 'Rejoignez le WDS Club',
    footerNewsletterDesc: 'Obtenez 10% de réduction sur votre première commande.',
    footerEmailPlaceholder: 'Votre e-mail',
    footerSubscribeBtn: 'S’abonner',
    footerRights: 'Tous droits réservés.',
  },

  ES: {
    navAll: 'Todos los productos',
    navSilk: 'Durags de Seda',
    navSatin: 'Durags de Satén',
    navVelvet: 'Durags de Terciopelo',
    navSeasonal: 'De Temporada',
    navAccessories: 'Accesorios',
    navGuide: 'Guía Wave',

    announcement: 'Envío exprés desde Varsovia en 24h • Compra 2 y Llévate 1 Gratis • Envío gratis en Europa • ',

    cartTitle: 'Tu Cesta',
    cartEmpty: 'Tu cesta está vacía',
    cartSubtotal: 'Subtotal',
    cartShipping: 'Envío',
    cartShippingFree: 'Gratis',
    cartTotal: 'Total',
    cartCheckout: 'Tramitar Pedido',
    cartPromoPlaceholder: 'Código de descuento',
    cartPromoApply: 'Aplicar',
    cartFreeShippingInfo: '¡Faltan {amount} PLN para envío gratis!',

    addToCart: 'Añadir a la cesta',
    addedToCart: '¡Añadido!',
    outOfStock: 'Agotado',
    inStock: 'En stock',
    selectColor: 'Seleccionar color',
    descriptionTab: 'Descripción e Historia',
    materialTab: 'Material y Cuidados',
    reviewsTab: 'Opiniones de clientes',
    ratingAverage: 'Puntuación media',

    trustHandmadeTitle: 'Hecho a mano en Varsovia',
    trustHandmadeDesc: 'Elaborado localmente con pasión y precisión.',
    trustSilkTitle: 'Seda de Morera 19 Momme',
    trustSilkDesc: 'Seda natural de primera calidad para protección 360.',
    trustShippingTitle: 'Envío 24h a Europa',
    trustShippingDesc: 'Entrega rápida en toda Europa desde Varsovia.',
    trustReturnsTitle: '14 Días de Devolución',
    trustReturnsDesc: 'Garantía de devolución fácil y segura.',

    footerAbout: 'Marca europea de durags de lujo. Hecho a mano en Varsovia con seda, satén y terciopelo.',
    footerShop: 'Colección',
    footerInfo: 'Atención al Cliente',
    footerNewsletterTitle: 'Únete al WDS Club',
    footerNewsletterDesc: 'Obtén un 10% de descuento en tu primer pedido.',
    footerEmailPlaceholder: 'Tu correo electrónico',
    footerSubscribeBtn: 'Suscribirse',
    footerRights: 'Todos los derechos reservados.',
  },

  CZ: {
    navAll: 'Všechny Produkty',
    navSilk: 'Hedvábné Duragy',
    navSatin: 'Saténové Duragy',
    navVelvet: 'Sametové Duragy',
    navSeasonal: 'Sezónní',
    navAccessories: 'Doplňky',
    navGuide: 'Wave Guide',

    announcement: 'Expresní doručení z Varšavy do 24 hodin • Koupit 2 Získejte 1 Zdarma • Doprava zdarma v EU • ',

    cartTitle: 'Váš Košík',
    cartEmpty: 'Váš nákupní košík je prázdný',
    cartSubtotal: 'Mezisoučet',
    cartShipping: 'Doprava',
    cartShippingFree: 'Zdarma',
    cartTotal: 'Celkem',
    cartCheckout: 'Pokračovat k objednávce',
    cartPromoPlaceholder: 'Slevový kód',
    cartPromoApply: 'Použít',
    cartFreeShippingInfo: 'Chybí vám {amount} PLN do dopravy zdarma!',

    addToCart: 'Přidat do košíku',
    addedToCart: 'Přidáno do košíku!',
    outOfStock: 'Vyprodáno',
    inStock: 'Skladem',
    selectColor: 'Vybrat barvu',
    descriptionTab: 'Popis a Příběh',
    materialTab: 'Materiál a Péče',
    reviewsTab: 'Hodnocení zákazníků',
    ratingAverage: 'Průměrné hodnocení',

    trustHandmadeTitle: 'Ručně šité ve Varšavě',
    trustHandmadeDesc: 'Vyrobeno lokálně s vášní a přesností.',
    trustSilkTitle: 'Hedvábí 19 Momme',
    trustSilkDesc: 'Přírodní hedvábí nejvyšší kvality.',
    trustShippingTitle: 'Rychlé doručení v EU',
    trustShippingDesc: 'Expresní kurýr z Varšavy po celé Evropě.',
    trustReturnsTitle: '14 Dní na vrácení',
    trustReturnsDesc: 'Záruka snadného vrácení zboží.',

    footerAbout: 'Prémiová evropská značka duragů. Ruční výroba ve Varšavě z hedvábí, saténu a sametu.',
    footerShop: 'Kolekce',
    footerInfo: 'Zákaznický servis',
    footerNewsletterTitle: 'Připojte se k WDS Clubu',
    footerNewsletterDesc: 'Získejte 10% slevu na první objednávku.',
    footerEmailPlaceholder: 'Váš e-mail',
    footerSubscribeBtn: 'Odebírat',
    footerRights: 'Všechna práva vyhrazena.',
  },

  LT: {
    navAll: 'Visi Produktai',
    navSilk: 'Šilkiniai Duragai',
    navSatin: 'Satininiai Duragai',
    navVelvet: 'Velūriniai Duragai',
    navSeasonal: 'Sezoniniai',
    navAccessories: 'Atsargos ir Priedai',
    navGuide: 'Wave Guide',

    announcement: 'Greitas pristatymas iš Varšuvos per 24 val. • Pirkite 2 Gaukite 1 Nemokamai • Nemokamas pristatymas ES • ',

    cartTitle: 'Jūsų Krepšelis',
    cartEmpty: 'Jūsų pirkinių krepšelis tuščias',
    cartSubtotal: 'Tarpinė suma',
    cartShipping: 'Pristatymas',
    cartShippingFree: 'Nemokamas',
    cartTotal: 'Iš viso',
    cartCheckout: 'Tęsti Apmokėjimą',
    cartPromoPlaceholder: 'Nuolaidos kodas',
    cartPromoApply: 'Taikyti',
    cartFreeShippingInfo: 'Liko {amount} PLN iki nemokamo pristatymo!',

    addToCart: 'Įdėti į krepšelį',
    addedToCart: 'Įdėta!',
    outOfStock: 'Išparduota',
    inStock: 'Yra sandėlyje',
    selectColor: 'Pasirinkite spalvą',
    descriptionTab: 'Aprašymas ir Istorija',
    materialTab: 'Medžiaga ir Priežiūra',
    reviewsTab: 'Klientų Atsiliepimai',
    ratingAverage: 'Vidutinis įvertinimas',

    trustHandmadeTitle: 'Rankų darbas Varšuvoje',
    trustHandmadeDesc: 'Pagaminta vietiniu būdu su aistra ir tikslumu.',
    trustSilkTitle: '19 Momme Šilkas',
    trustSilkDesc: 'Aukščiausios kokybės natūralus šilkas.',
    trustShippingTitle: 'Greitas 24 val. pristatymas ES',
    trustShippingDesc: 'Greitas kurjeris iš Varšuvos į visą Europą.',
    trustReturnsTitle: '14 Dienų Grąžinimas',
    trustReturnsDesc: 'Paprasta ir saugi grąžinimo garantija.',

    footerAbout: 'Aukščiausios kokybės europietiškas durag prekės ženklas. Rankų darbas Varšuvoje iš šilko, satino ir velūro.',
    footerShop: 'Kolekcija',
    footerInfo: 'Klientų Aptarnavimas',
    footerNewsletterTitle: 'Prisijunkite prie WDS Klubo',
    footerNewsletterDesc: 'Gaukite 10% nuolaidą pirmajam užsakymui.',
    footerEmailPlaceholder: 'Jūsų el. paštas',
    footerSubscribeBtn: 'Prenumeruoti',
    footerRights: 'Visos teisės saugomos.',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('PL');

  useEffect(() => {
    const saved = localStorage.getItem('wds_lang') as Language;
    if (saved && TRANSLATIONS[saved]) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('wds_lang', lang);
  };

  const t = TRANSLATIONS[language] || TRANSLATIONS.PL;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
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
