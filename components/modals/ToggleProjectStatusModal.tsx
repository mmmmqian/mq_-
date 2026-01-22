
import React from 'react';
import { Power, ShieldCheck, AlertTriangle, X, FolderKanban, Cpu, Zap, Database } from 'lucide-react';
import { Project } from '../../types';
import { Badge } from '../ui/Badge';

interface ToggleProjectStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  onConfirm: (project: Project) => void;
}

export const ToggleProjectStatusModal: React.FC<ToggleProjectStatusModalProps> = ({ isOpen, onClose, project, onConfirm }) => {
  if (!isOpen || !project) return null;

  const isFreezing = project.status === 'active';

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300" 
        onClick={onClose}
      ></div>
      
      {/* Modal Panel */}
      <div className="relative bg-white rounded-[40px] shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200 border border-slate-200 overflow-hidden">
        {/* Status Stripe */}
        <div className={`h-2 w-full ${isFreezing ? 'bg-slate-950' : 'bg-emerald-500'}`}></div>
        
        <div className="p-10">
           <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 border relative group ${isFreezing ? 'bg-slate-50 border-slate-200' : 'bg-emerald-50 border-emerald-100'}`}>
              <div className={`absolute inset-0 rounded-full animate-ping opacity-20 ${isFreezing ? 'bg-slate-200' : 'bg-emerald-200'}`}></div>
              {isFreezing ? (
                <Power size={36} className="text-slate-900 relative z-10 group-hover:scale-110 transition-transform" />
              ) : (
                <ShieldCheck size={36} className="text-emerald-600 relative z-10 group-hover:scale-110 transition-transform" />
              )}
           </div>

           <h3 className="text-2xl font-black text-slate-900 text-center mb-2 tracking-tight">
             {isFreezing ? '确认冻结项目空间？' : '确认恢复项目运行？'}
           </h3>
           <p className="text-center text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8">Project Lifecycle Protocol</p>
           
           <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 mb-8 space-y-4">
              <div className="flex justify-between items-center">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">目标资产 (ASSET)</span>
                 <Badge status="primary" showDot={false}>{project.id}</Badge>
              </div>
              <div className="flex flex-col">
                 <span className="text-lg font-black text-slate-900 uppercase tracking-tight leading-none">{project.name}</span>
                 <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">所属租户: {project.tenantName}</p>
              </div>
           </div>

           {isFreezing ? (
              <div className="bg-slate-950 border border-slate-800 p-6 rounded-[28px] space-y-4 shadow-xl">
                 <div className="flex items-center gap-3">
                    <AlertTriangle size={18} className="text-amber-500 shrink-0" />
                    <h5 className="text-[11px] font-black text-white uppercase tracking-widest">物理层级变更说明 (AUDIT)</h5>
                 </div>
                 <ul className="space-y-3 pl-1">
                    <li className="flex items-start gap-3">
                       <Zap size={12} className="text-slate-600 mt-0.5" />
                       <p className="text-[10px] text-slate-400 font-bold leading-relaxed uppercase tracking-tighter">
                          项目下所有活跃的 <span className="text-white underline">IDE 交互式环境</span> 将被强制挂起。
                       </p>
                    </li>
                    <li className="flex items-start gap-3">
                       <Cpu size={12} className="text-slate-600 mt-0.5" />
                       <p className="text-[10px] text-slate-400 font-bold leading-relaxed uppercase tracking-tighter">
                          所有排队中或运行中的 <span className="text-white underline">训练/推理任务</span> 将立即注销。
                       </p>
                    </li>
                    <li className="flex items-start gap-3">
                       <Database size={12} className="text-slate-600 mt-0.5" />
                       <p className="text-[10px] text-slate-400 font-bold leading-relaxed uppercase tracking-tighter">
                          该项目的 <span className="text-white underline">算力配额</span> 将被系统回收至租户公共池。
                       </p>
                    </li>
                 </ul>
              </div>
           ) : (
              <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-[28px] flex gap-4">
                 <ShieldCheck size={20} className="text-emerald-600 shrink-0 mt-0.5" />
                 <p className="text-[11px] text-emerald-800 font-bold leading-relaxed uppercase tracking-tight">
                    恢复项目后，成员可重新根据已分配的配额启动计算任务，相关存储卷将自动重新挂载。
                 </p>
              </div>
           )}
        </div>

        <div className="px-10 py-6 bg-slate-50 border-t border-slate-200 flex gap-4">
           <button onClick={onClose} className="flex-1 py-3.5 bg-white border border-slate-300 text-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95 shadow-sm">
             放弃操作
           </button>
           <button 
             onClick={() => { onConfirm(project); onClose(); }}
             className={`flex-1 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl ${isFreezing ? 'bg-slate-950 text-white hover:bg-red-600' : 'bg-primary-600 text-white hover:bg-primary-700 shadow-primary-500/20'}`}
           >
             {isFreezing ? <Power size={14} /> : <ShieldCheck size={14} />}
             {isFreezing ? '执行强制冻结' : '执行项目激活'}
           </button>
        </div>
      </div>
    </div>
  );
};
