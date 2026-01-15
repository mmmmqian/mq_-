
import React, { useState, useEffect } from 'react';
import { 
  X, Server, Activity, Database, Shield, Box, AlertTriangle, 
  Trash2, Save, Settings, Info, Hash, Globe,
  Layout, Clock, Network, Cpu, Zap, ShieldCheck, ActivitySquare, Terminal,
  KeyRound, Link, Command, Layers, Gauge, CheckCircle2, AlertOctagon,
  ShieldAlert, Activity as ActivityIcon, Globe2, MousePointer2,
  Workflow, ZapOff, HardDrive, Timer, Folders, Share2, Binary, Search,
  Activity as Heartbeat, Radio, Component
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Drawer } from '../ui/Drawer';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  cluster: any;
}

// 1. Cluster Details Drawer - Refined for Enterprise Auditing
export const ClusterDetailsModal: React.FC<BaseModalProps> = ({ isOpen, onClose, cluster }) => {
  if (!cluster) return null;

  const warningCount = cluster.status === 'degraded' ? 1 : 0;
  const notReadyCount = cluster.nodeCount - cluster.readyNodes;
  const readyCount = Math.max(0, cluster.readyNodes - warningCount);

  const getClusterStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy': return <Badge status="success" showDot>健康 (HEALTHY)</Badge>;
      case 'degraded': return <Badge status="warning" showDot>警告 (WARNING)</Badge>;
      case 'unhealthy': return <Badge status="error" showDot>异常 (CRITICAL)</Badge>;
      default: return <Badge status="neutral" showDot>未知</Badge>;
    }
  };

  const SectionHeader = ({ icon: Icon, title, sub }: { icon: any, title: string, sub: string }) => (
    <div className="flex items-center gap-3 mb-5 mt-8 first:mt-0">
      <div className="p-1.5 bg-slate-900 rounded-lg text-white">
        <Icon size={14} strokeWidth={2.5} />
      </div>
      <div>
        <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">{title}</h4>
        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{sub}</p>
      </div>
    </div>
  );

  const DetailItem = ({ label, value, mono = false }: { label: string, value: any, mono?: boolean }) => (
    <div className="flex flex-col gap-1 py-3 border-b border-slate-50 last:border-0">
      <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{label}</span>
      <div className={`text-xs font-bold ${mono ? 'font-mono tracking-tight text-slate-700' : 'text-slate-900'}`}>
        {value || '--'}
      </div>
    </div>
  );

  const ResourceMetric = ({ label, used, total, icon: Icon, color }: { label: string, used: number, total: number, icon: any, color: string }) => {
    const percent = total > 0 ? Math.round((used / total) * 100) : 0;
    return (
      <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm group hover:border-primary-200 transition-all">
        <div className="flex justify-between items-center mb-2.5">
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
            <Icon size={12} className="text-slate-400" /> {label}
          </div>
          <span className={`text-[11px] font-black font-mono ${percent > 90 ? 'text-red-500' : 'text-slate-900'}`}>{percent}%</span>
        </div>
        <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden mb-2">
          <div className={`h-full transition-all duration-1000 ${color}`} style={{ width: `${percent}%` }} />
        </div>
        <div className="flex justify-between text-[9px] font-mono font-bold text-slate-400 uppercase tracking-tighter">
          <span>{used.toLocaleString()}</span>
          <span>/ {total.toLocaleString()}</span>
        </div>
      </div>
    );
  };

  const MasterComponentStatus = ({ name, status }: { name: string, status: string }) => {
    let badgeStatus: any = 'neutral';
    let label = '未知';
    
    if (status === 'healthy') {
      badgeStatus = 'success';
      label = '运行中';
    } else if (status === 'failed' || status === 'warning') {
      badgeStatus = 'error';
      label = '异常';
    } else if (status === 'stopped') {
      badgeStatus = 'neutral';
      label = '停止';
    }

    return (
      <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200/60 hover:bg-white hover:border-primary-300 transition-all group">
        <div className="flex items-center gap-3">
          <Shield size={14} className="text-slate-400 group-hover:text-primary-500 transition-colors" />
          <span className="text-[10px] font-black text-slate-600 uppercase tracking-tight font-mono">{name}</span>
        </div>
        <Badge status={badgeStatus} showDot>{label}</Badge>
      </div>
    );
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Server size={20} className="text-primary-600" />
          <span className="font-black font-sans uppercase tracking-tight">集群全维审计报告</span>
        </div>
      }
      description={`ASSET_UUID: ${cluster.id}`}
      width="max-w-4xl"
      footer={
        <button onClick={onClose} className="w-full py-3.5 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary-600 transition-all shadow-xl active:scale-95">
          CLOSE INFRASTRUCTURE AUDIT
        </button>
      }
    >
      <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 pb-10">
        {/* Top Summary Banner */}
        <div className="bg-slate-950 rounded-[32px] p-8 border border-slate-800 shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-12 opacity-5 text-white pointer-events-none group-hover:opacity-10 transition-opacity">
              <Gauge size={200} strokeWidth={1} />
           </div>
           <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                 <div className="flex items-center gap-6">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 ${cluster.status === 'healthy' ? 'bg-emerald-50/10 border-emerald-500/20 text-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.2)]' : 'bg-amber-500/10 border-amber-500/20 text-amber-500'}`}>
                       <ShieldCheck size={36} />
                    </div>
                    <div>
                       <h3 className="text-2xl font-black text-white tracking-tighter leading-none mb-3 uppercase">{cluster.displayName || cluster.name}</h3>
                       <div className="flex items-center gap-3">
                          {getClusterStatusBadge(cluster.status)}
                          <span className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest">K8s {cluster.k8sVersion}</span>
                       </div>
                    </div>
                 </div>
                 <div className="text-right">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5">内部部署名称 (NAME)</p>
                    <p className="text-sm font-black text-white font-mono tracking-tight">{cluster.name}</p>
                 </div>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8 border-t border-white/5">
                 <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">节点健康率</p>
                    <p className="text-lg font-black text-white font-mono">{cluster.readyNodes} <span className="text-slate-700">/</span> {cluster.nodeCount}</p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">活跃 POD 实例</p>
                    <p className="text-lg font-black text-white font-mono">{cluster.runningPods.toLocaleString()}</p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">环境级别</p>
                    <Badge status="primary" showDot={false}>{cluster.environment.toUpperCase()}</Badge>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">同步心跳</p>
                    <div className="flex items-center gap-2">
                       <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                       <span className="text-[11px] font-bold text-white uppercase tracking-wider">SYNC NOMINAL</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <SectionHeader icon={Info} title="基础配置元数据" sub="Core infrastructure identification" />
            <div className="bg-white rounded-[28px] p-6 border border-slate-200 shadow-soft divide-y divide-slate-50">
              <DetailItem label="集群名称" value={cluster.displayName} />
              <DetailItem label="集群唯一标识 (ID)" value={cluster.id} mono />
              <DetailItem label="Kubernetes 版本" value={cluster.k8sVersion} mono />
              <DetailItem label="环境类型" value={<Badge status="primary" showDot={false}>{cluster.environment.toUpperCase()}</Badge>} />
              <DetailItem label="注册时间" value={cluster.registeredAt} mono />
              <DetailItem label="最后同步时间" value={cluster.lastSync} mono />
              <DetailItem label="APIServer 证书到期" value={<span className="text-amber-600">{cluster.certExpiry}</span>} mono />
            </div>
          </div>
          <div className="space-y-4">
             <SectionHeader icon={Settings} title="软件定义架构 (SDN)" sub="Runtime & Connectivity Layer" />
             <div className="bg-white rounded-[28px] p-6 border border-slate-200 shadow-soft divide-y divide-slate-50">
                <DetailItem label="API SERVER ENDPOINT" value={cluster.apiUrl} mono />
                <DetailItem label="容器运行时 (RUNTIME)" value={cluster.containerRuntime || 'containerd://1.7.0'} mono />
                <DetailItem label="网络插件 (CNI)" value={cluster.networkPlugin || 'Cilium / Calico'} />
                <div className="py-4 space-y-3">
                   <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">物理节点健康矩阵 (READY/WARNING/NOTREADY)</span>
                   <div className="flex items-center gap-4">
                      <div className="flex-1 p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex flex-col items-center">
                         <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest mb-1">Ready</span>
                         <span className="text-sm font-black text-emerald-700 font-mono">{readyCount}</span>
                      </div>
                      <div className="flex-1 p-3 bg-amber-50 border border-amber-100 rounded-xl flex flex-col items-center">
                         <span className="text-[8px] font-black text-amber-600 uppercase tracking-widest mb-1">Warning</span>
                         <span className="text-sm font-black text-amber-700 font-mono">{warningCount}</span>
                      </div>
                      <div className="flex-1 p-3 bg-red-50 border border-red-100 rounded-xl flex flex-col items-center">
                         <span className="text-[8px] font-black text-red-600 uppercase tracking-widest mb-1">NotReady</span>
                         <span className="text-sm font-black text-red-700 font-mono">{notReadyCount}</span>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>

        <div className="space-y-5">
           <SectionHeader icon={Activity} title="集群算力实时水位" sub="Aggregate global resource consumption" />
           <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <ResourceMetric label="CPU 核心利用" used={cluster.resources.cpu.used} total={cluster.resources.cpu.total} icon={Cpu} color="bg-primary-600" />
              <ResourceMetric label="内存 提交总量" used={cluster.resources.memory.used} total={cluster.resources.memory.total} icon={ActivitySquare} color="bg-indigo-500" />
              <ResourceMetric label="GPU 加速单元" used={cluster.resources.gpu.used} total={cluster.resources.gpu.total} icon={Zap} color="bg-emerald-500" />
              <ResourceMetric label="分布式存储 (DFS)" used={cluster.resources.storage.used} total={cluster.resources.storage.total} icon={Database} color="bg-amber-500" />
              <ResourceMetric label="POD 实例载荷" used={cluster.runningPods} total={cluster.nodeCount * 110} icon={Layers} color="bg-slate-700" />
           </div>
        </div>

        <div className="space-y-5">
           <SectionHeader icon={Shield} title="控制面核心组件 (MASTER)" sub="Control plane self-diagnostic state" />
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <MasterComponentStatus name="API SERVER" status={cluster.masterComponents?.apiServer || 'healthy'} />
              <MasterComponentStatus name="SCHEDULER" status={cluster.masterComponents?.scheduler || 'healthy'} />
              <MasterComponentStatus name="CONTROLLER" status={cluster.masterComponents?.controllerManager || 'healthy'} />
              <MasterComponentStatus name="ETCD CLUSTER" status={cluster.masterComponents?.etcd || 'healthy'} />
           </div>
        </div>
      </div>
    </Drawer>
  );
};

// 2. Master Components Modal - Precisely Refined based on rigorous design and audit requirements
export const MasterComponentsModal: React.FC<BaseModalProps> = ({ isOpen, onClose, cluster }) => {
  if (!cluster) return null;

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'healthy':
        return { 
          label: '运行中', 
          status: 'success' as const, 
          iconBg: 'bg-emerald-50 border-emerald-100 text-emerald-500', 
          activeIconBg: 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]' 
        };
      case 'stopped':
        return { 
          label: '停止', 
          status: 'neutral' as const, 
          iconBg: 'bg-slate-50 border-slate-200 text-slate-400', 
          activeIconBg: 'bg-slate-400 text-white' 
        };
      case 'failed':
      case 'warning':
      default:
        return { 
          label: '异常', 
          status: 'error' as const, 
          iconBg: 'bg-red-50 border-red-100 text-red-500', 
          activeIconBg: 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]' 
        };
    }
  };

  const ComponentCard = ({ 
    name, 
    icon: Icon, 
    status, 
    metrics 
  }: { 
    name: string; 
    icon: any; 
    status: string; 
    metrics: { label: string; value: string; mono?: boolean; icon?: any }[] 
  }) => {
    const config = getStatusConfig(status);
    return (
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:border-primary-400 transition-all group/card">
         <div className="px-6 py-5 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
            <div className="flex items-center gap-4">
               <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-500 border ${status === 'healthy' ? config.activeIconBg : config.iconBg}`}>
                  <Icon size={20} strokeWidth={2.5} />
               </div>
               <div className="flex flex-col">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider font-sans">{name}</h4>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Control Plane Component</span>
               </div>
            </div>
            <Badge status={config.status} showDot>{config.label}</Badge>
         </div>
         <div className="p-6 grid grid-cols-2 gap-y-6 gap-x-8">
            {metrics.map((m, idx) => (
               <div key={idx} className="flex flex-col gap-1.5">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    {m.icon && <m.icon size={10} className="text-slate-300" />} {m.label}
                  </span>
                  <span className={`text-[11px] font-bold ${m.mono ? 'font-mono text-slate-600 tracking-tight' : 'text-slate-800'}`}>{m.value}</span>
               </div>
            ))}
         </div>
      </div>
    );
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Heartbeat size={20} className="text-primary-600" strokeWidth={2.5} />
          <span className="font-black font-sans uppercase tracking-tight text-slate-900">控制面健康审计中心</span>
        </div>
      }
      description={`Health Check Snapshot: ${cluster.displayName || cluster.name}`}
      width="max-w-2xl"
      footer={
        <button onClick={onClose} className="w-full py-3.5 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary-600 transition-all shadow-xl active:scale-95">
          DONE / CLOSE AUDIT
        </button>
      }
    >
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 pb-10">
         {/* API Server */}
         <ComponentCard 
            name="API Server" 
            icon={Server} 
            status={cluster.masterComponents?.apiServer || 'healthy'} 
            metrics={[
               { label: '服务地址 (ADDRESS)', value: cluster.apiUrl, mono: true, icon: Link },
               { label: '组件版本 (VERSION)', value: cluster.k8sVersion, mono: true, icon: Hash },
               { label: 'P99 响应时间', value: '12ms', mono: true, icon: Timer },
               { label: '最后健康检查', value: cluster.lastSync, mono: true, icon: Clock }
            ]}
         />

         {/* Scheduler */}
         <ComponentCard 
            name="Kube-Scheduler" 
            icon={Workflow} 
            status={cluster.masterComponents?.scheduler || 'healthy'} 
            metrics={[
               { label: '调度算法策略', value: 'LeastRequestedPriority', icon: Settings },
               { label: '待调度 Pod 总量', value: '0', mono: true, icon: Box },
               { label: '最近调度成功率', value: '99.98%', mono: true, icon: CheckCircle2 },
               { label: '算法计算延迟', value: '2.4ms', mono: true, icon: Activity }
            ]}
         />

         {/* Controller Manager */}
         <ComponentCard 
            name="Controller Manager" 
            icon={Component} 
            status={cluster.masterComponents?.controllerManager || 'healthy'} 
            metrics={[
               { label: '活跃控制器数量', value: '32', mono: true, icon: Layers },
               { label: '当前在线控制器', value: 'Node, Deployment, Job...', icon: ShieldCheck },
               { label: '同步步频 (SYNC)', value: '10s', mono: true, icon: Timer },
               { label: '异常处理队列', value: '0', mono: true, icon: Activity }
            ]}
         />

         {/* etcd */}
         <ComponentCard 
            name="etcd Cluster" 
            icon={Database} 
            status={cluster.masterComponents?.etcd || 'healthy'} 
            metrics={[
               { label: '组件内核版本', value: 'v3.5.10', mono: true, icon: Hash },
               { label: '共识节点总数', value: '3 Nodes', mono: true, icon: Box },
               { label: '存储数据载荷', value: '1.2 GB', mono: true, icon: HardDrive },
               { label: 'RAFT 共识状态', value: 'NORMAL (Quorum OK)', icon: ShieldCheck }
            ]}
         />

         <div className="bg-primary-50/50 border border-primary-100 p-6 rounded-3xl flex gap-4">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary-600 shadow-sm shrink-0">
               <ShieldAlert size={20} strokeWidth={2.5} />
            </div>
            <p className="text-[10px] text-primary-800 font-bold leading-relaxed uppercase tracking-tight">
               核心组件健康度由 AI-Nex Telemetry Agent 实时拨测。Icon 颜色说明：绿色代表运行中且响应正常；灰色代表停止；红色代表异常或连接超时。
            </p>
         </div>
      </div>
    </Drawer>
  );
};

