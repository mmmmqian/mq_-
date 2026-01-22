
import React, { useState, useMemo, useEffect } from 'react';
import { Drawer } from '../ui/Drawer';
import { 
  Users, Cpu, Zap, Database, 
  Save, ShieldCheck, Hash, 
  Layers, ActivitySquare,
  Server, CheckCircle2,
  X, Calculator, 
  ChevronDown, ChevronRight,
  ShieldAlert, Info,
  Search, Filter, Check,
  Trash2, ArrowRight,
  ListFilter,
  UserCircle,
  Power,
  Globe,
  Layout,
  History,
  Activity,
  Box,
  Monitor,
  RotateCcw
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { MOCK_CLUSTERS, MOCK_RESOURCE_POOLS } from '../../constants';

interface CreateTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any; 
}

export const CreateTenantModal: React.FC<CreateTenantModalProps> = ({ isOpen, onClose, initialData }) => {
  const [step, setStep] = useState(1);
  const isEdit = !!initialData;

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    admin: '',
    status: 'active' as 'active' | 'disabled',
    selectedPools: [] as string[],
    description: ''
  });

  useEffect(() => {
    if (initialData && isOpen) {
      setFormData({
        id: initialData.id,
        name: initialData.name,
        admin: initialData.admin,
        status: initialData.status || 'active',
        selectedPools: initialData.selectedPools || [],
        description: initialData.description || ''
      });
      setStep(1);
    } else if (isOpen) {
      setFormData({
        id: '',
        name: '',
        admin: '',
        status: 'active',
        selectedPools: [],
        description: ''
      });
      setStep(1);
    }
  }, [initialData, isOpen]);

  const [expandedClusters, setExpandedClusters] = useState<string[]>([MOCK_CLUSTERS[0]?.id]);

  const toggleCluster = (id: string) => {
    setExpandedClusters(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const groupedPools = useMemo(() => {
    return MOCK_CLUSTERS.map(cluster => ({
      ...cluster,
      pools: MOCK_RESOURCE_POOLS.filter(p => p.clusterId === cluster.id)
    }));
  }, []);

  const selectedPoolData = useMemo(() => {
    return formData.selectedPools.map(id => MOCK_RESOURCE_POOLS.find(p => p.id === id)).filter(Boolean);
  }, [formData.selectedPools]);

  const statsSummary = useMemo(() => {
    const clusterIds = new Set<string>();
    const quota = formData.selectedPools.reduce((acc, poolId) => {
      const pool = MOCK_RESOURCE_POOLS.find(p => p.id === poolId);
      if (pool) {
        clusterIds.add(pool.clusterId);
        return {
          cpu: acc.cpu + (pool.quota.cpu || 0),
          gpu: acc.gpu + (pool.quota.gpu || 0),
          mem: acc.mem + (pool.quota.memory || 0),
          storage: acc.storage + (pool.quota.storage || 0)
        };
      }
      return acc;
    }, { cpu: 0, gpu: 0, mem: 0, storage: 0 });

    return {
      quota,
      clusterCount: clusterIds.size,
      poolCount: formData.selectedPools.length
    };
  }, [formData.selectedPools]);

  const togglePool = (poolId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedPools: prev.selectedPools.includes(poolId)
        ? prev.selectedPools.filter(id => id !== poolId)
        : [...prev.selectedPools, poolId]
    }));
  };

  const removePool = (poolId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedPools: prev.selectedPools.filter(id => id !== poolId)
    }));
  };

  const clearAllPools = () => {
    setFormData(prev => ({ ...prev, selectedPools: [] }));
  };

  const handleNext = () => setStep(s => s + 1);
  const handlePrev = () => setStep(s => s - 1);

  const handleSubmit = () => {
    console.log('[TENANT_AUDIT] Committing lifecycle change:', formData);
    onClose();
  };

  // 严谨风格的底部审计汇总面板 (根据视觉稿重构)
  const AuditSummaryPanel = () => (
    <div className="w-full space-y-4 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-slate-950 rounded-[32px] p-6 border border-slate-800 shadow-2xl relative overflow-hidden group">
         <div className="absolute inset-0 tech-grid opacity-[0.03] pointer-events-none"></div>
         
         {/* 顶部标题与状态 */}
         <div className="flex justify-between items-center mb-6 px-1 relative z-10">
            <div className="flex items-center gap-2.5">
               <Calculator size={16} className="text-primary-500" />
               <h5 className="text-[11px] font-black text-white uppercase tracking-[0.2em]">
                  聚合算力与作用域汇总 (SUMMARY)
               </h5>
            </div>
            <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
               <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">LIVE AUDIT ACTIVE</span>
            </div>
         </div>
         
         {/* 指标矩阵：6列布局 */}
         <div className="grid grid-cols-6 gap-3 relative z-10">
            {[
               { label: 'CPU 核心', val: statsSummary.quota.cpu, unit: 'C', color: 'text-white' },
               { label: 'GPU 单元', val: statsSummary.quota.gpu, unit: 'U', color: 'text-white' },
               { label: '内存总量', val: statsSummary.quota.mem, unit: 'G', color: 'text-white' },
               { label: '存储容量', val: statsSummary.quota.storage, unit: 'G', color: 'text-white' },
               { label: '已选集群', val: statsSummary.clusterCount, unit: 'NODES', color: 'text-white', icon: Monitor },
               { label: '资源池数', val: statsSummary.poolCount, unit: 'POOLS', color: 'text-white', icon: Layers }
            ].map((item, i) => (
               <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 transition-all hover:bg-white/[0.08] hover:border-white/20">
                  <div className="flex items-center gap-1.5 mb-2">
                     {item.icon && <item.icon size={10} className="text-slate-500" />}
                     <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">{item.label}</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                     <p className={`text-xl font-black font-mono tracking-tighter ${item.color}`}>
                        {item.val.toLocaleString()}
                     </p>
                     <span className="text-[9px] font-black text-slate-600 uppercase">{item.unit}</span>
                  </div>
               </div>
            ))}
         </div>
      </div>

      <div className="flex gap-4">
        <button 
          onClick={handlePrev} 
          className="flex-1 py-3.5 bg-white border border-slate-200 text-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95"
        >
          上一步 (PREV)
        </button>
        <button 
          onClick={handleSubmit}
          disabled={formData.selectedPools.length === 0}
          className="flex-[1.5] py-3.5 bg-primary-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary-700 shadow-xl shadow-primary-500/20 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-30 disabled:grayscale"
        >
          <Save size={14} /> {isEdit ? '提交策略变更' : '确认并初始化租户'}
        </button>
      </div>
    </div>
  );

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-slate-950 rounded-lg flex items-center justify-center text-white shadow-lg">
            <Users size={16} strokeWidth={2.5} />
          </div>
          <span className="font-black uppercase tracking-tight text-slate-900">{isEdit ? '编辑租户授权' : '初始化组织租户'}</span>
        </div>
      }
      description={isEdit ? `UUID: ${formData.id}` : "Two-stage organizational onboarding protocol"}
      width="max-w-5xl"
      footer={
        step === 1 ? (
          <div className="flex gap-3 w-full">
            <button 
              onClick={onClose} 
              className="flex-1 py-3.5 bg-white border border-slate-200 text-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95"
            >
              取消操作
            </button>
            <button 
              onClick={handleNext}
              disabled={!formData.name || !formData.id || !formData.admin}
              className="flex-1 py-3.5 bg-slate-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary-600 shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-30"
            >
              下一步 (NEXT) <ChevronRight size={14} strokeWidth={3} />
            </button>
          </div>
        ) : (
          <AuditSummaryPanel />
        )
      }
    >
      {/* 步骤指示器 */}
      <div className="flex items-center justify-between mb-12 px-20 relative">
         {[
           { id: 1, label: '身份治理', icon: Hash },
           { id: 2, label: '算力授权与审计', icon: ShieldCheck }
         ].map((s) => (
           <div key={s.id} className="flex flex-col items-center relative z-10">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black transition-all duration-500 border-2 ${step === s.id ? 'bg-primary-600 border-primary-600 text-white shadow-xl scale-110' : step > s.id ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-slate-200 text-slate-300'}`}>
                 {step > s.id ? <Check size={18} strokeWidth={4} /> : s.id}
              </div>
              <span className={`text-[10px] font-black uppercase mt-3 tracking-widest ${step === s.id ? 'text-primary-600' : 'text-slate-400'}`}>{s.label}</span>
           </div>
         ))}
         <div className="absolute top-[18px] left-32 right-32 h-0.5 bg-slate-100 -z-0"></div>
         <div 
           className="absolute top-[18px] left-32 h-0.5 bg-primary-500 -z-0 transition-all duration-500" 
           style={{ width: `${(step - 1) * 100}%` }}
         ></div>
      </div>

      <div className="min-h-[500px] pb-10 font-sans">
        {/* Step 1: Identity & Governance */}
        {step === 1 && (
           <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">租户唯一识别号 (TENANT_ID) <span className="text-red-500">*</span></label>
                    <div className="relative group">
                       <Hash size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-500" />
                       <input 
                         type="text" 
                         disabled={isEdit}
                         value={formData.id}
                         onChange={(e) => setFormData({...formData, id: e.target.value.toLowerCase()})}
                         placeholder="e.g. core-ai-dept"
                         className={`w-full pl-11 pr-5 py-3.5 bg-slate-50 border rounded-2xl text-xs font-mono font-bold focus:bg-white focus:border-primary-500 outline-none transition-all ${isEdit ? 'text-slate-400 opacity-60' : 'border-slate-200 shadow-sm'}`}
                       />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">租户显示全称 <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g. 核心算法研发部"
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold focus:bg-white focus:border-primary-500 outline-none transition-all shadow-sm"
                    />
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">租户管理员 (TENANT_ADMIN) <span className="text-red-500">*</span></label>
                 <div className="relative group">
                    <UserCircle size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-500" />
                    <input 
                      type="text" 
                      value={formData.admin}
                      onChange={(e) => setFormData({...formData, admin: e.target.value})}
                      placeholder="指派首位租户管理员账号..."
                      className="w-full pl-11 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono font-bold focus:bg-white focus:border-primary-500 outline-none transition-all shadow-sm"
                    />
                 </div>
              </div>

              <div className="space-y-4">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">运行状态管控 (LIFECYCLE_STATUS)</label>
                 <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner max-w-md">
                    <button 
                      onClick={() => setFormData({...formData, status: 'active'})}
                      className={`flex-1 py-3 rounded-xl text-[10px] font-black transition-all ${formData.status === 'active' ? 'bg-white text-emerald-600 shadow-lg ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                       启用 (ACTIVE)
                    </button>
                    <button 
                      onClick={() => setFormData({...formData, status: 'disabled'})}
                      className={`flex-1 py-3 rounded-xl text-[10px] font-black transition-all ${formData.status === 'disabled' ? 'bg-white text-red-600 shadow-lg ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                       停用 (DISABLED)
                    </button>
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">描述信息 (AUDIT_META)</label>
                 <textarea 
                   rows={3}
                   value={formData.description}
                   onChange={(e) => setFormData({...formData, description: e.target.value})}
                   placeholder="输入该组织的业务背景或归属说明..."
                   className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:bg-white focus:border-primary-500 outline-none transition-all resize-none shadow-sm"
                 />
              </div>
           </div>
        )}

        {/* Step 2: Pool Binding & Audit Summary Combined */}
        {step === 2 && (
           <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
              
              {/* 已授权资源池明细区块 */}
              <div className="space-y-5">
                 <div className="flex justify-between items-end px-1">
                    <div className="flex items-center gap-2.5">
                       <ShieldCheck size={16} className="text-emerald-500" />
                       <h5 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">
                          已授权资源池明细 (AUTHORIZED_LIST)
                       </h5>
                    </div>
                    {formData.selectedPools.length > 0 && (
                       <button 
                          onClick={clearAllPools}
                          className="flex items-center gap-2 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all group"
                       >
                          <RotateCcw size={12} className="group-hover:-rotate-90 transition-transform" /> 一键清空 (PURGE)
                       </button>
                    )}
                 </div>

                 <div className={`bg-slate-50 border border-slate-200 rounded-[32px] p-6 min-h-[120px] transition-all flex flex-wrap gap-3 ${formData.selectedPools.length === 0 ? 'items-center justify-center border-dashed' : ''}`}>
                    {formData.selectedPools.length === 0 ? (
                       <div className="flex flex-col items-center gap-2 opacity-30">
                          <Layers size={32} />
                          <p className="text-[10px] font-black uppercase tracking-widest">尚未关联任何算力资源池</p>
                       </div>
                    ) : (
                       selectedPoolData.map((pool: any) => (
                          <div 
                             key={pool.id}
                             className="flex items-center gap-4 pl-5 pr-2 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm animate-in zoom-in-95 duration-200 group/item hover:border-primary-300 transition-all"
                          >
                             <div className="flex flex-col">
                                <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight leading-none">{pool.displayName}</span>
                                <div className="flex items-center gap-2 mt-1.5">
                                   <Server size={10} className="text-slate-300" />
                                   <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-tighter">{pool.clusterName}</span>
                                </div>
                             </div>
                             <div className="h-8 w-px bg-slate-100 mx-1"></div>
                             <button 
                                onClick={() => removePool(pool.id)}
                                className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                title="移除该授权"
                             >
                                <X size={14} strokeWidth={3} />
                             </button>
                          </div>
                       ))
                    )}
                 </div>
              </div>

              {/* Pool Selection Section */}
              <div className="space-y-5">
                 <div className="flex justify-between items-center px-1">
                    <div className="flex items-center gap-2">
                       <Server size={14} className="text-primary-500" />
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">选择物理集群与逻辑池 (CLUSTER_BINDING)</label>
                    </div>
                    <Badge status={formData.selectedPools.length > 0 ? 'primary' : 'neutral'} showDot={false}>
                       {formData.selectedPools.length} POOLS SELECTED
                    </Badge>
                 </div>

                 <div className="space-y-4">
                    {groupedPools.map(cluster => (
                       <div key={cluster.id} className="bg-white border border-slate-200 rounded-[28px] overflow-hidden transition-all shadow-sm">
                          <div 
                            onClick={() => toggleCluster(cluster.id)}
                            className={`px-6 py-4 flex items-center justify-between cursor-pointer transition-colors ${expandedClusters.includes(cluster.id) ? 'bg-slate-50' : 'hover:bg-slate-50/50'}`}
                          >
                             <div className="flex items-center gap-4">
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${expandedClusters.includes(cluster.id) ? 'bg-slate-950 text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}>
                                   <Server size={18} />
                                </div>
                                <div>
                                   <p className="text-[11px] font-black text-slate-800 uppercase tracking-tight">{cluster.displayName}</p>
                                   <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{cluster.region} · {cluster.environment.toUpperCase()}</p>
                                </div>
                             </div>
                             <ChevronDown size={16} className={`text-slate-300 transition-transform duration-300 ${expandedClusters.includes(cluster.id) ? 'rotate-180' : ''}`} />
                          </div>
                          
                          {expandedClusters.includes(cluster.id) && (
                             <div className="p-4 bg-white border-t border-slate-50 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {cluster.pools.map(pool => {
                                   const isSelected = formData.selectedPools.includes(pool.id);
                                   return (
                                      <button 
                                        key={pool.id}
                                        onClick={() => togglePool(pool.id)}
                                        className={`flex items-center gap-4 p-4 rounded-2xl border transition-all text-left group ${isSelected ? 'bg-primary-50 border-primary-500 ring-4 ring-primary-500/5' : 'bg-transparent border-slate-100 hover:border-slate-200 hover:bg-slate-50/50'}`}
                                      >
                                         <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-primary-600 border-primary-600 shadow-sm' : 'bg-white border-slate-200 group-hover:border-primary-400'}`}>
                                            {isSelected && <Check size={10} className="text-white" strokeWidth={5} />}
                                         </div>
                                         <div className="min-w-0">
                                            <p className={`text-[11px] font-black uppercase truncate ${isSelected ? 'text-primary-900' : 'text-slate-600'}`}>{pool.displayName}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                               <Zap size={9} className={isSelected ? 'text-primary-500' : 'text-slate-300'} />
                                               <span className="text-[8px] font-mono font-bold text-slate-400 uppercase">{pool.quota.gpu}U / {pool.quota.cpu}C</span>
                                            </div>
                                         </div>
                                      </button>
                                   );
                                })}
                             </div>
                          )}
                       </div>
                    ))}
                 </div>
              </div>

              {/* Compliance & Audit Tip */}
              <div className="bg-primary-50/50 border border-primary-100 p-8 rounded-[32px] flex gap-6 shadow-sm">
                 <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary-600 shadow-xl border border-primary-50 shrink-0">
                    <ShieldAlert size={24} strokeWidth={2.5} />
                 </div>
                 <div className="space-y-3">
                    <h6 className="text-[12px] font-black text-slate-900 uppercase tracking-widest">租户初始化合规性声明 (COMPLIANCE)</h6>
                    <p className="text-[11px] text-slate-600 leading-relaxed font-medium uppercase tracking-tight opacity-80">
                       确认提交后，系统将自动在选定集群中创建对应的 Namespace 与隔离策略。租户管理员 ({formData.admin || 'PND'}) 将获得该组织下全量计算资源的二次分发权。
                    </p>
                 </div>
              </div>
           </div>
        )}
      </div>
    </Drawer>
  );
};

const Check = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
);
