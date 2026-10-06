'use client';

import React from 'react';
import { Star } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface CustomerReview {
  id: string | number;
  author: string;
  source?: string;
  content: string;
}

export default function HomeCustomerReviews({ reviews }: { reviews: CustomerReview[] }) {
  const { isEn } = useLanguage();

  if (!reviews || reviews.length === 0) return null;

  return (
    <section className="py-14 sm:py-20 border-t border-[#1E1E22] bg-[#0E0E10]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-8 text-center">
          <h2 className="font-serif text-2xl sm:text-3xl text-white font-medium">
            {isEn ? 'Customer Reviews' : 'Opinie'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {reviews.slice(0, 4).map((rev) => (
            <div key={rev.id} className="bg-[#111113] p-5 border border-[#1E1E22] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 mb-3 text-[#C8794B]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#C8794B]" />
                  ))}
                </div>
                <p className="text-[14px] text-[#ECEAE7] leading-relaxed mb-4">
                  &ldquo;{rev.content}&rdquo;
                </p>
              </div>
              <div className="pt-3 border-t border-[#1E1E22] flex items-center justify-between text-[13px]">
                <span className="font-medium text-white">{rev.author}</span>
                <span className="text-[#787570]">{rev.source}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
