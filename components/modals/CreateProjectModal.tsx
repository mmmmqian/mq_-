
import React, { useState } from 'react';
import { Drawer } from '../ui/Drawer';
import { 
  FolderKanban, User, Cpu, Zap, Database, 
  Save, Info, ShieldCheck, ChevronRight,
  ShieldAlert, UserCircle, Hash
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { MOCK_TENANTS } from '../../constants';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAdmin?: boolean; // 超级管理员模式
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose, isAdmin = true }) => {
  const [formData, setFormData] = useState({
    name: '',
    tenantId: isAdmin ? '' : MOCK_TENANTS[0].id,
    owner: '',
    cpuQuota: 100,
    gpuQuota: 8,
    storageQuota: 1024,
    description: ''
  });

  const selectedTenant = MOCK_TENANTS.find(t => t.id === formData.tenantId) || MOCK_TENANTS[0];

  const handleSubmit = () => {
    if (!formData.name || !formData.tenantId) return;
    console.log('Committing Infrastructure Project:', formData);
    onClose();
  };

  const footer = (
    <div className="flex gap-4 w-full">
       <button onClick={onClose} className="flex-1 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">取消操作</button>
       <button 
         onClick={handleSubmit}
         disabled={!formData.name}
         className="flex-1 py-3 bg-primary-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-700 shadow-xl shadow-primary-500/20 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
       >
         <Save size={14} /> 创建业务项目
       </button>
    </div>
  );

  const ResourceInput = ({ label, icon: Icon, value, onChange, unit, max, color }: any) => (
    <div className="space-y-3 p-5 bg-slate-50/50 border border-slate-100 rounded-2xl">
       <div className="flex justify-between items-center">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Icon size={12} className={color} /> {label}
          </label>
          <div className="flex items-baseline gap-1">
             <span className="text-sm font-black font-mono text-slate-900">{value}</span>
             <span className="text-[9px] font-black text-slate-400 uppercase">{unit}</span>
          </div>
       </div>
       <input 
          type="range" 
          min="0" 
          max={max} 
          step={label.includes('GPU') ? 1 : label.includes('CPU') ? 10 : 100}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full h-1.5 bg-slate-200 rounded-full appearance-none accent-primary-600 cursor-pointer"
       />
       <div className="flex justify-between text-[8px] font-black text-slate-300 uppercase tracking-tighter">
          <span>MIN: 0</span>
          <span>MAX (租户上限): {max}{unit}</span>
       </div>
    </div>
  );

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <FolderKanban size={20} className="text-primary-600" />
          <span className="font-black uppercase tracking-tight">初始化业务项目空间</span>
        </div>
      }
      description="Provisioning isolated compute and data scope for business units"
      width="max-w-xl"
      footer={footer}
    >
      <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 pb-6">
         {/* Identification Header */}
         <div className="bg-slate-950 rounded-[32px] p-8 border border-slate-800 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-10 opacity-5 text-white pointer-events-none"><Hash size={140} /></div>
            <div className="relative z-10">
               <Badge status="primary" showDot={false}>ORGANIZATION UNIT</Badge>
               <p className="text-[10px] text-slate-500 mt-4 font-bold uppercase tracking-widest leading-relaxed">
                  项目是平台内最小的资源隔离单元。创建后，您可以为该项目分配成员及其对应的算力操作权限。
               </p>
            </div>
         </div>

         <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                     项目显示名称 <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. 自动驾驶视觉模型"
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold focus:bg-white focus:border-primary-500 outline-none transition-all"
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                     所属组织租户 <span className="text-red-500">*</span>
                  </label>
                  <select 
                    value={formData.tenantId}
                    onChange={(e) => setFormData({...formData, tenantId: e.target.value})}
                    disabled={!isAdmin}
                    className={`w-full px-5 py-3.5 bg-slate-50 border rounded-2xl text-xs font-bold outline-none transition-all appearance-none cursor-pointer ${!isAdmin ? 'border-slate-100 text-slate-400 grayscale' : 'border-slate-200 focus:bg-white focus:border-primary-500'}`}
                  >
                    <option value="">请选择目标租户...</option>
                    {MOCK_TENANTS.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
               </div>
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <UserCircle size={14} className="text-primary-500" /> 指定项目负责人 (OWNER) <span className="text-red-500">*</span>
               </label>
               <div className="relative group">
                  <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input 
                    type="text" 
                    value={formData.owner}
                    onChange={(e) => setFormData({...formData, owner: e.target.value})}
                    placeholder="输入用户名进行联想搜索..."
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold focus:bg-white focus:border-primary-500 outline-none transition-all font-mono"
                  />
               </div>
               <p className="text-[8px] text-slate-400 font-bold uppercase italic ml-1">* 该用户将自动获得项目管理员角色</p>
            </div>

            <div className="pt-4 space-y-5">
               <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
                  <ShieldCheck size={14} className="text-emerald-500" /> 资源硬配额限制 (QUOTA_ENFORCEMENT)
               </h5>
               <div className="grid grid-cols-1 gap-4">
                  {/* Fix: Access cpu through selectedTenant.quota.cpu */}
                  <ResourceInput 
                    label="CPU 计算核心" 
                    icon={Cpu} 
                    value={formData.cpuQuota} 
                    onChange={(v: number) => setFormData({...formData, cpuQuota: v})} 
                    unit="C" 
                    max={selectedTenant.quota.cpu} 
                    color="text-primary-500"
                  />
                  {/* Fix: Access gpu through selectedTenant.quota.gpu */}
                  <ResourceInput 
                    label="GPU 加速单元" 
                    icon={Zap} 
                    value={formData.gpuQuota} 
                    onChange={(v: number) => setFormData({...formData, gpuQuota: v})} 
                    unit="Cards" 
                    max={selectedTenant.quota.gpu} 
                    color="text-emerald-500"
                  />
                  {/* Fix: Access storage through selectedTenant.quota.storage */}
                  <ResourceInput 
                    label="持久化存储容量" 
                    icon={Database} 
                    value={formData.storageQuota} 
                    onChange={(v: number) => setFormData({...formData, storageQuota: v})} 
                    unit="GB" 
                    max={selectedTenant.quota.storage} 
                    color="text-amber-500"
                  />
               </div>
            </div>

            <div className="bg-amber-50/50 border border-amber-100 p-5 rounded-[24px] flex gap-4">
               <ShieldAlert size={20} className="text-amber-500 shrink-0 mt-0.5" />
               <p className="text-[10px] text-amber-800 font-bold leading-relaxed uppercase tracking-tight">
                  基础设施审计提示：分配的项目配额将从租户总池中冻结。如需创建超大规模项目，请先联系超级管理员为租户进行扩容。
               </p>
            </div>
         </div>
      </div>
    </Drawer>
  );
};
