
import React, { useState } from 'react';
import Header from './components/layout/Header';
import ClustersPage from './pages/Compute/Clusters';
import HeterogeneousResourcesPage from './pages/Compute/HeterogeneousResources';
import ResourcePoolsPage from './pages/Compute/ResourcePools';
import TasksPage from './pages/Compute/Tasks';
import MonitoringPage from './pages/Compute/Monitoring';
import { ModuleType } from './types';
import { SIDEBAR_ITEMS } from './constants';
import { ChevronRight, ExternalLink } from 'lucide-react';

const App: React.FC = () => {
  const [activeModule, setActiveModule] = useState<ModuleType>('compute');
  const [activePage, setActivePage] = useState<string>('clusters');

  // Dynamic Sidebar based on Module
  const Sidebar = () => {
    const items = SIDEBAR_ITEMS[activeModule] || SIDEBAR_ITEMS['compute'];
    
    return (
      <aside className="w-64 fixed left-0 top-14 bottom-0 bg-white border-r border-slate-200 flex flex-col z-40 transition-all duration-300">
        <div className="flex-1 overflow-y-auto py-6 px-4">
          <div className="mb-6 px-2">
             <div className="flex items-center gap-2 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-widest">
                  {activeModule}
                </h2>
             </div>
             <p className="text-[10px] text-slate-400 pl-3.5">Workspace</p>
          </div>

          <div className="space-y-8">
            {items.map((group, idx) => (
              <div key={idx}>
                <h4 className="px-3 mb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">{group.title}</h4>
                <ul className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = activePage === item.id;
                    return (
                      <li key={item.id}>
                        <button
                          onClick={() => setActivePage(item.id)}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group relative overflow-hidden ${
                            isActive
                              ? 'bg-primary-50 text-primary-700 font-semibold'
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                        >
                          {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500 rounded-r-full" />}
                          <div className="flex items-center gap-3">
                            <item.icon 
                              size={18} 
                              strokeWidth={isActive ? 2.5 : 2} 
                              className={`transition-colors ${isActive ? 'text-primary-600' : 'text-slate-400 group-hover:text-slate-600'}`} 
                            />
                            <span>{item.label}</span>
                          </div>
                          {isActive && <ChevronRight size={14} className="text-primary-400" />}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
        
        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/30">
           <div className="bg-gradient-to-r from-slate-100 to-white border border-slate-200 rounded-lg p-3 shadow-sm">
             <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">System Status</span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
             </div>
             <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 font-mono">v2.5.0</span>
                <a href="#" className="flex items-center gap-1 text-[10px] text-primary-600 hover:text-primary-700 font-medium">
                   Docs <ExternalLink size={10} />
                </a>
             </div>
           </div>
        </div>
      </aside>
    );
  };

  // Content Router
  const renderContent = () => {
    if (activeModule === 'compute') {
      if (activePage === 'clusters') return <ClustersPage />;
      if (activePage === 'hetero') return <HeterogeneousResourcesPage />;
      if (activePage === 'pools') return <ResourcePoolsPage />;
      if (activePage === 'tasks') return <TasksPage />;
      if (activePage === 'monitoring') return <MonitoringPage />;
    }
    
    // Placeholder for other pages
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center p-8 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-md border border-slate-100 relative">
          <div className="absolute inset-0 bg-primary-50 rounded-full animate-ping opacity-20"></div>
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
            <div className="w-4 h-4 rounded-full bg-primary-500 animate-pulse"></div>
          </div>
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Module Under Construction</h2>
        <p className="text-sm text-slate-500 max-w-md leading-relaxed">
          The <strong>{activePage.replace('-', ' ')}</strong> interface is currently being optimized by our engineering team. 
          Expect a rigorous update shortly.
        </p>
        <button className="mt-6 px-6 py-2 bg-white border border-slate-200 text-slate-700 font-medium rounded-lg shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all text-sm">
           View Documentation
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 selection:bg-primary-100 selection:text-primary-900">
      <Header activeModule={activeModule} setActiveModule={(m) => {
        setActiveModule(m);
        // Reset to first page of the new module
        const firstPage = SIDEBAR_ITEMS[m]?.[0]?.items?.[0]?.id;
        if (firstPage) setActivePage(firstPage);
      }} activePage={activePage} />
      
      <Sidebar />
      
      <main className="pl-64 pt-14 min-h-screen transition-all duration-300">
        <div className="max-w-[1600px] mx-auto p-6 lg:p-8">
           {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
