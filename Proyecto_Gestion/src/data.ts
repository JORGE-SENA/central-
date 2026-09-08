/* ─── Master data store — high-volume, fully offline ─── */

export type Status = "En progreso" | "Revisión" | "Completado" | "Pendiente" | "Bloqueado" | "Aprobado" | "Observado" | "Rechazado" | "Entregado" | "Cerrado";
export type Priority = "Crítica" | "Alta" | "Media" | "Baja";
export type RiskLevel = "Crítico" | "Alto" | "Medio" | "Bajo" | "—";

export interface Project {
  id: string; name: string; client: string; sector: string; lead: string;
  team: number; budget: string; budgetUsed: number; deadline: string;
  start: string; priority: Priority; status: Status; progress: number;
  region: string; contract: string;
}

export interface Evaluator {
  id: string; name: string; specialty: string; project: string;
  assigned: string; deadline: string; status: Status;
  score: number | null; findings: number; criticalFindings: number;
  methodology: string; deliverable: string;
}

export interface Issue {
  id: string; issue: string; project: string; module: string;
  assignee: string; priority: Priority; status: Status;
  opened: string; estimated: string; closed: string | null;
  category: string; impact: string;
}

export interface Audit {
  id: string; auditor: string; project: string; type: string;
  scheduled: string; completed: string | null; status: Status;
  risk: RiskLevel; observations: number; criticalObs: number;
  scope: string; result: string | null;
}

export interface Delivery {
  id: string; milestone: string; project: string; responsible: string;
  deadline: string; delivered: string | null; status: Status;
  type: string; deliverable: string; version: string; size: string;
}

export interface SecurityEvent {
  id: string; timestamp: string; user: string; role: string;
  action: string; module: string; resource: string;
  ip: string; device: string; severity: "Info" | "Aviso" | "Alerta" | "Crítico";
  result: "Exitoso" | "Fallido" | "Denegado";
}

export interface UserRole {
  id: string; name: string; email: string; role: string;
  department: string; lastLogin: string; status: "Activo" | "Inactivo" | "Suspendido";
  mfa: boolean; sessions: number; permissions: string[];
}

