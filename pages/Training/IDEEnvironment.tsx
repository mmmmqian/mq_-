
import React, { useState, useMemo } from 'react';
import { 
  Terminal, Search, Plus, RefreshCw, 
  Code, HardDrive, Cpu, Zap, 
  Layout, MoreVertical, 
  RotateCcw, MonitorPlay, PlayCircle, 
  StopCircle, SearchIcon, Database, 
  RotateCw, Calendar,
  Layers, Clock, History,
  Timer, Trash2, X, AlertTriangle, CheckCircle2, ShieldCheck, Monitor
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { CreateIDEModal } from '../../components/modals/CreateIDEModal';
import { IDEEnvironmentDetailsDrawer } from '../../components/modals/IDEEnvironmentDetailsDrawer';
import { MOCK_USER_MODELS } from '../../constants';

const IDEEnvironmentPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [modelFilter, setModelFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedInstance, setSelectedInstance] = useState<any | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [deletingInstance, setDeletingInstance] = useState<any | null>(null);

  const [instances, setInstances] = useState([
    {
      id: 'IDE-001-R',
      name: 'bert-finetuning-lab',
      status: 'running',
      type: 'JupyterLab',
      image: 'pytorch:2.2.0-cuda12.1',
      resources: { gpu: '1x A10', cpu: '8c', mem: '32G', storage: '500G' },
      metrics: { cpu: 42, mem: 65, gpu: 28 },
      mountedModel: 'BERT中文预训练模型',
      mountedModelId: 'M-BERT-ZH',
      mountedVersion: 'v2.1.0',
      owner: 'zhangsan',
      ownerRealName: '张三',
      uptime: '14h 22m',
      createdAt: '2024-05-24 10:30',
      updatedAt: '2025-05-24 14:15'
    },
    {
      id: 'IDE-002-S',
      name: 'llama3-dev-env',
      status: 'stopped',
      type: 'VSCode',
      image: 'vllm:0.4.2',
      resources: { gpu: '2x A100', cpu: '16c', mem: '64G', storage: '1TB' },
      metrics: { cpu: 0, mem: 0, gpu: 0 },
      mountedModel: 'LLAMA-3-8B-INSTRUCT',
      mountedModelId: 'HUB-LLAMA-3',
      mountedVersion: 'v1.0.0',
      owner: 'lisi',
      ownerRealName: '李四',
      uptime: '--',
      createdAt: '2024-05-20 09:15',
      updatedAt: '2024-05-23 15:45'
    },
    {
      id: 'IDE-004-F',
      name: 'resnet-training-01',
      status: 'creation_failed',
      type: 'VSCode',
      image: 'tensorflow:2.15.0',
      resources: { gpu: '1x T4', cpu: '4c', mem: '16G', storage: '100G' },
      metrics: { cpu: 0, mem: 0, gpu: 0 },
      mountedModel: 'RESNET50图像分类',
      mountedModelId: 'M-RESNET50',
      mountedVersion: 'v1.0.2',
      owner: 'zhaoliu',
      ownerRealName: '赵六',
      uptime: '--',
      createdAt: '2024-05-24 09:00',
      updatedAt: '2024-05-24 09:15'
    }
  ]);

  const handleAction = (id: string, action: string) => {
    if (action === 'delete_request') {
      const ins = instances.find(i => i.id === id);
      setDeletingInstance(ins);
      return;
    }

    setInstances(prev => prev.map(ins => {
      if (ins.id === id) {
        switch (action) {
          case 'start': 
          case 'retry_start':
          case 'retry_create':
            return { ...ins, status: 'starting' };
          case 'stop': 
          case 'cancel_create':
          case 'cancel_start':
            return { ...ins, status: 'stopped' };
          case 'restart':
            return { ...ins, status: 'starting' };
          default: return ins;
        }
      }
      return ins;
    }).filter(ins => !(ins.id === id && action === 'delete_confirm')));
    setDeletingInstance(null);
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'running': return { label: '运行中', color: 'text-emerald-500', dot: 'bg-emerald-500', border: 'border-emerald-500/40 hover:border-emerald-500 hover:shadow-[0_0_20px_-5px_rgba(16,185,129,0.2)]' };
      case 'stopped': return { label: '已停止', color: 'text-slate-400', dot: 'bg-slate-300', border: 'border-slate-200 hover:border-slate-400' };
      case 'starting':
      case 'creating': return { label: '处理中', color: 'text-blue-500', dot: 'bg-blue-500', border: 'border-blue-500/40 hover:border-blue-500 animate-pulse' };
      case 'creation_failed':
      case 'starting_failed': return { label: '启动失败', color: 'text-red-500', dot: 'bg-red-500', border: 'border-red-500/60 hover:border-red-500' };
      default: return { label: '未知', color: 'text-slate-300', dot: 'bg-slate-200', border: 'border-slate-100' };
    }
  };

  const DeleteConfirmModal = ({ instance }: { instance: any }) => (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setDeletingInstance(null)}></div>
      <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200 border border-red-100 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-red-500"></div>
        <div className="px-8 py-10 text-center">
           <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-100 relative">
              <div className="absolute inset-0 bg-red-200 rounded-full animate-ping opacity-20"></div>
              <AlertTriangle size={36} className="text-red-500 relative z-10" />
           </div>
           <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">销毁 IDE 环境？</h3>
           <p className="text-xs text-slate-500 leading-relaxed px-4 font-medium">该操作将永久停止计算资源并解绑存储卷。<span className="text-red-600 font-black">此过程不可逆。</span></p>
        </div>
        <div className="px-8 py-5 bg-slate-50 border-t border-slate-200 flex gap-4">
           <button onClick={() => setDeletingInstance(null)} className="flex-1 px-4 py-3 bg-white border border-slate-300 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all">放弃</button>
           <button onClick={() => handleAction(instance.id, 'delete_confirm')} className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2">销毁环境</button>
        </div>
      </div>
    </div>
  );

  const InstanceCard: React.FC<{ ins: any }> = ({ ins }) => {
    const config = getStatusConfig(ins.status);
    const isRunning = ins.status === 'running';
    const isProcessing = ins.status === 'starting' || ins.status === 'creating';
    return (
      <div 
        onClick={() => { setSelectedInstance(ins); setIsDetailsOpen(true); }}
        className={`group relative bg-white border border-slate-200 rounded-[40px] p-8 transition-all duration-500 cursor-pointer flex flex-col h-full overflow-hidden ${config.border.replace('border-2', 'border')}`}
      >
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-500 ${isRunning ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
               {ins.type === 'JupyterLab' ? <Layout size={26} strokeWidth={2.5} /> : <Code size={26} strokeWidth={2.5} />}
            </div>
            <div className="space-y-0.5">
               <h3 className="text-base font-black text-slate-900 tracking-tight leading-none group-hover:text-primary-600 transition-colors uppercase truncate max-w-[180px]">{ins.name}</h3>
               <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{ins.type}</span>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-50 border border-slate-100">
                     <div className={`w-1.5 h-1.5 rounded-full ${config.dot} ${(isRunning || isProcessing) ? 'animate-pulse' : ''}`}></div>
                     <span className={`text-[9px] font-black uppercase tracking-tighter ${config.color}`}>{config.label}</span>
                  </div>
               </div>
            </div>
          </div>
          <button className="p-2 text-slate-300 hover:text-slate-950 transition-colors"><MoreVertical size={20} /></button>
        </div>

        <div className="grid grid-cols-2 gap-px bg-slate-100 border border-slate-100 rounded-[24px] overflow-hidden mb-8 shadow-inner">
           <div className="p-4 bg-white space-y-1 hover:bg-slate-50/50 transition-colors">
              <div className="flex items-center gap-1.5 text-[8px] font-black text-slate-400 uppercase tracking-widest">
                 <Cpu size={10} className="text-primary-500" /> CPU / GPU
              </div>
              <p className="text-[11px] font-black text-slate-800 font-mono tracking-tighter uppercase leading-none">{ins.resources.cpu} | {ins.resources.gpu.split(' ')[0]}</p>
           </div>
           <div className="p-4 bg-white space-y-1 hover:bg-slate-50/50 transition-colors">
              <div className="flex items-center gap-1.5 text-[8px] font-black text-slate-400 uppercase tracking-widest">
                 <Timer size={10} className="text-primary-500" /> Uptime
              </div>
              <p className={`text-[11px] font-black font-mono tracking-tighter leading-none ${isRunning ? 'text-emerald-500' : 'text-slate-300'}`}>{ins.uptime}</p>
           </div>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-2xl flex items-center justify-between mb-8">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-primary-500 shadow-sm"><Layers size={14} strokeWidth={2.5} /></div>
              <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight truncate max-w-[120px]">{ins.mountedModel}</p>
           </div>
           <Badge status="info" showDot={false}>{ins.mountedVersion}</Badge>
        </div>

        <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-100">
           <div className="flex items-center gap-2.5">
             <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-500 shadow-inner">{ins.ownerRealName[0]}</div>
             <div className="flex flex-col"><span className="text-[11px] font-bold text-slate-800 leading-none">{ins.ownerRealName}</span><p className="text-[8px] text-slate-400 font-bold uppercase mt-1">Creator</p></div>
           </div>

           <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
              {isRunning ? (
                <>
                  <button className="px-5 py-2.5 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-600 transition-all flex items-center gap-1.5 shadow-lg active:scale-95">
                     <MonitorPlay size={14} strokeWidth={2.5} /> 进入
                  </button>
                  <button onClick={() => handleAction(ins.id, 'stop')} className="p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-red-600 rounded-full transition-all"><StopCircle size={16} strokeWidth={2.5} /></button>
                </>
              ) : (
                <button onClick={() => handleAction(ins.id, 'start')} className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all flex items-center gap-1.5 shadow-lg active:scale-95">
                   <PlayCircle size={14} strokeWidth={2.5} /> 启动
                </button>
              )}
           </div>
        </div>
      </div>
    );
  };

  const filteredInstances = useMemo(() => {
    return instances.filter(ins => {
      const matchesSearch = ins.name.toLowerCase().includes(searchTerm.toLowerCase()) || ins.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesModel = modelFilter === 'all' || ins.mountedModelId === modelFilter;
      return matchesSearch && matchesModel;
    });
  }, [instances, searchTerm, modelFilter]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700 font-sans pb-24">
      <CreateIDEModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
      <IDEEnvironmentDetailsDrawer isOpen={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} instance={selectedInstance} onAction={(id, action) => handleAction(id, action)} />
      {deletingInstance && <DeleteConfirmModal instance={deletingInstance} />}

      {/* Optimized Header Banner - Compact Horizontal Layout */}
      <div className="relative rounded-[32px] bg-slate-950 p-8 lg:px-12 lg:py-10 overflow-hidden border border-slate-800 shadow-2xl group flex flex-col lg:flex-row justify-between items-center gap-8">
         <div className="absolute inset-0 tech-grid opacity-[0.03]"></div>
         <div className="absolute -top-16 -right-16 p-8 opacity-[0.02] text-white pointer-events-none group-hover:opacity-[0.04] transition-opacity duration-1000">
            <Monitor size={240} strokeWidth={0.5} />
         </div>
         
         <div className="relative z-10 flex-1">
            <div className="flex items-center gap-3 mb-5">
               <Badge status="primary" showDot={false}>Ephemeral Sandbox</Badge>
               <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse"></div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Workspace Online</span>
               </div>
            </div>
            <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tighter uppercase leading-none mb-4">
              云端开发环境
            </h1>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-widest leading-relaxed opacity-60 max-w-xl">
               高性能 <span className="text-white">代码沙盒</span>。支持挂载企业资产库，支持 <span className="text-primary-400">JupyterLab / VSCode</span> 实时编码。
            </p>
         </div>

         <div className="relative z-10 shrink-0">
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-3 px-8 py-4 bg-primary-600 text-white rounded-2xl hover:bg-primary-700 transition-all font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-primary-500/30 active:scale-95 group/btn"
            >
              <Plus size={18} strokeWidth={3} className="group-hover/btn:rotate-90 transition-transform" />
              <span>新建 IDE 环境</span>
            </button>
         </div>
      </div>

      <div className="flex flex-col xl:flex-row justify-between items-center gap-5 bg-white p-4 rounded-[28px] border border-slate-200 shadow-sm">
         <div className="flex items-center gap-4 w-full xl:w-auto">
            <div className="relative flex-1 xl:w-80 group">
               <SearchIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-500 pointer-events-none" />
               <input type="text" placeholder="搜索环境名称 / ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-11 pr-4 py-2.5 text-[10px] font-black uppercase tracking-widest border border-slate-100 rounded-2xl bg-slate-50 focus:bg-white focus:border-primary-500 transition-all placeholder:text-slate-300" />
            </div>
            <div className="h-6 w-px bg-slate-100 hidden sm:block"></div>
            <select value={modelFilter} onChange={(e) => setModelFilter(e.target.value)} className="px-5 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-primary-500 cursor-pointer appearance-none min-w-[220px]">
               <option value="all">所有关联资产 (ALL)</option>
               {MOCK_USER_MODELS.map(m => <option key={m.id} value={m.id}>{m.displayName.toUpperCase()}</option>)}
            </select>
         </div>
         <div className="px-5 py-2.5 bg-primary-50/50 border border-primary-100 rounded-2xl flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse"></div>
            <span className="text-[10px] font-black text-primary-700 uppercase tracking-widest">Active Compute: 6/16 GPU</span>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
         {filteredInstances.map((ins) => (
            <InstanceCard key={ins.id} ins={ins} />
         ))}

         <div 
            onClick={() => setIsCreateModalOpen(true)}
            className="border-2 border-dashed border-slate-200 rounded-[40px] p-8 flex flex-col items-center justify-center text-center group hover:border-primary-200 hover:bg-primary-50/5 transition-all cursor-pointer min-h-[480px]"
         >
            <div className="w-16 h-16 bg-slate-50 rounded-[24px] flex items-center justify-center text-slate-200 group-hover:bg-white group-hover:text-primary-600 group-hover:shadow-lg group-hover:scale-110 transition-all duration-500 mb-6 border border-slate-100">
               <Plus size={32} strokeWidth={3} />
            </div>
            <h4 className="text-base font-black text-slate-900 uppercase tracking-[0.2em] mb-3">Provision Sandbox</h4>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest max-w-[240px] leading-relaxed">申请隔离的高性能计算环境进行模型实验</p>
         </div>
      </div>
    </div>
  );
};

export default IDEEnvironmentPage;
