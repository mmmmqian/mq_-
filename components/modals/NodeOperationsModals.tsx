
import React from 'react';
import { AlertTriangle, RotateCw, X } from 'lucide-react';

interface RebootNodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (node: any) => void;
  node: any | null;
}

export const RebootNodeModal: React.FC<RebootNodeModalProps> = ({ isOpen, onClose, onConfirm, node }) => {
  if (!isOpen || !node) return null;

  const handleConfirm = () => {
    onConfirm(node);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose}
      ></div>
      
      {/* Modal Panel */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200 border border-red-100 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-red-500"></div>
        
        <div className="px-8 py-10 text-center">
           <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-100 relative">
              <div className="absolute inset-0 bg-red-200 rounded-full animate-ping opacity-20"></div>
              <AlertTriangle size={36} className="text-red-500 relative z-10" />
           </div>
           
           <h3 className="text-xl font-black text-slate-900 mb-3 tracking-tight">确认重启计算节点？</h3>
           
           <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-6">
              <div className="flex flex-col gap-1">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Node</span>
                 <span className="text-sm font-bold font-mono text-slate-900">{node.name}</span>
                 <span className="text-[11px] font-medium text-slate-500">{node.ip}</span>
              </div>
           </div>
           
           <p className="text-xs text-slate-500 leading-relaxed px-4">
             重启操作将导致该节点进入 <span className="text-red-600 font-bold">NotReady</span> 状态，其上运行的所有 Pod 可能会被重新调度或中断。请确保已完成流量切除。
           </p>
        </div>

        <div className="px-8 py-5 bg-slate-50 border-t border-slate-200 flex gap-4">
           <button 
             onClick={onClose} 
             className="flex-1 px-4 py-3 bg-white border border-slate-300 text-slate-700 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95"
           >
             放弃操作
           </button>
           <button 
             onClick={handleConfirm} 
             className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-700 shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 transition-all active:scale-95 group"
           >
             <RotateCw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
             确认重启
           </button>
        </div>
      </div>
    </div>
  );
};
