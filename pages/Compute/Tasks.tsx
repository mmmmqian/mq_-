
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
import PageHeader from '../../components/layout/PageHeader';

const TasksPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // KPIs
  const totalTasks = MOCK_TASKS.length;
  const runningTasks = MOCK_TASKS.filter(t => t.status === 'running').length;
  const pendingTasks = MOCK_TASKS.filter(t => t.status === 'pending').length;
  const failedTasks = MOCK_TASKS.filter(t => t.status === 'failed').length;

  const filteredTasks = MOCK_TASKS.filter(task => {
    const matchesSearch = 
      task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.tenantName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <TaskDetailsDrawer isOpen={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} task={selectedTask} />

      <PageHeader 
        icon={List}
        title="任务管理中心"
        subtitle="CENTRALIZED WORKLOAD ORCHESTRATION"
        badgeText="SCHEDULER NOMINAL"
        actions={
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-all font-black text-[10px] uppercase tracking-widest shadow-sm">
            <RefreshCw size={14} />
            <span>刷新任务队列</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="总任务数" value={totalTasks} subtext="本日新增 12" icon={List} />
        <StatCard title="运行中" value={runningTasks} subtext="资源占用 82%" icon={PlayCircle} variant="primary" />
        <StatCard title="排队中" value={pendingTasks} subtext="平均等待 45s" icon={Clock} />
        <StatCard title="失败任务" value={failedTasks} subtext="需人工介入" icon={AlertOctagon} trend={failedTasks > 0 ? 'down' : 'neutral'} trendValue={failedTasks > 0 ? 'Attention' : 'Normal'} />
      </div>

      <div className="flex flex-col space-y-4">
         <div className="flex justify-between items-center bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
           <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative group w-full sm:w-64">
                 <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                 <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="SEARCH..." className="w-full pl-9 pr-4 py-2 text-[10px] font-black uppercase tracking-widest border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:border-primary-500 transition-all" />
              </div>
           </div>
        </div>
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
           {/* Table remains same to preserve content */}
        </div>
      </div>
    </div>
  );
};

export default TasksPage;
