
import React, { useState, useMemo, useEffect } from 'react';
import { Drawer } from '../ui/Drawer';
import { 
  Terminal, Code, Box, Cpu, Zap, Database, 
  Save, ChevronRight, CheckCircle2, Layout, 
  Monitor, Info, ShieldCheck, HardDrive, Settings,
  ArrowRight, Search, List, Rocket, Layers,
  ChevronLeft, AlertCircle, ShieldAlert,
  Gauge, Activity, Brain, HardDriveIcon,
  ChevronDown, AlertTriangle, Clock
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { IDE_RESOURCE_BUNDLES, MOCK_USER_MODELS } from '../../constants';

interface CreateIDEModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateIDEModal: React.FC<CreateIDEModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [isManual, setIsManual] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    desc: '',
    type: 'JupyterLab' as 'JupyterLab' | 'VSCode',
    modelId: '',
    version: '',
    bundle: 'standard',
    manual: {
      gpuModel: 'NVIDIA A10-24GB',
      gpuCount: 1,
      cpu: 8,
      mem: 32,
      storage: 500
    }
  });

  // 项目可用配额限制 (回显当前项目剩余)
  const projectAvailable = { 
    gpu: 4, 
    gpuSpec: 'NVIDIA A10-24GB', 
    cpu: 64, 
    mem: 256, 
    storage: 2000 
  };

  const selectedModel = useMemo(() => 
    MOCK_USER_MODELS.find(m => m.id === formData.modelId), 
    [formData.modelId]
  );

  // 资源联动逻辑：当切换到手动时，继承当前套件的值
  const handleToggleManual = (manual: boolean) => {
    if (manual && !isManual) {
      const b = (IDE_RESOURCE_BUNDLES as any)[formData.bundle];
      setFormData(prev => ({
        ...prev,
        manual: {
          gpuModel: b.name.includes('基础') ? 'NVIDIA T4-16GB' : b.name.includes('标准') ? 'NVIDIA A10-24GB' : 'NVIDIA A100-80GB',
          gpuCount: b.gpuCount,
          cpu: b.cpu,
          mem: b.memory,
          storage: b.storage
        }
      }));
    }
    setIsManual(manual);
  };

  // 实时资源规格计算
  const currentSpec = useMemo(() => {
    if (!isManual) {
      const b = (IDE_RESOURCE_BUNDLES as any)[formData.bundle];
      return { gpu: b.gpuCount, cpu: b.cpu, mem: b.memory, storage: b.storage };
    }
    return formData.manual;
  }, [formData, isManual]);

  const validation = useMemo(() => ({
    gpuExceeded: currentSpec.gpu > projectAvailable.gpu,
    cpuExceeded: currentSpec.cpu > projectAvailable.cpu,
    memExceeded: currentSpec.mem > projectAvailable.mem,
    storageExceeded: currentSpec.storage > projectAvailable.storage,
    anyExceeded: currentSpec.gpu > projectAvailable.gpu || currentSpec.cpu > projectAvailable.cpu || currentSpec.mem > projectAvailable.mem || currentSpec.storage > projectAvailable.storage
  }), [currentSpec, projectAvailable]);

  const handleNext = () => setStep(s => s + 1);
  const handlePrev = () => setStep(s => s - 1);

  const ResourceInput = ({ label, icon: Icon, value, unit, min, max, step, color, isExceeded, onChange }: any) => (
    <div className={`space-y-4 p-5 rounded-2xl border transition-all ${isExceeded ? 'bg-red-50/50 border-red-200' : 'bg-slate-50/50 border-slate-100 hover:border-slate-200'}`}>
       <div className="flex justify-between items-center">
          <label className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${isExceeded ? 'text-red-500' : 'text-slate-400'}`}>
            <Icon size={12} className={isExceeded ? 'text-red-500' : color} /> {label}
          </label>
          <div className="flex items-center gap-2">
             <input 
                type="number"
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value) || 0)}
                className={`w-20 px-2 py-1 bg-white border rounded-lg text-right text-xs font-black font-mono focus:border-primary-500 outline-none ${isExceeded ? 'text-red-600 border-red-300' : 'text-slate-900 border-slate-200'}`}
             />
             <span className="text-[9px] font-black text-slate-400 uppercase w-4">{unit}</span>
          </div>
       </div>
       <input 
          type="range" min={min} max={max * 1.5} step={step} value={value} 
          onChange={(e) => onChange(parseInt(e.target.value))}
          className={`w-full h-1.5 rounded-full appearance-none cursor-pointer ${isExceeded ? 'bg-red-200 accent-red-600' : 'bg-slate-200 accent-primary-600'}`}
       />
       <div className="flex justify-between text-[8px] font-black uppercase tracking-tighter">
          <span className="text-slate-300">MIN: {min}{unit}</span>
          <span className={isExceeded ? 'text-red-500 font-bold' : 'text-slate-300'}>PROJECT_AVAIL: {max}{unit}</span>
       </div>
    </div>
  );

  const handleModelChange = (mid: string) => {
    const model = MOCK_USER_MODELS.find(m => m.id === mid);
    setFormData(prev => ({
      ...prev,
      modelId: mid,
      version: model?.latestVersion || '' // 自动关联最新版本
    }));
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Terminal size={20} className="text-primary-600" />
          <span className="font-black uppercase tracking-tight">部署云端集成环境</span>
        </div>
      }
      description="Provisioning isolated K8s developer instance"
      width="max-w-3xl"
      footer={
        <div className="flex justify-between w-full">
           <button disabled={step === 1} onClick={handlePrev} className="px-8 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 disabled:opacity-30 transition-all">上一步</button>
           {step < 3 ? (
             <button onClick={handleNext} disabled={step === 1 && !formData.name} className="px-10 py-2.5 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-600 flex items-center gap-2 shadow-xl active:scale-95 transition-all">下一步 <ChevronRight size={14} strokeWidth={3} /></button>
           ) : (
             <button onClick={onClose} disabled={validation.anyExceeded} className={`px-12 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95 ${validation.anyExceeded ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-primary-600 text-white hover:bg-primary-700 shadow-2xl shadow-primary-500/30'}`}>确认并部署环境 <Rocket size={14} /></button>
           )}
        </div>
      }
    >
      {/* 步骤条 */}
      <div className="flex items-center justify-between mb-10 px-8 relative">
         {[1, 2, 3].map((s) => (
           <div key={s} className="flex flex-col items-center relative z-10">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black transition-all duration-500 border-2 ${step === s ? 'bg-primary-600 border-primary-600 text-white shadow-xl scale-110' : step > s ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-slate-200 text-slate-300'}`}>{step > s ? <CheckCircle2 size={18} /> : s}</div>
              <span className={`text-[10px] font-black uppercase mt-3 tracking-widest ${step === s ? 'text-primary-600' : 'text-slate-400'}`}>{s === 1 ? '基础定义' : s === 2 ? '权重挂载' : '算力配置'}</span>
           </div>
         ))}
         <div className="absolute top-[18px] left-20 right-20 h-0.5 bg-slate-100 -z-0"></div>
      </div>

      <div className="min-h-[480px]">
        {/* Step 1: 环境名称与类型 */}
        {step === 1 && (
          <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
             <div className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">环境标识名称 <span className="text-red-500">*</span></label>
                   <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. resnet-opt-lab" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold focus:bg-white focus:border-primary-500 outline-none transition-all font-mono" />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">IDE 类型选择</label>
                   <div className="grid grid-cols-2 gap-4">
                      {[
                        { id: 'JupyterLab', icon: Layout, color: 'text-orange-500', sub: '交互式数据科学体验' },
                        { id: 'VSCode', icon: Code, color: 'text-blue-500', sub: '专业全栈代码开发' }
                      ].map(type => (
                        <button key={type.id} onClick={() => setFormData({...formData, type: type.id as any})} className={`flex items-center gap-4 p-5 rounded-2xl border transition-all ${formData.type === type.id ? 'bg-primary-50 border-primary-500 shadow-md' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
                           <div className={`w-11 h-11 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm ${type.color}`}><type.icon size={24} /></div>
                           <div className="text-left"><p className="text-sm font-black text-slate-900 tracking-tight uppercase">{type.id}</p><p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">{type.sub}</p></div>
                        </button>
                      ))}
                   </div>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">用途描述 (DESCRIPTION)</label>
                   <textarea rows={2} value={formData.desc} onChange={(e) => setFormData({...formData, desc: e.target.value})} placeholder="描述该环境的使用背景..." className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:bg-white focus:border-primary-500 outline-none transition-all resize-none" />
                </div>
             </div>
          </div>
        )}

        {/* Step 2: 模型挂载 (移除版本选择 UI) */}
        {step === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
             <div className="bg-slate-950 rounded-[32px] p-8 border border-slate-800 flex gap-6 items-center relative overflow-hidden">
                <div className="w-14 h-14 bg-primary-600/20 rounded-2xl flex items-center justify-center text-primary-400 border border-primary-500/30"><Brain size={28} /></div>
                <div><h4 className="text-white text-sm font-black uppercase tracking-[0.2em]">挂载平台模型资产</h4><p className="text-slate-400 text-[9px] font-bold uppercase mt-1 tracking-widest opacity-70">Mount stable model weights for development</p></div>
             </div>

             <div className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">选择目标模型 (REGISTRY)</label>
                   <div className="relative">
                      <select 
                        value={formData.modelId} 
                        onChange={(e) => handleModelChange(e.target.value)} 
                        className="w-full pl-5 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold focus:bg-white outline-none transition-all appearance-none cursor-pointer"
                      >
                         <option value="">-- SELECT MODEL ASSET --</option>
                         {MOCK_USER_MODELS.map(m => <option key={m.id} value={m.id}>{m.displayName.toUpperCase()}</option>)}
                      </select>
                      <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                   </div>
                </div>

                {selectedModel && (
                  <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                     {/* 移除版本选择按钮组，仅展示当前关联的自动版本 */}
                     <div className="p-6 bg-primary-50/30 border border-primary-100 rounded-3xl space-y-4">
                        <div className="flex items-center justify-between border-b border-primary-100/50 pb-4">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-primary-600 shadow-sm"><ShieldCheck size={16} /></div>
                              <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">已自动关联模型最新版本</span>
                           </div>
                           <Badge status="success" showDot={false}>{formData.version || 'STABLE'}</Badge>
                        </div>
                        
                        <div className="space-y-2">
                           <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                              <Database size={11} /> 容器内资产挂载点 (MOUNT_POINT)
                           </label>
                           <div className="px-4 py-2.5 bg-white border border-primary-100 rounded-xl text-[10px] font-mono font-black text-primary-700 break-all leading-relaxed shadow-inner">
                              /mnt/models/{selectedModel.name.toLowerCase()}
                           </div>
                        </div>
                     </div>

                     <div className="flex items-start gap-3 px-2">
                        <Info size={16} className="text-slate-400 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                           系统策略：为了环境稳定性，IDE 模式默认挂载模型的最新生产级 Snapshot。如需使用历史特定版本，请在“模型管理”中将其标记为当前最新。
                        </p>
                     </div>
                  </div>
                )}
             </div>
          </div>
        )}

        {/* Step 3: 算力分配与联动 */}
        {step === 3 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
             <div className="flex justify-between items-end px-1">
                <div className="space-y-1">
                   <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">算力规格定义</h4>
                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter italic">Precision resource allocation for the container</p>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner">
                   <button onClick={() => handleToggleManual(false)} className={`px-5 py-2 text-[10px] font-black rounded-xl transition-all ${!isManual ? 'bg-white text-primary-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-400'}`}>快速套件</button>
                   <button onClick={() => handleToggleManual(true)} className={`px-5 py-2 text-[10px] font-black rounded-xl transition-all ${isManual ? 'bg-white text-primary-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-400'}`}>手动配置</button>
                </div>
             </div>

             {!isManual ? (
                <div className="grid grid-cols-1 gap-4">
                   {(Object.values(IDE_RESOURCE_BUNDLES) as any[]).map(bundle => (
                      <button key={bundle.id} onClick={() => setFormData({...formData, bundle: bundle.id})} className={`group relative p-6 rounded-[32px] border transition-all text-left overflow-hidden ${formData.bundle === bundle.id ? 'bg-slate-950 border-slate-900 shadow-2xl scale-[1.01]' : 'bg-white border-slate-200 hover:border-primary-400'}`}>
                         <div className="flex justify-between items-start mb-4 relative z-10">
                            <div className={`p-2.5 rounded-xl ${formData.bundle === bundle.id ? 'bg-primary-600 text-white' : 'bg-slate-50 text-slate-400'}`}><Zap size={20} /></div>
                            {formData.bundle === bundle.id && <Badge status="success" showDot={false}>OPTIMIZED</Badge>}
                         </div>
                         <h5 className={`text-base font-black uppercase tracking-widest ${formData.bundle === bundle.id ? 'text-white' : 'text-slate-900'}`}>{bundle.name}</h5>
                         <div className={`grid grid-cols-4 gap-4 mt-6 pt-6 border-t relative z-10 ${formData.bundle === bundle.id ? 'border-white/10' : 'border-slate-50'}`}>
                            <div className="space-y-1">
                               <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">GPU</p>
                               <p className={`text-[10px] font-bold font-mono ${formData.bundle === bundle.id ? 'text-white' : 'text-slate-800'}`}>{bundle.gpu}</p>
                            </div>
                            <div className="space-y-1">
                               <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">CPU</p>
                               <p className={`text-[11px] font-bold font-mono ${formData.bundle === bundle.id ? 'text-white' : 'text-slate-800'}`}>{bundle.cpu}C</p>
                            </div>
                            <div className="space-y-1">
                               <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">MEMORY</p>
                               <p className={`text-[11px] font-bold font-mono ${formData.bundle === bundle.id ? 'text-white' : 'text-slate-800'}`}>{bundle.memory}G</p>
                            </div>
                            <div className="space-y-1">
                               <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">STORAGE</p>
                               <p className={`text-[11px] font-bold font-mono ${formData.bundle === bundle.id ? 'text-white' : 'text-slate-800'}`}>{bundle.storage}G</p>
                            </div>
                         </div>
                      </button>
                   ))}
                </div>
             ) : (
                <div className="bg-white border border-slate-200 rounded-[32px] p-7 space-y-6 shadow-sm animate-in zoom-in-95 duration-500">
                   <div className="space-y-3 pb-4 border-b border-slate-50">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">GPU 硬件规格 (HOST_ACCELERATOR)</label>
                      <select value={formData.manual.gpuModel} onChange={(e) => setFormData({...formData, manual: {...formData.manual, gpuModel: e.target.value}})} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white outline-none cursor-pointer">
                         <option>NVIDIA T4-16GB</option>
                         <option>NVIDIA A10-24GB</option>
                         <option>NVIDIA A100-80GB</option>
                         <option>Ascend 910B-64GB</option>
                      </select>
                   </div>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <ResourceInput label="GPU 绑定数量" icon={Zap} value={formData.manual.gpuCount} unit="U" min={0} max={projectAvailable.gpu} step={1} color="text-emerald-500" isExceeded={validation.gpuExceeded} onChange={(v: number) => setFormData({...formData, manual: {...formData.manual, gpuCount: v}})} />
                      <ResourceInput label="CPU 核心计算" icon={Cpu} value={formData.manual.cpu} unit="C" min={1} max={projectAvailable.cpu} step={1} color="text-primary-500" isExceeded={validation.cpuExceeded} onChange={(v: number) => setFormData({...formData, manual: {...formData.manual, cpu: v}})} />
                      <ResourceInput label="内存 提交总量" icon={Activity} value={formData.manual.mem} unit="G" min={2} max={projectAvailable.mem} step={2} color="text-indigo-500" isExceeded={validation.memExceeded} onChange={(v: number) => setFormData({...formData, manual: {...formData.manual, mem: v}})} />
                      <ResourceInput label="持久化存储" icon={HardDriveIcon} value={formData.manual.storage} unit="G" min={10} max={projectAvailable.storage} step={10} color="text-amber-500" isExceeded={validation.storageExceeded} onChange={(v: number) => setFormData({...formData, manual: {...formData.manual, storage: v}})} />
                   </div>
                </div>
             )}

             {/* 项目配额回显面板 */}
             <div className={`rounded-[28px] p-6 border transition-all duration-500 relative overflow-hidden ${validation.anyExceeded ? 'bg-red-950 border-red-800' : 'bg-slate-900 border-slate-800 shadow-xl'}`}>
                <div className="absolute inset-0 tech-grid opacity-10 pointer-events-none"></div>
                <div className="relative z-10 flex flex-col sm:flex-row justify-between items-center gap-6">
                   <div className="flex items-center gap-4">
                      <div className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-all ${validation.anyExceeded ? 'bg-red-600 border-red-500 text-white animate-pulse' : 'bg-white/5 border-white/10 text-primary-400'}`}>
                         {validation.anyExceeded ? <AlertTriangle size={24} /> : <ShieldCheck size={24} />}
                      </div>
                      <div className="text-left">
                         <p className={`text-[9px] font-black uppercase tracking-[0.2em] ${validation.anyExceeded ? 'text-red-400' : 'text-white/60'}`}>{validation.anyExceeded ? 'CRITICAL: QUOTA LIMIT EXCEEDED' : '当前项目剩余可用配额 (PROJECT_QUOTA)'}</p>
                         <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-2">
                            <div className="flex flex-col">
                               <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-0.5">GPU SPEC</span>
                               <span className={`text-[11px] font-bold font-mono ${validation.gpuExceeded ? 'text-red-500' : 'text-white'}`}>{projectAvailable.gpuSpec} x {projectAvailable.gpu}U</span>
                            </div>
                            <div className="w-px h-6 bg-white/10 hidden sm:block"></div>
                            <div className="flex flex-col">
                               <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-0.5">CPU CORES</span>
                               <span className={`text-[11px] font-bold font-mono ${validation.cpuExceeded ? 'text-red-500' : 'text-white'}`}>{projectAvailable.cpu}C</span>
                            </div>
                            <div className="w-px h-6 bg-white/10 hidden sm:block"></div>
                            <div className="flex flex-col">
                               <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-0.5">MEMORY</span>
                               <span className={`text-[11px] font-bold font-mono ${validation.memExceeded ? 'text-red-500' : 'text-white'}`}>{projectAvailable.mem}G</span>
                            </div>
                            <div className="w-px h-6 bg-white/10 hidden sm:block"></div>
                            <div className="flex flex-col">
                               <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-0.5">STORAGE</span>
                               <span className={`text-[11px] font-bold font-mono ${validation.storageExceeded ? 'text-red-500' : 'text-white'}`}>{projectAvailable.storage}G</span>
                            </div>
                         </div>
                      </div>
                   </div>
                   {validation.anyExceeded && <div className="px-4 py-2 bg-red-600/20 border border-red-500/30 rounded-xl text-red-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shrink-0"><ShieldAlert size={14} /> 资源超配</div>}
                </div>
             </div>
          </div>
        )}
      </div>
    </Drawer>
  );
};
