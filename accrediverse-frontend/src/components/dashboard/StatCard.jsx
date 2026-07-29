import React from 'react';

export default function StatCard({ title, value, icon: Icon, colorClass, subtitle }) {
  return (
    <div className="flex flex-col p-6 bg-card-light dark:bg-card-dark rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-soft hover:shadow-soft-lg hover-scale">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          {title}
        </span>
        <div className={`p-2.5 rounded-xl ${colorClass}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      
      <div className="mt-4">
        <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
          {value}
        </h3>
        {subtitle && (
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
