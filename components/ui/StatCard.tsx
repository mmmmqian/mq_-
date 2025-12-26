
import React from 'react';
import { LucideIcon, AlertTriangle, TrendingUp, TrendingDown, Bell, Zap } from 'lucide-react';

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
        <div className={`relative overflow-hidden p-6 rounded-2xl transition-all duration-700 border group ${
          isAlert 
            ? 'bg-slate-950 border-red-500 shadow-[0_0_45px_rgba(239,68,68,0.3)] ring-1 ring-red-500/60' 
            : 'bg-slate-900 border-slate-800 shadow-xl'
        }`}>
          {/* 科技感动态纹理：告警时触发红色激光扫描 */}
          {isAlert ? (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_150%,rgba(239,68,68,0.18),transparent_80%)]"></div>
              {/* 斜向扫描线 */}
              <div className="absolute inset-0 opacity-[0.05]" style={{ 
                backgroundImage: 'repeating-linear-gradient(45deg, #ff0000, #ff0000 1px, transparent 1px, transparent 10px)',
                backgroundSize: '20px 20px'
              }}></div>
              <div className="absolute top-0 left-0 w-full h-[1px] bg-red-400/30 blur-[1px] animate-[scan_5s_linear_infinite]"></div>
            </div>
          ) : (
            <div className="absolute top-0 right-0 p-4 opacity-10 text-primary-500">
               <Icon size={120} strokeWidth={1} />
            </div>
          )}
          
          <div className="relative z-10 flex flex-col h-full justify-between">
             <div className="flex justify-between items-start mb-8">
                <div className={`p-2 rounded-xl backdrop-blur-md transition-all duration-500 ${
                  isAlert 
                    ? 'bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.6)] border border-red-400 animate-pulse' 
                    : 'bg-primary-500/10 text-primary-500 border border-primary-500/20'
                }`}>
                   <Icon size={20} strokeWidth={2.5} />
                </div>
                
                {isAlert ? (
                  <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-500 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-[0.2em] shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
                    Critical Overload
                  </div>
                ) : trendValue && (
                  <span className="flex items-center gap-1 text-[10px] font-bold bg-primary-500 text-white px-2 py-1 rounded-full shadow-lg shadow-primary-500/20">
                    {trend === 'up' ? <TrendingUp size={10} /> : <TrendingDown size={10} />} {trendValue}
                  </span>
                )}
             </div>
             
             <div>
               <p className={`text-[10px] font-bold uppercase tracking-[0.3em] mb-2 transition-colors duration-500 ${
                 isAlert ? 'text-red-400/90' : 'text-slate-400'
               }`}>{title}</p>
               <div className="flex items-baseline gap-2">
                 <h3 className={`text-5xl font-bold font-mono tracking-tighter transition-all duration-700 ${
                   isAlert 
                     ? 'text-red-500 [text-shadow:0_0_15px_rgba(239,68,68,0.7)] scale-[1.02]' 
                     : 'text-white'
                 }`}>
                   {value}
                 </h3>
                 {isAlert && <AlertTriangle size={20} className="text-red-500 animate-bounce" />}
               </div>
             </div>
             
             {subtext && (
               <div className={`mt-6 pt-4 border-t text-[10px] font-black flex items-center gap-2 uppercase tracking-[0.15em] transition-all duration-500 ${
                 isAlert ? 'text-red-500 border-red-900/50' : 'text-slate-500 border-slate-800'
               }`}>
                 <div className={`w-1.5 h-1.5 rounded-full ${isAlert ? 'bg-red-500 shadow-[0_0_8px_red] animate-pulse' : 'bg-primary-500'}`}></div>
                 {subtext}
               </div>
             )}
          </div>
          
          <style>{`
            @keyframes scan {
              0% { transform: translateY(-100%); opacity: 0; }
              20% { opacity: 1; }
              80% { opacity: 1; }
              100% { transform: translateY(600%); opacity: 0; }
            }
          `}</style>
        </div>
      );
  }

  return (
    <div className={`p-5 rounded-2xl bg-white border transition-all duration-300 group relative flex flex-col justify-between overflow-hidden ${
      isAlert 
        ? 'border-red-500 shadow-lg shadow-red-500/5 ring-1 ring-red-500' 
        : 'border-slate-200 shadow-sm hover:border-primary-400 hover:shadow-md'
    }`}>
      <div className={`absolute top-0 left-0 right-0 h-1.5 ${
        isAlert ? 'bg-red-500' : 'bg-slate-100 group-hover:bg-primary-500 transition-colors'
      }`}></div>

      <div className="flex justify-between items-start mb-6 mt-1">
        <div className={`p-2 rounded-xl transition-all border ${
          isAlert 
            ? 'bg-red-50 text-red-600 border-red-100' 
            : 'bg-slate-50 text-slate-500 border-slate-100 group-hover:bg-primary-50 group-hover:text-primary-600 group-hover:border-primary-100'
        }`}>
          <Icon size={18} strokeWidth={2} />
        </div>
        
        {!isAlert && trendValue && (
          <div className={`
            flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border
            ${trend === 'up' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : trend === 'down' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-slate-50 text-slate-500 border-slate-100'}
          `}>
            {trend === 'up' ? <TrendingUp size={10} /> : trend === 'down' ? <TrendingDown size={10} /> : null} {trendValue}
          </div>
        )}
      </div>
      
      <div>
        <p className={`text-[10px] font-bold uppercase tracking-[0.15em] mb-1.5 ${
          isAlert ? 'text-red-500' : 'text-slate-400'
        }`}>
          {title}
        </p>
        <div className="flex items-center gap-2">
          <h3 className={`text-3xl font-bold font-mono tracking-tighter transition-colors ${
            isAlert ? 'text-red-600' : 'text-slate-900 group-hover:text-primary-600'
          }`}>
            {value}
          </h3>
          {isAlert && <AlertTriangle size={16} className="text-red-500 animate-pulse" />}
        </div>
      </div>

      {subtext && (
        <div className={`mt-5 pt-3 border-t text-[10px] font-semibold flex items-center gap-1.5 ${
          isAlert ? 'border-red-50 text-red-400' : 'border-slate-50 text-slate-400'
        }`}>
           <div className={`w-1 h-1 rounded-full ${isAlert ? 'bg-red-500 animate-pulse' : 'bg-slate-300'}`}></div>
           {subtext}
        </div>
      )}
    </div>
  );
};

export default StatCard;
