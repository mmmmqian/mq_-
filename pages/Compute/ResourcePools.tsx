
import React, { useState } from 'react';
import { MOCK_RESOURCE_POOLS } from '../../constants';
import { Badge } from '../../components/ui/Badge';
import StatCard from '../../components/ui/StatCard';
import { ResourcePoolDrawer } from '../../components/modals/ResourcePoolDrawer';
import { ManageResourcePoolModal } from '../../components/modals/ManageResourcePoolModal';
import { 
  Layers, Plus, Search, Filter, 
  Cpu, Users, Server, Zap, Database, 
  LayoutGrid, List, ChevronRight, Info, Settings, Trash2,
  BarChart3, Box, Clock, ShieldCheck, UserCheck
} from 'lucide-react';
import { ResourcePool } from '../../types';

const ResourcePoolsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);
  const [selectedPool, setSelectedPool] = useState<ResourcePool | null>(null);

  const filteredPools = MOCK_RESOURCE_POOLS.filter(pool => 
    pool.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pool.tenantName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const ResourceMetric = ({ label, used, total, unit, color }: { label: string, used: number, total: number, unit: string, color: string }) => {
    const percent = total > 0 ? Math.min(100, Math.round((used / total) * 100)) : 0;
    const isCritical = percent > 90;

    return (
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-400">
          <span className="flex items-center gap-1">{label}</span>
          <span className={`font-mono ${isCritical ? 'text-red-500' : 'text-slate-900'}`}>{percent}%</span>
        </div>
        <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className={`h-full ${color} transition-all duration-1000 ease-out ${isCritical ? 'animate-pulse' : ''}`} 
            style={{ width: `${percent}%` }} 
          />
        </div>
        <div className="flex justify-between text-[8px] font-mono text-slate-400 tracking-tighter">
          <span>{used}{unit}</span>
          <span className="opacity-60">/ {total}{unit}</span>
        </div>
      </div>
    );
  };

  const handleEdit = (e: React.MouseEvent, pool: ResourcePool) => {
    e.stopPropagation();
    setSelectedPool(pool);
    setIsManageModalOpen(true);
  };

  const handleDelete = (e: React.MouseEvent, pool: ResourcePool) => {
    e.stopPropagation();
    if (confirm(`确认删除资源池 ${pool.displayName} 吗？此操作不可撤销。`)) {
      console.log('Delete pool:', pool.id);
    }
  };

  const handleViewDetails = (pool: ResourcePool) => {
    setSelectedPool(pool);
    setIsDetailsDrawerOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 font-sans">
      <ResourcePoolDrawer 
        isOpen={isDetailsDrawerOpen}
        onClose={() => setIsDetailsDrawerOpen(false)}
        pool={selectedPool}
      />
      
      <ManageResourcePoolModal
        isOpen={isManageModalOpen}
        onClose={() => {
          setIsManageModalOpen(false);
          setSelectedPool(null);
        }}
        initialData={selectedPool}
      />

      {/* 现代简约科技感标题区 */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white border border-slate-200 px-8 py-6 rounded-[32px] shadow-soft">
        <div className="flex items-center gap-6">
          <div className="p-3.5 bg-slate-950 rounded-2xl text-white shadow-xl shadow-slate-900/10">
            <Layers size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">逻辑资源池化系统</h1>
            <div className="flex items-center gap-3 mt-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <ShieldCheck size={12} className="text-emerald-500" /> ISOLATED TENANT DOMAIN
              </span>
              <div className="w-1 h-1 rounded-full bg-slate-200"></div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight italic">Resource slicing for dedicated tenant workloads</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <button 
            onClick={() => { setSelectedPool(null); setIsManageModalOpen(true); }}
            className="flex-1 lg:flex-none flex items-center justify-center gap-2.5 px-6 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all font-black text-[11px] uppercase tracking-widest shadow-xl shadow-primary-500/20 active:scale-95"
          >
            <Plus size={16} strokeWidth={3} />
            <span>创建逻辑池</span>
          </button>
        </div>
      </div>

      {/* 状态总览 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="资源池实例" value={MOCK_RESOURCE_POOLS.length} icon={Layers} subtext="Logical Partitions" />
        <StatCard title="CPU 核心配额" value="1.2k" icon={Cpu} variant="primary" subtext="Aggregated Cores" />
        <StatCard title="GPU 显卡配额" value="256" icon={Zap} subtext="Accelerator Cards" />
        <StatCard title="独占租户" value={MOCK_RESOURCE_POOLS.length} icon={UserCheck} subtext="One-to-One Binding" />
      </div>

      {/* 资源池列表/矩阵 */}
      <div className="bg-white border border-slate-200 rounded-[32px] shadow-soft overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/40">
           <div className="flex items-center gap-6">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                <BarChart3 size={16} /> LOGICAL INVENTORY MATRIX
              </h3>
              
              <div className="h-4 w-px bg-slate-200"></div>

              {/* 视图切换 - 已移动到此处 */}
              <div className="flex bg-slate-200/50 p-1 rounded-xl border border-slate-200 shadow-inner scale-90 origin-left">
                <button 
                  onClick={() => setViewMode('card')}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'card' ? 'bg-white text-primary-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <LayoutGrid size={13} strokeWidth={2.5} /> Card
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'list' ? 'bg-white text-primary-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <List size={13} strokeWidth={2.5} /> List
                </button>
              </div>
           </div>

           <div className="relative group">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-500 transition-colors" />
              <input 
                type="text" 
                placeholder="SEARCH BY NAME OR TENANT..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-11 pr-4 py-2.5 text-[10px] font-black uppercase tracking-widest border border-slate-200 rounded-2xl bg-white focus:outline-none focus:border-primary-500 w-80 transition-all font-sans placeholder:text-slate-200 shadow-sm" 
              />
           </div>
        </div>

        {viewMode === 'card' ? (
          /* 卡片视图模式 */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {filteredPools.map(pool => (
              <div 
                key={pool.id}
                onClick={() => handleViewDetails(pool)}
                className="group relative bg-white border border-slate-200 rounded-[32px] p-7 hover:shadow-2xl hover:border-primary-400 transition-all cursor-pointer flex flex-col h-full overflow-hidden"
              >
                {/* 科技背景修饰 */}
                <div className="absolute top-0 right-0 p-10 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
                  <Layers size={120} strokeWidth={1} />
                </div>

                {/* 卡片头部：图标、状态与创建时间 */}
                <div className="flex justify-between items-start mb-8 relative z-10">
                   <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-primary-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-primary-500/30 transition-all duration-500">
                      <Layers size={28} strokeWidth={2} />
                   </div>
                   <div className="flex flex-col items-end gap-2">
                      <Badge status={pool.status === 'active' ? 'success' : 'neutral'}>
                        {pool.status.toUpperCase()}
                      </Badge>
                      <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-tighter">
                         <Clock size={10} /> {pool.createdAt}
                      </div>
                   </div>
                </div>

                {/* 标题、集群与纳管节点 */}
                <div className="mb-8 relative z-10">
                  <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight group-hover:text-primary-600 transition-colors">{pool.displayName}</h3>
                  <div className="flex items-center gap-3 mt-4">
                     <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg text-[9px] font-black text-slate-600 uppercase tracking-widest">
                       <Server size={10} /> {pool.clusterName}
                     </div>
                     <div className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 border border-indigo-100 rounded-lg text-[9px] font-black text-indigo-600 uppercase tracking-widest">
                       <Box size={10} /> {pool.nodeSelector.length} Nodes
                     </div>
                  </div>
                </div>
                
                {/* 核心负载实时水位 - 4维度 */}
                <div className="grid grid-cols-2 gap-x-8 gap-y-7 mb-10 relative z-10 bg-slate-50/50 p-5 rounded-2xl border border-slate-100/50">
                  <ResourceMetric label="CPU 核心" used={pool.used.cpu} total={pool.quota.cpu} unit="C" color="bg-primary-500" />
                  <ResourceMetric label="MEM 内存" used={pool.used.memory} total={pool.quota.memory} unit="G" color="bg-indigo-500" />
                  <ResourceMetric label="GPU 算力" used={pool.used.gpu} total={pool.quota.gpu} unit="G" color="bg-emerald-500" />
                  <ResourceMetric label="STO 存储" used={pool.used.storage} total={pool.quota.storage} unit="G" color="bg-amber-500" />
                </div>

                {/* 底部绑定租户与操作区 */}
                <div className="mt-auto pt-6 border-t border-slate-100 flex justify-between items-center relative z-10">
                   <div className="flex items-center gap-3 max-w-[60%]">
                      <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-[10px] text-white font-black shadow-md shadow-slate-900/10 border-2 border-white">
                        <UserCheck size={14} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Bound Tenant</span>
                        <span className="text-[11px] font-bold text-slate-800 truncate" title={pool.tenantName}>{pool.tenantName}</span>
                      </div>
                   </div>
                   
                   <div className="flex items-center gap-1.5">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleViewDetails(pool); }}
                        className="p-2.5 text-slate-300 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
                        title="查看监控详情"
                      >
                         <Info size={18} strokeWidth={2.5} />
                      </button>
                      <button 
                        onClick={(e) => handleEdit(e, pool)}
                        className="p-2.5 text-slate-300 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all"
                        title="编辑资源池配置"
                      >
                         <Settings size={18} strokeWidth={2.5} />
                      </button>
                      <button 
                        onClick={(e) => handleDelete(e, pool)}
                        className="p-2.5 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        title="移除资源池"
                      >
                         <Trash2 size={18} strokeWidth={2.5} />
                      </button>
                   </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* 列表视图模式 */
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/30 text-slate-400 border-b border-slate-100">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.3em]">资源池标识</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.3em]">运行状态</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.3em]">物理映射</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.3em]">独占租户</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.3em] w-1/4">负载水位 (CPU / MEM)</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.3em] text-right">管控操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPools.map(pool => (
                  <tr 
                    key={pool.id}
                    onClick={() => handleViewDetails(pool)}
                    className="group hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    <td className="px-8 py-7">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                             <Layers size={18} strokeWidth={2} />
                          </div>
                          <div className="flex flex-col">
                             <span className="font-black text-slate-900 tracking-tight text-base leading-none group-hover:text-primary-600 transition-colors">{pool.displayName}</span>
                             <span className="font-mono text-[9px] font-bold text-slate-400 uppercase mt-1.5 tracking-tighter">{pool.id}</span>
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-7">
                      <Badge status={pool.status === 'active' ? 'success' : 'neutral'}>
                        {pool.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="px-8 py-7">
                       <div className="flex flex-col">
                          <div className="flex items-center gap-2 text-xs font-black text-slate-700 uppercase tracking-tighter">
                             <Server size={14} className="text-slate-300" />
                             {pool.clusterName}
                          </div>
                          <span className="text-[9px] font-bold text-slate-400 uppercase mt-1 tracking-widest font-mono italic">Scale: {pool.nodeSelector.length} Nodes</span>
                       </div>
                    </td>
                    <td className="px-8 py-7">
                       <div className="flex items-center gap-2.5">
                          <div className="p-1.5 bg-slate-900 rounded text-white"><UserCheck size={12} /></div>
                          <span className="text-[11px] font-bold text-slate-800 tracking-tight">{pool.tenantName}</span>
                       </div>
                    </td>
                    <td className="px-8 py-7">
                       <div className="space-y-3">
                          <div className="flex items-center gap-3">
                             <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                                <div className={`h-full ${pool.used.cpu/pool.quota.cpu > 0.9 ? 'bg-red-500 animate-pulse' : 'bg-primary-500'}`} style={{ width: `${(pool.used.cpu/pool.quota.cpu)*100}%` }} />
                             </div>
                             <span className="font-mono text-[9px] font-black text-slate-900 w-16 text-right whitespace-nowrap">CPU {Math.round((pool.used.cpu/pool.quota.cpu)*100)}%</span>
                          </div>
                          <div className="flex items-center gap-3">
                             <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                                <div className={`h-full ${pool.used.memory/pool.quota.memory > 0.9 ? 'bg-red-500 animate-pulse' : 'bg-indigo-500'}`} style={{ width: `${(pool.used.memory/pool.quota.memory)*100}%` }} />
                             </div>
                             <span className="font-mono text-[9px] font-black text-slate-900 w-16 text-right whitespace-nowrap">MEM {Math.round((pool.used.memory/pool.quota.memory)*100)}%</span>
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-7 text-right">
                       <div className="flex items-center justify-end gap-1 opacity-40 group-hover:opacity-100 transition-all duration-300">
                          <button onClick={(e) => { e.stopPropagation(); handleViewDetails(pool); }} className="p-2.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"><Info size={16} strokeWidth={2.5}/></button>
                          <button onClick={(e) => handleEdit(e, pool)} className="p-2.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all"><Settings size={16} strokeWidth={2.5}/></button>
                          <button onClick={(e) => handleDelete(e, pool)} className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={16} strokeWidth={2.5}/></button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredPools.length === 0 && (
          <div className="py-24 flex flex-col items-center justify-center text-slate-300">
            <Layers size={56} strokeWidth={1} className="mb-6 opacity-20" />
            <p className="text-sm font-black uppercase tracking-[0.3em] text-slate-400">Inventory Matrix Empty / Filter Unmatched</p>
            <button 
              onClick={() => setSearchTerm('')}
              className="mt-4 text-[10px] font-black text-primary-600 uppercase tracking-widest hover:underline"
            >
              Clear Local Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourcePoolsPage;
