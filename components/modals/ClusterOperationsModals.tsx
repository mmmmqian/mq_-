
import React, { useState, useEffect } from 'react';
import { X, Server, Activity, Database, Shield, Box, AlertTriangle, Trash2, Save, Settings, Info, Hash, Globe, Tag as TagIcon, Layout } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Drawer } from '../ui/Drawer';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  cluster: any;
}

// 1. Cluster Details Drawer
export const ClusterDetailsModal: React.FC<BaseModalProps> = ({ isOpen, onClose, cluster }) => {
  if (!cluster) return null;

  const DetailRow = ({ label, value, mono = false }: { label: string; value: React.ReactNode; mono?: boolean }) => (
    <div className="flex justify-between py-3 border-b border-slate-100 last:border-0 items-center">
      <span className="text-xs text-slate-500 font-bold uppercase tracking-wider font-sans">{label}</span>
      <span className={`text-sm text-slate-800 font-semibold ${mono ? 'font-mono' : 'font-sans'}`}>{value}</span>
    </div>
  );

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Server size={20} className="text-primary-600" />
          <span className="font-black font-sans uppercase tracking-tight">集群全维分析报告</span>
        </div>
      }
      description={cluster.displayName}
      width="max-w-2xl"
      footer={
        <button onClick={onClose} className="w-full py-2.5 bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all">
          关闭面板
        </button>
      }
    >
      <div className="grid grid-cols-1 gap-8">
        <div className="space-y-4">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-4">
            <Info size={14} className="text-primary-500" /> 基础信息 Matrix
          </h4>
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-soft">
            <DetailRow label="集群 ID" value={cluster.id} mono />
            <DetailRow label="内部名称" value={cluster.name} mono />
            <DetailRow label="环境类型" value={<Badge status="primary">{cluster.environment}</Badge>} />
            <DetailRow label="K8s 版本" value={cluster.k8sVersion} mono />
            <DetailRow label="部署地域" value={cluster.region} />
            <DetailRow label="注册时间" value={cluster.registeredAt} />
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-4">
            <Box size={14} className="text-primary-500" /> 实时资源现状
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
               <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Nodes Count</div>
               <div className="text-2xl font-black text-slate-900 font-mono">{cluster.nodeCount}</div>
            </div>
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
               <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Active Pods</div>
               <div className="text-2xl font-black text-slate-900 font-mono">{cluster.runningPods}</div>
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

