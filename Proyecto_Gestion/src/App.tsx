import { useState, useMemo, useCallback, useEffect } from "react";
import {
  projects as initialProjects, evaluators as initialEvaluators, issues as initialIssues,
  audits as initialAudits, deliveries as initialDeliveries,
  securityEvents as initialSecurityEvents, userRoles as initialUserRoles,
  type Project, type Evaluator, type Issue, type Audit,
  type Delivery, type SecurityEvent, type UserRole,
  Status,
  Priority,
} from "./data";
import { Modal } from "./components/Modal";

/* ─── Types ─── */
type View = "dashboard" | "projects" | "evaluators" | "solvers" | "auditors" | "deliveries" | "security";

/* ─── Palette helpers ─── */
const STATUS_CLS: Record<string, string> = {
  "En progreso": "text-blue-400 bg-blue-500/10 border-blue-500/25",
  "Revisión": "text-amber-400 bg-amber-500/10 border-amber-500/25",
  "Completado": "text-emerald-400 bg-emerald-500/10 border-emerald-500/25",
  "Pendiente": "text-slate-400 bg-slate-500/10 border-slate-500/25",
  "Bloqueado": "text-red-400 bg-red-500/10 border-red-500/25",
  "Aprobado": "text-emerald-400 bg-emerald-500/10 border-emerald-500/25",
  "Observado": "text-amber-400 bg-amber-500/10 border-amber-500/25",
  "Rechazado": "text-red-400 bg-red-500/10 border-red-500/25",
  "Entregado": "text-cyan-400 bg-cyan-500/10 border-cyan-500/25",
  "Cerrado": "text-slate-500 bg-slate-600/10 border-slate-600/25",
};

const PRIORITY_CLS: Record<string, string> = {
  "Crítica": "text-red-400",
  "Alta": "text-orange-400",
  "Media": "text-amber-400",
  "Baja": "text-slate-400",
};

const SEV_CLS: Record<string, string> = {
  "Crítico": "text-red-400 bg-red-500/10 border-red-500/25",
  "Alerta": "text-orange-400 bg-orange-500/10 border-orange-500/25",
  "Aviso": "text-amber-400 bg-amber-500/10 border-amber-500/25",
  "Info": "text-slate-400 bg-slate-500/10 border-slate-500/25",
};

const RESULT_CLS: Record<string, string> = {
  "Exitoso": "text-emerald-400",
  "Fallido": "text-red-400",
  "Denegado": "text-orange-400",
  "Aviso": "text-amber-400",
};

/* ─── Primitives ─── */
function Badge({ label, cls }: { label: string; cls: string }) {
  return (
    <span className={`inline-flex items-center px-1.5 py-px rounded text-[10px] font-mono font-medium uppercase tracking-wider border ${cls}`}>
      {label}
    </span>
  );
}

function PriorityBadge({ p }: { p: string }) {
  const dots: Record<string, string> = { "Crítica": "bg-red-500", "Alta": "bg-orange-400", "Media": "bg-amber-400", "Baja": "bg-slate-500" };
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-mono ${PRIORITY_CLS[p] ?? "text-slate-400"}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dots[p] ?? "bg-slate-500"}`} />
      {p}
    </span>
  );
}

function Bar({ v, max = 100 }: { v: number; max?: number }) {
  const pct = Math.min(100, Math.round((v / max) * 100));
  const col = pct === 100 ? "bg-emerald-500" : pct >= 70 ? "bg-blue-500" : pct >= 40 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="flex items-center gap-2 min-w-[90px]">
      <div className="flex-1 h-1 bg-[#1c2f47] rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${col} transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[10px] font-mono text-slate-500 w-7 text-right">{pct}%</span>
    </div>
  );
}

function Th({ children, onClick, sorted }: { children: React.ReactNode; onClick?: () => void; sorted?: "asc" | "desc" | null }) {
  return (
    <th
      className={`px-3 py-2.5 text-left text-[9px] font-mono font-semibold text-slate-600 uppercase tracking-widest whitespace-nowrap border-b border-[#1c2f47] select-none ${onClick ? "cursor-pointer hover:text-slate-400 transition-colors" : ""}`}
      onClick={onClick}
    >
      <span className="flex items-center gap-1">
        {children}
        {onClick && (
          <span className={`${sorted ? "text-blue-400" : "text-slate-700"}`}>
            {sorted === "asc" ? "↑" : sorted === "desc" ? "↓" : "↕"}
          </span>
        )}
      </span>
    </th>
  );
}

function Td({ children, mono, center }: { children: React.ReactNode; mono?: boolean; center?: boolean }) {
  return (
    <td className={`px-3 py-2.5 text-[12px] ${mono ? "font-mono" : ""} ${center ? "text-center" : ""}`}>
      {children}
    </td>
  );
}

/* ─── Search + Filter bar ─── */
function SearchBar({ value, onChange, placeholder, extra }: { value: string; onChange: (v: string) => void; placeholder?: string; extra?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <div className="relative flex-1 min-w-44">
        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-600 text-xs pointer-events-none">⌕</span>
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder ?? "Buscar…"}
          className="w-full bg-[#111d2e] border border-[#1c2f47] rounded pl-7 pr-3 py-1.5 text-xs font-mono text-slate-300 placeholder-slate-600 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
        />
      </div>
      {extra}
    </div>
  );
}

/* ─── Pagination ─── */
const PAGE_SIZES = [10, 20, 50];
function usePagination<T>(data: T[], pageSize = 10) {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(pageSize);
  const total = data.length;
  const pages = Math.max(1, Math.ceil(total / size));
  const safePage = Math.min(page, pages);
  const slice = data.slice((safePage - 1) * size, safePage * size);

  const reset = useCallback(() => setPage(1), []);

  return { page: safePage, pages, size, setPage, setSize: (s: number) => { setSize(s); setPage(1); }, slice, total, reset };
}

