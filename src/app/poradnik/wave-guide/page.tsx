import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import TrustBanner from '@/components/TrustBanner';
import { SITE_URL } from '@/lib/siteConfig';

export const metadata: Metadata = {
  title: 'Kompletny Poradnik 360 Waves (Wave Guide) | Warsaw Durag Store',
  description: 'Dowiedz się jak robić i pielęgnować fale 360 waves. Wiązanie duraga, technika szczotkowania, jedwab morwowy 19 Momme i profesjonalny rytuał pielęgnacji.',
  alternates: {
    canonical: `${SITE_URL}/poradnik/wave-guide`,
  },
  openGraph: {
    title: 'Kompletny Poradnik 360 Waves (Wave Guide) | Warsaw Durag Store',
    description: 'Kompletny przewodnik krok po kroku po pielęgnacji fal 360 waves i wiązaniu jedwabnego duraga.',
    url: `${SITE_URL}/poradnik/wave-guide`,
  },
};

export default function WaveGuidePage() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Dlaczego jedwab morwowy 19 Momme jest najlepszy do fal 360?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Gładkie włókno naturalnego jedwabiu morwowego nie powoduje tarcia włosów podczas snu, zatrzymuje naturalne oleje w strukturze włosa i zapewnia idealną kompresję bez łamania łusek włosa.',
        },
      },
      {
        '@type': 'Question',
        name: 'Ile godzin dziennie należy nosić durag, aby uzyskać fale?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Durag powinien być noszony zawsze podczas snu (minimum 7-8 godzin), po każdej sesji szczotkowania (30-45 minut) oraz podczas treningów, aby zapobiec niszczeniu wzoru fal przez pot.',
        },
      },
    ],
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Hero */}
      <section className="bg-[#0D0D0B] text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="text-[#D9A87E] text-xs uppercase tracking-[0.3em] font-semibold block mb-3">
            [ official wds manual ]
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-medium mb-6">
            Kompletny Poradnik 360 Waves
          </h1>
          <p className="text-sm text-gray-300 font-light max-w-xl mx-auto leading-relaxed">
            Wszystko, co musisz wiedzieć o tworzeniu, kompresji i pielęgnacji perfekcyjnych fal. Od doboru szczotki z włosia dzika po wiązanie jedwabnego duraga.
          </p>
        </div>
      </section>

      <TrustBanner />

      {/* Main Guide Content */}
      <article className="max-w-4xl mx-auto px-6 py-16 space-y-12 text-[#0D0D0B]">
        
        {/* Step 1 */}
        <section className="space-y-4 border-l-2 border-[#0D0D0B] pl-6">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#734C1D] font-bold block">
            [ ETAP 01 / MECHANIKA FAL ]
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium">
            1. Fundamenty: Czym są fale 360 i jak działają?
          </h2>
          <p className="text-sm text-[#3B3C40] font-light leading-relaxed">
            Fale 360 waves to naturalne skrętki włosów, które zostały spłaszczone i ułożone w jednolity wzór za pomocą regularnego szczotkowania (brushing) oraz stałej kompresji pod duragiem. Kluczem do głębi fal nie są ciężkie chemiczne pomady, lecz <strong>konsekwencja</strong>, <strong>prawidłowy kąt szczotkowania</strong> i <strong>retencja naturalnej wilgoci włosa</strong>.
          </p>
        </section>

        {/* Step 2 */}
        <section className="space-y-4 border-l-2 border-[#0D0D0B] pl-6">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#734C1D] font-bold block">
            [ ETAP 02 / BRUSH SESSION ]
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium">
            2. Rytuał Szczotkowania
          </h2>
          <p className="text-sm text-[#3B3C40] font-light leading-relaxed">
            Szczotkowanie trenuje cebulki do wzrostu w ściśle określonym kierunku:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="border border-[#0D0D0B] p-4 bg-[#F6F5F2]">
              <span className="font-mono text-[10px] uppercase text-[#734C1D] font-bold block mb-1">[ 01. KORONA ]</span>
              <p className="text-xs text-[#3B3C40] font-light leading-relaxed">
                Zawsze rozpoczynaj od korony (crown) i szczotkuj na zewnątrz pod kątem 45 stopni.
              </p>
            </div>
            <div className="border border-[#0D0D0B] p-4 bg-[#F6F5F2]">
              <span className="font-mono text-[10px] uppercase text-[#734C1D] font-bold block mb-1">[ 02. WŁOSIE DZIKA ]</span>
              <p className="text-xs text-[#3B3C40] font-light leading-relaxed">
                Do krótkich włosów używaj szczotki Soft, a w miarę wzrostu Medium z naturalnego włosia dzika.
              </p>
            </div>
            <div className="border border-[#0D0D0B] p-4 bg-[#F6F5F2]">
              <span className="font-mono text-[10px] uppercase text-[#734C1D] font-bold block mb-1">[ 03. REŻIM ]</span>
              <p className="text-xs text-[#3B3C40] font-light leading-relaxed">
                Minimum 15–20 minut dziennie. Podziel czas na dwie sesje: poranną i wieczorną.
              </p>
            </div>
          </div>
        </section>

        {/* Step 3 */}
        <section className="space-y-4 border-l-2 border-[#0D0D0B] pl-6">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#734C1D] font-bold block">
            [ ETAP 03 / WIĄZANIE ]
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium">
            3. Prawidłowe Wiązanie Duraga
          </h2>
          <div className="bg-[#F6F5F2] p-8 border border-[#0D0D0B] space-y-4 text-sm text-[#3B3C40] font-light">
            <ol className="space-y-3 list-decimal pl-5 font-mono text-xs leading-relaxed">
              <li>Nałóż durag ze szwem skierowanym na zewnątrz (aby uniknąć śladu na czole).</li>
              <li>Przeciągnij oba pasy za głowę i skrzyżuj je nisko na karku.</li>
              <li>Przeciągnij pasy z powrotem na czoło i wyrównaj na płasko, aby nie skręcały się pod kątem.</li>
              <li>Zawiąż z tyłu na miękki węzeł — nacisk musi być równomierny, bez ucisku skroni.</li>
              <li>Zaciągnij lekko tylny flap w dół, aby idealnie zablokować kompresję na koronie.</li>
            </ol>
          </div>
        </section>

        {/* Product Callout */}
        <section className="bg-[#0D0D0B] text-white p-10 sm:p-14 text-center space-y-5">
          <span className="font-mono text-xs text-[#D9A87E] uppercase tracking-[0.3em] block">
            [ MATERIAŁ MA ZNACZENIE ]
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-medium">
            100% Jedwab Morwowy 19 Momme
          </h3>
          <p className="text-xs text-gray-300 font-light max-w-md mx-auto leading-relaxed">
            Syntetyczny poliester pochłania sebum i elektryzuje włosy. Prawdziwy jedwab morwowy chroni strukturę włosa i utrzymuje fale w ryzach.
          </p>
          <div className="pt-2">
            <Link
              href="/kolekcja/silk"
              className="inline-block bg-white text-[#0D0D0B] hover:bg-[#D9A87E] hover:text-[#0D0D0B] px-8 py-3.5 text-xs font-mono font-bold uppercase tracking-[0.2em] transition-colors"
            >
              [ ZOBACZ KOLEKCJĘ JEDWABNĄ ]
            </Link>
          </div>
        </section>

      </article>
    </div>
  );
}
