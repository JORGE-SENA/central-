"use client";

import React from 'react';
import {
  Search,
  Crown,
  ChevronRight,
  LayoutGrid,
  Box,
  Users,
  BarChart3,
  Bell,
  MessageSquare,
  Settings,
  Layers,
  FileText,
  Table,
  Activity,
  ChevronDown
} from 'lucide-react';

export default function AnalizisSinglePageDashboard() {
  return (
    <div className="h-screen w-screen bg-[#0A0A0B] text-[#E0E0E6] flex font-sans overflow-hidden selection:bg-[#5E5CE6]/30">

      {/* SIDEBAR FIJO */}
      <aside className="w-64 bg-[#0F0F12] border-r border-white/10 flex flex-col p-4 h-full shrink-0 select-none">

        {/* LOGO */}
        <div className="flex items-center gap-3 mb-5 px-1">
          <div className="w-8 h-8 bg-[#1E1E2A] rounded-xl border border-white/10 flex items-center justify-center font-black text-[#5E5CE6] text-xs italic">
            CP
          </div>
          <div>
            <h1 className="font-black uppercase tracking-tight text-xs text-white italic">CORE PANEL</h1>
            <p className="text-[7px] font-black text-white/40 uppercase tracking-[0.3em]">Analizis Studio</p>
          </div>
        </div>

        {/* NAVEGACIÓN */}
        <nav className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-1">
          <div>
            <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] px-2 mb-1">Menú</p>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl font-bold text-[11px] uppercase italic bg-[#5E5CE6] text-white shadow-md">
              <LayoutGrid size={14} />
              <span>Dashboard</span>
            </button>
          </div>

          <div>
            <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] px-2 mb-1">Admin Tools</p>
            {['Products', 'Clients', 'Analytics'].map((item, idx) => (
              <div key={idx} className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl font-bold text-[11px] uppercase italic text-white/40 hover:text-white transition-colors cursor-pointer">
                <span>{item}</span>
                <ChevronRight size={12} className="opacity-30" />
              </div>
            ))}
          </div>

          <div>
            <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] px-2 mb-1">Insights</p>
            {['Notification', 'Message', 'Settings'].map((item, idx) => (
              <div key={idx} className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl font-bold text-[11px] uppercase italic text-white/40 hover:text-white transition-colors cursor-pointer">
                <span>{item}</span>
                <ChevronRight size={12} className="opacity-30" />
              </div>
            ))}
          </div>

          <div>
            <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] px-2 mb-1">Elements</p>
            {['Components', 'Forms', 'Tables'].map((item, idx) => (
              <div key={idx} className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl font-bold text-[11px] uppercase italic text-white/40 hover:text-white transition-colors cursor-pointer">
                <span>{item}</span>
                <ChevronRight size={12} className="opacity-30" />
              </div>
            ))}
          </div>
        </nav>

        {/* TARJETA PRO */}
        <div className="bg-[#13131A] p-3 rounded-2xl border border-white/10 mt-2 shrink-0">
          <p className="text-[9px] font-black uppercase italic mb-0.5 text-white">Let's Upgrade to Pro</p>
          <p className="text-[8px] text-white/40 mb-2 leading-tight">Lorem ipsum dolor sit amet.</p>
          <button className="w-full bg-[#5E5CE6] hover:bg-blue-600 text-white rounded-xl py-2 font-black uppercase italic text-[9px] transition-all shadow-md flex items-center justify-center gap-1.5">
            <Crown size={12} /> Upgrade Now
          </button>
        </div>
      </aside>

      {/* CONTENEDOR PRINCIPAL */}
      <main className="flex-1 flex flex-col h-full overflow-hidden p-6 bg-[#0A0A0B]">

        {/* HEADER */}
        <header className="flex justify-between items-center mb-5 shrink-0">
          <div className="relative w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" size={15} />
            <input
              type="text"
              placeholder="Hello Olivia, Welcome back!"
              className="w-full bg-[#0F0F12] border border-white/10 rounded-xl py-2 pl-10 pr-4 outline-none font-bold text-xs text-white placeholder:text-white/40 shadow-inner"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[9px] font-black uppercase text-white/50 bg-[#0F0F12] border border-white/10 px-2.5 py-1.5 rounded-lg">EN</span>
            <div className="w-9 h-9 rounded-xl bg-[#0F0F12] border border-white/10 flex items-center justify-center text-white/60">
              <Activity size={14} />
            </div>
            <div className="w-9 h-9 rounded-xl bg-[#0F0F12] border border-white/10 flex items-center justify-center text-white/60">
              <Bell size={14} />
            </div>
            <div className="w-9 h-9 rounded-xl bg-[#5E5CE6] text-white font-black flex items-center justify-center italic shadow-md text-xs">
              A
            </div>
          </div>
        </header>

        {/* GRID PRINCIPAL DE UNA SOLA VISTA */}
        <div className="flex-1 grid grid-cols-12 gap-4 overflow-hidden">

          {/* COLUMNA IZQUIERDA (MÉTRICAS + GRÁFICA) */}
          <div className="col-span-9 flex flex-col gap-4 h-full overflow-hidden">

            {/* 4 TARJETAS EN UNA SOLA FILA HORIZONTAL PERFECTA */}
            <div className="grid grid-cols-4 gap-3 shrink-0">
              {[
                { title: 'TOTAL REVENUE', val: '$52,000', change: '+8.33%', pos: true },
                { title: 'CONVERSION RATE', val: '3.5%', change: '+16.67%', pos: true },
                { title: 'RENEWALS', val: '1,200', change: '-4.35%', pos: false },
                { title: 'SUBSCRIBERS', val: '650', change: '+12%', pos: true },
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

            {/* GRÁFICA DE ORDEN INFERIOR */}
            <div className="flex-1 bg-[#0F0F12] rounded-2xl border border-white/10 p-5 shadow-md flex flex-col justify-between relative overflow-hidden">
              <div className="flex items-center justify-between z-10">
                <h3 className="font-black uppercase italic tracking-tighter text-sm text-white">Order</h3>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1 rounded-lg text-[9px] font-bold text-white/70">
                  <span>Current Week</span>
                  <ChevronDown size={12} className="opacity-50" />
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
                <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span>
              </div>
            </div>

          </div>

          {/* COLUMNA DERECHA (EQUIPO) */}
          <div className="col-span-3 bg-[#0F0F12] rounded-2xl border border-white/10 p-4 shadow-md flex flex-col h-full overflow-hidden">
            <div className="flex items-center justify-between mb-3 shrink-0">
              <h3 className="font-black uppercase italic tracking-tighter text-xs text-white">Team Member</h3>
              <span className="text-[8px] font-bold text-white/50 bg-white/5 px-2 py-1 rounded-lg">Recent</span>
            </div>

            <div className="space-y-2 flex-1 overflow-y-auto custom-scrollbar pr-1">
              {[1, 2, 3, 4, 5].map((_, i) => (
                <div key={i} className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#1E1E2A] border border-white/10 flex items-center justify-center font-black text-[10px] text-blue-400 italic">
                      RP
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-white italic leading-tight">Rissa Pearson</p>
                      <p className="text-[7px] text-white/40 uppercase">UI Designer</p>
                    </div>
                  </div>
                  <span className="text-[8px] font-bold text-white/30">2m</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-white/5 text-center shrink-0">
              <span className="text-[9px] font-black uppercase tracking-widest text-[#5E5CE6] cursor-pointer hover:underline">
                See Details →
              </span>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}