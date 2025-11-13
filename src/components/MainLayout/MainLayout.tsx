import React from 'react';
import Header from '../Header/Header';
import Sidebar, { SidebarProject, DEFAULT_PROJECTS } from '../Sidebar/Sidebar';
import MyTasksPage from '../MyTasksPage/MyTasksPage';
import { HeaderProps } from '../Header/Header';

type ProjectSection = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

type MainLayoutProps = {
  onProfileClick?: () => void;
  onLogout?: () => void;
  selectionId: string;
  onSelect: (projectId: string) => void;
  projects?: SidebarProject[];
  onOpenBoard?: (project: SidebarProject) => void;
  onOpenReleases?: (project: SidebarProject) => void;
  onOpenBacklogs?: (project: SidebarProject) => void;
  onOpenSettings?: (project: SidebarProject) => void;
  onOpenComponents?: (project: SidebarProject) => void;
  onOpenRepository?: (project: SidebarProject) => void;
  onOpenReports?: (project: SidebarProject) => void;
  onOpenIssues?: (project: SidebarProject) => void;
  headerNotifications?: HeaderProps['notifications'];
};

const PROJECT_SECTIONS: ProjectSection[] = [
  { id: 'board', title: 'Board', description: 'Gestiona columnas, estados y tareas del proyecto.', icon: '/img/board.svg' },
  { id: 'releases', title: 'Releases', description: 'Planifica entregas y despliegues clave.', icon: '/img/releases.svg' },
  { id: 'settings', title: 'Settings', description: 'Configura preferencias y miembros del proyecto.', icon: '/img/settings.svg' },
  { id: 'components', title: 'Components', description: 'Organiza componentes reutilizables y assets.', icon: '/img/components.svg' },
  { id: 'issues', title: 'Issues', description: 'Monitorea incidencias y solicitudes pendientes.', icon: '/img/issues.svg' },
  { id: 'repository', title: 'Repository', description: 'Consulta el código y sincroniza cambios.', icon: '/img/repository.svg' },
  { id: 'backlogs', title: 'Backlogs', description: 'Prioriza pendientes y planifica próximos sprints.', icon: '/img/backlogs.svg' },
  { id: 'reports', title: 'Reports', description: 'Analiza métricas, tiempos y avances del proyecto.', icon: '/img/reports.svg' },
];

