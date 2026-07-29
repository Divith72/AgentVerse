import React from 'react';

export default function StatusBadge({ status }) {
  const normalized = status?.toLowerCase().trim();

  let badgeClass = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
  let label = status || 'Unknown';

  if (normalized === 'validated') {
    badgeClass = 'bg-success/15 text-success dark:bg-success/10 dark:text-success-light';
    label = 'Validated';
  } else if (normalized === 'pending') {
    badgeClass = 'bg-warning/15 text-warning dark:bg-warning/10 dark:text-warning-light';
    label = 'Pending';
  } else if (normalized === 'rejected') {
    badgeClass = 'bg-danger/15 text-danger dark:bg-danger/10 dark:text-danger-light';
    label = 'Rejected';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] md:text-xs font-semibold uppercase tracking-wider ${badgeClass}`}>
      {label}
    </span>
  );
}
