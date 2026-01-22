
import React, { useState } from 'react';
import { Lock, ShieldCheck, KeyRound, Copy, CheckCircle2, RefreshCw, X, Save, AlertTriangle } from 'lucide-react';
// Fix: Added missing Badge import to resolve "Cannot find name 'Badge'" error on line 55
import { Badge } from '../ui/Badge';
import { User } from '../../types';

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({ isOpen, onClose, user }) => {
  const [tempPwd, setTempPwd] = useState('');
  const [copied, setCopied] = useState(false);

  const generatePwd = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let pwd = "";
    for (let i = 0; i < 12; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setTempPwd(pwd);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(tempPwd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
      <div className="relative bg-white rounded-[40px] shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200 border border-slate-200 overflow-hidden">
        <div className="h-1.5 bg-amber-500 w-full"></div>
        <div className="p-8">
           <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 border border-amber-100">
                    <KeyRound size={20} strokeWidth={2.5} />
                 </div>
                 <div>
                    <h3 className="text-base font-black text-slate-900 uppercase tracking-tight leading-none">重置用户密码</h3>
                    <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mt-1.5">Reset Security Credentials</p>
                 </div>
              </div>
              <button onClick={onClose} className="p-2 text-slate-300 hover:text-slate-950 transition-colors"><X size={20}/></button>
           </div>

           <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 mb-8 space-y-2">
              <div className="flex justify-between items-center">
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">目标用户 (ACCOUNT)</span>
                 <Badge status="primary" showDot={false}>{user.userName}</Badge>
              </div>
              <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{user.realName}</p>
           </div>

           <div className="space-y-4 mb-8">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">生成临时密码 (TEMP_SECRET)</label>
              <div className="flex gap-2">
                 <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 flex items-center justify-between group">
                    <span className="text-primary-400 font-mono font-bold text-base tracking-widest">
                       {tempPwd || '••••••••••••'}
                    </span>
                    {tempPwd && (
                       <button onClick={handleCopy} className="p-1.5 text-slate-500 hover:text-white transition-all">
                          {copied ? <CheckCircle2 size={16} className="text-emerald-400" /> : <Copy size={16} />}
                       </button>
                    )}
                 </div>
                 <button 
                   onClick={generatePwd}
                   className="p-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl transition-all active:scale-95" 
                   title="重新生成"
                 >
                    <RefreshCw size={20} strokeWidth={2.5} className={tempPwd ? '' : 'animate-pulse'} />
                 </button>
              </div>
           </div>

           <div className="bg-amber-50 border border-amber-100 p-5 rounded-3xl flex gap-4 mb-8">
              <AlertTriangle size={24} className="text-amber-500 shrink-0 mt-0.5" />
              <p className="text-[10px] text-amber-800 font-bold leading-relaxed uppercase tracking-tight">
                警告：点击“确认重置”后，该用户的旧密码将立即失效。请将生成的临时密码通过加密渠道告知用户，并提醒其首次登录后变更。
              </p>
           </div>

           <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">放弃重置</button>
              <button 
                disabled={!tempPwd}
                onClick={onClose} 
                className="flex-1 py-3 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-600 shadow-xl disabled:opacity-20 transition-all active:scale-95"
              >
                确认重置凭证
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};
