import React from 'react';

export default function ProductLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start animate-pulse">
        {/* Gallery skeleton */}
        <div className="space-y-4">
          <div className="aspect-[3/4] bg-[#F7F5F2] border border-[#E5E2DC] rounded-2xl" />
          <div className="flex gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-20 h-24 bg-[#F7F5F2] rounded-xl border border-[#E5E2DC]" />
            ))}
          </div>
        </div>

        {/* Info skeleton */}
        <div className="space-y-6">
          <div className="w-24 h-4 bg-gray-200 rounded" />
          <div className="w-3/4 h-10 bg-gray-300 rounded" />
          <div className="w-48 h-6 bg-gray-200 rounded" />
          <div className="w-32 h-8 bg-gray-300 rounded" />
          <div className="space-y-2">
            <div className="w-full h-4 bg-gray-200 rounded" />
            <div className="w-full h-4 bg-gray-200 rounded" />
            <div className="w-2/3 h-4 bg-gray-200 rounded" />
          </div>
          <div className="w-full h-14 bg-gray-300 rounded-full" />
        </div>
      </div>
    </div>
  );
}
