import { Product } from '../products';

export interface ProductLocalization {
  name: string;
  categoryLabel: string;
  material: string;
  description: string;
  storyDescription?: string;
}

export const PRODUCT_TRANSLATIONS_EN: Record<string, ProductLocalization> = {
  'durag-milanowek': {
    name: 'Durag Milanówek — 100% Mulberry Silk Black / White',
    categoryLabel: 'Pure Mulberry Silk',
    material: '100% Mulberry Silk (19 Momme)',
    description: 'A tribute to the historic Polish silk capital and pre-war elegance. Crafted from the highest grade natural mulberry silk — luxuriously smooth, hypoallergenic and ultralight. Breathable, eliminates hair friction, and offers pure minimalism in black or white.',
    storyDescription: 'Milanówek. Historic Polish silk capital and timeless elegance. Highest grade natural silk — zero friction and pure luxury.',
  },
  'durag-warszawa': {
    name: 'Durag Warszawa — Black Ice Silk Satin',
    categoryLabel: 'Polyester Satin',
    material: 'Premium Smooth Ice Silk Satin',
    description: 'The most iconic and versatile Warsaw Durag Store piece. Inspired by the kinetic rhythm and minimalist elegance of Warsaw. Cut from cool-touch ice silk satin that conforms perfectly to your head and protects 360 wave structure.',
    storyDescription: 'Warszawa. Capital of Polish streetwear, sharp urban architecture and constant movement. Deep universal black as the foundation of any style.',
  },
  'durag-wroclaw': {
    name: 'Durag Wrocław — Pure White Satin',
    categoryLabel: 'Polyester Satin',
    material: 'Glossy Polyester Satin',
    description: 'Inspired by the architectural lightness and open bridges of Wrocław. Made from luminous, pure snow-white satin that wraps smoothly around the hair. Controlled elasticity and 100 cm straps guarantee hold without tension.',
  },
  'durag-lodz': {
    name: 'Durag Łódź — Deep Black Velvet',
    categoryLabel: 'Luxury Velvet',
    material: 'Heavyweight Matte Velvet',
    description: 'A nod to the textile mills and industrial brick history of Łódź. Dense, heavyweight black velvet with maximum compression, designed specifically to lock in 360 waves overnight.',
  },
  'durag-krakow': {
    name: 'Durag Kraków — Pastel Pink Velvet',
    categoryLabel: 'Luxury Velvet',
    material: 'Soft Pastel Velvet',
    description: 'Inspired by royal heritage and old-world stone charm. Subtle pastel pink velvet with a soft tactile nap that delivers elegance with gentle wave compression.',
  },
  'durag-bialystok': {
    name: 'Durag Białystok — Earth Brown Velvet',
    categoryLabel: 'Luxury Velvet',
    material: 'Warm Earth Tone Velvet',
    description: 'Inspired by the ancient primeval forests of Podlasie. Rich chocolate brown velvet with a warm, subtle sheen for effortless autumn and winter styling.',
  },
  'durag-bielsko-biala': {
    name: 'Durag Bielsko-Biała — Snow White Velvet',
    categoryLabel: 'Luxury Velvet',
    material: 'Premium Soft Snow Velvet',
    description: 'Inspired by snow-capped Beskidy peaks and wool manufacturing heritage. Pristine white velvet with rich texture and superior hair protection.',
  },
  'durag-bydgoszcz': {
    name: 'Durag Bydgoszcz — Metallic Copper Cupro',
    categoryLabel: 'Seasonal Fabrics',
    material: '100% Breathable Cupro',
    description: 'Crafted from sustainable, breathable cupro with a refined copper-bronze metallic sheen. Feels like silk with exceptional thermoregulation and drape.',
  },
  'durag-chalupy': {
    name: 'Durag Chałupy — Ocean Blue Satin',
    categoryLabel: 'Polyester Satin',
    material: 'High-Gloss Sea Blue Satin',
    description: 'Inspired by the Baltic Sea coastline and sea breeze on Hel Peninsula. Vibrant marine blue satin with a luminous finish, reducing hair friction day and night.',
  },
  'durag-czestochowa': {
    name: 'Durag Częstochowa — Steel Grey Velvet',
    categoryLabel: 'Luxury Velvet',
    material: 'Graphite Mineral Velvet',
    description: 'Inspired by limestone cliffs and industrial steelwork. Deep graphite grey velvet with balanced compression and enduring durability.',
  },
  'durag-elblag': {
    name: 'Durag Elbląg — Blue Camo Satin',
    categoryLabel: 'Polyester Satin',
    material: 'Printed Blue Camo Satin',
    description: 'Contemporary maritime camouflage pattern on ultra-smooth satin. A bold statement piece with low-friction hair protection.',
  },
  'durag-gdansk': {
    name: 'Durag Gdańsk — Baltic Blue Velvet',
    categoryLabel: 'Luxury Velvet',
    material: 'Deep Maritime Navy Velvet',
    description: 'Deep navy velvet echoing the midnight waters of Gdańsk Bay. Dense pile provides optimum 360 wave compression with regal comfort.',
  },
  'durag-katowice': {
    name: 'Durag Katowice — Royal Purple Satin',
    categoryLabel: 'Polyester Satin',
    material: 'Luminous Purple Satin',
    description: 'Deep royal purple with a metallic glint, inspired by modern Silesian transformation and night club culture. Smooth satin protects hair moisture.',
  },
  'durag-kielce': {
    name: 'Durag Kielce — Crimson Red Satin',
    categoryLabel: 'Polyester Satin',
    material: 'Vivid Crimson Red Satin',
    description: 'Bold, blood-red satin with deep reflective sheen. Inspired by the geological energy of the Holy Cross mountains.',
  },
  'durag-legionowo': {
    name: 'Durag Legionowo — Military Camo Satin',
    categoryLabel: 'Polyester Satin',
    material: 'Classic Military Camo Satin',
    description: 'Classic military camouflage pattern in olive, khaki and black tones transferred onto ultra-smooth friction-free satin.',
  },
  'durag-olsztyn': {
    name: 'Durag Olsztyn — Cobalt Blue Satin',
    categoryLabel: 'Polyester Satin',
    material: 'Glossy Cobalt Satin',
    description: 'Inspired by the Land of a Thousand Lakes and clear Warmian skies. Lustrous cobalt blue satin that protects hair from breakage.',
  },
  'durag-poznan': {
    name: 'Durag Poznań — Purple Velvet',
    categoryLabel: 'Luxury Velvet',
    material: 'Rich Purple Velvet',
    description: 'Deep purple velvet with a dense, tactile nap for individuals seeking unmistakable presence and top-tier wave holding.',
  },
  'durag-radom': {
    name: 'Durag Radom — Navy Velvet',
    categoryLabel: 'Luxury Velvet',
    material: 'Supple Navy Blue Velvet',
    description: 'Classic midnight navy velvet with a subtle sheen. Sturdy construction keeps your hairstyle locked throughout the night.',
  },
  'durag-szczecin': {
    name: 'Durag Szczecin — Silver Metallic Velvet',
    categoryLabel: 'Luxury Velvet',
    material: 'Silver Brushed Velvet',
    description: 'A nod to harbour cranes and shipyard heritage. Brushed silver velvet that plays delicately with natural light.',
  },
  'durag-tychy': {
    name: 'Durag Tychy — Classic Navy Satin',
    categoryLabel: 'Polyester Satin',
    material: 'Smooth Navy Polyester Satin',
    description: 'Understated midnight navy satin with a silky finish. An everyday essential that protects hair without fuss.',
  },
  'durag-wloclawek': {
    name: 'Durag Włocławek — Scarlet Red Velvet',
    categoryLabel: 'Luxury Velvet',
    material: 'Vivid Scarlet Red Velvet',
    description: 'Striking scarlet red velvet that makes an unmistakable statement while providing solid wave hold.',
  },
  'durag-zabrze': {
    name: 'Durag Zabrze — Metallic Silver Satin',
    categoryLabel: 'Polyester Satin',
    material: 'Reflective Silver Satin',
    description: 'Cool metallic silver satin inspired by Silesian heavy machinery and underground craft. Frictionless and lightweight.',
  },
  'durag-zyrardow': {
    name: 'Durag Żyrardów — Natural Linen Black / Beige',
    categoryLabel: 'Seasonal Fabrics',
    material: '100% Polish Natural Linen',
    description: 'A tribute to the Polish capital of linen weaving. 100% natural, breathable organic linen offering exceptional airflow for warm summer days.',
  },
  'durag-biala-podlaska': {
    name: 'Durag Biała Podlaska — Champagne Satin',
    categoryLabel: 'Polyester Satin',
    material: 'Premium Champagne Cream Satin',
    description: 'Warm champagne-cream satin combining an ethereal glow with an ultra-soft touch. Elegant, subtle luxury.',
  },
  'durag-stalowa-wola': {
    name: 'Durag Stalowa Wola — Textured Mirella Crepe',
    categoryLabel: 'Seasonal Fabrics',
    material: 'Mirella Satin Crepe',
    description: 'Crafted from technical Mirella satin crepe blending structured body with delicate luster. Inspired by modern Polish industrial design.',
  },
  'durag-barbie': {
    name: 'Durag Barbie — Pop Pink Satin',
    categoryLabel: 'Polyester Satin',
    material: 'Glossy Pop Pink Satin',
    description: 'High-energy pink satin inspired by pop culture and early 2000s streetwear nostalgia. Smooth, glossy and unapologetic.',
  },
  'durag-rzeszow': {
    name: 'Durag Rzeszów — Patterned Purple Satin',
    categoryLabel: 'Polyester Satin',
    material: 'Geometric Printed Satin',
    description: 'Geometric vintage prints across deep violet tones for those wanting more than solid monochromes.',
  },
  'durag-sosnowiec': {
    name: 'Durag Sosnowiec — Emerald Pine Velvet',
    categoryLabel: 'Luxury Velvet',
    material: 'Heavyweight Emerald Green Velvet',
    description: 'Deep forest emerald velvet recalling evergreen pine needles. Heavyweight construction with superior wave compression.',
  },
  'wave-brush-premium': {
    name: 'Wave Brush Premium — 100% Natural Boar Bristle',
    categoryLabel: 'Wave Care',
    material: '100% Boar Bristle & Solid Beechwood',
    description: 'Professional curved wave brush crafted with medium-firm natural boar bristles set in an ergonomic beechwood handle. Distributes natural scalp oils and builds defined 360 waves.',
  },
  'wave-cap-classic': {
    name: 'Wave Cap Classic — Compression Cap',
    categoryLabel: 'Wave Care',
    material: 'Breathable High-Elastic Spandex',
    description: 'Ultra-thin, breathable compression wave cap for wear underneath your durag or overnight. Essential for the double-compression method to prevent slipping during sleep.',
  },
  'wave-elixir-bottle': {
    name: 'Wave Elixir — Natural Hair & Scalp Oil (50ml)',
    categoryLabel: 'Wave Care',
    material: '100% Cold-Pressed Organic Oils',
    description: 'Artisanal blend of cold-pressed Moroccan argan, jojoba and Jamaican black castor oils infused with vitamin E. Softens hair texture, accelerates 360 wave formation and leaves a healthy satin sheen.',
  },
};

