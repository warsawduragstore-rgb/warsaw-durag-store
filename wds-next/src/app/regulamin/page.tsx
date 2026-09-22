import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import TrustBanner from '@/components/TrustBanner';

export const metadata: Metadata = {
  title: 'Regulamin Sklepu Internetowego — Warsaw Durag Store',
  description: 'Regulamin zakupów, dostawy, płatności oraz praw konsumenta w sklepie Warsaw Durag Store.',
  alternates: {
    canonical: 'https://warsawduragstore.pl/regulamin',
  },
};

export default function RegulaminPage() {
  return (
    <div className="min-h-screen bg-[#F7F5F2] text-[#0D0D0B] pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">
            <Link href="/" className="hover:text-black transition-colors">Start</Link>
            <span>/</span>
            <span className="text-[#0D0D0B] font-semibold">Regulamin</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold uppercase tracking-tight">
            Regulamin Sklepu Internetowego Warsaw Durag Store
          </h1>
          <p className="text-xs text-gray-500 font-mono mt-1">
            Zasady korzystania, składania zamówień, płatności, dostawy oraz prawa konsumenta
          </p>
        </div>

        <div className="bg-white border border-[#CFCFCF] rounded-2xl p-6 sm:p-10 shadow-xs space-y-8 text-sm text-[#3B3C40] leading-relaxed font-light">
          <section className="space-y-3">
            <h2 className="font-serif text-lg text-[#0D0D0B] font-semibold">§ 1. Postanowienia Ogólne</h2>
            <p>
              1. Niniejszy Regulamin określa zasady korzystania ze sklepu internetowego Warsaw Durag Store, dostępnego pod adresem <strong>warsawduragstore.pl</strong>.
            </p>
            <p>
              2. Sklep prowadzony jest przez markę Warsaw Durag Store z siedzibą w Warszawie przy ul. Włodarzewskiej 4, e-mail: <strong>support@warsawduragstore.pl</strong>.
            </p>
            <p>
              3. Sklep prowadzi sprzedaż detaliczną duragów i akcesoriów na terytorium Polski oraz Unii Europejskiej.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-lg text-[#0D0D0B] font-semibold">§ 2. Ceny, Promocje i Płatności</h2>
            <p>
              1. Wszystkie ceny produktów widoczne na stronie są podane w polskich złotych (PLN) i są cenami brutto.
            </p>
            <p>
              2. Klient może wybrać następujące metody płatności: szybkie płatności online (BLIK, karta płatnicza, Apple Pay / Google Pay / Stripe) oraz płatność przy odbiorze osobistym.
            </p>
            <p>
              3. Sklep oferuje stałą promocję <strong>"Kup 2, trzeci durag gratis"</strong> — przy zakupie minimum 3 sztuk produktów objętych promocją, najtańszy z nich zostaje automatycznie przeceniony do 0 zł (gratis) w podsumowaniu zamówienia.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-lg text-[#0D0D0B] font-semibold">§ 3. Dostawa i Realizacja Zamówień</h2>
            <p>
              1. Zamówienia wysyłane są w ciągu 1–2 dni roboczych z magazynu w Warszawie.
            </p>
            <p>
              2. Dostawa realizowana jest za pośrednictwem Paczkomatów InPost 24/7 oraz przesyłek kurierskich. Dostawa na terenie Polski dla wszystkich zamówień jest <strong>darmowa</strong>.
            </p>
            <p>
              3. Możliwy jest również bezpłatny odbiór osobisty w Warszawie (ul. Włodarzewska 4 lub Centrum) po wcześniejszym uzgodnieniu terminu.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-lg text-[#0D0D0B] font-semibold">§ 4. Prawo do Odstąpienia od Umowy (Zwroty 14 Dni)</h2>
            <p>
              1. Zgodnie z ustawą z dnia 30 maja 2014 r. o prawach konsumenta, Konsument ma prawo odstąpić od umowy zawartej na odległość w terminie <strong>14 dni</strong> od dnia wejścia w posiadanie towaru, bez podawania przyczyny i bez ponoszenia dodatkowych kosztów.
            </p>
            <p>
              2. Aby skorzystać z prawa do odstąpienia od umowy, należy przesłać oświadczenie o odstąpieniu drogą mailową na adres: <strong>support@warsawduragstore.pl</strong> lub skorzystać z formularza zwrotu dostępnego w zakładce <Link href="/zwroty" className="underline font-medium text-black">Zwroty</Link>.
            </p>
            <p>
              3. Zwracany towar nie powinien nosić śladów użytkowania i powinien zostać odesłany w stanie kompletnym. Sklep zwraca wszystkie otrzymane od konsumenta płatności w terminie do 14 dni od otrzymania oświadczenia.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-lg text-[#0D0D0B] font-semibold">§ 5. Reklamacje i Zgodność Towaru z Umową</h2>
            <p>
              1. Sprzedawca odpowiada wobec Klienta za zgodność towaru z umową na zasadach określonych w przepisach Ustawy o prawach konsumenta oraz Kodeksu cywilnego.
            </p>
            <p>
              2. Reklamacje można zgłaszać na adres e-mail: <strong>support@warsawduragstore.pl</strong>. Reklamacje rozpatrywane są w terminie do 14 dni roboczych.
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
