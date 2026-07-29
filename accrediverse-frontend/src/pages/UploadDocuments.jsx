import React from 'react';
import UploadBox from '../components/documents/UploadBox';
import { Info, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function UploadDocuments() {
  const navigate = useNavigate();

  const handleUploadSuccess = () => {
    setTimeout(() => {
      navigate('/documents');
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex gap-3 p-4 bg-primary/10 text-primary border border-primary/20 rounded-2xl text-xs md:text-sm">
          <Info className="w-5 h-5 flex-shrink-0" />
          <div>
            <span className="font-bold text-slate-900 dark:text-slate-105">Compliance Mapping Tip:</span>
            <p className="mt-1 text-slate-650 dark:text-slate-350 leading-relaxed">
              Naming files clearly (e.g., <i>academic_calendar_2026.pdf</i>) allows the Classification Agent to automatically match documents to standard NAAC metrics.
            </p>
          </div>
        </div>

        <div className="flex gap-3 p-4 bg-warning/10 text-warning border border-warning/20 rounded-2xl text-xs md:text-sm">
          <ShieldAlert className="w-5 h-5 flex-shrink-0" />
          <div>
            <span className="font-bold text-slate-900 dark:text-slate-105">Real-time Validation:</span>
            <p className="mt-1 text-slate-650 dark:text-slate-350 leading-relaxed">
              Once submitted, the Validation Agent will scan formatting, timestamps, and signature blocks. Verification status updates in real-time.
            </p>
          </div>
        </div>
      </div>

      <UploadBox onUploadSuccess={handleUploadSuccess} />
    </div>
  );
}
