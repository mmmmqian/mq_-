
import React, { useState, useMemo } from 'react';
import { 
  Users, UserPlus, Search, RefreshCw, 
  Edit, Trash2, ShieldCheck, Mail, Phone,
  Clock, Hash, Globe, Filter, Power, 
  KeyRound, MoreHorizontal, UserCircle,
  Copy, CheckCircle2, LayoutGrid, List,
  ExternalLink, SearchIcon, FilterIcon,
  ChevronRight, Info, LogIn, BarChart3
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import PageHeader from '../../components/layout/PageHeader';
import { CustomSelect } from '../../components/ui/Select';
import { MOCK_USERS, MOCK_TENANTS, ROLE_CONFIG } from '../../constants';
import { User, PlatformRole } from '../../types';
import { CreateUserModal } from '../../components/modals/CreateUserModal';
import { ResetPasswordModal } from '../../components/modals/ResetPasswordModal';
import { UserDetailsDrawer } from '../../components/modals/UserDetailsDrawer';
import { ToggleUserStatusModal } from '../../components/modals/ToggleUserStatusModal';

const UsersPage: React.FC = () => {
  const [currentUserRole] = useState<PlatformRole>('super_admin');
  const isSuperAdmin = currentUserRole === 'super_admin';

  const [searchTerm, setSearchTerm] = useState('');
  const [tenantFilter, setTenantFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isResetPwdOpen, setIsResetPwdOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isStatusConfirmOpen, setIsStatusConfirmOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filteredUsers = useMemo(() => {
    return MOCK_USERS.filter(u => {
      const matchesSearch = u.realName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           u.userName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTenant = tenantFilter === 'all' || u.tenantId === tenantFilter;
      const matchesRole = roleFilter === 'all' || u.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
      return matchesSearch && matchesTenant && matchesRole && matchesStatus;
    });
  }, [searchTerm, tenantFilter, roleFilter, statusFilter]);

  const handleRowClick = (user: User) => {
    setSelectedUser(user);
    setIsDetailsOpen(true);
  };

  const handleAction = (e: React.MouseEvent, user: User, action: 'edit' | 'reset' | 'status' | 'delete') => {
    e.stopPropagation();
    setSelectedUser(user);
    if (action === 'edit') setIsCreateOpen(true);
    if (action === 'reset') setIsResetPwdOpen(true);
    if (action === 'status') setIsStatusConfirmOpen(true);
    if (action === 'delete') {
      if (window.confirm(`确认注销并删除用户 [${user.realName}] 吗？`)) console.log('Deleting user:', user.id);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 font-sans">
      <CreateUserModal isOpen={isCreateOpen} onClose={() => { setIsCreateOpen(false); setSelectedUser(null); }} initialData={selectedUser} currentUserRole={currentUserRole} />
      <ResetPasswordModal isOpen={isResetPwdOpen} onClose={() => { setIsResetPwdOpen(false); setSelectedUser(null); }} user={selectedUser} />
      <UserDetailsDrawer isOpen={isDetailsOpen} onClose={() => { setIsDetailsOpen(false); setSelectedUser(null); }} user={selectedUser} />
      <ToggleUserStatusModal isOpen={isStatusConfirmOpen} onClose={() => { setIsStatusConfirmOpen(false); setSelectedUser(null); }} user={selectedUser} onConfirm={() => {}} />

      <PageHeader 
        icon={UserCircle}
        title="用户身份治理中心"
        subtitle="ENTERPRISE IDENTITY & ACCESS MANAGEMENT"
        badgeText={isSuperAdmin ? "GLOBAL PRIVILEGED ACCESS" : "TENANT ADMIN ACCESS"}
        actions={
          <button 
            onClick={() => { setSelectedUser(null); setIsCreateOpen(true); }}
            className="flex items-center gap-2.5 px-8 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-primary-500/20 active:scale-95"
          >
            <UserPlus size={16} strokeWidth={3} />
            <span>新建用户</span>
          </button>
        }
      />

      <div className="bg-white p-4 rounded-[28px] border border-slate-200 shadow-sm space-y-4">
         <div className="flex flex-col xl:flex-row justify-between items-center gap-5">
            <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
               <div className="relative flex-1 xl:w-80 group">
                  <SearchIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-500 transition-colors pointer-events-none" />
                  <input type="text" placeholder="搜索姓名或用户名..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] border border-slate-200 rounded-2xl bg-slate-50 focus:bg-white focus:outline-none focus:border-primary-500 transition-all" />
               </div>
               <CustomSelect options={[{ value: 'all', label: '所有组织' }, ...MOCK_TENANTS.map(t => ({ value: t.id, label: t.name }))]} value={tenantFilter} onChange={setTenantFilter} className="w-44" disabled={!isSuperAdmin} />
               <CustomSelect options={[{ value: 'all', label: '所有角色' }, { value: 'super_admin', label: '超级管理员' }, { value: 'platform_admin', label: '平台管理员' }, { value: 'operations_engineer', label: '运维工程师' }]} value={roleFilter} onChange={setRoleFilter} className="w-40" />
            </div>
            <button className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-400 hover:text-primary-600 transition-all">
               <RefreshCw size={18} />
            </button>
         </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-[36px] shadow-soft overflow-hidden">
        <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/40">
           <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
             <BarChart3 size={16} /> IDENTITY AUDIT MATRIX
           </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/30 text-slate-400 border-b border-slate-200 whitespace-nowrap">
                <th className="px-10 py-4 text-[10px] font-black uppercase tracking-[0.2em]">用户身份标识</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em]">组织/租户</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em]">角色级别</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em]">联系方式</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em]">状态</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map(user => {
                const roleInfo = ROLE_CONFIG[user.role];
                const isActive = user.status === 'active';
                return (
                  <tr key={user.id} onClick={() => handleRowClick(user)} className={`group transition-all cursor-pointer ${isActive ? 'hover:bg-slate-50/80' : 'bg-slate-50/30 opacity-60'}`}>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-xs transition-all duration-500 border ${isActive ? 'bg-slate-950 text-white border-slate-800 group-hover:bg-primary-600' : 'bg-slate-200 text-slate-400 border-slate-100'}`}>
                          {user.realName[0]}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black tracking-tight text-sm uppercase group-hover:text-primary-600 transition-colors">{user.realName}</span>
                          <span className="font-mono text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-1">@{user.userName}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <span className="text-[11px] font-black text-slate-700 tracking-tight uppercase flex items-center gap-1.5"><Globe size={12} className="text-slate-300" /> {user.tenantName}</span>
                    </td>
                    <td className="px-8 py-6">
                       <span className={`px-2 py-0.5 rounded-lg border text-[9px] font-black uppercase tracking-widest ${isActive ? roleInfo.color : 'bg-slate-100 text-slate-400'}`}>
                          {roleInfo.label}
                       </span>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex flex-col gap-1 text-[11px] font-mono text-slate-600">
                          <span>{user.email}</span>
                          <span className="text-[10px] text-slate-400">{user.phone}</span>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2.5">
                         <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-300'}`}></div>
                         <Badge status={isActive ? 'success' : 'neutral'}>{isActive ? '活跃' : '停用'}</Badge>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-all duration-300">
                        <button onClick={(e) => handleAction(e, user, 'edit')} className="p-2.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all" title="编辑"><Edit size={18} strokeWidth={2.5} /></button>
                        <button onClick={(e) => handleAction(e, user, 'reset')} className="p-2.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all" title="重置密码"><KeyRound size={18} strokeWidth={2.5} /></button>
                        <button onClick={(e) => handleAction(e, user, 'delete')} className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all" title="删除"><Trash2 size={18} strokeWidth={2.5} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
