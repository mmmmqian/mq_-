
import React, { useState, useRef, useEffect } from 'react';
import { 
  Bell, ChevronRight, Layers, Terminal, 
  ChevronDown, FolderKanban, Zap, ShieldCheck,
  Check, Search, Database, BrainCircuit, Rocket, Bot, Library, Server, Plus,
  User, Key, LogOut, Settings2, UserCircle
} from 'lucide-react';
import { ModuleType } from '../../types';
import { MODULE_MENU, MOCK_PROJECTS } from '../../constants';
import { Badge } from '../ui/Badge';
import { ChangePasswordModal } from '../modals/ChangePasswordModal';

interface HeaderProps {
  activeModule: ModuleType;
  setActiveModule: (m: ModuleType) => void;
  activePage: string;
}

const Header: React.FC<HeaderProps> = ({ activeModule, setActiveModule, activePage }) => {
  const [currentProject, setCurrentProject] = useState(MOCK_PROJECTS[0]);
  const [isProjectMenuOpen, setIsProjectMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  
  const projectMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const isProjectLevel = activeModule !== 'compute';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (projectMenuRef.current && !projectMenuRef.current.contains(event.target as Node)) {
        setIsProjectMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const platformModule = MODULE_MENU.find(m => m.type === 'platform');
  const projectModules = MODULE_MENU.filter(m => m.type === 'project');

  return (
    <header className="h-16 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 fixed top-0 right-0 left-0 z-50 flex items-center justify-between px-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-all">
      <ChangePasswordModal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} />
      
      {/* 1. Brand & Project Selector */}
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

        <div className="flex-1 min-w-0">
          {isProjectLevel ? (
            <div className="relative animate-in fade-in slide-in-from-left-2 duration-300" ref={projectMenuRef}>
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
            <div className="flex items-center gap-3 animate-in fade-in duration-500 px-1">
               <div className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse shrink-0 shadow-[0_0_8px_rgba(27,88,244,0.4)]"></div>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider whitespace-nowrap">基础设施管理模式 (INFRA_CONSOLE)</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Main Navigation */}
      <div className="flex-1 flex items-center px-8 gap-8 overflow-hidden">
        <div className="flex items-center shrink-0">
          <button
            onClick={() => setActiveModule(platformModule?.id as ModuleType)}
            className={`flex items-center gap-2.5 px-4 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all duration-300 whitespace-nowrap ${
              activeModule === platformModule?.id ? 'bg-slate-950 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {platformModule && <platformModule.icon size={13} strokeWidth={activeModule === platformModule.id ? 3 : 2} />}
            {platformModule?.label}
          </button>
        </div>
        <div className="h-6 w-px bg-slate-100 shrink-0"></div>
        <nav className="flex items-center bg-slate-100/40 p-1 rounded-xl border border-slate-200/40 overflow-x-auto no-scrollbar">
          {projectModules.map((item) => {
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveModule(item.id as ModuleType)}
                className={`flex items-center gap-2.5 px-4 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all duration-300 shrink-0 whitespace-nowrap ${
                  isActive ? 'bg-white text-primary-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <item.icon size={13} strokeWidth={isActive ? 3 : 2} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* 3. Control Surface & Personal Center */}
      <div className="flex items-center gap-4 shrink-0">
        <div className="flex items-center gap-1.5">
          <button className="p-2.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all relative group" title="Alerts">
            <Bell size={18} strokeWidth={2.5} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <button className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all" title="Shell Console">
            <Terminal size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* 用户区域下拉菜单入口 */}
        <div className="pl-4 border-l border-slate-200 flex items-center gap-3 relative" ref={userMenuRef}>
            <button 
               onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
               className="flex items-center gap-3 group transition-all"
            >
               <div className="flex flex-col items-end">
                   <span className="text-[11px] font-black text-slate-900 tracking-tight uppercase leading-none group-hover:text-primary-600 transition-colors">Admin Console</span>
                   <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1 mt-1.5">
                      <Zap size={8} fill="currentColor" /> Verified Admin
                   </span>
               </div>
               <div className={`w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center text-white text-xs font-black shadow-lg border border-slate-800 group-hover:scale-105 group-active:scale-95 transition-all ${isUserMenuOpen ? 'ring-4 ring-primary-500/10 border-primary-500' : ''}`}>
                   AD
               </div>
            </button>

            {/* 个人中心下拉菜单：严谨限制最大高度，避免在大数据列表页产生溢出 */}
            {isUserMenuOpen && (
               <div className="absolute top-full right-0 mt-3 w-72 bg-white/95 backdrop-blur-xl border border-slate-200/60 rounded-[28px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right ring-1 ring-black/5 flex flex-col max-h-[80vh]">
                  <div className="p-6 bg-slate-950 text-white relative overflow-hidden shrink-0">
                     <div className="absolute -right-4 -bottom-4 opacity-[0.05] text-white pointer-events-none"><UserCircle size={100} /></div>
                     <div className="flex items-center gap-4 relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/10 font-black shadow-inner">AD</div>
                        <div>
                           <p className="text-xs font-black uppercase tracking-tight leading-none">系统管理员</p>
                           <p className="text-[9px] font-mono font-bold text-slate-400 mt-2 tracking-widest uppercase">ID: NEX-SYS-001</p>
                        </div>
                     </div>
                  </div>

                  <div className="p-3 bg-white flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-100">
                     <div className="space-y-1">
                        <button 
                           onClick={() => { setIsUserMenuOpen(false); }}
                           className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary-50 transition-all group"
                        >
                           <div className="p-2 rounded-lg bg-slate-50 text-slate-400 group-hover:bg-white group-hover:text-primary-600 transition-all shadow-sm">
                              <User size={16} />
                           </div>
                           <div className="flex flex-col items-start">
                              <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">账号档案 (PROFILE)</span>
                              <span className="text-[8px] text-slate-400 font-bold uppercase mt-0.5 tracking-tighter opacity-60">View details</span>
                           </div>
                        </button>
                        <button 
                           onClick={() => { setIsUserMenuOpen(false); setIsPasswordModalOpen(true); }}
                           className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary-50 transition-all group"
                        >
                           <div className="p-2 rounded-lg bg-slate-50 text-slate-400 group-hover:bg-white group-hover:text-primary-600 transition-all shadow-sm">
                              <Key size={16} />
                           </div>
                           <div className="flex flex-col items-start">
                              <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">修改密码 (SECURITY)</span>
                              <span className="text-[8px] text-slate-400 font-bold uppercase mt-0.5 tracking-tighter opacity-60">Update credentials</span>
                           </div>
                        </button>
                        <button 
                           className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-all group opacity-50 cursor-not-allowed"
                        >
                           <div className="p-2 rounded-lg bg-slate-50 text-slate-400">
                              <Settings2 size={16} />
                           </div>
                           <div className="flex flex-col items-start">
                              <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">偏好设置 (CONFIG)</span>
                           </div>
                        </button>
                     </div>

                     <div className="h-px bg-slate-50 my-2 mx-2"></div>

                     <button 
                        onClick={() => { if(window.confirm('确认安全注销并退出系统？')) window.location.reload(); }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 transition-all group"
                     >
                        <div className="p-2 rounded-lg bg-red-50/50 text-red-400 group-hover:bg-white group-hover:text-red-600 transition-all shadow-sm">
                           <LogOut size={16} />
                        </div>
                        <div className="flex flex-col items-start text-red-600">
                           <span className="text-[10px] font-black uppercase tracking-widest">退出登录 (LOGOUT)</span>
                           <span className="text-[8px] text-red-400 font-bold uppercase mt-0.5 tracking-tighter opacity-60">End session</span>
                        </div>
                     </button>
                  </div>
               </div>
            )}
        </div>
      </div>
    </header>
  );
};

export default Header;
