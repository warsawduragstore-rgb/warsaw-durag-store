'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Mail } from 'lucide-react';

export default function Footer() {
  const { language } = useLanguage();
  const isEn = language === 'EN';

  return (
    <footer className="bg-[#0B0B0C] text-[#FAFAF9] border-t border-[#1E1E22] pt-14 pb-12 font-sans selection:bg-[#C8794B] selection:text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Navigation & Company Info */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10 pb-12 border-b border-[#1E1E22]">
          
          {/* Col 1: Brand (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <Link href="/" className="inline-block group">
              <span className="font-serif text-2xl lg:text-3xl font-medium tracking-tight text-white block">
                Warsaw Durag Store
              </span>
              <span className="text-[13px] text-[#A3A09B] font-normal block mt-1">
                Szyte ręcznie w Warszawie od 2020 roku
              </span>
            </Link>
            <p className="text-[14px] text-[#A3A09B] font-normal leading-relaxed max-w-sm">
              {isEn
                ? 'Durags sewn by hand in Warsaw from mulberry silk, velvet and satin. Flat outer seams and 100 cm straps.'
                : 'Duragi szyte ręcznie w Warszawie z naturalnego jedwabiu morwowego, aksamitu i satyny. Płaski szew zewnętrzny i pasy 100 cm.'}
            </p>
            <div className="pt-1 flex items-center gap-4 text-[13px] text-[#ECEAE7]">
              <a
                href="https://instagram.com/warsawduragstore"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <span>Instagram: @warsawduragstore</span>
              </a>
            </div>
          </div>

          {/* Col 2: Katalog (2 cols) */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-[14px] font-medium text-white">
              {isEn ? 'Collections' : 'Kolekcja'}
            </h4>
            <ul className="space-y-2 text-[14px] text-[#A3A09B]">
              <li><Link href="/kolekcja/all" className="hover:text-white transition-colors">{isEn ? 'All durags' : 'Wszystkie duragi'}</Link></li>
              <li><Link href="/kolekcja/silk" className="hover:text-white transition-colors">{isEn ? 'Mulberry silk' : 'Jedwab morwowy'}</Link></li>
              <li><Link href="/kolekcja/satin" className="hover:text-white transition-colors">{isEn ? 'Satin' : 'Satyna'}</Link></li>
              <li><Link href="/kolekcja/velvet" className="hover:text-white transition-colors">{isEn ? 'Velvet' : 'Welur'}</Link></li>
              <li><Link href="/kolekcja/seasonal" className="hover:text-white transition-colors">{isEn ? 'Seasonal' : 'Tkaniny sezonowe'}</Link></li>
              <li><Link href="/kolekcja/accessories" className="hover:text-white transition-colors">{isEn ? 'Accessories' : 'Akcesoria'}</Link></li>
            </ul>
          </div>

          {/* Col 3: Edukacja (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-[14px] font-medium text-white">
              {isEn ? 'Information' : 'Informacje'}
            </h4>
            <ul className="space-y-2 text-[14px] text-[#A3A09B]">
              <li><Link href="/poradnik/wave-guide" className="hover:text-white transition-colors">{isEn ? '360 Waves Guide' : 'Poradnik 360 Waves'}</Link></li>
              <li><Link href="/o-nas" className="hover:text-white transition-colors">{isEn ? 'About Us' : 'O nas'}</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">{isEn ? 'Blog' : 'Blog'}</Link></li>
              <li><Link href="/strona/kontakt" className="hover:text-white transition-colors">{isEn ? 'Contact' : 'Kontakt'}</Link></li>
            </ul>
          </div>

          {/* Col 4: Oficjalne Dane Firmy (3 cols) */}
          <div className="md:col-span-3 space-y-3 p-4 bg-[#111113] border border-[#1E1E22]">
            <h4 className="text-[13px] font-medium text-[#ECEAE7]">
              {isEn ? 'Legal & Seller Info' : 'Dane Sprzedawcy'}
            </h4>
            <div className="text-[13px] text-[#A3A09B] space-y-1.5 leading-relaxed">
              <p className="text-white font-medium">Warsaw Durag Store Michał Wyszyński</p>
              <p className="text-[#ECEAE7] tabular-nums">NIP: 7011275454</p>
              <p>{isEn ? 'Registered address: ul. Grójecka 186/212, 02-390 Warsaw, Poland' : 'Adres: ul. Grójecka 186/212, 02-390 Warszawa'}</p>
              <div className="pt-1.5 border-t border-[#1E1E22]">
                <p className="text-white font-medium text-[13px]">{isEn ? 'Local pickup (by appointment):' : 'Odbiór osobisty (po umówieniu):'}</p>
                <p>ul. Włodarzewska 4, {isEn ? 'Warsaw' : 'Warszawa'}</p>
              </div>
              <div className="pt-1.5 border-t border-[#1E1E22] space-y-1">
                <p className="flex items-center gap-1.5 text-gray-300">
                  <Mail className="w-3.5 h-3.5 text-[#C8794B]" />
                  <a href="mailto:support@warsawduragstore.com" className="hover:text-white transition-colors">support@warsawduragstore.com</a>
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Legal Links & Copyright */}
        <div className="pt-6 flex flex-col md:flex-row justify-between items-center text-[13px] text-[#787570] gap-4">
          <div>
            &copy; {new Date().getFullYear()} Warsaw Durag Store. {isEn ? 'All rights reserved.' : 'Wszelkie prawa zastrzeżone.'}
          </div>
          <div className="flex flex-wrap items-center gap-5 text-[13px]">
            <Link href="/regulamin" className="hover:text-white transition-colors">{isEn ? 'Terms & Conditions' : 'Regulamin Sklepu'}</Link>
            <Link href="/polityka-prywatnosci" className="hover:text-white transition-colors">{isEn ? 'Privacy Policy' : 'Polityka Prywatności'}</Link>
            <Link href="/zwroty" className="hover:text-white transition-colors">{isEn ? 'Returns (14 days)' : 'Zwroty (14 dni)'}</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
