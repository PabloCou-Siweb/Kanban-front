import React from 'react';
import Sidebar, { DEFAULT_PROJECTS, SidebarProject } from '../Sidebar/Sidebar';
import Header, { HeaderProps } from '../Header/Header';

type ComponentCategory = 'layout' | 'brand' | 'media' | 'code';

type StoredComponent = {
  id: string;
  name: string;
  description: string;
  category: ComponentCategory;
  updatedAt: string;
  tags: string[];
  preview?: string;
};

type ComponentActivity = {
  id: string;
  timestamp: string;
  author: string;
  action: 'created' | 'updated' | 'imported' | 'exported';
  componentName: string;
  details?: string;
};

const COMPONENT_CATEGORIES: Array<{ id: ComponentCategory; label: string }> = [
  { id: 'layout', label: 'Layouts & UI' },
  { id: 'brand', label: 'Branding' },
  { id: 'media', label: 'Medios' },
  { id: 'code', label: 'Snippets & Hooks' },
];

const COMPONENTS: StoredComponent[] = [
  {
    id: 'cmp-001',
    name: 'Header principal',
    description: 'Barra superior con navegación, botón de perfil y acciones rápidas.',
    category: 'layout',
    updatedAt: 'Actualizado hace 1 día',
    tags: ['header', 'layout', 'navegación'],
    preview: '/img/preview-header.png',
  },
  {
    id: 'cmp-002',
    name: 'Logo isotipo',
    description: 'SVG con variaciones claras y oscuras.',
    category: 'brand',
    updatedAt: 'Actualizado hace 3 días',
    tags: ['logo', 'brand'],
    preview: '/img/kanban-logo.svg',
  },
  {
    id: 'cmp-003',
    name: 'Módulo hero marketing',
    description: 'Sección hero con CTA doble y mockups ilustrativos.',
    category: 'layout',
    updatedAt: 'Actualizado hace 4 días',
    tags: ['landing', 'hero'],
    preview: '/img/kanban-image.svg',
  },
  {
    id: 'cmp-004',
    name: 'Hook useKanbanBoard',
    description: 'Hook de React para gestionar columnas, drag & drop y filtros.',
    category: 'code',
    updatedAt: 'Actualizado hace 6 horas',
    tags: ['react', 'hook', 'board'],
  },
  {
    id: 'cmp-005',
    name: 'Avatar circular',
    description: 'Componente de avatar con iniciales y gradientes.',
    category: 'media',
    updatedAt: 'Actualizado hace 2 días',
    tags: ['avatar', 'ui'],
  },
];

const COMPONENT_ACTIVITY: ComponentActivity[] = [
  {
    id: 'cmp-log-001',
    timestamp: '12 Abr · 12:10',
    author: 'María Sánchez',
    action: 'updated',
    componentName: 'Header principal',
    details: 'Se ajustó el comportamiento responsive y se añadieron accesos rápidos.',
  },
  {
    id: 'cmp-log-002',
    timestamp: '11 Abr · 09:47',
    author: 'Ana Rodríguez',
    action: 'imported',
    componentName: 'Módulo hero marketing',
    details: 'Importado desde proyecto Website 2025.',
  },
  {
    id: 'cmp-log-003',
    timestamp: '10 Abr · 17:22',
    author: 'Carlos Ortega',
    action: 'created',
    componentName: 'Hook useKanbanBoard',
    details: 'Primer versión con soporte para columnas dinámicas.',
  },
  {
    id: 'cmp-log-004',
    timestamp: '09 Abr · 15:05',
    author: 'Laura Méndez',
    action: 'exported',
    componentName: 'Logo isotipo',
    details: 'Exportado a proyecto Marketing Launch.',
  },
];

type ComponentsPageProps = {
  project?: SidebarProject | null;
  projects?: SidebarProject[];
  selectedId: string;
  onSelect: (projectId: string) => void;
  onBack?: () => void;
  onProfileClick?: () => void;
  onLogout?: () => void;
  headerNotifications?: HeaderProps['notifications'];
};

