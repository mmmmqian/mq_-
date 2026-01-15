
import React, { useState, useEffect, useRef } from 'react';
import { Drawer } from '../ui/Drawer';
import { 
  Terminal, Search, Download, 
  Trash2, Play, Square, RefreshCw,
  Clock, Filter, ShieldCheck, ChevronDown,
  Hash, ExternalLink, AlertCircle
} from 'lucide-react';
import { Badge } from '../ui/Badge';

interface ServiceLogDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  service: any;
}

const MOCK_LOG_LINES = [
  { time: '2024-05-24 10:15:01', level: 'INFO', msg: 'Initializing inference engine: vLLM 0.4.2' },
  { time: '2024-05-24 10:15:04', level: 'INFO', msg: 'Loading model weights from s3://weights/llama3-70b/...' },
  { time: '2024-05-24 10:15:12', level: 'INFO', msg: 'Weight loading complete. Time taken: 8.2s' },
  { time: '2024-05-24 10:15:15', level: 'WARN', msg: 'Memory fragmentation threshold exceeded: 12%' },
  { time: '2024-05-24 10:16:02', level: 'INFO', msg: 'API Server started on port 8080' },
  { time: '2024-05-24 10:17:45', level: 'ERROR', msg: 'Failed to process request ID: req-9928-ax | CUDA_ERROR_OUT_OF_MEMORY' },
  { time: '2024-05-24 10:17:50', level: 'INFO', msg: 'Autoscaler: Triggering pod expansion (+1 replicas)' }
];

export const ServiceLogDrawer: React.FC<ServiceLogDrawerProps> = ({ isOpen, onClose, service }) => {
  const [logs, setLogs] = useState(MOCK_LOG_LINES);
  const [isLive, setIsLive] = useState(true);
  const [filterLevel, setFilterLevel] = useState('ALL');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLive && isOpen) {
      const interval = setInterval(() => {
        const newLine = {
          time: new Date().toLocaleTimeString(),
          level: Math.random() > 0.8 ? 'ERROR' : 'INFO',
          msg: `New incoming inference request processed successfully [Token: ${Math.floor(Math.random()*1000)}]`
        };
        setLogs(prev => [...prev.slice(-49), newLine]);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isLive, isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  if (!service) return null;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Terminal size={20} className="text-primary-600" />
          <span className="font-black uppercase tracking-tight">底层服务运行日志 (SYSTEM AUDIT)</span>
        </div>
      }
      description={`SERVICE: ${service.name} | REPLICAS: ${service.replicas.total}`}
      width="max-w-4xl"
      footer={
        <div className="flex justify-between w-full items-center">
           <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsLive(!isLive)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${isLive ? 'bg-primary-600 text-white border-primary-500 shadow-lg' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
              >
                {isLive ? <Play size={12} fill="currentColor" /> : <Square size={12} fill="currentColor" />}
                {isLive ? 'Live Streaming' : 'Paused'}
              </button>
              <button className="p-2.5 text-slate-400 hover:text-primary-600 border border-slate-200 rounded-xl transition-all">
                <Download size={18} />
              </button>
           </div>
           <button onClick={onClose} className="px-8 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-600 transition-all active:scale-95 shadow-xl">
             CLOSE CONSOLE
           </button>
        </div>
      }
    >
      <div className="space-y-6 h-full flex flex-col">
        {/* Toolbar */}
        <div className="bg-slate-100/50 p-2 rounded-2xl border border-slate-200 flex flex-wrap gap-2 items-center">
           <div className="relative group flex-1 min-w-[200px]">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="GREP / SEARCH LOGS..." 
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-bold uppercase tracking-widest focus:border-primary-500 outline-none transition-all"
              />
           </div>
           <div className="flex gap-1">
              {['ALL', 'INFO', 'WARN', 'ERROR'].map(lvl => (
                <button 
                  key={lvl}
                  onClick={() => setFilterLevel(lvl)}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${filterLevel === lvl ? 'bg-slate-900 text-white' : 'bg-white text-slate-400 border border-slate-200 hover:text-slate-600'}`}
                >
                  {lvl}
                </button>
              ))}
           </div>
           <button className="p-2 text-slate-400 hover:text-red-500 transition-colors">
              <Trash2 size={16} />
           </button>
        </div>

        {/* Terminal Surface */}
        <div 
          ref={scrollRef}
          className="flex-1 bg-slate-950 rounded-2xl border border-slate-800 p-6 font-mono text-[11px] overflow-y-auto min-h-[450px] shadow-inner relative group"
        >
           <div className="absolute top-4 right-4 opacity-10 pointer-events-none text-white"><Terminal size={100} /></div>
           
           <div className="space-y-2 relative z-10">
              {logs.filter(l => filterLevel === 'ALL' || l.level === filterLevel).map((log, i) => (
                <div key={i} className="flex gap-4 group/line hover:bg-white/5 rounded px-2 -mx-2 transition-colors">
                   <span className="text-slate-600 shrink-0 select-none">[{log.time}]</span>
                   <span className={`font-black shrink-0 w-12 ${log.level === 'ERROR' ? 'text-red-500' : log.level === 'WARN' ? 'text-amber-400' : 'text-emerald-500'}`}>
                      {log.level}
                   </span>
                   <span className="text-slate-300 break-all leading-relaxed">{log.msg}</span>
                </div>
              ))}
           </div>
        </div>

        {/* Bottom Alert */}
        <div className="bg-red-50/50 border border-red-100 p-4 rounded-xl flex gap-3 animate-in slide-in-from-bottom-2">
           <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
           <div className="space-y-1">
              <p className="text-[10px] text-red-800 font-black uppercase tracking-widest">检测到 CUDA 运行时异常 (12:42)</p>
              <p className="text-[9px] text-red-600 font-bold leading-relaxed uppercase tracking-tighter">
                Pod szx-prod-vllm-01 发生 OOM。系统已触发自动恢复策略，正在重新分配调度资源...
              </p>
           </div>
        </div>
      </div>
    </Drawer>
  );
};
