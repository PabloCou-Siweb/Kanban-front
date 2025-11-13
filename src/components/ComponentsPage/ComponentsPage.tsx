import React from 'react';
import Sidebar, { DEFAULT_PROJECTS, SidebarProject } from '../Sidebar/Sidebar';
import Header, { HeaderProps } from '../Header/Header';

type ComponentCategory = 'logos' | 'iconos' | 'ilustraciones' | 'fondos';

type StoredComponent = {
  id: string;
  name: string;
  description: string;
  category: ComponentCategory;
  updatedAt: string;
  tags: string[];
  preview: string;
};

const COMPONENT_CATEGORIES: Array<{ id: ComponentCategory; label: string }> = [
  { id: 'logos', label: 'Logos' },
  { id: 'iconos', label: 'Iconografía' },
  { id: 'ilustraciones', label: 'Ilustraciones' },
  { id: 'fondos', label: 'Fondos' },
];

const CATEGORY_LABEL: Record<ComponentCategory, string> = COMPONENT_CATEGORIES.reduce(
  (acc, category) => {
    acc[category.id] = category.label;
    return acc;
  },
  {} as Record<ComponentCategory, string>,
);

const COMPONENTS: StoredComponent[] = [
  {
    id: 'cmp-001',
    name: 'Logo isotipo',
    description: 'Logotipo principal en formato SVG con versiones light y dark.',
    category: 'logos',
    updatedAt: 'Actualizado hace 1 día',
    tags: ['branding', 'isotipo'],
    preview: '/img/kanban-logo.svg',
  },
  {
    id: 'cmp-002',
    name: 'Icono tablero',
    description: 'Icono minimalista para representar tableros o paneles Kanban.',
    category: 'iconos',
    updatedAt: 'Actualizado hace 2 días',
    tags: ['icono', 'ui'],
    preview: '/img/icon-board.svg',
  },
  {
    id: 'cmp-003',
    name: 'Ilustración equipo',
    description: 'Ilustración en tonos azules para secciones de equipo y colaboración.',
    category: 'ilustraciones',
    updatedAt: 'Actualizado hace 4 días',
    tags: ['ilustración', 'team'],
    preview: '/img/kanban-image.svg',
  },
  {
    id: 'cmp-004',
    name: 'Background ondas',
    description: 'Fondo con ondas suaves y degradados para headers o secciones hero.',
    category: 'fondos',
    updatedAt: 'Actualizado hace 6 horas',
    tags: ['background', 'gradient'],
    preview: '/img/background-waves.svg',
  },
  {
    id: 'cmp-005',
    name: 'Icono campana',
    description: 'Campana de notificaciones con contorno limpio y relleno adaptable.',
    category: 'iconos',
    updatedAt: 'Actualizado hace 3 días',
    tags: ['icono', 'alerta'],
    preview: '/img/notification-icon.svg',
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
  const [componentItems, setComponentItems] = React.useState<StoredComponent[]>(COMPONENTS);
  const [showNewComponentModal, setShowNewComponentModal] = React.useState(false);
  const [newComponentForm, setNewComponentForm] = React.useState<{
    name: string;
    description: string;
    category: ComponentCategory;
  }>({
    name: '',
    description: '',
    category: 'logos',
  });
  const [newComponentPreview, setNewComponentPreview] = React.useState<string | null>(null);
  const [newComponentFileName, setNewComponentFileName] = React.useState<string>('');
  const [exportComponent, setExportComponent] = React.useState<StoredComponent | null>(null);
  const [showExportModal, setShowExportModal] = React.useState(false);
  const [exportOptions, setExportOptions] = React.useState<{
    format: 'png' | 'svg';
    includeMetadata: boolean;
  }>({
    format: 'png',
    includeMetadata: true,
  });

  const projectList = React.useMemo(() => projects ?? DEFAULT_PROJECTS, [projects]);

  const filteredComponents = React.useMemo(() => {
    return componentItems.filter((component) => {
      const matchCategory = activeCategory === 'all' || component.category === activeCategory;
      const matchSearch = searchTerm.trim()
        ? component.name.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
          component.description.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
          component.tags.some((tag) => tag.toLowerCase().includes(searchTerm.trim().toLowerCase()))
        : true;
      return matchCategory && matchSearch;
    });
  }, [activeCategory, searchTerm, componentItems]);

  const handleOpenNewComponentModal = React.useCallback(() => {
    setShowNewComponentModal(true);
  }, []);

  const resetNewComponentState = React.useCallback(() => {
    setNewComponentForm({
      name: '',
      description: '',
      category: 'logos',
    });
    setNewComponentPreview(null);
    setNewComponentFileName('');
  }, []);

  const handleCloseNewComponentModal = React.useCallback(() => {
    setShowNewComponentModal(false);
    resetNewComponentState();
  }, [resetNewComponentState]);

  const handleOpenExportModal = React.useCallback((component: StoredComponent) => {
    const supportsSvg = component.preview.toLowerCase().endsWith('.svg');
    setExportComponent(component);
    setExportOptions({
      format: supportsSvg ? 'svg' : 'png',
      includeMetadata: true,
    });
    setShowExportModal(true);
  }, []);

  const handleCloseExportModal = React.useCallback(() => {
    setShowExportModal(false);
    setExportComponent(null);
  }, []);

  const handleExportMetadataToggle = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setExportOptions((prev) => ({
      ...prev,
      includeMetadata: event.target.checked,
    }));
  }, []);

  const handleExportFormatToggle = React.useCallback(
    (format: 'png' | 'svg') => {
      setExportOptions((prev) => {
        if (
          format === 'svg' &&
          exportComponent &&
          !exportComponent.preview.toLowerCase().endsWith('.svg')
        ) {
          return prev;
        }

        return {
          ...prev,
          format,
        };
      });
    },
    [exportComponent],
  );

  const handleExecuteExport = React.useCallback(() => {
    // Aquí se integraría la exportación real (descarga de archivo o llamada a API).
    setShowExportModal(false);
    setExportComponent(null);
  }, []);

  const handleNewComponentInputChange = React.useCallback(
    (field: 'name' | 'description' | 'category') =>
      (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const value = event.target.value;
        setNewComponentForm((prev) => ({
          ...prev,
          [field]: field === 'category' ? (value as ComponentCategory) : value,
        }));
      },
    [],
  );

  const handleNewComponentFileChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setNewComponentPreview(null);
      setNewComponentFileName('');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setNewComponentPreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
    setNewComponentFileName(file.name);
  }, []);

  const handleSubmitNewComponent = React.useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!newComponentForm.name.trim()) {
        return;
      }

      if (!newComponentPreview) {
        return;
      }

      const newComponent: StoredComponent = {
        id: `cmp-${Date.now()}`,
        name: newComponentForm.name.trim(),
        description: newComponentForm.description.trim() || 'Sin descripción',
        category: newComponentForm.category,
        updatedAt: 'Añadido hace un momento',
        tags: [newComponentForm.category],
        preview: newComponentPreview,
      };

      setComponentItems((prev) => [newComponent, ...prev]);
      setShowNewComponentModal(false);
      resetNewComponentState();
    },
    [newComponentForm, newComponentPreview, resetNewComponentState],
  );

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

        <main className="flex-1 overflow-y-auto bg-slate-50">
          <div className="mx-auto w-full max-w-7xl space-y-10 px-6 py-10">
            <section className="rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-sm shadow-slate-900/10">
              <header className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">Biblioteca</p>
                <h2 className="text-2xl font-semibold text-slate-900">
                  {project ? project.name : 'Componentes del tablero'}
                </h2>
                <p className="max-w-xl text-sm text-slate-500">
                  Centraliza iconos, logotipos, ilustraciones o fondos reutilizables para compartirlos con otros proyectos. Mantén
                  un repositorio sencillo y siempre accesible desde este espacio.
                </p>
              </header>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-sm shadow-slate-900/10">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <button
                  type="button"
                  onClick={handleOpenNewComponentModal}
                  className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                >
                  + Nuevo componente
                </button>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-2 shadow-sm">
                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Buscar por nombre o etiqueta"
                    className="flex-1 bg-transparent text-sm text-slate-600 placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setActiveCategory('all')}
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition ${
                    activeCategory === 'all'
                      ? 'bg-slate-900 text-white shadow-sm shadow-slate-900/20'
                      : 'border border-slate-200 bg-white text-slate-500 hover:border-blue-200 hover:text-blue-600'
                  }`}
                >
                  Todos
                </button>
                {COMPONENT_CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setActiveCategory(category.id)}
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition ${
                      activeCategory === category.id
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                        : 'border border-slate-200 bg-white text-slate-500 hover:border-blue-200 hover:text-blue-600'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <header className="flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">Componentes guardados</h3>
                <span className="text-xs text-slate-400">Selecciona un elemento para ver su descripción.</span>
              </header>

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filteredComponents.map((component) => (
                  <article
                    key={component.id}
                    className="flex h-full flex-col justify-between rounded-3xl border border-slate-200 bg-white px-5 py-5 shadow-sm shadow-slate-900/10 transition hover:border-blue-200 hover:shadow-lg"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="text-sm font-semibold text-slate-900">{component.name}</h4>
                          <p className="mt-1 text-xs text-slate-500">{component.description}</p>
                        </div>
                        <span className="inline-flex items-center rounded-full border border-slate-200 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                          {CATEGORY_LABEL[component.category]}
                        </span>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                        <img src={component.preview} alt={component.name} className="h-32 w-full rounded-xl object-contain" />
                      </div>
                      {/* Etiquetas removidas según solicitud */}
                    </div>
                    <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                      <span>{component.updatedAt}</span>
                      <button
                        type="button"
                        onClick={() => handleOpenExportModal(component)}
                        className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500 transition hover:border-blue-200 hover:text-blue-600"
                      >
                        Exportar
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* Sección de actividad reciente eliminada según la solicitud */}
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

      {showNewComponentModal && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-900/40 px-6 py-10">
          <div className="w-full max-w-3xl rounded-3xl bg-white p-6 shadow-2xl">
            <header className="mb-6 space-y-2">
              <h2 className="text-xl font-semibold text-slate-900">Nuevo componente</h2>
              <p className="text-sm text-slate-500">
                Añade una referencia visual o pega el código que acompañará a este componente reutilizable.
              </p>
            </header>

            <form onSubmit={handleSubmitNewComponent} className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm text-slate-600">
                  Nombre del componente
                  <input
                    type="text"
                    required
                    value={newComponentForm.name}
                    onChange={handleNewComponentInputChange('name')}
                    placeholder="Ej. Header principal"
                    className="rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm text-slate-600">
                  Categoría
                  <select
                    value={newComponentForm.category}
                    onChange={handleNewComponentInputChange('category')}
                    className="rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  >
                    {COMPONENT_CATEGORIES.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="flex flex-col gap-2 text-sm text-slate-600">
                Descripción
                <textarea
                  value={newComponentForm.description}
                  onChange={handleNewComponentInputChange('description')}
                  placeholder="Contexto o notas rápidas sobre el componente."
                  className="min-h-[80px] rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </label>

              <div className="flex flex-col gap-3 rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5">
                <span className="text-sm font-semibold text-slate-600">Imagen de referencia</span>
                <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-6 text-center text-sm text-slate-500 transition hover:border-blue-300 hover:text-blue-600">
                  <div className="flex flex-col items-center gap-1">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-500">
                      +
                    </span>
                    <span className="font-semibold">Seleccionar archivo</span>
                    <span className="text-xs text-slate-400">PNG, JPG o SVG</span>
                  </div>
                  <input type="file" accept="image/*" onChange={handleNewComponentFileChange} className="hidden" />
                </label>
                {newComponentFileName && <p className="text-xs text-slate-400">Archivo seleccionado: {newComponentFileName}</p>}
                {newComponentPreview ? (
                  <div className="rounded-2xl border border-slate-200 bg-white p-3">
                    <img src={newComponentPreview} alt="Vista previa" className="h-40 w-full rounded-xl object-contain" />
                  </div>
                ) : (
                  <p className="text-xs text-rose-400">
                    Sube una imagen para poder guardar este recurso en la biblioteca.
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseNewComponentModal}
                  className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-500 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!newComponentPreview}
                  className={`rounded-full px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition ${
                    newComponentPreview ? 'bg-blue-600 hover:bg-blue-500' : 'cursor-not-allowed bg-slate-300 text-slate-100 shadow-none'
                  }`}
                >
                  Guardar componente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showExportModal && exportComponent && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-900/40 px-6 py-10">
          <div className="w-full max-w-3xl rounded-3xl bg-white p-6 shadow-2xl">
            <header className="mb-6 flex flex-col gap-3 border-b border-slate-200 pb-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Exportar componente</p>
                  <h2 className="text-xl font-semibold text-slate-900">{exportComponent.name}</h2>
                </div>
                <span className="inline-flex items-center rounded-full border border-slate-200 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  {CATEGORY_LABEL[exportComponent.category]}
                </span>
              </div>
              <p className="text-sm text-slate-500">
                Elige cómo compartir este recurso con otros proyectos. Puedes adjuntar metadatos para mantener el contexto y la
                documentación.
              </p>
            </header>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:items-start">
              <div className="space-y-5">
                <section className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4">
                  <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                    Detalles de exportación
                  </span>
                  <div className="space-y-4 text-sm text-slate-500">
                    {(() => {
                      const supportsSvg = exportComponent.preview.toLowerCase().endsWith('.svg');
                      return (
                        <>
                          <p>Elige el formato en el que quieres descargar este recurso visual.</p>
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => handleExportFormatToggle('png')}
                              className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                                exportOptions.format === 'png'
                                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                                  : 'border border-slate-200 bg-white text-slate-500 hover:border-blue-200 hover:text-blue-600'
                              }`}
                            >
                              PNG optimizado
                            </button>
                            <button
                              type="button"
                              onClick={() => handleExportFormatToggle('svg')}
                              disabled={!supportsSvg}
                              className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                                exportOptions.format === 'svg'
                                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                                  : 'border border-slate-200 bg-white text-slate-500 hover:border-blue-200 hover:text-blue-600'
                              } ${!supportsSvg ? 'cursor-not-allowed opacity-60 hover:border-slate-200 hover:text-slate-500' : ''}`}
                            >
                              SVG original
                            </button>
                          </div>
                          {!supportsSvg && (
                            <p className="text-xs text-rose-400">Esta imagen no dispone de versión vectorial, solo PNG.</p>
                          )}
                          <ul className="space-y-2 text-xs text-slate-400">
                            <li>• PNG mantiene la imagen rasterizada y transparente cuando sea posible.</li>
                            <li>• SVG conserva la edición vectorial (disponible solo si el recurso es vectorial).</li>
                          </ul>
                        </>
                      );
                    })()}
                  </div>
                </section>

                <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-500">
                  <input
                    type="checkbox"
                    checked={exportOptions.includeMetadata}
                    onChange={handleExportMetadataToggle}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  Incluir metadatos (nombre, descripción y categoría)
                </label>

                <section className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-4 py-4 text-xs text-slate-500">
                  <p className="font-semibold uppercase tracking-[0.3em] text-slate-400">Resumen</p>
                  <p className="mt-2 text-sm text-slate-500">
                    Exportarás este recurso como imagen{' '}
                    <span className="font-semibold text-slate-700">{exportOptions.format.toUpperCase()}</span>{' '}
                    {exportOptions.includeMetadata ? 'con un archivo de metadatos adicional.' : 'sin información adicional.'}
                  </p>
                </section>
              </div>

              <aside className="space-y-4 rounded-3xl border border-slate-200 bg-white px-4 py-4">
                <h3 className="text-sm font-semibold text-slate-700">Vista previa</h3>
                <p className="text-xs text-slate-400">Revisa la referencia que acompañará al archivo exportado.</p>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <img src={exportComponent.preview} alt={exportComponent.name} className="h-40 w-full rounded-xl object-contain" />
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2 text-[11px] text-slate-400">
                  Última actualización: <span className="font-semibold text-slate-500">{exportComponent.updatedAt}</span>
                </div>
              </aside>
            </div>

            <footer className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleCloseExportModal}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-500 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleExecuteExport}
                className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-500"
              >
                Exportar ahora
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComponentsPage;
