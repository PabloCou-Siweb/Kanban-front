import React from 'react';
import Sidebar, { SidebarProject, DEFAULT_PROJECTS } from '../Sidebar/Sidebar';
import Header, { HeaderProps } from '../Header/Header';

type ReleaseStatus = 'En progreso' | 'Sin lanzar' | 'Publicado';

type ReleaseProgressSegment = {
  title: string;
  value: number;
  colorClass: string;
};

type ReleaseRow = {
  version: string;
  status: ReleaseStatus;
  progress: ReleaseProgressSegment[];
  startDate: string;
  releaseDate: string;
  description: string;
};

type TimelineColumn = {
  id: string;
  label: string;
  secondaryLabel?: string;
};

type TimelineItem = {
  id: string;
  label: string;
  type: 'release' | 'sprint';
  status: 'En progreso' | 'Completado' | 'Pendiente';
  start: number;
  end: number;
  accent: string;
};

type ReleaseFormState = {
  version: string;
  status: ReleaseStatus;
  startDate: string;
  releaseDate: string;
  description: string;
  progress: ReleaseProgressSegment[];
};

type TimelineFormState = {
  id?: string;
  label: string;
  type: TimelineItem['type'];
  status: TimelineItem['status'];
  start: number;
  end: number;
};

const RELEASE_STATUS_STYLES: Record<ReleaseStatus, string> = {
  'En progreso': 'bg-blue-100 text-blue-700 border border-blue-200',
  'Sin lanzar': 'bg-amber-100 text-amber-700 border border-amber-200',
  Publicado: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
};

const INITIAL_RELEASE_ROWS: ReleaseRow[] = [
  {
    version: 'Versión 4.0',
    status: 'En progreso',
    progress: [
      { title: 'Desarrollo', value: 45, colorClass: 'bg-blue-500' },
      { title: 'QA', value: 25, colorClass: 'bg-amber-400' },
      { title: 'Pendiente', value: 30, colorClass: 'bg-slate-200' },
    ],
    startDate: '2025-05-17',
    releaseDate: '',
    description: 'Panel de analítica avanzada y automatización de reportes.',
  },
  {
    version: 'Versión 3.0',
    status: 'Sin lanzar',
    progress: [
      { title: 'Preparación', value: 20, colorClass: 'bg-emerald-500' },
      { title: 'Revisión', value: 15, colorClass: 'bg-blue-500' },
      { title: 'Pendiente', value: 65, colorClass: 'bg-slate-200' },
    ],
    startDate: '2025-04-12',
    releaseDate: '',
    description: 'Integración con CRM corporativo y sincronización bidireccional.',
  },
  {
    version: 'Versión 2.0',
    status: 'Publicado',
    progress: [{ title: 'Completado', value: 100, colorClass: 'bg-emerald-500' }],
    startDate: '2025-02-10',
    releaseDate: '2025-03-26',
    description: 'Optimización de tableros y automatismos de etiquetas.',
  },
  {
    version: 'Versión 1.6',
    status: 'Publicado',
    progress: [{ title: 'Completado', value: 100, colorClass: 'bg-emerald-500' }],
    startDate: '2025-01-04',
    releaseDate: '2025-02-18',
    description: 'Actualización de componentes colaborativos para squads remotos.',
  },
  {
    version: 'Versión 1.5',
    status: 'Publicado',
    progress: [{ title: 'Completado', value: 100, colorClass: 'bg-emerald-500' }],
    startDate: '2024-11-30',
    releaseDate: '2025-01-17',
    description: 'Mejoras de rendimiento en vistas de backlog y board.',
  },
];

const TIMELINE_COLUMNS: TimelineColumn[] = [
  { id: 'may-1', label: 'May', secondaryLabel: 'Semana 1' },
  { id: 'may-2', label: '', secondaryLabel: 'Semana 2' },
  { id: 'may-3', label: '', secondaryLabel: 'Semana 3' },
  { id: 'may-4', label: '', secondaryLabel: 'Semana 4' },
  { id: 'jun-1', label: 'Jun', secondaryLabel: 'Semana 1' },
  { id: 'jun-2', label: '', secondaryLabel: 'Semana 2' },
  { id: 'jun-3', label: '', secondaryLabel: 'Semana 3' },
  { id: 'jun-4', label: '', secondaryLabel: 'Semana 4' },
  { id: 'jul-1', label: 'Jul', secondaryLabel: 'Semana 1' },
  { id: 'jul-2', label: '', secondaryLabel: 'Semana 2' },
];

