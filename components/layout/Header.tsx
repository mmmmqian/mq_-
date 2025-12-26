
import React from 'react';
import { Bell, ChevronRight, Layers, Terminal, Search, Command } from 'lucide-react';
import { ModuleType } from '../../types';
import { MODULE_MENU } from '../../constants';

interface HeaderProps {
  activeModule: ModuleType;
  setActiveModule: (m: ModuleType) => void;
  activePage: string;
}

const Header: React.FC<HeaderProps> = ({ activeModule, setActiveModule, activePage }) => {
  return (
    <header className="h-14 bg-white/80 backdrop-blur-md border-b border-slate-200 fixed top-0 right-0 left-0 z-50 flex items-center justify-between px-4 shadow-sm transition-all duration-200">
      {/* Logo Area */}
      <div className="flex items-center gap-3 w-64 pl-2">
        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary-600/20">
          <Layers size={18} strokeWidth={2.5} />
        </div>
        <div className="flex flex-col justify-center">
          <span className="text-sm font-bold text-slate-900 leading-tight tracking-tight font-sans">
            AI-Nex Cloud
          </span>
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest leading-none mt-0.5">
            Platform
          </span>
        </div>
      </div>

      {/* Breadcrumbs & Navigation */}
      <div className="flex-1 flex items-center gap-6 px-4">
        {/* Module Selector */}
        <div className="flex items-center bg-slate-100/50 p-1 rounded-lg border border-slate-200/50">
          {MODULE_MENU.map((item) => {
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveModule(item.id as ModuleType)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-white text-primary-600 shadow-sm ring-1 ring-black/5'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                }`}
              >
                <item.icon size={14} strokeWidth={isActive ? 2.5 : 2} />
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="h-4 w-px bg-slate-300"></div>

        {/* Breadcrumb */}
        <div className="flex items-center text-xs text-slate-500 font-medium">
           <span className="uppercase tracking-wider">{activeModule}</span>
           <ChevronRight size={12} className="mx-2 text-slate-300" />
           <span className="text-slate-800 capitalize bg-slate-100 px-2 py-0.5 rounded text-[11px] border border-slate-200">
             {activePage.replace('-', ' ')}
           </span>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 w-auto justify-end">
        {/* Search */}
        <div className="hidden lg:flex items-center relative mr-2">
           <Search size={14} className="absolute left-3 text-slate-400" />
           <input 
             type="text" 
             placeholder="Search resources..." 
             className="pl-9 pr-10 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 w-64 transition-all"
           />
           <div className="absolute right-3 flex items-center gap-0.5 text-[10px] text-slate-400 font-mono">
             <Command size={10} /> K
           </div>
        </div>

        <button className="p-2 text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors relative">
          <Bell size={18} strokeWidth={2} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <button className="p-2 text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title="System Console">
          <Terminal size={18} strokeWidth={2} />
        </button>

        <div className="pl-2 border-l border-slate-200 ml-2 flex items-center gap-3">
            <div className="flex flex-col items-end">
                <span className="text-xs font-semibold text-slate-800">Admin User</span>
                <span className="text-[10px] text-slate-500">Platform Admin</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-primary-500/20 ring-2 ring-white cursor-pointer">
                AD
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
