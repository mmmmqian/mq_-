
import React, { useState, useMemo } from 'react';
import { 
  Users, Plus, Search, RefreshCw, 
  ChevronRight, MoreHorizontal, Edit, 
  Trash2, ShieldCheck, Clock, Layers, 
  Cpu, Zap, Database, Globe, SearchIcon,
  FilterIcon, Power, ShieldAlert, ExternalLink,
  BarChart3, ActivitySquare, LayoutGrid, List,
  TrendingUp, ArrowUpRight, Copy, CheckCircle2
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import StatCard from '../../components/ui/StatCard';
import PageHeader from '../../components/layout/PageHeader';
import { CustomSelect } from '../../components/ui/Select';
import { CreateTenantModal } from '../../components/modals/CreateTenantModal';
import { DeleteTenantModal } from '../../components/modals/DeleteTenantModal';
import { MOCK_TENANTS } from '../../constants';
import { Tenant } from '../../types';

const TenantsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // 模拟平台总额度
  const platformTotal = { cpu: 10000, gpu: 256, storage: 1048576 };
  const platformAllocated = useMemo(() => {
    return MOCK_TENANTS.reduce((acc, t) => ({
      cpu: acc.cpu + t.quota.cpu,
      gpu: acc.gpu + t.quota.gpu,
      storage: acc.storage + t.quota.storage
    }), { cpu: 0, gpu: 0, storage: 0 });
  }, []);

  const filteredTenants = useMemo(() => {
    return MOCK_TENANTS.filter(t => {
      const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           t.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const ResourceProgress = ({ label, used, total, unit, color }: any) => {
    const percent = Math.round((used / total) * 100);
    const isCritical = percent >= 80;
    return (
      <div className="flex flex-col gap-1 w-32">
         <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-tighter">
            <span className="text-slate-400">{label}</span>
            <span className={isCritical ? 'text-red-500 font-bold' : 'text-slate-600'}>{percent}%</span>
         </div>
         <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ${isCritical ? 'bg-red-500 animate-pulse' : color}`} 
              style={{ width: `${percent}%` }} 
            />
         </div>
         <div className="text-[7px] font-mono text-slate-300 uppercase tracking-tighter text-right">
            {used} / {total} {unit}
         </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 font-sans">
      <CreateTenantModal 
        isOpen={isCreateOpen} 
        onClose={() => { setIsCreateOpen(false); setSelectedTenant(null); }} 
        initialData={selectedTenant}
      />
      <DeleteTenantModal 
        isOpen={isDeleteOpen} 
        onClose={() => setIsDeleteOpen(false)} 
        tenant={selectedTenant}
        onConfirm={(id) => { console.log('Deleting tenant:', id); setIsDeleteOpen(false); }}
      />

      <PageHeader 
        icon={Users}
        title="组织租户治理中心"
        subtitle="MULTI-TENANT INFRASTRUCTURE ORCHESTRATION"
        badgeText="GLOBAL ADMIN ACCESS"
        actions={
          <button 
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2.5 px-8 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-primary-500/20 active:scale-95"
          >
            <Plus size={16} strokeWidth={3} />
            <span>创建新租户</span>
          </button>
        }
      />

      {/* Platform Aggregate Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="全局已注销租户" value={MOCK_TENANTS.length} icon={Globe} subtext="Active Entities" />
        <StatCard title="GPU 总分配率" value={`${Math.round((platformAllocated.gpu / platformTotal.gpu) * 100)}%`} icon={Zap} variant="primary" subtext={`${platformAllocated.gpu} / ${platformTotal.gpu} Cards`} />
        <StatCard title="CPU 总分配率" value={`${Math.round((platformAllocated.cpu / platformTotal.cpu) * 100)}%`} icon={Cpu} subtext={`${platformAllocated.cpu} / ${platformTotal.cpu} Cores`} />
        <StatCard title="活跃项目总量" value={MOCK_TENANTS.reduce((a, b) => a + b.projectCount, 0)} icon={Layers} subtext="Across all tenants" />
      </div>

      {/* Control Bar */}
      <div className="flex flex-col xl:flex-row justify-between items-center gap-5 bg-white p-4 rounded-[28px] border border-slate-200 shadow-sm">
         <div className="flex items-center gap-4 w-full xl:w-auto">
            <div className="relative flex-1 xl:w-80 group">
               <SearchIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-500 transition-colors pointer-events-none" />
               <input 
                 type="text" 
                 placeholder="ID / TENANT SEARCH..." 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full pl-12 pr-4 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] border border-slate-200 rounded-2xl bg-slate-50 focus:bg-white focus:outline-none focus:border-primary-500 transition-all"
               />
            </div>
            <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
            <CustomSelect
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'active', label: '启用中' },
                { value: 'disabled', label: '已停用' }
              ]}
              value={statusFilter}
              onChange={setStatusFilter}
              className="w-40"
            />
         </div>
         <div className="flex items-center gap-3">
            <button className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-400 hover:text-primary-600 transition-all">
               <RefreshCw size={18} />
            </button>
            <div className="h-6 w-px bg-slate-200 mx-2"></div>
            <Badge status="info" showDot={false}>QUOTA AUTO-SYNC: ON</Badge>
         </div>
      </div>

      {/* Tenants Registry Table */}
      <div className="bg-white border border-slate-200 rounded-[36px] shadow-soft overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50/50 text-slate-400 border-b border-slate-200 whitespace-nowrap">
                     <th className="pl-10 pr-6 py-6 text-[10px] font-black uppercase tracking-[0.3em]">租户身份标识 (IDENTITY)</th>
                     <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.3em]">运行状态</th>
                     <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.3em]">资源配额水位</th>
                     <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-center">项目负载</th>
                     <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-center">用户规模</th>
                     <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.3em]">创建日期</th>
                     <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-right">操作</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {filteredTenants.map(tenant => (
                     <tr key={tenant.id} className="group hover:bg-slate-50/80 transition-all cursor-pointer">
                        <td className="pl-10 pr-6 py-7">
                           <div className="flex items-center gap-4">
                              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-lg transition-all duration-500 ${tenant.status === 'active' ? 'bg-slate-950 group-hover:bg-primary-600 group-hover:shadow-primary-500/30' : 'bg-slate-300'}`}>
                                 <Users size={20} strokeWidth={2.5} />
                              </div>
                              <div className="flex flex-col">
                                 <span className="font-black text-slate-900 tracking-tight text-sm uppercase group-hover:text-primary-600 transition-colors">{tenant.name}</span>
                                 <div className="flex items-center gap-1.5 mt-1">
                                    <span className="font-mono text-[9px] font-bold text-slate-400 tracking-tighter uppercase">{tenant.id}</span>
                                    <button onClick={(e) => { e.stopPropagation(); handleCopy(tenant.id, `copy-${tenant.id}`); }} className="text-slate-300 hover:text-primary-500 transition-colors">
                                       {copiedId === `copy-${tenant.id}` ? <CheckCircle2 size={10} className="text-emerald-500" /> : <Copy size={10} />}
                                    </button>
                                 </div>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-7">
                           <Badge status={tenant.status === 'active' ? 'success' : 'neutral'}>
                              {tenant.status === 'active' ? '运行中' : '已禁用'}
                           </Badge>
                        </td>
                        <td className="px-6 py-7">
                           <div className="flex gap-6">
                              <ResourceProgress label="GPU" used={tenant.quota.gpuUsed} total={tenant.quota.gpu} unit="U" color="bg-emerald-500" />
                              <ResourceProgress label="CPU" used={tenant.quota.cpuUsed} total={tenant.quota.cpu} unit="C" color="bg-primary-500" />
                              <ResourceProgress label="STORAGE" used={tenant.quota.storageUsed} total={tenant.quota.storage} unit="G" color="bg-amber-500" />
                           </div>
                        </td>
                        <td className="px-6 py-7 text-center">
                           <div className="inline-flex flex-col items-center">
                              <span className="text-[13px] font-mono font-black text-slate-900 tracking-tighter">{tenant.projectCount} <span className="text-slate-300">/</span> {tenant.projectLimit}</span>
                              <div className="w-12 h-1 bg-slate-100 rounded-full mt-2 overflow-hidden"><div className="h-full bg-primary-600" style={{ width: `${(tenant.projectCount / tenant.projectLimit) * 100}%` }} /></div>
                           </div>
                        </td>
                        <td className="px-6 py-7 text-center">
                           <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-200 rounded-xl">
                              <Users size={12} className="text-slate-400" />
                              <span className="text-[11px] font-black text-slate-900 font-mono tracking-tighter">{tenant.userCount}</span>
                           </div>
                        </td>
                        <td className="px-6 py-7">
                           <span className="text-[11px] font-mono font-bold text-slate-500">{tenant.createdAt}</span>
                        </td>
                        <td className="px-10 py-7 text-right">
                           <div className="flex justify-end gap-1 opacity-20 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={(e) => { e.stopPropagation(); setSelectedTenant(tenant); setIsCreateOpen(true); }}
                                className="p-2.5 text-slate-400 hover:text-primary-600 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 transition-all" title="编辑租户"
                              >
                                 <Edit size={16} />
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); alert(`切换租户 [${tenant.name}] 状态...`); }}
                                className="p-2.5 text-slate-400 hover:text-primary-600 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 transition-all" title="变更状态"
                              >
                                 <Power size={16} />
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); setSelectedTenant(tenant); setIsDeleteOpen(true); }}
                                className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-white rounded-xl border border-transparent hover:border-red-100 transition-all" title="注销租户"
                              >
                                 <Trash2 size={16} />
                              </button>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

export default TenantsPage;
