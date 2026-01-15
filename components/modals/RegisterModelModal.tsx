
import React, { useState } from 'react';
import { Drawer } from '../ui/Drawer';
import { 
  Box, FileCode, Database, 
  Save, ShieldCheck, Cpu, 
  HardDrive, Info, Share2,
  Lock, Layout, ChevronRight,
  Globe, Terminal, FolderKanban
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
    uploadMethod: 'S3_MOUNT', // 锁定为 S3/OSS 挂载
    storageType: 'S3',
    description: ''
  });

  const handleSubmit = () => {
    if (!formData.name) return;
    console.log('[REGISTRY_AUDIT] Registering Model Asset:', formData);
    onClose();
  };

  const footerContent = (
    <div className="flex gap-4 w-full">
      <button 
        onClick={onClose}
        className="flex-1 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
      >
        CANCEL_SESSION
      </button>
      <button 
        onClick={handleSubmit}
        disabled={!formData.name}
        className="flex-1 py-3 bg-primary-600 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary-700 shadow-xl shadow-primary-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:grayscale"
      >
        <Save size={14} strokeWidth={3} /> INITIALIZE_REGISTRY
      </button>
    </div>
  );

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-slate-950 rounded-lg flex items-center justify-center text-white shadow-lg">
            <Box size={16} strokeWidth={2.5} />
          </div>
          <span className="font-black uppercase tracking-tight text-slate-900">注册新模型资产</span>
        </div>
      }
      description="ENTERPRISE ASSET ONBOARDING PROTOCOL"
      width="max-w-xl"
      footer={footerContent}
    >
      <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500 pb-10">
        
        {/* 顶部引导卡片 */}
        <div className="bg-slate-950 rounded-[32px] p-8 border border-slate-800 relative overflow-hidden shadow-2xl group">
           <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-white pointer-events-none group-hover:opacity-[0.08] transition-opacity duration-700">
              <ShieldCheck size={160} strokeWidth={1} />
           </div>
           <div className="relative z-10">
              <Badge status="primary" showDot={false}>REGISTRY WIZARD v2.5</Badge>
              <h4 className="text-white text-lg font-black uppercase mt-4 tracking-tight">资产注册合规向导</h4>
              <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase tracking-widest leading-relaxed">
                 注册操作将为权重模型分配全局唯一 ID (UUID)，并建立生产环境可访问的存储拓扑映射。
              </p>
           </div>
        </div>

        <div className="space-y-8">
           {/* Section 1: Identity */}
           <div className="space-y-6">
              <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
                 <Terminal size={14} className="text-primary-500" /> 基础身份定义 (IDENTITY)
              </h5>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                       模型资产名称 <span className="text-red-500">*</span>
                    </label>
                    <div className="relative group">
                       <FileCode size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                       <input 
                         type="text" 
                         value={formData.name}
                         onChange={(e) => setFormData({...formData, name: e.target.value})}
                         placeholder="e.g. LLAMA-3-PROD-FIN"
                         className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono font-bold focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all"
                       />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                       核心模型类型
                    </label>
                    <select 
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold focus:bg-white focus:border-primary-500 outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="NLP">NLP (Natural Language)</option>
                      <option value="CV">CV (Computer Vision)</option>
                      <option value="Audio">Audio (Speech Signal)</option>
                      <option value="Multi-modal">Multi-modal (V&L)</option>
                    </select>
                 </div>
              </div>
           </div>

           {/* Section 2: Storage & Protocol */}
           <div className="space-y-6">
              <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
                 <Database size={14} className="text-primary-500" /> 存储协议配置 (STORAGE_SPEC)
              </h5>

              <div className="space-y-5">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                       上传/接入方式
                    </label>
                    <div className="p-4 bg-primary-50/50 border border-primary-100 rounded-2xl flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-white border border-primary-200 rounded-xl flex items-center justify-center text-primary-600 shadow-sm">
                             <Globe size={20} strokeWidth={2.5} />
                          </div>
                          <div>
                             <p className="text-[11px] font-black text-slate-900 uppercase">S3 / OSS 对象存储挂载</p>
                             <p className="text-[8px] font-bold text-primary-600 uppercase tracking-widest mt-1 italic">SYSTEM_DEFAULT_PROTOCOL</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                          <span className="text-[9px] font-black text-emerald-600 uppercase">当前可用</span>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                       后端存储引擎 (STORAGE_ENGINE)
                    </label>
                    <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
                       {['S3', 'MinIO', 'OSS', 'HDFS'].map(engine => (
                          <button
                            key={engine}
                            onClick={() => setFormData({...formData, storageType: engine})}
                            className={`flex-1 py-2.5 rounded-xl text-[10px] font-black transition-all ${formData.storageType === engine ? 'bg-white text-primary-600 shadow-md ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                          >
                             {engine}
                          </button>
                       ))}
                    </div>
                 </div>
              </div>
           </div>

           {/* Section 3: Metadata */}
           <div className="space-y-6">
              <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
                 <Layout size={14} className="text-primary-500" /> 描述与元数据 (METADATA)
              </h5>
              <div className="space-y-2">
                 <textarea 
                   rows={4}
                   value={formData.description}
                   onChange={(e) => setFormData({...formData, description: e.target.value})}
                   placeholder="请输入模型资产的业务用途、训练框架、精度要求或版本说明等审计信息..."
                   className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-3xl text-xs font-medium focus:bg-white focus:border-primary-500 outline-none transition-all resize-none leading-relaxed"
                 />
              </div>
           </div>
        </div>

        {/* Note Footer */}
        <div className="bg-primary-50/50 border border-primary-100 p-6 rounded-[28px] flex gap-5">
           <Info size={24} className="text-primary-600 shrink-0 mt-0.5" />
           <div className="space-y-1.5">
              <h6 className="text-[10px] font-black text-primary-900 uppercase tracking-widest">后续操作指引</h6>
              <p className="text-[11px] text-primary-800/80 leading-relaxed font-medium">
                 资产创建后，系统将锁定该 UUID。您需要在 <span className="font-bold">“版本管理”</span> 模块中通过 SDK 或 API 上传实际权重文件，以激活该资产的推理与训练功能。
              </p>
           </div>
        </div>
      </div>
    </Drawer>
  );
};
