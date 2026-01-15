
import React, { useState } from 'react';
import { 
  Rocket, Search, Plus, RefreshCw, 
  Activity, Globe, Terminal, ShieldCheck,
  ChevronRight, MoreHorizontal, Copy, CheckCircle2,
  Trash2, Play, Square, Settings, Info,
  ExternalLink, BarChart3, Database, Box,
  Cpu, Zap, MonitorPlay, RotateCw, PlayCircle, StopCircle,
  AlertTriangle, X, Gauge, LineChart, MessageSquare, Layout,
  Network, Code, Server, Fingerprint, Clock, Link, ShieldAlert,
  Hash
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { DeployServiceModal } from '../../components/modals/DeployServiceModal';
import { MOCK_INFERENCE_SERVICES } from '../../constants';
import PageHeader from '../../components/layout/PageHeader';
import { Drawer } from '../../components/ui/Drawer';

const OnlineServicesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [services, setServices] = useState(MOCK_INFERENCE_SERVICES);
  
  // 状态管理：操作弹窗与抽屉
  const [stoppingService, setStoppingService] = useState<any | null>(null);
  const [isStopConfirmOpen, setIsStopConfirmOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [snippetTab, setSnippetTab] = useState<'curl' | 'python'>('curl');

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAction = (id: string, action: 'start' | 'stop' | 'restart' | 'details' | 'service-monitor' | 'experience') => {
    const service = services.find(s => s.id === id);
    if (!service) return;

    switch (action) {
      case 'details':
        setSelectedService(service);
        setIsDetailsOpen(true);
        break;
      case 'service-monitor':
        alert(`系统正在为 [${service.name}] 初始化实时遥测看板...`);
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
        setServices(prev => prev.map(s => s.id === id ? { ...s, status: 'running' as any } : s));
        break;
    }
  };

  const confirmStopService = () => {
    if (!stoppingService) return;
    setServices(prev => prev.map(s => 
      s.id === stoppingService.id ? { ...s, status: 'stopped' as any } : s
    ));
    setIsStopConfirmOpen(false);
    setStoppingService(null);
  };

  const getStatusVisual = (status: string) => {
    switch (status) {
      case 'running': return { color: 'bg-emerald-500', label: '运行中', pulse: true };
      case 'deploying': return { color: 'bg-amber-500', label: '启动中', pulse: true };
      case 'failed': return { color: 'bg-red-500', label: '异常', pulse: false };
      case 'stopped': return { color: 'bg-slate-400', label: '已停止', pulse: false };
      default: return { color: 'bg-slate-300', label: status, pulse: false };
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 font-sans pb-20">
      <DeployServiceModal isOpen={isDeployModalOpen} onClose={() => setIsDeployModalOpen(false)} />

      {/* 1. 停止服务二次确认弹窗 */}
      {isStopConfirmOpen && stoppingService && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsStopConfirmOpen(false)}></div>
          <div className="relative bg-white rounded-4xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200 border border-red-100 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-red-500"></div>
            <div className="px-8 pt-12 pb-10 text-center">
               <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-100 relative">
                  <div className="absolute inset-0 bg-red-200 rounded-full animate-ping opacity-20"></div>
                  <AlertTriangle size={36} className="text-red-500 relative z-10" />
               </div>
               <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">确认停止在线服务？</h3>
               <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-8">
                  <div className="flex flex-col gap-1 text-left">
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">目标服务标识 (TARGET ID)</span>
                     <span className="text-base font-bold text-slate-900 uppercase tracking-tight">{stoppingService.name}</span>
                     <span className="text-xs font-mono text-slate-500">{stoppingService.id}</span>
                  </div>
               </div>
               <p className="text-[11px] text-slate-500 leading-relaxed px-6 font-medium">
                 警告：服务停止后，对应的 <span className="text-red-600 font-black">Endpoint 访问地址</span> 将立即注销。请确保负载均衡器已完成流量平滑切换。
               </p>
            </div>
            <div className="px-8 py-6 bg-slate-50 border-t border-slate-200 flex gap-4">
               <button onClick={() => setIsStopConfirmOpen(false)} className="flex-1 px-4 py-3 bg-white border border-slate-300 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95">取消操作</button>
               <button onClick={confirmStopService} className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 shadow-xl shadow-red-500/20 transition-all active:scale-95">确认停止</button>
            </div>
          </div>
        </div>
      )}

      {/* 2. 重构的服务详情抽屉 */}
      <Drawer
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        title={
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white shadow-lg">
              <Info size={16} strokeWidth={2.5} />
            </div>
            <span className="font-black uppercase tracking-tight text-slate-900">服务资产审计报告</span>
          </div>
        }
        description={selectedService ? `REF_ID: ${selectedService.id}` : ''}
        width="max-w-4xl"
        footer={
          <button onClick={() => setIsDetailsOpen(false)} className="w-full py-3 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary-600 transition-all shadow-xl active:scale-95">
             DONE / CLOSE AUDIT
          </button>
        }
      >
        {selectedService && (
          <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500 pb-10">
            {/* Header Identity Card */}
            <div className="bg-slate-950 rounded-[32px] p-8 border border-slate-800 relative overflow-hidden shadow-2xl">
               <div className="absolute top-0 right-0 p-10 opacity-5 text-white pointer-events-none"><Rocket size={200} strokeWidth={1} /></div>
               <div className="relative z-10">
                  <div className="flex justify-between items-start">
                     <Badge status={selectedService.status === 'running' ? 'success' : 'neutral'} showDot>{selectedService.status.toUpperCase()}</Badge>
                     <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">{selectedService.protocol} PROTOCOL</span>
                  </div>
                  <h4 className="text-4xl font-black text-white tracking-tighter uppercase mt-6">{selectedService.name}</h4>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-8 pt-8 border-t border-white/10">
                     <div>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">关联模型资产</p>
                        <p className="text-sm font-bold text-white">{selectedService.modelName}</p>
                     </div>
                     <div>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">模板版本</p>
                        <p className="text-sm font-bold text-primary-400 font-mono">{selectedService.modelVersion}</p>
                     </div>
                     <div>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">创建时间</p>
                        <p className="text-sm font-bold text-slate-300 font-mono">{selectedService.createdAt}</p>
                     </div>
                     <div>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">运行时长 (UPTIME)</p>
                        <p className="text-sm font-bold text-emerald-400 font-mono">{selectedService.uptime}</p>
                     </div>
                  </div>
               </div>
            </div>

            {/* Grid Layout for Detailed Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               {/* 访问配置板块 */}
               <div className="space-y-4">
                  <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
                     <Network size={14} className="text-primary-500" /> 访问配置 (ACCESS STRATEGY)
                  </h5>
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                     {[
                        { label: 'API 终端地址', value: selectedService.endpoint, mono: true, copyable: true, icon: Link },
                        { label: '服务端口', value: '443 / 8080', mono: true, icon: Hash },
                        { label: '基础路径 (BASE)', value: '/v1/inference', mono: true, icon: FolderOpen },
                        { label: '健康检查路径', value: '/healthz', mono: true, icon: ShieldCheck },
                        { label: '安全协议', value: 'TLS 1.3 / HTTPS', icon: Globe }
                     ].map((item, i) => (
                        <div key={i} className="flex flex-col gap-1.5 pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                             {item.icon && <item.icon size={12} />} {item.label}
                           </span>
                           <div className="flex items-center justify-between group">
                              <span className={`text-xs font-bold text-slate-800 ${item.mono ? 'font-mono tracking-tight' : ''}`}>{item.value}</span>
                              {item.copyable && (
                                 <button onClick={() => handleCopy(item.value, 'copy-endpoint')} className="p-1.5 text-slate-300 hover:text-primary-600 transition-colors opacity-0 group-hover:opacity-100">
                                    {copiedId === 'copy-endpoint' ? <CheckCircle2 size={12} className="text-emerald-500" /> : <Copy size={12} />}
                                 </button>
                              )}
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               {/* 资源与编排板块 */}
               <div className="space-y-4">
                  <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
                     <Server size={14} className="text-primary-500" /> 资源与编排 (INFRASTRUCTURE)
                  </h5>
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
                     <div className="grid grid-cols-3 gap-4">
                        {[
                           { label: 'CPU Cores', val: selectedService.cpu, icon: Cpu, color: 'text-primary-600' },
                           { label: 'GPU Units', val: selectedService.gpu, icon: Zap, color: 'text-emerald-600' },
                           { label: 'Memory', val: selectedService.memory, icon: Database, color: 'text-indigo-600' }
                        ].map((res, i) => (
                           <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center text-center">
                              <res.icon size={16} className={`${res.color} mb-2`} />
                              <p className="text-[8px] font-black text-slate-400 uppercase mb-1">{res.label}</p>
                              <p className="text-xs font-black text-slate-900">{res.val}</p>
                           </div>
                        ))}
                     </div>
                     <div className="space-y-4">
                        <div className="flex flex-col gap-1.5">
                           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Box size={12} /> 镜像地址</span>
                           <div className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-mono font-bold text-slate-600 break-all leading-relaxed">
                              registry.ai-nex.io/inference/vllm-openai:v0.4.2-cuda12.1
                           </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><MapPin size={12} /> 计算节点/区域</span>
                           <div className="flex items-center gap-2">
                              <Badge status="primary" showDot={false}>SZX-PROD-CLUSTER-01</Badge>
                              <span className="text-[10px] font-mono font-black text-slate-400">NodePool: gpu-high-performance</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* 代码示例板块 */}
            <div className="space-y-4">
               <div className="flex justify-between items-center px-1">
                  <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                     <Code size={14} className="text-primary-500" /> 开发者调用示例 (SDK & CURL)
                  </h5>
                  <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                     <button onClick={() => setSnippetTab('curl')} className={`px-4 py-1.5 text-[9px] font-black rounded-lg transition-all ${snippetTab === 'curl' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-400'}`}>CURL</button>
                     <button onClick={() => setSnippetTab('python')} className={`px-4 py-1.5 text-[9px] font-black rounded-lg transition-all ${snippetTab === 'python' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-400'}`}>PYTHON SDK</button>
                  </div>
               </div>
               <div className="bg-slate-950 rounded-[32px] p-6 border border-slate-800 shadow-2xl relative group">
                  <button className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 transition-all opacity-0 group-hover:opacity-100">
                     <Copy size={14} />
                  </button>
                  <pre className="font-mono text-[11px] text-primary-300 overflow-x-auto leading-relaxed">
                     {snippetTab === 'curl' ? (
`curl -X POST "${selectedService.endpoint}/completions" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "${selectedService.modelName}",
    "prompt": "Say this is a test!",
    "max_tokens": 7,
    "temperature": 0
  }'`
                     ) : (
`import openai

client = openai.OpenAI(
    base_url="${selectedService.endpoint}",
    api_key="YOUR_API_KEY"
)

response = client.completions.create(
    model="${selectedService.modelName}",
    prompt="Say this is a test!",
    max_tokens=7
)

print(response.choices[0].text)`
                     )}
                  </pre>
               </div>
            </div>
          </div>
        )}
      </Drawer>

      <PageHeader 
        icon={Rocket}
        title="在线推理服务 (Online)"
        subtitle="HIGH AVAILABILITY PRODUCTION ENDPOINTS"
        badgeText="PRODUCTION GRADE"
        actions={
          <button 
            onClick={() => setIsDeployModalOpen(true)}
            className="flex items-center gap-2.5 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-primary-500/20 active:scale-95"
          >
            <Plus size={16} strokeWidth={3} />
            <span>发布在线服务</span>
          </button>
        }
      />

      <div className="flex justify-between items-center bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
         <div className="relative group w-full md:w-96">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-500 transition-colors" />
            <input 
              type="text" 
              placeholder="SEARCH BY SERVICE NAME OR ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 pr-4 py-2.5 text-[10px] font-black uppercase tracking-widest border border-slate-200 rounded-2xl bg-white focus:outline-none focus:border-primary-500 w-full transition-all font-sans placeholder:text-slate-200" 
            />
         </div>
         <button className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-400 hover:text-primary-600 transition-all">
            <RefreshCw size={18} />
         </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-4xl shadow-sm overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50/50 text-slate-400 border-b border-slate-200 whitespace-nowrap">
                     <th className="pl-10 pr-6 py-6 text-[10px] font-black uppercase tracking-[0.3em]">服务标识</th>
                     <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.3em]">模型资产</th>
                     <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.3em]">运行状态</th>
                     <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-center">实例副本</th>
                     <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.3em]">算力规格</th>
                     <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.3em]">ENDPOINT</th>
                     <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-right">管理操作</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {services.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.id.toLowerCase().includes(searchTerm.toLowerCase())).map(svc => {
                     const visual = getStatusVisual(svc.status);
                     const isRunning = svc.status === 'running';
                     return (
                        <tr key={svc.id} className="group hover:bg-slate-50/80 transition-all cursor-pointer">
                           <td className="pl-10 pr-6 py-7">
                              <div className="flex items-center gap-4">
                                 <div className={`w-10 h-10 border rounded-xl flex items-center justify-center transition-colors ${isRunning ? 'bg-primary-50 border-primary-100 text-primary-600 shadow-sm' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                                    <Terminal size={18} strokeWidth={2.5} />
                                 </div>
                                 <div className="flex flex-col">
                                    <span className="font-black text-slate-900 tracking-tight text-sm uppercase group-hover:text-primary-600 transition-colors">{svc.name}</span>
                                    <span className="font-mono text-[9px] font-bold text-slate-400 mt-1 tracking-tighter uppercase">{svc.id}</span>
                                 </div>
                              </div>
                           </td>
                           <td className="px-6 py-7">
                              <div className="flex flex-col gap-1">
                                 <span className="text-[11px] font-black text-slate-700 tracking-tight uppercase flex items-center gap-1.5"><Box size={12} className="text-slate-300" /> {svc.modelName}</span>
                                 <span className="text-[9px] font-mono font-bold text-primary-600 uppercase tracking-widest">{svc.modelVersion}</span>
                              </div>
                           </td>
                           <td className="px-6 py-7">
                              <div className="flex items-center gap-2">
                                 <div className={`w-1.5 h-1.5 rounded-full ${visual.color} ${visual.pulse ? 'animate-pulse' : ''}`}></div>
                                 <Badge status={isRunning ? 'success' : svc.status === 'stopped' ? 'neutral' : svc.status === 'failed' ? 'error' : 'warning'}>{visual.label.toUpperCase()}</Badge>
                              </div>
                           </td>
                           <td className="px-6 py-7 text-center">
                              <div className="inline-flex flex-col items-center">
                                 <span className="text-[13px] font-mono font-black text-slate-900 tracking-tighter">{svc.replicas.ready} <span className="text-slate-300">/</span> {svc.replicas.total}</span>
                                 <div className="w-12 h-1 bg-slate-100 rounded-full mt-2 overflow-hidden"><div className={`h-full ${visual.color} transition-all`} style={{ width: `${(svc.replicas.ready / svc.replicas.total) * 100}%` }} /></div>
                              </div>
                           </td>
                           <td className="px-6 py-7">
                              <div className="flex flex-col gap-1.5">
                                 <div className="flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-tighter"><Zap size={12} className="text-emerald-500" /> {svc.gpu}</div>
                                 <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">{svc.cpu} / {svc.memory}</div>
                              </div>
                           </td>
                           <td className="px-6 py-7">
                              <div className="flex items-center gap-1.5">
                                 <span className="px-2 py-1 bg-slate-900 text-white rounded font-mono text-[9px] font-bold shadow-sm">{svc.protocol}</span>
                                 <button onClick={(e) => { e.stopPropagation(); handleCopy(svc.endpoint, svc.id); }} className="p-1 text-slate-300 hover:text-primary-50 transition-colors">
                                    {copiedId === svc.id ? <CheckCircle2 size={12} className="text-emerald-500" /> : <Copy size={12} />}
                                 </button>
                              </div>
                           </td>
                           <td className="px-10 py-7 text-right">
                              <div className="flex items-center justify-end gap-1">
                                 {/* 服务详情 */}
                                 <button onClick={() => handleAction(svc.id, 'details')} className="p-2.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all" title="服务详情 (Audit Details)">
                                    <Info size={18} strokeWidth={2.5} />
                                 </button>
                                 
                                 {/* 服务监控 */}
                                 <button onClick={() => handleAction(svc.id, 'service-monitor')} className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all" title="服务监控 (Telemetry)">
                                    <Gauge size={18} strokeWidth={2.5} />
                                 </button>

                                 {/* 在线体验间 */}
                                 <button onClick={() => handleAction(svc.id, 'experience')} className="p-2.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all" title="在线体验间 (Experience Sandbox)">
                                    <MonitorPlay size={18} strokeWidth={2.5} />
                                 </button>

                                 {/* 启停控制 */}
                                 {isRunning ? (
                                    <button onClick={() => handleAction(svc.id, 'stop')} className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all" title="停止服务 (Terminate)">
                                       <StopCircle size={18} strokeWidth={2.5} />
                                    </button>
                                 ) : (
                                    <button onClick={() => handleAction(svc.id, 'start')} className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all" title="启动服务 (Start)">
                                       <PlayCircle size={18} strokeWidth={2.5} />
                                    </button>
                                 )}

                                 <button className="p-2.5 text-slate-300 hover:text-slate-900 transition-all ml-1">
                                    <MoreHorizontal size={18} />
                                 </button>
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

// 辅助图标组件
const FolderOpen = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.69.9H20a2 2 0 0 1 2 2v2"/></svg>
);
const MapPin = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
);

export default OnlineServicesPage;
