
import React, { useState } from 'react';
import { 
  Globe, Search, Star, Download, 
  ExternalLink, Zap, BrainCircuit, 
  Cpu, Activity, Filter, LayoutGrid, 
  Layout, ArrowRight, ShieldCheck, TrendingUp,
  MonitorPlay, Rocket, Info, FileText,
  Terminal, ShieldAlert, CheckCircle2,
  Box, Database, Code
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Drawer } from '../../components/ui/Drawer';
import { MOCK_PRETRAINED_MODELS } from '../../constants';

interface ModelHubProps {
  navigate?: (module: any, page: string) => void;
}

const ModelHubPage: React.FC<ModelHubProps> = ({ navigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModel, setSelectedModel] = useState<any | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All Types');

  const categories = ['All Types', 'NLP', 'Computer Vision', 'Audio', 'Multi-modal', 'Code'];

  const handleDeploy = (model: any) => {
    // PRD 场景: 自动跳转到推理服务并带入元数据
    console.log(`Triggering PRD-compliant deployment for: ${model.name}`);
    if (navigate) {
      navigate('inference', 'online-service');
    }
  };

  const handleQuickTrial = (model: any) => {
    alert(`Playground Initializing: Setting up sandboxed environment for ${model.name}...`);
  };

  const filteredModels = MOCK_PRETRAINED_MODELS.filter(m => 
    (activeCategory === 'All Types' || m.type.includes(activeCategory)) &&
    (m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.provider.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700 font-sans pb-20">
      {/* 1. Hero Discovery Section */}
      <div className="relative rounded-[40px] bg-slate-950 p-12 lg:p-16 overflow-hidden border border-slate-800 shadow-2xl">
         <div className="absolute inset-0 tech-grid opacity-[0.05]"></div>
         <div className="absolute -top-24 -right-24 p-16 opacity-[0.03] text-primary-500 animate-pulse pointer-events-none">
            <Globe size={400} strokeWidth={1} />
         </div>
         
         <div className="relative z-10 max-w-3xl">
            <div className="flex items-center gap-3 mb-8">
               <Badge status="primary" showDot={false}>SYSTEM-INTERNAL REGISTRY</Badge>
               <div className="w-1 h-1 rounded-full bg-slate-700"></div>
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Enterprise Grade Pre-trained Hub</span>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tighter uppercase leading-[0.9]">
              探索顶级预训练算力资产
            </h1>
            
            <p className="text-slate-400 mt-6 text-sm lg:text-base font-medium uppercase tracking-widest leading-relaxed opacity-70 max-w-xl">
              深度集成开源社区与商业大模型。提供从 <span className="text-white">发现、试用</span> 到 <span className="text-primary-400">自动化部署</span> 的全链路基础设施。
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-12">
               <div className="relative flex-1 group">
                  <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-400 transition-colors" />
                  <input 
                    type="text" 
                    placeholder="DISCOVER MODELS (LLAMA, QWEN, SDXL...)" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-14 pr-4 py-5 bg-white/5 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest text-white focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-slate-700 backdrop-blur-md"
                  />
               </div>
               <button className="px-10 py-5 bg-primary-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-primary-700 transition-all shadow-2xl shadow-primary-500/20 active:scale-95">
                  Execute Registry Search
               </button>
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
            <div className="h-6 w-px bg-slate-200 hidden md:block"></div>
            <button className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary-600 transition-all">
               <TrendingUp size={14} /> Popularity Rank
            </button>
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
              className="group bg-white border border-slate-200 rounded-[36px] p-8 hover:shadow-2xl hover:border-primary-400 transition-all duration-500 flex flex-col relative overflow-hidden"
            >
               {/* Decorative Background Icon */}
               <div className="absolute -top-10 -right-10 p-12 opacity-[0.01] group-hover:opacity-[0.04] transition-all duration-700 pointer-events-none group-hover:scale-110">
                  <BrainCircuit size={180} strokeWidth={1} />
               </div>

               <div className="flex justify-between items-start mb-10 relative z-10">
                  <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-primary-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-primary-500/30 transition-all duration-500">
                     <Zap size={28} strokeWidth={2.5} />
                  </div>
                  <div className="flex flex-col items-end gap-2">
                     <Badge status="primary" showDot={false}>{model.params}</Badge>
                     <div className="flex items-center gap-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        <Download size={11} className="text-slate-300" /> {model.downloads} UNITS
                     </div>
                  </div>
               </div>

               <div className="mb-8 relative z-10">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tighter leading-none group-hover:text-primary-600 transition-colors uppercase">{model.name}</h3>
                    <button 
                      onClick={() => { setSelectedModel(model); setIsDetailsOpen(true); }}
                      className="p-1.5 text-slate-300 hover:text-slate-600 transition-colors"
                    >
                       <Info size={18} />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Vendor: {model.provider}</span>
                     <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                     <span className="text-[10px] font-mono font-bold text-primary-500">{model.latestVersion}</span>
                  </div>
               </div>

               {/* Performance Radar Mini */}
               <div className="space-y-5 mb-10 flex-grow relative z-10">
                  <div className="flex flex-wrap gap-2">
                     {model.tags.map(tag => (
                        <span key={tag} className="px-3 py-1.5 bg-slate-50 text-slate-500 border border-slate-100 rounded-xl text-[9px] font-black uppercase tracking-widest">
                           {tag}
                        </span>
                     ))}
                  </div>
                  <div className="p-5 bg-slate-50 rounded-[24px] border border-slate-100/50 group-hover:bg-primary-50/30 group-hover:border-primary-100 transition-colors">
                     <div className="flex justify-between items-center mb-2.5">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Benchmark Performance</span>
                        <span className="text-[12px] font-mono font-black text-slate-900">{model.performance}/100</span>
                     </div>
                     <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 transition-all duration-1000 origin-left" 
                          style={{ width: `${model.performance}%` }}
                        ></div>
                     </div>
                  </div>
               </div>

               {/* Card Action Matrix */}
               <div className="pt-8 border-t border-slate-100 grid grid-cols-2 gap-4 relative z-10">
                  <button 
                    onClick={() => handleQuickTrial(model)}
                    className="flex items-center justify-center gap-2 py-3 bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all"
                  >
                     <MonitorPlay size={14} strokeWidth={2.5} /> 快速试用
                  </button>
                  <button 
                    onClick={() => handleDeploy(model)}
                    className="flex items-center justify-center gap-2 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-lg shadow-primary-500/10 active:scale-95"
                  >
                     部署服务 <Rocket size={14} strokeWidth={2.5} />
                  </button>
               </div>
            </div>
         ))}
      </div>

      {/* 4. Model Details Drawer */}
      <Drawer
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        title={<div className="flex items-center gap-2"><Info size={20} className="text-primary-600" /> 预训练模型元数据</div>}
        width="max-w-2xl"
      >
        {selectedModel && (
          <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
             <div className="bg-slate-950 rounded-[32px] p-8 border border-slate-800 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-12 opacity-5 text-white"><Box size={140} /></div>
                <div className="relative z-10">
                   <div className="flex items-center gap-3 mb-6">
                      <Badge status="primary" showDot={false}>PUBLIC ASSET</Badge>
                      <Badge status="success">VERIFIED BY AI-NEX</Badge>
                   </div>
                   <h3 className="text-3xl font-black text-white tracking-tight uppercase leading-none">{selectedModel.name}</h3>
                   <div className="flex items-center gap-3 mt-4 text-slate-400">
                      <span className="text-[11px] font-black uppercase tracking-widest font-mono text-primary-400">{selectedModel.latestVersion}</span>
                      <div className="w-1 h-1 rounded-full bg-slate-700"></div>
                      <span className="text-[11px] font-bold uppercase tracking-widest">{selectedModel.provider}</span>
                   </div>
                </div>
             </div>

             <div className="space-y-8">
                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] flex items-center gap-2.5 border-b border-slate-100 pb-4">
                   <Database size={16} className="text-primary-500" /> 配置规范与依赖 (SPECS)
                </h4>
                
                <div className="grid grid-cols-1 gap-6">
                   {[
                      { label: '模型内部路径', value: selectedModel.path, icon: FolderOpen, mono: true },
                      { label: '推理框架支持', value: selectedModel.framework, icon: Code },
                      { label: '开源许可证', value: selectedModel.license, icon: ShieldAlert },
                      { label: '算力预估 (GPU)', value: selectedModel.params === '110B' ? 'Minimum 4x A100 (80G)' : 'Minimum 1x T4', icon: Cpu }
                   ].map((item, i) => (
                      <div key={i} className="flex flex-col gap-2 p-5 bg-slate-50 border border-slate-200 rounded-2xl hover:bg-white transition-all hover:shadow-md">
                         <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-2">
                           {item.label}
                         </span>
                         <span className={`text-sm font-bold text-slate-800 ${item.mono ? 'font-mono tracking-tight break-all' : ''}`}>{item.value}</span>
                      </div>
                   ))}
                </div>

                <div className="bg-amber-50/50 border border-amber-100 p-6 rounded-3xl flex gap-4">
                   <ShieldAlert size={24} className="text-amber-500 shrink-0" />
                   <p className="text-[11px] text-amber-800 font-bold leading-relaxed uppercase tracking-tighter">
                      该模型镜像为系统内置。部署时系统将自动挂载只读权重路径。如需自定义权重或微调，请先在“模型管理”中注册对应的派生资产。
                   </p>
                </div>
             </div>

             <div className="pt-6 grid grid-cols-2 gap-4">
                <button 
                  onClick={() => handleDeploy(selectedModel)}
                  className="flex items-center justify-center gap-3 py-4 bg-primary-600 text-white rounded-2xl font-black text-[12px] uppercase tracking-widest hover:bg-primary-700 shadow-xl transition-all"
                >
                   <Rocket size={18} /> 即刻部署到生产环境
                </button>
                <button className="flex items-center justify-center gap-3 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-[12px] uppercase tracking-widest hover:bg-slate-50 transition-all">
                   <FileText size={18} /> 查看完整技术文档
                </button>
             </div>
          </div>
        )}
      </Drawer>

      {/* 5. Empty State */}
      {filteredModels.length === 0 && (
        <div className="py-40 flex flex-col items-center justify-center text-slate-300 bg-white border border-slate-200 rounded-[48px] shadow-sm">
           <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-10 border border-slate-100 relative">
              <div className="absolute inset-0 bg-slate-200 rounded-full animate-pulse opacity-10"></div>
              <Globe size={48} strokeWidth={1} className="opacity-20" />
           </div>
           <p className="text-[12px] font-black uppercase tracking-[0.5em] text-slate-400">Model Registry Empty</p>
           <button 
              onClick={() => { setSearchTerm(''); setActiveCategory('All Types'); }}
              className="mt-10 px-10 py-4 bg-slate-950 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-primary-600 transition-all shadow-2xl active:scale-95"
           >
              Reset Search Configuration
           </button>
        </div>
      )}
    </div>
  );
};

// Placeholder icons
const FolderOpen = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.69.9H20a2 2 0 0 1 2 2v2"/></svg>
);

export default ModelHubPage;
