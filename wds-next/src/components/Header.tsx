'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Search, Menu, X, Globe, ChevronRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLanguage, Language } from '@/context/LanguageContext';

export default function Header() {
  const { cartCount, setIsCartOpen } = useCart();
  const { language, setLanguage, currency, setCurrency, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

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

  const languages: { code: Language; label: string }[] = [
    { code: 'PL', label: 'Polski' },
    { code: 'EN', label: 'English' },
    { code: 'DE', label: 'Deutsch' },
    { code: 'FR', label: 'Français' },
    { code: 'ES', label: 'Español' },
  ];

  const categories = [
    { href: '/kolekcja/all', label: 'Wszystkie duragi' },
    { href: '/kolekcja/silk', label: 'Jedwab morwowy 19 Momme' },
    { href: '/kolekcja/satin', label: 'Satyna' },
    { href: '/kolekcja/velvet', label: 'Welur (kompresja)' },
    { href: '/kolekcja/seasonal', label: 'Kolekcje sezonowe' },
    { href: '/kolekcja/accessories', label: 'Akcesoria & Fale 360' },
  ];

  return (
    <>
      {/* Top minimal bar */}
      <div className="bg-[#0B0B0C] text-[#C8794B] text-[10px] uppercase font-mono tracking-[0.2em] py-2 px-4 text-center border-b border-[#1E1E22]">
        Kup 2 duragi, 3. model za 1 zł • Darmowy Paczkomat w Polsce • Wysyłka w 24h z Warszawy
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-200 ${
          isScrolled
            ? 'bg-[#0B0B0C]/95 backdrop-blur-md border-b border-[#26262A] py-3'
            : 'bg-[#0B0B0C] border-b border-[#1E1E22] py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center group">
            <Image
              src="/assets/logo_white.png"
              alt="Warsaw Durag Store"
              width={240}
              height={70}
              className="h-8 sm:h-10 w-auto object-contain transition-opacity duration-200 group-hover:opacity-85"
              priority
            />
          </Link>

          {/* Clean Desktop Navigation (No fake numbering, authentic streetwear) */}
          <nav className="hidden lg:flex items-center gap-7 text-[11px] font-mono uppercase tracking-[0.18em] text-[#ECEAE7]">
            <Link href="/kolekcja/silk" className="hover:text-[#C8794B] transition-colors">
              Jedwab 19 Momme
            </Link>
            <Link href="/kolekcja/satin" className="hover:text-[#C8794B] transition-colors">
              Satyna
            </Link>
            <Link href="/kolekcja/velvet" className="hover:text-[#C8794B] transition-colors">
              Welur
            </Link>
            <Link href="/kolekcja/all" className="hover:text-[#C8794B] transition-colors">
              Wszystkie
            </Link>
            <Link href="/poradnik/wave-guide" className="hover:text-[#C8794B] transition-colors text-[#C8794B]">
              Wave Guide
            </Link>
            <Link href="/o-nas" className="hover:text-[#C8794B] transition-colors text-[#A3A09B]">
              O nas
            </Link>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Currency switch */}
            <div className="hidden sm:inline-flex items-center border border-[#26262A] text-[10px] font-mono uppercase bg-[#141416]">
              <button
                onClick={() => setCurrency('PLN')}
                className={`px-2 py-1 transition-colors ${
                  currency === 'PLN' ? 'bg-[#C8794B] text-[#0B0B0C] font-bold' : 'text-[#787570] hover:text-white'
                }`}
              >
                PLN
              </button>
              <button
                onClick={() => setCurrency('EUR')}
                className={`px-2 py-1 transition-colors ${
                  currency === 'EUR' ? 'bg-[#C8794B] text-[#0B0B0C] font-bold' : 'text-[#787570] hover:text-white'
                }`}
              >
                EUR
              </button>
            </div>

            {/* Language toggle */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1 text-[11px] font-mono uppercase px-2 py-1 border border-[#26262A] bg-[#141416] text-[#FAFAF9] hover:border-[#C8794B] transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-[#C8794B]" />
                <span>{language}</span>
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-[#141416] border border-[#26262A] shadow-2xl py-1 z-50 text-xs font-mono text-[#ECEAE7]">
                  {languages.map(({ code, label }) => (
                    <button
                      key={code}
                      onClick={() => {
                        setLanguage(code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 hover:bg-[#1E1E22] hover:text-[#C8794B] flex items-center justify-between transition-colors ${
                        language === code ? 'text-[#C8794B] font-bold' : ''
                      }`}
                    >
                      <span>{label}</span>
                      <span className="text-[10px] text-[#787570]">{code}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search */}
            <Link
              href="/szukaj"
              className="p-2 text-[#ECEAE7] hover:text-[#C8794B] transition-colors"
              aria-label="Szukaj"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.6]" />
            </Link>

            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-[#ECEAE7] hover:text-[#C8794B] transition-colors cursor-pointer"
              aria-label="Koszyk"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.6]" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#C8794B] text-[#0B0B0C] text-[9px] font-mono font-bold px-1 min-w-[16px] h-4 flex items-center justify-center">
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
          <div className="relative w-full max-w-[320px] bg-[#0B0B0C] text-white h-full shadow-2xl flex flex-col z-10 border-r border-[#26262A]">
            <div className="p-4 border-b border-[#26262A] flex items-center justify-between">
              <Image
                src="/assets/logo_white.png"
                alt="Warsaw Durag Store"
                width={160}
                height={40}
                className="h-7 w-auto object-contain"
              />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="space-y-1 font-mono uppercase text-xs tracking-wider">
                {categories.map((cat) => (
                  <Link
                    key={cat.href}
                    href={cat.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2.5 px-3 hover:bg-[#141416] text-[#ECEAE7] hover:text-[#C8794B] transition-colors border-b border-[#1E1E22]"
                  >
                    {cat.label}
                  </Link>
                ))}
                <Link
                  href="/poradnik/wave-guide"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2.5 px-3 text-[#C8794B] hover:bg-[#141416] transition-colors border-b border-[#1E1E22]"
                >
                  Poradnik 360 Waves
                </Link>
                <Link
                  href="/o-nas"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2.5 px-3 text-gray-400 hover:bg-[#141416] hover:text-white transition-colors"
                >
                  O nas & Pracownia
                </Link>
              </div>
            </div>

            <div className="p-4 border-t border-[#26262A] bg-[#141416]">
              <Link
                href="/koszyk"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#C8794B] text-[#0B0B0C] font-mono font-bold text-xs uppercase tracking-wider"
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
