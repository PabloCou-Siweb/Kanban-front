import React from 'react';
import Sidebar, { DEFAULT_PROJECTS, SidebarProject } from '../Sidebar/Sidebar';
import Header, { HeaderProps } from '../Header/Header';
import BacklogsHero from './BacklogsHero';
import BacklogsFilters from './BacklogsFilters';
import BacklogActivityList from './BacklogActivityList';
import { ACTION_FILTERS, BACKLOG_ACTIVITY } from './constants';
import type { BacklogActionType, BacklogActivityGroup } from './types';

const normalizeText = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

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
  const [authorSearch, setAuthorSearch] = React.useState('');

  const projectList = React.useMemo(() => projects ?? DEFAULT_PROJECTS, [projects]);

  const filteredActivity = React.useMemo<BacklogActivityGroup[]>(() => {
    const normalizedSearch = normalizeText(authorSearch.trim());

    return BACKLOG_ACTIVITY.map((group) => {
      const entries = group.entries.filter((entry) => {
        const matchesAction = activeFilter === 'all' || entry.action === activeFilter;
        const matchesAuthor =
          normalizedSearch === '' || normalizeText(entry.author).includes(normalizedSearch);
        return matchesAction && matchesAuthor;
      });

      return {
        date: group.date,
        entries,
      };
    }).filter((group) => group.entries.length > 0);
  }, [activeFilter, authorSearch]);

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
          <BacklogsHero projectName={project ? project.name : 'Tablero principal'} />

          <BacklogsFilters
            filters={ACTION_FILTERS}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            authorSearch={authorSearch}
            onAuthorSearchChange={setAuthorSearch}
          />

          <BacklogActivityList groups={filteredActivity} />
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
