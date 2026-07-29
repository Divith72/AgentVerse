import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import StatCard from '../components/dashboard/StatCard';
import ReadinessChart from '../components/dashboard/ReadinessChart';
import AgentFlow from '../components/dashboard/AgentFlow';
import RecentDocuments from '../components/dashboard/RecentDocuments';
import Loader from '../components/common/Loader';
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  Percent, 
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [documents, setDocuments] = useState([]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [dbResponse, docResponse] = await Promise.all([
        api.get('/dashboard'),
        api.get('/dashboard/documents')
      ]);

      setData(dbResponse.data);
      setDocuments(docResponse.data);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
      toast.error('Error fetching dashboard records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Loader type="cards" count={4} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-card-light dark:bg-card-dark rounded-2xl animate-pulse" />
          <div className="h-96 bg-card-light dark:bg-card-dark rounded-2xl animate-pulse" />
        </div>
        <div className="h-44 bg-card-light dark:bg-card-dark rounded-2xl animate-pulse" />
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
          onClick={fetchDashboardData}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark font-semibold text-sm shadow-lg shadow-primary/20 hover-scale focus:outline-none"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry Loading</span>
        </button>
      </div>
    );
  }

  const { overall_readiness, criteria_readiness, document_metrics } = data;
  const totalDocs = documents.length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Documents"
          value={totalDocs}
          icon={FileText}
          colorClass="bg-blue-500/10 text-blue-500"
          subtitle="Total uploaded evidence logs"
        />
        <StatCard
          title="Validated Documents"
          value={document_metrics?.validated || 0}
          icon={CheckCircle}
          colorClass="bg-success/10 text-success"
          subtitle="Successfully matching benchmarks"
        />
        <StatCard
          title="Pending Verification"
          value={document_metrics?.pending || 0}
          icon={Clock}
          colorClass="bg-warning/10 text-warning"
          subtitle="Queued in active agent pipelines"
        />
        <StatCard
          title="Overall Readiness"
          value={`${overall_readiness}%`}
          icon={Percent}
          colorClass="bg-purple-500/10 text-purple-500"
          subtitle="Weighted score across criteria"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ReadinessChart criteriaData={criteria_readiness} />
        </div>
        <div>
          <RecentDocuments documents={documents} />
        </div>
      </div>

      <AgentFlow />
    </div>
  );
}
