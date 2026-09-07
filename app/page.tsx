\"use client\";

import React, { useState, useEffect } from 'react';
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
  Activity,
  Fingerprint,
  Gauge,
  Command
} from 'lucide-react';

interface LogEntry {
  timestamp: string;
  message: string;
}

interface Message {
  role: 'bot' | 'user';
  text: string;
}

interface MetricProps {
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
  bg: string;
}

interface ToolProps {
  label: string;
  icon: React.ElementType;
  onClick: () => void;
}

export default function AnalizisMasterEngine() {
  const [isEngineOn, setIsEngineOn] = useState(false);
  const [activeView, setActiveTab] = useState('Dashboard');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [aiInput, setAiInput] = useState(\"\");
  const [aiMessages, setAiMessages] = useState<Message[]>([
    { role: 'bot', text: 'Bienvenido, Jorge. El núcleo oscuro está activo. ¿Qué vamos a optimizar hoy?' }
  ]);
  const [load, setLoad] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTerminalLogs([
      \"--- NÚCLEO ANALIZIS DARK ELITE CARGADO ---\",
      \"Protocolos de seguridad cuántica activos.\",
      \"Esperando ignición del sistema...\"
    ]);
  }, []);

  const log = (msg: string) => {
    const time = new Date().toLocaleTimeString();
    setTerminalLogs(prev => [...prev.slice(-10), \[\] \\]);
  };

  const toggleEngine = () => {
    setIsEngineOn(!isEngineOn);
    if (!isEngineOn) {
      log(\"MOTOR ELITE: IGNICIÓN\".toUpperCase());
      setLoad(42.8);
    } else {
      log(\"Sistema en hibernación\");
      setLoad(0);
    }
  };

  const handleAiSend = () => {
    if (!aiInput) return;
    const userMsg = aiInput;
    setAiMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setAiInput(\"\");
    log(\IA CMD: \\);

    setTimeout(() => {
      setAiMessages(prev => [...prev, { role: 'bot', text: \Procesando \ en el clúster oscuro. Optimizando arquitectura y renderizado.\ }]);
    }, 1000);
  };

  if (!mounted) return <div className=\"min-h-screen bg-[#0A0A0B]\" />;

  return (
    <div className=\"min-h-screen bg-[#0A0A0B] text-[#E0E0E6] flex font-sans selection:bg-[#5E5CE6]/30\">

      <aside className=\"w-20 lg:w-72 bg-[#0F0F12] border-r border-white/10 flex flex-col p-6 h-screen sticky top-0 transition-all duration-500 z-50\">
        <div className=\"flex items-center gap-4 mb-16 lg:px-2\">
          <div className=\"w-12 h-12 bg-[#5E5CE6] rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(94,92,230,0.6)]\">
            <Cpu size={24} className=\"text-white\" />
          </div>
          <div className=\"hidden lg:block\">
            <h1 className=\"font-black uppercase tracking-tighter text-xl italic leading-none text-white\">ANALIZIS</h1>
            <p className=\"text-[8px] font-black text-blue-400 uppercase tracking-[0.4em] mt-1\">Elite Studio</p>
          </div>
        </div>

        <nav className=\"flex-1 space-y-2\">
          {['Dashboard', 'SaaS Apps', 'Blueprints', 'Security'].map((item) => (
            <button
              key={item}
              onClick={() => { setActiveTab(item); log(\Vista: \\); }}
              className={\w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-black uppercase italic text-[10px] tracking-widest transition-all \\}
            >
              <LayoutGrid size={16} />
              <span className=\"hidden lg:block\">\</span>
            </button>
          ))}
        </nav>

        <div className=\"mt-auto\">
          <button
            onClick={toggleEngine}
            className={\w-full p-6 rounded-[2.5rem] flex flex-col items-center gap-3 transition-all duration-500 border-2 \\}
          >
            <Power size={24} className={\} />
            <span className=\"hidden lg:block text-[9px] font-black uppercase italic text-white/50\">
              \
            </span>
          </button>
        </div>
      </aside>

      <main className=\"flex-1 flex flex-col h-screen overflow-hidden\">

        <header className=\"h-20 bg-[#0F0F12]/80 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-10 shrink-0 sticky top-0 z-40\">
          <div className=\"relative w-96\">
            <Search className=\"absolute left-4 top-1/2 -translate-y-1/2 text-white/20\" size={18} />
            <input
              type=\"text\"
              placeholder=\"Buscar en el núcleo oscuro...\"
              className=\"w-full bg-white/5 border border-white/10 focus:bg-white/10 focus:border-[#5E5CE6] rounded-2xl py-3 pl-12 pr-4 outline-none transition-all font-bold text-xs text-white placeholder:text-white/20\"
            />
          </div>

          <div className=\"flex items-center gap-6\">
            <div className=\"flex flex-col items-end\">
               <span className=\"text-[10px] font-black uppercase tracking-widest text-blue-400 italic\">System Status</span>
               <span className={\	ext-xs font-black \\}>
                 \
               </span>
            </div>
            <div className=\"w-10 h-10 bg-[#5E5CE6] text-white rounded-full flex items-center justify-center font-black italic shadow-lg shadow-[#5E5CE6]/20\">A</div>
          </div>
        </header>

        <div className=\"flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar\">

          <div className=\"grid grid-cols-1 md:grid-cols-4 gap-6\">
            <MetricCard label=\"Carga Core\" value={\\%\} icon={Gauge} color=\"text-blue-400\" bg=\"bg-blue-500/10\" />
            <MetricCard label=\"Uptime\" value=\"99.9%\" icon={Zap} color=\"text-yellow-400\" bg=\"bg-yellow-500/10\" />
            <MetricCard label=\"SaaS Nodes\" value=\"4\" icon={Activity} color=\"text-purple-400\" bg=\"bg-purple-500/10\" />
            <MetricCard label=\"Security\" value=\"High\" icon={Fingerprint} color=\"text-green-400\" bg=\"bg-green-500/10\" />
          </div>

          <div className=\"grid grid-cols-1 lg:grid-cols-12 gap-8\">

            <div className=\"lg:col-span-8 bg-[#111114] rounded-[3.5rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col relative h-[550px] backdrop-blur-xl\">
               <div className=\"p-8 border-b border-white/10 flex items-center justify-between bg-white/5\">
                  <div className=\"flex items-center gap-4\">
                    <div className=\"w-12 h-12 bg-[#5E5CE6] text-white rounded-2xl flex items-center justify-center shadow-lg\">
                      <Bot size={24} />
                    </div>
                    <div>
                      <h3 className=\"text-xl font-black uppercase italic tracking-tighter text-white\">Analizis AI Elite</h3>
                      <p className=\"text-[9px] font-bold text-white/40 uppercase tracking-widest\">Neural Engine Local</p>
                    </div>
                  </div>
                  <div className=\"flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 text-[8px] font-black text-green-400 uppercase italic\">
                    <div className=\"w-1.5 h-1.5 bg-green-400 rounded-full animate-ping\"></div>
                    Sincronizado
                  </div>
               </div>

               <div className=\"flex-1 p-8 flex flex-col bg-[#111114]\">
                  <div className=\"space-y-6 flex-1 overflow-y-auto pr-4 custom-scrollbar\">
                    {aiMessages.map((m, i) => (
                      <div key={i} className={\lex \\}>
                        <div className={\p-6 rounded-[2rem] max-w-[80%] text-xs font-bold leading-relaxed italic border \\}>
                          \
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className=\"mt-8 flex gap-4\">
                    <input
                      type=\"text\"
                      placeholder=\"Ingresa comando de arquitectura...\"
                      className=\"flex-1 bg-white/5 border border-white/10 rounded-2xl p-5 outline-none focus:border-[#5E5CE6] transition-all font-bold text-sm italic text-white placeholder:text-white/20\"
                      value={aiInput}
                      onChange={(e) => setAiInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAiSend()}
                    />
                    <button
                      onClick={handleAiSend}
                      className=\"w-16 bg-[#5E5CE6] text-white rounded-2xl flex items-center justify-center hover:bg-blue-600 transition-all shadow-xl active:scale-95\"
                    >
                      <MessageSquareText size={20} />
                    </button>
                  </div>
               </div>
            </div>

            <div className=\"lg:col-span-4 space-y-6 flex flex-col\">
               <div className=\"bg-[#111114] rounded-[3rem] border border-white/10 p-8 shadow-xl flex-1 backdrop-blur-xl\">
                  <h3 className=\"font-black uppercase italic tracking-tighter text-sm mb-6 flex items-center gap-2 text-white\">
                    <Command size={16} className=\"text-[#5E5CE6]\" /> Elite Toolbox
                  </h3>
                  <div className=\"space-y-3\">
                    <ToolAction label=\"Purga Sistema\" icon={Zap} onClick={() => log(\"Ejecutando purga_nucleo.sh...\")} />
                    <ToolAction label=\"Escaneo Seguridad\" icon={ShieldAlert} onClick={() => log(\"Iniciando auditoria_cuantica.py...\")} />
                    <ToolAction label=\"Forge Engine\" icon={Code2} onClick={() => log(\"Lanzando fabricacion_saas.exe...\")} />
                  </div>
               </div>

               <div className=\"h-64 bg-black rounded-[2.5rem] p-6 border border-white/10 shadow-2xl relative overflow-hidden font-mono\">
                  <div className=\"flex items-center justify-between mb-4 pb-4 border-b border-white/5\">
                    <span className=\"text-[8px] font-black text-white/30 uppercase tracking-[0.3em]\">System Logs</span>
                    <div className=\"flex gap-1\">
                      <div className=\"w-1.5 h-1.5 rounded-full bg-red-500/20\"></div>
                      <div className=\"w-1.5 h-1.5 rounded-full bg-green-500/20\"></div>
                    </div>
                  </div>
                  <div className=\"space-y-1 h-[140px] overflow-y-auto custom-scrollbar-dark\">
                    {terminalLogs.map((l, i) => (
                      <p key={i} className=\"text-[9px] text-white/40 font-medium\">
                        <span className=\"text-[#5E5CE6] mr-2\">➜</span> {l}
                      </p>
                    ))}
                    <div className=\"w-1.5 h-3 bg-white/20 animate-pulse inline-block ml-1\"></div>
                  </div>
               </div>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}

function MetricCard({ label, value, icon: Icon, color, bg }: MetricProps) {
  return (
    <div className=\"bg-[#111114] p-8 rounded-[2.5rem] border border-white/10 shadow-sm hover:shadow-[0_0_30px_-10px_rgba(94,92,230,0.3)] transition-all duration-500 group relative overflow-hidden backdrop-blur-xl\">
       <div className={\bsolute top-0 right-0 w-24 h-24 \ rounded-bl-[4rem] -mr-8 -mt-8 opacity-0 group-hover:opacity-100 transition-all duration-700\}></div>
       <div className={\\ \ w-12 h-12 rounded-2xl flex items-center justify-center mb-6 relative z-10 shadow-inner\}>
          <Icon size={20} />
       </div>
       <p className=\"text-[9px] font-black text-white/30 uppercase tracking-widest mb-1 relative z-10\">\</p>
       <p className=\"text-3xl font-black italic text-white leading-none relative z-10\">\</p>
    </div>
  );
}

function ToolAction({ label, icon: Icon, onClick }: ToolProps) {
  return (
    <button onClick={onClick} className=\"w-full flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-transparent hover:border-[#5E5CE6]/50 hover:bg-[#5E5CE6]/10 transition-all group\">
      <div className=\"flex items-center gap-3\">
        <Icon size={16} className=\"text-white/30 group-hover:text-[#5E5CE6]\" />
        <span className=\"text-[10px] font-black uppercase italic text-white/50 group-hover:text-white\">\</span>
      </div>
      <ChevronRight size={12} className=\"text-white/20 group-hover:translate-x-1 transition-transform\" />
    </button>
  );
}
