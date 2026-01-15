
import React, { useState, useMemo } from 'react';
import { 
  Terminal, Search, Plus, RefreshCw, 
  Code, HardDrive, Cpu, Zap, 
  Play, Square, ChevronRight, Monitor,
  ShieldCheck, Clock, Activity, Settings,
  ActivitySquare, Trash2, Layout, Info,
  MoreHorizontal, RotateCcw, MonitorPlay,
  PlayCircle, StopCircle, Globe, Gauge,
  Box, Filter, History, SearchIcon,
  PlayIcon, PauseCircle, Power, MoreVertical,
  Layers, HardDriveIcon, ZapIcon, Sparkles
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { CreateIDEModal } from '../../components/modals/CreateIDEModal';
import { IDEEnvironmentDetailsDrawer } from '../../components/modals/IDEEnvironmentDetailsDrawer';
import { MOCK_IDE_INSTANCES, MOCK_USER_MODELS } from '../../constants';
import PageHeader from '../../components/layout/PageHeader';

const IDEEnvironmentPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [modelFilter, setModelFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedInstance, setSelectedInstance] = useState<any | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [instances, setInstances] = useState(MOCK_IDE_INSTANCES);

  const filteredInstances = useMemo(() => {
    return instances.filter(ins => {
      const matchesSearch = ins.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           ins.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           ins.mountedModel.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesModel = modelFilter === 'all' || ins.mountedModelId === modelFilter;
      return matchesSearch && matchesModel;
    });
  }, [instances, searchTerm, modelFilter]);

  const handleAction = (id: string, action: 'start' | 'stop' | 'delete') => {
    setInstances(prev => prev.map(ins => {
      if (ins.id === id) {
        if (action === 'start') return { ...ins, status: 'running' };
        if (action === 'stop') return { ...ins, status: 'stopped' };
      }
      return ins;
    }).filter(ins => !(ins.id === id && action === 'delete')));
  };

  // 根据模型名称返回特定的视觉标签颜色
  const getModelBadgeType = (modelName: string): "primary" | "info" | "success" | "warning" => {
    if (modelName.includes('GPT') || modelName.includes('Stable Diffusion')) return "info"; // 生成式 - 蓝色/紫色调
    if (modelName.includes('YOLO') || modelName.includes('ResNet')) return "primary"; // 视觉 - 深蓝
    if (modelName.includes('BERT') || modelName.includes('T5')) return "success"; // NLP - 绿色
    return "neutral" as any;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 font-sans pb-20">
      <CreateIDEModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
      <IDEEnvironmentDetailsDrawer 
        isOpen={isDetailsOpen} 
        onClose={() => setIsDetailsOpen(false)} 
        instance={selectedInstance}
        onAction={handleAction}
      />

      <PageHeader 
        icon={Terminal}
        title="云端集成开发环境 (IDE)"
        subtitle="ON-DEMAND GPU SANDBOXING & DEVELOPMENT"
        badgeText="ISOLATED K8S DOMAIN"
        actions={
          <>
            <button onClick={() => window.location.reload()} className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-primary-600 transition-all shadow-sm"><RefreshCw size={18} /></button>
            <button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2.5 px-8 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-primary-500/20 active:scale-95">
              <Plus size={16} strokeWidth={3} />
              <span>新建 IDE 环境</span>
            </button>
          </>
        }
      />

      <div className="flex flex-col xl:flex-row justify-between items-center gap-5 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
         <div className="flex items-center gap-4 w-full xl:w-auto">
            <div className="relative flex-1 xl:w-80 group">
               <SearchIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-500 transition-colors" />
               <input 
                  type="text" 
                  placeholder="搜索环境、ID 或 挂载模型..." 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  className="w-full pl-12 pr-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] border border-slate-200 rounded-2xl bg-slate-50 focus:bg-white focus:outline-none focus:border-primary-500 transition-all font-sans" 
               />
            </div>
            
            <div className="h-6 w-px bg-slate-200"></div>

            <div className="flex items-center gap-3">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest hidden sm:block">模型类型:</span>
               <select 
                  value={modelFilter}
                  onChange={(e) => setModelFilter(e.target.value)}
                  className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-primary-500 cursor-pointer"
               >
                  <option value="all">ALL ASSET TYPES</option>
                  {MOCK_USER_MODELS.map(m => <option key={m.id} value={m.id}>{m.displayName.toUpperCase()}</option>)}
               </select>
            </div>
         </div>
         
         <div className="flex items-center gap-3 text-slate-400">
            <Badge status="info" showDot={false}>AUTO-RECOVERY: ENABLED</Badge>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
         {filteredInstances.map((ws) => (
            <div 
               key={ws.id} 
               onClick={() => { setSelectedInstance(ws); setIsDetailsOpen(true); }}
               className={`group bg-white border rounded-[40px] p-8 hover:shadow-2xl transition-all duration-500 flex flex-col relative overflow-hidden cursor-pointer ${ws.status === 'running' ? 'border-slate-200 hover:border-primary-400' : 'border-slate-100 opacity-80'}`}
            >
               {/* Header Segment */}
               <div className="flex justify-between items-start mb-8 relative z-10">
                  <div className="flex items-center gap-4">
                     <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-500 ${ws.status === 'running' ? 'bg-emerald-50 border-emerald-100 text-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                        {ws.type === 'JupyterLab' ? <Layout size={28} /> : <Code size={28} />}
                     </div>
                     <div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tighter uppercase leading-none group-hover:text-primary-600 transition-colors mb-2">{ws.name}</h3>
                        <div className="flex items-center gap-2">
                           <Badge status={ws.status === 'running' ? 'success' : ws.status === 'stopped' ? 'neutral' : 'error'}>
                              {ws.status === 'running' ? '运行中' : ws.status === 'stopped' ? '停止' : '异常'}
                           </Badge>
                           <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-tighter">{ws.id}</span>
                        </div>
                     </div>
                  </div>
                  <button className="p-2 text-slate-300 hover:text-slate-900 transition-all"><MoreVertical size={18} /></button>
               </div>

               {/* Specs Summary Segment */}
               <div className="grid grid-cols-2 gap-6 mb-8 p-5 bg-slate-50/50 rounded-3xl border border-slate-100/50 group-hover:bg-primary-50/20 transition-all">
                  <div className="space-y-1">
                     <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">基础镜像</p>
                     <p className="text-[11px] font-bold text-slate-800 truncate" title={ws.image}>{ws.image}</p>
                  </div>
                  <div className="space-y-1">
                     <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">挂载资产</p>
                     <div className="flex items-center gap-1.5 overflow-hidden">
                        <Badge status={getModelBadgeType(ws.mountedModel)} showDot={false}>{ws.mountedModel}</Badge>
                     </div>
                  </div>
                  <div className="space-y-1">
                     <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">算力规格</p>
                     <p className="text-[11px] font-bold text-slate-800 font-mono tracking-tighter">{ws.resources.gpu} | {ws.resources.cpu}</p>
                  </div>
                  <div className="space-y-1">
                     <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">运行时长</p>
                     <div className="flex items-center gap-1.5">
                        <History size={10} className="text-emerald-500" />
                        <p className="text-[11px] font-bold text-slate-800 font-mono">{ws.uptime}</p>
                     </div>
                  </div>
               </div>

               {/* Card Footer Actions */}
               <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                     <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500 border border-slate-200">
                        {ws.owner[0].toUpperCase()}
                     </div>
                     <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{ws.owner}</span>
                  </div>
                  <button 
                     disabled={ws.status !== 'running'} 
                     onClick={(e) => { e.stopPropagation(); alert('Initializing IDE Connection...'); }}
                     className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95 ${ws.status === 'running' ? 'bg-slate-950 text-white hover:bg-primary-600' : 'bg-slate-100 text-slate-300 cursor-not-allowed'}`}
                  >
                     OPEN IDE <MonitorPlay size={14} strokeWidth={3} />
                  </button>
               </div>
            </div>
         ))}

         {/* Empty/Add Slot */}
         <div 
            onClick={() => setIsCreateModalOpen(true)}
            className="border-2 border-dashed border-slate-200 rounded-[40px] p-8 flex flex-col items-center justify-center text-center group hover:border-primary-400 hover:bg-primary-50/10 transition-all cursor-pointer min-h-[400px]"
         >
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 group-hover:bg-white group-hover:text-primary-600 group-hover:shadow-xl group-hover:scale-110 transition-all duration-500 mb-8">
               <Plus size={40} strokeWidth={2.5} />
            </div>
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-[0.3em] mb-3">Provision New Sandbox</h4>
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest max-w-[200px]">Create an isolated GPU environment with custom frameworks</p>
         </div>
      </div>
    </div>
  );
};

export default IDEEnvironmentPage;
