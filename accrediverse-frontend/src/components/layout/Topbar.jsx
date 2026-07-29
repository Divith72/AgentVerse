import React from 'react';
import { Menu, Search, Bell, User } from 'lucide-react';
import ThemeToggle from '../common/ThemeToggle';

export default function Topbar({ title, setIsMobileOpen }) {
  return (
    <header className="sticky top-0 z-35 flex items-center justify-between h-16 px-4 md:px-6 bg-card-light/80 dark:bg-card-dark/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50">
      <div className="flex items-center gap-3">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-slate-50 md:hidden hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        {/* Title */}
        <h1 className="text-lg md:text-xl font-bold text-slate-900 dark:text-slate-50 transition-colors">
          {title}
        </h1>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Search Input - UI only */}
        <div className="relative hidden sm:block w-48 md:w-64">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search criteria or logs..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-100 dark:bg-slate-800 border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary text-slate-900 dark:text-slate-100 placeholder-slate-400"
          />
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <button className="relative p-2 rounded-xl text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-slate-50 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 transition-colors focus:outline-none">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full" />
        </button>

        {/* User Profile Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200/50 dark:border-slate-800/50">
          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
            <User className="w-5 h-5" />
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-semibold text-slate-900 dark:text-slate-50">Admin Faculty</p>
            <p className="text-[10px] text-slate-500">NAAC Coordinator</p>
          </div>
        </div>
      </div>
    </header>
  );
}
