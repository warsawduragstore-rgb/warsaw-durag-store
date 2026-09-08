import React from 'react';

export default function CategoryLoading() {
  return (
    <div className="min-h-screen">
      {/* Category Header Skeleton */}
      <div className="bg-[#0D0D0B] py-16 animate-pulse">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-4">
          <div className="w-32 h-4 bg-white/10 rounded-full mx-auto" />
          <div className="w-64 h-8 bg-white/20 rounded-lg mx-auto" />
          <div className="w-96 h-4 bg-white/10 rounded mx-auto" />
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white border border-[#E5E2DC] rounded-xl overflow-hidden animate-pulse">
              <div className="aspect-[3/4] bg-[#F7F5F2]" />
              <div className="p-4 space-y-3">
                <div className="w-16 h-3 bg-gray-200 rounded" />
                <div className="w-full h-4 bg-gray-200 rounded" />
                <div className="w-24 h-4 bg-gray-300 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
