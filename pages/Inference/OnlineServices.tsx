
import React, { useState, useMemo } from 'react';
import { 
  Rocket, Search, Plus, RefreshCw, Activity, Globe, Terminal, 
  ShieldCheck, ChevronRight, MoreHorizontal, Copy, CheckCircle2,
  Trash2, Play, Square, Settings, Info, ExternalLink, BarChart3, 
  Database, Box, Cpu, Zap, MonitorPlay, RotateCw, PlayCircle, 
  StopCircle, AlertTriangle, X, Gauge, LineChart, MessageSquare, 
  Layout, Network, Code, Server, Fingerprint, Clock, Link, 
  ShieldAlert, Hash, MapPin, User, SearchCode, Command, 
  AlertCircle, Heart, TrendingUp, ActivitySquare, TerminalSquare, 
  Download, ArrowRightLeft, History, Layers
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { DeployServiceModal } from '../../components/modals/DeployServiceModal';
import { MOCK_INFERENCE_SERVICES, MOCK_SERVICE_MONITORING, generateMetrics } from '../../constants';
import PageHeader from '../../components/layout/PageHeader';
import { Drawer } from '../../components/ui/Drawer';
import MonitoringChart from '../../components/ui/MonitoringChart';

// 状态配置映射
const getStatusConfig = (status: string) => {
  switch (status) {
    case 'running': return { label: '运行中', dot: 'bg-emerald-500', variant: 'success' as const };
    case 'deploying': return { label: '部署中', dot: 'bg-amber-500', variant: 'warning' as const };
    case 'failed': return { label: '异常', dot: 'bg-red-500', variant: 'error' as const };
    case 'stopped': return { label: '已停止', dot: 'bg-slate-400', variant: 'neutral' as const };
    default: return { label: '未知', dot: 'bg-slate-300', variant: 'neutral' as const };
  }
};

const getCurlSnippet = (svc: any) => `curl -X POST "${svc.endpoint}/predict" \\
  -H "Content-Type: application/json" \\
  -d '{"model": "${svc.modelName}", "prompt": "Hello world"}'`;

const getPythonSnippet = (svc: any) => `import requests
url = "${svc.endpoint}/predict"
res = requests.post(url, json={"model": "${svc.modelName}"})
print(res.json())`;

interface OnlineServicesPageProps {
  navigate?: (module: any, page: string) => void;
}

const OnlineServicesPage: React.FC<OnlineServicesPageProps> = ({ navigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [services, setServices] = useState(MOCK_INFERENCE_SERVICES);
  
  // 核心状态：详情、监控、停止确认
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isMonitorOpen, setIsMonitorOpen] = useState(false);
  const [stoppingService, setStoppingService] = useState<any | null>(null);
  const [isStopConfirmOpen, setIsStopConfirmOpen] = useState(false);
  const [snippetTab, setSnippetTab] = useState<'curl' | 'python'>('curl');

  // 监控数据模拟
  const latencyTrend = useMemo(() => generateMetrics(24, 120, 40), [selectedService?.id]);
  const qpsTrend = useMemo(() => generateMetrics(24, 800, 200), [selectedService?.id]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAction = (id: string, action: 'start' | 'stop' | 'restart' | 'details' | 'service-monitor' | 'experience') => {
    const service = services.find(s => s.id === id);
    if (!service) return;

    setSelectedService(service);

    switch (action) {
      case 'details':
        setIsDetailsOpen(true);
        break;
      case 'service-monitor':
        setIsMonitorOpen(true);
        break;
      case 'experience':
        alert(`正在接入 [${service.modelName}] 的交互沙盒环境...`);
        break;
      case 'stop':
        setStoppingService(service);
        setIsStopConfirmOpen(true);
        break;
      case 'start':
      case 'restart':
        setServices(prev => prev.map(s => s.id === id ? { ...s, status: 'deploying' as any } : s));
        setTimeout(() => {
          setServices(prev => prev.map(s => s.id === id ? { ...s, status: 'running' as any } : s));
        }, 1500);
        break;
    }
  };

  const confirmStopService = () => {
    if (!stoppingService) return;
    setServices(prev => prev.map(s => s.id === stoppingService.id ? { ...s, status: 'stopped' as any } : s));
    setIsStopConfirmOpen(false);
    setStoppingService(null);
  };

  const handleDownloadLogs = () => {
    if (!selectedService) return;
    const fileName = `${selectedService.name}_audit_${new Date().toISOString().split('T')[0]}.log.gz`;
    alert(`[SYSTEM] 正在启动日志导出流水线...\n目标节点: szx-prod-node-01\n归档名称: ${fileName}\n状态: 压缩中...`);
  };

  const ResourceProgress = ({ label, icon: Icon, value, color }: any) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-400">
        <span className="flex items-center gap-1.5"><Icon size={11} /> {label}</span>
        <span className={`font-mono ${value > 85 ? 'text-red-500 font-black' : 'text-slate-700'}`}>{value}%</span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
        <div 
          className={`h-full ${value > 85 ? 'bg-red-500 animate-pulse' : color} transition-all duration-1000 ease-out`} 
          style={{ width: `${value}%` }} 
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700 font-sans pb-24">
      <DeployServiceModal isOpen={isDeployModalOpen} onClose={() => setIsDeployModalOpen(false)} />

      {/* 1. 服务监控遥测抽屉 (Service Telemetry Drawer) */}
      <Drawer
        isOpen={isMonitorOpen}
        onClose={() => setIsMonitorOpen(false)}
        title={
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-950 rounded-lg flex items-center justify-center text-white shadow-lg">
              <Gauge size={16} strokeWidth={2.5} />
            </div>
            <span className="font-black uppercase tracking-tight text-slate-900">服务实时遥测中心 (TELEMETRY)</span>
          </div>
        }
        description={selectedService ? `ID: ${selectedService.id} | POD: ${selectedService.name}-vllm-01` : ''}
        width="max-w-5xl"
        footer={
          <div className="flex items-center justify-between w-full">
             <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Data Feed: Nominal</span>
             </div>
             <div className="flex gap-3">
                <button onClick={() => setIsMonitorOpen(false)} className="px-8 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">DISMISS</button>
                <button onClick={handleDownloadLogs} className="px-8 py-2.5 bg-primary-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-700 shadow-xl shadow-primary-500/20 flex items-center gap-2 transition-all active:scale-95">
                  <Download size={14} /> 导出完整审计日志
                </button>
             </div>
          </div>
        }
      >
        {selectedService && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 pb-10">
            {/* KPI Metrics Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
               {[
                 { label: '实时推理 QPS', val: selectedService.qps?.toLocaleString() || '0', unit: 'Req/s', icon: Activity, color: 'text-primary-600', bg: 'bg-primary-50' },
                 { label: 'P99 平均延迟', val: selectedService.latency || '0', unit: 'ms', icon: Clock, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                 { label: '服务成功率', val: '99.98', unit: '%', icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                 { label: '副本水位 (PODS)', val: `${selectedService.replicas.ready}/${selectedService.replicas.total}`, unit: 'UP', icon: Layers, color: 'text-amber-600', bg: 'bg-amber-50' }
               ].map((kpi, i) => (
                 <div key={i} className="p-6 bg-white border border-slate-100 rounded-[24px] shadow-sm group">
                    <div className="flex items-center gap-2.5 mb-4">
                       <div className={`w-8 h-8 rounded-xl ${kpi.bg} ${kpi.color} flex items-center justify-center shadow-sm`}>
                          <kpi.icon size={16} strokeWidth={2.5} />
                       </div>
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">{kpi.label}</span>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                       <span className="text-3xl font-black font-mono text-slate-900 tracking-tighter">{kpi.val}</span>
                       <span className="text-[10px] font-black text-slate-400 uppercase">{kpi.unit}</span>
                    </div>
                 </div>
               ))}
            </div>

            {/* Trends Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               <div className="bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm">
                  <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2 mb-6 px-1">
                     <TrendingUp size={14} className="text-primary-500" /> QPS 吞吐轨迹 (1H)
                  </h4>
                  <MonitoringChart data={qpsTrend} height={200} color="#1B58F4" label="QPS" unit="" />
               </div>
               <div className="bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm">
                  <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2 mb-6 px-1">
                     <ArrowRightLeft size={14} className="text-indigo-500" /> 响应延迟分布 (MS)
                  </h4>
                  <MonitoringChart data={latencyTrend} height={200} color="#6366f1" label="Latency" unit="ms" />
               </div>
            </div>

            {/* Resource utilization & Logs */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-1 space-y-4">
                  <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
                     <Zap size={14} className="text-amber-500" /> 容器资源载荷水位
                  </h4>
                  <div className="bg-white border border-slate-200 rounded-3xl p-7 shadow-sm space-y-7">
                     <ResourceProgress label="CPU UTILIZATION" value={42} color="bg-primary-500" icon={Cpu} />
                     <ResourceProgress label="VRAM (GPU) LOAD" value={88} color="bg-emerald-500" icon={Zap} />
                     <ResourceProgress label="MEMORY COMMIT" value={65} color="bg-indigo-500" icon={ActivitySquare} />
                     <ResourceProgress label="BLOCK STORAGE" value={30} color="bg-amber-500" icon={Database} />
                  </div>
               </div>

               <div className="lg:col-span-2 space-y-4">
                  <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
                     <TerminalSquare size={14} className="text-slate-400" /> 实时生产日志 (STDOUT)
                  </h4>
                  <div className="bg-slate-950 border border-slate-800 rounded-[32px] p-6 shadow-inner h-[280px] overflow-y-auto font-mono text-[11px] leading-relaxed relative group">
                     <div className="space-y-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                        <p className="text-slate-500 flex gap-4"><span className="shrink-0 w-20">[14:15:01]</span> <span className="text-emerald-500 w-10">INFO</span> Load balancer mapping synced to VPC-9921</p>
                        <p className="text-slate-500 flex gap-4"><span className="shrink-0 w-20">[14:15:04]</span> <span className="text-emerald-500 w-10">INFO</span> Inference request processed in 124ms</p>
                        <p className="text-slate-500 flex gap-4"><span className="shrink-0 w-20">[14:15:10]</span> <span className="text-amber-500 w-10">WARN</span> VRAM fragmenting on CUDA:0</p>
                        <p className="text-slate-500 flex gap-4"><span className="shrink-0 w-20">[14:15:15]</span> <span className="text-emerald-500 w-10">INFO</span> Weights cached in shared memory</p>
                        <p className="text-slate-500 flex gap-4"><span className="shrink-0 w-20">[14:15:22]</span> <span className="text-blue-500 w-10">EVNT</span> Health check: Nominal</p>
                        <div className="w-1.5 h-3.5 bg-primary-500 animate-pulse mt-1 ml-24"></div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* 2. 服务资产审计抽屉 (Service Asset Drawer) */}
      <Drawer
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        title={<div className="flex items-center gap-2"><Info size={20} className="text-primary-600" /><span className="font-black uppercase tracking-tight">服务资产全维审计</span></div>}
        description={selectedService ? `ID: ${selectedService.id}` : ''}
        width="max-w-4xl"
        footer={<button onClick={() => setIsDetailsOpen(false)} className="w-full py-3 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary-600 transition-all">DONE / CLOSE AUDIT</button>}
      >
        {selectedService && (
          <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500 pb-10">
            <div className="bg-slate-950 rounded-[32px] p-8 border border-slate-800 relative overflow-hidden shadow-2xl">
               <div className="absolute top-0 right-0 p-10 opacity-5 text-white pointer-events-none"><Rocket size={200} strokeWidth={1} /></div>
               <div className="relative z-10">
                  <div className="flex justify-between items-start">
                     <Badge status={selectedService.status === 'running' ? 'success' : 'neutral'} showDot>{selectedService.status.toUpperCase()}</Badge>
                     <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">{selectedService.protocol} PROTOCOL</span>
                  </div>
                  <h4 className="text-4xl font-black text-white tracking-tighter uppercase mt-6">{selectedService.name}</h4>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-8 pt-8 border-t border-white/10">
                     <div><p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">关联模型</p><p className="text-sm font-bold text-white">{selectedService.modelName}</p></div>
                     <div><p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">模板版本</p><p className="text-sm font-bold text-primary-400 font-mono">{selectedService.modelVersion}</p></div>
                     <div><p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">创建时间</p><p className="text-sm font-bold text-slate-300 font-mono">{selectedService.createdAt}</p></div>
                     <div><p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">运行时长</p><p className="text-sm font-bold text-emerald-400 font-mono">{selectedService.uptime}</p></div>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div className="space-y-4">
                  <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 px-1"><Network size={14} className="text-primary-500" /> 访问配置 (ACCESS)</h5>
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                     {[
                        { label: 'API ENDPOINT', value: selectedService.endpoint, mono: true, copyable: true, icon: Link },
                        { label: '基础路径 (BASE)', value: selectedService.basePath || '/', mono: true, icon: Command },
                        { label: '安全协议', value: 'TLS 1.3 / HTTPS', icon: Globe }
                     ].map((item, i) => (
                        <div key={i} className="flex flex-col gap-1.5 pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">{item.icon && <item.icon size={12} />} {item.label}</span>
                           <div className="flex items-center justify-between group">
                              <span className={`text-xs font-bold text-slate-800 ${item.mono ? 'font-mono tracking-tight' : ''}`}>{item.value}</span>
                              {item.copyable && (
                                 <button onClick={() => handleCopy(item.value, `copy-${item.label}`)} className="p-1.5 text-slate-300 hover:text-primary-600 opacity-0 group-hover:opacity-100 transition-all">
                                    {copiedId === `copy-${item.label}` ? <CheckCircle2 size={12} className="text-emerald-500" /> : <Copy size={12} />}
                                 </button>
                              )}
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
               <div className="space-y-4">
                  <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 px-1"><Server size={14} className="text-primary-500" /> 算力规格 (SPEC)</h5>
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
                     <div className="grid grid-cols-3 gap-4">
                        {[
                           { label: 'CPU', val: selectedService.cpu, icon: Cpu, color: 'text-primary-600' },
                           { label: 'GPU', val: selectedService.gpu, icon: Zap, color: 'text-emerald-600' },
                           { label: 'MEM', val: selectedService.memory, icon: Database, color: 'text-indigo-600' }
                        ].map((res, i) => (
                           <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center">
                              <res.icon size={16} className={`${res.color} mb-2`} />
                              <p className="text-xs font-black text-slate-900">{res.val}</p>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
            {/* SDK Snippets */}
            <div className="space-y-6">
               <div className="flex justify-between items-center px-1">
                  <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.25em] flex items-center gap-2.5"><Code size={16} className="text-primary-600" /> 服务接入代码示例</h5>
                  <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                     <button onClick={() => setSnippetTab('curl')} className={`px-6 py-2 text-[10px] font-black rounded-lg transition-all ${snippetTab === 'curl' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-400'}`}>cURL</button>
                     <button onClick={() => setSnippetTab('python')} className={`px-6 py-2 text-[10px] font-black rounded-lg transition-all ${snippetTab === 'python' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-400'}`}>PYTHON</button>
                  </div>
               </div>
               <div className="bg-slate-950 rounded-[32px] border border-slate-800 p-6 font-mono text-[11px] leading-relaxed text-primary-300 overflow-x-auto shadow-2xl">
                  {snippetTab === 'curl' ? <pre>{getCurlSnippet(selectedService)}</pre> : <pre className="text-slate-300">{getPythonSnippet(selectedService)}</pre>}
               </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* 3. 停止服务确认 (Stop Confirm Modal) */}
      {isStopConfirmOpen && stoppingService && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsStopConfirmOpen(false)}></div>
          <div className="relative bg-white rounded-4xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200 border border-red-100 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-red-500"></div>
            <div className="px-8 py-10 text-center">
               <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-100 relative">
                  <AlertTriangle size={36} className="text-red-500 relative z-10" />
               </div>
               <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">确认停止在线服务？</h3>
               <p className="text-[11px] text-slate-500 leading-relaxed px-6 font-medium uppercase">警告：服务停止后，对应的访问 Endpoint 将立即注销。</p>
            </div>
            <div className="px-8 py-6 bg-slate-50 border-t border-slate-200 flex gap-4">
               <button onClick={() => setIsStopConfirmOpen(false)} className="flex-1 px-4 py-3 bg-white border border-slate-300 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100">取消</button>
               <button onClick={confirmStopService} className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 shadow-xl transition-all">确认停止</button>
            </div>
          </div>
        </div>
      )}

      <PageHeader 
        icon={Rocket} title="在线推理服务" subtitle="HIGH AVAILABILITY PRODUCTION ENDPOINTS" badgeText="PRODUCTION READY"
        actions={<button onClick={() => setIsDeployModalOpen(true)} className="flex items-center gap-2.5 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-primary-500/20 active:scale-95"><Plus size={16} strokeWidth={2.5} /><span>发布在线服务</span></button>}
      />

      <div className="flex justify-between items-center bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
         <div className="relative group w-full md:w-96">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-500 transition-colors" />
            <input type="text" placeholder="搜索服务名称或 ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-11 pr-4 py-2.5 text-[10px] font-black uppercase tracking-widest border border-slate-200 rounded-2xl bg-white focus:outline-none focus:border-primary-500 w-full transition-all" />
         </div>
         <button className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-400 hover:text-primary-600 transition-all"><RefreshCw size={18} /></button>
      </div>

      <div className="bg-white border border-slate-200 rounded-4xl shadow-sm overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50/50 text-slate-400 border-b border-slate-200 whitespace-nowrap">
                     <th className="pl-10 pr-6 py-6 text-[10px] font-black uppercase tracking-[0.3em]">服务名称 & 实例ID</th>
                     <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.3em]">关联模型 & 版本</th>
                     <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.3em]">服务状态</th>
                     <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.3em]">推理 QPS</th>
                     <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.3em]">响应延迟</th>
                     <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.3em]">创建信息</th>
                     <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-right">操作</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {services.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())).map(svc => {
                     const visual = getStatusConfig(svc.status);
                     const isRunning = svc.status === 'running';
                     const isStopped = svc.status === 'stopped';
                     const isFailed = svc.status === 'failed';
                     
                     return (
                        <tr key={svc.id} className="group hover:bg-slate-50/80 transition-all cursor-pointer">
                           <td className="pl-10 pr-6 py-7">
                              <div className="flex items-center gap-4">
                                 <div className={`w-10 h-10 border rounded-xl flex items-center justify-center transition-colors ${isRunning ? 'bg-primary-50 border-primary-100 text-primary-600' : 'bg-slate-50 border-slate-100 text-slate-400'}`}><Terminal size={18} strokeWidth={2.5} /></div>
                                 <div className="flex flex-col"><span className="font-black text-slate-900 tracking-tight text-sm uppercase group-hover:text-primary-600 transition-colors">{svc.name}</span><span className="font-mono text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">{svc.id}</span></div>
                              </div>
                           </td>
                           <td className="px-6 py-7">
                              <div className="flex flex-col gap-1"><span className="text-[11px] font-black text-slate-700 tracking-tight uppercase flex items-center gap-1.5"><Box size={12} className="text-slate-300" /> {svc.modelName}</span><Badge status="primary" showDot={false}>{svc.modelVersion}</Badge></div>
                           </td>
                           <td className="px-6 py-7"><div className="flex items-center gap-2"><div className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'animate-pulse' : ''} ${visual.dot}`}></div><Badge status={visual.variant}>{visual.label}</Badge></div></td>
                           <td className="px-6 py-7"><div className="flex items-center gap-2"><Activity size={14} className="text-primary-400" /><span className="font-mono font-black text-slate-900 text-sm tracking-tighter">{svc.qps?.toLocaleString() || '0'} <span className="text-[9px] text-slate-400 font-sans">REQ/S</span></span></div></td>
                           <td className="px-6 py-7"><div className="flex items-center gap-2"><Clock size={14} className={svc.latency && svc.latency > 200 ? 'text-amber-500' : 'text-emerald-500'} /><span className={`font-mono font-black text-sm tracking-tighter ${svc.latency && svc.latency > 200 ? 'text-amber-600' : 'text-slate-900'}`}>{svc.latency || '-'} <span className="text-[9px] text-slate-400 font-sans uppercase">ms</span></span></div></td>
                           <td className="px-6 py-7"><div className="flex flex-col gap-1"><div className="flex items-center gap-1.5 text-[10px] font-black text-slate-600 uppercase tracking-tighter"><Clock size={12} className="text-slate-300" /> {svc.createdAt}</div><div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest"><User size={12} className="text-slate-300" /> {svc.owner}</div></div></td>
                           <td className="px-10 py-7 text-right">
                              <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-all duration-300">
                                 {isRunning && (
                                    <>
                                       <button onClick={() => handleAction(svc.id, 'service-monitor')} className="p-2.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all" title="服务监控遥测"><Gauge size={18} strokeWidth={2.5} /></button>
                                       <button onClick={() => handleAction(svc.id, 'details')} className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all" title="服务资产详情"><Info size={18} strokeWidth={2.5} /></button>
                                       <button onClick={() => handleAction(svc.id, 'experience')} className="p-2.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all" title="在线体验"><MonitorPlay size={18} strokeWidth={2.5} /></button>
                                       <button onClick={() => handleAction(svc.id, 'stop')} className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all" title="停止服务"><StopCircle size={18} strokeWidth={2.5} /></button>
                                    </>
                                 )}
                                 {isStopped && <button onClick={() => handleAction(svc.id, 'start')} className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all" title="启动服务"><PlayCircle size={18} strokeWidth={2.5} /></button>}
                                 {isFailed && (
                                    <>
                                       <button onClick={() => handleAction(svc.id, 'restart')} className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all" title="重启服务"><RotateCw size={18} strokeWidth={2.5} /></button>
                                       <button onClick={() => handleAction(svc.id, 'details')} className="p-2.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all" title="查看异常详情"><Info size={18} strokeWidth={2.5} /></button>
                                    </>
                                 )}
                                 <button className="p-2.5 text-slate-300 hover:text-slate-900 transition-all ml-1"><MoreHorizontal size={18} /></button>
                              </div>
                           </td>
                        </tr>
                     );
                  })}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

export default OnlineServicesPage;
