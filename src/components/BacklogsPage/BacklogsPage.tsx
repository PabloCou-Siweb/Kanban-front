import React from 'react';
import Sidebar, { DEFAULT_PROJECTS, SidebarProject } from '../Sidebar/Sidebar';
import Header, { HeaderProps } from '../Header/Header';

type BacklogActionType =
  | 'create-task'
  | 'assign-task'
  | 'update-status'
  | 'comment'
  | 'add-label'
  | 'edit-task';

type BacklogEntry = {
  id: string;
  timestamp: string;
  author: string;
  actorInitials: string;
  action: BacklogActionType;
  taskId: string;
  taskTitle: string;
  from?: string;
  to?: string;
  notes?: string;
};

type BacklogActivityGroup = {
  date: string;
  entries: BacklogEntry[];
};

const ACTION_LABELS: Record<BacklogActionType, string> = {
  'create-task': 'Creó tarea',
  'assign-task': 'Asignó tarea',
  'update-status': 'Cambió estado',
  comment: 'Comentó',
  'add-label': 'Añadió etiqueta',
  'edit-task': 'Editó tarea',
};

const ACTION_COLORS: Record<BacklogActionType, string> = {
  'create-task': 'border-emerald-200 bg-emerald-50 text-emerald-700',
  'assign-task': 'border-blue-200 bg-blue-50 text-blue-600',
  'update-status': 'border-purple-200 bg-purple-50 text-purple-600',
  comment: 'border-slate-200 bg-white text-slate-600',
  'add-label': 'border-amber-200 bg-amber-50 text-amber-600',
  'edit-task': 'border-sky-200 bg-sky-50 text-sky-600',
};

const BACKLOG_ACTIVITY: BacklogActivityGroup[] = [
  {
    date: '12 Abr 2025',
    entries: [
      {
        id: 'log-1801',
        timestamp: '12 Abr · 10:24',
        author: 'María Sánchez',
        actorInitials: 'MS',
        action: 'update-status',
        taskId: 'KB-305',
        taskTitle: 'Auditoría accesibilidad',
        from: 'Pendiente',
        to: 'En progreso',
        notes: 'Se inicia revisión de criterios AA.',
      },
      {
        id: 'log-1802',
        timestamp: '12 Abr · 09:10',
        author: 'Laura Méndez',
        actorInitials: 'LM',
        action: 'assign-task',
        taskId: 'KB-355',
        taskTitle: 'Preparar plan de lanzamiento',
        to: 'Carlos Ortega',
        notes: 'Se reasigna para reforzar coordinación con ventas.',
      },
      {
        id: 'log-1803',
        timestamp: '12 Abr · 08:55',
        author: 'Carlos Ortega',
        actorInitials: 'CO',
        action: 'comment',
        taskId: 'KB-298',
        taskTitle: 'Sincronización con calendario',
        notes: 'Se añadió comentario sobre validaciones pendientes con el equipo de seguridad.',
      },
    ],
  },
  {
    date: '11 Abr 2025',
    entries: [
      {
        id: 'log-1790',
        timestamp: '11 Abr · 16:40',
        author: 'Ana Rodríguez',
        actorInitials: 'AR',
        action: 'edit-task',
        taskId: 'KB-287',
        taskTitle: 'Validación permisos avanzados',
        notes: 'Actualiza checklist de QA y documentación de casos edge.',
      },
      {
        id: 'log-1789',
        timestamp: '11 Abr · 15:15',
        author: 'Daniel Pérez',
        actorInitials: 'DP',
        action: 'add-label',
        taskId: 'KB-303',
        taskTitle: 'Componentes de tablero',
        to: 'Alta prioridad',
        notes: 'Se agrega etiqueta para priorizar refactor de drag & drop.',
      },
      {
        id: 'log-1787',
        timestamp: '11 Abr · 09:30',
        author: 'María Sánchez',
        actorInitials: 'MS',
        action: 'create-task',
        taskId: 'KB-368',
        taskTitle: 'Migrar métricas a panel unificado',
        notes: 'Nueva necesidad detectada en retro. Incluye objetivos de adoptabilidad.',
      },
    ],
  },
  {
    date: '10 Abr 2025',
    entries: [
      {
        id: 'log-1779',
        timestamp: '10 Abr · 18:12',
        author: 'Carlos Ortega',
        actorInitials: 'CO',
        action: 'update-status',
        taskId: 'KB-282',
        taskTitle: 'Automatización de reportes',
        from: 'En progreso',
        to: 'Completado',
      },
      {
        id: 'log-1775',
        timestamp: '10 Abr · 14:50',
        author: 'María Sánchez',
        actorInitials: 'MS',
        action: 'assign-task',
        taskId: 'KB-301',
        taskTitle: 'Mapa de stakeholders',
        to: 'María Sánchez',
        notes: 'Toma responsabilidad directa de los workshops con stakeholders clave.',
      },
    ],
  },
];

