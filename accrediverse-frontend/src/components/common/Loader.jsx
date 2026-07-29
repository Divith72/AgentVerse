import React from 'react';

export default function Loader({ type = 'spinner', count = 3 }) {
  if (type === 'skeleton') {
    return (
      <div className="space-y-4 w-full animate-pulse">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="h-16 bg-slate-200 dark:bg-slate-700/50 rounded-2xl w-full" />
        ))}
      </div>
    );
  }

  if (type === 'cards') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 animate-pulse">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="h-32 bg-slate-200 dark:bg-slate-700/50 rounded-2xl w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 w-full">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-slate-200 dark:border-slate-850" />
        <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
      <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">Loading data...</p>
    </div>
  );
}
