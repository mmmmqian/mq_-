
import React, { useState } from 'react';
import { 
  Globe, Search, Star, Download, 
  ExternalLink, Zap, BrainCircuit, 
  Cpu, Activity, Filter, LayoutGrid, 
  Layout, ArrowRight, ShieldCheck, TrendingUp,
  MonitorPlay, Rocket, Info, FileText,
  Terminal, ShieldAlert, CheckCircle2,
  Box, Database, Code, GitBranch, Clock,
  Sparkles, MessageSquare, Image as ImageIcon,
  LineChart, MousePointer2, Share2, Layers
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Drawer } from '../../components/ui/Drawer';
import { MOCK_PRETRAINED_MODELS } from '../../constants';

interface ModelHubProps {
  navigate?: (module: any, page: string, data?: any) => void;
}

const ModelHubPage: React.FC<ModelHubProps> = ({ navigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModel, setSelectedModel] = useState<any | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('全部类型');

  const categories = ['全部类型', '图像分类', '目标检测', '文本生成', '情感分析', '时间序列', '强化学习'];

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

  const handleDeploy = (model: any) => {
    if (navigate) {
      navigate('inference', 'online-service');
    }
  };

  const handleQuickTrial = (model: any) => {
    alert(`Playground Initializing: Setting up sandboxed environment for ${model.name}...`);
  };

  const filteredModels = MOCK_PRETRAINED_MODELS.filter(m => 
    (activeCategory === '全部类型' || m.taskType === activeCategory) &&
    (m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.provider.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700 font-sans pb-20">
      {/* 1. Discovery Section */}
      <div className="relative rounded-[40px] bg-slate-950 p-12 lg:p-16 overflow-hidden border border-slate-800 shadow-2xl group">
         <div className="absolute inset-0 tech-grid opacity-[0.05]"></div>
         <div className="absolute -top-24 -right-24 p-16 opacity-[0.03] text-primary-500 pointer-events-none group-hover:opacity-[0.06] transition-opacity">
            <Globe size={400} strokeWidth={1} />
         </div>
         
         <div className="relative z-10 max-w-3xl">
            <div className="flex items-center gap-3 mb-8">
               <Badge status="primary" showDot={false}>MODEL REGISTRY HUB</Badge>
               <div className="w-1 h-1 rounded-full bg-slate-700"></div>
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Enterprise Pre-trained Asset Matrix</span>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tighter uppercase leading-[0.9]">
              发现顶级预训练资产
            </h1>
            
            <p className="text-slate-400 mt-6 text-sm lg:text-base font-medium uppercase tracking-widest leading-relaxed opacity-70 max-w-xl">
              深度集成行业 SOTA 模型库。提供从 <span className="text-white">发现、性能审计</span> 到 <span className="text-primary-400">一键生产部署</span> 的严谨交付链路。
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-12">
               <div className="relative flex-1 group">
                  <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-400 transition-colors" />
                  <input 
                    type="text" 
                    placeholder="探索 LLAMA, QWEN, RESNET, YOLO..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-14 pr-4 py-5 bg-white/5 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest text-white focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-slate-700 backdrop-blur-md"
                  />
               </div>
            </div>
         </div>
      </div>

      {/* 2. Intelligence Filter Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white p-5 rounded-[28px] border border-slate-200 shadow-sm sticky top-4 z-20 backdrop-blur-md bg-white/90">
         <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            {categories.map((cat) => (
               <button 
                  key={cat} 
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all duration-300 ${activeCategory === cat ? 'bg-slate-950 text-white shadow-xl shadow-slate-900/20' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'}`}
               >
                  {cat}
               </button>
            ))}
         </div>
         <div className="flex items-center gap-3 shrink-0">
            <button className="p-2.5 text-slate-400 hover:text-primary-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">
               <Filter size={18} />
            </button>
         </div>
      </div>

      {/* 3. Model Matrix Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
         {filteredModels.map((model) => (
            <div 
              key={model.id} 
              className="group bg-white border border-slate-200 rounded-[36px] p-0 hover:shadow-2xl hover:border-primary-500 transition-all duration-500 flex flex-col relative overflow-hidden"
            >
               <div className="absolute top-0 left-0 right-0 h-1 bg-slate-50 group-hover:bg-primary-500 transition-colors"></div>
               
               <div className="p-8 flex flex-col flex-1">
                  {/* Header: Name & Task */}
                  <div className="flex justify-between items-start mb-8">
                     <div className="space-y-4">
                        <div className="flex items-center gap-3">
                           <div className={`px-2.5 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest ${getTaskColor(model.taskType)}`}>
                              {model.taskType}
                           </div>
                           <Badge status="info" showDot={false}>{model.provider}</Badge>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tighter leading-none group-hover:text-primary-600 transition-colors uppercase">{model.name}</h3>
                     </div>
                     <div className={`p-3 rounded-2xl border transition-all ${model.framework === 'PyTorch' ? 'bg-orange-50 border-orange-100 text-orange-600' : 'bg-blue-50 border-blue-100 text-blue-600'}`}>
                        <Code size={20} strokeWidth={2.5} />
                     </div>
                  </div>

                  {/* Body: Spec Matrix */}
                  <div className="grid grid-cols-2 gap-3 mb-8">
                     <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl space-y-1.5 hover:bg-white transition-all">
                        <div className="flex items-center gap-2 text-[8px] font-black text-slate-400 uppercase tracking-widest">
                           <Layers size={10} className="text-primary-500" /> 参数规模
                        </div>
                        <p className="text-[11px] font-black text-slate-800 font-mono">{model.params}</p>
                     </div>
                     <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl space-y-1.5 hover:bg-white transition-all">
                        <div className="flex items-center gap-2 text-[8px] font-black text-slate-400 uppercase tracking-widest">
                           <GitBranch size={10} className="text-primary-500" /> 镜像版本
                        </div>
                        <p className="text-[11px] font-black text-slate-800 font-mono">{model.latestVersion}</p>
                     </div>
                     <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl space-y-1.5 hover:bg-white transition-all">
                        <div className="flex items-center gap-2 text-[8px] font-black text-slate-400 uppercase tracking-widest">
                           <Database size={10} className="text-primary-500" /> 计算框架
                        </div>
                        <p className="text-[11px] font-black text-slate-800 font-mono">{model.framework}</p>
                     </div>
                     <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl space-y-1.5 hover:bg-white transition-all">
                        <div className="flex items-center gap-2 text-[8px] font-black text-slate-400 uppercase tracking-widest">
                           <Clock size={10} className="text-primary-500" /> 更新时间
                        </div>
                        <p className="text-[11px] font-black text-slate-800 font-mono tracking-tighter">{model.updatedAt}</p>
                     </div>
                  </div>

                  <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2 mb-8 h-8 font-medium">
                     {model.description}
                  </p>

                  {/* Actions Matrix */}
                  <div className="mt-auto pt-8 border-t border-slate-50 grid grid-cols-2 gap-4">
                     <button 
                        onClick={() => handleQuickTrial(model)}
                        className="flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 hover:border-slate-800 text-slate-700 hover:text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-sm"
                     >
                        <MonitorPlay size={14} strokeWidth={2.5} /> 快速试用
                     </button>
                     <button 
                        onClick={() => handleDeploy(model)}
                        className="flex items-center justify-center gap-2 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-primary-500/20 active:scale-95"
                     >
                        部署服务 <Rocket size={14} strokeWidth={2.5} />
                     </button>
                  </div>
               </div>
            </div>
         ))}
      </div>

      {/* 4. Empty State */}
      {filteredModels.length === 0 && (
        <div className="py-40 flex flex-col items-center justify-center text-slate-300 bg-white border border-slate-200 rounded-[48px] shadow-sm">
           <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-10 border border-slate-100 relative">
              <div className="absolute inset-0 bg-slate-200 rounded-full animate-pulse opacity-10"></div>
              <Globe size={48} strokeWidth={1} className="opacity-20" />
           </div>
           <p className="text-[12px] font-black uppercase tracking-[0.5em] text-slate-400">Registry Result Empty</p>
           <button 
              onClick={() => { setSearchTerm(''); setActiveCategory('全部类型'); }}
              className="mt-10 px-10 py-4 bg-slate-950 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-primary-600 transition-all shadow-2xl active:scale-95"
           >
              Reset Search Parameters
           </button>
        </div>
      )}
    </div>
  );
};

export default ModelHubPage;
