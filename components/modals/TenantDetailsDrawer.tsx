
import React, { useState, useMemo } from 'react';
import { Drawer } from '../ui/Drawer';
import { Badge } from '../ui/Badge';
import { 
  Users, Layers, FolderKanban, History, 
  Activity, Cpu, Zap, Database, 
  Info, ShieldCheck, Globe, Clock,
  Search, ExternalLink, ArrowUpRight,
  ShieldAlert, Settings, Network,
  LayoutDashboard, Server, BarChart3,
  Link
} from 'lucide-react';
import { Tenant, ResourcePool, Project } from '../../types';
import { MOCK_RESOURCE_POOLS, MOCK_PROJECTS } from '../../constants';

interface TenantDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  tenant: Tenant | null;
}

export const TenantDetailsDrawer: React.FC<TenantDetailsDrawerProps> = ({ isOpen, onClose, tenant }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'pools' | 'projects' | 'audit'>('overview');

  const tenantPools = useMemo(() => 
    MOCK_RESOURCE_POOLS.filter(p => p.tenantId === tenant?.id), 
    [tenant]
  );

  const tenantProjects = useMemo(() => 
    MOCK_PROJECTS.filter(p => p.tenantId === tenant?.id), 
    [tenant]
  );

  if (!tenant) return null;

  const ResourceProgress = ({ label, used, total, unit, color }: any) => {
    const percent = total > 0 ? Math.round((used / total) * 100) : 0;
    const isCritical = percent > 85;
    return (
      <div className="space-y-3">
         <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
            <span className="text-slate-400">{label}</span>
            <div className="flex gap-2">
               <span className={`font-mono ${isCritical ? 'text-red-500' : 'text-slate-900'}`}>{used.toLocaleString()} / {total.toLocaleString()} {unit}</span>
               <span className={`font-mono px-1.5 rounded ${isCritical ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-500'}`}>{percent}%</span>
            </div>
         </div>
         <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/30">
            <div className={`h-full transition-all duration-1000 ${isCritical ? 'bg-red-500 animate-pulse' : color}`} style={{ width: `${percent}%` }}></div>
         </div>
      </div>
    );
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-slate-950 rounded-lg flex items-center justify-center text-white shadow-lg">
            <Users size={16} strokeWidth={2.5} />
          </div>
          <span className="font-black uppercase tracking-tight text-slate-900">租户全维审计详情</span>
        </div>
      }
      description={`TENANT_UUID: ${tenant.id}`}
      width="max-w-5xl"
      footer={
        <button onClick={onClose} className="w-full py-3.5 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary-600 transition-all shadow-xl active:scale-95">
           CLOSE AUDIT REPORT
        </button>
      }
    >
      <div className="space-y-10 font-sans pb-10">
         {/* Identity Hub Card */}
         <div className="bg-slate-950 rounded-[40px] p-10 border border-slate-800 relative overflow-hidden shadow-2xl group">
            <div className="absolute top-0 right-0 p-12 opacity-5 text-white pointer-events-none group-hover:opacity-10 transition-opacity duration-1000">
               <Globe size={240} strokeWidth={0.5} />
            </div>
            <div className="relative z-10">
               <div className="flex justify-between items-start mb-10">
                  <div className="space-y-4">
                     <div className="flex items-center gap-3">
                        <Badge status={tenant.status === 'active' ? 'success' : 'neutral'} showDot>{tenant.status.toUpperCase()}</Badge>
                        <div className="w-1 h-1 rounded-full bg-slate-700"></div>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono">ESTABLISHED: {tenant.createdAt}</span>
                     </div>
                     <h3 className="text-4xl font-black text-white tracking-tighter leading-none uppercase">{tenant.name}</h3>
                  </div>
                  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-primary-400">
                     <ShieldCheck size={32} strokeWidth={2} />
                  </div>
               </div>
               
               <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-10 border-t border-white/5">
                  <div className="space-y-2">
                     <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">关联业务项目</p>
                     <p className="text-2xl font-black text-white font-mono tracking-tighter">{tenant.projectCount} <span className="text-xs text-slate-700 uppercase">Projects</span></p>
                  </div>
                  <div className="space-y-2">
                     <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">活跃开发者席位</p>
                     <p className="text-2xl font-black text-white font-mono tracking-tighter">{tenant.userCount} <span className="text-xs text-slate-700 uppercase">Users</span></p>
                  </div>
                  <div className="space-y-2">
                     <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">授权逻辑池数</p>
                     <p className="text-2xl font-black text-white font-mono tracking-tighter">{tenantPools.length} <span className="text-xs text-slate-700 uppercase">Pools</span></p>
                  </div>
                  <div className="space-y-2">
                     <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">审计合规状态</p>
                     <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></div>
                        <span className="text-[12px] font-black text-white uppercase tracking-widest">NOMINAL</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Navigation Tabs */}
         <div className="flex border-b border-slate-200 bg-white sticky top-0 z-20 overflow-x-auto no-scrollbar">
            {[
               { id: 'overview', label: '运行概览', icon: LayoutDashboard },
               { id: 'pools', label: '授权资源池', icon: Layers },
               { id: 'projects', label: '业务项目', icon: FolderKanban },
               { id: 'audit', label: '审计日志', icon: History }
            ].map(tab => (
               <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-8 py-4 text-[11px] font-black uppercase tracking-widest border-b-2 transition-all flex items-center gap-2.5 whitespace-nowrap ${activeTab === tab.id ? 'border-primary-600 text-primary-600 bg-primary-50/20' : 'border-transparent text-slate-400 hover:text-slate-900'}`}
               >
                  <tab.icon size={15} strokeWidth={2.5} />
                  {tab.label}
               </button>
            ))}
         </div>

         <div className="min-h-[500px]">
            {activeTab === 'overview' && (
               <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  {/* 聚合配额利用率 */}
                  <div className="space-y-6">
                     <div className="flex justify-between items-center px-1">
                        <h5 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
                           <Activity size={18} className="text-primary-600" /> 租户聚合算力水位 (AGGREGATE_QUOTA)
                        </h5>
                        <div className="px-3 py-1 bg-slate-100 rounded-lg text-[9px] font-black text-slate-400 uppercase tracking-tighter">Real-time Polling</div>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="p-8 bg-white border border-slate-200 rounded-[32px] shadow-sm hover:border-primary-300 transition-all space-y-8">
                           <ResourceProgress label="GPU 加速单元 (ACCELERATOR)" used={tenant.quota.gpuUsed} total={tenant.quota.gpu} unit="Units" color="bg-emerald-500" />
                           <ResourceProgress label="CPU 核心计算 (COMPUTE)" used={tenant.quota.cpuUsed} total={tenant.quota.cpu} unit="Cores" color="bg-primary-500" />
                        </div>
                        <div className="p-8 bg-white border border-slate-200 rounded-[32px] shadow-sm hover:border-indigo-300 transition-all space-y-8">
                           <ResourceProgress label="内存 提交总量 (MEMORY)" used={tenant.quota.memoryUsed} total={tenant.quota.memory} unit="GB" color="bg-indigo-500" />
                           <ResourceProgress label="持久化存储 (STORAGE)" used={tenant.quota.storageUsed} total={tenant.quota.storage} unit="GB" color="bg-amber-500" />
                        </div>
                     </div>
                  </div>

                  {/* 信息矩阵 */}
                  <div className="space-y-6">
                     <h5 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
                        <Info size={18} className="text-primary-600" /> 租户元数据与描述 (METADATA)
                     </h5>
                     <div className="bg-slate-50 border border-slate-200 rounded-[32px] p-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                           <div className="space-y-1.5">
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">租户官方描述</p>
                              <p className="text-sm font-medium text-slate-700 leading-relaxed italic">"{tenant.description || '该组织尚未定义描述信息。'}"</p>
                           </div>
                           <div className="space-y-1.5">
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">安全管控级别</p>
                              <div className="flex items-center gap-2">
                                 <ShieldCheck size={16} className="text-emerald-500" />
                                 <span className="text-sm font-black text-slate-900 uppercase tracking-tight">Level 3: Enterprise Critical</span>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            )}

            {activeTab === 'pools' && (
               <div className="space-y-6 animate-in fade-in duration-500">
                  <div className="flex justify-between items-center px-1">
                     <h5 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Layers size={18} className="text-primary-600" /> 逻辑资源池授权矩阵 (AUTHORIZED_POOLS)
                     </h5>
                     <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest">{tenantPools.length} POOLS BOUND</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {tenantPools.map(pool => (
                        <div key={pool.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:border-primary-400 hover:shadow-xl transition-all group cursor-pointer relative overflow-hidden">
                           <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
                              <Server size={60} />
                           </div>
                           <div className="flex justify-between items-start mb-6">
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-primary-600 group-hover:text-white transition-all shadow-inner">
                                    <Layers size={20} />
                                 </div>
                                 <div>
                                    <h6 className="text-[13px] font-black text-slate-900 uppercase tracking-tight">{pool.displayName}</h6>
                                    <p className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-tighter mt-0.5">{pool.clusterName}</p>
                                 </div>
                              </div>
                              <Badge status="success" showDot={false}>ACTIVE</Badge>
                           </div>
                           <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-50">
                              <div className="space-y-1">
                                 <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">CPU 核心</p>
                                 <p className="text-[11px] font-black font-mono text-slate-800">{pool.quota.cpu}C</p>
                              </div>
                              <div className="space-y-1">
                                 <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">GPU 算力</p>
                                 <p className="text-[11px] font-black font-mono text-slate-800">{pool.quota.gpu}U</p>
                              </div>
                              <div className="space-y-1">
                                 <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">POD 上限</p>
                                 <p className="text-[11px] font-black font-mono text-slate-800">{pool.quota.pods}</p>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            )}

            {activeTab === 'projects' && (
               <div className="space-y-6 animate-in fade-in duration-500">
                  <div className="flex justify-between items-center px-1">
                     <h5 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
                        <FolderKanban size={18} className="text-primary-600" /> 内部项目资产透视 (TENANT_PROJECTS)
                     </h5>
                     <div className="relative w-48 group">
                        <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="text" placeholder="FILTER..." className="w-full pl-8 pr-3 py-1.5 bg-slate-100 border border-transparent rounded-xl text-[9px] font-bold uppercase focus:bg-white focus:border-slate-200 outline-none transition-all shadow-inner" />
                     </div>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
                     <table className="w-full text-left">
                        <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                           <tr>
                              <th className="px-8 py-5">项目名称 / ID</th>
                              <th className="px-8 py-5">负责人 (OWNER)</th>
                              <th className="px-8 py-5">资源分配 (G/C/M)</th>
                              <th className="px-8 py-5">团队规模</th>
                              <th className="px-8 py-5 text-right">查看</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                           {tenantProjects.map(p => (
                              <tr key={p.id} className="group hover:bg-slate-50/50 transition-colors">
                                 <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                       <div className="w-9 h-9 rounded-xl bg-slate-950 flex items-center justify-center text-white shadow-lg">
                                          <FolderKanban size={16} />
                                       </div>
                                       <div className="flex flex-col">
                                          <span className="text-[12px] font-black text-slate-900 uppercase tracking-tight">{p.name}</span>
                                          <span className="text-[9px] font-mono font-bold text-slate-400 mt-1 uppercase tracking-tighter">{p.id}</span>
                                       </div>
                                    </div>
                                 </td>
                                 <td className="px-8 py-6">
                                    <div className="flex items-center gap-2">
                                       <div className="w-5 h-5 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[9px] font-black text-slate-500 uppercase">{p.owner[0]}</div>
                                       <span className="text-[11px] font-bold text-slate-700 font-mono">{p.owner}</span>
                                    </div>
                                 </td>
                                 <td className="px-8 py-6">
                                    <div className="flex items-center gap-4 text-[10px] font-mono font-black text-slate-500">
                                       <span className="flex items-center gap-1.5"><Zap size={10} className="text-emerald-500"/> {p.quota.gpu}U</span>
                                       <span className="flex items-center gap-1.5"><Cpu size={10} className="text-primary-500"/> {p.quota.cpu}C</span>
                                       <span className="flex items-center gap-1.5"><Database size={10} className="text-indigo-500"/> {p.quota.memory}G</span>
                                    </div>
                                 </td>
                                 <td className="px-8 py-6">
                                    <div className="flex items-center gap-2">
                                       <Users size={12} className="text-slate-300" />
                                       <span className="text-[11px] font-black font-mono text-slate-900">{p.memberCount}</span>
                                    </div>
                                 </td>
                                 <td className="px-8 py-6 text-right">
                                    <button className="p-2 text-slate-300 hover:text-primary-600 transition-all"><ArrowUpRight size={18} /></button>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            )}

            {activeTab === 'audit' && (
               <div className="space-y-6 animate-in fade-in duration-500">
                  <h5 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
                     <History size={18} className="text-primary-600" /> 租户级变更审计轨迹 (TRACE_LOG)
                  </h5>
                  <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
                     {[
                        { time: '2024-05-20 10:30:12', action: 'QUOTA_EXPANSION', actor: 'admin_sys', detail: 'GPU Quota increased from 64 to 80 Units', icon: Zap, color: 'text-emerald-500' },
                        { time: '2024-05-18 16:45:00', action: 'RESOURCE_BINDING', actor: 'admin_sys', detail: 'Authorized Pool POOL-LLM-01 binding successful', icon: Link, color: 'text-primary-500' },
                        { time: '2024-05-15 09:12:33', action: 'TENANT_INITIALIZED', actor: 'root', detail: 'Security isolation scope defined', icon: ShieldCheck, color: 'text-slate-400' }
                     ].map((log, i) => (
                        <div key={i} className="flex gap-6 px-10 py-6 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 items-start">
                           <div className={`mt-1 p-2 rounded-xl bg-slate-50 ${log.color}`}>
                              <log.icon size={16} strokeWidth={2.5} />
                           </div>
                           <div className="flex-1">
                              <div className="flex justify-between items-center mb-1">
                                 <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest">{log.action}</span>
                                 <span className="text-[10px] font-mono font-bold text-slate-400">{log.time}</span>
                              </div>
                              <p className="text-[12px] text-slate-500 font-medium">{log.detail}</p>
                              <div className="flex items-center gap-1.5 mt-3">
                                 <div className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-[8px] font-black text-slate-500 uppercase">{log.actor[0]}</div>
                                 <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Executor: {log.actor}</span>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            )}
         </div>

         {/* Security Protocol Footer */}
         <div className="bg-primary-50 border border-primary-100 p-8 rounded-[40px] flex gap-8 items-start shadow-sm">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary-600 shadow-xl border border-primary-50 shrink-0">
               <ShieldAlert size={24} strokeWidth={2.5} />
            </div>
            <div className="space-y-3">
               <h6 className="text-[12px] font-black text-slate-900 uppercase tracking-widest">租户资源隔离合规协议 (ISOLATION_PROTOCOL_V2)</h6>
               <p className="text-[11px] text-slate-600 leading-relaxed font-medium uppercase tracking-tight">
                  1. 该租户的所有计算资源调度均在专有的逻辑切片中进行，物理层通过 K8s Namespace 及 NetworkPolicy 强制隔离。
                  <br/>
                  2. 租户配额的每一次变更均由系统审计内核（Nexus Kernel）实时存证，支持全链溯源。
               </p>
            </div>
         </div>
      </div>
    </Drawer>
  );
};
