'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function HomeFaqAndAbout() {
  const { isEn } = useLanguage();

  const faqs = isEn
    ? [
        {
          q: 'When will my order ship?',
          a: 'Orders are dispatched from Warsaw within 1–2 business days. Standard shipping across Poland is completely free via InPost Paczkomat or courier.',
        },
        {
          q: 'How does the "Buy 2, get 3rd for 1 PLN" offer work?',
          a: 'Add any two durags to your cart. The third random durag is automatically discounted to 1 PLN / €0.25 at checkout.',
        },
        {
          q: 'What is special about 19 Momme Mulberry Silk?',
          a: 'The Milanówek model is crafted from 100% natural 19 Momme mulberry silk. Its ultra-smooth structure protects hair from mechanical breakage, retains hydration and maintains 360 wave definition.',
        },
        {
          q: 'Will the durag leave forehead lines or marks?',
          a: 'No. All our durags are designed with an exterior flat seam and extra-wide 100 cm straps to eliminate marks even after an entire night of sleep.',
        },
        {
          q: 'Is local pickup available in Warsaw?',
          a: 'Yes, local pickup is available in Warsaw by prior appointment at ul. Włodarzewska 4 (Ochota).',
        },
      ]
    : [
        {
          q: 'Kiedy paczka zostanie wysłana?',
          a: 'Wysyłka z Warszawy w 1–2 dni robocze. Wszystkie przesyłki do Paczkomatów InPost i kurierem na terenie Polski są darmowe.',
        },
        {
          q: 'Jak działa promocja: kup 2, trzeci losowy durag za 1 zł?',
          a: 'Wybierz dowolne dwa duragi do koszyka. Trzeci losowy model zostanie automatycznie dodany za 1 zł przy kasie.',
        },
        {
          q: 'Czym charakteryzuje się jedwab morwowy 19 Momme?',
          a: 'Model Milanówek wykonany jest w 100% z naturalnego jedwabiu morwowego o gramaturze 19 Momme. Gładka struktura chroni włosy przed łamaniem i redukuje puszenie.',
        },
        {
          q: 'Czy durag zostawia odciski na czole?',
          a: 'Nie. Wszystkie duragi szyjemy z autorskim zewnętrznym szwem i szerokimi pasami o długości 100 cm, co eliminuje odciski po całej nocy.',
        },
        {
          q: 'Gdzie możliwy jest odbiór osobisty w Warszawie?',
          a: 'Odbiór osobisty w Warszawie po umówieniu przy ul. Włodarzewskiej 4 na Ochocie.',
        },
      ];

  return (
    <>
      {/* About Workshop */}
      <section className="py-14 sm:py-20 border-t border-[#1E1E22]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <h2 className="font-serif text-2xl sm:text-3xl text-white font-medium">
            {isEn ? 'About Us' : 'O nas'}
          </h2>
          <p className="text-[15px] sm:text-base text-[#A3A09B] leading-relaxed">
            {isEn
              ? 'Warsaw Durag Store was founded in 2020 in Warsaw. We craft durags by hand using genuine mulberry silk, satin and velvet, featuring seamless exterior stitching and 100 cm straps.'
              : 'Warsaw Durag Store powstał w 2020 roku w Warszawie. Duragi szyjemy ręcznie z naturalnego jedwabiu morwowego, satyny i weluru, z zewnętrznym bezodciskowym szwem i pasami o długości 100 cm.'}
          </p>
          <p className="text-[13px] text-[#787570]">
            {isEn
              ? 'Local pickup available in Warsaw by appointment (ul. Włodarzewska 4).'
              : 'Odbiór osobisty w Warszawie po umówieniu (ul. Włodarzewska 4).'}
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14 sm:py-20 max-w-3xl mx-auto px-4 sm:px-6 border-t border-[#1E1E22]">
        <div className="mb-8 text-center">
          <h2 className="font-serif text-2xl sm:text-3xl text-white font-medium">
            {isEn ? 'Frequently Asked Questions' : 'Często zadawane pytania'}
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-[#111113] border border-[#1E1E22] p-5">
              <h3 className="text-[15px] font-medium text-white mb-2">
                {faq.q}
              </h3>
              <p className="text-[14px] text-[#A3A09B] leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
