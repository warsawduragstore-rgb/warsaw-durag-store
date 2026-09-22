import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import TrustBanner from '@/components/TrustBanner';

export const metadata: Metadata = {
  title: 'Polityka Prywatności & RODO — Warsaw Durag Store',
  description: 'Zasady przetwarzania danych osobowych, polityka cookies i bezpieczeństwo w Warsaw Durag Store.',
  alternates: {
    canonical: 'https://warsawduragstore.pl/polityka-prywatnosci',
  },
};

export default function PolitykaPrywatnosciPage() {
  return (
    <div className="min-h-screen bg-[#F7F5F2] text-[#0D0D0B] pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">
            <Link href="/" className="hover:text-black transition-colors">Start</Link>
            <span>/</span>
            <span className="text-[#0D0D0B] font-semibold">Polityka Prywatności</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold uppercase tracking-tight">
            Polityka Prywatności & Informacja o RODO
          </h1>
          <p className="text-xs text-gray-500 font-mono mt-1">
            Zasady przetwarzania danych osobowych, pliki cookies oraz prawa osób, których dane dotyczą
          </p>
        </div>

        <div className="bg-white border border-[#CFCFCF] rounded-2xl p-6 sm:p-10 shadow-xs space-y-8 text-sm text-[#3B3C40] leading-relaxed font-light">
          <section className="space-y-3">
            <h2 className="font-serif text-lg text-[#0D0D0B] font-semibold">1. Administrator Danych Osobowych</h2>
            <p>
              Administratorem Twoich danych osobowych jest <strong>Warsaw Durag Store</strong> z siedzibą w Warszawie przy ul. Włodarzewskiej 4. W sprawach związanych z ochroną danych osobowych możesz skontaktować się z nami pod adresem e-mail: <strong>support@warsawduragstore.pl</strong>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-lg text-[#0D0D0B] font-semibold">2. Cele i Podstawy Przetwarzania Danych</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Realizacja zamówienia:</strong> przetwarzanie imienia, nazwiska, adresu dostawy, numeru telefonu i emaila jest niezbędne do wykonania umowy sprzedaży (art. 6 ust. 1 lit. b RODO).</li>
              <li><strong>Dostawa przesyłki (InPost / Kurier):</strong> przekazanie danych kontaktowych operatorom logistycznym w celu wysyłki i powiadomień SMS/email (art. 6 ust. 1 lit. b RODO).</li>
              <li><strong>Płatności online (Stripe):</strong> przetwarzanie transakcji w bezpiecznym szyfrowanym środowisku bramki płatniczej (art. 6 ust. 1 lit. b RODO).</li>
              <li><strong>Obowiązki księgowo-podatkowe:</strong> przechowywanie dowodów zakupu zgodnie z przepisami prawa podatkowego (art. 6 ust. 1 lit. c RODO).</li>
              <li><strong>Prawnie uzasadniony interes:</strong> obrona przed roszczeniami lub dochodzenie roszczeń (art. 6 ust. 1 lit. f RODO).</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-lg text-[#0D0D0B] font-semibold">3. Pliki Cookies i Analityka</h2>
            <p>
              1. Serwis wykorzystuje wyłącznie niezbędne pliki cookies techniczne (np. obsługa sesji koszyka) oraz opcjonalne cookies analityczne.
            </p>
            <p>
              2. Zgodnie z wymaganiami unijnymi i krajowymi, skrypty analityczne i marketingowe stron trzecich ładowane są dopiero po wyrażeniu świadomej zgody przez użytkownika.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-lg text-[#0D0D0B] font-semibold">4. Prawa Użytkownika</h2>
            <p>
              Każdej osobie, której dane dotyczą, przysługuje prawo dostępu do swoich danych, ich sprostowania, usunięcia ("prawo do bycia zapomnianym"), ograniczenia przetwarzania, prawo do przenoszenia danych oraz prawo wniesienia sprzeciwu. Wnioski można kierować na adres: <strong>support@warsawduragstore.pl</strong>.
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
