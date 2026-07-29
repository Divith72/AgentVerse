import React, { useState, useRef } from 'react';
import { Upload, File, AlertCircle, CheckCircle2 } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function UploadBox({ onUploadSuccess }) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [criterion, setCriterion] = useState('criterion1');
  const [docType, setDocType] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const fileInputRef = useRef(null);

  const criteriaOptions = [
    { value: 'criterion1', label: 'Criterion 1: Curricular Aspects' },
    { value: 'criterion2', label: 'Criterion 2: Teaching-Learning and Evaluation' },
    { value: 'criterion3', label: 'Criterion 3: Research, Innovations and Extension' },
    { value: 'criterion4', label: 'Criterion 4: Student Performance' },
    { value: 'criterion5', label: 'Criterion 5: Infrastructure and Learning Resources' },
    { value: 'criterion6', label: 'Criterion 6: Governance, Leadership and Management' },
    { value: 'criterion7', label: 'Criterion 7: Institutional Values and Best Practices' },
  ];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    const allowedExtensions = ['pdf', 'docx', 'pptx', 'jpg', 'png'];
    const extension = selectedFile.name.split('.').pop().toLowerCase();
    
    if (!allowedExtensions.includes(extension)) {
      toast.error(`Invalid file type. Allowed: PDF, DOCX, PPTX, JPG, PNG`);
      return;
    }
    setFile(selectedFile);
    const baseName = selectedFile.name.split('.').slice(0, -1).join(' ');
    setDocType(baseName.replace(/[_-]/g, ' '));
  };

  const onButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select an evidence file first.');
      return;
    }
    if (!docType.trim()) {
      toast.error('Please enter the document type.');
      return;
    }

    try {
      setUploading(true);
      setProgress(10);
      
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 20;
        });
      }, 150);

      const payload = {
        file_name: file.name,
        status: 'pending',
        criterion_id: criterion,
        document_type: docType
      };

      await api.post('/dashboard/documents', payload);
      
      clearInterval(interval);
      setProgress(100);
      
      setTimeout(() => {
        toast.success(`"${file.name}" uploaded successfully!`);
        setFile(null);
        setDocType('');
        setUploading(false);
        setProgress(0);
        if (onUploadSuccess) onUploadSuccess();
      }, 300);

    } catch (err) {
      setUploading(false);
      setProgress(0);
      toast.error(err.message || 'File upload failed');
    }
  };

  const fileExtensions = ['PDF', 'DOCX', 'PPTX', 'JPG', 'PNG'];

  return (
    <div className="bg-card-light dark:bg-card-dark p-6 md:p-8 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-soft max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={onButtonClick}
          className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 relative group
            ${dragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-slate-300 hover:border-primary/60 dark:border-slate-700 dark:hover:border-primary/50'
            }
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleChange}
            accept=".pdf,.docx,.pptx,.jpg,.png"
          />

          <div className="p-4 bg-slate-100 dark:bg-slate-800/50 rounded-full text-slate-500 group-hover:text-primary transition-colors mb-4">
            <Upload className="w-8 h-8" />
          </div>

          {file ? (
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 max-w-xs truncate mx-auto">
                {file.name}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Drag and drop your file here, or <span className="text-primary font-bold">browse</span>
              </p>
              <p className="text-xs text-slate-400 mt-2">
                Supported formats: PDF, DOCX, PPTX, JPG, PNG
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-center gap-2 flex-wrap">
          {fileExtensions.map((ext) => (
            <span
              key={ext}
              className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-[10px] md:text-xs font-bold text-slate-500 rounded-xl uppercase tracking-wider"
            >
              {ext}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              Select NAAC Criterion
            </label>
            <select
              value={criterion}
              onChange={(e) => setCriterion(e.target.value)}
              className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-0 rounded-2xl text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full"
            >
              {criteriaOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              Document Type / Category
            </label>
            <input
              type="text"
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              placeholder="e.g. Faculty Training Certificates"
              className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-0 rounded-2xl text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full"
            />
          </div>
        </div>

        {uploading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>Uploading compliance document...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-primary h-full transition-all duration-300 ease-out" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={uploading}
          className="w-full py-3 bg-primary hover:bg-primary-dark text-white rounded-2xl font-semibold shadow-lg shadow-primary/20 hover-scale focus:outline-none disabled:opacity-55 disabled:scale-100"
        >
          {uploading ? 'Processing Evidence...' : 'Submit to AI Agent Pipeline'}
        </button>
      </form>
    </div>
  );
}
