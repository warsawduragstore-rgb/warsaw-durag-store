export interface ProductReview {
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface ProductColor {
  name: string;
  hex: string;
}

export interface ProductVariant {
  id?: string;
  name: string;
  value?: string;
  hex?: string;
  sku?: string;
  price?: number;
  stock?: number;
}

export interface Product {
  id: number;
  slug: string;
  name: string;
  nameEn?: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: 'silk' | 'satin' | 'velvet' | 'seasonal' | 'accessories';
  categoryLabel: string;
  material: string;
  storyDescription?: string;
  variants?: ProductVariant[];
  colors?: ProductColor[];
  reviews?: ProductReview[];
  stock?: number;
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
  visible?: boolean;
}

export const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  all: "Kompletna kolekcja ręcznie szytych duragów w Warszawie — z czystego jedwabiu, satyny, weluru oraz materiałów sezonowych.",
  silk: "Luksusowy jedwab morwowy 19 Momme zapewniający najwyższą gładkość, ochronę i delikatną pielęgnację włosów.",
  satin: "Gładka satyna poliestrowa łącząca trwałość, komfort noszenia i idealny połysk na co dzień.",
  velvet: "Mięsisty, luksusowy welur o głębokiej strukturze i eleganckim wyglądzie.",
  seasonal: "Wyjątkowe tkaniny takie jak cupro, len i krepa satynowa dopasowane do zmieniających się pór roku.",
  accessories: "Szczotki wave brush z włosia dzika, wave capy i niezbędne akcesoria do pielęgnacji fal 360 waves."
};

