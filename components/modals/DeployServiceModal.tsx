
import React, { useState, useEffect, useMemo } from 'react';
import { Drawer } from '../ui/Drawer';
import { 
  Rocket, Server, Box, Cpu, Zap, 
  Database, Save, ChevronRight, CheckCircle2, 
  ShieldCheck, Globe, Settings, Terminal,
  Info, Activity, Gauge, ChevronDown, 
  Code, Command, List, Plus, Trash2, 
  Layers, HardDrive, ShieldAlert, Binary,
  Fingerprint, FlaskConical, MousePointer2, AlertTriangle,
  Monitor, CpuIcon, Search, Link, ActivitySquare,
  FileCode, Sparkles, PlusCircle, X, History,
  FileSearch, Archive, ShieldCheckIcon, Network,
  Lock, Copy, RefreshCw, Brackets, Heart,
  FolderKanban
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { INFERENCE_RESOURCE_BUNDLES, MOCK_USER_MODELS, MOCK_PRETRAINED_MODELS, MOCK_PROJECTS } from '../../constants';

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
  { id: 'vllm', name: 'vLLM Runtime (Official)', version: 'v0.4.2', tag: 'ai-nex/vllm:0.4.2-cuda12.1' },
  { id: 'triton', name: 'NVIDIA Triton (Official)', version: '23.12', tag: 'ai-nex/triton:23.12-py3' },
  { id: 'custom', name: '自定义镜像 (Custom)', version: '-', tag: '' }
];

export const DeployServiceModal: React.FC<DeployServiceModalProps> = ({ isOpen, onClose, sourceModel }) => {
  const [step, setStep] = useState(1);
  const [isManual, setIsManual] = useState(false);
  const [modelSearch, setModelSearch] = useState('');
  const [envVars, setEnvVars] = useState<EnvVar[]>([
    { key: 'HF_ENDPOINT', value: 'https://hf-mirror.com' },
    { key: 'MAX_MODEL_LEN', value: '8192' }
  ]);
  
  const activeProject = MOCK_PROJECTS[0];
  // Standardized to 'memory' to match ProjectQuota interface
  const availableResources = {
    gpu: activeProject.quota.gpu - activeProject.quota.gpuUsed,
    cpu: activeProject.quota.cpu - activeProject.quota.cpuUsed,
    memory: activeProject.quota.memory - activeProject.quota.memoryUsed,
    storage: activeProject.quota.storage - activeProject.quota.storageUsed
  };

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    baseImage: BASE_IMAGES[0].tag,
    modelSource: 'internal' as 'internal' | 'hub',
    modelId: '',
    version: '',
    modelPath: '',
    startupCommand: 'python -m vllm.entrypoints.openai.api_server --model /mnt/model --port 8000',
    basePath: '/v1',
    healthPath: '/healthz',
    bundle: 'standard',
    replicas: 2,
    port: '8000',
    manual: {
      gpu: 24,
      cpu: 8,
      memory: 32,
      storage: 500
    }
  });

  useEffect(() => {
    if (sourceModel && isOpen) {
      setFormData(prev => ({
        ...prev,
        name: `${sourceModel.name.toLowerCase()}-svc`,
        modelId: sourceModel.id,
        version: sourceModel.latestVersion || '',
        modelSource: sourceModel.provider ? 'hub' : 'internal',
        modelPath: `/mnt/models/${sourceModel.name.toLowerCase()}/${sourceModel.latestVersion || 'latest'}`
      }));
    }
  }, [sourceModel, isOpen]);

  const filteredModels = useMemo(() => {
    const list = formData.modelSource === 'internal' ? MOCK_USER_MODELS : MOCK_PRETRAINED_MODELS;
    return list.filter(m => 
      m.name.toLowerCase().includes(modelSearch.toLowerCase()) || 
      (m as any).displayName?.toLowerCase().includes(modelSearch.toLowerCase())
    );
  }, [formData.modelSource, modelSearch]);

  const selectedModelData = useMemo(() => {
    return (formData.modelSource === 'internal' ? MOCK_USER_MODELS : MOCK_PRETRAINED_MODELS)
      .find(m => m.id === formData.modelId);
  }, [formData.modelId, formData.modelSource]);

  // 同步更新模型路径
  useEffect(() => {
    if (formData.modelId) {
      const m = (formData.modelSource === 'internal' ? MOCK_USER_MODELS : MOCK_PRETRAINED_MODELS).find(x => x.id === formData.modelId);
      if (m) {
        setFormData(prev => ({
          ...prev,
          modelPath: `/mnt/models/${m.name.toLowerCase()}/${prev.version || 'latest'}`
        }));
      }
    }
  }, [formData.modelId, formData.version, formData.modelSource]);

  const requiredResources = useMemo(() => {
    // Corrected 'mem' property to 'memory' to maintain consistency across union types
    const unit = isManual ? formData.manual : {
      gpu: (INFERENCE_RESOURCE_BUNDLES as any)[formData.bundle].gpuValue,
      cpu: (INFERENCE_RESOURCE_BUNDLES as any)[formData.bundle].cpu,
      memory: (INFERENCE_RESOURCE_BUNDLES as any)[formData.bundle].memory,
      storage: (INFERENCE_RESOURCE_BUNDLES as any)[formData.bundle].storage
    };
    
    return {
      gpu: unit.gpu * formData.replicas,
      cpu: unit.cpu * formData.replicas,
      memory: unit.memory * formData.replicas, 
      storage: unit.storage 
    };
  }, [formData, isManual]);

  // Updated 'mem' to 'memory' for consistency
  const isExceeded = {
    gpu: requiredResources.gpu > availableResources.gpu,
    cpu: requiredResources.cpu > availableResources.cpu,
    memory: requiredResources.memory > availableResources.memory,
    storage: requiredResources.storage > availableResources.storage,
    any: requiredResources.gpu > availableResources.gpu || 
         requiredResources.cpu > availableResources.cpu || 
         requiredResources.memory > availableResources.memory || 
         requiredResources.storage > availableResources.storage
  };

  const steps = [
    { id: 1, label: '基础定义' },
    { id: 2, label: '模型挂载' },
    { id: 3, label: '运行接口' },
    { id: 4, label: '算力配置' }
  ];

  const handleUpdateEnv = (idx: number, field: 'key' | 'value', val: string) => {
    const next = [...envVars];
    next[idx][field] = val;
    setEnvVars(next);
  };

  const ResourceSlider = ({ label, icon: Icon, value, unit, min, max, quota, isWarn, onChange, color }: any) => (
    <div className={`space-y-3 p-4 rounded-2xl border transition-all ${isWarn ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-100 hover:border-slate-200'}`}>
       <div className="flex justify-between items-center">
          <span className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${isWarn ? 'text-red-600' : 'text-slate-500'}`}>
             <Icon size={12} className={isWarn ? 'text-red-500' : color} /> {label}
          </span>
          <div className="flex items-center gap-2">
             <span className={`text-xs font-black font-mono ${isWarn ? 'text-red-600' : 'text-slate-900'}`}>{value}{unit}</span>
          </div>
       </div>
       <input 
          type="range" min={min} max={Math.max(quota * 1.2, value)} value={value} 
          onChange={(e) => onChange(parseInt(e.target.value))}
          className={`w-full h-1 rounded-full appearance-none cursor-pointer transition-all ${isWarn ? 'bg-red-200 accent-red-600' : 'bg-slate-200 accent-primary-600'}`} 
       />
       <div className="flex justify-between text-[8px] font-black uppercase tracking-tighter text-slate-300">
          <span>MIN: {min}{unit}</span>
          <span className={isWarn ? 'text-red-500 font-bold' : ''}>PROJECT_AVAIL: {quota}{unit}</span>
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
      width="max-w-4xl"
      footer={
        <div className="flex justify-between w-full">
           <button disabled={step === 1} onClick={() => setStep(s => s - 1)} className="px-8 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 disabled:opacity-30 transition-all">PREVIOUS</button>
           {step < 4 ? (
             <button onClick={() => setStep(s => s + 1)} disabled={(step === 1 && !formData.name) || (step === 2 && (!formData.modelId || !formData.version))} className="px-10 py-2.5 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-600 flex items-center gap-2 shadow-xl active:scale-95 transition-all">CONTINUE <ChevronRight size={14} strokeWidth={3} /></button>
           ) : (
             <button 
               onClick={onClose} 
               disabled={isExceeded.any}
               className={`px-12 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95 ${isExceeded.any ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200' : 'bg-primary-600 text-white hover:bg-primary-700 shadow-2xl shadow-primary-500/30'}`}
             >
                CONFIRM & DEPLOY <Rocket size={14} />
             </button>
           )}
        </div>
      }
    >
      <div className="flex items-center justify-between mb-10 px-4 relative">
         {steps.map((s) => (
           <div key={s.id} className="flex flex-col items-center relative z-10">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black transition-all duration-500 border-2 ${step === s.id ? 'bg-primary-600 border-primary-600 text-white shadow-xl scale-110' : step > s.id ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-slate-200 text-slate-300'}`}>{step > s.id ? <CheckCircle2 size={18} strokeWidth={3} /> : s.id}</div>
              <span className={`text-[10px] font-black uppercase mt-3 tracking-widest ${step === s.id ? 'text-primary-600' : 'text-slate-400'}`}>{s.label}</span>
           </div>
         ))}
         <div className="absolute top-[18px] left-10 right-10 h-0.5 bg-slate-100 -z-0"></div>
      </div>

      <div className="min-h-[520px]">
        {/* Step 1: 基础定义 */}
        {step === 1 && (
           <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">服务名称 (SERVICE_NAME) <span className="text-red-500">*</span></label>
                 <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. llama3-70b-prod" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold focus:bg-white focus:border-primary-500 outline-none transition-all font-mono" />
              </div>
              <div className="space-y-4">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">官方基础镜像 (BASE_IMAGE)</label>
                 <div className="grid grid-cols-1 gap-3">
                    {BASE_IMAGES.map(img => (
                      <button key={img.id} onClick={() => setFormData({...formData, baseImage: img.tag})} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${formData.baseImage === img.tag ? 'bg-primary-50 border-primary-500 shadow-md' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
                         <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${formData.baseImage === img.tag ? 'bg-primary-600 text-white' : 'bg-slate-50 text-slate-400'}`}><Database size={18} /></div>
                         <div className="text-left flex-1">
                            <p className="text-xs font-black text-slate-900 uppercase">{img.name}</p>
                            <p className="text-[9px] font-mono font-bold text-slate-400">{img.tag || '手工输入镜像地址...'}</p>
                         </div>
                         {formData.baseImage === img.tag && <CheckCircle2 size={16} className="text-primary-600" />}
                      </button>
                    ))}
                 </div>
              </div>
           </div>
        )}

        {/* Step 2: 模型挂载 */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
             <div className="flex justify-between items-center px-1">
                <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner w-fit">
                   <button onClick={() => setFormData({...formData, modelSource: 'internal', modelId: '', version: ''})} className={`px-5 py-2 text-[9px] font-black rounded-lg transition-all ${formData.modelSource === 'internal' ? 'bg-white text-primary-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'}`}>平台资产库</button>
                   <button onClick={() => setFormData({...formData, modelSource: 'hub', modelId: '', version: ''})} className={`px-5 py-2 text-[9px] font-black rounded-lg transition-all ${formData.modelSource === 'hub' ? 'bg-white text-primary-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'}`}>模型广场</button>
                </div>
                <div className="relative group w-64">
                   <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-500 transition-colors" />
                   <input 
                     type="text" 
                     value={modelSearch}
                     onChange={(e) => setModelSearch(e.target.value)}
                     placeholder="搜索资产名称..."
                     className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-bold uppercase outline-none focus:bg-white focus:border-primary-500 transition-all placeholder:text-slate-300"
                   />
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-1.5"><Box size={12} className="text-primary-500" /> 1. 选择挂载模型</label>
                   <div className="bg-slate-50 border border-slate-200 rounded-[28px] p-2 h-[340px] overflow-y-auto scrollbar-thin">
                      <div className="grid grid-cols-1 gap-1">
                         {filteredModels.map(m => {
                            const isActive = formData.modelId === m.id;
                            return (
                               <button 
                                 key={m.id}
                                 onClick={() => setFormData({...formData, modelId: m.id, version: m.latestVersion || ''})}
                                 className={`flex items-center justify-between p-3 rounded-2xl border transition-all text-left ${isActive ? 'bg-white border-primary-500 shadow-md ring-4 ring-primary-500/5' : 'bg-transparent border-transparent hover:bg-white hover:border-slate-200'}`}
                               >
                                  <div className="flex items-center gap-3">
                                     <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isActive ? 'bg-primary-600 text-white' : 'bg-white border border-slate-100 text-slate-300'}`}>
                                        <Box size={18} strokeWidth={2.5} />
                                     </div>
                                     <div className="flex flex-col min-w-0">
                                        <span className={`text-[11px] font-black uppercase truncate ${isActive ? 'text-slate-900' : 'text-slate-500'}`}>{(m as any).displayName || m.name}</span>
                                        <span className="text-[8px] font-mono font-bold text-slate-400 tracking-tighter uppercase">{m.id}</span>
                                     </div>
                                  </div>
                                  {isActive && <CheckCircle2 size={16} className="text-primary-600" />}
                               </button>
                            );
                         })}
                      </div>
                   </div>
                </div>

                <div className="space-y-6">
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-1.5"><History size={12} className="text-primary-500" /> 2. 选择模型版本</label>
                      <div className={`p-5 rounded-[28px] border transition-all ${formData.modelId ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-100 opacity-40 grayscale'}`}>
                         {!formData.modelId ? (
                           <div className="text-center py-6 text-slate-300 uppercase font-black text-[9px] tracking-widest">请先在左侧选择模型</div>
                         ) : (
                           <div className="relative group">
                              <select 
                                value={formData.version} 
                                onChange={(e) => setFormData({...formData, version: e.target.value})}
                                className="w-full pl-5 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-black font-mono focus:bg-white focus:border-primary-500 outline-none appearance-none cursor-pointer uppercase tracking-tight"
                              >
                                 <option value={selectedModelData?.latestVersion}>{selectedModelData?.latestVersion} (LATEST · STABLE)</option>
                                 <option value="v2.0.1">v2.0.1 (STABLE)</option>
                                 <option value="v2.0.0-beta">v2.0.0-beta (EXPERIMENTAL)</option>
                              </select>
                              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                           </div>
                         )}
                      </div>
                   </div>

                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-1.5"><FolderKanban size={12} className="text-indigo-500" /> 3. 最终挂载路径 (MOUNT_PATH)</label>
                      <div className={`p-6 rounded-[28px] border transition-all ${formData.modelId && formData.version ? 'bg-white border-slate-200 shadow-md ring-4 ring-primary-500/5' : 'bg-slate-100 border-slate-100 opacity-40 grayscale'}`}>
                        <div className={`rounded-xl px-4 py-3 text-[11px] font-mono font-black break-all leading-relaxed shadow-inner border-l-4 transition-all ${formData.modelId && formData.version ? 'bg-slate-50 border-slate-200 text-primary-600 border-l-primary-500' : 'bg-slate-100/50 border-slate-100 text-slate-300 border-l-slate-200'}`}>
                            {formData.modelId && formData.version ? `/mnt/models/${formData.modelId.toLowerCase()}/${formData.version}` : 'PATH_PENDING...'}
                        </div>
                        {formData.modelId && (
                           <p className="mt-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center flex items-center justify-center gap-2">
                             <ShieldCheck size={12} className="text-emerald-500" /> 容器就绪后将以此路径只读挂载权重文件
                           </p>
                        )}
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* Step 3: 运行接口 */}
        {step === 3 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2"><Terminal size={14} className="text-primary-500" /> 容器启动命令 (STARTUP_COMMAND)</label>
                <div className="bg-slate-950 border border-slate-800 rounded-[28px] p-6 shadow-2xl relative group">
                   <div className="absolute top-4 right-4 opacity-10 text-white"><Command size={40} /></div>
                   <textarea 
                     rows={3} 
                     value={formData.startupCommand}
                     onChange={(e) => setFormData({...formData, startupCommand: e.target.value})}
                     className="w-full bg-transparent border-none text-[11px] font-mono font-bold text-slate-300 focus:ring-0 resize-none leading-relaxed"
                     placeholder="e.g. python -m vllm.entrypoints.openai.api_server ..."
                   />
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                   <div className="flex justify-between items-center pr-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2"><Binary size={12} /> 服务端口</label>
                      <span className="text-[8px] font-black text-primary-600 bg-primary-50 px-1.5 py-0.5 rounded uppercase tracking-tighter">System Assigned</span>
                   </div>
                   <div className="relative group">
                      <Lock size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="text" 
                        readOnly
                        value={formData.port} 
                        className="w-full pl-10 pr-4 py-3 bg-slate-100/50 border border-slate-200 rounded-2xl text-[11px] font-black font-mono text-slate-500 cursor-not-allowed outline-none transition-all shadow-inner" 
                        title="系统将根据负载自动分配可用端口"
                      />
                   </div>
                </div>
                <div className="md:col-span-2 space-y-2">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2"><Globe size={12} /> 服务基础路径 (BASE_PATH)</label>
                   <input 
                    type="text" 
                    value={formData.basePath} 
                    onChange={(e) => setFormData({...formData, basePath: e.target.value})} 
                    placeholder="e.g. /v1/chat/completions" 
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-black font-mono focus:bg-white focus:border-primary-500 outline-none transition-all" 
                   />
                   <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter leading-relaxed ml-1">
                      API服务的基础路径，当前仅支持HTTP协议。支持OpenAI格式，如：/v1/chat/completions 或 /v1/completions
                   </p>
                </div>
             </div>

             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2"><Heart size={12} className="text-red-500" /> 健康检查路径 (HEALTH_CHECK)</label>
                <input type="text" value={formData.healthPath} onChange={(e) => setFormData({...formData, healthPath: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-black font-mono focus:bg-white focus:border-emerald-500 outline-none transition-all" />
             </div>

             <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Settings size={12} className="text-primary-500" /> 运行时环境变量矩阵 (ENV_VARS)</label>
                   <button onClick={() => setEnvVars([...envVars, {key: '', value: ''}])} className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">
                      <Plus size={10} /> 新增变量
                   </button>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-[28px] p-5 space-y-3 shadow-inner max-h-[160px] overflow-y-auto scrollbar-thin">
                   {envVars.map((env, idx) => (
                      <div key={idx} className="flex gap-3 animate-in slide-in-from-left-2 duration-300">
                         <input 
                           type="text" placeholder="KEY" value={env.key} 
                           onChange={(e) => handleUpdateEnv(idx, 'key', e.target.value)}
                           className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black font-mono focus:border-primary-500 outline-none" 
                         />
                         <input 
                           type="text" placeholder="VALUE" value={env.value} 
                           onChange={(e) => handleUpdateEnv(idx, 'value', e.target.value)}
                           className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black font-mono focus:border-primary-500 outline-none" 
                         />
                         <button onClick={() => setEnvVars(envVars.filter((_, i) => i !== idx))} className="p-2.5 text-slate-300 hover:text-red-500 transition-all"><Trash2 size={16} /></button>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        )}

        {/* Step 4: 算力配置 */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
             <div className="bg-slate-950 rounded-2xl px-6 py-5 border border-slate-800 shadow-xl relative overflow-hidden">
                <div className="absolute inset-0 tech-grid opacity-[0.03] pointer-events-none"></div>
                <div className="flex flex-wrap justify-between items-center gap-4 relative z-10">
                   <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse"></div>
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">当前项目可用配额 (PROJECT_AVAIL)</span>
                   </div>
                   <div className="flex gap-8">
                      {[
                        { label: 'GPU', val: availableResources.gpu, unit: 'U', icon: Zap, color: 'text-emerald-400' },
                        { label: 'CPU', val: availableResources.cpu, unit: 'C', icon: Cpu, color: 'text-primary-400' },
                        { label: 'RAM', val: availableResources.memory, unit: 'G', icon: Activity, color: 'text-indigo-400' },
                        { label: 'STO', val: availableResources.storage, unit: 'G', icon: HardDrive, color: 'text-amber-400' }
                      ].map((res, i) => (
                        <div key={i} className="flex items-center gap-2">
                           <res.icon size={10} className={res.color} />
                           <span className="text-[11px] font-black font-mono text-white tracking-tighter">{res.val}{res.unit}</span>
                        </div>
                      ))}
                   </div>
                </div>
             </div>

             <div className="flex justify-between items-center px-1">
                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
                   <Monitor size={14} className="text-primary-600" /> 推理算力规格定义 (CONFIG)
                </h4>
                <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200">
                   <button onClick={() => setIsManual(false)} className={`px-4 py-1.5 text-[9px] font-black rounded-lg transition-all ${!isManual ? 'bg-white text-primary-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-700'}`}>推荐套件</button>
                   <button onClick={() => setIsManual(true)} className={`px-4 py-1.5 text-[9px] font-black rounded-lg transition-all ${isManual ? 'bg-white text-primary-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-700'}`}>手动调节</button>
                </div>
             </div>

             {!isManual ? (
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.values(INFERENCE_RESOURCE_BUNDLES).map((bundle: any) => {
                    const active = formData.bundle === bundle.id;
                    const bundleExceeded = bundle.gpuValue * formData.replicas > availableResources.gpu || bundle.cpu * formData.replicas > availableResources.cpu;
                    return (
                      <button 
                        key={bundle.id} 
                        disabled={bundleExceeded}
                        onClick={() => setFormData({...formData, bundle: bundle.id})} 
                        className={`group relative p-5 rounded-3xl border transition-all text-left flex flex-col ${active ? 'bg-white border-primary-600 shadow-xl ring-4 ring-primary-500/5' : 'bg-white border-slate-200 hover:border-primary-400'} ${bundleExceeded ? 'opacity-40 grayscale cursor-not-allowed border-dashed' : ''}`}
                      >
                         <div className="flex justify-between items-start mb-4">
                            <div className={`p-2 rounded-xl transition-all ${active ? 'bg-primary-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400'}`}><Zap size={16} /></div>
                            {bundleExceeded && <Badge status="error" showDot={false}>OVER</Badge>}
                         </div>
                         <h5 className={`text-xs font-black uppercase tracking-tight ${active ? 'text-primary-600' : 'text-slate-900'}`}>{bundle.name}</h5>
                         
                         <div className="mt-6 space-y-3.5 flex-1">
                            <div className="flex items-center justify-between">
                               <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest"><CpuIcon size={10}/> GPU</div>
                               <span className="text-[10px] font-bold font-mono text-slate-800">{bundle.gpuLabel}</span>
                            </div>
                            <div className="flex items-center justify-between">
                               <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest"><Cpu size={10}/> CPU</div>
                               <span className="text-[10px] font-bold font-mono text-slate-800">{bundle.cpu}C</span>
                            </div>
                            <div className="flex items-center justify-between">
                               <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest"><Activity size={10}/> RAM</div>
                               <span className="text-[10px] font-bold font-mono text-slate-800">{bundle.memory}G</span>
                            </div>
                         </div>
                      </button>
                    );
                  })}
               </div>
             ) : (
               <div className="bg-white border border-slate-200 rounded-[28px] p-6 space-y-4 shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <ResourceSlider label="GPU VRAM" icon={Zap} color="text-emerald-500" value={formData.manual.gpu} min={1} quota={activeProject.quota.gpu} unit="G" isWarn={isExceeded.gpu} onChange={(v: number) => setFormData({...formData, manual: {...formData.manual, gpu: v}})} />
                     <ResourceSlider label="CPU CORES" icon={Cpu} color="text-primary-500" value={formData.manual.cpu} min={1} quota={activeProject.quota.cpu} unit="C" isWarn={isExceeded.cpu} onChange={(v: number) => setFormData({...formData, manual: {...formData.manual, cpu: v}})} />
                     <ResourceSlider label="MEMORY" icon={Activity} color="text-indigo-500" value={formData.manual.memory} min={4} quota={activeProject.quota.memory} unit="G" isWarn={isExceeded.memory} onChange={(v: number) => setFormData({...formData, manual: {...formData.manual, memory: v}})} />
                     <ResourceSlider label="STORAGE" icon={HardDrive} color="text-amber-500" value={formData.manual.storage} min={20} quota={activeProject.quota.storage} unit="G" isWarn={isExceeded.storage} onChange={(v: number) => setFormData({...formData, manual: {...formData.manual, storage: v}})} />
                  </div>
               </div>
             )}

             <div className="p-6 bg-slate-50 border border-slate-200 rounded-[32px] space-y-4 shadow-inner">
                <div className="flex justify-between items-center px-1">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Layers size={14} className="text-primary-500" /> 并行推理副本 (REPLICAS)</label>
                   <span className="text-lg font-black font-mono text-primary-600">{formData.replicas} PODS</span>
                </div>
                <input type="range" min="1" max="10" value={formData.replicas} onChange={(e) => setFormData({...formData, replicas: parseInt(e.target.value)})} className="w-full h-1.5 bg-slate-200 rounded-full appearance-none accent-primary-600 cursor-pointer" />
                <div className="flex justify-between text-[8px] font-black text-slate-300 uppercase tracking-widest px-1">
                   <span>MIN: 1</span>
                   <span>QUOTA MAX: 10</span>
                </div>
             </div>

             {isExceeded.any && (
               <div className="p-5 bg-red-50 border border-red-100 rounded-2xl flex gap-4 animate-in shake duration-500">
                  <AlertTriangle size={18} className="text-red-500 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-red-700 font-bold uppercase leading-relaxed tracking-tight">配置超限：当前总算力请求 (单元 x 副本) 已超过项目可用额度。</p>
               </div>
             )}
          </div>
        )}
      </div>
    </Drawer>
  );
};
