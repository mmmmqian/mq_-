
import React, { useState, useEffect, useRef } from 'react';
import { Drawer } from '../ui/Drawer';
import { 
  Tag, Plus, X, Server, Save, Info, Hash, 
  KeyRound, Type, ChevronDown, Cpu, Zap, 
  Layers, Settings2, CheckCircle2, MapPin,
  ShieldCheck, ArrowRight, MousePointer2,
  Terminal, Sparkles, Command
} from 'lucide-react';
import { Badge } from '../ui/Badge';

interface NodeLabelsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  node: any | null;
}

const PREDEFINED_KEYS = [
  { id: 'gpu-vendor', label: 'GPU 厂商', key: 'ai-nex.io/gpu-vendor', icon: Zap },
  { id: 'gpu-model', label: 'GPU 型号', key: 'ai-nex.io/gpu-model', icon: Cpu },
  { id: 'node-type', label: '节点类型', key: 'ai-nex.io/node-type', icon: Layers },
  { id: 'az', label: '可用区', key: 'ai-nex.io/availability-zone', icon: MapPin },
];

export const NodeLabelsDrawer: React.FC<NodeLabelsDrawerProps> = ({ isOpen, onClose, node }) => {
  const [labels, setLabels] = useState<string[]>([]);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const valueInputRef = useRef<HTMLInputElement>(null);

  // 初始化模拟数据
  useEffect(() => {
    if (node && isOpen) {
      setLabels([
        'ai-nex.io/node-type=gpu-compute',
        'ai-nex.io/gpu-vendor=nvidia',
        'ai-nex.io/gpu-model=a100-80gb',
        'ai-nex.io/availability-zone=cn-south-1a',
        'topology.kubernetes.io/zone=cn-south-1a',
        'node.kubernetes.io/instance-type=p4d.24xlarge'
      ]);
    }
  }, [node, isOpen]);

  const handleAddLabel = () => {
    if (newKey && newValue) {
      const label = `${newKey}=${newValue}`;
      if (!labels.includes(label)) {
        setLabels([...labels, label]);
        setNewKey('');
        setNewValue('');
      }
    }
  };

  const removeLabel = (labelToRemove: string) => {
    setLabels(labels.filter(l => l !== labelToRemove));
  };

  const handleSelectPreset = (key: string) => {
    setNewKey(key);
    // 自动聚焦 Value 输入框，提升连续操作体验
    setTimeout(() => valueInputRef.current?.focus(), 50);
  };

  const handleSave = () => {
    console.log(`[AUDIT] Committing infrastructure changes for node ${node?.name}`);
    onClose();
  };

  if (!node) return null;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-slate-950 rounded-lg flex items-center justify-center text-white shadow-lg">
            <Tag size={16} strokeWidth={2.5} />
          </div>
          <span className="font-black uppercase tracking-tight text-slate-900">节点元数据标签治理</span>
        </div>
      }
      description="KUBERNETES LABELS & TOPOLOGY MANAGEMENT"
      width="max-w-xl"
      footer={
        <div className="flex gap-4 w-full">
           <button onClick={onClose} className="flex-1 px-4 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">
             DISCARD CHANGES
           </button>
           <button onClick={handleSave} className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-700 shadow-xl shadow-primary-500/20 flex items-center justify-center gap-2 transition-all active:scale-95">
             <Save size={14} /> COMMIT TO CLUSTER
           </button>
        </div>
      }
    >
      <div className="space-y-10 font-sans">
        {/* Node context card */}
        <div className="bg-slate-950 rounded-[32px] p-8 border border-slate-800 relative overflow-hidden shadow-2xl group">
           <div className="absolute top-0 right-0 p-10 opacity-[0.03] text-white pointer-events-none group-hover:opacity-[0.08] transition-opacity duration-700">
              <Server size={160} strokeWidth={1} />
           </div>
           <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                 <Badge status="primary" showDot={false}>PRODUCTION ASSET</Badge>
                 <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">{node.ip}</span>
              </div>
              <h4 className="text-2xl font-black text-white tracking-tight uppercase leading-none">{node.name}</h4>
              <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em]">已开启调度权重亲和性感知</p>
                 </div>
                 <span className="text-[10px] font-mono font-black text-primary-500/60 uppercase">NodePool: Default</span>
              </div>
           </div>
        </div>

        {/* Existing Labels section */}
        <div className="space-y-5">
           <div className="flex justify-between items-center px-1">
              <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                 <Settings2 size={14} className="text-primary-500" /> 生效标签清单 (REGISTRY)
              </h5>
              <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">{labels.length} ACTIVE</span>
           </div>
           <div className="bg-slate-50/50 border border-slate-200 rounded-[28px] p-6 min-h-[140px] flex flex-wrap gap-3 shadow-inner">
              {labels.map((label) => {
                const [k, v] = label.split('=');
                const isSystem = k.includes('kubernetes.io') || k.includes('ai-nex.io');
                const isNesting = k.includes('ai-nex.io');
                return (
                  <div 
                    key={label}
                    className={`flex items-center gap-3 pl-4 pr-2 py-2.5 rounded-2xl border transition-all group animate-in zoom-in-95 duration-200 ${isSystem ? (isNesting ? 'bg-primary-50/50 border-primary-100 ring-1 ring-primary-500/5' : 'bg-slate-100 border-slate-200 opacity-60') : 'bg-white border-slate-200 hover:border-red-200 hover:shadow-md'}`}
                  >
                    <div className="flex flex-col">
                       <span className={`text-[8px] font-black uppercase tracking-tighter mb-0.5 font-mono ${isNesting ? 'text-primary-600' : 'text-slate-400'}`}>{k}</span>
                       <span className={`text-[11px] font-black tracking-tight ${isSystem ? (isNesting ? 'text-primary-900' : 'text-slate-500') : 'text-slate-900'}`}>{v}</span>
                    </div>
                    {!k.includes('kubernetes.io') && (
                      <button 
                        onClick={() => removeLabel(label)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-slate-300 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <X size={14} strokeWidth={3} />
                      </button>
                    )}
                  </div>
                );
              })}
           </div>
        </div>

        {/* Integrated Add Label section */}
        <div className="pt-10 border-t border-slate-100 space-y-8">
           <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2 px-1">
              <Plus size={14} className="text-emerald-500" /> 定义新元数据 (NEW_SPEC)
           </h5>
           
           <div className="space-y-8 bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-[0.03] text-slate-900 pointer-events-none">
                 <Terminal size={80} />
              </div>
              
              {/* Unified Key Input Area */}
              <div className="space-y-4">
                 <div className="flex justify-between items-center px-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <KeyRound size={12} className="text-primary-500" /> 1. 标签键 (LABEL_KEY)
                    </label>
                    <span className="text-[8px] font-black text-slate-300 uppercase italic">Support Auto-Fill</span>
                 </div>

                 {/* Integrated Preset Chips directly above the input */}
                 <div className="flex flex-wrap gap-2">
                    {PREDEFINED_KEYS.map((item) => (
                       <button
                          key={item.id}
                          onClick={() => handleSelectPreset(item.key)}
                          className={`flex items-center gap-2 px-3 py-1.5 border rounded-xl transition-all text-[9px] font-black uppercase tracking-tight ${newKey === item.key ? 'bg-primary-600 border-primary-600 text-white shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-slate-300 hover:bg-white'}`}
                       >
                          <item.icon size={11} strokeWidth={3} />
                          {item.label}
                       </button>
                    ))}
                 </div>

                 <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors">
                       <Hash size={14} />
                    </div>
                    <input 
                       type="text" 
                       placeholder="输入或点击上方预设..."
                       value={newKey}
                       onChange={(e) => setNewKey(e.target.value)}
                       className={`w-full pl-11 pr-4 py-3.5 text-xs bg-slate-50 border rounded-2xl focus:bg-white outline-none transition-all font-mono font-bold tracking-tight ${newKey.includes('ai-nex.io') ? 'border-primary-500 bg-white ring-4 ring-primary-500/5' : 'border-slate-200 focus:border-primary-500'}`}
                    />
                 </div>
              </div>

              {/* Value Input Area */}
              <div className="space-y-4">
                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Type size={12} className="text-primary-500" /> 2. 标签值 (VALUE)
                 </label>
                 <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                       <Command size={14} />
                    </div>
                    <input 
                       ref={valueInputRef}
                       id="label-value-input"
                       type="text" 
                       placeholder="请输入对应数值 (e.g. a100, prod)..."
                       value={newValue}
                       onChange={(e) => setNewValue(e.target.value)}
                       onKeyDown={(e) => e.key === 'Enter' && handleAddLabel()}
                       className="w-full pl-11 pr-4 py-3.5 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-sans font-bold"
                    />
                 </div>
              </div>

              <button 
                 onClick={handleAddLabel}
                 disabled={!newKey || !newValue}
                 className="w-full py-4 bg-slate-950 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.25em] hover:bg-emerald-600 transition-all disabled:opacity-10 disabled:grayscale disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-2xl shadow-slate-950/20 active:scale-95 group"
              >
                 <Plus size={16} strokeWidth={3} className="group-hover:rotate-90 transition-transform" /> 
                 <span>ADD TO STAGING</span>
              </button>
           </div>
        </div>

        {/* Optimization Tip */}
        <div className="bg-primary-50/50 p-6 rounded-[28px] border border-primary-100 flex gap-4">
           <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary-600 shadow-sm shrink-0">
              <Sparkles size={20} strokeWidth={2.5} />
           </div>
           <p className="text-[10px] text-primary-800 font-bold leading-relaxed uppercase tracking-tight">
             系统建议：点击预设 Key 按钮可快速填充标准命名空间。标准化的标签键（Key）能够显著优化集群在跨 AZ 调度时的拓扑计算效率。
           </p>
        </div>
      </div>
    </Drawer>
  );
};

export default NodeLabelsDrawer;
