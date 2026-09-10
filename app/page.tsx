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

type Product = {
  id: number;
  name: string;
  price: string | number;
  active: boolean;
};

type Client = { id: number; name: string; email: string; active: boolean };
type Notification = { id: number; title: string; message: string; read: boolean };

const offlineProducts: Product[] = [
  { id: 1, name: 'Plan Starter', price: 29, active: true },
  { id: 2, name: 'Plan Pro', price: 79, active: true },
  { id: 3, name: 'Plan Enterprise', price: 199, active: true },
];
const offlineClients: Client[] = [
  { id: 1, name: 'Orígenes Kicks', email: 'admin@origeneskicks.com', active: true },
  { id: 2, name: 'Central Commerce', email: 'admin@central.local', active: true },
];
const offlineNotifications: Notification[] = [
  { id: 1, title: 'Modo offline', message: 'La aplicación está usando datos locales.', read: false },
];

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
  const [products, setProducts] = useState<Product[]>([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showClientForm, setShowClientForm] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');

  const [teamMembers, setTeamMembers] = useState(['Rissa Pearson', 'Juan Gomez', 'Ana Lopez', 'Carlos Ruiz', 'Elena Sanz']);
  const filteredMembers = teamMembers.filter(name => name.toLowerCase().includes(searchTerm.toLowerCase()));

  const showFeedback = (message: string) => {
    setFeedback(message);
    window.setTimeout(() => setFeedback(''), 2500);
  };

  const refreshDashboard = async () => {
    try {
      const response = await fetch('/api/dashboard', { cache: 'no-store' });
      if (!response.ok) throw new Error('Dashboard unavailable');
      const data = await response.json();
      if (data.members) setTeamMembers(data.members.map((member: { name: string }) => member.name));
      if (data.products) setProducts(data.products);
      if (data.clients) setClients(data.clients);
      if (data.notifications) setNotifications(data.notifications);
      showFeedback('Datos sincronizados');
    } catch {
      setProducts(offlineProducts);
      setClients(offlineClients);
      setNotifications(offlineNotifications);
      showFeedback('Sin conexión: usando datos locales');
    }
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
    refreshDashboard();
  }, []);

  const createProduct = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let response: Response;
    try {
      response = await fetch('/api/dashboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: productName, price: productPrice }),
      });
    } catch {
      const localProduct = { id: Date.now(), name: productName.trim(), price: Number(productPrice), active: true };
      setProducts(current => [...current, localProduct]);
      setProductName('');
      setProductPrice('');
      setShowProductForm(false);
      showFeedback('Producto guardado localmente; sincroniza al volver la conexión');
      return;
    }
    const data = await response.json();
    if (!response.ok) {
      showFeedback(data.error || 'No se pudo crear el producto');
      return;
    }
    setProducts(current => [...current, data]);
    setProductName('');
    setProductPrice('');
    setShowProductForm(false);
    showFeedback('Producto creado correctamente');
  };

  const toggleProduct = async (product: Product) => {
    let response: Response;
    try {
      response = await fetch('/api/dashboard', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: product.id, active: !product.active }),
      });
    } catch {
      setProducts(current => current.map(item => item.id === product.id ? { ...item, active: !item.active } : item));
      showFeedback('Cambio guardado localmente; sincroniza al volver la conexión');
      return;
    }
    const data = await response.json();
    if (!response.ok) {
      showFeedback(data.error || 'No se pudo actualizar el producto');
      return;
    }
    setProducts(current => current.map(item => item.id === data.id ? data : item));
    showFeedback(data.active ? 'Producto activado' : 'Producto desactivado');
  };

  const createClient = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let response: Response;
    try {
      response = await fetch('/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: clientName, email: clientEmail }),
      });
    } catch {
      setClients(current => [...current, { id: Date.now(), name: clientName.trim(), email: clientEmail.trim(), active: true }]);
      setClientName('');
      setClientEmail('');
      setShowClientForm(false);
      showFeedback('Cliente guardado localmente; sincroniza al volver la conexión');
      return;
    }
    const data = await response.json();
    if (!response.ok) {
      showFeedback(data.error || 'No se pudo crear el cliente');
      return;
    }
    setClients(current => [...current, data]);
    setClientName('');
    setClientEmail('');
    setShowClientForm(false);
    showFeedback('Cliente creado correctamente');
  };

  const markNotificationRead = async (notification: Notification) => {
    let response: Response;
    try {
      response = await fetch('/api/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: notification.id }),
      });
    } catch {
      setNotifications(current => current.map(item => item.id === notification.id ? { ...item, read: true } : item));
      showFeedback('Notificación marcada localmente');
      return;
    }
    const data = await response.json();
    if (!response.ok) {
      showFeedback(data.error || 'No se pudo actualizar la notificación');
      return;
    }
    setNotifications(current => current.map(item => item.id === data.id ? data : item));
    showFeedback('Notificación marcada como leída');
  };

  return (
    <div className="min-h-screen w-full bg-[#0A0A0B] text-[#E0E0E6] flex flex-col md:flex-row font-sans overflow-auto md:h-screen md:overflow-hidden selection:bg-[#5E5CE6]/30">

      {/* SIDEBAR */}
      <aside className="w-full md:w-64 bg-[#0F0F12] border-b md:border-b-0 md:border-r border-white/10 flex flex-col p-4 md:h-full shrink-0 select-none">
        <div className="flex items-center gap-3 mb-5 px-1">
          <div className="w-8 h-8 bg-[#1E1E2A] rounded-xl border border-white/10 flex items-center justify-center font-black text-[#5E5CE6] text-xs italic">CP</div>
          <div>
            <h1 className="font-black uppercase tracking-tight text-xs text-white italic">CORE PANEL</h1>
            <p className="text-[7px] font-black text-white/40 uppercase tracking-[0.3em]">Analizis Studio</p>
          </div>
        </div>

        <nav className="flex-1 space-y-3 overflow-x-auto md:overflow-y-auto custom-scrollbar pr-1">
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

      <main className="flex-1 flex flex-col min-h-screen md:h-full overflow-visible md:overflow-hidden p-4 md:p-6 bg-[#0A0A0B]">
        <header className="flex flex-wrap gap-3 justify-between items-center mb-5 shrink-0">
          <div className="relative w-full sm:w-80">
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
            <button onClick={refreshDashboard} aria-label="Actualizar actividad" className="w-9 h-9 rounded-xl bg-[#0F0F12] border border-white/10 flex items-center justify-center text-white/60 hover:text-white"><Activity size={14} /></button>
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

        {activeSection === 'Tablero' ? <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-4 overflow-visible md:overflow-hidden">
          <div className="xl:col-span-9 flex flex-col gap-4 min-h-[520px] md:h-full overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 shrink-0">
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

          <div className="xl:col-span-3 bg-[#0F0F12] rounded-2xl border border-white/10 p-4 shadow-md flex flex-col min-h-[360px] md:h-full overflow-hidden">
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
        </div> : activeSection === 'Productos' ? <section className="flex-1 overflow-y-auto rounded-2xl border border-white/10 bg-[#0F0F12] p-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-5">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#5E5CE6]">Módulo activo</p>
              <h2 className="mt-1 text-2xl font-black uppercase italic text-white">Productos</h2>
            </div>
            <button onClick={() => setShowProductForm(value => !value)} className="rounded-xl bg-[#5E5CE6] px-4 py-2 text-[10px] font-black uppercase italic text-white hover:bg-blue-600">
              {showProductForm ? 'Cerrar' : 'Nuevo producto'}
            </button>
          </div>
          {showProductForm && <form onSubmit={createProduct} className="mt-5 grid grid-cols-1 sm:grid-cols-[1fr_160px_auto] items-end gap-3 rounded-xl border border-[#5E5CE6]/40 bg-[#5E5CE6]/5 p-4">
            <label className="text-[9px] font-black uppercase tracking-widest text-white/50">Nombre
              <input required value={productName} onChange={event => setProductName(event.target.value)} className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs text-white outline-none focus:border-[#5E5CE6]" placeholder="Ej. Plan Growth" />
            </label>
            <label className="text-[9px] font-black uppercase tracking-widest text-white/50">Precio
              <input required min="0" step="0.01" type="number" value={productPrice} onChange={event => setProductPrice(event.target.value)} className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs text-white outline-none focus:border-[#5E5CE6]" placeholder="99.00" />
            </label>
            <button type="submit" className="rounded-lg bg-white px-4 py-2 text-[10px] font-black uppercase text-black hover:bg-[#8b89ff]">Guardar</button>
          </form>}
          <div className="mt-5 overflow-hidden rounded-xl border border-white/10">
            <div className="grid grid-cols-[1fr_140px_120px] border-b border-white/10 bg-white/[0.03] px-4 py-3 text-[9px] font-black uppercase tracking-widest text-white/40"><span>Producto</span><span>Precio</span><span>Estado</span></div>
            {products.map(product => <div key={product.id} className="grid grid-cols-[1fr_140px_120px] items-center border-b border-white/5 px-4 py-3 last:border-0">
              <span className="text-xs font-bold text-white">{product.name}</span>
              <span className="text-xs text-white/60">${Number(product.price).toFixed(2)}</span>
              <button onClick={() => toggleProduct(product)} className={`w-fit rounded-full border px-2 py-1 text-[8px] font-black uppercase ${product.active ? 'border-green-400/30 text-green-400' : 'border-red-400/30 text-red-400'}`}>{product.active ? 'Activo' : 'Inactivo'}</button>
            </div>)}
            {products.length === 0 && <p className="p-6 text-center text-xs text-white/40">No hay productos todavía.</p>}
          </div>
        </section> : activeSection === 'Clientes' ? <section className="flex-1 overflow-y-auto rounded-2xl border border-white/10 bg-[#0F0F12] p-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-5">
            <div><p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#5E5CE6]">Módulo activo</p><h2 className="mt-1 text-2xl font-black uppercase italic text-white">Clientes</h2></div>
            <button onClick={() => setShowClientForm(value => !value)} className="rounded-xl bg-[#5E5CE6] px-4 py-2 text-[10px] font-black uppercase italic text-white hover:bg-blue-600">{showClientForm ? 'Cerrar' : 'Nuevo cliente'}</button>
          </div>
          {showClientForm && <form onSubmit={createClient} className="mt-5 grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] items-end gap-3 rounded-xl border border-[#5E5CE6]/40 bg-[#5E5CE6]/5 p-4">
            <label className="text-[9px] font-black uppercase tracking-widest text-white/50">Nombre<input required value={clientName} onChange={event => setClientName(event.target.value)} className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs text-white outline-none focus:border-[#5E5CE6]" placeholder="Nombre del cliente" /></label>
            <label className="text-[9px] font-black uppercase tracking-widest text-white/50">Correo<input required type="email" value={clientEmail} onChange={event => setClientEmail(event.target.value)} className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs text-white outline-none focus:border-[#5E5CE6]" placeholder="cliente@correo.com" /></label>
            <button type="submit" className="rounded-lg bg-white px-4 py-2 text-[10px] font-black uppercase text-black hover:bg-[#8b89ff]">Guardar</button>
          </form>}
          <div className="mt-5 space-y-2">{clients.map(client => <div key={client.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3"><div><p className="text-xs font-bold text-white">{client.name}</p><p className="text-[10px] text-white/50">{client.email}</p></div><span className="text-[8px] font-black uppercase text-green-400">{client.active ? 'Activo' : 'Inactivo'}</span></div>)}{clients.length === 0 && <p className="p-6 text-center text-xs text-white/40">No hay clientes todavía.</p>}</div>
        </section> : activeSection === 'Notificaciones' ? <section className="flex-1 overflow-y-auto rounded-2xl border border-white/10 bg-[#0F0F12] p-6">
          <div className="border-b border-white/10 pb-5"><p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#5E5CE6]">Centro de avisos</p><h2 className="mt-1 text-2xl font-black uppercase italic text-white">Notificaciones</h2></div>
          <div className="mt-5 space-y-2">{notifications.map(notification => <div key={notification.id} className={`flex items-center justify-between rounded-xl border p-4 ${notification.read ? 'border-white/5 opacity-50' : 'border-[#5E5CE6]/40 bg-[#5E5CE6]/5'}`}><div><p className="text-xs font-bold text-white">{notification.title}</p><p className="mt-1 text-[10px] text-white/60">{notification.message}</p></div>{!notification.read && <button onClick={() => markNotificationRead(notification)} className="rounded-lg border border-[#5E5CE6] px-3 py-2 text-[8px] font-black uppercase text-[#8b89ff]">Marcar leída</button>}</div>)}{notifications.length === 0 && <p className="p-6 text-center text-xs text-white/40">No hay notificaciones.</p>}</div>
        </section> : <section className="flex-1 overflow-y-auto rounded-2xl border border-white/10 bg-[#0F0F12] p-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-5">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#5E5CE6]">Módulo activo</p>
              <h2 className="mt-1 text-2xl font-black uppercase italic text-white">{activeSection}</h2>
            </div>
            <button onClick={refreshDashboard} className="rounded-xl bg-[#5E5CE6] px-4 py-2 text-[10px] font-black uppercase italic text-white hover:bg-blue-600">Actualizar</button>
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
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