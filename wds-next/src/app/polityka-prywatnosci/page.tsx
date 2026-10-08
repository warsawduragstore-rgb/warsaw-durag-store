import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import TrustBanner from '@/components/TrustBanner';

export const metadata: Metadata = {
  title: 'Polityka Prywatności — Warsaw Durag Store',
  description: 'Polityka prywatności i ochrony danych osobowych serwisu warsawduragstore.com. Informacje o administratorze danych, plikach cookies i prawach użytkowników.',
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
            Polityka prywatności
          </h1>
          <p className="text-xs text-[#787570]">
            Serwis warsawduragstore.com · Administrator danych osobowych: Michał Wyszyński
          </p>
        </header>

        {/* Document Content */}
        <div className="bg-[#111113] border border-[#1E1E22] p-6 sm:p-10 space-y-10 text-xs sm:text-sm text-[#A3A09B] leading-relaxed font-light">
          
          {/* Section 1 */}
          <section className="space-y-4">
            <h2 className="font-serif text-xl text-white font-normal">1. INFORMACJE OGÓLNE</h2>
            <p>
              Niniejsza polityka dotyczy Serwisu www, funkcjonującego pod adresem url:{' '}
              <strong className="text-white">warsawduragstore.com</strong>
            </p>
            <p>
              Operatorem serwisu oraz Administratorem danych osobowych jest:{' '}
              <strong className="text-white">Michał Wyszyński Grójecka 186/212, Warszawa 02-390</strong>
            </p>
            <p>
              Adres kontaktowy poczty elektronicznej operatora:{' '}
              <a href="mailto:support@warsawduragstore.com" className="text-[#C8794B] underline hover:text-white transition-colors">
                support@warsawduragstore.com
              </a>
            </p>
            <p>
              Operator jest Administratorem Twoich danych osobowych w odniesieniu do danych podanych dobrowolnie w Serwisie.
            </p>
            <div>
              <p className="text-white font-medium mb-2">Serwis wykorzystuje dane osobowe w następujących celach:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Prowadzenie systemu komentarzy</li>
                <li>Obsługa zapytań przez formularz</li>
                <li>Przygotowanie, pakowanie, wysyłka towarów</li>
              </ul>
            </div>
            <div>
              <p className="text-white font-medium mb-2">Serwis realizuje funkcje pozyskiwania informacji o użytkownikach i ich zachowaniu w następujący sposób:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Poprzez dobrowolnie wprowadzone w formularzach dane, które zostają wprowadzone do systemów Operatora.</li>
                <li>Poprzez zapisywanie w urządzeniach końcowych plików cookie (tzw. „ciasteczka”).</li>
              </ul>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-4 pt-6 border-t border-[#1E1E22]">
            <h2 className="font-serif text-xl text-white font-normal">2. WYBRANE METODY OCHRONY DANYCH STOSOWANE PRZEZ OPERATORA</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Miejsca logowania i wprowadzania danych osobowych są chronione w warstwie transmisji (certyfikat SSL). Dzięki temu dane osobowe i dane logowania, wprowadzone na stronie, zostają zaszyfrowane w komputerze użytkownika i mogą być odczytane jedynie na docelowym serwerze.
              </li>
              <li>
                Dane osobowe przechowywane w bazie danych są zaszyfrowane w taki sposób, że jedynie posiadający Operator klucz może je odczytać. Dzięki temu dane są chronione na wypadek wykradzenia bazy danych z serwera.
              </li>
              <li>
                Istotnym elementem ochrony danych jest regularna aktualizacja wszelkiego oprogramowania, wykorzystywanego przez Operatora do przetwarzania danych osobowych, co w szczególności oznacza regularne aktualizacje komponentów programistycznych.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-4 pt-6 border-t border-[#1E1E22]">
            <h2 className="font-serif text-xl text-white font-normal">3. HOSTING</h2>
            <p>
              Serwis jest hostowany (technicznie utrzymywany) na serwerach operatora:{' '}
              <strong className="text-white">seohost.pl</strong>
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-4 pt-6 border-t border-[#1E1E22]">
            <h2 className="font-serif text-xl text-white font-normal">4. TWOJE PRAWA I DODATKOWE INFORMACJE O SPOSOBIE WYKORZYSTANIA DANYCH</h2>
            <p>
              W niektórych sytuacjach Administrator ma prawo przekazywać Twoje dane osobowe innym odbiorcom, jeśli będzie to niezbędne do wykonania zawartej z Tobą umowy lub do zrealizowania obowiązków ciążących na Administratorze. Dotyczy to takich grup odbiorców:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>firma hostingowa na zasadzie powierzenia</li>
              <li>kurierzy</li>
              <li>operatorzy pocztowi</li>
              <li>operatorzy płatności</li>
            </ul>
            <p>
              Twoje dane osobowe przetwarzane przez Administratora nie dłużej, niż jest to konieczne do wykonania związanych z nimi czynności określonych osobnymi przepisami (np. o prowadzeniu rachunkowości). W odniesieniu do danych marketingowych dane nie będą przetwarzane dłużej niż przez 3 lata.
            </p>
            <div>
              <p className="text-white font-medium mb-2">Przysługuje Ci prawo żądania od Administratora:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>dostępu do danych osobowych Ciebie dotyczących,</li>
                <li>ich sprostowania,</li>
                <li>usunięcia,</li>
                <li>ograniczenia przetwarzania,</li>
                <li>oraz przenoszenia danych.</li>
              </ul>
            </div>
            <p>
              Przysługuje Ci prawo do złożenia sprzeciwu w zakresie przetwarzania wskazanego w pkt 3.3 c) wobec przetwarzania danych osobowych w celu wykonania prawnie uzasadnionych interesów realizowanych przez Administratora, w tym profilowania, przy czym prawo sprzeciwu nie będzie mogło być wykonane w przypadku istnienia ważnych prawnie uzasadnionych podstaw do przetwarzania, nadrzędnych wobec Ciebie interesów, praw i wolności, w szczególności ustalenia, dochodzenia lub obrony roszczeń.
            </p>
            <p>
              Na działania Administratora przysługuje skarga do Prezesa Urzędu Ochrony Danych Osobowych, ul. Stawki 2, 00-193 Warszawa.
            </p>
            <p>
              Podanie danych osobowych jest dobrowolne, lecz niezbędne do obsługi Serwisu.
            </p>
            <p>
              W stosunku do Ciebie mogą być podejmowane czynności polegające na zautomatyzowanym podejmowaniu decyzji, w tym profilowaniu w celu świadczenia usług w ramach zawartej umowy oraz w celu prowadzenia przez Administratora marketingu bezpośredniego.
            </p>
            <p>
              Dane osobowe nie są przekazywane od krajów trzecich w rozumieniu przepisów o ochronie danych osobowych. Oznacza to, że nie przesyłamy ich poza teren Unii Europejskiej.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-4 pt-6 border-t border-[#1E1E22]">
            <h2 className="font-serif text-xl text-white font-normal">5. INFORMACJE W FORMULARZACH</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Serwis zbiera informacje podane dobrowolnie przez użytkownika, w tym dane osobowe, o ile zostaną one podane.</li>
              <li>Serwis może zapisać informacje o parametrach połączenia (oznaczenie czasu, adres IP).</li>
              <li>Serwis, w niektórych wypadkach, może zapisać informację ułatwiającą powiązanie danych w formularzu z adresem e-mail użytkownika wypełniającego formularz. W takim wypadku adres e-mail użytkownika pojawia się wewnątrz adresu url strony zawierającej formularz.</li>
              <li>Dane podane w formularzu są przetwarzane w celu wynikającym z funkcji konkretnego formularza, np. w celu dokonania procesu obsługi zgłoszenia serwisowego lub kontaktu handlowego, rejestracji usług itp. Każdorazowo kontekst i opis formularza w czytelny sposób informuje, do czego on służy.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="space-y-4 pt-6 border-t border-[#1E1E22]">
            <h2 className="font-serif text-xl text-white font-normal">6. LOGI ADMINISTRATORA</h2>
            <p>
              Informacje o zachowaniu użytkowników w serwisie mogą podlegać logowaniu. Dane te są wykorzystywane w celu administrowania serwisem.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-4 pt-6 border-t border-[#1E1E22]">
            <h2 className="font-serif text-xl text-white font-normal">7. ISTOTNE TECHNIKI MARKETINGOWE</h2>
            <div className="space-y-3">
              <p>
                Operator stosuje analizę statystyczną ruchu na stronie, poprzez Google Analytics (Google Inc. z siedzibą w USA). Operator nie przekazuje do operatora tej usługi danych osobowych, a jedynie zanonimizowane informacje. Usługa bazuje na wykorzystaniu ciasteczek w urządzeniu końcowym użytkownika. W zakresie informacji o preferencjach użytkownika gromadzonych przez sieć reklamową Google użytkownik może przeglądać i edytować informacje wynikające z plików cookies przy pomocy narzędzia:{' '}
                <a
                  href="https://www.google.com/ads/preferences/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#C8794B] underline break-all hover:text-white transition-colors"
                >
                  https://www.google.com/ads/preferences/
                </a>
              </p>
              <p>
                Operator stosuje korzysta z piksela Facebooka. Ta technologia powoduje, że serwis Facebook (Facebook Inc. z siedzibą w USA) wie, że dana osoba w nim zarejestrowana korzysta z Serwisu. Bazuje w tym wypadku na danych, wobec których sam jest administratorem, Operator nie przekazuje od siebie żadnych dodatkowych danych osobowych serwisowi Facebook. Usługa bazuje na wykorzystaniu ciasteczek w urządzeniu końcowym użytkownika.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section className="space-y-4 pt-6 border-t border-[#1E1E22]">
            <h2 className="font-serif text-xl text-white font-normal">8. INFORMACJA O PLIKACH COOKIES</h2>
            <p>Serwis korzysta z plików cookies.</p>
            <p>
              Pliki cookies (tzw. „ciasteczka”) stanowią dane informatyczne, w szczególności pliki tekstowe, które przechowywane są w urządzeniu końcowym Użytkownika Serwisu i przeznaczone są do korzystania ze stron internetowych Serwisu. Cookies zazwyczaj zawierają nazwę strony internetowej, z której pochodzą, czas przechowywania ich na urządzeniu końcowym oraz unikalny numer.
            </p>
            <p>
              Podmiotem zamieszczającym na urządzeniu końcowym Użytkownika Serwisu pliki cookies oraz uzyskującym do nich dostęp jest operator Serwisu.
            </p>
            <div>
              <p className="text-white font-medium mb-2">Pliki cookies wykorzystywane są w następujących celach:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>utrzymanie sesji użytkownika Serwisu (po zalogowaniu), dzięki której użytkownik nie musi na każdej podstronie Serwisu ponownie wpisywać loginu i hasła;</li>
                <li>realizacji celów określonych powyżej w części „Istotne techniki marketingowe”;</li>
              </ul>
            </div>
            <p>
              W ramach Serwisu stosowane są dwa zasadnicze rodzaje plików cookies: „sesyjne” (session cookies) oraz „stałe” (persistent cookies). Cookies „sesyjne” są plikami tymczasowymi, które przechowywane są w urządzeniu końcowym Użytkownika do czasu wylogowania, opuszczenia strony internetowej lub wyłączenia oprogramowania (przeglądarki internetowej). „Stałe” pliki cookies przechowywane są w urządzeniu końcowym Użytkownika przez czas określony w parametrach plików cookies lub do czasu ich usunięcia przez Użytkownika.
            </p>
            <p>
              Oprogramowanie do przeglądania stron internetowych (przeglądarka internetowa) zazwyczaj domyślnie dopuszcza przechowywanie plików cookies w urządzeniu końcowym Użytkownika. Użytkownicy Serwisu mogą dokonać zmiany ustawień w tym zakresie. Przeglądarka internetowa umożliwia usunięcie plików cookies. Możliwe jest także automatyczne blokowanie plików cookies. Szczegółowe informacje na ten temat zawiera pomoc lub dokumentacja przeglądarki internetowej.
            </p>
            <p>
              Ograniczenia stosowania plików cookies mogą wpłynąć na niektóre funkcjonalności dostępne na stronach internetowych Serwisu.
            </p>
            <p>
              Pliki cookies zamieszczane w urządzeniu końcowym Użytkownika Serwisu wykorzystywane mogą być również przez współpracujące z operatorem Serwisu podmioty, w szczególności dotyczy to firm: Google (Google Inc. z siedzibą w USA), Facebook (Facebook Inc. z siedzibą w USA), Twitter (Twitter Inc. z siedzibą w USA).
            </p>
          </section>

          {/* Section 9 */}
          <section className="space-y-4 pt-6 border-t border-[#1E1E22]">
            <h2 className="font-serif text-xl text-white font-normal">9. ZARZĄDZANIE PLIKAMI COOKIES – JAK W PRAKTYCE WYRAŻAĆ I COFAĆ ZGODĘ?</h2>
            <p>
              Jeśli użytkownik nie chce otrzymywać plików cookies, może zmienić ustawienia przeglądarki. Zastrzegamy, że wyłączenie obsługi plików cookies niezbędnych dla procesów uwierzytelniania, bezpieczeństwa, utrzymania preferencji użytkownika może utrudnić, a w skrajnych przypadkach może uniemożliwić korzystanie ze stron www.
            </p>
            <p className="text-white font-medium">
              W celu zarządzania ustawieniami cookies wybierz z listy poniżej przeglądarkę internetową, której używasz i postępuj zgodnie z instrukcjami:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
              <a
                href="https://support.microsoft.com/pl-pl/help/10607/microsoft-edge-view-delete-browser-history"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-[#0B0B0C] border border-[#26262A] text-xs text-[#ECEAE7] hover:border-[#C8794B] hover:text-[#C8794B] transition-colors"
              >
                Microsoft Edge ↗
              </a>
              <a
                href="https://support.microsoft.com/pl-pl/help/278835/how-to-delete-cookie-files-in-internet-explorer"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-[#0B0B0C] border border-[#26262A] text-xs text-[#ECEAE7] hover:border-[#C8794B] hover:text-[#C8794B] transition-colors"
              >
                Internet Explorer ↗
              </a>
              <a
                href="https://support.google.com/chrome/bin/answer.py?hl=pl&answer=95647"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-[#0B0B0C] border border-[#26262A] text-xs text-[#ECEAE7] hover:border-[#C8794B] hover:text-[#C8794B] transition-colors"
              >
                Google Chrome ↗
              </a>
              <a
                href="https://support.apple.com/kb/PH5042"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-[#0B0B0C] border border-[#26262A] text-xs text-[#ECEAE7] hover:border-[#C8794B] hover:text-[#C8794B] transition-colors"
              >
                Apple Safari ↗
              </a>
              <a
                href="https://support.mozilla.org/pl/kb/W%C5%82%C4%85czanie%20i%20wy%C5%82%C4%85czanie%20obs%C5%82ugi%20ciasteczek"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-[#0B0B0C] border border-[#26262A] text-xs text-[#ECEAE7] hover:border-[#C8794B] hover:text-[#C8794B] transition-colors"
              >
                Mozilla Firefox ↗
              </a>
              <a
                href="https://help.opera.com/Windows/12.10/pl/cookies.html"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-[#0B0B0C] border border-[#26262A] text-xs text-[#ECEAE7] hover:border-[#C8794B] hover:text-[#C8794B] transition-colors"
              >
                Opera ↗
              </a>
            </div>

            <p className="text-white font-medium pt-3">Urządzenia mobilne:</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <a
                href="https://support.google.com/chrome/bin/answer.py?hl=pl&answer=95647"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-[#0B0B0C] border border-[#26262A] text-xs text-[#ECEAE7] hover:border-[#C8794B] hover:text-[#C8794B] transition-colors"
              >
                Android ↗
              </a>
              <a
                href="https://support.apple.com/kb/HT1677?viewlocale=pl_PL"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-[#0B0B0C] border border-[#26262A] text-xs text-[#ECEAE7] hover:border-[#C8794B] hover:text-[#C8794B] transition-colors"
              >
                Safari (iOS) ↗
              </a>
              <a
                href="https://www.windowsphone.com/pl-pl/how-to/wp7/web/changing-privacy-and-other-browser-settings"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-[#0B0B0C] border border-[#26262A] text-xs text-[#ECEAE7] hover:border-[#C8794B] hover:text-[#C8794B] transition-colors"
              >
                Windows Phone ↗
              </a>
            </div>
          </section>

        </div>

        <div className="mt-12">
          <TrustBanner />
        </div>
      </div>
    </div>
  );
}
