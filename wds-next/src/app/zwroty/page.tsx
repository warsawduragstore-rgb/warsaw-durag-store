import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import TrustBanner from '@/components/TrustBanner';
import { RotateCcw, PackageCheck, Mail, FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Zwroty i Reklamacje (14 dni) — Warsaw Durag Store',
  description: 'Zasady zwrotów i wymiany duragów. Formularz odstąpienia od umowy w 14 dni zgodnie z prawem konsumenckim.',
  alternates: {
    canonical: 'https://warsawduragstore.pl/zwroty',
  },
};

export default function ZwrotyPage() {
  return (
    <div className="min-h-screen bg-[#F7F5F2] text-[#0D0D0B] pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">
            <Link href="/" className="hover:text-black transition-colors">Start</Link>
            <span>/</span>
            <span className="text-[#0D0D0B] font-semibold">Zwroty i Wymiany</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold uppercase tracking-tight">
            Zwroty, Odstąpienie od Umowy i Wymiany
          </h1>
          <p className="text-xs text-gray-500 font-mono mt-1">
            Gwarantowane 14 dni na darmowy zwrot lub wymianę na inny kolor/materiał
          </p>
        </div>

        {/* 3 Steps Visual */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-[#CFCFCF] p-5 rounded-xl space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#D9A87E]/20 text-[#734C1D] flex items-center justify-center font-bold text-xs font-mono">1</div>
            <h3 className="font-serif text-base font-semibold text-black">Napisz do nas</h3>
            <p className="text-xs text-gray-600">
              Wyślij maila na <strong className="text-black">support@warsawduragstore.pl</strong> z numerem zamówienia (np. WDS-123456).
            </p>
          </div>

          <div className="bg-white border border-[#CFCFCF] p-5 rounded-xl space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#D9A87E]/20 text-[#734C1D] flex items-center justify-center font-bold text-xs font-mono">2</div>
            <h3 className="font-serif text-base font-semibold text-black">Spakuj durag</h3>
            <p className="text-xs text-gray-600">
              Umieść nienoszony durag wraz z metką w opakowaniu. Możesz nadać go w dowolnym Paczkomacie InPost.
            </p>
          </div>

          <div className="bg-white border border-[#CFCFCF] p-5 rounded-xl space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#D9A87E]/20 text-[#734C1D] flex items-center justify-center font-bold text-xs font-mono">3</div>
            <h3 className="font-serif text-base font-semibold text-black">Błyskawiczny zwrot</h3>
            <p className="text-xs text-gray-600">
              W ciągu 24–48h od odbioru paczki zwracamy 100% środków tą samą metodą płatności (BLIK / karta).
            </p>
          </div>
        </div>

        {/* Legal Policy Content */}
        <div className="bg-white border border-[#CFCFCF] rounded-2xl p-6 sm:p-10 shadow-xs space-y-8 text-sm text-[#3B3C40] leading-relaxed font-light">
          <section className="space-y-3">
            <h2 className="font-serif text-lg text-[#0D0D0B] font-semibold">
              Ustawowe Prawo do Odstąpienia od Umowy (14 Dni)
            </h2>
            <p>
              Zgodnie z art. 27 ustawy z dnia 30 maja 2014 r. o prawach konsumenta, każdemu Klientowi będącemu Konsumentem przysługuje prawo do odstąpienia od umowy zawartej na odległość bez podawania przyczyny w terminie <strong>14 dni kalendarzowych</strong> od dnia objęcia rzeczy w posiadanie.
            </p>
            <p>
              Do zachowania terminu wystarczy wysłanie oświadczenia przed jego upływem na adres poczty elektronicznej: <strong>support@warsawduragstore.pl</strong>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-lg text-[#0D0D0B] font-semibold">
              Wzór Formularza Odstąpienia od Umowy
            </h2>
            <p className="text-xs text-gray-600">
              (formularz ten należy wypełnić i odesłać tylko w przypadku chęci odstąpienia od umowy)
            </p>
            <div className="p-5 bg-[#F7F5F2] border border-[#CFCFCF] rounded-xl font-mono text-xs text-gray-800 space-y-2">
              <p><strong>Adresat:</strong> Warsaw Durag Store, ul. Włodarzewska 4, 02-384 Warszawa, email: support@warsawduragstore.pl</p>
              <p className="pt-2">— Ja/My(*) niniejszym informuję/informujemy(*) o moim/naszym odstąpieniu od umowy sprzedaży następujących rzeczy:</p>
              <p>Nazwa produktu / wariant: ................................................................</p>
              <p>Numer zamówienia (Order No): ................................................................</p>
              <p>Data zawarcia umowy / odbioru: ................................................................</p>
              <p>Imię i nazwisko konsumenta(-ów): ................................................................</p>
              <p>Adres konsumenta(-ów): ................................................................</p>
              <p>Numer rachunku bankowego do zwrotu (opcjonalnie przy płatności tradycyjnej): ................................................................</p>
              <p>Podpis konsumenta(-ów) (tylko jeżeli formularz jest przesyłany w wersji papierowej)</p>
              <p>Data: ................................................................</p>
              <p className="text-[10px] text-gray-500 pt-1">(*) Niepotrzebne skreślić.</p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-lg text-[#0D0D0B] font-semibold">
              Wymiana Produktu na Inny Kolor lub Materiał
            </h2>
            <p>
              Jeśli zamówiony odcień lub materiał duraga nie do końca leży do Twojego fitu, z chęcią bezpłatnie wymienimy go na inny wariant z naszej kolekcji. Wystarczy, że napiszesz do nas na Instagramie <strong>@WARSAWDURAGSTORE</strong> lub mailowo.
            </p>
          </section>
        </div>

        <div className="mt-12">
          <TrustBanner />
        </div>
      </div>
    </div>
  );
}
