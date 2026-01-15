
import React, { useState } from 'react';
import { 
  Box, Search, Plus, Filter, 
  GitBranch, Clock, User, HardDrive, 
  ChevronRight, MoreHorizontal, Download, 
  ShieldCheck, Activity, BarChart3, Database,
  Terminal, Rocket, Copy, CheckCircle2,
  FileCode, Info, Trash2, ArrowRight
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import StatCard from '../../components/ui/StatCard';
import { Drawer } from '../../components/ui/Drawer';
import { RegisterModelModal } from '../../components/modals/RegisterModelModal';
import { PublishModelVersionModal } from '../../components/modals/PublishModelVersionModal';
import { MOCK_USER_MODELS } from '../../constants';
import PageHeader from '../../components/layout/PageHeader';

interface ModelManagementProps {
  navigate?: (module: any, page: string) => void;
}

const ModelManagementPage: React.FC<ModelManagementProps> = ({ navigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModel, setSelectedModel] = useState<any | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isVersionOpen, setIsVersionOpen] = useState(false);
  const [isConfigViewOpen, setIsConfigViewOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isPublishVersionOpen, setIsPublishVersionOpen] = useState(false);

  const ModelCard = ({ model }: any) => (
    <div className="group bg-white border border-slate-200 rounded-4xl p-7 hover:shadow-2xl hover:border-primary-400 transition-all duration-500 flex flex-col relative overflow-hidden">
       <div className={`absolute top-0 left-0 right-0 h-1.5 ${model.status === 'stable' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
       <div className="flex justify-between items-start mb-6">
          <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-primary-600 group-hover:text-white transition-all duration-500">
             <Box size={24} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col items-end gap-2">
             <Badge status={model.status === 'stable' ? 'success' : 'warning'}>{model.status.toUpperCase()}</Badge>
             <span className="text-[10px] font-black text-slate-400 font-mono">{model.id}</span>
          </div>
       </div>
       <div className="mb-6">
          <h3 className="text-xl font-black text-slate-900 tracking-tight group-hover:text-primary-600 transition-colors uppercase truncate">{model.displayName}</h3>
          <div className="flex items-center gap-2 mt-2">
             <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-tighter">{model.name}</span>
             <div className="w-1 h-1 rounded-full bg-slate-200"></div>
             <span className="text-[10px] font-black text-primary-600 uppercase tracking-widest">{model.latestVersion}</span>
          </div>
       </div>
       <div className="grid grid-cols-2 gap-4 mb-8 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
          <div className="space-y-1">
             <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">计算框架</p>
             <p className="text-[11px] font-bold text-slate-700 truncate">{model.framework}</p>
          </div>
          <div className="space-y-1">
             <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">模型体积</p>
             <p className="text-[11px] font-bold text-slate-700">{model.size}</p>
          </div>
       </div>
       <div className="mt-auto grid grid-cols-2 gap-3 pt-6 border-t border-slate-100">
          <button onClick={() => { setSelectedModel(model); setIsVersionOpen(true); }} className="flex items-center justify-center gap-2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"><GitBranch size={14} strokeWidth={2.5} /> 版本管理</button>
          <button onClick={() => navigate?.('compute', 'tasks')} className="flex items-center justify-center gap-2 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-primary-500/10"><Rocket size={14} strokeWidth={2.5} /> 部署服务</button>
       </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700 font-sans">
      <RegisterModelModal isOpen={isRegisterModalOpen} onClose={() => setIsRegisterModalOpen(false)} />
      <PublishModelVersionModal isOpen={isPublishVersionOpen} onClose={() => setIsPublishVersionOpen(false)} model={selectedModel} />
      
      <PageHeader 
        icon={Box}
        title="自研模型资产管理"
        subtitle="INTERNAL AI MODEL SHELF & REGISTRY"
        badgeText="RIGOROUS ASSET CONTROL"
        actions={
          <button onClick={() => setIsRegisterModalOpen(true)} className="flex items-center gap-2.5 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-primary-500/20 active:scale-95">
            <Plus size={16} strokeWidth={3} />
            <span>注册新模型资产</span>
          </button>
        }
      />

      <div className="flex justify-between items-center bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
         <div className="relative group w-full md:w-96">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
            <input type="text" placeholder="SEARCH..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-11 pr-4 py-2.5 text-[10px] font-black uppercase tracking-widest border border-slate-200 rounded-2xl bg-white focus:outline-none focus:border-primary-500 w-full transition-all" />
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
         {MOCK_USER_MODELS.map(model => ( <ModelCard key={model.id} model={model} /> ))}
         <div onClick={() => setIsRegisterModalOpen(true)} className="border-2 border-dashed border-slate-200 rounded-4xl p-8 flex flex-col items-center justify-center text-center group hover:border-primary-400 hover:bg-primary-50/10 transition-all cursor-pointer">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 group-hover:bg-white group-hover:text-primary-600 group-hover:shadow-xl transition-all mb-6"><Plus size={32} strokeWidth={2.5} /></div>
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Register New Asset</h4>
         </div>
      </div>
    </div>
  );
};

export default ModelManagementPage;
