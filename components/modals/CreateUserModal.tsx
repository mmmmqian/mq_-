
import React, { useState, useEffect, useMemo } from 'react';
import { Drawer } from '../ui/Drawer';
import { 
  User, Mail, Phone, Lock, ShieldCheck, 
  Globe, UserCircle, Save, Info, Eye, 
  EyeOff, Hash, Command, ShieldAlert
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { MOCK_TENANTS, ROLE_CONFIG } from '../../constants';
import { PlatformRole, User as UserType } from '../../types';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: UserType | null;
  currentUserRole?: PlatformRole; // 模拟当前登录用户角色以进行权限控制
}

export const CreateUserModal: React.FC<CreateUserModalProps> = ({ 
  isOpen, 
  onClose, 
  initialData, 
  currentUserRole = 'super_admin' 
}) => {
  const isEdit = !!initialData;
  const isSuperAdmin = currentUserRole === 'super_admin';

  const [showPwd, setShowPwd] = useState(false);
  const [formData, setFormData] = useState({
    realName: '',
    userName: '',
    password: '',
    confirmPassword: '',
    email: '',
    phone: '',
    tenantId: isSuperAdmin ? '' : (initialData?.tenantId || 'tenant-core-ai'),
    role: 'platform_visitor' as PlatformRole,
    status: 'active' as 'active' | 'disabled',
    remark: ''
  });

  useEffect(() => {
    if (initialData && isOpen) {
      setFormData({
        realName: initialData.realName,
        userName: initialData.userName,
        password: '',
        confirmPassword: '',
        email: initialData.email,
        phone: initialData.phone.replace(/\*/g, ''), // 实际编辑时脱敏应由后端处理
        tenantId: initialData.tenantId,
        role: initialData.role,
        status: initialData.status,
        remark: initialData.remark || ''
      });
    } else if (isOpen) {
      setFormData({
        realName: '',
        userName: '',
        password: '',
        confirmPassword: '',
        email: '',
        phone: '',
        tenantId: isSuperAdmin ? '' : 'tenant-core-ai',
        role: 'platform_visitor',
        status: 'active',
        remark: ''
      });
    }
  }, [initialData, isOpen, isSuperAdmin]);

  const passwordValidation = useMemo(() => {
    const p = formData.password;
    if (!p) return null;
    return {
      length: p.length >= 8,
      complexity: /[A-Z]/.test(p) && /[a-z]/.test(p) && /[0-9]/.test(p) && /[^A-Za-z0-9]/.test(p),
      match: formData.password === formData.confirmPassword
    };
  }, [formData.password, formData.confirmPassword]);

  const isValid = useMemo(() => {
    const basic = formData.realName && formData.userName && formData.email && formData.tenantId && formData.role;
    if (isEdit) return basic;
    return basic && passwordValidation?.length && passwordValidation?.complexity && passwordValidation?.match;
  }, [formData, isEdit, passwordValidation]);

  const handleSubmit = () => {
    console.log('[USER_AUDIT] Submitting User Data:', formData);
    onClose();
  };

  const footer = (
    <div className="flex gap-4 w-full">
       <button onClick={onClose} className="flex-1 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">取消操作</button>
       <button 
         onClick={handleSubmit}
         disabled={!isValid}
         className="flex-1 py-3 bg-primary-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-700 shadow-xl shadow-primary-500/20 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
       >
         <Save size={14} /> {isEdit ? '保存变更' : '确认创建用户'}
       </button>
    </div>
  );

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-slate-950 rounded-lg flex items-center justify-center text-white shadow-lg">
            <User size={16} strokeWidth={2.5} />
          </div>
          <span className="font-black uppercase tracking-tight text-slate-900">{isEdit ? '编辑用户凭证' : '注册新用户账号'}</span>
        </div>
      }
      description="CALIBRATING IDENTITY AND ACCESS SCOPE"
      width="max-w-2xl"
      footer={footer}
    >
      <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 pb-10 font-sans">
         
         {/* Identity Section */}
         <section className="space-y-6">
            <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
               <UserCircle size={14} className="text-primary-500" /> 基础身份定义 (IDENTITY)
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">用户真实姓名 <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    value={formData.realName}
                    onChange={e => setFormData({...formData, realName: e.target.value})}
                    placeholder="请输入姓名"
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold focus:bg-white focus:border-primary-500 outline-none transition-all"
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">登录用户名 (UNIQUE) <span className="text-red-500">*</span></label>
                  <div className="relative group">
                     <Hash size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                     <input 
                        type="text" 
                        disabled={isEdit}
                        value={formData.userName}
                        onChange={e => setFormData({...formData, userName: e.target.value.toLowerCase()})}
                        placeholder="字母数字下划线"
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono font-bold focus:bg-white focus:border-primary-500 outline-none transition-all disabled:opacity-50 disabled:bg-slate-100"
                     />
                  </div>
               </div>
            </div>
         </section>

         {/* Contact Section */}
         <section className="space-y-6">
            <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
               <Mail size={14} className="text-primary-500" /> 联系信息 (CONTACT)
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">电子邮箱 <span className="text-red-500">*</span></label>
                  <div className="relative">
                     <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                     <input 
                        type="email" 
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        placeholder="example@corp.com"
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:bg-white focus:border-primary-500 outline-none transition-all"
                     />
                  </div>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">手机号码</label>
                  <div className="relative">
                     <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                     <input 
                        type="tel" 
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                        placeholder="13x xxxx xxxx"
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono font-bold focus:bg-white focus:border-primary-500 outline-none transition-all"
                     />
                  </div>
               </div>
            </div>
         </section>

         {/* Org & Role Section */}
         <section className="space-y-6">
            <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
               <Globe size={14} className="text-primary-500" /> 组织与授权 (AUTHORIZATION)
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">所属组织租户 <span className="text-red-500">*</span></label>
                  <div className="relative">
                     <Globe size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                     <select 
                        disabled={!isSuperAdmin || isEdit}
                        value={formData.tenantId}
                        onChange={e => setFormData({...formData, tenantId: e.target.value})}
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold focus:bg-white focus:border-primary-500 outline-none transition-all appearance-none cursor-pointer disabled:bg-slate-100 disabled:text-slate-400"
                     >
                        <option value="">请选择租户...</option>
                        {MOCK_TENANTS.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                     </select>
                  </div>
                  {!isSuperAdmin && <p className="text-[8px] text-slate-400 font-bold uppercase italic ml-1">* 租户管理员仅限在本组织内创建用户</p>}
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">平台角色 <span className="text-red-500">*</span></label>
                  <div className="relative">
                     <ShieldCheck size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                     <select 
                        value={formData.role}
                        onChange={e => setFormData({...formData, role: e.target.value as PlatformRole})}
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold focus:bg-white focus:border-primary-500 outline-none transition-all appearance-none cursor-pointer"
                     >
                        <option value="platform_visitor">平台访客 (Visitor)</option>
                        <option value="operations_engineer">运维工程师 (Ops)</option>
                        <option value="platform_admin">平台管理员 (Admin)</option>
                        {isSuperAdmin && <option value="super_admin">超级管理员 (Super)</option>}
                     </select>
                  </div>
               </div>
            </div>
         </section>

         {/* Security Section (Only for Create) */}
         {!isEdit && (
            <section className="space-y-6">
               <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
                  <Lock size={14} className="text-primary-500" /> 安全凭证 (SECURITY)
               </h5>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">设置初始密码 <span className="text-red-500">*</span></label>
                     <div className="relative group">
                        <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-500" />
                        <input 
                           type={showPwd ? "text" : "password"} 
                           value={formData.password}
                           onChange={e => setFormData({...formData, password: e.target.value})}
                           className="w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono focus:bg-white focus:border-primary-500 outline-none transition-all shadow-inner"
                        />
                        <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors p-1">
                           {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">确认初始密码 <span className="text-red-500">*</span></label>
                     <input 
                        type={showPwd ? "text" : "password"} 
                        value={formData.confirmPassword}
                        onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono focus:bg-white focus:border-primary-500 outline-none transition-all shadow-inner"
                     />
                  </div>
               </div>

               {/* Password Rules Hint */}
               {formData.password && (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                     <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black text-slate-400 uppercase">密码强度校验 (SECURITY_ENFORCEMENT)</span>
                        {passwordValidation?.length && passwordValidation?.complexity ? <Badge status="success">符合要求</Badge> : <Badge status="error">强度不足</Badge>}
                     </div>
                     <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                           <div className={`w-1 h-1 rounded-full ${passwordValidation?.length ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                           <p className={`text-[9px] font-bold uppercase ${passwordValidation?.length ? 'text-emerald-600' : 'text-slate-400'}`}>长度不少于 8 位 (REQUIRED)</p>
                        </div>
                        <div className="flex items-center gap-2">
                           <div className={`w-1 h-1 rounded-full ${passwordValidation?.complexity ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                           <p className={`text-[9px] font-bold uppercase ${passwordValidation?.complexity ? 'text-emerald-600' : 'text-slate-400'}`}>包含大小写字母、数字及特殊字符 (REQUIRED)</p>
                        </div>
                        <div className="flex items-center gap-2">
                           <div className={`w-1 h-1 rounded-full ${passwordValidation?.match ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                           <p className={`text-[9px] font-bold uppercase ${passwordValidation?.match ? 'text-emerald-600' : 'text-slate-400'}`}>两次输入凭证一致 (REQUIRED)</p>
                        </div>
                     </div>
                  </div>
               )}
            </section>
         )}

         {/* Status Section */}
         <section className="space-y-6">
            <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
               <ShieldAlert size={14} className="text-primary-500" /> 账号状态管控 (STATUS)
            </h5>
            <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner w-full max-w-sm">
               <button 
                  type="button"
                  onClick={() => setFormData({...formData, status: 'active'})}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black transition-all ${formData.status === 'active' ? 'bg-white text-emerald-600 shadow-lg ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
               >
                  启用 (ACTIVE)
               </button>
               <button 
                  type="button"
                  onClick={() => setFormData({...formData, status: 'disabled'})}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black transition-all ${formData.status === 'disabled' ? 'bg-white text-red-600 shadow-lg ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
               >
                  禁用 (DISABLED)
               </button>
            </div>
         </section>

         {/* Remark Section */}
         <section className="space-y-4">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">管理员备注</label>
            <textarea 
               value={formData.remark}
               onChange={e => setFormData({...formData, remark: e.target.value})}
               rows={3}
               placeholder="输入账号相关说明（选填）"
               className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:bg-white focus:border-primary-500 outline-none transition-all resize-none"
            />
         </section>

         <div className="bg-primary-50/50 border border-primary-100 p-6 rounded-[32px] flex gap-4">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary-600 shadow-sm shrink-0">
               <ShieldCheck size={20} strokeWidth={2.5} />
            </div>
            <p className="text-[10px] text-primary-800 font-bold leading-relaxed uppercase tracking-tight">
               安全合规提示：新创建的用户在首次登录后需强制在“个人中心”修改初始密码。所有账号操作均由 Nexus Kernel 系统实时记录审计日志。
            </p>
         </div>
      </div>
    </Drawer>
  );
};
