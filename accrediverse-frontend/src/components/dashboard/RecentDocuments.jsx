import React from 'react';
import StatusBadge from '../documents/StatusBadge';
import { FileText, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RecentDocuments({ documents }) {
  const recent = documents ? [...documents].slice().reverse().slice(0, 5) : [];

  return (
    <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-soft h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">Recent Uploads</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500">Log of the latest uploaded verification files</p>
          </div>
          <Link
            to="/documents"
            className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-dark transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-slate-400 dark:text-slate-500">
            <FileText className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-xs">No documents uploaded yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/50 dark:border-slate-800/50">
                  <th className="py-2.5 text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">File Name</th>
                  <th className="py-2.5 text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider hidden sm:table-cell">Criterion</th>
                  <th className="py-2.5 text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider hidden md:table-cell">Doc Type</th>
                  <th className="py-2.5 text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {recent.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/25 transition-colors">
                    <td className="py-3 text-xs md:text-sm font-semibold text-slate-800 dark:text-slate-200 max-w-[140px] truncate">
                      {doc.file_name}
                    </td>
                    <td className="py-3 text-xs text-slate-500 dark:text-slate-400 capitalize hidden sm:table-cell">
                      {doc.criterion_id?.replace('criterion', 'Criterion ')}
                    </td>
                    <td className="py-3 text-xs text-slate-500 dark:text-slate-400 hidden md:table-cell max-w-[150px] truncate">
                      {doc.document_type}
                    </td>
                    <td className="py-3 text-right">
                      <StatusBadge status={doc.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
