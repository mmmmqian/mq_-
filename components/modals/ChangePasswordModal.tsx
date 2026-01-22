
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Lock, ShieldCheck, KeyRound, Eye, EyeOff, Save, X, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose }) => {
  const [showPwd, setShowPwd] = useState(false);
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // 处理 Escape 键退出及背景滚动锁定
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // 验证逻辑：长度不少于6位
  const isLongEnough = formData.newPassword.length >= 6;
  // 建议包含字母和数字
  const hasLetter = /[a-zA-Z]/.test(formData.newPassword);
  const hasNumber = /[0-9]/.test(formData.newPassword);
  const isStrong = isLongEnough && hasLetter && hasNumber;
  const isMatch = formData.newPassword && formData.newPassword === formData.confirmPassword;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLongEnough || !isMatch) return;
    alert('安全凭证更新成功，请重新登录系统。');
    onClose();
  };

  // 使用 Portal 将弹窗挂载到 body 最外层，确保遮罩覆盖全屏并处理溢出
  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8">
      {/* 全屏背景遮罩 */}
      <div 
        className="absolute inset-0 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-300" 
        onClick={onClose}
      ></div>
      
      {/* 弹窗主体：严谨限制 max-h 确保不超出屏幕，Flex 布局处理内部滚动 */}
      <div className="relative bg-white rounded-[32px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] w-full max-w-md max-h-full overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 flex flex-col">
        
        {/* 1. 固定标题栏 */}
        <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between shrink-0 bg-white/80 backdrop-blur-sm z-10">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-tech">
                 <KeyRound size={20} strokeWidth={2.5} />
              </div>
              <div>
                 <h3 className="text-base font-black text-slate-900 uppercase tracking-tight leading-none">安全凭证变更</h3>
                 <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mt-1.5 opacity-70">Update Authentication Factors</p>
              </div>
           </div>
           <button onClick={onClose} className="p-2 text-slate-300 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-all group">
              <X size={20} className="group-active:scale-90 transition-transform" />
           </button>
        </div>

        {/* 2. 可滚动表单区 */}
        <div className="flex-1 overflow-y-auto px-6 py-6 md:px-8 md:py-7 scrollbar-thin scrollbar-thumb-slate-200 hover:scrollbar-thumb-slate-300 bg-white">
           <form id="change-pwd-form" onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">当前旧密码 (VERIFY_OLD)</label>
                 <div className="relative group">
                    <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-500 transition-colors" />
                    <input 
                       type={showPwd ? "text" : "password"} 
                       required
                       value={formData.oldPassword}
                       onChange={e => setFormData({...formData, oldPassword: e.target.value})}
                       className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono focus:bg-white focus:border-primary-500 outline-none transition-all shadow-inner"
                       placeholder="Enter current password"
                    />
                 </div>
              </div>

              <div className="space-y-2">
                 <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">设置新密码 (NEW_FACTOR)</label>
                    {formData.newPassword && (
                       <div className="flex items-center gap-1.5">
                          <span className={`text-[8px] font-black uppercase ${isStrong ? 'text-emerald-500' : isLongEnough ? 'text-amber-500' : 'text-red-500'}`}>
                             {isStrong ? 'SAFE_STRONG' : isLongEnough ? 'MEDIUM_STRENGTH' : 'INSUFFICIENT'}
                          </span>
                       </div>
                    )}
                 </div>
                 <div className="relative group">
                    <ShieldCheck size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-500 transition-colors" />
                    <input 
                       type={showPwd ? "text" : "password"} 
                       required
                       value={formData.newPassword}
                       onChange={e => setFormData({...formData, newPassword: e.target.value})}
                       className={`w-full pl-11 pr-12 py-3 bg-slate-50 border rounded-2xl text-xs font-mono focus:bg-white outline-none transition-all shadow-inner ${formData.newPassword ? (isLongEnough ? 'border-primary-200' : 'border-red-300') : 'border-slate-200'}`}
                       placeholder="Min 6 characters required"
                    />
                    <button 
                       type="button" 
                       onClick={() => setShowPwd(!showPwd)}
                       className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors p-1"
                    >
                       {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                 </div>
                 
                 {/* 密码要求提示引导 */}
                 <div className="mt-2 space-y-1.5 px-1">
                    <div className="flex items-center gap-2">
                       <div className={`w-1 h-1 rounded-full ${isLongEnough ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>
                       <p className={`text-[9px] font-bold uppercase tracking-tight ${isLongEnough ? 'text-emerald-600' : 'text-slate-400'}`}>长度不少于 6 位 (REQUIRED)</p>
                    </div>
                    <div className="flex items-center gap-2">
                       <div className={`w-1 h-1 rounded-full ${(hasLetter && hasNumber) ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>
                       <p className={`text-[9px] font-bold uppercase tracking-tight ${(hasLetter && hasNumber) ? 'text-emerald-600' : 'text-slate-400'}`}>建议包含字母和数字 (RECOMMENDED)</p>
                    </div>
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">确认新密码 (CONFIRM_SPEC)</label>
                 <div className="relative group">
                    <ShieldCheck size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                    <input 
                       type={showPwd ? "text" : "password"} 
                       required
                       value={formData.confirmPassword}
                       onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                       className={`w-full pl-11 pr-4 py-3 border rounded-2xl text-xs font-mono focus:bg-white outline-none transition-all shadow-inner ${formData.confirmPassword ? (isMatch ? 'border-emerald-500 bg-white ring-4 ring-emerald-500/5' : 'border-red-400 bg-red-50/30') : 'bg-slate-50 border-slate-200 focus:border-primary-500'}`}
                       placeholder="Re-type your new password"
                    />
                 </div>
                 {formData.confirmPassword && !isMatch && (
                    <p className="flex items-center gap-1.5 text-[9px] font-bold text-red-500 uppercase tracking-tighter mt-1 ml-1">
                       <AlertCircle size={10} /> 验证失败：两次输入的凭证不一致
                    </p>
                 )}
              </div>

              {/* 紧凑型合规提示 */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex gap-3 mt-4">
                 <AlertCircle size={16} className="text-slate-400 shrink-0 mt-0.5" />
                 <p className="text-[9px] text-slate-500 font-bold leading-relaxed uppercase tracking-tight opacity-70">
                   安全审计：更新密码将强制注销当前所有活动的 API 会话及关联的开发者令牌。请确保及时更新本地配置文件。
                 </p>
              </div>
           </form>
        </div>

        {/* 3. 固定操作栏 */}
        <div className="px-6 py-5 md:px-8 md:py-6 bg-slate-50/80 border-t border-slate-100 shrink-0 flex gap-4 backdrop-blur-sm">
           <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95 shadow-sm"
           >
              CANCEL
           </button>
           <button 
              form="change-pwd-form"
              type="submit"
              disabled={!isMatch || !isLongEnough}
              className="flex-1 py-3 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary-600 shadow-xl shadow-slate-900/20 disabled:opacity-20 disabled:grayscale transition-all active:scale-95 flex items-center justify-center gap-2"
           >
              <Save size={14} /> COMMIT_CHANGE
           </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
