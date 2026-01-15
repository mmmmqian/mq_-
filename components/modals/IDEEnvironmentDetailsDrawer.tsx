
import React, { useState } from 'react';
import { Drawer } from '../ui/Drawer';
import { Badge } from '../ui/Badge';
import { 
  Terminal, Activity, Box, Cpu, Zap, 
  HardDrive, Info, Search, Code,
  ShieldCheck, Globe, Database, Gauge, Monitor,
  Clock, AlertCircle, CheckCircle2, RefreshCw,
  Hash, ExternalLink, ActivitySquare,
  PlayCircle, StopCircle, RotateCcw, Trash2,
  Settings, Layers, History, Layout, Radio,
  ShieldAlert
} from 'lucide-react';

interface IDEEnvironmentDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  instance: any;
  onAction: (id: string, action: 'start' | 'stop' | 'delete') => void;
}

export const IDEEnvironmentDetailsDrawer: React.FC<IDEEnvironmentDetailsDrawerProps> = ({ isOpen, onClose, instance, onAction }) => {
  const [activeTab, setActiveTab] = useState<'specs' | 'logs'>('specs');

  if (!instance) return null;

  const isRunning = instance.status === 'running';

  const ActionButton = ({ icon: Icon, label, color, onClick, danger = false }: any) => (
    <button 
      onClick={onClick}
      className={`flex-1 flex flex-col items-center justify-center gap-3 p-5 rounded-3xl border transition-all active:scale-95 group ${danger ? 'bg-red-50 border-red-100 text-red-600 hover:bg-red-600 hover:text-white' : 'bg-white border-slate-200 text-slate-700 hover:border-primary-500 hover:bg-primary-50 hover:text-primary-700'}`}
    >
       <Icon size={24} strokeWidth={2.5} className={`${danger ? '' : 'group-hover:text-primary-600'}`} />
       <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </button>
  );

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Terminal size={20} className="text-primary-600" />
          <span className="font-black uppercase tracking-tight">IDE 环境全维监察</span>
        </div>
      }
      description={`INSTANCE_UUID: ${instance.id}`}
      width="max-w-4xl"
      footer={
        <button onClick={onClose} className="w-full py-3 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary-600 transition-all shadow-xl active:scale-95">
           CLOSE INSPECTOR
        </button>
      }
    >
      <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 pb-10">
        {/* Header Hero */}
        <div className="bg-slate-950 rounded-[32px] p-8 border border-slate-800 relative overflow-hidden shadow-2xl">
           <div className="absolute top-0 right-0 p-12 opacity-5 text-white pointer-events-none"><Monitor size={200} /></div>
           <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                 <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 ${isRunning ? 'bg-emerald-50/10 border-emerald-500/20 text-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.2)]' : 'bg-slate-500/10 border-slate-500/20 text-slate-500'}`}>
                       {instance.type === 'JupyterLab' ? <Layout size={32} /> : <Code size={32} />}
                    </div>
                    <div>
                       <h3 className="text-2xl font-black text-white tracking-tight uppercase leading-none mb-3">{instance.name}</h3>
                       <div className="flex items-center gap-3">
                          <Badge status={isRunning ? 'success' : 'neutral'} showDot>{instance.status.toUpperCase()}</Badge>
                          <span className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest">OWNER: {instance.owner}</span>
                       </div>
                    </div>
                 </div>
                 <div className="text-right">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5">运行时长 (SESSION_UPTIME)</p>
                    <p className="text-lg font-black text-white font-mono tracking-tight">{instance.uptime}</p>
                 </div>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8 border-t border-white/5">
                 {[
                    { label: 'CPU CORE', val: instance.resources.cpu, icon: Cpu },
                    { label: 'MEMORY', val: instance.resources.mem, icon: Activity },
                    { label: 'GPU BIND', val: instance.resources.gpu, icon: Zap },
                    { label: 'STORAGE', val: instance.resources.storage, icon: HardDrive }
                 ].map((res, i) => (
                    <div key={i} className="space-y-1">
                       <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5"><res.icon size={10}/> {res.label}</p>
                       <p className="text-base font-black text-white font-mono">{res.val}</p>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Life Cycle Management */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
           {isRunning ? (
              <ActionButton icon={StopCircle} label="停止环境" onClick={() => onAction(instance.id, 'stop')} />
           ) : (
              <ActionButton icon={PlayCircle} label="启动环境" onClick={() => onAction(instance.id, 'start')} />
           )}
           <ActionButton icon={RotateCcw} label="重启内核" onClick={() => alert('Restarting Pod...')} />
           <ActionButton icon={Terminal} label="Web Terminal" onClick={() => alert('Opening Console...')} />
           <ActionButton icon={Trash2} label="销毁实例" danger onClick={() => onAction(instance.id, 'delete')} />
        </div>

        {/* Detail Tabs */}
        <div className="flex border-b border-slate-200">
           {[
              { id: 'specs', label: '配置规格 (Specs)', icon: Settings },
              { id: 'logs', label: '运行日志 (Console)', icon: Terminal }
           ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-8 py-4 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 flex items-center gap-2.5 ${activeTab === tab.id ? 'border-primary-600 text-primary-600 bg-primary-50/20' : 'border-transparent text-slate-400 hover:text-slate-900'}`}
              >
                <tab.icon size={14} strokeWidth={2.5} />
                {tab.label}
              </button>
           ))}
        </div>

        <div className="pt-4 min-h-[300px]">
           {activeTab === 'specs' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                       <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
                          <Monitor size={14} className="text-primary-500" /> 运行时环境配置
                       </h5>
                       <div className="bg-white border border-slate-200 rounded-[28px] p-6 space-y-4 shadow-sm divide-y divide-slate-50">
                          <div className="flex justify-between pb-4">
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">基础镜像名称</span>
                             <span className="text-[11px] font-bold text-slate-800 font-mono truncate max-w-[200px]">{instance.image}</span>
                          </div>
                          <div className="flex justify-between py-4">
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">CUDA 版本</span>
                             <span className="text-[11px] font-bold text-slate-800 font-mono">12.1.1 (Cudnn 8.9)</span>
                          </div>
                          <div className="flex justify-between pt-4">
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">内部暴露端口</span>
                             <span className="text-[11px] font-bold text-slate-800 font-mono">8888 (Jupyter)</span>
                          </div>
                       </div>
                    </div>
                    <div className="space-y-6">
                       <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
                          <Layers size={14} className="text-primary-500" /> 挂载权重资产 (MOUNTS)
                       </h5>
                       <div className="bg-white border border-slate-200 rounded-[28px] p-6 space-y-4 shadow-sm">
                          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                             <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary-600 shadow-sm"><Box size={20} /></div>
                             <div>
                                <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{instance.mountedModel}</p>
                                <p className="text-[9px] font-mono font-bold text-slate-400 mt-0.5">{instance.mountedVersion}</p>
                             </div>
                          </div>
                          <div className="flex flex-col gap-1.5 px-1">
                             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">容器内访问路径</span>
                             <div className="px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-mono font-bold text-slate-600 break-all leading-relaxed">
                                /mnt/models/{instance.mountedModel.toLowerCase()}
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="bg-amber-50/50 border border-amber-100 p-5 rounded-[24px] flex gap-4">
                    <ShieldAlert size={24} className="text-amber-500 shrink-0" />
                    <p className="text-[10px] text-amber-800 font-bold leading-relaxed uppercase tracking-tight">
                       环境安全审计：该 IDE 实例目前映射至物理集群 SZX-PROD-01。系统将自动备份 /workspace 目录下的代码变动至持久化卷 (PVC)。任何系统级 Kernel 修改将在环境重启后重置。
                    </p>
                 </div>
              </div>
           )}
           
           {activeTab === 'logs' && (
              <div className="bg-slate-950 rounded-3xl p-6 font-mono text-[11px] text-primary-300 h-[400px] overflow-y-auto animate-in fade-in duration-500 shadow-inner border border-slate-800">
                 <p className="text-slate-500 mb-2">[SYSTEM] Connected to Pod szx-prod-ide-992x...</p>
                 <p className="text-emerald-500 mb-1">INFO: Root kernel started successfully.</p>
                 <p className="mb-1">DEBUG: Mount path /mnt/models detected 1.2GB payload.</p>
                 <p className="mb-1">INFO: JupyterLab server listening on http://0.0.0.0:8888</p>
                 <div className="w-1 h-4 bg-primary-500 animate-pulse inline-block ml-1"></div>
              </div>
           )}
        </div>
      </div>
    </Drawer>
  );
};
