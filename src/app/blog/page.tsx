import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import TrustBanner from '@/components/TrustBanner';
import { BLOG_POSTS } from '@/lib/blog-data';
import { Clock, ArrowRight } from 'lucide-react';
import { SITE_URL } from '@/lib/siteConfig';

export const metadata: Metadata = {
  title: 'Blog & Kompendium Duragów | Warsaw Durag Store',
  description:
    'Rzetelna wiedza o kulturze streetwearu, pielęgnacji fal 360 waves, materiałach z Milanówka i technikach wiązania duraga. Artykuły warszawskiego atelier.',
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
  openGraph: {
    title: 'Blog & Kompendium Duragów | Warsaw Durag Store',
    description:
      'Wiedza o kulturze, falach 360 i jedwabiu prosto od założycieli Warsaw Durag Store.',
    url: `${SITE_URL}/blog`,
    images: [`${SITE_URL}/media/wds/wyszol1126.jpg`],
  },
};

export default function BlogListingPage() {
  const featuredPost = BLOG_POSTS[0];
  const remainingPosts = BLOG_POSTS.slice(1);

  return (
    <div className="bg-[#FAF9F7] text-[#0D0D0B] min-h-screen">
      {/* Blog Hero Header */}
      <section className="bg-[#0D0D0B] text-white py-16 sm:py-24 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-[#D9A87E] text-[10px] sm:text-xs font-mono uppercase tracking-[0.3em] font-bold block mb-3">
            [ WDS EDITORIAL &amp; KNOWLEDGE BASE ]
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-medium tracking-tight mb-5">
            Dziennik Atelier i Fale 360
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-300 font-light max-w-2xl mx-auto leading-relaxed">
            Praktyczna wiedza o technice szczotkowania, historii i symbolice duraga oraz pielęgnacji naturalnego jedwabiu morwowego.
          </p>
        </div>
      </section>

      <TrustBanner />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 space-y-14">
        
        {/* Featured Big Article Card */}
        {featuredPost && (
          <section className="border border-[#0D0D0B] bg-white overflow-hidden group">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              <div className="relative aspect-[16/10] lg:aspect-auto lg:col-span-7 bg-[#0D0D0B] overflow-hidden">
                <Image
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  fill
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-[#0D0D0B] text-[#D9A87E] text-[10px] font-mono uppercase tracking-widest px-3 py-1 border border-white/10 font-bold">
                    [ WYRÓŻNIONY WPIS ]
                  </span>
                </div>
              </div>

              <div className="p-6 sm:p-10 lg:col-span-5 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-[10px] font-mono text-gray-500 pb-2 border-b border-[#E5E2DC]">
                    <span className="text-[#734C1D] uppercase font-bold tracking-wider">
                      {featuredPost.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {featuredPost.readingTime}
                    </span>
                  </div>

                  <Link href={`/blog/${featuredPost.slug}`}>
                    <h2 className="font-serif text-2xl sm:text-3xl text-[#0D0D0B] font-medium leading-tight group-hover:text-[#734C1D] transition-colors">
                      {featuredPost.title}
                    </h2>
                  </Link>

                  <p className="text-xs sm:text-sm text-[#3B3C40] font-light leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E5E2DC] flex items-center justify-between">
                  <span className="text-xs font-mono text-gray-500">{featuredPost.date}</span>
                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#0D0D0B] hover:text-[#734C1D] transition-colors"
                  >
                    <span>[ CZYTAJ ARTYKUŁ ]</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Section Header */}
        <div className="flex items-center justify-between border-b border-[#0D0D0B] pb-3">
          <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#0D0D0B]">
            [ WSZYSTKIE PUBLIKACJE // ARCHIWUM WDS ]
          </span>
          <span className="text-xs font-mono text-[#5A5B60]">
            {BLOG_POSTS.length} ARTYKUŁÓW
          </span>
        </div>

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {remainingPosts.map((post) => (
            <article
              key={post.slug}
              className="bg-white border border-[#E5E2DC] flex flex-col justify-between group hover:border-[#0D0D0B] transition-colors"
            >
              <div>
                <Link href={`/blog/${post.slug}`} className="block relative aspect-[16/10] overflow-hidden bg-[#F6F5F2]">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-[#0D0D0B] text-white text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 border border-white/10">
                      {post.category}
                    </span>
                  </div>
                </Link>

                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between text-[10px] font-mono text-gray-500">
                    <span>{post.date}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readingTime}
                    </span>
                  </div>

                  <Link href={`/blog/${post.slug}`}>
                    <h3 className="font-serif text-lg text-[#0D0D0B] font-medium leading-snug group-hover:text-[#734C1D] transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                  </Link>

                  <p className="text-xs text-[#5A5B60] font-light leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <Link
                  href={`/blog/${post.slug}`}
                  className="w-full inline-flex items-center justify-center py-2.5 bg-[#F6F5F2] hover:bg-[#0D0D0B] hover:text-white text-[#0D0D0B] text-[11px] font-mono uppercase tracking-wider font-semibold transition-colors border border-[#E5E2DC]"
                >
                  [ CZYTAJ WIĘCEJ ]
                </Link>
              </div>
            </article>
          ))}
        </div>

      </div>
    </div>
  );
}