const PRODUCT_ID_TO_SLUG: Record<number, string> = {
  1160: 'durag-milanowek',
  1161: 'durag-warszawa',
  1335: 'durag-wroclaw',
  1365: 'durag-lodz',
  1366: 'durag-bialystok',
  1367: 'durag-zyrardow',
  1368: 'durag-stalowa-wola',
  1369: 'durag-krakow',
  1370: 'durag-bielsko-biala',
  1371: 'durag-radom',
  1372: 'durag-katowice',
  1373: 'durag-zabrze',
  1374: 'durag-kielce',
  1375: 'durag-rzeszow',
  1376: 'durag-elblag',
  1377: 'durag-legionowo',
  1378: 'durag-chalupy',
  1379: 'durag-tychy',
  1380: 'durag-sosnowiec',
  1381: 'durag-wloclawek',
  1382: 'durag-gdansk',
  1383: 'durag-szczecin',
  1384: 'durag-poznan',
  1385: 'durag-bydgoszcz',
  1386: 'durag-czestochowa',
  1387: 'durag-olsztyn',
  1388: 'durag-biala-podlaska',
  13691: 'durag-barbie',
  2001: 'wave-brush-premium',
  2002: 'wave-cap-classic',
  2003: 'wave-elixir-bottle',
};

/**
 * Returns a localized copy of product fields based on active language
 */
