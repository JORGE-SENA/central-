"use client";

import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  Users,
  BarChart3,
  Bell,
  Mail,
  Settings,
  Search,
  Plus,
  MoreHorizontal,
  ArrowUpRight,
  TrendingUp,
  Activity,
  Zap,
  Crown
} from 'lucide-react';

// Estilo CORE PANEL - AnalizisEstudio Master
export default function AnalizisCorePanel() {
  const [activeTab, setActiveTab] = useState('Dashboard');

  return (
    <div className="min-h-screen bg-[#0F0F12] text-[#E0E0E6] flex font-sans">

      {/* 1. SIDEBAR - EL CORAZÓN DE ANALIZISESTUDIO */}
      <aside className="w-72 bg-[#16161D] border-r border-white/5 flex flex-col p-6 h-screen sticky top-0">
        <div className="mb-12 px-2">
          <div className="relative group cursor-pointer aspect-square bg-[#1a1a24] rounded-2xl border-2 border-white/5 overflow-hidden flex items-center justify-center">
             <div className="absolute inset-0 bg-[#5E5CE6]/10 animate-pulse"></div>
             <div className="text-6xl font-black italic text-[#5E5CE6] drop-shadow-[0_0_20px_rgba(94,92,230,0.8)]">A</div>
          </div>
          <div className="mt-4 text-center">
            <h1 className="font-black uppercase tracking-tighter text-xl italic text-white">CORE PANEL</h1>
            <p className="text-[8px] font-black text-blue-500 uppercase tracking-[0.4em]">AnalizisEstudio Central</p>
          </div>
        </div>

        <nav className="flex-1 space-y-8">
          <div>
            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-4 px-2">Gestión SaaS</p>
            <div className="space-y-1">
              {['Dashboard', 'Aplicaciones', 'Clientes', 'Licencias'].map(item => (
                <button
                  key={item}
                  onClick={() => setActiveTab(item)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                    activeTab === item ? 'bg-[#5E5CE6] text-white shadow-[0_0_20px_rgba(94,92,230,0.3)]' : 'text-white/40 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="uppercase italic">{item}</span>
                </button>
              ))}
            </div>
          </div>
        </nav>

        <div className="bg-gradient-to-br from-[#1E1E2A] to-[#252538] p-6 rounded-3xl border border-white/5 mt-auto relative overflow-hidden">
          <p className="text-xs font-black uppercase italic mb-2 tracking-widest text-white">Analizis Cloud</p>
          <p className="text-[10px] text-white/40 mb-6 leading-tight">Control total de tus 4 aplicaciones activas.</p>
          <button className="w-full bg-[#5E5CE6] hover:bg-[#706EE6] text-white rounded-2xl py-4 font-black uppercase italic text-[10px]">
            Nueva Instancia
          </button>
        </div>
      </aside>

      {/* 2. CONTENIDO MAESTRO */}
      <main className="flex-1 p-10 overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
          <div className="relative w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
            <input
              type="text"
              placeholder="Buscar proyectos en la red Analizis..."
              className="w-full bg-[#16161D] border border-white/5 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-[#5E5CE6] transition-all font-bold text-sm"
            />
          </div>
          <div className="flex gap-4">
             <div className="bg-[#16161D] border border-white/5 px-6 py-2 rounded-xl flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_10px_#22c55e]"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Cerebro Online</span>
             </div>
          </div>
        </header>

        {/* METRICS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Revenue Global', val: '$0', color: 'text-[#4CD964]' },
            { label: 'Apps Activas', val: '4', color: 'text-blue-400' },
            { label: 'Uptime', val: '99.9%', color: 'text-cyan-400' },
            { label: 'Servidores', val: 'Estables', color: 'text-[#5E5CE6]' },
          ].map((s, i) => (
            <div key={i} className="bg-[#16161D] p-8 rounded-3xl border border-white/5">
              <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mb-2">{s.label}</p>
              <p className={`text-2xl font-black italic ${s.color}`}>{s.val}</p>
            </div>
          ))}
        </div>

        {/* PROYECTOS ACTIVOS */}
        <div className="bg-[#16161D] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
           <div className="p-8 border-b border-white/5 bg-white/5 flex justify-between items-center">
              <h3 className="font-black uppercase italic tracking-tighter text-xl">Mis Aplicaciones Vendidas</h3>
              <Zap size={20} className="text-yellow-400" />
           </div>

           <div className="p-0">
              <table className="w-full text-left">
                 <thead className="bg-[#0F0F12] text-[10px] font-black uppercase text-white/20 border-b border-white/5">
                    <tr>
                       <th className="p-6">Nombre de App</th>
                       <th className="p-6">Dueño</th>
                       <th className="p-6">Licencia</th>
                       <th className="p-6">Estado</th>
                       <th className="p-6"></th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                    {[
                      { name: 'Orígenes Kicks', owner: 'admin@origeneskicks.com', lic: 'OK-2026-PRO', status: 'ACTIVE' },
                      { name: 'GAVAC Ganadería', owner: 'jh-gavac@ejemplo.com', lic: 'GV-88-STA', status: 'ACTIVE' },
                      { name: 'Salud Premium', owner: 'dr-botero@ejemplo.com', lic: 'SP-22-ULT', status: 'ACTIVE' },
                      { name: 'FastAPI Nueva', owner: 'jorge@analizis.com', lic: 'FA-99-DEV', status: 'ACTIVE' },
                    ].map((app, idx) => (
                      <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-6 font-black uppercase italic text-blue-400">{app.name}</td>
                        <td className="p-6 text-xs text-white/60 font-bold">{app.owner}</td>
                        <td className="p-6"><span className="bg-white/5 px-3 py-1 rounded text-[9px] font-black">{app.lic}</span></td>
                        <td className="p-6">
                           <span className="text-[9px] font-black px-3 py-1 rounded-full bg-green-500/10 text-green-500 border border-green-500/20 uppercase">
                              {app.status}
                           </span>
                        </td>
                        <td className="p-6 text-right">
                           <button className="text-[10px] font-black uppercase italic text-white/20 hover:text-red-500 transition-colors">Kill-Switch</button>
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
