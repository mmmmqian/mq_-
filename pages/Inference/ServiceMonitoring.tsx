
import React, { useState, useEffect, useMemo } from 'react';
import { 
  ActivitySquare, RefreshCw, 
  Clock, Zap, AlertCircle,
  ShieldCheck, ArrowUpRight,
  ChevronDown, Globe, Gauge, Database,
  Layers, Info, TrendingUp, MonitorPlay,
  Box, Hash, PieChart,
  Activity, Server, Timer, Settings,
  ArrowRightLeft, MousePointer2,
  BarChart3, Target, Share2,
  Fingerprint, LayoutGrid, Radio,
  Binary, Command, ShieldAlert,
  MapPin, Check, ChevronRight,
  Download, Filter, Calendar,
  Sparkles, Image as ImageIcon,
  MessageSquare, FileSearch, Mic,
  Signal, Cpu, HardDrive
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
  
  const [visibleLatencyMetrics, setVisibleLatencyMetrics] = useState<string[]>(['p95', 'p99']);

  const selectedService = MOCK_INFERENCE_SERVICES.find(s => s.id === selectedServiceId) || MOCK_INFERENCE_SERVICES[0];

  const qpsTrend = useMemo(() => generateMetrics(24, 450, 150), [selectedServiceId, isRefreshing, timeRange]);
  const successRateTrend = useMemo(() => generateMetrics(24, 99.85, 0.2), [selectedServiceId, isRefreshing]);
  const tokenUsageTrend = useMemo(() => generateMetrics(24, 72, 15), [selectedServiceId, isRefreshing]);

  const allLatencySeries = useMemo(() => [
    { key: 'p99', name: 'P99 Latency', color: '#6366f1', data: generateMetrics(24, 145, 35) },
    { key: 'p95', name: 'P95 Latency', color: '#1B58F4', data: generateMetrics(24, 110, 25) },
    { key: 'p90', name: 'P90 Latency', color: '#10b981', data: generateMetrics(24, 85, 20) },
  ], [selectedServiceId, isRefreshing, timeRange]);

  const activeLatencySeries = useMemo(() => 
    allLatencySeries.filter(s => visibleLatencyMetrics.includes(s.key)),
    [allLatencySeries, visibleLatencyMetrics]
  );

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
    if (isRefreshing) return;
    setIsRefreshing(true);
    setCountdown(10);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const toggleLatencyMetric = (key: string) => {
    setVisibleLatencyMetrics(prev => 
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const SectionHeader = ({ icon: Icon, title, subTitle, color }: any) => (
    <div className="flex items-center justify-between mb-6 px-1">
       <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center ${color} shadow-sm transition-all duration-500`}>
             <Icon size={20} strokeWidth={2.5} />
          </div>
          <div>
             <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.15em] leading-none">{title}</h3>
             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{subTitle}</p>
          </div>
       </div>
       <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-lg">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">TELEMETRY_STREAM_LIVE</span>
       </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-24 font-sans max-w-[1600px] mx-auto">
      <ServiceLogDrawer isOpen={isLogOpen} onClose={() => setIsLogOpen(false)} service={selectedService} />

      {/* 1. 顶部标题横幅 (只保留核心信息与状态) */}
      <div className="bg-white border border-slate-200 p-8 rounded-[40px] shadow-sm flex flex-col lg:flex-row justify-between items-center relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-12 opacity-[0.01] pointer-events-none group-hover:opacity-[0.03] transition-opacity duration-700">
            <Fingerprint size={160} strokeWidth={1} />
         </div>
         
         <div className="flex items-center gap-6 relative z-10 w-full lg:w-auto">
           <div className="w-16 h-16 bg-slate-950 rounded-2xl flex items-center justify-center text-white shadow-xl border border-white/10 transition-transform group-hover:scale-105 duration-500">
             <ActivitySquare size={32} strokeWidth={2.5} />
           </div>
           <div>
             <div className="flex items-center gap-4">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase leading-none">服务实时监控看板</h1>
                <Badge status="success" showDot className="ml-2">PROD_NOMINAL</Badge>
             </div>
             <div className="flex items-center gap-4 mt-3.5">
               <span className="text-[10px] font-black text-primary-600 uppercase tracking-[0.25em] flex items-center gap-2">
                 <Server size={14} className="text-primary-500" /> INFRASTRUCTURE_GATEWAY
               </span>
               <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic font-mono">Telemetry Mode: Global Orchestration</p>
             </div>
           </div>
         </div>

         <div className="relative z-10 hidden lg:flex flex-col items-end gap-1.5 border-l border-slate-100 pl-10">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Last Telemetry Update</p>
            <p className="text-xl font-black text-slate-900 font-mono tracking-tighter">{new Date().toLocaleTimeString()}</p>
         </div>
      </div>

      {/* 2. 独立控制与工具行 (资产选择、时间跨度、同步) */}
      <div className="bg-white border border-slate-200 p-5 rounded-[32px] shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden group">
         <div className="flex items-center gap-4 w-full md:w-auto relative z-10">
            {/* 资产选择器 */}
            <div className="relative flex-1 lg:w-[420px] group">
               <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-500"><Box size={14} strokeWidth={3} /></div>
               <select 
                 value={selectedServiceId}
                 onChange={(e) => setSelectedServiceId(e.target.value)}
                 className="w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 text-slate-900 text-[11px] font-black uppercase tracking-widest rounded-2xl hover:border-primary-500 hover:bg-white transition-all cursor-pointer appearance-none outline-none shadow-sm"
               >
                 {MOCK_INFERENCE_SERVICES.map(s => <option key={s.id} value={s.id}>{s.name.toUpperCase()} (UUID: {s.id})</option>)}
               </select>
               <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-hover:text-primary-500 transition-colors" />
            </div>

            <div className="h-6 w-px bg-slate-100 hidden md:block"></div>

            {/* 同步控件 */}
            <button 
                onClick={handleRefresh}
                className="group/refresh flex items-center gap-4 px-6 py-3 bg-slate-50 border border-slate-200 rounded-2xl transition-all hover:bg-white hover:border-primary-500 active:scale-95 shadow-sm"
            >
               <RefreshCw size={14} className={`text-emerald-500 transition-transform duration-500 ${isRefreshing ? 'animate-spin' : 'group-hover/refresh:rotate-180'}`} strokeWidth={3} />
               <div className="flex flex-col items-start leading-none gap-1">
                  <span className="text-[12px] font-black text-slate-900 font-mono tracking-tighter">{countdown}S</span>
                  <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Auto Sync</span>
               </div>
            </button>
         </div>

         <div className="flex items-center gap-4 w-full md:w-auto relative z-10">
            {/* 时间跨度切换 */}
            <div className="flex bg-slate-100/60 p-1 rounded-2xl border border-slate-200 shadow-inner">
               {['1H', '24H', '7D', '30D'].map(r => (
                  <button 
                    key={r} 
                    onClick={() => setTimeRange(r.toLowerCase())} 
                    className={`px-8 py-2.5 text-[10px] font-black rounded-xl transition-all duration-300 ${timeRange === r.toLowerCase() ? 'bg-white text-primary-600 shadow-md ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    {r}
                  </button>
               ))}
            </div>

            <div className="h-6 w-px bg-slate-100 hidden md:block"></div>

            {/* 额外操作 */}
            <button className="p-3.5 bg-white border border-slate-200 text-slate-400 hover:text-primary-600 hover:border-primary-500 rounded-2xl transition-all shadow-sm active:scale-95" title="Export Analytics">
               <Download size={18} />
            </button>
            <button className="p-3.5 bg-slate-950 text-white rounded-2xl hover:bg-primary-600 transition-all shadow-lg active:scale-95" title="Settings">
               <Settings size={18} />
            </button>
         </div>
      </div>

      {/* KPI 指标网格 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: '服务成功率', value: '99.99', unit: '%', icon: ShieldCheck, color: 'bg-emerald-50 text-emerald-600', trend: '+0.01%' },
          { label: '响应延时 P95', value: selectedService.latency, unit: 'MS', icon: Timer, color: 'bg-indigo-50 text-indigo-600', trend: 'STABLE' },
          { label: '服务总调用量', value: '4.28', unit: 'M', icon: Activity, color: 'bg-primary-50 text-primary-600', trend: '1,420 QPS' },
          { label: 'TOKEN 消耗总量', value: '112.5', unit: 'M', icon: Zap, color: 'bg-amber-50 text-amber-600', trend: '88% QUOTA' }
        ].map((item, i) => (
          <div key={i} className="bg-white border border-slate-200 p-8 rounded-[40px] shadow-sm hover:border-primary-400 transition-all group overflow-hidden relative">
             <div className="flex justify-between items-start mb-8">
                <div className={`p-3 rounded-2xl ${item.color} shadow-sm group-hover:scale-110 transition-transform duration-500`}><item.icon size={24} strokeWidth={2.5} /></div>
                <div className="text-[10px] font-black text-emerald-600 font-mono tracking-[0.2em] bg-emerald-50 px-2 py-0.5 rounded-lg">{item.trend}</div>
             </div>
             <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">{item.label}</p>
             <h3 className="text-4xl font-black text-slate-900 tracking-tighter font-mono">{item.value}<span className="text-sm text-slate-300 ml-1 font-sans font-bold">{item.unit}</span></h3>
          </div>
        ))}
      </div>

      {/* SLA 效能监控区块 */}
      <section className="animate-in fade-in slide-in-from-bottom-2 duration-700">
         <SectionHeader icon={Gauge} title="SLA 性能监控" subTitle="Latency Quantiles & Reliability Trends" color="text-indigo-600" />
         <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-[40px] p-8 shadow-sm">
               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4 px-2">
                  <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.15em] flex items-center gap-2">
                     <Clock size={18} className="text-indigo-500" /> 响应延迟趋势分位数
                  </h4>
                  <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-2xl border border-slate-100 shadow-inner">
                    {[
                      { key: 'p99', label: 'P99', color: 'bg-indigo-500' },
                      { key: 'p95', label: 'P95', color: 'bg-primary-500' },
                      { key: 'p90', label: 'P90', color: 'bg-emerald-500' }
                    ].map((metric) => (
                      <button 
                        key={metric.key}
                        onClick={() => toggleLatencyMetric(metric.key)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${visibleLatencyMetrics.includes(metric.key) ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                         {metric.label}
                      </button>
                    ))}
                  </div>
               </div>
               <div className="h-[340px]">
                  <MonitoringChart series={activeLatencySeries} height={340} unit="ms" />
               </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-[40px] p-8 shadow-sm">
               <div className="flex justify-between items-center mb-10 px-2">
                  <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.15em] flex items-center gap-2">
                     <ShieldCheck size={18} className="text-emerald-500" /> 服务调用成功率趋势
                  </h4>
                  <span className="text-[11px] font-mono font-black text-emerald-600 px-3 py-1 bg-emerald-50 rounded-xl">SLO AVG: 99.98%</span>
               </div>
               <div className="h-[340px]">
                  <MonitoringChart data={successRateTrend} height={340} color="#10b981" label="Success Rate" unit="%" />
               </div>
            </div>
         </div>
      </section>

      {/* 流量与任务分发区块 */}
      <section className="animate-in fade-in slide-in-from-bottom-2 duration-700 delay-100">
         <SectionHeader icon={TrendingUp} title="流量与任务分析" subTitle="Throughput Patterns & Functional Load" color="text-primary-600" />
         <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-[40px] p-8 shadow-sm">
               <div className="flex justify-between items-center mb-8 px-2">
                  <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.15em] flex items-center gap-2">
                     <Activity size={18} className="text-primary-500" /> 全局调用吞吐趋势 (QPS)
                  </h4>
                  <div className="px-3 py-1 bg-primary-50 text-primary-600 text-[9px] font-black rounded-xl uppercase tracking-widest border border-primary-100 shadow-sm">Live Telemetry</div>
               </div>
               <div className="h-[340px]">
                  <MonitoringChart data={qpsTrend} height={340} color="#1B58F4" label="Global QPS" unit="" />
               </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-[40px] p-10 shadow-sm flex flex-col">
               <div className="flex justify-between items-center mb-10">
                  <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.15em] flex items-center gap-2">
                     <PieChart size={18} className="text-indigo-500" /> 调用量任务分布统计 (TASK_DIST)
                  </h4>
                  <button className="text-[10px] font-black text-primary-600 uppercase tracking-widest hover:underline flex items-center gap-2">策略中心 <ArrowUpRight size={14} /></button>
               </div>
               <div className="space-y-7 flex-1 pt-2">
                  {[
                     { name: '文本生成 (TEXT_GEN)', pct: 45, val: '1.92M', color: 'bg-primary-500', icon: MessageSquare },
                     { name: '图像分类 (IMG_CLS)', pct: 25, val: '1.08M', color: 'bg-indigo-500', icon: ImageIcon },
                     { name: '目标检测 (OBJ_DET)', pct: 15, val: '645K', color: 'bg-slate-700', icon: FileSearch },
                     { name: '语音识别 (ASR)', pct: 10, val: '430K', color: 'bg-emerald-500', icon: Mic },
                     { name: '其他任务 (OTHERS)', pct: 5, val: '215K', color: 'bg-slate-200', icon: Box }
                  ].map((task, i) => (
                     <div key={i} className="group/task">
                        <div className="flex justify-between items-center text-[11px] font-black uppercase mb-3">
                           <div className="flex items-center gap-3 text-slate-600 group-hover/task:text-primary-600 transition-colors">
                              <task.icon size={13} className="text-slate-300 group-hover/task:text-primary-400" /> {task.name}
                           </div>
                           <div className="flex gap-6">
                              <span className="font-mono text-slate-400">{task.val}</span>
                              <span className="font-mono text-slate-900 w-10 text-right">{task.pct}%</span>
                           </div>
                        </div>
                        <div className="h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100 shadow-inner">
                           <div className={`h-full ${task.color} transition-all duration-1000 shadow-sm`} style={{ width: `${task.pct}%` }}></div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </section>

      {/* 模型资源经济区块 */}
      <section className="animate-in fade-in slide-in-from-bottom-2 duration-700 delay-200">
         <SectionHeader icon={Zap} title="算力资源经济学" subTitle="Cost Decomposition & Model Efficiency" color="text-amber-600" />
         <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-[40px] p-8 shadow-sm">
               <div className="flex justify-between items-center mb-8 px-2">
                  <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.15em] flex items-center gap-2">
                     <BarChart3 size={18} className="text-amber-500" /> Token 消耗规模趋势 (AGGREGATE)
                  </h4>
                  <span className="text-[10px] font-black text-amber-600 uppercase bg-amber-50 px-3 py-1 rounded-xl border border-amber-100 shadow-sm">Unit: 1K Tokens</span>
               </div>
               <div className="h-[340px]">
                  <MonitoringChart data={tokenUsageTrend} height={340} color="#F59E0B" label="Token Usage" unit="k" />
               </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-[40px] p-10 shadow-sm flex flex-col">
               <div className="flex justify-between items-center mb-10">
                  <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.15em] flex items-center gap-2">
                     <PieChart size={18} className="text-amber-500" /> 模型维度 Token 使用占比 (MODEL_USAGE)
                  </h4>
                  <div className="flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cost Audit Active</span>
                  </div>
               </div>
               <div className="space-y-7 flex-1 pt-2">
                  {[
                     { label: 'GPT-3.5-Turbo', sub: 'Global Text Reasoning', pct: 42, color: 'bg-amber-500', icon: Zap },
                     { label: 'Claude-3-Opus', sub: 'Advanced Multi-step', pct: 28, color: 'bg-indigo-600', icon: Sparkles },
                     { label: 'BERT-Large-Uncal', sub: 'NLP Downstream Tasks', pct: 15, color: 'bg-slate-950', icon: Binary },
                     { label: 'ResNet-50-Prod', sub: 'Feature Extraction', pct: 8, color: 'bg-primary-500', icon: ImageIcon },
                     { label: 'YOLOv8-Detection', sub: 'Visual Extraction', pct: 7, color: 'bg-emerald-500', icon: Target }
                  ].map((item, i) => (
                     <div key={i} className="group/model">
                        <div className="flex justify-between items-end mb-3">
                           <div className="flex items-center gap-4">
                              <div className={`p-2 rounded-xl ${item.color} text-white shadow-lg group-hover/model:scale-110 transition-transform duration-500`}><item.icon size={14} strokeWidth={2.5} /></div>
                              <div>
                                 <span className="text-[12px] font-black text-slate-900 uppercase tracking-widest leading-none block">{item.label}</span>
                                 <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-2 block">{item.sub}</span>
                              </div>
                           </div>
                           <span className="text-2xl font-black font-mono text-slate-900 leading-none tracking-tighter">{item.pct}%</span>
                        </div>
                        <div className="h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100 shadow-inner">
                           <div className={`h-full ${item.color} transition-all duration-1000 shadow-sm`} style={{ width: `${item.pct}%` }}></div>
                        </div>
                     </div>
                  ))}
               </div>
               <div className="mt-10 pt-8 border-t border-slate-50 flex justify-end">
                  <button className="text-[11px] font-black text-primary-600 uppercase tracking-widest hover:underline flex items-center gap-2 group">
                    全量经济审计视图 <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>
               </div>
            </div>
         </div>
      </section>

      {/* 底部审计声明 */}
      <div className="bg-slate-50 border border-slate-200 p-8 rounded-[40px] flex flex-col md:flex-row gap-8 items-center shadow-sm">
         <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-primary-600 shadow-sm border border-slate-100 shrink-0">
            <ShieldCheck size={28} />
         </div>
         <div className="flex-1 text-center md:text-left">
            <p className="text-[12px] font-black text-slate-900 uppercase tracking-widest flex items-center justify-center md:justify-start gap-2">
               生产环境遥测一致性协议 (AUDIT_STABLE_PROTOCOL)
               <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 rounded">v2.5</span>
            </p>
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-2 uppercase tracking-tight">
               所有遥测指标均由分布式网关经 Prometheus 联邦集群处理，具备 5ms 级采样精度。Token 数据与底层计费引擎实时对账，确保财务级一致性审计输出。
            </p>
         </div>
         <div className="flex gap-4 shrink-0">
            <button className="px-8 py-3.5 bg-white border border-slate-200 text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-100 transition-all shadow-sm active:scale-95">
               导出健康报告
            </button>
         </div>
      </div>
    </div>
  );
};

export default ServiceMonitoringPage;
