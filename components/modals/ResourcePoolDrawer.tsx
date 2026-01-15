
import React from 'react';
import { Drawer } from '../ui/Drawer';
import { ResourcePool } from '../../types';
import { 
  Layers, Server, Cpu, Activity, UserCheck, 
  Clock, Box, HardDrive, Zap, ShieldCheck, 
  Info, BarChart3, Database, Globe, Power
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { MOCK_NODE_DETAILS } from '../../constants';

interface ResourcePoolDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  pool: ResourcePool | null;
}

export const ResourcePoolDrawer: React.FC<ResourcePoolDrawerProps> = ({ isOpen, onClose, pool }) => {
  if (!pool) return null;

  // 计算综合平均利用率 (基于 CPU 和内存)
  const avgUtilization = Math.round(((pool.used.cpu / pool.quota.cpu + pool.used.memory / pool.quota.memory) / 2) * 100);

  const SectionHeader = ({ icon: Icon, title, sub }: { icon: any, title: string, sub: string }) => (
    <div className="flex items-center gap-3 mb-5">
      <div className="p-2 bg-slate-950 rounded-xl text-white shadow-lg shadow-slate-900/10">
        <Icon size={16} strokeWidth={2.5} />
      </div>
      <div>
        <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] leading-none">{title}</h4>
        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{sub}</p>
      </div>
    </div>
  );

  const UsageCard = ({ label, used, total, unit, icon: Icon, color }: { label: string; used: number; total: number; unit: string; icon: any, color: string }) => {
    const percent = Math.round((used / total) * 100) || 0;
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm group hover:border-primary-300 transition-all">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
            <Icon size={12} /> {label}
          </div>
          <span className={`text-[11px] font-black font-mono ${percent > 85 ? 'text-red-600' : 'text-slate-900'}`}>{percent}%</span>
        </div>
        <div className="h-1 bg-slate-100 rounded-full overflow-hidden mb-2.5">
          <div className={`h-full transition-all duration-1000 ${color}`} style={{ width: `${percent}%` }}></div>
        </div>
        <div className="flex justify-between text-[9px] font-mono font-bold text-slate-400 uppercase tracking-tighter">
           <span>{used}{unit}</span>
           <span className="opacity-50">/ {total}{unit}</span>
        </div>
      </div>
    );
  };

  const poolNodes = MOCK_NODE_DETAILS[pool.clusterId]?.filter(node => pool.nodeSelector.includes(node.name || node.id)) || [];

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Layers size={20} className="text-primary-600" />
          <span className="font-black uppercase tracking-tight">资源池全维审计详情</span>
        </div>
      }
      description={`ID: ${pool.id}`}
      width="max-w-4xl"
      footer={
        <button onClick={onClose} className="w-full py-3 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary-600 transition-all shadow-xl active:scale-95">
          DONE / CLOSE REPORT
        </button>
      }
    >
      <div className="space-y-10 pb-6 font-sans">
        {/* 1. 基础信息面板 (名称、时间、集群、状态) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm relative overflow-hidden">
           <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none">
              <Layers size={140} strokeWidth={1} />
           </div>
           <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                 <div className="space-y-1.5">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">{pool.displayName}</h3>
                    <div className="flex items-center gap-3">
                       <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-tighter">INTERNAL: {pool.name}</span>
                       <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
                       <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                          <Clock size={12} className="text-slate-300" /> 始建于 {pool.createdAt}
                       </div>
                    </div>
                 </div>
                 <Badge status={pool.status === 'active' ? 'success' : 'neutral'} showDot>
                    {pool.status === 'active' ? '资源池已启用' : '资源池已禁用'}
                 </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-primary-600 shadow-sm">
                       <Server size={18} />
                    </div>
                    <div>
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">所属集群映射</p>
                       <p className="text-xs font-black text-slate-800 uppercase tracking-tight mt-0.5">{pool.clusterName}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                       <Box size={18} />
                    </div>
                    <div>
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">节点总资源 (AGGREGATED)</p>
                       <p className="text-xs font-black text-slate-800 uppercase tracking-tight mt-0.5">
                          {pool.quota.cpu}vCPU / {pool.quota.memory}GB / {pool.quota.gpu}GPU
                       </p>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* 2. 租户绑定与使用概况 (租户、绑定时间、平均使用率、资源详情) */}
        <div className="space-y-5">
           <SectionHeader icon={UserCheck} title="租户治理与负载效能" sub="Tenant Slicing & Real-time Telemetry" />
           
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 租户信息 */}
              <div className="bg-slate-950 rounded-3xl p-6 border border-slate-800 shadow-xl flex flex-col justify-between overflow-hidden relative group">
                 <div className="absolute inset-0 bg-primary-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                       <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">绑定租户 (EXCLUSIVE)</span>
                       <ShieldCheck size={16} className="text-emerald-500" />
                    </div>
                    <p className="text-xl font-black text-white tracking-tight uppercase truncate">{pool.tenantName}</p>
                    <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center">
                       <div className="space-y-1">
                          <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">生效时间</p>
                          <p className="text-[11px] font-mono font-bold text-slate-400">{pool.updatedAt}</p>
                       </div>
                       <Badge status="primary" showDot={false}>PREMIUM TENANT</Badge>
                    </div>
                 </div>
              </div>

              {/* 平均使用率仪表 */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden group">
                 <div className="absolute inset-0 tech-grid opacity-[0.03]"></div>
                 <div className="relative z-10">
                    <div className="w-20 h-20 rounded-full border-4 border-slate-50 flex items-center justify-center relative">
                       <svg className="w-20 h-20 absolute -rotate-90">
                          <circle cx="40" cy="40" r="36" fill="transparent" stroke="#f1f5f9" strokeWidth="4" />
                          <circle 
                            cx="40" cy="40" r="36" fill="transparent" 
                            stroke={avgUtilization > 85 ? '#ef4444' : '#1B58F4'} 
                            strokeWidth="4" 
                            strokeDasharray={`${2 * Math.PI * 36}`}
                            strokeDashoffset={`${2 * Math.PI * 36 * (1 - avgUtilization / 100)}`}
                            strokeLinecap="round"
                            className="transition-all duration-1000"
                          />
                       </svg>
                       <span className={`text-xl font-black font-mono tracking-tighter ${avgUtilization > 85 ? 'text-red-600' : 'text-slate-900'}`}>{avgUtilization}%</span>
                    </div>
                    <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest mt-4">平均资源使用率</p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter mt-1 italic">Aggregate Load Index</p>
                 </div>
              </div>

              {/* Pods 数量 */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                 <div className="flex justify-between items-start">
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                       <Layers size={18} strokeWidth={2.5} />
                    </div>
                    <div className="text-right">
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">活跃 Pod 实例</p>
                       <p className="text-2xl font-black text-slate-900 font-mono tracking-tighter mt-1">{pool.used.pods}</p>
                    </div>
                 </div>
                 <div className="pt-4 border-t border-slate-50">
                    <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1.5">
                       <span>Orchestration Load</span>
                       <span className="text-slate-900">{Math.round((pool.used.pods/pool.quota.pods)*100)}%</span>
                    </div>
                    <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                       <div className="h-full bg-indigo-500" style={{ width: `${(pool.used.pods/pool.quota.pods)*100}%` }}></div>
                    </div>
                 </div>
              </div>
           </div>

           {/* 资源使用详情矩阵 (GPU/CPU/内存/存储) */}
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <UsageCard label="CPU 核心计算" used={pool.used.cpu} total={pool.quota.cpu} unit="C" icon={Cpu} color="bg-primary-500" />
              <UsageCard label="内存 提交总量" used={pool.used.memory} total={pool.quota.memory} unit="G" icon={Activity} color="bg-indigo-500" />
              <UsageCard label="GPU 加速单元" used={pool.used.gpu} total={pool.quota.gpu} unit="U" icon={Zap} color="bg-emerald-500" />
              <UsageCard label="分布式存储 DFS" used={pool.used.storage} total={pool.quota.storage} unit="G" icon={HardDrive} color="bg-amber-500" />
           </div>
        </div>

        {/* 3. 物理节点矩阵 (GPU/CPU/内存/存储/IP/状态) */}
        <div>
           <SectionHeader icon={Box} title="纳管物理节点阵列" sub="Underlying Hardware Inventory" />
           <div className="bg-white border border-slate-200 rounded-[24px] shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead className="bg-slate-50/50 border-b border-slate-200">
                       <tr>
                          <th className="pl-8 pr-4 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Node ID / IP</th>
                          <th className="px-4 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">运行状态</th>
                          <th className="px-4 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">CPU LOAD</th>
                          <th className="px-4 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">MEM LOAD</th>
                          <th className="px-4 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">GPU UNITS</th>
                          <th className="px-4 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">STORAGE</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {poolNodes.map(node => (
                          <tr key={node.id} className="hover:bg-slate-50/80 transition-colors group">
                             <td className="pl-8 pr-4 py-5">
                                <div className="flex flex-col">
                                   <span className="text-[11px] font-black text-slate-900 font-mono group-hover:text-primary-600 transition-colors uppercase tracking-tight">{node.name || node.id}</span>
                                   <div className="flex items-center gap-1.5 mt-1">
                                      <Globe size={10} className="text-slate-300" />
                                      <span className="text-[9px] font-mono font-bold text-slate-400 tracking-tighter">{node.ip}</span>
                                   </div>
                                </div>
                             </td>
                             <td className="px-4 py-5">
                                <div className="flex items-center gap-2">
                                   <div className={`w-1.5 h-1.5 rounded-full ${node.status === 'Ready' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500 animate-pulse'}`}></div>
                                   <span className={`text-[10px] font-black uppercase tracking-widest ${node.status === 'Ready' ? 'text-emerald-600' : 'text-red-600'}`}>{node.status}</span>
                                </div>
                             </td>
                             <td className="px-4 py-5">
                                <div className="flex flex-col gap-1 w-20">
                                   <div className="flex justify-between font-mono text-[9px] font-bold">
                                      <span>{node.cpu.used}c</span>
                                      <span className="text-slate-400">/ {node.cpu.total}</span>
                                   </div>
                                   <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                                      <div className="h-full bg-primary-500" style={{ width: `${(node.cpu.used/node.cpu.total)*100}%` }}></div>
                                   </div>
                                </div>
                             </td>
                             <td className="px-4 py-5">
                                <div className="flex flex-col gap-1 w-20">
                                   <div className="flex justify-between font-mono text-[9px] font-bold">
                                      <span>{node.mem.used}G</span>
                                      <span className="text-slate-400">/ {node.mem.total}</span>
                                   </div>
                                   <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                                      <div className="h-full bg-indigo-500" style={{ width: `${(node.mem.used/node.mem.total)*100}%` }}></div>
                                   </div>
                                </div>
                             </td>
                             <td className="px-4 py-5">
                                {node.gpu ? (
                                   <div className="flex items-center gap-1.5">
                                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg text-[9px] font-black font-mono">
                                         {node.gpu.count} UNITS
                                      </span>
                                      <span className="text-[9px] font-black text-slate-400">{node.gpu.utilization}%</span>
                                   </div>
                                ) : (
                                   <span className="text-[9px] font-bold text-slate-300 italic uppercase">No GPU Binding</span>
                                )}
                             </td>
                             <td className="px-4 py-5">
                                <div className="flex flex-col gap-1 w-20">
                                   <span className="text-[9px] font-mono font-bold text-slate-500">{node.storage?.used || 0}G / {node.storage?.total || 0}G</span>
                                   <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                                      <div className="h-full bg-amber-500" style={{ width: `${((node.storage?.used || 0)/(node.storage?.total || 1))*100}%` }}></div>
                                   </div>
                                </div>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      </div>
    </Drawer>
  );
};
