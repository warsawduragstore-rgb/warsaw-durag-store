'use client';

import React from 'react';

const TRUST_POINTS = [
  {
    title: 'Płaski szew na zewnątrz',
    desc: 'Autorski krój, który nie zostawia śladów na czole po nocy.',
  },
  {
    title: 'Jedwab morwowy 19 Momme',
    desc: 'Certyfikowane włókno z Milanówka. Chroni wilgoć we włosach.',
  },
  {
    title: 'Wysyłka w 24h z Warszawy',
    desc: 'Darmowy Paczkomat InPost w Polsce. Paczka w 1 dzień.',
  },
  {
    title: 'Odbiór w Warszawie',
    desc: 'Możliwość odbioru osobistego na Ochocie lub w Centrum.',
  },
];

export default function TrustBanner() {
  return (
    <section className="bg-[#0B0B0C] border-y border-[#1E1E22] py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-[#1E1E22]">
          {TRUST_POINTS.map((item, idx) => (
            <div key={idx} className={`${idx > 0 ? 'pt-4 sm:pt-0 sm:pl-6' : ''}`}>
              <h4 className="font-mono text-xs uppercase tracking-wider text-white font-bold mb-1">
                {item.title}
              </h4>
              <p className="text-xs text-[#A3A09B] font-light leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
