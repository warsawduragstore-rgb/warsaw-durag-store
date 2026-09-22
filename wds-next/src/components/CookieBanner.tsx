'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, X } from 'lucide-react';

export default function CookieBanner() {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const consent = localStorage.getItem('wds_cookie_consent');
      if (!consent) {
        // Small delay to ensure no CLS during initial frame paint
        const timer = setTimeout(() => setIsVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // Ignore localStorage access errors
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem('wds_cookie_consent', 'accepted');
      window.dispatchEvent(new CustomEvent('cookieConsentGranted'));
    } catch {}
    setIsVisible(false);
  };

  const handleDecline = () => {
    try {
      localStorage.setItem('wds_cookie_consent', 'declined');
    } catch {}
    setIsVisible(false);
  };

  if (!mounted || !isVisible) return null;

  return (
    <div
      role="region"
      aria-label="Prywatność i cookies"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 bg-[#0D0D0B] text-white border border-[#262624] p-5 rounded-2xl shadow-2xl animate-fade-in"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 bg-[#D9A87E]/10 rounded-lg text-[#D9A87E] shrink-0 mt-0.5">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div className="flex-1 space-y-2">
          <h4 className="font-serif text-sm font-semibold tracking-wide uppercase text-white">
            Prywatność & Pliki Cookies
          </h4>
          <p className="text-[11px] text-gray-400 leading-relaxed">
            Używamy niezbędnych plików cookies do działania koszyka oraz opcjonalnych narzędzi analitycznych, aby ulepszać sklep. Dowiedz się więcej w naszej{' '}
            <Link href="/polityka-prywatnosci" className="underline text-gray-300 hover:text-[#D9A87E]">
              Polityce prywatności
            </Link>.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleAccept}
              className="px-4 py-2 bg-[#D9A87E] text-black font-semibold text-[11px] uppercase tracking-wider rounded-lg hover:bg-[#e4b58e] transition-colors"
            >
              Akceptuję
            </button>
            <button
              onClick={handleDecline}
              className="px-3 py-2 text-[11px] font-mono uppercase text-gray-400 hover:text-white transition-colors"
            >
              Tylko niezbędne
            </button>
          </div>
        </div>
        <button
          onClick={handleDecline}
          className="text-gray-500 hover:text-gray-300 p-1"
          aria-label="Zamknij powiadomienie"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
