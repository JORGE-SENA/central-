"use client";

import React, { useState, useMemo } from 'react';
import {
  Search,
  Zap,
  Crown,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

const INITIAL_APPS = [
  { id: 1, name: 'Orígenes Kicks', owner: 'admin@origeneskicks.com', lic: 'OK-2026-PRO', status: 'ACTIVE' },
  { id: 2, name: 'GAVAC Ganadería', owner: 'jh-gavac@ejemplo.com', lic: 'GV-88-STA', status: 'ACTIVE' },
  { id: 3, name: 'Salud Premium', owner: 'dr-botero@ejemplo.com', lic: 'SP-22-ULT', status: 'ACTIVE' },
  { id: 4, name: 'FastAPI Nueva', owner: 'jorge@analizis.com', lic: 'FA-99-DEV', status: 'ACTIVE' },
];

export default function AnalizisCorePanel() {
  const [activeTab, setActiveTab] = useState('Tablero');
  const [searchTerm, setSearchTerm] = useState('');
  const [apps, setApps] = useState(INITIAL_APPS);

  const filteredApps = useMemo(() => {
    return apps.filter(app => 
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      app.owner.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [apps, searchTerm]);

  const handleKillSwitch = (id) => {
    setApps(prev => prev.map(app => 
      app.id === id ? { ...app, status: app.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE' } : app
    ));
  };

  const activeAppsCount = apps.filter(app => app.status === 'ACTIVE').length;

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#E0E0E6] flex font-sans">
      <aside className="w-72 bg-[#0F0F12] border-r border-white/10 flex flex-col p-6 h-screen sticky top-0">
        <div className="mb-12 px-2">
          <div className="relative group cursor-pointer aspect-square bg-[#16161D] rounded-2xl border-2 border-white/10 overflow-hidden flex items-center justify-center shadow-lg">
            <div className="absolute inset-0 bg-[#5E5CE6]/20 animate-pulse"></div>
            <div className="text-6xl font-black italic text-[#5E5CE6] drop-shadow-[0_0_15px_rgba(94,92,230,0.8)] relative z-10">A</div>
          </div>
          <div className="mt-4 text-center">
            <h1 className="font-black uppercase tracking-tighter text-xl italic text-white">CORE PANEL</h1>
            <p className="text-[8px] font-black text-blue-400 uppercase tracking-[0.4em]">AnalizisEstudio Central</p>
          </div>
        </div>
        <nav className="flex-1 space-y-8">
          <div className="px-2">
            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-4">Gestión SaaS</p>
            <div className="space-y-1">
              {['Tablero', 'Aplicaciones', 'Clientes', 'Licencias'].map(item => (
                <button
                  key={item}
                  onClick={() => setActiveTab(item)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md font-semibold text-xs transition-all ${activeTab === item ? 'bg-[#5E5CE6] text-white shadow-sm' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}
                >
                  <span className="uppercase">{item}</span>
                  {activeTab === item && <ChevronRight size={12} />}
                </button>
              ))}
            </div>
          </div>
        </nav>
        <div className="bg-[#16161D] p-4 rounded-md border border-white/10 mt-auto relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#5E5CE6]/20 rounded-full blur-3xl"></div>
          <p className="text-xs font-black uppercase italic mb-2 tracking-widest text-white relative z-10">Analizis Cloud</p>
          <p className="text-[10px] text-white/40 mb-6 leading-tight relative z-10">Control total de tus {apps.length} aplicaciones.</p>
          <button className="w-full bg-[#5E5CE6] hover:bg-blue-600 text-white rounded-md py-2 font-bold uppercase text-[9px] transition-all shadow-sm relative z-10">
            Nueva Instancia
          </button>
        </div>
      </aside>

      <main className="flex-1 p-10 overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
          <div className="relative w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar proyectos en la red Analizis..."
              className="w-full bg-[#0F0F12] border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-[#5E5CE6] transition-all font-bold text-sm text-white placeholder:text-white/20"
            />
          </div>
          <div className="flex gap-4">
            <div className="bg-[#0F0F12] border border-white/10 px-6 py-2 rounded-xl flex items-center gap-3">
              <div className="w-2 h-2 bg-green-400 rounded-full shadow-[0_0_10px_#22c55e] animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Cerebro Online</span>
            </div>
          </div>
        </header>

        {activeTab === 'Tablero' ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
              {[
                { label: 'Ingresos Globales', val: '$12,450', color: 'text-green-400' },
                { label: 'Apps Activas', val: activeAppsCount, color: 'text-blue-400' },
                { label: 'Tiempo Actividad', val: '99.9%', color: 'text-cyan-400' },
                { label: 'Servidores', val: 'Estables', color: 'text-[#5E5CE6]' },
              ].map((s, i) => (
                <div key={i} className="bg-[#0F0F12] p-8 rounded-3xl border border-white/10 backdrop-blur-xl hover:border-[#5E5CE6]/50 transition-all group">
                  <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2">{s.label}</p>
                  <p className={`text-2xl font-black italic ${s.color}`}>{s.val}</p>
                </div>
              ))}
            </div>
            <div className="bg-[#0F0F12] rounded-md border border-white/10 overflow-hidden shadow-sm backdrop-blur-xl">
              <div className="p-8 border-b border-white/10 bg-white/5 flex justify-between items-center">
                <h3 className="font-bold uppercase tracking-tight text-sm text-white">Mis Aplicaciones Vendidas</h3>
                <Zap size={20} className="text-yellow-400" />
              </div>
              <div className="p-0">
                <table className="w-full text-left">
                  <thead className="bg-black/40 text-[10px] font-black uppercase text-white/30 border-b border-white/10">
                    <tr className="text-white/50">
                      <th className="p-6">Nombre de App</th>
                      <th className="p-6">Propietario</th>
                      <th className="p-6">Licencia</th>
                      <th className="p-6">Estado</th>
                      <th className="p-6">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredApps.length > 0 ? filteredApps.map((app) => (
                      <tr key={app.id} className="hover:bg-white/[0.03] transition-all group">
                        <td className="p-6 font-bold uppercase text-blue-400 group-hover:text-blue-300 transition-colors">{app.name}</td>
                        <td className="p-6 text-xs text-white/60 font-medium">{app.owner}</td>
                        <td className="p-6"><span className="bg-white/5 px-3 py-1 rounded text-[9px] font-bold text-white/70 border border-white/10">{app.lic}</span></td>
                        <td className="p-6">
                          <span className={`text-[9px] font-bold px-3 py-1 rounded-full border uppercase ${app.status === 'ACTIVE' ? 'bg-green-400/10 text-green-400 border-green-400/20' : 'bg-red-400/10 text-red-400 border-red-400/20'}`}>
                            {app.status === 'ACTIVE' ? 'ACTIVA' : 'DESACTIVADA'}
                          </span>
                        </td>
                        <td className="p-6 text-right">
                          <button 
                            onClick={() => handleKillSwitch(app.id)}
                            className={`text-[9px] font-bold uppercase px-2 py-1 rounded border transition-all ${app.status === 'ACTIVE' ? 'border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white' : 'border-green-500/30 text-green-400 hover:bg-green-500 hover:text-white'}`}
                          >
                            {app.status === 'ACTIVE' ? 'Apagar Forzado' : 'Reactivar'}
                          </button>
                        </td>
                      </tr>
                    )) : (
                        <tr><td colSpan={5} className="p-10 text-center text-white/30 italic">No se encontraron resultados.</td></tr>                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-white/20 flex-col gap-4">
            <AlertCircle size={48} />
            <p className="font-bold uppercase tracking-widest">Módulo {activeTab} en Desarrollo</p>
            <button onClick={() => setActiveTab('Tablero')} className="text-blue-400 underline text-xs">Volver al Tablero</button>
          </div>
        )}
      </main>
    </div>
  );
}