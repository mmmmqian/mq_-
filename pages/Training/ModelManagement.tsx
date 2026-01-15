
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
  Tag, Calendar, Code
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import PageHeader from '../../components/layout/PageHeader';
import { RegisterModelModal } from '../../components/modals/RegisterModelModal';
import { PublishModelVersionModal } from '../../components/modals/PublishModelVersionModal';
import { ModelAssetDetailsDrawer } from '../../components/modals/ModelAssetDetailsDrawer';
import { MOCK_USER_MODELS, MOCK_IDE_INSTANCES } from '../../constants';

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
    const existingIDE = MOCK_IDE_INSTANCES.find(ins => ins.mountedModelId === model.id);

    const handleIDEDebug = (e: React.MouseEvent) => {
      e.stopPropagation();
      navigate?.('training', 'ide-env');
    };

    const handleOpenDetails = (tab: typeof detailsTab = 'overview') => {
      setSelectedModel(model);
      setDetailsTab(tab);
      setIsDetailsOpen(true);
    };

    return (
      <div 
        onClick={() => handleOpenDetails('overview')}
        className="group relative bg-white border-2 border-slate-100 rounded-[32px] p-7 hover:shadow-2xl hover:border-primary-400 transition-all duration-500 cursor-pointer flex flex-col h-full overflow-hidden"
      >
        <div className="flex justify-between items-start mb-8 relative z-10">
          <div className="flex items-center gap-4">
             <div className="w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-500 bg-slate-50 border-slate-100 text-slate-400 group-hover:border-primary-100 group-hover:bg-primary-50 group-hover:text-primary-600">
                <Box size={28} strokeWidth={2.5} />
             </div>
             <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight leading-none group-hover:text-primary-600 transition-colors uppercase truncate max-w-[180px]">{model.displayName}</h3>
                <div className="flex items-center gap-2 mt-2">
                   <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-tighter">{model.name}</span>
                   <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ASSET_ID: {model.id.split('-').pop()}</span>
                </div>
             </div>
          </div>
          <button className="p-1.5 text-slate-300 hover:text-slate-500 transition-colors">
            <MoreHorizontal size={20} />
          </button>
        </div>

        {/* 核心数据矩阵 */}
        <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
           <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                 <Tag size={11} className="text-primary-500" /> Model Type
              </div>
              <p className="text-[11px] font-bold text-slate-800 tracking-tight">{model.type}</p>
           </div>
           <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                 <Code size={11} className="text-primary-500" /> Framework
              </div>
              <p className="text-[11px] font-bold text-slate-800 tracking-tight truncate">{model.framework.split(' / ')[0]}</p>
           </div>
           <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                 <GitBranch size={11} className="text-primary-500" /> Version
              </div>
              <p className="text-[11px] font-black text-slate-800 font-mono tracking-tighter uppercase">{model.latestVersion}</p>
           </div>
           <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                 <Database size={11} className="text-primary-500" /> Size
              </div>
              <p className="text-[11px] font-black text-slate-800 font-mono tracking-tighter">{model.size}</p>
           </div>
        </div>

        {/* 审计底栏 */}
        <div className="pt-6 border-t border-slate-100 flex flex-col gap-6 mt-auto">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-500">
                       {model.owner[0].toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                       <span className="text-[10px] font-bold text-slate-700 leading-none">{model.owner}</span>
                       <span className="text-[8px] text-slate-400 font-black uppercase mt-1">Uploader</span>
                    </div>
                 </div>
                 <div className="h-5 w-px bg-slate-100"></div>
                 <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">
                       <History size={10} className="text-slate-300" /> Updated
                    </div>
                    <p className="text-[9px] font-black text-slate-500 font-mono leading-none tracking-tighter mt-1">
                       {model.updatedAt}
                    </p>
                 </div>
              </div>
              <div className="flex items-center gap-1.5">
                 <div className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse"></div>
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Registry Ready</span>
              </div>
           </div>

           <div className="grid grid-cols-3 gap-2" onClick={e => e.stopPropagation()}>
              <button 
                onClick={handleIDEDebug}
                className="py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-600 transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-slate-900/10 active:scale-95"
              >
                 <Terminal size={13} /> IDE 调试
              </button>
              <button 
                onClick={() => handleOpenDetails('versions')}
                className="py-2.5 bg-slate-100 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center justify-center gap-1.5"
              >
                 <GitBranch size={13} /> 版本管理
              </button>
              <button 
                onClick={() => navigate?.('inference', 'online-service')}
                className="py-2.5 bg-primary-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-700 transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-primary-500/10 active:scale-95"
              >
                 <Rocket size={13} /> 推理部署
              </button>
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
        title="模型资产管理中心"
        subtitle="ENTERPRISE ARTIFICIAL INTELLIGENCE MODEL REGISTRY"
        badgeText="ASSET AUDIT READY"
        actions={
          <button 
            onClick={() => setIsRegisterModalOpen(true)} 
            className="flex items-center gap-2.5 px-8 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-primary-500/20 active:scale-95"
          >
            <Plus size={16} strokeWidth={3} />
            <span>注册模型资产</span>
          </button>
        }
      />

      <div className="flex flex-col xl:flex-row justify-between items-center gap-5 bg-white p-4 rounded-[28px] border border-slate-200 shadow-sm">
         <div className="flex items-center gap-4 w-full xl:w-auto">
            <div className="relative flex-1 xl:w-80 group">
               <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-500 transition-colors" />
               <input 
                 type="text" 
                 placeholder="搜索资产名称 / ID / 团队..." 
                 value={searchTerm} 
                 onChange={(e) => setSearchTerm(e.target.value)} 
                 className="w-full pl-11 pr-4 py-2.5 text-[10px] font-black uppercase tracking-widest border border-slate-200 rounded-2xl bg-slate-50 focus:bg-white focus:outline-none focus:border-primary-500 transition-all font-sans placeholder:text-slate-200" 
               />
            </div>
            <div className="h-6 w-px bg-slate-200 hidden xl:block"></div>
            <div className="px-4 py-2 bg-slate-50 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest">
               共计 {filteredModels.length} 个模型资产
            </div>
         </div>
         <div className="flex items-center gap-3">
            <button className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-400 hover:text-primary-600 transition-all"><History size={18} /></button>
            <button className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-400 hover:text-primary-600 transition-all"><Settings size={18} /></button>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
         {filteredModels.map(model => (
            <ModelCard key={model.id} model={model} />
         ))}

         <div 
           onClick={() => setIsRegisterModalOpen(true)}
           className="border-2 border-dashed border-slate-200 rounded-[32px] p-8 flex flex-col items-center justify-center text-center group hover:border-primary-300 hover:bg-primary-50/5 transition-all cursor-pointer min-h-[400px]"
         >
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 group-hover:bg-white group-hover:text-primary-600 group-hover:shadow-xl group-hover:scale-110 transition-all duration-500 mb-6">
               <Plus size={32} strokeWidth={2.5} />
            </div>
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] mb-2">Register New Asset</h4>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest max-w-[220px] leading-relaxed">
               将新训练完成的模型权重注册至全局资产中心进行统一审计与发布
            </p>
         </div>
      </div>
    </div>
  );
};

export default ModelManagementPage;
