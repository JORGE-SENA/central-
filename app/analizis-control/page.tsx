\"use client\";

import React, { useState } from 'react';
import {
  Search,
  Zap,
  Crown,
  ChevronRight
} from 'lucide-react';

export default function AnalizisCorePanel() {
  const [activeTab, setActiveTab] = useState('Dashboard');

  return (
    <div className=\"min-h-screen bg-[#0A0A0B] text-[#E0E0E6] flex font-sans\">

      {/* SIDEBAR ELITE DARK */}
      <aside className=\"w-72 bg-[#0F0F12] border-r border-white/10 flex flex-col p-6 h-screen sticky top-0\">
        <div className=\"mb-12 px-2\">
          <div className=\"relative group cursor-pointer aspect-square bg-[#16161D] rounded-2xl border-2 border-white/10 overflow-hidden flex items-center justify-center shadow-lg\">
             <div className=\"absolute inset-0 bg-[#5E5CE6]/20 animate-pulse\"></div>
             <div className=\"text-6xl font-black italic text-[#5E5CE6] drop-shadow-[0_0_15px_rgba(94,92,230,0.8)] relative z-10\">A</div>
          </div>
          <div className=\"mt-4 text-center\">
            <h1 className=\"font-black uppercase tracking-tighter text-xl italic text-white\">CORE PANEL</h1>
            <p className=\"text-[8px] font-black text-blue-400 uppercase tracking-[0.4em]\">AnalizisEstudio Central</p>
          </div>
        </div>

        <nav className=\"flex-1 space-y-8\">
          <div className=\"px-2\">
            <p className=\"text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-4\">Gestión SaaS</p>
            <div className=\"space-y-1\">
              {['Dashboard', 'Aplicaciones', 'Clientes', 'Licencias'].map(item => (
                <button
                  key={item}
                  onClick={() => setActiveTab(item)}
                  className={\w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-all \\}
                >
                  <span className=\"uppercase italic\">\</span>
                  {activeTab === item && <ChevronRight size={14} />}
                </button>
              ))}
            </div>
          </div>
        </nav>

        <div className=\"bg-gradient-to-br from-[#16161D] to-[#1E1E2A] p-6 rounded-3xl border border-white/10 mt-auto relative overflow-hidden backdrop-blur-xl\">
          <div className=\"absolute -top-10 -right-10 w-24 h-24 bg-[#5E5CE6]/20 rounded-full blur-3xl\"></div>
          <p className=\"text-xs font-black uppercase italic mb-2 tracking-widest text-white relative z-10\">Analizis Cloud</p>
          <p className=\"text-[10px] text-white/40 mb-6 leading-tight relative z-10\">Control total de tus 4 aplicaciones activas.</p>
          <button className=\"w-full bg-[#5E5CE6] hover:bg-blue-600 text-white rounded-2xl py-4 font-black uppercase italic text-[10px] transition-all shadow-lg shadow-[#5E5CE6]/20 relative z-10\">
            Nueva Instancia
          </button>
        </div>
      </aside>

      <main className=\"flex-1 p-10 overflow-y-auto\">
        <header className=\"flex justify-between items-center mb-12\">
          <div className=\"relative w-96\">
            <Search className=\"absolute left-4 top-1/2 -translate-y-1/2 text-white/20\" size={18} />
            <input
              type=\"text\"
              placeholder=\"Buscar proyectos en la red Analizis...\"
              className=\"w-full bg-[#0F0F12] border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-[#5E5CE6] transition-all font-bold text-sm text-white placeholder:text-white/20\"
            />
          </div>
          <div className=\"flex gap-4\">
             <div className=\"bg-[#0F0F12] border border-white/10 px-6 py-2 rounded-xl flex items-center gap-3\">
                <div className=\"w-2 h-2 bg-green-400 rounded-full shadow-[0_0_10px_#22c55e] animate-pulse\"></div>
                <span className=\"text-[10px] font-black uppercase tracking-widest text-white/50\">Cerebro Online</span>
             </div>
          </div>
        </header>

        <div className=\"grid grid-cols-1 md:grid-cols-4 gap-6 mb-10\">
          {[
            { label: 'Revenue Global', val: '', color: 'text-green-400', bg: 'bg-green-400/10' },
            { label: 'Apps Activas', val: '4', color: 'text-blue-400', bg: 'bg-blue-400/10' },
            { label: 'Uptime', val: '99.9%', color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
            { label: 'Servidores', val: 'Estables', color: 'text-[#5E5CE6]', bg: 'bg-[#5E5CE6]/10' },
          ].map((s, i) => (
            <div key={i} className=\"bg-[#0F0F12] p-8 rounded-3xl border border-white/10 backdrop-blur-xl hover:border-[#5E5CE6]/50 transition-all group\">
              <p className=\"text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2\">\</p>
              <p className={\	ext-2xl font-black italic \\}>\</p>
            </div>
          ))}
        </div>

        <div className=\"bg-[#0F0F12] rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl backdrop-blur-xl\">
           <div className=\"p-8 border-b border-white/10 bg-white/5 flex justify-between items-center\">
              <h3 className=\"font-black uppercase italic tracking-tighter text-xl text-white\">Mis Aplicaciones Vendidas</h3>
              <Zap size={20} className=\"text-yellow-400\" />
           </div>

           <div className=\"p-0\">
              <table className=\"w-full text-left\">
                 <thead className=\"bg-black/40 text-[10px] font-black uppercase text-white/30 border-b border-white/10\">
                    <tr className=\"text-white/50\">
                       <th className=\"p-6\">Nombre de App</th>
                       <th className=\"p-6\">Dueño</th>
                       <th className=\"p-6\">Licencia</th>
                       <th className=\"p-6\">Estado</th>
                       <th className=\"p-6\"></th>
                    </tr>
                 </thead>
                 <tbody className=\"divide-y divide-white/5\">
                    {[
                      { name: 'Orígenes Kicks', owner: 'admin@origeneskicks.com', lic: 'OK-2026-PRO', status: 'ACTIVE' },
                      { name: 'GAVAC Ganadería', owner: 'jh-gavac@ejemplo.com', lic: 'GV-88-STA', status: 'ACTIVE' },
                      { name: 'Salud Premium', owner: 'dr-botero@ejemplo.com', lic: 'SP-22-ULT', status: 'ACTIVE' },
                      { name: 'FastAPI Nueva', owner: 'jorge@analizis.com', lic: 'FA-99-DEV', status: 'ACTIVE' },
                    ].map((app, idx) => (
                      <tr key={idx} className=\"hover:bg-white/[0.03] transition-all group\">
                        <td className=\"p-6 font-black uppercase italic text-blue-400 group-hover:text-blue-300 transition-colors\">\</td>
                        <td className=\"p-6 text-xs text-white/60 font-bold\">\</td>
                        <td className=\"p-6\"><span className=\"bg-white/5 px-3 py-1 rounded text-[9px] font-black text-white/70 border border-white/10\">\</span></td>
                        <td className=\"p-6\">
                           <span className=\"text-[9px] font-black px-3 py-1 rounded-full bg-green-400/10 text-green-400 border border-green-400/20 uppercase\">
                              \
                           </span>
                        </td>
                        <td className=\"p-6 text-right\">
                           <button className=\"text-[10px] font-black uppercase italic text-white/20 hover:text-red-500 transition-colors\">Kill-Switch</button>
                        </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>

      </main>
    </div>
  );
}
