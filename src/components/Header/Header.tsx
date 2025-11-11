import React from 'react';

export type HeaderNotification = {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'commit' | 'task-assigned' | 'task-updated';
  onClick?: () => void;
};

export type HeaderProps = {
  title?: string;
  onProfileClick?: () => void;
  onBack?: () => void;
  notifications?: HeaderNotification[];
};

const Header: React.FC<HeaderProps> = ({
  title = 'Kanban Planner',
  onProfileClick,
  onBack,
  notifications = [],
}) => {
  const [showNotifications, setShowNotifications] = React.useState(false);

  const hasNotifications = notifications.length > 0;

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/90 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="flex items-center gap-3">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex h-12 w-12 items-center justify-center text-black transition hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            aria-label="Volver"
          >
            <img src="/img/arrow_back-icon.svg" alt="Volver" className="h-6 w-6" />
          </button>
        )}
        <h1 className="text-lg font-semibold text-slate-900 sm:text-xl">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications((prev) => !prev)}
            className="group relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-blue-200 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            aria-label="Abrir notificaciones"
          >
            <img
              src={showNotifications ? '/img/notification-icon-active.svg' : '/img/notification-icon.svg'}
              alt="Notificaciones"
              className="h-5 w-5 transition group-hover:scale-105"
            />
            {hasNotifications && (
              <span className="absolute -top-1 -right-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[11px] font-semibold text-white">
                {notifications.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 z-30 mt-3 w-80 rounded-3xl border border-slate-200 bg-white p-4 text-left text-sm text-slate-600 shadow-xl shadow-slate-900/10">
              <header className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900">Notificaciones</h2>
                <button
                  type="button"
                  className="text-xs font-semibold text-blue-500 transition hover:text-blue-600"
                  onClick={() => setShowNotifications(false)}
                >
                  Cerrar
                </button>
              </header>

              {hasNotifications ? (
                <ul className="space-y-3">
                  {notifications.map((notification) => (
                    <li
                      key={notification.id}
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 transition hover:border-blue-200 hover:bg-blue-50"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          notification.onClick?.();
                          setShowNotifications(false);
                        }}
                        className="flex w-full flex-col items-start gap-2 text-left"
                      >
                        <div className="flex w-full items-center justify-between text-[11px] uppercase tracking-wide text-slate-400">
                          <span>
                            {notification.type === 'commit'
                              ? 'Nuevo commit'
                              : notification.type === 'task-assigned'
                              ? 'Tarea asignada'
                              : 'Actualización de tarea'}
                          </span>
                          <span>{notification.timestamp}</span>
                        </div>
                        <p className="text-sm font-semibold text-slate-800">{notification.title}</p>
                        <p className="text-xs text-slate-500">{notification.description}</p>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-6 text-center text-xs text-slate-400">
                  Sin notificaciones por ahora.
                </div>
              )}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onProfileClick}
          className="group flex items-center gap-3 rounded-full border border-transparent px-3 py-1.5 transition hover:border-slate-200 hover:bg-slate-50"
          aria-label="Abrir perfil de usuario"
        >
          <div className="text-right text-xs leading-tight text-slate-500">
            <p className="font-medium text-slate-700">Usuario</p>
            <span className="hidden text-slate-400 sm:inline">Ver perfil</span>
          </div>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-blue-600 to-blue-500 text-sm font-semibold text-white shadow-md shadow-blue-500/25 transition group-hover:scale-105">
            U
          </span>
        </button>
      </div>
    </header>
  );
};

export default Header;

