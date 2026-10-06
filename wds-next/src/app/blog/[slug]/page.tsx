import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import TrustBanner from '@/components/TrustBanner';
import { BLOG_POSTS, getBlogPost } from '@/lib/blog-data';
import { Clock, Calendar, ArrowLeft, ArrowRight, Share2, Check } from 'lucide-react';
import { SITE_URL } from '@/lib/siteConfig';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) {
    return { title: 'Artykuł nie znaleziony | Warsaw Durag Store' };
  }

  const canonicalUrl = `${SITE_URL}/blog/${slug}`;

  return {
    title: `${post.title} | Warsaw Durag Store`,
    description: post.excerpt,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${post.title} | Warsaw Durag Store`,
      description: post.excerpt,
      url: canonicalUrl,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author.name],
      images: [
        {
          url: post.image.startsWith('http') ? post.image : `${SITE_URL}${post.image}`,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.title} | Warsaw Durag Store`,
      description: post.excerpt,
      images: [post.image.startsWith('http') ? post.image : `${SITE_URL}${post.image}`],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const jsonLdArticle = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.image.startsWith('http') ? post.image : `${SITE_URL}${post.image}`,
    datePublished: post.date,
    author: {
      '@type': 'Person',
      name: post.author.name,
      jobTitle: post.author.role,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Warsaw Durag Store',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/assets/logo_white.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${post.slug}`,
    },
  };

  const otherPosts = BLOG_POSTS.filter((p) => p.slug !== slug).slice(0, 2);

  return (
    <div className="bg-[#FAF9F7] text-[#0D0D0B] min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
      />
      {/* Top Breadcrumb Bar */}
      <div className="bg-[#0D0D0B] text-white border-b border-white/10 py-3 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between text-xs">
          <Link
            href="/blog"
            className="text-[#C8794B] hover:text-white transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Wróć do bloga</span>
          </Link>
          <span className="text-gray-400 hidden sm:inline">
            {post.category}
          </span>
        </div>
      </div>

      {/* Article Header */}
      <header className="bg-[#0D0D0B] text-white py-14 sm:py-20 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <span className="text-[#C8794B] text-xs font-medium block">
            {post.category} · {post.readingTime}
          </span>

          <h1 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight leading-tight">
            {post.title}
          </h1>

          <p className="text-sm sm:text-base text-gray-300 max-w-xl mx-auto leading-relaxed">
            {post.subtitle}
          </p>

          <div className="pt-4 flex items-center justify-center gap-4 text-xs text-gray-400">
            <span>Autor: <strong>{post.author.name}</strong></span>
            <span>·</span>
            <span>{post.date}</span>
          </div>
        </div>
      </header>

      {/* Article Main Content Container */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-10">
        
        {/* Main Cover Photo */}
        <div className="relative aspect-[16/9] border border-[#0D0D0B] overflow-hidden bg-[#0D0D0B]">
          <Image
            src={post.image}
            alt={post.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 800px"
          />
        </div>

        {/* Key Takeaways Box */}
        {post.keyTakeaways && post.keyTakeaways.length > 0 && (
          <div className="bg-[#F6F5F2] border border-[#0D0D0B] p-6 sm:p-8 space-y-3">
            <span className="text-xs font-semibold text-[#0D0D0B] block">
              Najważniejsze informacje
            </span>
            <ul className="space-y-2">
              {post.keyTakeaways.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-[#3B3C40] leading-relaxed">
                  <span className="text-[#C8794B] font-semibold tabular-nums">{idx + 1}.</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Paragraphs Content */}
        <div className="space-y-6 text-base text-[#3B3C40] leading-relaxed">
          {post.content.map((paragraph, idx) => (
            <p key={idx} className="leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Recommended Durag Promo Box */}
        <div className="bg-[#0D0D0B] text-white p-6 sm:p-8 border border-[#26262A] space-y-4">
          <span className="text-xs text-[#C8794B] font-medium block">
            Polecane produkty
          </span>
          <h3 className="font-serif text-xl sm:text-2xl font-medium">
            Duragi szyte w Warszawie
          </h3>
          <p className="text-sm text-gray-300 leading-relaxed max-w-lg">
            Szyte ręcznie w Warszawie z naturalnego jedwabiu morwowego, satyny i weluru. Bezodciskowy szew zewnętrzny i długie pasy.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              href={post.recommendedCategory ? `/kolekcja/${post.recommendedCategory}` : '/kolekcja/silk'}
              className="inline-block bg-[#C8794B] text-[#0B0B0C] hover:bg-white px-6 py-3 text-xs font-semibold transition-colors"
            >
              Zobacz produkty
            </Link>
            <Link
              href="/o-nas"
              className="inline-block bg-transparent border border-white/20 text-white hover:bg-white/10 px-6 py-3 text-xs transition-colors"
            >
              O nas
            </Link>
          </div>
        </div>

        {/* Other Recommended Posts */}
        <div className="pt-10 border-t border-[#0D0D0B] space-y-6">
          <span className="text-sm font-semibold text-[#0D0D0B] block">
            Pozostałe artykuły
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {otherPosts.map((op) => (
              <Link
                key={op.slug}
                href={`/blog/${op.slug}`}
                className="p-4 bg-white border border-[#E5E2DC] hover:border-[#0D0D0B] transition-colors block group space-y-2"
              >
                <span className="text-xs text-[#C8794B] font-medium block">
                  {op.category}
                </span>
                <h4 className="font-serif text-base font-medium text-[#0D0D0B] group-hover:text-[#C8794B] transition-colors">
                  {op.title}
                </h4>
                <span className="text-xs text-gray-500 block pt-1">
                  Czytaj artykuł →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </article>

      <TrustBanner />
    </div>
  );
}
