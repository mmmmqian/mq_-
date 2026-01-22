
import React from 'react';
import { ShieldAlert, Power, X, ShieldCheck, AlertTriangle } from 'lucide-react';
import { User } from '../../types';
import { Badge } from '../ui/Badge';

interface ToggleUserStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onConfirm: (user: User) => void;
}

export const ToggleUserStatusModal: React.FC<ToggleUserStatusModalProps> = ({ isOpen, onClose, user, onConfirm }) => {
  if (!isOpen || !user) return null;

  const isDisabling = user.status === 'active';

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
        <div className={`h-2 w-full ${isDisabling ? 'bg-red-600' : 'bg-emerald-500'}`}></div>
        
        <div className="p-10">
           <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 border relative group ${isDisabling ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'}`}>
              <div className={`absolute inset-0 rounded-full animate-ping opacity-20 ${isDisabling ? 'bg-red-200' : 'bg-emerald-200'}`}></div>
              {isDisabling ? (
                <Power size={36} className="text-red-600 relative z-10 group-hover:scale-110 transition-transform" />
              ) : (
                <ShieldCheck size={36} className="text-emerald-600 relative z-10 group-hover:scale-110 transition-transform" />
              )}
           </div>

           <h3 className="text-2xl font-black text-slate-900 text-center mb-2 tracking-tight">
             {isDisabling ? '确认禁用用户账号？' : '确认重新启用用户？'}
           </h3>
           <p className="text-center text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8">Identity Governance Protocol</p>
           
           <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 mb-8 space-y-4">
              <div className="flex justify-between items-center">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">目标主体 (ACCOUNT)</span>
                 <Badge status="primary" showDot={false}>{user.userName.toUpperCase()}</Badge>
              </div>
              <div className="flex flex-col">
                 <span className="text-lg font-black text-slate-900 uppercase tracking-tight leading-none">{user.realName}</span>
                 <span className="text-[9px] font-mono font-bold text-slate-400 mt-2 tracking-tighter uppercase">{user.id}</span>
              </div>
           </div>

           {isDisabling ? (
              <div className="bg-red-50 border border-red-100 p-6 rounded-[28px] space-y-3">
                 <div className="flex items-center gap-3">
                    <AlertTriangle size={18} className="text-red-600 shrink-0" />
                    <h5 className="text-[11px] font-black text-red-900 uppercase tracking-widest">禁用后果说明 (ENFORCEMENT)</h5>
                 </div>
                 <ul className="space-y-2 pl-7 list-disc">
                    <li className="text-[11px] text-red-700 font-bold leading-relaxed uppercase tracking-tighter">
                       该用户将立即 <span className="underline">无法登录</span> 平台控制台及 API。
                    </li>
                    <li className="text-[11px] text-red-700 font-bold leading-relaxed uppercase tracking-tighter">
                       所有关联的 <span className="underline">活跃会话 (Active Sessions)</span> 将被内核强制注销。
                    </li>
                    <li className="text-[11px] text-red-700 font-bold leading-relaxed uppercase tracking-tighter">
                       挂载的 IDE 开发环境将保持现状但无法进行远程访问。
                    </li>
                 </ul>
              </div>
           ) : (
              <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-[28px] flex gap-4">
                 <ShieldCheck size={20} className="text-emerald-600 shrink-0 mt-0.5" />
                 <p className="text-[11px] text-emerald-800 font-bold leading-relaxed uppercase tracking-tight">
                    重新启用后，该用户将恢复其所属租户及项目下的所有授权访问权限。
                 </p>
              </div>
           )}
        </div>

        <div className="px-10 py-6 bg-slate-50 border-t border-slate-200 flex gap-4">
           <button onClick={onClose} className="flex-1 py-3.5 bg-white border border-slate-300 text-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95 shadow-sm">
             取消操作
           </button>
           <button 
             onClick={() => { onConfirm(user); onClose(); }}
             className={`flex-1 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl ${isDisabling ? 'bg-slate-950 text-white hover:bg-red-600 shadow-red-500/10' : 'bg-primary-600 text-white hover:bg-primary-700 shadow-primary-500/20'}`}
           >
             {isDisabling ? <Power size={14} /> : <ShieldCheck size={14} />}
             {isDisabling ? '执行强制禁用' : '执行账号启用'}
           </button>
        </div>
      </div>
    </div>
  );
};