/* ── PROJECTS — 24 records ── */
export const projects: Project[] = [
  { id:"PRJ-001", name:"Sistema Gestión Municipal Integrado", client:"Alcaldía Norte", sector:"Gobierno Local", lead:"Andrés Mora", team:8, budget:"$180,000", budgetUsed:62, deadline:"2026-11-15", start:"2026-03-01", priority:"Alta", status:"En progreso", progress:67, region:"Cundinamarca", contract:"CT-2026-001" },
  { id:"PRJ-002", name:"Auditoría Infraestructura Vial Tramo Norte", client:"Ministerio Obras", sector:"Infraestructura", lead:"Camila Ruiz", team:5, budget:"$95,000", budgetUsed:88, deadline:"2026-10-01", start:"2026-06-15", priority:"Crítica", status:"Revisión", progress:89, region:"Antioquia", contract:"CT-2026-002" },
  { id:"PRJ-003", name:"Plataforma Educativa Digital Regional", client:"Sec. Educación", sector:"Educación", lead:"Luis Fernández", team:12, budget:"$250,000", budgetUsed:38, deadline:"2027-02-28", start:"2026-05-01", priority:"Media", status:"En progreso", progress:42, region:"Valle del Cauca", contract:"CT-2026-003" },
  { id:"PRJ-004", name:"Modernización Sistema Catastral IGAC", client:"IGAC Bogotá", sector:"Catastro", lead:"Sofía Castillo", team:6, budget:"$130,000", budgetUsed:9, deadline:"2027-06-30", start:"2026-08-01", priority:"Media", status:"Pendiente", progress:8, region:"Bogotá D.C.", contract:"CT-2026-004" },
  { id:"PRJ-005", name:"Red Nacional de Salud Preventiva", client:"Min. Salud", sector:"Salud", lead:"Ricardo Peña", team:14, budget:"$310,000", budgetUsed:100, deadline:"2026-08-30", start:"2025-11-01", priority:"Alta", status:"Completado", progress:100, region:"Nacional", contract:"CT-2025-011" },
  { id:"PRJ-006", name:"Digitalización Archivos Notariales SNR", client:"SNR", sector:"Justicia", lead:"Valentina Torres", team:4, budget:"$72,000", budgetUsed:28, deadline:"2026-12-20", start:"2026-07-01", priority:"Baja", status:"En progreso", progress:29, region:"Bogotá D.C.", contract:"CT-2026-006" },
  { id:"PRJ-007", name:"Interoperabilidad RUES Empresarial", client:"Confecámaras", sector:"Comercio", lead:"Martín Soto", team:9, budget:"$195,000", budgetUsed:55, deadline:"2026-12-01", start:"2026-04-01", priority:"Alta", status:"En progreso", progress:54, region:"Nacional", contract:"CT-2026-007" },
  { id:"PRJ-008", name:"Modernización Trámites DIAN Online", client:"DIAN", sector:"Tributario", lead:"Clara Mendoza", team:18, budget:"$420,000", budgetUsed:44, deadline:"2027-03-31", start:"2026-06-01", priority:"Crítica", status:"En progreso", progress:40, region:"Nacional", contract:"CT-2026-008" },
  { id:"PRJ-009", name:"Portal Ciudadano Multiservicio", client:"Presidencia", sector:"Gobierno Central", lead:"Héctor Ríos", team:22, budget:"$680,000", budgetUsed:31, deadline:"2027-07-01", start:"2026-02-01", priority:"Crítica", status:"En progreso", progress:30, region:"Nacional", contract:"CT-2026-009" },
  { id:"PRJ-010", name:"Actualización SISPRO Salud", client:"Min. Salud", sector:"Salud", lead:"Daniela Cano", team:7, budget:"$88,000", budgetUsed:75, deadline:"2026-10-31", start:"2026-05-15", priority:"Alta", status:"Revisión", progress:76, region:"Nacional", contract:"CT-2026-010" },
  { id:"PRJ-011", name:"Migración ERP Gobernación Atlántico", client:"Gobernación Atlántico", sector:"Gobierno Regional", lead:"Jorge Castro", team:10, budget:"$215,000", budgetUsed:19, deadline:"2027-04-30", start:"2026-09-01", priority:"Media", status:"Pendiente", progress:12, region:"Atlántico", contract:"CT-2026-011" },
  { id:"PRJ-012", name:"Biometría Electoral CNE 2026", client:"CNE", sector:"Electoral", lead:"Paola Vargas", team:16, budget:"$550,000", budgetUsed:66, deadline:"2026-11-01", start:"2026-01-15", priority:"Crítica", status:"En progreso", progress:68, region:"Nacional", contract:"CT-2026-012" },
  { id:"PRJ-013", name:"Redes Sociales Institucionales MSPS", client:"Min. Salud Prot. Social", sector:"Comunicaciones", lead:"Felipe Gómez", team:3, budget:"$45,000", budgetUsed:90, deadline:"2026-09-30", start:"2026-07-01", priority:"Baja", status:"Revisión", progress:91, region:"Bogotá D.C.", contract:"CT-2026-013" },
  { id:"PRJ-014", name:"Automatización Aduana DIAN Cartagena", client:"DIAN Cartagena", sector:"Comercio Exterior", lead:"Isabel Paredes", team:11, budget:"$290,000", budgetUsed:48, deadline:"2027-01-31", start:"2026-05-01", priority:"Alta", status:"En progreso", progress:46, region:"Bolívar", contract:"CT-2026-014" },
  { id:"PRJ-015", name:"Sistema de Alertas Tempranas IDEAM", client:"IDEAM", sector:"Ambiente", lead:"Roberto Nieto", team:8, budget:"$165,000", budgetUsed:22, deadline:"2026-12-31", start:"2026-08-15", priority:"Alta", status:"Pendiente", progress:18, region:"Nacional", contract:"CT-2026-015" },
  { id:"PRJ-016", name:"Certificados Digitales Ministerio Educación", client:"MEN", sector:"Educación", lead:"Ana Quiroga", team:6, budget:"$78,000", budgetUsed:100, deadline:"2026-07-31", start:"2026-01-01", priority:"Media", status:"Completado", progress:100, region:"Nacional", contract:"CT-2025-016" },
  { id:"PRJ-017", name:"Integración SIIF Nación 3.0", client:"Min. Hacienda", sector:"Financiero", lead:"Carlos Ibáñez", team:20, budget:"$890,000", budgetUsed:37, deadline:"2027-09-30", start:"2026-03-15", priority:"Crítica", status:"En progreso", progress:35, region:"Nacional", contract:"CT-2026-017" },
  { id:"PRJ-018", name:"Plataforma SENA Virtual 360°", client:"SENA", sector:"Educación Técnica", lead:"Mariana Ospina", team:15, budget:"$340,000", budgetUsed:58, deadline:"2026-12-01", start:"2026-04-01", priority:"Alta", status:"En progreso", progress:56, region:"Nacional", contract:"CT-2026-018" },
  { id:"PRJ-019", name:"Georreferenciación Predial Rural", client:"ADR", sector:"Agricultura", lead:"Tomás Herrera", team:9, budget:"$195,000", budgetUsed:14, deadline:"2027-05-31", start:"2026-09-01", priority:"Media", status:"Pendiente", progress:10, region:"Nacional", contract:"CT-2026-019" },
  { id:"PRJ-020", name:"Sistema Penitenciario INPEC Digital", client:"INPEC", sector:"Justicia", lead:"Sandra León", team:13, budget:"$375,000", budgetUsed:53, deadline:"2027-02-28", start:"2026-05-01", priority:"Alta", status:"En progreso", progress:51, region:"Nacional", contract:"CT-2026-020" },
  { id:"PRJ-021", name:"Red Hospitalaria Sur Bogotá", client:"Sec. Salud Bogotá", sector:"Salud", lead:"Germán Vega", team:11, budget:"$280,000", budgetUsed:100, deadline:"2026-06-30", start:"2025-10-01", priority:"Alta", status:"Completado", progress:100, region:"Bogotá D.C.", contract:"CT-2025-021" },
  { id:"PRJ-022", name:"Plataforma E-Gov Cundinamarca", client:"Gobernación Cundinamarca", sector:"Gobierno Regional", lead:"Laura Méndez", team:7, budget:"$140,000", budgetUsed:33, deadline:"2027-01-15", start:"2026-07-01", priority:"Media", status:"En progreso", progress:31, region:"Cundinamarca", contract:"CT-2026-022" },
  { id:"PRJ-023", name:"Migración Cloud Fiscalía General", client:"Fiscalía General", sector:"Justicia", lead:"Nicolás Arango", team:25, budget:"$1,200,000", budgetUsed:28, deadline:"2027-12-31", start:"2026-06-01", priority:"Crítica", status:"En progreso", progress:26, region:"Nacional", contract:"CT-2026-023" },
  { id:"PRJ-024", name:"Sistema Monitoreo Agua Potable", client:"Min. Vivienda", sector:"Servicios Públicos", lead:"Catalina Díaz", team:6, budget:"$95,000", budgetUsed:41, deadline:"2026-11-30", start:"2026-06-01", priority:"Media", status:"En progreso", progress:39, region:"Nacional", contract:"CT-2026-024" },
];

