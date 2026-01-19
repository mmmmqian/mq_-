import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  ArrowLeft, Send, Trash2, Settings, 
  Maximize2, Minimize2, Activity, Zap, 
  Clock, Cpu, ShieldCheck, Globe, 
  Image as ImageIcon, Sparkles, User, 
  Bot, RefreshCcw, Download, Copy,
  CheckCircle2, Gauge, MousePointer2,
  Terminal, BarChart3, AlertCircle,
  HelpCircle, MoreVertical, Layout,
  Smartphone, Monitor, Laptop,
  MonitorPlay, Layers, MessageSquare,
  FileText, Hash, Database
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import MonitoringChart from '../../components/ui/MonitoringChart';
import { generateMetrics } from '../../constants';

interface InferencePlaygroundProps {
  service: any;
  onBack: () => void;
}

const InferencePlaygroundPage: React.FC<InferencePlaygroundProps> = ({ service, onBack }) => {
  // --- UI States ---
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeMode, setActiveMode] = useState<'CHAT' | 'VISUAL'>(
    service?.modelName?.toLowerCase().includes('bert') || service?.modelName?.toLowerCase().includes('llama') ? 'CHAT' : 'VISUAL'
  );
  
  // --- Chat Logic ---
  const [messages, setMessages] = useState<any[]>([
    { 
      role: 'assistant', 
      content: `你好！我是基于 ${service?.modelName || '模型'} 的智能助手。已连接至生产环境节点。您可以向我提问。`, 
      time: '14:20:01',
      perf: { latency: '82ms', charCount: 45, tokenCount: 58, memory: '128MB' }
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // --- Parameters ---
  const [params, setParams] = useState({
    temperature: 0.7,
    topP: 0.9,
    maxTokens: 512,
    repetitionPenalty: 1.1,
    confidenceThreshold: 0.5
  });

  // --- Telemetry (Global) ---
  const [telemetry, setTelemetry] = useState({
    latency: 124,
    tokensPerSec: 42.5,
    vramUsed: 12.8,
    vramTotal: 80,
    requestId: 'REQ-' + Math.random().toString(36).substr(2, 9).toUpperCase()
  });

  const chatEndRef = useRef<HTMLDivElement>(null);
  const latencyHistory = useMemo(() => generateMetrics(20, 120, 40), []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Fix: Added missing handleFileUpload function to handle media uploads in Vision Lab
  const handleFileUpload = () => {
    alert('正在初始化视觉采样系统... 请选择要分析的图像或视频流。');
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMsg = { role: 'user', content: input, time: new Date().toLocaleTimeString([], { hour12: false }) };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate API delay and dynamic performance data
    setTimeout(() => {
      setIsTyping(false);
      const mockResponse = `这是针对“${input}”的模拟回复。在生产环境中，该请求已路由至服务 [${service.id}]。该演示环境已通过全链路加密与推理加速优化。`;
      
      const botMsg = { 
        role: 'assistant', 
        content: mockResponse, 
        time: new Date().toLocaleTimeString([], { hour12: false }),
        perf: {
            latency: `${Math.floor(Math.random() * 150 + 50)}ms`,
            charCount: mockResponse.length,
            tokenCount: Math.floor(mockResponse.length * 1.3),
            memory: `${(Math.random() * 200 + 150).toFixed(0)}MB`
        }
      };
      setMessages(prev => [...prev, botMsg]);
      
      // Update global telemetry for realism
      setTelemetry(prev => ({
        ...prev,
        latency: parseInt(botMsg.perf.latency),
        tokensPerSec: (Math.random() * 10 + 40).toFixed(1) as any,
        requestId: 'REQ-' + Math.random().toString(36).substr(2, 9).toUpperCase()
      }));
    }, 1500);
  };

  const ParamSlider = ({ label, subLabel, value, min, max, step, onChange, icon: Icon }: any) => (
    <div className="space-y-3 p-5 bg-slate-50/50 border border-slate-200/60 rounded-3xl hover:bg-white hover:border-primary-300 transition-all group">
       <div className="flex justify-between items-start">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
               {Icon && <Icon size={12} className="text-primary-500" strokeWidth={2.5} />} {label}
            </label>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter ml-5">{subLabel}</p>
          </div>
          <div className="px-2 py-1 bg-slate-100 rounded-lg group-hover:bg-primary-50 transition-colors">
            <span className="text-[11px] font-mono font-black text-slate-700 group-hover:text-primary-600">{value}</span>
          </div>
       </div>
       <div className="pt-2">
        <input 
            type="range" min={min} max={max} step={step} value={value} 
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="w-full h-1 bg-slate-200 rounded-full appearance-none accent-primary-600 cursor-pointer transition-all hover:h-1.5" 
        />
       </div>
    </div>
  );

  return (
    <div className={`flex flex-col h-screen bg-[#F8FAFC] transition-all duration-700 ${isFullscreen ? 'fixed inset-0 z-[1000]' : ''}`}>
      {/* 1. Header Area */}
      <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0 shadow-sm relative z-50">
         <div className="flex items-center gap-6">
            {!isFullscreen && (
               <button onClick={onBack} className="p-2.5 bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all">
                  <ArrowLeft size={20} strokeWidth={2.5} />
               </button>
            )}
            <div className="flex items-center gap-4">
               <div className="w-11 h-11 bg-slate-950 rounded-xl flex items-center justify-center text-white shadow-lg">
                  <MonitorPlay size={22} strokeWidth={2.5} />
               </div>
               <div>
                  <div className="flex items-center gap-3">
                     <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase leading-none">{service?.name || 'Inference Playground'}</h1>
                     <Badge status="success" showDot>CONNECTED</Badge>
                  </div>
                  <div className="flex items-center gap-2.5 mt-2">
                     <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">{service?.modelName} · {service?.modelVersion}</span>
                     <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                     <span className="text-[9px] font-black text-primary-600 uppercase tracking-[0.2em] animate-pulse">Running In Sandbox</span>
                  </div>
               </div>
            </div>
         </div>

         <div className="flex items-center gap-3">
            <button 
               onClick={() => setIsFullscreen(!isFullscreen)}
               className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary-600 transition-all shadow-xl active:scale-95"
            >
               {isFullscreen ? <><Minimize2 size={14} /> Exit Presentation</> : <><Maximize2 size={14} /> Present Mode</>}
            </button>
            <button className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all">
               <MoreVertical size={20} />
            </button>
         </div>
      </header>

      {/* 2. Main Content Layout */}
      <div className="flex-1 flex overflow-hidden relative">
         
         {/* Sidebar: Parameter Controls */}
         {!isFullscreen && (
            <aside className="w-80 bg-white border-r border-slate-200 flex flex-col shrink-0 animate-in slide-in-from-left duration-500">
               <div className="p-6 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
                  <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] flex items-center gap-2">
                     <Settings size={16} className="text-primary-600" /> Model Configuration
                  </h3>
                  <button 
                    onClick={() => setParams({ temperature: 0.7, topP: 0.9, maxTokens: 512, repetitionPenalty: 1.1, confidenceThreshold: 0.5 })}
                    className="p-1.5 text-slate-300 hover:text-primary-500 transition-colors" title="Reset to Defaults"
                  >
                     <RefreshCcw size={14} />
                  </button>
               </div>
               
               <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
                  <div className="space-y-4">
                     <ParamSlider 
                        label="最大长度 (Max)" 
                        subLabel="生成文本的最大长度"
                        value={params.maxTokens} 
                        min={50} max={1024} step={1} 
                        onChange={(v: number) => setParams({...params, maxTokens: v})} 
                        icon={Layers} 
                     />
                     <ParamSlider 
                        label="温度参数 (Temp)" 
                        subLabel="控制生成随机性与发散度"
                        value={params.temperature} 
                        min={0.1} max={2.0} step={0.1} 
                        onChange={(v: number) => setParams({...params, temperature: v})} 
                        icon={Zap} 
                     />
                     <ParamSlider 
                        label="Top-P (Nucleus)" 
                        subLabel="控制 Token 采样候选集合"
                        value={params.topP} 
                        min={0.1} max={1.0} step={0.05} 
                        onChange={(v: number) => setParams({...params, topP: v})} 
                        icon={Activity} 
                     />
                     <ParamSlider 
                        label="重复惩罚 (Rep)" 
                        subLabel="避免生成循环与重复内容"
                        value={params.repetitionPenalty} 
                        min={1.0} max={2.0} step={0.1} 
                        onChange={(v: number) => setParams({...params, repetitionPenalty: v})} 
                        icon={ShieldCheck} 
                     />
                  </div>
                  <div className="pt-6 border-t border-slate-100">
                     <div className="flex items-center gap-2 mb-4 px-1">
                        <Terminal size={12} className="text-slate-400" />
                        <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">System Instructions</h4>
                     </div>
                     <textarea 
                        rows={4}
                        placeholder="Define AI persona..."
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-medium focus:bg-white focus:border-primary-500 outline-none transition-all resize-none leading-relaxed shadow-inner"
                     />
                  </div>
               </div>

               <div className="p-6 bg-slate-50/50 border-t border-slate-100">
                  <button className="w-full py-3 bg-white border border-slate-200 text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-primary-500 hover:text-primary-600 transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95">
                     <Download size={14} /> Export Payload (.json)
                  </button>
               </div>
            </aside>
         )}

         {/* Center: Experience Area */}
         <main className="flex-1 flex flex-col bg-slate-50/40 relative">
            <div className="absolute inset-0 tech-grid opacity-[0.03] pointer-events-none"></div>
            
            <div className="px-8 pt-6 pb-2 flex justify-center sticky top-0 z-10">
               <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-soft flex items-center">
                  <button 
                    onClick={() => setActiveMode('CHAT')}
                    className={`flex items-center gap-2.5 px-8 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${activeMode === 'CHAT' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'}`}
                  >
                     <MessageSquare size={16} /> Text Chat
                  </button>
                  <button 
                    onClick={() => setActiveMode('VISUAL')}
                    className={`flex items-center gap-2.5 px-8 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${activeMode === 'VISUAL' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'}`}
                  >
                     <ImageIcon size={16} /> Vision Lab
                  </button>
               </div>
            </div>

            {activeMode === 'CHAT' ? (
               <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-8 overflow-hidden">
                  <div className="flex-1 overflow-y-auto pt-10 pb-20 space-y-10 scrollbar-none">
                     {messages.map((msg, i) => (
                        <div key={i} className={`flex gap-5 animate-in fade-in slide-in-from-bottom-4 duration-500 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                           <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg border ${
                              msg.role === 'assistant' 
                              ? 'bg-slate-950 text-white border-slate-800' 
                              : 'bg-primary-600 text-white border-primary-500'
                           }`}>
                              {msg.role === 'assistant' ? <Bot size={20} /> : <User size={20} />}
                           </div>
                           <div className={`max-w-[80%] space-y-3 ${msg.role === 'user' ? 'flex flex-col items-end' : ''}`}>
                              <div className={`p-5 rounded-3xl border shadow-sm leading-relaxed text-[13px] font-medium font-sans ${
                                 msg.role === 'assistant' 
                                 ? 'bg-white border-slate-200 text-slate-800 rounded-tl-none' 
                                 : 'bg-primary-50 border-primary-100 text-slate-900 rounded-tr-none'
                              }`}>
                                 {msg.content}
                              </div>
                              
                              {/* 性能指标栏 - 仅对助手回复显示 */}
                              {msg.role === 'assistant' && msg.perf && (
                                <div className="flex items-center gap-4 px-3 py-1.5 bg-slate-100/60 rounded-xl border border-slate-200/50 animate-in fade-in slide-in-from-top-1 duration-700">
                                   <div className="flex items-center gap-1.5" title="推理耗时">
                                      <Clock size={11} className="text-slate-400" />
                                      <span className="text-[10px] font-mono font-bold text-slate-600">{msg.perf.latency}</span>
                                   </div>
                                   <div className="w-px h-2.5 bg-slate-300"></div>
                                   <div className="flex items-center gap-1.5" title="生成字数">
                                      <FileText size={11} className="text-slate-400" />
                                      <span className="text-[10px] font-mono font-bold text-slate-600">{msg.perf.charCount}<span className="text-[8px] ml-0.5 opacity-50">CHAR</span></span>
                                   </div>
                                   <div className="w-px h-2.5 bg-slate-300"></div>
                                   <div className="flex items-center gap-1.5" title="Token数量">
                                      <Hash size={11} className="text-slate-400" />
                                      <span className="text-[10px] font-mono font-bold text-slate-600">{msg.perf.tokenCount}<span className="text-[8px] ml-0.5 opacity-50">TKN</span></span>
                                   </div>
                                   <div className="w-px h-2.5 bg-slate-300"></div>
                                   <div className="flex items-center gap-1.5" title="内存使用">
                                      <Database size={11} className="text-slate-400" />
                                      <span className="text-[10px] font-mono font-bold text-slate-600">{msg.perf.memory}</span>
                                   </div>
                                </div>
                              )}
                              
                              <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest px-1">
                                 {msg.time} · {msg.role === 'assistant' ? 'INFERENCE_COMPLETE' : 'CLIENT_DISPATCHED'}
                              </span>
                           </div>
                        </div>
                     ))}
                     {isTyping && (
                        <div className="flex gap-5 animate-pulse">
                           <div className="w-10 h-10 rounded-2xl bg-slate-950 flex items-center justify-center text-white"><Bot size={20} /></div>
                           <div className="bg-white border border-slate-200 rounded-3xl rounded-tl-none p-5 flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-bounce"></div>
                              <div className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-bounce [animation-delay:0.2s]"></div>
                              <div className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-bounce [animation-delay:0.4s]"></div>
                           </div>
                        </div>
                     )}
                     <div ref={chatEndRef} />
                  </div>

                  {/* Input Surface */}
                  <div className="shrink-0 pb-10 relative">
                     <div className="bg-white border-2 border-slate-200 focus-within:border-primary-500 rounded-[32px] p-2.5 pr-4 flex items-center gap-3 transition-all shadow-2xl shadow-slate-200/50 group">
                        <div className="p-3 text-slate-300 hover:text-primary-500 transition-colors cursor-pointer group-focus-within:text-primary-500">
                           <Terminal size={20} />
                        </div>
                        <input 
                           type="text" 
                           value={input}
                           onChange={(e) => setInput(e.target.value)}
                           onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                           placeholder={`Input prompt for ${service?.modelName}...`}
                           className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-semibold placeholder:text-slate-300 py-3"
                        />
                        <button 
                           onClick={handleSend}
                           disabled={!input.trim() || isTyping}
                           className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                              input.trim() && !isTyping 
                              ? 'bg-primary-600 text-white shadow-lg active:scale-95' 
                              : 'bg-slate-50 text-slate-300 cursor-not-allowed'
                           }`}
                        >
                           <Send size={18} strokeWidth={2.5} />
                        </button>
                     </div>
                  </div>
               </div>
            ) : (
               <div className="flex-1 flex flex-col items-center justify-center p-12 max-w-5xl mx-auto w-full">
                  <div 
                    onClick={handleFileUpload}
                    className="w-full aspect-[16/9] bg-white border-2 border-dashed border-slate-200 rounded-[48px] flex flex-col items-center justify-center group hover:border-primary-500 hover:bg-primary-50/5 transition-all cursor-pointer shadow-sm relative overflow-hidden"
                  >
                     <div className="absolute inset-0 tech-grid opacity-[0.02]"></div>
                     <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200 group-hover:bg-white group-hover:text-primary-600 group-hover:shadow-xl transition-all duration-700 mb-8 border border-slate-100 group-hover:scale-110">
                        <ImageIcon size={40} />
                     </div>
                     <h3 className="text-xl font-black text-slate-900 uppercase tracking-[0.2em] mb-3">Upload Inspection Media</h3>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest max-w-[320px] leading-relaxed text-center">Drag and drop images for real-time object detection or classification</p>
                  </div>
               </div>
            )}
         </main>

         {/* Right Sidebar: Real-time HUD Telemetry */}
         {!isFullscreen && (
            <aside className="w-96 bg-white border-l border-slate-200 flex flex-col shrink-0 overflow-y-auto scrollbar-thin animate-in slide-in-from-right duration-500">
               <div className="p-6 border-b border-slate-100 bg-slate-50/30">
                  <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] flex items-center gap-2">
                     <Gauge size={16} className="text-primary-600" /> Real-time Telemetry
                  </h3>
               </div>
               
               <div className="p-8 space-y-10">
                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-5 bg-slate-50 border border-slate-100 rounded-[24px] space-y-4">
                        <div className="flex justify-between items-start">
                           <div className="p-2 bg-white rounded-xl shadow-sm text-primary-600"><Clock size={16} /></div>
                           <Badge status="info" showDot={false}>LATENCY</Badge>
                        </div>
                        <div>
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">P99 Inference</p>
                           <p className="text-2xl font-black font-mono text-slate-900 tracking-tighter mt-1">{telemetry.latency}<span className="text-[10px] font-sans ml-1 text-slate-400">MS</span></p>
                        </div>
                     </div>
                     <div className="p-5 bg-slate-50 border border-slate-100 rounded-[24px] space-y-4">
                        <div className="flex justify-between items-start">
                           <div className="p-2 bg-white rounded-xl shadow-sm text-emerald-600"><Zap size={16} /></div>
                           <Badge status="success" showDot={false}>THROUGHPUT</Badge>
                        </div>
                        <div>
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Compute Speed</p>
                           <p className="text-2xl font-black font-mono text-slate-900 tracking-tighter mt-1">{telemetry.tokensPerSec}<span className="text-[10px] font-sans ml-1 text-slate-400">T/S</span></p>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-4">
                     <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
                        <BarChart3 size={14} className="text-primary-500" /> Latency Trajectory
                     </h4>
                     <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm">
                        <MonitoringChart data={latencyHistory} color="#1B58F4" height={160} label="Lat" unit="ms" />
                     </div>
                  </div>

                  <div className="space-y-6 bg-slate-950 rounded-[32px] p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
                     <div className="absolute inset-0 tech-grid opacity-[0.03]"></div>
                     <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] flex items-center gap-2 relative z-10 mb-2">
                        <Cpu size={14} className="text-primary-400" /> GPU Context (VRAM)
                     </h4>
                     <div className="space-y-6 relative z-10">
                        <div className="space-y-2.5">
                           <div className="flex justify-between items-center text-[9px] font-black text-slate-400 uppercase">
                              <span>Allocation Watermark</span>
                              <span className="text-white font-mono">{telemetry.vramUsed}G / {telemetry.vramTotal}G</span>
                           </div>
                           <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                              <div className="h-full bg-primary-500 transition-all duration-1000" style={{ width: `${(telemetry.vramUsed / telemetry.vramTotal) * 100}%` }}></div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </aside>
         )}
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default InferencePlaygroundPage;