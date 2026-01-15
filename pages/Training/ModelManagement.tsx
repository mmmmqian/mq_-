
import React, { useState, useMemo } from 'react';
import { 
  Box, Search, Plus, Filter, 
  GitBranch, Clock, User, HardDrive, 
  ChevronRight, MoreHorizontal, Download, 
  ShieldCheck, Activity, BarChart3, Database,
  Terminal, Rocket, Copy, CheckCircle2,
  FileCode, Info, Trash2, ArrowRight,
  Zap, Settings, History, Layers,
  FlaskConical, Gauge, LineChart, ShieldAlert,
  Tag, Calendar, Code, DownloadCloud, Fingerprint
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import PageHeader from '../../components/layout/PageHeader';
import { RegisterModelModal } from '../../components/modals/RegisterModelModal';
import { ModelAssetDetailsDrawer } from '../../components/modals/ModelAssetDetailsDrawer';
import { MOCK_USER_MODELS } from '../../constants';

interface ModelManagementProps {
  navigate?: (module: any, page: string) => void;
}

const ModelManagementPage: React.FC<ModelManagementProps> = ({ navigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModel, setSelectedModel] = useState<any | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [detailsTab, setDetailsTab] = useState<'overview' | 'versions' | 'config' | 'audit'>('overview');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const filteredModels = useMemo(() => {
    return MOCK_USER_MODELS.filter(model => {
      const matchesSearch = model.displayName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           model.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           model.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [searchTerm]);

  const ModelCard = ({ model }: any) => {
    const handleIDEDebug = (e: React.MouseEvent) => {
      e.stopPropagation();
      navigate?.('training', 'ide-env');
    };

    const handleOpenDetails = (tab: typeof detailsTab = 'overview') => {
      setSelectedModel(model);
      setDetailsTab(tab);
      setIsDetailsOpen(true);
    };

    const totalDownloads = model.versions?.reduce((acc: number, v: any) => {
      const d = v.downloads?.replace(/[^\d.]/g, '') || '0';
      const multiplier = v.downloads?.includes('k') ? 1000 : 1;
      return acc + parseFloat(d) * multiplier;
    }, 0) || 1200;

    return (
      <div 
        onClick={() => handleOpenDetails('overview')}
        className="group relative bg-white border border-slate-200 rounded-[32px] p-0 hover:shadow-2xl hover:border-primary-500 transition-all duration-500 cursor-pointer flex flex-col h-full overflow-hidden"
      >
        {/* Top visual accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-slate-50 group-hover:bg-primary-500 transition-colors duration-500"></div>
        
        <div className="p-7 flex-1 flex flex-col">
          {/* Header Section: Integrated Identity & Release Status */}
          <div className="flex justify-between items-start mb-10">
            <div className="flex items-center gap-4 min-w-0">
               <div className="w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 bg-slate-50 border-slate-100 text-slate-400 group-hover:border-primary-100 group-hover:bg-primary-50 group-hover:text-primary-600 shadow-sm shrink-0">
                  <Box size={28} strokeWidth={2.2} />
               </div>
               <div className="min-w-0">
                  <h3 className="text-[17px] font-black text-slate-900 tracking-tight leading-none group-hover:text-primary-600 transition-colors uppercase truncate">
                    {model.displayName}
                  </h3>
                  <div className="flex items-center gap-2 mt-2.5">
                     <span className="text-[9px] font-mono font-black text-slate-400 uppercase tracking-tighter shrink-0">ID: {model.id.split('-').pop()}</span>
                     <div className="w-1 h-1 rounded-full bg-slate-200 shrink-0"></div>
                     <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest truncate">{model.name}</span>
                  </div>
               </div>
            </div>
            
            {/* Refined Version & Status Integrated Block (Optimized for harmonious visual) */}
            <div className="flex flex-col items-end gap-1.5 shrink-0 ml-4">
              <div className="flex items-center bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl group-hover:bg-white group-hover:border-primary-200 transition-all shadow-sm">
                <GitBranch size={10} className="text-primary-500 mr-2" strokeWidth={3} />
                <span className="text-[10px] font-mono font-black text-slate-700 tracking-tighter leading-none mr-2 border-r border-slate-200 pr-2">
                   {model.latestVersion.toUpperCase()}
                </span>
                <div className="flex items-center gap-1.5">
                   <div className={`w-1.5 h-1.5 rounded-full ${model.status === 'stable' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]' : 'bg-amber-500 animate-pulse'}`}></div>
                   <span className={`text-[9px] font-black uppercase tracking-widest ${model.status === 'stable' ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {model.status}
                   </span>
                </div>
              </div>
              <span className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em] pr-1">Deployment Version</span>
            </div>
          </div>

          {/* Optimized Technical Matrix */}
          <div className="grid grid-cols-2 gap-3 mb-8">
             <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl flex flex-col gap-1.5 hover:bg-white hover:border-primary-100 transition-all">
                <div className="flex items-center gap-1.5 text-[8px] font-black text-slate-400 uppercase tracking-widest">
                   <Code size={10} className="text-primary-500" /> Framework
                </div>
                <p className="text-[11px] font-black text-slate-800 truncate uppercase leading-none">{model.framework.split(' / ')[0]}</p>
             </div>
             <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl flex flex-col gap-1.5 hover:bg-white hover:border-primary-100 transition-all">
                <div className="flex items-center gap-1.5 text-[8px] font-black text-slate-400 uppercase tracking-widest">
                   <Fingerprint size={10} className="text-primary-500" /> Architecture
                </div>
                <p className="text-[11px] font-black text-slate-800 font-mono tracking-tighter uppercase leading-none">{model.type}</p>
             </div>
             <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl flex flex-col gap-1.5 hover:bg-white hover:border-primary-100 transition-all">
                <div className="flex items-center gap-1.5 text-[8px] font-black text-slate-400 uppercase tracking-widest">
                   <DownloadCloud size={10} className="text-primary-500" /> Downloads
                </div>
                <p className="text-[11px] font-black text-slate-800 font-mono tracking-tighter leading-none">
                  {totalDownloads >= 1000 ? `${(totalDownloads/1000).toFixed(1)}k` : totalDownloads} UNITS
                </p>
             </div>
             <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl flex flex-col gap-1.5 hover:bg-white hover:border-primary-100 transition-all">
                <div className="flex items-center gap-1.5 text-[8px] font-black text-slate-400 uppercase tracking-widest">
                   <Database size={10} className="text-primary-500" /> Storage
                </div>
                <p className="text-[11px] font-black text-slate-800 font-mono tracking-tighter leading-none">{model.size}</p>
             </div>
          </div>

          {/* Card Footer: Governance & Global Ops */}
          <div className="mt-auto pt-6 border-t border-slate-100">
             <div className="flex items-center justify-between mb-6 px-1">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-500 shadow-inner group-hover:border-primary-100 transition-all">
                    {model.owner[0].toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-800 leading-none">{model.owner}</span>
                    <span className="text-[8px] text-slate-400 font-black uppercase mt-1">Audit Provider</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                   <div className="flex items-center gap-1.5 text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">
                      <History size={10} className="text-slate-300" /> Latency Check
                   </div>
                   <p className="text-[10px] font-black text-slate-500 font-mono leading-none tracking-tighter mt-1">
                      {model.updatedAt}
                   </p>
                </div>
             </div>

             <div className="grid grid-cols-3 gap-2" onClick={e => e.stopPropagation()}>
                <button 
                  onClick={() => handleOpenDetails('versions')}
                  className="py-3 bg-white border border-slate-200 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 hover:border-slate-400 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-sm"
                >
                   <GitBranch size={13} strokeWidth={2.5} /> 版本
                </button>
                <button 
                  onClick={handleIDEDebug}
                  className="py-3 bg-white border border-slate-200 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 hover:border-slate-400 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-sm"
                >
                   <Terminal size={13} strokeWidth={2.5} /> 调试
                </button>
                <button 
                  onClick={() => handleOpenDetails('overview')}
                  className="py-3 bg-primary-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-700 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-primary-500/20"
                >
                   <Rocket size={13} strokeWidth={2.5} /> 部署
                </button>
             </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 font-sans pb-24">
      <RegisterModelModal isOpen={isRegisterModalOpen} onClose={() => setIsRegisterModalOpen(false)} />
      <ModelAssetDetailsDrawer 
        isOpen={isDetailsOpen} 
        onClose={() => setIsDetailsOpen(false)} 
        model={selectedModel}
        initialTab={detailsTab}
      />

      <PageHeader 
        icon={Box}
        title="模型资产管理"
        subtitle="ENTERPRISE AI REGISTRY & AUDIT CONSOLE"
        badgeText="ASSET INTEGRITY READY"
        actions={
          <button 
            onClick={() => setIsRegisterModalOpen(true)}
            className="flex items-center gap-2.5 px-7 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-primary-500/20 active:scale-95"
          >
            <Plus size={18} strokeWidth={3} />
            <span>注册新资产</span>
          </button>
        }
      />

      <div className="flex flex-col xl:flex-row justify-between items-center gap-5 bg-white p-4 rounded-[28px] border border-slate-200 shadow-sm">
         <div className="flex items-center gap-4 w-full xl:w-auto">
            <div className="relative flex-1 xl:w-80 group">
               <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-500 pointer-events-none" />
               <input 
                  type="text" 
                  placeholder="搜索资产名称 / ID / 架构..." 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  className="w-full pl-11 pr-4 py-2.5 text-[10px] font-black uppercase tracking-widest border border-slate-100 rounded-2xl bg-slate-50 focus:bg-white focus:border-primary-500 transition-all placeholder:text-slate-300" 
               />
            </div>
            <div className="h-6 w-px bg-slate-100 hidden sm:block"></div>
            <button className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary-600 transition-all">
               <Filter size={16} /> Advanced Audit Filter
            </button>
         </div>
         <div className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
            <div className="flex items-center gap-1.5">
               <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
               <span className="text-[9px] font-black text-slate-600 uppercase">Certified: {MOCK_USER_MODELS.filter(m=>m.status==='stable').length}</span>
            </div>
            <div className="w-px h-3 bg-slate-200"></div>
            <div className="flex items-center gap-1.5">
               <div className="w-2 h-2 rounded-full bg-amber-500"></div>
               <span className="text-[9px] font-black text-slate-600 uppercase">Staging: {MOCK_USER_MODELS.filter(m=>m.status!=='stable').length}</span>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
         {filteredModels.map((model) => (
            <ModelCard key={model.id} model={model} />
         ))}

         <div 
            onClick={() => setIsRegisterModalOpen(true)}
            className="border-2 border-dashed border-slate-200 rounded-[32px] p-8 flex flex-col items-center justify-center text-center group hover:border-primary-200 hover:bg-primary-50/5 transition-all cursor-pointer min-h-[440px]"
         >
            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 group-hover:bg-white group-hover:text-primary-600 group-hover:shadow-lg group-hover:scale-110 transition-all duration-500 mb-6">
               <Plus size={32} strokeWidth={2.5} />
            </div>
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] mb-2">Register Asset</h4>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest max-w-[220px] leading-relaxed">建立企业级权重文件与元数据的合规映射，锁定资产谱系</p>
         </div>
      </div>
    </div>
  );
};

export default ModelManagementPage;
