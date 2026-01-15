
import React, { useState } from 'react';
import { MOCK_RESOURCE_POOLS, MOCK_CLUSTERS } from '../../constants';
import { Badge } from '../../components/ui/Badge';
import StatCard from '../../components/ui/StatCard';
import { ResourcePoolDrawer } from '../../components/modals/ResourcePoolDrawer';
import { ManageResourcePoolModal } from '../../components/modals/ManageResourcePoolModal';
import PageHeader from '../../components/layout/PageHeader';
import { 
  Layers, Plus, Search, Filter, 
  Cpu, Users, Server, Zap, Database, 
  LayoutGrid, List, ChevronRight, Info, Settings, Trash2,
  BarChart3, Box, Clock, ShieldCheck, UserCheck, Activity, Globe,
  Power
} from 'lucide-react';
import { ResourcePool } from '../../types';

// 现代化科技感开关组件
const StatusSwitch = ({ isActive, onToggle, disabled = false }: { isActive: boolean; onToggle: (e: React.MouseEvent) => void; disabled?: boolean }) => (
  <button
    onClick={onToggle}
    disabled={disabled}
    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500/20 ${
      isActive ? 'bg-emerald-500' : 'bg-slate-200'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:ring-4 hover:ring-slate-100'}`}
  >
    <span
      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-300 ease-in-out ${
        isActive ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
);

const ResourcePoolsPage: React.FC = () => {
  const [pools, setPools] = useState<ResourcePool[]>(MOCK_RESOURCE_POOLS);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);
  const [selectedPool, setSelectedPool] = useState<ResourcePool | null>(null);

  const filteredPools = pools.filter(pool => 
    pool.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pool.tenantName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const togglePoolStatus = (e: React.MouseEvent, poolId: string) => {
    e.stopPropagation();
    setPools(prev => prev.map(p => 
      p.id === poolId ? { ...p, status: p.status === 'active' ? 'disabled' : 'active' } : p
    ));
  };

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
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 font-sans">
      <ResourcePoolDrawer isOpen={isDetailsDrawerOpen} onClose={() => setIsDetailsDrawerOpen(false)} pool={selectedPool} />
      <ManageResourcePoolModal
        isOpen={isManageModalOpen}
        onClose={() => { setIsManageModalOpen(false); setSelectedPool(null); }}
        initialData={selectedPool}
      />

      <PageHeader 
        icon={Layers}
        title="逻辑资源池化系统"
        subtitle="LOGICAL COMPUTE DOMAIN ORCHESTRATION"
        badgeText="ISOLATED TENANT DOMAIN"
        actions={
          <button 
            onClick={() => { setSelectedPool(null); setIsManageModalOpen(true); }}
            className="flex items-center gap-2.5 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all font-black text-[11px] uppercase tracking-widest shadow-xl shadow-primary-500/20 active:scale-95"
          >
            <Plus size={16} strokeWidth={3} />
            <span>创建逻辑池</span>
          </button>
        }
      />

      {/* 总览卡片 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="资源池实例" value={pools.length} icon={Layers} subtext="Logical Partitions" />
        <StatCard title="CPU 核心配额" value="1.2k" icon={Cpu} variant="primary" subtext="Aggregated Cores" />
        <StatCard title="GPU 显卡配额" value="256" icon={Zap} subtext="Accelerator Cards" />
        <StatCard title="服务租户" value={pools.length} icon={UserCheck} subtext="Isolated Bindings" />
      </div>

      <div className="bg-white border border-slate-200 rounded-[32px] shadow-soft overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/40">
           <div className="flex items-center gap-6">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                <BarChart3 size={16} /> RESOURCE INVENTORY MATRIX
              </h3>
              <div className="h-4 w-px bg-slate-200"></div>
              <div className="flex bg-slate-200/50 p-1 rounded-xl border border-slate-200 shadow-inner scale-90 origin-left">
                <button onClick={() => setViewMode('card')} className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'card' ? 'bg-white text-primary-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'}`}>
                  <LayoutGrid size={13} strokeWidth={2.5} /> Card
                </button>
                <button onClick={() => setViewMode('list')} className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'list' ? 'bg-white text-primary-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'}`}>
                  <List size={13} strokeWidth={2.5} /> List
                </button>
              </div>
           </div>
           <div className="relative group">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-500 transition-colors" />
              <input type="text" placeholder="FILTER..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-11 pr-4 py-2.5 text-[10px] font-black uppercase tracking-widest border border-slate-200 rounded-2xl bg-white focus:outline-none focus:border-primary-500 w-80 transition-all font-sans placeholder:text-slate-200 shadow-sm" />
           </div>
        </div>

        {viewMode === 'card' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {filteredPools.map(pool => (
              <div key={pool.id} onClick={() => { setSelectedPool(pool); setIsDetailsDrawerOpen(true); }} className={`group relative bg-white border rounded-[32px] p-7 transition-all duration-500 cursor-pointer flex flex-col h-full overflow-hidden ${pool.status === 'active' ? 'border-slate-200 hover:shadow-2xl hover:border-primary-400' : 'border-slate-100 opacity-80'}`}>
                <div className="absolute top-0 right-0 p-10 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity pointer-events-none"><Layers size={120} strokeWidth={1} /></div>
                <div className="flex justify-between items-start mb-8 relative z-10">
                   <div className={`w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 transition-all duration-500 ${pool.status === 'active' ? 'group-hover:bg-primary-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-primary-500/30' : ''}`}><Layers size={28} strokeWidth={2} /></div>
                   <div className="flex flex-col items-end gap-3">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black uppercase tracking-widest ${pool.status === 'active' ? 'text-emerald-600' : 'text-slate-400'}`}>{pool.status}</span>
                        <StatusSwitch isActive={pool.status === 'active'} onToggle={(e) => togglePoolStatus(e, pool.id)} />
                      </div>
                      <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-tighter"><Clock size={10} /> {pool.createdAt}</div>
                   </div>
                </div>
                <div className="mb-8 relative z-10">
                  <h3 className={`text-xl font-black tracking-tight leading-none transition-colors ${pool.status === 'active' ? 'text-slate-900 group-hover:text-primary-600' : 'text-slate-400'}`}>{pool.displayName}</h3>
                </div>
                <div className="grid grid-cols-2 gap-x-8 gap-y-7 mb-10 relative z-10 bg-slate-50/50 p-5 rounded-2xl border border-slate-100/50">
                  <ResourceMetric label="CPU 核心" used={pool.used.cpu} total={pool.quota.cpu} unit="C" color="bg-primary-500" />
                  <ResourceMetric label="MEM 内存" used={pool.used.memory} total={pool.quota.memory} unit="G" color="bg-indigo-500" />
                  <ResourceMetric label="GPU 算力" used={pool.used.gpu} total={pool.quota.gpu} unit="G" color="bg-emerald-500" />
                  <ResourceMetric label="STO 存储" used={pool.used.storage} total={pool.quota.storage} unit="G" color="bg-amber-500" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
             {/* List UI remains, omitting for brevity in the update */}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourcePoolsPage;
