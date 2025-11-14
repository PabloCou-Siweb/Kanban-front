import React from 'react';
import Sidebar, { DEFAULT_PROJECTS, SidebarProject } from '../Sidebar/Sidebar';
import Header, { HeaderProps } from '../Header/Header';

type RoleKey = 'administrator' | 'project-manager' | 'employee';

type ProjectMember = {
  id: string;
  name: string;
  email: string;
  initials: string;
  avatarColor: string;
  role: RoleKey;
  lastActivity: string;
};

type PermissionMatrix = {
  key: RoleKey;
  label: string;
  summary: string;
  permissions: Array<{ action: string; allowed: boolean }>;
};

const INITIAL_MEMBERS: ProjectMember[] = [
  {
    id: 'user-001',
    name: 'María Sánchez',
    email: 'maria.sanchez@empresa.com',
    initials: 'MS',
    avatarColor: 'bg-gradient-to-br from-blue-600 to-blue-500',
    role: 'administrator',
    lastActivity: 'Hace 2 horas',
  },
  {
    id: 'user-002',
    name: 'Carlos Ortega',
    email: 'carlos.ortega@empresa.com',
    initials: 'CO',
    avatarColor: 'bg-gradient-to-br from-slate-600 to-slate-500',
    role: 'project-manager',
    lastActivity: 'Hace 35 minutos',
  },
  {
    id: 'user-003',
    name: 'Ana Rodríguez',
    email: 'ana.rodriguez@empresa.com',
    initials: 'AR',
    avatarColor: 'bg-gradient-to-br from-rose-500 to-rose-400',
    role: 'employee',
    lastActivity: 'Hace 10 minutos',
  },
];

const ROLES: PermissionMatrix[] = [
  {
    key: 'administrator',
    label: 'Administrador',
    summary: 'Control total del proyecto, configuraciones críticas y facturación.',
    permissions: [
      { action: 'Gestionar miembros y roles', allowed: true },
      { action: 'Editar configuraciones globales', allowed: true },
      { action: 'Crear/Editar/Eliminar tareas', allowed: true },
      { action: 'Modificar columnas y estados', allowed: true },
      { action: 'Ver reportes y métricas', allowed: true },
    ],
  },
  {
    key: 'project-manager',
    label: 'Gestor de proyecto',
    summary: 'Gestiona backlog, releases, prioridades y configuración operativa.',
    permissions: [
      { action: 'Gestionar miembros y roles', allowed: false },
      { action: 'Editar configuraciones globales', allowed: true },
      { action: 'Crear/Editar/Eliminar tareas', allowed: true },
      { action: 'Modificar columnas y estados', allowed: true },
      { action: 'Ver reportes y métricas', allowed: true },
    ],
  },
  {
    key: 'employee',
    label: 'Empleado',
    summary: 'Aporta en el backlog, toma tareas y actualiza estados.',
    permissions: [
      { action: 'Gestionar miembros y roles', allowed: false },
      { action: 'Editar configuraciones globales', allowed: false },
      { action: 'Crear/Editar/Eliminar tareas', allowed: true },
      { action: 'Modificar columnas y estados', allowed: true },
      { action: 'Ver reportes y métricas', allowed: true },
    ],
  },
];

const ROLE_DISPLAY: Record<RoleKey, string> = {
  administrator: 'Administrador',
  'project-manager': 'Gestor de proyecto',
  employee: 'Empleado',
};

type SettingsPageProps = {
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
    role: 'admin' | 'project-owner' | 'employee';
  };
};

const CURRENT_USER_FALLBACK = {
  name: 'María Sánchez',
  role: 'employee' as const,
};

