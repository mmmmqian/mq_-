
import React, { useState, useMemo } from 'react';
import { AlertTriangle, Trash2, X, AlertOctagon, Info, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { Tenant } from '../../types';

interface DeleteTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenant: Tenant | null;
  onConfirm: (id: string, forced: boolean) => void;
}

export const DeleteTenantModal: React.FC<DeleteTenantModalProps> = ({ isOpen, onClose, tenant, onConfirm }) => {
  const [isForced, setIsForced] = useState(false);
  
  // 模拟前置检查：发现租户下仍有活跃资源
  const activeIssues = useMemo(() => {
    if (!tenant) return [];
    return [
      { type: 'task', label: '运行中/队列中任务', count: 2, icon: AlertOctagon },
      { type: 'project', label: '关联项目空间', count: tenant.projectCount, icon: Info },
      { type: 'resource', label: '未释放存储卷 (PVC)', count: 5, icon: ShieldAlert }
    ];
  }, [tenant]);

  const hasIssues = activeIssues.some(i => i.count > 0);

  if (!isOpen || !tenant) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
      <div className="relative bg-white rounded-[40px] shadow-2xl w-full max-w-lg animate-in fade-in zoom-in-95 duration-200 border border-red-100 overflow-hidden">
        {/* Top Danger Bar */}
        <div className="h-2 bg-red-600 w-full"></div>
        
        <div className="p-10">
           <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-100 relative group">
              <div className="absolute inset-0 bg-red-200 rounded-full animate-ping opacity-20"></div>
              <AlertTriangle size={36} className="text-red-500 relative z-10 group-hover:scale-110 transition-transform" />
           </div>

           <h3 className="text-2xl font-black text-slate-900 text-center mb-2 tracking-tight">无法直接删除租户 "{tenant.name}"</h3>
           <p className="text-center text-slate-400 text-xs font-bold uppercase tracking-widest mb-10">System Pre-deletion Audit Failed</p>
           
           <div className="space-y-4 mb-10">
              {activeIssues.map((issue, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                   <div className="flex items-center gap-3">
                      <issue.icon size={16} className={issue.count > 0 ? 'text-red-500' : 'text-slate-300'} />
                      <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">{issue.label}</span>
                   </div>
                   <span className={`text-sm font-black font-mono ${issue.count > 0 ? 'text-red-600' : 'text-slate-400'}`}>{issue.count}</span>
                </div>
              ))}
           </div>

           <div className={`p-6 rounded-3xl border transition-all duration-500 ${isForced ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-100'}`}>
              <div className="flex gap-4">
                 <ShieldAlert size={20} className={isForced ? 'text-red-600' : 'text-amber-600'} />
                 <div>
                    <h5 className={`text-[10px] font-black uppercase tracking-widest mb-1.5 ${isForced ? 'text-red-800' : 'text-amber-800'}`}>
                       强制删除说明 (DANGER_MODE)
                    </h5>
                    <p className={`text-[11px] font-medium leading-relaxed ${isForced ? 'text-red-700' : 'text-amber-700'}`}>
                       强制删除将立即中止所有运行中的任务，释放全量算力配额，并抹除该租户下的所有历史数据。该操作<span className="font-black underline">不可撤销</span>。
                    </p>
                 </div>
              </div>
              <button 
                onClick={() => setIsForced(!isForced)}
                className={`mt-6 w-full py-2.5 rounded-xl border flex items-center justify-center gap-3 transition-all font-black text-[10px] uppercase tracking-widest ${isForced ? 'bg-red-600 border-red-500 text-white shadow-lg' : 'bg-white border-amber-200 text-amber-600 hover:bg-amber-100'}`}
              >
                 {isForced ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
                 {isForced ? '已切换至强制模式' : '我了解风险，切换至强制模式'}
              </button>
           </div>
        </div>

        <div className="px-10 py-6 bg-slate-50 border-t border-slate-200 flex gap-4">
           <button onClick={onClose} className="flex-1 py-3 bg-white border border-slate-300 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all">
             取消操作
           </button>
           <button 
             disabled={!isForced}
             onClick={() => onConfirm(tenant.id, isForced)}
             className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${isForced ? 'bg-slate-950 text-white hover:bg-red-600 shadow-xl' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
           >
             <Trash2 size={14} /> 执行注销注销
           </button>
        </div>
      </div>
    </div>
  );
};