export function getLocalizedProduct(product: Product, language: 'PL' | 'EN'): Product {
  if (language === 'PL') {
    return product;
  }

  // 1. Direct slug match
  let enTranslation = PRODUCT_TRANSLATIONS_EN[product.slug];

  // 2. Lookup by product ID
  if (!enTranslation && product.id && PRODUCT_ID_TO_SLUG[product.id]) {
    const slugFromId = PRODUCT_ID_TO_SLUG[product.id];
    enTranslation = PRODUCT_TRANSLATIONS_EN[slugFromId];
  }

  // 3. Prefix or fuzzy match on slug
  if (!enTranslation && product.slug) {
    const slugLower = product.slug.toLowerCase();
    const foundKey = Object.keys(PRODUCT_TRANSLATIONS_EN).find(
      (k) => slugLower.startsWith(k) || k.startsWith(slugLower)
    );
    if (foundKey) {
      enTranslation = PRODUCT_TRANSLATIONS_EN[foundKey];
    }
  }

  if (enTranslation) {
    return {
      ...product,
      name: enTranslation.name,
      categoryLabel: enTranslation.categoryLabel,
      material: enTranslation.material,
      description: enTranslation.description,
      storyDescription: enTranslation.storyDescription || product.storyDescription,
    };
  }

  // Fallback if not specifically mapped in dict:
  const fallbackMaterial =
    product.category === 'silk'
      ? '100% Mulberry Silk (19 Momme)'
      : product.category === 'velvet'
      ? 'Luxury High-Density Velvet'
      : product.category === 'satin'
      ? 'Premium Smooth Polyester Satin'
      : product.category === 'accessories'
      ? 'Wave Care Accessories'
      : 'Seasonal Natural Fabrics';

  const fallbackCategoryLabel =
    product.category === 'silk'
      ? 'Mulberry Silk'
      : product.category === 'velvet'
      ? 'Velvet'
      : product.category === 'satin'
      ? 'Satin'
      : product.category === 'accessories'
      ? 'Accessories'
      : 'Seasonal';

  const fallbackDescription =
    product.category === 'silk'
      ? 'Crafted from pure natural 19 Momme mulberry silk. Luxuriously smooth, frictionless, and designed to protect hair hydration and 360 wave definition.'
      : product.category === 'velvet'
      ? 'Heavyweight luxury velvet with deep compression. Handcrafted in Warsaw with flat outer seams and 100 cm straps.'
      : product.category === 'satin'
      ? 'Ultra-smooth high-density satin durag handcrafted in Warsaw. Features exterior flat seams and 100 cm straps.'
      : product.category === 'accessories'
      ? 'Premium wave routine accessory. Handcrafted for optimal 360 wave formation and compression.'
      : 'Handcrafted seasonal fabric durag sewn in Warsaw with seamless exterior stitching and 100 cm straps.';

  return {
    ...product,
    name: product.nameEn || product.name,
    categoryLabel: fallbackCategoryLabel,
    material: fallbackMaterial,
    description: fallbackDescription,
  };
}
