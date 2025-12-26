
import React, { useState } from 'react';
import { Drawer } from '../ui/Drawer';
import { Task } from '../../types';
import { 
  PlayCircle, Clock, Server, User, Box, 
  Terminal, FileText, Activity, AlertCircle, Copy
} from 'lucide-react';
import { Badge } from '../ui/Badge';

interface TaskDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

export const TaskDetailsDrawer: React.FC<TaskDetailsDrawerProps> = ({ isOpen, onClose, task }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'logs' | 'yaml'>('overview');

  if (!task) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-primary-500';
      case 'completed': return 'bg-emerald-500';
      case 'failed': return 'bg-red-500';
      case 'pending': return 'bg-amber-500';
      default: return 'bg-slate-400';
    }
  };

  const DetailRow = ({ label, value, mono = false }: { label: string; value: React.ReactNode; mono?: boolean }) => (
    <div className="flex justify-between py-2.5 border-b border-slate-100 last:border-0 items-center">
      <span className="text-xs text-slate-500 font-medium">{label}</span>
      <span className={`text-sm text-slate-800 ${mono ? 'font-mono' : 'font-medium'}`}>{value}</span>
    </div>
  );

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <PlayCircle size={20} className="text-primary-600" />
          <span>任务详情</span>
        </div>
      }
      description={`ID: ${task.id}`}
      width="max-w-4xl"
    >
      <div className="space-y-6">
        {/* Header Summary */}
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">{task.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                 <Badge status={task.status === 'running' ? 'primary' : task.status === 'completed' ? 'success' : task.status === 'failed' ? 'error' : 'warning'}>
                    {task.statusName}
                 </Badge>
                 <span className="text-xs text-slate-500 font-mono"> | {task.typeName}</span>
              </div>
            </div>
            
            <div className="text-right">
               <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Duration</div>
               <div className="text-xl font-bold font-mono text-slate-800">{task.duration}</div>
            </div>
          </div>
          
          {task.status === 'running' && (
            <div className="mt-4 pt-4 border-t border-slate-200">
                <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600 font-medium">Progress</span>
                    <span className="text-primary-600 font-bold">{task.progress}%</span>
                </div>
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-500 rounded-full transition-all duration-500" style={{ width: `${task.progress}%` }}></div>
                </div>
            </div>
          )}

           {task.status === 'failed' && task.errorMessage && (
             <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3">
                <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
                <div className="text-xs text-red-700 font-mono break-all">{task.errorMessage}</div>
             </div>
           )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200">
            <button 
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'overview' ? 'border-primary-500 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
                概览
            </button>
            <button 
                onClick={() => setActiveTab('logs')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'logs' ? 'border-primary-500 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
                日志
            </button>
             <button 
                onClick={() => setActiveTab('yaml')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'yaml' ? 'border-primary-500 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
                配置
            </button>
        </div>

        {/* Tab Content */}
        <div className="min-h-[300px]">
            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                            <Box size={14} /> 基础信息
                        </h4>
                        <div className="bg-white rounded-lg border border-slate-200 px-4 py-1 shadow-sm">
                            <DetailRow label="任务 ID" value={task.id} mono />
                            <DetailRow label="所属租户" value={task.tenantName} />
                            <DetailRow label="所属项目" value={task.projectName} />
                            <DetailRow label="提交人" value={task.submitter} />
                            <DetailRow label="优先级" value={<span className="capitalize">{task.priority}</span>} />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                            <Activity size={14} /> 资源配置
                        </h4>
                        <div className="bg-white rounded-lg border border-slate-200 px-4 py-1 shadow-sm">
                            <DetailRow label="资源池" value={task.resourcePoolName} />
                            <DetailRow label="GPU" value={task.resources.gpu} mono />
                            <DetailRow label="CPU" value={task.resources.cpu} mono />
                            <DetailRow label="内存" value={task.resources.memory} mono />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                            <Server size={14} /> 运行环境
                        </h4>
                        <div className="bg-white rounded-lg border border-slate-200 px-4 py-1 shadow-sm">
                            <DetailRow label="运行节点" value={task.nodeName || '-'} mono />
                            <DetailRow label="节点 IP" value={task.nodeIp || '-'} mono />
                            <DetailRow label="镜像" value={<span className="truncate block max-w-[200px]" title={task.image}>{task.image}</span>} mono />
                            <DetailRow label="启动命令" value={<span className="truncate block max-w-[200px]" title={task.command}>{task.command}</span>} mono />
                        </div>
                    </div>

                    <div className="space-y-4">
                         <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                            <Clock size={14} /> 时间信息
                        </h4>
                        <div className="bg-white rounded-lg border border-slate-200 px-4 py-1 shadow-sm">
                            <DetailRow label="提交时间" value={task.submittedAt} />
                            <DetailRow label="开始时间" value={task.startedAt || '-'} />
                            <DetailRow label="结束时间" value={'-'} />
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'logs' && (
                <div className="bg-slate-900 rounded-lg border border-slate-800 p-4 font-mono text-xs text-slate-300 h-[400px] overflow-y-auto animate-in fade-in slide-in-from-bottom-2 duration-300 relative group">
                    <button className="absolute top-3 right-3 p-1.5 rounded bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 opacity-0 group-hover:opacity-100 transition-all" title="Copy Logs">
                       <Copy size={14} />
                    </button>
                    {task.logs && task.logs.length > 0 ? (
                        <div className="space-y-1">
                            {task.logs.map((log, idx) => (
                                <div key={idx} className="break-all whitespace-pre-wrap">{log}</div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-slate-600">
                           <Terminal size={32} className="mb-2 opacity-50" />
                           <p>暂无日志输出</p>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'yaml' && (
                 <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 font-mono text-xs text-slate-700 h-[400px] overflow-y-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <pre>{JSON.stringify(task, null, 2)}</pre>
                 </div>
            )}
        </div>
      </div>
    </Drawer>
  );
};