// 2. Master Components Drawer
export const MasterComponentsModal: React.FC<BaseModalProps> = ({ isOpen, onClose, cluster }) => {
  if (!cluster) return null;

  const ComponentStatus = ({ name, status, icon: Icon }: { name: string; status: string; icon: any }) => (
    <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl shadow-soft hover:border-primary-300 transition-all group">
       <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg transition-colors ${status === 'healthy' ? 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white' : status === 'warning' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'}`}>
             <Icon size={18} />
          </div>
          <div>
             <h4 className="text-xs font-black text-slate-900 font-sans tracking-tight uppercase">{name}</h4>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Control Plane Component</p>
          </div>
       </div>
       <Badge status={status === 'healthy' ? 'success' : status === 'warning' ? 'warning' : 'error'}>
          {status === 'healthy' ? 'Healthy' : status === 'warning' ? 'Warning' : 'Critical'}
       </Badge>
    </div>
  );

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Activity size={20} className="text-primary-600" />
          <span className="font-black font-sans uppercase tracking-tight">控制面健康审计</span>
        </div>
      }
      description={`Health Check: ${cluster.displayName}`}
      width="max-w-md"
      footer={
        <button onClick={onClose} className="w-full py-2.5 bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all">
          关闭报告
        </button>
      }
    >
      <div className="space-y-4">
         <ComponentStatus name="API Server" status={cluster.masterComponents?.apiServer || 'healthy'} icon={Server} />
         <ComponentStatus name="Scheduler" status={cluster.masterComponents?.scheduler || 'healthy'} icon={Box} />
         <ComponentStatus name="Controller Manager" status={cluster.masterComponents?.controllerManager || 'healthy'} icon={Shield} />
         <ComponentStatus name="Etcd" status={cluster.masterComponents?.etcd || 'healthy'} icon={Database} />
      </div>
    </Drawer>
  );
};

// 3. Edit Cluster Drawer - Refined and Modern
export const EditClusterModal: React.FC<BaseModalProps> = ({ isOpen, onClose, cluster }) => {
  const [formData, setFormData] = useState({
    displayName: '',
    environment: '',
    region: '',
    quotaPercent: 85,
    tags: [] as string[]
  });

  useEffect(() => {
    if (cluster && isOpen) {
      setFormData({
        displayName: cluster.displayName || '',
        environment: cluster.environment || 'production',
        region: cluster.region || '',
        quotaPercent: 85,
        tags: cluster.tags || []
      });
    }
  }, [cluster, isOpen]);

  if (!cluster) return null;

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tagToRemove) }));
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Settings size={20} className="text-primary-600" />
          <span className="font-black font-sans uppercase tracking-tight">配置管理与属性调整</span>
        </div>
      }
      description={`集群资产: ${cluster.name}`}
      width="max-w-lg"
      footer={
        <div className="flex gap-3 w-full">
          <button onClick={onClose} className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all">
            取消
          </button>
          <button onClick={onClose} className="flex-1 py-2.5 bg-primary-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary-700 shadow-lg shadow-primary-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
            <Save size={14} /> 保存配置
          </button>
        </div>
      }
    >
      <div className="space-y-8">
        {/* Read-only System Identifiers */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-5">
           <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <Shield size={12} className="text-slate-400" /> 系统核心标识 (不可修改)
           </h4>
           <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1.5">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 ml-1">
                    <Hash size={10} /> Cluster ID
                 </label>
                 <div className="w-full px-4 py-3 bg-slate-200/50 border border-slate-300/50 rounded-xl text-xs font-mono font-bold text-slate-600 flex items-center gap-2">
                    <Shield size={12} className="text-slate-400" /> {cluster.id}
                 </div>
              </div>
              <div className="space-y-1.5">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 ml-1">
                    <Layout size={10} /> Internal Name
                 </label>
                 <div className="w-full px-4 py-3 bg-slate-200/50 border border-slate-300/50 rounded-xl text-xs font-mono font-bold text-slate-600 flex items-center gap-2">
                    <Server size={12} className="text-slate-400" /> {cluster.name}
                 </div>
              </div>
           </div>
        </div>

        {/* Editable Metadata */}
        <div className="space-y-6">
           <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
              <Settings size={12} className="text-primary-500" /> 业务属性配置
           </h4>

           <div className="space-y-5">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5 ml-1 font-sans">
                    集群显示名称
                 </label>
                 <input 
                    type="text" 
                    value={formData.displayName}
                    onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                    placeholder="例如: 生产核心集群-01"
                    className="w-full px-4 py-3 text-xs bg-white border border-slate-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all font-sans font-bold text-slate-900" 
                 />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5 ml-1 font-sans">
                      环境类型
                   </label>
                   <select 
                      value={formData.environment}
                      onChange={(e) => setFormData({...formData, environment: e.target.value})}
                      className="w-full px-4 py-3 text-xs bg-white border border-slate-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all font-sans font-bold text-slate-900 cursor-pointer"
                   >
                      <option value="production">生产环境 (Production)</option>
                      <option value="testing">测试环境 (Testing)</option>
                      <option value="development">开发环境 (Development)</option>
                   </select>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5 ml-1 font-sans">
                      部署地域
                   </label>
                   <div className="relative group">
                      <Globe size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="text" 
                        value={formData.region}
                        onChange={(e) => setFormData({...formData, region: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 text-xs bg-white border border-slate-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all font-sans font-bold text-slate-900"
                      />
                   </div>
                </div>
              </div>

              <div className="space-y-2">
                 <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5 font-sans">
                       资源分配阈值 (RESERVE)
                    </label>
                    <span className="text-xs font-black font-mono text-primary-600">{formData.quotaPercent}%</span>
                 </div>
                 <input 
                    type="range" 
                    min="50" 
                    max="100" 
                    step="5"
                    value={formData.quotaPercent}
                    onChange={(e) => setFormData({...formData, quotaPercent: parseInt(e.target.value)})}
                    className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-primary-600"
                 />
                 <p className="text-[9px] text-slate-400 font-bold uppercase italic">* 调整平台可调度的最大物理资源百分比</p>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-100">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5 ml-1 font-sans">
                    <TagIcon size={12} /> 集群业务标签 (TAGS)
                 </label>
                 <div className="flex flex-wrap gap-2 p-3 bg-slate-50/50 border border-slate-100 rounded-2xl min-h-[100px]">
                    {formData.tags.map(tag => (
                       <span key={tag} className="flex items-center gap-1.5 bg-white text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200 text-[10px] font-black uppercase tracking-widest shadow-sm group/tag transition-all hover:border-red-200 hover:text-red-500 cursor-default">
                          {tag}
                          <button onClick={() => handleRemoveTag(tag)} className="p-0.5 rounded-full hover:bg-red-50 text-slate-300 group-hover/tag:text-red-500 transition-colors">
                             <X size={10} strokeWidth={3} />
                          </button>
                       </span>
                    ))}
                    <button className="px-3 py-1.5 bg-white border border-dashed border-slate-300 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:border-primary-500 hover:text-primary-600 transition-all flex items-center gap-1.5">
                       + ADD TAG
                    </button>
                 </div>
              </div>
           </div>
        </div>

        {/* Risk Warning */}
        <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-100 flex gap-4">
           <AlertTriangle size={20} className="text-amber-500 shrink-0 mt-0.5" />
           <p className="text-[11px] text-amber-700 font-bold font-sans leading-relaxed">
             配置变更将直接影响系统调度策略。请确保地域与环境参数的准确性，以免造成跨 AZ 调度异常或生产资源隔离失效。
           </p>
        </div>
      </div>
    </Drawer>
  );
};

// 4. Unregister Cluster Modal (Kept as Modal for Safety)
export const UnregisterClusterModal: React.FC<BaseModalProps> = ({ isOpen, onClose, cluster }) => {
  if (!isOpen || !cluster) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200 border border-red-100 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-red-600"></div>
        <div className="px-8 py-10 text-center">
           <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-100">
              <AlertTriangle size={36} className="text-red-500" />
           </div>
           <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">解除注册确认</h3>
           <p className="text-sm text-slate-500 leading-relaxed px-4 font-sans font-medium">
             您确定要解除 <span className="font-black text-slate-900">{cluster.displayName}</span> 的注册吗？
             <br/>
             此操作将停止该集群的所有纳管服务，且<span className="text-red-600 font-black">不可恢复</span>。
           </p>
        </div>

        <div className="px-8 py-5 bg-slate-50 border-t border-slate-200 flex gap-3">
           <button onClick={onClose} className="flex-1 px-4 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all">取消操作</button>
           <button onClick={onClose} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-700 shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 transition-all active:scale-95">
             <Trash2 size={16} /> 确认解除
           </button>
        </div>
      </div>
    </div>
  );
};
