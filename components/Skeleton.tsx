
import React from 'react';

export const Shimmer = ({ isDarkMode = false }) => (
  <div className={`absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent`} />
);

export const BookCardSkeleton = () => (
  <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden flex flex-col h-full shadow-sm">
    <div className="relative aspect-[2/3] bg-slate-200 dark:bg-slate-800 overflow-hidden">
      <Shimmer />
    </div>
    <div className="p-4 flex flex-col flex-grow gap-2">
      <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-md w-3/4 relative overflow-hidden">
        <Shimmer />
      </div>
      <div className="h-4 bg-slate-100 dark:bg-slate-800/50 rounded-md w-1/2 relative overflow-hidden">
        <Shimmer />
      </div>
      <div className="mt-2 h-4 bg-slate-100 dark:bg-slate-800/50 rounded-md w-1/4 relative overflow-hidden">
        <Shimmer />
      </div>
      <div className="mt-auto grid grid-cols-2 gap-2 pt-4">
        <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded-lg relative overflow-hidden">
          <Shimmer />
        </div>
        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-lg relative overflow-hidden">
          <Shimmer />
        </div>
      </div>
    </div>
  </div>
);

export const CategorySkeleton = () => (
  <div className="p-2 space-y-1">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="h-10 bg-slate-50 dark:bg-slate-800/50 rounded-xl relative overflow-hidden mx-2">
        <div className="absolute left-3 top-2.5 w-5 h-5 bg-slate-200 dark:bg-slate-700 rounded-md" />
        <div className="absolute left-10 top-3 w-20 h-4 bg-slate-100 dark:bg-slate-700/50 rounded-md" />
        <Shimmer />
      </div>
    ))}
  </div>
);

export const AuthorFilterSkeleton = () => (
  <div className="p-4 pt-0 space-y-4">
    <div className="h-11 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-xl relative overflow-hidden">
      <div className="absolute left-3 top-3.5 w-24 h-4 bg-slate-100 dark:bg-slate-700/50 rounded-md" />
      <Shimmer />
    </div>
  </div>
);

export const GridHeaderSkeleton = () => (
  <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 mb-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div className="space-y-2">
      <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-48 relative overflow-hidden">
        <Shimmer />
      </div>
      <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded-md w-32 relative overflow-hidden">
        <Shimmer />
      </div>
    </div>
    <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded-xl w-32 relative overflow-hidden">
      <Shimmer />
    </div>
  </div>
);
