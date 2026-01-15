
import React from 'react';
import { LucideIcon, ShieldCheck } from 'lucide-react';

interface PageHeaderProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  badgeText: string;
  actions?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ icon: Icon, title, subtitle, badgeText, actions }) => {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white border border-slate-200 p-8 rounded-4xl shadow-sm relative overflow-hidden group">
      {/* Background Icon Decoration */}
      <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity duration-700">
         <Icon size={160} strokeWidth={1} />
      </div>
      
      <div className="flex items-center gap-6 relative z-10">
        <div className="w-16 h-16 bg-slate-950 rounded-2xl flex items-center justify-center text-white shadow-2xl">
          <Icon size={32} strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase leading-none">{title}</h1>
          <div className="flex items-center gap-4 mt-3.5">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] flex items-center gap-2">
              <ShieldCheck size={14} className="text-emerald-500" /> {badgeText}
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic font-mono">{subtitle}</p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3 relative z-10 w-full lg:w-auto">
        {actions}
      </div>
    </div>
  );
};

export default PageHeader;
