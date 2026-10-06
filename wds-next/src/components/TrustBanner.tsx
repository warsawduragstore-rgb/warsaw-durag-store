'use client';

import React from 'react';

const FACTS = [
  'Wysyłka z Warszawy w 1–2 dni robocze',
  'Darmowa dostawa w Polsce',
  '14 dni na zwrot',
  'Odbiór osobisty w Warszawie po umówieniu',
];

export default function TrustBanner() {
  return (
    <section className="bg-[#111113] border-y border-[#1E1E22] py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-[#1E1E22] text-center">
          {FACTS.map((fact, idx) => (
            <div
              key={idx}
              className={`py-1.5 sm:py-0 ${idx > 0 ? 'sm:pl-4' : ''}`}
            >
              <p className="text-[13px] sm:text-[14px] font-medium text-[#ECEAE7] tracking-[0.02em] whitespace-nowrap overflow-hidden text-ellipsis">
                {fact}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
