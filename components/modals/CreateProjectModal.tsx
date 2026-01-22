
import React, { useState, useMemo, useEffect } from 'react';
import { Drawer } from '../ui/Drawer';
import { 
  FolderKanban, User, Cpu, Zap, Database, 
  Save, Info, ShieldCheck, ChevronRight,
  ShieldAlert, UserCircle, Hash, Layers,
  Server, Search, Check, AlertCircle,
  Activity, MousePointer2, Settings,
  ChevronLeft, Layout, Gauge, 
  ArrowDownToLine, TrendingDown,
  BarChart3, ActivitySquare, PieChart,
  ArrowDownCircle, ActivitySquare as PulseIcon
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { MOCK_TENANTS, MOCK_RESOURCE_POOLS } from '../../constants';
import { ResourcePool, Project } from '../../types';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Project | null;
  isAdmin?: boolean; 
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose, initialData, isAdmin = true }) => {
  const isEdit = !!initialData;
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    name: '',
    tenantId: isAdmin ? '' : (MOCK_TENANTS[0]?.id || ''),
    poolId: '',
    owner: '',
    cpuQuota: 0,
    gpuQuota: 0,
    memoryQuota: 0,
    storageQuota: 0,
    description: ''
  });

  // 初始化编辑数据
  useEffect(() => {
    if (initialData && isOpen) {
      setFormData({
        name: initialData.name,
        tenantId: initialData.tenantId,
        poolId: 'POOL-LLM-01', 
        owner: initialData.owner,
        cpuQuota: initialData.quota.cpu,
        gpuQuota: initialData.quota.gpu,
        memoryQuota: initialData.quota.memory,
        storageQuota: initialData.quota.storage,
        description: initialData.description || ''
      });
      setStep(1);
    } else if (isOpen) {
      setFormData({
        name: '',
        tenantId: isAdmin ? '' : (MOCK_TENANTS[0]?.id || ''),
        poolId: '',
        owner: '',
        cpuQuota: 0,
        gpuQuota: 0,
        memoryQuota: 0,
        storageQuota: 0,
        description: ''
      });
      setStep(1);
    }
  }, [initialData, isOpen, isAdmin]);

  const availablePools = useMemo(() => {
    if (!formData.tenantId) return [];
    return MOCK_RESOURCE_POOLS.filter(p => p.tenantId === formData.tenantId);
  }, [formData.tenantId]);

  const selectedPool = useMemo(() => {
    return MOCK_RESOURCE_POOLS.find(p => p.id === formData.poolId);
  }, [formData.poolId]);

  const handleNext = () => setStep(s => s + 1);
  const handlePrev = () => setStep(s => s - 1);

  const handleSubmit = () => {
    console.log(`[INFRA_AUDIT] ${isEdit ? 'Updating' : 'Creating'} Project:`, formData);
    onClose();
  };

  const ResourceInput = ({ label, icon: Icon, value, onChange, unit, poolTotal, poolUsed, initialVal, color }: any) => {
    const poolAvailableBefore = poolTotal - poolUsed;
    const projectOriginalQuota = isEdit ? initialVal : 0;
    const currentPoolRemaining = poolAvailableBefore + projectOriginalQuota - value;
    const isCritical = currentPoolRemaining < (poolTotal * 0.1);
    const isNegative = currentPoolRemaining < 0;

    return (
      <div className={`space-y-5 p-7 rounded-[40px] border transition-all duration-500 relative overflow-hidden ${isNegative ? 'bg-red-50/50 border-red-200' : 'bg-white border-slate-200 hover:border-primary-300 shadow-sm'}`}>
         {isNegative && (
           <div className="absolute top-0 right-0 p-6 opacity-10 text-red-600 animate-pulse">
              <ShieldAlert size={48} />
           </div>
         )}
         
         <div className="flex justify-between items-start">
            <div className="space-y-1">
              <label className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${isNegative ? 'text-red-600' : 'text-slate-500'}`}>
                <Icon size={14} className={isNegative ? 'text-red-500' : color} /> {label}
              </label>
              
              <div className="mt-4 space-y-1">
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">分配后池剩余 (AFTER_ALLOCATION)</p>
                 <div className="flex items-baseline gap-2">
                    <span className={`text-2xl font-black font-mono tracking-tighter ${isNegative ? 'text-red-600 animate-pulse' : isCritical ? 'text-amber-500' : 'text-emerald-600'}`}>
                       {currentPoolRemaining.toLocaleString()}
                    </span>
                    <span className={`text-xs font-black uppercase ${isNegative ? 'text-red-400' : 'text-slate-300'}`}>{unit}</span>
                 </div>
              </div>
            </div>

            <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border shadow-inner transition-all ${isNegative ? 'bg-white border-red-200' : 'bg-slate-50 border-slate-100'}`}>
               <input 
                  type="number"
                  value={value}
                  onChange={(e) => onChange(parseInt(e.target.value) || 0)}
                  className={`w-20 bg-transparent border-none p-0 text-base font-black font-mono focus:ring-0 text-right ${isNegative ? 'text-red-600' : 'text-slate-900'}`}
               />
               <span className="text-[10px] font-black text-slate-400 uppercase">{unit}</span>
            </div>
         </div>

         <div className="relative pt-2">
            <input 
               type="range" 
               min="0" 
               max={poolTotal} 
               value={value}
               onChange={(e) => onChange(parseInt(e.target.value))}
               className={`w-full h-1.5 rounded-full appearance-none cursor-pointer transition-all ${isNegative ? 'bg-red-200 accent-red-600' : 'bg-slate-100 accent-primary-600 hover:h-2'}`}
            />
         </div>

         <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-300">
            <div className="flex items-center gap-2">
               <div className={`w-1.5 h-1.5 rounded-full ${isNegative ? 'bg-red-500' : 'bg-slate-200'}`}></div>
               池上限 (POOL_LIMIT): {poolTotal}{unit}
            </div>
            <div className={`px-2 py-0.5 rounded-md ${isNegative ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-400'}`}>
               占用率: {Math.round((value / poolTotal) * 100)}%
            </div>
         </div>
      </div>
    );
  };

  // 资源池“可用核心展示”组件
  const CapacityMetric = ({ label, used, total, unit, icon: Icon, color }: any) => {
    const available = total - used;
    const availPercent = Math.round((available / total) * 100);
    const isLow = availPercent < 15;

    return (
      <div className={`bg-white/5 border rounded-[32px] p-6 flex flex-col gap-5 transition-all duration-500 ${isLow ? 'border-amber-500/30' : 'border-white/10 hover:bg-white/[0.08]'}`}>
        <div className="flex justify-between items-center">
           <div className="flex items-center gap-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <Icon size={14} className={color} /> {label}
           </div>
           <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase ${isLow ? 'bg-amber-500/20 text-amber-400 animate-pulse' : 'bg-emerald-500/20 text-emerald-400'}`}>
              <PulseIcon size={10} /> {availPercent}% 可用
           </div>
        </div>
        
        <div className="space-y-1">
           <div className="flex items-baseline gap-2">
              <span className="text-white text-3xl font-black font-mono leading-none tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">{available.toLocaleString()}</span>
              <span className="text-slate-500 text-[11px] font-black uppercase">{unit}</span>
           </div>
           <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">当前池可用余额 (POOL_AVAIL_BALANCE)</p>
        </div>

        <div className="space-y-2">
           <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <div className={`h-full ${color.replace('text-', 'bg-')} transition-all duration-1000`} style={{ width: `${100 - availPercent}%` }}></div>
           </div>
           <div className="flex justify-between items-center text-[8px] font-black text-slate-500 uppercase tracking-tighter">
              <span>已占用: {used}{unit}</span>
              <span>池总量: {total}{unit}</span>
           </div>
        </div>
      </div>
    );
  };

  // 资源池列表内的迷你资源看板 (Step 2)
  const PoolResourceBreakdown = ({ label, used, total, unit, isSelected }: any) => {
    const remaining = total - used;
    const isLow = remaining / total < 0.1;
    return (
      <div className="flex flex-col gap-1.5">
        <span className={`text-[8px] font-black uppercase tracking-widest ${isSelected ? 'text-slate-500' : 'text-slate-400'}`}>{label}</span>
        <div className="flex items-baseline gap-1.5">
           <span className={`text-[11px] font-black font-mono ${isSelected ? 'text-white' : 'text-slate-900'}`}>{used}</span>
           <span className="text-[8px] font-bold text-slate-500">/</span>
           <span className={`text-[11px] font-black font-mono ${isSelected ? 'text-slate-500' : 'text-slate-400'}`}>{total}</span>
           <span className={`text-[9px] font-black font-mono ml-2 ${isSelected ? (isLow ? 'text-rose-400' : 'text-emerald-400') : (isLow ? 'text-rose-600' : 'text-emerald-600')}`}>
             (剩:{remaining}{unit})
           </span>
        </div>
      </div>
    );
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-slate-950 rounded-lg flex items-center justify-center text-white shadow-lg">
            <FolderKanban size={16} strokeWidth={2.5} />
          </div>
          <span className="font-black uppercase tracking-tight text-slate-900">{isEdit ? '调整项目配额' : '初始化项目空间'}</span>
        </div>
      }
      description={isEdit ? `UUID: ${initialData?.id}` : "Two-stage organizational onboarding protocol"}
      width="max-w-4xl"
      footer={
        <div className="flex gap-3 w-full">
           <button 
             onClick={step === 1 ? onClose : handlePrev} 
             className="flex-1 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95"
           >
              {step === 1 ? '取消操作' : '上一步 (PREV)'}
           </button>
           {step < 3 ? (
              <button 
                onClick={handleNext}
                disabled={step === 1 && (!formData.name || !formData.tenantId) || step === 2 && !formData.poolId}
                className="flex-1 py-3 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary-600 shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-30"
              >
                下一步 (NEXT) <ChevronRight size={14} strokeWidth={3} />
              </button>
           ) : (
              <button 
                onClick={handleSubmit}
                className="flex-1 py-3 bg-primary-600 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary-700 shadow-xl shadow-primary-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Save size={14} /> {isEdit ? '确认并同步配额' : '确认并初始化项目'}
              </button>
           )}
        </div>
      }
    >
      {/* 步骤指示器 */}
      <div className="flex items-center justify-between mb-12 px-12 relative">
         {[
           { id: 1, label: '属性定义', icon: Hash },
           { id: 2, label: '算力绑定', icon: Layers },
           { id: 3, label: '配额校准', icon: Gauge }
         ].map((s, idx) => (
           <div key={s.id} className="flex flex-col items-center relative z-10">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black transition-all duration-500 border-2 ${step === s.id ? 'bg-primary-600 border-primary-600 text-white shadow-xl scale-110' : step > s.id ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-slate-200 text-slate-300'}`}>
                 {step > s.id ? <Check size={18} strokeWidth={4} /> : s.id}
              </div>
              <span className={`text-[10px] font-black uppercase mt-3 tracking-widest ${step === s.id ? 'text-primary-600' : 'text-slate-400'}`}>{s.label}</span>
           </div>
         ))}
         <div className="absolute top-[18px] left-20 right-20 h-0.5 bg-slate-100 -z-0"></div>
         <div 
           className="absolute top-[18px] left-20 h-0.5 bg-primary-500 -z-0 transition-all duration-500" 
           style={{ width: `${(step - 1) * 50}%` }}
         ></div>
      </div>

      <div className="min-h-[500px] pb-10 font-sans">
        {step === 1 && (
           <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">项目显示全称 <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g. 自动驾驶场景视觉微调"
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold focus:bg-white focus:border-primary-500 outline-none transition-all shadow-sm"
                    />
                 </div>
                 
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">归属组织租户 <span className="text-red-500">*</span></label>
                    <div className="relative group">
                       <select 
                         value={formData.tenantId}
                         onChange={(e) => setFormData({...formData, tenantId: e.target.value, poolId: ''})}
                         disabled={!isAdmin || isEdit}
                         className={`w-full px-5 py-3.5 bg-slate-50 border rounded-2xl text-xs font-bold outline-none transition-all appearance-none cursor-pointer ${(!isAdmin || isEdit) ? 'text-slate-400 border-slate-100 grayscale' : 'border-slate-200 focus:bg-white focus:border-primary-500 shadow-sm'}`}
                       >
                         <option value="">请选择组织...</option>
                         {MOCK_TENANTS.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                       </select>
                       <ChevronRight size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 rotate-90" />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">项目负责人 (OWNER) <span className="text-red-500">*</span></label>
                    <div className="relative group">
                       <UserCircle size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-500 transition-colors" />
                       <input 
                         type="text" 
                         value={formData.owner}
                         onChange={(e) => setFormData({...formData, owner: e.target.value})}
                         placeholder="指派该项目的主控开发者账户..."
                         className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono font-bold focus:bg-white focus:border-primary-500 outline-none transition-all shadow-sm"
                       />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">用途说明与审计元数据</label>
                    <textarea 
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="简述计算任务目标，便于组织进行资源审计..."
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:bg-white focus:border-primary-500 outline-none transition-all resize-none shadow-sm"
                    />
                 </div>
              </div>
           </div>
        )}

        {step === 2 && (
           <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex justify-between items-center px-1">
                 <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Layers size={18} className="text-primary-600" /> 选择物理算力资源池 (POOL_BINDING)
                 </h5>
              </div>

              <div className="grid grid-cols-1 gap-4">
                 {availablePools.length === 0 ? (
                    <div className="border-2 border-dashed border-slate-100 rounded-[32px] py-20 flex flex-col items-center justify-center text-slate-300">
                       <MousePointer2 size={40} className="opacity-10 mb-4" />
                       <p className="text-[10px] font-black uppercase tracking-widest">该组织下暂无已授权的算力池</p>
                    </div>
                 ) : (
                    availablePools.map(pool => {
                       const isSelected = formData.poolId === pool.id;
                       return (
                          <button 
                            key={pool.id}
                            onClick={() => setFormData({...formData, poolId: pool.id})}
                            className={`relative p-8 rounded-[32px] border transition-all text-left group overflow-hidden ${isSelected ? 'bg-slate-950 border-slate-900 shadow-2xl scale-[1.01]' : 'bg-white border-slate-200 hover:border-primary-300 shadow-sm'}`}
                          >
                             {isSelected && (
                               <div className="absolute top-0 right-0 p-8 opacity-10 text-white animate-in zoom-in duration-300">
                                  <Check size={48} strokeWidth={3} />
                               </div>
                             )}
                             <div className="flex justify-between items-start mb-8 relative z-10">
                                <div className="flex items-center gap-5">
                                   <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isSelected ? 'bg-primary-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400'}`}>
                                      <Server size={24} strokeWidth={2.5} />
                                   </div>
                                   <div>
                                      <p className={`text-base font-black uppercase tracking-tight ${isSelected ? 'text-white' : 'text-slate-900'}`}>{pool.displayName}</p>
                                      <div className="flex items-center gap-2 mt-1.5">
                                         <Badge status="primary" showDot={false}>{pool.clusterName}</Badge>
                                         <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                                         <span className={`text-[9px] font-bold uppercase tracking-widest ${isSelected ? 'text-slate-500' : 'text-slate-400'}`}>ID: {pool.id}</span>
                                      </div>
                                   </div>
                                </div>
                                <div className="text-right">
                                   <div className="flex items-center gap-2">
                                      <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-emerald-400 animate-pulse' : 'bg-emerald-500'}`}></div>
                                      <span className={`text-[9px] font-black uppercase tracking-widest ${isSelected ? 'text-emerald-400' : 'text-emerald-600'}`}>负载状态: 良好</span>
                                   </div>
                                </div>
                             </div>

                             {/* 优化的简洁资源展示看板：已用/总量/剩余 */}
                             <div className={`grid grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-6 relative z-10 p-6 rounded-2xl border transition-all ${isSelected ? 'bg-white/5 border-white/10' : 'bg-slate-50/50 border-slate-100'}`}>
                                <PoolResourceBreakdown label="GPU 加速单元" used={pool.used.gpu} total={pool.quota.gpu} unit="U" isSelected={isSelected} />
                                <PoolResourceBreakdown label="CPU 核心计算" used={pool.used.cpu} total={pool.quota.cpu} unit="C" isSelected={isSelected} />
                                <PoolResourceBreakdown label="物理内存总量" used={pool.used.memory} total={pool.quota.memory} unit="G" isSelected={isSelected} />
                                <PoolResourceBreakdown label="存储持久空间" used={pool.used.storage} total={pool.quota.storage} unit="G" isSelected={isSelected} />
                             </div>

                             <div className="mt-6 flex items-center justify-between relative z-10 text-[8px] font-black uppercase tracking-widest opacity-40">
                                <span>K8S_V: {pool.clusterName.includes('01') ? 'v1.28' : 'v1.29'}</span>
                                <span>LAST_SYNC: {pool.updatedAt}</span>
                             </div>
                          </button>
                       );
                    })
                 )}
              </div>
           </div>
        )}

        {step === 3 && (
           <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
              {selectedPool ? (
                 <div className="space-y-10">
                    <div className="bg-slate-950 rounded-[48px] p-10 border border-slate-800 shadow-2xl relative overflow-hidden group">
                       <div className="absolute inset-0 tech-grid opacity-[0.03] pointer-events-none"></div>
                       
                       <div className="flex justify-between items-center mb-10 relative z-10 px-2">
                          <div className="flex items-center gap-6">
                             <div className="w-14 h-14 bg-primary-600/20 rounded-2xl flex items-center justify-center text-primary-400 border border-primary-500/20 shadow-inner">
                                <BarChart3 size={28} />
                             </div>
                             <div>
                                <h6 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">源资源池实时可用配额 (CAPACITY_RESERVE)</h6>
                                <p className="text-white text-base font-black uppercase mt-1.5 tracking-tight">{selectedPool.displayName}</p>
                             </div>
                          </div>
                          <div className="flex items-center gap-2">
                             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.6)]"></div>
                             <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">LIVE_POOL_SYNC</span>
                          </div>
                       </div>

                       {/* 强化了“可用额度”展示的容量矩阵 */}
                       <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                          <CapacityMetric label="CPU 计算余额" used={selectedPool.used.cpu} total={selectedPool.quota.cpu} unit="C" icon={Cpu} color="text-primary-500" />
                          <CapacityMetric label="GPU 核心余额" used={selectedPool.used.gpu} total={selectedPool.quota.gpu} unit="U" icon={Zap} color="text-emerald-500" />
                          <CapacityMetric label="内存 提交余额" used={selectedPool.used.memory} total={selectedPool.quota.memory} unit="G" icon={PulseIcon} color="text-indigo-500" />
                          <CapacityMetric label="存储 持久余额" used={selectedPool.used.storage} total={selectedPool.quota.storage} unit="G" icon={Database} color="text-amber-500" />
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <ResourceInput 
                          label="项目 GPU 加速单元申请" icon={Zap} unit="U" color="text-emerald-500"
                          value={formData.gpuQuota} 
                          poolTotal={selectedPool.quota.gpu}
                          poolUsed={selectedPool.used.gpu}
                          initialVal={initialData?.quota.gpu || 0}
                          onChange={(v: number) => setFormData({...formData, gpuQuota: v})}
                       />
                       <ResourceInput 
                          label="项目 CPU 核心计算申请" icon={Cpu} unit="C" color="text-primary-500"
                          value={formData.cpuQuota}
                          poolTotal={selectedPool.quota.cpu}
                          poolUsed={selectedPool.used.cpu}
                          initialVal={initialData?.quota.cpu || 0}
                          onChange={(v: number) => setFormData({...formData, cpuQuota: v})}
                       />
                       <ResourceInput 
                          label="项目 物理内存分配申请" icon={Activity} unit="G" color="text-indigo-500"
                          value={formData.memoryQuota}
                          poolTotal={selectedPool.quota.memory}
                          poolUsed={selectedPool.used.memory}
                          initialVal={initialData?.quota.memory || 0}
                          onChange={(v: number) => setFormData({...formData, memoryQuota: v})}
                       />
                       <ResourceInput 
                          label="项目 存储持久化申请" icon={Database} unit="G" color="text-amber-500"
                          value={formData.storageQuota}
                          poolTotal={selectedPool.quota.storage}
                          poolUsed={selectedPool.used.storage}
                          initialVal={initialData?.quota.storage || 0}
                          onChange={(v: number) => setFormData({...formData, storageQuota: v})}
                       />
                    </div>

                    <div className="bg-primary-50/30 border border-primary-100 p-8 rounded-[40px] flex gap-6 shadow-sm">
                       <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary-600 shadow-sm shrink-0 border border-primary-100">
                          <ShieldCheck size={24} strokeWidth={2.5} />
                       </div>
                       <div className="space-y-3">
                          <h6 className="text-[12px] font-black text-slate-900 uppercase tracking-widest">资源分配严谨性声明 (QUOTA_PROTOCOL)</h6>
                          <p className="text-[11px] text-slate-600 leading-relaxed font-medium uppercase tracking-tight opacity-80">
                             项目配额变更将同步更新 K8s ResourceQuota 资源。若池剩余配额（BALANCE）出现负值，调度器将强制挂起该项目下所有新建工作负载。请基于上方“池余额”数据进行科学分配。
                          </p>
                       </div>
                    </div>
                 </div>
              ) : (
                 <div className="py-20 flex flex-col items-center justify-center text-slate-300">
                    <ShieldAlert size={40} className="opacity-10 mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-widest">请返回选择物理资源池</p>
                 </div>
              )}
           </div>
        )}
      </div>
    </Drawer>
  );
};
