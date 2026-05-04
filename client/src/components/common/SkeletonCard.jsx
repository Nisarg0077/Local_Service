import React from 'react';

export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-card animate-pulse">
      <div className="h-48 bg-slate-200 dark:bg-slate-700" />
      <div className="p-5 space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-16 h-5 bg-slate-200 dark:bg-slate-700 rounded-full" />
          <div className="w-10 h-5 bg-slate-200 dark:bg-slate-700 rounded-full" />
        </div>
        <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded-lg w-3/4" />
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-lg w-full" />
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-lg w-2/3" />
        <div className="flex justify-between items-center pt-2">
          <div className="w-20 h-6 bg-slate-200 dark:bg-slate-700 rounded" />
          <div className="w-24 h-9 bg-slate-200 dark:bg-slate-700 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonList({ rows = 4 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-14 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse" />
      ))}
    </div>
  );
}

export function SkeletonText({ lines = 3 }) {
  return (
    <div className="space-y-2 animate-pulse">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-slate-200 dark:bg-slate-700 rounded"
          style={{ width: i === lines - 1 ? '60%' : '100%' }}
        />
      ))}
    </div>
  );
}
