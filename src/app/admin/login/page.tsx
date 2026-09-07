'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setErrorMessage('Wprowadź hasło dostępowe.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Successful login -> Redirect to admin dashboard
        window.location.href = '/admin';
      } else {
        setErrorMessage(data.error || 'Nieprawidłowe hasło dostępowe.');
      }
    } catch (err) {
      setErrorMessage('Błąd połączenia z serwerem. Spróbuj ponownie.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090908] text-white flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#D9A87E]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-[#141412] border border-white/10 rounded-2xl p-8 sm:p-10 shadow-2xl relative z-10 animate-fade-in">
        
        {/* Header & Logo */}
        <div className="flex flex-col items-center text-center mb-8">
          <Link href="/" className="mb-6 inline-block transition-transform hover:scale-105">
            <Image
              src="/assets/logo_white.png"
              alt="Warsaw Durag Store"
              width={200}
              height={60}
              className="h-10 w-auto object-contain"
              priority
            />
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-semibold tracking-widest text-[#D9A87E] uppercase mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Panel Administracyjny CMS</span>
          </div>
          <h1 className="font-serif text-2xl font-medium tracking-tight text-white">
            Autoryzacja Dostępu
          </h1>
          <p className="text-xs text-gray-400 mt-1 max-w-xs">
            Dostęp zastrzeżony wyłącznie dla personelu zarządzającego sklepem Warsaw Durag Store.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-gray-300 mb-2">
              Hasło dostępowe
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Wpisz hasło administratora..."
                className="w-full px-4 py-3.5 pl-11 bg-white/5 border border-white/15 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D9A87E] focus:ring-1 focus:ring-[#D9A87E] transition-all"
                autoFocus
                disabled={isLoading}
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {errorMessage && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs animate-scale-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-xl bg-[#D9A87E] hover:bg-[#c99569] text-[#0D0D0B] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-[#D9A87E]/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <span>Weryfikacja...</span>
            ) : (
              <>
                <span>Zaloguj do CMS</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Back Link */}
        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <Link
            href="/"
            className="text-xs text-gray-400 hover:text-white transition-colors"
          >
            ← Wróć do strony głównej sklepu
          </Link>
        </div>

      </div>
    </div>
  );
}
