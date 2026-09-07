'use client';

import React, { useState } from 'react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
  };

  if (subscribed) {
    return (
      <div className="bg-[#734C1D]/20 border border-[#D9A87E]/30 text-[#D9A87E] text-xs p-4 rounded-sm">
        Dziękujemy za zapisanie się do Klubu WDS! Sprawdź skrzynkę e-mail, aby odebrać swój kod rabatowy 10%.
      </div>
    );
  }

  return (
    <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Twój adres e-mail"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-grow px-5 py-3.5 text-xs bg-white/10 border border-white/20 text-white placeholder:text-gray-400 outline-none focus:border-[#D9A87E]"
      />
      <button
        type="submit"
        className="bg-[#734C1D] text-white hover:bg-white hover:text-[#0D0D0B] px-8 py-3.5 text-xs uppercase tracking-widest font-semibold transition-colors"
      >
        Dołącz
      </button>
    </form>
  );
}