const INITIAL_TIMELINE_ITEMS: TimelineItem[] = [
  {
    id: 'release-40',
    label: 'Versión 4.0 · Go-live',
    type: 'release',
    status: 'En progreso',
    start: 1,
    end: 6,
    accent: 'bg-blue-500',
  },
  {
    id: 'release-30',
    label: 'Versión 3.0 · Integración CRM',
    type: 'release',
    status: 'Pendiente',
    start: 3,
    end: 7,
    accent: 'bg-amber-400',
  },
  {
    id: 'release-28',
    label: 'Versión 2.8 · Performance',
    type: 'release',
    status: 'Completado',
    start: 5,
    end: 8,
    accent: 'bg-emerald-500',
  },
  {
    id: 'sprint-alpha',
    label: 'Sprint Alpha',
    type: 'sprint',
    status: 'Completado',
    start: 1,
    end: 3,
    accent: 'bg-sky-500',
  },
  {
    id: 'sprint-beta',
    label: 'Sprint Beta',
    type: 'sprint',
    status: 'En progreso',
    start: 3,
    end: 5,
    accent: 'bg-sky-500',
  },
  {
    id: 'sprint-gamma',
    label: 'Sprint Gamma',
    type: 'sprint',
    status: 'Pendiente',
    start: 5,
    end: 7,
    accent: 'bg-sky-300',
  },
];

const defaultReleaseProgressForStatus = (status: ReleaseStatus): ReleaseProgressSegment[] => {
  if (status === 'Publicado') {
    return [{ title: 'Completado', value: 100, colorClass: 'bg-emerald-500' }];
  }

  if (status === 'Sin lanzar') {
    return [
      { title: 'Preparación', value: 20, colorClass: 'bg-emerald-500' },
      { title: 'Revisión', value: 15, colorClass: 'bg-blue-500' },
      { title: 'Pendiente', value: 65, colorClass: 'bg-slate-200' },
    ];
  }

  return [
    { title: 'Desarrollo', value: 45, colorClass: 'bg-blue-500' },
    { title: 'QA', value: 25, colorClass: 'bg-amber-400' },
    { title: 'Pendiente', value: 30, colorClass: 'bg-slate-200' },
  ];
};

const getTimelineAccent = (type: TimelineItem['type'], status: TimelineItem['status']): string => {
  if (type === 'release') {
    if (status === 'Completado') return 'bg-emerald-500';
    if (status === 'En progreso') return 'bg-blue-500';
    return 'bg-amber-400';
  }

  if (status === 'Completado') return 'bg-sky-500';
  if (status === 'En progreso') return 'bg-sky-500';
  return 'bg-sky-300';
};

