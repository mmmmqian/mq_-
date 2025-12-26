
import React, { useState, useMemo } from 'react';
import { Drawer } from '../ui/Drawer';
import { Badge } from '../ui/Badge';
import MonitoringChart from '../ui/MonitoringChart';
import { 
  Server, Activity, Box, Cpu, Zap, 
  HardDrive, Info, Search, Terminal,
  ShieldCheck, Globe, Database, Gauge, Monitor,
  Clock, AlertCircle, CheckCircle2, RefreshCw,
  Hash, Fingerprint, ExternalLink, ActivitySquare,
  Network
} from 'lucide-react';

interface NodeDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  node: any;
}

type TimeRange = '1h' | '24h' | '7d';

const generateNodeHistory = (base: number, range: TimeRange) => {
  const data: any[] = [];
  const now = new Date();
  let points = 24;
  let interval = 5 * 60000; 
  
  if (range === '1h') {
    points = 12;
    interval = 5 * 60000; 
  } else if (range === '24h') {
    points = 24;
    interval = 60 * 60000; 
  } else if (range === '7d') {
    points = 28; 
    interval = 6 * 60 * 60000; 
  }

  for (let i = points; i >= 0; i--) {
    const time = new Date(now.getTime() - i * interval);
    const timeStr = range === '7d' 
      ? time.toLocaleDateString([], { month: 'numeric', day: 'numeric', hour: '2-digit' })
      : time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
    data.push({
      time: timeStr,
      value: Math.max(0, Math.min(100, base + (Math.random() - 0.5) * 30))
    });
  }
  return data;
};

