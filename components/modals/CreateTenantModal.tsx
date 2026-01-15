
import React, { useState, useMemo } from 'react';
import { Drawer } from '../ui/Drawer';
import { 
  Users, Cpu, Zap, Database, 
  Save, ShieldCheck, Hash, 
  Layers, ActivitySquare,
  Server, CheckCircle2,
  X, Calculator, 
  ChevronDown, ChevronUp,
  ShieldAlert, Info,
  Search, Filter, Check,
  Trash2, ArrowRight
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { MOCK_CLUSTERS, MOCK_RESOURCE_POOLS } from '../../constants';

interface CreateTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any; 
}

export const CreateTenantModal: React.FC<CreateTenantModalProps> = ({ isOpen, onClose, initialData }) => {
  const [formData, setFormData] = useState({
    id: initialData?.id || '',
    name: initialData?.name || '',
    selectedPools: (initialData?.pools || []) as string[],
    description: initialData?.description || ''
  });

  const [expandedClusters, setExpandedClusters] = useState<string[]>([MOCK_CLUSTERS[0]?.id]);

  const isEdit = !!initialData;

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

  // 计算聚合统计数据
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

  const selectAllInCluster = (e: React.MouseEvent, clusterPools: any[]) => {
    e.stopPropagation();
    const poolIds = clusterPools.map(p => p.id);
    const allSelected = poolIds.every(id => formData.selectedPools.includes(id));
    
    if (allSelected) {
      setFormData(prev => ({
        ...prev,
        selectedPools: prev.selectedPools.filter(id => !poolIds.includes(id))
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        selectedPools: Array.from(new Set([...prev.selectedPools, ...poolIds]))
      }));
    }
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.id || formData.selectedPools.length === 0) return;
    onClose();
  };

  const MiniQuotaItem = ({ label, value, unit, color, icon: Icon }: any) => (
    <div className="flex flex-col gap-1 px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl group hover:border-primary-500/30 transition-all">
       <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
         {Icon && <Icon size={8} />} {label}
       </span>
       <div className="flex items-baseline gap-1">
          <span className={`text-lg font-black font-mono tracking-tighter text-white ${color}`}>{value.toLocaleString()}</span>
          <span className="text-[8px] font-black text-slate-600 uppercase">{unit}</span>
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
          <span className="font-black uppercase tracking-tight text-slate-900">{isEdit ? '编辑租户算力边界' : '开通新组织租户'}</span>
        </div>
      }
      description="CALIBRATING VIRTUAL INFRASTRUCTURE SCOPE"
      width="max-w-4xl"
      footer={
        <div className="flex flex-col w-full gap-4">
           {/* 底部聚合看板 - 增强内容密度 */}
           <div className={`bg-slate-950 rounded-2xl p-5 border border-slate-800 shadow-2xl transition-all duration-500 ${formData.selectedPools.length === 0 ? 'opacity-20 grayscale' : 'scale-100'}`}>
              <div className="flex items-center justify-between mb-4 px-1">
                 <div className="flex items-center gap-2">
                    <Calculator size={14} className="text-primary-500" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">聚合算力与作用域汇总 (SUMMARY)</span>
                 </div>
                 <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-tighter">Live Audit Active</span>
                 </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                 <MiniQuotaItem label="CPU 核心" value={statsSummary.quota.cpu} unit="C" color="group-hover:text-primary-400" />
                 <MiniQuotaItem label="GPU 单元" value={statsSummary.quota.gpu} unit="U" color="group-hover:text-emerald-400" />
                 <MiniQuotaItem label="内存总量" value={statsSummary.quota.mem} unit="G" color="group-hover:text-indigo-400" />
                 <MiniQuotaItem label="存储容量" value={statsSummary.quota.storage} unit="G" color="group-hover:text-amber-400" />
                 {/* 新增指标 */}
                 <MiniQuotaItem label="已选集群" value={statsSummary.clusterCount} unit="Nodes" color="group-hover:text-white" icon={Server} />
                 <MiniQuotaItem label="资源池数" value={statsSummary.poolCount} unit="Pools" color="group-hover:text-white" icon={Layers} />
              </div>
           </div>
           <div className="flex gap-3">
              <button onClick={onClose} className="px-8 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">取消</button>
              <button 
                onClick={handleSubmit}
                disabled={!formData.name || !formData.id || formData.selectedPools.length === 0}
                className="flex-1 py-3 bg-primary-600 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary-700 shadow-xl shadow-primary-500/20 flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-30 disabled:grayscale"
              >
                <Save size={16} strokeWidth={2.5} /> {isEdit ? '提交策略变更' : '确认初始化租户'}
              </button>
           </div>
        </div>
      }
    >
      <div className="space-y-6 animate-in fade-in duration-500 pb-4 font-sans">
         
         {/* 1. Identity Segment */}
         <section className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
               <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                     <Hash size={11} /> 租户唯一标识 (ID)
                  </label>
                  <input 
                    type="text" 
                    value={formData.id}
                    onChange={(e) => setFormData({...formData, id: e.target.value.toLowerCase()})}
                    disabled={isEdit}
                    placeholder="e.g. core-ai-dept"
                    className={`w-full px-4 py-2 bg-white border rounded-xl text-xs font-bold focus:border-primary-500 outline-none transition-all font-mono uppercase tracking-tight ${isEdit ? 'text-slate-400 border-slate-100 cursor-not-allowed' : 'border-slate-200 shadow-sm'}`}
                  />
               </div>
               <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                     <Users size={11} /> 租户显示名称
                  </label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. 核心算法研发部"
                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:border-primary-500 outline-none transition-all shadow-sm"
                  />
               </div>
            </div>
         </section>

         {/* 2. Resource Selection Area */}
         <section className="space-y-4">
            <div className="flex justify-between items-center px-1">
               <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Layers size={14} className="text-primary-500" /> 算力资源池授权绑定
               </h5>
               <div className="flex items-center gap-4">
                 <button 
                  onClick={() => setFormData(prev => ({...prev, selectedPools: []}))}
                  className="text-[9px] font-black text-red-500 uppercase hover:underline flex items-center gap-1.5"
                 >
                   <Trash2 size={10} /> 清空已选
                 </button>
               </div>
            </div>
            
            <div className="space-y-2">
               {groupedPools.map(cluster => {
                  const isOpen = expandedClusters.includes(cluster.id);
                  const clusterPoolIds = cluster.pools.map(p => p.id);
                  const isAllSelected = clusterPoolIds.length > 0 && clusterPoolIds.every(id => formData.selectedPools.includes(id));
                  const selectedInClusterCount = cluster.pools.filter(p => formData.selectedPools.includes(p.id)).length;

                  return (
                    <div key={cluster.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all duration-300">
                      <div 
                        onClick={() => toggleCluster(cluster.id)}
                        className={`px-4 py-3 flex items-center justify-between cursor-pointer transition-colors ${isOpen ? 'bg-slate-50' : 'hover:bg-slate-50/30'}`}
                      >
                         <div className="flex items-center gap-3">
                            <div className={`p-1.5 rounded-lg transition-all ${isOpen ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-400'}`}>
                               <Server size={13} />
                            </div>
                            <div className="flex flex-col">
                               <span className="text-[11px] font-black text-slate-800 uppercase tracking-tight">{cluster.displayName}</span>
                               <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">{cluster.region} · {cluster.id}</span>
                            </div>
                         </div>
                         <div className="flex items-center gap-3">
                            {selectedInClusterCount > 0 && (
                              <Badge status="primary" showDot={false}>{selectedInClusterCount} SELECTED</Badge>
                            )}
                            <button 
                              onClick={(e) => selectAllInCluster(e, cluster.pools)}
                              className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border transition-all ${isAllSelected ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-slate-200 text-slate-500 hover:border-primary-500 hover:text-primary-600'}`}
                            >
                              {isAllSelected ? 'DESELECT' : 'SELECT ALL'}
                            </button>
                            {isOpen ? <ChevronUp size={14} className="text-slate-300" /> : <ChevronDown size={14} className="text-slate-300" />}
                         </div>
                      </div>

                      {isOpen && (
                        <div className="p-3 bg-white border-t border-slate-100 animate-in slide-in-from-top-1 duration-200">
                           <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {cluster.pools.map(pool => {
                                 const isSelected = formData.selectedPools.includes(pool.id);
                                 return (
                                    <div 
                                      key={pool.id}
                                      onClick={() => togglePool(pool.id)}
                                      className={`group relative flex items-center gap-3 px-3 py-2 rounded-xl border transition-all cursor-pointer ${isSelected ? 'bg-primary-50 border-primary-500 shadow-sm' : 'bg-white border-slate-100 hover:border-slate-300'}`}
                                    >
                                       <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-all ${isSelected ? 'bg-primary-600 border-primary-600 shadow-tech' : 'bg-white border-slate-300'}`}>
                                          {isSelected && <Check size={8} className="text-white" strokeWidth={5} />}
                                       </div>
                                       <div className="flex flex-col min-w-0">
                                          <span className={`text-[9px] font-black uppercase truncate ${isSelected ? 'text-primary-900' : 'text-slate-600'}`}>{pool.displayName}</span>
                                          <span className="text-[8px] font-mono font-bold text-slate-400 uppercase tracking-tighter">{pool.quota.gpu}G / {pool.quota.cpu}C</span>
                                       </div>
                                    </div>
                                 );
                              })}
                           </div>
                        </div>
                      )}
                    </div>
                  );
               })}
            </div>
         </section>

         {/* 3. Quick Remove Selected List */}
         {formData.selectedPools.length > 0 && (
           <section className="space-y-3 animate-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center justify-between px-1">
                 <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-emerald-500" /> 已授权资源池明细 (QUICK_REMOVE)
                 </h5>
                 <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Total: {formData.selectedPools.length}</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 border-dashed rounded-2xl p-4 flex flex-wrap gap-2">
                 {formData.selectedPools.map(poolId => {
                    const pool = MOCK_RESOURCE_POOLS.find(p => p.id === poolId);
                    return (
                      <div key={poolId} className="group flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl transition-all hover:border-red-200 hover:bg-red-50/30">
                         <span className="text-[9px] font-black text-slate-700 uppercase tracking-tight">{pool?.displayName}</span>
                         <button 
                            onClick={() => removePool(poolId)}
                            className="p-0.5 rounded-md text-slate-300 hover:text-red-500 hover:bg-white transition-all"
                         >
                            <X size={10} strokeWidth={3} />
                         </button>
                      </div>
                    );
                 })}
              </div>
           </section>
         )}

         {/* 4. Policy Info */}
         <div className="bg-slate-900 rounded-[24px] p-5 border border-slate-800 flex gap-4 relative overflow-hidden group">
            <div className="absolute -right-6 -bottom-6 opacity-[0.03] text-white pointer-events-none group-hover:scale-110 transition-transform">
               <ShieldAlert size={100} />
            </div>
            <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-primary-400 shrink-0 mt-0.5 shadow-inner">
               <ShieldCheck size={20} />
            </div>
            <div className="space-y-1">
               <h6 className="text-[10px] font-black text-white uppercase tracking-widest">算力纳管合规协议 (SECURITY_POLICY)</h6>
               <p className="text-[10px] text-slate-400 leading-relaxed font-medium uppercase tracking-tight">
                  1. 租户配额将由逻辑池严格聚合，禁止手动在 API 层级篡改。
                  <br/>
                  2. 跨集群调度受限于物理网络连通性，请优先选择同地域资源池。
               </p>
            </div>
         </div>
      </div>
    </Drawer>
  );
};
