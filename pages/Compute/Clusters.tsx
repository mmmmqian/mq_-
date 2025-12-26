
import React, { useState } from 'react';
import { MOCK_CLUSTERS, MOCK_NODE_DETAILS } from '../../constants';
import { Badge } from '../../components/ui/Badge';
import { 
  Plus, RefreshCw, Search, 
  Zap, Server, Box, Cpu, ChevronDown,
  Activity, Monitor, Network,
  RotateCw, Loader2, HardDrive, Layers, 
  Settings, Info, Trash2, ShieldCheck, Tag,
  Clock, BarChart3
} from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import RegisterClusterModal from '../../components/modals/RegisterClusterModal';
import { MasterComponentsModal, ClusterDetailsModal, EditClusterModal, UnregisterClusterModal } from '../../components/modals/ClusterOperationsModals';
import { NodeLabelsDrawer } from '../../components/modals/NodeLabelsDrawer';
import { RebootNodeModal } from '../../components/modals/NodeOperationsModals';
import { CustomSelect } from '../../components/ui/Select';

const ClustersPage: React.FC = () => {
  const [expandedClusterId, setExpandedClusterId] = useState<string | null>(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [selectedCluster, setSelectedCluster] = useState<any | null>(null);
  const [isMasterModalOpen, setIsMasterModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUnregisterModalOpen, setIsUnregisterModalOpen] = useState(false);
  
  const [isLabelsDrawerOpen, setIsLabelsDrawerOpen] = useState(false);
  const [selectedNodeForLabels, setSelectedNodeForLabels] = useState<any | null>(null);
  const [isRebootModalOpen, setIsRebootModalOpen] = useState(false);
  const [selectedNodeForReboot, setSelectedNodeForReboot] = useState<any | null>(null);
  const [rebootingNodes, setRebootingNodes] = useState<Set<string>>(new Set());
  const [refreshingClusters, setRefreshingClusters] = useState<Set<string>>(new Set());
  
  const [filterRegion, setFilterRegion] = useState('all');

  // 数据统计
  const totalClusters = MOCK_CLUSTERS.length;
  const totalNodes = MOCK_CLUSTERS.reduce((acc, c) => acc + c.nodeCount, 0);
  const totalPods = MOCK_CLUSTERS.reduce((acc, c) => acc + (c.runningPods || 0), 0);
  const avgCpuUtil = Math.round((MOCK_CLUSTERS.reduce((acc, c) => acc + c.resources.cpu.used, 0) / MOCK_CLUSTERS.reduce((acc, c) => acc + c.resources.cpu.total, 0)) * 100);
  const avgGpuUtil = Math.round((MOCK_CLUSTERS.reduce((acc, c) => acc + c.resources.gpu.used, 0) / MOCK_CLUSTERS.reduce((acc, c) => acc + c.resources.gpu.total, 0)) * 100);

  const handleRefreshNodes = (clusterId: string) => {
    if (refreshingClusters.has(clusterId)) return;
    setRefreshingClusters(prev => new Set(prev).add(clusterId));
    setTimeout(() => {
      setRefreshingClusters(prev => {
        const next = new Set(prev);
        next.delete(clusterId);
        return next;
      });
    }, 1200);
  };

  const MiniProgressBar = ({ label, value, color }: { label: string, value: number, color: string }) => (
    <div className="flex items-center gap-1.5 w-full">
      <span className="font-black text-[8px] text-slate-400 w-3 text-center">{label}</span>
      <div className="h-1 flex-1 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} transition-all duration-700`} style={{ width: `${value}%` }} />
      </div>
      <span className="font-mono text-[9px] font-bold text-slate-500 w-6 text-right">{value}%</span>
    </div>
  );

  const VisualResourceBar = ({ label, used, total, color }: any) => {
    const percent = total > 0 ? Math.min(100, Math.round((used / total) * 100)) : 0;
    return (
      <div className="group/res">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
          <span className="text-[10px] font-black text-slate-900 font-mono tracking-tighter">{percent}%</span>
        </div>
        <div className="h-[3px] bg-slate-100 rounded-full overflow-hidden">
          <div 
            className={`h-full ${color} transition-all duration-1000 ease-out`} 
            style={{ width: `${percent}%` }} 
          />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-20 font-sans">
      <RegisterClusterModal isOpen={isRegisterModalOpen} onClose={() => setIsRegisterModalOpen(false)} />
      <MasterComponentsModal isOpen={isMasterModalOpen} onClose={() => setIsMasterModalOpen(false)} cluster={selectedCluster} />
      <ClusterDetailsModal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} cluster={selectedCluster} />
      <EditClusterModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} cluster={selectedCluster} />
      <UnregisterClusterModal isOpen={isUnregisterModalOpen} onClose={() => setIsUnregisterModalOpen(false)} cluster={selectedCluster} />
      <NodeLabelsDrawer isOpen={isLabelsDrawerOpen} onClose={() => setIsLabelsDrawerOpen(false)} node={selectedNodeForLabels} />
      <RebootNodeModal 
        isOpen={isRebootModalOpen} 
        onClose={() => setIsRebootModalOpen(false)} 
        onConfirm={(node) => {
          setRebootingNodes(prev => new Set(prev).add(node.id));
          setTimeout(() => setRebootingNodes(prev => { const n = new Set(prev); n.delete(node.id); return n; }), 5000);
        }} 
        node={selectedNodeForReboot} 
      />

      {/* 极简科技感标题区域 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-200 px-6 py-4 rounded-[20px] shadow-soft">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-primary-600 rounded-xl text-white shadow-lg shadow-primary-500/20">
            <Server size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">集群资源中心</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <ShieldCheck size={12} className="text-emerald-500" /> INFRASTRUCTURE READY
              </span>
              <div className="w-1 h-1 rounded-full bg-slate-200"></div>
              <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5">
                <Clock size={12} className="text-slate-300" /> SYNC: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <CustomSelect
            options={[
              { value: 'all', label: '所有地域 (All Regions)' },
              { value: 'bj', label: '华北-北京' },
              { value: 'sh', label: '华东-上海' },
              { value: 'sz', label: '华南-深圳' }
            ]}
            value={filterRegion}
            onChange={setFilterRegion}
            className="w-44"
          />
          <button onClick={() => window.location.reload()} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-400 hover:text-primary-600 hover:bg-white transition-all shadow-sm">
            <RefreshCw size={16} />
          </button>
          <button 
            onClick={() => setIsRegisterModalOpen(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-950 text-white rounded-xl hover:bg-primary-600 transition-all font-black text-[11px] uppercase tracking-widest shadow-xl shadow-slate-900/10 active:scale-95"
          >
            <Plus size={14} strokeWidth={3} />
            <span>接入集群</span>
          </button>
        </div>
      </div>

      {/* 精简统计指标 */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="集群实例" value={totalClusters} icon={Server} subtext="Domain Assets" />
        <StatCard title="节点总数" value={totalNodes} icon={Box} subtext="Compute Units" />
        <StatCard title="POD 总量" value={totalPods.toLocaleString()} icon={Layers} subtext="Active Workloads" />
        <StatCard title="CPU 利用率" value={`${avgCpuUtil}%`} icon={Cpu} variant="primary" subtext="Aggregated" />
        <StatCard title="GPU 利用率" value={`${avgGpuUtil}%`} icon={Zap} subtext="Accelerator" />
      </div>

      {/* 集群矩阵表格 */}
      <div className="bg-white border border-slate-200 rounded-[28px] shadow-soft overflow-hidden">
        <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/40">
           <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
             <BarChart3 size={16} /> INFRASTRUCTURE DATA MATRIX
           </h3>
           <div className="relative group">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-500 transition-colors" />
              <input 
                type="text" 
                placeholder="FILTER..." 
                className="pl-11 pr-4 py-2 text-[10px] font-black uppercase tracking-widest border border-slate-200 rounded-2xl bg-white focus:outline-none focus:border-primary-500 w-56 transition-all font-sans placeholder:text-slate-200" 
              />
           </div>
        </div>
        
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/30 text-slate-400 border-b border-slate-100">
              <th className="px-8 py-4 w-10"></th>
              <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em]">集群信息</th>
              <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em]">健康状态</th>
              <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-center">POD 容量</th>
              <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-center">节点概况</th>
              <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em]">资源水位 (C/M/G)</th>
              <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {MOCK_CLUSTERS.map(cluster => (
              <React.Fragment key={cluster.id}>
                <tr 
                  className={`group transition-all cursor-pointer ${expandedClusterId === cluster.id ? 'bg-primary-50/30' : 'hover:bg-slate-50/50'}`}
                  onClick={() => setExpandedClusterId(expandedClusterId === cluster.id ? null : cluster.id)}
                >
                  <td className="px-8 py-6 text-slate-300">
                    <div className={`transition-transform duration-300 ${expandedClusterId === cluster.id ? 'rotate-180 text-primary-600' : ''}`}>
                      <ChevronDown size={18} />
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <div className="font-black text-slate-900 tracking-tight text-base font-sans leading-tight">{cluster.displayName}</div>
                      <div className="font-mono text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{cluster.id} · {cluster.region}</div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-2 h-2 rounded-full ${cluster.status === 'healthy' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500'} animate-pulse`}></div>
                      <span className={`text-[11px] font-black uppercase tracking-widest ${cluster.status === 'healthy' ? 'text-emerald-600' : 'text-amber-600'}`}>{cluster.status}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="font-mono font-black text-slate-800 text-base tracking-tighter leading-none">{cluster.runningPods.toLocaleString()}</div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col items-center">
                       <div className="font-mono font-black text-slate-800 text-sm tracking-tighter">{cluster.readyNodes} <span className="text-slate-300">/</span> {cluster.nodeCount}</div>
                       <div className="w-16 h-1 bg-slate-100 rounded-full mt-2.5 overflow-hidden relative">
                          <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${(cluster.readyNodes/cluster.nodeCount)*100}%` }}></div>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-2 w-36">
                       <MiniProgressBar label="C" value={Math.round((cluster.resources.cpu.used/cluster.resources.cpu.total)*100)} color="bg-primary-600" />
                       <MiniProgressBar label="M" value={Math.round((cluster.resources.memory.used/cluster.resources.memory.total)*100)} color="bg-indigo-500" />
                       <MiniProgressBar label="G" value={Math.round((cluster.resources.gpu.used/cluster.resources.gpu.total)*100)} color="bg-emerald-500" />
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-all duration-300">
                      <button onClick={(e) => { e.stopPropagation(); setSelectedCluster(cluster); setIsDetailsModalOpen(true); }} className="p-2.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all" title="详情">
                        <Info size={16} strokeWidth={2.5} />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); setSelectedCluster(cluster); setIsMasterModalOpen(true); }} className="p-2.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all" title="健康">
                        <Activity size={16} strokeWidth={2.5} />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); setSelectedCluster(cluster); setIsEditModalOpen(true); }} className="p-2.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all" title="编辑">
                        <Settings size={16} strokeWidth={2.5} />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); setSelectedCluster(cluster); setIsUnregisterModalOpen(true); }} className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all" title="移除">
                        <Trash2 size={16} strokeWidth={2.5} />
                      </button>
                    </div>
                  </td>
                </tr>
                {expandedClusterId === cluster.id && (
                  <tr className="bg-slate-50/40">
                    <td colSpan={7} className="px-10 py-12">
                       <div className="mb-8 flex items-center justify-between border-b border-slate-200/60 pb-4 mx-2">
                          <div className="flex items-center gap-3">
                             <div>
                               <h4 className="text-xs font-black text-slate-900 uppercase tracking-tighter font-sans">计算节点阵列 (NODE TELEMETRY ARRAY)</h4>
                               <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Real-time load distribution across high-density nodes</p>
                             </div>
                          </div>
                          <div className="flex items-center gap-3">
                             <button 
                                onClick={() => handleRefreshNodes(cluster.id)}
                                disabled={refreshingClusters.has(cluster.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all shadow-sm ${refreshingClusters.has(cluster.id) ? 'bg-slate-100 border-slate-200 text-primary-600' : 'bg-white border-slate-200 text-slate-600 hover:border-primary-500 hover:text-primary-600 active:scale-95'}`}
                             >
                                <RefreshCw size={11} className={refreshingClusters.has(cluster.id) ? 'animate-spin' : ''} />
                                {refreshingClusters.has(cluster.id) ? 'SYNCING...' : 'REFRESH'}
                             </button>
                          </div>
                       </div>
                       
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 mx-2">
                          {MOCK_NODE_DETAILS[cluster.id]?.map((node, idx) => {
                            const isRebooting = rebootingNodes.has(node.id);
                            const isSectionRefreshing = refreshingClusters.has(cluster.id);
                            const nodeNum = node.id.split('-').pop()?.padStart(3, '0') || '---';
                            
                            return (
                              <div key={node.id} className={`group/node relative bg-white border rounded-[28px] p-5 transition-all duration-700 flex flex-col h-full border-slate-200 shadow-sm hover:shadow-xl hover:border-primary-400 hover:-translate-y-1.5 ${isSectionRefreshing ? 'opacity-40 blur-[1px]' : ''}`}>
                                 {/* 节点头部样式 - 紧凑化 */}
                                 <div className="flex items-center gap-4 mb-5">
                                    <div className="w-11 h-11 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover/node:bg-primary-50 group-hover/node:text-primary-600 transition-colors">
                                       <Server size={20} strokeWidth={2.5} />
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-1.5">
                                        <h5 className="text-lg font-black text-slate-900 tracking-tight font-sans">{nodeNum}</h5>
                                        <div className={`w-2 h-2 rounded-full ${isRebooting ? 'bg-amber-500 animate-pulse' : node.status === 'Ready' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500'}`}></div>
                                      </div>
                                      <div className="text-[10px] text-slate-400 font-mono font-bold mt-0.5 tracking-wider">{node.ip}</div>
                                    </div>
                                 </div>

                                 {/* 资源监控区 - 紧凑化 */}
                                 <div className="space-y-4 mb-6">
                                    <VisualResourceBar label="CPU LOAD" used={node.cpu.used} total={node.cpu.total} color="bg-primary-500" />
                                    <VisualResourceBar label="MEM LOAD" used={node.mem.used} total={node.mem.total} color="bg-indigo-400" />
                                    {node.gpu && (
                                      <VisualResourceBar label="GPU LOAD" used={node.gpu.utilization || 0} total={100} color="bg-emerald-400" />
                                    )}
                                    <VisualResourceBar label="STR LOAD" used={node.storage?.used || 0} total={node.storage?.total || 1} color="bg-slate-400" />
                                 </div>

                                 {/* 业务指标与标签 - 紧凑化 */}
                                 <div className="mt-auto space-y-3 pt-4 border-t border-slate-50">
                                    <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-400">
                                       <span className="flex items-center gap-1.5"><Box size={12} strokeWidth={3} /> Pod Capacity</span>
                                       <span className={`font-mono text-slate-900 ${idx === 0 ? 'text-red-500' : 'text-emerald-600'}`}>22 / 24</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5 h-8 overflow-hidden content-start">
                                       {node.tags?.map((tag: string) => (
                                         <span key={tag} className="bg-slate-50 text-slate-400 px-2 py-0.5 rounded-lg border border-slate-100 font-bold uppercase text-[8px] tracking-widest">{tag}</span>
                                       ))}
                                    </div>
                                 </div>

                                 {/* 底部操作区 - 紧凑化 */}
                                 <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                                    <div className="flex items-center gap-1 ml-auto">
                                       <button 
                                          onClick={(e) => { e.stopPropagation(); setSelectedNodeForLabels(node); setIsLabelsDrawerOpen(true); }}
                                          className="p-1.5 text-slate-300 hover:text-primary-600 transition-all rounded-lg hover:bg-primary-50"
                                          title="标签配置"
                                       >
                                          <Tag size={16} strokeWidth={2.5} />
                                       </button>
                                       <button 
                                          onClick={(e) => { e.stopPropagation(); if(rebootingNodes.has(node.id)) return; setSelectedNodeForReboot(node); setIsRebootModalOpen(true); }}
                                          className={`p-1.5 transition-all rounded-lg ${isRebooting ? 'text-primary-600 bg-primary-50' : 'text-slate-200 hover:text-red-500 hover:bg-red-50'}`}
                                          title="重启节点"
                                       >
                                          {isRebooting ? <Loader2 size={16} className="animate-spin" /> : <RotateCw size={16} strokeWidth={2.5} />}
                                       </button>
                                    </div>
                                 </div>
                              </div>
                            );
                          })}
                       </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClustersPage;
