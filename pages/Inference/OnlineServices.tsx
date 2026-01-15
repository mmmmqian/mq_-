
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
  Download, ArrowRightLeft, History, Layers, Share2, Binary, MousePointer2
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { DeployServiceModal } from '../../components/modals/DeployServiceModal';
import { MOCK_INFERENCE_SERVICES, generateMetrics } from '../../constants';
import PageHeader from '../../components/layout/PageHeader';
import { Drawer } from '../../components/ui/Drawer';
import MonitoringChart from '../../components/ui/MonitoringChart';

type AuditTab = 'overview' | 'telemetry' | 'access' | 'specs';

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'running': return { label: '运行中', variant: 'success' as const };
    case 'deploying': return { label: '部署中', variant: 'warning' as const };
    case 'failed': return { label: '异常', variant: 'error' as const };
    case 'stopped': return { label: '已停止', variant: 'neutral' as const };
    default: return { label: '未知', variant: 'neutral' as const };
  }
};

const OnlineServicesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [services, setServices] = useState(MOCK_INFERENCE_SERVICES);
  
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<AuditTab>('overview');
  
  const [stoppingService, setStoppingService] = useState<any | null>(null);
  const [isStopConfirmOpen, setIsStopConfirmOpen] = useState(false);
  const [snippetTab, setSnippetTab] = useState<'curl' | 'python'>('curl');

  const latencyTrend = useMemo(() => generateMetrics(24, 120, 40), [selectedService?.id]);
  const qpsTrend = useMemo(() => generateMetrics(24, 800, 200), [selectedService?.id]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAction = (id: string, action: 'start' | 'stop' | 'restart' | 'audit' | 'monitor' | 'experience') => {
    const service = services.find(s => s.id === id);
    if (!service) return;

    setSelectedService(service);

    switch (action) {
      case 'audit':
        setActiveTab('overview');
        setIsAuditOpen(true);
        break;
      case 'monitor':
        setActiveTab('telemetry');
        setIsAuditOpen(true);
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
  };

  const ResourceProgress = ({ label, icon: Icon, value, color }: any) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-400">
        <span className="flex items-center gap-1.5"><Icon size={11} /> {label}</span>
        <span className={`font-mono ${value > 85 ? 'text-red-500 font-black' : 'text-slate-700'}`}>{value}%</span>
      </div>
      <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${value > 85 ? 'bg-red-500 animate-pulse' : color} transition-all duration-1000`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700 font-sans pb-24">
      <DeployServiceModal isOpen={isDeployModalOpen} onClose={() => setIsDeployModalOpen(false)} />

      <Drawer
        isOpen={isAuditOpen}
        onClose={() => setIsAuditOpen(false)}
        title={
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-slate-950 rounded-lg flex items-center justify-center text-white shadow-lg">
              <Box size={16} strokeWidth={2.5} />
            </div>
            <span className="font-black uppercase tracking-tight text-slate-900">服务资产全维审计中心</span>
          </div>
        }
        description={selectedService ? `IDENTITY: ${selectedService.name} (${selectedService.id})` : ''}
        width="max-w-5xl"
        footer={
          <div className="flex items-center justify-between w-full">
             <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Session Integrity: NOMINAL</span>
             </div>
             <button onClick={() => setIsAuditOpen(false)} className="px-10 py-3 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary-600 transition-all shadow-xl active:scale-95">
                CLOSE AUDIT
             </button>
          </div>
        }
      >
        {selectedService && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 pb-10">
            <div className="bg-slate-950 rounded-[32px] p-8 border border-slate-800 relative overflow-hidden shadow-2xl group">
               <div className="absolute top-0 right-0 p-10 opacity-5 text-white pointer-events-none group-hover:opacity-10 transition-opacity duration-700">
                  <Rocket size={200} strokeWidth={1} />
               </div>
               <div className="relative z-10">
                  <div className="flex justify-between items-start mb-8">
                     <div className="space-y-3">
                        <div className="flex items-center gap-3">
                           <Badge status={getStatusConfig(selectedService.status).variant} showDot>{selectedService.status.toUpperCase()}</Badge>
                           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{selectedService.protocol} PROTOCOL</span>
                        </div>
                        <h4 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">{selectedService.name}</h4>
                     </div>
                     <div className="flex flex-col items-end gap-1.5">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">累计运行时长 (UPTIME)</p>
                        <p className="text-xl font-black text-emerald-400 font-mono tracking-tight">{selectedService.uptime}</p>
                     </div>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8 border-t border-white/5">
                     <div className="space-y-1"><p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">关联模型</p><p className="text-sm font-bold text-white">{selectedService.modelName}</p></div>
                     <div className="space-y-1"><p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">发布版本</p><p className="text-sm font-bold text-primary-400 font-mono">{selectedService.modelVersion}</p></div>
                     <div className="space-y-1"><p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">负责人</p><p className="text-sm font-bold text-slate-300 uppercase">{selectedService.owner}</p></div>
                     <div className="space-y-1">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">副本健康度</p>
                        <div className="flex items-center gap-2">
                           <p className="text-sm font-black text-white font-mono">{selectedService.replicas.ready} / {selectedService.replicas.total}</p>
                           <div className="h-1 w-12 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-emerald-500" style={{width: `${(selectedService.replicas.ready/selectedService.replicas.total)*100}%`}}></div></div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="flex border-b border-slate-200 sticky top-0 bg-white z-20">
               {[
                 { id: 'overview', label: '基础审计 (OVERVIEW)', icon: Info },
                 { id: 'telemetry', label: '实时遥测 & 审计 (TELEMETRY)', icon: ActivitySquare },
                 { id: 'access', label: '接入控制 (ACCESS)', icon: Network },
                 { id: 'specs', label: '算力规格 (SPEC)', icon: Cpu }
               ].map(tab => (
                 <button 
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id as AuditTab)}
                   className={`px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 flex items-center gap-2.5 ${activeTab === tab.id ? 'border-primary-600 text-primary-600 bg-primary-50/20' : 'border-transparent text-slate-400 hover:text-slate-900'}`}
                 >
                    <tab.icon size={14} strokeWidth={2.5} />
                    {tab.label}
                 </button>
               ))}
            </div>

            <div className="min-h-[400px]">
               {activeTab === 'telemetry' && (
                  <div className="space-y-8 animate-in fade-in duration-500">
                     <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                           { label: '实时 QPS', val: selectedService.qps?.toLocaleString(), unit: 'REQ/S', icon: Activity, color: 'text-primary-600', bg: 'bg-primary-50' },
                           { label: 'P99 响应延迟', val: selectedService.latency, unit: 'MS', icon: Clock, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                           { label: '服务成功率', val: '99.98', unit: '%', icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                           { label: '异常拦截数', val: '0', unit: 'COUNT', icon: ShieldAlert, color: 'text-red-600', bg: 'bg-red-50' }
                        ].map((kpi, i) => (
                           <div key={i} className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-all">
                              <div className="flex items-center gap-2.5 mb-4">
                                 <div className={`w-8 h-8 rounded-xl ${kpi.bg} ${kpi.color} flex items-center justify-center shadow-sm`}><kpi.icon size={16} strokeWidth={2.5} /></div>
                                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{kpi.label}</span>
                              </div>
                              <div className="flex items-baseline gap-1.5">
                                 <span className="text-2xl font-black font-mono text-slate-900 tracking-tighter">{kpi.val}</span>
                                 <span className="text-[10px] font-black text-slate-400 uppercase">{kpi.unit}</span>
                              </div>
                           </div>
                        ))}
                     </div>

                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm group">
                           <div className="flex justify-between items-center mb-6">
                              <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2"><TrendingUp size={14} className="text-primary-600" /> 负载吞吐趋势 (1H)</h5>
                              <Badge status="info" showDot={false}>AUTO-RELOAD: 5S</Badge>
                           </div>
                           <MonitoringChart data={qpsTrend} height={200} color="#1B58F4" label="QPS" unit="" />
                        </div>
                        <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm group">
                           <div className="flex justify-between items-center mb-6">
                              <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2"><ArrowRightLeft size={14} className="text-indigo-600" /> 响应延迟分布 (MS)</h5>
                              <div className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">SLO: &lt; 200ms</div>
                           </div>
                           <MonitoringChart data={latencyTrend} height={200} color="#6366f1" label="Latency" unit="ms" />
                        </div>
                     </div>

                     <div className="space-y-5 pt-4">
                        <div className="flex justify-between items-center px-1">
                           <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2"><TerminalSquare size={14} className="text-slate-400" /> 生产审计与操作流 (AUDIT_STDOUT)</h5>
                           <button onClick={() => alert('正在归档日志包...')} className="flex items-center gap-2 px-5 py-2 bg-primary-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-700 shadow-xl shadow-primary-500/20 active:scale-95 transition-all">
                              <Download size={14} /> 导出完整审计日志
                           </button>
                        </div>
                        <div className="bg-slate-950 border border-slate-800 rounded-[32px] p-8 shadow-inner font-mono text-[11px] leading-relaxed h-[300px] overflow-y-auto group relative">
                           <div className="absolute top-4 right-4 z-10">
                              <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-lg backdrop-blur-md">
                                 <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                                 <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none">Live Telemetry Stream</span>
                              </div>
                           </div>
                           <div className="space-y-2 opacity-80 group-hover:opacity-100 transition-opacity">
                              <p className="text-slate-500 flex gap-4"><span className="shrink-0 w-32">[14:15:01.002]</span> <span className="text-emerald-500 font-black w-10">INFO</span> Gateway health probe: Succeeded</p>
                              <p className="text-slate-500 flex gap-4"><span className="shrink-0 w-32">[14:15:04.421]</span> <span className="text-emerald-500 font-black w-10">INFO</span> Request handled in 124ms (TraceID: b8a2)</p>
                              <p className="text-slate-500 flex gap-4"><span className="shrink-0 w-32">[14:15:10.152]</span> <span className="text-amber-500 font-black w-10">WARN</span> VRAM fragmentation detected: 12% at CUDA:0</p>
                              <p className="text-slate-500 flex gap-4"><span className="shrink-0 w-32">[14:15:15.892]</span> <span className="text-emerald-500 font-black w-10">INFO</span> KV Cache optimized for model SVC-9921</p>
                              <p className="text-slate-500 flex gap-4"><span className="shrink-0 w-32">[14:15:22.012]</span> <span className="text-blue-500 font-black w-10">EVNT</span> Autoscaler synced 4 replicas from K8s Controller</p>
                              <div className="w-1.5 h-3.5 bg-primary-500 animate-pulse mt-1 ml-36"></div>
                           </div>
                        </div>
                     </div>
                  </div>
               )}

               {activeTab === 'specs' && (
                  <div className="space-y-8 animate-in fade-in duration-500">
                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1 space-y-4">
                           <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 px-1"><Zap size={14} className="text-amber-500" /> 容器载荷水位 (RESOURCE_LOAD)</h5>
                           <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm space-y-8">
                              <ResourceProgress label="CPU UTILIZATION" value={42} color="bg-primary-500" icon={Cpu} />
                              <ResourceProgress label="GPU CORE LOAD" value={78} color="bg-emerald-500" icon={Zap} />
                              <ResourceProgress label="VRAM COMMIT" value={65} color="bg-indigo-500" icon={ActivitySquare} />
                              <ResourceProgress label="BLOCK STORAGE" value={30} color="bg-amber-500" icon={Database} />
                           </div>
                        </div>
                        <div className="lg:col-span-2 space-y-4">
                           <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 px-1"><Server size={14} className="text-primary-500" /> 调度节点阵列 (PHYSICAL_PLACEMENT)</h5>
                           <div className="bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm overflow-hidden">
                              <div className="overflow-x-auto">
                                 <table className="w-full text-left">
                                    <thead>
                                       <tr className="bg-slate-50 border-b border-slate-100"><th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Pod ID / Node IP</th><th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</th><th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Age</th></tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                       {[1, 2, 3, 4].map(i => (
                                          <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                                             <td className="px-6 py-4">
                                                <div className="flex flex-col"><span className="text-[11px] font-black text-slate-800 font-mono tracking-tight uppercase">{selectedService.name}-vllm-0{i}</span><span className="text-[9px] text-slate-400 font-mono font-bold mt-1">10.128.0.{10+i}</span></div>
                                             </td>
                                             <td className="px-6 py-4"><Badge status="success">READY</Badge></td>
                                             <td className="px-6 py-4 text-right font-mono text-[10px] font-bold text-slate-400">4d 12h</td>
                                          </tr>
                                       ))}
                                    </tbody>
                                 </table>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               )}

               {activeTab === 'access' && (
                  <div className="space-y-8 animate-in fade-in duration-500">
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-6">
                           <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 px-1"><Globe size={14} className="text-primary-500" /> API ENDPOINTS</h5>
                           <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm space-y-6">
                              {[
                                 { label: 'PRIMARY ENDPOINT', val: selectedService.endpoint, icon: Link, copyable: true },
                                 { label: 'HEALTH CHECK PATH', val: selectedService.healthPath || '/healthz', icon: Activity },
                                 { label: 'BASE_V1_PATH', val: selectedService.basePath || '/v1', icon: Command }
                              ].map((item, i) => (
                                 <div key={i} className="space-y-2 pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><item.icon size={12}/> {item.label}</span>
                                    <div className="flex items-center justify-between group">
                                       <span className="text-[12px] font-mono font-black text-slate-800 truncate pr-4">{item.val}</span>
                                       {item.copyable && (
                                          <button onClick={() => handleCopy(item.val, `copy-${item.label}`)} className="p-1.5 bg-slate-50 hover:bg-primary-50 text-slate-400 hover:text-primary-600 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                                             {copiedId === `copy-${item.label}` ? <CheckCircle2 size={12} className="text-emerald-500" /> : <Copy size={12} />}
                                          </button>
                                       )}
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>
                        <div className="space-y-6">
                           <div className="flex justify-between items-center px-1">
                              <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2"><Code size={14} className="text-primary-500" /> 调用代码示例 (SDK_SAMPLES)</h5>
                              <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                                 <button onClick={() => setSnippetTab('curl')} className={`px-4 py-1.5 text-[9px] font-black rounded-lg transition-all ${snippetTab === 'curl' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-400'}`}>cURL</button>
                                 <button onClick={() => setSnippetTab('python')} className={`px-4 py-1.5 text-[9px] font-black rounded-lg transition-all ${snippetTab === 'python' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-400'}`}>PYTHON</button>
                              </div>
                           </div>
                           <div className="bg-slate-950 rounded-[32px] border border-slate-800 p-8 shadow-2xl relative overflow-hidden group">
                              <button onClick={() => handleCopy(snippetTab === 'curl' ? 'curl -X...' : 'import requests...', 'snippet')} className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-primary-600 text-slate-400 hover:text-white rounded-xl transition-all opacity-0 group-hover:opacity-100 shadow-xl border border-white/5">
                                 {copiedId === 'snippet' ? <CheckCircle2 size={16} className="text-emerald-400" /> : <Copy size={16} />}
                              </button>
                              <div className="font-mono text-[11px] leading-relaxed text-primary-300 overflow-x-auto scrollbar-thin">
                                 {snippetTab === 'curl' ? (
                                    <pre>{`curl -X POST "${selectedService.endpoint}/predict" \\
  -H "Content-Type: application/json" \\
  -d '{"model": "${selectedService.modelName}", "prompt": "Hello"}'`}</pre>
                                 ) : (
                                    <pre>{`import requests

res = requests.post(
    "${selectedService.endpoint}/predict",
    json={"model": "${selectedService.modelName}", "prompt": "Hello"}
)
print(res.json())`}</pre>
                                 )}
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               )}

               {activeTab === 'overview' && (
                  <div className="space-y-8 animate-in fade-in duration-500">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                           <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 px-1"><Info size={14} className="text-primary-500" /> 资产元数据 (IDENTITY)</h5>
                           <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm divide-y divide-slate-50">
                              {[
                                 { label: '服务 UUID', val: selectedService.id, mono: true },
                                 { label: '所属项目', val: '核心算力中心 (szx-prod)', icon: Globe },
                                 { label: '镜像版本', val: selectedService.image || 'vllm:0.4.2-llama3', mono: true },
                                 { label: '部署日期', val: selectedService.createdAt, icon: Clock }
                              ].map((item, i) => (
                                 <div key={i} className="flex justify-between py-4 first:pt-0 last:pb-0 items-center">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</span>
                                    <span className={`text-[11px] font-bold ${item.mono ? 'font-mono text-slate-600' : 'text-slate-800'}`}>{item.val}</span>
                                 </div>
                              ))}
                           </div>
                        </div>
                        <div className="space-y-6">
                           <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 px-1"><ShieldCheck size={14} className="text-emerald-500" /> 服务合规合规审计 (AUDIT)</h5>
                           <div className="bg-slate-50 border border-slate-200 rounded-[32px] p-8 shadow-inner space-y-6">
                              <div className="flex gap-4">
                                 <div className="w-10 h-10 bg-white rounded-xl border border-slate-200 flex items-center justify-center text-emerald-600 shadow-sm shrink-0"><CheckCircle2 size={20} strokeWidth={2.5}/></div>
                                 <div>
                                    <p className="text-[11px] font-black text-slate-900 uppercase">健康检查状态: NOMINAL</p>
                                    <p className="text-[9px] text-slate-500 font-bold uppercase mt-1">Liveness and Readiness probes passed at 14:15:02</p>
                                 </div>
                              </div>
                              <div className="flex gap-4">
                                 <div className="w-10 h-10 bg-white rounded-xl border border-slate-200 flex items-center justify-center text-primary-600 shadow-sm shrink-0"><Fingerprint size={20} strokeWidth={2.5}/></div>
                                 <div>
                                    <p className="text-[11px] font-black text-slate-900 uppercase">鉴权策略: Bearer Token</p>
                                    <p className="text-[9px] text-slate-500 font-bold uppercase mt-1">Enabled with enterprise identity federation</p>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               )}
            </div>
          </div>
        )}
      </Drawer>

      {isStopConfirmOpen && stoppingService && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsStopConfirmOpen(false)}></div>
          <div className="relative bg-white rounded-4xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200 border border-red-100 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-red-500"></div>
            <div className="px-8 pt-10 pb-8 text-center">
               <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-100 relative">
                  <AlertTriangle size={36} className="text-red-500 relative z-10" />
               </div>
               <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">确认停止在线服务？</h3>
               <p className="text-[11px] text-slate-500 leading-relaxed px-6 font-medium uppercase">警告：服务停止后，对应的访问 Endpoint 将立即注销，正在进行的推理请求将被中断。</p>
            </div>
            <div className="px-8 py-6 bg-slate-50 border-t border-slate-200 flex gap-4">
               <button onClick={() => setIsStopConfirmOpen(false)} className="flex-1 px-4 py-3 bg-white border border-slate-300 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95">放弃</button>
               <button onClick={confirmStopService} className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 shadow-xl transition-all active:scale-95">确认停止</button>
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
            <input type="text" placeholder="搜索服务名称 or ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-11 pr-4 py-2.5 text-[10px] font-black uppercase tracking-widest border border-slate-200 rounded-2xl bg-white focus:outline-none focus:border-primary-500 w-full transition-all" />
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
                     <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.3em]">状态</th>
                     <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.3em]">QPS</th>
                     <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.3em]">时延</th>
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
                           <td className="pl-10 pr-6 py-5">
                              <div className="flex items-center gap-4">
                                 <div className={`w-10 h-10 border rounded-xl flex items-center justify-center transition-colors ${isRunning ? 'bg-primary-50 border-primary-100 text-primary-600' : 'bg-slate-50 border-slate-100 text-slate-400'}`}><Terminal size={18} strokeWidth={2.5} /></div>
                                 <div className="flex flex-col"><span className="font-black text-slate-900 tracking-tight text-sm uppercase group-hover:text-primary-600 transition-colors">{svc.name}</span><span className="font-mono text-[9px] font-bold text-slate-400 mt-0.5 uppercase tracking-tighter">{svc.id}</span></div>
                              </div>
                           </td>
                           <td className="px-6 py-5">
                              <div className="flex flex-col gap-1.5">
                                 <span className="text-[11px] font-black text-slate-700 tracking-tight uppercase flex items-center gap-1.5"><Box size={12} className="text-slate-300" /> {svc.modelName}</span>
                                 <div className="flex">
                                    <span className="px-2 py-0.5 bg-primary-50 text-primary-700 border border-primary-100 rounded text-[9px] font-mono font-black truncate max-w-[100px]" title={svc.modelVersion}>{svc.modelVersion}</span>
                                 </div>
                              </div>
                           </td>
                           <td className="px-6 py-5"><Badge status={visual.variant} showDot>{visual.label}</Badge></td>
                           <td className="px-6 py-5"><div className="flex items-center gap-2"><Activity size={14} className="text-primary-400" /><span className="font-mono font-black text-slate-900 text-sm tracking-tighter">{svc.qps?.toLocaleString() || '0'}</span></div></td>
                           <td className="px-6 py-5"><div className="flex items-center gap-2"><Clock size={14} className={svc.latency && svc.latency > 200 ? 'text-amber-500' : 'text-emerald-500'} /><span className={`font-mono font-black text-sm tracking-tighter ${svc.latency && svc.latency > 200 ? 'text-amber-600' : 'text-slate-900'}`}>{svc.latency || '-'}ms</span></div></td>
                           <td className="px-6 py-5"><div className="flex flex-col gap-1"><div className="flex items-center gap-1.5 text-[10px] font-black text-slate-600 uppercase tracking-tighter">{svc.createdAt}</div><div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest">{svc.owner}</div></div></td>
                           <td className="px-10 py-5 text-right">
                              <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-all duration-300">
                                 {/* 通用操作：服务详情 */}
                                 <button onClick={() => handleAction(svc.id, 'audit')} className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all" title="服务详情"><Info size={18} strokeWidth={2.5} /></button>
                                 
                                 {isRunning && (
                                    <>
                                       <button onClick={() => handleAction(svc.id, 'monitor')} className="p-2.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all" title="服务监控"><Gauge size={18} strokeWidth={2.5} /></button>
                                       <button onClick={() => handleAction(svc.id, 'experience')} className="p-2.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all" title="在线体验"><MonitorPlay size={18} strokeWidth={2.5} /></button>
                                       <button onClick={() => handleAction(svc.id, 'stop')} className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all" title="停止服务"><StopCircle size={18} strokeWidth={2.5} /></button>
                                    </>
                                 )}
                                 {isStopped && (
                                    <button onClick={() => handleAction(svc.id, 'start')} className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all" title="启动服务"><PlayCircle size={18} strokeWidth={2.5} /></button>
                                 )}
                                 {isFailed && (
                                    <button onClick={() => handleAction(svc.id, 'restart')} className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all" title="重启服务"><RotateCw size={18} strokeWidth={2.5} /></button>
                                 )}
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