/* ── EVALUATORS — 20 records ── */
export const evaluators: Evaluator[] = [
  { id:"EVA-001", name:"Ing. Patricia Herrera", specialty:"Infraestructura TI", project:"PRJ-001", assigned:"2026-08-12", deadline:"2026-09-30", status:"En progreso", score:88, findings:3, criticalFindings:0, methodology:"ISO/IEC 25010", deliverable:"Informe técnico + anexos" },
  { id:"EVA-002", name:"Lic. Jorge Salinas", specialty:"Gestión Pública", project:"PRJ-002", assigned:"2026-09-01", deadline:"2026-09-20", status:"Aprobado", score:94, findings:1, criticalFindings:0, methodology:"PMBOK 7", deliverable:"Certificado conformidad" },
  { id:"EVA-003", name:"Dra. Ana Montoya", specialty:"Educación Digital", project:"PRJ-003", assigned:"2026-09-03", deadline:"2026-10-15", status:"Pendiente", score:null, findings:0, criticalFindings:0, methodology:"UNESCO ICT CFT", deliverable:"Informe pedagógico" },
  { id:"EVA-004", name:"Ing. Felipe Vargas", specialty:"Cartografía GIS", project:"PRJ-004", assigned:"2026-09-06", deadline:"2026-10-31", status:"Pendiente", score:null, findings:0, criticalFindings:0, methodology:"ISO 19157", deliverable:"Reporte calidad datos" },
  { id:"EVA-005", name:"Lic. Marcela Díaz", specialty:"Salud Pública", project:"PRJ-005", assigned:"2026-07-10", deadline:"2026-08-20", status:"Aprobado", score:97, findings:0, criticalFindings:0, methodology:"OPS/OMS", deliverable:"Acta cierre evaluación" },
  { id:"EVA-006", name:"Dr. Sebastián Rojas", specialty:"Seguridad TI", project:"PRJ-008", assigned:"2026-08-01", deadline:"2026-10-01", status:"En progreso", score:76, findings:5, criticalFindings:2, methodology:"OWASP / NIST 800-53", deliverable:"Pentest report + remediación" },
  { id:"EVA-007", name:"Mg. Tatiana Fuentes", specialty:"Derecho Digital", project:"PRJ-009", assigned:"2026-07-15", deadline:"2026-10-31", status:"En progreso", score:81, findings:4, criticalFindings:1, methodology:"OCDE Digital Gov", deliverable:"Concepto jurídico" },
  { id:"EVA-008", name:"Ing. Ramón Osprey", specialty:"Bases de Datos", project:"PRJ-017", assigned:"2026-09-01", deadline:"2026-11-15", status:"Pendiente", score:null, findings:0, criticalFindings:0, methodology:"TOGAF 10", deliverable:"Arquitectura datos aprobada" },
  { id:"EVA-009", name:"Lic. Diana Muñoz", specialty:"Procesos Financieros", project:"PRJ-010", assigned:"2026-08-20", deadline:"2026-09-25", status:"Revisión", score:89, findings:2, criticalFindings:0, methodology:"COSO ERM", deliverable:"Informe financiero" },
  { id:"EVA-010", name:"Ing. Samuel Pinto", specialty:"Cloud & DevOps", project:"PRJ-023", assigned:"2026-09-01", deadline:"2026-12-01", status:"Pendiente", score:null, findings:0, criticalFindings:0, methodology:"AWS Well-Architected", deliverable:"Assessment arquitectura cloud" },
  { id:"EVA-011", name:"Dra. Gloria Rivas", specialty:"Gestión Documental", project:"PRJ-006", assigned:"2026-08-15", deadline:"2026-10-15", status:"En progreso", score:83, findings:3, criticalFindings:0, methodology:"NTC-ISO 15489", deliverable:"Concepto conservación" },
  { id:"EVA-012", name:"Mg. Julio Bermúdez", specialty:"Interoperabilidad", project:"PRJ-007", assigned:"2026-09-02", deadline:"2026-10-31", status:"Pendiente", score:null, findings:0, criticalFindings:0, methodology:"MECI / GORE", deliverable:"Informe compatibilidad" },
  { id:"EVA-013", name:"Ing. Natalia Ospina", specialty:"UX/Accesibilidad", project:"PRJ-003", assigned:"2026-09-04", deadline:"2026-10-20", status:"En progreso", score:72, findings:7, criticalFindings:1, methodology:"WCAG 2.2 / ISO 9241", deliverable:"Reporte usabilidad" },
  { id:"EVA-014", name:"Lic. Carmen Vega", specialty:"Biometría Electoral", project:"PRJ-012", assigned:"2026-08-01", deadline:"2026-10-15", status:"En progreso", score:91, findings:1, criticalFindings:0, methodology:"IEEE 2410", deliverable:"Certificado biometría" },
  { id:"EVA-015", name:"Ing. Mauricio León", specialty:"Telecomunicaciones", project:"PRJ-015", assigned:"2026-09-05", deadline:"2026-11-30", status:"Pendiente", score:null, findings:0, criticalFindings:0, methodology:"ITU-T G.9700", deliverable:"Estudio conectividad" },
  { id:"EVA-016", name:"Dr. Hernán Castro", specialty:"Derecho Penitenciario", project:"PRJ-020", assigned:"2026-08-25", deadline:"2026-10-31", status:"Revisión", score:86, findings:4, criticalFindings:0, methodology:"ONU Mandela Rules", deliverable:"Concepto legal" },
  { id:"EVA-017", name:"Ing. Rosa Pinilla", specialty:"Infraestructura Agua", project:"PRJ-024", assigned:"2026-09-01", deadline:"2026-11-01", status:"Pendiente", score:null, findings:0, criticalFindings:0, methodology:"RAS 2000", deliverable:"Informe hidráulico" },
  { id:"EVA-018", name:"Mg. Esteban Quiroga", specialty:"E-Learning", project:"PRJ-018", assigned:"2026-08-10", deadline:"2026-09-30", status:"En progreso", score:88, findings:2, criticalFindings:0, methodology:"SCORM 2004 / xAPI", deliverable:"Assessment plataforma" },
  { id:"EVA-019", name:"Ing. Pilar Acosta", specialty:"Seguridad Electoral", project:"PRJ-012", assigned:"2026-09-01", deadline:"2026-10-20", status:"Pendiente", score:null, findings:0, criticalFindings:0, methodology:"NIST 800-82", deliverable:"Pen-test electoral" },
  { id:"EVA-020", name:"Dr. Álvaro Quintero", specialty:"Hacienda Pública", project:"PRJ-017", assigned:"2026-08-15", deadline:"2026-11-01", status:"En progreso", score:93, findings:1, criticalFindings:0, methodology:"NICSP / MGP", deliverable:"Dictamen presupuestal" },
];

