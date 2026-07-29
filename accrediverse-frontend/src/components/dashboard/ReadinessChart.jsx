import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

export default function ReadinessChart({ criteriaData }) {
  const fullCriteria = [
    { key: 'criterion1', name: 'Criterion 1', label: 'Curricular Aspects', score: 0 },
    { key: 'criterion2', name: 'Criterion 2', label: 'Teaching & Learning', score: 0 },
    { key: 'criterion3', name: 'Criterion 3', label: 'Research & Extension', score: 0 },
    { key: 'criterion4', name: 'Criterion 4', label: 'Student Performance', score: 0 },
    { key: 'criterion5', name: 'Criterion 5', label: 'Infrastructure', score: 45 },
    { key: 'criterion6', name: 'Criterion 6', label: 'Governance', score: 62 },
    { key: 'criterion7', name: 'Criterion 7', label: 'Institutional Values', score: 78 },
  ];

  const chartData = fullCriteria.map(item => {
    if (criteriaData && criteriaData[item.key] !== undefined) {
      return {
        ...item,
        score: criteriaData[item.key]
      };
    }
    return item;
  });

  const getBarColor = (score) => {
    if (score >= 80) return '#16A34A'; // success
    if (score >= 60) return '#2563EB'; // primary
    if (score >= 40) return '#F59E0B'; // warning
    return '#DC2626'; // danger
  };

  return (
    <div className="w-full bg-card-light dark:bg-card-dark p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-soft">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">Criterion Readiness Analysis</h3>
          <p className="text-xs text-slate-400 dark:text-slate-500">Readiness percentage breakdown per NAAC criterion</p>
        </div>
        
        {/* Legends */}
        <div className="flex items-center gap-3 md:gap-4 mt-3 sm:mt-0 flex-wrap text-[10px] md:text-xs font-medium">
          <div className="flex items-center gap-1.5 text-slate-500">
            <span className="w-2.5 h-2.5 rounded-full bg-success" />
            <span>Excellent (≥80%)</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500">
            <span className="w-2.5 h-2.5 rounded-full bg-primary" />
            <span>On Track (60-79%)</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500">
            <span className="w-2.5 h-2.5 rounded-full bg-warning" />
            <span>Warning (40-59%)</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500">
            <span className="w-2.5 h-2.5 rounded-full bg-danger" />
            <span>Critical (&lt;40%)</span>
          </div>
        </div>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="dark:stroke-slate-800" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#94A3B8', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              domain={[0, 100]} 
              tick={{ fill: '#94A3B8', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: 'rgba(148, 163, 184, 0.05)' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="p-3 bg-slate-900 text-white rounded-xl shadow-xl border border-slate-800 text-xs">
                      <p className="font-semibold">{data.name}: {data.label}</p>
                      <p className="mt-1 flex items-center gap-1.5">
                        Readiness Score: 
                        <span className="font-bold" style={{ color: getBarColor(data.score) }}>
                          {data.score}%
                        </span>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="score" radius={[8, 8, 0, 0]} maxBarSize={45}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.score)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
