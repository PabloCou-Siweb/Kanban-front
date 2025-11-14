import React from 'react';
import Sidebar, { DEFAULT_PROJECTS, SidebarProject } from '../Sidebar/Sidebar';
import Header, { HeaderProps } from '../Header/Header';
import { RepoLink, RepoType } from './types';
import { COMMITS, INITIAL_REPO_LINKS } from './constants';
import RepoLinksSection from './RepoLinksSection';
import CommitsSection from './CommitsSection';

type RepositoryPageProps = {
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

const RepositoryPage: React.FC<RepositoryPageProps> = ({
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

  const [repoLinks, setRepoLinks] = React.useState<RepoLink[]>(INITIAL_REPO_LINKS);
  const [showRepoModal, setShowRepoModal] = React.useState(false);
  const [repoForm, setRepoForm] = React.useState<{
    label: string;
    description: string;
    url: string;
    type: RepoType;
  }>({
    label: '',
    description: '',
    url: '',
    type: 'github',
  });

  const projectList = React.useMemo(() => projects ?? DEFAULT_PROJECTS, [projects]);
  const canManageRepos = currentUser.role === 'admin' || currentUser.role === 'product-owner';

  const handleOpenRepoModal = () => {
    setRepoForm({ label: '', description: '', url: '', type: 'github' });
    setShowRepoModal(true);
  };

  const handleCloseRepoModal = () => {
    setShowRepoModal(false);
  };

  const handleSubmitRepo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newRepo: RepoLink = {
      id: `repo-${Date.now()}`,
      label: repoForm.label.trim() || 'Nuevo repositorio',
      description: repoForm.description.trim(),
      url: repoForm.url.trim(),
      type: repoForm.type,
    };
    setRepoLinks((prev) => [newRepo, ...prev]);
    setShowRepoModal(false);
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
          title="Repository"
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
              {canManageRepos && (
                <button
                  type="button"
                  onClick={handleOpenRepoModal}
                  className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-blue-600 transition hover:border-blue-300"
                >
                  Añadir repositorio
                </button>
              )}
            </div>
            <p className="mt-4 max-w-3xl text-sm text-slate-600">
              Accede a los repositorios clave del proyecto, consulta documentación externa y revisa la actividad de commits.
              Usa esta vista como hub central para coordinar cambios entre frontend, backend y librerías compartidas.
            </p>
          </section>

          <div className="grid gap-6 lg:grid-cols-2">
            <RepoLinksSection links={repoLinks} />
            <CommitsSection commits={COMMITS} />
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

      {showRepoModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 px-6 py-10">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
            <header className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Añadir repositorio</h2>
                <p className="text-xs text-slate-500">
                  Completa la información del repositorio o recurso externo que quieras vincular al proyecto.
                </p>
              </div>
              <button
                type="button"
                onClick={handleCloseRepoModal}
                className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-400 transition hover:border-slate-300 hover:text-slate-600"
              >
                Cerrar
              </button>
            </header>

            <form onSubmit={handleSubmitRepo} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Nombre
                  <input
                    type="text"
                    value={repoForm.label}
                    onChange={(event) => setRepoForm((prev) => ({ ...prev, label: event.target.value }))}
                    placeholder="Ej. Backend API"
                    className="rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    required
                  />
                </label>
                <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Tipo
                  <select
                    value={repoForm.type}
                    onChange={(event) => setRepoForm((prev) => ({ ...prev, type: event.target.value as RepoType }))}
                    className="rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="github">GitHub</option>
                    <option value="design">Design</option>
                    <option value="documentation">Documentación</option>
                    <option value="other">Otro</option>
                  </select>
                </label>
              </div>

              <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                URL
                <input
                  type="url"
                  value={repoForm.url}
                  onChange={(event) => setRepoForm((prev) => ({ ...prev, url: event.target.value }))}
                  placeholder="https://github.com/empresa/proyecto"
                  className="rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  required
                />
              </label>

              <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Descripción
                <textarea
                  value={repoForm.description}
                  onChange={(event) => setRepoForm((prev) => ({ ...prev, description: event.target.value }))}
                  placeholder="Breve contexto del repositorio o enlace"
                  className="min-h-[110px] rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </label>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseRepoModal}
                  className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-500 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-500"
                >
                  Guardar repositorio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RepositoryPage;
