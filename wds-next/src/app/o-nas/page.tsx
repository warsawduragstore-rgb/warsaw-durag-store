import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import TrustBanner from '@/components/TrustBanner';
import { MapPin, Mail, ArrowRight } from 'lucide-react';
import { SITE_URL } from '@/lib/siteConfig';

export const metadata: Metadata = {
  title: 'O nas — Historia Warsaw Durag Store | Warszawa',
  description:
    'Poznaj historię założycieli Warsaw Durag Store — braci bliźniaków z Warszawy. Duragi szyte ręcznie w Warszawie z naturalnego jedwabiu, satyny i weluru.',
  alternates: {
    canonical: `${SITE_URL}/o-nas`,
  },
  openGraph: {
    title: 'O nas — Historia Warsaw Durag Store',
    description:
      'Poznaj historię braci bliźniaków, którzy stworzyli Warsaw Durag Store.',
    url: `${SITE_URL}/o-nas`,
    images: [`${SITE_URL}/media/wds/wyszol1126.jpg`],
  },
};

import AboutUsClient from '@/components/AboutUsClient';

export default function AboutUsPage() {
  return <AboutUsClient />;
}
