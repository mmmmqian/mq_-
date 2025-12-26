
import React, { useState, useEffect } from 'react';
import { Drawer } from '../ui/Drawer';
import { Layers, Server, Cpu, Database, Save, CheckCircle2, ChevronRight, AlertCircle, Power, ShieldAlert } from 'lucide-react';
import { MOCK_CLUSTERS, MOCK_NODE_DETAILS } from '../../constants';

interface ManageResourcePoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any; // If present, it's edit mode
}

export const ManageResourcePoolModal: React.FC<ManageResourcePoolModalProps> = ({ isOpen, onClose, initialData }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    description: '',
    status: 'active' as 'active' | 'disabled',
    clusterId: '',
    nodeSelector: [] as string[],
    quota: {
      cpu: 100,
      memory: 256,
      gpu: 0,
      storage: 1000
    }
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        displayName: initialData.displayName,
        description: initialData.description || '',
        status: initialData.status || 'active',
        clusterId: initialData.clusterId,
        nodeSelector: initialData.nodeSelector || [],
        quota: initialData.quota
      });
    } else {
        // Reset form on open
        setFormData({
            name: '',
            displayName: '',
            description: '',
            status: 'active',
            clusterId: '',
            nodeSelector: [],
            quota: { cpu: 100, memory: 256, gpu: 0, storage: 1000 }
        });
        setStep(1);
    }
  }, [isOpen, initialData]);

  const handleClusterSelect = (clusterId: string) => {
    if (formData.clusterId !== clusterId) {
        setFormData(prev => ({ ...prev, clusterId, nodeSelector: [] }));
    }
  };

  const toggleNode = (nodeName: string) => {
    setFormData(prev => {
        const newSelector = prev.nodeSelector.includes(nodeName)
            ? prev.nodeSelector.filter(n => n !== nodeName)
            : [...prev.nodeSelector, nodeName];
        return { ...prev, nodeSelector: newSelector };
    });
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between mb-8 px-4">
        {[
            { id: 1, label: '基础信息' },
            { id: 2, label: '选择集群 & 节点' },
            { id: 3, label: '配额设置' }
        ].map((s, idx) => (
            <div key={s.id} className="flex flex-col items-center relative z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-2 transition-colors duration-300 ${
                    step === s.id ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' :
                    step > s.id ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                    {step > s.id ? <CheckCircle2 size={16} /> : s.id}
                </div>
                <span className={`text-[10px] font-medium ${step === s.id ? 'text-primary-700' : 'text-slate-500'}`}>
                    {s.label}
                </span>
            </div>
        ))}
        {/* Progress Bar Background */}
        <div className="absolute top-9 left-10 right-10 h-0.5 bg-slate-100 -z-0"></div>
        {/* Active Progress */}
        <div 
            className="absolute top-9 left-10 h-0.5 bg-primary-500 -z-0 transition-all duration-300"
            style={{ width: `${((step - 1) / 2) * 80}%` }}
        ></div>
    </div>
  );

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Layers size={20} className="text-primary-600" />
          <span className="font-black uppercase tracking-tight">{initialData ? '编辑资源池' : '创建资源池'}</span>
        </div>
      }
      description={initialData ? `INSTANCE ID: ${initialData.id}` : "定义并隔离集群逻辑计算资源"}
      width="max-w-2xl"
      footer={
        <div className="flex justify-between w-full">
            <button 
                disabled={step === 1}
                onClick={() => setStep(s => s - 1)}
                className="px-6 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                上一步
            </button>
            {step < 3 ? (
                <button 
                    onClick={() => setStep(s => s + 1)}
                    disabled={(step === 1 && !formData.name) || (step === 2 && (formData.nodeSelector.length === 0))}
                    className="px-6 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-600 flex items-center gap-2 shadow-xl shadow-slate-900/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                >
                    下一步 <ChevronRight size={14} strokeWidth={3} />
                </button>
            ) : (
                <button 
                    onClick={onClose}
                    className="px-6 py-2 bg-primary-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-700 flex items-center gap-2 shadow-xl shadow-primary-500/20 transition-all active:scale-95"
                >
                    <Save size={14} strokeWidth={3} /> {initialData ? '保存修改' : '确认创建'}
                </button>
            )}
        </div>
      }
    >
      {renderStepIndicator()}

      <div className="space-y-6">
        {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5 ml-1">
                            <Layers size={12} /> 资源池标识名 <span className="text-red-500">*</span>
                        </label>
                        <input 
                            type="text" 
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            placeholder="e.g. inference-pool-01"
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all" 
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5 ml-1">
                            <Layers size={12} /> 显示友好名称
                        </label>
                        <input 
                            type="text" 
                            value={formData.displayName}
                            onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                            placeholder="e.g. 大模型推理池"
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all" 
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5 ml-1">
                        描述信息 (METADATA)
                    </label>
                    <textarea 
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        rows={2}
                        placeholder="请输入该资源池的业务背景或资源划分说明..."
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all resize-none" 
                    ></textarea>
                </div>

                {/* 新增的启用/禁用按钮 */}
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5 ml-1">
                        <Power size={12} /> 操作状态管控 (SYSTEM STATUS)
                    </label>
                    <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
                        <button 
                            type="button"
                            onClick={() => setFormData({...formData, status: 'active'})}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${formData.status === 'active' ? 'bg-white text-emerald-600 shadow-lg shadow-emerald-500/10 ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <div className={`w-1.5 h-1.5 rounded-full ${formData.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
                            启用 (ACTIVE)
                        </button>
                        <button 
                            type="button"
                            onClick={() => setFormData({...formData, status: 'disabled'})}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${formData.status === 'disabled' ? 'bg-white text-red-500 shadow-lg shadow-red-500/10 ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <div className={`w-1.5 h-1.5 rounded-full ${formData.status === 'disabled' ? 'bg-red-500 animate-pulse' : 'bg-slate-300'}`}></div>
                            禁用 (DISABLED)
                        </button>
                    </div>
                    <div className={`flex items-start gap-2.5 p-4 rounded-2xl border transition-all duration-500 ${formData.status === 'disabled' ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-100'}`}>
                        <ShieldAlert size={16} className={formData.status === 'disabled' ? 'text-red-500' : 'text-primary-500'} />
                        <p className={`text-[11px] font-bold leading-relaxed ${formData.status === 'disabled' ? 'text-red-700' : 'text-slate-500'}`}>
                            {formData.status === 'disabled' 
                                ? '资源池禁用后，系统将停止向此池调度新任务。已有任务将根据集群驱逐策略进行处理，请谨慎操作。' 
                                : '资源池处于就绪状态，调度器可根据租户配额正常分发工作负载。'}
                        </p>
                    </div>
                </div>
            </div>
        )}

        {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                {/* Cluster Selection */}
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5 ml-1">
                        <Server size={12} /> 目标物理集群映射 <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {MOCK_CLUSTERS.map(cluster => (
                            <div 
                                key={cluster.id}
                                onClick={() => handleClusterSelect(cluster.id)}
                                className={`group p-4 rounded-2xl border transition-all cursor-pointer ${
                                    formData.clusterId === cluster.id 
                                    ? 'bg-primary-50 border-primary-500 ring-4 ring-primary-500/10' 
                                    : 'bg-white border-slate-200 hover:border-primary-300 hover:bg-slate-50/50'
                                }`}
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={`p-1.5 rounded-lg ${formData.clusterId === cluster.id ? 'bg-primary-600 text-white shadow-md' : 'bg-slate-100 text-slate-400 group-hover:text-primary-600 group-hover:bg-primary-50'}`}>
                                        <Server size={16} />
                                    </div>
                                    <span className="text-[13px] font-black text-slate-900 tracking-tight">{cluster.displayName}</span>
                                </div>
                                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-9">{cluster.region} · {cluster.k8sVersion}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Node Selection */}
                {formData.clusterId && (
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5 ml-1">
                            纳管节点阵列 (NODES: {formData.nodeSelector.length}) <span className="text-red-500">*</span>
                        </label>
                        <div className="bg-slate-50/50 rounded-2xl border border-slate-200 overflow-hidden max-h-[300px] overflow-y-auto">
                            {MOCK_NODE_DETAILS[formData.clusterId]?.map(node => (
                                <div 
                                    key={node.name}
                                    onClick={() => toggleNode(node.name)}
                                    className={`flex items-center justify-between px-5 py-4 border-b border-slate-100 last:border-0 cursor-pointer hover:bg-white transition-all group ${
                                        formData.nodeSelector.includes(node.name) ? 'bg-primary-50/20' : ''
                                    }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${
                                            formData.nodeSelector.includes(node.name) 
                                            ? 'bg-primary-600 border-primary-600 shadow-md' 
                                            : 'bg-white border-slate-300 group-hover:border-primary-400'
                                        }`}>
                                            {formData.nodeSelector.includes(node.name) && <CheckCircle2 size={14} className="text-white" />}
                                        </div>
                                        <div>
                                            <div className="text-xs font-mono font-black text-slate-900 tracking-tight">{node.name}</div>
                                            <div className="text-[10px] text-slate-400 font-mono font-bold mt-0.5">{node.ip}</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-[9px] font-black text-slate-500 uppercase tracking-widest">
                                            {node.cpu.total}C / {node.mem.total}G
                                        </span>
                                        {node.gpu && (
                                            <span className="px-2 py-1 bg-emerald-50 border border-emerald-100 rounded-lg text-[9px] font-black text-emerald-700 uppercase tracking-widest">
                                                GPU x{node.gpu.count}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                             {(!MOCK_NODE_DETAILS[formData.clusterId] || MOCK_NODE_DETAILS[formData.clusterId].length === 0) && (
                                <div className="p-10 text-center text-[10px] font-black uppercase tracking-widest text-slate-300">暂无在线物理节点</div>
                             )}
                        </div>
                    </div>
                )}
            </div>
        )}

        {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 flex gap-4 text-slate-300 shadow-xl overflow-hidden relative group">
                    <div className="absolute inset-0 bg-primary-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <AlertCircle size={20} className="text-primary-500 shrink-0 mt-0.5 animate-pulse" />
                    <p className="text-[11px] font-bold leading-relaxed relative z-10">
                        配额限制将应用于此逻辑池的硬件上限。请确保设置合理的资源超卖比（Oversubscription），建议在生产环境保持 1:1 的硬性隔离以确保 SLA。
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5 ml-1">
                            <Cpu size={14} className="text-primary-500"/> CPU 配额 (Cores)
                        </label>
                        <input 
                            type="number" 
                            value={formData.quota.cpu}
                            onChange={(e) => setFormData({...formData, quota: {...formData.quota, cpu: parseInt(e.target.value)}})}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-black focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all" 
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5 ml-1">
                            <Database size={14} className="text-indigo-500"/> 内存配额 (GB)
                        </label>
                        <input 
                            type="number" 
                            value={formData.quota.memory}
                            onChange={(e) => setFormData({...formData, quota: {...formData.quota, memory: parseInt(e.target.value)}})}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-black focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all" 
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5 ml-1">
                            <Layers size={14} className="text-amber-500"/> 存储配额 (GB)
                        </label>
                        <input 
                            type="number" 
                            value={formData.quota.storage}
                            onChange={(e) => setFormData({...formData, quota: {...formData.quota, storage: parseInt(e.target.value)}})}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-black focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all" 
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5 ml-1">
                            <Cpu size={14} className="text-emerald-500"/> GPU 配额 (Units)
                        </label>
                        <input 
                            type="number" 
                            value={formData.quota.gpu}
                            onChange={(e) => setFormData({...formData, quota: {...formData.quota, gpu: parseInt(e.target.value)}})}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-black focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all" 
                        />
                    </div>
                </div>
            </div>
        )}
      </div>
    </Drawer>
  );
};
