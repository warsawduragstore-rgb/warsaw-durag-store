import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import TrustBanner from '@/components/TrustBanner';
import { CheckCircle2, Sparkles, BookOpen } from 'lucide-react';
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
        <section className="space-y-4">
          <div className="flex items-center gap-3 text-[#734C1D]">
            <BookOpen className="w-6 h-6" />
            <span className="text-xs uppercase tracking-[0.2em] font-semibold">Krok 1</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium">
            1. Fundamenty: Czym są fale 360 i jak działają?
          </h2>
          <p className="text-sm text-[#3B3C40] font-light leading-relaxed">
            Fale 360 waves to nic innego jak naturalne skrętki włosów, które zostały spłaszczone i ukierunkowane w stały wzór za pomocą regularnego szczotkowania (brushing) oraz kompresji pod duragiem. Kluczem do sukcesu nie są drogie pomady, lecz <strong>konsekwencja</strong> i <strong>ochrona wilgoci</strong>.
          </p>
        </section>

        {/* Step 2 */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 text-[#734C1D]">
            <Sparkles className="w-6 h-6" />
            <span className="text-xs uppercase tracking-[0.2em] font-semibold">Krok 2</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium">
            2. Rytuał Szczotkowania (Brush Session)
          </h2>
          <p className="text-sm text-[#3B3C40] font-light leading-relaxed">
            Szczotkowanie ukierunkowuje włosy i trenuje cebulki do wzrostu w danym kierunku:
          </p>
          <ul className="space-y-2 text-sm text-[#3B3C40] font-light pl-6 list-disc">
            <li><strong>Rozpocznij od korony (crown):</strong> Szczotkuj od czubka głowy na zewnątrz pod kątem 45 stopni.</li>
            <li><strong>Używaj odpowiedniej szczotki:</strong> Do krótkich włosów używaj szczotki miękkiej (soft), a w miarę wzrostu przejdź na średnią (medium boar bristle).</li>
            <li><strong>Czas trwania:</strong> Minimum 15–20 minut dziennie. Najlepiej podzielić to na dwie sesje rano i wieczorem.</li>
          </ul>
        </section>

        {/* Step 3 */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 text-[#734C1D]">
            <CheckCircle2 className="w-6 h-6" />
            <span className="text-xs uppercase tracking-[0.2em] font-semibold">Krok 3</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium">
            3. Prawidłowe Wiązanie Duraga
          </h2>
          <div className="bg-[#F7F5F2] p-8 border border-[#CFCFCF]/50 rounded-sm space-y-4 text-sm text-[#3B3C40] font-light">
            <ol className="space-y-3 list-decimal pl-5">
              <li>Nałóż durag centralnym szwem skierowanym na zewnątrz (aby zapobiec pionowej kresce na czole).</li>
              <li>Przeciągnij oba pasy za głowę i skrzyżuj je nisko na karku.</li>
              <li>Przeciągnij pasy z powrotem na czoło i wyrównaj na płasko, aby nie skręcały się.</li>
              <li>Zawiąż z tyłu na miękki supeł. Pamiętaj — kompresja ma być równomierna, nie wywołująca bólu głowy!</li>
              <li>Zaciągnij delikatnie tylny płat tkaniny w dół, aby wygładzić fale na koronie.</li>
            </ol>
          </div>
        </section>

        {/* Product Callout */}
        <section className="bg-[#0D0D0B] text-white p-10 rounded-sm text-center space-y-4">
          <h3 className="font-serif text-2xl font-medium">Gotowy na rozpoczęcie rytuału?</h3>
          <p className="text-xs text-gray-300 font-light max-w-md mx-auto">
            Wybierz ręcznie szyty durag z 100% naturalnego jedwabiu morwowego 19 Momme i zadbaj o swoje fale.
          </p>
          <div>
            <Link
              href="/kolekcja/silk"
              className="inline-block bg-[#734C1D] text-white hover:bg-white hover:text-[#0D0D0B] px-8 py-3 text-xs font-semibold uppercase tracking-widest transition-colors rounded-full"
            >
              Zobacz Kolekcję Jedwabną
            </Link>
          </div>
        </section>

      </article>
    </div>
  );
}
