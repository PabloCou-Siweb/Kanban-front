import React from 'react';
import Sidebar, { SidebarProject, DEFAULT_PROJECTS } from '../Sidebar/Sidebar';
import Header, { HeaderProps } from '../Header/Header';

type ReleasePhaseStatus = 'completed' | 'in-progress' | 'pending';

type ReleasePhase = {
  name: string;
  start: string;
  end: string;
  owner: string;
  status: ReleasePhaseStatus;
};

type ReleaseSummary = {
  id: string;
  title: string;
  targetDate: string;
  description: string;
  status: 'Planificado' | 'En progreso' | 'En validación' | 'Publicado';
  phases: ReleasePhase[];
  checklist: Array<{ label: string; completed: boolean }>;
};

const RELEASE_PHASE_STATUS_STYLES: Record<ReleasePhaseStatus, string> = {
  completed: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  'in-progress': 'border-blue-200 bg-blue-50 text-blue-600',
  pending: 'border-slate-200 bg-white text-slate-500',
};

const RELEASES: ReleaseSummary[] = [
  {
    id: 'rel-2025-04',
    title: 'Release 2025.04 · Panel de métricas',
    targetDate: '20 de abril 2025',
    description:
      'Entrega enfocada en analítica de uso, panel de métricas y reportes automatizados para stakeholders clave.',
    status: 'En validación',
    phases: [
      { name: 'Descubrimiento', start: '03 Mar', end: '07 Mar', owner: 'Product Research', status: 'completed' },
      { name: 'Diseño UX/UI', start: '08 Mar', end: '15 Mar', owner: 'Product Design', status: 'completed' },
      { name: 'Desarrollo', start: '16 Mar', end: '08 Abr', owner: 'Frontend + Backend', status: 'in-progress' },
      { name: 'QA & UAT', start: '09 Abr', end: '16 Abr', owner: 'QA Team', status: 'pending' },
      { name: 'Deploy & Comunicación', start: '17 Abr', end: '20 Abr', owner: 'Release Engineering', status: 'pending' },
    ],
    checklist: [
      { label: 'Freeze funcional', completed: true },
      { label: 'Checklist de accesibilidad', completed: false },
      { label: 'Plan de comunicación aprobado', completed: false },
    ],
  },
  {
    id: 'rel-2025-05',
    title: 'Release 2025.05 · Integración con CRM',
    targetDate: '30 de mayo 2025',
    description:
      'Integración bidireccional con CRM corporativo y sincronización de tareas con equipos comerciales.',
    status: 'Planificado',
    phases: [
      { name: 'Descubrimiento', start: '22 Abr', end: '26 Abr', owner: 'Product Research', status: 'pending' },
      { name: 'Diseño UX/UI', start: '29 Abr', end: '06 May', owner: 'Product Design', status: 'pending' },
      { name: 'Desarrollo', start: '07 May', end: '23 May', owner: 'Backend + Integraciones', status: 'pending' },
      { name: 'QA & UAT', start: '24 May', end: '28 May', owner: 'QA Team', status: 'pending' },
      { name: 'Deploy & Comunicación', start: '29 May', end: '30 May', owner: 'Release Engineering', status: 'pending' },
    ],
    checklist: [
      { label: 'Definir dependencias externas', completed: false },
      { label: 'Validar contratos de datos', completed: false },
      { label: 'Plan de capacitación a equipos', completed: false },
    ],
  },
];

const RELEASE_CADENCE = [
  {
    milestone: 'Kick-off discovery',
    date: '22 Abr',
    owner: 'Product',
    description: 'Revisión de objetivos trimestrales y estimación preliminar de alcance.',
  },
  {
    milestone: 'Freeze de alcance',
    date: '06 May',
    owner: 'Comité de releases',
    description: 'Validación del backlog final para la ventana de release.',
  },
  {
    milestone: 'QA integrado',
    date: '24 May',
    owner: 'QA + Producto',
    description: 'Plan integral de pruebas funcionales, de regresión y accesibilidad.',
  },
  {
    milestone: 'Deploy + monitoreo',
    date: '30 May',
    owner: 'Release Engineering',
    description: 'Despliegue coordinado, health-check inicial y activación de feature flags.',
  },
];

type ReleasesPageProps = {
  project?: SidebarProject | null;
  projects?: SidebarProject[];
  selectedId: string;
  onSelect: (projectId: string) => void;
  onBack?: () => void;
  onProfileClick?: () => void;
  onLogout?: () => void;
  headerNotifications?: HeaderProps['notifications'];
};

