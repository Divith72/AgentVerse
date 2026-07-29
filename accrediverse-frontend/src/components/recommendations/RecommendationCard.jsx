import React from 'react';
import { Sparkles, ArrowRight, AlertCircle, FilePlus, RefreshCw, FileWarning } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function RecommendationCard({ recommendation }) {
  const navigate = useNavigate();

  const getMetadata = (text) => {
    const txt = text.toLowerCase();
    
    if (txt.includes('missing') || txt.includes('provide') || (txt.includes('upload') && txt.includes('criterion 2'))) {
      return {
        priority: 'High',
        badgeColor: 'bg-danger/10 text-danger border-danger/20',
        icon: FileWarning,
        actionLabel: 'Upload Document',
        actionPath: '/upload'
      };
    }
    
    if (txt.includes('rejected') || txt.includes('re-verify')) {
      return {
        priority: 'High',
        badgeColor: 'bg-danger/10 text-danger border-danger/20',
        icon: AlertCircle,
        actionLabel: 'Re-upload Evidence',
        actionPath: '/upload'
      };
    }

    if (txt.includes('pending') || txt.includes('verify')) {
      return {
        priority: 'Medium',
        badgeColor: 'bg-warning/10 text-warning border-warning/20',
        icon: RefreshCw,
        actionLabel: 'Review Documents',
        actionPath: '/documents'
      };
    }

    return {
      priority: 'Low',
      badgeColor: 'bg-primary/10 text-primary border-primary/20',
      icon: Sparkles,
      actionLabel: 'Upload Evidence',
      actionPath: '/upload'
    };
  };

  const { priority, badgeColor, icon: Icon, actionLabel, actionPath } = getMetadata(recommendation);

  return (
    <div className="bg-card-light dark:bg-card-dark p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-soft hover:shadow-soft-lg hover-scale flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <Icon className="w-5 h-5" />
          </div>
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${badgeColor}`}>
            {priority} Priority
          </span>
        </div>

        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-50 leading-snug">
            {recommendation}
          </h4>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            AI compliance benchmark recommendation to ensure readiness criteria align with NAAC expectations.
          </p>
        </div>
      </div>

      <button
        onClick={() => navigate(actionPath)}
        className="mt-5 w-full py-2 bg-slate-100 hover:bg-primary hover:text-white dark:bg-slate-800 dark:hover:bg-primary dark:hover:text-white text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all duration-200 focus:outline-none"
      >
        <span>{actionLabel}</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
