import React, { useMemo, useState } from 'react';
import LoginPage from './components/LoginPage/LoginPage';
import ForgotPasswordPage from './components/ForgotPasswordPage/ForgotPasswordPage';
import PasswordChangePage from './components/PasswordChangePage/PasswordChangePage';
import MainLayout from './components/MainLayout/MainLayout';
import ProfilePage from './components/ProfilePage/ProfilePage';
import { DEFAULT_PROJECTS } from './components/Sidebar/Sidebar';
import BoardPage from './components/BoardPage/BoardPage';
import ReleasesPage from './components/ReleasesPage/ReleasesPage';
import BacklogsPage from './components/BacklogsPage/BacklogsPage';
import SettingsPage from './components/SettingsPage/SettingsPage';
import ComponentsPage from './components/ComponentsPage/ComponentsPage';
import RepositoryPage from './components/RepositoryPage/RepositoryPage';
import ReportsPage from './components/ReportsPage/ReportsPage';
import IssuesPage from './components/IssuesPage/IssuesPage';
import { HeaderNotification } from './components/Header/Header';

const App: React.FC = () => {
  const [view, setView] = useState<
    | 'login'
    | 'forgot-password'
    | 'password-change'
    | 'main'
    | 'profile'
    | 'board'
    | 'releases'
    | 'backlogs'
    | 'settings'
    | 'components'
    | 'repository'
    | 'reports'
    | 'issues'
  >('login');
  const [selectionId, setSelectionId] = useState<string>('my-tasks');
  const [pendingBoardTask, setPendingBoardTask] = useState<
    { taskId: string; columnId?: string; projectId: string } | null
  >(null);
  const projects = useMemo(() => DEFAULT_PROJECTS, []);

  const selectedProject = selectionId === 'my-tasks'
    ? null
    : projects.find((project) => project.id === selectionId) ?? null;

  const handleSelect = (projectId: string) => {
    setSelectionId(projectId);
    setPendingBoardTask(null);
    if (projectId === 'my-tasks') {
      setView('main');
    }
  };

  const notifications: HeaderNotification[] = [
    {
      id: 'notif-001',
      title: 'Nuevo commit en Kanban Web',
      description: 'Carlos Ortega actualizó el módulo de board.',
      timestamp: 'Hace 15 min',
      type: 'commit',
      onClick: () => {
        setSelectionId('desarrollo');
        setView('repository');
      },
    },
    {
      id: 'notif-002',
      title: 'Tarea asignada: Validación permisos avanzados',
      description: 'Ana Rodríguez te asignó la tarea KB-287.',
      timestamp: 'Hace 1 hora',
      type: 'task-assigned',
      onClick: () => {
        setSelectionId('design');
        setPendingBoardTask({ taskId: 'KB-287', columnId: 'review', projectId: 'design' });
        setView('board');
      },
    },
    {
      id: 'notif-003',
      title: 'Estado actualizado en Sincronización con calendario',
      description: 'La tarea cambió de “Pendiente” a “En progreso”.',
      timestamp: 'Ayer',
      type: 'task-updated',
      onClick: () => {
        setSelectionId('desarrollo');
        setPendingBoardTask({ taskId: 'KB-298', columnId: 'in-progress', projectId: 'desarrollo' });
        setView('board');
      },
    },
  ];

  if (view === 'main') {
    return (
      <MainLayout
        onProfileClick={() => setView('profile')}
        onLogout={() => setView('login')}
        selectionId={selectionId}
        onSelect={handleSelect}
        projects={projects}
        headerNotifications={notifications}
        onOpenBoard={(project) => {
          setSelectionId(project.id);
          setPendingBoardTask(null);
          setView('board');
        }}
        onOpenReleases={(project) => {
          setSelectionId(project.id);
          setView('releases');
        }}
        onOpenBacklogs={(project) => {
          setSelectionId(project.id);
          setView('backlogs');
        }}
        onOpenSettings={(project) => {
          setSelectionId(project.id);
          setView('settings');
        }}
        onOpenComponents={(project) => {
          setSelectionId(project.id);
          setView('components');
        }}
        onOpenRepository={(project) => {
          setSelectionId(project.id);
          setView('repository');
        }}
        onOpenReports={(project) => {
          setSelectionId(project.id);
          setView('reports');
        }}
        onOpenIssues={(project) => {
          setSelectionId(project.id);
          setView('issues');
        }}
      />
    );
  }

  if (view === 'profile') {
    return (
      <ProfilePage
        onBack={() => setView('main')}
        onChangePassword={() => setView('password-change')}
        onLogoutRequest={() => setView('login')}
        projects={projects}
        selectedId={selectionId}
        onSelect={(projectId) => {
          setSelectionId(projectId);
          setView(projectId === 'my-tasks' ? 'main' : 'main');
        }}
        onOpenBoardTask={({ taskId, columnId, projectId }) => {
          setSelectionId(projectId);
          setPendingBoardTask({ taskId, columnId, projectId });
          setView('board');
        }}
        headerNotifications={notifications}
      />
    );
  }

  if (view === 'board') {
    return (
      <BoardPage
        project={selectedProject}
        projects={projects}
        selectedId={selectionId}
        onSelect={(projectId) => {
          handleSelect(projectId);
          setView('main');
        }}
        onBack={() => setView('main')}
        onProfileClick={() => setView('profile')}
        onLogout={() => setView('login')}
        initialTaskRef={pendingBoardTask ? { taskId: pendingBoardTask.taskId, columnId: pendingBoardTask.columnId } : null}
        onInitialTaskHandled={() => setPendingBoardTask(null)}
        currentUser={{ name: 'María Sánchez', initials: 'MS' }}
        headerNotifications={notifications}
      />
    );
  }

  if (view === 'releases') {
    return (
      <ReleasesPage
        project={selectedProject}
        projects={projects}
        selectedId={selectionId}
        onSelect={(projectId: string) => {
          setSelectionId(projectId);
          setView('main');
        }}
        onBack={() => setView('main')}
        onProfileClick={() => setView('profile')}
        onLogout={() => setView('login')}
        headerNotifications={notifications}
        currentUser={{ name: 'María Sánchez', role: 'admin' }}
      />
    );
  }

  if (view === 'backlogs') {
    return (
      <BacklogsPage
        project={selectedProject}
        projects={projects}
        selectedId={selectionId}
        onSelect={(projectId) => {
          setSelectionId(projectId);
          setView('main');
        }}
        onBack={() => setView('main')}
        onProfileClick={() => setView('profile')}
        onLogout={() => setView('login')}
        headerNotifications={notifications}
      />
    );
  }

  if (view === 'settings') {
    return (
      <SettingsPage
        project={selectedProject}
        projects={projects}
        selectedId={selectionId}
        onSelect={(projectId) => {
          setSelectionId(projectId);
          setView('main');
        }}
        onBack={() => setView('main')}
        onProfileClick={() => setView('profile')}
        onLogout={() => setView('login')}
        headerNotifications={notifications}
        currentUser={{ name: 'María Sánchez', role: 'admin' }}
      />
    );
  }

  if (view === 'components') {
    return (
      <ComponentsPage
        project={selectedProject}
        projects={projects}
        selectedId={selectionId}
        onSelect={(projectId) => {
          setSelectionId(projectId);
          setView('main');
        }}
        onBack={() => setView('main')}
        onProfileClick={() => setView('profile')}
        onLogout={() => setView('login')}
        headerNotifications={notifications}
      />
    );
  }

  if (view === 'repository') {
    return (
      <RepositoryPage
        project={selectedProject}
        projects={projects}
        selectedId={selectionId}
        onSelect={(projectId) => {
          setSelectionId(projectId);
          setView('main');
        }}
        onBack={() => setView('main')}
        onProfileClick={() => setView('profile')}
        onLogout={() => setView('login')}
        headerNotifications={notifications}
        currentUser={{ name: 'María Sánchez', role: 'admin' }}
      />
    );
  }

  if (view === 'reports') {
    return (
      <ReportsPage
        project={selectedProject}
        projects={projects}
        selectedId={selectionId}
        onSelect={(projectId) => {
          setSelectionId(projectId);
          setView('main');
        }}
        onBack={() => setView('main')}
        onProfileClick={() => setView('profile')}
        onLogout={() => setView('login')}
        headerNotifications={notifications}
      />
    );
  }

  if (view === 'issues') {
    return (
      <IssuesPage
        project={selectedProject}
        projects={projects}
        selectedId={selectionId}
        onSelect={(projectId) => {
          setSelectionId(projectId);
          setView('main');
        }}
        onBack={() => setView('main')}
        onProfileClick={() => setView('profile')}
        onLogout={() => setView('login')}
        headerNotifications={notifications}
        currentUser={{ name: 'María Sánchez', role: 'admin' }}
      />
    );
  }

  if (view === 'forgot-password') {
    return (
      <ForgotPasswordPage
        onBackToLogin={() => setView('login')}
        onAccessWithEmail={() => setView('password-change')}
      />
    );
  }

  if (view === 'password-change') {
    return <PasswordChangePage onBackToLogin={() => setView('login')} />;
  }

  return (
    <LoginPage
      onForgotPassword={() => setView('forgot-password')}
      onLogin={() => {
        setSelectionId('my-tasks');
        setView('main');
      }}
    />
  );
};

export default App;
