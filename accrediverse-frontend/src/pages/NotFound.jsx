import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
      <div className="p-4 bg-danger/10 text-danger rounded-full">
        <AlertCircle className="w-12 h-12" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Page Not Found</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
        The compliance page or resource you are looking for does not exist or has been relocated.
      </p>
      <Link
        to="/"
        className="px-6 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all duration-200 shadow-lg shadow-primary/20 hover-scale focus:outline-none"
      >
        Return to Dashboard
      </Link>
    </div>
  );
}