/* ── ISSUES/SOLVERS — 22 records ── */
export const issues: Issue[] = [
  { id:"SOL-001", issue:"Error sincronización BD municipal entre nodos primario y réplica", project:"PRJ-001", module:"Base de Datos", assignee:"Carlos Ibáñez", priority:"Alta", status:"En progreso", opened:"2026-09-05", estimated:"3d", closed:null, category:"Infraestructura", impact:"Alto" },
  { id:"SOL-002", issue:"Latencia reportes viales superior a 8 segundos en consultas GIS", project:"PRJ-002", module:"GIS / Mapas", assignee:"Diana Muñoz", priority:"Crítica", status:"Bloqueado", opened:"2026-09-02", estimated:"1d", closed:null, category:"Rendimiento", impact:"Crítico" },
  { id:"SOL-003", issue:"Módulo de matrículas se vuelve offline tras 20 min de inactividad", project:"PRJ-003", module:"Frontend", assignee:"Sebastián Rojas", priority:"Alta", status:"Revisión", opened:"2026-09-04", estimated:"2d", closed:null, category:"Estabilidad", impact:"Alto" },
  { id:"SOL-004", issue:"Importación CSV catastral falla con registros > 50.000 filas", project:"PRJ-004", module:"ETL / Migración", assignee:"Laura Gómez", priority:"Media", status:"En progreso", opened:"2026-09-07", estimated:"5d", closed:null, category:"Datos", impact:"Medio" },
  { id:"SOL-005", issue:"Certificados PDF se generan sin firma digital PKI válida", project:"PRJ-006", module:"Documentos", assignee:"Mauricio León", priority:"Alta", status:"Completado", opened:"2026-08-28", estimated:"—", closed:"2026-09-04", category:"Seguridad", impact:"Alto" },
  { id:"SOL-006", issue:"SSO con directorio LDAP institucional devuelve token expirado", project:"PRJ-001", module:"Autenticación", assignee:"Natalia Ospina", priority:"Media", status:"En progreso", opened:"2026-09-06", estimated:"4d", closed:null, category:"Seguridad", impact:"Medio" },
  { id:"SOL-007", issue:"Timeout en API DIAN al procesar declaraciones > 500 registros", project:"PRJ-008", module:"Integración API", assignee:"Felipe Gómez", priority:"Crítica", status:"En progreso", opened:"2026-09-01", estimated:"2d", closed:null, category:"Rendimiento", impact:"Crítico" },
  { id:"SOL-008", issue:"Panel electoral no carga en navegadores IE11 y Edge legacy", project:"PRJ-012", module:"Frontend", assignee:"Ana Quiroga", priority:"Media", status:"Completado", opened:"2026-08-20", estimated:"—", closed:"2026-08-25", category:"Compatibilidad", impact:"Bajo" },
  { id:"SOL-009", issue:"Duplicidad de predios en migración catastral lote Sur-Bogotá", project:"PRJ-004", module:"Calidad Datos", assignee:"Tomás Herrera", priority:"Alta", status:"En progreso", opened:"2026-09-06", estimated:"7d", closed:null, category:"Datos", impact:"Alto" },
  { id:"SOL-010", issue:"Fallo en proceso batch nocturno de conciliación SIIF", project:"PRJ-017", module:"Backend", assignee:"Carlos Ibáñez", priority:"Crítica", status:"Bloqueado", opened:"2026-09-07", estimated:"1d", closed:null, category:"Infraestructura", impact:"Crítico" },
  { id:"SOL-011", issue:"Error 403 al acceder módulo auditoría desde VPN Fiscalía", project:"PRJ-023", module:"Red / Seguridad", assignee:"Nicolás Arango", priority:"Alta", status:"En progreso", opened:"2026-09-03", estimated:"3d", closed:null, category:"Seguridad", impact:"Alto" },
  { id:"SOL-012", issue:"Reportes IDEAM no exportan a formato NetCDF estándar", project:"PRJ-015", module:"Reportes", assignee:"Roberto Nieto", priority:"Media", status:"Pendiente", opened:"2026-09-08", estimated:"4d", closed:null, category:"Interoperabilidad", impact:"Medio" },
  { id:"SOL-013", issue:"Carga masiva SENA falla con caracteres especiales en nombre", project:"PRJ-018", module:"Carga Datos", assignee:"Mariana Ospina", priority:"Baja", status:"En progreso", opened:"2026-09-05", estimated:"2d", closed:null, category:"Datos", impact:"Bajo" },
  { id:"SOL-014", issue:"Alertas SMS no se envían desde región Pacífico (operador)", project:"PRJ-009", module:"Notificaciones", assignee:"Héctor Ríos", priority:"Alta", status:"En progreso", opened:"2026-09-04", estimated:"5d", closed:null, category:"Integración", impact:"Alto" },
  { id:"SOL-015", issue:"Pérdida de sesión en portal ciudadano tras autenticación Cédula Digital", project:"PRJ-009", module:"Autenticación", assignee:"Paola Vargas", priority:"Crítica", status:"Revisión", opened:"2026-09-01", estimated:"2d", closed:null, category:"Seguridad", impact:"Crítico" },
  { id:"SOL-016", issue:"Inconsistencia saldos contables módulo PAC Gobernación", project:"PRJ-011", module:"Financiero", assignee:"Jorge Castro", priority:"Alta", status:"Pendiente", opened:"2026-09-07", estimated:"6d", closed:null, category:"Datos", impact:"Alto" },
  { id:"SOL-017", issue:"Certificado SSL vence en 12 días (prod.sispro.gov.co)", project:"PRJ-010", module:"Infraestructura", assignee:"Daniela Cano", priority:"Crítica", status:"En progreso", opened:"2026-09-07", estimated:"1d", closed:null, category:"Seguridad", impact:"Crítico" },
  { id:"SOL-018", issue:"Error al firmar actos administrativos con token eToken Pro", project:"PRJ-006", module:"Firma Digital", assignee:"Valentina Torres", priority:"Alta", status:"En progreso", opened:"2026-09-06", estimated:"3d", closed:null, category:"Seguridad", impact:"Alto" },
  { id:"SOL-019", issue:"Dashboard gerencial no imprime correctamente en A4 landscape", project:"PRJ-022", module:"Reportes", assignee:"Laura Méndez", priority:"Baja", status:"Completado", opened:"2026-09-02", estimated:"—", closed:"2026-09-05", category:"UI", impact:"Bajo" },
  { id:"SOL-020", issue:"API REST RUES devuelve 504 con razón social con tildes", project:"PRJ-007", module:"API", assignee:"Martín Soto", priority:"Media", status:"En progreso", opened:"2026-09-05", estimated:"2d", closed:null, category:"Integración", impact:"Medio" },
  { id:"SOL-021", issue:"Backup diario no se completa antes de ventana mantenimiento", project:"PRJ-023", module:"Infraestructura", assignee:"Nicolás Arango", priority:"Alta", status:"En progreso", opened:"2026-09-06", estimated:"3d", closed:null, category:"Infraestructura", impact:"Alto" },
  { id:"SOL-022", issue:"Indicadores ODS desactualizados en portal presidencia", project:"PRJ-009", module:"Contenido", assignee:"Clara Mendoza", priority:"Baja", status:"Pendiente", opened:"2026-09-08", estimated:"1d", closed:null, category:"Contenido", impact:"Bajo" },
];

