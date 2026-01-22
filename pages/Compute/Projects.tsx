
import React, { useState, useMemo } from 'react';
import { 
  FolderKanban, Plus, Search, RefreshCw, 
  ChevronRight, MoreHorizontal, Settings,
  Users, Cpu, Zap, Database, BarChart3,
  LayoutGrid, List, Clock,
  ShieldCheck, ArrowUpRight, SearchIcon,
  FilterIcon, Power, ShieldAlert, Edit, Trash2,
  ExternalLink, UserCircle, Globe, Info, AlertTriangle,
  Layers
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import PageHeader from '../../components/layout/PageHeader';
import { CustomSelect } from '../../components/ui/Select';
import { ProjectDetailsDrawer } from '../../components/modals/ProjectDetailsDrawer';
import { CreateProjectModal } from '../../components/modals/CreateProjectModal';
import { ToggleProjectStatusModal } from '../../components/modals/ToggleProjectStatusModal';
import { MOCK_PROJECTS, MOCK_TENANTS } from '../../constants';
import { Project } from '../../types';

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [tenantFilter, setTenantFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [detailTab, setDetailTab] = useState<'overview' | 'members' | 'quotas'>('overview');

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           p.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTenant = tenantFilter === 'all' || p.tenantId === tenantFilter;
      const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
      return matchesSearch && matchesTenant && matchesStatus;
    });
  }, [projects, searchTerm, tenantFilter, statusFilter]);

  const handleOpenDetails = (project: Project, tab: typeof detailTab = 'overview') => {
    setSelectedProject(project);
    setDetailTab(tab);
    setIsDetailsOpen(true);
  };

  const ResourceMiniGauge = ({ label, used, total, color }: any) => {
    const percent = total > 0 ? Math.round((used / total) * 100) : 0;
    return (
      <div className="flex flex-col gap-1 w-24">
         <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-tighter">
            <span className="text-slate-400">{label}</span>
            <span className="text-slate-600 font-mono">{percent}%</span>
         </div>
         <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
            <div className={`h-full ${color} transition-all duration-1000`} style={{ width: `${percent}%` }}></div>
         </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 font-sans">
      <ProjectDetailsDrawer isOpen={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} project={selectedProject} initialTab={detailTab} />
      <CreateProjectModal isOpen={isCreateOpen} onClose={() => { setIsCreateOpen(false); setSelectedProject(null); }} initialData={selectedProject} />
      <ToggleProjectStatusModal isOpen={isStatusModalOpen} onClose={() => setIsStatusModalOpen(false)} project={selectedProject} onConfirm={() => setIsStatusModalOpen(false)} />

      <PageHeader 
        icon={FolderKanban}
        title="项目资产中心"
        subtitle="MULTI-TENANT BUSINESS PROJECT REGISTRY"
        badgeText="ORGANIZATION LEVEL ACCESS"
        actions={
          <button 
            onClick={() => { setSelectedProject(null); setIsCreateOpen(true); }}
            className="flex items-center gap-2.5 px-8 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-primary-500/20 active:scale-95"
          >
            <Plus size={16} strokeWidth={3} />
            <span>新建业务项目</span>
          </button>
        }
      />

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
            <CustomSelect
              options={[{ value: 'all', label: '所有组织' }, ...MOCK_TENANTS.map(t => ({ value: t.id, label: t.name }))]}
              value={tenantFilter}
              onChange={setTenantFilter}
              className="w-48"
            />
         </div>
         <button className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-400 hover:text-primary-600 transition-all">
            <RefreshCw size={18} />
         </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-[36px] shadow-soft overflow-hidden">
        <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/40">
           <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
             <BarChart3 size={16} /> PROJECT RESOURCE MATRIX
           </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/30 text-slate-400 border-b border-slate-200 whitespace-nowrap">
                <th className="px-10 py-4 text-[10px] font-black uppercase tracking-[0.2em]">项目核心标识</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em]">归属租户</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em]">负责人</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em]">配额利用率 (G/C/S)</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-center">状态</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProjects.map(project => {
                const isActive = project.status === 'active';
                return (
                  <tr key={project.id} onClick={() => handleOpenDetails(project)} className="group hover:bg-slate-50/80 transition-all cursor-pointer">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-lg transition-all duration-500 ${isActive ? 'bg-slate-950 group-hover:bg-primary-600' : 'bg-slate-300'}`}>
                          <FolderKanban size={20} strokeWidth={2.5} />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black text-slate-900 text-sm uppercase group-hover:text-primary-600 transition-colors">{project.name}</span>
                          <span className="font-mono text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{project.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <span className="text-[11px] font-black text-slate-700 tracking-tight uppercase flex items-center gap-1.5"><Globe size={12} className="text-slate-300" /> {project.tenantName}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-500 uppercase">{project.owner[0]}</div>
                        <span className="text-[11px] font-bold text-slate-800 font-mono">{project.owner}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex gap-4">
                        <ResourceMiniGauge label="GPU" used={project.quota.gpuUsed} total={project.quota.gpu} color="bg-emerald-500" />
                        <ResourceMiniGauge label="CPU" used={project.quota.cpuUsed} total={project.quota.cpu} color="bg-primary-500" />
                        <ResourceMiniGauge label="STR" used={project.quota.storageUsed} total={project.quota.storage} color="bg-amber-500" />
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <Badge status={isActive ? 'success' : 'neutral'} showDot>{isActive ? '活跃' : '冻结'}</Badge>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-all duration-300">
                        <button onClick={(e) => { e.stopPropagation(); handleOpenDetails(project); }} className="p-2.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all" title="详情"><Info size={18} strokeWidth={2.5} /></button>
                        <button onClick={(e) => { e.stopPropagation(); setSelectedProject(project); setIsCreateOpen(true); }} className="p-2.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all" title="编辑"><Settings size={18} strokeWidth={2.5} /></button>
                        <button onClick={(e) => { e.stopPropagation(); setSelectedProject(project); setIsDeleteConfirmOpen(true); }} className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all" title="删除"><Trash2 size={18} strokeWidth={2.5} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