const ComponentsPage: React.FC<ComponentsPageProps> = ({
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
  const [activeCategory, setActiveCategory] = React.useState<ComponentCategory | 'all'>('all');
  const [searchTerm, setSearchTerm] = React.useState('');

  const projectList = React.useMemo(() => projects ?? DEFAULT_PROJECTS, [projects]);

  const filteredComponents = React.useMemo(() => {
    return COMPONENTS.filter((component) => {
      const matchCategory = activeCategory === 'all' || component.category === activeCategory;
      const matchSearch = searchTerm.trim()
        ? component.name.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
          component.description.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
          component.tags.some((tag) => tag.toLowerCase().includes(searchTerm.trim().toLowerCase()))
        : true;
      return matchCategory && matchSearch;
    });
  }, [activeCategory, searchTerm]);

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
          title="Components"
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
                <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 font-semibold uppercase tracking-wide text-blue-600">
                  Biblioteca activa · {COMPONENTS.length} componentes
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 font-semibold uppercase tracking-wide text-slate-500">
                  Importa, exporta y versiona elementos
                </span>
              </div>
            </div>
            <p className="mt-4 max-w-3xl text-sm text-slate-600">
              Guarda componentes reutilizables de UI, assets de marca o snippets de código. Exporta fácilmente componentes como
              el header principal para usarlos en otros proyectos o importa activos desde diferentes equipos.
            </p>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg shadow-slate-900/5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-blue-600 transition hover:border-blue-300"
                >
                  <span>+ Nuevo componente</span>
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600 transition hover:border-blue-200 hover:text-blue-600"
                >
                  Importar
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600 transition hover:border-blue-200 hover:text-blue-600"
                >
                  Exportar selección
                </button>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-500">
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Buscar por nombre, descripción o tag"
                  className="flex-1 focus:outline-none"
                />
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {filteredComponents.length} resultados
                </span>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActiveCategory('all')}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide transition ${
                  activeCategory === 'all'
                    ? 'border-blue-300 bg-blue-50 text-blue-600'
                    : 'border-slate-200 text-slate-500 hover:border-blue-200 hover:text-blue-600'
                }`}
              >
                Todos
              </button>
              {COMPONENT_CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setActiveCategory(category.id)}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide transition ${
                    activeCategory === category.id
                      ? 'border-blue-300 bg-blue-50 text-blue-600'
                      : 'border-slate-200 text-slate-500 hover:border-blue-200 hover:text-blue-600'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredComponents.map((component) => (
                <article
                  key={component.id}
                  className="flex h-full flex-col gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-sm transition hover:border-blue-200 hover:shadow-lg"
                >
                  <header className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">{component.name}</h3>
                      <p className="mt-1 text-xs text-slate-500">{component.description}</p>
                    </div>
                    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      {component.category}
                    </span>
                  </header>

                  {component.preview && (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                      <img src={component.preview} alt={component.name} className="h-32 w-full rounded-xl object-contain" />
                    </div>
                  )}

                  <footer className="mt-auto flex flex-col gap-3 text-xs text-slate-500">
                    <div className="flex flex-wrap gap-2">
                      {component.tags.map((tag) => (
                        <span
                          key={`${component.id}-${tag}`}
                          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <span className="font-semibold text-slate-600">{component.updatedAt}</span>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-600 transition hover:border-blue-300"
                      >
                        Exportar
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600 transition hover:border-blue-200 hover:text-blue-600"
                      >
                        Duplicar
                      </button>
                    </div>
                  </footer>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white px-6 py-6 text-xs text-slate-600 shadow-lg shadow-slate-900/5">
            <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Actividad reciente</h3>
                <p className="text-xs text-slate-500">Acciones relacionadas con creación, importación y exportación de componentes.</p>
              </div>
              <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Log sincronizado con repositorio de diseño
              </div>
            </header>

            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {COMPONENT_ACTIVITY.map((entry) => (
                <article
                  key={entry.id}
                  className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{entry.timestamp}</span>
                  <span className="text-sm font-semibold text-slate-900">
                    {entry.author} · {entry.action === 'created'
                      ? 'Creó'
                      : entry.action === 'updated'
                      ? 'Actualizó'
                      : entry.action === 'imported'
                      ? 'Importó'
                      : 'Exportó'}{' '}
                    {entry.componentName}
                  </span>
                  {entry.details && <span className="text-xs text-slate-500">{entry.details}</span>}
                </article>
              ))}
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

export default ComponentsPage;
