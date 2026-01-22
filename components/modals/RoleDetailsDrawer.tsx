
import React from 'react';
import { Drawer } from '../ui/Drawer';
import { 
  ShieldCheck, Shield, Users, List, 
  ChevronRight, Info, Command, Binary,
  Layout, Layers, CheckCircle2, ShieldAlert
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Role, PermissionNode } from '../../types';

interface RoleDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  role: Role | null;
}

export const RoleDetailsDrawer: React.FC<RoleDetailsDrawerProps> = ({ isOpen, onClose, role }) => {
  if (!role) return null;

  // Explicitly type PermissionItem as React.FC to handle React-specific props like 'key' when used in .map()
  const PermissionItem: React.FC<{ node: PermissionNode; level?: number }> = ({ node, level = 0 }) => (
    <div className={`space-y-3 ${level === 0 ? 'bg-white border border-slate-100 p-5 rounded-3xl shadow-sm hover:border-primary-300 transition-all group' : ''}`}>
       <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
             {level === 0 ? (
               <div className="p-2 bg-slate-950 rounded-xl text-white shadow-lg group-hover:bg-primary-600 transition-colors">
                  <Layout size={14} strokeWidth={2.5} />
               </div>
             ) : (
               <div className="w-1.5 h-1.5 rounded-full bg-primary-500"></div>
             )}
             <span className={`uppercase tracking-widest ${level === 0 ? 'text-[11px] font-black text-slate-900' : 'text-[10px] font-bold text-slate-600'}`}>
                {node.label}
             </span>
          </div>
          {level === 0 && <Badge status="info" showDot={false}>MODULE_READY</Badge>}
       </div>
       
       {node.children && node.children.length > 0 && (
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pl-0">
            {node.children.map(child => (
              <div key={child.id} className="flex items-center gap-2.5 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl hover:bg-white hover:border-emerald-200 transition-all group/sub">
                 <CheckCircle2 size={12} className="text-emerald-500" />
                 <span className="text-[10px] font-bold text-slate-500 group-hover/sub:text-slate-900 uppercase tracking-tight">{child.label}</span>
              </div>
            ))}
         </div>
       )}
    </div>
  );

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-slate-950 rounded-lg flex items-center justify-center text-white shadow-lg">
            <ShieldCheck size={16} strokeWidth={2.5} />
          </div>
          <span className="font-black uppercase tracking-tight text-slate-900">角色权限全维审计</span>
        </div>
      }
      description={`POLICY_UUID: ${role.code.toUpperCase()}`}
      width="max-w-4xl"
      footer={
        <button onClick={onClose} className="w-full py-3.5 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary-600 transition-all shadow-xl active:scale-95">
           CLOSE POLICY AUDIT
        </button>
      }
    >
      <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 pb-10 font-sans">
         
         {/* 1. Identity Header */}
         <div className="bg-slate-950 rounded-[32px] p-8 border border-slate-800 relative overflow-hidden shadow-2xl group">
            <div className="absolute top-0 right-0 p-10 opacity-5 text-white pointer-events-none group-hover:opacity-10 transition-opacity">
               <ShieldCheck size={200} strokeWidth={1} />
            </div>
            <div className="relative z-10">
               <div className="flex justify-between items-start mb-8">
                  <div className="space-y-4">
                     <div className="flex items-center gap-3">
                        <Badge status={role.type === 'platform' ? 'primary' : 'success'} showDot={false}>
                           {role.type === 'platform' ? '平台级权限' : '项目级权限'}
                        </Badge>
                        <div className="w-1 h-1 rounded-full bg-slate-700"></div>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono">CODE: {role.code}</span>
                     </div>
                     <h3 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">{role.name}</h3>
                  </div>
                  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-primary-400">
                     <Shield size={32} strokeWidth={2} />
                  </div>
               </div>
               <p className="text-xs font-medium text-slate-400 leading-relaxed uppercase tracking-tight max-w-2xl opacity-80 italic">
                  "{role.description}"
               </p>
               <div className="mt-8 pt-8 border-t border-white/5 flex items-center gap-10">
                  <div className="space-y-1">
                     <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">角色来源</p>
                     <p className="text-sm font-black text-emerald-400 uppercase tracking-tight">System Built-in</p>
                  </div>
                  <div className="space-y-1">
                     <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">全平台持有用户</p>
                     <p className="text-sm font-black text-white font-mono">{role.userCount} <span className="text-[10px] text-slate-700">USERS</span></p>
                  </div>
               </div>
            </div>
         </div>

         {/* 2. Permission Tree */}
         <div className="space-y-6">
            <div className="flex justify-between items-center px-1">
               <h5 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Layers size={18} className="text-primary-600" /> 功能权限矩阵 (ACL_MATRIX)
               </h5>
               <Badge status="info" showDot={false}>READ ONLY ACCESS</Badge>
            </div>
            
            <div className="space-y-4">
               {role.permissions.map(perm => (
                 <PermissionItem key={perm.id} node={perm} />
               ))}
            </div>
         </div>

         {/* 3. Compliance Tip */}
         <div className="bg-primary-50 border border-primary-100 p-8 rounded-[40px] flex gap-8 items-start shadow-sm">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary-600 shadow-xl border border-primary-50 shrink-0">
               <ShieldAlert size={24} strokeWidth={2.5} />
            </div>
            <div className="space-y-3">
               <h6 className="text-[12px] font-black text-slate-900 uppercase tracking-widest">系统角色安全约束 (BUILT-IN_ENFORCEMENT)</h6>
               <p className="text-[11px] text-slate-600 leading-relaxed font-medium uppercase tracking-tight">
                  1. 该角色为平台内置 (Built-in)，其绑定的权限集合受内核保护，暂不支持通过界面进行手动篡改或移除。
                  <br/>
                  2. 角色权限的变更将随着平台内核版本迭代自动同步，确保各组织间的治理一致性。
               </p>
            </div>
         </div>
      </div>
    </Drawer>
  );
};
