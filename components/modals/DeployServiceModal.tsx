
import React, { useState, useEffect, useMemo } from 'react';
import { Drawer } from '../ui/Drawer';
import { 
  Rocket, Server, Box, Cpu, Zap, 
  Database, Save, ChevronRight, CheckCircle2, 
  ShieldCheck, Globe, Settings, Terminal,
  Info, Activity, Gauge, ChevronDown, 
  Code, Command, List, Plus, Trash2, 
  Layers, HardDrive, ShieldAlert, Binary,
  Fingerprint, FlaskConical, MousePointer2
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { RESOURCE_BUNDLES, MOCK_USER_MODELS, MOCK_PRETRAINED_MODELS } from '../../constants';

interface EnvVar {
  key: string;
  value: string;
}

interface DeployServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourceModel?: any; 
}

const BASE_IMAGES = [
  { id: 'vllm', name: 'vLLM Runtime', version: 'v0.4.2', tag: 'ai-nex/vllm:0.4.2-cuda12.1' },
  { id: 'triton', name: 'NVIDIA Triton', version: '23.12', tag: 'ai-nex/triton:23.12-py3' },
  { id: 'tgi', name: 'Text Gen Inference', version: '2.0.1', tag: 'ai-nex/tgi:2.0.1' },
  { id: 'custom', name: '自定义镜像 (Custom)', version: '-', tag: '' }
];

