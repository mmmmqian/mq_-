
import React, { useState, useMemo } from 'react';
import { 
  Globe, Search, Filter, 
  Code, GitBranch, Clock,
  MonitorPlay, Rocket,
  Box, Database, Layers,
  Binary, History, SortAsc, SortDesc,
  Tag, Info, CheckCircle2,
  Layout, Cpu, Activity, ShieldCheck,
  CpuIcon, Zap
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { ModelHubDetailsDrawer } from '../../components/modals/ModelHubDetailsDrawer';
import { CustomSelect } from '../../components/ui/Select';
import { MOCK_PRETRAINED_MODELS } from '../../constants';

interface ModelHubProps {
  navigate?: (module: any, page: string, data?: any) => void;
}

type SortField = 'updatedAt' | 'name';
type SortOrder = 'asc' | 'desc';

const ModelHubPage: React.FC<ModelHubProps> = ({ navigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [taskFilter, setTaskFilter] = useState('全部类型');
  const [frameworkFilter, setFrameworkFilter] = useState('all');
  const [sortField, setSortField] = useState<SortField>('updatedAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  
  const [selectedModel, setSelectedModel] = useState<any | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const getTaskColor = (type: string) => {
    switch (type) {
      case '文本生成': return 'text-indigo-500 bg-indigo-50 border-indigo-100';
      case '图像分类': return 'text-primary-500 bg-primary-50 border-primary-100';
      case '目标检测': return 'text-amber-500 bg-amber-50 border-amber-100';
      case '情感分析': return 'text-emerald-500 bg-emerald-50 border-emerald-100';
      case '时间序列': return 'text-rose-500 bg-rose-50 border-rose-100';
      case '强化学习': return 'text-slate-500 bg-slate-50 border-slate-100';
      default: return 'text-slate-400 bg-slate-50 border-slate-100';
    }
  };

  // 框架视觉配置映射
  const getFrameworkStyle = (fw: string) => {
    const name = fw.toLowerCase();
    if (name.includes('pytorch')) {
      return { 
        bg: 'bg-orange-50 border-orange-200 text-orange-600', 
        glow: 'shadow-[0_0_15px_rgba(238,76,44,0.1)]',
        accent: 'bg-orange-500'
      };
    }
    if (name.includes('tensorflow')) {
      return { 
        bg: 'bg-amber-50 border-amber-200 text-amber-600', 
        glow: 'shadow-[0_0_15px_rgba(255,111,0,0.1)]',
        accent: 'bg-amber-500'
      };
    }
    return { 
      bg: 'bg-blue-50 border-blue-200 text-blue-600', 
      glow: 'shadow-[0_0_15px_rgba(59,130,246,0.1)]',
      accent: 'bg-blue-500'
    };
  };

  const filteredAndSortedModels = useMemo(() => {
    let result = MOCK_PRETRAINED_MODELS.filter(m => {
      const term = searchTerm.toLowerCase();
      const matchesSearch = term === '' || 
        m.name.toLowerCase().includes(term) || 
        m.displayName.toLowerCase().includes(term) ||
        m.tags.some(tag => tag.toLowerCase().includes(term));
      
      const matchesTask = taskFilter === '全部类型' || m.taskType === taskFilter;
      const matchesFramework = frameworkFilter === 'all' || m.framework === frameworkFilter;

      return matchesSearch && matchesTask && matchesFramework;
    });

    result.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'updatedAt') {
        comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      } else {
        comparison = a.name.localeCompare(b.name);
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return result;
  }, [searchTerm, taskFilter, frameworkFilter, sortField, sortOrder]);

  const handleOpenDetails = (model: any) => {
    setSelectedModel(model);
    setIsDetailsOpen(true);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 font-sans pb-20 max-w-[1600px] mx-auto">
      <ModelHubDetailsDrawer 
        isOpen={isDetailsOpen} 
        onClose={() => setIsDetailsOpen(false)} 
        model={selectedModel}
        onDeploy={(m) => navigate?.('inference', 'online-service', { sourceModel: m })}
        onTrial={(m) => navigate?.('inference', 'inference-playground', { 
          service: { id: `PLAY-TEMP-${m.id}`, name: `${m.name} Sandbox`, modelName: m.name, modelVersion: m.latestVersion, status: 'running', endpoint: 'https://sandbox.api.ai-nex.io' } 
        })}
      />

      {/* 1. Header Banner */}
      <div className="relative rounded-[32px] bg-slate-950 p-8 lg:px-12 lg:py-10 overflow-hidden border border-slate-800 shadow-2xl group">
         <div className="absolute inset-0 tech-grid opacity-[0.03]"></div>
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(27,88,244,0.06),transparent_50%)]"></div>
         <div className="absolute -top-16 -right-16 p-8 opacity-[0.03] text-primary-500 pointer-events-none group-hover:opacity-[0.05] transition-all duration-[3000ms]">
            <Globe size={280} strokeWidth={0.5} />
         </div>
         
         <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-6">
                 <div className="px-3 py-1 rounded-lg bg-primary-600/20 border border-primary-500/30 text-primary-400 text-[9px] font-black uppercase tracking-[0.2em]">Registry</div>
                 <div className="w-1 h-1 rounded-full bg-slate-700"></div>
                 <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Enterprise Ready</span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tighter uppercase leading-none mb-4">发现顶级<span className="text-primary-500">预训练资产</span></h1>
              <p className="text-slate-400 text-xs lg:text-sm font-medium uppercase tracking-[0.1em] leading-relaxed opacity-70">深度集成行业 SOTA 模型库。提供从发现到部署的严谨闭环链路。</p>
            </div>

            <div className="flex items-center gap-8 xl:pl-10 xl:border-l xl:border-white/5">
               <div className="flex flex-col">
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Assets</span>
                  <span className="text-xl font-black text-white font-mono">1.2k+</span>
               </div>
               <div className="flex flex-col">
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Sync</span>
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">NOMINAL</span>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* 2. Control Bar */}
      <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm space-y-6 sticky top-4 z-30 backdrop-blur-md bg-white/90">
         <div className="flex flex-col xl:flex-row justify-between items-center gap-6">
            <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
               <div className="relative flex-1 md:w-80 group">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-500 pointer-events-none" />
                  <input type="text" placeholder="模糊搜索名称、标签或架构..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 text-[11px] font-black uppercase tracking-widest border border-slate-200 rounded-2xl bg-slate-50 focus:bg-white focus:outline-none focus:border-primary-500 transition-all shadow-inner" />
               </div>
               <div className="h-6 w-px bg-slate-100 hidden md:block"></div>
               <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">任务类型:</span>
                  <CustomSelect options={[{ value: '全部类型', label: '全部任务类型' }, { value: '图像分类', label: '图像分类' }, { value: '目标检测', label: '目标检测' }, { value: '文本生成', label: '文本生成' }]} value={taskFilter} onChange={setTaskFilter} className="w-48" />
               </div>
               <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">框架:</span>
                  <CustomSelect options={[{ value: 'all', label: '全部框架' }, { value: 'PyTorch', label: 'PyTorch' }, { value: 'TensorFlow', label: 'TensorFlow' }]} value={frameworkFilter} onChange={setFrameworkFilter} className="w-36" />
               </div>
            </div>
         </div>
      </div>

      {/* 3. Model Matrix Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
         {filteredAndSortedModels.map((model) => {
            const fwStyle = getFrameworkStyle(model.framework);
            return (
              <div 
                key={model.id} 
                onClick={() => handleOpenDetails(model)}
                className="group bg-white border border-slate-200 rounded-[40px] p-0 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.08)] hover:border-primary-500 transition-all duration-500 flex flex-col relative overflow-hidden cursor-pointer h-full"
              >
                 {/* Visual Framework Ribbon - Replaced small icon with recognizable badge */}
                 <div className="absolute top-6 right-6 z-10">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border font-mono text-[9px] font-black uppercase tracking-widest transition-all duration-500 group-hover:scale-105 ${fwStyle.bg} ${fwStyle.glow}`}>
                       <div className={`w-1.5 h-1.5 rounded-full ${fwStyle.accent} shadow-sm`}></div>
                       {model.framework}
                    </div>
                 </div>

                 <div className="p-8 flex flex-col flex-1">
                    <div className="space-y-4 mb-8">
                       <div className="flex items-center gap-2.5">
                          <div className={`px-2.5 py-1 rounded-lg border text-[8px] font-black uppercase tracking-[0.15em] ${getTaskColor(model.taskType)}`}>
                             {model.taskType}
                          </div>
                          <Badge status="info" showDot={false}>{model.provider.split(' ')[0]}</Badge>
                       </div>
                       <h3 className="text-2xl font-black text-slate-950 tracking-tighter leading-none group-hover:text-primary-600 transition-colors uppercase truncate max-w-[200px]" title={model.name}>
                          {model.name}
                       </h3>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none border-l-2 border-slate-100 pl-3 truncate">
                          ID: {model.id}
                       </p>
                    </div>

                    {/* Meta Spec Matrix - Removed Framework from grid as it's now a ribbon */}
                    <div className="grid grid-cols-2 gap-px bg-slate-100 border border-slate-100 rounded-[24px] overflow-hidden mb-8 shadow-inner">
                       <div className="p-4 bg-white space-y-1 hover:bg-slate-50/50 transition-colors">
                          <div className="flex items-center gap-1.5 text-[8px] font-black text-slate-400 uppercase tracking-widest">
                             <Binary size={10} className="text-primary-500" /> 参数规模
                          </div>
                          <p className="text-[11px] font-black text-slate-800 font-mono uppercase">{model.params}</p>
                       </div>
                       <div className="p-4 bg-white space-y-1 hover:bg-slate-50/50 transition-colors">
                          <div className="flex items-center gap-1.5 text-[8px] font-black text-slate-400 uppercase tracking-widest">
                             <GitBranch size={10} className="text-primary-500" /> 注册版本
                          </div>
                          <p className="text-[11px] font-black text-slate-800 font-mono uppercase">{model.latestVersion}</p>
                       </div>
                       <div className="p-4 bg-white space-y-1 hover:bg-slate-50/50 transition-colors">
                          <div className="flex items-center gap-1.5 text-[8px] font-black text-slate-400 uppercase tracking-widest">
                             <Database size={10} className="text-primary-500" /> 文件大小
                          </div>
                          <p className="text-[11px] font-black text-slate-800 font-mono uppercase">{model.fileSize || 'N/A'}</p>
                       </div>
                       <div className="p-4 bg-white space-y-1 hover:bg-slate-50/50 transition-colors">
                          <div className="flex items-center gap-1.5 text-[8px] font-black text-slate-400 uppercase tracking-widest">
                             <History size={10} className="text-primary-500" /> 最后更新
                          </div>
                          <p className="text-[11px] font-black text-slate-800 font-mono tracking-tighter uppercase">{model.updatedAt}</p>
                       </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-8 min-h-[48px] content-start">
                       {model.tags.map((tag: string, i: number) => (
                          <span key={i} className="px-2.5 py-1 bg-slate-50 text-slate-400 border border-slate-100 rounded-lg text-[8px] font-black uppercase tracking-[0.1em] group-hover:border-primary-100 group-hover:bg-primary-50/30 group-hover:text-primary-600 transition-all">
                             #{tag}
                          </span>
                       ))}
                    </div>

                    <div className="mt-auto pt-6 border-t border-slate-50 grid grid-cols-2 gap-3" onClick={e => e.stopPropagation()}>
                       <button onClick={() => navigate?.('inference', 'inference-playground', { service: { id: `PLAY-TEMP-${model.id}`, name: `${model.name} Sandbox`, modelName: model.name, modelVersion: model.latestVersion, status: 'running', endpoint: 'https://sandbox.api.ai-nex.io' } })} className="flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 hover:border-slate-950 text-slate-600 hover:text-slate-950 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-sm">
                          <MonitorPlay size={14} strokeWidth={2.5} /> 快速试用
                       </button>
                       <button onClick={() => navigate?.('inference', 'online-service', { sourceModel: model })} className="flex items-center justify-center gap-2 py-3 bg-slate-950 hover:bg-primary-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95">
                          部署服务 <Rocket size={14} strokeWidth={2.5} />
                       </button>
                    </div>
                 </div>
              </div>
            );
         })}
      </div>
    </div>
  );
};

export default ModelHubPage;
