
import React, { useState, useEffect, useMemo } from 'react';
import { 
  ActivitySquare, RefreshCw, Search, 
  BarChart3, Clock, Zap, AlertCircle,
  ShieldCheck, ArrowUpRight, ArrowDownRight,
  Filter, ChevronDown, Globe, Gauge, Database,
  Cpu, Layers, ExternalLink, Info, ShieldAlert,
  Users, BarChart, TrendingUp, MonitorPlay,
  Terminal, Shield, Box, CheckCircle2, Download,
  Heart, ArrowRightLeft
} from 'lucide-react';
import MonitoringChart from '../../components/ui/MonitoringChart';
import StatCard from '../../components/ui/StatCard';
import { Badge } from '../../components/ui/Badge';
import { ServiceLogDrawer } from '../../components/modals/ServiceLogDrawer';
import { MOCK_SERVICE_MONITORING, MOCK_INFERENCE_SERVICES, generateMetrics } from '../../constants';
import PageHeader from '../../components/layout/PageHeader';

const ServiceMonitoringPage: React.FC = () => {
  const [selectedServiceId, setSelectedServiceId] = useState(MOCK_INFERENCE_SERVICES[0].id);
  const [timeRange, setTimeRange] = useState('1h');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [countdown, setCountdown] = useState(10);

  const selectedService = MOCK_INFERENCE_SERVICES.find(s => s.id === selectedServiceId) || MOCK_INFERENCE_SERVICES[0];

  // 模拟生成特定服务的延迟和成功率数据
  const latencyTrend = useMemo(() => generateMetrics(24, 120, 30), [selectedServiceId, isRefreshing]);
  const successRateTrend = useMemo(() => generateMetrics(24, 99.8, 0.4), [selectedServiceId, isRefreshing]);

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

  const handleDownloadLogs = () => {
    alert(`正在对服务 [${selectedService.name}] 的日志进行归档导出...\n导出范围: ${timeRange}\n文件格式: .log.gz`);
  };

  const ResourceProgress = ({ label, icon: Icon, value, color }: any) => (
    <div className="space-y-3">
      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
        <span className="flex items-center gap-1.5"><Icon size={12} /> {label}</span>
        <span className="font-mono text-slate-900">{value}%</span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} transition-all duration-1000 ease-out`} 
          style={{ width: `${value}%` }} 
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 font-sans">
      <ServiceLogDrawer isOpen={isLogOpen} onClose={() => setIsLogOpen(false)} service={selectedService} />

      <PageHeader 
        icon={Gauge}
        title="推理服务全维监控看板"
        subtitle="FULL-STACK TELEMETRY & PRODUCTION MONITORING"
        badgeText="TELEMETRY NOMINAL"
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative group">
               <select 
                 value={selectedServiceId}
                 onChange={(e) => setSelectedServiceId(e.target.value)}
                 className="pl-5 pr-12 py-2.5 bg-white border border-slate-200 text-slate-900 text-[11px] font-black uppercase tracking-widest rounded-xl hover:border-primary-500 hover:shadow-tech outline-none transition-all cursor-pointer appearance-none min-w-[260px]"
               >
                 {MOCK_INFERENCE_SERVICES.map(s => <option key={s.id} value={s.id}>{s.name.toUpperCase()} ({s.id})</option>)}
               </select>
               <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-primary-500 pointer-events-none transition-colors" />
            </div>
            
            <div className="h-8 w-px bg-slate-200 mx-1"></div>

            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
               {['1h', '6h', '24h', '7d'].map(r => (
                  <button key={r} onClick={() => setTimeRange(r)} className={`px-4 py-1.5 text-[10px] font-black rounded-lg transition-all ${timeRange === r ? 'bg-white text-primary-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-700'}`}>
                    {r.toUpperCase()}
                  </button>
               ))}
            </div>
            <button onClick={handleRefresh} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-400 hover:text-primary-600 transition-all group">
               <RefreshCw size={20} className={isRefreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'} />
            </button>
          </div>
        }
      />

      {/* 实时核心指标卡片 (KPI Row) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200 p-8 rounded-[36px] shadow-sm flex flex-col justify-between group">
           <div className="flex justify-between items-start mb-10">
              <div className="p-3 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-2xl group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500"><Heart size={22} strokeWidth={2.5} /></div>
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                 <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Active</span>
              </div>
           </div>
           <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">服务当前状态</p>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight uppercase leading-none">运行中 (UP)</h3>
           </div>
        </div>

        <div className="bg-white border border-slate-200 p-8 rounded-[36px] shadow-sm flex flex-col justify-between group">
           <div className="flex justify-between items-start mb-10">
              <div className="p-3 bg-primary-50 text-primary-600 border border-primary-100 rounded-2xl group-hover:bg-primary-600 group-hover:text-white transition-all duration-500"><ActivitySquare size={22} strokeWidth={2.5} /></div>
              <Badge status="primary" showDot={false}>LIVE FEED</Badge>
           </div>
           <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">当前推理 QPS</p>
              <h3 className="text-4xl font-black text-slate-900 tracking-tighter font-mono">{selectedService.qps?.toLocaleString()} <span className="text-xs text-slate-400 font-sans uppercase">Req/s</span></h3>
           </div>
        </div>

        <div className="bg-white border border-slate-200 p-8 rounded-[36px] shadow-sm flex flex-col justify-between group">
           <div className="flex justify-between items-start mb-10">
              <div className="p-3 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500"><Clock size={22} strokeWidth={2.5} /></div>
              <div className="text-[10px] font-black text-emerald-600 flex items-center gap-1"><ArrowDownRight size={14} /> 4ms</div>
           </div>
           <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">P99 平均延迟</p>
              <h3 className="text-4xl font-black text-slate-900 tracking-tighter font-mono">{selectedService.latency} <span className="text-xs text-slate-400 font-sans uppercase">ms</span></h3>
           </div>
        </div>

        <div className="bg-white border border-slate-200 p-8 rounded-[36px] shadow-sm flex flex-col justify-between group">
           <div className="flex justify-between items-start mb-10">
              <div className="p-3 bg-amber-50 text-amber-600 border border-amber-100 rounded-2xl group-hover:bg-amber-500 group-hover:text-white transition-all duration-500"><ShieldCheck size={22} strokeWidth={2.5} /></div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global P99.9</div>
           </div>
           <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">服务成功率</p>
              <h3 className="text-4xl font-black text-slate-900 tracking-tighter font-mono">99.98<span className="text-xs text-slate-400 font-sans uppercase">%</span></h3>
           </div>
        </div>
      </div>

      {/* 趋势分析图表 (Trend Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-white border border-slate-200 rounded-[40px] p-8 shadow-sm group hover:border-primary-300 transition-colors">
            <div className="flex justify-between items-center mb-8">
               <div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-3 tracking-tight uppercase leading-none">
                    <TrendingUp size={22} className="text-primary-600" />
                    QPS 吞吐趋势分析
                  </h3>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2">Historical request per second trajectory</p>
               </div>
               <Badge status="info" showDot={false}>AUTO-SCALING ENABLED</Badge>
            </div>
            <div className="h-[280px]">
               <MonitoringChart data={MOCK_SERVICE_MONITORING.qps} color="#1B58F4" label="QPS" height={280} unit="" />
            </div>
         </div>

         <div className="bg-white border border-slate-200 rounded-[40px] p-8 shadow-sm group hover:border-indigo-300 transition-colors">
            <div className="flex justify-between items-center mb-8">
               <div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-3 tracking-tight uppercase leading-none">
                    <ArrowRightLeft size={22} className="text-indigo-600" />
                    响应时间延迟分布 (Latency)
                  </h3>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2">End-to-end response time telemetry</p>
               </div>
               <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black text-slate-400 uppercase">SLO: 200ms</span>
                  <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                  <span className="text-[9px] font-black text-emerald-600 uppercase">Within Target</span>
               </div>
            </div>
            <div className="h-[280px]">
               <MonitoringChart data={latencyTrend} color="#6366f1" label="Latency (ms)" height={280} unit="ms" />
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
         {/* 资源利用率 (Resource Matrix) */}
         <div className="bg-slate-950 rounded-[40px] p-8 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col h-full group">
            <div className="absolute inset-0 tech-grid opacity-[0.03] pointer-events-none"></div>
            <div className="relative z-10 flex flex-col h-full">
               <h3 className="text-lg font-black text-white flex items-center gap-3 tracking-tight uppercase mb-10 leading-none">
                 <Zap size={22} className="text-primary-400" />
                 算力水位 (RES_USAGE)
               </h3>
               
               <div className="space-y-10 flex-1 flex flex-col justify-center">
                  <ResourceProgress label="CPU 核心利用" value={42} color="bg-primary-500" icon={Cpu} />
                  <ResourceProgress label="GPU 计算负荷" value={78} color="bg-emerald-500" icon={Zap} />
                  <ResourceProgress label="内存 提交总量" value={65} color="bg-indigo-500" icon={ActivitySquare} />
                  <ResourceProgress label="存储 载荷占比" value={30} color="bg-amber-500" icon={Database} />
               </div>

               <div className="mt-10 pt-6 border-t border-white/5 flex justify-between items-center">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Instance Capacity</p>
                  <p className="text-xs font-black text-white font-mono">{selectedService.replicas.ready}/{selectedService.replicas.total} PODS</p>
               </div>
            </div>
         </div>

         {/* 实时日志预览与下载 (Logging Console) */}
         <div className="xl:col-span-3 bg-white border border-slate-200 rounded-[40px] p-0 shadow-sm overflow-hidden flex flex-col group">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
               <div className="flex items-center gap-3">
                  <Terminal size={18} className="text-primary-600" />
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em]">服务实时日志流 (TELEMETRY_LOGS)</h3>
               </div>
               <div className="flex items-center gap-3">
                  <button 
                     onClick={handleDownloadLogs}
                     className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-primary-500 hover:text-primary-600 transition-all shadow-sm"
                  >
                     <Download size={14} /> 完整导出
                  </button>
                  <button 
                     onClick={() => setIsLogOpen(true)}
                     className="flex items-center gap-2 px-4 py-2 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-600 transition-all shadow-lg shadow-slate-900/10"
                  >
                     <MonitorPlay size={14} /> 进入控制台
                  </button>
               </div>
            </div>
            <div className="flex-1 bg-slate-950 p-6 font-mono text-[11px] leading-relaxed overflow-hidden">
               <div className="space-y-2 opacity-80 group-hover:opacity-100 transition-opacity">
                  <p className="text-slate-500 flex gap-4">
                     <span className="shrink-0 w-32">[10:15:01]</span>
                     <span className="text-emerald-500 font-bold w-12">INFO</span>
                     <span className="text-slate-300">Inference engine vLLM initialized successfully on CUDA:0</span>
                  </p>
                  <p className="text-slate-500 flex gap-4">
                     <span className="shrink-0 w-32">[10:15:04]</span>
                     <span className="text-emerald-500 font-bold w-12">INFO</span>
                     <span className="text-slate-300">Loading model weights: llama3-70b-prod (Registry ID: SVC-9921-A)</span>
                  </p>
                  <p className="text-slate-500 flex gap-4">
                     <span className="shrink-0 w-32">[10:15:15]</span>
                     <span className="text-amber-500 font-bold w-12">WARN</span>
                     <span className="text-slate-300">Continuous memory usage detected at 78%, triggering preemptive cleanup</span>
                  </p>
                  <p className="text-slate-500 flex gap-4">
                     <span className="shrink-0 w-32">[10:16:02]</span>
                     <span className="text-emerald-500 font-bold w-12">INFO</span>
                     <span className="text-slate-300">API Gateway connection established. Health check: PASSED</span>
                  </p>
                  <p className="text-slate-500 flex gap-4">
                     <span className="shrink-0 w-32">[10:18:22]</span>
                     <span className="text-blue-500 font-bold w-12">EVENT</span>
                     <span className="text-slate-300">New batch process request received. Queue length: 2</span>
                  </p>
                  <p className="text-slate-500 flex gap-4">
                     <span className="shrink-0 w-32">[10:20:10]</span>
                     <span className="text-emerald-500 font-bold w-12">INFO</span>
                     <span className="text-slate-300">Request TraceID: b8a2-f9d1 processed in 124ms</span>
                  </p>
                  <div className="flex gap-4 animate-pulse">
                     <span className="shrink-0 w-32 text-slate-700">[{new Date().toLocaleTimeString()}]</span>
                     <span className="w-12 h-3 bg-slate-800 rounded mt-1"></span>
                     <span className="w-full h-3 bg-slate-800 rounded mt-1"></span>
                  </div>
               </div>
            </div>
            <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
               <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  <ShieldAlert size={12} className="text-amber-500" />
                  Security Audit Logging: ON
               </div>
               <span className="text-[9px] font-mono text-slate-400">OFFSET: 0x992B284A</span>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ServiceMonitoringPage;