const formatDisplayDate = (value: string): string => {
  if (!value) {
    return 'Por definir';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

type ReleasesPageProps = {
  project?: SidebarProject | null;
  projects?: SidebarProject[];
  selectedId: string;
  onSelect: (projectId: string) => void;
  onBack?: () => void;
  onProfileClick?: () => void;
  onLogout?: () => void;
  headerNotifications?: HeaderProps['notifications'];
  currentUser?: {
    name: string;
    role: 'admin' | 'product-owner' | 'employee';
  };
};

const CURRENT_USER_FALLBACK = {
  name: 'María Sánchez',
  role: 'employee' as const,
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
  currentUser = CURRENT_USER_FALLBACK,
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);

  const [releaseRows, setReleaseRows] = React.useState<ReleaseRow[]>(INITIAL_RELEASE_ROWS);
  const [timelineItems, setTimelineItems] = React.useState<TimelineItem[]>(INITIAL_TIMELINE_ITEMS);

  const [showReleaseModal, setShowReleaseModal] = React.useState(false);
  const [editingReleaseIndex, setEditingReleaseIndex] = React.useState<number | null>(null);
  const [releaseForm, setReleaseForm] = React.useState<ReleaseFormState>({
    version: '',
    status: 'En progreso',
    startDate: '',
    releaseDate: '',
    description: '',
    progress: defaultReleaseProgressForStatus('En progreso'),
  });

  const [showTimelineModal, setShowTimelineModal] = React.useState(false);
  const [editingTimelineIndex, setEditingTimelineIndex] = React.useState<number | null>(null);
  const [timelineForm, setTimelineForm] = React.useState<TimelineFormState>({
    label: '',
    type: 'release',
    status: 'En progreso',
    start: 1,
    end: 2,
  });

  const projectList = React.useMemo(() => projects ?? DEFAULT_PROJECTS, [projects]);
  const canManageReleases = currentUser.role === 'admin' || currentUser.role === 'product-owner';

  const handleOpenNewReleaseModal = () => {
    if (!canManageReleases) return;
    setEditingReleaseIndex(null);
    setReleaseForm({
      version: '',
      status: 'En progreso',
      startDate: '',
      releaseDate: '',
      description: '',
      progress: defaultReleaseProgressForStatus('En progreso'),
    });
    setShowReleaseModal(true);
  };

  const handleEditRelease = (index: number) => {
    if (!canManageReleases) return;
    const release = releaseRows[index];
    setEditingReleaseIndex(index);
    setReleaseForm({
      version: release.version,
      status: release.status,
      startDate: release.startDate,
      releaseDate: release.releaseDate,
      description: release.description,
      progress: release.progress.map((segment) => ({ ...segment })),
    });
    setShowReleaseModal(true);
  };

  const handleCloseReleaseModal = () => {
    setShowReleaseModal(false);
  };

  const handleReleaseFieldChange = (field: keyof ReleaseFormState, value: string | ReleaseStatus) => {
    if (!canManageReleases) return;
    setReleaseForm((prev) => ({
      ...prev,
      [field]: value,
      progress: field === 'status' ? defaultReleaseProgressForStatus(value as ReleaseStatus) : prev.progress,
    }));
  };

  const handleSubmitRelease = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canManageReleases) return;
    const payload: ReleaseRow = {
      version: releaseForm.version.trim() || 'Nueva versión',
      status: releaseForm.status,
      startDate: releaseForm.startDate,
      releaseDate: releaseForm.releaseDate,
      description: releaseForm.description.trim(),
      progress: defaultReleaseProgressForStatus(releaseForm.status),
    };

    if (editingReleaseIndex !== null) {
      setReleaseRows((prev) => prev.map((row, index) => (index === editingReleaseIndex ? payload : row)));
    } else {
      setReleaseRows((prev) => [payload, ...prev]);
    }

    setShowReleaseModal(false);
  };

  const handleDeleteRelease = (index: number) => {
    if (!canManageReleases) return;
    setReleaseRows((prev) => prev.filter((_, rowIndex) => rowIndex !== index));
  };

  const handleOpenNewTimelineModal = () => {
    if (!canManageReleases) return;
    setEditingTimelineIndex(null);
    setTimelineForm({
      label: '',
      type: 'release',
      status: 'En progreso',
      start: 1,
      end: 2,
    });
    setShowTimelineModal(true);
  };

  const handleEditTimeline = (index: number) => {
    if (!canManageReleases) return;
    const item = timelineItems[index];
    setEditingTimelineIndex(index);
    setTimelineForm({
      id: item.id,
      label: item.label,
      type: item.type,
      status: item.status,
      start: item.start,
      end: item.end,
    });
    setShowTimelineModal(true);
  };

  const handleCloseTimelineModal = () => {
    setShowTimelineModal(false);
  };

  const handleTimelineFieldChange = <K extends keyof TimelineFormState>(field: K, value: TimelineFormState[K]) => {
    if (!canManageReleases) return;
    setTimelineForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmitTimeline = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canManageReleases) return;
    const start = Math.max(1, Math.min(10, Number(timelineForm.start) || 1));
    const end = Math.max(start, Math.min(10, Number(timelineForm.end) || start));

    const payload: TimelineItem = {
      id: timelineForm.id ?? `timeline-${Date.now()}`,
      label: timelineForm.label.trim() || (timelineForm.type === 'release' ? 'Nuevo release' : 'Nuevo sprint'),
      type: timelineForm.type,
      status: timelineForm.status,
      start,
      end,
      accent: getTimelineAccent(timelineForm.type, timelineForm.status),
    };

    if (editingTimelineIndex !== null) {
      setTimelineItems((prev) => prev.map((item, index) => (index === editingTimelineIndex ? payload : item)));
    } else {
      setTimelineItems((prev) => [payload, ...prev]);
    }

    setShowTimelineModal(false);
  };

  const handleDeleteTimelineItem = (index: number) => {
    if (!canManageReleases) return;
    setTimelineItems((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  };

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
              {canManageReleases && (
                <button
                  type="button"
                  onClick={handleOpenNewReleaseModal}
                  className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-blue-600 transition hover:border-blue-300"
                >
                  Crear versión
                </button>
              )}
            </div>
            <p className="mt-4 max-w-3xl text-sm text-slate-600">
              Consulta todas las iteraciones planeadas, su avance y fechas relevantes. Utiliza la tabla y la vista de timeline
              para coordinar lanzamientos con tu equipo de producto, diseño y desarrollo.
            </p>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-lg shadow-slate-900/5">
            <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">Planeación de versiones</h3>
                <p className="text-xs text-slate-500">
                  Filtra y consulta el estado actual de cada release, incluyendo fechas, progreso y notas relevantes.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500">
                  <span className="text-slate-400">Buscar</span>
                  <input
                    type="search"
                    placeholder="Filtrar versiones..."
                    className="w-36 bg-transparent text-xs text-slate-600 placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600 transition hover:border-blue-200 hover:text-blue-600"
                >
                  Todos los estados
                </button>
              </div>
            </header>

            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full text-left text-sm text-slate-600">
                <thead className="text-xs uppercase tracking-[0.25em] text-slate-400">
                  <tr className="border-b border-slate-200">
                    <th className="px-3 py-3 font-semibold">Versión</th>
                    <th className="px-3 py-3 font-semibold">Estado</th>
                    <th className="px-3 py-3 font-semibold">Inicio</th>
                    <th className="px-3 py-3 font-semibold">Lanzamiento</th>
                    <th className="px-3 py-3 font-semibold">Descripción</th>
                    {canManageReleases && <th className="px-3 py-3 font-semibold">Acciones</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {releaseRows.map((row, index) => (
                    <tr key={`${row.version}-${index}`} className="hover:bg-slate-50">
                      <td className="px-3 py-4 font-semibold text-slate-900">{row.version}</td>
                      <td className="px-3 py-4">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${RELEASE_STATUS_STYLES[row.status]}`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="px-3 py-4 text-xs text-slate-500">{formatDisplayDate(row.startDate)}</td>
                      <td className="px-3 py-4 text-xs text-slate-500">{formatDisplayDate(row.releaseDate)}</td>
                      <td className="px-3 py-4 text-xs text-slate-500">{row.description || 'Sin descripción'}</td>
                      {canManageReleases && (
                        <td className="px-3 py-4 text-xs">
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleEditRelease(index)}
                              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500 transition hover:border-blue-200 hover:text-blue-600"
                            >
                              Editar
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteRelease(index)}
                              className="inline-flex items-center gap-2 rounded-full border border-rose-200 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-rose-500 transition hover:border-rose-300 hover:text-rose-600"
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-lg shadow-slate-900/5">
            <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">
                  Cronograma de releases y sprints
                </h3>
                <p className="text-xs text-slate-500">
                  Visualiza la superposición de lanzamientos con los sprints activos y planificados.
                </p>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                <span className="inline-flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-blue-500" /> Releases
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-sky-500" /> Sprints
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" /> Completado
                </span>
                {canManageReleases && (
                  <button
                    type="button"
                    onClick={handleOpenNewTimelineModal}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600 transition hover:border-blue-200 hover:text-blue-600"
                  >
                    Añadir elemento
                  </button>
                )}
              </div>
            </header>

            <div className="mt-6 overflow-x-auto">
              <div className="min-w-[720px] space-y-4">
                <div className="grid grid-cols-[120px_minmax(0,1fr)] gap-4 text-xs text-slate-400">
                  <div />
                  <div className="grid grid-cols-10 gap-2">
                    {TIMELINE_COLUMNS.map((column) => (
                      <div key={column.id} className="flex flex-col items-center gap-1">
                        <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                          {column.label}
                        </span>
                        <span className="text-[11px] text-slate-300">{column.secondaryLabel}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  {timelineItems.map((item, index) => (
                    <div key={item.id} className="grid grid-cols-[160px_minmax(0,1fr)] items-start gap-4">
                      <div className="flex flex-col gap-2 text-xs text-slate-600">
                        <span className="font-semibold text-slate-800">{item.label}</span>
                        <span className="text-[11px] text-slate-400">{item.type === 'release' ? 'Release' : 'Sprint'} · {item.status}</span>
                        {canManageReleases && (
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => handleEditTimeline(index)}
                              className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500 transition hover:border-blue-200 hover:text-blue-600"
                            >
                              Editar
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteTimelineItem(index)}
                              className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400 transition hover:border-rose-300 hover:text-rose-600"
                            >
                              Eliminar
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-10 gap-2 py-1">
                        <div
                          className={`flex h-7 items-center justify-center rounded-full text-[11px] font-semibold text-white shadow-sm shadow-slate-900/10 ${item.accent}`}
                          style={{ gridColumn: `${item.start} / ${item.end + 1}` }}
                        >
                          {item.type === 'release' ? 'Release' : 'Sprint'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
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

      {showReleaseModal && canManageReleases && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 px-6 py-10">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
            <header className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {editingReleaseIndex !== null ? 'Editar versión' : 'Nueva versión'}
                </h2>
                <p className="text-xs text-slate-500">
                  Define los datos clave del lanzamiento y ajusta las fechas previstas.
                </p>
              </div>
              <button
                type="button"
                onClick={handleCloseReleaseModal}
                className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-400 transition hover:border-slate-300 hover:text-slate-600"
              >
                Cerrar
              </button>
            </header>

            <form onSubmit={handleSubmitRelease} className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Versión
                  <input
                    type="text"
                    value={releaseForm.version}
                    onChange={(event) => handleReleaseFieldChange('version', event.target.value)}
                    placeholder="Ej. Versión 4.1"
                    className="rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    required
                  />
                </label>
                <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Estado
                  <select
                    value={releaseForm.status}
                    onChange={(event) => handleReleaseFieldChange('status', event.target.value as ReleaseStatus)}
                    className="rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="En progreso">En progreso</option>
                    <option value="Sin lanzar">Sin lanzar</option>
                    <option value="Publicado">Publicado</option>
                  </select>
                </label>
                <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Fecha de inicio
                  <input
                    type="date"
                    value={releaseForm.startDate}
                    onChange={(event) => handleReleaseFieldChange('startDate', event.target.value)}
                    className="rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </label>
                <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Fecha de lanzamiento
                  <input
                    type="date"
                    value={releaseForm.releaseDate}
                    onChange={(event) => handleReleaseFieldChange('releaseDate', event.target.value)}
                    className="rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </label>
              </div>

              <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Descripción
                <textarea
                  value={releaseForm.description}
                  onChange={(event) => handleReleaseFieldChange('description', event.target.value)}
                  placeholder="Contexto del release, alcance, dependencias..."
                  className="min-h-[120px] rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </label>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseReleaseModal}
                  className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-500 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-500"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showTimelineModal && canManageReleases && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 px-6 py-10">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl">
            <header className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {editingTimelineIndex !== null ? 'Editar elemento' : 'Nuevo elemento en timeline'}
                </h2>
                <p className="text-xs text-slate-500">Configura las fechas que ocupará este release o sprint en el cronograma.</p>
              </div>
              <button
                type="button"
                onClick={handleCloseTimelineModal}
                className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-400 transition hover:border-slate-300 hover:text-slate-600"
              >
                Cerrar
              </button>
            </header>

            <form onSubmit={handleSubmitTimeline} className="space-y-4">
              <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Nombre
                <input
                  type="text"
                  value={timelineForm.label}
                  onChange={(event) => handleTimelineFieldChange('label', event.target.value)}
                  placeholder="Ej. Sprint Delta"
                  className="rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  required
                />
              </label>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Tipo
                  <select
                    value={timelineForm.type}
                    onChange={(event) => handleTimelineFieldChange('type', event.target.value as TimelineItem['type'])}
                    className="rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="release">Release</option>
                    <option value="sprint">Sprint</option>
                  </select>
                </label>

                <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Estado
                  <select
                    value={timelineForm.status}
                    onChange={(event) => handleTimelineFieldChange('status', event.target.value as TimelineItem['status'])}
                    className="rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="En progreso">En progreso</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Completado">Completado</option>
                  </select>
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Columna de inicio
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={timelineForm.start}
                    onChange={(event) => handleTimelineFieldChange('start', Number(event.target.value))}
                    className="rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </label>
                <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Columna de fin
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={timelineForm.end}
                    onChange={(event) => handleTimelineFieldChange('end', Number(event.target.value))}
                    className="rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </label>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseTimelineModal}
                  className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-500 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-500"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReleasesPage;