
import React, { useState, useEffect } from 'react';
import { Drawer } from '../ui/Drawer';
import { 
  GitBranch, HardDrive, Layout, 
  Settings, Save, Info, ShieldCheck,
  FolderOpen, Activity, ChevronRight,
  Database, Terminal, ShieldAlert,
  FlaskConical, AlertCircle, CheckCircle2,
  BrainCircuit, UploadCloud
} from 'lucide-react';
import { Badge } from '../ui/Badge';

interface PublishModelVersionModalProps {
  isOpen: boolean;
  onClose: () => void;
  model: any;
}

export const PublishModelVersionModal: React.FC<PublishModelVersionModalProps> = ({ isOpen, onClose, model }) => {
  const [useDefaultPath, setUseDefaultPath] = useState(true);
  const [formData, setFormData] = useState({
    version: '',
    status: 'stable',
    source: 'training', // 新增：来源字段，默认训练产出
    mountPath: '',
    sourcePath: ''
  });

  useEffect(() => {
    if (model && useDefaultPath) {
      setFormData(prev => ({
        ...prev,
        mountPath: `/mnt/models/${model.name.toLowerCase()}/${formData.version || 'latest'}`
      }));
    }
  }, [model, useDefaultPath, formData.version]);

  const handleSubmit = () => {
    if (!formData.version || !formData.sourcePath) return;
    console.log('[REGISTRY_AUDIT] Publishing New Version:', { modelId: model.id, ...formData });
    onClose();
  };

  if (!model) return null;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <GitBranch size={20} className="text-primary-600" />
          <span className="font-black uppercase tracking-tight text-slate-900">发布模型迭代版本</span>
        </div>
      }
      description={`INITIATING_COMMIT_FOR: ${model.name.toUpperCase()}`}
      width="max-w-md"
      footer={
        <div className="flex gap-3 w-full">
          <button 
            onClick={onClose}
            className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
          >
            CANCEL_COMMIT
          </button>
          <button 
            onClick={handleSubmit}
            disabled={!formData.version || !formData.sourcePath}
            className="flex-1 py-2.5 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-600 shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            <Save size={14} /> PUBLISH_TO_REGISTRY
          </button>
        </div>
      }
    >
      <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
        {/* Model Identifier Context */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
           <div className="flex justify-between items-center">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">所属模型资产 (ASSET_SCOPE)</span>
              <Badge status="info" showDot={false}>READ ONLY</Badge>
           </div>
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 shadow-sm">
                 <Layout size={18} />
              </div>
              <div>
                 <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{model.displayName}</p>
                 <p className="text-[10px] font-mono font-bold text-slate-500 mt-0.5">{model.name}</p>
              </div>
           </div>
        </div>

        <div className="space-y-6">
          {/* 来源选择 */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
               <Activity size={12} className="text-primary-500" /> 模型产出来源 (PROVENANCE)
            </label>
            <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
               <button
                 type="button"
                 onClick={() => setFormData({...formData, source: 'training'})}
                 className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black transition-all ${formData.source === 'training' ? 'bg-white text-indigo-600 shadow-md ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
               >
                  <BrainCircuit size={14} strokeWidth={2.5} />
                  训练产出
               </button>
               <button
                 type="button"
                 onClick={() => setFormData({...formData, source: 'manual'})}
                 className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black transition-all ${formData.source === 'manual' ? 'bg-white text-amber-600 shadow-md ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
               >
                  <UploadCloud size={14} strokeWidth={2.5} />
                  手动上传
               </button>
            </div>
          </div>

          {/* 版本号 */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
               <Settings size={12} className="text-primary-500" /> 版本迭代号 (SEMVER) <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              value={formData.version}
              onChange={(e) => setFormData({...formData, version: e.target.value})}
              placeholder="e.g. v2.1.0"
              className="w-full px-4 py-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all font-mono font-bold"
            />
          </div>

          {/* 版本状态 */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
               <ShieldCheck size={12} className="text-primary-500" /> 版本生命周期状态
            </label>
            <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
               {[
                 { id: 'stable', label: '稳定', color: 'text-emerald-600', activeBg: 'bg-white', dot: 'bg-emerald-500' },
                 { id: 'experimental', label: '实验', color: 'text-amber-600', activeBg: 'bg-white', dot: 'bg-amber-500' },
                 { id: 'deprecated', label: '弃用', color: 'text-slate-500', activeBg: 'bg-white', dot: 'bg-slate-400' }
               ].map(status => (
                  <button
                    key={status.id}
                    type="button"
                    onClick={() => setFormData({...formData, status: status.id})}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black transition-all ${formData.status === status.id ? `${status.activeBg} text-slate-900 shadow-md ring-1 ring-slate-200` : 'text-slate-400 hover:text-slate-600'}`}
                  >
                     <div className={`w-1.5 h-1.5 rounded-full ${formData.status === status.id ? status.dot : 'bg-transparent border border-slate-300'} transition-colors`}></div>
                     {status.label}
                  </button>
               ))}
            </div>
          </div>

          {/* 模型源路径 */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
               <Database size={12} className="text-primary-500" /> 存储后端源路径 (SOURCE_URI) <span className="text-red-500">*</span>
            </label>
            <div className="relative group">
               <FolderOpen size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
               <input 
                  type="text" 
                  value={formData.sourcePath}
                  onChange={(e) => setFormData({...formData, sourcePath: e.target.value})}
                  placeholder="s3://internal-registry/models/..."
                  className="w-full pl-11 pr-4 py-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary-500 outline-none transition-all font-mono font-bold"
               />
            </div>
          </div>
        </div>

        {/* Note */}
        <div className="bg-primary-50/50 border border-primary-100 p-5 rounded-[24px] flex gap-4">
           <ShieldAlert size={24} className="text-primary-500 shrink-0 mt-0.5" />
           <div className="space-y-1">
              <h6 className="text-[10px] font-black text-primary-900 uppercase tracking-widest">操作审计声明</h6>
              <p className="text-[10px] text-primary-800/80 font-bold leading-relaxed uppercase tracking-tighter">
                来源标识将直接影响资产的审计权重。训练产出的版本将关联其训练 Job 的 Trace ID，手动上传版本需通过完整的合规扫描。
              </p>
           </div>
        </div>
      </div>
    </Drawer>
  );
};
