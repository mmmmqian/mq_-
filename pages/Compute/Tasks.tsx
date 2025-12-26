
import React, { useState } from 'react';
import { MOCK_TASKS } from '../../constants';
import { Badge } from '../../components/ui/Badge';
import StatCard from '../../components/ui/StatCard';
import { TaskDetailsDrawer } from '../../components/modals/TaskDetailsDrawer';
import { 
  List, RefreshCw, Search, Filter, MoreHorizontal, 
  PlayCircle, Clock, AlertOctagon, CheckCircle2,
  PauseCircle, XCircle, RotateCw, Trash2
} from 'lucide-react';
import { Task } from '../../types';

const TasksPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // KPIs
  const totalTasks = MOCK_TASKS.length;
  const runningTasks = MOCK_TASKS.filter(t => t.status === 'running').length;
  const pendingTasks = MOCK_TASKS.filter(t => t.status === 'pending').length;
  const failedTasks = MOCK_TASKS.filter(t => t.status === 'failed').length;

  const handleOpenDetails = (task: Task) => {
    setSelectedTask(task);
    setIsDetailsOpen(true);
  };

  const handleMenuClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const filteredTasks = MOCK_TASKS.filter(task => {
    const matchesSearch = 
      task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.tenantName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
      switch (status) {
          case 'running': return <Badge status="primary" showDot>{status}</Badge>;
          case 'pending': return <Badge status="warning" showDot>{status}</Badge>;
          case 'completed': return <Badge status="success" showDot>{status}</Badge>;
          case 'failed': return <Badge status="error" showDot>{status}</Badge>;
          default: return <Badge status="neutral" showDot>{status}</Badge>;
      }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20" onClick={() => setOpenMenuId(null)}>
      <TaskDetailsDrawer 
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        task={selectedTask}
      />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            任务管理中心
            <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium border border-indigo-100">Global View</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            集中监控全平台任务状态，提供故障诊断与运维管理能力
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-all font-medium text-sm shadow-sm">
            <RefreshCw size={14} />
            <span>刷新</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="总任务数" 
          value={totalTasks} 
          subtext="本日新增 12"
          icon={List} 
        />
        <StatCard 
          title="运行中" 
          value={runningTasks} 
          subtext="资源占用 82%"
          icon={PlayCircle}
          variant="primary"
        />
        <StatCard 
          title="排队中" 
          value={pendingTasks} 
          subtext="平均等待 45s"
          icon={Clock}
        />
        <StatCard 
          title="失败任务" 
          value={failedTasks} 
          subtext="需人工介入"
          icon={AlertOctagon}
          trend={failedTasks > 0 ? 'down' : 'neutral'}
          trendValue={failedTasks > 0 ? 'Attention' : 'Normal'}
        />
      </div>

      {/* Main Content */}
      <div className="flex flex-col space-y-4">
         {/* Toolbar */}
         <div className="flex justify-between items-center bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
           <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative group w-full sm:w-64">
                 <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-primary-500 transition-colors pointer-events-none" />
                 <input 
                   type="text" 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   placeholder="搜索任务名称、ID或租户..." 
                   className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 text-slate-700 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all hover:bg-white hover:border-primary-200"
                 />
              </div>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 cursor-pointer hover:bg-white hover:border-primary-200 transition-all"
              >
                <option value="all">所有状态</option>
                <option value="running">运行中</option>
                <option value="pending">排队中</option>
                <option value="completed">已完成</option>
                <option value="failed">失败</option>
              </select>
           </div>
        </div>

        {/* Task Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
           <div className="overflow-x-auto">
             <table className="w-full text-sm text-left">
                <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold">任务信息</th>
                    <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold">状态</th>
                    <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold">所属租户</th>
                    <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold w-1/4">资源使用</th>
                    <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold">进度</th>
                    <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   {filteredTasks.map(task => (
                     <tr 
                        key={task.id} 
                        className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                        onClick={() => handleOpenDetails(task)}
                     >
                        <td className="px-6 py-4">
                           <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-800 text-[14px] group-hover:text-primary-600 transition-colors">{task.name}</span>
                                <span className={`px-1.5 py-0.5 rounded text-[10px] border ${task.priority === 'high' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-slate-50 text-slate-500 border-slate-100'}`}>
                                   {task.priority === 'high' ? 'High' : 'Normal'}
                                </span>
                              </div>
                              <span className="font-mono text-xs text-slate-400 mt-0.5">{task.id}</span>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           {getStatusBadge(task.status)}
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex flex-col">
                              <span className="text-slate-700 font-medium">{task.tenantName}</span>
                              <span className="text-xs text-slate-400">{task.projectName}</span>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex gap-2 flex-wrap">
                              <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded border border-slate-200 font-medium whitespace-nowrap">
                                 GPU: {task.resources.gpu}
                              </span>
                              <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded border border-slate-200 font-medium whitespace-nowrap">
                                 CPU: {task.resources.cpu}
                              </span>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex flex-col gap-1 w-32">
                              <div className="flex justify-between text-[10px] text-slate-500">
                                 <span>{task.duration}</span>
                                 <span>{task.progress}%</span>
                              </div>
                              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                 <div 
                                    className={`h-full rounded-full transition-all duration-500 ${
                                        task.status === 'failed' ? 'bg-red-500' : 
                                        task.status === 'completed' ? 'bg-emerald-500' : 
                                        'bg-primary-500'
                                    }`} 
                                    style={{ width: `${task.progress}%` }}
                                 ></div>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-4 text-right relative">
                           <button 
                             className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-primary-600 transition-all active:bg-slate-200"
                             onClick={(e) => handleMenuClick(e, task.id)}
                           >
                             <MoreHorizontal size={18} />
                           </button>
                           
                           {openMenuId === task.id && (
                             <div className="absolute right-8 top-10 z-50 w-40 bg-white rounded-lg shadow-xl border border-slate-200 py-1 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                                <button onClick={(e) => { e.stopPropagation(); handleOpenDetails(task); }} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary-600 flex items-center gap-2">
                                  <List size={14} /> 详情
                                </button>
                                {task.status === 'running' && (
                                   <>
                                    <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-amber-600 flex items-center gap-2">
                                      <PauseCircle size={14} /> 暂停
                                    </button>
                                    <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-red-600 flex items-center gap-2">
                                      <XCircle size={14} /> 取消
                                    </button>
                                   </>
                                )}
                                {task.status === 'failed' && (
                                    <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary-600 flex items-center gap-2">
                                      <RotateCw size={14} /> 重试
                                    </button>
                                )}
                                <div className="h-px bg-slate-100 my-1"></div>
                                <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                                  <Trash2 size={14} /> 删除
                                </button>
                             </div>
                           )}
                        </td>
                     </tr>
                   ))}
                   {filteredTasks.length === 0 && (
                      <tr>
                         <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                            没有找到匹配的任务
                         </td>
                      </tr>
                   )}
                </tbody>
             </table>
           </div>
        </div>
      </div>
    </div>
  );
};

export default TasksPage;
