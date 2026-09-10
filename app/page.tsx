"use client";

import React, { useState, useEffect } from 'react';
import {
  Search,
  Crown,
  ChevronRight,
  LayoutGrid,
  Bell,
  Activity,
  ChevronDown
} from 'lucide-react';

export default function AnalizisSinglePageDashboard() {
  const [metrics, setMetrics] = useState({
    revenue: 52000,
    conversion: 3.5,
    renewals: 1200,
    subscribers: 650
  });
  const [activeSection, setActiveSection] = useState('Tablero');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [feedback, setFeedback] = useState('');

  const [teamMembers, setTeamMembers] = useState(['Rissa Pearson', 'Juan Gomez', 'Ana Lopez', 'Carlos Ruiz', 'Elena Sanz']);
  const filteredMembers = teamMembers.filter(name => name.toLowerCase().includes(searchTerm.toLowerCase()));

  const showFeedback = (message: string) => {
    setFeedback(message);
    window.setTimeout(() => setFeedback(''), 2500);
  };

  // Simular fluctuación de datos en tiempo real para no ser estáticos
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        revenue: prev.revenue + (Math.random() > 0.5 ? 10 : -10),
        conversion: +(prev.conversion + (Math.random() * 0.1 - 0.05)).toFixed(2),
        renewals: prev.renewals + (Math.random() > 0.8 ? 1 : Math.random() > 0.8 ? -1 : 0),
        subscribers: prev.subscribers + (Math.random() > 0.9 ? 1 : 0),
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetch('/api/dashboard')
      .then(response => response.ok ? response.json() : null)
      .then(data => {
        if (data?.members) {
          setTeamMembers(data.members.map((member: { name: string }) => member.name));
        }
      })
      .catch(() => showFeedback('Modo local: usando datos de demostración'));
  }, []);

  return (
    <div className="h-screen w-screen bg-[#0A0A0B] text-[#E0E0E6] flex font-sans overflow-hidden selection:bg-[#5E5CE6]/30">

      {/* SIDEBAR */}
      <aside className="w-64 bg-[#0F0F12] border-r border-white/10 flex flex-col p-4 h-full shrink-0 select-none">
        <div className="flex items-center gap-3 mb-5 px-1">
          <div className="w-8 h-8 bg-[#1E1E2A] rounded-xl border border-white/10 flex items-center justify-center font-black text-[#5E5CE6] text-xs italic">CP</div>
          <div>
            <h1 className="font-black uppercase tracking-tight text-xs text-white italic">CORE PANEL</h1>
            <p className="text-[7px] font-black text-white/40 uppercase tracking-[0.3em]">Analizis Studio</p>
          </div>
        </div>

        <nav className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-1">
          <div className="space-y-1">
            <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] px-2 mb-1">Menú</p>
            <button onClick={() => { setActiveSection('Tablero'); showFeedback('Tablero seleccionado'); }} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl font-bold text-[11px] uppercase italic bg-[#5E5CE6] text-white shadow-md">
              <LayoutGrid size={14} /> <span>Tablero</span>
            </button>
          </div>
          { [
            { label: 'Herramientas Admin', items: ['Productos', 'Clientes', 'Analíticas'] },
            { label: 'Perspectivas', items: ['Notificaciones', 'Mensajes', 'Ajustes'] },
            { label: 'Elementos', items: ['Componentes', 'Formularios', 'Tablas'] }
          ].map((group) => (
            <div key={group.label}>
              <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] px-2 mb-1">{group.label}</p>
              {group.items.map((item) => (
                <button key={item} onClick={() => { setActiveSection(item); showFeedback(`${item} seleccionado`); }} className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl font-bold text-[11px] uppercase italic transition-colors ${activeSection === item ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}>
                  <span>{item}</span>
                  <ChevronRight size={12} className="opacity-30" />
                </button>
              ))}
            </div>
          )) }
        </nav>

        <div className="bg-[#13131A] p-3 rounded-2xl border border-white/10 mt-2 shrink-0">
          <p className="text-[9px] font-black uppercase italic mb-0.5 text-white">Actualiza a Pro</p>
          <p className="text-[8px] text-white/40 mb-2 leading-tight">Lleva tu gestión al siguiente nivel.</p>
          <button onClick={() => showFeedback('La actualización Pro estará disponible pronto')} className="w-full bg-[#5E5CE6] hover:bg-blue-600 text-white rounded-xl py-2 font-black uppercase italic text-[9px] transition-all shadow-md flex items-center justify-center gap-1.5">
            <Crown size={12} /> Actualizar Ahora
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-hidden p-6 bg-[#0A0A0B]">
        <header className="flex justify-between items-center mb-5 shrink-0">
          <div className="relative w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" size={15} />
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Buscar miembros del equipo..."
              className="w-full bg-[#0F0F12] border border-white/10 rounded-xl py-2 pl-10 pr-4 outline-none font-bold text-xs text-white placeholder:text-white/40 shadow-inner"
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[9px] font-black uppercase text-white/50 bg-[#0F0F12] border border-white/10 px-2.5 py-1.5 rounded-lg">ES</span>
            <button onClick={() => showFeedback('Actividad sincronizada')} aria-label="Actualizar actividad" className="w-9 h-9 rounded-xl bg-[#0F0F12] border border-white/10 flex items-center justify-center text-white/60 hover:text-white"><Activity size={14} /></button>
            <div className="relative">
              <button onClick={() => setShowNotifications(value => !value)} aria-label="Abrir notificaciones" className="w-9 h-9 rounded-xl bg-[#0F0F12] border border-white/10 flex items-center justify-center text-white/60 hover:text-white"><Bell size={14} /></button>
              {showNotifications && <div className="absolute right-0 top-11 z-30 w-56 rounded-xl border border-white/10 bg-[#16161D] p-3 shadow-xl">
                <p className="text-[9px] font-black uppercase text-white">Notificaciones</p>
                <p className="mt-2 text-[10px] text-white/60">Tienes 3 reportes pendientes de revisión.</p>
              </div>}
            </div>
            <div className="w-9 h-9 rounded-xl bg-[#5E5CE6] text-white font-black flex items-center justify-center italic shadow-md text-xs">A</div>
          </div>
        </header>

        {activeSection === 'Tablero' ? <div className="flex-1 grid grid-cols-12 gap-4 overflow-hidden">
          <div className="col-span-9 flex flex-col gap-4 h-full overflow-hidden">
            <div className="grid grid-cols-4 gap-3 shrink-0">
              {[
                { title: 'INGRESOS TOTALES', val: `$${metrics.revenue.toLocaleString('en-US')}`, change: '+8.33%', pos: true },
                { title: 'TASA CONVERSIÓN', val: `${metrics.conversion}%`, change: '+16.67%', pos: true },
                { title: 'RENOVACIONES', val: metrics.renewals, change: '-4.35%', pos: false },
                { title: 'SUSCRIPTORES', val: metrics.subscribers, change: '+12%', pos: true },
              ].map((card, i) => (
                <div key={i} className="bg-[#0F0F12] p-3.5 rounded-2xl border border-white/10 shadow-md flex flex-col justify-between">
                  <p className="text-[8px] font-black text-white/40 uppercase tracking-widest truncate">{card.title}</p>
                  <div className="flex items-baseline justify-between mt-2">
                    <h3 className="text-base font-black italic text-white">{card.val}</h3>
                    <span className={`text-[8px] font-bold ${card.pos ? 'text-green-400' : 'text-red-400'}`}>{card.change}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex-1 bg-[#0F0F12] rounded-2xl border border-white/10 p-5 shadow-md flex flex-col justify-between relative overflow-hidden">
              <div className="flex items-center justify-between z-10">
                <h3 className="font-black uppercase italic tracking-tighter text-sm text-white">Pedidos</h3>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1 rounded-lg text-[9px] font-bold text-white/70">
                  <span>Semana Actual</span> <ChevronDown size={12} className="opacity-50" />
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-6 h-24 bg-gradient-to-t from-[#5E5CE6]/15 to-transparent flex items-end">
                <div className="absolute top-2 left-1/3 bg-[#1E1E2A] border border-white/10 px-2 py-0.5 rounded-lg text-[9px] font-black text-white shadow-xl flex items-center gap-1">
                  <div className="w-1 h-1 rounded-full bg-white animate-pulse"></div>
                  $27.256.390
                </div>
                <div className="w-full border-t border-[#5E5CE6]"></div>
              </div>
              <div className="flex justify-between text-[8px] font-black text-white/30 uppercase tracking-widest z-10 pt-2 border-t border-white/5">
                {['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul'].map(m => <span key={m}>{m}</span>)}
              </div>
            </div>
          </div>

          <div className="col-span-3 bg-[#0F0F12] rounded-2xl border border-white/10 p-4 shadow-md flex flex-col h-full overflow-hidden">
            <div className="flex items-center justify-between mb-3 shrink-0">
              <h3 className="font-black uppercase italic tracking-tighter text-xs text-white">Miembros Equipo</h3>
              <span className="text-[8px] font-bold text-white/50 bg-white/5 px-2 py-1 rounded-lg">Recientes</span>
            </div>
            <div className="space-y-2 flex-1 overflow-y-auto custom-scrollbar pr-1">
              {filteredMembers.map((name, i) => (
                <button key={name} onClick={() => showFeedback(`${name} seleccionado`)} className="w-full flex items-center justify-between py-1.5 border-b border-white/5 last:border-0 group cursor-pointer hover:bg-white/5 px-1 rounded-lg transition-colors text-left">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#1E1E2A] border border-white/10 flex items-center justify-center font-black text-[10px] text-blue-400 italic">
                      {name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-white italic leading-tight">{name}</p>
                      <p className="text-[7px] text-white/40 uppercase">Especialista</p>
                    </div>
                  </div>
                  <span className="text-[8px] font-bold text-white/30">{(i+1)*2}m</span>
                </button>
              ))}
              {filteredMembers.length === 0 && <p className="py-4 text-center text-[9px] text-white/40">Sin resultados</p>}
            </div>
            <div className="pt-2 border-t border-white/5 text-center shrink-0">
              <button onClick={() => showFeedback(`${filteredMembers.length} miembros visibles`)} className="text-[9px] font-black uppercase tracking-widest text-[#5E5CE6] hover:underline">Ver Detalles →</button>
            </div>
          </div>
        </div> : <section className="flex-1 overflow-y-auto rounded-2xl border border-white/10 bg-[#0F0F12] p-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-5">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#5E5CE6]">Módulo activo</p>
              <h2 className="mt-1 text-2xl font-black uppercase italic text-white">{activeSection}</h2>
            </div>
            <button onClick={() => showFeedback(`${activeSection} actualizado`)} className="rounded-xl bg-[#5E5CE6] px-4 py-2 text-[10px] font-black uppercase italic text-white hover:bg-blue-600">Actualizar</button>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-4">
            {[
              { label: 'Registros', value: activeSection === 'Clientes' ? '248' : '36' },
              { label: 'Activos', value: activeSection === 'Notificaciones' ? '3' : '94%' },
              { label: 'Última actualización', value: 'Ahora' },
            ].map(card => <div key={card.label} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-[9px] font-black uppercase tracking-widest text-white/40">{card.label}</p>
              <p className="mt-2 text-xl font-black italic text-white">{card.value}</p>
            </div>)}
          </div>
          <div className="mt-6 rounded-xl border border-white/10 bg-black/20 p-5">
            <h3 className="text-sm font-black uppercase italic text-white">Acciones de {activeSection}</h3>
            <p className="mt-2 text-xs text-white/50">Este módulo ya está conectado al menú y listo para recibir tus datos.</p>
            <button onClick={() => showFeedback(`Nueva acción en ${activeSection}`)} className="mt-5 rounded-xl border border-[#5E5CE6] px-4 py-2 text-[10px] font-black uppercase text-[#8b89ff] hover:bg-[#5E5CE6] hover:text-white">Crear nuevo registro</button>
          </div>
        </section>}
      </main>
      {feedback && <div className="fixed bottom-5 right-5 z-50 rounded-xl border border-white/10 bg-[#16161D] px-4 py-3 text-[10px] font-bold text-white shadow-xl">{feedback}</div>}
    </div>
  );
}