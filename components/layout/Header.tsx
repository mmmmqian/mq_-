
import React, { useState, useRef, useEffect } from 'react';
import { 
  Bell, ChevronRight, Layers, Terminal, 
  ChevronDown, FolderKanban, Zap, ShieldCheck,
  Check, Search, Database, BrainCircuit, Rocket, Bot, Library, Server, Plus
} from 'lucide-react';
import { ModuleType } from '../../types';
import { MODULE_MENU, MOCK_PROJECTS } from '../../constants';
import { Badge } from '../ui/Badge';

interface HeaderProps {
  activeModule: ModuleType;
  setActiveModule: (m: ModuleType) => void;
  activePage: string;
}

const Header: React.FC<HeaderProps> = ({ activeModule, setActiveModule, activePage }) => {
  const [currentProject, setCurrentProject] = useState(MOCK_PROJECTS[0]);
  const [isProjectMenuOpen, setIsProjectMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 判断是否是业务模块（项目级）
  const isProjectLevel = activeModule !== 'compute';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsProjectMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const platformModule = MODULE_MENU.find(m => m.type === 'platform');
  const projectModules = MODULE_MENU.filter(m => m.type === 'project');

  return (
    <header className="h-16 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 fixed top-0 right-0 left-0 z-50 flex items-center justify-between px-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-all">
      {/* 1. Brand & Project Selector Integration */}
      <div className="flex items-center gap-6 min-w-[420px] border-r border-slate-100 h-full pr-6">
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 bg-slate-950 rounded-xl flex items-center justify-center text-white shadow-lg overflow-hidden shrink-0">
            <Layers size={18} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-black text-slate-900 leading-none tracking-tight uppercase truncate">AI-Nex Cloud</span>
            <span className="text-[8px] font-black text-primary-600 uppercase tracking-[0.3em] leading-none mt-1.5 opacity-80 whitespace-nowrap">Professional V2.5</span>
          </div>
        </div>

        {/* Dynamic Project Selector or Global Mode Indicator */}
        <div className="flex-1 min-w-0">
          {isProjectLevel ? (
            <div className="relative animate-in fade-in slide-in-from-left-2 duration-300" ref={menuRef}>
              <button 
                onClick={() => setIsProjectMenuOpen(!isProjectMenuOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl hover:border-primary-500 hover:bg-white transition-all group w-full"
              >
                <div className="w-6 h-6 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-primary-600 shadow-sm shrink-0">
                  <FolderKanban size={12} strokeWidth={3} />
                </div>
                <div className="flex flex-col items-start min-w-0 flex-1">
                   <span className="text-[10px] font-black text-slate-900 truncate leading-none uppercase">{currentProject.name}</span>
                   <span className="text-[8px] font-mono font-bold text-slate-400 mt-1 uppercase tracking-tighter">{currentProject.id}</span>
                </div>
                <ChevronDown size={14} className={`text-slate-300 group-hover:text-primary-500 transition-transform duration-300 shrink-0 ${isProjectMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isProjectMenuOpen && (
                <div className="absolute top-full mt-2 left-0 w-72 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-left ring-1 ring-black/5">
                  <div className="px-4 py-3 bg-slate-50/50 border-b border-slate-100">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">切换工作空间 (Select Project)</p>
                  </div>
                  <div className="py-2 max-h-80 overflow-y-auto scrollbar-thin">
                    {MOCK_PROJECTS.map((proj) => (
                      <button
                        key={proj.id}
                        onClick={() => {
                          setCurrentProject(proj);
                          setIsProjectMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-4 py-3 text-left transition-all hover:bg-slate-50 ${currentProject.id === proj.id ? 'bg-primary-50/50' : ''}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${currentProject.id === proj.id ? 'bg-primary-600 text-white border-primary-500 shadow-md' : 'bg-white border-slate-200 text-slate-400'}`}>
                            <FolderKanban size={14} />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{proj.name}</span>
                            <span className="text-[9px] font-mono font-bold text-slate-400 mt-0.5">{proj.id}</span>
                          </div>
                        </div>
                        {currentProject.id === proj.id && <Check size={14} className="text-primary-600" strokeWidth={3} />}
                      </button>
                    ))}
                  </div>
                  <div className="px-4 py-3 bg-slate-50 border-t border-slate-100">
                     <button className="text-[9px] font-black text-primary-600 uppercase tracking-widest hover:text-primary-700 flex items-center gap-2">
                       <Plus size={12} strokeWidth={3} /> 创建新项目资产
                     </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3 animate-in fade-in duration-500">
               {/* 去掉了 GLOBAL CLUSTER VIEW 标签和分隔线，保持简约严谨 */}
               <div className="flex items-center gap-2 overflow-hidden px-1">
                 <div className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse shrink-0 shadow-[0_0_8px_rgba(27,88,244,0.4)]"></div>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider whitespace-nowrap">基础设施管理模式 (INFRA_CONSOLE)</span>
               </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Main Navigation Sub-divided */}
      <div className="flex-1 flex items-center px-8 gap-8 overflow-hidden">
        {/* Platform Level Part */}
        <div className="flex items-center shrink-0">
          <button
            onClick={() => setActiveModule(platformModule?.id as ModuleType)}
            className={`flex items-center gap-2.5 px-4 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all duration-300 whitespace-nowrap ${
              activeModule === platformModule?.id
                ? 'bg-slate-950 text-white shadow-lg ring-1 ring-slate-800'
                : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {platformModule && <platformModule.icon size={13} strokeWidth={activeModule === platformModule.id ? 3 : 2} />}
            {platformModule?.label}
          </button>
        </div>

        <div className="h-6 w-px bg-slate-100 shrink-0"></div>

        {/* Project Level Part */}
        <nav className="flex items-center bg-slate-100/40 p-1 rounded-xl border border-slate-200/40 overflow-x-auto no-scrollbar">
          {projectModules.map((item) => {
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveModule(item.id as ModuleType)}
                className={`flex items-center gap-2.5 px-4 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all duration-300 shrink-0 whitespace-nowrap ${
                  isActive
                    ? 'bg-white text-primary-600 shadow-sm ring-1 ring-slate-200'
                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-200/30'
                }`}
              >
                <item.icon size={13} strokeWidth={isActive ? 3 : 2} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* 3. Control Surface */}
      <div className="flex items-center gap-4 shrink-0">
        <div className="flex items-center gap-1.5">
          <button className="p-2.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all relative group" title="Alerts">
            <Bell size={18} strokeWidth={2.5} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white ring-2 ring-red-500/20"></span>
          </button>
          
          <button className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all" title="Shell Console">
            <Terminal size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* User Profile Segment */}
        <div className="pl-4 border-l border-slate-200 flex items-center gap-3">
            <div className="flex flex-col items-end">
                <span className="text-[11px] font-black text-slate-900 tracking-tight uppercase leading-none">Admin Console</span>
                <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1 mt-1.5">
                   <Zap size={8} fill="currentColor" /> Verified Admin
                </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center text-white text-xs font-black shadow-lg shadow-slate-950/20 border border-slate-800 cursor-pointer hover:scale-105 active:scale-95 transition-all">
                AD
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
