import React, { useState } from 'react';
import StatusBadge from './StatusBadge';
import { 
  Search, 
  Filter, 
  Trash2, 
  Eye, 
  RefreshCw, 
  ChevronLeft, 
  ChevronRight, 
  FileText,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

export default function DocumentTable({ documents, onRefresh, onLocalDelete }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [criterionFilter, setCriterionFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [selectedDoc, setSelectedDoc] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const filtered = documents.filter((doc) => {
    const matchesSearch = doc.file_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          doc.document_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    const matchesCriterion = criterionFilter === 'all' || doc.criterion_id === criterionFilter;

    return matchesSearch && matchesStatus && matchesCriterion;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filtered.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleUpdateStatus = async (docId, newStatus) => {
    try {
      setUpdatingId(docId);
      await api.patch(`/dashboard/documents/${docId}`, { status: newStatus });
      toast.success(`Document status updated to ${newStatus}`);
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error(err.message || 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = (doc) => {
    toast.success(`"${doc.file_name}" deleted from active view`);
    if (onLocalDelete) {
      onLocalDelete(doc.id);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row gap-4 justify-between bg-card-light dark:bg-card-dark p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-soft">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search by file name or type..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-0 rounded-2xl text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary placeholder-slate-400"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={criterionFilter}
              onChange={(e) => {
                setCriterionFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 bg-slate-100 dark:bg-slate-800 border-0 rounded-2xl text-slate-800 dark:text-slate-205 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Criteria</option>
              <option value="criterion1">Criterion 1</option>
              <option value="criterion2">Criterion 2</option>
              <option value="criterion3">Criterion 3</option>
              <option value="criterion4">Criterion 4</option>
              <option value="criterion5">Criterion 5</option>
              <option value="criterion6">Criterion 6</option>
              <option value="criterion7">Criterion 7</option>
            </select>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 bg-slate-100 dark:bg-slate-800 border-0 rounded-2xl text-slate-800 dark:text-slate-205 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Statuses</option>
            <option value="validated">Validated</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="bg-card-light dark:bg-card-dark rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200/50 dark:border-slate-800/50">
                <th className="py-3.5 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">File Name</th>
                <th className="py-3.5 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Criterion</th>
                <th className="py-3.5 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Document Type</th>
                <th className="py-3.5 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="py-3.5 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Uploaded Date</th>
                <th className="py-3.5 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400 dark:text-slate-500">
                    <FileText className="w-10 h-10 mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-semibold">No matching compliance documents found</p>
                  </td>
                </tr>
              ) : (
                paginatedItems.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="py-4 px-6 text-sm font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
                      {doc.file_name}
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-550 dark:text-slate-400 capitalize">
                      {doc.criterion_id?.replace('criterion', 'Criterion ')}
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-550 dark:text-slate-400 truncate max-w-[200px]">
                      {doc.document_type}
                    </td>
                    <td className="py-4 px-6">
                      <StatusBadge status={doc.status} />
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-400 dark:text-slate-500">
                      {`2026-07-${String((doc.id % 28) + 1).padStart(2, '0')}`}
                    </td>
                    <td className="py-4 px-6 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedDoc(doc)}
                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors focus:outline-none"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleUpdateStatus(doc.id, doc.status === 'validated' ? 'rejected' : 'validated')}
                        disabled={updatingId === doc.id}
                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-primary transition-colors focus:outline-none"
                        title="Re-verify Status"
                      >
                        <RefreshCw className={`w-4 h-4 ${updatingId === doc.id ? 'animate-spin' : ''}`} />
                      </button>

                      <button
                        onClick={() => handleDelete(doc)}
                        className="p-1.5 rounded-lg bg-danger/10 text-danger hover:bg-danger hover:text-white transition-colors focus:outline-none"
                        title="Delete Document"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-800/20 text-xs text-slate-400">
            <div>
              Showing <span className="font-semibold">{startIndex + 1}</span> to{' '}
              <span className="font-semibold">{Math.min(startIndex + itemsPerPage, filtered.length)}</span> of{' '}
              <span className="font-semibold">{filtered.length}</span> compliance items
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent transition-colors focus:outline-none"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`w-7 h-7 font-bold rounded-lg transition-all focus:outline-none
                    ${currentPage === i + 1
                      ? 'bg-primary text-white'
                      : 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }
                  `}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent transition-colors focus:outline-none"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-card-light dark:bg-card-dark w-full max-w-lg p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/50 pb-3">
              <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-slate-50 truncate max-w-[280px]">
                {selectedDoc.file_name}
              </h3>
              <StatusBadge status={selectedDoc.status} />
            </div>
            
            <div className="space-y-3 text-xs md:text-sm">
              <div className="grid grid-cols-3">
                <span className="text-slate-400 font-medium">Document ID</span>
                <span className="col-span-2 text-slate-800 dark:text-slate-100 font-semibold">#{selectedDoc.id}</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-slate-400 font-medium">Criterion</span>
                <span className="col-span-2 text-slate-800 dark:text-slate-100 capitalize">
                  {selectedDoc.criterion_id?.replace('criterion', 'Criterion ')}
                </span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-slate-400 font-medium">Doc Type</span>
                <span className="col-span-2 text-slate-800 dark:text-slate-100 font-semibold">{selectedDoc.document_type}</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-slate-400 font-medium">Validation Status</span>
                <div className="col-span-2 flex items-center gap-2">
                  {selectedDoc.status === 'validated' && <CheckCircle className="w-4 h-4 text-success" />}
                  {selectedDoc.status === 'pending' && <Clock className="w-4 h-4 text-warning" />}
                  {selectedDoc.status === 'rejected' && <XCircle className="w-4 h-4 text-danger" />}
                  <span className="capitalize font-bold">{selectedDoc.status}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200/50 dark:border-slate-800/50">
              <button
                onClick={() => setSelectedDoc(null)}
                className="px-4 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-805 dark:text-slate-200 rounded-xl transition-colors focus:outline-none"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