/* ── AUDITS — 20 records ── */
export const audits: Audit[] = [
  { id:"AUD-001", auditor:"Dr. Hernán Castro", project:"PRJ-002", type:"Técnica", scheduled:"2026-09-08", completed:"2026-09-08", status:"Aprobado", risk:"Bajo", observations:2, criticalObs:0, scope:"Diseño arquitectónico vial", result:"Conforme NTC 3788" },
  { id:"AUD-002", auditor:"Dra. Gloria Rivas", project:"PRJ-001", type:"Financiera", scheduled:"2026-09-05", completed:"2026-09-05", status:"Observado", risk:"Medio", observations:7, criticalObs:1, scope:"Ejecución presupuestal Q2 2026", result:"Requiere justificación adicional" },
  { id:"AUD-003", auditor:"Ing. Samuel Pinto", project:"PRJ-003", type:"Seguridad TI", scheduled:"2026-09-09", completed:null, status:"Pendiente", risk:"—", observations:0, criticalObs:0, scope:"Revisión controles acceso plataforma", result:null },
  { id:"AUD-004", auditor:"Lic. Carmen Vega", project:"PRJ-005", type:"Cumplimiento", scheduled:"2026-08-25", completed:"2026-08-25", status:"Aprobado", risk:"Bajo", observations:1, criticalObs:0, scope:"Cierre contractual MEN", result:"Cierre conforme Ley 80" },
  { id:"AUD-005", auditor:"Dr. Hernán Castro", project:"PRJ-006", type:"Técnica", scheduled:"2026-10-01", completed:null, status:"Pendiente", risk:"—", observations:0, criticalObs:0, scope:"Calidad digitalización Lote A", result:null },
  { id:"AUD-006", auditor:"Dra. Gloria Rivas", project:"PRJ-004", type:"Financiera", scheduled:"2026-09-30", completed:null, status:"Pendiente", risk:"—", observations:0, criticalObs:0, scope:"Anticipo contrato catastral", result:null },
  { id:"AUD-007", auditor:"Mg. Roberto Nieto", project:"PRJ-008", type:"Seguridad TI", scheduled:"2026-10-05", completed:null, status:"Pendiente", risk:"—", observations:0, criticalObs:0, scope:"Pentest DIAN Online", result:null },
  { id:"AUD-008", auditor:"Ing. Patricia Herrera", project:"PRJ-009", type:"Arquitectura", scheduled:"2026-09-15", completed:null, status:"En progreso", risk:"Medio", observations:3, criticalObs:0, scope:"Revisión microservicios portal", result:null },
  { id:"AUD-009", auditor:"Lic. Marcela Díaz", project:"PRJ-010", type:"Calidad", scheduled:"2026-09-20", completed:null, status:"Pendiente", risk:"—", observations:0, criticalObs:0, scope:"Calidad datos SISPRO", result:null },
  { id:"AUD-010", auditor:"Dr. Álvaro Quintero", project:"PRJ-017", type:"Financiera", scheduled:"2026-10-15", completed:null, status:"Pendiente", risk:"—", observations:0, criticalObs:0, scope:"Supervisión ejecución SIIF", result:null },
  { id:"AUD-011", auditor:"Ing. Felipe Vargas", project:"PRJ-012", type:"Técnica", scheduled:"2026-09-25", completed:null, status:"Pendiente", risk:"—", observations:0, criticalObs:0, scope:"Infraestructura biometría electoral", result:null },
  { id:"AUD-012", auditor:"Dra. Ana Montoya", project:"PRJ-018", type:"Pedagógica", scheduled:"2026-09-18", completed:null, status:"En progreso", risk:"Bajo", observations:1, criticalObs:0, scope:"Contenidos curriculares SENA", result:null },
  { id:"AUD-013", auditor:"Ing. Samuel Pinto", project:"PRJ-023", type:"Seguridad TI", scheduled:"2026-10-20", completed:null, status:"Pendiente", risk:"—", observations:0, criticalObs:0, scope:"Migración cloud Fiscalía - Fase 1", result:null },
  { id:"AUD-014", auditor:"Dr. Hernán Castro", project:"PRJ-014", type:"Cumplimiento", scheduled:"2026-09-12", completed:"2026-09-12", status:"Aprobado", risk:"Bajo", observations:0, criticalObs:0, scope:"Adecuación normativa aduanas", result:"Conforme DIÁN res 046/2021" },
  { id:"AUD-015", auditor:"Dra. Gloria Rivas", project:"PRJ-020", type:"Financiera", scheduled:"2026-10-01", completed:null, status:"Pendiente", risk:"—", observations:0, criticalObs:0, scope:"Ejecución Q3 INPEC Digital", result:null },
  { id:"AUD-016", auditor:"Mg. Tatiana Fuentes", project:"PRJ-009", type:"Jurídica", scheduled:"2026-09-22", completed:null, status:"Pendiente", risk:"—", observations:0, criticalObs:0, scope:"Revisión habeas data portal", result:null },
  { id:"AUD-017", auditor:"Ing. Ramón Osprey", project:"PRJ-011", type:"Técnica", scheduled:"2026-09-28", completed:null, status:"Pendiente", risk:"—", observations:0, criticalObs:0, scope:"Configuración ERP Gobernación", result:null },
  { id:"AUD-018", auditor:"Lic. Jorge Salinas", project:"PRJ-007", type:"Cumplimiento", scheduled:"2026-09-16", completed:"2026-09-16", status:"Observado", risk:"Medio", observations:4, criticalObs:0, scope:"Acuerdos interoperabilidad RUES", result:"Pendiente ajuste SLA" },
  { id:"AUD-019", auditor:"Dr. Álvaro Quintero", project:"PRJ-021", type:"Financiera", scheduled:"2026-06-28", completed:"2026-06-28", status:"Aprobado", risk:"Bajo", observations:0, criticalObs:0, scope:"Cierre financiero Red Hospitalaria", result:"Excedente $12.400 devuelto" },
  { id:"AUD-020", auditor:"Ing. Patricia Herrera", project:"PRJ-024", type:"Técnica", scheduled:"2026-10-10", completed:null, status:"Pendiente", risk:"—", observations:0, criticalObs:0, scope:"Estaciones monitoreo agua", result:null },
];

