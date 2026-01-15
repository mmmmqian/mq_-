
import React, { useState, useMemo } from 'react';
import { MOCK_HETERO_RESOURCES } from '../../constants';
import { HeterogeneousResource } from '../../types';
import { Badge } from '../../components/ui/Badge';
import StatCard from '../../components/ui/StatCard';
import { HeteroResourceDrawer } from '../../components/modals/HeteroResourceDrawer';
import { CustomSelect } from '../../components/ui/Select';
import PageHeader from '../../components/layout/PageHeader';
import { 
  Search, RefreshCw, Cpu, Server, Activity, 
  Zap, Thermometer, Box, SlidersHorizontal, ActivitySquare, ShieldCheck,
  LayoutGrid, List, ChevronRight, Info, Clock, Hash, Globe, Filter, Power,
  CheckCircle2, AlertCircle, MoreHorizontal, LayoutDashboard, Database
} from 'lucide-react';

const HeterogeneousResourcesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [vendorFilter, setVendorFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
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
      const matchesType = typeFilter === 'all' || resource.type === typeFilter;

      return matchesSearch && matchesVendor && matchesStatus && matchesType;
    });
  }, [searchTerm, vendorFilter, statusFilter, typeFilter]);

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
    alert(`DEVICE AUDIT [${resource.id}]: Initiating full hardware diagnostics...`);
  };

  const ConnectionStatusLabel = ({ status }: { status: string }) => {
    const isOnline = status === 'online';
    const isMaintenance = status === 'maintenance';
    return (
      <div className="flex items-center gap-1.5">
        <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse' : isMaintenance ? 'bg-amber-500' : 'bg-slate-300'}`}></div>
        <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${isOnline ? 'text-emerald-600' : isMaintenance ? 'text-amber-600' : 'text-slate-400'}`}>
          {status}
        </span>
      </div>
    );
  };

  const HealthBadge = ({ health }: { health: string }) => {
    const isHealthy = health === 'healthy';
    return (
      <div className={`px-2 py-0.5 rounded border text-[9px] font-black uppercase tracking-widest ${isHealthy ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : health === 'warning' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
        {health}
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <HeteroResourceDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        resource={selectedResource} 
      />

      <PageHeader 
        icon={Cpu}
        title="异构算力纳管中心"
        subtitle="HETEROGENEOUS COMPUTE INVENTORY"
        badgeText="SECURE ORCHESTRATION"
        actions={
          <button className="flex items-center gap-2.5 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-all font-black text-[10px] uppercase tracking-[0.2em] shadow-sm active:scale-95">
            <RefreshCw size={14} strokeWidth={2.5} />
            <span>Sync Hardware Stack</span>
          </button>
        }
      />

      {/* KPI Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="GPU (Graphics)" value={stats.gpu} icon={Zap} variant="primary" subtext="High-density Compute" />
        <StatCard title="NPU (Neural)" value={stats.npu} icon={ActivitySquare} subtext="ML Optimized Units" />
        <StatCard title="FPGA (Logic)" value={stats.fpga} icon={LayoutDashboard} subtext="Reconfigurable Logic" />
        <StatCard title="Global Link Rate" value={`${stats.rate}%`} icon={ShieldCheck} subtext={`${stats.online} Online Assets`} />
      </div>

      {/* Advanced Control Bar */}
      <div className="flex flex-col xl:flex-row justify-between items-center gap-5 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
         <div className="flex items-center gap-4 w-full xl:w-auto flex-wrap">
            {/* View Mode */}
            <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
               <button 
                 onClick={() => setViewMode('card')}
                 className={`flex items-center gap-2.5 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${viewMode === 'card' ? 'bg-white text-slate-950 shadow-md ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
               >
                 <LayoutGrid size={15} strokeWidth={2.5} /> Matrix
               </button>
               <button 
                 onClick={() => setViewMode('list')}
                 className={`flex items-center gap-2.5 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${viewMode === 'list' ? 'bg-white text-slate-950 shadow-md ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
               >
                 <List size={15} strokeWidth={2.5} /> Registry
               </button>
            </div>

            <div className="h-6 w-px bg-slate-200 mx-2 hidden xl:block"></div>

            {/* Filter Group */}
            <div className="flex flex-wrap items-center gap-3">
              <CustomSelect
                options={[
                  { value: 'all', label: 'All Vendors' },
                  { value: 'NVIDIA', label: 'NVIDIA' },
                  { value: 'Huawei', label: 'HUAWEI' },
                  { value: 'AMD', label: 'AMD' },
                  { value: 'Intel', label: 'INTEL' }
                ]}
                value={vendorFilter}
                onChange={setVendorFilter}
                className="w-44"
              />
              <CustomSelect
                options={[
                  { value: 'all', label: 'All Modalities' },
                  { value: 'GPU', label: 'GPU (CORE)' },
                  { value: 'NPU', label: 'NPU (NODE)' },
                  { value: 'FPGA', label: 'FPGA (ARRAY)' }
                ]}
                value={typeFilter}
                onChange={setTypeFilter}
                className="w-40"
              />
              <CustomSelect
                options={[
                  { value: 'all', label: 'All Status' },
                  { value: 'online', label: 'Online' },
                  { value: 'offline', label: 'Offline' },
                  { value: 'maintenance', label: 'Maint' }
                ]}
                value={statusFilter}
                onChange={setStatusFilter}
                className="w-36"
              />
            </div>
         </div>
         
         <div className="flex items-center gap-4 w-full xl:w-auto justify-end">
            <div className="relative w-full md:w-80 group">
               <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors pointer-events-none" />
               <input 
                 type="text" 
                 placeholder="ID / MODEL / NODE SEARCH..." 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full pl-12 pr-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] border border-slate-200 rounded-2xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 transition-all placeholder:text-slate-300"
               />
            </div>
         </div>
      </div>

      {viewMode === 'card' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
          {filteredResources.map((resource) => (
            <div 
              key={resource.id}
              onClick={() => handleResourceClick(resource)}
              className="group relative bg-white rounded-4xl border border-slate-200 p-8 hover:shadow-2xl hover:border-primary-400 transition-all duration-500 cursor-pointer overflow-hidden flex flex-col h-full"
            >
              {/* Rigorous Status Sidepanel */}
              <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${
                resource.status === 'online' ? (resource.healthStatus === 'healthy' ? 'bg-emerald-500' : 'bg-amber-500') : 'bg-slate-300'
              }`}></div>

              {/* Header: Model & Health */}
              <div className="flex justify-between items-start mb-10">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-3">
                    <span className="font-black text-slate-900 text-xl tracking-tighter group-hover:text-primary-600 transition-colors uppercase leading-none">{resource.model}</span>
                    <Badge status="primary" showDot={false}>{resource.type}</Badge>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-[10px] font-mono font-black text-slate-400 tracking-tighter uppercase">{resource.id}</span>
                    <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{resource.vendor}</span>
                  </div>
                </div>
                <HealthBadge health={resource.healthStatus} />
              </div>

              {/* Telemetry Display */}
              <div className="grid grid-cols-2 gap-8 mb-8 p-6 bg-slate-50/50 rounded-3xl border border-slate-100/60 relative overflow-hidden">
                <div className="absolute inset-0 tech-grid opacity-[0.05] pointer-events-none"></div>
                <div className="space-y-2.5 relative z-10">
                  <div className="flex justify-between items-center text-[9px] font-black text-slate-400 uppercase tracking-[0.25em]">
                    <span className="flex items-center gap-1.5"><Activity size={12} /> Compute Util</span>
                    <span className={`font-mono font-black ${resource.utilization > 90 ? 'text-red-600' : 'text-slate-900'}`}>{resource.utilization}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200/50 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-1000 ${resource.utilization > 90 ? 'bg-red-500 animate-pulse' : 'bg-primary-600'}`} style={{ width: `${resource.utilization}%` }}></div>
                  </div>
                </div>

                <div className="space-y-2.5 relative z-10">
                  <div className="flex justify-between items-center text-[9px] font-black text-slate-400 uppercase tracking-[0.25em]">
                    <span className="flex items-center gap-1.5"><Thermometer size={12} /> Thermals</span>
                    <span className={`font-mono font-black ${resource.temperature > 80 ? 'text-red-600' : 'text-slate-900'}`}>{resource.temperature}°C</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200/50 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-1000 ${resource.temperature > 80 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(resource.temperature, 100)}%` }}></div>
                  </div>
                </div>
              </div>

              {/* Deployment Meta */}
              <div className="space-y-3 mb-8 flex-grow">
                 <div className="flex items-center justify-between text-[10px] font-sans">
                    <div className="flex items-center gap-2 text-slate-400 font-black uppercase tracking-widest"><Globe size={13} className="text-slate-300" /> Host Node Address</div>
                    <div className="font-mono font-black text-slate-800 tracking-tight">{resource.nodeIp}</div>
                 </div>
                 <div className="flex items-center justify-between text-[10px] font-sans">
                    <div className="flex items-center gap-2 text-slate-400 font-black uppercase tracking-widest"><Clock size={13} className="text-slate-300" /> Driver Interface</div>
                    <div className="font-mono font-black text-slate-600 truncate max-w-[130px] text-right" title={resource.driverVersion}>{resource.driverVersion}</div>
                 </div>
              </div>

              {/* Card Footer */}
              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Internal Reference</span>
                  <span className="text-[10px] font-black text-slate-700 font-mono truncate max-w-[160px] uppercase tracking-tighter" title={resource.nodeId}>{resource.nodeId}</span>
                </div>
                <div className="flex items-center gap-4">
                   <ConnectionStatusLabel status={resource.status} />
                   <div className="p-2 rounded-lg bg-slate-50 text-slate-300 group-hover:text-primary-600 group-hover:bg-primary-50 transition-all duration-300">
                      <ChevronRight size={16} strokeWidth={3} />
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-4xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-1000">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 border-b border-slate-200 whitespace-nowrap">
                  <th className="pl-10 pr-6 py-6 text-[10px] font-black uppercase tracking-[0.3em]">Hardware ID</th>
                  <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.3em]">Model / Vendor</th>
                  <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.3em]">Host Allocation</th>
                  <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.3em]">Connectivity</th>
                  <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.3em]">Health Check</th>
                  <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.3em]">Interface Version</th>
                  <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.3em]">Load Matrix</th>
                  <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.3em]">Thermals</th>
                  <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.3em]">Modality</th>
                  <th className="sticky right-0 bg-slate-50/95 backdrop-blur-md px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-right z-20 shadow-[-12px_0_12px_-12px_rgba(0,0,0,0.1)]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredResources.map(resource => (
                  <tr 
                    key={resource.id}
                    onClick={() => handleResourceClick(resource)}
                    className="group hover:bg-slate-50/80 transition-all cursor-pointer whitespace-nowrap"
                  >
                    <td className="pl-10 pr-6 py-7">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-white group-hover:bg-primary-600 group-hover:shadow-lg group-hover:shadow-primary-500/20 transition-all duration-300">
                            <Zap size={18} strokeWidth={2.5} />
                         </div>
                         <span className="text-[11px] font-black text-slate-900 font-mono tracking-tighter group-hover:text-primary-600 transition-colors uppercase">{resource.id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-7">
                      <div className="flex flex-col">
                        <span className="text-[13px] font-black text-slate-800 tracking-tight uppercase leading-none">{resource.model}</span>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2">{resource.vendor}</span>
                      </div>
                    </td>
                    <td className="px-6 py-7">
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[11px] font-black text-slate-700 tracking-tight uppercase">{resource.clusterName}</span>
                        <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-tighter">{resource.nodeId} · {resource.nodeIp}</span>
                      </div>
                    </td>
                    <td className="px-6 py-7">
                       <ConnectionStatusLabel status={resource.status} />
                    </td>
                    <td className="px-6 py-7">
                       <HealthBadge health={resource.healthStatus} />
                    </td>
                    <td className="px-6 py-7">
                       <span className="text-[11px] font-mono font-black text-slate-600">{resource.driverVersion}</span>
                    </td>
                    <td className="px-6 py-7">
                       <div className="flex items-center gap-4 w-32">
                          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                             <div className={`h-full transition-all duration-1000 ${resource.utilization > 90 ? 'bg-red-500 animate-pulse' : 'bg-primary-600'}`} style={{ width: `${resource.utilization}%` }} />
                          </div>
                          <span className={`text-[11px] font-mono font-black ${resource.utilization > 90 ? 'text-red-600' : 'text-slate-800'}`}>{resource.utilization}%</span>
                       </div>
                    </td>
                    <td className="px-6 py-7">
                       <div className="flex flex-col gap-1.5">
                          <span className={`text-[11px] font-mono font-black ${resource.temperature > 80 ? 'text-red-500' : 'text-slate-800'}`}>{resource.temperature}°C</span>
                          <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">{resource.power}W PWR</span>
                       </div>
                    </td>
                    <td className="px-6 py-7">
                       <Badge status="primary" showDot={false}>{resource.type}</Badge>
                    </td>
                    <td className="sticky right-0 bg-white group-hover:bg-slate-50 transition-colors px-10 py-7 text-right z-10 shadow-[-12px_0_12px_-12px_rgba(0,0,0,0.1)]">
                       <div className="flex items-center justify-end gap-3 opacity-20 group-hover:opacity-100 transition-opacity">
                          <button 
                             onClick={(e) => handleHealthCheck(e, resource)}
                             className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all border border-transparent hover:border-emerald-100" 
                             title="Full Hardware Audit"
                          >
                             <CheckCircle2 size={18} strokeWidth={2.5} />
                          </button>
                          <button className="p-2.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all border border-transparent hover:border-primary-100">
                             <ChevronRight size={20} strokeWidth={2.5} />
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
    </div>
  );
};

export default HeterogeneousResourcesPage;