const SettingsPage: React.FC<SettingsPageProps> = ({
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
  const [searchTerm, setSearchTerm] = React.useState('');
  const [members, setMembers] = React.useState<ProjectMember[]>(INITIAL_MEMBERS);
  const [selectedMemberId, setSelectedMemberId] = React.useState<string | null>(
    INITIAL_MEMBERS[0]?.id ?? null
  );
  const [showAddMemberModal, setShowAddMemberModal] = React.useState(false);
  const [newMemberForm, setNewMemberForm] = React.useState<{
    name: string;
    email: string;
    role: RoleKey;
  }>({
    name: '',
    email: '',
    role: 'employee',
  });

  const projectList = React.useMemo(() => projects ?? DEFAULT_PROJECTS, [projects]);

  const filteredMembers = React.useMemo(() => {
    if (!searchTerm.trim()) {
      return members;
    }
    const term = searchTerm.trim().toLowerCase();
    return members.filter((member) =>
      member.name.toLowerCase().includes(term) || member.email.toLowerCase().includes(term)
    );
  }, [members, searchTerm]);

  const canManageMembers = currentUser.role === 'admin' || currentUser.role === 'project-owner';

  const selectedMember = React.useMemo(
    () => members.find((member) => member.id === selectedMemberId) ?? members[0] ?? null,
    [members, selectedMemberId]
  );

  const handleChangeRole = (role: RoleKey) => {
    if (!selectedMember) {
      return;
    }

    setMembers((prev) =>
      prev.map((member) =>
        member.id === selectedMember.id
          ? {
              ...member,
              role,
              lastActivity: 'Hace instantes',
            }
          : member
      )
    );
  };

  const handleRemoveMember = () => {
    if (!selectedMember) {
      return;
    }

    setMembers((prev) => prev.filter((member) => member.id !== selectedMember.id));

    setSelectedMemberId((prevId) => {
      if (prevId === selectedMember.id) {
        const remaining = members.filter((member) => member.id !== selectedMember.id);
        return remaining[0]?.id ?? null;
      }
      return prevId;
    });
  };

  const handleSubmitNewMember = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nameTrimmed = newMemberForm.name.trim() || 'Nuevo miembro';
    const emailTrimmed = newMemberForm.email.trim() || 'sin-correo@empresa.com';
    const initials = nameTrimmed
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('');

    const newMember: ProjectMember = {
      id: `user-${Date.now()}`,
      name: nameTrimmed,
      email: emailTrimmed,
      initials: initials || 'NM',
      avatarColor: 'bg-gradient-to-br from-blue-600 to-blue-500',
      role: newMemberForm.role,
      lastActivity: 'Hace instantes',
    };

    setMembers((prev) => [newMember, ...prev]);
    setSelectedMemberId(newMember.id);
    setShowAddMemberModal(false);
    setNewMemberForm({ name: '', email: '', role: 'employee' });
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
          title="Settings"
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
              </div>
            </div>
            <p className="mt-4 max-w-3xl text-sm text-slate-600">
              Administra los miembros del proyecto, define permisos por rol y controla quién puede realizar cambios críticos.
              Usa la búsqueda para localizar usuarios y revisa la matriz de permisos antes de asignar nuevos roles.
            </p>
          </section>

          <div className="grid gap-6 lg:grid-cols-2">
            <section className="flex flex-col gap-5 rounded-3xl border border-slate-200 bg-white/90 px-6 py-6 shadow-lg shadow-slate-900/5">
              <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Miembros del proyecto</h3>
                  <p className="mt-1 text-xs text-slate-500">Gestiona acceso, roles y actividad reciente.</p>
                </div>
                {canManageMembers && (
                  <button
                    type="button"
                    onClick={() => setShowAddMemberModal(true)}
                    className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-blue-600 transition hover:border-blue-300"
                  >
                    Añadir miembro
                  </button>
                )}
              </header>

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Buscar por nombre o email"
                    className="flex-1 text-sm text-slate-600 placeholder:text-slate-400 focus:outline-none"
                  />
                </div>

                <div className="space-y-3">
                  {filteredMembers.map((member) => {
                    const isActive = member.id === selectedMember?.id;
                    return (
                      <button
                        key={member.id}
                        type="button"
                        onClick={() => setSelectedMemberId(member.id)}
                        className={`flex w-full items-center justify-between gap-4 rounded-2xl border px-4 py-4 text-left transition ${
                          isActive
                            ? 'border-blue-200 bg-blue-50 text-blue-700 shadow-sm'
                            : 'border-slate-200 bg-white hover:border-blue-200'
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <span className={`grid h-10 w-10 place-items-center rounded-full text-sm font-semibold text-white ${member.avatarColor}`}>
                            {member.initials}
                          </span>
                          <span className="flex flex-col">
                            <span className="text-sm font-semibold text-slate-900">{member.name}</span>
                            <span className="text-xs text-slate-500">{member.email}</span>
                          </span>
                        </span>
                        <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                          {ROLE_DISPLAY[member.role]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            <section className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-lg shadow-slate-900/5">
              <header className="flex flex-col gap-1">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Detalles del miembro</h3>
                <p className="text-xs text-slate-500">Configura el rol, revisa actividad y acceso granular.</p>
              </header>

              <div className="flex items-center gap-4">
                {selectedMember ? (
                  <>
                    <span className={`grid h-16 w-16 place-items-center rounded-full text-lg font-semibold text-white ${selectedMember.avatarColor}`}>
                      {selectedMember.initials}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-base font-semibold text-slate-900">{selectedMember.name}</span>
                      <span className="text-xs text-slate-500">{selectedMember.email}</span>
                    </div>
                  </>
                ) : (
                  <span className="text-sm text-slate-500">Selecciona un miembro para ver los detalles.</span>
                )}
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-xs text-slate-600">
                <span className="font-semibold text-slate-500">Rol asignado</span>
                <div className="mt-3 flex flex-wrap gap-2">
                  {ROLES.map((role) => {
                    const isActive = role.key === selectedMember?.role;
                    return (
                      <button
                        key={role.key}
                        type="button"
                        onClick={() => handleChangeRole(role.key)}
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide transition ${
                          isActive
                            ? 'border-blue-300 bg-blue-50 text-blue-600'
                            : 'border-slate-200 text-slate-500 hover:border-blue-200 hover:text-blue-600'
                        }`}
                      >
                        {role.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {canManageMembers && (
                <button
                  type="button"
                  onClick={handleRemoveMember}
                  disabled={!selectedMember}
                  className="inline-flex w-fit items-center gap-2 rounded-full border border-rose-200 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-rose-500 transition hover:border-rose-300 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Eliminar del proyecto
                </button>
              )}
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
      {showAddMemberModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 px-6 py-10">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <header className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Añadir miembro al proyecto</h2>
                <p className="text-xs text-slate-500">Completa la información del nuevo colaborador.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowAddMemberModal(false);
                  setNewMemberForm({ name: '', email: '', role: 'employee' });
                }}
                className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-400 transition hover:border-slate-300 hover:text-slate-600"
              >
                Cerrar
              </button>
            </header>

            <form onSubmit={handleSubmitNewMember} className="space-y-4">
              <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Nombre
                <input
                  type="text"
                  value={newMemberForm.name}
                  onChange={(event) => setNewMemberForm((prev) => ({ ...prev, name: event.target.value }))}
                  placeholder="Ej. Laura Gómez"
                  className="rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  required
                />
              </label>

              <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Email
                <input
                  type="email"
                  value={newMemberForm.email}
                  onChange={(event) => setNewMemberForm((prev) => ({ ...prev, email: event.target.value }))}
                  placeholder="nombre@empresa.com"
                  className="rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  required
                />
              </label>

              <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Rol
                <select
                  value={newMemberForm.role}
                  onChange={(event) =>
                    setNewMemberForm((prev) => ({ ...prev, role: event.target.value as RoleKey }))
                  }
                  className="rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
                >
                  {ROLES.map((role) => (
                    <option key={role.key} value={role.key}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </label>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddMemberModal(false);
                    setNewMemberForm({ name: '', email: '', role: 'employee' });
                  }}
                  className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-500 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-500"
                >
                  Añadir miembro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
