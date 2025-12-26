
import React, { useState, useEffect } from 'react';
import { Drawer } from '../ui/Drawer';
import { Tag, Plus, X, Server, Save, Info, Hash, KeyRound, Type } from 'lucide-react';
import { Badge } from '../ui/Badge';

interface NodeLabelsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  node: any | null;
}

export const NodeLabelsDrawer: React.FC<NodeLabelsDrawerProps> = ({ isOpen, onClose, node }) => {
  const [labels, setLabels] = useState<string[]>([]);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  // 模拟初始化标签数据 (在实际应用中从 node 对象获取)
  useEffect(() => {
    if (node) {
      setLabels([
        'node-type=gpu',
        'gpu-vendor=nvidia',
        'gpu-type=a100',
        'zone=zone-a',
        'environment=production'
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

  const handleSave = () => {
    console.log(`Saving labels for node ${node?.name}:`, labels);
    onClose();
  };

  if (!node) return null;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Tag size={20} className="text-primary-600" />
          <span>节点标签管理</span>
        </div>
      }
      description="Kubernetes Labels & Annotations"
      width="max-w-md"
      footer={
        <div className="flex gap-3 w-full">
           <button onClick={onClose} className="flex-1 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all">
             取消
           </button>
           <button onClick={handleSave} className="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-xl text-xs font-bold hover:bg-primary-700 shadow-lg shadow-primary-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
             <Save size={14} /> 保存更改
           </button>
        </div>
      }
    >
      <div className="space-y-8">
        {/* Node Context */}
        <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-5 flex items-center gap-4">
           <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 text-primary-600">
             <Server size={20} />
           </div>
           <div>
              <h4 className="text-sm font-black text-slate-900 tracking-tight">{node.name}</h4>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono mt-0.5 uppercase tracking-tighter">
                <Hash size={10} /> {node.ip}
              </div>
           </div>
        </div>

        {/* Labels List */}
        <div className="space-y-4">
           <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
              <Tag size={12} className="text-slate-300" /> 现有标签清单 ({labels.length})
           </h4>
           <div className="flex flex-wrap gap-2.5">
              {labels.map((label) => (
                <div 
                  key={label}
                  className="flex items-center gap-1.5 bg-primary-50/40 text-primary-700 px-3 py-1.5 rounded-xl border border-primary-100 text-[11px] font-bold group animate-in zoom-in-95 duration-200"
                >
                  <span className="tracking-tighter uppercase font-mono">{label}</span>
                  <button 
                    onClick={() => removeLabel(label)}
                    className="p-0.5 rounded-full hover:bg-primary-200 text-primary-300 hover:text-red-500 transition-all"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              {labels.length === 0 && (
                <div className="w-full py-10 text-center border-2 border-dashed border-slate-100 rounded-2xl text-slate-400 text-xs font-medium">
                   当前节点未分配任何业务标签
                </div>
              )}
           </div>
        </div>

        {/* Add Label Form - Optimized UI */}
        <div className="pt-8 border-t border-slate-100 space-y-5">
           <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
              <Plus size={12} className="text-primary-500" /> 定义新标签元数据
           </h4>
           
           <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5 ml-1">
                    <KeyRound size={10} /> KEY
                 </label>
                 <input 
                    type="text" 
                    placeholder="e.g. app.role"
                    value={newKey}
                    onChange={(e) => setNewKey(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs bg-slate-50/50 border border-slate-200/80 rounded-xl placeholder:text-slate-300 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all font-mono font-medium hover:bg-slate-50"
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5 ml-1">
                    <Type size={10} /> VALUE
                 </label>
                 <input 
                    type="text" 
                    placeholder="e.g. worker"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs bg-slate-50/50 border border-slate-200/80 rounded-xl placeholder:text-slate-300 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all font-mono font-medium hover:bg-slate-50"
                 />
              </div>
           </div>

           <button 
              onClick={handleAddLabel}
              disabled={!newKey || !newValue}
              className="w-full py-3 bg-slate-900 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-primary-600 transition-all disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10 active:scale-[0.98]"
           >
              <Plus size={14} strokeWidth={3} /> 添加标签到暂存区
           </button>
        </div>

        {/* Guidance */}
        <div className="bg-amber-50/40 p-5 rounded-2xl border border-amber-100/60 flex gap-3.5">
           <Info size={18} className="text-amber-500 shrink-0 mt-0.5" />
           <p className="text-[11px] text-amber-700/80 leading-relaxed font-semibold">
             标签修改将实时同步至 Kubernetes API Server。这可能会触发节点亲和性重新评估，导致部分 Pod 的重新调度，请确保操作符合业务窗口规范。
           </p>
        </div>
      </div>
    </Drawer>
  );
};
