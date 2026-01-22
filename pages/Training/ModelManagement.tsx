
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
  Tag, Calendar, Code, DownloadCloud, Fingerprint,
  SortAsc, SortDesc, ArrowUpDown
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { RegisterModelModal } from '../../components/modals/RegisterModelModal';
import { ModelAssetDetailsDrawer } from '../../components/modals/ModelAssetDetailsDrawer';
import { CustomSelect } from '../../components/ui/Select';
import { MOCK_USER_MODELS } from '../../constants';

interface ModelManagementProps {
  navigate?: (module: any, page: string) => void;
}

const ModelManagementPage: React.FC<ModelManagementProps> = ({ navigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [frameworkFilter, setFrameworkFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortField, setSortField] = useState<'updatedAt' | 'displayName'>('updatedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  const [selectedModel, setSelectedModel] = useState<any | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [detailsTab, setDetailsTab] = useState<'overview' | 'versions' | 'config' | 'audit'>('overview');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const getFrameworkBadge = (fw: string) => {
    const name = fw.toLowerCase();
    const style = name.includes('pytorch') 
      ? 'bg-orange-50 border-orange-100 text-orange-600' 
      : name.includes('tensorflow') 
        ? 'bg-amber-50 border-amber-100 text-amber-600'
        : 'bg-blue-50 border-blue-100 text-blue-600';
    return (
      <span className={`px-2 py-0.5 rounded-lg border font-mono text-[8px] font-black uppercase tracking-wider ${style}`}>
        {fw.split(' / ')[0]}
      </span>
    );
  };

  const filteredAndSortedModels = useMemo(() => {
    let result = MOCK_USER_MODELS.filter(model => {
      const matchesSearch = model.displayName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           model.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           model.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFramework = frameworkFilter === 'all' || model.framework.startsWith(frameworkFilter);
      const matchesType = typeFilter === 'all' || model.type === typeFilter;
      
      return matchesSearch && matchesFramework && matchesType;
    });

    result.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'updatedAt') {
        comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      } else {
        comparison = a.displayName.localeCompare(b.displayName);
      }
      return sortDirection === 'desc' ? -comparison : comparison;
    });

    return result;
  }, [searchTerm, frameworkFilter, typeFilter, sortField, sortDirection]);

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
        className="group relative bg-white border border-slate-200 rounded-[40px] p-0 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.08)] hover:border-primary-500 transition-all duration-500 cursor-pointer flex flex-col h-full overflow-hidden"
      >
        <div className="p-8 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-10">
            <div className="flex items-center gap-4 min-w-0">
               <div className="w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 bg-slate-50 border-slate-100 text-slate-400 group-hover:border-primary-100 group-hover:bg-primary-50 group-hover:text-primary-600 shadow-sm shrink-0">
                  <Box size={28} strokeWidth={2.2} />
               </div>
               <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                     <h3 className="text-[17px] font-black text-slate-900 tracking-tight leading-none group-hover:text-primary-600 transition-colors uppercase truncate">
                       {model.displayName}
                     </h3>
                     {getFrameworkBadge(model.framework)}
                  </div>
                  <div className="flex items-center gap-2">
                     <span className="text-[9px] font-mono font-black text-slate-400 uppercase tracking-tighter shrink-0">ID: {model.id.split('-').pop()}</span>
                     <div className="w-1 h-1 rounded-full bg-slate-200 shrink-0"></div>
                     <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest truncate">{model.name}</span>
                  </div>
               </div>
            </div>
            
            <div className="flex flex-col items-end gap-1.5 shrink-0 ml-4">
              <div className="flex items-center bg-slate-50/80 border border-slate-200 px-3 py-1.5 rounded-xl group-hover:bg-white group-hover:border-primary-200 transition-all shadow-sm">
                <GitBranch size={10} className="text-primary-500 mr-2" strokeWidth={3} />
                <span className="text-[10px] font-mono font-black text-slate-600 tracking-tighter leading-none mr-2 border-r border-slate-200 pr-2">
                   {model.latestVersion.toUpperCase()}
                </span>
                <div className="flex items-center gap-1.5">
                   <div className={`w-1.5 h-1.5 rounded-full ${model.status === 'stable' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]' : 'bg-amber-50 animate-pulse'}`}></div>
                   <span className={`text-[9px] font-black uppercase tracking-widest ${model.status === 'stable' ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {model.status}
                   </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-px bg-slate-100 border border-slate-100 rounded-[24px] overflow-hidden mb-8 shadow-inner">
             <div className="p-4 bg-white space-y-1 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-1.5 text-[8px] font-black text-slate-400 uppercase tracking-widest">
                   <Fingerprint size={10} className="text-primary-500" /> Architecture
                </div>
                <p className="text-[11px] font-black text-slate-800 font-mono tracking-tighter uppercase leading-none">{model.type}</p>
             </div>
             <div className="p-4 bg-white space-y-1 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-1.5 text-[8px] font-black text-slate-400 uppercase tracking-widest">
                   <DownloadCloud size={10} className="text-primary-500" /> Downloads
                </div>
                {/* Complete the truncated component logic */}
                <p className="text-[11px] font-black text-slate-800 font-mono tracking-tighter leading-none">
                  {totalDownloads} UNITS
                </p>
             </div>
          </div>

          <div className="mt-auto space-y-5">
             <div className="flex flex-wrap gap-2 min-h-[48px] content-start">
               <Badge status="primary" showDot={false}>{model.type}</Badge>
               <Badge status="info" showDot={false}>{model.owner}</Badge>
               <span className="px-2 py-0.5 rounded-lg bg-slate-50 border border-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Database size={10} /> {model.size}
               </span>
             </div>

             <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                <div className="flex flex-col">
                   <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Last Synced</span>
                   <span className="text-[10px] font-black text-slate-700 font-mono uppercase tracking-tighter">{model.updatedAt}</span>
                </div>
                <div className="flex items-center gap-2">
                   <button 
                      onClick={handleIDEDebug}
                      className="p-2.5 bg-slate-50 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all border border-transparent hover:border-primary-100"
                      title="Open in IDE"
                   >
                      <Terminal size={18} strokeWidth={2.5} />
                   </button>
                   <div className="p-2.5 rounded-xl bg-slate-50 text-slate-300 group-hover:text-primary-600 group-hover:bg-primary-50 transition-all duration-300">
                      <ChevronRight size={20} strokeWidth={3} />
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 font-sans">
      <RegisterModelModal isOpen={isRegisterModalOpen} onClose={() => setIsRegisterModalOpen(false)} />
      <ModelAssetDetailsDrawer 
        isOpen={isDetailsOpen} 
        onClose={() => setIsDetailsOpen(false)} 
        model={selectedModel} 
        initialTab={detailsTab} 
      />

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white border border-slate-200 p-8 rounded-4xl shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity duration-700">
           <Box size={160} strokeWidth={1} />
        </div>
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-16 h-16 bg-slate-950 rounded-2xl flex items-center justify-center text-white shadow-2xl">
            <Box size={32} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase leading-none">模型资产治理中心</h1>
            <div className="flex items-center gap-4 mt-3.5">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] flex items-center gap-2">
                <ShieldCheck size={14} className="text-emerald-500" /> ASSET INTEGRITY NOMINAL
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic font-mono">ENTERPRISE MODEL REGISTRY</p>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setIsRegisterModalOpen(true)}
          className="flex items-center gap-2.5 px-8 py-4 bg-primary-600 text-white rounded-2xl hover:bg-primary-700 transition-all font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-primary-500/30 active:scale-95 group/btn"
        >
          <Plus size={18} strokeWidth={3} className="group-hover/btn:rotate-90 transition-transform" />
          <span>注册新模型资产</span>
        </button>
      </div>

      <div className="flex flex-col xl:flex-row justify-between items-center gap-5 bg-white p-4 rounded-[28px] border border-slate-200 shadow-sm">
         <div className="flex items-center gap-4 w-full xl:w-auto">
            <div className="relative flex-1 xl:w-80 group">
               <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-500 transition-colors pointer-events-none" />
               <input 
                 type="text" 
                 placeholder="ID / MODEL SEARCH..." 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full pl-12 pr-4 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] border border-slate-200 rounded-2xl bg-slate-50 focus:bg-white focus:outline-none focus:border-primary-500 transition-all"
               />
            </div>
            
            <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

            <div className="flex flex-wrap items-center gap-3">
               <CustomSelect
                 options={[
                   { value: 'all', label: 'All Frameworks' },
                   { value: 'PyTorch', label: 'PyTorch' },
                   { value: 'TensorFlow', label: 'TensorFlow' }
                 ]}
                 value={frameworkFilter}
                 onChange={setFrameworkFilter}
                 className="w-44"
               />
               <CustomSelect
                 options={[
                   { value: 'all', label: 'All Modalities' },
                   { value: 'NLP', label: 'NLP' },
                   { value: 'CV', label: 'CV' }
                 ]}
                 value={typeFilter}
                 onChange={setTypeFilter}
                 className="w-40"
               />
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredAndSortedModels.map(model => (
          <ModelCard key={model.id} model={model} />
        ))}
      </div>
    </div>
  );
};

// Fix: Add missing default export
export default ModelManagementPage;