const ReleasesPage: React.FC<ReleasesPageProps> = ({
  project,
  projects = DEFAULT_PROJECTS,
  selectedId,
  onSelect,
  onBack,
  onProfileClick,
  onLogout,
  headerNotifications,
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);

  const projectList = React.useMemo(() => projects ?? DEFAULT_PROJECTS, [projects]);

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900">
      <Sidebar
        projects={projectList}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
        onLogoutRequest={() => setShowLogoutConfirm(true)}
        selectedId={selectedId}
        onSelect={onSelect}
      />

      <div className="flex min-h-screen flex-1 flex-col">
        <Header
          title="Releases"
          onBack={onBack}
          onProfileClick={onProfileClick}
          notifications={headerNotifications}
        />

        <main className="flex flex-1 flex-col gap-6 overflow-hidden p-8">
          <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-slate-900/5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Proyecto</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">{project ? project.name : 'Tablero principal'}</h2>
              </div>
              <div className="flex flex-wrap gap-3 text-xs">
                <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 font-semibold uppercase tracking-wide text-blue-600">
                  Cadencia · Mensual
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 font-semibold uppercase tracking-wide text-slate-500">
                  Última actualización · 09 Abr 2025
                </span>
              </div>
            </div>
            <p className="mt-4 max-w-3xl text-sm text-slate-600">
              Consulta el roadmap de despliegues planificados, el estado de cada fase y las tareas clave previas a la entrega.
              Puedes seguir el progreso de discovery, diseño, desarrollo, QA y salida a producción para cada release importante.
            </p>
          </section>

          <div className="grid gap-6 lg:grid-cols-3">
            <section className="lg:col-span-2 space-y-6">
              {RELEASES.map((release) => (
                <article
                  key={release.id}
                  className="rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-lg shadow-slate-900/5"
                >
                  <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{release.title}</h3>
                      <p className="mt-1 text-sm text-slate-500">{release.description}</p>
                    </div>
                    <div className="flex flex-col items-start gap-2 text-xs text-slate-500 md:items-end">
                      <span className="font-semibold text-slate-700">Salida prevista · {release.targetDate}</span>
                      <span className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-3 py-1 font-semibold uppercase tracking-wide text-purple-600">
                        {release.status}
                      </span>
                    </div>
                  </header>

                  <div className="mt-6 grid gap-4 lg:grid-cols-2">
                    <section className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                      <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Fases del release</h4>
                      <ul className="space-y-2 text-xs text-slate-600">
                        {release.phases.map((phase) => (
                          <li
                            key={`${release.id}-${phase.name}`}
                            className={`flex items-center justify-between gap-3 rounded-2xl border px-3 py-2 ${RELEASE_PHASE_STATUS_STYLES[phase.status]}`}
                          >
                            <div className="flex flex-col gap-1">
                              <span className="text-sm font-semibold text-slate-800">{phase.name}</span>
                              <span className="text-[11px] uppercase tracking-wide text-slate-500">
                                {phase.start} → {phase.end} · {phase.owner}
                              </span>
                            </div>
                            <span
                              className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                                phase.status === 'completed'
                                  ? 'bg-emerald-500 text-white'
                                  : phase.status === 'in-progress'
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-slate-200 text-slate-500'
                              }`}
                              aria-label={phase.status}
                            >
                              {phase.status === 'completed' ? '✓' : phase.status === 'in-progress' ? '•' : '…'}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </section>

                    <section className="space-y-3 rounded-2xl border border-slate-200 bg-white px-4 py-4">
                      <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Checklist previo al lanzamiento</h4>
                      <ul className="space-y-2 text-xs text-slate-600">
                        {release.checklist.map((item) => (
                          <li
                            key={`${release.id}-${item.label}`}
                            className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-3 py-2"
                          >
                            <span>{item.label}</span>
                            <span
                              className={`inline-flex h-6 w-6 items-center justify-center rounded-full border text-xs font-semibold ${
                                item.completed
                                  ? 'border-emerald-200 bg-emerald-50 text-emerald-600'
                                  : 'border-slate-200 bg-white text-slate-400'
                              }`}
                              aria-label={item.completed ? 'Completado' : 'Pendiente'}
                            >
                              {item.completed ? '✓' : '…'}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  </div>
                </article>
              ))}
            </section>

            <aside className="flex h-full flex-col gap-4 rounded-3xl border border-slate-200 bg-white px-5 py-6 shadow-lg shadow-slate-900/5">
              <header>
                <h3 className="text-sm font-semibold text-slate-900">Cadencia y hitos próximos</h3>
                <p className="mt-1 text-xs text-slate-500">
                  Fechas relevantes y responsables de los próximos hitos del roadmap de releases.
                </p>
              </header>

              <div className="mt-2 space-y-4">
                {RELEASE_CADENCE.map((milestone) => (
                  <div
                    key={milestone.milestone}
                    className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600"
                  >
                    <div className="flex items-center justify-between text-[11px] uppercase tracking-wide text-slate-400">
                      <span>{milestone.date}</span>
                      <span className="font-semibold text-slate-500">{milestone.owner}</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-900">{milestone.milestone}</p>
                    <p>{milestone.description}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50/60 px-4 py-4 text-xs text-slate-600">
                <h4 className="text-sm font-semibold text-blue-600">Buenas prácticas de despliegue</h4>
                <ul className="mt-3 space-y-2 list-disc pl-4">
                  <li>Coordina sesiones de retro al cierre de cada release.</li>
                  <li>Activa métricas de observabilidad 48h antes del lanzamiento.</li>
                  <li>Garantiza planes de rollback y comunicación con soporte.</li>
                </ul>
              </div>
            </aside>
          </div>
        </main>
      </div>

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-900/40 px-6">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <h2 className="text-lg font-semibold text-slate-900">¿Cerrar sesión?</h2>
            <p className="mt-2 text-sm text-slate-500">
              Tu sesión se cerrará y deberás volver a iniciar sesión para acceder al tablero.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-500 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLogoutConfirm(false);
                  onLogout?.();
                }}
                className="rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-rose-500/20 transition hover:bg-rose-600"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReleasesPage;