function Pagination({ page, pages, size, setPage, setSize, total }: ReturnType<typeof usePagination>) {
  if (total === 0) return null;
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-3 py-2 border-t border-[#1c2f47] text-[10px] font-mono text-slate-500">
      <span>{total} registros · página {page}/{pages}</span>
      <div className="flex items-center gap-2">
        <span>Filas:</span>
        <select
          value={size}
          onChange={e => setSize(Number(e.target.value))}
          className="bg-[#111d2e] border border-[#1c2f47] rounded px-1.5 py-0.5 text-slate-400 outline-none focus:border-blue-500/50"
        >
          {PAGE_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <button onClick={() => setPage(1)} disabled={page === 1} className="px-1.5 py-0.5 rounded border border-[#1c2f47] disabled:opacity-30 hover:border-blue-500/40 hover:text-slate-300 transition-colors">«</button>
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-1.5 py-0.5 rounded border border-[#1c2f47] disabled:opacity-30 hover:border-blue-500/40 hover:text-slate-300 transition-colors">‹</button>
        <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages} className="px-1.5 py-0.5 rounded border border-[#1c2f47] disabled:opacity-30 hover:border-blue-500/40 hover:text-slate-300 transition-colors">›</button>
        <button onClick={() => setPage(pages)} disabled={page === pages} className="px-1.5 py-0.5 rounded border border-[#1c2f47] disabled:opacity-30 hover:border-blue-500/40 hover:text-slate-300 transition-colors">»</button>
      </div>
    </div>
  );
}

/* ─── Panel shell ─── */
function Panel({ title, count, children, toolbar }: { title: string; count?: number; children: React.ReactNode; toolbar?: React.ReactNode }) {
  return (
    <div className="glass rounded-lg overflow-hidden flex flex-col">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-[#1c2f47]">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">{title}</span>
          {count !== undefined && (
            <span className="text-[10px] font-mono text-slate-600 bg-[#1c2f47] px-2 py-0.5 rounded-full">{count}</span>
          )}
        </div>
        {toolbar}
      </div>
      {children}
    </div>
  );
}

/* ─── KPI card ─── */
function KPI({ label, value, sub, color, icon, trend }: { label: string; value: string; sub: string; color: string; icon: string; trend?: string }) {
  return (
    <div className="glass rounded-lg p-4 flex flex-col gap-2 hover:border-[rgba(255,255,255,0.12)] transition-all min-w-[140px]">
      <div className="flex items-center justify-between">
        <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest leading-tight">{label}</span>
        <span className={`text-sm ${color} opacity-60`}>{icon}</span>
      </div>
      <div className={`text-2xl font-bold tracking-tight ${color}`}>{value}</div>
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-slate-600 truncate mr-2">{sub}</span>
        {trend && <span className="text-[10px] font-mono text-emerald-500 flex-shrink-0">{trend}</span>}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
  VIEWS
══════════════════════════════════════════ */

/* ─── Dashboard ─── */
function DashboardView({
  projects, issues, deliveries, securityEvents, evaluators, audits, userRoles
}: {
  projects: Project[], issues: Issue[], deliveries: Delivery[],
  securityEvents: SecurityEvent[], evaluators: Evaluator[],
  audits: Audit[], userRoles: UserRole[]
}) {
  const active = projects.filter(p => !["Completado", "Cerrado"].includes(p.status)).length;
  const critical = issues.filter(i => i.priority === "Crítica" && i.status !== "Completado").length;
  const overdue = deliveries.filter(d => d.status === "Pendiente" && d.deadline < "2026-09-08").length;
  const secAlerts = securityEvents.filter(e => ["Crítico", "Alerta"].includes(e.severity)).length;

  const recentEvents = securityEvents.slice(0, 8);
  const topIssues = issues.filter(i => ["Crítica", "Alta"].includes(i.priority) && i.status !== "Completado").slice(0, 6);

  return (
    <div className="space-y-5">
      {/* KPI row - Responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <KPI label="Proyectos Activos" value={String(active)} sub={`${projects.length} en portafolio`} color="text-blue-400" icon="◈" trend="+2 este mes" />
        <KPI label="Incidencias Críticas" value={String(critical)} sub={`${issues.filter(i => i.status !== "Completado").length} abiertas total`} color="text-red-400" icon="⚑" />
        <KPI label="Entregables Vencidos" value={String(overdue)} sub="Requieren atención inmediata" color="text-amber-400" icon="◫" />
        <KPI label="Alertas Seguridad" value={String(secAlerts)} sub="Últimas 72 horas" color="text-purple-400" icon="⊕" />
      </div>

      {/* Progress + Security - Responsive grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Project progress */}
        <div className="lg:col-span-2 glass rounded-lg overflow-hidden">
          <div className="px-4 py-2.5 border-b border-[#1c2f47] flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Progreso del Portafolio</span>
            <span className="text-[10px] font-mono text-slate-600">{projects.length} proyectos</span>
          </div>
          <div className="divide-y divide-[#111d2e]">
            {projects.slice(0, 12).map(p => (
              <div key={p.id} className="flex items-center gap-3 px-4 py-2 hover:bg-[#111d2e]/60 transition-colors group">
                <span className="text-[10px] font-mono text-slate-600 w-16 flex-shrink-0">{p.id}</span>
                <span className="text-xs text-slate-300 flex-1 min-w-0 truncate group-hover:text-slate-100 transition-colors">{p.name}</span>
                <Bar v={p.progress} />
                <Badge label={p.status} cls={STATUS_CLS[p.status] ?? ""} />
              </div>
            ))}
          </div>
        </div>

        {/* Security feed */}
        <div className="glass rounded-lg overflow-hidden flex flex-col">
          <div className="px-4 py-2.5 border-b border-[#1c2f47] flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Feed Seguridad</span>
            <span className="relative flex w-2 h-2 mr-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
          <div className="flex-1 divide-y divide-[#111d2e] overflow-y-auto max-h-80">
            {recentEvents.map(e => (
              <div key={e.id} className="px-3 py-2 hover:bg-[#111d2e]/60 transition-colors">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <Badge label={e.severity} cls={SEV_CLS[e.severity] ?? ""} />
                  <span className={`text-[9px] font-mono ${RESULT_CLS[e.result] ?? "text-slate-400"}`}>{e.result}</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-tight">{e.action} · {e.module}</p>
                <p className="text-[10px] font-mono text-slate-600 mt-0.5 truncate">{e.user}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Critical issues + Stats - Responsive grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass rounded-lg overflow-hidden">
          <div className="px-4 py-2.5 border-b border-[#1c2f47]">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Issues Críticos y Altos</span>
          </div>
          <div className="divide-y divide-[#111d2e]">
            {topIssues.map(i => (
              <div key={i.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#111d2e]/60 transition-colors">
                <PriorityBadge p={i.priority} />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-slate-300 truncate">{i.issue}</p>
                  <p className="text-[10px] font-mono text-slate-600">{i.id} · {i.project} · {i.assignee}</p>
                </div>
                <Badge label={i.status} cls={STATUS_CLS[i.status] ?? ""} />
              </div>
            ))}
          </div>
        </div>

        {/* Quick stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 content-start">
          {[
            { l: "Presupuesto total", v: "$7.5M+", s: "24 contratos activos" },
            { l: "Evaluadores activos", v: `${evaluators.filter(e => e.status === "En progreso").length}`, s: `${evaluators.length} asignados total` },
            { l: "Auditorías aprobadas", v: `${audits.filter(a => a.status === "Aprobado").length}/${audits.length}`, s: "Conformidad del portafolio" },
            { l: "Entregables completados", v: `${deliveries.filter(d => d.status === "Entregado").length}/${deliveries.length}`, s: "Hitos del portafolio" },
            { l: "Usuarios activos", v: `${userRoles.filter(u => u.status === "Activo").length}`, s: `${userRoles.filter(u => u.mfa).length} con MFA habilitado` },
            { l: "Regiones cubiertas", v: "12", s: "Nacional + departamental" },
          ].map(s => (
            <div key={s.l} className="glass rounded-lg px-3 py-3 hover:border-[rgba(255,255,255,0.1)] transition-all">
              <div className="text-[9px] font-mono text-slate-600 uppercase tracking-widest mb-1">{s.l}</div>
              <div className="text-lg font-bold text-slate-100">{s.v}</div>
              <div className="text-[10px] text-slate-600 mt-0.5">{s.s}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Projects View ─── */
function ProjectsView({ projects, setProjects }: { projects: Project[]; setProjects: React.Dispatch<React.SetStateAction<Project[]>> }) {
  const [q, setQ] = useState("");
  const [statusF, setStatusF] = useState("Todos");
  const [priorityF, setPriorityF] = useState("Todos");
  const [sortCol, setSortCol] = useState<keyof Project | null>("id");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [form, setForm] = useState<Partial<Project>>({});

  const statuses = ["Todos", ...Array.from(new Set(projects.map(p => p.status)))];
  const priorities = ["Todos", "Crítica", "Alta", "Media", "Baja"];

  const handleSort = (col: keyof Project) => {
    if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("asc"); }
  };

  const filtered = useMemo(() => {
    let d = projects.filter(p => {
      const match = [p.id, p.name, p.client, p.lead, p.sector, p.region, p.contract].join(" ").toLowerCase().includes(q.toLowerCase());
      const st = statusF === "Todos" || p.status === statusF;
      const pr = priorityF === "Todos" || p.priority === priorityF;
      return match && st && pr;
    });
    if (sortCol) {
      d = [...d].sort((a, b) => {
        const av = a[sortCol] ?? ""; const bv = b[sortCol] ?? "";
        return sortDir === "asc" ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
      });
    }
    return d;
  }, [q, statusF, priorityF, sortCol, sortDir, projects]);

  const pg = usePagination(filtered, 10);

  const s = (col: keyof Project) => sortCol === col ? sortDir : null;

  const openCreate = () => {
    setEditingProject(null);
    setForm({ id: `PRJ-${String(projects.length + 1).padStart(3, '0')}`, status: "Pendiente", priority: "Media", progress: 0 });
    setIsModalOpen(true);
  };

  const openEdit = (p: Project) => {
    setEditingProject(p);
    setForm(p);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.client) {
      alert("Por favor, complete los campos obligatorios: Nombre y Cliente.");
      return;
    }
    if (editingProject) {
      setProjects(prev => prev.map(p => p.id === editingProject.id ? { ...p, ...form } as Project : p));
    } else {
      setProjects(prev => [...prev, form as Project]);
    }
    setIsModalOpen(false);
  };

  return (
    <>
      <Panel
        title="Proyectos"
        count={filtered.length}
        toolbar={
          <div className="flex flex-wrap gap-3 items-center">
            <SearchBar value={q} onChange={v => { setQ(v); pg.reset(); }} placeholder="Buscar proyecto, cliente, contrato…" extra={
              <div className="flex gap-2">
                <Select value={statusF} onChange={setStatusF} options={statuses} />
                <Select value={priorityF} onChange={setPriorityF} options={priorities} />
              </div>
            } />
            <button
              onClick={openCreate}
              className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded text-[11px] font-mono transition-all flex items-center gap-2 border border-blue-400/30"
            >
              <span>+</span> Nuevo Proyecto
            </button>
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <Th onClick={() => handleSort("id")} sorted={s("id")}>ID</Th>
                <Th onClick={() => handleSort("name")} sorted={s("name")}>Proyecto</Th>
                <Th onClick={() => handleSort("client")} sorted={s("client")}>Cliente</Th>
                <Th onClick={() => handleSort("sector")} sorted={s("sector")}>Sector</Th>
                <Th onClick={() => handleSort("lead")} sorted={s("lead")}>Líder</Th>
                <Th>Equipo</Th>
                <Th onClick={() => handleSort("budget")} sorted={s("budget")}>Presupuesto</Th>
                <Th onClick={() => handleSort("deadline")} sorted={s("deadline")}>Vencimiento</Th>
                <Th onClick={() => handleSort("priority")} sorted={s("priority")}>Prioridad</Th>
                <Th onClick={() => handleSort("progress")} sorted={s("progress")}>Progreso</Th>
                <Th onClick={() => handleSort("status")} sorted={s("status")}>Estado</Th>
                <Th>Acciones</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#111d2e]">
              {pg.slice.map(p => (
                <tr key={p.id} className="trow transition-colors">
                  <Td mono><span className="text-slate-600">{p.id}</span></Td>
                  <Td><span className="text-slate-200 font-medium">{p.name}</span></Td>
                  <Td><span className="text-slate-400">{p.client}</span></Td>
                  <Td mono><span className="text-[10px] text-slate-500 bg-[#1c2f47] px-1.5 py-0.5 rounded">{p.sector}</span></Td>
                  <Td><span className="text-slate-400">{p.lead}</span></Td>
                  <Td mono center><span className="text-slate-500">{p.team}</span></Td>
                  <Td mono><span className="text-slate-300">{p.budget}</span></Td>
                  <Td mono><span className="text-slate-500">{p.deadline}</span></Td>
                  <Td><PriorityBadge p={p.priority} /></Td>
                  <Td><Bar v={p.progress} /></Td>
                  <Td><Badge label={p.status} cls={STATUS_CLS[p.status] ?? ""} /></Td>
                  <Td center>
                    <div className="flex items-center gap-2 justify-center">
                      <button onClick={() => openEdit(p)} className="text-slate-600 hover:text-blue-400 transition-colors text-xs font-mono" title="Editar">✎</button>
                      <button
                        onClick={() => { if (confirm(`¿Eliminar ${p.id}?`)) setProjects(prev => prev.filter(x => x.id !== p.id)) }}
                        className="text-slate-600 hover:text-red-400 transition-colors text-xs font-mono"
                        title="Eliminar"
                      >
                        🗑
                      </button>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination {...pg} />
      </Panel>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProject ? "Editar Proyecto" : "Nuevo Proyecto"}
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-slate-600 uppercase">Nombre</span>
            <input
              className="bg-[#111d2e] border border-[#1c2f47] rounded px-2 py-1.5 text-xs text-slate-300 outline-none focus:border-blue-500"
              value={form.name || ""}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-slate-600 uppercase">Cliente</span>
            <input
              className="bg-[#111d2e] border border-[#1c2f47] rounded px-2 py-1.5 text-xs text-slate-300 outline-none focus:border-blue-500"
              value={form.client || ""}
              onChange={e => setForm({ ...form, client: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-slate-600 uppercase">Estado</span>
            <select
              className="bg-[#111d2e] border border-[#1c2f47] rounded px-2 py-1.5 text-xs text-slate-300 outline-none focus:border-blue-500"
              value={form.status || "Pendiente"}
              onChange={e => setForm({ ...form, status: e.target.value as Status})}
            >
              <option value="Pendiente">Pendiente</option>
              <option value="En progreso">En progreso</option>
              <option value="Revisión">Revisión</option>
              <option value="Completado">Completado</option>
              <option value="Bloqueado">Bloqueado</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-slate-600 uppercase">Progreso (%)</span>
            <input
              type="number"
              className="bg-[#111d2e] border border-[#1c2f47] rounded px-2 py-1.5 text-xs text-slate-300 outline-none focus:border-blue-500"
              value={form.progress || 0}
              onChange={e => setForm({ ...form, progress: Number(e.target.value) })}
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={() => setIsModalOpen(false)} className="px-3 py-1.5 text-xs font-mono text-slate-500 hover:text-slate-300 transition-colors">Cancelar</button>
          <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded text-xs font-mono transition-all border border-blue-400/30">Guardar Cambios</button>
        </div>
      </Modal>
    </>
  );
}

/* ─── Evaluators View ─── */
function EvaluatorsView({ evaluators, setEvaluators }: { evaluators: Evaluator[], setEvaluators: React.Dispatch<React.SetStateAction<Evaluator[]>> }) {
  const [q, setQ] = useState("");
  const [statusF, setStatusF] = useState("Todos");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEval, setEditingEval] = useState<Evaluator | null>(null);
  const [form, setForm] = useState<Partial<Evaluator>>({});

  const statuses = ["Todos", ...Array.from(new Set(evaluators.map(e => e.status)))];

  const filtered = useMemo(() => evaluators.filter(e => {
    const match = [e.id, e.name, e.specialty, e.project, e.methodology].join(" ").toLowerCase().includes(q.toLowerCase());
    const st = statusF === "Todos" || e.status === statusF;
    return match && st;
  }), [q, statusF, evaluators]);

  const pg = usePagination(filtered, 10);

  const stats = [
    { l: "Aprobadas", v: evaluators.filter(e => e.status === "Aprobado").length, c: "text-emerald-400" },
    { l: "En proceso", v: evaluators.filter(e => e.status === "En progreso").length, c: "text-blue-400" },
    { l: "En revisión", v: evaluators.filter(e => e.status === "Revisión").length, c: "text-amber-400" },
    { l: "Pendientes", v: evaluators.filter(e => e.status === "Pendiente").length, c: "text-slate-400" },
    { l: "Hallazgos críticos", v: evaluators.reduce((s, e) => s + e.criticalFindings, 0), c: "text-red-400" },
    { l: "Puntaje promedio", v: Math.round(evaluators.filter(e => e.score !== null).reduce((s, e) => s + (e.score ?? 0), 0) / evaluators.filter(e => e.score !== null).length) || "—", c: "text-blue-400" },
  ];

  const openCreate = () => {
    setEditingEval(null);
    setForm({ id: `EVA-${String(evaluators.length + 1).padStart(3, '0')}`, status: "Pendiente", findings: 0, criticalFindings: 0 });
    setIsModalOpen(true);
  };

  const openEdit = (e: Evaluator) => {
    setEditingEval(e);
    setForm(e);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.specialty) {
      alert("Por favor, complete los campos obligatorios: Nombre y Especialidad.");
      return;
    }
    if (editingEval) {
      setEvaluators(prev => prev.map(ev => ev.id === editingEval.id ? { ...ev, ...form } as Evaluator : ev));
    } else {
      setEvaluators(prev => [...prev, form as Evaluator]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
        {stats.map(s => (
          <div key={s.l} className="glass rounded-lg px-3 py-2.5">
            <div className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">{s.l}</div>
            <div className={`text-xl font-bold mt-0.5 ${s.c}`}>{s.v}</div>
          </div>
        ))}
      </div>
      <Panel
        title="Evaluadores"
        count={filtered.length}
        toolbar={
          <div className="flex flex-wrap gap-3 items-center">
            <SearchBar value={q} onChange={v => { setQ(v); pg.reset(); }} placeholder="Nombre, especialidad, proyecto…" extra={
              <Select value={statusF} onChange={setStatusF} options={statuses} />
            } />
            <button
              onClick={openCreate}
              className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded text-[11px] font-mono transition-all flex items-center gap-2 border border-blue-400/30"
            >
              <span>+</span> Nuevo Evaluador
            </button>
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <Th>ID</Th><Th>Evaluador</Th><Th>Especialidad</Th><Th>Proyecto</Th>
                <Th>Metodología</Th><Th>Asignado</Th><Th>Vencimiento</Th>
                <Th>Hallazgos</Th><Th>Críticos</Th><Th>Puntaje</Th><Th>Estado</Th><Th>Acciones</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#111d2e]">
              {pg.slice.map(e => (
                <tr key={e.id} className="trow transition-colors">
                  <Td mono><span className="text-slate-600">{e.id}</span></Td>
                  <Td><span className="text-slate-200 font-medium">{e.name}</span></Td>
                  <Td><span className="text-slate-400">{e.specialty}</span></Td>
                  <Td mono><span className="text-blue-400">{e.project}</span></Td>
                  <Td mono><span className="text-[10px] text-slate-500">{e.methodology}</span></Td>
                  <Td mono><span className="text-slate-600">{e.assigned}</span></Td>
                  <Td mono><span className="text-slate-500">{e.deadline}</span></Td>
                  <Td mono center>
                    <span className={e.findings > 0 ? "text-amber-400" : "text-slate-700"}>{e.findings || "—"}</span>
                  </Td>
                  <Td mono center>
                    <span className={e.criticalFindings > 0 ? "text-red-400 font-semibold" : "text-slate-700"}>{e.criticalFindings || "—"}</span>
                  </Td>
                  <Td mono center>
                    {e.score !== null
                      ? <span className={`font-semibold ${e.score >= 90 ? "text-emerald-400" : e.score >= 75 ? "text-amber-400" : "text-red-400"}`}>{e.score}</span>
                      : <span className="text-slate-700">—</span>}
                  </Td>
                  <Td><Badge label={e.status} cls={STATUS_CLS[e.status] ?? ""} /></Td>
                  <Td center>
                    <div className="flex items-center gap-2 justify-center">
                      <button onClick={() => openEdit(e)} className="text-slate-600 hover:text-blue-400 transition-colors text-xs font-mono">✎</button>
                      <button
                        onClick={() => { if (confirm(`¿Eliminar evaluador ${e.id}?`)) setEvaluators(prev => prev.filter(x => x.id !== e.id)) }}
                        className="text-slate-600 hover:text-red-400 transition-colors text-xs font-mono"
                      >
                        🗑
                      </button>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination {...pg} />
      </Panel>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEval ? "Editar Evaluador" : "Nuevo Evaluador"}
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-slate-600 uppercase">Nombre Completo</span>
            <input
              className="bg-[#111d2e] border border-[#1c2f47] rounded px-2 py-1.5 text-xs text-slate-300 outline-none focus:border-blue-500"
              value={form.name || ""}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-slate-600 uppercase">Especialidad</span>
            <input
              className="bg-[#111d2e] border border-[#1c2f47] rounded px-2 py-1.5 text-xs text-slate-300 outline-none focus:border-blue-500"
              value={form.specialty || ""}
              onChange={e => setForm({ ...form, specialty: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-slate-600 uppercase">Proyecto ID</span>
            <input
              className="bg-[#111d2e] border border-[#1c2f47] rounded px-2 py-1.5 text-xs text-slate-300 outline-none focus:border-blue-500"
              value={form.project || ""}
              onChange={e => setForm({ ...form, project: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-slate-600 uppercase">Estado</span>
            <select
              className="bg-[#111d2e] border border-[#1c2f47] rounded px-2 py-1.5 text-xs text-slate-300 outline-none focus:border-blue-500"
              value={form.status || "Pendiente"}
              onChange={e => setForm({ ...form, status: e.target.value as Status })}
            >
              <option value="Pendiente">Pendiente</option>
              <option value="En progreso">En progreso</option>
              <option value="Revisión">Revisión</option>
              <option value="Aprobado">Aprobado</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-slate-600 uppercase">Puntaje (0-100)</span>
            <input
              type="number"
              className="bg-[#111d2e] border border-[#1c2f47] rounded px-2 py-1.5 text-xs text-slate-300 outline-none focus:border-blue-500"
              value={form.score || ""}
              onChange={e => setForm({ ...form, score: Number(e.target.value) })}
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-slate-600 uppercase">Hallazgos</span>
            <input
              type="number"
              className="bg-[#111d2e] border border-[#1c2f47] rounded px-2 py-1.5 text-xs text-slate-300 outline-none focus:border-blue-500"
              value={form.findings || 0}
              onChange={e => setForm({ ...form, findings: Number(e.target.value) })}
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={() => setIsModalOpen(false)} className="px-3 py-1.5 text-xs font-mono text-slate-500 hover:text-slate-300 transition-colors">Cancelar</button>
          <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded text-xs font-mono transition-all border border-blue-400/30">Guardar Datos</button>
        </div>
      </Modal>
    </div>
  );
}

/* ─── Issues / Solvers View ─── */
function SolversView({ issues, setIssues }: { issues: Issue[], setIssues: React.Dispatch<React.SetStateAction<Issue[]>> }) {
  const [q, setQ] = useState("");
  const [statusF, setStatusF] = useState("Todos");
  const [priorityF, setPriorityF] = useState("Todos");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);
  const [form, setForm] = useState<Partial<Issue>>({});

  const statuses = ["Todos", ...Array.from(new Set(issues.map(i => i.status)))];
  const priorities = ["Todos", "Crítica", "Alta", "Media", "Baja"];

  const filtered = useMemo(() => issues.filter(i => {
    const match = [i.id, i.issue, i.project, i.assignee, i.category, i.module].join(" ").toLowerCase().includes(q.toLowerCase());
    const st = statusF === "Todos" || i.status === statusF;
    const pr = priorityF === "Todos" || i.priority === priorityF;
    return match && st && pr;
  }), [q, statusF, priorityF, issues]);

  const pg = usePagination(filtered, 10);

  const counts = [
    { l: "Críticas", v: issues.filter(i => i.priority === "Crítica" && i.status !== "Completado").length, c: "text-red-400" },
    { l: "Altas", v: issues.filter(i => i.priority === "Alta" && i.status !== "Completado").length, c: "text-orange-400" },
    { l: "Bloqueadas", v: issues.filter(i => i.status === "Bloqueado").length, c: "text-red-300" },
    { l: "En Revisión", v: issues.filter(i => i.status === "Revisión").length, c: "text-amber-400" },
    { l: "En Progreso", v: issues.filter(i => i.status === "En progreso").length, c: "text-blue-400" },
    { l: "Resueltas", v: issues.filter(i => i.status === "Completado").length, c: "text-emerald-400" },
  ];

  const openCreate = () => {
    setEditingIssue(null);
    setForm({ id: `SOL-${String(issues.length + 1).padStart(3, '0')}`, status: "Pendiente", priority: "Media", impact: "Medio" });
    setIsModalOpen(true);
  };

  const openEdit = (i: Issue) => {
    setEditingIssue(i);
    setForm(i);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!form.issue || !form.project) {
      alert("Por favor, complete los campos obligatorios: Descripción de la Incidencia y Proyecto ID.");
      return;
    }
    if (editingIssue) {
      setIssues(prev => prev.map(iss => iss.id === editingIssue.id ? { ...iss, ...form } as Issue : iss));
    } else {
      setIssues(prev => [...prev, form as Issue]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
        {counts.map(s => (
          <div key={s.l} className="glass rounded-lg px-3 py-2.5">
            <div className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">{s.l}</div>
            <div className={`text-xl font-bold mt-0.5 ${s.c}`}>{s.v}</div>
          </div>
        ))}
      </div>
      <Panel
        title="Incidencias / Solucionadores"
        count={filtered.length}
        toolbar={
          <div className="flex flex-wrap gap-3 items-center">
            <SearchBar value={q} onChange={v => { setQ(v); pg.reset(); }} placeholder="Incidencia, proyecto, asignado, categoría…" extra={
              <div className="flex gap-2">
                <Select value={statusF} onChange={setStatusF} options={statuses} />
                <Select value={priorityF} onChange={setPriorityF} options={priorities} />
              </div>
            } />
            <button
              onClick={openCreate}
              className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded text-[11px] font-mono transition-all flex items-center gap-2 border border-blue-400/30"
            >
              <span>+</span> Nueva Incidencia
            </button>
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <Th>ID</Th><Th>Incidencia</Th><Th>Proyecto</Th><Th>Módulo</Th>
                <Th>Categoría</Th><Th>Asignado</Th><Th>Apertura</Th>
                <Th>Estimado</Th><Th>Impacto</Th><Th>Prioridad</Th><Th>Estado</Th><Th>Acciones</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#111d2e]">
              {pg.slice.map(i => (
                <tr key={i.id} className="trow transition-colors">
                  <Td mono><span className="text-slate-600">{i.id}</span></Td>
                  <Td><span className="text-slate-200 text-[11px] leading-tight">{i.issue}</span></Td>
                  <Td mono><span className="text-blue-400">{i.project}</span></Td>
                  <Td><span className="text-slate-500 text-[11px]">{i.module}</span></Td>
                  <Td mono><span className="text-[10px] text-slate-500 bg-[#1c2f47] px-1.5 py-0.5 rounded">{i.category}</span></Td>
                  <Td><span className="text-slate-400 text-[11px]">{i.assignee}</span></Td>
                  <Td mono><span className="text-slate-600">{i.opened}</span></Td>
                  <Td mono center><span className="text-slate-400">{i.estimated}</span></Td>
                  <Td>
                    <span className={`text-[10px] font-mono ${i.impact === "Crítico" ? "text-red-400" : i.impact === "Alto" ? "text-orange-400" : i.impact === "Medio" ? "text-amber-400" : "text-slate-500"}`}>
                      {i.impact}
                    </span>
                  </Td>
                  <Td><PriorityBadge p={i.priority} /></Td>
                  <Td><Badge label={i.status} cls={STATUS_CLS[i.status] ?? ""} /></Td>
                  <Td center>
                    <div className="flex items-center gap-2 justify-center">
                      <button onClick={() => openEdit(i)} className="text-slate-600 hover:text-blue-400 transition-colors text-xs font-mono">✎</button>
                      <button
                        onClick={() => { if (confirm(`¿Eliminar incidencia ${i.id}?`)) setIssues(prev => prev.filter(x => x.id !== i.id)) }}
                        className="text-slate-600 hover:text-red-400 transition-colors text-xs font-mono"
                      >
                        🗑
                      </button>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination {...pg} />
      </Panel>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingIssue ? "Editar Incidencia" : "Nueva Incidencia"}
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1 col-span-2">
            <span className="text-[10px] font-mono text-slate-600 uppercase">Descripción de la Incidencia</span>
            <textarea
              className="bg-[#111d2e] border border-[#1c2f47] rounded px-2 py-1.5 text-xs text-slate-300 outline-none focus:border-blue-500 h-20"
              value={form.issue || ""}
              onChange={e => setForm({ ...form, issue: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-slate-600 uppercase">Proyecto ID</span>
            <input
              className="bg-[#111d2e] border border-[#1c2f47] rounded px-2 py-1.5 text-xs text-slate-300 outline-none focus:border-blue-500"
              value={form.project || ""}
              onChange={e => setForm({ ...form, project: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-slate-600 uppercase">Módulo</span>
            <input
              className="bg-[#111d2e] border border-[#1c2f47] rounded px-2 py-1.5 text-xs text-slate-300 outline-none focus:border-blue-500"
              value={form.module || ""}
              onChange={e => setForm({ ...form, module: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-slate-600 uppercase">Prioridad</span>
            <select
              className="bg-[#111d2e] border border-[#1c2f47] rounded px-2 py-1.5 text-xs text-slate-300 outline-none focus:border-blue-500"
              value={form.priority || "Media"}
              onChange={e => setForm({ ...form, priority: e.target.value as Priority})}
            >
              <option value="Crítica">Crítica</option>
              <option value="Alta">Alta</option>
              <option value="Media">Media</option>
              <option value="Baja">Baja</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-slate-600 uppercase">Estado</span>
            <select
              className="bg-[#111d2e] border border-[#1c2f47] rounded px-2 py-1.5 text-xs text-slate-300 outline-none focus:border-blue-500"
              value={form.status || "Pendiente"}
              onChange={e => setForm({ ...form, status: e.target.value as Status })}
            >
              <option value="Pendiente">Pendiente</option>
              <option value="En progreso">En progreso</option>
              <option value="Revisión">Revisión</option>
              <option value="Completado">Completado</option>
              <option value="Bloqueado">Bloqueado</option>
            </select>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={() => setIsModalOpen(false)} className="px-3 py-1.5 text-xs font-mono text-slate-500 hover:text-slate-300 transition-colors">Cancelar</button>
          <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded text-xs font-mono transition-all border border-blue-400/30">Guardar Incidencia</button>
        </div>
      </Modal>
    </div>
  );
}

/* ─── Auditors View ─── */
function AuditorsView({ audits, setAudits }: { audits: Audit[], setAudits: React.Dispatch<React.SetStateAction<Audit[]>> }) {
  const [q, setQ] = useState("");
  const [statusF, setStatusF] = useState("Todos");
  const [typeF, setTypeF] = useState("Todos");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAudit, setEditingAudit] = useState<Audit | null>(null);
  const [form, setForm] = useState<Partial<Audit>>({});

  const statuses = ["Todos", ...Array.from(new Set(audits.map(a => a.status)))];
  const types = ["Todos", ...Array.from(new Set(audits.map(a => a.type)))];

  const filtered = useMemo(() => audits.filter(a => {
    const match = [a.id, a.auditor, a.project, a.type, a.scope].join(" ").toLowerCase().includes(q.toLowerCase());
    const st = statusF === "Todos" || a.status === statusF;
    const tp = typeF === "Todos" || a.type === typeF;
    return match && st && tp;
  }), [q, statusF, typeF, audits]);

  const pg = usePagination(filtered, 10);

  const riskCls: Record<string, string> = {
    "Crítico": "text-red-400", "Alto": "text-orange-400", "Medio": "text-amber-400", "Bajo": "text-emerald-400", "—": "text-slate-700"
  };

  const stats = [
    { l: "Aprobadas", v: audits.filter(a => a.status === "Aprobado").length, c: "text-emerald-400" },
    { l: "Observadas", v: audits.filter(a => a.status === "Observado").length, c: "text-amber-400" },
    { l: "En proceso", v: audits.filter(a => a.status === "En progreso").length, c: "text-blue-400" },
    { l: "Programadas", v: audits.filter(a => a.status === "Pendiente").length, c: "text-slate-400" },
    { l: "Obs. críticas", v: audits.reduce((s, a) => s + a.criticalObs, 0), c: "text-red-400" },
    { l: "Total obs.", v: audits.reduce((s, a) => s + a.observations, 0), c: "text-amber-400" },
  ];

  const openCreate = () => {
    setEditingAudit(null);
    setForm({ id: `AUD-${String(audits.length + 1).padStart(3, '0')}`, status: "Pendiente", risk: "Bajo", observations: 0, criticalObs: 0 });
    setIsModalOpen(true);
  };

  const openEdit = (a: Audit) => {
    setEditingAudit(a);
    setForm(a);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!form.auditor || !form.project) {
      alert("Por favor, complete los campos obligatorios: Auditor y Proyecto ID.");
      return;
    }
    if (editingAudit) {
      setAudits(prev => prev.map(aud => aud.id === editingAudit.id ? { ...aud, ...form } as Audit : aud));
    } else {
      setAudits(prev => [...prev, form as Audit]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map(s => (
          <div key={s.l} className="glass rounded-lg px-3 py-2.5">
            <div className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">{s.l}</div>
            <div className={`text-xl font-bold mt-0.5 ${s.c}`}>{s.v}</div>
          </div>
        ))}
      </div>
      <Panel
        title="Registro de Auditorías"
        count={filtered.length}
        toolbar={
          <div className="flex flex-wrap gap-3 items-center">
            <SearchBar value={q} onChange={v => { setQ(v); pg.reset(); }} placeholder="Auditor, proyecto, alcance…" extra={
              <div className="flex gap-2">
                <Select value={statusF} onChange={setStatusF} options={statuses} />
                <Select value={typeF} onChange={setTypeF} options={types} />
              </div>
            } />
            <button
              onClick={openCreate}
              className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded text-[11px] font-mono transition-all flex items-center gap-2 border border-blue-400/30"
            >
              <span>+</span> Nueva Auditoría
            </button>
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <Th>ID</Th><Th>Auditor</Th><Th>Proyecto</Th><Th>Tipo</Th>
                <Th>Alcance</Th><Th>Programada</Th><Th>Completada</Th>
                <Th>Obs.</Th><Th>Críticas</Th><Th>Riesgo</Th><Th>Estado</Th><Th>Acciones</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#111d2e]">
              {pg.slice.map(a => (
                <tr key={a.id} className="trow transition-colors">
                  <Td mono><span className="text-slate-600">{a.id}</span></Td>
                  <Td><span className="text-slate-200 font-medium">{a.auditor}</span></Td>
                  <Td mono><span className="text-blue-400">{a.project}</span></Td>
                  <Td><span className="text-[10px] text-slate-500 bg-[#1c2f47] px-1.5 py-0.5 rounded font-mono">{a.type}</span></Td>
                  <Td><span className="text-slate-400 text-[11px]">{a.scope}</span></Td>
                  <Td mono><span className="text-slate-600">{a.scheduled}</span></Td>
                  <Td mono><span className="text-slate-500">{a.completed ?? "—"}</span></Td>
                  <Td mono center><span className={a.observations > 0 ? "text-amber-400" : "text-slate-700"}>{a.observations || "—"}</span></Td>
                  <Td mono center><span className={a.criticalObs > 0 ? "text-red-400 font-semibold" : "text-slate-700"}>{a.criticalObs || "—"}</span></Td>
                  <Td mono><span className={riskCls[a.risk] ?? "text-slate-400"}>{a.risk}</span></Td>
                  <Td><Badge label={a.status} cls={STATUS_CLS[a.status] ?? ""} /></Td>
                  <Td center>
                    <div className="flex items-center gap-2 justify-center">
                      <button onClick={() => openEdit(a)} className="text-slate-600 hover:text-blue-400 transition-colors text-xs font-mono">✎</button>
                      <button
                        onClick={() => { if (confirm(`¿Eliminar auditoría ${a.id}?`)) setAudits(prev => prev.filter(x => x.id !== a.id)) }}
                        className="text-slate-600 hover:text-red-400 transition-colors text-xs font-mono"
                      >
                        🗑
                      </button>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination {...pg} />
      </Panel>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingAudit ? "Editar Auditoría" : "Nueva Auditoría"}
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-slate-600 uppercase">Auditor</span>
            <input
              className="bg-[#111d2e] border border-[#1c2f47] rounded px-2 py-1.5 text-xs text-slate-300 outline-none focus:border-blue-500"
              value={form.auditor || ""}
              onChange={e => setForm({ ...form, auditor: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-slate-600 uppercase">Proyecto ID</span>
            <input
              className="bg-[#111d2e] border border-[#1c2f47] rounded px-2 py-1.5 text-xs text-slate-300 outline-none focus:border-blue-500"
              value={form.project || ""}
              onChange={e => setForm({ ...form, project: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-slate-600 uppercase">Tipo</span>
            <input
              className="bg-[#111d2e] border border-[#1c2f47] rounded px-2 py-1.5 text-xs text-slate-300 outline-none focus:border-blue-500"
              value={form.type || ""}
              onChange={e => setForm({ ...form, type: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-slate-600 uppercase">Estado</span>
            <select
              className="bg-[#111d2e] border border-[#1c2f47] rounded px-2 py-1.5 text-xs text-slate-300 outline-none focus:border-blue-500"
              value={form.status || "Pendiente"}
              onChange={e => setForm({ ...form, status: e.target.value as Status })}
            >
              <option value="Pendiente">Pendiente</option>
              <option value="En progreso">En progreso</option>
              <option value="Observado">Observado</option>
              <option value="Aprobado">Aprobado</option>
            </select>
          </div>
          <div className="flex flex-col gap-1 col-span-2">
            <span className="text-[10px] font-mono text-slate-600 uppercase">Alcance</span>
            <input
              className="bg-[#111d2e] border border-[#1c2f47] rounded px-2 py-1.5 text-xs text-slate-300 outline-none focus:border-blue-500"
              value={form.scope || ""}
              onChange={e => setForm({ ...form, scope: e.target.value })}
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={() => setIsModalOpen(false)} className="px-3 py-1.5 text-xs font-mono text-slate-500 hover:text-slate-300 transition-colors">Cancelar</button>
          <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded text-xs font-mono transition-all border border-blue-400/30">Guardar Auditoría</button>
        </div>
      </Modal>
    </div>
  );
}

/* ─── Deliveries View ─── */
function DeliveriesView({ deliveries, setDeliveries }: { deliveries: Delivery[], setDeliveries: React.Dispatch<React.SetStateAction<Delivery[]>> }) {
  const [q, setQ] = useState("");
  const [statusF, setStatusF] = useState("Todos");
  const [typeF, setTypeF] = useState("Todos");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDelivery, setEditingDelivery] = useState<Delivery | null>(null);
  const [form, setForm] = useState<Partial<Delivery>>({});

  const statuses = ["Todos", ...Array.from(new Set(deliveries.map(d => d.status)))];
  const types = ["Todos", ...Array.from(new Set(deliveries.map(d => d.type)))];

  const filtered = useMemo(() => deliveries.filter(d => {
    const match = [d.id, d.milestone, d.project, d.responsible, d.type, d.deliverable].join(" ").toLowerCase().includes(q.toLowerCase());
    const st = statusF === "Todos" || d.status === statusF;
    const tp = typeF === "Todos" || d.type === typeF;
    return match && st && tp;
  }), [q, statusF, typeF, deliveries]);

  const pg = usePagination(filtered, 10);

  const stats = [
    { l: "Entregados", v: deliveries.filter(d => d.status === "Entregado").length, c: "text-cyan-400" },
    { l: "En proceso", v: deliveries.filter(d => d.status === "En progreso").length, c: "text-blue-400" },
    { l: "En revisión", v: deliveries.filter(d => d.status === "Revisión").length, c: "text-amber-400" },
    { l: "Pendientes", v: deliveries.filter(d => d.status === "Pendiente").length, c: "text-slate-400" },
    { l: "Vencidos", v: deliveries.filter(d => d.status !== "Entregado" && d.deadline < "2026-09-08").length, c: "text-red-400" },
    { l: "Hitos totales", v: deliveries.length, c: "text-slate-300" },
  ];

  const openCreate = () => {
    setEditingDelivery(null);
    setForm({ id: `DEL-${String(deliveries.length + 1).padStart(3, '0')}`, status: "Pendiente", version: "v1.0" });
    setIsModalOpen(true);
  };

  const openEdit = (d: Delivery) => {
    setEditingDelivery(d);
    setForm(d);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!form.milestone || !form.project) {
      alert("Por favor, complete los campos obligatorios: Hito y Proyecto ID.");
      return;
    }
    if (editingDelivery) {
      setDeliveries(prev => prev.map(del => del.id === editingDelivery.id ? { ...del, ...form } as Delivery : del));
    } else {
      setDeliveries(prev => [...prev, form as Delivery]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map(s => (
          <div key={s.l} className="glass rounded-lg px-3 py-2.5">
            <div className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">{s.l}</div>
            <div className={`text-xl font-bold mt-0.5 ${s.c}`}>{s.v}</div>
          </div>
        ))}
      </div>
      <Panel
        title="Control de Entregas"
        count={filtered.length}
        toolbar={
          <div className="flex flex-wrap gap-3 items-center">
            <SearchBar value={q} onChange={v => { setQ(v); pg.reset(); }} placeholder="Hito, proyecto, responsable…" extra={
              <div className="flex gap-2">
                <Select value={statusF} onChange={setStatusF} options={statuses} />
                <Select value={typeF} onChange={setTypeF} options={types} />
              </div>
            } />
            <button
              onClick={openCreate}
              className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded text-[11px] font-mono transition-all flex items-center gap-2 border border-blue-400/30"
            >
              <span>+</span> Nuevo Hito
            </button>
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <Th>ID</Th><Th>Hito / Entregable</Th><Th>Proyecto</Th><Th>Responsable</Th>
                <Th>Tipo</Th><Th>Vencimiento</Th><Th>Entregado</Th>
                <Th>Versión</Th><Th>Tamaño</Th><Th>Estado</Th><Th>Acciones</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#111d2e]">
              {pg.slice.map(d => {
                const overdue = d.status !== "Entregado" && d.deadline < "2026-09-08";
                return (
                  <tr key={d.id} className="trow transition-colors">
                    <Td mono><span className="text-slate-600">{d.id}</span></Td>
                    <Td>
                      <div>
                        <p className="text-slate-200 font-medium text-[11px]">{d.milestone}</p>
                        <p className="text-[10px] text-slate-600">{d.deliverable}</p>
                      </div>
                    </Td>
                    <Td mono><span className="text-blue-400">{d.project}</span></Td>
                    <Td><span className="text-slate-400 text-[11px]">{d.responsible}</span></Td>
                    <Td><span className="text-[10px] font-mono text-slate-500 bg-[#1c2f47] px-1.5 py-0.5 rounded">{d.type}</span></Td>
                    <Td mono><span className={overdue ? "text-red-400 font-semibold" : "text-slate-500"}>{d.deadline}</span></Td>
                    <Td mono><span className="text-slate-500">{d.delivered ?? "—"}</span></Td>
                    <Td mono center><span className="text-slate-600">{d.version}</span></Td>
                    <Td mono center><span className="text-slate-600">{d.size}</span></Td>
                    <Td><Badge label={d.status} cls={STATUS_CLS[d.status] ?? ""} /></Td>
                    <Td center>
                      <div className="flex items-center gap-2 justify-center">
                        <button onClick={() => openEdit(d)} className="text-slate-600 hover:text-blue-400 transition-colors text-xs font-mono">✎</button>
                        <button
                          onClick={() => { if (confirm(`¿Eliminar entrega ${d.id}?`)) setDeliveries(prev => prev.filter(x => x.id !== d.id)) }}
                          className="text-slate-600 hover:text-red-400 transition-colors text-xs font-mono"
                        >
                          🗑
                        </button>
                      </div>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <Pagination {...pg} />
      </Panel>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDelivery ? "Editar Entrega" : "Nuevo Hito de Entrega"}
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1 col-span-2">
            <span className="text-[10px] font-mono text-slate-600 uppercase">Hito / Nombre del Entregable</span>
            <input
              className="bg-[#111d2e] border border-[#1c2f47] rounded px-2 py-1.5 text-xs text-slate-300 outline-none focus:border-blue-500"
              value={form.milestone || ""}
              onChange={e => setForm({ ...form, milestone: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-slate-600 uppercase">Proyecto ID</span>
            <input
              className="bg-[#111d2e] border border-[#1c2f47] rounded px-2 py-1.5 text-xs text-slate-300 outline-none focus:border-blue-500"
              value={form.project || ""}
              onChange={e => setForm({ ...form, project: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-slate-600 uppercase">Estado</span>
            <select
              className="bg-[#111d2e] border border-[#1c2f47] rounded px-2 py-1.5 text-xs text-slate-300 outline-none focus:border-blue-500"
              value={form.status || "Pendiente"}
              onChange={e => setForm({ ...form, status: e.target.value as Status })}
            >
              <option value="Pendiente">Pendiente</option>
              <option value="En progreso">En progreso</option>
              <option value="Revisión">Revisión</option>
              <option value="Entregado">Entregado</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-slate-600 uppercase">Responsable</span>
            <input
              className="bg-[#111d2e] border border-[#1c2f47] rounded px-2 py-1.5 text-xs text-slate-300 outline-none focus:border-blue-500"
              value={form.responsible || ""}
              onChange={e => setForm({ ...form, responsible: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-slate-600 uppercase">Vencimiento</span>
            <input
              type="date"
              className="bg-[#111d2e] border border-[#1c2f47] rounded px-2 py-1.5 text-xs text-slate-300 outline-none focus:border-blue-500"
              value={form.deadline || ""}
              onChange={e => setForm({ ...form, deadline: e.target.value })}
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={() => setIsModalOpen(false)} className="px-3 py-1.5 text-xs font-mono text-slate-500 hover:text-slate-300 transition-colors">Cancelar</button>
          <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded text-xs font-mono transition-all border border-blue-400/30">Guardar Hito</button>
        </div>
      </Modal>
    </div>
  );
}

/* ─── Security View ─── */
function SecurityView({ events, setEvents, users, setUsers }: { events: SecurityEvent[], setEvents: React.Dispatch<React.SetStateAction<SecurityEvent[]>>, users: UserRole[], setUsers: React.Dispatch<React.SetStateAction<UserRole[]>> }) {
  const [q, setQ] = useState("");
  const [sevF, setSevF] = useState("Todos");
  const [activeTab, setActiveTab] = useState<"events" | "users">("events");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRole | null>(null);
  const [form, setForm] = useState<Partial<UserRole>>({});

  const severities = ["Todos", "Crítico", "Alerta", "Aviso", "Info"];

  const filteredEvents = useMemo(() => events.filter(e => {
    const match = [e.id, e.user, e.action, e.module, e.ip, e.device].join(" ").toLowerCase().includes(q.toLowerCase());
    const sv = sevF === "Todos" || e.severity === sevF;
    return match && sv;
  }), [q, sevF, events]);

  const filteredUsers = useMemo(() => users.filter(u =>
    [u.id, u.name, u.email, u.role, u.department].join(" ").toLowerCase().includes(q.toLowerCase())
  ), [q, users]);

  const pgEv = usePagination(filteredEvents, 10);
  const pgUsr = usePagination(filteredUsers, 10);

  const userStatusCls: Record<string, string> = {
    "Activo": "text-emerald-400 bg-emerald-500/10 border-emerald-500/25",
    "Inactivo": "text-slate-400 bg-slate-500/10 border-slate-500/25",
    "Suspendido": "text-red-400 bg-red-500/10 border-red-500/25",
  };

  const openCreateUser = () => {
    setEditingUser(null);
    setForm({ id: `USR-${String(users.length + 1).padStart(3, '0')}`, status: "Activo", mfa: true, sessions: 0, permissions: [] });
    setIsModalOpen(true);
  };

  const openEditUser = (u: UserRole) => {
    setEditingUser(u);
    setForm(u);
    setIsModalOpen(true);
  };

  const handleSaveUser = () => {
    if (!form.name || !form.email) {
      alert("Por favor, complete los campos obligatorios: Nombre y Email.");
      return;
    }
    if (editingUser) {
      setUsers(prev => prev.map(usr => usr.id === editingUser.id ? { ...usr, ...form } as UserRole : usr));
    } else {
      setUsers(prev => [...prev, form as UserRole]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Security KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPI label="Alertas Críticas (72h)" value={String(events.filter(e => e.severity === "Crítico").length)} sub="Requieren revisión" color="text-red-400" icon="⚠" />
        <KPI label="Intentos Fallidos" value={String(events.filter(e => e.result === "Fallido" || e.result === "Denegado").length)} sub="Login · acceso · permisos" color="text-orange-400" icon="⊗" />
        <KPI label="Usuarios Activos" value={String(users.filter(u => u.status === "Activo").length)} sub={`${users.filter(u => u.mfa).length}/${users.length} con MFA`} color="text-blue-400" icon="◎" />
        <KPI label="Suspendidos" value={String(users.filter(u => u.status === "Suspendido").length)} sub="Acceso revocado" color="text-amber-400" icon="⊘" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[#1c2f47]">
        {(["events", "users"] as const).map(t => (
          <button
            key={t}
            onClick={() => { setActiveTab(t); setQ(""); }}
            className={`px-4 py-2 text-[11px] font-mono uppercase tracking-wider transition-colors ${activeTab === t ? "text-blue-400 border-b-2 border-blue-500 -mb-px" : "text-slate-600 hover:text-slate-400"}`}
          >
            {t === "events" ? `Log de Eventos (${events.length})` : `Usuarios y Roles (${users.length})`}
          </button>
        ))}
      </div>

      {activeTab === "events" && (
        <Panel
          title="Registro de Auditoría de Seguridad"
          count={filteredEvents.length}
          toolbar={
            <div className="flex flex-wrap gap-3 items-center">
              <SearchBar value={q} onChange={v => { setQ(v); pgEv.reset(); }} placeholder="Usuario, acción, módulo, IP…" extra={
                <Select value={sevF} onChange={setSevF} options={severities} />
              } />
              <button
                onClick={() => { if (confirm("¿Limpiar logs de seguridad?")) setEvents([]) }}
                className="text-slate-600 hover:text-red-400 transition-colors text-[11px] font-mono border border-[#1c2f47] px-2 py-1 rounded"
              >
                Limpiar Log
              </button>
            </div>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <Th>ID</Th><Th>Timestamp</Th><Th>Usuario</Th><Th>Rol</Th>
                  <Th>Acción</Th><Th>Módulo</Th><Th>Recurso</Th>
                  <Th>IP</Th><Th>Dispositivo</Th><Th>Severidad</Th><Th>Resultado</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#111d2e]">
                {pgEv.slice.map(e => (
                  <tr key={e.id} className="trow transition-colors">
                    <Td mono><span className="text-slate-600">{e.id}</span></Td>
                    <Td mono><span className="text-slate-500 text-[10px]">{e.timestamp}</span></Td>
                    <Td mono><span className="text-slate-300 text-[10px]">{e.user}</span></Td>
                    <Td><span className="text-slate-500 text-[10px]">{e.role}</span></Td>
                    <Td mono><span className="text-cyan-400 font-semibold text-[10px]">{e.action}</span></Td>
                    <Td><span className="text-slate-400 text-[10px]">{e.module}</span></Td>
                    <Td mono><span className="text-slate-600 text-[10px]">{e.resource}</span></Td>
                    <Td mono><span className="text-slate-600 text-[10px]">{e.ip}</span></Td>
                    <Td><span className="text-slate-600 text-[10px]">{e.device}</span></Td>
                    <Td><Badge label={e.severity} cls={SEV_CLS[e.severity] ?? ""} /></Td>
                    <Td><span className={`text-[11px] font-mono font-semibold ${RESULT_CLS[e.result] ?? "text-slate-400"}`}>{e.result}</span></Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination {...pgEv} />
        </Panel>
      )}

      {activeTab === "users" && (
        <Panel
          title="Usuarios, Roles y Permisos"
          count={filteredUsers.length}
          toolbar={
            <div className="flex flex-wrap gap-3 items-center">
              <SearchBar value={q} onChange={v => { setQ(v); pgUsr.reset(); }} placeholder="Nombre, email, rol, departamento…" />
              <button
                onClick={openCreateUser}
                className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded text-[11px] font-mono transition-all flex items-center gap-2 border border-blue-400/30"
              >
                <span>+</span> Nuevo Usuario
              </button>
            </div>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <Th>ID</Th><Th>Nombre</Th><Th>Email</Th><Th>Rol</Th>
                  <Th>Departamento</Th><Th>Último acceso</Th>
                  <Th>MFA</Th><Th>Sesiones</Th><Th>Permisos</Th><Th>Estado</Th><Th>Acciones</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#111d2e]">
                {pgUsr.slice.map(u => (
                  <tr key={u.id} className="trow transition-colors">
                    <Td mono><span className="text-slate-600">{u.id}</span></Td>
                    <Td><span className="text-slate-200 font-medium">{u.name}</span></Td>
                    <Td mono><span className="text-slate-500 text-[10px]">{u.email}</span></Td>
                    <Td><span className="text-slate-400 text-[11px]">{u.role}</span></Td>
                    <Td><span className="text-slate-500 text-[11px]">{u.department}</span></Td>
                    <Td mono><span className="text-slate-600 text-[10px]">{u.lastLogin}</span></Td>
                    <Td mono center>
                      <span className={u.mfa ? "text-emerald-400 font-bold" : "text-red-400"}>
                        {u.mfa ? "✓" : "✗"}
                      </span>
                    </Td>
                    <Td mono center><span className={u.sessions > 0 ? "text-blue-400" : "text-slate-700"}>{u.sessions}</span></Td>
                    <Td>
                      <span className="text-[10px] font-mono text-slate-600">
                        {u.permissions.includes("*") ? "Super Admin" : u.permissions.length === 0 ? "Sin permisos" : `${u.permissions.length} permisos`}
                      </span>
                    </Td>
                    <Td><Badge label={u.status} cls={userStatusCls[u.status] ?? ""} /></Td>
                    <Td center>
                      <div className="flex items-center gap-2 justify-center">
                        <button onClick={() => openEditUser(u)} className="text-slate-600 hover:text-blue-400 transition-colors text-xs font-mono">✎</button>
                        <button
                          onClick={() => { if (confirm(`¿Eliminar usuario ${u.id}?`)) setUsers(prev => prev.filter(x => x.id !== u.id)) }}
                          className="text-slate-600 hover:text-red-400 transition-colors text-xs font-mono"
                        >
                          🗑
                        </button>
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination {...pgUsr} />
        </Panel>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? "Editar Usuario" : "Nuevo Usuario"}
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-slate-600 uppercase">Nombre Completo</span>
            <input
              className="bg-[#111d2e] border border-[#1c2f47] rounded px-2 py-1.5 text-xs text-slate-300 outline-none focus:border-blue-500"
              value={form.name || ""}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-slate-600 uppercase">Email Institucional</span>
            <input
              className="bg-[#111d2e] border border-[#1c2f47] rounded px-2 py-1.5 text-xs text-slate-300 outline-none focus:border-blue-500"
              value={form.email || ""}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-slate-600 uppercase">Rol</span>
            <input
              className="bg-[#111d2e] border border-[#1c2f47] rounded px-2 py-1.5 text-xs text-slate-300 outline-none focus:border-blue-500"
              value={form.role || ""}
              onChange={e => setForm({ ...form, role: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-slate-600 uppercase">Estado</span>
            <select
              className="bg-[#111d2e] border border-[#1c2f47] rounded px-2 py-1.5 text-xs text-slate-300 outline-none focus:border-blue-500"
              value={form.status || "Activo"}
              onChange={e => setForm({ ...form, status: e.target.value as any })}
            >
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
              <option value="Suspendido">Suspendido</option>
            </select>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={() => setIsModalOpen(false)} className="px-3 py-1.5 text-xs font-mono text-slate-500 hover:text-slate-300 transition-colors">Cancelar</button>
          <button onClick={handleSaveUser} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded text-xs font-mono transition-all border border-blue-400/30">Guardar Usuario</button>
        </div>
      </Modal>
    </div>
  );
}

/* ─── Select helper ─── */
function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="bg-[#111d2e] border border-[#1c2f47] rounded px-2 py-1.5 text-[11px] font-mono text-slate-400 outline-none focus:border-blue-500/50 transition-all"
    >
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

/* ─── Nav config ─── */
const NAV_CONFIG: { key: View; label: string; icon: string }[] = [
  { key: "dashboard", label: "Panel", icon: "▦" },
  { key: "projects", label: "Proyectos", icon: "◈" },
  { key: "evaluators", label: "Evaluadores", icon: "◎" },
  { key: "solvers", label: "Solucionadores", icon: "⚙" },
  { key: "auditors", label: "Auditores", icon: "⊞" },
  { key: "deliveries", label: "Entregas", icon: "◫" },
  { key: "security", label: "Seguridad", icon: "⊕" },
];

const PAGE_TITLE: Record<View, string> = {
  dashboard: "Panel General",
  projects: "Gestión de Proyectos",
  evaluators: "Evaluadores",
  solvers: "Solucionadores de Incidencias",
  auditors: "Auditorías",
  deliveries: "Control de Entregas",
  security: "Seguridad y Accesos",
};

/* ─── App root ─── */
export default function App() {
  const [view, setView] = useState<View>("dashboard");
  const [collapsed, setCollapsed] = useState(false);

  // Global States
  const [projectsState, setProjectsState] = useState<Project[]>(initialProjects);
  const [evaluatorsState, setEvaluatorsState] = useState<Evaluator[]>(initialEvaluators);
  const [issuesState, setIssuesState] = useState<Issue[]>(initialIssues);
  const [auditsState, setAuditsState] = useState<Audit[]>(initialAudits);
  const [deliveriesState, setDeliveriesState] = useState<Delivery[]>(initialDeliveries);
  const [securityEventsState, setSecurityEventsState] = useState<SecurityEvent[]>(initialSecurityEvents);
  const [userRolesState, setUserRolesState] = useState<UserRole[]>(initialUserRoles);

  // Persistence: Load from LocalStorage
  useEffect(() => {
    const savedData = localStorage.getItem("projegov_db");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.projects) setProjectsState(parsed.projects);
        if (parsed.evaluators) setEvaluatorsState(parsed.evaluators);
        if (parsed.issues) setIssuesState(parsed.issues);
        if (parsed.audits) setAuditsState(parsed.audits);
        if (parsed.deliveries) setDeliveriesState(parsed.deliveries);
        if (parsed.securityEvents) setSecurityEventsState(parsed.securityEvents);
        if (parsed.userRoles) setUserRolesState(parsed.userRoles);
      } catch (e) {
        console.error("Error loading database from storage", e);
      }
    }
  }, []);

  // Persistence: Save to LocalStorage on change
  useEffect(() => {
    const db = {
      projects: projectsState,
      evaluators: evaluatorsState,
      issues: issuesState,
      audits: auditsState,
      deliveries: deliveriesState,
      securityEvents: securityEventsState,
      userRoles: userRolesState,
    };
    localStorage.setItem("projegov_db", JSON.stringify(db));
  }, [projectsState, evaluatorsState, issuesState, auditsState, deliveriesState, securityEventsState, userRolesState]);

  return (
    <div className="h-full flex bg-[#05090f] text-slate-100 overflow-hidden" style={{ fontFamily: "'DM Sans',system-ui,sans-serif" }}>

      {/* ── Sidebar ── */}
      <aside className={`flex flex-col flex-shrink-0 bg-[#090e18] border-r border-[rgba(255,255,255,0.06)] transition-all duration-200 ${collapsed ? "w-12" : "w-52"}`}>

        {/* Logo */}
        <div className="flex items-center gap-3 px-3 py-3.5 border-b border-[rgba(255,255,255,0.06)] min-h-[52px]">
          <div className="w-7 h-7 rounded-md flex-shrink-0 overflow-hidden relative">
            <div className="shimmer-bar absolute inset-0" />
            <span className="relative z-10 flex items-center justify-center h-full text-[11px] font-bold text-white font-mono">PG</span>
          </div>
          {!collapsed && (
            <div>
              <div className="text-[12px] font-semibold text-slate-100 leading-none">ProjeGov</div>
              <div className="text-[9px] font-mono text-slate-600 mt-0.5">Enterprise · v3.0</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-2 px-1.5 space-y-0.5">
          {!collapsed && (
            <div className="px-2 pt-1 pb-1.5">
              <span className="text-[8px] font-mono text-slate-700 uppercase tracking-widest">Módulos</span>
            </div>
          )}
          {NAV_CONFIG.map(n => {
            const active = view === n.key;
            const count = n.key === "projects" ? projectsState.length :
              n.key === "evaluators" ? evaluatorsState.length :
                n.key === "solvers" ? issuesState.length :
                  n.key === "auditors" ? auditsState.length :
                    n.key === "deliveries" ? deliveriesState.length :
                      n.key === "security" ? securityEventsState.length : 0;
            return (
              <button
                key={n.key}
                onClick={() => setView(n.key)}
                title={collapsed ? n.label : undefined}
                className={`w-full flex items-center gap-2.5 px-2 py-2 rounded-md text-left transition-all tr-fast group ${active
                    ? "bg-blue-500/15 text-blue-300 border border-blue-500/20"
                    : "text-slate-500 hover:text-slate-300 hover:bg-[rgba(255,255,255,0.04)] border border-transparent"
                  }`}
              >
                <span className={`text-sm w-5 text-center flex-shrink-0 ${active ? "text-blue-400" : "group-hover:text-slate-300"}`}>{n.icon}</span>
                {!collapsed && (
                  <>
                    <span className="text-[11px] font-medium flex-1 whitespace-nowrap">{n.label}</span>
                    {count > 0 && (
                      <span className={`text-[9px] font-mono px-1.5 py-px rounded-full ${active ? "text-blue-300 bg-blue-500/20" : "text-slate-700 bg-[#1c2f47]"}`}>
                        {count}
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>

        {/* Collapse toggle */}
        <div className="px-2 py-3 border-t border-[rgba(255,255,255,0.06)]">
          <button
            onClick={() => setCollapsed(c => !c)}
            className="w-full flex items-center justify-center gap-2 px-2 py-1.5 rounded text-slate-600 hover:text-slate-400 hover:bg-[rgba(255,255,255,0.04)] transition-all text-sm"
          >
            {collapsed ? "›" : "‹"}
            {!collapsed && <span className="text-[10px] font-mono">Contraer</span>}
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top bar */}
        <header className="h-[52px] bg-[#090e18] border-b border-[rgba(255,255,255,0.06)] flex items-center px-4 gap-4 flex-shrink-0">
          <h1 className="text-[13px] font-semibold text-slate-200 flex-1 truncate">{PAGE_TITLE[view]}</h1>
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="hidden sm:flex items-center gap-2">
              <div className="text-[9px] font-mono text-slate-700 bg-[#111d2e] px-2 py-1 rounded border border-[#1c2f47]">
                OFFLINE MODE
              </div>
              <div className="text-[9px] font-mono text-slate-700 bg-[#111d2e] px-2 py-1 rounded border border-[#1c2f47]">
                AES-256 · TLS 1.3
              </div>
            </div>
            <div className="w-px h-5 bg-[#1c2f47]" />
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-40"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-mono text-slate-600">2026-09-08</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-[#1c2f47] flex items-center justify-center">
                <span className="text-[9px] font-mono text-slate-400">AG</span>
              </div>
              <span className="text-[11px] text-slate-400 hidden md:block">Admin. General</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-5">
          {view === "dashboard" && (
            <DashboardView
              projects={projectsState}
              issues={issuesState}
              deliveries={deliveriesState}
              securityEvents={securityEventsState}
              evaluators={evaluatorsState}
              audits={auditsState}
              userRoles={userRolesState}
            />
          )}
          {view === "projects" && <ProjectsView projects={projectsState} setProjects={setProjectsState} />}
          {view === "evaluators" && <EvaluatorsView evaluators={evaluatorsState} setEvaluators={setEvaluatorsState} />}
          {view === "solvers" && <SolversView issues={issuesState} setIssues={setIssuesState} />}
          {view === "auditors" && <AuditorsView audits={auditsState} setAudits={setAuditsState} />}
          {view === "deliveries" && <DeliveriesView deliveries={deliveriesState} setDeliveries={setDeliveriesState} />}
          {view === "security" && <SecurityView events={securityEventsState} setEvents={setSecurityEventsState} users={userRolesState} setUsers={setUserRolesState} />}
        </main>
      </div>
    </div>
  );
}
