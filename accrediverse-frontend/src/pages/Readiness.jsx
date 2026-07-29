import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import Loader from '../components/common/Loader';
import { 
  AlertTriangle, 
  TrendingUp, 
  Award,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import toast from 'react-hot-toast';

export default function Readiness() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const fetchReadiness = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/dashboard');
      setData(response.data);
    } catch (err) {
      setError(err.message || 'Failed to load readiness details');
      toast.error('Error fetching analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReadiness();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-64 bg-card-light dark:bg-card-dark rounded-2xl animate-pulse" />
          <div className="md:col-span-2 h-64 bg-card-light dark:bg-card-dark rounded-2xl animate-pulse" />
        </div>
        <div className="h-80 bg-card-light dark:bg-card-dark rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="w-12 h-12 text-danger mb-4" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 mb-2">Something went wrong</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-md">{error}</p>
        <button
          onClick={fetchReadiness}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark font-semibold text-sm shadow-lg shadow-primary/20 hover-scale focus:outline-none"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry Loading</span>
        </button>
      </div>
    );
  }

  const { overall_readiness, criteria_readiness } = data;

  const criteriaMetadata = {
    criterion1: {
      name: 'Curricular Aspects',
      description: 'Upload curriculum planning guidelines, academic calendars, and course delivery documentation.',
    },
    criterion2: {
      name: 'Teaching-Learning and Evaluation',
      description: 'Upload research publications, faculty orientations, student feedback logs, and teaching files.',
    },
    criterion3: {
      name: 'Research, Innovations & Extension',
      description: 'Upload research publications, funded project reports, patents, and consultancy records.',
    },
    criterion4: {
      name: 'Student Performance',
      description: 'Upload placement logs, student graduation charts, internal exam score sheets, and feedback.',
    },
    criterion5: {
      name: 'Infrastructure & Learning Resources',
      description: 'Upload classroom photos, library assets, ICT equipment registers, and maintenance logs.',
    },
    criterion6: {
      name: 'Governance, Leadership & Management',
      description: 'Upload IQAC files, professional development records, administrative audit reports.',
    },
    criterion7: {
      name: 'Institutional Values & Best Practices',
      description: 'Upload green campus files, energy audits, code of conduct docs, and best practices.',
    },
  };

  const lowScores = Object.entries(criteria_readiness || {})
    .map(([key, score]) => ({
      key,
      score,
      ...criteriaMetadata[key],
    }))
    .filter((c) => c.score < 60);

  const trendData = [
    { name: 'Week 1', readiness: 48 },
    { name: 'Week 2', readiness: 52 },
    { name: 'Week 3', readiness: 59 },
    { name: 'Week 4', readiness: 68 },
    { name: 'Week 5', readiness: 74 },
    { name: 'Week 6', readiness: overall_readiness },
  ];

  const radius = 80;
  const stroke = 10;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (overall_readiness / 100) * circumference;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-soft flex flex-col items-center justify-center text-center">
          <h3 className="text-sm font-semibold text-slate-500 mb-6">Overall Compliance Readiness</h3>
          
          <div className="relative flex items-center justify-center">
            <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
              <circle
                stroke="rgba(148,163,184,0.1)"
                fill="transparent"
                strokeWidth={stroke}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
              <circle
                stroke="#2563EB"
                fill="transparent"
                strokeWidth={stroke}
                strokeDasharray={circumference + ' ' + circumference}
                style={{ strokeDashoffset }}
                strokeLinecap="round"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-slate-900 dark:text-slate-50">{overall_readiness}%</span>
              <span className="text-[10px] text-slate-400 font-medium">Compliance</span>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2 px-3 py-1 bg-success/10 text-success rounded-full text-xs font-bold">
            <Award className="w-4 h-4" />
            <span>Target: 80%+ Benchmark</span>
          </div>
        </div>

        <div className="lg:col-span-2 bg-card-light dark:bg-card-dark p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-550">Compliance Trend</h3>
              <p className="text-xs text-slate-400">Weekly progression of overall readiness scores</p>
            </div>
            
            <div className="flex items-center gap-1.5 text-xs text-primary font-semibold">
              <TrendingUp className="w-4 h-4" />
              <span>+18% since launch</span>
            </div>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="dark:stroke-slate-800" />
                <XAxis dataKey="name" tick={{ fill: '#94A3B8', fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: '#94A3B8', fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="p-2 bg-slate-900 text-white rounded-lg text-xs font-semibold shadow-lg">
                          Score: {payload[0].value}%
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="readiness" 
                  stroke="#2563EB" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#2563EB', strokeWidth: 2, stroke: '#fff' }} 
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div>
        <div className="mb-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">Low Score Highlights (&lt;60%)</h3>
          <p className="text-xs text-slate-400">Criteria currently underperforming requiring additional evidence uploads</p>
        </div>

        {lowScores.length === 0 ? (
          <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 text-center py-8">
            <p className="text-sm text-slate-500 dark:text-slate-400">🎉 All criteria are performing above the 60% benchmark!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lowScores.map((c) => (
              <div 
                key={c.key} 
                className="bg-card-light dark:bg-card-dark p-5 rounded-2xl border border-warning/30 bg-warning/5 dark:bg-warning/5 shadow-soft flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-warning uppercase tracking-wider font-mono">
                      {c.key?.replace('criterion', 'Criterion ')}
                    </span>
                    <span className="text-lg font-bold text-warning">{c.score}%</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-50 mb-2">{c.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                    {c.description}
                  </p>
                </div>
                
                <div className="flex items-center gap-1.5 text-xs text-warning font-semibold border-t border-warning/20 pt-3">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>Evidence missing or rejected</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