/* ── DELIVERIES — 22 records ── */
export const deliveries: Delivery[] = [
  { id:"DEL-001", milestone:"Diseño arquitectura sistema municipal", project:"PRJ-001", responsible:"Andrés Mora", deadline:"2026-09-20", delivered:null, status:"En progreso", type:"Técnico", deliverable:"Doc. PDF + Diagramas C4", version:"v1.0", size:"—" },
  { id:"DEL-002", milestone:"Informe diagnóstico vial tramo norte", project:"PRJ-002", responsible:"Camila Ruiz", deadline:"2026-09-15", delivered:null, status:"Revisión", type:"Informe", deliverable:"Informe + 12 Anexos fotográficos", version:"v2.1", size:"84 MB" },
  { id:"DEL-003", milestone:"MVP plataforma educativa regional", project:"PRJ-003", responsible:"Luis Fernández", deadline:"2026-11-30", delivered:null, status:"En progreso", type:"Software", deliverable:"Build Docker + Manual técnico", version:"v0.8", size:"—" },
  { id:"DEL-004", milestone:"Catastro zona piloto Norte digitalizado", project:"PRJ-004", responsible:"Sofía Castillo", deadline:"2026-10-30", delivered:null, status:"Pendiente", type:"Datos", deliverable:"Shapefile EPSG:4326 + BD PostgreSQL", version:"v1.0", size:"—" },
  { id:"DEL-005", milestone:"Cierre final Red Nacional Salud", project:"PRJ-005", responsible:"Ricardo Peña", deadline:"2026-08-30", delivered:"2026-08-29", status:"Entregado", type:"Cierre", deliverable:"Acta cierre + 8 evidencias", version:"Final", size:"12 MB" },
  { id:"DEL-006", milestone:"Lote piloto digitalización notarial (1.200 exp.)", project:"PRJ-006", responsible:"Valentina Torres", deadline:"2026-10-15", delivered:null, status:"Pendiente", type:"Datos", deliverable:"Expedientes PDF/A-3 + índice XML", version:"v1.0", size:"—" },
  { id:"DEL-007", milestone:"Prototipo interoperabilidad RUES v1", project:"PRJ-007", responsible:"Martín Soto", deadline:"2026-10-01", delivered:null, status:"En progreso", type:"Software", deliverable:"API REST + Colección Postman", version:"v0.7", size:"—" },
  { id:"DEL-008", milestone:"Módulos DIAN trámites IVA en línea", project:"PRJ-008", responsible:"Clara Mendoza", deadline:"2026-11-01", delivered:null, status:"En progreso", type:"Software", deliverable:"Release módulo + casos de prueba", version:"v1.2", size:"—" },
  { id:"DEL-009", milestone:"Portal ciudadano Beta pública", project:"PRJ-009", responsible:"Héctor Ríos", deadline:"2026-12-01", delivered:null, status:"En progreso", type:"Software", deliverable:"URL staging + reporte UX", version:"Beta 2", size:"—" },
  { id:"DEL-010", milestone:"Actualización SISPRO módulo reportes", project:"PRJ-010", responsible:"Daniela Cano", deadline:"2026-10-15", delivered:null, status:"Revisión", type:"Software", deliverable:"Parche + notas de versión", version:"v3.4.1", size:"28 MB" },
  { id:"DEL-011", milestone:"Certificados digitales MEN Lote 1", project:"PRJ-016", responsible:"Ana Quiroga", deadline:"2026-07-31", delivered:"2026-07-30", status:"Entregado", type:"Datos", deliverable:"2.500 certificados PDF firmados", version:"Final", size:"340 MB" },
  { id:"DEL-012", milestone:"Módulo biometría electoral Fase 1", project:"PRJ-012", responsible:"Paola Vargas", deadline:"2026-10-01", delivered:null, status:"En progreso", type:"Software", deliverable:"SDK Android + iOS + API", version:"v1.0", size:"—" },
  { id:"DEL-013", milestone:"Arquitectura SIIF Nación 3.0 aprobada", project:"PRJ-017", responsible:"Carlos Ibáñez", deadline:"2026-10-31", delivered:null, status:"En progreso", type:"Técnico", deliverable:"ADR + Diagramas TOGAF", version:"v2.0", size:"—" },
  { id:"DEL-014", milestone:"Plataforma SENA cursos piloto (50 módulos)", project:"PRJ-018", responsible:"Mariana Ospina", deadline:"2026-11-01", delivered:null, status:"En progreso", type:"Software", deliverable:"LMS configurado + contenidos SCORM", version:"v1.5", size:"—" },
  { id:"DEL-015", milestone:"Georreferenciación predial Llanos Orientales", project:"PRJ-019", responsible:"Tomás Herrera", deadline:"2026-11-30", delivered:null, status:"Pendiente", type:"Datos", deliverable:"Capas GIS + metadatos ISO 19139", version:"v1.0", size:"—" },
  { id:"DEL-016", milestone:"Sistema penitenciario módulo biometría", project:"PRJ-020", responsible:"Sandra León", deadline:"2026-11-30", delivered:null, status:"En progreso", type:"Software", deliverable:"Integración AFIS + SDK", version:"v0.9", size:"—" },
  { id:"DEL-017", milestone:"Cierre Red Hospitalaria Sur Bogotá", project:"PRJ-021", responsible:"Germán Vega", deadline:"2026-06-30", delivered:"2026-06-28", status:"Entregado", type:"Cierre", deliverable:"Acta + manual operación", version:"Final", size:"5 MB" },
  { id:"DEL-018", milestone:"Módulo trámites Cundinamarca v1", project:"PRJ-022", responsible:"Laura Méndez", deadline:"2026-11-01", delivered:null, status:"Pendiente", type:"Software", deliverable:"Módulo + pruebas aceptación", version:"v0.5", size:"—" },
  { id:"DEL-019", milestone:"Migración cloud Fiscalía Fase 1 (Dev/QA)", project:"PRJ-023", responsible:"Nicolás Arango", deadline:"2026-11-30", delivered:null, status:"En progreso", type:"Infraestructura", deliverable:"Entornos AWS + pipelines CI/CD", version:"v1.0", size:"—" },
  { id:"DEL-020", milestone:"Red sensores agua piloto 3 municipios", project:"PRJ-024", responsible:"Catalina Díaz", deadline:"2026-10-31", delivered:null, status:"Pendiente", type:"Hardware", deliverable:"3 estaciones + dashboard", version:"v1.0", size:"—" },
  { id:"DEL-021", milestone:"Automatización aduana Cartagena Fase 1", project:"PRJ-014", responsible:"Isabel Paredes", deadline:"2026-11-15", delivered:null, status:"En progreso", type:"Software", deliverable:"RPA + manual usuario", version:"v1.1", size:"—" },
  { id:"DEL-022", milestone:"Sistema alertas IDEAM prototipo", project:"PRJ-015", responsible:"Roberto Nieto", deadline:"2026-11-15", delivered:null, status:"Pendiente", type:"Software", deliverable:"API + dashboard tiempo real", version:"v0.4", size:"—" },
];

