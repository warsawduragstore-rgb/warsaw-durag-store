import React from 'react';

export default function RootLoading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-8">
      <div className="w-12 h-12 rounded-full border-2 border-[#E5E2DC] border-t-[#D9A87E] animate-spin mb-4" />
      <span className="text-xs uppercase tracking-[0.2em] font-semibold text-gray-500 animate-pulse">
        Wczytywanie kolekcji Warsaw Durag Store...
      </span>
    </div>
  );
}
