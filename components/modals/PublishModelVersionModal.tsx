
import React, { useState, useEffect } from 'react';
import { Drawer } from '../ui/Drawer';
import { 
  GitBranch, HardDrive, Layout, 
  Settings, Save, Info, ShieldCheck,
  FolderOpen, Activity, ChevronRight,
  Database, Terminal
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
    mountPath: '',
    sourcePath: '',
    status: 'experimental'
  });

  // 当模型变化或路径策略变化时，更新默认挂载路径
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
    console.log('Publishing New Version:', { modelId: model.id, ...formData });
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
          <span className="font-black uppercase tracking-tight">发布模型迭代版本</span>
        </div>
      }
      description={`Initiating semantic versioning for ${model.name}`}
      width="max-w-md"
      footer={
        <div className="flex gap-3 w-full">
          <button 
            onClick={onClose}
            className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
          >
            取消
          </button>
          <button 
            onClick={handleSubmit}
            disabled={!formData.version || !formData.sourcePath}
            className="flex-1 py-2.5 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-600 shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            <Save size={14} /> 确认发布版本
          </button>
        </div>
      }
    >
      <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
        {/* Model Identifier Context (Read-only) */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
           <div className="flex justify-between items-center">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">所属模型资产</span>
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
          {/* 版本号 */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
               <Activity size={12} className="text-primary-500" /> 版本迭代号 (VERSION) <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              value={formData.version}
              onChange={(e) => setFormData({...formData, version: e.target.value})}
              placeholder="e.g. v1.2.0-beta"
              className="w-full px-4 py-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all font-mono font-bold"
            />
          </div>

          {/* 容器挂载路径 */}
          <div className="space-y-3">
            <div className="flex justify-between items-center px-1">
               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Terminal size={12} className="text-primary-500" /> 容器挂载目标路径
               </label>
               <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                  <button 
                    onClick={() => setUseDefaultPath(true)}
                    className={`px-3 py-1 text-[9px] font-black rounded-md transition-all ${useDefaultPath ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    DEFAULT
                  </button>
                  <button 
                    onClick={() => setUseDefaultPath(false)}
                    className={`px-3 py-1 text-[9px] font-black rounded-md transition-all ${!useDefaultPath ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    CUSTOM
                  </button>
               </div>
            </div>
            <input 
              type="text" 
              readOnly={useDefaultPath}
              value={formData.mountPath}
              onChange={(e) => setFormData({...formData, mountPath: e.target.value})}
              placeholder="/mnt/custom/path"
              className={`w-full px-4 py-3 text-xs border rounded-xl outline-none transition-all font-mono font-bold ${useDefaultPath ? 'bg-slate-100/50 text-slate-400 border-slate-200 cursor-not-allowed' : 'bg-white border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5'}`}
            />
            <p className="text-[8px] text-slate-400 font-bold uppercase italic ml-1 tracking-tighter">
              * 这是模型在开发环境 (IDE) 或 推理服务 Pod 中的访问路径
            </p>
          </div>

          {/* 模型源路径 */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
               <Database size={12} className="text-primary-500" /> 存储后端源路径 (SOURCE) <span className="text-red-500">*</span>
            </label>
            <div className="relative group">
               <FolderOpen size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
               <input 
                  type="text" 
                  value={formData.sourcePath}
                  onChange={(e) => setFormData({...formData, sourcePath: e.target.value})}
                  placeholder="s3://bucket-name/weights/model-v1..."
                  className="w-full pl-11 pr-4 py-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary-500 outline-none transition-all font-mono font-bold"
               />
            </div>
          </div>

          {/* 初始状态 */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
               <ShieldCheck size={12} className="text-primary-500" /> 初始发布状态
            </label>
            <div className="grid grid-cols-2 gap-3">
               {[
                 { id: 'stable', label: 'Stable (生产级)', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                 { id: 'experimental', label: 'Experimental (实验性)', color: 'text-amber-600', bg: 'bg-amber-50' }
               ].map(stat => (
                 <button 
                   key={stat.id}
                   onClick={() => setFormData({...formData, status: stat.id})}
                   className={`flex items-center justify-center py-3 border rounded-xl text-[10px] font-black uppercase tracking-tight transition-all ${formData.status === stat.id ? `border-primary-500 ${stat.bg} ${stat.color} ring-4 ring-primary-500/5` : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'}`}
                 >
                   {stat.label}
                 </button>
               ))}
            </div>
          </div>
        </div>

        {/* Note */}
        <div className="bg-primary-50/50 border border-primary-100 p-4 rounded-xl flex gap-3">
           <Info size={18} className="text-primary-500 shrink-0 mt-0.5" />
           <p className="text-[10px] text-primary-800 font-bold leading-relaxed uppercase tracking-tighter">
              提示：新版本发布后，系统将自动进行冷启动探测。建议先在“实验性”状态下进行推理链路测试，验证挂载路径的可达性。
           </p>
        </div>
      </div>
    </Drawer>
  );
};
