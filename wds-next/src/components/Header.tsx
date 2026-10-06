'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Search, Menu, X, Globe, ChevronRight, BookOpen, MapPin, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLanguage, Language } from '@/context/LanguageContext';

export default function Header() {
  const { cartCount, setIsCartOpen } = useCart();
  const { language, setLanguage, currency, setCurrency, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [dynamicAnnouncement, setDynamicAnnouncement] = useState<string | null>(null);

  useEffect(() => {
    import('@/lib/supabase')
      .then(({ fetchSiteSettings }) => fetchSiteSettings())
      .then((settings) => {
        if (settings?.announcement_bar) {
          setDynamicAnnouncement(settings.announcement_bar);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll and handle ESC when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setMobileMenuOpen(false);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

  const languages: { code: Language; label: string }[] = [
    { code: 'PL', label: 'Polski' },
    { code: 'EN', label: 'English' },
    { code: 'DE', label: 'Deutsch' },
    { code: 'FR', label: 'Français' },
    { code: 'ES', label: 'Español' },
    { code: 'CZ', label: 'Čeština' },
    { code: 'LT', label: 'Lietuvių' },
  ];

  const categories = [
    { href: '/produkty', label: 'Pełny Katalog', badge: 'Wszystkie' },
    { href: '/kolekcja/silk', label: t.navSilk || 'Jedwab Morwowy', badge: '19 Momme' },
    { href: '/kolekcja/satin', label: t.navSatin || 'Satyna Premium', badge: 'Bestseller' },
    { href: '/kolekcja/velvet', label: t.navVelvet || 'Welur Luksusowy', badge: 'Kompresja 360' },
    { href: '/kolekcja/seasonal', label: t.navSeasonal || 'Materiały Sezonowe', badge: 'Limitowane' },
    { href: '/kolekcja/accessories', label: t.navAccessories || 'Akcesoria do Fal', badge: 'Szczotki & Czepki' },
  ];

  const infoLinks = [
    { href: '/o-nas', label: 'O nas & Warszawskie Atelier' },
    { href: '/blog', label: 'Duragopedia & Blog' },
    { href: '/poradnik/wave-guide', label: 'Poradnik 360 Waves' },
    { href: '/strona/kontakt', label: 'Kontakt & Odbiór w Warszawie' },
    { href: '/zwroty', label: 'Wysyłka i Zwroty' },
  ];

  return (
    <>
      {/* Announcement Ticker */}
      <div
        className="bg-[#0B0B0C] text-[#C8794B] text-[10px] sm:text-[11px] uppercase tracking-[0.2em] py-2 overflow-hidden border-b border-[#26262A] select-none"
        aria-hidden="true"
      >
        <div className="flex whitespace-nowrap animate-marquee">
          <span className="pr-10">
            {dynamicAnnouncement ||
              'WARSZAWA ATELIER • 100% JEDWAB MORWOWY 19 MOMME • PROMOCJA 2+1 (TRZECI MODEL ZA 1 ZŁ) • PACZKOMAT INPOST 0 ZŁ WYSYŁKA 24H • BEZPŁATNA DOSTAWA W UE OD 250 ZŁ'}
          </span>
          <span className="pr-10">
            {dynamicAnnouncement ||
              'WARSZAWA ATELIER • 100% JEDWAB MORWOWY 19 MOMME • PROMOCJA 2+1 (TRZECI MODEL ZA 1 ZŁ) • PACZKOMAT INPOST 0 ZŁ WYSYŁKA 24H • BEZPŁATNA DOSTAWA W UE OD 250 ZŁ'}
          </span>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0B0B0C]/95 backdrop-blur-md text-[#FAFAF9] border-b border-[#26262A] shadow-2xl py-2'
            : 'bg-[#0B0B0C]/90 backdrop-blur-md text-[#FAFAF9] border-b border-white/10 py-3 sm:py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group py-1">
            <Image
              src="/assets/logo_white.png"
              alt="Warsaw Durag Store"
              width={260}
              height={80}
              className="h-9 sm:h-11 md:h-12 w-auto object-contain transition-all duration-300 group-hover:brightness-110"
              priority
            />
          </Link>

          {/* Desktop Navigation with Atelier Numbering & Serif Italic Hover */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-xs font-medium tracking-[0.14em] text-[#ECEAE7]">
            {[
              { href: '/kolekcja/all', num: '01', label: t.navAll || 'Katalog' },
              { href: '/kolekcja/silk', num: '02', label: t.navSilk || 'Jedwab 19 Momme' },
              { href: '/kolekcja/satin', num: '03', label: t.navSatin || 'Satyna' },
              { href: '/kolekcja/velvet', num: '04', label: t.navVelvet || 'Welur' },
              { href: '/poradnik/wave-guide', num: '05', label: t.navGuide || 'Wave Guide', highlight: true },
              { href: '/o-nas', num: '06', label: 'Atelier' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group relative flex items-baseline gap-1.5 py-2 uppercase transition-all duration-200"
              >
                <span className="text-[9px] font-mono text-[#C8794B]/80 group-hover:text-[#C8794B] transition-colors">
                  {item.num}
                </span>
                <span
                  className={`transition-colors duration-200 group-hover:text-[#C8794B] group-hover:font-serif group-hover:italic ${
                    item.highlight ? 'text-[#C8794B] font-semibold' : ''
                  }`}
                >
                  {item.label}
                </span>
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#C8794B] transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Right Controls: Currency Toggle, Lang Dropdown, Search & Cart */}
          <div className="flex items-center gap-2 sm:gap-3.5">
            {/* Currency Pill Switcher (Desktop) */}
            <div className="hidden sm:inline-flex items-center border border-[#26262A] rounded-none p-0.5 text-[10px] font-mono uppercase bg-[#141416]">
              <button
                onClick={() => setCurrency('PLN')}
                className={`px-2 py-1 transition-colors ${
                  currency === 'PLN'
                    ? 'bg-[#C8794B] text-[#0B0B0C] font-bold'
                    : 'text-[#787570] hover:text-[#FAFAF9]'
                }`}
                title="Waluta PLN"
              >
                PLN
              </button>
              <button
                onClick={() => setCurrency('EUR')}
                className={`px-2 py-1 transition-colors ${
                  currency === 'EUR'
                    ? 'bg-[#C8794B] text-[#0B0B0C] font-bold'
                    : 'text-[#787570] hover:text-[#FAFAF9]'
                }`}
                title="Currency EUR"
              >
                EUR
              </button>
            </div>

            {/* Language Selector (Desktop) */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1 text-[11px] font-mono uppercase tracking-wider px-2 py-1 border border-[#26262A] bg-[#141416] text-[#FAFAF9] hover:border-[#C8794B] transition-colors"
                title="Wybierz język / Change language"
              >
                <Globe className="w-3.5 h-3.5 text-[#C8794B]" />
                <span>{language}</span>
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-[#0B0B0C] border border-[#26262A] shadow-2xl py-1 z-50 text-xs font-mono font-medium text-[#ECEAE7]">
                  {languages.map(({ code, label }) => (
                    <button
                      key={code}
                      onClick={() => {
                        setLanguage(code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-1.5 hover:bg-[#1A1A1B] hover:text-[#C8794B] flex items-center justify-between transition-colors ${
                        language === code ? 'text-[#C8794B] font-bold bg-white/5' : ''
                      }`}
                    >
                      <span>{label}</span>
                      <span className="text-[10px] text-[#C8794B]">{code}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search Link */}
            <Link
              href="/szukaj"
              className="p-2 text-[#ECEAE7] hover:text-[#C8794B] transition-colors focus:outline-none"
              aria-label="Szukaj produktów"
              title="Szukaj produktów"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.6]" />
            </Link>

            {/* Cart Trigger Button (opens Drawer or links to /koszyk) */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-[#ECEAE7] hover:text-[#C8794B] transition-colors focus:outline-none cursor-pointer"
              aria-label="Twój koszyk"
              title="Otwórz koszyk"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.6]" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#C8794B] text-[#0B0B0C] text-[9px] font-mono font-bold px-1 min-w-[16px] h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-[#FAFAF9] hover:text-[#C8794B] transition-colors focus:outline-none"
              aria-label="Otwórz menu nawigacji"
            >
              <Menu className="w-5 h-5 stroke-[1.8]" />
            </button>
          </div>
        </div>
      </header>

      {/* Luxury Mobile Navigation Off-Canvas Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Sliding Drawer */}
          <div
            className="relative w-full max-w-[340px] sm:max-w-sm bg-[#0B0B0C] text-white h-full shadow-2xl flex flex-col z-10 border-r border-[#26262A] animate-slide-right overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Menu nawigacji"
          >
            {/* Drawer Header */}
            <div className="p-4 border-b border-[#26262A] flex items-center justify-between bg-[#141416]">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2"
              >
                <Image
                  src="/assets/logo_white.png"
                  alt="Warsaw Durag Store"
                  width={180}
                  height={50}
                  className="h-8 w-auto object-contain"
                />
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-gray-400 hover:text-white transition-colors focus:outline-none"
                aria-label="Zamknij menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Promo Bar */}
            <div className="bg-[#141416] border-b border-[#26262A] px-4 py-2.5 flex items-center justify-between text-[11px] font-mono text-[#C8794B]">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#C8794B]" />
                Zestaw 2+1 za 1 zł
              </span>
              <span className="text-[#787570]">Wysyłka 24h</span>
            </div>

            {/* Scrollable Nav Content */}
            <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6 text-sm">
              {/* Currency & Language Row */}
              <div className="flex items-center justify-between border-b border-[#26262A] pb-4">
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#787570]">
                  Waluta &amp; Język
                </span>
                <div className="flex items-center gap-2">
                  <div className="inline-flex border border-[#26262A] text-[10px] font-mono">
                    <button
                      onClick={() => setCurrency('PLN')}
                      className={`px-2 py-0.5 ${
                        currency === 'PLN' ? 'bg-[#C8794B] text-[#0B0B0C] font-bold' : 'text-gray-400'
                      }`}
                    >
                      PLN
                    </button>
                    <button
                      onClick={() => setCurrency('EUR')}
                      className={`px-2 py-0.5 ${
                        currency === 'EUR' ? 'bg-[#C8794B] text-[#0B0B0C] font-bold' : 'text-gray-400'
                      }`}
                    >
                      EUR
                    </button>
                  </div>

                  <div className="flex gap-1 font-mono text-[10px]">
                    {languages.slice(0, 3).map(({ code }) => (
                      <button
                        key={code}
                        onClick={() => setLanguage(code)}
                        className={`px-1.5 py-0.5 border ${
                          language === code
                            ? 'border-[#C8794B] text-[#C8794B] font-bold'
                            : 'border-[#26262A] text-gray-400'
                        }`}
                      >
                        {code}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Main Categories */}
              <div>
                <p className="text-[10px] uppercase font-mono font-semibold tracking-[0.2em] text-[#C8794B] mb-3 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#C8794B] inline-block rotate-45" />
                  Kolekcje &amp; Tkaniny
                </p>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <Link
                      key={cat.href}
                      href={cat.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="group flex items-center justify-between py-2.5 px-3 hover:bg-[#141416] transition-all text-[#ECEAE7] hover:text-[#FAFAF9] border-b border-[#26262A]/60"
                    >
                      <span className="font-medium text-xs">{cat.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono px-1.5 py-0.5 border border-[#26262A] text-[#C8794B]">
                          {cat.badge}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-[#C8794B] transition-colors" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* 360 Wave Guide Banner Box */}
              <div className="p-3.5 bg-[#141416] border border-[#C8794B]/30">
                <div className="flex items-center gap-2 text-[#C8794B] mb-1 font-mono font-bold text-xs uppercase tracking-wider">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>360 Waves Kompendium</span>
                </div>
                <p className="text-[11px] text-gray-300 mb-3 leading-relaxed font-light">
                  Kompletny poradnik pielęgnacji fal, doboru szczotki i wiązania duraga bez odcisków.
                </p>
                <Link
                  href="/poradnik/wave-guide"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center justify-center w-full py-2 px-3 bg-[#C8794B] text-[#0B0B0C] font-mono font-bold uppercase tracking-wider text-[11px] hover:bg-white transition-colors"
                >
                  Zobacz poradnik fal 360 →
                </Link>
              </div>

              {/* Information & Store links */}
              <div>
                <p className="text-[10px] uppercase font-mono font-semibold tracking-[0.2em] text-[#787570] mb-2">
                  Atelier &amp; Informacje
                </p>
                <div className="space-y-1">
                  {infoLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-2 px-3 text-xs text-gray-300 hover:text-white hover:bg-[#141416] transition-colors border-b border-[#26262A]/40 font-light"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Local Pickup Info */}
              <div className="pt-2 border-t border-[#26262A] text-[11px] text-[#787570] space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#C8794B] mt-0.5 shrink-0" />
                  <span>Odbiór osobisty: Warszawa (Włodarzewska 4 / Centrum)</span>
                </div>
              </div>
            </div>

            {/* Drawer Bottom Bar: Direct Cart Action */}
            <div className="p-4 border-t border-[#26262A] bg-[#141416]">
              <Link
                href="/koszyk"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#C8794B] text-[#0B0B0C] hover:bg-[#FAFAF9] font-mono font-bold text-xs tracking-[0.16em] uppercase transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Twój Koszyk ({cartCount})</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
