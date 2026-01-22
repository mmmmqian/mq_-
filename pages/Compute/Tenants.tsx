
import React, { useState, useMemo } from 'react';
import { 
  Users, Plus, Search, RefreshCw, 
  Edit, Trash2, ShieldCheck, Mail, Phone,
  Clock, Hash, Globe, Filter, Power, 
  KeyRound, MoreHorizontal, UserCircle,
  Copy, CheckCircle2, LayoutGrid, List,
  ExternalLink, SearchIcon, FilterIcon,
  ChevronRight, Info, LogIn, BarChart3,
  Layers, FolderKanban
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import PageHeader from '../../components/layout/PageHeader';
import { CustomSelect } from '../../components/ui/Select';
import { CreateTenantModal } from '../../components/modals/CreateTenantModal';
import { DeleteTenantModal } from '../../components/modals/DeleteTenantModal';
import { TenantDetailsDrawer } from '../../components/modals/TenantDetailsDrawer';
import { MOCK_TENANTS } from '../../constants';
import { Tenant } from '../../types';

const TenantsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

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

  const handleShowDetails = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setIsDetailsOpen(true);
  };

  const handleToggleStatus = (e: React.MouseEvent, tenant: Tenant) => {
    e.stopPropagation();
    const action = tenant.status === 'active' ? '禁用' : '启用';
    if (window.confirm(`确认是否${action}租户 [${tenant.name}]？`)) {
        console.log(`[AUDIT] Status transition for ${tenant.id}`);
    }
  };

  const ResourceProgress = ({ label, used, total, unit, color }: any) => {
    const percent = Math.round((used / total) * 100);
    return (
      <div className="flex flex-col gap-1 w-28">
         <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-tighter">
            <span className="text-slate-400">{label}</span>
            <span className="text-slate-600 font-mono">{percent}%</span>
         </div>
         <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
            <div className={`h-full transition-all duration-1000 ${color}`} style={{ width: `${percent}%` }} />
         </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 font-sans">
      <TenantDetailsDrawer 
        isOpen={isDetailsOpen} 
        onClose={() => { setIsDetailsOpen(false); setSelectedTenant(null); }} 
        tenant={selectedTenant} 
      />
      <CreateTenantModal 
        isOpen={isCreateOpen} 
        onClose={() => { setIsCreateOpen(false); setSelectedTenant(null); }} 
        initialData={selectedTenant}
      />
      <DeleteTenantModal 
        isOpen={isDeleteOpen} 
        onClose={() => setIsDeleteOpen(false)} 
        tenant={selectedTenant}
        onConfirm={() => setIsDeleteOpen(false)}
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
              options={[{ value: 'all', label: '所有状态' }, { value: 'active', label: '运行中' }, { value: 'disabled', label: '已停用' }]}
              value={statusFilter}
              onChange={setStatusFilter}
              className="w-40"
            />
         </div>
         <button className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-400 hover:text-primary-600 transition-all">
            <RefreshCw size={18} />
         </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-[36px] shadow-soft overflow-hidden">
        <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/40">
           <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
             <BarChart3 size={16} /> TENANT IDENTITY MATRIX
           </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/30 text-slate-400 border-b border-slate-100 whitespace-nowrap">
                <th className="px-10 py-4 text-[10px] font-black uppercase tracking-[0.2em]">租户身份标识</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em]">管理员</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em]">状态</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em]">配额水位 (G/C/S)</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-center">项目/用户</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTenants.map(tenant => (
                <tr key={tenant.id} onClick={() => handleShowDetails(tenant)} className="group hover:bg-slate-50/80 transition-all cursor-pointer">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-2xl bg-slate-950 flex items-center justify-center text-white shadow-lg transition-all duration-500 group-hover:bg-primary-600">
                        <Users size={20} strokeWidth={2.5} />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-slate-900 text-sm uppercase group-hover:text-primary-600 transition-colors">{tenant.name}</span>
                        <span className="font-mono text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{tenant.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                       <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-500 uppercase">{tenant.admin[0]}</div>
                       <span className="text-[11px] font-bold text-slate-800 font-mono uppercase">{tenant.admin}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2.5">
                       <div className={`w-2 h-2 rounded-full animate-pulse ${tenant.status === 'active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-300'}`}></div>
                       <span className={`text-[11px] font-black uppercase tracking-widest ${tenant.status === 'active' ? 'text-emerald-600' : 'text-slate-400'}`}>
                          {tenant.status === 'active' ? '运行中' : '已停用'}
                       </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex gap-4">
                       <ResourceProgress label="GPU" used={tenant.quota.gpuUsed} total={tenant.quota.gpu} color="bg-emerald-500" />
                       <ResourceProgress label="CPU" used={tenant.quota.cpuUsed} total={tenant.quota.cpu} color="bg-primary-500" />
                       <ResourceProgress label="STO" used={tenant.quota.storageUsed} total={tenant.quota.storage} color="bg-amber-500" />
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="inline-flex items-center gap-3 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl">
                       <div className="flex items-center gap-1.5 text-[11px] font-black text-slate-700 font-mono">
                          {/* Added FolderKanban to lucide-react import */}
                          <FolderKanban size={12} className="text-slate-300" /> {tenant.projectCount}
                       </div>
                       <div className="w-px h-3 bg-slate-200"></div>
                       <div className="flex items-center gap-1.5 text-[11px] font-black text-slate-700 font-mono">
                          <UserCircle size={12} className="text-slate-300" /> {tenant.userCount}
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-all duration-300">
                      <button onClick={(e) => { e.stopPropagation(); handleShowDetails(tenant); }} className="p-2.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all" title="详情">
                        <Info size={18} strokeWidth={2.5} />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); setSelectedTenant(tenant); setIsCreateOpen(true); }} className="p-2.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all" title="编辑">
                        <Edit size={18} strokeWidth={2.5} />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); setSelectedTenant(tenant); setIsDeleteOpen(true); }} className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all" title="注销">
                        <Trash2 size={18} strokeWidth={2.5} />
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