// 3. Edit Cluster Drawer - Alignment with Registration Requirements
export const EditClusterModal: React.FC<BaseModalProps> = ({ isOpen, onClose, cluster }) => {
  const [formData, setFormData] = useState({
    environment: 'production',
    apiUrl: '',
    authType: 'serviceAccount',
    token: 'eyJhbGciOiJSUzI1NiIsImtpZCI6Ik5V...',
    resourceQuota: 85
  });

  useEffect(() => {
    if (cluster && isOpen) {
      setFormData({
        environment: cluster.environment || 'production',
        apiUrl: cluster.apiUrl || '',
        authType: 'serviceAccount',
        token: 'eyJhbGciOiJSUzI1NiIsImtpZCI6Ik5V...', 
        resourceQuota: 85
      });
    }
  }, [cluster, isOpen]);

  if (!cluster) return null;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Settings size={20} className="text-primary-600" />
          <span className="font-black font-sans uppercase tracking-tight text-slate-900">集群属性管理</span>
        </div>
      }
      description={`正在调整核心资产配置: ${cluster.name}`}
      width="max-w-xl"
      footer={
        <div className="flex gap-3 w-full">
          <button onClick={onClose} className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">
            取消
          </button>
          <button onClick={onClose} className="flex-1 py-2.5 bg-primary-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-700 shadow-lg shadow-primary-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
            <Save size={14} /> 保存修改
          </button>
        </div>
      }
    >
      <div className="space-y-10 py-2">
        <div className="bg-slate-950 rounded-[28px] p-7 border border-slate-800 shadow-xl space-y-6 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-white pointer-events-none">
              <Shield size={140} strokeWidth={1} />
           </div>
           <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] flex items-center gap-2 relative z-10">
              <Shield size={12} className="text-primary-500" /> 系统核心不可变标识 (IDENTITY)
           </h4>
           <div className="grid grid-cols-1 gap-5 relative z-10">
              <div className="space-y-2">
                 <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5 ml-1">
                    集群唯一 ID (UUID)
                 </label>
                 <div className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-mono font-bold text-slate-400 flex items-center gap-3">
                    <Hash size={12} className="text-slate-600" /> {cluster.id}
                 </div>
              </div>
              <div className="space-y-2">
                 <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5 ml-1">
                    集群名称 (NAME)
                 </label>
                 <div className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-mono font-bold text-slate-400 flex items-center gap-3">
                    <Server size={12} className="text-slate-600" /> {cluster.name}
                 </div>
              </div>
           </div>
        </div>
        <div className="space-y-8">
           <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] flex items-center gap-2 px-1">
              <Settings size={12} className="text-primary-500" /> 运行环境与连接定义 (CONFIG)
           </h4>
           <div className="space-y-6">
              <div className="grid grid-cols-1 gap-5">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-1.5 ml-1">
                      环境运行级别 <span className="text-red-500">*</span>
                   </label>
                   <select 
                      value={formData.environment}
                      onChange={(e) => setFormData({...formData, environment: e.target.value})}
                      className="w-full px-4 py-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all font-sans font-bold text-slate-900 cursor-pointer"
                   >
                      <option value="production">生产环境 (PRODUCTION)</option>
                      <option value="testing">测试环境 (TESTING)</option>
                      <option value="development">开发环境 (DEVELOPMENT)</option>
                      <option value="edge">边缘环境 (EDGE)</option>
                   </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-1.5 ml-1">
                  API Server URL <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <Link size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500" />
                  <input 
                    type="text" 
                    value={formData.apiUrl}
                    onChange={(e) => setFormData({...formData, apiUrl: e.target.value})}
                    placeholder="https://k8s-api.example.com:6443"
                    className="w-full pl-11 pr-4 py-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary-500 outline-none transition-all font-mono font-bold"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-1.5 ml-1">
                    认证方式
                  </label>
                  <select 
                    className="w-full px-4 py-3 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 cursor-not-allowed"
                    disabled
                  >
                    <option value="serviceAccount">ServiceAccount</option>
                  </select>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-1.5 ml-1">
                    Token (METRICS_SECRET)
                  </label>
                  <textarea 
                    rows={1}
                    value={formData.token}
                    onChange={(e) => setFormData({...formData, token: e.target.value})}
                    className="w-full px-4 py-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary-500 outline-none transition-all font-mono font-bold min-h-[42px] resize-none"
                  />
                </div>
              </div>
              <div className="space-y-5 pt-4">
                 <div className="flex justify-between items-end px-1">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-1.5 font-sans">
                        算力分配阈值 (RESERVE_CAP)
                      </label>
                      <p className="text-[8px] text-slate-400 font-bold uppercase italic">* 设置平台可调度资源上限，建议保留 15% 冗余</p>
                    </div>
                    <span className="text-lg font-black font-mono text-primary-600">{formData.resourceQuota}%</span>
                 </div>
                 <div className="relative pt-2">
                    <input 
                        type="range" 
                        min="50" 
                        max="100" 
                        step="5"
                        value={formData.resourceQuota}
                        onChange={(e) => setFormData({...formData, resourceQuota: parseInt(e.target.value)})}
                        className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-primary-600"
                    />
                    <div className="flex justify-between text-[8px] font-black text-slate-300 mt-3 px-1">
                        <span>50% SAFETY</span>
                        <span>75% NORMAL</span>
                        <span>100% RAW_LINK</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>
        <div className="bg-amber-50/50 p-6 rounded-[24px] border border-amber-100 flex gap-4 relative overflow-hidden group">
           <div className="absolute -right-4 -bottom-4 opacity-[0.05] text-amber-600 pointer-events-none group-hover:scale-110 transition-transform">
              <AlertTriangle size={80} />
           </div>
           <AlertTriangle size={24} className="text-amber-500 shrink-0 mt-0.5" />
           <div className="relative z-10">
              <h5 className="text-[10px] font-black text-amber-800 uppercase tracking-widest mb-1.5">配置变更风险说明</h5>
              <p className="text-[11px] text-amber-700/80 font-bold font-sans leading-relaxed tracking-tight">
                修改环境标识或连接凭证可能导致正在运行的任务暂时断连。请在集群维护窗口或资源利用低峰期执行此操作。
              </p>
           </div>
        </div>
      </div>
    </Drawer>
  );
};

// 4. Unregister Cluster Modal
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
           <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight text-slate-900">解除注册确认</h3>
           <p className="text-sm text-slate-500 leading-relaxed px-4 font-sans font-medium">
             您确定要解除 <span className="font-black text-slate-900">{cluster.displayName || cluster.name}</span> 的注册吗？
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
