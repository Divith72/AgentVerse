import React, { useState, useEffect } from 'react';
import { 
  FileUp, 
  Tag, 
  GitCommit, 
  BadgeCheck, 
  TrendingUp, 
  Sparkles 
} from 'lucide-react';

export default function AgentFlow() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 6);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const steps = [
    { 
      title: 'Ingestion', 
      desc: 'Upload', 
      icon: FileUp, 
    },
    { 
      title: 'Criteria', 
      desc: 'Classification', 
      icon: Tag, 
    },
    { 
      title: 'Metric', 
      desc: 'Mapping', 
      icon: GitCommit, 
    },
    { 
      title: 'Validation', 
      desc: 'Integrity', 
      icon: BadgeCheck, 
    },
    { 
      title: 'Readiness', 
      desc: 'Scoring', 
      icon: TrendingUp, 
    },
    { 
      title: 'AI Reco', 
      desc: 'Action', 
      icon: Sparkles, 
    },
  ];

  return (
    <div className="w-full bg-card-light dark:bg-card-dark p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-soft">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">Multi-Agent Workflow Pipelines</h3>
        <p className="text-xs text-slate-400 dark:text-slate-500">Live monitoring of AI Agents collaborating on compliance checks</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-6 relative">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === activeStep;
          const isCompleted = index < activeStep;

          return (
            <div key={index} className="flex flex-col items-center text-center relative group">
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-7 left-[calc(50%+24px)] right-[calc(-50%+24px)] h-0.5 z-0">
                  <div className={`h-full w-full border-t-2 border-dashed transition-all duration-500
                    ${isCompleted ? 'border-success' : isActive ? 'border-primary animate-pulse' : 'border-slate-200 dark:border-slate-800'}
                  `} />
                </div>
              )}

              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 z-10 transition-all duration-300 relative
                ${isActive 
                  ? 'scale-110 border-primary ring-4 ring-primary/20 bg-primary/10 shadow-lg text-primary glow-active' 
                  : isCompleted 
                    ? 'border-success/60 bg-success/5 text-success' 
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-slate-400 dark:text-slate-600'
                }
              `}>
                <Icon className="w-6 h-6" />
                
                {isActive && (
                  <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-primary"></span>
                  </span>
                )}
              </div>

              <div className="mt-3">
                <p className={`text-sm font-semibold transition-colors duration-200
                  ${isActive ? 'text-primary' : isCompleted ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400 dark:text-slate-500'}
                `}>
                  {step.title}
                </p>
                <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mt-0.5">
                  {step.desc}
                </p>
              </div>

              <span className={`mt-2 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider
                ${isActive 
                  ? 'bg-primary/15 text-primary' 
                  : isCompleted 
                    ? 'bg-success/15 text-success' 
                    : 'bg-slate-100 dark:bg-slate-800/40 text-slate-400 dark:text-slate-600'
                }
              `}>
                {isActive ? 'Processing' : isCompleted ? 'Active' : 'Idle'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
