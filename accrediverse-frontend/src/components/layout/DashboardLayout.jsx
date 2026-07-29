import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function DashboardLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = (path) => {
    switch (path) {
      case '/':
        return 'NAAC Readiness Dashboard';
      case '/upload':
        return 'Upload Evidence Documents';
      case '/documents':
        return 'All Evidence Documents';
      case '/readiness':
        return 'Readiness Analytics';
      case '/recommendations':
        return 'AI Compliance Recommendations';
      default:
        return 'AccrediVerse AI';
    }
  };

  return (
    <div className="flex min-h-screen bg-bg-light dark:bg-bg-dark transition-colors duration-200">
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          title={getPageTitle(location.pathname)}
          setIsMobileOpen={setIsMobileOpen}
        />
        
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
