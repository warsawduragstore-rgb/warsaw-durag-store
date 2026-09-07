'use client';

import React from 'react';
import { Truck, ShieldCheck, RefreshCw, MapPin } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function TrustBanner() {
  const { t } = useLanguage();

  return (
    <section className="bg-[#F7F5F2] border-y border-[#CFCFCF]/60 py-6">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-white border border-[#CFCFCF] flex items-center justify-center text-[#734C1D] shrink-0">
              <Truck className="w-5 h-5 stroke-[1.5]" />
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#0D0D0B]">{t.trustShippingTitle}</h4>
              <p className="text-[12px] text-[#3B3C40] font-light mt-0.5">{t.trustShippingDesc}</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-white border border-[#CFCFCF] flex items-center justify-center text-[#734C1D] shrink-0">
              <ShieldCheck className="w-5 h-5 stroke-[1.5]" />
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#0D0D0B]">{t.trustSilkTitle}</h4>
              <p className="text-[12px] text-[#3B3C40] font-light mt-0.5">{t.trustSilkDesc}</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-white border border-[#CFCFCF] flex items-center justify-center text-[#734C1D] shrink-0">
              <RefreshCw className="w-5 h-5 stroke-[1.5]" />
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#0D0D0B]">{t.trustReturnsTitle}</h4>
              <p className="text-[12px] text-[#3B3C40] font-light mt-0.5">{t.trustReturnsDesc}</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-white border border-[#CFCFCF] flex items-center justify-center text-[#734C1D] shrink-0">
              <MapPin className="w-5 h-5 stroke-[1.5]" />
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#0D0D0B]">{t.trustHandmadeTitle}</h4>
              <p className="text-[12px] text-[#3B3C40] font-light mt-0.5">{t.trustHandmadeDesc}</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
