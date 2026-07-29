import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Upload, 
  FileText, 
  BarChart3, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export default function Sidebar({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) {
  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Upload Documents', path: '/upload', icon: Upload },
    { name: 'All Documents', path: '/documents', icon: FileText },
    { name: 'Readiness Analytics', path: '/readiness', icon: BarChart3 },
    { name: 'AI Recommendations', path: '/recommendations', icon: Sparkles },
  ];

  const sidebarClasses = `
    fixed md:sticky top-0 left-0 h-screen z-40
    bg-card-light dark:bg-card-dark 
    border-r border-slate-200/50 dark:border-slate-800/50
    transition-all duration-300 ease-in-out
    ${isCollapsed ? 'w-20' : 'w-64'}
    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
  `;

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside className={sidebarClasses}>
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200/50 dark:border-slate-800/50">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="p-2 rounded-xl bg-primary/10 text-primary flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            {!isCollapsed && (
              <span className="font-bold text-lg whitespace-nowrap bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                AccrediVerse AI
              </span>
            )}
          </div>
          
          {/* Collapse Button - Desktop only */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-950 dark:hover:text-slate-550"
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all duration-200 group relative
                  ${isActive 
                    ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-950 dark:hover:text-slate-50'
                  }
                `}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span className="font-medium text-sm whitespace-nowrap">{item.name}</span>}
                
                {/* Tooltip for collapsed mode */}
                {isCollapsed && (
                  <div className="absolute left-20 ml-2 px-2.5 py-1.5 bg-slate-900 text-white text-xs rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                    {item.name}
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
