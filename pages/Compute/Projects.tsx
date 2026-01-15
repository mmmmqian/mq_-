
import React, { useState, useMemo } from 'react';
import { 
  FolderKanban, Plus, Search, Filter, 
  ChevronRight, MoreHorizontal, Settings,
  Users, Cpu, Zap, Database, BarChart3,
  RefreshCw, LayoutGrid, List, Clock,
  ShieldCheck, ArrowUpRight, SearchIcon,
  FilterIcon, Power, ShieldAlert, Edit, Trash2,
  ExternalLink, UserCircle, Globe
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import StatCard from '../../components/ui/StatCard';
import PageHeader from '../../components/layout/PageHeader';
import { CustomSelect } from '../../components/ui/Select';
import { ProjectDetailsDrawer } from '../../components/modals/ProjectDetailsDrawer';
import { CreateProjectModal } from '../../components/modals/CreateProjectModal';
import { MOCK_PROJECTS, MOCK_TENANTS } from '../../constants';
import { Project } from '../../types';

const ProjectsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tenantFilter, setTenantFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // 过滤逻辑
  const filteredProjects = useMemo(() => {
    return MOCK_PROJECTS.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           p.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTenant = tenantFilter === 'all' || p.tenantId === tenantFilter;
      const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
      return matchesSearch && matchesTenant && matchesStatus;
    });
  }, [searchTerm, tenantFilter, statusFilter]);

  // 数据统计
  const stats = useMemo(() => ({
    total: MOCK_PROJECTS.length,
    active: MOCK_PROJECTS.filter(p => p.status === 'active').length,
    totalGpu: MOCK_PROJECTS.reduce((acc, p) => acc + p.quota.gpu, 0),
    totalMembers: MOCK_PROJECTS.reduce((acc, p) => acc + p.memberCount, 0)
  }), []);

  const handleRowClick = (project: Project) => {
    setSelectedProject(project);
    setIsDetailsOpen(true);
  };

  const ResourceMiniGauge = ({ label, used, total, unit, color }: any) => {
    const percent = Math.round((used / total) * 100);
    const isCritical = percent > 85;
    return (
      <div className="flex flex-col gap-1 w-24">
         <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-tighter">
            <span className="text-slate-400">{label}</span>
            <span className={isCritical ? 'text-red-500' : 'text-slate-600'}>{percent}%</span>
         </div>
         <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
            <div className={`h-full ${isCritical ? 'bg-red-500 animate-pulse' : color} transition-all duration-1000`} style={{ width: `${percent}%` }}></div>
         </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 font-sans">
      <ProjectDetailsDrawer isOpen={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} project={selectedProject} />
      <CreateProjectModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} isAdmin={true} />

      <PageHeader 
        icon={FolderKanban}
        title="项目资产中心"
        subtitle="MULTI-TENANT BUSINESS PROJECT REGISTRY"
        badgeText="ORGANIZATION LEVEL ACCESS"
        actions={
          <button 
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2.5 px-8 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-primary-500/20 active:scale-95"
          >
            <Plus size={16} strokeWidth={3} />
            <span>新建业务项目</span>
          </button>
        }
      />

      {/* KPI Stats Panel */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="项目实例总数" value={stats.total} icon={FolderKanban} subtext="System Registry" />
        <StatCard title="CPU 总配额" value="350C" icon={Cpu} variant="primary" subtext="Allocated Cores" />
        <StatCard title="GPU 总配额" value={`${stats.totalGpu}U`} icon={Zap} subtext="Accelerator Cards" />
        <StatCard title="活跃成员" value={stats.totalMembers} icon={Users} subtext="Team Engagement" />
      </div>

      {/* Advanced Control Bar */}
      <div className="flex flex-col xl:flex-row justify-between items-center gap-5 bg-white p-4 rounded-[28px] border border-slate-200 shadow-sm">
         <div className="flex items-center gap-4 w-full xl:w-auto">
            <div className="relative flex-1 xl:w-80 group">
               <SearchIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-500 transition-colors pointer-events-none" />
               <input 
                 type="text" 
                 placeholder="ID / PROJECT SEARCH..." 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full pl-12 pr-4 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] border border-slate-200 rounded-2xl bg-slate-50 focus:bg-white focus:outline-none focus:border-primary-500 transition-all"
               />
            </div>
            
            <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

            <div className="flex flex-wrap items-center gap-3">
               <CustomSelect
                 options={[
                   { value: 'all', label: 'All Tenants' },
                   ...MOCK_TENANTS.map(t => ({ value: t.id, label: t.name }))
                 ]}
                 value={tenantFilter}
                 onChange={setTenantFilter}
                 className="w-44"
               />
               <CustomSelect
                 options={[
                   { value: 'all', label: 'All Status' },
                   { value: 'active', label: '启用中' },
                   { value: 'frozen', label: '已冻结' }
                 ]}
                 value={statusFilter}
                 onChange={setStatusFilter}
                 className="w-36"
               />
            </div>
         </div>
         <button className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-400 hover:text-primary-600 transition-all">
            <RefreshCw size={18} />
         </button>
      </div>

      {/* Projects Registry Table */}
      <div className="bg-white border border-slate-200 rounded-[36px] shadow-soft overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50/50 text-slate-400 border-b border-slate-200 whitespace-nowrap">
                     <th className="pl-10 pr-6 py-6 text-[10px] font-black uppercase tracking-[0.3em]">项目核心标识 (IDENTITY)</th>
                     <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.3em]">组织归属</th>
                     <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.3em]">负责人 (OWNER)</th>
                     <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.3em]">资源配额水位</th>
                     <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-center">团队规模</th>
                     <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.3em]">运行状态</th>
                     <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-right">操作</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {filteredProjects.map(project => (
                     <tr 
                        key={project.id} 
                        onClick={() => handleRowClick(project)}
                        className="group hover:bg-slate-50/80 transition-all cursor-pointer"
                     >
                        <td className="pl-10 pr-6 py-7">
                           <div className="flex items-center gap-4">
                              <div className="w-11 h-11 bg-slate-950 rounded-2xl flex items-center justify-center text-white group-hover:bg-primary-600 group-hover:shadow-lg group-hover:shadow-primary-500/30 transition-all duration-500">
                                 <FolderKanban size={20} strokeWidth={2.5} />
                              </div>
                              <div className="flex flex-col">
                                 <span className="font-black text-slate-900 tracking-tight text-sm uppercase group-hover:text-primary-600 transition-colors">{project.name}</span>
                                 <span className="font-mono text-[9px] font-bold text-slate-400 mt-1 tracking-tighter uppercase">{project.id}</span>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-7">
                           <div className="flex flex-col gap-1">
                              <span className="text-[11px] font-black text-slate-700 tracking-tight uppercase flex items-center gap-1.5"><Globe size={12} className="text-slate-300" /> {project.tenantName}</span>
                              <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-tighter">ID: {project.tenantId}</span>
                           </div>
                        </td>
                        <td className="px-6 py-7">
                           <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500 border border-slate-200 uppercase">{project.owner[0]}</div>
                              <span className="text-[11px] font-bold text-slate-800 font-mono">{project.owner}</span>
                           </div>
                        </td>
                        <td className="px-6 py-7">
                           <div className="flex gap-4">
                              <ResourceMiniGauge label="CPU" used={project.quota.cpuUsed} total={project.quota.cpu} unit="C" color="bg-primary-500" />
                              <ResourceMiniGauge label="GPU" used={project.quota.gpuUsed} total={project.quota.gpu} unit="U" color="bg-emerald-500" />
                              <ResourceMiniGauge label="STR" used={project.quota.storageUsed} total={project.quota.storage} unit="G" color="bg-amber-500" />
                           </div>
                        </td>
                        <td className="px-6 py-7 text-center">
                           <div className="inline-flex items-center gap-2.5 px-3 py-1 bg-slate-50 border border-slate-200 rounded-xl">
                              <Users size={12} className="text-slate-400" />
                              <span className="text-[11px] font-black text-slate-900 font-mono tracking-tighter">{project.memberCount}</span>
                           </div>
                        </td>
                        <td className="px-6 py-7">
                           <Badge status={project.status === 'active' ? 'success' : 'neutral'}>
                              {project.status === 'active' ? '运行中' : '已冻结'}
                           </Badge>
                        </td>
                        <td className="px-10 py-7 text-right">
                           <div className="flex justify-end gap-1 opacity-20 group-hover:opacity-100 transition-opacity">
                              <button className="p-2.5 text-slate-400 hover:text-primary-600 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 transition-all" title="成员管理"><Users size={16} /></button>
                              <button className="p-2.5 text-slate-400 hover:text-primary-600 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 transition-all" title="编辑项目"><Edit size={16} /></button>
                              <button className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-white rounded-xl border border-transparent hover:border-red-100 transition-all" title="冻结项目"><Power size={16} /></button>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
         {filteredProjects.length === 0 && (
            <div className="py-32 flex flex-col items-center justify-center text-center">
               <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6 border border-slate-100">
                  <SearchIcon size={32} />
               </div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No Projects Found In Registry</p>
            </div>
         )}
      </div>
    </div>
  );
};

export default ProjectsPage;