const ACTION_FILTERS: Array<{ id: 'all' | BacklogActionType; label: string }> = [
  { id: 'all', label: 'Todos' },
  { id: 'create-task', label: 'Crear' },
  { id: 'assign-task', label: 'Asignar' },
  { id: 'update-status', label: 'Estados' },
  { id: 'add-label', label: 'Etiquetas' },
  { id: 'edit-task', label: 'Editar' },
  { id: 'comment', label: 'Comentarios' },
];

type BacklogsPageProps = {
  project?: SidebarProject | null;
  projects?: SidebarProject[];
  selectedId: string;
  onSelect: (projectId: string) => void;
  onBack?: () => void;
  onProfileClick?: () => void;
  onLogout?: () => void;
  headerNotifications?: HeaderProps['notifications'];
};

const BacklogsPage: React.FC<BacklogsPageProps> = ({
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
  const [activeFilter, setActiveFilter] = React.useState<'all' | BacklogActionType>('all');

  const projectList = React.useMemo(() => projects ?? DEFAULT_PROJECTS, [projects]);

  const filteredActivity = React.useMemo(() => {
    if (activeFilter === 'all') {
      return BACKLOG_ACTIVITY;
    }
    return BACKLOG_ACTIVITY.map((group) => ({
      date: group.date,
      entries: group.entries.filter((entry) => entry.action === activeFilter),
    })).filter((group) => group.entries.length > 0);
  }, [activeFilter]);

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
          title="Backlogs"
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
              <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 font-semibold uppercase tracking-wide">
                  Cambios registrados · 30 días
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 font-semibold uppercase tracking-wide text-blue-600">
                  Acciones clave: crear, asignar, actualizar
                </span>
              </div>
            </div>
            <p className="mt-4 max-w-3xl text-sm text-slate-600">
              Revisa el historial de movimientos del backlog: creación y edición de tareas, cambios de estado, asignaciones y
              etiquetados recientes. Cada entrada muestra quién realizó la acción y qué impacto tuvo sobre la tarea.
            </p>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg shadow-slate-900/5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Filtrar actividad</h3>
              <div className="flex flex-wrap gap-2">
                {ACTION_FILTERS.map((filter) => {
                  const isActive = filter.id === activeFilter;
                  return (
                    <button
                      key={filter.id}
                      type="button"
                      onClick={() => setActiveFilter(filter.id)}
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide transition ${
                        isActive
                          ? 'border-blue-300 bg-blue-50 text-blue-600'
                          : 'border-slate-200 text-slate-500 hover:border-blue-200 hover:text-blue-600'
                      }`}
                    >
                      {filter.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 space-y-6">
              {filteredActivity.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-10 text-center text-sm text-slate-400">
                  No se registran movimientos para este filtro.
                </div>
              ) : (
                filteredActivity.map((group) => (
                  <div key={group.date} className="space-y-4">
                    <div className="sticky top-20 z-10 inline-flex rounded-full border border-slate-200 bg-white px-4 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500 shadow-sm shadow-slate-900/10">
                      {group.date}
                    </div>
                    <ul className="space-y-3">
                      {group.entries.map((entry) => (
                        <li
                          key={entry.id}
                          className={`flex flex-col gap-3 rounded-2xl border px-4 py-4 text-sm shadow-sm shadow-slate-900/5 ${ACTION_COLORS[entry.action]}`}
                        >
                          <div className="flex items-center justify-between text-xs text-slate-500">
                            <span className="inline-flex items-center gap-2 font-semibold text-slate-700">
                              <span className="grid h-8 w-8 place-items-center rounded-full bg-white/70 text-sm font-semibold text-slate-700">
                                {entry.actorInitials}
                              </span>
                              {entry.author}
                            </span>
                            <span>{entry.timestamp}</span>
                          </div>
                          <div className="flex flex-col gap-1 text-sm text-slate-700">
                            <span className="font-semibold">
                              {ACTION_LABELS[entry.action]} · {entry.taskId}
                            </span>
                            <span className="text-xs text-slate-500">{entry.taskTitle}</span>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                            {entry.from && (
                              <span className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-white px-2 py-1">
                                <span className="font-semibold text-slate-500">De:</span>
                                {entry.from}
                              </span>
                            )}
                            {entry.to && (
                              <span className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-white px-2 py-1">
                                <span className="font-semibold text-slate-500">A:</span>
                                {entry.to}
                              </span>
                            )}
                          </div>
                          {entry.notes && (
                            <p className="rounded-2xl border border-white/60 bg-white/70 px-3 py-2 text-xs text-slate-600">
                              {entry.notes}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              )}
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
    </div>
  );
};

export default BacklogsPage;
