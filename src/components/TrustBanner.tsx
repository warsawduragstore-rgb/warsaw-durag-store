'use client';

import React from 'react';
import { Truck, ShieldCheck, RefreshCw, CreditCard } from 'lucide-react';

export default function TrustBanner() {

  return (
    <section className="bg-[#F7F5F2] border-y border-[#E5E2DC] py-5 sm:py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-[#E5E2DC] flex items-center justify-center text-[#734C1D] shrink-0 shadow-2xs">
              <Truck className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.8]" />
            </div>
            <div>
              <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#0D0D0B]">
                Wysyłka w 24h
              </h4>
              <p className="text-[11px] sm:text-[12px] text-[#3B3C40] font-light mt-0.5 leading-snug">
                Darmowy Paczkomat InPost od 0 zł z Warszawy
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-[#E5E2DC] flex items-center justify-center text-[#734C1D] shrink-0 shadow-2xs">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.8]" />
            </div>
            <div>
              <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#0D0D0B]">
                Naturalny Jedwab
              </h4>
              <p className="text-[11px] sm:text-[12px] text-[#3B3C40] font-light mt-0.5 leading-snug">
                Czysty morwowy 19 Momme & polski szew
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-[#E5E2DC] flex items-center justify-center text-[#734C1D] shrink-0 shadow-2xs">
              <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.8]" />
            </div>
            <div>
              <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#0D0D0B]">
                Bezpieczne Płatności
              </h4>
              <p className="text-[11px] sm:text-[12px] text-[#3B3C40] font-light mt-0.5 leading-snug">
                BLIK, Apple Pay, Google Pay, Karty
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-[#E5E2DC] flex items-center justify-center text-[#734C1D] shrink-0 shadow-2xs">
              <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.8]" />
            </div>
            <div>
              <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#0D0D0B]">
                14 Dni na Zwrot
              </h4>
              <p className="text-[11px] sm:text-[12px] text-[#3B3C40] font-light mt-0.5 leading-snug">
                Bezproblemowa wymiana lub zwrot środków
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
