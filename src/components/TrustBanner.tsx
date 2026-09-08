'use client';

import React from 'react';

const TRUST_PILLARS = [
  {
    num: '01',
    title: 'Wysyłka 24h z Warszawy',
    desc: 'Darmowy Paczkomat InPost od 0 zł. Paczka u Ciebie na drugi dzień roboczy.',
  },
  {
    num: '02',
    title: '100% Jedwab Morwowy',
    desc: 'Gramatura 19 Momme. Naturalne białko, zero puszenia i łamania włosów.',
  },
  {
    num: '03',
    title: 'Szew Bezodciskowy',
    desc: 'Autorski krój zewnętrzny i pasy 100 cm. Zero śladów na czole po nocy.',
  },
  {
    num: '04',
    title: 'BLIK, Apple Pay & 14 Dni',
    desc: 'Natychmiastowe płatności i 14 dni na bezproblemowy zwrot lub wymianę.',
  },
];

export default function TrustBanner() {
  return (
    <section className="bg-[#0D0D0B] text-white border-y border-white/10 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
          {TRUST_PILLARS.map((pillar, idx) => (
            <div key={idx} className={`pt-4 sm:pt-0 ${idx > 0 ? 'sm:pl-6 lg:pl-8' : ''}`}>
              <span className="font-mono text-xs text-[#D9A87E] font-bold block mb-1.5 tracking-wider">
                [ {pillar.num} ]
              </span>
              <h4 className="font-serif text-sm sm:text-base font-medium text-white tracking-tight">
                {pillar.title}
              </h4>
              <p className="text-xs text-gray-400 font-light mt-1 leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

