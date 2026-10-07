'use client';

import React from 'react';
import Link from 'next/link';
import TrustBanner from '@/components/TrustBanner';
import { RotateCcw, PackageCheck, Mail, FileText } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function ReturnsClient() {
  const { isEn, t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-[#FAFAF9] pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-[#A3A09B] mb-2">
            <Link href="/" className="hover:text-white transition-colors">{t.navHome}</Link>
            <span>/</span>
            <span className="text-[#ECEAE7] font-medium">{isEn ? 'Returns & Exchanges' : 'Zwroty i wymiany'}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-white">
            {isEn ? 'Returns, Exchanges & 14-Day Right to Cancel' : 'Zwroty, odstąpienie od umowy i wymiany'}
          </h1>
          <p className="text-sm text-[#A3A09B] mt-1">
            {isEn ? '14 full days to return or exchange for another color/material' : '14 dni na zwrot lub wymianę na inny wariant'}
          </p>
        </div>

        {/* 3 Steps Visual */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#141416] border border-[#26262A] p-5 space-y-2">
            <div className="w-8 h-8 bg-[#1E1E22] text-[#C8794B] flex items-center justify-center font-bold text-xs tabular-nums border border-[#26262A]">1</div>
            <h3 className="font-serif text-base font-medium text-white">{isEn ? 'Contact Us' : 'Napisz do nas'}</h3>
            <p className="text-xs text-[#A3A09B]">
              {isEn ? 'Send an email to ' : 'Wyślij maila na '}
              <strong className="text-white">support@warsawduragstore.com</strong>
              {isEn ? ' with your order number.' : ' z numerem zamówienia.'}
            </p>
          </div>

          <div className="bg-[#141416] border border-[#26262A] p-5 space-y-2">
            <div className="w-8 h-8 bg-[#1E1E22] text-[#C8794B] flex items-center justify-center font-bold text-xs tabular-nums border border-[#26262A]">2</div>
            <h3 className="font-serif text-base font-medium text-white">{isEn ? 'Pack the Durag' : 'Spakuj durag'}</h3>
            <p className="text-xs text-[#A3A09B]">
              {isEn
                ? 'Place the unworn durag with its tags in original packaging. Drop off at any InPost locker or send via courier.'
                : 'Umieść nienoszony durag wraz z metką w opakowaniu. Nadaj paczkę w Paczkomacie InPost lub wyślij kurierem.'}
            </p>
          </div>

          <div className="bg-[#141416] border border-[#26262A] p-5 space-y-2">
            <div className="w-8 h-8 bg-[#1E1E22] text-[#C8794B] flex items-center justify-center font-bold text-xs tabular-nums border border-[#26262A]">3</div>
            <h3 className="font-serif text-base font-medium text-white">{isEn ? 'Refund Issued' : 'Zwrot środków'}</h3>
            <p className="text-xs text-[#A3A09B]">
              {isEn
                ? 'Upon package verification, funds are promptly refunded via your original payment method.'
                : 'Po weryfikacji paczki zwracamy środki tą samą metodą płatności.'}
            </p>
          </div>
        </div>

        {/* Legal Policy Content */}
        <div className="bg-[#141416] border border-[#26262A] p-6 sm:p-8 space-y-6 text-sm text-[#A3A09B] leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-serif text-xl font-medium text-white">
              {isEn ? 'Right of Withdrawal (14 Days)' : 'Prawo do odstąpienia od umowy'}
            </h2>
            <p>
              {isEn
                ? 'Under EU and Polish consumer protection law, every customer has the right to withdraw from a purchase without giving any reason within 14 calendar days from the date of package delivery.'
                : 'Zgodnie z ustawą o prawach konsumenta z dnia 30 maja 2014 r., każdy klient ma prawo odstąpić od umowy sprzedaży bez podania przyczyny w terminie 14 dni kalendarzowych od momentu doręczenia przesyłki.'}
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-medium text-white">
              {isEn ? 'Return Shipping Address' : 'Adres do wysyłki zwrotów'}
            </h2>
            <div className="p-4 bg-[#0B0B0C] border border-[#26262A] text-xs font-mono text-[#ECEAE7] space-y-1">
              <p className="font-semibold text-white">Warsaw Durag Store — Zwroty</p>
              <p>ul. Grójecka 186/212</p>
              <p>02-390 Warszawa, Polska</p>
              <p>E-mail: support@warsawduragstore.com</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
