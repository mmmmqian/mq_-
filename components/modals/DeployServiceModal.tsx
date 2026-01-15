
import React, { useState, useEffect } from 'react';
import { Drawer } from '../ui/Drawer';
import { 
  Rocket, Server, Box, Cpu, Zap, 
  Database, Save, ChevronRight, CheckCircle2, 
  ShieldCheck, Globe, Settings, Terminal,
  Info, Activity, Gauge
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { IDE_RESOURCE_BUNDLES, MOCK_USER_MODELS, MOCK_PRETRAINED_MODELS } from '../../constants';

interface DeployServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourceModel?: any; // 从模型管理/广场跳转时带入
}

export const DeployServiceModal: React.FC<DeployServiceModalProps> = ({ isOpen, onClose, sourceModel }) => {
  const [step, setStep] = useState(1);
  const [isManual, setIsManual] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    modelSource: 'internal' as 'internal' | 'hub',
    modelId: '',
    version: '',
    bundle: 'standard',
    protocol: 'HTTP',
    manual: { cpu: 4, mem: 16, gpu: 1, replicas: 2 }
  });

  // 处理跨模块跳转的数据填充
  useEffect(() => {
    if (sourceModel && isOpen) {
      setFormData(prev => ({
        ...prev,
        name: `${sourceModel.name.toLowerCase()}-svc`,
        modelId: sourceModel.id,
        version: sourceModel.latestVersion || (sourceModel.versions ? sourceModel.versions[0].version : ''),
        modelSource: sourceModel.provider ? 'hub' : 'internal'
      }));
      setStep(1); // 默认跳过模型选择？不，还是让用户确认
    }
  }, [sourceModel, isOpen]);

  const allModels = [...MOCK_USER_MODELS, ...MOCK_PRETRAINED_MODELS];
  const selectedModelData = allModels.find(m => m.id === formData.modelId);

  const steps = [
    { id: 1, label: '服务定义' },
    { id: 2, label: '模型映射' },
    { id: 3, label: '算力编排' },
    { id: 4, label: '访问策略' }
  ];

  const handleNext = () => setStep(s => s + 1);
  const handlePrev = () => setStep(s => s - 1);

  const handleSubmit = () => {
    console.log('Deploying Inference Service:', formData);
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Rocket size={20} className="text-primary-600" />
          <span className="font-black uppercase tracking-tight">部署在线推理服务</span>
        </div>
      }
      description="Provisioning high-availability inference endpoints"
      width="max-w-3xl"
      footer={
        <div className="flex justify-between w-full">
           <button 
             disabled={step === 1}
             onClick={handlePrev}
             className="px-8 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 disabled:opacity-30 transition-all"
           >
             PREVIOUS
           </button>
           {step < 4 ? (
             <button 
               onClick={handleNext}
               disabled={step === 1 && !formData.name}
               className="px-10 py-2.5 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-600 flex items-center gap-2 shadow-xl active:scale-95 transition-all"
             >
               CONTINUE <ChevronRight size={14} strokeWidth={3} />
             </button>
           ) : (
             <button 
               onClick={handleSubmit}
               className="px-12 py-2.5 bg-primary-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-700 flex items-center gap-2 shadow-2xl shadow-primary-500/30 active:scale-95 transition-all"
             >
               CONFIRM DEPLOYMENT <Rocket size={14} />
             </button>
           )}
        </div>
      }
    >
      {/* Step Indicator */}
      <div className="flex items-center justify-between mb-10 px-4 relative">
         {steps.map((s) => (
           <div key={s.id} className="flex flex-col items-center relative z-10">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black transition-all duration-500 border-2 ${
                step === s.id ? 'bg-primary-600 border-primary-600 text-white shadow-xl shadow-primary-500/30 scale-110' :
                step > s.id ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-slate-200 text-slate-400'
              }`}>
                 {step > s.id ? <CheckCircle2 size={18} strokeWidth={3} /> : s.id}
              </div>
              <span className={`text-[9px] font-black uppercase tracking-widest mt-3 ${step === s.id ? 'text-primary-600' : 'text-slate-400'}`}>
                 {s.label}
              </span>
           </div>
         ))}
         <div className="absolute top-[18px] left-10 right-10 h-0.5 bg-slate-100 -z-0"></div>
         <div 
           className="absolute top-[18px] left-10 h-0.5 bg-primary-500 -z-0 transition-all duration-700"
           style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
         ></div>
      </div>

      <div className="min-h-[480px]">
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
             <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 flex gap-4">
                <Info size={20} className="text-primary-500 shrink-0 mt-1" />
                <p className="text-[11px] font-bold text-slate-500 leading-relaxed uppercase tracking-tight">
                  在线服务提供持久化的 API Endpoints。部署完成后，系统将自动进行健康拨测并挂载至全局负载均衡器。
                </p>
             </div>
             <div className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Service Identifier <span className="text-red-500">*</span></label>
                   <input 
                     type="text" 
                     value={formData.name}
                     onChange={(e) => setFormData({...formData, name: e.target.value})}
                     placeholder="e.g. customer-service-v1"
                     className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold focus:bg-white focus:border-primary-500 outline-none transition-all"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Description (Intent)</label>
                   <textarea 
                     rows={3}
                     value={formData.description}
                     onChange={(e) => setFormData({...formData, description: e.target.value})}
                     placeholder="Describe the production use case..."
                     className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:bg-white focus:border-primary-500 outline-none transition-all resize-none"
                   />
                </div>
             </div>
          </div>
        )}

        {/* Step 2: Model Mapping */}
        {step === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
             <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner">
                <button onClick={() => setFormData({...formData, modelSource: 'internal'})} className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.modelSource === 'internal' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-400'}`}>自研模型资产</button>
                <button onClick={() => setFormData({...formData, modelSource: 'hub'})} className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.modelSource === 'hub' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-400'}`}>预训练模型广场</button>
             </div>

             <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Select Model Registry</label>
                <div className="grid grid-cols-1 gap-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
                   {(formData.modelSource === 'internal' ? MOCK_USER_MODELS : MOCK_PRETRAINED_MODELS).map(model => (
                      <button 
                        key={model.id}
                        onClick={() => setFormData({...formData, modelId: model.id, version: model.latestVersion || ''})}
                        className={`group flex items-center justify-between p-4 rounded-2xl border transition-all ${formData.modelId === model.id ? 'bg-primary-50 border-primary-500 shadow-md' : 'bg-white border-slate-200 hover:border-primary-200'}`}
                      >
                         <div className="flex items-center gap-4">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${formData.modelId === model.id ? 'bg-primary-600 text-white' : 'bg-slate-50 text-slate-400 group-hover:text-primary-600'}`}>
                               <Box size={18} />
                            </div>
                            <div className="text-left">
                               <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{model.displayName || model.name}</p>
                               <p className="text-[9px] font-mono font-bold text-slate-400 mt-1 uppercase">ID: {model.id}</p>
                            </div>
                         </div>
                         {formData.modelId === model.id && <Badge status="success">MAPPED</Badge>}
                      </button>
                   ))}
                </div>
             </div>

             {selectedModelData && (
                <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 animate-in slide-in-from-top-2">
                   <h5 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4">Version & Metadata Binding</h5>
                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <span className="text-[9px] text-slate-400 uppercase font-black">Target Version</span>
                         <div className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-mono font-bold flex items-center justify-between">
                            {formData.version}
                            <Settings size={12} className="text-slate-500" />
                         </div>
                      </div>
                      <div className="space-y-2">
                         <span className="text-[9px] text-slate-400 uppercase font-black">Base Image</span>
                         <div className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-slate-400 text-xs font-mono truncate">
                            {selectedModelData.framework || 'standard-inference-v2'}
                         </div>
                      </div>
                   </div>
                </div>
             )}
          </div>
        )}

        {/* Step 3: Compute Orchestration */}
        {step === 3 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
             <div className="flex justify-between items-end px-1">
                <div className="space-y-1">
                   <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Compute Resource Spec</h4>
                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Define hardware constraints for inference units</p>
                </div>
                <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                   <button onClick={() => setIsManual(false)} className={`px-4 py-1.5 text-[9px] font-black rounded-lg transition-all ${!isManual ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-400'}`}>BUNDLES</button>
                   <button onClick={() => setIsManual(true)} className={`px-4 py-1.5 text-[9px] font-black rounded-lg transition-all ${isManual ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-400'}`}>MANUAL</button>
                </div>
             </div>

             {!isManual ? (
               <div className="grid grid-cols-1 gap-4">
                  {Object.values(IDE_RESOURCE_BUNDLES).map((bundle: any) => (
                    <button 
                      key={bundle.id}
                      onClick={() => setFormData({...formData, bundle: bundle.id})}
                      className={`group p-6 rounded-[28px] border transition-all text-left ${formData.bundle === bundle.id ? 'bg-slate-950 border-slate-900 shadow-2xl scale-[1.02]' : 'bg-white border-slate-200 hover:border-primary-400'}`}
                    >
                       <div className="flex justify-between items-start mb-6">
                          <div className={`p-2.5 rounded-xl ${formData.bundle === bundle.id ? 'bg-primary-600 text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600'}`}>
                             <Zap size={20} />
                          </div>
                       </div>
                       <h5 className={`text-sm font-black uppercase tracking-tight ${formData.bundle === bundle.id ? 'text-white' : 'text-slate-900'}`}>{bundle.name}</h5>
                       <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/5">
                          <div className="space-y-1">
                             <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">GPU</p>
                             <p className={`text-[10px] font-bold ${formData.bundle === bundle.id ? 'text-white' : 'text-slate-800'}`}>{bundle.gpu}</p>
                          </div>
                          <div className="space-y-1">
                             <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">CPU</p>
                             <p className={`text-[10px] font-bold ${formData.bundle === bundle.id ? 'text-white' : 'text-slate-800'}`}>{bundle.cpu}C</p>
                          </div>
                          <div className="space-y-1">
                             <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">REPLICAS</p>
                             <p className={`text-[10px] font-bold ${formData.bundle === bundle.id ? 'text-white' : 'text-slate-800'}`}>2 Instances</p>
                          </div>
                       </div>
                    </button>
                  ))}
               </div>
             ) : (
               <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-8 shadow-sm">
                  <div className="space-y-4">
                     <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Gauge size={14}/> Replica Multiplier</span>
                        <span className="text-sm font-black font-mono text-primary-600">{formData.manual.replicas} Pods</span>
                     </div>
                     <input type="range" min="1" max="10" value={formData.manual.replicas} onChange={(e)=>setFormData({...formData, manual: {...formData.manual, replicas: parseInt(e.target.value)}})} className="w-full h-1.5 bg-slate-100 rounded-full appearance-none accent-primary-600" />
                  </div>
                  <div className="space-y-4">
                     <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Zap size={14}/> GPU Requirement</span>
                        <span className="text-sm font-black font-mono text-primary-600">{formData.manual.gpu} Cards</span>
                     </div>
                     <input type="range" min="0" max="8" value={formData.manual.gpu} onChange={(e)=>setFormData({...formData, manual: {...formData.manual, gpu: parseInt(e.target.value)}})} className="w-full h-1.5 bg-slate-100 rounded-full appearance-none accent-primary-600" />
                  </div>
               </div>
             )}
          </div>
        )}

        {/* Step 4: Access Policy */}
        {step === 4 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
             <div className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Protocol Layer</label>
                   <div className="flex gap-4">
                      {['HTTP', 'gRPC'].map(p => (
                        <button 
                          key={p} 
                          onClick={() => setFormData({...formData, protocol: p})}
                          className={`flex-1 py-4 rounded-2xl border font-black text-[11px] transition-all ${formData.protocol === p ? 'bg-primary-600 text-white border-primary-600 shadow-xl shadow-primary-500/20' : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'}`}
                        >
                          {p} JSON / REST
                        </button>
                      ))}
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Auto-Generated Endpoint</label>
                   <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex items-center justify-between group">
                      <span className="font-mono text-xs text-slate-500 truncate">https://{formData.name || 'service'}.api.ai-nex.io/predict</span>
                      <ShieldCheck size={16} className="text-emerald-500 opacity-40 group-hover:opacity-100 transition-opacity" />
                   </div>
                </div>

                <div className="p-6 bg-emerald-50/50 border border-emerald-100 rounded-3xl flex gap-4">
                   <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shrink-0">
                      <ShieldCheck size={20} />
                   </div>
                   <div>
                      <h4 className="text-[11px] font-black text-emerald-800 uppercase tracking-widest">Ready for Deployment</h4>
                      <p className="text-[10px] text-emerald-600 font-bold mt-1 leading-relaxed">
                        您的服务将被部署至 SZX-PROD-01 生产集群，配备全天候熔断保护与自动扩容机制。
                      </p>
                   </div>
                </div>
             </div>
          </div>
        )}
      </div>
    </Drawer>
  );
};
