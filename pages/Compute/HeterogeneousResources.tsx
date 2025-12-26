
import React, { useState, useMemo } from 'react';
import { MOCK_HETERO_RESOURCES } from '../../constants';
import { HeterogeneousResource } from '../../types';
import { Badge } from '../../components/ui/Badge';
import StatCard from '../../components/ui/StatCard';
import { HeteroResourceDrawer } from '../../components/modals/HeteroResourceDrawer';
import { 
  Search, RefreshCw, Cpu, Server, Activity, 
  Zap, Thermometer, Box, SlidersHorizontal, ActivitySquare, ShieldCheck,
  LayoutGrid, List, ChevronRight, Info, Clock, Hash, Globe, Filter, Power,
  CheckCircle2, AlertCircle, MoreHorizontal
} from 'lucide-react';

const HeterogeneousResourcesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [vendorFilter, setVendorFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [selectedResource, setSelectedResource] = useState<HeterogeneousResource | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const filteredResources = useMemo(() => {
    return MOCK_HETERO_RESOURCES.filter(resource => {
      const matchesSearch = 
        resource.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        resource.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.nodeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.nodeIp.includes(searchTerm);
      
      const matchesVendor = vendorFilter === 'all' || resource.vendor === vendorFilter;
      const matchesStatus = statusFilter === 'all' || resource.status === statusFilter;

      return matchesSearch && matchesVendor && matchesStatus;
    });
  }, [searchTerm, vendorFilter, statusFilter]);

  // Stats calculation
  const stats = useMemo(() => {
    const total = MOCK_HETERO_RESOURCES.length;
    const gpu = MOCK_HETERO_RESOURCES.filter(r => r.type === 'GPU').length;
    const npu = MOCK_HETERO_RESOURCES.filter(r => r.type === 'NPU').length;
    const fpga = MOCK_HETERO_RESOURCES.filter(r => r.type === 'FPGA').length;
    const online = MOCK_HETERO_RESOURCES.filter(r => r.status === 'online').length;
    const rate = total > 0 ? Math.round((online / total) * 100) : 0;
    
    return { gpu, npu, fpga, rate, total, online };
  }, []);

  const handleResourceClick = (resource: HeterogeneousResource) => {
    setSelectedResource(resource);
    setIsDrawerOpen(true);
  };

  const handleHealthCheck = (e: React.MouseEvent, resource: HeterogeneousResource) => {
    e.stopPropagation();
    alert(`正在对设备 ${resource.id} 进行全量健康度检查...`);
  };

  const ConnectionStatusBadge = ({ status }: { status: string }) => {
    const isOnline = status === 'online';
    return (
      <div className="flex items-center gap-1.5">
        <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse' : 'bg-slate-300'}`}></div>
        <span className={`text-[10px] font-black uppercase tracking-widest ${isOnline ? 'text-emerald-600' : 'text-slate-400'}`}>
          {isOnline ? 'Online' : status.toUpperCase()}
        </span>
      </div>
    );
  };

  const HealthStatusBadge = ({ health }: { health: string }) => {
    const isHealthy = health === 'healthy';
    return (
      <Badge status={isHealthy ? 'success' : health === 'warning' ? 'warning' : 'error'}>
        {isHealthy ? '正常 (NORMAL)' : '异常 (ABNORMAL)'}
      </Badge>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <HeteroResourceDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        resource={selectedResource} 
      />

      {/* Page Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white border border-slate-200 px-8 py-6 rounded-[32px] shadow-soft">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-slate-950 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-950/10">
            <Cpu size={28} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">异构算力纳管模块</h1>
            <div className="flex items-center gap-3 mt-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-1.5">
                <ShieldCheck size={12} className="text-emerald-500" /> Multi-Vendor Orchestration
              </span>
              <div className="w-1 h-1 rounded-full bg-slate-200"></div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight italic">Unified Control for GPU, NPU, FPGA and more</p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button className="flex items-center gap-2.5 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all font-black text-[11px] uppercase tracking-widest shadow-sm">
            <RefreshCw size={14} strokeWidth={2.5} />
            <span>刷新集群数据 (SYNC)</span>
          </button>
        </div>
      </div>

      {/* Stats Cards - Updated with requested fields */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="GPU设备数量" 
          value={stats.gpu} 
          subtext="Graphics Units"
          icon={Zap}
          variant="primary"
        />
        <StatCard 
          title="NPU设备数量" 
          value={stats.npu} 
          subtext="Neural Units"
          icon={ActivitySquare}
        />
        <StatCard 
          title="FPGA设备数量" 
          value={stats.fpga} 
          subtext="Logic Arrays"
          icon={LayoutGrid}
        />
        <StatCard 
          title="设备在线率" 
          value={`${stats.rate}%`} 
          subtext={`${stats.online} / ${stats.total} Linked`}
          icon={ShieldCheck}
          isAlert={false} // No alarm as requested
        />
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-3 rounded-2xl border border-slate-200 shadow-soft">
         <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
            {/* View Mode Switcher */}
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
               <button 
                 onClick={() => setViewMode('card')}
                 className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'card' ? 'bg-white text-primary-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
               >
                 <LayoutGrid size={14} strokeWidth={2.5} /> Matrix
               </button>
               <button 
                 onClick={() => setViewMode('list')}
                 className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'list' ? 'bg-white text-primary-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
               >
                 <List size={14} strokeWidth={2.5} /> List
               </button>
            </div>

            <div className="h-6 w-px bg-slate-200 mx-1 hidden md:block"></div>

            <div className="relative w-full md:w-72 group">
               <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors pointer-events-none" />
               <input 
                 type="text" 
                 placeholder="ID / MODEL / HOST..." 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full pl-11 pr-4 py-2.5 text-[10px] font-black uppercase tracking-widest border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 transition-all placeholder:text-slate-300"
               />
            </div>
         </div>
         
         <div className="flex gap-2 w-full md:w-auto justify-end">
            <button className="p-2.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all border border-transparent hover:border-primary-100 shadow-sm">
               <SlidersHorizontal size={18} />
            </button>
         </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'card' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {filteredResources.map((resource) => (
            <div 
              key={resource.id}
              onClick={() => handleResourceClick(resource)}
              className="group relative bg-white rounded-[32px] border border-slate-200 p-8 hover:shadow-2xl hover:border-primary-400 transition-all duration-500 cursor-pointer overflow-hidden flex flex-col h-full"
            >
              <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${
                resource.status === 'online' ? (resource.healthStatus === 'healthy' ? 'bg-emerald-500' : 'bg-amber-500') : 'bg-slate-300'
              }`}></div>

              <div className="flex justify-between items-start mb-8">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-900 text-xl tracking-tight group-hover:text-primary-600 transition-colors uppercase">{resource.model}</span>
                    <Badge status="primary" showDot={false}>{resource.type}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-slate-400 tracking-tighter uppercase">{resource.id}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{resource.vendor}</span>
                  </div>
                </div>
                <HealthStatusBadge health={resource.healthStatus} />
              </div>

              <div className="grid grid-cols-2 gap-8 my-6 bg-slate-50/50 rounded-3xl p-6 border border-slate-100">
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <span className="flex items-center gap-1.5"><Activity size={12} /> UTIL</span>
                    <span className={resource.utilization > 90 ? 'text-red-600 font-mono font-black' : 'text-slate-900 font-mono font-black'}>{resource.utilization}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-1000 ${resource.utilization > 90 ? 'bg-red-500 animate-pulse' : 'bg-primary-600'}`} style={{ width: `${resource.utilization}%` }}></div>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <span className="flex items-center gap-1.5"><Thermometer size={12} /> TEMP</span>
                    <span className={resource.temperature > 80 ? 'text-red-600 font-mono font-black' : 'text-slate-900 font-mono font-black'}>{resource.temperature}°C</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-1000 ${resource.temperature > 80 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(resource.temperature, 100)}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="mt-auto space-y-4 pt-4 flex-grow">
                 <div className="flex items-center justify-between text-[11px] font-sans">
                    <div className="flex items-center gap-2 text-slate-500 font-bold uppercase tracking-tight"><Globe size={13} className="text-slate-300" /> HOST NODE IP</div>
                    <div className="font-mono font-bold text-slate-800">{resource.nodeIp}</div>
                 </div>
                 <div className="flex items-center justify-between text-[11px] font-sans">
                    <div className="flex items-center gap-2 text-slate-500 font-bold uppercase tracking-tight"><Clock size={13} className="text-slate-300" /> DRIVER VER.</div>
                    <div className="font-mono font-bold text-slate-700 truncate max-w-[140px] text-right" title={resource.driverVersion}>{resource.driverVersion}</div>
                 </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Assigned Node</span>
                  <span className="text-[10px] font-bold text-slate-700 font-mono truncate max-w-[160px]" title={resource.nodeId}>{resource.nodeId}</span>
                </div>
                <ConnectionStatusBadge status={resource.status} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View Mode - Optimized Table */
        <div className="bg-white border border-slate-200 rounded-[32px] shadow-soft overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 border-b border-slate-200 whitespace-nowrap">
                  <th className="pl-10 pr-6 py-6 text-[10px] font-black uppercase tracking-[0.2em]">设备标识 (ID)</th>
                  <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em]">型号与厂商</th>
                  <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em]">所属节点 (CLUSTER/NODE)</th>
                  <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em]">连接状态</th>
                  <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em]">设备状态</th>
                  <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em]">驱动版本</th>
                  <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em]">利用率</th>
                  <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em]">温度/功耗</th>
                  <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em]">标签/类型</th>
                  <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-right pr-10">操作 (ACTION)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredResources.map(resource => (
                  <tr 
                    key={resource.id}
                    onClick={() => handleResourceClick(resource)}
                    className="group hover:bg-slate-50/80 transition-all cursor-pointer whitespace-nowrap"
                  >
                    <td className="pl-10 pr-6 py-6">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
                            <Zap size={18} strokeWidth={2.5} />
                         </div>
                         <span className="text-[11px] font-black text-slate-900 tracking-tight font-mono group-hover:text-primary-600 transition-colors uppercase">{resource.id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex flex-col">
                        <span className="text-[12px] font-black text-slate-800 tracking-tight uppercase leading-none">{resource.model}</span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{resource.vendor}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-[11px] font-bold text-slate-700">{resource.clusterName}</span>
                        <span className="text-[9px] font-mono text-slate-400 tracking-tighter">{resource.nodeId} · {resource.nodeIp}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                       <ConnectionStatusBadge status={resource.status} />
                    </td>
                    <td className="px-6 py-6">
                       <HealthStatusBadge health={resource.healthStatus} />
                    </td>
                    <td className="px-6 py-6">
                       <span className="text-[11px] font-mono font-bold text-slate-500">{resource.driverVersion}</span>
                    </td>
                    <td className="px-6 py-6">
                       <div className="flex items-center gap-3 w-32">
                          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                             <div className={`h-full transition-all duration-1000 ${resource.utilization > 90 ? 'bg-red-500 animate-pulse' : 'bg-primary-600'}`} style={{ width: `${resource.utilization}%` }} />
                          </div>
                          <span className={`text-[11px] font-mono font-black ${resource.utilization > 90 ? 'text-red-600' : 'text-slate-800'}`}>{resource.utilization}%</span>
                       </div>
                    </td>
                    <td className="px-6 py-6">
                       <div className="flex flex-col gap-1">
                          <span className={`text-[11px] font-mono font-black ${resource.temperature > 80 ? 'text-red-500' : 'text-slate-800'}`}>{resource.temperature}°C</span>
                          <span className="text-[9px] font-mono text-slate-400 uppercase tracking-tighter">{resource.power}W Power</span>
                       </div>
                    </td>
                    <td className="px-6 py-6">
                       <Badge status="primary" showDot={false}>{resource.type}</Badge>
                    </td>
                    <td className="px-6 py-6 text-right pr-10">
                       <div className="flex items-center justify-end gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                          <button 
                             onClick={(e) => handleHealthCheck(e, resource)}
                             className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all" 
                             title="健康度检查 (HEALTH CHECK)"
                          >
                             <CheckCircle2 size={16} strokeWidth={2.5} />
                          </button>
                          <button className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all">
                             <ChevronRight size={18} strokeWidth={2.5} />
                          </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredResources.length === 0 && (
        <div className="py-32 flex flex-col items-center justify-center text-slate-300 bg-white border border-slate-200 rounded-[40px] shadow-soft">
           <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-8 border border-slate-100">
              <Box size={40} strokeWidth={1} className="opacity-20" />
           </div>
           <p className="text-[12px] font-black uppercase tracking-[0.4em] text-slate-400">Inventory Undefined / No Matches</p>
           <button 
              onClick={() => { setSearchTerm(''); setVendorFilter('all'); setStatusFilter('all'); }}
              className="mt-8 text-[10px] font-black text-primary-600 uppercase tracking-widest hover:underline"
           >
              Clear Local Filters
           </button>
        </div>
      )}
    </div>
  );
};

export default HeterogeneousResourcesPage;
