import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import TrustBanner from '@/components/TrustBanner';
import { searchProducts, fetchBestsellers } from '@/lib/products-db';
import { SITE_URL } from '@/lib/siteConfig';
import { Search, Sparkles, ArrowRight, PackageX } from 'lucide-react';

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  const query = q?.trim() || '';

  return {
    title: query ? `Wyniki wyszukiwania: „${query}” | Warsaw Durag Store` : 'Szukaj produktów | Warsaw Durag Store',
    description: query
      ? `Znalezione duragi i akcesoria dla zapytania „${query}”. Szybka wysyłka w 24h z Warszawy, darmowa dostawa InPost.`
      : 'Wyszukaj duragi z jedwabiu 19 Momme, satyny, aksamitu oraz akcesoria do fal 360 waves w Warsaw Durag Store.',
    alternates: {
      canonical: `${SITE_URL}/szukaj`,
    },
    robots: {
      index: false, // Don't index search result queries in Google to avoid duplicate content penalties
      follow: true,
    },
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() || '';

  const results = query ? await searchProducts(query) : [];
  const suggestions = results.length === 0 ? await fetchBestsellers(4) : [];

  const POPULAR_SEARCHES = ['jedwab 19 momme', 'czarna satyna', 'welur granatowy', 'szczotka do fal', 'len'];

  return (
    <div>
      {/* Search Header Banner */}
      <section className="bg-[#0D0D0B] text-white py-12 sm:py-16 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-[#D9A87E] text-[10px] sm:text-xs uppercase tracking-[0.25em] font-bold block mb-2">
            [ Wyszukiwarka Produktów ]
          </span>
          <h1 className="font-serif text-2xl sm:text-4xl text-white font-medium mb-6">
            {query ? `Wyniki dla: „${query}”` : 'Znajdź swój durag'}
          </h1>

          {/* Search Form */}
          <form action="/szukaj" method="GET" className="relative max-w-xl mx-auto">
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Wpisz nazwę, materiał (np. jedwab, satyna, welur)..."
              className="w-full bg-white text-[#0D0D0B] pl-12 pr-28 py-3.5 sm:py-4 rounded-full text-xs sm:text-sm shadow-xl focus:outline-none focus:ring-2 focus:ring-[#D9A87E] placeholder-gray-400 font-medium"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#0D0D0B] hover:bg-[#D9A87E] text-white hover:text-[#0D0D0B] px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Szukaj
            </button>
          </form>

          {/* Popular Search Suggestions */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-[11px] text-gray-300">
            <span className="text-[#D9A87E]">Często szukane:</span>
            {POPULAR_SEARCHES.map((term) => (
              <Link
                key={term}
                href={`/szukaj?q=${encodeURIComponent(term)}`}
                className="bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-full text-gray-200 transition-colors"
              >
                {term}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <TrustBanner />

      {/* Search Results Content */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6">
        {query && results.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-8 pb-3 border-b border-[#E5E2DC]">
              <p className="text-xs sm:text-sm text-[#3B3C40]">
                Znaleziono <strong className="text-[#0D0D0B]">{results.length}</strong> {results.length === 1 ? 'produkt' : 'produktów'} dla zapytania: <strong className="text-[#0D0D0B]">„{query}”</strong>
              </p>
              <Link href="/kolekcja/all" className="text-xs text-[#734C1D] hover:underline font-semibold">
                Wyczyść i zobacz wszystko →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
              {results.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        ) : query && results.length === 0 ? (
          <div className="space-y-12">
            {/* Empty State */}
            <div className="text-center py-14 bg-[#F7F5F2] rounded-2xl border border-dashed border-[#CFCFCF] max-w-2xl mx-auto p-6">
              <PackageX className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h2 className="font-serif text-xl sm:text-2xl text-[#0D0D0B] font-medium mb-2">
                Brak wyników dla „{query}”
              </h2>
              <p className="text-xs sm:text-sm text-[#3B3C40] font-light max-w-md mx-auto mb-6">
                Nie znaleźliśmy produktów odpowiadających Twojemu zapytaniu. Upewnij się, że słowo zostało wpisane poprawnie lub skorzystaj z poniższych propozycji.
              </p>
              <Link
                href="/kolekcja/all"
                className="inline-flex items-center gap-2 bg-[#0D0D0B] text-white hover:bg-[#D9A87E] hover:text-[#0D0D0B] px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-colors shadow-md"
              >
                <span>Przeglądaj wszystkie duragi</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Recommendations */}
            {suggestions.length > 0 && (
              <div>
                <div className="text-center mb-8">
                  <span className="text-[#734C1D] text-[10px] uppercase font-bold tracking-widest block mb-1">
                    [ Polecane dla Ciebie ]
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl text-[#0D0D0B] font-medium">
                    Bestsellery Warsaw Durag Store
                  </h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                  {suggestions.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Initial Empty Search View */
          <div className="text-center py-12 max-w-xl mx-auto space-y-6">
            <Sparkles className="w-10 h-10 text-[#D9A87E] mx-auto" />
            <h2 className="font-serif text-xl sm:text-2xl text-[#0D0D0B] font-medium">
              Wpisz frazę powyżej, aby przeszukać naszą ofertę
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 font-light">
              Możesz szukać po materiale (jedwab, satyna, welur, len, cupro), nazwie miasta (Milanówek, Warszawa, Kraków) lub przeznaczeniu (360 waves, nocna ochrona).
            </p>
            <div className="pt-2">
              <Link
                href="/kolekcja/all"
                className="inline-block bg-[#0D0D0B] text-white px-7 py-3 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#D9A87E] hover:text-[#0D0D0B] transition-colors"
              >
                Zobacz wszystkie 31 modeli
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