/* ── SECURITY EVENTS — 24 records ── */
export const securityEvents: SecurityEvent[] = [
  { id:"SEC-001", timestamp:"2026-09-08 09:14:22", user:"admin@projegov.co", role:"Administrador", action:"LOGIN", module:"Auth", resource:"/auth/session", ip:"192.168.10.5", device:"Chrome/Win11", severity:"Info", result:"Exitoso" },
  { id:"SEC-002", timestamp:"2026-09-08 09:15:03", user:"camila.ruiz@projegov.co", role:"Líder Proyecto", action:"EXPORT", module:"Proyectos", resource:"PRJ-002/report.pdf", ip:"10.20.5.12", device:"Edge/Win11", severity:"Aviso", result:"Exitoso" },
  { id:"SEC-003", timestamp:"2026-09-08 08:52:11", user:"unknown@ext.gov.co", role:"—", action:"LOGIN_FAIL", module:"Auth", resource:"/auth/login", ip:"185.234.219.12", device:"curl/7.81", severity:"Alerta", result:"Fallido" },
  { id:"SEC-004", timestamp:"2026-09-08 08:50:34", user:"unknown@ext.gov.co", role:"—", action:"LOGIN_FAIL", module:"Auth", resource:"/auth/login", ip:"185.234.219.12", device:"curl/7.81", severity:"Alerta", result:"Fallido" },
  { id:"SEC-005", timestamp:"2026-09-08 08:48:01", user:"unknown@ext.gov.co", role:"—", action:"LOGIN_FAIL", module:"Auth", resource:"/auth/login", ip:"185.234.219.12", device:"curl/7.81", severity:"Crítico", result:"Denegado" },
  { id:"SEC-006", timestamp:"2026-09-08 08:30:15", user:"sofia.castillo@projegov.co", role:"Evaluador", action:"VIEW", module:"Entregas", resource:"DEL-004", ip:"10.20.5.45", device:"Firefox/Ubuntu", severity:"Info", result:"Exitoso" },
  { id:"SEC-007", timestamp:"2026-09-08 07:55:40", user:"admin@projegov.co", role:"Administrador", action:"ROLE_CHANGE", module:"Seguridad", resource:"user:EVA-013", ip:"192.168.10.5", device:"Chrome/Win11", severity:"Aviso", result:"Exitoso" },
  { id:"SEC-008", timestamp:"2026-09-07 22:10:03", user:"batch_svc@system", role:"Servicio", action:"BACKUP", module:"Sistema", resource:"db_full_backup", ip:"127.0.0.1", device:"System", severity:"Info", result:"Exitoso" },
  { id:"SEC-009", timestamp:"2026-09-07 18:30:22", user:"nicolas.arango@projegov.co", role:"Líder Proyecto", action:"DELETE", module:"Documentos", resource:"DOC-0234", ip:"10.20.5.88", device:"Chrome/macOS", severity:"Aviso", result:"Exitoso" },
  { id:"SEC-010", timestamp:"2026-09-07 17:05:11", user:"valentina.torres@projegov.co", role:"Auditor", action:"ACCESS_DENIED", module:"SIIF", resource:"/siif/admin", ip:"10.20.6.11", device:"Edge/Win10", severity:"Alerta", result:"Denegado" },
  { id:"SEC-011", timestamp:"2026-09-07 15:22:44", user:"admin@projegov.co", role:"Administrador", action:"CONFIG_CHANGE", module:"Sistema", resource:"session_timeout=30m", ip:"192.168.10.5", device:"Chrome/Win11", severity:"Aviso", result:"Exitoso" },
  { id:"SEC-012", timestamp:"2026-09-07 14:11:30", user:"paola.vargas@projegov.co", role:"Evaluador", action:"EXPORT", module:"Biometría", resource:"bio_report_Q3.xlsx", ip:"10.20.5.55", device:"Chrome/Win11", severity:"Aviso", result:"Exitoso" },
  { id:"SEC-013", timestamp:"2026-09-07 11:45:09", user:"monitor_svc@system", role:"Servicio", action:"CERT_EXPIRY_WARN", module:"PKI", resource:"prod.sispro.gov.co", ip:"127.0.0.1", device:"System", severity:"Crítico", result:"Aviso" },
  { id:"SEC-014", timestamp:"2026-09-07 10:30:58", user:"luis.fernandez@projegov.co", role:"Líder Proyecto", action:"UPLOAD", module:"Entregas", resource:"DEL-003/build_v0.8.zip", ip:"10.20.5.20", device:"Chrome/macOS", severity:"Info", result:"Exitoso" },
  { id:"SEC-015", timestamp:"2026-09-06 16:44:22", user:"admin@projegov.co", role:"Administrador", action:"MFA_DISABLE", module:"Auth", resource:"user:jorge.castro", ip:"192.168.10.5", device:"Chrome/Win11", severity:"Alerta", result:"Exitoso" },
  { id:"SEC-016", timestamp:"2026-09-06 14:10:05", user:"diana.munoz@projegov.co", role:"Solucionador", action:"COMMENT", module:"Issues", resource:"SOL-002", ip:"10.20.5.32", device:"Firefox/Win11", severity:"Info", result:"Exitoso" },
  { id:"SEC-017", timestamp:"2026-09-06 09:05:33", user:"scan_svc@system", role:"Servicio", action:"VULN_SCAN", module:"Seguridad", resource:"PRJ-008/webapp", ip:"127.0.0.1", device:"System", severity:"Info", result:"Exitoso" },
  { id:"SEC-018", timestamp:"2026-09-05 20:00:01", user:"batch_svc@system", role:"Servicio", action:"REPORT_GEN", module:"Reportes", resource:"dashboard_weekly.pdf", ip:"127.0.0.1", device:"System", severity:"Info", result:"Exitoso" },
  { id:"SEC-019", timestamp:"2026-09-05 17:33:14", user:"hernan.castro@ext.co", role:"Auditor Externo", action:"VIEW", module:"Auditorías", resource:"AUD-002/findings", ip:"200.21.100.5", device:"Chrome/Win10", severity:"Aviso", result:"Exitoso" },
  { id:"SEC-020", timestamp:"2026-09-05 11:22:40", user:"gloria.rivas@ext.co", role:"Auditor Externo", action:"SUBMIT", module:"Auditorías", resource:"AUD-002/report", ip:"190.5.12.88", device:"Edge/Win11", severity:"Aviso", result:"Exitoso" },
  { id:"SEC-021", timestamp:"2026-09-04 09:15:00", user:"admin@projegov.co", role:"Administrador", action:"USER_CREATE", module:"Seguridad", resource:"user:catalina.diaz", ip:"192.168.10.5", device:"Chrome/Win11", severity:"Info", result:"Exitoso" },
  { id:"SEC-022", timestamp:"2026-09-03 22:05:11", user:"batch_svc@system", role:"Servicio", action:"BACKUP_FAIL", module:"Sistema", resource:"db_full_backup", ip:"127.0.0.1", device:"System", severity:"Crítico", result:"Fallido" },
  { id:"SEC-023", timestamp:"2026-09-03 15:40:22", user:"admin@projegov.co", role:"Administrador", action:"PERM_REVOKE", module:"Seguridad", resource:"user:ext_contractor", ip:"192.168.10.5", device:"Chrome/Win11", severity:"Aviso", result:"Exitoso" },
  { id:"SEC-024", timestamp:"2026-09-02 08:30:00", user:"admin@projegov.co", role:"Administrador", action:"POLICY_UPDATE", module:"Seguridad", resource:"pwd_policy_v3.json", ip:"192.168.10.5", device:"Chrome/Win11", severity:"Aviso", result:"Exitoso" },
];

