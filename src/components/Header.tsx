'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Search, Menu, X, Globe, ChevronRight, BookOpen, MapPin, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLanguage, Language } from '@/context/LanguageContext';

export default function Header() {
  const { cartCount, setIsCartOpen } = useCart();
  const { language, setLanguage, t } = useLanguage();
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
      if (window.scrollY > 40) {
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
    { href: '/kolekcja/all', label: t.navAll || 'Wszystkie Duragi', badge: '31 modeli' },
    { href: '/kolekcja/silk', label: t.navSilk || 'Jedwab Morwowy', badge: '19 Momme' },
    { href: '/kolekcja/satin', label: t.navSatin || 'Satyna Premium', badge: 'Bestseller' },
    { href: '/kolekcja/velvet', label: t.navVelvet || 'Welur Luksusowy', badge: 'Ciepły & Mięsisty' },
    { href: '/kolekcja/seasonal', label: t.navSeasonal || 'Materiały Sezonowe', badge: 'Limitowane' },
    { href: '/kolekcja/accessories', label: t.navAccessories || 'Akcesoria do Fal', badge: '360 Waves' },
  ];

  const infoLinks = [
    { href: '/o-nas', label: 'O nas i Atelier Warszawa' },
    { href: '/blog', label: 'Blog & Kompendium' },
    { href: '/poradnik/wave-guide', label: 'Poradnik 360 Waves' },
    { href: '/strona/kontakt', label: 'Kontakt & Odbiór w Warszawie' },
    { href: '/strona/dostawa-i-zwroty', label: 'Wysyłka i Zwroty 14 dni' },
  ];

  return (
    <>
      {/* Announcement Ticker */}
      <div className="bg-[#0D0D0B] text-[#D9A87E] text-[11px] uppercase tracking-[0.15em] py-2 overflow-hidden border-b border-[#3B3C40]/30 select-none" aria-hidden="true">
        <div className="flex whitespace-nowrap animate-marquee">
          <span className="pr-8">{dynamicAnnouncement || t.announcement}</span>
          <span className="pr-8">{dynamicAnnouncement || t.announcement}</span>
          <span className="pr-8">{dynamicAnnouncement || t.announcement}</span>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header
        className={`sticky top-0 z-40 transition-colors duration-300 ${
          isScrolled
            ? 'bg-[#0D0D0B] text-white border-b border-white/10 shadow-lg'
            : 'bg-white/90 backdrop-blur-md text-[#0D0D0B] border-b border-[#CFCFCF]/50'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 sm:h-24 md:h-28 flex items-center justify-between">
          
          {/* Logo with double color version */}
          <Link href="/" className="flex items-center gap-3 group py-2">
            <Image
              src={isScrolled ? "/assets/logo_white.png" : "/assets/logo_black.png"}
              alt="Warsaw Durag Store Logo"
              width={280}
              height={100}
              className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto object-contain transition-all duration-300 transform group-hover:scale-105"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className={`hidden lg:flex items-center gap-5 xl:gap-6 text-xs font-semibold uppercase tracking-[0.12em] ${isScrolled ? 'text-gray-200' : 'text-[#3B3C40]'}`}>
            <Link href="/kolekcja/all" className="hover:text-[#D9A87E] transition-colors py-2">{t.navAll}</Link>
            <Link href="/kolekcja/silk" className="hover:text-[#D9A87E] transition-colors py-2">{t.navSilk}</Link>
            <Link href="/kolekcja/satin" className="hover:text-[#D9A87E] transition-colors py-2">{t.navSatin}</Link>
            <Link href="/kolekcja/velvet" className="hover:text-[#D9A87E] transition-colors py-2">{t.navVelvet}</Link>
            <Link href="/o-nas" className="hover:text-[#D9A87E] transition-colors py-2">O nas</Link>
            <Link href="/blog" className="hover:text-[#D9A87E] transition-colors py-2">Blog</Link>
            <Link href="/poradnik/wave-guide" className="hover:text-[#D9A87E] transition-colors py-2 text-[#D9A87E]">{t.navGuide}</Link>
          </nav>

          {/* Cart & Language Selector & Hamburger */}
          <div className="flex items-center gap-2 sm:gap-4">
               {/* Multi-language Selector (Desktop) */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className={`flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-1 border transition-colors ${
                  isScrolled 
                    ? 'border-white/20 hover:border-[#D9A87E] text-white bg-white/5' 
                    : 'border-gray-300 hover:border-[#0D0D0B] text-[#0D0D0B] bg-white'
                }`}
                title="Wybierz język / Change language"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{language}</span>
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-[#0D0D0B] border border-white/20 shadow-2xl py-1 z-50 text-xs font-mono font-medium text-gray-200">
                  {languages.map(({ code, label }) => (
                    <button
                      key={code}
                      onClick={() => {
                        setLanguage(code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-[#1A1A1A] hover:text-[#D9A87E] flex items-center justify-between transition-colors ${
                        language === code ? 'text-[#D9A87E] font-bold bg-white/5' : ''
                      }`}
                    >
                      <span>{label}</span>
                      <span className="text-[10px] text-gray-400 font-mono">[{code}]</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search Button */}
            <Link
              href="/szukaj"
              className={`p-2 transition-colors focus:outline-none ${
                isScrolled ? 'text-white hover:text-[#D9A87E]' : 'text-[#0D0D0B] hover:text-[#734C1D]'
              }`}
              aria-label="Szukaj produktów"
              title="Szukaj produktów"
            >
              <Search className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.5]" />
            </Link>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className={`relative p-2 transition-colors focus:outline-none ${
                isScrolled ? 'text-white hover:text-[#D9A87E]' : 'text-[#0D0D0B] hover:text-[#734C1D]'
              }`}
              aria-label="Otwórz koszyk"
            >
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.5]" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#D9A87E] text-[#0D0D0B] text-[9px] font-mono font-bold px-1 min-w-[16px] h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className={`lg:hidden p-2 transition-colors focus:outline-none ${
                isScrolled 
                  ? 'text-white hover:bg-white/10' 
                  : 'text-[#0D0D0B] hover:bg-gray-100'
              }`}
              aria-label="Otwórz menu nawigacji"
            >
              <Menu className="w-6 h-6 stroke-[1.8]" />
            </button>
          </div>

        </div>
      </header>

      {/* Luxury Mobile Navigation Off-Canvas Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Sliding Drawer from Left */}
          <div 
            className="relative w-full max-w-[340px] sm:max-w-sm bg-[#0D0D0B] text-white h-full shadow-2xl flex flex-col z-10 border-r border-white/10 animate-slide-right overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Menu nawigacji"
          >
            {/* Drawer Header */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#141412]">
              <Link 
                href="/" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2"
              >
                <Image
                  src="/assets/logo_white.png"
                  alt="Warsaw Durag Store Logo"
                  width={180}
                  height={50}
                  className="h-9 w-auto object-contain"
                />
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-gray-400 hover:text-white transition-colors focus:outline-none"
                aria-label="Zamknij menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Promo Bar */}
            <div className="bg-[#161614] border-b border-white/10 px-5 py-2.5 flex items-center justify-between text-[11px] font-mono text-[#D9A87E]">
              <span>[ PROMOCJA 2+1 GRATIS ]</span>
              <span className="text-gray-400">WARSZAWA 24H</span>
            </div>

            {/* Scrollable Nav Content */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6 text-sm">
              
              {/* Mobile Search Form */}
              <form
                action="/szukaj"
                onSubmit={() => setMobileMenuOpen(false)}
                className="relative"
              >
                <input
                  type="search"
                  name="q"
                  placeholder="Szukaj (jedwab, satyna, model)..."
                  className="w-full bg-[#1C1C1A] text-white pl-10 pr-4 py-2.5 text-xs border border-white/15 focus:outline-none focus:border-[#D9A87E] placeholder-gray-400 font-mono"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </form>

              {/* Main Categories */}
              <div>
                <p className="text-[10px] uppercase font-mono font-bold tracking-[0.2em] text-[#D9A87E] mb-3">
                  [ KOLEKCJE & MATERIAŁY ]
                </p>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <Link
                      key={cat.href}
                      href={cat.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="group flex items-center justify-between py-2.5 px-3 hover:bg-white/5 transition-all text-gray-200 hover:text-white border-b border-white/5"
                    >
                      <span className="font-medium">{cat.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono px-1.5 py-0.5 border border-white/10 text-[#D9A87E] font-medium">
                          {cat.badge}
                        </span>
                        <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-[#D9A87E] transition-colors" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* 360 Wave Guide Banner Box */}
              <div className="p-4 bg-[#141412] border border-[#D9A87E]/40">
                <div className="flex items-center gap-2 text-[#D9A87E] mb-1.5 font-mono font-bold text-xs uppercase tracking-wider">
                  <BookOpen className="w-4 h-4" />
                  <span>360 Waves Kompendium</span>
                </div>
                <p className="text-xs text-gray-300 mb-3 leading-relaxed font-light">
                  Jak dbać o fale, dobrać szczotkę i wiązać durag bez śladów na czole.
                </p>
                <Link
                  href="/poradnik/wave-guide"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center justify-center w-full py-2.5 px-3 bg-[#D9A87E] text-[#0D0D0B] font-mono font-bold uppercase tracking-wider text-xs hover:bg-white transition-colors"
                >
                  Zobacz poradnik fal 360 →
                </Link>
              </div>

              {/* Information & Store links */}
              <div>
                <p className="text-[10px] uppercase font-mono font-bold tracking-[0.2em] text-gray-400 mb-3">
                  [ INFORMACJE & ATELIER ]
                </p>
                <div className="space-y-1">
                  {infoLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-2 px-3 text-xs text-gray-300 hover:text-white hover:bg-white/5 transition-colors border-b border-white/5 font-light"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Language Switcher in Mobile Menu */}
              <div>
                <p className="text-[10px] uppercase font-mono font-bold tracking-[0.2em] text-[#D9A87E] mb-2 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-[#D9A87E]" />
                  <span>[ WYBIERZ JĘZYK ]</span>
                </p>
                <div className="flex flex-wrap gap-1.5 font-mono">
                  {languages.map(({ code, label }) => (
                    <button
                      key={code}
                      onClick={() => {
                        setLanguage(code);
                      }}
                      className={`px-3 py-1 text-xs font-semibold transition-all border ${
                        language === code
                          ? 'bg-[#D9A87E] text-[#0D0D0B] border-[#D9A87E]'
                          : 'bg-white/5 border-white/15 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      {code} <span className="opacity-70 text-[10px]">({label})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Local Pickup & Social Contact */}
              <div className="pt-2 border-t border-white/10 text-xs text-gray-400 space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#D9A87E] mt-0.5 flex-shrink-0" />
                  <span>Odbiór osobisty: Warszawa Ochota / Centrum</span>
                </div>
                <div className="flex items-center gap-4 pt-1 text-gray-300">
                  <a
                    href="https://instagram.com/warsawduragstore"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 hover:text-[#D9A87E] transition-colors"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    <span>Instagram</span>
                  </a>
                  <a
                    href="https://youtube.com/@warsawduragstore"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 hover:text-[#D9A87E] transition-colors"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    <span>YouTube</span>
                  </a>
                </div>
              </div>

            </div>

            {/* Drawer Bottom Bar: Direct Action */}
            <div className="p-4 border-t border-white/10 bg-[#141412] flex items-center justify-between">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsCartOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-white text-[#0D0D0B] hover:bg-[#D9A87E] font-mono font-bold text-xs tracking-[0.2em] uppercase transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>[ TWÓJ KOSZYK: {cartCount} ]</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
