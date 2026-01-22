
import React, { useState } from 'react';
import { Drawer } from '../ui/Drawer';
import { Badge } from '../ui/Badge';
import { 
  UserCircle, Mail, Phone, Clock, Globe, 
  ShieldCheck, Shield, Layers, History,
  Activity, Monitor, Hash, Key, ExternalLink,
  ChevronRight, ArrowUpRight, LogIn, Laptop,
  Box, FolderKanban, Terminal, Info
} from 'lucide-react';
import { User, PlatformRole } from '../../types';
import { ROLE_CONFIG } from '../../constants';

interface UserDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export const UserDetailsDrawer: React.FC<UserDetailsDrawerProps> = ({ isOpen, onClose, user }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'activity' | 'projects'>('profile');

  if (!user) return null;

  const roleInfo = ROLE_CONFIG[user.role];

  // 模拟用户近期活动数据
  const MOCK_ACTIVITIES = [
    { time: '2025-11-12 09:30:12', action: 'SESSION_LOGIN', detail: '从 10.128.4.22 成功登录系统', icon: LogIn, color: 'text-emerald-500' },
    { time: '2025-11-11 18:22:45', action: 'IDE_STARTUP', detail: '在 [llama3-dev] 项目中启动了 JupyterLab 实例', icon: Terminal, color: 'text-primary-500' },
    { time: '2025-11-10 14:15:00', action: 'PROJECT_MEMBER_ADD', detail: '被 zhangsan 添加至 [自动驾驶视觉模型] 项目', icon: UserCircle, color: 'text-indigo-500' },
    { time: '2025-11-08 10:05:33', action: 'PASSWORD_CHANGE', detail: '完成了安全凭证的主动变更', icon: Key, color: 'text-amber-500' }
  ];

  // 模拟关联项目
  const MOCK_PROJECT_BINDINGS = [
    { name: '自动驾驶视觉模型', id: 'PROJ-AV-01', role: '算法工程师', joinedAt: '2024-05-20' },
    { name: '通用语言模型预训练', id: 'PROJ-CORE-AI-01', role: '项目管理员', joinedAt: '2024-01-10' }
  ];

  const SectionHeader = ({ icon: Icon, title, sub }: { icon: any, title: string, sub: string }) => (
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2 bg-slate-950 rounded-xl text-white shadow-lg">
        <Icon size={16} strokeWidth={2.5} />
      </div>
      <div>
        <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] leading-none">{title}</h4>
        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{sub}</p>
      </div>
    </div>
  );

  const InfoRow = ({ label, value, icon: Icon, mono = false }: any) => (
    <div className="flex justify-between py-4 border-b border-slate-50 last:border-0 items-center">
      <div className="flex items-center gap-2.5">
        {Icon && <Icon size={14} className="text-slate-300" />}
        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{label}</span>
      </div>
      <span className={`text-[11px] font-bold ${mono ? 'font-mono text-slate-600' : 'text-slate-800'}`}>{value}</span>
    </div>
  );

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-slate-950 rounded-lg flex items-center justify-center text-white shadow-lg">
            <UserCircle size={16} strokeWidth={2.5} />
          </div>
          <span className="font-black uppercase tracking-tight text-slate-900">用户身份全维审计</span>
        </div>
      }
      description={`IDENTITY_UUID: ${user.id}`}
      width="max-w-4xl"
      footer={
        <button onClick={onClose} className="w-full py-3.5 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary-600 transition-all shadow-xl active:scale-95">
           DONE / CLOSE IDENTITY AUDIT
        </button>
      }
    >
      <div className="space-y-10 font-sans pb-10">
         {/* 1. Identity Hero Block */}
         <div className="bg-slate-950 rounded-[40px] p-10 border border-slate-800 relative overflow-hidden shadow-2xl group">
            <div className="absolute inset-0 tech-grid opacity-[0.03]"></div>
            <div className="absolute top-0 right-0 p-12 opacity-5 text-white pointer-events-none group-hover:opacity-10 transition-opacity duration-1000">
               <UserCircle size={240} strokeWidth={1} />
            </div>
            <div className="relative z-10">
               <div className="flex justify-between items-start mb-10">
                  <div className="flex items-center gap-6">
                     <div className={`w-20 h-20 rounded-[28px] flex items-center justify-center text-2xl font-black shadow-2xl border-2 transition-all duration-500 ${user.status === 'active' ? 'bg-white text-slate-950 border-white/20' : 'bg-slate-800 text-slate-500 border-white/5'}`}>
                        {user.realName[0]}
                     </div>
                     <div className="space-y-3">
                        <div className="flex items-center gap-3">
                           <Badge status={user.status === 'active' ? 'success' : 'neutral'} showDot>{user.status.toUpperCase()}</Badge>
                           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono">ID: {user.id}</span>
                        </div>
                        <h3 className="text-4xl font-black text-white tracking-tighter leading-none uppercase">{user.realName}</h3>
                        <p className="text-primary-400 text-xs font-mono font-bold tracking-widest">@{user.userName}</p>
                     </div>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                     <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">最后活跃 (LAST_LOG)</p>
                     <p className="text-xl font-black text-white font-mono tracking-tight">{user.lastLoginAt}</p>
                  </div>
               </div>
               
               <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-10 border-t border-white/5">
                  <div className="space-y-1">
                     <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">所属组织租户</p>
                     <p className="text-sm font-bold text-white uppercase flex items-center gap-2">
                        <Globe size={14} className="text-primary-500" /> {user.tenantName}
                     </p>
                  </div>
                  <div className="space-y-1">
                     <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">平台赋权角色</p>
                     <span className={`px-2 py-0.5 rounded-lg border text-[9px] font-black uppercase tracking-widest ${roleInfo.color}`}>
                        {roleInfo.label}
                     </span>
                  </div>
                  <div className="space-y-1">
                     <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">认证环境</p>
                     <div className="flex items-center gap-2">
                        <Laptop size={14} className="text-slate-400" />
                        <span className="text-sm font-bold text-white uppercase">Web Console</span>
                     </div>
                  </div>
                  <div className="space-y-1">
                     <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">注册周期</p>
                     <p className="text-sm font-bold text-white font-mono tracking-tight">{user.createdAt}</p>
                  </div>
               </div>
            </div>
         </div>

         {/* 2. Navigation Tabs */}
         <div className="flex border-b border-slate-200 bg-white sticky top-0 z-20">
            {[
               { id: 'profile', label: '基础档案 (PROFILE)', icon: Info },
               { id: 'projects', label: '项目关联 (PROJECTS)', icon: FolderKanban },
               { id: 'activity', label: '活跃审计 (AUDIT)', icon: History }
            ].map(tab => (
               <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-8 py-4 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all flex items-center gap-2.5 ${activeTab === tab.id ? 'border-primary-600 text-primary-600 bg-primary-50/20' : 'border-transparent text-slate-400 hover:text-slate-900'}`}
               >
                  <tab.icon size={14} strokeWidth={2.5} />
                  {tab.label}
               </button>
            ))}
         </div>

         {/* 3. Tab Content */}
         <div className="min-h-[450px]">
            {activeTab === 'profile' && (
               <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="space-y-6">
                     <SectionHeader icon={ShieldCheck} title="账号安全与档案" sub="Verified identity markers" />
                     <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
                        <InfoRow label="电子邮箱 (EMAIL)" value={user.email} icon={Mail} />
                        <InfoRow label="手机号码 (PHONE)" value={user.phone} icon={Phone} mono />
                        <InfoRow label="租户唯一识别号" value={user.tenantId} icon={Hash} mono />
                        <InfoRow label="账号创建来源" value="SSO_SYSTEM_INVITE" icon={Layers} />
                        <InfoRow label="登录方式" value="LDAP_EXTERNAL" icon={Shield} />
                        <InfoRow label="角色有效期" value="永不过期 (PERPETUAL)" icon={Clock} />
                     </div>
                  </div>

                  <div className="bg-primary-50/50 border border-primary-100 p-8 rounded-[40px] flex gap-6 items-start">
                     <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary-600 shadow-xl border border-primary-50 shrink-0">
                        <ShieldCheck size={24} strokeWidth={2.5} />
                     </div>
                     <div className="space-y-2">
                        <h6 className="text-[12px] font-black text-slate-900 uppercase tracking-widest">身份合规审计说明</h6>
                        <p className="text-[11px] text-slate-600 leading-relaxed font-medium uppercase tracking-tight">
                           该用户的身份信息已通过底层认证中台 (IAM) 同步。所有的权限变更均会在 Nexus Kernel 记录不可篡改的流水日志，确保身份溯源的严谨性。
                        </p>
                     </div>
                  </div>
               </div>
            )}

            {activeTab === 'projects' && (
               <div className="space-y-6 animate-in fade-in duration-500">
                  <SectionHeader icon={FolderKanban} title="关联项目资产" sub="Project-level authorization scope" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {MOCK_PROJECT_BINDINGS.map((proj, idx) => (
                        <div key={idx} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:border-primary-400 hover:shadow-xl transition-all group relative overflow-hidden">
                           <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                              <Box size={60} />
                           </div>
                           <div className="flex justify-between items-start mb-6">
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-primary-600 group-hover:text-white transition-all shadow-inner">
                                    <FolderKanban size={20} />
                                 </div>
                                 <div>
                                    <h6 className="text-[13px] font-black text-slate-900 uppercase tracking-tight">{proj.name}</h6>
                                    <p className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-tighter mt-0.5">{proj.id}</p>
                                 </div>
                              </div>
                              <button className="p-2 text-slate-300 hover:text-primary-600 transition-colors"><ArrowUpRight size={18} /></button>
                           </div>
                           <div className="flex justify-between items-center pt-6 border-t border-slate-50">
                              <div className="space-y-1">
                                 <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">分配角色</p>
                                 <p className="text-[11px] font-black text-primary-600 uppercase">{proj.role}</p>
                              </div>
                              <div className="text-right space-y-1">
                                 <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">加入时间</p>
                                 <p className="text-[11px] font-black text-slate-700 font-mono">{proj.joinedAt}</p>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            )}

            {activeTab === 'activity' && (
               <div className="space-y-8 animate-in fade-in duration-500">
                  <div className="flex justify-between items-center px-1">
                     <SectionHeader icon={History} title="全链活动审计轨迹" sub="User behavior trace log" />
                     <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">
                        查看完整报告 <ChevronRight size={14} />
                     </button>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
                     {MOCK_ACTIVITIES.map((act, i) => (
                        <div key={i} className="flex gap-6 px-10 py-6 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 items-start">
                           <div className={`mt-1 p-2 rounded-xl bg-slate-50 ${act.color}`}>
                              <act.icon size={16} strokeWidth={2.5} />
                           </div>
                           <div className="flex-1">
                              <div className="flex justify-between items-center mb-1">
                                 <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest">{act.action}</span>
                                 <span className="text-[10px] font-mono font-bold text-slate-400">{act.time}</span>
                              </div>
                              <p className="text-[12px] text-slate-500 font-medium leading-relaxed uppercase tracking-tight">{act.detail}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            )}
         </div>
      </div>
    </Drawer>
  );
};
