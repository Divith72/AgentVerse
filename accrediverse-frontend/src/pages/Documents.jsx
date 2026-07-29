import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import DocumentTable from '../components/documents/DocumentTable';
import Loader from '../components/common/Loader';
import { AlertCircle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Documents() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [documents, setDocuments] = useState([]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/dashboard/documents');
      setDocuments(response.data);
    } catch (err) {
      setError(err.message || 'Failed to load documents');
      toast.error('Error fetching document list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleLocalDelete = (docId) => {
    setDocuments((prev) => prev.filter((d) => d.id !== docId));
  };

  if (loading) {
    return <Loader type="skeleton" count={6} />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="w-12 h-12 text-danger mb-4" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 mb-2">Something went wrong</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-md">{error}</p>
        <button
          onClick={fetchDocuments}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark font-semibold text-sm shadow-lg shadow-primary/20 hover-scale focus:outline-none"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry Loading</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">Evidence Documents Database</h2>
          <p className="text-xs text-slate-400 dark:text-slate-500">List and filter all documents submitted for accreditation compliance check</p>
        </div>
        
        <button
          onClick={fetchDocuments}
          className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-650 dark:text-slate-350 rounded-xl transition-colors focus:outline-none"
          title="Refresh Table"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <DocumentTable 
        documents={documents} 
        onRefresh={fetchDocuments} 
        onLocalDelete={handleLocalDelete}
      />
    </div>
  );
}
