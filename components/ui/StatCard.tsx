
import React from 'react';
import { LucideIcon, AlertTriangle, TrendingUp, TrendingDown, Bell, Zap, Activity } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon: LucideIcon;
  variant?: 'default' | 'primary' | 'dark';
  isAlert?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, value, subtext, trend, trendValue, icon: Icon, 
  variant = 'default', isAlert = false 
}) => {
  
  if (variant === 'primary') {
      return (
        <div className={`relative overflow-hidden p-8 rounded-4xl transition-all duration-700 border group ${
          isAlert 
            ? 'bg-slate-950 border-red-500 shadow-[0_0_45px_rgba(239,68,68,0.2)] ring-1 ring-red-500/50' 
            : 'bg-slate-950 border-slate-800 shadow-xl'
        }`}>
          {/* Tech Scan Line Effect */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className={`absolute top-0 left-0 w-full h-[1px] blur-[1px] animate-[scan_6s_linear_infinite] ${
              isAlert ? 'bg-red-500/40' : 'bg-primary-400/20'
            }`}></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(27,88,244,0.08),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
          </div>
          
          <div className="relative z-10 flex flex-col h-full justify-between">
             <div className="flex justify-between items-start mb-10">
                <div className={`p-3 rounded-2xl transition-all duration-500 border ${
                  isAlert 
                    ? 'bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)] border-red-400 animate-pulse' 
                    : 'bg-primary-600 text-white border-primary-500 shadow-lg shadow-primary-500/20'
                }`}>
                   <Icon size={24} strokeWidth={2.5} />
                </div>
                
                {isAlert ? (
                  <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-500 text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-[0.2em] shadow-sm animate-pulse">
                    Critical Alert
                  </div>
                ) : trendValue && (
                  <span className="flex items-center gap-1 text-[10px] font-black bg-white/10 text-white border border-white/20 px-3 py-1.5 rounded-xl uppercase tracking-widest backdrop-blur-md">
                    {trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {trendValue}
                  </span>
                )}
             </div>
             
             <div>
               <p className={`text-[10px] font-black uppercase tracking-[0.4em] mb-2 transition-colors duration-500 ${
                 isAlert ? 'text-red-400' : 'text-slate-500'
               }`}>{title}</p>
               <div className="flex items-baseline gap-3">
                 <h3 className={`text-6xl font-black font-mono tracking-tighter transition-all duration-700 ${
                   isAlert 
                     ? 'text-red-500 [text-shadow:0_0_20px_rgba(239,68,68,0.6)]' 
                     : 'text-white'
                 }`}>
                   {value}
                 </h3>
                 {isAlert && <AlertTriangle size={24} className="text-red-500 animate-bounce" />}
               </div>
             </div>
             
             {subtext && (
               <div className={`mt-10 pt-5 border-t text-[10px] font-black flex items-center justify-between uppercase tracking-[0.2em] transition-all duration-500 ${
                 isAlert ? 'text-red-500 border-red-900/50' : 'text-slate-500 border-slate-800'
               }`}>
                 <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isAlert ? 'bg-red-500 shadow-[0_0_10px_red]' : 'bg-primary-500 animate-pulse-subtle'}`}></div>
                    {subtext}
                 </div>
                 <Activity size={14} className="opacity-40" />
               </div>
             )}
          </div>
          
          <style>{`
            @keyframes scan {
              0% { transform: translateY(-100%); opacity: 0; }
              10% { opacity: 1; }
              90% { opacity: 1; }
              100% { transform: translateY(800%); opacity: 0; }
            }
          `}</style>
        </div>
      );
  }

  return (
    <div className={`p-6 rounded-4xl bg-white border transition-all duration-500 group relative flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-2xl ${
      isAlert 
        ? 'border-red-500 ring-2 ring-red-500/10' 
        : 'border-slate-200 hover:border-primary-400'
    }`}>
      <div className={`absolute top-0 left-0 right-0 h-1 transition-all duration-500 ${
        isAlert ? 'bg-red-500' : 'bg-slate-50 group-hover:bg-primary-500'
      }`}></div>

      <div className="flex justify-between items-start mb-8 mt-2">
        <div className={`p-3 rounded-2xl transition-all duration-300 border ${
          isAlert 
            ? 'bg-red-50 text-red-600 border-red-100' 
            : 'bg-slate-50 text-slate-400 border-slate-100 group-hover:bg-primary-50 group-hover:text-primary-600 group-hover:border-primary-200'
        }`}>
          <Icon size={20} strokeWidth={2.5} />
        </div>
        
        {!isAlert && trendValue && (
          <div className={`
            flex items-center gap-1.5 text-[10px] font-black px-3 py-1 rounded-xl border uppercase tracking-widest
            ${trend === 'up' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : trend === 'down' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-slate-50 text-slate-500 border-slate-200'}
          `}>
            {trend === 'up' ? <TrendingUp size={12} /> : trend === 'down' ? <TrendingDown size={12} /> : null} {trendValue}
          </div>
        )}
      </div>
      
      <div>
        <p className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 ${
          isAlert ? 'text-red-500' : 'text-slate-400'
        }`}>
          {title}
        </p>
        <div className="flex items-center gap-3">
          <h3 className={`text-4xl font-black font-mono tracking-tighter transition-colors ${
            isAlert ? 'text-red-600' : 'text-slate-900 group-hover:text-primary-600'
          }`}>
            {value}
          </h3>
          {isAlert && <AlertTriangle size={20} className="text-red-500 animate-pulse" />}
        </div>
      </div>

      {subtext && (
        <div className={`mt-8 pt-4 border-t text-[9px] font-black flex items-center justify-between ${
          isAlert ? 'border-red-50 text-red-400' : 'border-slate-50 text-slate-400'
        }`}>
           <div className="flex items-center gap-2 uppercase tracking-widest">
              <div className={`w-1.5 h-1.5 rounded-full ${isAlert ? 'bg-red-500 animate-pulse' : 'bg-slate-300'}`}></div>
              {subtext}
           </div>
           <TrendingUp size={12} className="opacity-20" />
        </div>
      )}
    </div>
  );
};

export default StatCard;
