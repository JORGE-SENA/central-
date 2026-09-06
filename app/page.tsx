"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  Cpu,
  Zap,
  Terminal,
  Bot,
  ShieldAlert,
  LayoutGrid,
  Layers,
  Code2,
  Settings,
  Search,
  Power,
  ChevronRight,
  MessageSquareText,
  MousePointer2,
  HardDrive,
  Activity,
  Workflow,
  Sparkles,
  Command,
  Fingerprint,
  Radio,
  Gauge,
  X,
  Maximize2
} from 'lucide-react';

export default function AnalizisMasterEngine() {
  const [isEngineOn, setIsEngineOn] = useState(false);
  const [activeView, setActiveTab] = useState('Dashboard');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "--- NÚCLEO ANALIZIS ESTUDIO CARGADO ---",
    "Protocolos de integridad verificados.",
    "Esperando ignición Ducati V4..."
  ]);
  const [aiInput, setAiInput] = useState("");
  const [aiMessages, setAiMessages] = useState<{role: 'bot'|'user', text: string}[]>([
    { role: 'bot', text: 'Bienvenido, Jorge. El estudio está listo. ¿Qué proyecto vamos a elevar hoy?' }
  ]);
  const [load, setLoad] = useState(0);

  const log = (msg: string) => {
    setTerminalLogs(prev => [...prev.slice(-10), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const toggleEngine = () => {
    setIsEngineOn(!isEngineOn);
    if (!isEngineOn) {
      log("MOTOR DUCATI V4: IGNICIÓN.");
      setLoad(34.2);
    } else {
      log("Motor en hibernación.");
      setLoad(0);
    }
  };

  const handleAiSend = () => {
    if (!aiInput) return;
    const userMsg = aiInput;
    setAiMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setAiInput("");
    log(`IA CMD: ${userMsg}`);

    // Respuesta simulada de IA de alto nivel
    setTimeout(() => {
      setAiMessages(prev => [...prev, { role: 'bot', text: `Procesando comando: "${userMsg}". Analizando cuadrículas de diseño y optimizando código local.` }]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1E] flex font-sans selection:bg-[#5E5CE6]/10">

      {/* 1. SIDEBAR ESTILO STUDIO (Limpio y Fino) */}
      <aside className="w-20 lg:w-72 bg-white border-r border-gray-200 flex flex-col p-6 h-screen sticky top-0 transition-all duration-500 shadow-sm z-50">
        <div className="flex items-center gap-4 mb-16 lg:px-2">
          <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center shadow-2xl">
            <Cpu size={24} className="text-white" />
          </div>
          <div className="hidden lg:block">
            <h1 className="font-black uppercase tracking-tighter text-xl italic leading-none">ANALIZIS</h1>
            <p className="text-[8px] font-black text-orange-600 uppercase tracking-[0.4em] mt-1">Master Studio</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {['Dashboard', 'SaaS Apps', 'Blueprints', 'Security'].map((item) => (
            <button
              key={item}
              onClick={() => { setActiveTab(item); log(`Cambiando a vista: ${item}`); }}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-black uppercase italic text-[10px] tracking-widest transition-all ${
                activeView === item ? 'bg-black text-white shadow-xl translate-x-1' : 'text-gray-400 hover:bg-gray-50 hover:text-black'
              }`}
            >
              <LayoutGrid size={16} />
              <span className="hidden lg:block">{item}</span>
            </button>
          ))}
        </nav>

        {/* ENGINE POWER BUTTON */}
        <div className="mt-auto">
          <button
            onClick={toggleEngine}
            className={`w-full p-6 rounded-[2.5rem] flex flex-col items-center gap-3 transition-all duration-500 border-2 ${
              isEngineOn ? 'bg-orange-50 border-orange-500 shadow-lg' : 'bg-gray-50 border-gray-100 opacity-50'
            }`}
          >
            <Power size={24} className={isEngineOn ? 'text-orange-600 animate-pulse' : 'text-gray-300'} />
            <span className="hidden lg:block text-[9px] font-black uppercase italic text-gray-500">
              {isEngineOn ? 'Ducati On' : 'Ignition'}
            </span>
          </button>
        </div>
      </aside>

      {/* 2. MAIN CORE COMMAND */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">

        {/* HEADER LIMPIO (Cuadrícula superior) */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-10 shrink-0 sticky top-0 z-40">
          <div className="relative w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
            <input
              type="text"
              placeholder="Buscar en el ecosistema..."
              className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-gray-200 rounded-2xl py-3 pl-12 pr-4 outline-none transition-all font-bold text-xs"
            />
          </div>

          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
               <span className="text-[10px] font-black uppercase tracking-widest text-orange-600 italic">Estado del Motor</span>
               <span className={`text-xs font-black ${isEngineOn ? 'text-green-500' : 'text-red-500'}`}>
                 {isEngineOn ? 'V4 ACTIVE' : 'SYSTEM STANDBY'}
               </span>
            </div>
            <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-black italic shadow-lg">A</div>
          </div>
        </header>

        {/* WORKSPACE (Grid Layout Limpio) */}
        <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">

          {/* CUADRÍCULA DE MÉTRICAS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <MetricCard label="Carga Motor" value={`${isEngineOn ? load.toFixed(1) : '0.0'}%`} icon={Gauge} color="text-orange-500" bg="bg-orange-50" />
            <MetricCard label="Uptime 24/7" value="99.9%" icon={Zap} color="text-yellow-500" bg="bg-yellow-50" />
            <MetricCard label="Nodos SaaS" value="4" icon={Activity} color="text-purple-500" bg="bg-purple-50" />
            <MetricCard label="Modo" value="Local" icon={Fingerprint} color="text-blue-500" bg="bg-blue-50" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* IA LOCAL PANEL (Majestuoso) */}
            <div className="lg:col-span-8 bg-white rounded-[3.5rem] border border-gray-100 shadow-2xl overflow-hidden flex flex-col relative h-[550px]">
               <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center shadow-xl">
                      <Bot size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black uppercase italic tracking-tighter">Analizis AI Assistant</h3>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Motor Inteligente Local</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200 text-[8px] font-black text-green-500 uppercase italic">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></div>
                    Sincronizado
                  </div>
               </div>

               <div className="flex-1 p-8 flex flex-col bg-white">
                  <div className="space-y-6 flex-1 overflow-y-auto pr-4 custom-scrollbar">
                    {aiMessages.map((m, i) => (
                      <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-6 rounded-[2rem] max-w-[80%] text-xs font-bold leading-relaxed italic border ${
                          m.role === 'user' ? 'bg-black text-white border-black rounded-tr-none' : 'bg-gray-50 text-gray-800 border-gray-100 rounded-tl-none'
                        }`}>
                          {m.text}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 flex gap-4">
                    <input
                      type="text"
                      placeholder="Indica un comando para la fábrica..."
                      className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl p-5 outline-none focus:border-black transition-all font-bold text-sm italic"
                      value={aiInput}
                      onChange={(e) => setAiInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAiSend()}
                    />
                    <button
                      onClick={handleAiSend}
                      className="w-16 bg-black text-white rounded-2xl flex items-center justify-center hover:bg-orange-600 transition-all shadow-xl active:scale-95"
                    >
                      <MessageSquareText size={20} />
                    </button>
                  </div>
               </div>
            </div>

            {/* CAJA DE HERRAMIENTAS Y TERMINAL */}
            <div className="lg:col-span-4 space-y-6 flex flex-col">
               <div className="bg-white rounded-[3rem] border border-gray-100 p-8 shadow-xl flex-1">
                  <h3 className="font-black uppercase italic tracking-tighter text-sm mb-6 flex items-center gap-2">
                    <Command size={16} className="text-orange-600" /> Toolbox Local
                  </h3>
                  <div className="space-y-3">
                    <ToolAction label="Limpieza" icon={Zap} onClick={() => log("Lanzando limpieza_maestra.py...")} />
                    <ToolAction label="Auditoría" icon={ShieldAlert} onClick={() => log("Iniciando auditor.py...")} />
                    <ToolAction label="Factoría" icon={Code2} onClick={() => log("Iniciando creacion.py...")} />
                  </div>
               </div>

               <div className="h-64 bg-[#111] rounded-[2.5rem] p-6 border border-black shadow-2xl relative overflow-hidden font-mono">
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
                    <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.3em]">Console Output</span>
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500/20"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500/20"></div>
                    </div>
                  </div>
                  <div className="space-y-1 h-[140px] overflow-y-auto custom-scrollbar-dark">
                    {terminalLogs.map((l, i) => (
                      <p key={i} className="text-[9px] text-white/60 font-medium">
                        <span className="text-orange-600 mr-2">➜</span> {l}
                      </p>
                    ))}
                    <div className="w-1.5 h-3 bg-white/20 animate-pulse inline-block ml-1"></div>
                  </div>
               </div>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}

// UI COMPONENTS DE ALTO NIVEL
function MetricCard({ label, value, icon: Icon, color, bg }: any) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 group relative overflow-hidden">
       <div className={`absolute top-0 right-0 w-24 h-24 ${bg} rounded-bl-[4rem] -mr-8 -mt-8 opacity-0 group-hover:opacity-100 transition-all`}></div>
       <div className={`${bg} ${color} w-12 h-12 rounded-2xl flex items-center justify-center mb-6 relative z-10`}>
          <Icon size={20} />
       </div>
       <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 relative z-10">{label}</p>
       <p className="text-3xl font-black italic text-gray-900 leading-none relative z-10">{value}</p>
    </div>
  );
}

function ToolAction({ label, icon: Icon, onClick }: any) {
  return (
    <button onClick={onClick} className="w-full flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-transparent hover:border-black hover:bg-white transition-all group">
      <div className="flex items-center gap-3">
        <Icon size={16} className="text-gray-400 group-hover:text-orange-600" />
        <span className="text-[10px] font-black uppercase italic text-gray-600 group-hover:text-black">{label}</span>
      </div>
      <ChevronRight size={12} className="text-gray-300 group-hover:translate-x-1 transition-transform" />
    </button>
  );
}
