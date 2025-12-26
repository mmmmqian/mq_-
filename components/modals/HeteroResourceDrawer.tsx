
import React from 'react';
import { Drawer } from '../ui/Drawer';
import { HeterogeneousResource } from '../../types';
// Import missing Box icon from lucide-react
import { 
  Cpu, Activity, Thermometer, Zap, Server, 
  Settings, Info, Hash, Clock, Globe, 
  ShieldCheck, HardDrive, Cpu as CpuIcon,
  ShieldAlert, Radio, ActivitySquare,
  Box
} from 'lucide-react';
import { Badge } from '../ui/Badge';

interface HeteroResourceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  resource: HeterogeneousResource | null;
}

export const HeteroResourceDrawer: React.FC<HeteroResourceDrawerProps> = ({ isOpen, onClose, resource }) => {
  if (!resource) return null;

  const DetailRow = ({ label, value, mono = false, icon: Icon }: { label: string; value: React.ReactNode; mono?: boolean; icon?: any }) => (
    <div className="flex justify-between py-3.5 border-b border-slate-100 last:border-0 items-center">
      <div className="flex items-center gap-2">
        {Icon && <Icon size={14} className="text-slate-400" />}
        <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest font-sans">{label}</span>
      </div>
      <span className={`text-sm text-slate-800 font-bold ${mono ? 'font-mono' : 'font-sans'}`}>{value}</span>
    </div>
  );

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <CpuIcon size={20} className="text-primary-600" />
          <span className="font-black uppercase tracking-tight">异构设备全维分析</span>
        </div>
      }
      description={`${resource.model} | ID: ${resource.id}`}
      width="max-w-2xl"
    >
      <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
        {/* Status Hub Card */}
        <div className="bg-slate-950 rounded-[24px] p-6 border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-10 text-primary-500">
             <ActivitySquare size={120} strokeWidth={1} />
          </div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner">
                  <Zap size={28} className="text-primary-400" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white tracking-tight leading-none mb-1.5">{resource.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-slate-500 tracking-tighter uppercase">{resource.id}</span>
                    <div className={`w-1.5 h-1.5 rounded-full ${resource.status === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`}></div>
                  </div>
                </div>
              </div>
              <Badge status={resource.status === 'online' ? 'success' : 'neutral'}>
                {resource.status.toUpperCase()}
              </Badge>
            </div>
            
            <div className="grid grid-cols-4 gap-6 pt-6 border-t border-white/10">
               <div className="text-center">
                  <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1.5">Load Util</div>
                  <div className={`text-lg font-black font-mono tracking-tighter ${resource.utilization > 90 ? 'text-red-500' : 'text-white'}`}>{resource.utilization}%</div>
               </div>
               <div className="text-center">
                  <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1.5">Heat Status</div>
                  <div className={`text-lg font-black font-mono tracking-tighter ${resource.temperature > 80 ? 'text-amber-500' : 'text-white'}`}>{resource.temperature}°C</div>
               </div>
               <div className="text-center">
                  <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1.5">Energy Pwr</div>
                  <div className="text-lg font-black font-mono tracking-tighter text-white">{resource.power}W</div>
               </div>
               <div className="text-center">
                  <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1.5">VRAM Usage</div>
                  <div className="text-lg font-black font-mono tracking-tighter text-white">{Math.round((resource.memoryUsed/resource.memoryTotal)*100)}%</div>
               </div>
            </div>
          </div>
        </div>

        {/* Details Matrix */}
        <div className="space-y-6">
          <div>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-4 px-1">
              <Info size={14} className="text-primary-500" /> 设备元数据 (DEVICE METADATA)
            </h4>
            <div className="bg-white rounded-2xl border border-slate-200 px-6 py-2 shadow-sm">
              <DetailRow label="制造商 (VENDOR)" value={resource.vendor} icon={Globe} />
              <DetailRow label="型号 (MODEL)" value={resource.model} icon={Hash} />
              <DetailRow label="所属集群" value={resource.clusterName} icon={Server} />
              <DetailRow label="映射节点" value={resource.nodeId} mono icon={Box} />
              <DetailRow label="节点 IP 地址" value={resource.nodeIp} mono icon={Radio} />
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-4 px-1">
              <Settings size={14} className="text-primary-500" /> 系统环境与健康 (OS/DRIVER/HEALTH)
            </h4>
            <div className="bg-white rounded-2xl border border-slate-200 px-6 py-2 shadow-sm">
              <DetailRow label="驱动版本" value={resource.driverVersion} mono icon={Settings} />
              <DetailRow label="固件版本" value={resource.firmwareVersion || 'N/A'} mono icon={Settings} />
              <DetailRow label="健康检查状态" value={
                <Badge status={resource.healthStatus === 'healthy' ? 'success' : resource.healthStatus === 'warning' ? 'warning' : 'error'} showDot>
                   {resource.healthStatus === 'healthy' ? '正常 (NORMAL)' : '异常 (CRITICAL)'}
                </Badge>
              } icon={ShieldCheck} />
              <DetailRow label="设备类型标签" value={<Badge status="primary" showDot={false}>{resource.type}</Badge>} icon={Hash} />
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="pt-4 flex gap-4">
           <button 
             onClick={() => alert('正在初始化深度健康诊断系统...')}
             className="flex-1 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-600 transition-all shadow-lg shadow-slate-900/10 flex items-center justify-center gap-2"
           >
              <ShieldAlert size={14} /> 运行健康度自检 (SELF-CHECK)
           </button>
           <button 
             onClick={() => alert('日志回溯已启动')}
             className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2"
           >
              <Activity size={14} /> 监控轨迹
           </button>
        </div>
      </div>
    </Drawer>
  );
};
