
import React, { useState } from 'react';
import Header from './components/layout/Header';
import ClustersPage from './pages/Compute/Clusters';
import HeterogeneousResourcesPage from './pages/Compute/HeterogeneousResources';
import ResourcePoolsPage from './pages/Compute/ResourcePools';
import TasksPage from './pages/Compute/Tasks';
import MonitoringPage from './pages/Compute/Monitoring';
import ProjectsPage from './pages/Compute/Projects';
import TenantsPage from './pages/Compute/Tenants';
import UsersPage from './pages/Compute/Users';
import RolesPage from './pages/Compute/Roles'; // 新增
import ModelManagementPage from './pages/Training/ModelManagement';
import ModelHubPage from './pages/Training/ModelHub';
import IDEEnvironmentPage from './pages/Training/IDEEnvironment';
import OnlineServicesPage from './pages/Inference/OnlineServices';
import ServiceMonitoringPage from './pages/Inference/ServiceMonitoring';
import InferencePlaygroundPage from './pages/Inference/InferencePlayground'; 
import { ModuleType } from './types';
import { SIDEBAR_ITEMS } from './constants';
import { ChevronRight, ExternalLink, ShieldCheck, Activity, Rocket, ShieldAlert } from 'lucide-react';

const App: React.FC = () => {
  const [activeModule, setActiveModule] = useState<ModuleType>('compute');
  const [activePage, setActivePage] = useState<string>('clusters');
  const [navigationData, setNavigationData] = useState<any>(null); // 新增：用于页面间传参

  // Navigation controller enhanced to support extra data
  const navigate = (module: any, page: string, data?: any) => {
    setActiveModule(module);
    setActivePage(page);
    if (data) setNavigationData(data);
  };

  // Modern Professional Sidebar
  const Sidebar = () => {
    // 如果是下钻的 Playground 页面，隐藏侧边栏以提供全屏感
    if (activePage === 'inference-playground') return null;

    const items = SIDEBAR_ITEMS[activeModule] || SIDEBAR_ITEMS['compute'];
    
    return (
      <aside className="w-72 fixed left-0 top-16 bottom-0 bg-white border-r border-slate-200 flex flex-col z-40 transition-all duration-300">
        <div className="flex-1 overflow-y-auto pt-8 pb-6 px-6 scrollbar-thin">
          <div className="mb-10 flex items-center justify-between">
             <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-1 h-3 bg-primary-600 rounded-full"></span>
                  <h2 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">
                    {activeModule} NODE
                  </h2>
                </div>
                <p className="text-[10px] font-bold text-slate-400 pl-3 uppercase tracking-widest italic">Management Stack</p>
             </div>
             <Activity size={16} className="text-slate-200" />
          </div>

          <nav className="space-y-10">
            {items.map((group, idx) => (
              <div key={idx}>
                <h4 className="px-3 mb-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.25em] flex items-center gap-2">
                   <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                   {group.title}
                </h4>
                <ul className="space-y-1.5">
                  {group.items.map((item) => {
                    const isActive = activePage === item.id;
                    return (
                      <li key={item.id}>
                        <button
                          onClick={() => setActivePage(item.id)}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs transition-all duration-300 group relative overflow-hidden ${
                            isActive
                              ? 'bg-slate-950 text-white shadow-xl shadow-slate-900/10'
                              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                        >
                          <div className="flex items-center gap-3.5 relative z-10">
                            <item.icon 
                              size={18} 
                              strokeWidth={isActive ? 2.5 : 2} 
                              className={`transition-colors ${isActive ? 'text-primary-400' : 'text-slate-300 group-hover:text-primary-500'}`} 
                            />
                            <span className={`font-black uppercase tracking-tight ${isActive ? 'text-white' : ''}`}>
                              {item.label}
                            </span>
                          </div>
                          {isActive && <ChevronRight size={14} className="text-primary-500/50 relative z-10" strokeWidth={3} />}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        
        {/* Professional Footer Stat */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/20">
           <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm group hover:border-primary-200 transition-all">
             <div className="flex items-center justify-between mb-3">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <ShieldCheck size={12} className="text-emerald-500" /> System Link
                </span>
                <div className="flex items-center gap-1">
                  <span className="flex h-1.5 w-1.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-[9px] font-black text-emerald-600">ONLINE</span>
                </div>
             </div>
             <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-800 font-mono tracking-tighter">BUILD v2.5.0-STABLE</span>
                <a href="#" className="p-1.5 bg-slate-50 border border-slate-100 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-all">
                   <ExternalLink size={12} />
                </a>
             </div>
           </div>
        </div>
      </aside>
    );
  };

  const renderContent = () => {
    if (activeModule === 'compute') {
      if (activePage === 'clusters') return <ClustersPage />;
      if (activePage === 'hetero') return <HeterogeneousResourcesPage />;
      if (activePage === 'pools') return <ResourcePoolsPage />;
      if (activePage === 'tasks') return <TasksPage />;
      if (activePage === 'monitoring') return <MonitoringPage />;
      if (activePage === 'projects') return <ProjectsPage />;
      if (activePage === 'tenants') return <TenantsPage />;
      if (activePage === 'users') return <UsersPage />;
      if (activePage === 'roles') return <RolesPage />; // 新增
    }

    if (activeModule === 'training') {
      if (activePage === 'model-mgmt') return <ModelManagementPage navigate={navigate} />;
      if (activePage === 'model-hub') return <ModelHubPage navigate={navigate} />;
      if (activePage === 'ide-env') return <IDEEnvironmentPage />;
    }

    if (activeModule === 'inference') {
      if (activePage === 'online-service') return <OnlineServicesPage navigate={navigate} />;
      if (activePage === 'service-monitor') return <ServiceMonitoringPage />;
      if (activePage === 'inference-playground') return <InferencePlaygroundPage service={navigationData?.service} onBack={() => navigate('inference', 'online-service')} />;
      
      return (
        <div className="flex flex-col items-center justify-center h-[70vh] text-center p-8 border border-slate-200 rounded-4xl bg-white/50 backdrop-blur-sm shadow-sm">
          <div className="w-24 h-24 bg-primary-600 rounded-3xl flex items-center justify-center mb-8 border border-primary-500 relative group animate-bounce">
            <Rocket size={40} className="text-white" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-3 tracking-tight uppercase">推理服务模块</h2>
          <p className="text-[11px] font-bold text-slate-400 max-w-sm leading-relaxed uppercase tracking-widest italic">
            请从侧边栏选择 <span className="text-primary-600">在线服务</span> 或 <span className="text-primary-600">服务监控</span> 以开始管理您的推理工作负载。
          </p>
        </div>
      );
    }
    
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center p-8 border border-slate-200 rounded-4xl bg-white/50 backdrop-blur-sm shadow-sm">
        <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center mb-8 border border-slate-100 relative group">
          <div className="absolute inset-0 bg-primary-100 rounded-3xl animate-pulse opacity-20"></div>
          <Activity size={40} className="text-slate-300 group-hover:text-primary-500 transition-colors duration-500" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-3 tracking-tight uppercase">Module Initializing</h2>
        <p className="text-[11px] font-bold text-slate-400 max-w-sm leading-relaxed uppercase tracking-widest italic">
          The <span className="text-primary-600">{activePage.replace('-', ' ')}</span> interface is currently being optimized for rigorous production deployments.
        </p>
        <button className="mt-8 px-8 py-3 bg-slate-950 text-white font-black text-[10px] uppercase tracking-[0.25em] rounded-xl shadow-xl shadow-slate-900/10 hover:bg-primary-600 transition-all active:scale-95">
           Open Documentation Path
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 selection:bg-primary-100 selection:text-primary-900">
      <Header activeModule={activeModule} setActiveModule={(m) => {
        setActiveModule(m);
        const firstPage = SIDEBAR_ITEMS[m]?.[0]?.items?.[0]?.id;
        if (firstPage) setActivePage(firstPage);
      }} activePage={activePage} />
      
      <Sidebar />
      
      <main className={`${activePage === 'inference-playground' ? 'pl-0' : 'pl-72'} pt-16 min-h-screen transition-all duration-300 overflow-x-hidden`}>
        <div className={`${activePage === 'inference-playground' ? 'max-w-full' : 'max-w-[1600px] mx-auto p-8 lg:p-10'}`}>
           {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
