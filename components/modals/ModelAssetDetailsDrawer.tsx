
import React, { useState, useEffect } from 'react';
import { Drawer } from '../ui/Drawer';
import { Badge } from '../ui/Badge';
import { 
  Box, GitBranch, Settings, History, 
  Terminal, ShieldCheck, Database, 
  Activity, Clock, Layers, User,
  FileCode, Zap, Rocket, Download,
  CheckCircle2, AlertCircle, Info,
  TrendingUp, BarChart3, LineChart,
  Lock, Share2, Globe, Command, Trash2,
  Plus, Copy, Link, Gauge, MousePointer2,
  ChevronRight, FileJson, FolderSync,
  DownloadCloud, BarChart
} from 'lucide-react';
import MonitoringChart from '../ui/MonitoringChart';
import { MOCK_MONITORING_HISTORY } from '../../constants';
import { PublishModelVersionModal } from './PublishModelVersionModal';

interface ModelAssetDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  model: any;
  initialTab?: 'overview' | 'versions' | 'config' | 'audit';
}

export const ModelAssetDetailsDrawer: React.FC<ModelAssetDetailsDrawerProps> = ({ isOpen, onClose, model, initialTab = 'overview' }) => {
  // --- 1. 所有 Hooks 必须定义在组件顶部 ---
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  // --- 2. 处理逻辑 ---
  const handleCopyPath = (path: string) => {
    navigator.clipboard.writeText(path);
    setCopiedId(path);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'stable': return { label: '稳定 (STABLE)', variant: 'success' as const };
      case 'experimental': return { label: '实验 (BETA)', variant: 'warning' as const };
      case 'deprecated': return { label: '已弃用 (EOL)', variant: 'neutral' as const };
      default: return { label: status.toUpperCase(), variant: 'neutral' as const };
    }
  };

  // --- 3. 辅助组件 ---
  const DetailRow = ({ label, value, mono = false, icon: Icon }: any) => (
    <div className="flex justify-between py-3.5 border-b border-slate-50 last:border-0 items-center">
      <div className="flex items-center gap-2.5">
        {Icon && <Icon size={14} className="text-slate-300" />}
        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{label}</span>
      </div>
      <span className={`text-xs font-bold ${mono ? 'font-mono text-slate-600' : 'text-slate-800'}`}>{value}</span>
    </div>
  );

  // --- 4. 安全退出：确保 Hooks 已全部初始化 ---
  if (!model) return null;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white shadow-lg">
             <Box size={16} strokeWidth={2.5} />
          </div>
          <span className="font-black uppercase tracking-tight text-slate-900">模型资产全维审计</span>
        </div>
      }
      description={`ASSET_UUID: ${model.id}`}
      width="max-w-5xl"
      footer={
        <div className="flex gap-4 w-full">
           <button onClick={onClose} className="flex-1 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">
             CLOSE AUDIT
           </button>
           <button className="flex-1 py-3 bg-primary-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-700 shadow-xl shadow-primary-500/20 flex items-center justify-center gap-2 transition-all active:scale-95">
             <Rocket size={14} /> 即刻发布推理服务
           </button>
        </div>
      }
    >
      <PublishModelVersionModal 
        isOpen={isPublishModalOpen} 
        onClose={() => setIsPublishModalOpen(false)} 
        model={model} 
      />

      <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 pb-6">
        
        {/* Header Hero */}
        <div className="bg-slate-950 rounded-[32px] p-8 border border-slate-800 relative overflow-hidden shadow-2xl group">
           <div className="absolute top-0 right-0 p-10 opacity-[0.03] text-white pointer-events-none group-hover:opacity-[0.08] transition-opacity duration-700">
              <Box size={240} strokeWidth={1} />
           </div>
           <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                 <div className="space-y-3">
                    <div className="flex items-center gap-3">
                       <span className="text-[10px] font-black text-primary-500 uppercase tracking-widest">Verified Asset</span>
                       <div className="w-1 h-1 rounded-full bg-slate-700"></div>
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono">ID: {model.id}</span>
                    </div>
                    <h3 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">{model.displayName}</h3>
                 </div>
                 <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-lg">
                       <ShieldCheck size={12} className="text-emerald-500" />
                       <span className="text-[9px] font-black text-white uppercase tracking-widest">System Certified</span>
                    </div>
                    <p className="text-[10px] font-mono font-bold text-slate-500 uppercase">{model.framework}</p>
                 </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-8 border-t border-white/5">
                 <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">累计推理调用</p>
                    <p className="text-xl font-black text-white font-mono tracking-tight">42.5k <span className="text-[10px] text-slate-700">REQS</span></p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">物理存储占用</p>
                    <p className="text-xl font-black text-white font-mono tracking-tight">{model.size}</p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">版本迭代总计</p>
                    <p className="text-xl font-black text-white font-mono tracking-tight">{model.versions?.length || 1} <span className="text-[10px] text-slate-700">REVS</span></p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">累计下载总量</p>
                    <p className="text-xl font-black text-white font-mono tracking-tight">1.2k <span className="text-[10px] text-slate-700">UNITS</span></p>
                 </div>
              </div>
           </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 sticky top-0 bg-white z-20">
           {[
              { id: 'overview', label: '运行概览', icon: Activity },
              { id: 'versions', label: '版本矩阵 (Registry)', icon: GitBranch },
              { id: 'config', label: '配置定义', icon: Settings },
              { id: 'audit', label: '审计日志', icon: History }
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

        <div className="min-h-[400px]">
           {activeTab === 'overview' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                       <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
                          <Info size={16} className="text-primary-600" /> 核心元数据 (METADATA)
                       </h4>
                       <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm divide-y divide-slate-50">
                          <DetailRow label="资产名称" value={model.displayName} icon={Command} />
                          <DetailRow label="内部标识符" value={model.name} mono icon={Terminal} />
                          <DetailRow label="架构体系" value={model.framework} icon={Layers} />
                          <DetailRow label="所属团队" value={model.owner} icon={User} />
                          <DetailRow label="存储后端" value={model.storageType || 'S3 (Internal)'} icon={Database} />
                          <DetailRow label="Python 环境" value={model.pythonVersion || '3.9.x'} mono icon={FileCode} />
                       </div>
                    </div>
                    <div className="space-y-6">
                       <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
                          <TrendingUp size={16} className="text-primary-600" /> 性能演变曲线 (PERFORMANCE)
                       </h4>
                       <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-6">Aggregate Inference Latency (ms)</p>
                          <MonitoringChart data={MOCK_MONITORING_HISTORY.cpu.map(p => ({...p, value: 40 + Math.random()*20}))} color="#1B58F4" label="Latency" height={160} />
                       </div>
                    </div>
                 </div>

                 <div className="bg-primary-50/50 border border-primary-100 p-6 rounded-[28px] flex gap-4">
                    <ShieldCheck size={24} className="text-primary-600 shrink-0" />
                    <div>
                       <h5 className="text-[10px] font-black text-primary-900 uppercase tracking-widest mb-1.5">生产合规认证通过</h5>
                       <p className="text-[11px] text-primary-800/80 leading-relaxed font-medium">
                          该资产已通过平台深度后门检测与漏洞扫描。符合《AI-Nex 企业级模型合规基准 v2.5》。
                       </p>
                    </div>
                 </div>
              </div>
           )}

           {activeTab === 'versions' && (
              <div className="space-y-6 animate-in fade-in duration-500">
                 <div className="flex justify-between items-center px-1">
                    <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
                       <GitBranch size={16} className="text-primary-600" /> 版本迭代矩阵 (REVISION CONTROL)
                    </h4>
                    <button 
                       onClick={() => setIsPublishModalOpen(true)}
                       className="flex items-center gap-2 px-5 py-2.5 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-600 transition-all active:scale-95 shadow-xl shadow-slate-900/10"
                    >
                       <Plus size={14} strokeWidth={3} /> 发布新版本 (COMMIT)
                    </button>
                 </div>

                 <div className="space-y-4">
                    {(model.versions || [
                      {
                        version: model.latestVersion, 
                        date: model.createdAt, 
                        size: model.size, 
                        status: 'stable',
                        downloads: '842',
                        params: '7B',
                        metrics: 'Accuracy: 94.2%',
                        path: `s3://models/${model.name}/${model.latestVersion}/weights.bin`,
                        mountPath: `/mnt/models/${model.name}/${model.latestVersion}`,
                        mountPathSource: 'default'
                      }
                    ]).map((v: any, idx: number) => {
                       const statusCfg = getStatusConfig(v.status || 'stable');
                       return (
                          <div key={idx} className="group bg-white border border-slate-200 rounded-[32px] p-8 hover:border-primary-400 hover:shadow-2xl transition-all duration-500">
                             <div className="flex flex-col lg:flex-row justify-between gap-8">
                                <div className="flex-1 space-y-6">
                                   <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-4">
                                         <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 border ${idx === 0 ? 'bg-primary-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400'}`}>
                                            <GitBranch size={22} strokeWidth={2.5} />
                                         </div>
                                         <div className="space-y-1">
                                            <div className="flex items-center gap-3">
                                               <span className="text-xl font-black text-slate-900 font-mono tracking-tight">{v.version}</span>
                                               {idx === 0 && <span className="px-2 py-0.5 bg-primary-100 text-primary-700 text-[8px] font-black uppercase rounded tracking-widest">Latest</span>}
                                            </div>
                                            <div className="flex items-center gap-3">
                                               <Badge status={statusCfg.variant} showDot>{statusCfg.label}</Badge>
                                               <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                                               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1"><Clock size={11}/> {v.date}</span>
                                            </div>
                                         </div>
                                      </div>
                                   </div>

                                   <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 p-5 bg-slate-50/50 rounded-2xl border border-slate-100">
                                      <div className="space-y-1">
                                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">参数规模 (PARAMS)</p>
                                         <p className="text-sm font-black text-slate-800 font-mono">{v.params || 'N/A'}</p>
                                      </div>
                                      <div className="space-y-1">
                                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">文件大小</p>
                                         <p className="text-sm font-black text-slate-800 font-mono">{v.size}</p>
                                      </div>
                                      <div className="space-y-1">
                                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><DownloadCloud size={10} className="text-primary-500" /> 总下载量</p>
                                         <p className="text-sm font-black text-slate-800 font-mono">{v.downloads || '0'}</p>
                                      </div>
                                      <div className="space-y-1">
                                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">性能指标 (SOTA)</p>
                                         <div className="flex items-center gap-2">
                                            <Gauge size={12} className="text-primary-500" />
                                            <p className="text-sm font-black text-slate-800 font-mono">{v.metrics || 'Evaluated 92.5%'}</p>
                                         </div>
                                      </div>
                                   </div>

                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                                            <Link size={10} className="text-primary-500" /> 存储后端路径 (SOURCE_URI)
                                         </p>
                                         <div className="group/path relative">
                                            <div className="w-full px-4 py-3 bg-slate-900 rounded-xl text-[11px] font-mono font-bold text-primary-300 break-all border border-slate-800 pr-10 shadow-inner">
                                               {v.path || `s3://internal-registry/models/${model.name}/${v.version}/weights.safetensors`}
                                            </div>
                                            <button 
                                               onClick={() => handleCopyPath(v.path || 's3://...')}
                                               className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-500 hover:text-white transition-all"
                                            >
                                               {copiedId === v.path ? <CheckCircle2 size={13} className="text-emerald-500" /> : <Copy size={13} />}
                                            </button>
                                         </div>
                                      </div>

                                      <div className="space-y-2">
                                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center justify-between">
                                            <span className="flex items-center gap-1.5"><Terminal size={10} className="text-indigo-500" /> 容器挂载目标路径 (MOUNT_PATH)</span>
                                            <Badge status={v.mountPathSource === 'custom' ? 'warning' : 'primary'} showDot={false}>{v.mountPathSource?.toUpperCase() || 'DEFAULT'}</Badge>
                                         </p>
                                         <div className="group/mount relative">
                                            <div className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-[11px] font-mono font-bold text-slate-600 break-all pr-10 shadow-inner">
                                               {v.mountPath || `/mnt/models/${model.name}/${v.version}`}
                                            </div>
                                            <button 
                                               onClick={() => handleCopyPath(v.mountPath || '/mnt/models/...')}
                                               className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-primary-600 transition-all"
                                            >
                                               {copiedId === v.mountPath ? <CheckCircle2 size={13} className="text-emerald-500" /> : <Copy size={13} />}
                                            </button>
                                         </div>
                                      </div>
                                   </div>
                                </div>

                                <div className="lg:w-40 flex flex-col gap-3 justify-center border-t lg:border-t-0 lg:border-l border-slate-100 pt-6 lg:pt-0 lg:pl-8">
                                   <button className="w-full py-3 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-600 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2">
                                      <Rocket size={14} /> 一键部署 (DEPLOY)
                                   </button>
                                </div>
                             </div>
                          </div>
                       );
                    })}
                 </div>
              </div>
           )}

           {activeTab === 'config' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                 <div className="space-y-6">
                    <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
                       <Settings size={16} className="text-primary-600" /> 运行时环境规范 (RUNTIME_SPEC)
                    </h4>
                    <div className="bg-slate-950 rounded-[32px] p-8 border border-slate-800 shadow-2xl relative group">
                       <div className="flex justify-between items-center mb-6 px-1">
                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">deployment-schema.yaml</span>
                          <button className="p-1.5 text-slate-500 hover:text-white transition-colors"><Copy size={14}/></button>
                       </div>
                       <pre className="font-mono text-[11px] text-primary-300 overflow-x-auto leading-relaxed">
{`model_metadata:
  asset_id: "${model.id}"
  framework: "${model.framework.split(' / ')[0].toLowerCase()}"
  quantization: "INT8_AWARE"

resource_allocation:
  recommended_gpu: 1
  vram_budget: 12GB
  compute_capability: "sm_80"

runtime_env:
  cuda_version: 12.1
  python: 3.9
  dependencies:
    - transformers>=4.31.0
    - accelerate>=0.21.0
    - flash-attn>=2.0.0`}
                       </pre>
                    </div>
                 </div>

                 <div className="space-y-4 pt-4">
                    <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
                       <Lock size={16} className="text-amber-500" /> 访问策略 (ACL)
                    </h4>
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center justify-between shadow-sm">
                       <div className="flex items-center gap-5">
                          <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100"><Globe size={24}/></div>
                          <div>
                             <p className="text-[12px] font-black text-slate-900 uppercase">组织级共享 (Organization-Wide)</p>
                             <p className="text-[10px] text-slate-500 mt-1 font-medium">该模型目前对全组织成员可见，允许跨项目引用与微调。</p>
                          </div>
                       </div>
                       <button className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-50 hover:text-primary-600 transition-all border border-transparent hover:border-primary-100">
                          变更授权策略
                       </button>
                    </div>
                 </div>
              </div>
           )}

           {activeTab === 'audit' && (
              <div className="space-y-6 animate-in fade-in duration-500">
                 <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
                    <History size={16} className="text-primary-600" /> 变更审计日志 (TRACE)
                 </h4>
                 <div className="space-y-0.5 bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
                    {[
                       { time: '2024-05-24 14:15:02', user: 'zhangsan', action: 'PUBLISH_NEW_VERSION', detail: `Release ${model.latestVersion} to registry`, icon: Rocket, color: 'text-emerald-500' },
                       { time: '2024-05-22 10:30:45', user: 'zhangsan', action: 'UPDATE_CONFIG', detail: 'Modified VRAM budget to 12GB', icon: Settings, color: 'text-primary-500' },
                       { time: '2024-05-20 09:15:12', user: 'sys-orchestrator', action: 'SCAN_COMPLETE', detail: 'Vulnerability scan PASSED', icon: ShieldCheck, color: 'text-emerald-500' },
                       { time: '2024-05-18 16:45:00', user: 'zhangsan', action: 'REGISTER_ASSET', detail: `Onboarding model ${model.name}`, icon: Box, color: 'text-slate-400' }
                    ].map((log, i) => (
                       <div key={i} className="flex gap-6 px-8 py-5 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 items-start">
                          <div className={`mt-1 p-1.5 rounded-lg bg-slate-50 ${log.color}`}>
                             <log.icon size={14} />
                          </div>
                          <div className="flex-1 space-y-1">
                             <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{log.action}</span>
                                <span className="text-[10px] font-mono font-bold text-slate-400">{log.time}</span>
                             </div>
                             <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{log.detail}</p>
                             <div className="flex items-center gap-1.5 mt-2">
                                <div className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-[8px] font-black text-slate-500 uppercase">{log.user[0]}</div>
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Actor: {log.user}</span>
                             </div>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           )}
        </div>
      </div>
    </Drawer>
  );
};
