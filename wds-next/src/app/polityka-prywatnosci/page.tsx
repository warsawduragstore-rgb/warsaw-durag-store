import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import TrustBanner from '@/components/TrustBanner';

export const metadata: Metadata = {
  title: 'Polityka Prywatności & RODO — Warsaw Durag Store',
  description: 'Zasady przetwarzania danych osobowych, pliki cookies oraz prawa osób, których dane dotyczą w Warsaw Durag Store (Michał Wyszyński).',
  alternates: {
    canonical: 'https://warsawduragstore.com/polityka-prywatnosci',
  },
};

export default function PolitykaPrywatnosciPage() {
  return (
    <div className="min-h-screen bg-[#0B0B0C] text-[#ECEAE7] pt-28 pb-24 selection:bg-[#C8794B] selection:text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#787570] mb-4">
          <Link href="/" className="hover:text-white transition-colors">Start</Link>
          <span>/</span>
          <span className="text-[#C8794B]">Polityka prywatności</span>
        </div>

        {/* Page Header */}
        <header className="mb-10 pb-6 border-b border-[#1E1E22]">
          <h1 className="font-serif text-3xl sm:text-4xl text-white font-medium tracking-tight mb-3">
            Polityka prywatności i RODO
          </h1>
          <p className="text-xs text-[#787570]">
            Zasady przetwarzania danych osobowych, cookies i bezpieczeństwa · Warsaw Durag Store
          </p>
        </header>

        <div className="bg-[#111113] border border-[#1E1E22] p-6 sm:p-10 space-y-10 text-xs sm:text-sm text-[#A3A09B] leading-relaxed font-light">
          <section className="space-y-3">
            <h2 className="font-serif text-xl text-white font-normal">1. Administrator Danych Osobowych</h2>
            <p>
              Administratorem Twoich danych osobowych jest{' '}
              <strong className="text-white">Warsaw Durag Store Michał Wyszyński</strong> z siedzibą w Warszawie przy ul. Grójeckiej 186/212, 02-390 Warszawa, NIP: <strong className="text-white">7011275454</strong>.
            </p>
            <p>
              W sprawach związanych z ochroną danych osobowych możesz skontaktować się z nami bezpośrednio drogą elektroniczną pod adresem e-mail:{' '}
              <a href="mailto:support@warsawduragstore.com" className="text-[#C8794B] underline">support@warsawduragstore.com</a>.
            </p>
          </section>

          <section className="space-y-3 pt-6 border-t border-[#1E1E22]">
            <h2 className="font-serif text-xl text-white font-normal">2. Cele i Podstawy Przetwarzania Danych</h2>
            <p>Twoje dane osobowe przetwarzane są wyłącznie w celach niezbędnych do prawidłowego funkcjonowania sklepu i realizacji transakcji:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-white">Realizacja zamówienia:</strong> imię, nazwisko, adres dostawy, adres e-mail oraz numer telefonu są niezbędne do zawarcia i wykonania umowy sprzedaży (art. 6 ust. 1 lit. b RODO).</li>
              <li><strong className="text-white">Dostawa przesyłki (InPost Paczkomaty / Kurier):</strong> przekazanie danych kontaktowych operatorom pocztowym i kurierskim w celu doręczenia paczki i nadania powiadomień SMS / e-mail o odbiorze (art. 6 ust. 1 lit. b RODO).</li>
              <li><strong className="text-white">Płatności elektroniczne (Stripe / Tpay):</strong> bezpieczne przetwarzanie płatności bez przechowywania pełnych danych kart płatniczych po stronie sklepu (art. 6 ust. 1 lit. b RODO).</li>
              <li><strong className="text-white">Obowiązki rachunkowo-podatkowe:</strong> przechowywanie dokumentacji transakcyjnej zgodnie z obowiązującymi przepisami prawa podatkowego (art. 6 ust. 1 lit. c RODO).</li>
              <li><strong className="text-white">Prawnie uzasadniony interes:</strong> ewentualne ustalenie, dochodzenie lub obrona przed roszczeniami oraz kontakt z Klientem (art. 6 ust. 1 lit. f RODO).</li>
            </ul>
          </section>

          <section className="space-y-3 pt-6 border-t border-[#1E1E22]">
            <h2 className="font-serif text-xl text-white font-normal">3. Pliki Cookies i Narzędzia Analityczne</h2>
            <p>
              1. Sklep stosuje pliki cookies sesyjne oraz stałe. Pliki te są niezbędne do prawidłowego działania koszyka zakupowego, utrzymania sesji logowania oraz zapamiętania preferencji waluty i języka.
            </p>
            <p>
              2. Nie stosujemy inwazyjnych trackerów bez Twojej wyraźnej zgody. Użytkownik ma pełną kontrolę nad plikami cookies za pośrednictwem ustawień swojej przeglądarki internetowej.
            </p>
          </section>

          <section className="space-y-3 pt-6 border-t border-[#1E1E22]">
            <h2 className="font-serif text-xl text-white font-normal">4. Twoje Prawa (RODO)</h2>
            <p>
              Zgodnie z przepisami Ogólnego Rozporządzenia o Ochronie Danych (RODO) przysługuje Ci prawo do:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>dostępu do swoich danych osobowych oraz otrzymania ich kopii,</li>
              <li>sprostowania (poprawienia) nieprawidłowych danych,</li>
              <li>usunięcia danych („prawo do bycia zapomnianym”),</li>
              <li>ograniczenia przetwarzania danych,</li>
              <li>wniesienia sprzeciwu wobec przetwarzania,</li>
              <li>przenoszenia danych,</li>
              <li>wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych (UODO).</li>
            </ul>
            <p className="pt-2">
              Wszelkie wnioski dotyczące realizacji powyższych praw prosimy kierować na adres:{' '}
              <a href="mailto:support@warsawduragstore.com" className="text-[#C8794B] underline">support@warsawduragstore.com</a>.
            </p>
          </section>

          <section className="space-y-3 pt-6 border-t border-[#1E1E22]">
            <h2 className="font-serif text-xl text-white font-normal">5. Okres Przechowywania Danych</h2>
            <p>
              Dane przetwarzane w celu realizacji zamówienia przechowywane są przez okres przedawnienia ewentualnych roszczeń wynikających z umowy sprzedaży oraz przez czas wymagany przepisami prawa podatkowego i rachunkowego (zazwyczaj 5 lat od końca roku kalendarzowego).
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
