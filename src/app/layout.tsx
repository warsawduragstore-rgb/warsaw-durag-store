import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { LanguageProvider } from '@/context/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import { SITE_URL } from '@/lib/siteConfig';

const isProduction = process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Warsaw Durag Store — Jedyne duragi szyte w Polsce | 100% Jedwab Morwowy',
    template: '%s | Warsaw Durag Store',
  },
  description: 'Jedyne duragi szyte w Polsce z prawdziwego jedwabiu morwowego 19 Momme, aksamitu i satyny. Darmowa dostawa InPost w całej Polsce, wysyłka w 24h z Warszawy. Odkryj unikalne duragi streetwear.',
  keywords: [
    'durag',
    'duragi',
    'durag warszawa',
    'jedwabny durag',
    'durag jedwab morwowy',
    'durag 19 momme',
    'waves 360',
    'streetwear polska',
    'warsaw durag store',
    'duragi sklep'
  ],
  authors: [{ name: 'Warsaw Durag Store', url: SITE_URL }],
  creator: 'Warsaw Durag Store',
  publisher: 'Warsaw Durag Store',
  alternates: {
    canonical: SITE_URL,
    languages: {
      'pl': SITE_URL,
      'en': `${SITE_URL}?lang=EN`,
      'de': `${SITE_URL}?lang=DE`,
      'fr': `${SITE_URL}?lang=FR`,
      'es': `${SITE_URL}?lang=ES`,
      'cs': `${SITE_URL}?lang=CZ`,
      'lt': `${SITE_URL}?lang=LT`,
      'x-default': SITE_URL,
    },
  },
  robots: isProduction
    ? {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      }
    : {
        index: false,
        follow: false,
        googleBot: {
          index: false,
          follow: false,
        },
      },
  openGraph: {
    title: 'Warsaw Durag Store — Jedyne duragi szyte w Polsce',
    description: 'Jedyne duragi szyte w Polsce z prawdziwego jedwabiu morwowego 19 Momme i aksamitu. Darmowa dostawa, wysyłka 1 dzień z Warszawy.',
    url: SITE_URL,
    siteName: 'Warsaw Durag Store',
    locale: 'pl_PL',
    type: 'website',
    images: [
      {
        url: `${SITE_URL}/assets/logo_black.png`,
        width: 800,
        height: 600,
        alt: 'Warsaw Durag Store Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Warsaw Durag Store — Jedyne duragi szyte w Polsce',
    description: 'Ręcznie szyte duragi z jedwabiu morwowego 19 Momme i aksamitu. Darmowa dostawa w Polsce.',
    images: [`${SITE_URL}/assets/logo_black.png`],
  },
};

const jsonLdOrg = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      'name': 'Warsaw Durag Store',
      'url': SITE_URL,
      'logo': `${SITE_URL}/assets/logo_black.png`,
      'contactPoint': {
        '@type': 'ContactPoint',
        'email': 'support@warsawduragstore.pl',
        'contactType': 'customer service',
        'availableLanguage': ['Polish', 'English', 'German', 'French', 'Spanish', 'Czech', 'Lithuanian'],
      },
      'sameAs': ['https://instagram.com/warsawduragstore'],
    },
    {
      '@type': 'LocalBusiness',
      '@id': `${SITE_URL}/#localbusiness`,
      'name': 'Warsaw Durag Store',
      'image': `${SITE_URL}/assets/logo_black.png`,
      'priceRange': '79 - 149 PLN',
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': 'ul. Włodarzewska 4',
        'addressLocality': 'Warszawa',
        'postalCode': '02-384',
        'addressCountry': 'PL',
      },
      'geo': {
        '@type': 'GeoCoordinates',
        'latitude': 52.2052,
        'longitude': 20.9634,
      },
      'url': SITE_URL,
      'telephone': '+48700000000',
      'openingHoursSpecification': [
        {
          '@type': 'OpeningHoursSpecification',
          'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          'opens': '09:00',
          'closes': '20:00',
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
        />
      </head>
      <body className="bg-white text-[#0D0D0B] font-sans antialiased selection:bg-[#734C1D] selection:text-white">
        <LanguageProvider>
          <CartProvider>
            <Header />
            <CartDrawer />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
