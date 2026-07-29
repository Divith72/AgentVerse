import React from 'react';
import { Sun, Moon } from 'lucide-react';
import useTheme from '../../hooks/useTheme';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-xl text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-slate-50 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-warning" />
      ) : (
        <Moon className="w-5 h-5 text-primary" />
      )}
    </button>
  );
}
