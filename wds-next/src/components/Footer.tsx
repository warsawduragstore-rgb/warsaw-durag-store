'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { MapPin, Mail, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

export default function Footer() {
  const { t, language } = useLanguage();
  const isEn = language === 'EN';

  return (
    <footer className="bg-[#0B0B0C] text-[#FAFAF9] border-t border-[#1A1A1B] pt-20 pb-12 font-sans selection:bg-[#C8794B] selection:text-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Top Trust Pillars Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-16 border-b border-[#1A1A1B]">
          <div className="flex items-start gap-3.5">
            <Truck className="w-5 h-5 text-[#C8794B] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs uppercase tracking-widest font-semibold text-white">
                {isEn ? 'Dispatch in 24h' : 'Wysyłka w 24h'}
              </h4>
              <p className="text-[11px] text-[#6B6B6B] mt-0.5 leading-relaxed">
                {isEn ? 'Handcrafted & shipped from Warsaw' : 'Wysyłka z Warszawy w 1–2 dni robocze'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <MapPin className="w-5 h-5 text-[#C8794B] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs uppercase tracking-widest font-semibold text-white">
                {isEn ? 'Free Delivery PL' : 'Darmowa Dostawa PL'}
              </h4>
              <p className="text-[11px] text-[#6B6B6B] mt-0.5 leading-relaxed">
                {isEn ? 'InPost Lockers 24/7 with zero threshold' : 'Paczkomaty InPost 24/7 bez progu kwotowego'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <RefreshCw className="w-5 h-5 text-[#C8794B] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs uppercase tracking-widest font-semibold text-white">
                {isEn ? '14-Day Returns' : '14 Dni na Zwrot'}
              </h4>
              <p className="text-[11px] text-[#6B6B6B] mt-0.5 leading-relaxed">
                {isEn ? 'Hassle-free consumer protection in EU' : 'Pełne prawo do bezpiecznego zwrotu w UE'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <ShieldCheck className="w-5 h-5 text-[#C8794B] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs uppercase tracking-widest font-semibold text-white">
                {isEn ? '19 Momme Pure Silk' : 'Jedwab 19 Momme'}
              </h4>
              <p className="text-[11px] text-[#6B6B6B] mt-0.5 leading-relaxed">
                {isEn ? 'Grade 6A Mulberry Silk & artisan seams' : 'Prawdziwy jedwab morwowy i płaskie szwy'}
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Navigation & Company Info */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 py-16 border-b border-[#1A1A1B]">
          
          {/* Col 1: Brand & Manifesto (4 cols) */}
          <div className="md:col-span-4 space-y-4">
            <Link href="/" className="inline-block group">
              <span className="font-serif text-2xl lg:text-3xl font-medium tracking-tight text-white block">
                Warsaw Durag Store
              </span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#C8794B] font-medium block mt-1">
                Atelier Warszawa • Ręczne Rzemiosło
              </span>
            </Link>
            <p className="text-xs text-[#6B6B6B] font-normal leading-relaxed max-w-sm">
              {isEn
                ? 'Handcrafted durags sewn in Warsaw from authentic 19 Momme mulberry silk, velvets and satin. Built for 360 wave compression, hair moisture and effortless street style.'
                : 'Ręcznie szyte duragi z naturalnego jedwabiu morwowego 19 Momme, aksamitu i satyny. Projektowane i wykańczane w Warszawie z dbałością o kompresję 360 waves i ochronę włosów.'}
            </p>
            <div className="pt-2 flex items-center gap-4 text-xs text-[#ECEAE7]">
              <a
                href="https://instagram.com/warsawduragstore"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[#ECEAE7] hover:text-[#C8794B] transition-colors"
              >
                <svg className="w-4 h-4 text-[#C8794B] fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span>@warsawduragstore</span>
              </a>
            </div>
          </div>

          {/* Col 2: Katalog (2 cols) */}
          <div className="md:col-span-2 space-y-3">
            <h5 className="text-[11px] uppercase tracking-widest font-semibold text-[#ECEAE7]">
              {isEn ? 'Collections' : 'Kolekcje'}
            </h5>
            <ul className="space-y-2.5 text-xs text-[#6B6B6B]">
              <li><Link href="/produkty" className="hover:text-white transition-colors">{isEn ? 'All Durags' : 'Wszystkie Duragi'}</Link></li>
              <li><Link href="/kolekcja/silk" className="hover:text-white transition-colors">{isEn ? '19 Momme Silk' : 'Jedwab Morwowy'}</Link></li>
              <li><Link href="/kolekcja/satin" className="hover:text-white transition-colors">{isEn ? 'Silky Satin' : 'Satyna Lodowa'}</Link></li>
              <li><Link href="/kolekcja/velvet" className="hover:text-white transition-colors">{isEn ? 'Velvet / Welur' : 'Aksamitny Welur'}</Link></li>
              <li><Link href="/kolekcja/seasonal" className="hover:text-white transition-colors">{isEn ? 'Seasonal Fabrics' : 'Tkaniny Sezonowe'}</Link></li>
              <li><Link href="/kolekcja/accessories" className="hover:text-white transition-colors">{isEn ? 'Wave Brushes & Caps' : 'Szczotki & Wave Capy'}</Link></li>
            </ul>
          </div>

          {/* Col 3: Edukacja & Zaufanie (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h5 className="text-[11px] uppercase tracking-widest font-semibold text-[#ECEAE7]">
              {isEn ? 'Knowledge & Atelier' : 'Kompendium & Marka'}
            </h5>
            <ul className="space-y-2.5 text-xs text-[#6B6B6B]">
              <li><Link href="/o-nas" className="hover:text-white transition-colors">{isEn ? 'About Atelier & Founders' : 'O nas i Założycielach'}</Link></li>
              <li><Link href="/proces-szycia" className="hover:text-white transition-colors">{isEn ? 'Craftsmanship & Seams' : 'Proces Szycia & Materiały'}</Link></li>
              <li><Link href="/poradnik/wave-guide" className="hover:text-white transition-colors text-[#C8794B]">{isEn ? '360 Waves Mastery Guide' : 'Przewodnik 360 Waves'}</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">{isEn ? 'Duragopedia (Blog)' : 'Duragopedia (Wpisy)'}</Link></li>
              <li><Link href="/strona/kontakt" className="hover:text-white transition-colors">{isEn ? 'Contact & Local Pickup' : 'Kontakt i Odbiór Osobisty'}</Link></li>
            </ul>
          </div>

          {/* Col 4: Oficjalne Dane Firmy (3 cols) */}
          <div className="md:col-span-3 space-y-3 p-4 bg-[#1A1A1B]/50 rounded-xl border border-[#1A1A1B]">
            <h5 className="text-[11px] uppercase tracking-widest font-semibold text-[#C8794B]">
              {isEn ? 'Legal & Seller Info' : 'Dane Sprzedawcy'}
            </h5>
            <div className="text-[11px] text-[#6B6B6B] space-y-1.5 leading-relaxed">
              <p className="text-white font-medium">Warsaw Durag Store Michał Wyszyński</p>
              <p className="font-mono text-xs text-[#ECEAE7]">NIP: 7011275454</p>
              <p>Adres rejestrowy: ul. Grójecka 186 lok. 212, 02-390 Warszawa</p>
              <div className="pt-1.5 border-t border-[#1A1A1B]">
                <p className="text-white font-medium text-[11px]">Odbiór osobisty (po umówieniu):</p>
                <p>• ul. Włodarzewska 4 oraz Centrum</p>
              </div>
              <div className="pt-1.5 border-t border-[#1A1A1B] space-y-1">
                <p className="flex items-center gap-1.5 text-gray-300">
                  <Mail className="w-3 h-3 text-[#C8794B]" />
                  <a href="mailto:support@warsawduragstore.pl" className="hover:text-white transition-colors">support@warsawduragstore.pl</a>
                </p>
                <p className="text-[10px] text-gray-500">
                  Rozliczenia: <a href="mailto:finance@warsawduragstore.pl" className="hover:text-gray-300">finance@warsawduragstore.pl</a>
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Legal Links & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-[#6B6B6B] gap-4">
          <div className="text-[11px]">
            &copy; {new Date().getFullYear()} Warsaw Durag Store. {isEn ? 'All rights reserved.' : 'Wszelkie prawa zastrzeżone.'}
          </div>
          <div className="flex flex-wrap items-center gap-5 text-[11px]">
            <Link href="/regulamin" className="hover:text-white transition-colors">{isEn ? 'Terms & Conditions' : 'Regulamin Sklepu'}</Link>
            <Link href="/polityka-prywatnosci" className="hover:text-white transition-colors">{isEn ? 'Privacy Policy & GDPR' : 'Polityka Prywatności (RODO)'}</Link>
            <Link href="/zwroty" className="hover:text-white transition-colors">{isEn ? 'Returns & Complaints' : 'Zwroty i Reklamacje (14 dni)'}</Link>
            <Link href="/strona/dostawa" className="hover:text-white transition-colors">{isEn ? 'Shipping & Rates' : 'Koszty Dostawy (PL & UE)'}</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
