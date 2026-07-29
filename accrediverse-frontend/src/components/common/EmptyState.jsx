import React from 'react';
import { FileQuestion } from 'lucide-react';

export default function EmptyState({ 
  icon: Icon = FileQuestion, 
  title = 'No documents found', 
  description = 'Start by uploading evidence files to monitor readiness.',
  actionLabel,
  onAction
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-card-light dark:bg-card-dark rounded-2xl border border-dashed border-slate-200/50 dark:border-slate-800/50 max-w-md mx-auto my-6">
      <div className="p-4 bg-primary/10 text-primary rounded-full mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{description}</p>
      
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 text-sm font-medium bg-primary text-white hover:bg-primary/90 rounded-xl hover-scale shadow-lg shadow-primary/20 focus:outline-none"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
