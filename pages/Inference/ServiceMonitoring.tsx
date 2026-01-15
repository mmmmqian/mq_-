
import React, { useState, useEffect } from 'react';
import { 
  ActivitySquare, RefreshCw, Search, 
  BarChart3, Clock, Zap, AlertCircle,
  ShieldCheck, ArrowUpRight, ArrowDownRight,
  Filter, ChevronDown, Globe, Gauge, Database,
  Cpu, Layers, ExternalLink, Info, ShieldAlert,
  Users, BarChart, TrendingUp, MonitorPlay,
  Terminal, Shield, Box
} from 'lucide-react';
import MonitoringChart from '../../components/ui/MonitoringChart';
import StatCard from '../../components/ui/StatCard';
import { Badge } from '../../components/ui/Badge';
import { ServiceLogDrawer } from '../../components/modals/ServiceLogDrawer';
import { MOCK_SERVICE_MONITORING, MOCK_INFERENCE_SERVICES } from '../../constants';
import PageHeader from '../../components/layout/PageHeader';

const ServiceMonitoringPage: React.FC = () => {
  const [selectedServiceId, setSelectedServiceId] = useState('all');
  const [timeRange, setTimeRange] = useState('1h');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [countdown, setCountdown] = useState(10);

  const selectedService = MOCK_INFERENCE_SERVICES.find(s => s.id === selectedServiceId);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(c => (c <= 1 ? 10 : c - 1));
      if (countdown === 1) handleRefresh();
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const globalStats = [
    { label: 'QPS (Global)', value: '1,420', trend: 'up', trendVal: '12%', icon: ActivitySquare, color: 'text-primary-600' },
    { label: 'Success Rate', value: '99.98%', trend: 'neutral', trendVal: 'Nominal', icon: ShieldCheck, color: 'text-emerald-600' },
    { label: 'P99 Latency', value: '142ms', trend: 'down', trendVal: '4ms', icon: Clock, color: 'text-indigo-600' },
    { label: 'Active Users', value: '842', trend: 'up', trendVal: '24', icon: Users, color: 'text-amber-600' }
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20 font-sans">
      <ServiceLogDrawer isOpen={isLogOpen} onClose={() => setIsLogOpen(false)} service={selectedService || MOCK_INFERENCE_SERVICES[0]} />

      <PageHeader 
        icon={Gauge}
        title="推理服务全维监控看板"
        subtitle="FULL-STACK TELEMETRY & LOGGING"
        badgeText="TELEMETRY READY"
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
               <select 
                 value={selectedServiceId}
                 onChange={(e) => setSelectedServiceId(e.target.value)}
                 className="pl-5 pr-10 py-2.5 bg-slate-50 border border-slate-200 text-slate-700 text-[11px] font-black uppercase tracking-widest rounded-xl hover:border-primary-500 outline-none transition-all cursor-pointer appearance-none min-w-[240px]"
               >
                 <option value="all">GLOBAL OVERVIEW (ALL SERVICES)</option>
                 {MOCK_INFERENCE_SERVICES.map(s => <option key={s.id} value={s.id}>{s.name.toUpperCase()}</option>)}
               </select>
               <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            </div>
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
               {['1h', '6h', '24h', '7d'].map(r => (
                  <button key={r} onClick={() => setTimeRange(r)} className={`px-4 py-1.5 text-[10px] font-black rounded-lg transition-all ${timeRange === r ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-400 hover:text-slate-700'}`}>
                    {r.toUpperCase()}
                  </button>
               ))}
            </div>
            <button onClick={handleRefresh} className="p-2.5 bg-slate-50 border border-slate-200 text-slate-400 hover:text-primary-600 rounded-xl transition-all">
               <RefreshCw size={20} className={isRefreshing ? 'animate-spin' : ''} />
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
         {globalStats.map((stat, i) => (
            <div key={i} className="bg-white border border-slate-200 p-8 rounded-[36px] shadow-sm hover:shadow-xl hover:border-primary-400 transition-all duration-500 flex flex-col group">
               <div className="flex justify-between items-start mb-10">
                  <div className={`p-3 bg-slate-50 border border-slate-100 rounded-2xl ${stat.color} group-hover:bg-primary-600 group-hover:text-white transition-all duration-500 shadow-sm`}><stat.icon size={22} strokeWidth={2.5} /></div>
                  <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg border uppercase tracking-tighter ${stat.trend === 'up' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : stat.trend === 'down' ? 'bg-primary-50 text-primary-600 border-primary-100' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                     {stat.trend === 'up' ? <ArrowUpRight size={12} /> : stat.trend === 'down' ? <ArrowDownRight size={12} /> : null} {stat.trendVal}
                  </div>
               </div>
               <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">{stat.label}</p><p className="text-4xl font-black text-slate-900 tracking-tighter font-mono">{stat.value}</p></div>
            </div>
         ))}
      </div>
      
      {/* Matrix and other deep elements stay the same to preserve content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Chart 1: QPS VELOCITY */}
         <div className="lg:col-span-2 bg-white border border-slate-200 rounded-[40px] p-8 shadow-sm group hover:border-primary-300 transition-colors">
            <div className="flex justify-between items-center mb-10">
               <div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-3 tracking-tight uppercase">
                    <ActivitySquare size={22} className="text-primary-600" />
                    流量负载趋势分析
                  </h3>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2 ml-8">Aggregate QPS across production endpoints</p>
               </div>
               <Badge status="success" showDot={false}>REAL-TIME FEED</Badge>
            </div>
            <div className="h-[320px]">
               <MonitoringChart data={MOCK_SERVICE_MONITORING.qps} color="#1B58F4" label="QPS" height={320} unit="" />
            </div>
         </div>

         {/* Metric Breakdown: TOKEN USAGE */}
         <div className="bg-slate-950 rounded-[40px] p-8 border border-slate-800 shadow-2xl flex flex-col relative overflow-hidden group">
            <div className="absolute inset-0 tech-grid opacity-5"></div>
            <div className="relative z-10">
               <h3 className="text-lg font-black text-white flex items-center gap-3 tracking-tight uppercase mb-10">
                 <Zap size={22} className="text-primary-400" />
                 Token 使用占比 (LLM)
               </h3>
               
               <div className="space-y-10">
                  <div className="flex items-center justify-between">
                     <div className="w-32 h-32 rounded-full border-[10px] border-white/5 flex items-center justify-center relative">
                        <svg className="w-32 h-32 absolute -rotate-90">
                           <circle cx="64" cy="64" r="54" fill="transparent" stroke="#1e293b" strokeWidth="10" />
                           <circle cx="64" cy="64" r="54" fill="transparent" stroke="#1B58F4" strokeWidth="10" strokeDasharray="339" strokeDashoffset="84" strokeLinecap="round" className="transition-all duration-1000" />
                        </svg>
                        <span className="text-2xl font-black text-white font-mono">75%</span>
                     </div>
                     <div className="space-y-4 flex-1 ml-10">
                        <div className="space-y-1">
                           <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Aggregated Peak</p>
                           <p className="text-xl font-black text-white">1.4M / 2M</p>
                        </div>
                        <div className="space-y-1">
                           <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Active Limit</p>
                           <Badge status="warning">82% SATURATION</Badge>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ServiceMonitoringPage;
