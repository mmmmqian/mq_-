
import React, { useState, useEffect, useMemo } from 'react';
import { MOCK_CLUSTERS, MOCK_RESOURCE_POOLS, MOCK_MONITORING_HISTORY } from '../../constants';
import StatCard from '../../components/ui/StatCard';
import MonitoringChart from '../../components/ui/MonitoringChart';
import { NodeDetailDrawer } from '../../components/modals/NodeDetailDrawer';
import { Badge } from '../../components/ui/Badge';
import { 
  Activity, RefreshCw, Cpu, Zap, 
  Box, Search, Server, Layers, MapPin,
  HardDrive, ShieldCheck, AlertCircle,
  LayoutGrid, List, ChevronRight, Terminal, Monitor,
  ActivitySquare, BellRing, Gauge, Clock
} from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader';

const MonitoringPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState('1h');
  const [selectedClusterId, setSelectedClusterId] = useState<string>('simulated');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const clusterTrendSeries = [
    { key: 'cpu', name: 'CPU Load', color: '#1B58F4', data: MOCK_MONITORING_HISTORY.cpu },
    { key: 'memory', name: 'Memory Commit', color: '#6366f1', data: MOCK_MONITORING_HISTORY.memory },
    { key: 'gpu', name: 'GPU Compute', color: '#EF4444', data: MOCK_MONITORING_HISTORY.gpu.map(p => ({...p, value: 95})) }
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20 max-w-[1600px] mx-auto font-sans">
      <PageHeader 
        icon={ActivitySquare}
        title="集群全维监控矩阵"
        subtitle="REAL-TIME TELEMETRY & GLOBAL RESOURCE ORCHESTRATION"
        badgeText="TELEMETRY NOMINAL"
        actions={
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
               {['1h', '6h', '24h', '7d'].map(range => (
                  <button key={range} onClick={() => setTimeRange(range)} className={`px-4 py-1.5 text-[10px] font-black rounded-lg transition-all ${timeRange === range ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500'}`}>
                    {range.toUpperCase()}
                  </button>
               ))}
             </div>
             <button onClick={() => setIsRefreshing(true)} className="p-3 bg-slate-900 text-white rounded-xl hover:bg-primary-600 transition-all"><RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''}/></button>
          </div>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-6">
        <StatCard title="GPU 加速器负荷" value="95%" icon={Zap} variant="primary" subtext="CRITICAL OVERLOAD" isAlert={true} />
        <StatCard title="CPU 算力利用率" value="45%" icon={Cpu} subtext="vCPU Global Avg" />
        <StatCard title="内存 提交总量" value="62%" icon={ActivitySquare} subtext="Memory Commit" />
        <StatCard title="分布式存储 (DFS)" value="30%" icon={HardDrive} subtext="Capacity Usage" />
        <StatCard title="Active Pods" value="1,420" icon={Box} subtext="Orchestration" />
        <StatCard title="节点健康度 (SLO)" value="100%" icon={ShieldCheck} subtext="10 / 10 Ready" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
         <div className="lg:col-span-3 bg-white border border-slate-200 rounded-[40px] p-8 shadow-sm group">
            <div className="flex justify-between items-center mb-10">
               <h3 className="text-lg font-black text-slate-900 flex items-center gap-3 uppercase">历史负载趋势分析</h3>
            </div>
            <MonitoringChart series={clusterTrendSeries} height={360} showLegend={true} />
         </div>
      </div>
    </div>
  );
};

export default MonitoringPage;