export const PRODUCTS: Product[] = [
  {
    "id": 1160,
    "slug": "durag-milanowek",
    "name": "Durag Milanówek — Jedwabny Czarny / Biały",
    "nameEn": "Durag Milanówek Silk Black / White",
    "price": 149,
    "category": "silk",
    "categoryLabel": "Czysty Jedwab Morwowy",
    "material": "100% Jedwab Morwowy (19 Momme)",
    "description": "Hołd dla legendarnej, polskiej stolicy jedwabnictwa i przedwojennej elegancji. Wykonany z najwyższej klasy naturalnego jedwabiu – luksusowo gładkiego, hipoalergicznego i ultralekkiego. Genialnie oddycha, redukuje tarcie do zera i oferuje prestiżowy, czysty minimalizm w wersji czarnej lub białej.",
    "storyDescription": "Milanówek. Legendarna, polska stolica jedwabnictwa i przedwojenna elegancja. Najwyższej klasy naturalny jedwab – luksusowo gładki, prestiżowy minimalizm.",
    "images": [
      "/assets/product-photos/durag-milanowek/durag-milanowek_1.jpg",
      "/assets/product-photos/durag-milanowek/durag-milanowek_2.jpg",
      "/assets/product-photos/durag-milanowek/durag-milanowek_3.jpg",
      "/assets/product-photos/durag-milanowek/durag-milanowek_4.jpg",
      "/assets/product-photos/durag-milanowek/durag-milanowek_5.jpg",
      "/assets/product-photos/durag-milanowek/durag-milanowek_6.jpg"
    ],
    "colors": [
      {
        "name": "Obsidian Black",
        "hex": "#111111"
      },
      {
        "name": "Pure White",
        "hex": "#FFFFFF"
      }
    ],
    "reviews": [
      {
        "author": "Kamil W.",
        "rating": 5,
        "comment": "Jedyny prawdziwy jedwab w Polsce. Niesamowita gładkość.",
        "date": "14.05.2026"
      },
      {
        "author": "Mateusz R.",
        "rating": 5,
        "comment": "Idealny na noc, zero puszenia włosów.",
        "date": "02.06.2026"
      }
    ]
  },
  {
    "id": 1161,
    "slug": "durag-warszawa",
    "name": "Durag Warszawa — Czarna Satyna Ice Silk",
    "nameEn": "Durag Warszawa Black Ice Silk Satin",
    "price": 79,
    "category": "satin",
    "categoryLabel": "Satyna Poliestrowa",
    "material": "Gładka Satyna Premium Ice Silk",
    "description": "Najbardziej uniwersalny i kultowy model Warsaw Durag Store. Inspirowany energią, dynamiką i minimalistyczną elegancją stolicy. Uszyty z lekkiej, chłodnej w dotyku satyny ice silk, która doskonale dopasowuje się do głowy, trzyma fason i chroni strukturę każdego włosa.",
    "storyDescription": "Warszawa. Stolica polskiego streetwearu, surowa nowoczesność i nieustanny ruch. Głęboka, uniwersalna czerń, która stanowi fundament każdej stylizacji.",
    "images": [
      "/assets/product-photos/durag-warszawa/durag-warszawa_1.jpg",
      "/assets/product-photos/durag-warszawa/durag-warszawa_2.jpg",
      "/assets/product-photos/durag-warszawa/durag-warszawa_3.jpg",
      "/assets/product-photos/durag-warszawa/durag-warszawa_4.jpg",
      "/assets/product-photos/durag-warszawa/durag-warszawa_5.jpg",
      "/assets/product-photos/durag-warszawa/durag-warszawa_6.jpg"
    ],
    "colors": [
      {
        "name": "Obsidian Black",
        "hex": "#0A0A0A"
      }
    ],
    "reviews": [
      {
        "author": "Tomek G.",
        "rating": 5,
        "comment": "Klasyk nad klasykami. Noszę codziennie.",
        "date": "10.06.2026"
      },
      {
        "author": "Oskar B.",
        "rating": 5,
        "comment": "Materiał ice silk jest niesamowicie przyjemny w upały.",
        "date": "22.06.2026"
      }
    ]
  },
  {
    "id": 1335,
    "slug": "durag-wroclaw",
    "name": "Durag Wrocław — Biała Satyna",
    "nameEn": "Durag Wrocław White Satin",
    "price": 79,
    "category": "satin",
    "categoryLabel": "Satyna Poliestrowa",
    "material": "Lśniąca Satyna Poliestrowa",
    "description": "Inspirowany architektoniczną lekkością i jasną, otwartą przestrzenią miasta mostów. Wykonany z lśniącej, śnieżnobiałej satyny, która gładko otula głowę, chroniąc jej strukturę. Kontrolowana elastyczność i długie pasy gwarantują stabilność bez uczucia napięcia. Czysta, świetlista forma.",
    "storyDescription": "Wrocław. Inspirowany architektoniczną lekkością i jasną, otwartą przestrzenią miasta mostów. Śnieżnobiała satyna o płynnym kształcie i czystej formie.",
    "images": [
      "/assets/product-photos/durag-wroclaw/durag-wroclaw_1.jpg",
      "/assets/product-photos/durag-wroclaw/durag-wroclaw_2.jpg",
      "/assets/product-photos/durag-wroclaw/durag-wroclaw_3.jpg",
      "/assets/product-photos/durag-wroclaw/durag-wroclaw_4.jpg",
      "/assets/product-photos/durag-wroclaw/durag-wroclaw_5.jpg",
      "/assets/product-photos/durag-wroclaw/durag-wroclaw_6.jpg"
    ],
    "colors": [
      {
        "name": "Pure White",
        "hex": "#FFFFFF"
      }
    ],
    "reviews": [
      {
        "author": "Piotr S.",
        "rating": 5,
        "comment": "Bardzo lekki i świetnie leży.",
        "date": "18.05.2026"
      }
    ]
  },
  {
    "id": 1365,
    "slug": "durag-lodz",
    "name": "Durag Łódź — Czarny Welur",
    "nameEn": "Durag Łódź Black Velvet",
    "price": 89,
    "category": "velvet",
    "categoryLabel": "Luksusowy Welur",
    "material": "Mięsisty Welur Poliestrowy",
    "description": "Nazwany na cześć miasta o głębokich, tekstylnych tradycjach i surowym, postindustrialnym charakterze. Miękki, mięsisty welur w odcieniu głębokiej czerni doskonale magnetyzuje światło. Zapewnia precyzyjne dopasowanie i wyjątkowe poczucie komfortu na co dzień. Teksturowany minimalizm, który broni się sam.",
    "storyDescription": "Łódź. Surowy, postindustrialny charakter i głębokie tradycje tekstylne przełożone na mięsisty welur w odcieniu absolutnej czerni. Teksturowany minimalizm, który nie potrzebuje słów.",
    "images": [
      "/assets/product-photos/durag-lodz/durag-lodz_1.jpg",
      "/assets/product-photos/durag-lodz/durag-lodz_2.jpg",
      "/assets/product-photos/durag-lodz/durag-lodz_3.jpg",
      "/assets/product-photos/durag-lodz/durag-lodz_4.jpg",
      "/assets/product-photos/durag-lodz/durag-lodz_5.jpg",
      "/assets/product-photos/durag-lodz/durag-lodz_6.jpg"
    ],
    "colors": [
      {
        "name": "Deep Black",
        "hex": "#0A0A0A"
      }
    ],
    "reviews": [
      {
        "author": "Dawid K.",
        "rating": 5,
        "comment": "Super jakość weluru!",
        "date": "20.04.2026"
      }
    ]
  },
  {
    "id": 1369,
    "slug": "durag-krakow",
    "name": "Durag Kraków — Różowy Welur",
    "nameEn": "Durag Kraków Velvet Pink",
    "price": 89,
    "category": "velvet",
    "categoryLabel": "Luksusowy Welur",
    "material": "Miękki Welur Aksamitny",
    "description": "Nasz ikoniczny Velvet Pink Durag to połączenie wyrazistego, modowego akcentu z maksymalną kompresją fal 360 waves. Wyjątkowo miękki aksamitny welur w pudrowo-malinowym odcieniu doskonale leży na głowie i chroni włosy podczas snu i na co dzień.",
    "storyDescription": "Kraków. Artystyczny duch, kawiarniany rytm i elegancja Dawnej Stolicy zamknięte w nasyconej fakturze weluru w odcieniu Velvet Pink.",
    "images": [
      "/assets/product-photos/durag-krakow/durag-krakow_1.jpg",
      "/assets/product-photos/durag-krakow/durag-krakow_2.jpg",
      "/assets/product-photos/durag-krakow/durag-krakow_3.jpg",
      "/assets/product-photos/durag-krakow/durag-krakow_4.jpg",
      "/assets/product-photos/durag-krakow/durag-krakow_5.jpg",
      "/assets/product-photos/durag-krakow/durag-krakow_6.jpg"
    ],
    "colors": [
      {
        "name": "Velvet Pink",
        "hex": "#E8829C"
      }
    ],
    "reviews": [
      {
        "author": "Zuzanna M.",
        "rating": 5,
        "comment": "Kolor w rzeczywistości jest przepiękny! Bardzo miękki materiał.",
        "date": "15.05.2026"
      }
    ]
  },
  {
    "id": 1366,
    "slug": "durag-bialystok",
    "name": "Durag Białystok — Brązowy Welur",
    "nameEn": "Durag Białystok Brown Velvet",
    "price": 89,
    "category": "velvet",
    "categoryLabel": "Luksusowy Welur",
    "material": "Gęsty Welur Poliestrowy",
    "description": "Inspirowany surowym krajobrazem Podlasia i leśną, ziemistą paletą barw. Miękki, aksamitny welur w tonacji głębokiego brązu z naturalnym, satynowym połyskiem. Zapewnia doskonałe przyleganie i komfort.",
    "storyDescription": "Białystok. Leśna, ziemista paleta barw i surowy spokój Podlasia. Głęboki brąz i aksamitny welur dla koneserów nieszablonowych rozwiązań.",
    "images": [
      "/assets/product-photos/durag-bialystok/durag-bialystok_1.png",
      "/assets/product-photos/durag-bialystok/durag-bialystok_2.jpg",
      "/assets/product-photos/durag-bialystok/durag-bialystok_3.jpg",
      "/assets/product-photos/durag-bialystok/durag-bialystok_4.jpg",
      "/assets/product-photos/durag-bialystok/durag-bialystok_5.jpg"
    ],
    "colors": [
      {
        "name": "Forest Brown",
        "hex": "#3D2B1F"
      }
    ],
    "reviews": [
      {
        "author": "Janusz P.",
        "rating": 5,
        "comment": "Niezwykły odcień brązu, polecam.",
        "date": "11.05.2026"
      }
    ]
  },
  {
    "id": 1370,
    "slug": "durag-bielsko-biala",
    "name": "Durag Bielsko-Biała — Biały Welur",
    "nameEn": "Durag Bielsko-Biała White Velvet",
    "price": 89,
    "category": "velvet",
    "categoryLabel": "Luksusowy Welur",
    "material": "Śnieżnobiały Welur Poliestrowy",
    "description": "Nawiązuje do górskiego klimatu Beskidów i czystej, zimowej aury. Śnieżnobiały, gęsty welur odbija światło dając wrażenie luksusu. Precyzyjne szwy i wysoka gramatura gwarantują trwałość.",
    "storyDescription": "Bielsko-Biała. Górski mikroklimat i czysta, śnieżna aura przełożona na śnieżnobiały, gęsty welur o szlachetnym połysku.",
    "images": [
      "/assets/product-photos/durag-bielsko-biala/durag-bielsko-biala_1.jpg",
      "/assets/product-photos/durag-bielsko-biala/durag-bielsko-biala_2.jpg",
      "/assets/product-photos/durag-bielsko-biala/durag-bielsko-biala_3.jpg"
    ],
    "colors": [
      {
        "name": "Snow White",
        "hex": "#FAFAFA"
      }
    ],
    "reviews": [
      {
        "author": "Sebastian K.",
        "rating": 5,
        "comment": "Biały welur robi niesamowite wrażenie na żywo.",
        "date": "29.04.2026"
      }
    ]
  },
  {
    "id": 1385,
    "slug": "durag-bydgoszcz",
    "name": "Durag Bydgoszcz — Miedziany Cupro",
    "nameEn": "Durag Bydgoszcz Copper Cupro",
    "price": 99,
    "category": "seasonal",
    "categoryLabel": "Sezonowe Materiały",
    "material": "Innowacyjne Tworzywo Cupro",
    "description": "Inspirowany industrialnymi spichrzami, rzecznymi kanałami i metalicznymi refleksami nad Brdą. Wykonany z innowacyjnego materiału cupro w szlachetnym, miedzianym odcieniu. Łączy jedwabistą gładkość z naturalną przewiewnością i unikalnym finiszem.",
    "storyDescription": "Bydgoszcz. Industrialne spichrze, rzeczne kanały i metaliczne refleksy nad Brdą. Nowoczesne tworzywo cupro w szlachetnym, miedzianym odcieniu.",
    "images": [
      "/assets/product-photos/durag-bydgoszcz/durag-bydgoszcz_1.jpg",
      "/assets/product-photos/durag-bydgoszcz/durag-bydgoszcz_2.jpg",
      "/assets/product-photos/durag-bydgoszcz/durag-bydgoszcz_3.jpg",
      "/assets/product-photos/durag-bydgoszcz/durag-bydgoszcz_4.jpg",
      "/assets/product-photos/durag-bydgoszcz/durag-bydgoszcz_5.jpg",
      "/assets/product-photos/durag-bydgoszcz/durag-bydgoszcz_6.jpg"
    ],
    "colors": [
      {
        "name": "Copper Cupro",
        "hex": "#B87333"
      }
    ],
    "reviews": [
      {
        "author": "Igor W.",
        "rating": 5,
        "comment": "Miedź na cupro wygląda zjawiskowo.",
        "date": "13.06.2026"
      }
    ]
  },
  {
    "id": 1378,
    "slug": "durag-chalupy",
    "name": "Durag Chałupy — Błękitna Satyna",
    "nameEn": "Durag Chałupy Ocean Blue Satin",
    "price": 79,
    "category": "satin",
    "categoryLabel": "Satyna Poliestrowa",
    "material": "Lekka Satyna Poliestrowa",
    "description": "Zainspirowany surferskim klimatem Półwyspu Helskiego, morskim wiatrem i bezkresem Bałtyku. Błękitna satyna o wysokim połysku daje poczucie lekkości i wolności.",
    "storyDescription": "Chałupy. Surferski luz, morska bryza i bezkres fal Bałtyku zaklęte w błękitnej satynie o lekkim, płynnym chwycie.",
    "images": [
      "/assets/product-photos/durag-chalupy/durag-chalupy_1.jpg",
      "/assets/product-photos/durag-chalupy/durag-chalupy_2.jpg",
      "/assets/product-photos/durag-chalupy/durag-chalupy_3.jpg",
      "/assets/product-photos/durag-chalupy/durag-chalupy_4.jpg",
      "/assets/product-photos/durag-chalupy/durag-chalupy_5.jpg",
      "/assets/product-photos/durag-chalupy/durag-chalupy_6.jpg"
    ],
    "colors": [
      {
        "name": "Ocean Blue",
        "hex": "#4A90E2"
      }
    ],
    "reviews": [
      {
        "author": "Mikołaj C.",
        "rating": 5,
        "comment": "Świetny kolor na lato.",
        "date": "07.06.2026"
      }
    ]
  },
  {
    "id": 1386,
    "slug": "durag-czestochowa",
    "name": "Durag Częstochowa — Stalowy Welur",
    "nameEn": "Durag Częstochowa Steel Grey Velvet",
    "price": 89,
    "category": "velvet",
    "categoryLabel": "Luksusowy Welur",
    "material": "Stalowo-Szary Welur Poliestrowy",
    "description": "Wyrazisty, surowy durag wykonany ze szlachetnego weluru w odcieniu stali i grafitu. Gęsty splot zapewnia pewną kompresję fryzury, a aksamitna struktura odbija światło z industrialną elegancją.",
    "storyDescription": "Częstochowa. Przemysłowa tradycja, solidność i stonowana elegancja. Stalowy welur to bezkompromisowy wybór dla fanów surowego streetwearu.",
    "images": [
      "/assets/product-photos/durag-czestochowa/durag-czestochowa_1.jpg",
      "/assets/product-photos/durag-czestochowa/durag-czestochowa_2.jpg",
      "/assets/product-photos/durag-czestochowa/durag-czestochowa_3.jpg",
      "/assets/product-photos/durag-czestochowa/durag-czestochowa_4.jpg",
      "/assets/product-photos/durag-czestochowa/durag-czestochowa_5.jpg"
    ],
    "colors": [
      {
        "name": "Steel Grey",
        "hex": "#7E8287"
      }
    ],
    "reviews": [
      {
        "author": "Konrad M.",
        "rating": 5,
        "comment": "Idealny odcień szarości, materiał gruby i porządny.",
        "date": "03.06.2026"
      }
    ]
  },
  {
    "id": 1376,
    "slug": "durag-elblag",
    "name": "Durag Elbląg — Niebieskie Military Camo",
    "nameEn": "Durag Elbląg Blue Camo Satin",
    "price": 79,
    "category": "satin",
    "categoryLabel": "Satyna Poliestrowa",
    "material": "Satyna Poliestrowa z Nadrukiem",
    "description": "Dynamiczny durag w morskim kamuflażu, uszyty z gładkiej satyny o lekkim połysku. Łączy militarny charakter z grą wodnych odcieni błękitu i granatu.",
    "storyDescription": "Elbląg. Miejskie camo w odcieniach wody. Portowy duch i dynamiczna geometria fal.",
    "images": [
      "/assets/product-photos/durag-elblag/durag-elblag_1.jpg",
      "/assets/product-photos/durag-elblag/durag-elblag_2.jpg",
      "/assets/product-photos/durag-elblag/durag-elblag_3.jpg",
      "/assets/product-photos/durag-elblag/durag-elblag_4.jpg"
    ],
    "colors": [
      {
        "name": "Blue Camo",
        "hex": "#2B4C7E"
      }
    ],
    "reviews": [
      {
        "author": "Artur N.",
        "rating": 5,
        "comment": "Wzór na żywo robi wrażenie.",
        "date": "24.05.2026"
      }
    ]
  },
  {
    "id": 1382,
    "slug": "durag-gdansk",
    "name": "Durag Gdańsk — Niebieski Welur",
    "nameEn": "Durag Gdańsk Baltic Blue Velvet",
    "price": 89,
    "category": "velvet",
    "categoryLabel": "Luksusowy Welur",
    "material": "Głęboki Morski Welur",
    "description": "Nawiązuje do morskich głębin i stoczniowej historii Gdańska. Nasycony, atramentowo-niebieski welur o szlachetnym połysku zapewnia optymalną kompresję fal 360 waves.",
    "storyDescription": "Gdańsk. Nadmorski charakter, stoczniowa stal i atramentowa toń Bałtyku.",
    "images": [
      "/assets/product-photos/durag-gdansk/durag-gdansk_1.jpg",
      "/assets/product-photos/durag-gdansk/durag-gdansk_2.jpg",
      "/assets/product-photos/durag-gdansk/durag-gdansk_3.jpg",
      "/assets/product-photos/durag-gdansk/durag-gdansk_4.jpg",
      "/assets/product-photos/durag-gdansk/durag-gdansk_5.jpg",
      "/assets/product-photos/durag-gdansk/durag-gdansk_6.jpg"
    ],
    "colors": [
      {
        "name": "Baltic Deep Blue",
        "hex": "#1A365D"
      }
    ],
    "reviews": [
      {
        "author": "Jakub T.",
        "rating": 5,
        "comment": "Mega kolor, welur pierwsza klasa.",
        "date": "02.05.2026"
      }
    ]
  },
  {
    "id": 1372,
    "slug": "durag-katowice",
    "name": "Durag Katowice — Fioletowa Satyna",
    "nameEn": "Durag Katowice Purple Satin",
    "price": 79,
    "category": "satin",
    "categoryLabel": "Satyna Poliestrowa",
    "material": "Połyskująca Satyna Poliestrowa",
    "description": "Zainspirowany neonową energią katowickiej Strefy Kultury i industrialnym modernizmem Śląska. Nasycony ametystowy fiolet w satynowym wydaniu przyciąga wzrok i podkreśla indywidualność.",
    "storyDescription": "Katowice. Neonowa energia Strefy Kultury, Spodek i nocne światła Śląska zaklęte w odważnym fiolecie satyny.",
    "images": [
      "/assets/product-photos/durag-katowice/durag-katowice_1.jpg",
      "/assets/product-photos/durag-katowice/durag-katowice_2.jpg",
      "/assets/product-photos/durag-katowice/durag-katowice_3.jpg",
      "/assets/product-photos/durag-katowice/durag-katowice_4.jpg",
      "/assets/product-photos/durag-katowice/durag-katowice_5.jpg",
      "/assets/product-photos/durag-katowice/durag-katowice_6.jpg"
    ],
    "colors": [
      {
        "name": "Neon Purple",
        "hex": "#8A2BE2"
      }
    ],
    "reviews": [
      {
        "author": "Marcin W.",
        "rating": 5,
        "comment": "Mega wyrazisty kolor. Wyróżnia się w tłumie.",
        "date": "16.05.2026"
      }
    ]
  },
  {
    "id": 1374,
    "slug": "durag-kielce",
    "name": "Durag Kielce — Czerwona Satyna",
    "nameEn": "Durag Kielce Crimson Red Satin",
    "price": 79,
    "category": "satin",
    "categoryLabel": "Satyna Poliestrowa",
    "material": "Intensywna Satyna Poliestrowa",
    "description": "Wyrazista, krwista czerwień o głębokim satynowym blasku. Inspirowana geologyczną energią Gór Świętokrzyskich i bezkompromisowym charakterem miasta.",
    "storyDescription": "Kielce. Płomienna czerwień i energia Gór Świętokrzyskich. Mocny akcent w każdej stylizacji.",
    "images": [
      "/assets/product-photos/durag-kielce/durag-kielce_1.jpg",
      "/assets/product-photos/durag-kielce/durag-kielce_2.jpg",
      "/assets/product-photos/durag-kielce/durag-kielce_3.jpg",
      "/assets/product-photos/durag-kielce/durag-kielce_4.jpg",
      "/assets/product-photos/durag-kielce/durag-kielce_5.jpg",
      "/assets/product-photos/durag-kielce/durag-kielce_6.jpg"
    ],
    "colors": [
      {
        "name": "Crimson Red",
        "hex": "#C41E3A"
      }
    ],
    "reviews": [
      {
        "author": "Grzegorz N.",
        "rating": 5,
        "comment": "Czerwień jest bardzo głęboka, satyna super śliska.",
        "date": "21.05.2026"
      }
    ]
  },
  {
    "id": 1377,
    "slug": "durag-legionowo",
    "name": "Durag Legionowo — Klasyczne Military Camo",
    "nameEn": "Durag Legionowo Classic Camo Satin",
    "price": 79,
    "category": "satin",
    "categoryLabel": "Satyna Poliestrowa",
    "material": "Satyna Poliestrowa Military Camo",
    "description": "Nawiązanie do wojskowych tradycji garnizonowych Mazowsza. Klasyczny wzór moro w odcieniach oliwki, khaki i czerni przeniesiony na ultragładką satynę.",
    "storyDescription": "Legionowo. Wojskowa tradycja, dyscyplina i klasyczny motyw moro w nowoczesnym, satynowym wydaniu.",
    "images": [
      "/assets/product-photos/durag-legionowo/durag-legionowo_1.jpg",
      "/assets/product-photos/durag-legionowo/durag-legionowo_2.jpg",
      "/assets/product-photos/durag-legionowo/durag-legionowo_3.jpg"
    ],
    "colors": [
      {
        "name": "Classic Camo",
        "hex": "#4B5320"
      }
    ],
    "reviews": [
      {
        "author": "Filip Z.",
        "rating": 5,
        "comment": "Najlepsze moro jakie widziałem na duragu.",
        "date": "14.05.2026"
      }
    ]
  },
  {
    "id": 1387,
    "slug": "durag-olsztyn",
    "name": "Durag Olsztyn — Kobaltowa Satyna",
    "nameEn": "Durag Olsztyn Cobalt Satin",
    "price": 79,
    "category": "satin",
    "categoryLabel": "Satyna Poliestrowa",
    "material": "Lśniąca Satyna Kobaltowa",
    "description": "Inspirowany Krainą Tysiąca Jezior, czystym niebem nad Warmią i głębią nasyconego błękitu. Lśniąca satyna o wyjątkowej gładkości, która doskonale chroni włosy przed łamaniem.",
    "storyDescription": "Olsztyn. Spokój warmińskich wód i czyste, błękitne niebo. Intensywny kobalt, który nadaje stylizacji wyrafinowanego blasku.",
    "images": [
      "/assets/product-photos/durag-olsztyn/durag-olsztyn_1.jpg",
      "/assets/product-photos/durag-olsztyn/durag-olsztyn_2.jpg",
      "/assets/product-photos/durag-olsztyn/durag-olsztyn_3.jpg",
      "/assets/product-photos/durag-olsztyn/durag-olsztyn_4.jpg",
      "/assets/product-photos/durag-olsztyn/durag-olsztyn_5.jpg",
      "/assets/product-photos/durag-olsztyn/durag-olsztyn_6.jpg"
    ],
    "colors": [
      {
        "name": "Royal Cobalt",
        "hex": "#1A3B8B"
      }
    ],
    "reviews": [
      {
        "author": "Rafał P.",
        "rating": 5,
        "comment": "Cudowny, nasycony błękit. Bardzo wygodny.",
        "date": "05.06.2026"
      }
    ]
  },
  {
    "id": 1384,
    "slug": "durag-poznan",
    "name": "Durag Poznań — Fioletowy Welur",
    "nameEn": "Durag Poznań Purple Velvet",
    "price": 89,
    "category": "velvet",
    "categoryLabel": "Luksusowy Welur",
    "material": "Nasycony Fioletowy Welur",
    "description": "Inspirowany wielkomiejskim rytmem i dumną estetyką stolicy Wielkopolski. Welur w odcieniu nasyconego fioletu to propozycja dla tych, którzy szukają unikalnej faktury.",
    "storyDescription": "Poznań. Wielkomiejski rytm i dumna estetyka stolicy Wielkopolski. Welur w odcieniu nasyconego fioletu.",
    "images": [
      "/assets/product-photos/durag-poznan/durag-poznan_1.jpg",
      "/assets/product-photos/durag-poznan/durag-poznan_2.jpg",
      "/assets/product-photos/durag-poznan/durag-poznan_3.jpg",
      "/assets/product-photos/durag-poznan/durag-poznan_4.jpg",
      "/assets/product-photos/durag-poznan/durag-poznan_5.jpg",
      "/assets/product-photos/durag-poznan/durag-poznan_6.jpg"
    ],
    "colors": [
      {
        "name": "Imperial Purple",
        "hex": "#4A0E4E"
      }
    ],
    "reviews": [
      {
        "author": "Krystian L.",
        "rating": 5,
        "comment": "Niesamowity fiolet, miękki i gęsty materiał.",
        "date": "09.06.2026"
      }
    ]
  },
  {
    "id": 1371,
    "slug": "durag-radom",
    "name": "Durag Radom — Granatowy Welur",
    "nameEn": "Durag Radom Navy Velvet",
    "price": 89,
    "category": "velvet",
    "categoryLabel": "Luksusowy Welur",
    "material": "Miękki Welur Poliestrowy",
    "description": "Stylowy granatowy durag z mięsistego weluru o delikatnym, szlachetnym połysku. Trwały materiał pozwala na długotrwałe utrzymanie fryzury i świetnie komponuje się ze streetwearowymi stylizacjami.",
    "storyDescription": "Radom. Rzemieślnicza precyzja, siła tradycji i głęboki granat w miękkim wydaniu welurowym.",
    "images": [
      "/assets/product-photos/durag-radom/durag-radom_1.jpg",
      "/assets/product-photos/durag-radom/durag-radom_2.jpg",
      "/assets/product-photos/durag-radom/durag-radom_3.jpg"
    ],
    "colors": [
      {
        "name": "Navy Blue",
        "hex": "#1B2A4A"
      }
    ],
    "reviews": [
      {
        "author": "Bartłomiej S.",
        "rating": 5,
        "comment": "Bardzo dobry welur, pasy odpowiedniej długości.",
        "date": "19.05.2026"
      }
    ]
  },
  {
    "id": 1383,
    "slug": "durag-szczecin",
    "name": "Durag Szczecin — Srebrny Welur",
    "nameEn": "Durag Szczecin Silver Velvet",
    "price": 89,
    "category": "velvet",
    "categoryLabel": "Luksusowy Welur",
    "material": "Srebrzysty Welur Poliestrowy",
    "description": "Nawiązanie do portowego i stoczniowego dziedzictwa Szczecina. Welur w odcieniu szczotkowanego srebra i metalicznej szarości, który subtelnie mieni się w słońcu.",
    "storyDescription": "Szczecin. Portowa solidność, stalowe żurawie i chłodny blask Bałtyku. Srebrzysty welur o niespotykanej głębi.",
    "images": [
      "/assets/product-photos/durag-szczecin/durag-szczecin_1.jpg",
      "/assets/product-photos/durag-szczecin/durag-szczecin_2.jpg",
      "/assets/product-photos/durag-szczecin/durag-szczecin_3.jpg",
      "/assets/product-photos/durag-szczecin/durag-szczecin_4.jpg",
      "/assets/product-photos/durag-szczecin/durag-szczecin_5.jpg",
      "/assets/product-photos/durag-szczecin/durag-szczecin_6.jpg"
    ],
    "colors": [
      {
        "name": "Stocznia Silver",
        "hex": "#A8A9AD"
      }
    ],
    "reviews": [
      {
        "author": "Norbert D.",
        "rating": 5,
        "comment": "Srebrny welur wygląda bardzo luksusowo.",
        "date": "16.05.2026"
      }
    ]
  },
  {
    "id": 1379,
    "slug": "durag-tychy",
    "name": "Durag Tychy — Granatowa Satyna",
    "nameEn": "Durag Tychy Navy Satin",
    "price": 79,
    "category": "satin",
    "categoryLabel": "Satyna Poliestrowa",
    "material": "Gładka Satyna Poliestrowa",
    "description": "Klasyczny, głęboki granat w satynowym, ultragładkim wykończeniu. Inspirowany modernistyczną architekturą Tychów i harmonią formy. Idealny na co dzień.",
    "storyDescription": "Tychy. Modernistyczna harmonia i spokój formy. Klasyczny granat dla ceniących ponadczasowy minimalizm.",
    "images": [
      "/assets/product-photos/durag-tychy/durag-tychy_1.jpg",
      "/assets/product-photos/durag-tychy/durag-tychy_2.jpg",
      "/assets/product-photos/durag-tychy/durag-tychy_3.jpg",
      "/assets/product-photos/durag-tychy/durag-tychy_4.jpg",
      "/assets/product-photos/durag-tychy/durag-tychy_5.jpg",
      "/assets/product-photos/durag-tychy/durag-tychy_6.jpg"
    ],
    "colors": [
      {
        "name": "Navy Blue",
        "hex": "#1B2A4A"
      }
    ],
    "reviews": [
      {
        "author": "Kacper W.",
        "rating": 5,
        "comment": "Klasyczny, elegancki granat. Satyna pierwszej jakości.",
        "date": "28.05.2026"
      }
    ]
  },
  {
    "id": 1381,
    "slug": "durag-wloclawek",
    "name": "Durag Włocławek — Czerwony Welur",
    "nameEn": "Durag Włocławek Red Velvet",
    "price": 89,
    "category": "velvet",
    "categoryLabel": "Luksusowy Welur",
    "material": "Intensywny Czerwony Welur",
    "description": "Wyrazisty, odważny durag w odcieniu intensywnej szkarłatnej czerwieni. Aksamitny welur miękko układa się na głowie i stanowi najmocniejszy punkt całego fitu.",
    "storyDescription": "Włocławek. Niezaprzeczalna energia i kultowy, czerwony charakter. Odważny wybór dla pewnych siebie waverów.",
    "images": [
      "/assets/product-photos/durag-wloclawek/durag-wloclawek_1.jpg",
      "/assets/product-photos/durag-wloclawek/durag-wloclawek_2.jpg",
      "/assets/product-photos/durag-wloclawek/durag-wloclawek_3.jpg",
      "/assets/product-photos/durag-wloclawek/durag-wloclawek_4.jpg"
    ],
    "colors": [
      {
        "name": "Imperial Red",
        "hex": "#B22222"
      }
    ],
    "reviews": [
      {
        "author": "Paweł K.",
        "rating": 5,
        "comment": "Robi wrażenie w stylówkach, welur bardzo miękki.",
        "date": "17.05.2026"
      }
    ]
  },
  {
    "id": 1373,
    "slug": "durag-zabrze",
    "name": "Durag Zabrze — Srebrna Satyna",
    "nameEn": "Durag Zabrze Silver Satin",
    "price": 79,
    "category": "satin",
    "categoryLabel": "Satyna Poliestrowa",
    "material": "Srebrzysta Satyna Poliestrowa",
    "description": "Inspirowany metalicznym blaskiem przemysłowych maszyn i górniczym sercem Śląska. Nowoczesna, srebrzysta satyna o chłodnym połysku i wyjątkowej gładkości.",
    "storyDescription": "Zabrze. Przemysłowy duch Śląska i futurystyczny chłód srebra. Metaliczny połysk i lekkość na głowie.",
    "images": [
      "/assets/product-photos/durag-zabrze/durag-zabrze_1.jpg",
      "/assets/product-photos/durag-zabrze/durag-zabrze_2.jpg",
      "/assets/product-photos/durag-zabrze/durag-zabrze_3.jpg",
      "/assets/product-photos/durag-zabrze/durag-zabrze_4.jpg",
      "/assets/product-photos/durag-zabrze/durag-zabrze_5.jpg",
      "/assets/product-photos/durag-zabrze/durag-zabrze_6.jpg"
    ],
    "colors": [
      {
        "name": "Futuristic Silver",
        "hex": "#C0C0C0"
      }
    ],
    "reviews": [
      {
        "author": "Damian B.",
        "rating": 5,
        "comment": "Ciekawy, futurystyczny srebrny odcień.",
        "date": "26.05.2026"
      }
    ]
  },
  {
    "id": 1367,
    "slug": "durag-zyrardow",
    "name": "Durag Żyrardów — Czarny / Beżowy Len",
    "nameEn": "Durag Żyrardów Black / Beige Linen",
    "price": 119,
    "category": "seasonal",
    "categoryLabel": "Sezonowe Materiały",
    "material": "100% Naturalny Len Polski",
    "description": "Hołd dla polskiej stolicy lniarstwa. Wykonany z naturalnego, przewiewnego lnu, który gwarantuje doskonałą cyrkulację powietrza w cieplejsze dni. Surowa, naturalna tekstura i niespotykany dotąd w duragach organiczny chłód.",
    "storyDescription": "Żyrardów. Polska stolica lniarstwa i wielka tradycja włókiennicza. Naturalny len łączący przewiewność z surową, organiczną elegancją.",
    "images": [
      "/assets/product-photos/durag-zyrardow/durag-zyrardow_1.jpg",
      "/assets/product-photos/durag-zyrardow/durag-zyrardow_2.jpg",
      "/assets/product-photos/durag-zyrardow/durag-zyrardow_3.jpg",
      "/assets/product-photos/durag-zyrardow/durag-zyrardow_4.jpg",
      "/assets/product-photos/durag-zyrardow/durag-zyrardow_5.jpg",
      "/assets/product-photos/durag-zyrardow/durag-zyrardow_6.jpg"
    ],
    "colors": [
      {
        "name": "Linen Black",
        "hex": "#1A1A1A"
      },
      {
        "name": "Natural Beige",
        "hex": "#D2B48C"
      }
    ],
    "reviews": [
      {
        "author": "Wojciech M.",
        "rating": 5,
        "comment": "Len na lato to totalny gamechanger.",
        "date": "04.06.2026"
      }
    ]
  },
  {
    "id": 1388,
    "slug": "durag-biala-podlaska",
    "name": "Durag Biała Podlaska — Szampańska Satyna",
    "nameEn": "Durag Biała Podlaska Champagne Satin",
    "price": 79,
    "category": "satin",
    "categoryLabel": "Satyna Poliestrowa",
    "material": "Szampańska Satyna Premium",
    "description": "Inspirowany delikatnym światłem wschodniego Mazowsza i szlachetną prostotą. Szampańsko-kremowa satyna łączy wysublimowany, ciepły blask z delikatnym, aksamitnym chwytem.",
    "storyDescription": "Biała Podlaska. Szlachetna prostota i ciepłe światło wschodu. Szampańska satyna oferująca dyskretny, luksusowy minimalizm.",
    "images": [
      "/assets/product-photos/durag-biala-podlaska/durag-biala-podlaska_1.jpg",
      "/assets/product-photos/durag-biala-podlaska/durag-biala-podlaska_2.jpg",
      "/assets/product-photos/durag-biala-podlaska/durag-biala-podlaska_3.jpg",
      "/assets/product-photos/durag-biala-podlaska/durag-biala-podlaska_4.jpg",
      "/assets/product-photos/durag-biala-podlaska/durag-biala-podlaska_5.jpg"
    ],
    "colors": [
      {
        "name": "Champagne Cream",
        "hex": "#E8E2D5"
      }
    ],
    "reviews": [
      {
        "author": "Hubert D.",
        "rating": 5,
        "comment": "Świetny szampański kolor, rzadko spotykany.",
        "date": "11.06.2026"
      }
    ]
  },
  {
    "id": 1368,
    "slug": "durag-stalowa-wola",
    "name": "Durag Stalowa Wola — Biała / Czarna Mirella",
    "nameEn": "Durag Stalowa Wola White / Black Mirella",
    "price": 99,
    "category": "seasonal",
    "categoryLabel": "Sezonowe Materiały",
    "material": "Krepa Satynowa Mirella",
    "description": "Wykonany ze specjalistycznej krepy satynowej Mirella łączącej mocniejszą strukturę z eleganckim połyskiem. Inspirowany hutniczą tradycją i geometryczną siłą Stalowej Woli.",
    "storyDescription": "Stalowa Wola. Geometryczna siła, modernistyczny porządek i hutnicza tradycja przełożone na trwałą krepę satynową Mirella.",
    "images": [
      "/assets/products/durag-stalowa-wola_1.jpg",
      "/assets/products/durag-stalowa-wola_2.jpg",
      "/assets/products/durag-stalowa-wola_3.jpg"
    ],
    "colors": [
      {
        "name": "Pure White",
        "hex": "#FFFFFF"
      },
      {
        "name": "Deep Black",
        "hex": "#000000"
      }
    ],
    "reviews": [
      {
        "author": "Michał P.",
        "rating": 5,
        "comment": "Krepa mirella trzyma fason jak żaden inny.",
        "date": "19.05.2026"
      }
    ]
  },
  {
    "id": 13691,
    "slug": "durag-barbie",
    "name": "Durag Barbie — Różowa Satyna",
    "nameEn": "Durag Barbie Pink Satin",
    "price": 79,
    "category": "satin",
    "categoryLabel": "Satyna Poliestrowa",
    "material": "Lśniąca Satyna Poliestrowa",
    "description": "Żywy, energiczny róż inspirowany popkulturą i beztroskim klimatem Y2K. Gładka, połyskująca satyna, która dodaje odwagi każdej stylizacji.",
    "storyDescription": "Popkulturowy manifest energii Y2K. Odważny, lśniący róż dla tych, którzy bawią się modą i wyznaczają własne trendy.",
    "images": [
      "/assets/products/durag-barbie_1.png",
      "/assets/products/durag-barbie_2.jpg",
      "/assets/products/durag-barbie_3.jpg"
    ],
    "colors": [
      {
        "name": "Barbie Pink",
        "hex": "#FF69B4"
      }
    ],
    "reviews": [
      {
        "author": "Wiktoria C.",
        "rating": 5,
        "comment": "Cudowny róż, na imprezy sztos!",
        "date": "27.05.2026"
      }
    ]
  },
  {
    "id": 1375,
    "slug": "durag-rzeszow",
    "name": "Durag Rzeszów — Wzorzysty Fiolet Satyna",
    "nameEn": "Durag Rzeszów Patterned Purple Satin",
    "price": 79,
    "category": "satin",
    "categoryLabel": "Satyna Poliestrowa",
    "material": "Wzorzysta Satyna Poliestrowa",
    "description": "Wyjątkowy model łączący geometryczne, vintage wzory z głębokim odcieniem fioletu. Dla tych, którzy chcą czegoś więcej niż jednolitego koloru.",
    "storyDescription": "Rzeszów. Innowacja spotyka się z tradycją. Vintage wzory i nasycony fiolet dla miłośników unikalnych detali.",
    "images": [
      "/assets/products/durag-rzeszow_1.png",
      "/assets/products/durag-rzeszow_2.jpg",
      "/assets/products/durag-rzeszow_3.jpg"
    ],
    "colors": [
      {
        "name": "Pattern Purple",
        "hex": "#6A0DAD"
      }
    ],
    "reviews": [
      {
        "author": "Kamil B.",
        "rating": 5,
        "comment": "Wzór wygląda genialnie pod światło.",
        "date": "12.05.2026"
      }
    ]
  },
  {
    "id": 1380,
    "slug": "durag-sosnowiec",
    "name": "Durag Sosnowiec — Zielony Welur",
    "nameEn": "Durag Sosnowiec Emerald Green Velvet",
    "price": 89,
    "category": "velvet",
    "categoryLabel": "Luksusowy Welur",
    "material": "Mięsisty Welur Szmaragdowy",
    "description": "Głęboka, szlachetna zieleń welwetu nawiązująca do igliwia sosny i siły natury. Aksamitnie gładki, mocno trzymający fale durag o unikalnym odcieniu.",
    "storyDescription": "Sosnowiec. Gra znaczeń, leśna tożsamość i szmaragdowy welur o wyrazistym charakterze.",
    "images": [
      "/assets/products/durag-sosnowiec_1.png",
      "/assets/products/durag-sosnowiec_2.jpg",
      "/assets/products/durag-sosnowiec_3.webp"
    ],
    "colors": [
      {
        "name": "Bottle Green",
        "hex": "#004225"
      }
    ],
    "reviews": [
      {
        "author": "Marcin P.",
        "rating": 5,
        "comment": "Zieleń butelkowa w welurze to po prostu poezja.",
        "date": "08.06.2026"
      }
    ]
  },
  {
    "id": 2001,
    "slug": "wave-brush-premium",
    "name": "Wave Brush Premium — Szczotka z Włosia Dzika",
    "nameEn": "Wave Brush Premium 100% Boar Bristle",
    "price": 69,
    "category": "accessories",
    "categoryLabel": "Akcesoria do Fal",
    "material": "100% Naturalne Włosie Dzika & Drewno",
    "description": "Profesjonalna zakrzywiona szczotka wave brush wykonana z naturalnego włosia dzika o średniej twardości (medium) osadzonego w ergonomicznym drewnianym korpusie. Rozprowadza naturalne olejki skóry głowy, wygładza i buduje perfekcyjne fale 360 waves.",
    "storyDescription": "Rzemieślnicza szczotka z selekcjonowanego włosia dzika. Niezbędnik każdego wavera do codziennych sesji brushingowych.",
    "images": [
      "/assets/wave_brush_premium.png"
    ],
    "colors": [
      {
        "name": "Classic Walnut",
        "hex": "#5C3A21"
      }
    ],
    "reviews": [
      {
        "author": "Damian Z.",
        "rating": 5,
        "comment": "Świetnie leży w dłoni, włosie idealnej twardości do 360.",
        "date": "15.05.2026"
      }
    ]
  },
  {
    "id": 2002,
    "slug": "wave-cap-classic",
    "name": "Wave Cap Classic — Czepek Kompresyjny",
    "nameEn": "Wave Cap Classic Compression Cap",
    "price": 39,
    "category": "accessories",
    "categoryLabel": "Akcesoria do Fal",
    "material": "Elastyczny Spandex Kompresyjny",
    "description": "Cienki, przewiewny czepek kompresyjny do noszenia pod duragiem lub na noc. Zapewnia podwójną kompresję (double compression method) zapobiegając przesuwaniu się fryzury podczas snu.",
    "storyDescription": "Maksymalna kompresja i idealne trzymanie fal. Czepek kompresyjny do codziennej pielęgnacji.",
    "images": [
      "/assets/wave_cap_classic.png"
    ],
    "colors": [
      {
        "name": "Pure Black",
        "hex": "#111111"
      }
    ],
    "reviews": [
      {
        "author": "Patryk K.",
        "rating": 5,
        "comment": "Niezbędny do spania, durag się nie zsuwa.",
        "date": "20.05.2026"
      }
    ]
  },
  {
    "id": 2003,
    "slug": "wave-elixir-bottle",
    "name": "Wave Elixir — Organiczny Olejek do Włosów (50ml)",
    "nameEn": "Wave Elixir Natural Hair & Scalp Oil (50ml)",
    "price": 59,
    "category": "accessories",
    "categoryLabel": "Akcesoria do Fal",
    "material": "100% Organiczne Oleje Naturalne",
    "description": "Autorska kompozycja tłoczonych na zimno olejów arganowego, jojoba i rycynowego z dodatkiem witaminy E. Zmiękcza strukturę włosa, przyspiesza układanie fal 360 waves i nadaje jedwabisty połysk.",
    "storyDescription": "Formuła stworzona specjalnie z myślą o odżywieniu skóry głowy i maksymalnej elastyczności fal.",
    "images": [
      "/assets/wave_elixir_bottle.png"
    ],
    "colors": [
      {
        "name": "Amber Gold",
        "hex": "#D4AF37"
      }
    ],
    "reviews": [
      {
        "author": "Kamil R.",
        "rating": 5,
        "comment": "Włosy są miękkie i fale znacznie szybciej się układają.",
        "date": "01.06.2026"
      }
    ]
  }
];

export function getAllProducts(): Product[] {
  return PRODUCTS;
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find(p => p.slug === slug);
}

export function getProductsByCategory(category: string): Product[] {
  if (category === "all") return PRODUCTS;
  return PRODUCTS.filter(p => p.category === category);
}

export function addProduct(product: Omit<Product, "id" | "reviews"> & { reviews?: ProductReview[] }): Product {
  const newId = PRODUCTS.length > 0 ? Math.max(...PRODUCTS.map(p => p.id)) + 1 : 1;
  const newProd: Product = {
    ...product,
    id: newId,
    reviews: product.reviews || [],
  };
  PRODUCTS.unshift(newProd);
  return newProd;
}

export function updateProduct(id: number, product: Partial<Product>): Product | undefined {
  const index = PRODUCTS.findIndex(p => p.id === id);
  if (index === -1) return undefined;
  PRODUCTS[index] = { ...PRODUCTS[index], ...product };
  return PRODUCTS[index];
}

export function deleteProduct(id: number): boolean {
  const index = PRODUCTS.findIndex(p => p.id === id);
  if (index === -1) return false;
  PRODUCTS.splice(index, 1);
  return true;
}
