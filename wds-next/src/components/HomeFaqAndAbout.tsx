'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function HomeFaqAndAbout() {
  const { isEn, siteSettings } = useLanguage();

  const defaultFaqsPl = [
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

  const defaultFaqsEn = [
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
  ];

  let faqs: Array<{ q: string; a: string }> = [];
  if (siteSettings?.faq_items) {
    try {
      const parsed = JSON.parse(siteSettings.faq_items);
      if (Array.isArray(parsed) && parsed.length > 0) {
        faqs = parsed.map((item: any) => ({
          q: isEn ? (item.q_en || item.q_pl) : item.q_pl,
          a: isEn ? (item.a_en || item.a_pl) : item.a_pl,
        }));
      }
    } catch {
      // ignore
    }
  }
  if (faqs.length === 0) {
    faqs = isEn ? defaultFaqsEn : defaultFaqsPl;
  }

  const aboutTitle = isEn
    ? (siteSettings?.about_title_en || 'About Us & Our Workshop')
    : (siteSettings?.about_title || 'O nas i naszej pracowni');

  const aboutDesc = isEn
    ? (siteSettings?.about_description_en || 'Warsaw Durag Store was founded in 2020 in Warsaw by twin brothers. We craft durags by hand using genuine mulberry silk, satin and velvet, featuring seamless exterior stitching and 100 cm straps.')
    : (siteSettings?.about_description || 'Warsaw Durag Store powstał w 2020 roku w Warszawie przez braci bliźniaków. Duragi szyjemy ręcznie z naturalnego jedwabiu morwowego, satyny i weluru, z autorskim zewnętrznym bezodciskowym szwem i pasami o długości 100 cm.');

  const aboutPickup = isEn
    ? (siteSettings?.about_pickup_info_en || 'Local pickup available in Warsaw by prior appointment at ul. Włodarzewska 4.')
    : (siteSettings?.about_pickup_info || 'Odbiór osobisty w Warszawie po umówieniu (ul. Włodarzewska 4, Ochota).');

  const foundersImg = siteSettings?.about_image_url || '/assets/founders.jpg';

  return (
    <>
      {/* About Workshop & Founders */}
      <section className="py-14 sm:py-20 border-t border-[#1E1E22]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Founders Photo */}
            <div className="relative aspect-[4/3] rounded-sm overflow-hidden border border-[#1E1E22] bg-[#111113] group">
              <img
                src={foundersImg}
                alt={isEn ? "Warsaw Durag Store founders — twin brothers" : "Założyciele Warsaw Durag Store — bracia bliźniacy"}
                className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-500"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-6 flex items-center justify-between text-xs text-white">
                <span className="font-medium">{isEn ? 'Founders · Warsaw' : 'Założyciele · Warszawa'}</span>
                <span className="text-[#C8794B]">{isEn ? 'Since 2020' : 'Od 2020'}</span>
              </div>
            </div>

            {/* Narrative Copy */}
            <div className="space-y-4">
              <span className="text-xs font-semibold text-[#C8794B] uppercase tracking-wider block">
                {isEn ? 'Handmade in Warsaw' : 'Szyte ręcznie w Warszawie'}
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-white font-medium leading-snug">
                {aboutTitle}
              </h2>
              <p className="text-[14px] sm:text-[15px] text-[#A3A09B] leading-relaxed">
                {aboutDesc}
              </p>
              <p className="text-[13px] text-[#787570]">
                {aboutPickup}
              </p>
              <div className="pt-2">
                <a
                  href="/o-nas"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C8794B] hover:text-[#D48B5E] transition-colors underline underline-offset-4"
                >
                  {isEn ? 'Read our full story →' : 'Poznaj pełną historię założycieli →'}
                </a>
              </div>
            </div>
          </div>
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
