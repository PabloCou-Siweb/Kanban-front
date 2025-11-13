import React from 'react';
import Sidebar, { DEFAULT_PROJECTS, SidebarProject } from '../Sidebar/Sidebar';
import Header, { HeaderProps } from '../Header/Header';

type RepoType = 'github' | 'design' | 'documentation' | 'other';

type RepoLink = {
  id: string;
  label: string;
  description: string;
  url: string;
  type: RepoType;
};

type CommitEntry = {
  id: string;
  sha: string;
  message: string;
  author: string;
  timestamp: string;
};

const INITIAL_REPO_LINKS: RepoLink[] = [
  {
    id: 'repo-frontend',
    label: 'Frontend · Kanban Web',
    description: 'Repositorio principal del cliente React con Tailwind.',
    url: 'https://github.com/empresa/kanban-frontend',
    type: 'github',
  },
  {
    id: 'repo-backend',
    label: 'Backend · API Kanban',
    description: 'Servicios Node/Koa, autenticación y tareas.',
    url: 'https://github.com/empresa/kanban-backend',
    type: 'github',
  },
  {
    id: 'repo-design',
    label: 'Librería de diseño',
    description: 'Componentes Figma, tokens y guidelines.',
    url: 'https://www.figma.com/file/kanban-design-system',
    type: 'design',
  },
  {
    id: 'repo-docs',
    label: 'Documentación técnica',
    description: 'Confluence con ADRs, diagramas y checklist de releases.',
    url: 'https://docs.empresa.com/kanban',
    type: 'documentation',
  },
];

const COMMITS: CommitEntry[] = [
  {
    id: 'commit-001',
    sha: 'a4f9c21',
    message: 'refactor(board): mejora drag & drop y estados visuales',
    author: 'Carlos Ortega',
    timestamp: '12 Abr · 11:32',
  },
  {
    id: 'commit-002',
    sha: 'bb1d8f3',
    message: 'feat(profile): pestaña estadísticas con métricas reales',
    author: 'Ana Rodríguez',
    timestamp: '12 Abr · 08:05',
  },
  {
    id: 'commit-003',
    sha: 'c7e5310',
    message: 'chore(ci): añade job de linting y pruebas e2e',
    author: 'María Sánchez',
    timestamp: '11 Abr · 19:48',
  },
  {
    id: 'commit-004',
    sha: 'd9aa4c9',
    message: 'fix(releases): corrige fechas en timeline',
    author: 'Daniel Pérez',
    timestamp: '11 Abr · 15:31',
  },
];

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

const REPO_TYPE_LABELS: Record<RepoType, string> = {
  github: 'GitHub',
  design: 'Design',
  documentation: 'Docs',
  other: 'Link',
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

  const repoCount = repoLinks.length;

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
            <section className="space-y-4 rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-lg shadow-slate-900/5">
              <header className="flex flex-col gap-1">
                <h3 className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 font-semibold uppercase tracking-wide text-blue-600">
                  Repositorios vinculados · {repoCount}
                </h3>
                <p className="text-xs text-slate-500">
                  Enlaces directos a repos GitHub, documentación y librerías de diseño.
                </p>
              </header>

              <ul className="space-y-3 text-sm text-slate-600">
                {repoLinks.map((link) => (
                  <li key={link.id} className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 font-semibold uppercase tracking-wide">
                        {REPO_TYPE_LABELS[link.type]}
                      </span>
                      <a
                        href={link.url}
                        className="text-xs font-semibold text-blue-600 transition hover:text-blue-700"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Abrir ↗
                      </a>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-semibold text-slate-900">{link.label}</span>
                      {link.description && <span className="text-xs text-slate-500">{link.description}</span>}
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section className="space-y-4 rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-lg shadow-slate-900/5">
              <header className="flex flex-col gap-1">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Commits recientes</h3>
                <p className="text-xs text-slate-500">
                  Seguimiento de las últimas contribuciones y su estado actual.
                </p>
              </header>

              <ul className="space-y-3 text-sm text-slate-600">
                {COMMITS.map((commit) => (
                  <li key={commit.id} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="font-semibold text-slate-700">{commit.author}</span>
                      <span>{commit.timestamp}</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-900">{commit.message}</span>
                    <span className="text-xs text-slate-500">Hash {commit.sha}</span>
                  </li>
                ))}
              </ul>
            </section>
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
