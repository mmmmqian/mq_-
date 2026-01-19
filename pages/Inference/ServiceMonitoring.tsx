
import React, { useState, useEffect, useMemo } from 'react';
import { 
  ActivitySquare, RefreshCw, 
  Clock, Zap, AlertCircle,
  ShieldCheck, ArrowUpRight,
  ChevronDown, Globe, Gauge, Database,
  Layers, Info, TrendingUp, MonitorPlay,
  Box, Hash, PieChart,
  Activity, Server, Timer, Settings,
  ArrowRightLeft
} from 'lucide-react';
import MonitoringChart from '../../components/ui/MonitoringChart';
import { Badge } from '../../components/ui/Badge';
import { ServiceLogDrawer } from '../../components/modals/ServiceLogDrawer';
import { MOCK_INFERENCE_SERVICES, generateMetrics } from '../../constants';

const ServiceMonitoringPage: React.FC = () => {
  const [selectedServiceId, setSelectedServiceId] = useState(MOCK_INFERENCE_SERVICES[0].id);
  const [timeRange, setTimeRange] = useState('1h');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [activeMetricTab, setActiveMetricTab] = useState<'performance' | 'business' | 'instances'>('performance');

  const selectedService = MOCK_INFERENCE_SERVICES.find(s => s.id === selectedServiceId) || MOCK_INFERENCE_SERVICES[0];

  // 数据模拟生成
  const latencyTrend = useMemo(() => generateMetrics(24, 120, 30), [selectedServiceId, isRefreshing, timeRange]);
  const qpsTrend = useMemo(() => generateMetrics(24, 450, 150), [selectedServiceId, isRefreshing, timeRange]);
  const tokenTrend = useMemo(() => generateMetrics(24, 65, 20), [selectedServiceId, isRefreshing]);
  const errorTrend = useMemo(() => generateMetrics(24, 0.5, 1).map(p => ({...p, value: p.value < 0.2 ? 0 : p.value})), [selectedServiceId]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          handleRefresh();
          return 10;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 font-sans">
      <ServiceLogDrawer isOpen={isLogOpen} onClose={() => setIsLogOpen(false)} service={selectedService} />

      {/* 顶部指挥中心导航与状态 */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white border border-slate-200 p-8 rounded-[40px] shadow-sm relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity duration-700">
            <Gauge size={160} strokeWidth={1} />
         </div>
         
         <div className="flex items-center gap-6 relative z-10">
           <div className="w-16 h-16 bg-slate-950 rounded-[24px] flex items-center justify-center text-white shadow-2xl transition-transform group-hover:scale-105">
             <ActivitySquare size={32} strokeWidth={2.5} />
           </div>
           <div>
             <div className="flex items-center gap-3">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase leading-none">全维监控看板</h1>
                <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-lg border border-emerald-100 text-[10px] font-black uppercase">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                   Nominal
                </div>
             </div>
             <div className="flex items-center gap-4 mt-3.5">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] flex items-center gap-2">
                 <Server size={14} className="text-primary-500" /> INFRASTRUCTURE_TELEMETRY
               </span>
               <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic font-mono">Last sync: {new Date().toLocaleTimeString()}</p>
             </div>
           </div>
         </div>
         
         <div className="flex flex-wrap items-center gap-4 relative z-10 w-full lg:w-auto">
            <div className="relative">
               <select 
                 value={selectedServiceId}
                 onChange={(e) => setSelectedServiceId(e.target.value)}
                 className="pl-5 pr-12 py-3 bg-slate-50 border border-slate-200 text-slate-900 text-[11px] font-black uppercase tracking-widest rounded-2xl hover:border-primary-500 hover:bg-white transition-all cursor-pointer appearance-none min-w-[280px] shadow-sm"
               >
                 {MOCK_INFERENCE_SERVICES.map(s => <option key={s.id} value={s.id}>{s.name.toUpperCase()} ({s.id})</option>)}
               </select>
               <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            <div className="flex items-center gap-3 bg-white p-1.5 border border-slate-200 rounded-2xl shadow-sm">
               <div className="flex items-center gap-1.5 px-3 border-r border-slate-100 mr-1">
                  <RefreshCw size={12} className={`text-primary-500 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span className="text-[11px] font-black font-mono text-slate-700">{countdown}S</span>
               </div>
               {['1H', '24H', '7D'].map(r => (
                  <button 
                    key={r} 
                    onClick={() => setTimeRange(r.toLowerCase())} 
                    className={`px-4 py-1.5 text-[10px] font-black rounded-xl transition-all ${timeRange === r.toLowerCase() ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'}`}
                  >
                    {r}
                  </button>
               ))}
            </div>
         </div>
      </div>

      {/* 核心指标统计 (KPI GRID) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white border border-slate-200 p-7 rounded-[32px] shadow-sm hover:shadow-xl transition-all group">
           <div className="flex justify-between items-start mb-8">
              <div className="p-3 bg-primary-50 text-primary-600 border border-primary-100 rounded-2xl group-hover:bg-primary-600 group-hover:text-white transition-all duration-500"><TrendingUp size={22} strokeWidth={2.5} /></div>
              <Badge status="primary" showDot={false}>LIVE</Badge>
           </div>
           <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">当前推理 QPS</p>
           <h3 className="text-3xl font-black text-slate-900 tracking-tighter font-mono">{selectedService.qps?.toLocaleString()} <span className="text-xs text-slate-300 font-sans uppercase">REQ/S</span></h3>
        </div>

        <div className="bg-white border border-slate-200 p-7 rounded-[32px] shadow-sm hover:shadow-xl transition-all group">
           <div className="flex justify-between items-start mb-8">
              <div className="p-3 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500"><Clock size={22} strokeWidth={2.5} /></div>
              <div className="text-[9px] font-black text-emerald-600 px-2 py-0.5 bg-emerald-50 rounded uppercase">SLO Passed</div>
           </div>
           <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">P99 平均延迟</p>
           <h3 className="text-3xl font-black text-slate-900 tracking-tighter font-mono">{selectedService.latency} <span className="text-xs text-slate-300 font-sans uppercase">MS</span></h3>
        </div>

        <div className="bg-white border border-slate-200 p-7 rounded-[32px] shadow-sm hover:shadow-xl transition-all group">
           <div className="flex justify-between items-start mb-8">
              <div className="p-3 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500"><ShieldCheck size={22} strokeWidth={2.5} /></div>
              <div className="text-[9px] font-black text-emerald-600 flex items-center gap-1"><ArrowUpRight size={14} /> 0.02%</div>
           </div>
           <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">服务成功率</p>
           <h3 className="text-3xl font-black text-slate-900 tracking-tighter font-mono">99.98<span className="text-xs text-slate-300 font-sans uppercase">%</span></h3>
        </div>

        <div className="bg-white border border-slate-200 p-7 rounded-[32px] shadow-sm hover:shadow-xl transition-all group">
           <div className="flex justify-between items-start mb-8">
              <div className="p-3 bg-amber-50 text-amber-600 border border-amber-100 rounded-2xl group-hover:bg-amber-600 group-hover:text-white transition-all duration-500"><Hash size={22} strokeWidth={2.5} /></div>
              <Badge status="warning" showDot={false}>QUOTA</Badge>
           </div>
           <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">TOKEN 消耗占比</p>
           <h3 className="text-3xl font-black text-slate-900 tracking-tighter font-mono">72.4<span className="text-xs text-slate-300 font-sans uppercase">%</span></h3>
        </div>

        <div className="bg-slate-950 border border-slate-800 p-7 rounded-[32px] shadow-2xl flex flex-col justify-between group overflow-hidden relative">
           <div className="absolute inset-0 tech-grid opacity-10"></div>
           <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="p-2.5 bg-primary-600 text-white rounded-xl shadow-tech"><Database size={20} strokeWidth={2.5} /></div>
              <span className="text-[9px] font-black text-primary-400 uppercase tracking-widest font-mono">Cluster L0</span>
           </div>
           <div className="relative z-10">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">聚合副本健康度</p>
              <h3 className="text-3xl font-black text-white tracking-tighter font-mono">
                 {selectedService.replicas.ready} <span className="text-slate-700">/</span> {selectedService.replicas.total}
              </h3>
           </div>
        </div>
      </div>

      {/* 监控图表主展区 - 已调整为全宽布局 */}
      <div className="grid grid-cols-1 gap-8">
         <div className="bg-white border border-slate-200 rounded-[40px] p-0 shadow-sm overflow-hidden flex flex-col">
            <div className="px-8 py-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/30">
               <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-inner">
                  {[
                    { id: 'performance', label: '性能监控', icon: Gauge },
                    { id: 'business', label: '业务指标', icon: PieChart },
                    { id: 'instances', label: '实例视图', icon: Box }
                  ].map(tab => (
                    <button 
                      key={tab.id}
                      onClick={() => setActiveMetricTab(tab.id as any)}
                      className={`flex items-center gap-2 px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeMetricTab === tab.id ? 'bg-slate-950 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}
                    >
                       <tab.icon size={14} strokeWidth={2.5} />
                       {tab.label}
                    </button>
                  ))}
               </div>
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Real-time Stream: Active</span>
               </div>
            </div>

            <div className="p-8 space-y-10">
               {activeMetricTab === 'performance' && (
                  <div className="space-y-10 animate-in fade-in duration-500">
                     <div className="space-y-6">
                        <div className="flex justify-between items-center px-1">
                           <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.25em] flex items-center gap-2">
                             <TrendingUp size={18} className="text-primary-600" /> QPS 吞吐与处理能力趋势
                           </h4>
                           <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Aggregate Data Matrix</div>
                        </div>
                        <div className="h-[320px]">
                           <MonitoringChart data={qpsTrend} color="#1B58F4" label="Global QPS" height={320} unit="" />
                        </div>
                     </div>
                     <div className="space-y-6 pt-6 border-t border-slate-50">
                        <div className="flex justify-between items-center px-1">
                           <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.25em] flex items-center gap-2">
                             <ArrowRightLeft size={18} className="text-indigo-600" /> 响应延迟 (LATENCY) 分布
                           </h4>
                           <Badge status="success">SLO NOMINAL</Badge>
                        </div>
                        <div className="h-[320px]">
                           <MonitoringChart data={latencyTrend} color="#6366f1" label="P99 Latency" height={320} unit="ms" />
                        </div>
                     </div>
                  </div>
               )}

               {activeMetricTab === 'business' && (
                  <div className="space-y-10 animate-in fade-in duration-500">
                     <div className="space-y-6">
                        <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.25em] flex items-center gap-2 px-1">
                          <Zap size={18} className="text-amber-500" /> TOKEN 消耗规模趋势
                        </h4>
                        <div className="h-[320px]">
                           <MonitoringChart data={tokenTrend} color="#F59E0B" label="Token Usage" height={320} unit="k" />
                        </div>
                     </div>
                     <div className="space-y-6 pt-6 border-t border-slate-50">
                        <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.25em] flex items-center gap-2 px-1">
                          <AlertCircle size={18} className="text-red-500" /> 错误率与拦截审计
                        </h4>
                        <div className="h-[320px]">
                           <MonitoringChart data={errorTrend} color="#EF4444" label="Error Rate" height={320} unit="%" />
                        </div>
                     </div>
                  </div>
               )}

               {activeMetricTab === 'instances' && (
                  <div className="space-y-6 animate-in fade-in duration-500">
                     <div className="flex justify-between items-center px-1">
                        <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.25em] flex items-center gap-2">
                          <Box size={18} className="text-slate-900" /> Pod 实例工作载荷
                        </h4>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selectedService.replicas.ready} 实例就绪</span>
                     </div>
                     <div className="bg-slate-50 rounded-[32px] border border-slate-200 overflow-hidden shadow-inner">
                        <table className="w-full text-left">
                           <thead className="bg-white border-b border-slate-200">
                              <tr>
                                 <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Instance ID</th>
                                 <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                 <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Node / IP</th>
                                 <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">QPS</th>
                                 <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Action</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-100 bg-white/50">
                              {[1, 2, 3, 4].map(i => (
                                 <tr key={i} className="hover:bg-white transition-colors">
                                    <td className="px-8 py-4">
                                       <span className="text-[11px] font-black font-mono text-slate-900 uppercase">{selectedService.id}-POD-{i}</span>
                                    </td>
                                    <td className="px-8 py-4">
                                       <div className="flex items-center gap-2">
                                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                                          <span className="text-[10px] font-black text-emerald-600 uppercase">Running</span>
                                       </div>
                                    </td>
                                    <td className="px-8 py-4">
                                       <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-tighter">szx-node-00{i} / 10.128.0.{i+10}</span>
                                    </td>
                                    <td className="px-8 py-4">
                                       <span className="text-[11px] font-black font-mono text-slate-800">{Math.floor(selectedService.qps! / 4)} req/s</span>
                                    </td>
                                    <td className="px-8 py-4 text-right">
                                       <button className="p-2 text-slate-300 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all" title="查看容器日志">
                                         <MonitorPlay size={16} />
                                       </button>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
};

export default ServiceMonitoringPage;
