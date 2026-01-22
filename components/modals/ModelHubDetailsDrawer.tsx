
import React from 'react';
import { Drawer } from '../ui/Drawer';
import { Badge } from '../ui/Badge';
import { 
  Globe, Info, Code, User, Shield, ShieldCheck,
  Clock, Layers, Database, Gauge, 
  GitBranch, Tag, ExternalLink, Box,
  MonitorPlay, Rocket, FileText, Calendar,
  Share2, Hash, Zap, History, Layout,
  Binary, FileSearch
} from 'lucide-react';

interface ModelHubDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  model: any;
  onDeploy: (model: any) => void;
  onTrial: (model: any) => void;
}

export const ModelHubDetailsDrawer: React.FC<ModelHubDetailsDrawerProps> = ({ 
  isOpen, onClose, model, onDeploy, onTrial 
}) => {
  if (!model) return null;

  const DetailRow = ({ label, value, icon: Icon, isLink = false, url = '' }: any) => (
    <div className="flex justify-between py-4 border-b border-slate-50 last:border-0 items-center">
      <div className="flex items-center gap-2.5">
        {Icon && <Icon size={14} className="text-slate-300" strokeWidth={2.5} />}
        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{label}</span>
      </div>
      {isLink ? (
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-xs font-black text-primary-600 hover:underline flex items-center gap-1.5"
        >
          {value} <ExternalLink size={12} />
        </a>
      ) : (
        <span className="text-xs font-bold text-slate-800 text-right max-w-[240px] truncate">{value}</span>
      )}
    </div>
  );

  const SpecCard = ({ label, value, icon: Icon, sub }: any) => (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-1.5 hover:bg-white/10 transition-all shadow-inner">
      <div className="flex items-center gap-2 text-[8px] font-black text-slate-500 uppercase tracking-[0.15em]">
        <Icon size={10} className="text-primary-400" /> {label}
      </div>
      <p className="text-[13px] font-black text-white font-mono leading-none mt-1">{value}</p>
      {sub && <p className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">{sub}</p>}
    </div>
  );

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-slate-950 rounded-lg flex items-center justify-center text-white shadow-lg border border-white/10">
             <Globe size={16} strokeWidth={2.5} />
          </div>
          <span className="font-black uppercase tracking-tight text-slate-900">模型广场资产审计</span>
        </div>
      }
      description={`ASSET_REGISTRY_ID: ${model.id}`}
      width="max-w-4xl"
      footer={
        <div className="flex gap-4 w-full">
           <button 
             onClick={() => onTrial(model)}
             className="flex-1 py-3.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-slate-800 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-sm"
           >
             <MonitorPlay size={15} strokeWidth={2.5} /> 快速试用 (PLAYGROUND)
           </button>
           <button 
             onClick={() => onDeploy(model)}
             className="flex-1 py-3.5 bg-primary-600 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary-700 shadow-xl shadow-primary-500/30 flex items-center justify-center gap-3 transition-all active:scale-95"
           >
             一键部署服务 (DEPLOY) <Rocket size={15} strokeWidth={2.5} />
           </button>
        </div>
      }
    >
      <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500 pb-10 font-sans">
        
        {/* 1. Hero Identity Block */}
        <div className="bg-slate-950 rounded-[40px] p-10 border border-slate-800 relative overflow-hidden shadow-2xl group">
           <div className="absolute inset-0 tech-grid opacity-[0.03]"></div>
           <div className="absolute top-0 right-0 p-12 opacity-5 text-white pointer-events-none group-hover:opacity-10 transition-opacity duration-1000">
              <Layers size={240} strokeWidth={1} />
           </div>
           
           <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                 <div className="space-y-4">
                    <div className="flex items-center gap-3">
                       <div className="px-2.5 py-1 rounded-lg bg-primary-600/20 border border-primary-500/30 text-[9px] font-black text-primary-400 uppercase tracking-[0.2em]">
                          {model.taskType}
                       </div>
                       <Badge status="info" showDot={false}>{model.provider}</Badge>
                    </div>
                    <h3 className="text-3xl lg:text-4xl font-black text-white tracking-tighter leading-none uppercase">
                       {model.name}
                    </h3>
                    <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest border-l-2 border-primary-500 pl-4 py-0.5">
                       {model.displayName}
                    </p>
                 </div>
                 <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-primary-400">
                    <Code size={24} strokeWidth={2.5} />
                 </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-8 border-t border-white/10">
                 <SpecCard label="参数规模" value={model.params} icon={Binary} sub="Parameters" />
                 <SpecCard label="关键准确率" value={model.accuracy} icon={Gauge} sub="Verified Metric" />
                 <SpecCard label="计算框架" value={model.frameworkVersion} icon={Code} sub="Execution Env" />
                 <SpecCard label="权重大小" value={model.fileSize} icon={Database} sub="Storage Commit" />
              </div>
           </div>
        </div>

        {/* 2. Detailed Multi-line Description */}
        <div className="space-y-5">
           <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] flex items-center gap-2.5 px-1">
              <FileText size={16} className="text-primary-600" /> 详细模型描述 (DOCUMENTATION)
           </h4>
           <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-[0.02] text-slate-900 pointer-events-none group-hover:opacity-[0.05] transition-opacity">
                 <FileSearch size={100} />
              </div>
              <p className="text-sm text-slate-600 leading-relaxed font-medium relative z-10">
                 {model.description}
              </p>
           </div>
        </div>

        {/* 3. Administrative Metadata Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className="space-y-4">
              <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] flex items-center gap-2.5 px-1">
                 <User size={16} className="text-primary-600" /> 权属与授权 (PROVENANCE)
              </h4>
              <div className="bg-white border border-slate-200 rounded-[28px] p-6 shadow-sm divide-y divide-slate-50">
                 <DetailRow label="作者 / 组织机构" value={model.provider} isLink url={model.providerUrl} icon={User} />
                 <DetailRow label="开源许可证" value={model.license} icon={Shield} />
                 <DetailRow label="框架体系" value={model.framework} icon={Box} />
                 <DetailRow label="官方发布版" value={model.latestVersion} icon={GitBranch} />
              </div>
           </div>
           <div className="space-y-4">
              <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] flex items-center gap-2.5 px-1">
                 <History size={16} className="text-primary-600" /> 时间轴审计 (LIFECYCLE)
              </h4>
              <div className="bg-white border border-slate-200 rounded-[28px] p-6 shadow-sm divide-y divide-slate-50">
                 <DetailRow label="首次注册时间" value={model.createdAt} icon={Calendar} />
                 <DetailRow label="最后同步更新" value={model.updatedAt} icon={Clock} />
                 <DetailRow label="审计状态" value="SYSTEM_VERIFIED" icon={ShieldCheck} />
                 <DetailRow label="推理加速支持" value="CUDA / TensorRT" icon={Zap} />
              </div>
           </div>
        </div>

        {/* 4. Categorical Tags */}
        <div className="space-y-5">
           <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] flex items-center gap-2.5 px-1">
              <Tag size={16} className="text-primary-600" /> 技术与场景标签 (TAXONOMY)
           </h4>
           <div className="bg-slate-50 border border-slate-200 rounded-[32px] p-8 flex flex-wrap gap-3 shadow-inner">
              {model.tags.map((tag: string, i: number) => (
                 <span 
                   key={i} 
                   className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-primary-500 hover:text-primary-600 transition-all cursor-default shadow-sm group"
                 >
                    <span className="opacity-30 group-hover:opacity-100 transition-opacity mr-1">#</span>{tag}
                 </span>
              ))}
           </div>
        </div>

        {/* Rigorous Footer Compliance */}
        <div className="bg-primary-50 border border-primary-100 p-8 rounded-[40px] flex flex-col md:flex-row gap-8 items-center shadow-sm">
           <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary-600 shadow-xl border border-primary-50 shrink-0">
              <ShieldCheckIcon size={32} strokeWidth={2.5} />
           </div>
           <div className="flex-1 text-center md:text-left">
              <p className="text-[12px] font-black text-slate-900 uppercase tracking-widest">企业级生产资产分发协议</p>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-2 uppercase tracking-tight">
                 该模型资产已通过 AI-Nex 安全审计沙箱认证。支持一键映射至分布式 GPU 生产集群，并自动注入运行时所需的 CUDA 内核与库。部署前请确保目标项目具有足够的显存配额。
              </p>
           </div>
        </div>
      </div>
    </Drawer>
  );
};

// Internal icon proxy for ShieldCheck if missing from previous scope
const ShieldCheckIcon = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
);
