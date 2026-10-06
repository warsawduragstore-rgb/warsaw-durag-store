'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Search, Menu, X, Sun, Moon } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';

export default function Header() {
  const { cartCount, setIsCartOpen } = useCart();
  const { language, setLanguage, currency, setCurrency, t, isEn } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const categories = [
    { href: '/kolekcja/silk', label: t.navSilk },
    { href: '/kolekcja/satin', label: t.navSatin },
    { href: '/kolekcja/velvet', label: t.navVelvet },
    { href: '/kolekcja/all', label: t.navAll },
    { href: '/poradnik/wave-guide', label: t.navGuide },
    { href: '/o-nas', label: t.navAbout },
  ];

  return (
    <>
      {/* Top static bar: graphite/black, factual copy */}
      <div className="bg-[#141416] text-[#ECEAE7] text-[13px] font-medium py-2 px-4 text-center border-b border-[#1E1E22] tracking-[0.02em]">
        {t.announcement}
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-200 ${
          isScrolled
            ? 'bg-[#0B0B0C]/95 backdrop-blur-md border-b border-[#1E1E22] py-3'
            : 'bg-[#0B0B0C] border-b border-[#1E1E22] py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Brand Logo (Instant CSS switch, no hydration flicker) */}
          <Link href="/" className="flex items-center group">
            <Image
              src="/assets/logo_white.png"
              alt="Warsaw Durag Store"
              width={240}
              height={70}
              className="h-8 sm:h-9 w-auto object-contain transition-opacity duration-200 group-hover:opacity-85 dark-logo"
              priority
            />
            <Image
              src="/assets/logo_black.png"
              alt="Warsaw Durag Store"
              width={240}
              height={70}
              className="h-8 sm:h-9 w-auto object-contain transition-opacity duration-200 group-hover:opacity-85 light-logo"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7 text-[14px] font-medium text-[#ECEAE7] tracking-[0.02em]">
            <Link href="/kolekcja/silk" className="hover:text-white transition-colors">
              {t.navSilk}
            </Link>
            <Link href="/kolekcja/satin" className="hover:text-white transition-colors">
              {t.navSatin}
            </Link>
            <Link href="/kolekcja/velvet" className="hover:text-white transition-colors">
              {t.navVelvet}
            </Link>
            <Link href="/kolekcja/all" className="hover:text-white transition-colors">
              {t.navAll}
            </Link>
            <Link href="/poradnik/wave-guide" className="hover:text-white text-[#C8794B] transition-colors">
              {t.navGuide}
            </Link>
            <Link href="/o-nas" className="text-[#A3A09B] hover:text-white transition-colors">
              {t.navAbout}
            </Link>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 sm:px-2.5 sm:py-1 border border-[#1E1E22] bg-[#141416] text-[#ECEAE7] hover:border-[#787570] hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-[13px] font-medium"
              title={theme === 'dark' ? (isEn ? 'Switch to light mode' : 'Przełącz na jasny motyw') : (isEn ? 'Switch to dark mode' : 'Przełącz na ciemny motyw')}
              aria-label={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-[#C8794B]" />
                  <span className="hidden xl:inline text-[12px]">{isEn ? 'Light' : 'Jasny'}</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-[#C8794B]" />
                  <span className="hidden xl:inline text-[12px]">{isEn ? 'Dark' : 'Ciemny'}</span>
                </>
              )}
            </button>

            {/* Language toggle: strictly PL / EN */}
            <div className="hidden sm:inline-flex items-center border border-[#1E1E22] text-[13px] font-medium bg-[#141416]">
              <button
                onClick={() => setLanguage('PL')}
                className={`px-2.5 py-1 transition-colors cursor-pointer ${
                  language === 'PL' ? 'bg-[#ECEAE7] text-[#0B0B0C] font-semibold' : 'text-[#787570] hover:text-white'
                }`}
                aria-label="Język polski"
              >
                PL
              </button>
              <button
                onClick={() => setLanguage('EN')}
                className={`px-2.5 py-1 transition-colors cursor-pointer ${
                  language === 'EN' ? 'bg-[#ECEAE7] text-[#0B0B0C] font-semibold' : 'text-[#787570] hover:text-white'
                }`}
                aria-label="English language"
              >
                EN
              </button>
            </div>

            {/* Currency switch */}
            <div className="hidden sm:inline-flex items-center border border-[#1E1E22] text-[13px] font-medium bg-[#141416]">
              <button
                onClick={() => setCurrency('PLN')}
                className={`px-2.5 py-1 transition-colors cursor-pointer ${
                  currency === 'PLN' ? 'bg-[#ECEAE7] text-[#0B0B0C] font-semibold' : 'text-[#787570] hover:text-white'
                }`}
              >
                PLN
              </button>
              <button
                onClick={() => setCurrency('EUR')}
                className={`px-2.5 py-1 transition-colors cursor-pointer ${
                  currency === 'EUR' ? 'bg-[#ECEAE7] text-[#0B0B0C] font-semibold' : 'text-[#787570] hover:text-white'
                }`}
              >
                EUR
              </button>
            </div>

            {/* Search */}
            <Link
              href="/szukaj"
              className="p-2 text-[#ECEAE7] hover:text-white transition-colors"
              aria-label={isEn ? 'Search' : 'Szukaj'}
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.6]" />
            </Link>

            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-[#ECEAE7] hover:text-white transition-colors cursor-pointer"
              aria-label={t.cartTitle}
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.6]" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#C8794B] text-white text-[11px] font-medium tabular-nums px-1 min-w-[16px] h-4 flex items-center justify-center rounded-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-white hover:text-[#C8794B] transition-colors"
              aria-label="Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-full max-w-[320px] bg-[#0B0B0C] text-white h-full shadow-2xl flex flex-col z-10 border-r border-[#1E1E22]">
            <div className="p-4 border-b border-[#1E1E22] flex items-center justify-between">
              <div className="flex items-center">
                <Image
                  src="/assets/logo_white.png"
                  alt="Warsaw Durag Store"
                  width={160}
                  height={40}
                  className="h-7 w-auto object-contain dark-logo"
                />
                <Image
                  src="/assets/logo_black.png"
                  alt="Warsaw Durag Store"
                  width={160}
                  height={40}
                  className="h-7 w-auto object-contain light-logo"
                />
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile quick controls: Theme, Language (PL/EN), Currency */}
            <div className="p-3 border-b border-[#1E1E22] bg-[#141416] flex flex-wrap items-center justify-between gap-2">
              <button
                onClick={toggleTheme}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs border border-[#1E1E22] bg-[#0B0B0C] text-[#ECEAE7]"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-[#C8794B]" />
                    <span>{isEn ? 'Light mode' : 'Jasny motyw'}</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-[#C8794B]" />
                    <span>{isEn ? 'Dark mode' : 'Ciemny motyw'}</span>
                  </>
                )}
              </button>

              <div className="inline-flex items-center border border-[#1E1E22] text-xs font-medium bg-[#0B0B0C]">
                <button
                  onClick={() => setLanguage('PL')}
                  className={`px-2 py-1 ${language === 'PL' ? 'bg-[#ECEAE7] text-[#0B0B0C] font-semibold' : 'text-[#787570]'}`}
                >
                  PL
                </button>
                <button
                  onClick={() => setLanguage('EN')}
                  className={`px-2 py-1 ${language === 'EN' ? 'bg-[#ECEAE7] text-[#0B0B0C] font-semibold' : 'text-[#787570]'}`}
                >
                  EN
                </button>
              </div>

              <div className="inline-flex items-center border border-[#1E1E22] text-xs font-medium bg-[#0B0B0C]">
                <button
                  onClick={() => setCurrency('PLN')}
                  className={`px-2 py-1 ${currency === 'PLN' ? 'bg-[#ECEAE7] text-[#0B0B0C] font-semibold' : 'text-[#787570]'}`}
                >
                  PLN
                </button>
                <button
                  onClick={() => setCurrency('EUR')}
                  className={`px-2 py-1 ${currency === 'EUR' ? 'bg-[#ECEAE7] text-[#0B0B0C] font-semibold' : 'text-[#787570]'}`}
                >
                  EUR
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="space-y-1 text-[14px] font-medium tracking-[0.02em]">
                {categories.map((cat) => (
                  <Link
                    key={cat.href}
                    href={cat.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2.5 px-3 hover:bg-[#141416] text-[#ECEAE7] hover:text-white transition-colors border-b border-[#1E1E22]"
                  >
                    {cat.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-[#1E1E22] bg-[#141416]">
              <Link
                href="/koszyk"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#C8794B] text-white font-medium text-[13px] tracking-[0.02em]"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{isEn ? 'Your Cart' : 'Twój Koszyk'} <span className="tabular-nums">({cartCount})</span></span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