/* ── USER ROLES — 16 records ── */
export const userRoles: UserRole[] = [
  { id:"USR-001", name:"Admin. General", email:"admin@projegov.co", role:"Administrador", department:"Dirección TI", lastLogin:"2026-09-08 09:14", status:"Activo", mfa:true, sessions:1, permissions:["*"] },
  { id:"USR-002", name:"Andrés Mora", email:"andres.mora@projegov.co", role:"Líder Proyecto", department:"Gestión Proyectos", lastLogin:"2026-09-08 08:45", status:"Activo", mfa:true, sessions:1, permissions:["PRJ:read","PRJ:write","DEL:read","DEL:write","SOL:read"] },
  { id:"USR-003", name:"Camila Ruiz", email:"camila.ruiz@projegov.co", role:"Líder Proyecto", department:"Infraestructura", lastLogin:"2026-09-08 09:01", status:"Activo", mfa:true, sessions:1, permissions:["PRJ:read","PRJ:write","DEL:read","DEL:write"] },
  { id:"USR-004", name:"Patricia Herrera", email:"patricia.herrera@projegov.co", role:"Evaluador", department:"Calidad", lastLogin:"2026-09-07 17:20", status:"Activo", mfa:true, sessions:0, permissions:["EVA:read","EVA:write","PRJ:read"] },
  { id:"USR-005", name:"Hernán Castro", email:"hernan.castro@ext.co", role:"Auditor Externo", department:"Externo", lastLogin:"2026-09-05 17:30", status:"Activo", mfa:false, sessions:0, permissions:["AUD:read","AUD:write"] },
  { id:"USR-006", name:"Gloria Rivas", email:"gloria.rivas@ext.co", role:"Auditor Externo", department:"Externo", lastLogin:"2026-09-05 11:20", status:"Activo", mfa:false, sessions:0, permissions:["AUD:read","AUD:write"] },
  { id:"USR-007", name:"Diana Muñoz", email:"diana.munoz@projegov.co", role:"Solucionador", department:"Soporte TI", lastLogin:"2026-09-06 14:08", status:"Activo", mfa:true, sessions:1, permissions:["SOL:read","SOL:write","PRJ:read"] },
  { id:"USR-008", name:"Sebastián Rojas", email:"sebastian.rojas@projegov.co", role:"Solucionador", department:"Soporte TI", lastLogin:"2026-09-08 07:30", status:"Activo", mfa:true, sessions:1, permissions:["SOL:read","SOL:write"] },
  { id:"USR-009", name:"Sofía Castillo", email:"sofia.castillo@projegov.co", role:"Evaluador", department:"Catastro", lastLogin:"2026-09-08 08:50", status:"Activo", mfa:true, sessions:1, permissions:["EVA:read","EVA:write","PRJ:read","DEL:read"] },
  { id:"USR-010", name:"Ricardo Peña", email:"ricardo.pena@projegov.co", role:"Líder Proyecto", department:"Salud", lastLogin:"2026-09-01 10:00", status:"Activo", mfa:true, sessions:0, permissions:["PRJ:read","PRJ:write","DEL:read","DEL:write"] },
  { id:"USR-011", name:"Jorge Castro", email:"jorge.castro@projegov.co", role:"Líder Proyecto", department:"ERP", lastLogin:"2026-09-07 09:15", status:"Activo", mfa:false, sessions:0, permissions:["PRJ:read","PRJ:write"] },
  { id:"USR-012", name:"Paola Vargas", email:"paola.vargas@projegov.co", role:"Evaluador", department:"Electoral", lastLogin:"2026-09-07 15:20", status:"Activo", mfa:true, sessions:0, permissions:["EVA:read","EVA:write","PRJ:read"] },
  { id:"USR-013", name:"Nicolás Arango", email:"nicolas.arango@projegov.co", role:"Líder Proyecto", department:"Cloud", lastLogin:"2026-09-07 18:25", status:"Activo", mfa:true, sessions:1, permissions:["PRJ:read","PRJ:write","DEL:read","DEL:write","SOL:read","SOL:write"] },
  { id:"USR-014", name:"ext_contractor", email:"ext@contractor.io", role:"Contratista", department:"Externo", lastLogin:"2026-09-02 14:00", status:"Suspendido", mfa:false, sessions:0, permissions:[] },
  { id:"USR-015", name:"Monitor Service", email:"monitor_svc@system", role:"Servicio Sistema", department:"Sistema", lastLogin:"2026-09-08 00:00", status:"Activo", mfa:false, sessions:1, permissions:["SYS:monitor"] },
  { id:"USR-016", name:"Batch Service", email:"batch_svc@system", role:"Servicio Sistema", department:"Sistema", lastLogin:"2026-09-08 22:00", status:"Activo", mfa:false, sessions:1, permissions:["SYS:batch","DB:backup"] },
];
