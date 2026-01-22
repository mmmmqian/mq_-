
import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, Search, RefreshCw, 
  ChevronRight, Info, Shield,
  Layers, Users, ActivitySquare,
  SearchIcon, FilterIcon, History,
  LayoutGrid, List, SlidersHorizontal,
  Lock, Globe, Command, Terminal,
  BarChart3
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import PageHeader from '../../components/layout/PageHeader';
import { CustomSelect } from '../../components/ui/Select';
import { RoleDetailsDrawer } from '../../components/modals/RoleDetailsDrawer';
import { MOCK_ROLES } from '../../constants';
import { Role } from '../../types';

const RolesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const filteredRoles = useMemo(() => {
    return MOCK_ROLES.filter(r => {
      const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           r.code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === 'all' || r.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [searchTerm, typeFilter]);

  const handleShowDetails = (role: Role) => {
    setSelectedRole(role);
    setIsDetailsOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 font-sans">
      <RoleDetailsDrawer isOpen={isDetailsOpen} onClose={() => { setIsDetailsOpen(false); setSelectedRole(null); }} role={selectedRole} />

      <PageHeader 
        icon={ShieldCheck}
        title="权限角色治理"
        subtitle="RBAC GOVERNANCE & ACCESS POLICY CENTER"
        badgeText="POLICY ENFORCEMENT ON"
      />

      <div className="flex flex-col xl:flex-row justify-between items-center gap-5 bg-white p-4 rounded-[28px] border border-slate-200 shadow-sm">
         <div className="flex items-center gap-4 w-full xl:w-auto">
            <div className="relative flex-1 xl:w-80 group">
               <SearchIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-500 transition-colors pointer-events-none" />
               <input type="text" placeholder="角色名称 / CODE SEARCH..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] border border-slate-200 rounded-2xl bg-slate-50 focus:bg-white focus:outline-none focus:border-primary-500 transition-all" />
            </div>
            <CustomSelect
              options={[{ value: 'all', label: '所有维度' }, { value: 'platform', label: '平台级角色' }, { value: 'project', label: '项目级角色' }]}
              value={typeFilter}
              onChange={setTypeFilter}
              className="w-48"
            />
         </div>
         <button className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-400 hover:text-primary-600 transition-all">
            <RefreshCw size={18} />
         </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-[36px] shadow-soft overflow-hidden">
        <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/40">
           <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
             <BarChart3 size={16} /> ROLE SPECIFICATION MATRIX
           </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/30 text-slate-400 border-b border-slate-200 whitespace-nowrap">
                <th className="px-10 py-4 text-[10px] font-black uppercase tracking-[0.2em]">角色定义 (ROLE_SPEC)</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em]">类型</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em]">属性</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em]">权限资产集 (SCOPES)</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-center">绑定用户</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRoles.map(role => (
                <tr key={role.id} onClick={() => handleShowDetails(role)} className="group hover:bg-slate-50/80 transition-all cursor-pointer">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-2xl bg-slate-950 flex items-center justify-center text-white shadow-lg transition-all duration-500 group-hover:bg-primary-600 group-hover:shadow-primary-500/30">
                        <ShieldCheck size={20} strokeWidth={2.5} />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-slate-900 text-sm uppercase group-hover:text-primary-600 transition-colors">{role.name}</span>
                        <span className="font-mono text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{role.code}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <Badge status={role.type === 'platform' ? 'primary' : 'success'}>
                       {role.type === 'platform' ? '平台级' : '项目级'}
                    </Badge>
                  </td>
                  <td className="px-8 py-6">
                     <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Built-in</span>
                     </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-wrap gap-2">
                       {role.permissions.slice(0, 3).map((p, idx) => (
                         <span key={idx} className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded text-[9px] font-black text-slate-400 uppercase tracking-tighter">
                            {p.label}
                         </span>
                       ))}
                       {role.permissions.length > 3 && <span className="text-[9px] font-bold text-slate-300">+{role.permissions.length - 3}</span>}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                     <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl">
                        <Users size={12} className="text-slate-400" />
                        <span className="text-[11px] font-black text-slate-900 font-mono">{role.userCount}</span>
                     </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-all duration-300">
                      <button onClick={(e) => { e.stopPropagation(); handleShowDetails(role); }} className="p-2.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all" title="查看权限">
                        <Info size={18} strokeWidth={2.5} />
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

export default RolesPage;