const MainLayout: React.FC<MainLayoutProps> = ({
  onProfileClick,
  onLogout,
  selectionId,
  onSelect,
  projects,
  onOpenBoard,
  onOpenReleases,
  onOpenBacklogs,
  onOpenSettings,
  onOpenComponents,
  onOpenRepository,
  onOpenReports,
  onOpenIssues,
  headerNotifications,
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);

  const projectList = React.useMemo(() => projects ?? DEFAULT_PROJECTS, [projects]);
  const showMyTasks = selectionId === 'my-tasks';
  const selectedProject = React.useMemo(
    () => projectList.find((project) => project.id === selectionId) ?? null,
    [projectList, selectionId]
  );

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900">
      <Sidebar
        projects={projectList}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
        onLogoutRequest={() => setShowLogoutConfirm(true)}
        selectedId={selectionId}
        onSelect={onSelect}
      />

      <div className="flex min-h-screen flex-1 flex-col">
        <Header
          onProfileClick={onProfileClick}
          title={showMyTasks ? 'Mis tareas' : 'Proyectos'}
          notifications={headerNotifications}
        />

        <main className="flex flex-1 flex-col gap-6 p-8">
          {showMyTasks ? (
            <MyTasksPage onOpenProject={onSelect} />
          ) : selectedProject ? (
            <>
              <section className="rounded-3xl bg-white p-6 shadow-lg shadow-slate-900/10">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="text-2xl font-semibold text-slate-900">{selectedProject.name}</h2>
                  {selectedProject.status && (
                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                        selectedProject.status === 'Pendiente'
                          ? 'bg-amber-100 text-amber-700'
                          : selectedProject.status === 'En progreso'
                          ? 'bg-blue-100 text-blue-700'
                          : selectedProject.status === 'En revisión'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {selectedProject.status}
                    </span>
                  )}
                </div>

                {selectedProject.description && (
                  <p className="mt-4 text-sm text-slate-600">{selectedProject.description}</p>
                )}

                <dl className="mt-6 grid gap-4 text-sm text-slate-600 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="flex flex-col gap-1 rounded-2xl bg-slate-50 px-4 py-3">
                    <dt className="text-xs uppercase tracking-wide text-slate-400">Responsable</dt>
                    <dd className="font-medium text-slate-900">{selectedProject.owner ?? 'No asignado'}</dd>
                  </div>
                  <div className="flex flex-col gap-1 rounded-2xl bg-slate-50 px-4 py-3">
                    <dt className="text-xs uppercase tracking-wide text-slate-400">Equipo</dt>
                    <dd className="font-medium text-slate-900">{selectedProject.team ?? 'No asignado'}</dd>
                  </div>
                  <div className="flex flex-col gap-1 rounded-2xl bg-slate-50 px-4 py-3">
                    <dt className="text-xs uppercase tracking-wide text-slate-400">Inicio</dt>
                    <dd className="font-medium text-slate-900">{selectedProject.startDate ?? 'Sin definir'}</dd>
                  </div>
                  <div className="flex flex-col gap-1 rounded-2xl bg-slate-50 px-4 py-3">
                    <dt className="text-xs uppercase tracking-wide text-slate-400">Fin</dt>
                    <dd className="font-medium text-slate-900">{selectedProject.endDate ?? 'Sin definir'}</dd>
                  </div>
                </dl>
              </section>

              <section className="rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-lg shadow-slate-900/5">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                  Explorar secciones
                </h3>
                <div className="mt-6 grid min-h-[320px] gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {PROJECT_SECTIONS.map((section) => (
                    <button
                      key={section.id}
                      type="button"
                      className="group flex h-full w-full max-w-sm flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-5 text-left transition hover:border-blue-200 hover:shadow-lg"
                      onClick={() => {
                        if (section.id === 'board' && selectedProject) {
                          onSelect(selectedProject.id);
                          onOpenBoard?.(selectedProject);
                        }
                        if (section.id === 'releases' && selectedProject) {
                          onSelect(selectedProject.id);
                          onOpenReleases?.(selectedProject);
                        }
                        if (section.id === 'backlogs' && selectedProject) {
                          onSelect(selectedProject.id);
                          onOpenBacklogs?.(selectedProject);
                        }
                        if (section.id === 'settings' && selectedProject) {
                          onSelect(selectedProject.id);
                          onOpenSettings?.(selectedProject);
                        }
                        if (section.id === 'components' && selectedProject) {
                          onSelect(selectedProject.id);
                          onOpenComponents?.(selectedProject);
                        }
                        if (section.id === 'repository' && selectedProject) {
                          onSelect(selectedProject.id);
                          onOpenRepository?.(selectedProject);
                        }
                        if (section.id === 'issues' && selectedProject) {
                          onSelect(selectedProject.id);
                          onOpenIssues?.(selectedProject);
                        }
                        if (section.id === 'reports' && selectedProject) {
                          onSelect(selectedProject.id);
                          onOpenReports?.(selectedProject);
                        }
                      }}
                    >
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition group-hover:bg-blue-50 group-hover:text-blue-600">
                        <img src={section.icon} alt={section.title} className="h-4 w-4" />
                      </span>
                      <span className="text-sm font-semibold text-slate-900 group-hover:text-blue-600">
                        {section.title}
                      </span>
                      <span className="text-xs text-slate-500">{section.description}</span>
                    </button>
                  ))}
                </div>
              </section>
            </>
          ) : (
            <section className="rounded-3xl border border-dashed border-slate-300 bg-white/60 px-10 py-14 text-center text-sm text-slate-400">
              Selecciona un proyecto del menú lateral para ver los detalles.
            </section>
          )}
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

export default MainLayout;

