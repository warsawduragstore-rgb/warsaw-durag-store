import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Regulamin Sklepu Internetowego — Warsaw Durag Store',
  description: 'Oficjalny regulamin sklepu internetowego Warsaw Durag Store (Michał Wyszyński). Zasady składania zamówień, płatności, dostawy, reklamacji i odstąpienia od umowy.',
  alternates: {
    canonical: 'https://warsawduragstore.com/regulamin',
  },
};

export default function RegulaminPage() {
  return (
    <div className="min-h-screen bg-[#0B0B0C] text-[#ECEAE7] pt-28 pb-24 selection:bg-[#C8794B] selection:text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#787570] mb-4">
          <Link href="/" className="hover:text-white transition-colors">Start</Link>
          <span>/</span>
          <span className="text-[#C8794B]">Regulamin</span>
        </div>

        {/* Page Header */}
        <header className="mb-10 pb-6 border-b border-[#1E1E22]">
          <h1 className="font-serif text-3xl sm:text-4xl text-white font-medium tracking-tight mb-3">
            Regulamin sklepu internetowego
          </h1>
          <p className="text-xs text-[#787570]">
            Warsaw Durag Store Michał Wyszyński · NIP: 7011275454 · support@warsawduragstore.com
          </p>
        </header>

        {/* Spis treści & Wstęp */}
        <div className="bg-[#111113] border border-[#1E1E22] p-6 sm:p-8 mb-8 space-y-6">
          <div>
            <h2 className="text-sm font-semibold text-[#C8794B] mb-3">
              Spis treści
            </h2>
            <ol className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#A3A09B]">
              <li><a href="#postanowienia-ogolne" className="hover:text-white transition-colors">1. Postanowienia ogólne</a></li>
              <li><a href="#uslugi-elektroniczne" className="hover:text-white transition-colors">2. Usługi elektroniczne w sklepie</a></li>
              <li><a href="#umowa-sprzedazy" className="hover:text-white transition-colors">3. Warunki zawierania umowy</a></li>
              <li><a href="#platnosci" className="hover:text-white transition-colors">4. Sposoby i terminy płatności</a></li>
              <li><a href="#dostawa" className="hover:text-white transition-colors">5. Koszt, sposoby i termin dostawy</a></li>
              <li><a href="#reklamacja" className="hover:text-white transition-colors">6. REKLAMACJA PRODUKTU</a></li>
              <li><a href="#pozasadowe" className="hover:text-white transition-colors">7. POZASĄDOWE ROZPATRYWANIE SPORÓW</a></li>
              <li><a href="#odstapienie" className="hover:text-white transition-colors">8. PRAWO ODSTĄPIENIA OD UMOWY</a></li>
              <li><a href="#przedsiebiorcy" className="hover:text-white transition-colors">9. POSTANOWIENIA DOT. PRZEDSIĘBIORCÓW</a></li>
              <li><a href="#postanowienia-koncowe" className="hover:text-white transition-colors">10. POSTANOWIENIA KOŃCOWE</a></li>
            </ol>
          </div>

          <div className="pt-6 border-t border-[#1E1E22] text-xs text-[#A3A09B] leading-relaxed">
            <p className="mb-2 text-[#ECEAE7] font-medium">
              Sklep Internetowy warsawduragstore.com dba o prawa konsumenta.
            </p>
            <p className="mb-2">
              Konsument nie może zrzec się praw przyznanych mu w ustawie z dnia 30 maja 2014 r. o Prawach Konsumenta.
              Postanowienia umów mniej korzystne dla konsumenta niż postanowienia ustawy o Prawach Konsumenta są nieważne,
              a w ich miejsce stosuje się przepisy ustawy o Prawach Konsumenta. Dlatego też postanowienia niniejszego Regulaminu
              nie mają na celu wyłączać ani ograniczać jakichkolwiek praw konsumentów przysługujących im na mocy bezwzględnie
              wiążących przepisów prawa, a wszelkie ewentualne wątpliwości należy tłumaczyć na korzyść konsumenta.
            </p>
            <p>
              W przypadku ewentualnej niezgodności postanowień niniejszego Regulaminu z powyższymi przepisami, pierwszeństwo mają
              te przepisy i należy je stosować. Korzystanie z Usług Elektronicznych wiąże się z typowymi zagrożeniami dotyczącymi
              przekazywania danych poprzez Internet, takimi jak ich rozpowszechnienie, utrata lub uzyskiwanie do nich dostępu przez
              osoby nieuprawnione. Sklep Internetowy zapewnia środki techniczne i organizacyjne odpowiednie do stopnia zagrożenia
              bezpieczeństwa świadczonych Usług Elektronicznych.
            </p>
          </div>
        </div>

        {/* Treść regulaminu */}
        <div className="bg-[#111113] border border-[#1E1E22] p-6 sm:p-10 space-y-12 text-xs sm:text-sm text-[#A3A09B] leading-relaxed font-light">
          {/* 1. POSTANOWIENIA OGÓLNE */}
          <section id="postanowienia-ogolne" className="space-y-4">
            <h2 className="font-serif text-xl sm:text-2xl text-white font-normal">
              1. POSTANOWIENIA OGÓLNE
            </h2>
            <p>
              <strong className="text-white">1.1.</strong> Sklep Internetowy dostępny pod adresem internetowym{' '}
              <strong className="text-white">https://warsawduragstore.com</strong> (oraz <strong className="text-white">https://warsawduragstore.com</strong>) prowadzony jest przez{' '}
              <strong className="text-white">Warsaw Durag Store Michał Wyszyński</strong>, NIP <strong className="text-white">7011275454</strong>, adres poczty elektronicznej:{' '}
              <a href="mailto:support@warsawduragstore.com" className="text-[#C8794B] underline">support@warsawduragstore.com</a>.
            </p>
            <p>
              <strong className="text-white">1.2.</strong> Niniejszy Regulamin skierowany jest zarówno do konsumentów w rozumieniu przepisów Kodeksu cywilnego, jak i do przedsiębiorców korzystających ze Sklepu Internetowego (z wyjątkiem pkt. 9 Regulaminu, który skierowany jest wyłącznie do przedsiębiorców).
            </p>
            <p>
              <strong className="text-white">1.3.</strong> Administratorem danych osobowych przetwarzanych w związku z realizacją postanowień niniejszego Regulaminu jest Michał Wyszyński z siedzibą w Warszawie. Dane osobowe przetwarzane są w celach, w zakresie i w oparciu o zasady wskazane w Polityce Prywatności opublikowanej na stronach Sklepu Internetowego.
            </p>
            <div>
              <strong className="text-white block mb-2">1.4. Definicje:</strong>
              <div className="space-y-2 pl-4 border-l border-[#1E1E22]">
                <p><strong className="text-white">DZIEŃ ROBOCZY</strong> – jeden dzień od poniedziałku do piątku z wyłączeniem dni ustawowo wolnych od pracy.</p>
                <p><strong className="text-white">FORMULARZ REJESTRACJI</strong> – formularz dostępny w Sklepie Internetowym umożliwiający utworzenie Konta.</p>
                <p><strong className="text-white">FORMULARZ ZAMÓWIENIA</strong> – Usługa Elektroniczna, interaktywny formularz dostępny w Sklepie Internetowym umożliwiający złożenie Zamówienia, w szczególności poprzez dodanie Produktów do elektronicznego koszyka oraz określenie warunków Umowy Sprzedaży, w tym sposobu dostawy i płatności.</p>
                <p><strong className="text-white">KLIENT</strong> – (1) osoba fizyczna posiadająca pełną zdolność do czynności prawnych, a w wypadkach przewidzianych przez przepisy powszechnie obowiązujące także osoba fizyczna posiadająca ograniczoną zdolność do czynności prawnych; (2) osoba prawna; albo (3) jednostka organizacyjna nieposiadająca osobowości prawnej, której ustawa przyznaje zdolność prawną; – która zawarła lub zamierza zawrzeć Umowę Sprzedaży ze Sprzedawcą.</p>
                <p><strong className="text-white">KODEKS CYWILNY</strong> – ustawa kodeks cywilny z dnia 23 kwietnia 1964 r. (Dz.U. 1964 nr 16, poz. 93 ze zm.).</p>
                <p><strong className="text-white">KONTO</strong> – Usługa Elektroniczna, oznaczony indywidualną nazwą (loginem) i hasłem podanym przez Usługobiorcę zbiór zasobów w systemie teleinformatycznym Usługodawcy, w którym gromadzone są dane podane przez Usługobiorcę oraz informacje o złożonych przez niego Zamówieniach w Sklepie Internetowym.</p>
                <p><strong className="text-white">NEWSLETTER</strong> – Usługa Elektroniczna, elektroniczna usługa dystrybucyjna świadczona przez Usługodawcę za pośrednictwem poczty elektronicznej e-mail, która umożliwia wszystkim korzystającym z niej Usługobiorcom automatyczne otrzymywanie od Usługodawcy cyklicznych treści kolejnych edycji newslettera zawierającego informacje o Produktach, nowościach i promocjach w Sklepie Internetowym.</p>
                <p><strong className="text-white">PRODUKT</strong> – dostępna w Sklepie Internetowym rzecz ruchoma będąca przedmiotem Umowy Sprzedaży między Klientem a Sprzedawcą.</p>
                <p><strong className="text-white">REGULAMIN</strong> – niniejszy regulamin Sklepu Internetowego.</p>
                <p><strong className="text-white">SKLEP INTERNETOWY</strong> – sklep internetowy Usługodawcy dostępny pod adresem internetowym: https://warsawduragstore.com oraz https://warsawduragstore.com.</p>
                <p><strong className="text-white">SPRZEDAWCA lub USŁUGODAWCA</strong> – Michał Wyszyński zamieszkały w Warszawie przy ulicy Grójeckiej 186/212, 02-390 Warszawa, adres poczty elektronicznej: support@warsawduragstore.com.</p>
                <p><strong className="text-white">UMOWA SPRZEDAŻY</strong> – umowa sprzedaży Produktu zawierana albo zawarta między Klientem, a Sprzedawcą za pośrednictwem Sklepu Internetowego.</p>
                <p><strong className="text-white">USŁUGA ELEKTRONICZNA</strong> – usługa świadczona drogą elektroniczną przez Usługodawcę na rzecz Usługobiorcy za pośrednictwem Sklepu Internetowego.</p>
                <p><strong className="text-white">USŁUGOBIORCA</strong> – (1) osoba fizyczna posiadająca pełną zdolność do czynności prawnych, a w wypadkach przewidzianych przez przepisy powszechnie obowiązujące także osoba fizyczna posiadająca ograniczoną zdolność do czynności prawnych; (2) osoba prawna; albo (3) jednostka organizacyjna nieposiadająca osobowości prawnej, której ustawa przyznaje zdolność prawną; – korzystająca lub zamierzająca korzystać z Usługi Elektronicznej.</p>
                <p><strong className="text-white">USTAWA O PRAWACH KONSUMENTA</strong> – ustawa z dnia 30 maja 2014 r. o prawach konsumenta (Dz. U. z 2020 r. poz. 287).</p>
                <p><strong className="text-white">ZAMÓWIENIE</strong> – oświadczenie woli Klienta składane za pomocą Formularza Zamówienia i zmierzające bezpośrednio do zawarcia Umowy Sprzedaży Produktu ze Sprzedawcą.</p>
              </div>
            </div>
          </section>

          {/* 2. USŁUGI ELEKTRONICZNE W SKLEPIE INTERNETOWYM */}
          <section id="uslugi-elektroniczne" className="space-y-4 pt-6 border-t border-[#1E1E22]">
            <h2 className="font-serif text-xl sm:text-2xl text-white font-normal">
              2. USŁUGI ELEKTRONICZNE W SKLEPIE INTERNETOWYM
            </h2>
            <p>
              <strong className="text-white">2.1.</strong> W Sklepie Internetowym dostępne są następujące Usługi Elektroniczne: Formularz Zamówienia, Konto oraz Newsletter.
            </p>
            <p>
              <strong className="text-white">2.2. Konto</strong> – korzystanie z Konta możliwe jest po wykonaniu łącznie dwóch kolejnych kroków przez Usługobiorcę – (1) wypełnieniu Formularza Rejestracji oraz (2) kliknięciu przycisku akcji. W Formularzu Rejestracji niezbędne jest podanie przez Usługobiorcę następujących danych Usługobiorcy: imię i nazwisko/nazwa firmy, adres poczty elektronicznej, numer telefonu kontaktowego oraz hasło. W wypadku Usługobiorców niebędących konsumentami niezbędne jest także podanie nazwy firmy oraz numeru NIP.
            </p>
            <p>
              <strong className="text-white">2.3.</strong> Usługa Elektroniczna Konto świadczona jest nieodpłatnie przez czas nieoznaczony. Usługobiorca ma możliwość, w każdej chwili i bez podania przyczyny, usunięcia Konta (rezygnacji z Konta) poprzez wysłanie stosownego żądania do Usługodawcy, w szczególności za pośrednictwem poczty elektronicznej na adres: support@warsawduragstore.com lub też pisemnie na adres: Grójecka 186/212, 02-390 Warszawa, z dopiskiem „Sklep Internetowy Warsaw Durag Store”.
            </p>
            <p>
              <strong className="text-white">2.4. Formularz Zamówienia</strong> – korzystanie z Formularza Zamówienia rozpoczyna się z momentem dodania przez Klienta pierwszego Produktu do elektronicznego koszyka w Sklepie Internetowym. Złożenie Zamówienia następuje po wykonaniu przez Klienta łącznie dwóch kolejnych kroków – (1) po wypełnieniu Formularza Zamówienia i (2) kliknięciu na stronie Sklepu Internetowego po wypełnieniu Formularza Zamówienia pola „Potwierdź zakup” – do tego momentu istnieje możliwość samodzielnej modyfikacji wprowadzanych danych (w tym celu należy kierować się wyświetlanymi komunikatami oraz informacjami dostępnymi na stronie Sklepu Internetowego). W Formularzu Zamówienia niezbędne jest podanie przez Klienta następujących danych dotyczących Klienta: imię i nazwisko/nazwa firmy, adres (ulica, numer domu/mieszkania, kod pocztowy, miejscowość, kraj), adres poczty elektronicznej, numer telefonu kontaktowego oraz danych dotyczących Umowy Sprzedaży: Produkt/y, ilość Produktu/ów, miejsce i sposób dostawy Produktu/ów, sposób płatności. W wypadku Klientów niebędących konsumentami niezbędne jest także podanie nazwy firmy oraz numeru NIP.
            </p>
            <p>
              <strong className="text-white">2.5.</strong> Usługa Elektroniczna Formularz Zamówienia świadczona jest nieodpłatnie oraz ma charakter jednorazowy i ulega zakończeniu z chwilą złożenia Zamówienia za jego pośrednictwem albo z chwilą wcześniejszego zaprzestania składania Zamówienia za jego pośrednictwem przez Usługobiorcę. W celu wykrywania i korygowania błędów we wprowadzonych danych Klienta po wypełnieniu Formularza Zamówienia, a przed złożeniem Zamówienia wyświetlane jest podsumowanie danych wprowadzonych przez Klienta umożliwiające cofnięcie się przez Klienta do Formularza Zamówienia i poprawienie lub uzupełnienie danych Klienta.
            </p>
            <p>
              <strong className="text-white">2.6. Newsletter</strong> – korzystanie z Newslettera następuje po spełnieniu łącznie trzech kolejnych kroków – (1) podaniu w zakładce „Newsletter” widocznej stronie Sklepu Internetowego adresu poczty elektronicznej, na który mają być przesyłane kolejne edycje Newslettera, (2) kliknięciu przycisku akcji oraz (3) potwierdzeniu chęci zapisania się na Newsletter poprzez kliknięcie w link potwierdzający przesłany na podany adres poczty elektronicznej. Na Newsletter można się również zapisać poprzez zaznaczenie odpowiedniego checkboxa w trakcie zakładania Konta – z chwilą utworzenia Konta i potwierdzenia chęci zapisania się na Newsletter poprzez kliknięcie w link potwierdzający przesłany na podany adres poczty elektronicznej Usługobiorca zostaje zapisany na Newsletter. Zasady dotyczące wysyłania Newslettera i związanego z tym przetwarzania danych osobowych opisane zostały w sposób szczegółowy w Polityce Prywatności na stronie Sklepu Internetowego w zakładce „Polityka prywatności”.
            </p>
            <p>
              <strong className="text-white">2.7.</strong> Usługa Elektroniczna Newsletter świadczona jest nieodpłatnie przez czas nieoznaczony. Usługobiorca ma możliwość, w każdej chwili i bez podania przyczyny, wypisania się z Newslettera (rezygnacji z Newslettera) poprzez wysłanie stosownego żądania do Usługodawcy, w szczególności za pośrednictwem poczty elektronicznej na adres: support@warsawduragstore.com lub też pisemnie na adres: Grójecka 186/212, 02-390 Warszawa, z dopiskiem „Sklep Internetowy Warsaw Durag Store” lub poprzez kliknięcie w znajdujący się w końcowej części newslettera link o treści: “Jeśli nie chcesz dostawać od nas wiadomości tego typu, możesz zrezygnować z subskrypcji klikając w ten link”, co spowoduje przeniesienie na stronę internetową gdzie Usługobiorca niezwłocznie otrzymuje potwierdzenie wykonania wypisania z listy subskrybentów Usługi Elektronicznej Newsletter.
            </p>
            <p>
              <strong className="text-white">2.8. Wymagania techniczne</strong> niezbędne do współpracy z systemem teleinformatycznym, którym posługuje się Usługodawca: (1) komputer, laptop lub inne urządzenie multimedialne z dostępem do Internetu; (2) dostęp do poczty elektronicznej; (3) przeglądarka internetowa: Mozilla Firefox w wersji 17.0 i wyższej lub Internet Explorer w wersji 10.0 i wyższej, Opera w wersji 12.0 i wyższej, Google Chrome w wersji 23.0. i wyższej, Safari w wersji 5.0 i wyższej; (4) zalecana minimalna rozdzielczość ekranu: 1024×768; (5) włączenie w przeglądarce internetowej możliwości zapisu plików Cookies oraz obsługi Javascript.
            </p>
            <p>
              <strong className="text-white">2.9.</strong> Usługobiorca obowiązany jest do korzystania ze Sklepu Internetowego w sposób zgodny z prawem i dobrymi obyczajami mając na uwadze poszanowanie dóbr osobistych, praw autorskich i własności intelektualnej Usługodawcy oraz praw osób trzecich. Usługobiorca obowiązany jest do wprowadzania danych zgodnych ze stanem faktycznym. Usługobiorcę obowiązuje zakaz dostarczania treści o charakterze bezprawnym. Korzystanie ze Sklepu Internetowego w sposób niewłaściwy poprzez celowe próby uruchamiania lub wprowadzania szkodliwych materiałów, wirusów, koni trojańskich, robaków komputerowych, bomb logicznych oraz oprogramowania mającego na celu uszkodzenie lub zniszczenie portalu jest zabronione. Wszelkie próby nieautoryzowanego dostępu do Sklepu Internetowego jak i serwerów, baz danych, oraz komputerów będących częścią tego Sklepu Internetowego są zakazane. Usługobiorca zobowiązuje się do nieprowadzenia świadomych działań mających na celu czasowe lub trwałe zatrzymanie pracy portalu a w szczególności przeprowadzania prób lub ataków typu odmowa usługi (DOS) lub rozproszona odmowa usługi (DDOS).
            </p>
            <div className="space-y-2 pt-2">
              <strong className="text-white block">2.10. Tryb postępowania reklamacyjnego usług elektronicznych:</strong>
              <p>
                <strong className="text-white">2.11.</strong> Reklamacje związane ze świadczeniem Usług Elektronicznych przez Usługodawcę oraz pozostałe reklamacje związane z działaniem Sklepu Internetowego (z wyłączeniem procedury reklamacji Produktu, która została wskazana w pkt. 6 i 7 Regulaminu) Usługobiorca może składać na przykład: pisemnie na adres: Grójecka 186/212, 02-390 Warszawa, z dopiskiem „Sklep Internetowy Warsaw Durag Store” lub w formie elektronicznej za pośrednictwem poczty elektronicznej na adres: support@warsawduragstore.com.
              </p>
              <p>
                <strong className="text-white">2.12.</strong> Zaleca się podanie przez Usługobiorcę w opisie reklamacji: (1) informacji i okoliczności dotyczących przedmiotu reklamacji, w szczególności rodzaju i daty wystąpienia nieprawidłowości; (2) żądania Usługobiorcy; oraz (3) danych kontaktowych składającego reklamację – ułatwi to i przyspieszy rozpatrzenie reklamacji przez Usługodawcę. Wymogi podane w zdaniu poprzednim mają formę jedynie zalecenia i nie wpływają na skuteczność reklamacji złożonych z pominięciem zalecanego opisu reklamacji.
              </p>
              <p>
                <strong className="text-white">2.13.</strong> Ustosunkowanie się do reklamacji przez Usługodawcę następuje niezwłocznie, nie później niż w terminie 14 dni kalendarzowych od dnia jej złożenia.
              </p>
              <p>
                <strong className="text-white">2.14.</strong> Świadczenie usług drogą elektroniczną przez Usługodawcę ma charakter bezterminowy. Usługobiorca może w każdym czasie rozwiązać z Usługodawcą umowę o świadczenie usług w ramach Sklepu Internetowego, wypowiadając ją pisemnie na adres: Grójecka 186/212, 02-390 Warszawa, z dopiskiem „Sklep Internetowy Warsaw Durag Store” lub w formie elektronicznej za pośrednictwem poczty elektronicznej na adres: support@warsawduragstore.com.
              </p>
              <p>
                <strong className="text-white">2.15.</strong> Regulamin udostępniany przez Usługodawcę jest nieodpłatnie przed zawarciem umowy o świadczenie usług drogą elektroniczną, a także na żądanie Usługobiorcy w taki sposób, który umożliwia pozyskanie, odtwarzanie i utrwalanie treści Regulaminu za pomocą systemu teleinformatycznego, którym posługuje się Usługobiorca.
              </p>
            </div>
          </section>

          {/* 3. WARUNKI ZAWIERANIA UMOWY SPRZEDAŻY */}
          <section id="umowa-sprzedazy" className="space-y-4 pt-6 border-t border-[#1E1E22]">
            <h2 className="font-serif text-xl sm:text-2xl text-white font-normal">
              3. WARUNKI ZAWIERANIA UMOWY SPRZEDAŻY
            </h2>
            <p>
              <strong className="text-white">3.1.</strong> Cena Produktu uwidoczniona na stronie Sklepu Internetowego podana jest w złotych polskich i zawiera podatki. O łącznej cenie wraz z podatkami Produktu będącego przedmiotem Zamówienia, a także o kosztach dostawy (w tym opłatach za transport, dostarczenie i usługi pocztowe) oraz o innych kosztach, a gdy nie można ustalić wysokości tych opłat – o obowiązku ich uiszczenia, Klient jest informowany na stronach Sklepu Internetowego w trakcie składania Zamówienia, w tym także w chwili wyrażenia przez Klienta woli związania się Umową Sprzedaży.
            </p>
            <p>
              <strong className="text-white">3.2.</strong> Ceny Produktów mogą ulec zmianie w dowolnym czasie. Jednakże, z wyjątkiem dodania kosztów przesyłki, zmiany cen nie mają zastosowania do już zawartych Umów Sprzedaży.
            </p>
            <p>
              <strong className="text-white">3.3.</strong> Procedura zawarcia Umowy Sprzedaży w Sklepie Internetowym za pomocą Formularza Zamówień:
            </p>
            <p>
              <strong className="text-white">3.4.</strong> Zawarcie Umowy Sprzedaży między Klientem, a Sprzedawcą następuje po uprzednim złożeniu przez Klienta Zamówienia w Sklepie Internetowym zgodnie z pkt. 2.4 Regulaminu, na zasadach opisanych w punkcie 3.5 – 3.7 Regulaminu.
            </p>
            <p>
              <strong className="text-white">3.5.</strong> Po złożeniu Zamówienia przez Klienta Sprzedawca niezwłocznie potwierdza jego otrzymanie poprzez przesłanie wiadomości e-mail „Potwierdzenie zamówienia”. W/w wiadomość e-mail zawierająca „potwierdzenie zamówienia” nie oznacza akceptacji zamówienia przez Sprzedawcę. Wskazana wiadomość oznacza wyłącznie, że Sprzedawca otrzymał Zamówienie Klienta. W momencie, w którym Sprzedawca przetworzy zamówienie i przygotuje je do wysyłki, prześle do Klienta wiadomość e-mail „Wysłane”, która stanowić będzie potwierdzenie, iż Sprzedawca zaakceptował Zamówienie Klienta.
            </p>
            <p>
              <strong className="text-white">3.6.</strong> Akceptacja zamówienia Klienta przez Sprzedawcę jest jego decyzją. Sprzedawca chcąc się upewnić, że wybrany przez Klienta produkt jest dostępny, nie będzie akceptował zamówienia Klienta do momentu, w którym przygotuje go do wysyłki. W przypadku, w którym w momencie przygotowywania zamówienia do wysyłki w magazynie okaże się, że wybrany przez Klienta produkt jest już niedostępny, Sprzedawca poinformuje Klienta o konieczności usunięcia tej pozycji z Zamówienia. W takim przypadku Sprzedawca skontaktuje się z Klientem celem ustalenia czy Klient wyraża zgodę na zrealizowanie Zamówienia w pozostałym zakresie czy też chce anulować je w całości. W przypadku braku decyzji Klienta o realizacji Zamówienia w pozostałym zakresie lub jego anulacji w terminie 14 dni od daty poinformowania go o braku towaru na magazynie, Sprzedawca może w całości anulować Zamówienie Klienta. Sprzedawca zwróci niezwłocznie część płatności odpowiadającą anulowanej części Zamówienia lub całą płatność w przypadku anulowania całości Zamówienia (w przypadku, w którym Klient dokonał płatności w sposób inny niż za pobraniem).
            </p>
            <p>
              <strong className="text-white">3.7.</strong> W chwili wysłania przez Sprzedawcę i otrzymania przez Klienta wiadomości e-mail „Wysłane”, dochodzi do zawarcia między Sprzedawcą, a Klientem Umowy Sprzedaży. Wraz z Potwierdzeniem wysyłki Klient otrzyma treść niniejszego Regulaminu obowiązującego w dniu zawarcia Umowy Sprzedaży, który stanowi wzór Umowy. Klient może zachować Regulamin w pamięci komputera lub innych urządzeń osobistych i odtwarzać go w zależności od potrzeb.
            </p>
            <p>
              <strong className="text-white">3.8.</strong> Utrwalenie, zabezpieczenie oraz udostępnienie Klientowi treści zawieranej Umowy Sprzedaży następuje poprzez (1) udostępnienie niniejszego Regulaminu na stronie Sklepu Internetowego oraz (2) przesłanie Klientowi wiadomości e-mail, zawierającej potwierdzenie zawarcia Umowy Sprzedaży, zgodnie z treścią niniejszego Regulaminu. Treść Umowy Sprzedaży jest dodatkowo utrwalona i zabezpieczona w systemie informatycznym Sklepu Internetowego Sprzedawcy.
            </p>
          </section>

          {/* 4. SPOSOBY I TERMINY PŁATNOŚCI ZA PRODUKT */}
          <section id="platnosci" className="space-y-4 pt-6 border-t border-[#1E1E22]">
            <h2 className="font-serif text-xl sm:text-2xl text-white font-normal">
              4. SPOSOBY I TERMINY PŁATNOŚCI ZA PRODUKT
            </h2>
            <p>
              <strong className="text-white">4.1.</strong> Sprzedawca udostępnia Klientowi następujące sposoby płatności z tytułu Umowy Sprzedaży:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Płatność BLIK za pośrednictwem serwisu Tpay</li>
              <li>Płatność kartą płatniczą za pośrednictwem serwisu WooPayments / Stripe</li>
            </ul>
            <p>
              <strong className="text-white">4.2. Termin płatności:</strong> W przypadku wyboru przez Klienta płatności elektronicznych albo płatności kartą płatniczą, Klient obowiązany jest do dokonania płatności w terminie 7 dni kalendarzowych od dnia zawarcia Umowy Sprzedaży.
            </p>
          </section>

          {/* 5. KOSZT, SPOSOBY I TERMIN DOSTAWY */}
          <section id="dostawa" className="space-y-4 pt-6 border-t border-[#1E1E22]">
            <h2 className="font-serif text-xl sm:text-2xl text-white font-normal">
              5. KOSZT, SPOSOBY I TERMIN DOSTAWY
            </h2>
            <p>
              <strong className="text-white">5.1.</strong> Dostawa Produktu dostępna jest na terytorium Rzeczypospolitej Polskiej.
            </p>
            <p>
              <strong className="text-white">5.2.</strong> Dostawa Produktu do Klienta jest odpłatna, chyba że Umowa Sprzedaży stanowi inaczej. Koszty dostawy Produktu (w tym opłaty za transport, dostarczenie i usługi pocztowe) są wskazywane Klientowi na stronach Sklepu Internetowego w zakładce „Dostawa i płatność” oraz w trakcie składania Zamówienia, w tym także w chwili wyrażenia przez Klienta woli związania się Umową Sprzedaży.
            </p>
            <p>
              <strong className="text-white">5.3.</strong> Sprzedawca udostępnia Klientowi następujące sposoby dostawy lub odbioru Produktu:
            </p>
            <p>
              <strong className="text-white">5.4.</strong> Przesyłka kurierska, przesyłka paczkomatowa, przesyłka do punktu odbioru.
            </p>
            <p>
              <strong className="text-white">5.5.</strong> Termin dostawy Produktu do Klienta wynosi do 14 Dni Roboczych, chyba że w opisie danego Produktu lub w trakcie składania Zamówienia podano krótszy termin. W przypadku Produktów o różnych terminach dostawy, terminem dostawy jest najdłuższy podany termin, który jednak nie może przekroczyć 14 Dni Roboczych. Początek biegu terminu dostawy Produktu do Klienta liczy się od dnia uznania rachunku bankowego lub konta rozliczeniowego Sprzedawcy.
            </p>
          </section>

          {/* 6. REKLAMACJA PRODUKTU */}
          <section id="reklamacja" className="space-y-4 pt-6 border-t border-[#1E1E22]">
            <h2 className="font-serif text-xl sm:text-2xl text-white font-normal">
              6. REKLAMACJA PRODUKTU
            </h2>
            <p>
              <strong className="text-white">6.1.</strong> Podstawa i zakres odpowiedzialności Sprzedawcy względem Klienta, jeżeli sprzedany Produkt ma wadę fizyczną lub prawną (rękojmia) są określone powszechnie obowiązującymi przepisami prawa, w szczególności w Kodeksie Cywilnym.
            </p>
            <p>
              <strong className="text-white">6.2.</strong> Sprzedawca obowiązany jest dostarczyć Klientowi Produkt bez wad. Szczegółowe informacje dotyczące odpowiedzialności Sprzedawcy z tytułu wady Produktu oraz uprawnień Klienta są określone na stronie Sklepu Internetowego w zakładce „Reklamacje i zwroty”.
            </p>
            <p>
              <strong className="text-white">6.3.</strong> Reklamacja może zostać złożona przez Klienta na przykład: pisemnie na adres: Grójecka 186/212, 02-390 Warszawa, z dopiskiem „Sklep Internetowy Warsaw Durag Store” lub w formie elektronicznej za pośrednictwem poczty elektronicznej na adres: support@warsawduragstore.com.
            </p>
            <p>
              <strong className="text-white">6.4.</strong> Zaleca się podanie przez Klienta w opisie reklamacji: (1) informacji i okoliczności dotyczących przedmiotu reklamacji, w szczególności rodzaju i daty wystąpienia wady; (2) żądania sposobu doprowadzenia Produktu do zgodności z Umową Sprzedaży lub oświadczenia o obniżeniu ceny albo odstąpieniu od Umowy Sprzedaży; oraz (3) danych kontaktowych składającego reklamację – ułatwi to i przyspieszy rozpatrzenie reklamacji przez Sprzedawcę. Wymogi podane w zdaniu poprzednim mają formę jedynie zalecenia i nie wpływają na skuteczność reklamacji złożonych z pominięciem zalecanego opisu reklamacji.
            </p>
            <p>
              <strong className="text-white">6.5.</strong> Sprzedawca ustosunkuje się do reklamacji Klienta niezwłocznie, nie później niż w terminie 14 dni od dnia jej złożenia. Brak ustosunkowania się Sprzedawcy w powyższym terminie oznacza, że Sprzedawca uznał reklamację za uzasadnioną.
            </p>
            <p>
              <strong className="text-white">6.6.</strong> W przypadku, gdy do ustosunkowania się przez Sprzedawcę do reklamacji Klienta lub do wykonania uprawnień Klienta wynikających z rękojmi niezbędne będzie dostarczenie Produktu do Sprzedawcy, Klient zostanie poproszony przez Sprzedawcę o dostarczenie Produktu na koszt Sprzedawcy na adres Grójecka 186/212, 02-390 Warszawa z dopiskiem „Sklep Internetowy Warsaw Durag Store”. W takim przypadku Sprzedawca prześle do Klienta etykietę zwrotu, która będzie uprawniała go do przesłania przesyłki do Sprzedawcy na koszt Sprzedawcy bez ponoszenia jakichkolwiek opłat przez Klienta. Sprzedawca nie będzie akceptował i odbierał przesyłek przesłanych do niego przez Klienta w opcji za pobraniem. Jeżeli jednak ze względu na rodzaj wady, rodzaj Produktu lub sposób jego zamontowania dostarczenie Produktu przez Klienta byłoby niemożliwe albo nadmiernie utrudnione, Klient poproszony zostanie o udostępnienie, po uprzednim uzgodnieniu terminu, Produktu Sprzedawcy w miejscu, w którym Produkt się znajduje.
            </p>
            <p>
              <strong className="text-white">6.7.</strong> Prośba o dostarczenie Produktu, o której mowa w pkt. 6.6 Regulaminu nie ma wpływu na bieg terminu na ustosunkowanie się Sprzedawcy do reklamacji Klienta, o którym mowa w pkt. 6.5 Regulaminu oraz nie narusza prawa Klienta żądania od Sprzedawcy demontażu wadliwego Produktu i ponownego zamontowania Produktu po dokonaniu wymiany na wolny od wad lub usunięciu wady, o którym mowa w art. 561[1] Kodeksu cywilnego.
            </p>
            <p>
              <strong className="text-white">6.8.</strong> Z chwilą dostawy za ryzyko związane z produktem odpowiada Klient. Klient w pełni obejmie produkty w posiadanie z chwilą ich dostawy.
            </p>
          </section>

          {/* 7. POZASĄDOWE SPOSOBY ROZPATRYWANIA REKLAMACJI */}
          <section id="pozasadowe" className="space-y-4 pt-6 border-t border-[#1E1E22]">
            <h2 className="font-serif text-xl sm:text-2xl text-white font-normal">
              7. POZASĄDOWE SPOSOBY ROZPATRYWANIA REKLAMACJI I DOCHODZENIA ROSZCZEŃ ORAZ ZASADY DOSTĘPU DO TYCH PROCEDUR
            </h2>
            <p>
              <strong className="text-white">7.1.</strong> Sprzedawca informuje, że Użytkownik będący Konsumentem ma możliwość skorzystania z pozasądowych sposobów rozpatrywania reklamacji i dochodzenia roszczeń. Zasady dostępu do tych procedur dostępne są w siedzibach lub na stronach internetowych podmiotów uprawnionych do pozasądowego rozpatrywania sporów. Mogą nimi być w szczególności rzecznicy praw konsumenta lub Wojewódzkie Inspektoraty Inspekcji Handlowej, których lista jest dostępna na stronie internetowej Urzędu Ochrony Konkurencji i Konsumentów pod adresem{' '}
              <a href="https://www.uokik.gov.pl/pozasadowe_rozwiazywanie_sporow_konsumenckich.php" target="_blank" rel="noopener noreferrer" className="text-[#C8794B] underline break-all">
                https://www.uokik.gov.pl/pozasadowe_rozwiazywanie_sporow_konsumenckich.php
              </a>.
            </p>
            <p>
              <strong className="text-white">7.2.</strong> Konsument może zwrócić się z wnioskiem o wszczęcie postępowania w sprawie pozasądowego rozwiązywania sporów konsumenckich dotyczących zawartej Umowy sprzedaży do Inspekcji Handlowej, zgodnie z art. 36 ust. ustawy z dnia 19 lipca 2019 r. o Inspekcji Handlowej (Dz.U. z 2019 r. poz. 1668).
            </p>
            <p>
              <strong className="text-white">7.3.</strong> Konsument może wystąpić z wnioskiem o rozpoznanie sporu dotyczącego zawartej Umowy sprzedaży przez stały sąd polubowny działający przy odpowiednim wojewódzkim inspektoracie Inspekcji Handlowej, zgodnie z art. 37 ustawy z dnia 15 grudnia 2000 r. o Inspekcji Handlowej (Dz.U. z 2019 r. poz. 1668).
            </p>
            <p>
              <strong className="text-white">7.4.</strong> Jeżeli Umowa sprzedaży została zawarta pomiędzy Użytkownikiem będącym konsumentem, a Sprzedawcą za pośrednictwem Strony Internetowej, zgodnie z rozporządzeniem UE nr 524/2013, niniejszym informujemy, że Użytkownik będący konsumentem ma prawo do poszukiwania rozwiązania z nami ewentualnego sporu konsumenckiego w sposób pozasądowy, poprzez platformę do rozwiązywania sporów on-line, dostępną pod adresem{' '}
              <a href="http://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-[#C8794B] underline">
                http://ec.europa.eu/consumers/odr/
              </a>.
            </p>
            <p>
              <strong className="text-white">7.5.</strong> Sprzedawca informuje, że nie korzysta z pozasądowego rozwiązywania sporów, o których mowa w ustawie z dnia 23 września 2016 r., o pozasądowym rozwiązywaniu sporów konsumenckich.
            </p>
          </section>

          {/* 8. PRAWO ODSTĄPIENIA OD UMOWY */}
          <section id="odstapienie" className="space-y-4 pt-6 border-t border-[#1E1E22]">
            <h2 className="font-serif text-xl sm:text-2xl text-white font-normal">
              8. PRAWO ODSTĄPIENIA OD UMOWY
            </h2>
            <p>
              <strong className="text-white">8.1.</strong> Postanowienia przedmiotowego punktu stosuje się wyłącznie do klientów będących konsumentami lub przedsiębiorcami będącymi osobą fizyczną prowadzącą działalność gospodarczą, zawierającą ze Sprzedawcą umowę bezpośrednio związaną z jej działalnością gospodarczą, gdy z treści umowy wynika, że nie posiada ona dla tego przedsiębiorcy charakteru zawodowego, wynikającego w szczególności z przedmiotu wykonywanej przez niego działalności gospodarczej udostępnionego na podstawie przepisów o Centralnej Ewidencji i Informacji o Działalności Gospodarczej. Dla potrzeb niniejszego punktu określenie „Klient” w nim użyte odnosi się wyłącznie do podmiotów wskazanych w zdaniu poprzednim.
            </p>
            <p>
              <strong className="text-white">8.2.</strong> Klient, który zawarł umowę na odległość może od niej odstąpić bez podania przyczyn, składając stosowne oświadczenie:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>w przypadku konsumenta – <strong className="text-white">w terminie 30 dni</strong>;</li>
              <li>w przypadku przedsiębiorcy będącego osobą fizyczną prowadzącą działalność gospodarczą, zawierający ze Sprzedawcą umowę bezpośrednio związaną z jego działalnością gospodarczą, gdy z treści umowy wynika, że nie posiada ona dla tego przedsiębiorcy charakteru zawodowego, wynikającego w szczególności z przedmiotu wykonywanej przez niego działalności gospodarczej udostępnionego na podstawie przepisów o Centralnej Ewidencji i Informacji o Działalności Gospodarczej – <strong className="text-white">w terminie 30 dni</strong>,</li>
            </ul>
            <p>
              licząc od dnia, w którym Klient lub wskazana przez niego osoba trzecia (niebędąca przewoźnikiem) obejmie faktycznie w posiadanie kupiony produkt lub w przypadku wielu produktów uwzględnionych w jednym zamówieniu, lecz dostarczanych osobno, po upływie 30 dni od dnia, w którym Klient lub wskazana przez niego osoba trzecia (niebędąca przewoźnikiem) obejmie faktycznie w posiadanie ostatni z produktów. Do zachowania tego terminu wystarczy złożenie oświadczenia przed jego upływem.
            </p>
            <p>
              Koszty zwrotu Produktu ponosi Klient w całości z zastrzeżeniem, że jeśli Klient wybierze opcję zwrotu wygenerowanego za pośrednictwem strony internetowej https://warsawduragstore.com o której mowa w pkt. 8.3. lit. b pkt 5 i 7 przedmiotowego Regulaminu to ponosi koszty do określonej wysokości, widocznych przy wyborze opcji zwrotu. Jeżeli Produkt jest usługą, której wykonywanie – na wyraźne żądanie Klienta – rozpoczęło się przed upływem terminu do odstąpienia od umowy, Klient, który wykonuje prawo odstąpienia od umowy po zgłoszeniu takiego żądania, ma obowiązek zapłaty za świadczenia spełnione do chwili odstąpienia od umowy. Kwotę zapłaty oblicza się proporcjonalnie do zakresu spełnionego świadczenia, z uwzględnieniem uzgodnionej w umowie ceny lub wynagrodzenia. Jeżeli cena lub wynagrodzenie są nadmierne, podstawą obliczenia tej kwoty jest wartość rynkowa spełnionego świadczenia.
            </p>
            <div className="space-y-3">
              <strong className="text-white block">8.3. Oświadczenie o odstąpieniu od umowy może zostać złożone na przykład:</strong>
              <p>
                <strong className="text-white">a)</strong> pisemnie na adres: Grójecka 186/212, 02-390 Warszawa, z dopiskiem „Sklep Internetowy Warsaw Durag Store” lub w formie elektronicznej za pośrednictwem poczty elektronicznej na adres: support@warsawduragstore.com. Przykładowy wzór formularza odstąpienia od umowy zawarty jest w załączniku nr 2 do Ustawy o Prawach Konsumenta oraz dodatkowo dostępny jest na stronie Sklepu Internetowego w zakładce „Reklamacje i zwroty”. Klient może skorzystać z wzoru formularza, jednak nie jest to obowiązkowe.
              </p>
              <p>
                <strong className="text-white">b)</strong> za pośrednictwem strony internetowej https://warsawduragstore.com (lub https://warsawduragstore.com). Aby skorzystać z tej formy zwrotu Klient powinien:
              </p>
              <ol className="list-decimal pl-6 space-y-1">
                <li>Zalogować się na swoje Konto.</li>
                <li>Wybrać opcję „Zwrot Produktów”. Po wybraniu tej opcji pojawi się lista zamówień, w stosunku do których, Klient ma prawo do odstąpienia od umowy, na podstawie przedmiotowego punktu Regulaminu.</li>
                <li>Wybrać Zamówienie, w stosunku, do którego chce skorzystać z prawa do odstąpienia od umowy. Po wyborze zamówienia pojawi się przycisk „Dokonaj zwrotu”.</li>
                <li>Kliknąć przycisk „Dokonaj zwrotu” oraz wybrać produkty, w stosunku do których Klient chce skorzystać z prawa odstąpienia od umowy. Klient może podać przyczynę odstąpienia od umowy jednakże nie jest to obowiązkowe.</li>
                <li>Po wyborze produktów Klient będzie musiał wybrać sposób wysyłki towaru. Klient ma możliwość zwrotu Towaru za pośrednictwem dowolnego przewoźnika („Wysyłka własna”) albo poprzez zwrot wygenerowany na stronie https://warsawduragstore.com. Niezależnie od wyboru rodzaju zwrotu, Klient będzie musiał wypełnić dane niezbędne do dokonania zwrotu płatności.</li>
                <li>W przypadku wyboru opcji „Wysyłka własna”, po wypełnieniu danych niezbędnych do zwrotu, Klient będzie mógł wygenerować formularz zwrotu. Kliknięcie przycisku „Wygeneruj formularz zwrotu” jest równoznaczne ze skorzystaniem z prawa do odstąpienia od umowy. W tej sytuacji Klient ponosi całość kosztów zwrotu.</li>
                <li>W przypadku wyboru opcji zwrotu przesyłki poprzez przesyłkę wygenerowaną na stronie https://warsawduragstore.com, Klient będzie zobowiązany ponieść koszty zwrotu jedynie do wysokości podanej przy wyborze tej opcji. Dla klientów którzy są subskrybentami newslettera https://warsawduragstore.com koszt zwrotu jest niższy, co będzie automatycznie widoczne po wybraniu tej opcji. W tej sytuacji, celem dokończeniu procesu odstąpienia od umowy, Klient, po wyborze tej opcji zwrotu i po uzupełnieniu danych do zwrotu, będzie zobowiązany kliknąć przycisk „Następny krok”, zaakceptować regulamin i Politykę prywatności, a następnie dokonać zapłaty za zwrot w wysokości podanej przy wyborze tej opcji. Dokonanie płatności jest równoznaczne ze skorzystaniem z prawa do odstąpienia od umowy. Po wykonaniu tej płatności, Klient otrzyma instrukcje jak dokonać zwrot w formie sms lub/i maila. W przypadku, gdy Klient jest osobą fizyczną nieprowadzącą działalności gospodarczej lub rolnikiem ryczałtowym i dokona w całości ww. płatności za pośrednictwem banku, poczty lub spółdzielczej kasy oszczędnościowo – kredytowej a z ewidencji i dowodów dokumentujących zapłatę jednoznacznie wynika, jakiej konkretnie czynności dotyczyła, Sprzedawca jest zwolniony z obowiązku wystawienia dokumentu ewidencjonującego ww. usługę.</li>
              </ol>
            </div>
            <p>
              <strong className="text-white">8.4.</strong> W przypadku odstąpienia od umowy zawartej na odległość umowę uważa się za niezawartą.
            </p>
            <p>
              <strong className="text-white">8.5.</strong> Sprzedawca ma obowiązek niezwłocznie, nie później niż w terminie 14 dni od dnia otrzymania oświadczenia Klienta o odstąpieniu od umowy, zwrócić Klientowi wszystkie dokonane przez niego płatności, w tym koszty dostarczenia Produktu (z wyjątkiem dodatkowych kosztów wynikających z wybranego przez Klienta sposobu dostawy innego niż najtańszy zwykły sposób dostawy dostępny w Sklepie Internetowym). Sprzedawca dokonuje zwrotu płatności przy użyciu takiego samego sposobu płatności, jakiego użył Klient, chyba że Klient wyraźnie zgodził się na inny sposób zwrotu, który nie wiąże się dla niego z żadnymi kosztami. Sprzedawca może wstrzymać się ze zwrotem płatności otrzymanych od Klienta do chwili otrzymania Produktu z powrotem lub dostarczenia przez Klienta dowodu jego odesłania, w zależności od tego, które zdarzenie nastąpi wcześniej.
            </p>
            <p>
              <strong className="text-white">8.6.</strong> Klient ma obowiązek niezwłocznie, nie później niż w terminie 14 dni od dnia, w którym odstąpił od umowy, zwrócić Produkt Sprzedawcy. Do zachowania terminu wystarczy odesłanie Produktu bądź przy wyborze opcji zwrotu wygenerowanego za pośrednictwem strony https://warsawduragstore.com, nadanie go zgodnie z procedurą, o której mowa w pkt. 8.3. lit. b pkt 7 Regulaminu przed jego upływem. Klient może zwrócić Produkt na adres Grójecka 186/212, 02-390 Warszawa, z dopiskiem „Sklep Internetowy Warsaw Durag Store.”
            </p>
            <p>
              <strong className="text-white">8.7.</strong> Klient ponosi odpowiedzialność za zmniejszenie wartości Produktu będące wynikiem korzystania z niego w sposób wykraczający poza konieczny do stwierdzenia charakteru, cech i funkcjonowania Produktu.
            </p>
            <div className="space-y-2">
              <strong className="text-white block">8.8. Prawo odstąpienia od umowy zawartej na odległość nie przysługuje Klientowi w odniesieniu do umów:</strong>
              <ol className="list-decimal pl-6 space-y-1">
                <li>o świadczenie usług, jeżeli Sprzedawca wykonał w pełni usługę za wyraźną zgodą Klienta, który został poinformowany przed rozpoczęciem świadczenia, że po spełnieniu świadczenia przez Sprzedawcę utraci prawo odstąpienia od umowy;</li>
                <li>w której cena lub wynagrodzenie zależy od wahań na rynku finansowym, nad którymi Sprzedawca nie sprawuje kontroli, i które mogą wystąpić przed upływem terminu do odstąpienia od umowy;</li>
                <li>w której przedmiotem świadczenia jest Produkt nieprefabrykowany, wyprodukowany według specyfikacji Klienta lub służący zaspokojeniu jego zindywidualizowanych potrzeb;</li>
                <li>w której przedmiotem świadczenia jest Produkt ulegający szybkiemu zepsuciu lub mająca krótki termin przydatności do użycia;</li>
                <li>w której przedmiotem świadczenia jest Produkt dostarczany w zapieczętowanym opakowaniu, którego po otwarciu opakowania nie można zwrócić ze względu na ochronę zdrowia lub ze względów higienicznych, jeżeli opakowanie zostało otwarte po dostarczeniu;</li>
                <li>w której przedmiotem świadczenia są Produkty, które po dostarczeniu, ze względu na swój charakter, zostają nierozłącznie połączone z innymi rzeczami;</li>
                <li>w której przedmiotem świadczenia są napoje alkoholowe, których cena została uzgodniona przy zawarciu Umowy Sprzedaży, a których dostarczenie może nastąpić dopiero po upływie 30 dni i których wartość zależy od wahań na rynku, nad którymi Sprzedawca nie ma kontroli;</li>
                <li>w której Klient wyraźnie żądał, aby Sprzedawca do niego przyjechał w celu dokonania pilnej naprawy lub konserwacji; jeżeli Sprzedawca świadczy dodatkowo inne usługi niż te, których wykonania Klient żądał, lub dostarcza Produkty inne niż części zamienne niezbędne do wykonania naprawy lub konserwacji, prawo odstąpienia od umowy przysługuje Klient w odniesieniu do dodatkowych usług lub Produktów;</li>
                <li>w której przedmiotem świadczenia są nagrania dźwiękowe lub wizualne albo programy komputerowe dostarczane w zapieczętowanym opakowaniu, jeżeli opakowanie zostało otwarte po dostarczeniu;</li>
                <li>o dostarczanie dzienników, periodyków lub czasopism, z wyjątkiem umowy o prenumeratę;</li>
                <li>zawartej w drodze aukcji publicznej;</li>
                <li>o świadczenie usług w zakresie zakwaterowania, innych niż do celów mieszkalnych, przewozu rzeczy, najmu samochodów, gastronomii, usług związanych z wypoczynkiem, wydarzeniami rozrywkowymi, sportowymi lub kulturalnymi, jeżeli w umowie oznaczono dzień lub okres świadczenia usługi;</li>
                <li>o dostarczanie treści cyfrowych, które nie są zapisane na nośniku materialnym, jeżeli spełnianie świadczenia rozpoczęło się za wyraźną zgodą Klienta przed upływem terminu do odstąpienia od umowy i po poinformowaniu go przez Sprzedawcę o utracie prawa odstąpienia od umowy.</li>
              </ol>
            </div>
            <p>
              <strong className="text-white">8.9.</strong> Prawo odstąpienia od umowy zawartej na odległość w terminie 30 dni przyznane Klientowi przez Sklep na podstawie niniejszego regulaminu nie narusza praw Klienta do odstąpienia od umowy zawartej na odległość wynikających z Ustawy z dnia 30 maja 2014 r. o prawach konsumenta.
            </p>
          </section>

          {/* 9. POSTANOWIENIA DOTYCZĄCE PRZEDSIĘBIORCÓW */}
          <section id="przedsiebiorcy" className="space-y-4 pt-6 border-t border-[#1E1E22]">
            <h2 className="font-serif text-xl sm:text-2xl text-white font-normal">
              9. POSTANOWIENIA DOTYCZĄCE PRZEDSIĘBIORCÓW NIEBĘDĄCYCH OSOBAMI FIZYCZNYMI
            </h2>
            <p>
              <strong className="text-white">9.1.</strong> Niniejszy punkt Regulaminu oraz postanowienia w nim zawarte dotyczą wyłącznie Klientów i Usługobiorców niebędących klientami, o których mowa w pkt. 8.1. niniejszego Regulaminu. Dla potrzeb niniejszego punktu określenie „Klient” w nim użyte odnosi się wyłącznie do podmiotów, o których mowa w zdaniu poprzednim.
            </p>
            <p>
              <strong className="text-white">9.2.</strong> Sprzedawcy przysługuje prawo odstąpienia od Umowy Sprzedaży zawartej z Klientem wskazanym w pkt. 9.1. w terminie 14 dni kalendarzowych od dnia jej zawarcia. Odstąpienie od Umowy Sprzedaży w tym wypadku może nastąpić bez podania przyczyny i nie rodzi po stronie Klienta wskazanego w pkt. 9.1. żadnych roszczeń w stosunku do Sprzedawcy.
            </p>
            <p>
              <strong className="text-white">9.3.</strong> Sprzedawca ma prawo ograniczyć dostępne sposoby płatności, w tym także wymagać dokonania przedpłaty w całości albo części i to niezależnie od wybranego przez Klienta wskazanego w pkt. 9.1. sposobu płatności oraz faktu zawarcia Umowy Sprzedaży.
            </p>
            <p>
              <strong className="text-white">9.4.</strong> Z chwilą wydania przez Sprzedawcę Produktu przewoźnikowi przechodzą na Klienta wskazanego w pkt 9.1. korzyści i ciężary związane z Produktem oraz niebezpieczeństwo przypadkowej utraty lub uszkodzenia Produktu. Sprzedawca w takim wypadku nie ponosi odpowiedzialności za utratę, ubytek lub uszkodzenie Produktu powstałe od przyjęcia go do przewozu aż do wydania go Klientowi wskazanemu w pkt 9.1. oraz za opóźnienie w przewozie przesyłki.
            </p>
            <p>
              <strong className="text-white">9.5.</strong> W razie przesłania Produktu do Klienta wskazanego w pkt 9.1. za pośrednictwem przewoźnika Klient wskazany w pkt 9.1. obowiązany jest zbadać przesyłkę w czasie i w sposób przyjęty przy przesyłkach tego rodzaju. Jeżeli stwierdzi, że w czasie przewozu nastąpił ubytek lub uszkodzenie Produktu, obowiązany jest dokonać wszelkich czynności niezbędnych do ustalenia odpowiedzialności przewoźnika.
            </p>
            <p>
              <strong className="text-white">9.6.</strong> Usługodawca może wypowiedzieć umowę o świadczenie Usługi Elektronicznej ze skutkiem natychmiastowym i bez wskazywania przyczyn poprzez przesłanie Usługobiorcy stosownego oświadczenia.
            </p>
            <p>
              <strong className="text-white">9.7.</strong> Odpowiedzialność Usługodawcy/Sprzedawcy w stosunku do Usługobiorcy/Klienta wskazanego w pkt 9.1., bez względu na jej podstawę prawną, jest ograniczona – zarówno w ramach pojedynczego roszczenia, jak również za wszelkie roszczenia w sumie – do wysokości zapłaconej ceny oraz kosztów dostawy z tytułu Umowy Sprzedaży, nie więcej jednak niż do kwoty jednego tysiąca złotych. Usługodawca/Sprzedawca ponosi odpowiedzialność w stosunku do Usługobiorcy/Klienta wskazanego w pkt 9.1. tylko za typowe szkody przewidywalne w momencie zawarcia umowy i nie ponosi odpowiedzialności z tytułu utraconych korzyści w stosunku do Usługobiorcy/Klienta wskazanego w pkt 9.1.
            </p>
            <p>
              <strong className="text-white">9.8.</strong> Wszelkie spory powstałe pomiędzy Sprzedawcą/Usługodawcą, a Klientem wskazanym w pkt 9.1. zostają poddane sądowi właściwemu ze względu na siedzibę Sprzedawcy/Usługodawcy.
            </p>
          </section>

          {/* 10. POSTANOWIENIA KOŃCOWE */}
          <section id="postanowienia-koncowe" className="space-y-4 pt-6 border-t border-[#1E1E22]">
            <h2 className="font-serif text-xl sm:text-2xl text-white font-normal">
              10. POSTANOWIENIA KOŃCOWE
            </h2>
            <p>
              <strong className="text-white">10.1.</strong> Umowy zawierane poprzez Sklep Internetowy zawierane są w języku polskim.
            </p>
            <p>
              <strong className="text-white">10.2.</strong> Zmiana Regulaminu – Usługodawca ma prawo do dokonywania zmian niniejszego Regulaminu z ważnych przyczyn, to jest: zmiany przepisów prawa; zmiany sposobów płatności i dostaw, zmiany zakresu, odpłatności lub formy świadczonych Usług Elektronicznych – w zakresie, w jakim te zmiany wpływają na realizację postanowień niniejszego Regulaminu.
            </p>
            <p>
              <strong className="text-white">10.3.</strong> W przypadku zawarcia na podstawie niniejszego Regulaminu umów o charakterze ciągłym (np. świadczenie Usługi Elektronicznej – Konto) zmieniony regulamin wiąże Usługobiorcę, jeżeli zostały zachowane wymagania określone w art. 384 oraz 384[1] Kodeksu cywilnego, to jest Usługobiorca został prawidłowo powiadomiony o zmianach i nie wypowiedział umowy w terminie 14 dni kalendarzowych od dnia powiadomienia. W wypadku gdyby zmiana Regulaminu skutkowała wprowadzeniem jakichkolwiek nowych opłat lub podwyższeniem obecnych Usługobiorca będący konsumentem ma prawo odstąpienia od umowy.
            </p>
            <p>
              <strong className="text-white">10.4.</strong> W przypadku zawarcia na podstawie niniejszego Regulaminu umów o innym charakterze niż umowy ciągłe (np. Umowa Sprzedaży) zmiany Regulaminu nie będą w żaden sposób naruszać praw nabytych Usługobiorców/Klientów będących konsumentami przed dniem wejścia w życie zmian Regulaminu, w szczególności zmiany Regulaminu nie będą miały wpływu na już składane lub złożone Zamówienia oraz zawarte, realizowane lub wykonane Umowy Sprzedaży.
            </p>
            <p>
              <strong className="text-white">10.5.</strong> W sprawach nieuregulowanych w niniejszym Regulaminie mają zastosowanie powszechnie obowiązujące przepisy prawa polskiego, w szczególności: Kodeksu cywilnego; ustawy o świadczeniu usług drogą elektroniczną z dnia 18 lipca 2002 r. (Dz.U. 2002 nr 144, poz. 1204 ze zm.); dla Umów Sprzedaży zawartych od 25 grudnia 2014 roku z Klientami będącymi konsumentami – przepisy ustawy o prawach konsumenta z dnia 30 maja 2014 r. (Dz.U. 2014 r. poz. 827 ze zm.); ustawy z dnia 23 września 2016 r. o pozasądowym rozwiązywaniu sporów konsumenckich (Dz.U. 2016 poz. 1823) oraz inne właściwe przepisy powszechnie obowiązującego prawa.
            </p>
            <p>
              <strong className="text-white">10.6.</strong> W razie uznania jednego z postanowień niniejszego Regulaminu lub zapisów Umowy za nieważne na podstawie prawomocnej decyzji właściwego organu administracji publicznej albo prawomocnego wyroku sądu powszechnego, pozostałe postanowienia i warunki niniejszego Regulaminu pozostaną w mocy, a wspomniane stwierdzenie nieważności nie będzie ich dotyczyć.
            </p>
            <p className="pt-4 text-xs text-[#787570]">
              Regulamin sklepu internetowego https://warsawduragstore.com w formacie tekstowym jest dostępny pod adresem:{' '}
              <a
                href="https://docs.google.com/document/d/1IkJvluVzaFTAo7LA5EbEsvwSpMCiOK-BvmA3JwL5Y_4/edit?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C8794B] underline"
              >
                Regulamin Google Docs
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
