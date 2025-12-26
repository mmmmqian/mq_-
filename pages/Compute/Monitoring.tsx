
import React, { useState, useEffect, useMemo } from 'react';
import { MOCK_CLUSTERS, MOCK_RESOURCE_POOLS, MOCK_MONITORING_HISTORY } from '../../constants';
import StatCard from '../../components/ui/StatCard';
import MonitoringChart from '../../components/ui/MonitoringChart';
import { NodeDetailDrawer } from '../../components/modals/NodeDetailDrawer';
import { Badge } from '../../components/ui/Badge';
import { 
  Activity, RefreshCw, Cpu, Zap, 
  Box, Search, Server, Layers, MapPin,
  HardDrive, ShieldCheck, AlertCircle,
  LayoutGrid, List, ChevronRight, Terminal, Monitor,
  ActivitySquare, BellRing, Gauge, Clock
} from 'lucide-react';

// 仿真逻辑：强制将 GPU 利用率锁定在 95% 以演示极高负载下的严谨告警状态
const generateSimulatedNodes = (count: number) => {
  const nodes = [];
  const gpuModels = ['NVIDIA A100-80GB', 'NVIDIA H100', 'NVIDIA V100', 'NVIDIA T4'];
  const osVersions = ['Ubuntu 22.04.3 LTS', 'CentOS Stream 9', 'Debian 12'];
  
  for (let i = 1; i <= count; i++) {
    const hasGpu = Math.random() > 0.3;
    const status = Math.random() > 0.05 ? 'Ready' : 'NotReady';
    const cpuTotal = [32, 64, 128][Math.floor(Math.random() * 3)];
    const memTotal = [64, 128, 256, 512][Math.floor(Math.random() * 4)];
    
    nodes.push({
      id: `node-sim-${i.toString().padStart(3, '0')}`,
      name: `prod-compute-${i.toString().padStart(3, '0')}`,
      status,
      role: 'worker',
      ip: `10.128.${Math.floor(i / 25)}.${i % 255}`,
      os: osVersions[Math.floor(Math.random() * osVersions.length)],
      kernel: `5.15.0-${Math.floor(Math.random() * 100) + 50}-generic`,
      cpu: { 
        used: status === 'Ready' ? Math.floor(Math.random() * cpuTotal * 0.95) : 0, 
        total: cpuTotal 
      },
      mem: { 
        used: status === 'Ready' ? Math.floor(Math.random() * memTotal * 0.7) : 0, 
        total: memTotal 
      },
      gpu: hasGpu ? {
        count: [1, 2, 4, 8][Math.floor(Math.random() * 4)],
        model: gpuModels[Math.floor(Math.random() * gpuModels.length)],
        // 强制所有节点 GPU 利用率为 95
        utilization: status === 'Ready' ? 95 : 0,
        memoryUsed: Math.floor(Math.random() * 80),
        memoryTotal: 80
      } : null,
      storage: {
        used: Math.floor(Math.random() * 800),
        total: 1024
      }
    });
  }
  return nodes;
};

const SIMULATED_NODES = generateSimulatedNodes(100);

const MonitoringPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [timeRange, setTimeRange] = useState('1h');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedNode, setSelectedNode] = useState<any | null>(null);
  const [isNodeDrawerOpen, setIsNodeDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [selectedClusterId, setSelectedClusterId] = useState<string>('simulated');
  const [selectedPoolId, setSelectedPoolId] = useState<string>('all');

  const filteredNodes = useMemo(() => {
    let nodes = selectedClusterId === 'simulated' ? SIMULATED_NODES : [];
    return nodes.filter(node => 
      node.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      node.ip.includes(searchTerm)
    );
  }, [searchTerm, selectedClusterId]);

  const stats = useMemo(() => {
    const total = filteredNodes.length || 1;
    const readyNodes = filteredNodes.filter(n => n.status === 'Ready').length;
    
    const cpuUtil = filteredNodes.reduce((acc, n) => acc + (n.cpu.used / n.cpu.total), 0) / total;
    const memUtil = filteredNodes.reduce((acc, n) => acc + (n.mem.used / n.mem.total), 0) / total;
    const gpuNodes = filteredNodes.filter(n => n.gpu);
    
    // 强制汇总结果为 95%
    const gpuUtil = 95;
    const storageUtil = filteredNodes.reduce((acc, n) => acc + (n.storage.used / n.storage.total), 0) / total;

    return {
      cpuUtil: Math.round(cpuUtil * 100),
      memUtil: Math.round(memUtil * 100),
      gpuUtil: gpuUtil,
      storageUtil: Math.round(storageUtil * 100),
      nodeHealth: Math.round((readyNodes / total) * 100),
      totalPods: readyNodes * 12
    };
  }, [filteredNodes]);

  const openNodeDetails = (node: any) => {
    setSelectedNode(node);
    setIsNodeDrawerOpen(true);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const clusterTrendSeries = [
    { key: 'cpu', name: 'CPU Load', color: '#1B58F4', data: MOCK_MONITORING_HISTORY.cpu },
    { key: 'memory', name: 'Memory Commit', color: '#6366f1', data: MOCK_MONITORING_HISTORY.memory },
    { key: 'gpu', name: 'GPU Compute', color: '#EF4444', data: MOCK_MONITORING_HISTORY.gpu.map(p => ({...p, value: 95})) }
  ];

  const gpuAlertActive = stats.gpuUtil > 90;

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20 max-w-[1600px] mx-auto">
      <NodeDetailDrawer 
        isOpen={isNodeDrawerOpen} 
        onClose={() => setIsNodeDrawerOpen(false)} 
        node={selectedNode} 
      />

      {/* 1. Header & System Status Bar */}
      <div className="flex flex-col gap-8">
        <div className="flex justify-between items-end border-b border-slate-200 pb-6">
           <div>
              <div className="flex items-center gap-3 mb-2">
                 <div className="w-2 h-8 bg-primary-600 rounded-sm"></div>
                 <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">集群全维监控矩阵</h1>
              </div>
              <p className="text-sm font-medium text-slate-500 ml-5 tracking-wide">Real-time Telemetry & Global Resource Orchestration</p>
           </div>
           <div className="flex items-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
             <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span> 
                Network Nominal
             </div>
             <div className="flex items-center gap-2 border-l pl-6 border-slate-200">
                <Clock size={14} className="text-slate-300" /> 
                Refreshed: {new Date().toLocaleTimeString()}
             </div>
           </div>
        </div>

        {/* Filters & Control Bar */}
        <div className="bg-white/50 backdrop-blur-sm border border-slate-200 p-2.5 rounded-2xl shadow-sm flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
             {['1h', '6h', '24h', '7d'].map(range => (
                <button 
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 text-[10px] font-black rounded-lg transition-all ${timeRange === range ? 'bg-white text-primary-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-900'}`}
                >
                  {range.toUpperCase()}
                </button>
             ))}
          </div>
          
          <div className="h-8 w-px bg-slate-200 mx-2"></div>
          
          <div className="flex items-center gap-4">
             <div className="relative group">
                <Server size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-primary-500 transition-colors" />
                <select 
                  value={selectedClusterId}
                  onChange={(e) => setSelectedClusterId(e.target.value)}
                  className="pl-10 pr-8 py-2.5 text-[11px] bg-white border border-slate-200 rounded-xl hover:border-primary-500 focus:ring-4 focus:ring-primary-500/5 outline-none appearance-none font-bold text-slate-700 transition-all cursor-pointer shadow-sm"
                >
                  <option value="simulated">SZX-PRODUCTION-CLUSTER (01)</option>
                  {MOCK_CLUSTERS.map(c => <option key={c.id} value={c.id}>{c.displayName.toUpperCase()}</option>)}
                </select>
             </div>
          </div>

          <div className="flex-1"></div>
          
          <div className="flex items-center gap-3">
             <div className="relative group">
                <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-primary-500 transition-colors" />
                <input 
                  type="text"
                  placeholder="FILTER NODE ID / IP..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-11 pr-4 py-2.5 text-[11px] bg-white border border-slate-200 rounded-xl w-64 focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 transition-all outline-none font-bold tracking-widest uppercase placeholder:text-slate-300"
                />
             </div>
             <button onClick={handleRefresh} className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-primary-600 transition-all shadow-xl active:scale-95 group">
               <RefreshCw size={18} strokeWidth={2.5} className={isRefreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-700'} />
             </button>
          </div>
        </div>
      </div>

      {/* 2. Top KPI Grid - GPU 卡片将显示 95% 的严谨告警视觉 */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-6">
        <StatCard 
          title="GPU 加速器负荷" 
          value={`${stats.gpuUtil}%`} 
          icon={Zap} 
          variant="primary" 
          subtext={gpuAlertActive ? "CRITICAL OVERLOAD DETECTED" : "Accelerator Compute"}
          isAlert={gpuAlertActive} 
        />
        <StatCard 
          title="CPU 算力利用率" 
          value={`${stats.cpuUtil}%`} 
          icon={Cpu} 
          subtext="vCPU Global Avg"
          isAlert={stats.cpuUtil > 85}
        />
        <StatCard 
          title="内存 提交总量" 
          value={`${stats.memUtil}%`} 
          icon={ActivitySquare} 
          subtext="Memory Commit"
          isAlert={stats.memUtil > 85}
        />
        <StatCard 
          title="分布式存储 (DFS)" 
          value={`${stats.storageUtil}%`} 
          icon={HardDrive} 
          subtext="Capacity Usage"
          isAlert={stats.storageUtil > 90}
        />
        <StatCard 
          title="Active Pods" 
          value={stats.totalPods.toLocaleString()} 
          icon={Box} 
          subtext="Orchestration" 
        />
        <StatCard 
          title="节点健康度 (SLO)" 
          value={`${stats.nodeHealth}%`} 
          icon={ShieldCheck} 
          subtext={`${filteredNodes.filter(n=>n.status==='Ready').length} / ${filteredNodes.length} Ready`}
          isAlert={stats.nodeHealth < 100}
        />
      </div>

      {/* 3. Trends & Risk Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
         <div className="lg:col-span-3 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col group transition-all hover:border-slate-300">
            <div className="flex justify-between items-center mb-10">
               <div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-3 tracking-tight">
                    <ActivitySquare size={22} className="text-primary-600" />
                    核心资源负载历史趋势 (GLOBAL TELEMETRY)
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2 ml-8">Sampling Rate: 60s per point | Real-time Aggregation</p>
               </div>
               <div className="flex gap-6">
                  {clusterTrendSeries.map(s => (
                    <div key={s.key} className="flex items-center gap-2.5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                       <span className={`w-2.5 h-2.5 rounded-full ${s.key === 'gpu' ? 'animate-pulse' : ''}`} style={{ backgroundColor: s.color }}></span> 
                       {s.name}
                    </div>
                  ))}
               </div>
            </div>
            <div className="flex-1 min-h-[360px]">
               <MonitoringChart series={clusterTrendSeries} height={360} showLegend={false} />
            </div>
         </div>

         <div className="flex flex-col gap-8">
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm group hover:border-red-200 transition-all">
               <div className="flex items-center justify-between mb-8">
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 uppercase tracking-widest">
                     <BellRing size={18} className="text-red-500" />
                     风险预警 (AIOps)
                  </h3>
                  <Badge status="error" showDot={false}>3 Active</Badge>
               </div>
               <div className="space-y-4">
                  {[
                    { type: 'error', title: 'GPU 显存溢出风险', desc: 'node-sim-095 显存利用率达到阈值', time: 'NOW' },
                    { type: 'warning', title: '网络延迟抖动', desc: 'AZ-1 节点通信链路出现微秒级波动', time: '4m' },
                    { type: 'info', title: '算力扩容建议', desc: '检测到持续高负载，建议扩容资源池', time: '12m' }
                  ].map((alert, i) => (
                    <div key={i} className={`p-4 rounded-2xl border transition-all hover:translate-x-1 cursor-pointer ${
                      alert.type === 'error' ? 'bg-red-50/30 border-red-100' : 
                      alert.type === 'warning' ? 'bg-amber-50/30 border-amber-100' : 'bg-slate-50 border-slate-100'
                    }`}>
                       <div className="flex justify-between items-start mb-1.5">
                          <span className={`text-xs font-black ${alert.type === 'error' ? 'text-red-600' : 'text-slate-800'}`}>{alert.title}</span>
                          <span className="text-[9px] font-mono font-black text-slate-400">{alert.time}</span>
                       </div>
                       <p className="text-[10px] text-slate-500 font-medium leading-relaxed">{alert.desc}</p>
                    </div>
                  ))}
               </div>
               <button className="w-full mt-8 py-3 text-[10px] font-black text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all uppercase tracking-[0.2em] border border-slate-200">
                  Full Diagnostics
               </button>
            </div>

            <div className="bg-slate-950 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Gauge size={140} className="text-white" />
               </div>
               <h3 className="text-xs font-black text-white mb-8 flex items-center gap-2 uppercase tracking-[0.2em] relative z-10">
                  <MapPin size={16} className="text-primary-500" />
                  Region Availability
               </h3>
               <div className="space-y-6 relative z-10">
                  {[
                    { loc: 'SZX-AZ1 (PRIMARY)', sla: '100.00%' },
                    { loc: 'SZX-AZ2 (HOT-STANDBY)', sla: '99.999%' },
                    { loc: 'HKG-AZ1 (EDGE)', sla: '99.999%' }
                  ].map((loc, i) => (
                    <div key={i} className="flex justify-between items-center border-b border-white/10 pb-3 last:border-0 last:pb-0">
                       <span className="text-[10px] font-black text-slate-500">{loc.loc}</span>
                       <span className="text-[10px] font-mono font-bold text-emerald-400 tracking-tighter">{loc.sla}</span>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </div>

      {/* 4. Node Matrix - 使用网格化更严谨地展示 100 个节点 */}
      <div className="space-y-8 pt-12 border-t border-slate-200">
         <div className="flex justify-between items-end">
            <div>
               <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                 集群计算节点矩阵 (NODE INVENTORY)
                 <Badge status="primary">100 Instances</Badge>
               </h3>
               <p className="text-xs font-medium text-slate-500 mt-2">基于实时负载动态渲染的集群计算单元热力矩阵</p>
            </div>
            
            <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
               <button 
                 onClick={() => setViewMode('card')}
                 className={`flex items-center gap-2 px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${viewMode === 'card' ? 'bg-white text-slate-950 shadow-sm ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-700'}`}
               >
                 <LayoutGrid size={14} /> Matrix
               </button>
               <button 
                 onClick={() => setViewMode('list')}
                 className={`flex items-center gap-2 px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${viewMode === 'list' ? 'bg-white text-slate-950 shadow-sm ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-700'}`}
               >
                 <List size={14} /> List
               </button>
            </div>
         </div>

         {viewMode === 'card' ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8 gap-4 animate-in slide-in-from-bottom-2 duration-700">
               {filteredNodes.map(node => (
                  <div 
                     key={node.id}
                     onClick={() => openNodeDetails(node)}
                     className={`group relative p-4 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden ${
                        node.gpu?.utilization === 95 ? 'bg-red-50/20 border-red-500 ring-1 ring-red-500/30' : 'bg-white border-slate-200 hover:border-primary-500 hover:shadow-lg'
                     }`}
                  >
                     <div className="flex justify-between items-start mb-4">
                        <div className="font-mono text-[9px] font-black text-slate-400 tracking-tighter">#{node.id.split('-').pop()}</div>
                        <div className={`w-2 h-2 rounded-full ${node.gpu?.utilization === 95 ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                     </div>
                     <div className="space-y-2">
                        <div className="flex justify-between items-center">
                           <span className="text-[11px] font-black text-slate-800 tracking-tight">{node.name.split('-').pop()}</span>
                           <span className={`text-[11px] font-mono font-black ${node.gpu?.utilization === 95 ? 'text-red-600' : 'text-primary-600'}`}>95%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                           <div className={`h-full ${node.gpu?.utilization === 95 ? 'bg-red-500' : 'bg-primary-500'}`} style={{ width: '95%' }}></div>
                        </div>
                     </div>
                     <div className="mt-4 pt-3 border-t border-slate-50 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Detail View</span>
                        <ChevronRight size={10} className="text-primary-500" />
                     </div>
                  </div>
               ))}
            </div>
         ) : (
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
               {/* List View implementation remains, but styled with 95% data */}
               <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                     <tr>
                        <th className="px-8 py-5">Instance Identity</th>
                        <th className="px-8 py-5">Health Status</th>
                        <th className="px-8 py-5">Compute load (GPU)</th>
                        <th className="px-8 py-5">Memory Commit</th>
                        <th className="px-8 py-5 text-right">Action</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {filteredNodes.slice(0, 20).map(node => (
                        <tr key={node.id} className="group hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => openNodeDetails(node)}>
                           <td className="px-8 py-5">
                              <div className="flex items-center gap-4">
                                 <div className={`p-2 rounded-lg ${node.gpu?.utilization === 95 ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-400 group-hover:text-primary-600 group-hover:bg-primary-50'}`}>
                                    <Monitor size={16} />
                                 </div>
                                 <div className="flex flex-col">
                                    <span className="text-xs font-black text-slate-900 tracking-tight">{node.name}</span>
                                    <span className="text-[10px] font-mono font-bold text-slate-400">{node.ip}</span>
                                 </div>
                              </div>
                           </td>
                           <td className="px-8 py-5">
                              <Badge status={node.gpu?.utilization === 95 ? 'error' : 'success'}>
                                 {node.gpu?.utilization === 95 ? 'CRITICAL' : 'NOMINAL'}
                              </Badge>
                           </td>
                           <td className="px-8 py-5">
                              <div className="flex items-center gap-4">
                                 <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div className={`h-full ${node.gpu?.utilization === 95 ? 'bg-red-500' : 'bg-primary-500'}`} style={{ width: '95%' }}></div>
                                 </div>
                                 <span className={`text-xs font-mono font-black ${node.gpu?.utilization === 95 ? 'text-red-600' : 'text-slate-700'}`}>95%</span>
                              </div>
                           </td>
                           <td className="px-8 py-5 font-mono text-xs font-bold text-slate-500">
                              {Math.round((node.mem.used/node.mem.total)*100)}%
                           </td>
                           <td className="px-8 py-5 text-right">
                              <button className="p-2 text-slate-300 group-hover:text-primary-600 transition-colors">
                                 <ChevronRight size={18} />
                              </button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         )}
      </div>
    </div>
  );
};

export default MonitoringPage;
