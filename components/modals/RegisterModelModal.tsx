
import React, { useState } from 'react';
import { Drawer } from '../ui/Drawer';
import { 
  Box, FileCode, UploadCloud, Database, 
  Save, ShieldCheck, Info, Globe, 
  Cpu, GitBranch, Terminal, HardDrive
} from 'lucide-react';
import { Badge } from '../ui/Badge';

interface RegisterModelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RegisterModelModal: React.FC<RegisterModelModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'NLP',
    uploadMethod: 'SDK',
    storageType: 'S3',
    description: ''
  });

  const handleSubmit = () => {
    if (!formData.name) return;
    console.log('Registering Model Asset:', formData);
    onClose();
  };

  const footerContent = (
    <div className="flex gap-3 w-full">
      <button 
        onClick={onClose}
        className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
      >
        取消操作
      </button>
      <button 
        onClick={handleSubmit}
        disabled={!formData.name}
        className="flex-1 py-2.5 bg-primary-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-700 shadow-lg shadow-primary-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
      >
        <Save size={14} /> 确认注册资产
      </button>
    </div>
  );

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Box size={20} className="text-primary-600" />
          <span className="font-black uppercase tracking-tight">注册新模型资产</span>
        </div>
      }
      description="Registering pre-trained weights to centralized asset registry"
      width="max-w-md"
      footer={footerContent}
    >
      <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
        {/* Header Visual */}
        <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-5 text-white"><Box size={100} /></div>
           <div className="relative z-10">
              <Badge status="primary" showDot={false}>REGISTRY WIZARD</Badge>
              <p className="text-[10px] text-slate-400 mt-4 font-bold uppercase tracking-widest leading-relaxed">
                 该操作将创建一个全局唯一的模型标识，用于后续的训练微调、版本管理及推理部署任务。
              </p>
           </div>
        </div>

        <div className="space-y-6">
          {/* 模型名称 */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
               <FileCode size={12} className="text-primary-500" /> 模型资产名称 <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="e.g. BERT-Fin-Sentiment-v2"
              className="w-full px-4 py-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all font-mono font-bold"
            />
          </div>

          {/* 模型类型 */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
               <Cpu size={12} className="text-primary-500" /> 模型领域类型
            </label>
            <select 
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              className="w-full px-4 py-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary-500 outline-none transition-all font-bold text-slate-800 cursor-pointer"
            >
              <option value="NLP">NLP / 语言模型 (Large Language Model)</option>
              <option value="CV">CV / 计算机视觉 (Computer Vision)</option>
              <option value="Audio">Audio / 语音信号处理 (Speech)</option>
              <option value="Multi-modal">Multi-modal / 多模态融合</option>
              <option value="Recommendation">Recommendation / 推荐系统</option>
            </select>
          </div>

          {/* 上传方式 */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
               <UploadCloud size={12} className="text-primary-500" /> 上传/接入方式
            </label>
            <div className="grid grid-cols-2 gap-3">
               {[
                 { id: 'SDK', label: 'SDK Push', icon: Terminal },
                 { id: 'Git', label: 'Git LFS', icon: GitBranch },
                 { id: 'Web', label: 'Local Upload', icon: UploadCloud },
                 { id: 'Path', label: 'Offline Path', icon: HardDrive }
               ].map(method => (
                 <button 
                   key={method.id}
                   onClick={() => setFormData({...formData, uploadMethod: method.id})}
                   className={`flex items-center gap-3 p-3 border rounded-xl transition-all ${formData.uploadMethod === method.id ? 'bg-primary-50 border-primary-500 ring-4 ring-primary-500/5 shadow-sm' : 'bg-white border-slate-200 hover:border-slate-300'}`}
                 >
                    <div className={`p-1.5 rounded-lg ${formData.uploadMethod === method.id ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                       <method.icon size={14} />
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-tight ${formData.uploadMethod === method.id ? 'text-primary-700' : 'text-slate-500'}`}>{method.label}</span>
                 </button>
               ))}
            </div>
          </div>

          {/* 存储类型 */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
               <Database size={12} className="text-primary-500" /> 后端存储引擎
            </label>
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
               {['S3', 'MinIO', 'HDFS', 'Ceph'].map(storage => (
                 <button
                   key={storage}
                   onClick={() => setFormData({...formData, storageType: storage})}
                   className={`flex-1 py-2 text-[10px] font-black rounded-lg transition-all ${formData.storageType === storage ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                 >
                   {storage}
                 </button>
               ))}
            </div>
          </div>

          {/* 描述信息 */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">资产详细描述 (Optional)</label>
            <textarea 
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="请输入模型的用途、训练语料规模或性能指标说明..."
              className="w-full px-4 py-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary-500 outline-none transition-all resize-none"
            />
          </div>
        </div>

        {/* Audit Info */}
        <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-xl flex gap-3">
           <ShieldCheck size={18} className="text-amber-500 shrink-0 mt-0.5" />
           <p className="text-[10px] text-amber-800 font-bold leading-relaxed uppercase tracking-tighter">
              提示：注册成功后，系统将自动生成模型 endpoint。请确保存储桶（Bucket）权限已配置，以便模型分发系统正常拉取权重。
           </p>
        </div>
      </div>
    </Drawer>
  );
};
