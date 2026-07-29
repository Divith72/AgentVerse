import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import RecommendationCard from '../components/recommendations/RecommendationCard';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import { AlertCircle, RefreshCw, Sparkles, Database, FileX, ShieldAlert, CheckSquare } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Recommendations() {
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);
  const [error, setError] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/dashboard');
      setRecommendations(response.data.recommendations || []);
    } catch (err) {
      setError(err.message || 'Failed to load recommendations');
      toast.error('Error fetching recommendations');
    } finally {
      setLoading(false);
    }
  };

  const handleResetDatabase = async () => {
    if (!window.confirm('Are you sure you want to reset the database? This will clear all modifications and re-seed the default logs.')) {
      return;
    }
    
    try {
      setResetting(true);
      await api.post('/dashboard/reset');
      toast.success('Database successfully reset and re-seeded!');
      await fetchRecommendations();
    } catch (err) {
      toast.error(err.message || 'Failed to reset database');
    } finally {
      setResetting(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  if (loading) {
    return <Loader type="cards" count={6} />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="w-12 h-12 text-danger mb-4" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 mb-2">Something went wrong</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-md">{error}</p>
        <button
          onClick={fetchRecommendations}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark font-semibold text-sm shadow-lg shadow-primary/20 hover-scale focus:outline-none"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry Loading</span>
        </button>
      </div>
    );
  }

  const missingDocs = [];
  const pendingDocs = [];
  const rejectedDocs = [];
  const readinessImps = [];

  recommendations.forEach((rec) => {
    const txt = rec.toLowerCase();
    if (txt.includes('missing') || txt.includes('provide') || (txt.includes('upload') && txt.includes('criterion 2'))) {
      missingDocs.push(rec);
    } else if (txt.includes('rejected') || txt.includes('re-verify')) {
      rejectedDocs.push(rec);
    } else if (txt.includes('pending') || txt.includes('verify')) {
      pendingDocs.push(rec);
    } else {
      readinessImps.push(rec);
    }
  });

  const totalRecs = recommendations.length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/50 dark:border-slate-800/50 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">AI Audit Recommendations</h2>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Total {totalRecs} active compliance gaps flagged by Recommendation Agent
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleResetDatabase}
            disabled={resetting}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-danger/10 text-danger hover:bg-danger hover:text-white rounded-xl transition-all duration-200 disabled:opacity-50 focus:outline-none"
          >
            <Database className={`w-4 h-4 ${resetting ? 'animate-spin' : ''}`} />
            <span>Reset Database</span>
          </button>

          <button
            onClick={fetchRecommendations}
            className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-655 dark:text-slate-350 rounded-xl transition-colors focus:outline-none"
            title="Refresh Recommendations"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {totalRecs === 0 ? (
        <EmptyState 
          icon={Sparkles}
          title="Excellent Compliance Score!"
          description="The Recommendation Agent has not flagged any compliance issues or missing evidence documents."
        />
      ) : (
        <div className="space-y-8">
          {missingDocs.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-danger">
                <FileX className="w-5 h-5" />
                <h3 className="text-sm font-bold uppercase tracking-wider">Missing Documents ({missingDocs.length})</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {missingDocs.map((rec, i) => (
                  <RecommendationCard key={`missing-${i}`} recommendation={rec} />
                ))}
              </div>
            </div>
          )}

          {rejectedDocs.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-danger border-t border-slate-200/40 dark:border-slate-800/40 pt-6">
                <ShieldAlert className="w-5 h-5" />
                <h3 className="text-sm font-bold uppercase tracking-wider">Rejected Documents ({rejectedDocs.length})</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rejectedDocs.map((rec, i) => (
                  <RecommendationCard key={`rejected-${i}`} recommendation={rec} />
                ))}
              </div>
            </div>
          )}

          {pendingDocs.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-warning border-t border-slate-200/40 dark:border-slate-800/40 pt-6">
                <RefreshCw className="w-5 h-5" />
                <h3 className="text-sm font-bold uppercase tracking-wider">Pending Validation ({pendingDocs.length})</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingDocs.map((rec, i) => (
                  <RecommendationCard key={`pending-${i}`} recommendation={rec} />
                ))}
              </div>
            </div>
          )}

          {readinessImps.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary border-t border-slate-200/40 dark:border-slate-800/40 pt-6">
                <CheckSquare className="w-5 h-5" />
                <h3 className="text-sm font-bold uppercase tracking-wider">Readiness Improvements ({readinessImps.length})</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {readinessImps.map((rec, i) => (
                  <RecommendationCard key={`imp-${i}`} recommendation={rec} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
