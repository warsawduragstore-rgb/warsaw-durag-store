import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import TrustBanner from '@/components/TrustBanner';
import { RotateCcw, PackageCheck, Mail, FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Zwroty i Reklamacje (14 dni) — Warsaw Durag Store',
  description: 'Zasady zwrotów i wymiany duragów. Formularz odstąpienia od umowy w 14 dni zgodnie z prawem konsumenckim.',
  alternates: {
    canonical: 'https://warsawduragstore.com/zwroty',
  },
};

import ReturnsClient from '@/components/ReturnsClient';

export default function ZwrotyPage() {
  return <ReturnsClient />;
}
