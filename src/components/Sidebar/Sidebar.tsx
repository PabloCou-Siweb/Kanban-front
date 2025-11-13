import React from 'react';

export type SidebarProject = {
  id: string;
  name: string;
  description?: string;
  owner?: string;
  team?: string;
  startDate?: string;
  endDate?: string;
  status?: 'Pendiente' | 'En progreso' | 'En revisión' | 'Completado';
};

const TasksIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <rect
      x="3.5"
      y="2.5"
      width="17"
      height="19"
      rx="2.5"
      ry="2.5"
      stroke="#0F172A"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7 7.5 L9 9.5 L12 6.5"
      stroke="#0F172A"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7 12.5 L9 14.5 L12 11.5"
      stroke="#0F172A"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7 17.5 L9 19.5 L12 16.5"
      stroke="#0F172A"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line
      x1="13.5"
      y1="8"
      x2="18"
      y2="8"
      stroke="#0F172A"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
    <line
      x1="13.5"
      y1="13"
      x2="18"
      y2="13"
      stroke="#0F172A"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
    <line
      x1="13.5"
      y1="18"
      x2="18"
      y2="18"
      stroke="#0F172A"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
  </svg>
);

type SidebarProps = {
  projects?: SidebarProject[];
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onLogoutRequest?: () => void;
  onSelect?: (projectId: string) => void;
  selectedId?: string | null;
};

export const DEFAULT_PROJECTS: SidebarProject[] = [
  {
    id: 'marketing',
    name: 'Marketing Launch',
    description: 'Campañas y lanzamientos',
    owner: 'Laura Méndez',
    team: 'Marketing',
    startDate: '2025-01-10',
    endDate: '2025-04-30',
    status: 'Pendiente',
  },
  {
    id: 'desarrollo',
    name: 'Desarrollo Web',
    description: 'Infraestructura y nuevas features',
    owner: 'Carlos Ortega',
    team: 'Frontend + Backend',
    startDate: '2025-02-03',
    endDate: '2025-07-15',
    status: 'En progreso',
  },
  {
    id: 'design',
    name: 'UI/UX Design',
    description: 'Investigación y prototipos',
    owner: 'Ana Ruiz',
    team: 'Product Design',
    startDate: '2025-03-01',
    endDate: '2025-05-20',
    status: 'En revisión',
  },
  {
    id: 'ventas',
    name: 'Ventas Enterprise',
    description: 'Embudo y seguimiento',
    owner: 'Javier Morales',
    team: 'Sales Ops',
    startDate: '2025-01-15',
    endDate: '2025-06-30',
    status: 'Completado',
  },
];

const Sidebar: React.FC<SidebarProps> = ({
  projects,
  collapsed = false,
  onToggleCollapse,
  onLogoutRequest,
  onSelect,
  selectedId = 'my-tasks',
}) => {
  const projectList = projects ?? DEFAULT_PROJECTS;

  const handleSelect = (projectId: string) => {
    onSelect?.(projectId);
  };

  return (
    <aside
      className={`sticky top-0 z-30 flex h-screen flex-col border-r border-slate-200 bg-slate-50/60 p-4 text-slate-700 transition-[width] duration-300 ease-out ${
        collapsed ? 'w-18' : 'w-60'
      }`}
    >
      <div className="flex flex-1 flex-col gap-6 overflow-y-auto pr-1">
        {collapsed ? (
          <div className="flex flex-col items-center gap-3">
            <img src="/img/kanban-logo2.svg" alt="Kanban" className="h-10 w-10" />
            <button
              type="button"
              onClick={onToggleCollapse}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-blue-200 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              aria-label="Expandir sidebar"
            >
              <span className="text-xl">»</span>
            </button>
            <button
              type="button"
              onClick={() => handleSelect('my-tasks')}
              className={`mt-4 inline-flex h-10 w-10 items-center justify-center rounded-full border transition focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                selectedId === 'my-tasks'
                  ? 'border-slate-400 bg-slate-300 text-slate-900'
                  : 'border-slate-300 bg-slate-100 text-slate-700 hover:border-blue-200'
              }`}
              aria-label="Mis tareas"
            >
              <TasksIcon />
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <img src="/img/kanban-logo.svg" alt="Kanban" className="h-8" />
              <button
                type="button"
                onClick={onToggleCollapse}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-blue-200 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                aria-label="Contraer sidebar"
              >
                <span className="text-xl">«</span>
              </button>
            </div>
            <button
              type="button"
              onClick={() => handleSelect('my-tasks')}
              className={`mt-6 flex w-full items-center justify-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold transition focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${
                selectedId === 'my-tasks'
                  ? 'border-transparent bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                  : 'border-blue-200 bg-blue-50 text-blue-700 hover:border-blue-300 hover:bg-blue-100'
              }`}
            >
              <span>Mis tareas</span>
            </button>
            <h2 className="mt-6 text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Proyectos
            </h2>
          </>
        )}

        {!collapsed && (
          <div>
            <div className="mt-4 space-y-2">
              {projectList.map((project) => {
                const isActive = project.id === selectedId;
                return (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => handleSelect(project.id)}
                    className={`flex w-full flex-col gap-1 rounded-2xl border px-4 py-3 text-left transition focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${
                      isActive
                        ? 'border-transparent bg-white shadow-lg shadow-blue-500/10'
                        : 'border-transparent bg-white/70 hover:border-blue-100 hover:bg-white'
                    }`}
                  >
                    <span className="text-sm font-semibold text-slate-900">{project.name}</span>
                    {project.description && (
                      <span className="text-xs text-slate-500">{project.description}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-slate-200 pt-4">
        <button
          type="button"
          onClick={onLogoutRequest}
          className={`mx-auto inline-flex items-center justify-center rounded-full text-sm font-semibold text-slate-500 transition hover:text-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500/20 ${
            collapsed ? 'h-10 w-10' : 'gap-2 px-4 py-2'
          }`}
        >
          <img src="/img/log_out-icon.svg" alt="Cerrar sesión" className="h-5 w-5" />
          {!collapsed && <span>Cerrar sesión</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

