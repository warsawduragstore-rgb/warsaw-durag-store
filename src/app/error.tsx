'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Storefront Error]:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center bg-[#F7F5F2] border border-[#E5E2DC] rounded-2xl p-8 shadow-lg">
        <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-200">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="font-serif text-2xl text-[#0D0D0B] font-medium mb-2">
          Przepraszamy, wystąpił błąd
        </h2>
        <p className="text-xs sm:text-sm text-[#3B3C40] font-light mb-6 leading-relaxed">
          Nie udało się pobrać danych z serwera. Sprawdź swoje połączenie z internetem lub spróbuj ponownie.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 bg-[#0D0D0B] hover:bg-[#734C1D] text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-colors shadow cursor-pointer active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Spróbuj ponownie</span>
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-[#0D0D0B] border border-[#E5E2DC] px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Strona główna</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
