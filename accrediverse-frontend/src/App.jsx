import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import UploadDocuments from './pages/UploadDocuments';
import Documents from './pages/Documents';
import Readiness from './pages/Readiness';
import Recommendations from './pages/Recommendations';
import NotFound from './pages/NotFound';

function App() {
  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: '1rem',
            background: '#1E293B',
            color: '#fff',
            fontSize: '14px',
          },
          success: {
            iconTheme: {
              primary: '#16A34A',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#DC2626',
              secondary: '#fff',
            },
          },
        }}
      />
      <BrowserRouter>
        <Routes>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/upload" element={<UploadDocuments />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/readiness" element={<Readiness />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
