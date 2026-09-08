export interface BlogPost {
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  date: string;
  readingTime: string;
  category: 'Kultura & Historia' | 'Technika 360 Waves' | 'Stylizacje & Moda' | 'Pielęgnacja';
  image: string;
  author: {
    name: string;
    role: string;
  };
  content: string[];
  keyTakeaways?: string[];
  recommendedCategory?: 'silk' | 'satin' | 'velvet' | 'accessories';
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'dlaczego-nosimy-durag',
    title: 'Dlaczego nosimy durag? Historia, funkcja i kultura',
    subtitle: 'Trzy kluczowe powody, dla których durag zyskał status ikony streetwearu',
    excerpt:
      'Od ochrony fal 360 i pielęgnacji naturalnej wilgoci po mocny punkt stylizacji ulicznej. Poznaj powody, dla których durag stał się globalnym fenomenem.',
    date: '14 stycznia 2026',
    readingTime: '5 min czytania',
    category: 'Kultura & Historia',
    image: '/media/wds/wyszol1126.jpg',
    author: {
      name: 'Kuba Świętoń',
      role: 'WDS Atelier Warszawa',
    },
    recommendedCategory: 'silk',
    keyTakeaways: [
      'Utrzymanie i kompresja fal 360 waves podczas snu oraz po sesji szczotkowania.',
      'Ochrona przed elektryzowaniem, puszeniem i utratą naturalnych olejów.',
      'Autentyczny element współczesnego streetwearu w modzie miejskiej.',
    ],
    content: [
      'Jedno wiemy na pewno: trendy zza Oceanu szybko znajdują swoich odbiorców w Europie. Podobnie stało się z duragiem. Ten dotarł już na stałe do Polski i zyskuje coraz więcej fanów. Jest funkcjonalny i stanowi mocny punkt każdej przemyślanej stylizacji. Nic dziwnego, że mają go w swoich szafach raperzy, sportowcy i osoby ceniące nienaganną fryzurę.',
      'Po pierwsze: kompresja fal 360 waves. To właśnie do tego durag został zaprojektowany. Naturalny skręt włosa potrzebuje stałego nacisku po sesji szczotkowania (brushing). Bez duraga włosy rozprostowują się i puszą w kontakcie z pościelą. Dzięki regularnemu noszeniu jedwabnego duraga z pasami 100 cm uzyskujemy głęboki, jednolity wzór fal wokół całej głowy.',
      'Po drugie: ochrona nawilżenia. Bawełniana poszewka poduszki działa jak gąbka — wyciąga z włosów sebum i nałożone odżywki. Prawdziwy jedwab morwowy 19 Momme nie pochłania wilgoci, przez co włosy pozostają miękkie, nawilżone i odporne na łamanie.',
      'Po trzecie: niepowtarzalny styl. Durag zyskał status ikony high-street fashion — od wybiegów w Paryżu po warszawskie ulice. Znakomicie komponuje się z bluzą hoodie, bomberką, a w odważniejszych zestawieniach z garniturem.',
    ],
  },
  {
    slug: 'czym-sa-360-waves-kompleksowy-przewodnik-dla-poczatkujacych',
    title: 'Czym są 360 Waves? Kompleksowy przewodnik dla początkujących',
    subtitle: 'Wszystko o wzorze wirujących fal, technice szczotkowania i kompresji',
    excerpt:
      '360 waves to jedna z najbardziej charakterystycznych i pożądanych fryzur. Wyjaśniamy krok po kroku jak trenować cebulki włosa i uzyskać idealną symetrię.',
    date: '8 lutego 2026',
    readingTime: '7 min czytania',
    category: 'Technika 360 Waves',
    image: '/media/wds/wyszol0202.jpg',
    author: {
      name: 'Kuba Świętoń',
      role: 'WDS Atelier Warszawa',
    },
    recommendedCategory: 'accessories',
    keyTakeaways: [
      'Kluczem do fal jest konsekwentne szczotkowanie pod stałym kątem 45 stopni.',
      'Szczotka z naturalnego włosia dzika (medium) nie łamie łusek włosa.',
      'Jedwabny durag blokuje wzór na całą noc bez odciskania szwu na czole.',
    ],
    content: [
      '360 waves, często nazywane po prostu waves, to jedna z najbardziej rozpoznawalnych fryzur. Te regularne, okrągłe fale układają się równomiernie wokół całej głowy, tworząc spektakularny efekt wiru wokół korony. Choć wyglądają na skomplikowane, mechanizm ich powstawania opiera się na żelaznej dyscyplinie i prawach fizyki.',
      'Fale to nic innego jak naturalne skręty włosów, które zostały spłaszczone i ukierunkowane w jedną stronę. Kluczowym elementem treningu cebulek jest codzienna sesja szczotkowania (tzw. brush session). Szczotkujemy zawsze od korony (crown) promieniście na zewnątrz pod kątem 45 stopni.',
      'Wybór szczotki ma fundamentalne znaczenie. Sztuczny plastik niszczy łuskę włosa i podrażnia skórę głowy. Używaj wyłącznie wyprofilowanych szczotek z naturalnego włosia dzika — wersja Soft do włosów krótszych, a Medium/Hard w miarę wzrostu fryzury (faza wolfingu).',
      'Bezpośrednio po szczotkowaniu należy nałożyć durag ze szwem skierowanym na zewnątrz. Pas o szerokości 8 cm i długości 100 cm pozwala na równomierne rozłożenie kompresji bez bólu głowy.',
    ],
  },
  {
    slug: 'kto-moze-nosic-durag',
    title: 'Kto może nosić durag? Uniwersalne akcesorium dla każdego',
    subtitle: 'Obalamy mity wokół noszenia duragów i odpowiadamy na najczęstsze pytania',
    excerpt:
      'Durag zdobywa ogromną popularność w Polsce. Czy to nakrycie głowy dla każdego? Jak nosić durag z szacunkiem do jego korzeni i historii?',
    date: '22 lutego 2026',
    readingTime: '4 min czytania',
    category: 'Kultura & Historia',
    image: '/media/wds/DSC0653.jpg',
    author: {
      name: 'Kuba Świętoń',
      role: 'WDS Atelier Warszawa',
    },
    recommendedCategory: 'satin',
    keyTakeaways: [
      'Durag to uniwersalne akcesorium ochronne i modowe dla każdego typu włosów.',
      'Warto znać genezę i historię Afroamerykanów, którzy uczynili z niego symbol dumy.',
      'Jakość wykonania i autorski krój decydują o wygodzie noszenia na co dzień.',
    ],
    content: [
      'Durag to jedno z tych akcesoriów, które w ostatnich latach zyskały ogromną popularność, ale jednocześnie budzą czasem pytania — czy każdy może go nosić? Odpowiadamy prosto i bez owijania w bawełnę: durag to uniwersalne i praktyczne nakrycie głowy, z którego zalet może korzystać każdy.',
      'Warto jednak znać i szanować jego genezę. W XIX wieku chusty były narzędziem opresji narzucanym czarnoskórym pracownikom. W latach 60. i 70. XX wieku w czasie ruchów Black Power oraz w erze Złotego Wieku Hip-Hopu durag został przedefiniowany w potężny symbol dumy, emancypacji i stylu.',
      'Dziś durag jest doceniany na całym świecie za swoją bezkonkurencyjną funkcję w ochronie fryzury, zapobieganiu puszeniu oraz unikatowy look. Wystarczy nosić go z szacunkiem do jego historii i bez karykaturalnego naśladowania.',
    ],
  },
  {
    slug: 'z-czym-ubrac-durag',
    title: 'Z czym ubrać durag? Przewodnik po stylizacjach streetwear',
    subtitle: 'Od luźnych hoodie i bojówek po elegancki minimalizm',
    excerpt:
      'Jak wystylizować durag, by wyglądał świeżo i nowocześnie? Poznaj 4 sprawdzone zestawy streetwearowe prosto ze stołecznego atelier.',
    date: '1 marca 2026',
    readingTime: '5 min czytania',
    category: 'Stylizacje & Moda',
    image: '/media/wds/wyszol0913.jpg',
    author: {
      name: 'Kuba Świętoń',
      role: 'WDS Atelier Warszawa',
    },
    recommendedCategory: 'velvet',
    keyTakeaways: [
      'Kontrast faktur: błyszczący jedwab z grubą bawełną heavyweight hoodie.',
      'Stylizacje monochromatyczne all-black z pojedynczym akcentem kolorystycznym.',
      'Welur doskonale komponuje się z kurtkami typu bomber, skórami i overshirtami.',
    ],
    content: [
      'Durag to uniwersalny dodatek, który potrafi całkowicie odmienić prosty outfit. Jego wszechstronność sprawia, że świetnie sprawdza się zarówno w luźnym, miejskim klimacie, jak i podczas bardziej eleganckich wyjść.',
      'Look 1: Oversized Hoodie + Cargo Pants. Klasyka streetwearu. Ciemny satynowy lub jedwabny durag o gładkim połysku przełamuje ciężką, matową strukturę grubej bawełny bluzy.',
      'Look 2: Welurowy Durag + Skórzana Kurtka lub Bomber. Welur posiada głęboką, trójwymiarową fakturę, która odbija światło inaczej niż jedwab. To idealny wybór na chłodniejsze wieczory i wyjścia klubowe.',
      'Look 3: Minimalizm Monochromatyczny. Całość zestawiona w odcieniach czerni, grafitu lub ciemnego beżu. W tym wypadku durag staje się wyrafinowanym detalem architektonicznym.',
    ],
  },
  {
    slug: 'ochrona-wlosow-podczas-snu-i-jazdy-autem',
    title: 'Ochrona włosów podczas snu i jazdy autem — jak durag zapobiega tarciu',
    subtitle: 'Niewidzialne zniszczenia mechaniczne i prosty sposób na zdrowsze włosy',
    excerpt:
      'W nocy i w podróży samochodem włosy podlegają nieustannemu tarciu o zagłówek i pościel. Sprawdź, jak jedwab morwowy chroni strukturę łodygi włosa.',
    date: '10 marca 2026',
    readingTime: '4 min czytania',
    category: 'Pielęgnacja',
    image: '/media/wds/czarno-biale-3.jpg',
    author: {
      name: 'Kuba Świętoń',
      role: 'WDS Atelier Warszawa',
    },
    recommendedCategory: 'silk',
    keyTakeaways: [
      'Tarcie o zagłówek samochodowy i poduszkę niszczy łuski włosa i wyciera fryzurę.',
      'Jedwab naturalny morwowy 19 Momme posiada zbliżone pH i proteiny do keratyny.',
      'Brak odcisków rano dzięki specjalnemu szwowi zewnętrznemu.',
    ],
    content: [
      'Codzienna pielęgnacja to nie tylko szampon i odżywka. Równie istotna jest ochrona mechaniczna w chwilach, kiedy nieświadomie narażamy włosy na uszkodzenia — podczas snu oraz w trakcie wielogodzinnej jazdy samochodem.',
      'Gdy obracasz głowę na poduszce, włókna bawełny szorują o łuski włosów niczym drobny papier ścierny. Prowadzi to do mikropęknięć, rozdwajania końcówek i wycierania włosów na potylicy.',
      'Durag z czystego jedwabiu morwowego z Milanówka (19 Momme) tworzy barierę ochronną o zerowym współczynniku tarcia. Włosy ślizgają się po gładkiej powierzchni, a naturalne oleje nie zostają wchłonięte przez pościel.',
    ],
  },
  {
    slug: 'roznice-miedzy-duragiem-bandana-i-czepkiem',
    title: 'Różnice między duragiem, bandaną i czepkiem — co wybrać?',
    subtitle: 'Kiedy warto sięgnąć po durag, a kiedy po wave cap lub bandanę',
    excerpt:
      'W świecie nakryć głowy łatwo się pogubić. Poznaj konkretne różnice techniczne, zastosowanie oraz wady i zalety każdego rozwiązania.',
    date: '18 marca 2026',
    readingTime: '6 min czytania',
    category: 'Technika 360 Waves',
    image: '/media/wds/DSC07653.jpg',
    author: {
      name: 'Kuba Świętoń',
      role: 'WDS Atelier Warszawa',
    },
    recommendedCategory: 'accessories',
    keyTakeaways: [
      'Durag: pełna kompresja, długie pasy (100 cm), ochrona fal i unikatowy design z flapem.',
      'Wave Cap: lżejszy czepek kompresyjny, idealny pod kask lub jako warstwa dociskowa.',
      'Bandana: luźniejsza, styl outdoorowo-festiwalowy bez funkcji kompresji fryzury.',
    ],
    content: [
      'W świecie nakryć głowy przy tylu opcjach na rynku łatwo się pogubić, zwłaszcza gdy na zdjęciach wydają się do siebie podobne. Warto poznać kluczowe różnice techniczne, aby dobrać nakrycie ściśle do swoich potrzeb.',
      'Durag: król kompresji. Posiada profilowany kształt dopasowany do czaszki, długi opadający płat materiału (flap) chroniący kark oraz dwa długie pasy (w WDS mają one 100 cm długości i 8 cm szerokości). Tylko durag pozwala na regulowany, symetryczny docisk całego wzoru fal.',
      'Wave Cap (czepek kompresyjny): elastyczna czapka bez pasów. Świetnie sprawdza się jako dodatkowa warstwa pod durag (metoda double compression) lub podczas treningu na siłowni i pod kask motocyklowy.',
      'Bandana: kwadratowy płat materiału wiązany na węzeł. Świetny dodatek wizualny, lecz pozbawiony technicznych właściwości kompresyjnych i z tendencją do ześlizgiwania się w nocy.',
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