export const NodeDetailDrawer: React.FC<NodeDetailDrawerProps> = ({ isOpen, onClose, node }) => {
  const [activeTab, setActiveTab] = useState<'metrics' | 'pods' | 'specs'>('metrics');
  const [timeRange, setTimeRange] = useState<TimeRange>('1h');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const history = useMemo(() => ({
    cpu: generateNodeHistory(45, timeRange),
    mem: generateNodeHistory(62, timeRange),
    gpu: generateNodeHistory(78, timeRange),
    storage: generateNodeHistory(30, timeRange)
  }), [node?.id, timeRange, isRefreshing]);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1200);
  };

  const getNodeStatusVariant = (status: string): 'primary' | 'warning' | 'error' | 'neutral' => {
    switch(status?.toUpperCase()) {
      case 'READY': return 'primary';
      case 'WARNING': return 'warning';
      case 'NOTREADY': return 'error';
      default: return 'neutral';
    }
  };

  if (!node) return null;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Server size={20} className="text-primary-600" />
          <span>节点全维分析报告</span>
        </div>
      }
      description={`节点资产编号: ${node.id}`}
      width="max-w-5xl"
    >
      <div className="space-y-6">
        {/* 一体化节点指挥中心仪表盘 */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col lg:flex-row relative">
          
          {/* 左侧：身份标识与系统环境 */}
          <div className="lg:w-1/3 bg-slate-50 p-6 border-b lg:border-b-0 lg:border-r border-slate-200">
             <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg">
                   <Server size={24} strokeWidth={2.5} />
                </div>
                <div>
                   <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Node Hostname</h3>
                   <p className="text-lg font-black text-slate-900 mt-1 tracking-tight">{node.name}</p>
                </div>
             </div>

             <div className="space-y-5">
                <div className="flex items-start gap-3">
                   <Globe size={14} className="text-slate-400 mt-1" />
                   <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">网络地址 IPV4</p>
                      <p className="text-sm font-bold font-mono text-slate-700">{node.ip}</p>
                   </div>
                </div>
                <div className="flex items-start gap-3">
                   <ShieldCheck size={14} className="text-slate-400 mt-1" />
                   <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">操作系统发行版</p>
                      <p className="text-sm font-semibold text-slate-700">{node.os || 'Ubuntu 22.04 LTS'}</p>
                   </div>
                </div>
                <div className="flex items-start gap-3">
                   <Terminal size={14} className="text-slate-400 mt-1" />
                   <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">系统内核版本</p>
                      <p className="text-sm font-bold font-mono text-slate-600">{node.kernel || '5.15.0-generic'}</p>
                   </div>
                </div>
             </div>

             <div className="mt-8 pt-6 border-t border-slate-200">
                <div className="flex items-center justify-between">
                   <Badge status={getNodeStatusVariant(node.status)}>{node.status}</Badge>
                   <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">UPTIME: 42D 12H</span>
                </div>
             </div>
          </div>

          {/* 右侧：核心资源实时水位 */}
          <div className="lg:w-2/3 p-6 bg-white">
             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                <h4 className="text-xs font-black text-slate-900 flex items-center gap-2 uppercase tracking-widest">
                   <ActivitySquare size={16} className="text-primary-600" />
                   Live Resource Metrics
                </h4>
                
                <div className="flex items-center gap-3">
                   {/* 状态标签 */}
                   <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-black px-2 py-1 rounded border border-emerald-100 uppercase tracking-tighter">
                      <span className={`w-1.5 h-1.5 bg-emerald-500 rounded-full ${isRefreshing ? 'animate-ping' : 'animate-pulse'}`}></span>
                      {isRefreshing ? 'Polling...' : 'Real-time'}
                   </div>

                   {/* 手动刷新按钮 */}
                   <button 
                      onClick={handleManualRefresh}
                      disabled={isRefreshing}
                      className={`flex items-center gap-2 px-3 py-1 text-[10px] font-black uppercase tracking-widest transition-all duration-300 rounded-md border ${
                        isRefreshing 
                          ? 'bg-primary-50 border-primary-200 text-primary-600' 
                          : 'bg-white border-slate-200 text-slate-500 hover:border-primary-500 hover:text-primary-600 hover:shadow-sm active:scale-95'
                      }`}
                   >
                      <RefreshCw size={12} className={`${isRefreshing ? 'animate-spin' : ''}`} />
                      {isRefreshing ? 'Sync' : 'Refresh'}
                   </button>
                </div>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10">
                {/* CPU Gauge */}
                <div className="space-y-3">
                   <div className="flex justify-between items-end">
                      <div className="flex items-center gap-2">
                         <Cpu size={14} className="text-slate-400" />
                         <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider">CPU UTIL</span>
                      </div>
                      <span className={`text-xl font-mono font-black transition-all ${isRefreshing ? 'text-primary-600 blur-[1px]' : 'text-slate-900'}`}>
                        {Math.round((node.cpu.used / node.cpu.total) * 100)}%
                      </span>
                   </div>
                   <div className="h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/30">
                      <div 
                        className={`h-full bg-primary-600 transition-all duration-1000 ${isRefreshing ? 'animate-[shimmer_1s_infinite]' : ''}`} 
                        style={{ width: `${(node.cpu.used / node.cpu.total) * 100}%` }}
                      ></div>
                   </div>
                </div>

                {/* Memory Gauge */}
                <div className="space-y-3">
                   <div className="flex justify-between items-end">
                      <div className="flex items-center gap-2">
                         <Activity size={14} className="text-slate-400" />
                         <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider">MEM COMMIT</span>
                      </div>
                      <span className={`text-xl font-mono font-black transition-all ${isRefreshing ? 'text-indigo-600 blur-[1px]' : 'text-slate-900'}`}>
                        {Math.round((node.mem.used / node.mem.total) * 100)}%
                      </span>
                   </div>
                   <div className="h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/30">
                      <div 
                        className={`h-full bg-indigo-500 transition-all duration-1000 ${isRefreshing ? 'animate-[shimmer_1s_infinite]' : ''}`} 
                        style={{ width: `${(node.mem.used / node.mem.total) * 100}%` }}
                      ></div>
                   </div>
                </div>

                {/* GPU Gauge */}
                <div className="space-y-3">
                   <div className="flex justify-between items-end">
                      <div className="flex items-center gap-2">
                         <Zap size={14} className={`${node.gpu ? 'text-emerald-500' : 'text-slate-300'}`} />
                         <span className={`text-[11px] font-black uppercase tracking-wider ${node.gpu ? 'text-slate-500' : 'text-slate-300'}`}>GPU LOAD</span>
                      </div>
                      <span className={`text-xl font-mono font-black transition-all ${node.gpu ? (isRefreshing ? 'text-emerald-600 blur-[1px]' : 'text-slate-900') : 'text-slate-200'}`}>
                         {node.gpu ? `${node.gpu.utilization}%` : 'N/A'}
                      </span>
                   </div>
                   <div className="h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/30">
                      <div 
                        className={`h-full bg-emerald-500 transition-all duration-1000 ${isRefreshing ? 'animate-[shimmer_1s_infinite]' : ''}`} 
                        style={{ width: node.gpu ? `${node.gpu.utilization}%` : '0%' }}
                      ></div>
                   </div>
                </div>

                {/* Storage Gauge */}
                <div className="space-y-3">
                   <div className="flex justify-between items-end">
                      <div className="flex items-center gap-2">
                         <HardDrive size={14} className="text-slate-400" />
                         <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider">DISK I/O</span>
                      </div>
                      <span className={`text-xl font-mono font-black transition-all ${isRefreshing ? 'text-amber-600 blur-[1px]' : 'text-slate-900'}`}>
                        {Math.round((node.storage.used / node.storage.total) * 100)}%
                      </span>
                   </div>
                   <div className="h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/30">
                      <div 
                        className={`h-full bg-amber-500 transition-all duration-1000 ${isRefreshing ? 'animate-[shimmer_1s_infinite]' : ''}`} 
                        style={{ width: `${(node.storage.used / node.storage.total) * 100}%` }}
                      ></div>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* 详情 Tab */}
        <div className="flex border-b border-slate-200 bg-white sticky top-0 z-10">
           {[
             { id: 'metrics', label: 'Telemetric Trends', icon: Activity },
             { id: 'pods', label: 'Workload (Pods)', icon: Box },
             { id: 'specs', label: 'Hardware Specs', icon: Database }
           ].map(tab => (
             <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-8 py-4 text-[10px] font-black uppercase tracking-[0.15em] transition-all border-b-2 flex items-center gap-2.5 ${activeTab === tab.id ? 'border-primary-600 text-primary-600 bg-primary-50/20' : 'border-transparent text-slate-400 hover:text-slate-900'}`}
             >
                <tab.icon size={14} strokeWidth={2.5} />
                {tab.label}
             </button>
           ))}
        </div>

        <div className="min-h-[400px] pt-4">
           {activeTab === 'metrics' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                 <div className="flex justify-between items-center">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                       <Clock size={14} /> Telemetry History Log
                    </h5>
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                       {(['1h', '24h', '7d'] as TimeRange[]).map((r) => (
                          <button
                             key={r}
                             onClick={() => setTimeRange(r)}
                             className={`px-4 py-1.5 text-[10px] font-black rounded-lg transition-all ${
                                timeRange === r 
                                ? 'bg-white text-primary-600 shadow-sm ring-1 ring-slate-200' 
                                : 'text-slate-500 hover:text-slate-800'
                             }`}
                          >
                             {r.toUpperCase()}
                          </button>
                       ))}
                    </div>
                 </div>

                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white border border-slate-200 rounded-3xl p-6 hover:border-primary-200 transition-colors">
                       <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 flex justify-between items-center">
                          <span className="flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-primary-500 shadow-[0_0_8px_rgba(27,88,244,0.4)]"></div>
                             Compute utilization (%)
                          </span>
                       </h4>
                       <MonitoringChart data={history.cpu} color="#1B58F4" label="CPU" height={200} />
                    </div>
                    <div className="bg-white border border-slate-200 rounded-3xl p-6 hover:border-indigo-200 transition-colors">
                       <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 flex justify-between items-center">
                          <span className="flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.4)]"></div>
                             Memory utilization (%)
                          </span>
                       </h4>
                       <MonitoringChart data={history.mem} color="#6366f1" label="Memory" height={200} />
                    </div>
                 </div>
              </div>
           )}

           {activeTab === 'pods' && (
              <div className="space-y-6 animate-in fade-in duration-500">
                 <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl">
                       <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Pods</div>
                       <div className="text-2xl font-black font-mono text-slate-900">12</div>
                    </div>
                    <div className="bg-emerald-50/50 border border-emerald-100 p-5 rounded-2xl">
                       <div className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1">Running</div>
                       <div className="text-2xl font-black font-mono text-emerald-600">10</div>
                    </div>
                    <div className="bg-amber-50/50 border border-amber-100 p-5 rounded-2xl">
                       <div className="text-[9px] font-black text-amber-600 uppercase tracking-widest mb-1">Pending</div>
                       <div className="text-2xl font-black font-mono text-amber-600">1</div>
                    </div>
                    <div className="bg-red-50 border border-red-100 p-5 rounded-2xl">
                       <div className="text-[9px] font-black text-red-600 uppercase tracking-widest mb-1">Critical</div>
                       <div className="text-2xl font-black font-mono text-red-600 animate-pulse">1</div>
                    </div>
                 </div>

                 <div className="border border-slate-200 rounded-3xl overflow-hidden bg-white">
                    <table className="w-full text-[11px] text-left">
                       <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-black uppercase tracking-widest">
                          <tr>
                             <th className="px-8 py-5">Pod Identifier</th>
                             <th className="px-8 py-5">Status</th>
                             <th className="px-8 py-5">Resources (C/M)</th>
                             <th className="px-8 py-5">GPU Units</th>
                             <th className="px-8 py-5 text-right">Age</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100">
                          {[
                            { name: 'ai-training-worker-1', ns: 'ai-platform', status: 'Running', cpu: '2000m', mem: '4Gi', gpu: '2x A100', time: '2d 14h' },
                            { name: 'llama-inference-pod', ns: 'llm-prod', status: 'Running', cpu: '4000m', mem: '16Gi', gpu: '1x H100', time: '5d 2h' },
                            { name: 'model-eval-job', ns: 'ai-platform', status: 'Error', cpu: '1000m', mem: '2Gi', gpu: 'N/A', time: '12m 4s' }
                          ].map((pod, i) => (
                             <tr key={i} className="hover:bg-slate-50 transition-colors">
                                <td className="px-8 py-5">
                                   <div className="flex flex-col">
                                      <span className="font-black text-slate-900 tracking-tight">{pod.name}</span>
                                      <span className="text-[9px] text-slate-400 font-mono mt-0.5 uppercase tracking-tighter">Namespace: {pod.ns}</span>
                                   </div>
                                </td>
                                <td className="px-8 py-5">
                                   <Badge status={pod.status === 'Running' ? 'success' : pod.status === 'Error' ? 'error' : 'warning'}>
                                      {pod.status}
                                   </Badge>
                                </td>
                                <td className="px-8 py-5 font-mono font-bold text-slate-600">
                                   {pod.cpu} / {pod.mem}
                                </td>
                                <td className="px-8 py-5">
                                   <span className={`px-2 py-0.5 rounded text-[10px] font-black border ${pod.gpu !== 'N/A' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'text-slate-300'}`}>
                                      {pod.gpu}
                                   </span>
                                </td>
                                <td className="px-8 py-5 text-right font-black text-slate-500">{pod.time}</td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>
           )}

           {activeTab === 'specs' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-500">
                 <div className="space-y-8">
                    <div>
                       <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                          <Cpu size={14} /> Processor Configuration
                       </h4>
                       <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4">
                          <div className="flex justify-between border-b border-slate-50 pb-2">
                             <span className="text-xs font-bold text-slate-500">Architecture</span>
                             <span className="text-xs font-black text-slate-900">x86_64 / Cascade Lake</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-50 pb-2">
                             <span className="text-xs font-bold text-slate-500">Thread Count</span>
                             <span className="text-xs font-black font-mono text-slate-900">{node.cpu.total} vCPUs</span>
                          </div>
                          <div className="flex justify-between">
                             <span className="text-xs font-bold text-slate-500">Instruction Set</span>
                             <span className="text-xs font-black text-slate-900 uppercase">AVX-512</span>
                          </div>
                       </div>
                    </div>
                 </div>
                 <div className="space-y-8">
                    <div>
                       <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                          <Network size={14} /> Infrastructure Layer
                       </h4>
                       <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4">
                          <div className="flex justify-between border-b border-slate-50 pb-2">
                             <span className="text-xs font-bold text-slate-500">Cluster Identity</span>
                             <span className="text-xs font-black text-slate-900 uppercase">SZX-PRODUCTION-01</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-50 pb-2">
                             <span className="text-xs font-bold text-slate-500">Runtime Engine</span>
                             <span className="text-xs font-black text-slate-900">containerd 1.7.0</span>
                          </div>
                          <div className="flex justify-between">
                             <span className="text-xs font-bold text-slate-500">Storage Plane</span>
                             <span className="text-xs font-black text-slate-900">CSI Driver / Distributed DFS</span>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           )}
        </div>
      </div>
      
      <style>{`
        @keyframes shimmer {
          0% { opacity: 0.7; transform: translateX(-10%); }
          50% { opacity: 1; transform: translateX(0%); }
          100% { opacity: 0.7; transform: translateX(10%); }
        }
      `}</style>
    </Drawer>
  );
};
