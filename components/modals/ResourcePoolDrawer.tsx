
import React from 'react';
import { Drawer } from '../ui/Drawer';
import { ResourcePool } from '../../types';
// Fix: Import ShieldCheck icon from lucide-react
import { Layers, Server, Cpu, Activity, UserCheck, Clock, Box, HardDrive, Zap, ShieldCheck } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { MOCK_NODE_DETAILS } from '../../constants';

interface ResourcePoolDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  pool: ResourcePool | null;
}

export const ResourcePoolDrawer: React.FC<ResourcePoolDrawerProps> = ({ isOpen, onClose, pool }) => {
  if (!pool) return null;

  const DetailRow = ({ label, value, mono = false, icon: Icon }: { label: string; value: React.ReactNode; mono?: boolean; icon?: any }) => (
    <div className="flex justify-between py-3 border-b border-slate-100 last:border-0 items-center">
      <div className="flex items-center gap-2">
        {Icon && <Icon size={14} className="text-slate-400" />}
        <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{label}</span>
      </div>
      <span className={`text-sm text-slate-900 font-bold ${mono ? 'font-mono' : 'font-sans'}`}>{value}</span>
    </div>
  );

  const UsageBar = ({ label, used, total, unit, icon: Icon }: { label: string; used: number; total: number; unit: string; icon: any }) => {
    const percent = Math.round((used / total) * 100) || 0;
    let color = 'bg-primary-500';
    if (percent > 90) color = 'bg-red-500';
    else if (percent > 75) color = 'bg-amber-500';

    return (
      <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
        <div className="flex justify-between text-[10px] mb-2 font-black uppercase tracking-widest text-slate-400">
          <span className="flex items-center gap-1.5"><Icon size={12} /> {label}</span>
          <span className={percent > 90 ? 'text-red-500' : 'text-slate-900'}>{percent}%</span>
        </div>
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mb-2">
          <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${percent}%` }}></div>
        </div>
        <div className="flex justify-between text-[9px] font-mono font-bold text-slate-400 uppercase">
           <span>{used}{unit} USED</span>
           <span>CAP: {total}{unit}</span>
        </div>
      </div>
    );
  };

  const poolNodes = MOCK_NODE_DETAILS[pool.clusterId]?.filter(node => pool.nodeSelector.includes(node.name || node.id)) || [];

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Layers size={20} className="text-primary-600" />
          <span className="font-black uppercase tracking-tight">逻辑资源池维测中心</span>
        </div>
      }
      description={pool.displayName}
      width="max-w-2xl"
    >
      <div className="space-y-8">
        {/* Header Status Card */}
        <div className="bg-slate-900 rounded-[24px] p-6 border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 text-white">
             <Layers size={100} />
          </div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-black text-white tracking-tight leading-none mb-2">{pool.displayName}</h3>
                <p className="text-xs text-slate-400 max-w-md font-medium">{pool.description || 'Dedicated logical resource partition'}</p>
              </div>
              <Badge status={pool.status === 'active' ? 'success' : 'neutral'}>
                {pool.status.toUpperCase()}
              </Badge>
            </div>
            
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/10">
               <div>
                  <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1.5">Mapped Cluster</div>
                  <div className="text-xs font-black text-white flex items-center gap-2 uppercase tracking-tight">
                     <Server size={14} className="text-primary-500"/> {pool.clusterName}
                  </div>
               </div>
               <div>
                  <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1.5">Exclusive Tenant</div>
                  <div className="text-xs font-black text-emerald-400 flex items-center gap-2 uppercase tracking-tight">
                     <UserCheck size={14} className="text-emerald-500"/> {pool.tenantName}
                  </div>
               </div>
               <div>
                  <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1.5">Creation Origin</div>
                  <div className="text-xs font-black text-slate-300 flex items-center gap-2 font-mono tracking-tighter">
                     <Clock size={14} className="text-slate-500"/> {pool.createdAt}
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Resource Telemetry */}
        <div>
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-4 px-1">
            <Activity size={14} className="text-primary-500" /> REAL-TIME RESOURCE TELEMETRY
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <UsageBar label="Compute (CPU)" used={pool.used.cpu} total={pool.quota.cpu} unit="C" icon={Cpu} />
             <UsageBar label="Memory (RAM)" used={pool.used.memory} total={pool.quota.memory} unit="G" icon={Activity} />
             <UsageBar label="Accelerators (GPU)" used={pool.used.gpu} total={pool.quota.gpu} unit="G" icon={Zap} />
             <UsageBar label="Storage (DFS)" used={pool.used.storage} total={pool.quota.storage} unit="G" icon={HardDrive} />
          </div>
        </div>

        {/* Assigned Physical Nodes */}
        <div>
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-4 px-1">
            <Box size={14} className="text-primary-500" /> ASSIGNED PHYSICAL NODES ({poolNodes.length})
          </h4>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
             {poolNodes.length > 0 ? (
               <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Node Array ID</th>
                      <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Net IP</th>
                      <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Status</th>
                      <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Physical Spec</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {poolNodes.map(node => (
                      <tr key={node.name || node.id} className="hover:bg-slate-50/50 transition-colors">
                         <td className="px-5 py-4 font-black text-slate-900 text-xs font-mono">{node.name || node.id}</td>
                         <td className="px-5 py-4 font-mono text-[11px] text-slate-500 text-center">{node.ip}</td>
                         <td className="px-5 py-4 text-center">
                            <span className={`inline-flex h-2 w-2 rounded-full ${node.status === 'Ready' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500 animate-pulse'}`}></span>
                         </td>
                         <td className="px-5 py-4 text-right font-mono text-[10px] font-bold text-slate-500">
                            {node.cpu.total}vCPU / {node.mem.total}GB
                         </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
             ) : (
                <div className="p-12 text-center text-slate-300 font-black uppercase tracking-widest text-[10px]">
                   No underlying hardware mapping identified
                </div>
             )}
          </div>
        </div>

        {/* Logic Partition Meta */}
        <div>
           <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-4 px-1">
            <Layers size={14} className="text-primary-500" /> LOGICAL PARTITION METADATA
          </h4>
           <div className="bg-white rounded-2xl border border-slate-200 px-6 py-2 shadow-sm">
              <DetailRow label="Pool Instance ID" value={pool.id} mono icon={Layers} />
              {/* Fix: Added ShieldCheck to lucide-react imports to resolve 'Cannot find name' error */}
              <DetailRow label="Slicing Policy" value="Isocratic Resource Binding" icon={ShieldCheck} />
              <DetailRow label="Oversubscription" value="1.0x (Isolated)" icon={Activity} />
              <DetailRow label="Telemetry Heartbeat" value={pool.updatedAt} mono icon={Clock} />
           </div>
        </div>
      </div>
    </Drawer>
  );
};
