import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import TrustBanner from '@/components/TrustBanner';
import { RotateCcw, PackageCheck, Mail, FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Zwroty i Reklamacje (14 dni) — Warsaw Durag Store',
  description: 'Zasady zwrotów i wymiany duragów. Formularz odstąpienia od umowy w 14 dni zgodnie z prawem konsumenckim.',
  alternates: {
    canonical: 'https://warsawduragstore.com/zwroty',
  },
};

export default function ZwrotyPage() {
  return (
    <div className="min-h-screen bg-[#0B0B0C] text-[#FAFAF9] pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-[#A3A09B] mb-2">
            <Link href="/" className="hover:text-white transition-colors">Start</Link>
            <span>/</span>
            <span className="text-[#ECEAE7] font-medium">Zwroty i wymiany</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-white">
            Zwroty, odstąpienie od umowy i wymiany
          </h1>
          <p className="text-sm text-[#A3A09B] mt-1">
            14 dni na zwrot lub wymianę na inny wariant
          </p>
        </div>

        {/* 3 Steps Visual */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#141416] border border-[#26262A] p-5 space-y-2">
            <div className="w-8 h-8 bg-[#1E1E22] text-[#C8794B] flex items-center justify-center font-bold text-xs tabular-nums border border-[#26262A]">1</div>
            <h3 className="font-serif text-base font-medium text-white">Napisz do nas</h3>
            <p className="text-xs text-[#A3A09B]">
              Wyślij maila na <strong className="text-white">kontakt@warsawduragstore.com</strong> z numerem zamówienia.
            </p>
          </div>

          <div className="bg-[#141416] border border-[#26262A] p-5 space-y-2">
            <div className="w-8 h-8 bg-[#1E1E22] text-[#C8794B] flex items-center justify-center font-bold text-xs tabular-nums border border-[#26262A]">2</div>
            <h3 className="font-serif text-base font-medium text-white">Spakuj durag</h3>
            <p className="text-xs text-[#A3A09B]">
              Umieść nienoszony durag wraz z metką w opakowaniu. Nadaj paczkę w Paczkomacie InPost lub wyślij kurierem.
            </p>
          </div>

          <div className="bg-[#141416] border border-[#26262A] p-5 space-y-2">
            <div className="w-8 h-8 bg-[#1E1E22] text-[#C8794B] flex items-center justify-center font-bold text-xs tabular-nums border border-[#26262A]">3</div>
            <h3 className="font-serif text-base font-medium text-white">Zwrot środków</h3>
            <p className="text-xs text-[#A3A09B]">
              Po weryfikacji paczki zwracamy środki tą samą metodą płatności.
            </p>
          </div>
        </div>

        {/* Legal Policy Content */}
        <div className="bg-[#141416] border border-[#26262A] p-6 sm:p-10 shadow-xs space-y-8 text-sm text-[#ECEAE7] leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-serif text-lg text-white font-medium">
              Ustawowe prawo do odstąpienia od umowy (14 dni)
            </h2>
            <p className="text-[#A3A09B]">
              Zgodnie z ustawą o prawach konsumenta, każdemu konsumentowi przysługuje prawo do odstąpienia od umowy zawartej na odległość bez podawania przyczyny w terminie <strong className="text-white">14 dni</strong> od dnia doręczenia przesyłki.
            </p>
            <p className="text-[#A3A09B]">
              Do zachowania terminu wystarczy przesłanie oświadczenia przed jego upływem na adres poczty elektronicznej: <strong className="text-white">kontakt@warsawduragstore.com</strong>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-lg text-white font-medium">
              Wzór formularza odstąpienia od umowy
            </h2>
            <p className="text-xs text-[#A3A09B]">
              (formularz ten należy wypełnić i odesłać tylko w przypadku chęci odstąpienia od umowy)
            </p>
            <div className="p-5 bg-[#0B0B0C] border border-[#26262A] text-xs text-[#ECEAE7] space-y-2">
              <p><strong className="text-white">Adresat:</strong> Warsaw Durag Store, ul. Włodarzewska 4, 02-384 Warszawa, email: support@warsawduragstore.com</p>
              <p className="pt-2 text-[#A3A09B]">— Ja/My(*) niniejszym informuję/informujemy(*) o moim/naszym odstąpieniu od umowy sprzedaży następujących rzeczy:</p>
              <p className="text-[#A3A09B]">Nazwa produktu / wariant: ................................................................</p>
              <p className="text-[#A3A09B]">Numer zamówienia (Order No): ................................................................</p>
              <p className="text-[#A3A09B]">Data zawarcia umowy / odbioru: ................................................................</p>
              <p className="text-[#A3A09B]">Imię i nazwisko konsumenta(-ów): ................................................................</p>
              <p className="text-[#A3A09B]">Adres konsumenta(-ów): ................................................................</p>
              <p className="text-[#A3A09B]">Numer rachunku bankowego do zwrotu: ................................................................</p>
              <p className="text-[#A3A09B]">Podpis konsumenta(-ów) (tylko jeżeli formularz jest przesyłany w wersji papierowej)</p>
              <p className="text-[#A3A09B]">Data: ................................................................</p>
              <p className="text-[10px] text-[#73716D] pt-1">(*) Niepotrzebne skreślić.</p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-lg text-white font-semibold">
              Wymiana Produktu na Inny Kolor lub Materiał
            </h2>
            <p className="text-[#A3A09B]">
              Jeśli zamówiony odcień lub materiał duraga nie do końca leży do Twojego fitu, z chęcią bezpłatnie wymienimy go na inny wariant z naszej kolekcji. Wystarczy, że napiszesz do nas na Instagramie <strong className="text-white">@WARSAWDURAGSTORE</strong> lub mailowo na <strong className="text-white">support@warsawduragstore.com</strong>.
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