export const DeployServiceModal: React.FC<DeployServiceModalProps> = ({ isOpen, onClose, sourceModel }) => {
  const [step, setStep] = useState(1);
  const [isManual, setIsManual] = useState(false);
  const [envVars, setEnvVars] = useState<EnvVar[]>([{ key: 'HF_ENDPOINT', value: 'https://hf-mirror.com' }]);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    baseImage: BASE_IMAGES[0].tag,
    modelSource: 'internal' as 'internal' | 'hub',
    modelId: '',
    version: '',
    modelPath: '',
    startupCommand: 'python -m vllm.entrypoints.openai.api_server --model /mnt/model',
    basePath: '/v1',
    healthPath: '/healthz',
    bundle: 'standard',
    replicas: 2,
    port: 'Auto-assigned (8000)',
    manual: {
      gpu: 1,
      cpu: 8,
      memory: 32,
      storage: 500
    }
  });

  // 处理跳转逻辑
  useEffect(() => {
    if (sourceModel && isOpen) {
      setFormData(prev => ({
        ...prev,
        name: `${sourceModel.name.toLowerCase()}-svc`,
        modelId: sourceModel.id,
        version: sourceModel.latestVersion || (sourceModel.versions ? sourceModel.versions[0].version : ''),
        modelSource: sourceModel.provider ? 'hub' : 'internal',
        modelPath: `/mnt/models/${sourceModel.name.toLowerCase()}`
      }));
      setStep(1); 
    }
  }, [sourceModel, isOpen]);

  const allModels = [...MOCK_USER_MODELS, ...MOCK_PRETRAINED_MODELS];
  const selectedModelData = allModels.find(m => m.id === formData.modelId);

  // 环境变量操作
  const addEnvVar = () => setEnvVars([...envVars, { key: '', value: '' }]);
  const removeEnvVar = (index: number) => setEnvVars(envVars.filter((_, i) => i !== index));
  const updateEnvVar = (index: number, field: keyof EnvVar, val: string) => {
    const next = [...envVars];
    next[index][field] = val;
    setEnvVars(next);
  };

  const steps = [
    { id: 1, label: '环境定义' },
    { id: 2, label: '模型资产' },
    { id: 3, label: '运行接口' },
    { id: 4, label: '算力编排' }
  ];

  const handleNext = () => setStep(s => s + 1);
  const handlePrev = () => setStep(s => s - 1);

  const handleSubmit = () => {
    console.log('Final Deployment Manifest:', { ...formData, envVars });
    onClose();
  };

  const ResourceSlider = ({ label, icon: Icon, value, unit, min, max, onChange, color }: any) => (
    <div className="space-y-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
       <div className="flex justify-between items-center">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
             <Icon size={12} className={color} /> {label}
          </span>
          <div className="flex items-center gap-2">
             <span className="text-sm font-black font-mono text-slate-900">{value}</span>
             <span className="text-[9px] font-black text-slate-400 uppercase">{unit}</span>
          </div>
       </div>
       <input 
          type="range" 
          min={min} 
          max={max} 
          value={value} 
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full h-1.5 bg-slate-200 rounded-full appearance-none accent-primary-600 cursor-pointer" 
       />
       <div className="flex justify-between text-[8px] font-black text-slate-300 uppercase tracking-tighter">
          <span>MIN: {min}{unit}</span>
          <span>QUOTA_MAX: {max}{unit}</span>
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
            <Rocket size={16} strokeWidth={2.5} />
          </div>
          <span className="font-black uppercase tracking-tight text-slate-900">发布在线推理服务</span>
        </div>
      }
      description="CONFIGURING HIGH-AVAILABILITY PRODUCTION ENDPOINTS"
      width="max-w-3xl"
      footer={
        <div className="flex justify-between w-full">
           <button disabled={step === 1} onClick={handlePrev} className="px-8 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 disabled:opacity-30 transition-all">PREVIOUS</button>
           {step < 4 ? (
             <button onClick={handleNext} disabled={step === 1 && !formData.name} className="px-10 py-2.5 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-600 flex items-center gap-2 shadow-xl active:scale-95 transition-all">CONTINUE <ChevronRight size={14} strokeWidth={3} /></button>
           ) : (
             <button onClick={handleSubmit} className="px-12 py-2.5 bg-primary-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-700 flex items-center gap-2 shadow-2xl shadow-primary-500/30 active:scale-95 transition-all">CONFIRM & DEPLOY <Rocket size={14} /></button>
           )}
        </div>
      }
    >
      <div className="flex items-center justify-between mb-10 px-4 relative">
         {steps.map((s) => (
           <div key={s.id} className="flex flex-col items-center relative z-10">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black transition-all duration-500 border-2 ${step === s.id ? 'bg-primary-600 border-primary-600 text-white shadow-xl scale-110' : step > s.id ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-slate-200 text-slate-400'}`}>{step > s.id ? <CheckCircle2 size={18} strokeWidth={3} /> : s.id}</div>
              <span className={`text-[9px] font-black uppercase tracking-widest mt-3 ${step === s.id ? 'text-primary-600' : 'text-slate-400'}`}>{s.label}</span>
           </div>
         ))}
         <div className="absolute top-[18px] left-10 right-10 h-0.5 bg-slate-100 -z-0"></div>
         <div className="absolute top-[18px] left-10 h-0.5 bg-primary-500 -z-0 transition-all duration-700" style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}></div>
      </div>

      <div className="min-h-[520px]">
        {/* Step 1: Identity & Environment */}
        {step === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
             <div className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">服务显示名称 (SERVICE_NAME) <span className="text-red-500">*</span></label>
                   <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. llama3-70b-customer-api" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold focus:bg-white focus:border-primary-500 outline-none transition-all font-mono" />
                </div>
                
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">官方基础镜像 (BASE_IMAGE)</label>
                   <div className="grid grid-cols-1 gap-3">
                      {BASE_IMAGES.map(img => (
                        <button key={img.id} onClick={() => setFormData({...formData, baseImage: img.tag})} className={`group flex items-center justify-between p-4 rounded-2xl border transition-all ${formData.baseImage === img.tag ? 'bg-primary-50 border-primary-500 shadow-md' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
                           <div className="flex items-center gap-4">
                              <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${formData.baseImage === img.tag ? 'bg-primary-600 text-white' : 'bg-slate-50 text-slate-400 group-hover:text-primary-600'}`}><Database size={18} /></div>
                              <div className="text-left"><p className="text-xs font-black text-slate-900 uppercase">{img.name}</p><p className="text-[9px] font-mono font-bold text-slate-400 mt-1">{img.tag || '手工输入镜像地址...'}</p></div>
                           </div>
                           {formData.baseImage === img.tag && <CheckCircle2 size={16} className="text-primary-600" />}
                        </button>
                      ))}
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">业务背景描述</label>
                   <textarea rows={2} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="描述该推理服务的生产用途..." className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:bg-white focus:border-primary-500 outline-none transition-all resize-none" />
                </div>
             </div>
          </div>
        )}

        {/* Step 2: Model Asset Mapping */}
        {step === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
             <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
                <button onClick={() => setFormData({...formData, modelSource: 'internal'})} className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.modelSource === 'internal' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-400'}`}>自研模型资产</button>
                <button onClick={() => setFormData({...formData, modelSource: 'hub'})} className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.modelSource === 'hub' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-400'}`}>预训练模型广场</button>
             </div>

             <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">选择目标模型 (REGISTRY)</label>
                <div className="grid grid-cols-1 gap-3 max-h-[260px] overflow-y-auto pr-2 scrollbar-thin">
                   {(formData.modelSource === 'internal' ? MOCK_USER_MODELS : MOCK_PRETRAINED_MODELS).map(model => (
                      <button 
                        key={model.id}
                        onClick={() => setFormData({...formData, modelId: model.id, version: model.latestVersion || (model.versions ? model.versions[0].version : ''), modelPath: `/mnt/models/${model.name.toLowerCase()}`})}
                        className={`group flex items-center justify-between p-4 rounded-2xl border transition-all ${formData.modelId === model.id ? 'bg-primary-50 border-primary-500 shadow-md' : 'bg-white border-slate-200 hover:border-primary-200'}`}
                      >
                         <div className="flex items-center gap-4">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${formData.modelId === model.id ? 'bg-primary-600 text-white' : 'bg-slate-50 text-slate-400 group-hover:text-primary-600'}`}><Box size={18} /></div>
                            <div className="text-left"><p className="text-xs font-black text-slate-900 uppercase tracking-tight">{model.displayName || model.name}</p><p className="text-[9px] font-mono font-bold text-slate-400 mt-1 uppercase">ARCH: {model.framework || 'Transformer'}</p></div>
                         </div>
                         {formData.modelId === model.id && <Badge status="success">MAPPED</Badge>}
                      </button>
                   ))}
                </div>
             </div>

             {selectedModelData && (
                <div className="bg-slate-950 rounded-[32px] p-7 border border-slate-800 space-y-6 relative overflow-hidden">
                   <div className="absolute inset-0 tech-grid opacity-[0.03] pointer-events-none"></div>
                   <div className="grid grid-cols-2 gap-6 relative z-10">
                      <div className="space-y-2">
                         <span className="text-[9px] text-slate-500 uppercase font-black ml-1">指定模型版本</span>
                         <div className="relative group">
                            <select value={formData.version} onChange={(e) => setFormData({...formData, version: e.target.value})} className="w-full pl-4 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-mono font-bold appearance-none cursor-pointer focus:border-primary-500 outline-none transition-all">
                               {('versions' in selectedModelData && (selectedModelData as any).versions) ? (selectedModelData as any).versions.map((v: any) => <option key={v.version} value={v.version} className="bg-slate-900">{v.version} {v.status === 'stable' ? '(STABLE)' : ''}</option>) : <option value={selectedModelData.latestVersion}>{selectedModelData.latestVersion} (LATEST)</option>}
                            </select>
                            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" />
                         </div>
                      </div>
                      <div className="space-y-2">
                         <span className="text-[9px] text-slate-500 uppercase font-black ml-1">容器内挂载路径</span>
                         <input type="text" value={formData.modelPath} onChange={(e) => setFormData({...formData, modelPath: e.target.value})} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-primary-400 text-xs font-mono font-bold outline-none" />
                      </div>
                   </div>
                </div>
             )}
          </div>
        )}

        {/* Step 3: Runtime & Interface */}
        {step === 3 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
             <div className="space-y-5">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">启动命令 (STARTUP_COMMAND) <span className="text-red-500">*</span></label>
                   <div className="relative group">
                      <Terminal size={14} className="absolute left-4 top-4 text-slate-400" />
                      <textarea rows={2} value={formData.startupCommand} onChange={(e) => setFormData({...formData, startupCommand: e.target.value})} className="w-full pl-11 pr-4 py-3.5 bg-slate-900 border border-slate-800 rounded-2xl text-xs font-mono font-bold text-emerald-500 focus:border-primary-500 outline-none transition-all" />
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">服务端口 (SYSTEM_ASSIGNED)</label>
                      <div className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-400">{formData.port}</div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">基础路径 (BASE_PATH) <Command size={10}/></label>
                      <div className="relative">
                         <input type="text" value={formData.basePath} onChange={(e) => setFormData({...formData, basePath: e.target.value})} placeholder="/v1" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold focus:border-primary-500 outline-none" />
                         <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                            <button onClick={() => setFormData({...formData, basePath: '/v1'})} className="text-[8px] font-black bg-slate-100 px-1.5 py-0.5 rounded hover:bg-primary-500 hover:text-white transition-colors">V1</button>
                            <button onClick={() => setFormData({...formData, basePath: '/v1/chat/completions'})} className="text-[8px] font-black bg-slate-100 px-1.5 py-0.5 rounded hover:bg-primary-500 hover:text-white transition-colors">OpenAI</button>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">健康检查路径 (HEALTH_PATH)</label>
                   <div className="relative group">
                      <Activity size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="text" value={formData.healthPath} onChange={(e) => setFormData({...formData, healthPath: e.target.value})} className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold focus:border-primary-500 outline-none" />
                   </div>
                </div>

                <div className="space-y-4">
                   <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">环境变量 (ENVIRONMENT_VARIABLES)</label>
                      <button onClick={addEnvVar} className="text-[9px] font-black text-primary-600 uppercase flex items-center gap-1.5 hover:text-primary-700"><Plus size={12}/> 添加变量</button>
                   </div>
                   <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1 scrollbar-thin">
                      {envVars.map((env, idx) => (
                        <div key={idx} className="flex gap-2 group animate-in slide-in-from-left-2 duration-300">
                           <input value={env.key} onChange={(e) => updateEnvVar(idx, 'key', e.target.value)} placeholder="KEY" className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-mono font-black uppercase outline-none focus:bg-white focus:border-primary-500" />
                           <input value={env.value} onChange={(e) => updateEnvVar(idx, 'value', e.target.value)} placeholder="VALUE" className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-mono font-bold outline-none focus:bg-white focus:border-primary-500" />
                           <button onClick={() => removeEnvVar(idx)} className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={14}/></button>
                        </div>
                      ))}
                      {envVars.length === 0 && <div className="py-4 text-center text-[9px] text-slate-300 font-black uppercase border-2 border-dashed border-slate-100 rounded-2xl">无自定义环境变量</div>}
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* Step 4: Compute & Orchestration */}
        {step === 4 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
             <div className="flex justify-between items-end px-1">
                <div className="space-y-1">
                   <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">算力配置规格 (COMPUTE_SPEC)</h4>
                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Define hardware constraints for inference units</p>
                </div>
                <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                   <button onClick={() => setIsManual(false)} className={`px-4 py-1.5 text-[9px] font-black rounded-lg transition-all ${!isManual ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-400'}`}>资源套件</button>
                   <button onClick={() => setIsManual(true)} className={`px-4 py-1.5 text-[9px] font-black rounded-lg transition-all ${isManual ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-400'}`}>手动配置</button>
                </div>
             </div>

             {!isManual ? (
               <div className="grid grid-cols-1 gap-4">
                  {Object.values(RESOURCE_BUNDLES).map((bundle: any) => (
                    <button key={bundle.id} onClick={() => setFormData({...formData, bundle: bundle.id})} className={`group relative p-6 rounded-[32px] border transition-all text-left ${formData.bundle === bundle.id ? 'bg-slate-950 border-slate-900 shadow-2xl scale-[1.02]' : 'bg-white border-slate-200 hover:border-primary-400'}`}>
                       <div className="flex justify-between items-start mb-4">
                          <div className={`p-2.5 rounded-xl ${formData.bundle === bundle.id ? 'bg-primary-600 text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600'}`}><Zap size={20} /></div>
                          {formData.bundle === bundle.id && <Badge status="success" showDot={false}>OPTIMIZED</Badge>}
                       </div>
                       <h5 className={`text-sm font-black uppercase tracking-tight ${formData.bundle === bundle.id ? 'text-white' : 'text-slate-900'}`}>{bundle.name}</h5>
                       <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/5">
                          <div className="space-y-1"><p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">GPU</p><p className={`text-[10px] font-bold font-mono ${formData.bundle === bundle.id ? 'text-white' : 'text-slate-800'}`}>{bundle.gpu}</p></div>
                          <div className="space-y-1"><p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">CPU</p><p className={`text-[10px] font-bold font-mono ${formData.bundle === bundle.id ? 'text-white' : 'text-slate-800'}`}>{bundle.cpu}核</p></div>
                          <div className="space-y-1"><p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">MEMORY</p><p className={`text-[10px] font-bold font-mono ${formData.bundle === bundle.id ? 'text-white' : 'text-slate-800'}`}>{bundle.memory}GB</p></div>
                          <div className="space-y-1"><p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">STORAGE</p><p className={`text-[10px] font-bold font-mono ${formData.bundle === bundle.id ? 'text-white' : 'text-slate-800'}`}>{bundle.storage}GB</p></div>
                       </div>
                    </button>
                  ))}
               </div>
             ) : (
               <div className="bg-white border border-slate-200 rounded-[32px] p-8 space-y-8 shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <ResourceSlider 
                        label="GPU 加速单元 (Cards)" icon={Zap} color="text-emerald-500"
                        value={formData.manual.gpu} min={0} max={8} unit="U"
                        onChange={(v: number) => setFormData({...formData, manual: {...formData.manual, gpu: v}})} 
                     />
                     <ResourceSlider 
                        label="CPU 核心 (Cores)" icon={Cpu} color="text-primary-500"
                        value={formData.manual.cpu} min={1} max={64} unit="C"
                        onChange={(v: number) => setFormData({...formData, manual: {...formData.manual, cpu: v}})} 
                     />
                     <ResourceSlider 
                        label="内存总量 (RAM)" icon={Activity} color="text-indigo-500"
                        value={formData.manual.memory} min={4} max={512} unit="GB"
                        onChange={(v: number) => setFormData({...formData, manual: {...formData.manual, memory: v}})} 
                     />
                     <ResourceSlider 
                        label="存储容量 (Disk)" icon={HardDrive} color="text-amber-500"
                        value={formData.manual.storage} min={20} max={2048} unit="GB"
                        onChange={(v: number) => setFormData({...formData, manual: {...formData.manual, storage: v}})} 
                     />
                  </div>
               </div>
             )}

             <div className="pt-6 border-t border-slate-100 space-y-4">
                <div className="flex justify-between items-center px-1">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Layers size={14} className="text-primary-500" /> 部署副本数量 (REPLICA_COUNT)</label>
                   <span className="text-xl font-black font-mono text-primary-600">{formData.replicas} Pods</span>
                </div>
                <input type="range" min="1" max="10" value={formData.replicas} onChange={(e) => setFormData({...formData, replicas: parseInt(e.target.value)})} className="w-full h-2 bg-slate-200 rounded-full appearance-none accent-primary-600 cursor-pointer" />
                <div className="flex justify-between text-[8px] font-black text-slate-300 uppercase tracking-[0.2em] px-1">
                   <span>MIN_INSTANCES: 1</span>
                   <span>MAX_HA_AUTO_SCALE: 20</span>
                </div>
             </div>

             <div className="p-6 bg-emerald-50/50 border border-emerald-100 rounded-[32px] flex gap-5">
                <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0"><ShieldCheck size={24} /></div>
                <div className="space-y-1">
                   <h4 className="text-[11px] font-black text-emerald-900 uppercase tracking-widest">PRE-DEPLOYMENT VALIDATION PASSED</h4>
                   <p className="text-[10px] text-emerald-700 font-bold leading-relaxed uppercase tracking-tighter">该服务将部署在 SZX-PROD-01 核心集群，并自动启用全天候流量熔断与 QPS 动态观测。</p>
                </div>
             </div>
          </div>
        )}
      </div>
    </Drawer>
  );
};
