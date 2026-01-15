
import React, { useState } from 'react';
import { Drawer } from '../ui/Drawer';
import { 
  FolderKanban, Users, Cpu, Zap, Database, 
  Info, ShieldCheck, Clock, User, Plus,
  Trash2, Settings, History, Activity,
  Search, ShieldAlert, Command, ArrowRight
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Project, ProjectMember } from '../../types';
import { MOCK_PROJECT_MEMBERS } from '../../constants';

interface ProjectDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
}

export const ProjectDetailsDrawer: React.FC<ProjectDetailsDrawerProps> = ({ isOpen, onClose, project }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'quotas'>('overview');

  if (!project) return null;

  const members = MOCK_PROJECT_MEMBERS[project.id] || [];

  const getRoleBadge = (role: string) => {
    switch(role) {
      case 'admin': return <Badge status="error" showDot={false}>项目管理员</Badge>;
      case 'algorithm': return <Badge status="primary" showDot={false}>算法工程师</Badge>;
      case 'developer': return <Badge status="info" showDot={false}>开发工程师</Badge>;
      case 'scientist': return <Badge status="success" showDot={false}>数据科学家</Badge>;
      default: return <Badge status="neutral" showDot={false}>{role}</Badge>;
    }
  };

  const ResourceProgress = ({ label, used, total, unit, color }: any) => {
    const percent = Math.round((used / total) * 100);
    const isOverload = percent > 80;
    return (
      <div className="space-y-2">
         <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
            <span className="text-slate-400">{label}</span>
            <div className="flex gap-2">
               <span className={`font-mono ${isOverload ? 'text-red-500' : 'text-slate-900'}`}>{used} / {total} {unit}</span>
               <span className={`font-mono px-1.5 rounded ${isOverload ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-500'}`}>{percent}%</span>
            </div>
         </div>
         <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className={`h-full transition-all duration-1000 ${isOverload ? 'bg-red-500 animate-pulse' : color}`} style={{ width: `${percent}%` }}></div>
         </div>
      </div>
    );
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <FolderKanban size={20} className="text-primary-600" />
          <span className="font-black uppercase tracking-tight">项目全维审计详情</span>
        </div>
      }
      description={`PROJECT_UUID: ${project.id}`}
      width="max-w-4xl"
      footer={
        <button onClick={onClose} className="w-full py-3.5 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary-600 transition-all shadow-xl active:scale-95">
           DONE / CLOSE AUDIT
        </button>
      }
    >
      <div className="space-y-10 font-sans pb-10">
         {/* Identity Hub */}
         <div className="bg-slate-950 rounded-[32px] p-8 border border-slate-800 relative overflow-hidden shadow-2xl group">
            <div className="absolute top-0 right-0 p-12 opacity-5 text-white pointer-events-none group-hover:opacity-10 transition-opacity duration-1000"><FolderKanban size={240} /></div>
            <div className="relative z-10">
               <div className="flex justify-between items-start mb-8">
                  <div className="space-y-3">
                     <div className="flex items-center gap-3">
                        <Badge status={project.status === 'active' ? 'success' : 'neutral'} showDot>{project.status.toUpperCase()}</Badge>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">组织: {project.tenantName}</span>
                     </div>
                     <h3 className="text-3xl font-black text-white tracking-tighter leading-none uppercase">{project.name}</h3>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                     <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">负责人 (OWNER)</p>
                     <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center text-[10px] font-black text-white uppercase">{project.owner[0]}</div>
                        <span className="text-sm font-bold text-white font-mono">{project.owner}</span>
                     </div>
                  </div>
               </div>
               
               <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-8 border-t border-white/5">
                  <div className="space-y-1">
                     <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">已加入成员</p>
                     <p className="text-xl font-black text-white font-mono">{project.memberCount} <span className="text-[10px] text-slate-700">ACTIVE</span></p>
                  </div>
                  <div className="space-y-1">
                     <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">始建日期</p>
                     <p className="text-xl font-black text-white font-mono tracking-tighter">{project.createdAt}</p>
                  </div>
                  <div className="lg:col-span-2 space-y-1">
                     <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">项目业务背景</p>
                     <p className="text-xs font-bold text-slate-400 truncate" title={project.description}>{project.description || '暂无详细描述...'}</p>
                  </div>
               </div>
            </div>
         </div>

         {/* Navigation Tabs */}
         <div className="flex border-b border-slate-200 sticky top-0 bg-white z-10">
            {[
               { id: 'overview', label: '运行概览', icon: Activity },
               { id: 'members', label: '团队治理', icon: Users },
               { id: 'quotas', label: '算力配额', icon: GaugeIcon }
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

         {/* Tab Content */}
         <div className="min-h-[400px]">
            {activeTab === 'overview' && (
               <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="space-y-6">
                     <h5 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
                        <History size={16} className="text-primary-600" /> 资源消耗实时水位
                     </h5>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm hover:border-primary-200 transition-all">
                           <ResourceProgress label="CPU 计算" used={project.quota.cpuUsed} total={project.quota.cpu} unit="C" color="bg-primary-600" />
                        </div>
                        <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm hover:border-emerald-200 transition-all">
                           <ResourceProgress label="GPU 加速" used={project.quota.gpuUsed} total={project.quota.gpu} unit="Cards" color="bg-emerald-500" />
                        </div>
                        <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm hover:border-amber-200 transition-all">
                           <ResourceProgress label="持久化存储" used={project.quota.storageUsed} total={project.quota.storage} unit="GB" color="bg-amber-500" />
                        </div>
                     </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-[32px] p-8 flex gap-6">
                     <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary-600 shadow-sm shrink-0">
                        <ShieldCheck size={24} />
                     </div>
                     <div className="space-y-2">
                        <h6 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">组织合规审计说明</h6>
                        <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                           该项目隶属于 <span className="text-slate-900 font-bold">{project.tenantName}</span>。所有的资源操作（如训练任务启动、镜像拉取、存储卷挂载）均在租户专有的虚拟私有网络 (VPC) 及存储命名空间下执行，严格遵守多租户逻辑隔离协议。
                        </p>
                     </div>
                  </div>
               </div>
            )}

            {activeTab === 'members' && (
               <div className="space-y-8 animate-in fade-in duration-500">
                  <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                     <div className="relative group w-64">
                        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="text" placeholder="FILTER MEMBERS..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-bold uppercase tracking-widest focus:border-primary-500 outline-none transition-all" />
                     </div>
                     <button className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary-700 shadow-lg shadow-primary-500/20 active:scale-95 transition-all">
                        <Plus size={14} strokeWidth={3} /> 添加项目成员
                     </button>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-[28px] overflow-hidden shadow-sm">
                     <table className="w-full text-left">
                        <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                           <tr>
                              <th className="px-8 py-4">成员身份 (IDENTITY)</th>
                              <th className="px-8 py-4">项目角色</th>
                              <th className="px-8 py-4">加入时间</th>
                              <th className="px-8 py-4 text-right">管理操作</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                           {members.map(m => (
                              <tr key={m.userId} className="group hover:bg-slate-50/50 transition-colors">
                                 <td className="px-8 py-5">
                                    <div className="flex items-center gap-4">
                                       <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-black text-xs border border-slate-200">
                                          {m.realName[0]}
                                       </div>
                                       <div className="flex flex-col">
                                          <span className="text-[13px] font-black text-slate-900 tracking-tight">{m.realName}</span>
                                          <span className="text-[10px] font-mono font-bold text-slate-400 mt-0.5 tracking-tighter uppercase">{m.userName}</span>
                                       </div>
                                    </div>
                                 </td>
                                 <td className="px-8 py-5">
                                    {getRoleBadge(m.role)}
                                 </td>
                                 <td className="px-8 py-5">
                                    <span className="text-[11px] font-mono font-bold text-slate-500">{m.joinedAt}</span>
                                 </td>
                                 <td className="px-8 py-5 text-right">
                                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                       <button className="p-2 text-slate-400 hover:text-primary-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all"><Settings size={14} /></button>
                                       <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-white rounded-lg border border-transparent hover:border-red-100 transition-all"><Trash2 size={14} /></button>
                                    </div>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            )}

            {activeTab === 'quotas' && (
               <div className="animate-in fade-in duration-500">
                   <div className="bg-slate-50 border border-slate-200 rounded-[32px] p-12 flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-300 shadow-sm mb-6 border border-slate-100">
                         <Command size={32} />
                      </div>
                      <h4 className="text-lg font-black text-slate-900 uppercase tracking-widest mb-4">配额策略深度管控</h4>
                      <p className="text-sm text-slate-500 max-w-md leading-relaxed font-medium">
                         当前项目配额策略由平台调度器硬性执行。如需调整项目资源上限，请联系租户平台管理员进行配额再分配操作。
                      </p>
                      <button className="mt-8 px-8 py-3 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 hover:bg-primary-600 transition-all shadow-xl active:scale-95">
                         申请配额调整 <ArrowRight size={14} />
                      </button>
                   </div>
               </div>
            )}
         </div>
      </div>
    </Drawer>
  );
};

// Mock Gauge icon to avoid missing export
const GaugeIcon = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>
);
