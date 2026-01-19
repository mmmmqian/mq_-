
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
  MessageSquare, FileSearch, Mic
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
  
  // 延迟维度控制状态 (P90, P95, P99)
  const [visibleLatencyMetrics, setVisibleLatencyMetrics] = useState<string[]>(['p95', 'p99']);

  const selectedService = MOCK_INFERENCE_SERVICES.find(s => s.id === selectedServiceId) || MOCK_INFERENCE_SERVICES[0];

  // 模拟数据生成
  const qpsTrend = useMemo(() => generateMetrics(24, 450, 150), [selectedServiceId, isRefreshing, timeRange]);
  const successRateTrend = useMemo(() => generateMetrics(24, 99.85, 0.2), [selectedServiceId, isRefreshing]);
  const tokenUsageTrend = useMemo(() => generateMetrics(24, 72, 15), [selectedServiceId, isRefreshing]);

  // 定义所有延迟维度
  const allLatencySeries = useMemo(() => [
    { key: 'p99', name: 'P99 Latency', color: '#6366f1', data: generateMetrics(24, 145, 35) },
    { key: 'p95', name: 'P95 Latency', color: '#1B58F4', data: generateMetrics(24, 110, 25) },
    { key: 'p90', name: 'P90 Latency', color: '#10b981', data: generateMetrics(24, 85, 20) },
  ], [selectedServiceId, isRefreshing, timeRange]);

  // 根据选择过滤显示的延迟维度
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
    <div className="flex items-center justify-between mb-8 px-1">
       <div className="flex items-center gap-4">
          <div className={`w-11 h-11 rounded-2xl bg-white border border-slate-200 flex items-center justify-center ${color} shadow-sm group-hover:scale-110 transition-transform duration-500`}>
             <Icon size={22} strokeWidth={2.5} />
          </div>
          <div>
             <h3 className="text-base font-black text-slate-900 uppercase tracking-widest leading-none">{title}</h3>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">{subTitle}</p>
          </div>
       </div>
       <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Telemetry Data Stream Active</span>
       </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-24 font-sans max-w-[1600px] mx-auto">
      <ServiceLogDrawer isOpen={isLogOpen} onClose={() => setIsLogOpen(false)} service={selectedService} />

      {/* 1. 顶部标题容器 (纯净标题与状态) */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white border border-slate-200 p-8 rounded-[40px] shadow-sm relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity duration-700">
            <Fingerprint size={160} strokeWidth={1} />
         </div>
         
         <div className="flex items-center gap-6 relative z-10">
           <div className="w-16 h-16 bg-slate-950 rounded-[24px] flex items-center justify-center text-white shadow-2xl transition-transform group-hover:scale-105 border border-white/10">
             <ActivitySquare size={32} strokeWidth={2.5} />
           </div>
           <div>
             <div className="flex items-center gap-3">
                <div className="flex flex-col">
                   <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[9px] font-black text-primary-600 uppercase tracking-widest bg-primary-50 px-2 py-0.5 rounded">Inference Service</span>
                      <span className="text-slate-300 text-[10px] tracking-widest">/</span>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Monitoring & Governance</span>
                   </div>
                   <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase leading-none">服务实时监控看板</h1>
                </div>
                <Badge status="success" showDot className="ml-4">PROD_OK</Badge>
             </div>
             <div className="flex items-center gap-4 mt-4">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] flex items-center gap-2">
                 <Server size={14} className="text-primary-500" /> INFRASTRUCTURE_NODAL_TELEMETRY
               </span>
               <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic font-mono">Status: Consistent</p>
             </div>
           </div>
         </div>

         <div className="relative z-10 hidden lg:flex flex-col items-end gap-1.5">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Last Update Time</p>
            <p className="text-xl font-black text-slate-900 font-mono tracking-tighter">{new Date().toLocaleTimeString()}</p>
         </div>
      </div>

      {/* 2. 浅色独立控制工具栏 */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-5 bg-white p-5 rounded-[32px] border border-slate-200 shadow-sm relative overflow-hidden group">
         <div className="flex items-center gap-4 w-full md:w-auto relative z-10">
            <div className="relative group min-w-[340px]">
               <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-500"><Box size={14} /></div>
               <select 
                 value={selectedServiceId}
                 onChange={(e) => setSelectedServiceId(e.target.value)}
                 className="w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 text-slate-900 text-[11px] font-black uppercase tracking-widest rounded-2xl hover:border-primary-500 hover:bg-white transition-all cursor-pointer appearance-none outline-none shadow-sm"
               >
                 {MOCK_INFERENCE_SERVICES.map(s => <option key={s.id} value={s.id} className="bg-white text-slate-900">{s.name.toUpperCase()} (UUID: {s.id})</option>)}
               </select>
               <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-primary-500 transition-colors" />
            </div>

            <div className="h-6 w-px bg-slate-100 hidden md:block"></div>

            <button 
                onClick={handleRefresh}
                className="group/refresh flex items-center gap-3 px-5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl transition-all hover:bg-white hover:border-primary-500 hover:shadow-sm active:scale-95"
               >
                  <RefreshCw size={13} className={`text-emerald-500 transition-transform duration-500 ${isRefreshing ? 'animate-spin' : 'group-hover/refresh:rotate-180'}`} />
                  <div className="flex flex-col items-start leading-none">
                     <span className="text-[11px] font-black text-slate-900 font-mono tracking-tighter">{countdown}S</span>
                     <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Auto Sync</span>
                  </div>
            </button>
         </div>

         <div className="flex items-center gap-3 w-full md:w-auto relative z-10">
            <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
               {['1H', '24H', '7D', '30D'].map(r => (
                  <button 
                    key={r} 
                    onClick={() => setTimeRange(r.toLowerCase())} 
                    className={`px-6 py-2 text-[10px] font-black rounded-xl transition-all ${timeRange === r.toLowerCase() ? 'bg-white text-primary-600 shadow-md ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    {r}
                  </button>
               ))}
            </div>
            <button className="p-3.5 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-primary-600 hover:border-primary-500 transition-all shadow-sm active:scale-95" title="Export Telemetry Data">
               <Download size={18} />
            </button>
         </div>
      </div>

      {/* 3. KPI 核心指标矩阵 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200 p-8 rounded-[40px] shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
           <div className="flex justify-between items-start mb-10">
              <div className="p-3 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 shadow-sm"><ShieldCheck size={24} strokeWidth={2.5} /></div>
              <div className="text-[11px] font-black text-emerald-600 flex items-center gap-1.5 font-mono"><ArrowUpRight size={14} /> 0.01%</div>
           </div>
           <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">服务调用成功率</p>
           <h3 className="text-4xl font-black text-slate-900 tracking-tighter font-mono">99.99<span className="text-sm text-slate-300 font-sans uppercase ml-1">%</span></h3>
        </div>

        <div className="bg-white border border-slate-200 p-8 rounded-[40px] shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
           <div className="flex justify-between items-start mb-10">
              <div className="p-3 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-sm"><Timer size={24} strokeWidth={2.5} /></div>
              <Badge status="success" showDot={false}>SLA NOMINAL</Badge>
           </div>
           <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">响应延时 P95</p>
           <h3 className="text-4xl font-black text-slate-900 tracking-tighter font-mono">{selectedService.latency} <span className="text-sm text-slate-300 font-sans uppercase ml-1">MS</span></h3>
        </div>

        <div className="bg-white border border-slate-200 p-8 rounded-[40px] shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
           <div className="flex justify-between items-start mb-10">
              <div className="p-3 bg-primary-50 text-primary-600 border border-primary-100 rounded-2xl group-hover:bg-primary-600 group-hover:text-white transition-all duration-500 shadow-sm"><Activity size={24} strokeWidth={2.5} /></div>
              <div className="text-[11px] font-black text-primary-600 font-mono tracking-tighter uppercase">{selectedService.qps} REQ/S</div>
           </div>
           <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">服务总调用量</p>
           <h3 className="text-4xl font-black text-slate-900 tracking-tighter font-mono">4.28<span className="text-sm text-slate-300 font-sans uppercase ml-1">M</span></h3>
        </div>

        <div className="bg-white border border-slate-200 p-8 rounded-[40px] shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
           <div className="flex justify-between items-start mb-10">
              <div className="p-3 bg-amber-50 text-amber-600 border border-amber-100 rounded-2xl group-hover:bg-amber-600 group-hover:text-white transition-all duration-500 shadow-sm"><Zap size={24} strokeWidth={2.5} /></div>
              <Badge status="warning" showDot={false}>88% QUOTA</Badge>
           </div>
           <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Token 消耗总量</p>
           <h3 className="text-4xl font-black text-slate-900 tracking-tighter font-mono">112.5<span className="text-sm text-slate-300 font-sans uppercase ml-1">M</span></h3>
        </div>
      </div>

      {/* 4. SLA 性能矩阵 */}
      <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
         <SectionHeader 
            icon={Gauge} 
            title="SLA 性能监控矩阵" 
            subTitle="Core Latency Quantiles & Stability Analytics" 
            color="text-indigo-600" 
         />
         <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <div className="bg-white border border-slate-200 rounded-[40px] p-8 shadow-sm">
               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
                  <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
                     <Clock size={18} className="text-indigo-500" /> 响应延迟趋势分位数
                  </h4>
                  <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100 shadow-inner">
                    {[
                      { key: 'p99', label: 'P99', color: 'bg-indigo-500' },
                      { key: 'p95', label: 'P95', color: 'bg-primary-500' },
                      { key: 'p90', label: 'P90', color: 'bg-emerald-500' }
                    ].map((metric) => {
                      const isActive = visibleLatencyMetrics.includes(metric.key);
                      return (
                        <button 
                          key={metric.key}
                          onClick={() => toggleLatencyMetric(metric.key)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${isActive ? 'bg-white text-slate-950 shadow-sm ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                           <div className={`w-1.5 h-1.5 rounded-full ${isActive ? metric.color : 'bg-slate-300'}`}></div>
                           {metric.label}
                           {isActive && <Check size={10} strokeWidth={4} className="ml-1 text-emerald-500" />}
                        </button>
                      );
                    })}
                  </div>
               </div>
               <div className="h-[340px]">
                  {activeLatencySeries.length > 0 ? (
                    <MonitoringChart series={activeLatencySeries} height={340} unit="ms" />
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-300 border-2 border-dashed border-slate-100 rounded-3xl">
                       <Clock size={40} className="mb-4 opacity-10" />
                       <p className="text-[10px] font-black uppercase tracking-widest">请选择至少一个延迟维度进行可视化</p>
                    </div>
                  )}
               </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-[40px] p-8 shadow-sm">
               <div className="flex justify-between items-center mb-10">
                  <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
                     <ShieldCheck size={18} className="text-emerald-500" /> 服务调用成功率趋势
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] font-mono font-black text-emerald-600">
                     SLO AVG: 99.985%
                  </div>
               </div>
               <div className="h-[340px]">
                  <MonitoringChart data={successRateTrend} height={340} color="#10b981" label="Success Rate" unit="%" />
               </div>
            </div>
         </div>
      </section>

      {/* 5. 流量载荷动态分析 */}
      <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
         <SectionHeader 
            icon={TrendingUp} 
            title="流量载荷动态分析" 
            subTitle="Global Throughput Patterns & Distribution" 
            color="text-primary-600" 
         />
         <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <div className="bg-white border border-slate-200 rounded-[40px] p-8 shadow-sm group">
               <div className="flex justify-between items-center mb-8">
                  <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
                     <Activity size={18} className="text-primary-500" /> 全局调用吞吐趋势 (QPS)
                  </h4>
                  <Badge status="primary">REAL-TIME</Badge>
               </div>
               <div className="h-[340px]">
                  <MonitoringChart data={qpsTrend} height={340} color="#1B58F4" label="Global QPS" unit="" />
               </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-[40px] p-8 shadow-sm group flex flex-col">
               <div className="flex justify-between items-center mb-10">
                  <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
                     <PieChart size={18} className="text-indigo-500" /> 调用量任务分布统计 (TASK_DIST)
                  </h4>
                  <Badge status="neutral" showDot={false}>REAL-TIME AUDIT</Badge>
               </div>
               <div className="space-y-7 pt-4 flex-1">
                  {[
                     { name: '文本生成 (TEXT_GEN)', val: '1.92M', pct: 45, color: 'bg-primary-500', icon: MessageSquare },
                     { name: '图像分类 (IMG_CLS)', val: '1.08M', pct: 25, color: 'bg-indigo-500', icon: ImageIcon },
                     { name: '目标检测 (OBJ_DET)', val: '645K', pct: 15, color: 'bg-slate-700', icon: FileSearch },
                     { name: '语音识别 (ASR)', val: '430K', pct: 10, color: 'bg-emerald-500', icon: Mic },
                     { name: '其他任务 (OTHERS)', val: '215K', pct: 5, color: 'bg-slate-300', icon: Box }
                  ].map((task, i) => (
                     <div key={i} className="group/item">
                        <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-tight mb-2.5">
                           <span className="text-slate-600 flex items-center gap-2">
                              <task.icon size={12} className="text-slate-300 group-hover/item:text-primary-500 transition-colors" /> {task.name}
                           </span>
                           <div className="flex gap-5">
                              <span className="font-mono text-slate-400">{task.val}</span>
                              <span className="font-mono text-slate-900 w-10 text-right">{task.pct}%</span>
                           </div>
                        </div>
                        <div className="h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                           <div className={`h-full ${task.color} transition-all duration-1000 group-hover/item:opacity-80`} style={{ width: `${task.pct}%` }}></div>
                        </div>
                     </div>
                  ))}
               </div>
               <div className="mt-12 p-6 bg-slate-50 rounded-3xl border border-slate-200 flex items-center gap-5 relative overflow-hidden group">
                  <div className="absolute inset-0 tech-grid opacity-[0.03] pointer-events-none"></div>
                  <div className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-primary-500 shadow-sm group-hover:scale-110 transition-transform">
                     <Gauge size={24} />
                  </div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase leading-relaxed tracking-tight relative z-10">
                    负载感知策略：当前文本生成任务占比最高，系统已自动优化 KV Cache 预分配策略，确保 LLM 推理长尾延迟稳定。
                  </p>
               </div>
            </div>
         </div>
      </section>

      {/* 6. 模型资源经济看板 */}
      <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
         <SectionHeader 
            icon={Zap} 
            title="模型资源经济看板" 
            subTitle="Token Usage Decomposition & Model Utilization Analysis" 
            color="text-amber-600" 
         />
         <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <div className="bg-white border border-slate-200 rounded-[40px] p-8 shadow-sm group">
               <div className="flex justify-between items-center mb-8">
                  <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
                     <BarChart3 size={18} className="text-amber-500" /> 全局 TOKEN 消耗规模趋势
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] font-mono font-black text-amber-600">
                     UNIT: 1K TOKENS
                  </div>
               </div>
               <div className="h-[340px]">
                  <MonitoringChart data={tokenUsageTrend} height={340} color="#F59E0B" label="Token Consumption" unit="k" />
               </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-[40px] p-8 shadow-sm flex flex-col">
               <div className="flex justify-between items-center mb-10">
                  <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
                     <PieChart size={18} className="text-amber-500" /> 模型维度 Token 使用占比 (MODEL_DISTRIBUTION)
                  </h4>
                  <Badge status="neutral" showDot={false}>SYSTEM AUDIT</Badge>
               </div>
               
               <div className="flex-1 flex flex-col justify-center gap-10 px-4">
                  {[
                     { label: 'GPT-3.5-TURBO', val: 42, color: 'bg-amber-500', icon: Zap, sub: 'Mainstream Logic Reasoning' },
                     { label: 'CLAUDE-3-OPUS', val: 28, color: 'bg-indigo-600', icon: Sparkles, sub: 'Complex Multi-step Tasks' },
                     { label: 'BERT-LARGE-UNCAL', val: 15, color: 'bg-slate-950', icon: Binary, sub: 'NLP Analytics & Features' },
                     { label: 'RESNET-50-PROD', val: 8, color: 'bg-primary-500', icon: ImageIcon, sub: 'Image Classification Layer' },
                     { label: 'YOLOV8-DETECTION', val: 7, color: 'bg-emerald-500', icon: Target, sub: 'Object Detection Pipeline' }
                  ].map((item, i) => (
                     <div key={i} className="space-y-4">
                        <div className="flex justify-between items-end">
                           <div className="flex items-center gap-4">
                              <div className={`p-2.5 rounded-xl ${item.color} text-white shadow-lg`}><item.icon size={14} strokeWidth={2.5} /></div>
                              <div>
                                 <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest leading-none block">{item.label}</span>
                                 <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter mt-1.5 block">{item.sub}</span>
                              </div>
                           </div>
                           <span className="text-2xl font-black font-mono text-slate-900 tracking-tighter">{item.val}%</span>
                        </div>
                        <div className="h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100 shadow-inner">
                           <div className={`h-full ${item.color} transition-all duration-1000 shadow-tech`} style={{ width: `${item.val}%` }}></div>
                        </div>
                     </div>
                  ))}
               </div>

               <div className="mt-10 pt-6 border-t border-slate-50 flex items-center justify-end text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <button className="text-primary-600 hover:underline">Full Economics View</button>
               </div>
            </div>
         </div>
      </section>

      {/* 7. 底部审计声明 */}
      <div className="bg-primary-50/50 border border-primary-100 p-8 rounded-[40px] flex flex-col md:flex-row gap-8 items-center relative overflow-hidden group">
         <div className="absolute inset-0 tech-grid opacity-[0.05]"></div>
         <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary-600 shadow-sm shrink-0 border border-primary-100 relative z-10 group-hover:scale-110 transition-transform duration-500">
            <ShieldCheck size={32} strokeWidth={2.5} />
         </div>
         <div className="space-y-2 relative z-10 flex-1 text-center md:text-left">
            <h5 className="text-[11px] font-black text-primary-900 uppercase tracking-[0.25em]">监控数据一致性与生产审计协议 (AUDIT_PROTOCOL)</h5>
            <p className="text-[11px] text-primary-800/80 leading-relaxed font-medium">
               当前所有遥测指标均由分布式推理网关 (Inference Gateway) 实时采集并经 Prometheus 联邦集群处理。Token 消耗数据符合财务级对账标准。
               P95/P90/P99 延迟数据每 5s 动态更新一次。已通过一致性哈希确保高并发场景下的数据精准。
            </p>
         </div>
         <div className="shrink-0 relative z-10">
            <button className="px-8 py-4 bg-white border border-primary-200 text-primary-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-600 hover:text-white transition-all shadow-sm active:scale-95 flex items-center gap-2">
               <Download size={14} /> Export Global Audit Log
            </button>
         </div>
      </div>
    </div>
  );
};

export default ServiceMonitoringPage;
