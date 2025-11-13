import React from 'react';
import Sidebar, { SidebarProject, DEFAULT_PROJECTS } from '../Sidebar/Sidebar';
import Header, { HeaderProps } from '../Header/Header';
import { BOARD_TASKS } from '../BoardPage/BoardPage';
import type { BoardTaskItem } from '../BoardPage/BoardPage';

type Trend = 'up' | 'down' | 'neutral';

type ReportMetric = {
  id: string;
  label: string;
  value: string;
};

type DistributionItem = {
  id: string;
  label: string;
  value: number;
  percentage: number;
  colorClass: string;
};

type PerformanceItem = {
  id: string;
  label: string;
  completed: number;
  new: number;
  pending: number;
};

type ResolutionPoint = {
  month: string;
  value: number;
};

type WeeklySummary = {
  key: string;
  start: Date;
  newCount: number;
  completedCount: number;
  pendingCount: number;
  completedDurations: number[];
};

type ColumnId = 'pending' | 'in-progress' | 'review' | 'done';

type BoardTasksByColumn = Record<ColumnId, BoardTaskItem[]>;

const STATUS_METADATA: Record<ColumnId, { label: string; colorClass: string }> = {
  pending: { label: 'Pendiente', colorClass: 'bg-amber-400' },
  'in-progress': { label: 'En progreso', colorClass: 'bg-blue-500' },
  review: { label: 'En revisión', colorClass: 'bg-purple-500' },
  done: { label: 'Completado', colorClass: 'bg-emerald-500' },
};

const COLUMN_ORDER: ColumnId[] = ['pending', 'in-progress', 'review', 'done'];

const SPANISH_MONTHS: Record<string, number> = {
  Ene: 0,
  Feb: 1,
  Mar: 2,
  Abr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Ago: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dic: 11,
};

const PROJECT_TASK_SNAPSHOTS: Record<string, BoardTasksByColumn> = {
  default: BOARD_TASKS as BoardTasksByColumn,
  marketing: BOARD_TASKS as BoardTasksByColumn,
  desarrollo: BOARD_TASKS as BoardTasksByColumn,
  design: BOARD_TASKS as BoardTasksByColumn,
  ventas: BOARD_TASKS as BoardTasksByColumn,
};

const parseSpanishDate = (value: string): Date | null => {
  if (!value || value === 'Sin fecha') {
    return null;
  }
  const [dayStr, monthAbbr, yearStr] = value.split(' ');
  if (!dayStr || !monthAbbr || !yearStr) {
    return null;
  }

  const monthIndex = SPANISH_MONTHS[monthAbbr];
  if (monthIndex === undefined) {
    return null;
  }

  const day = Number.parseInt(dayStr, 10);
  const year = Number.parseInt(yearStr, 10);
  if (Number.isNaN(day) || Number.isNaN(year)) {
    return null;
  }

  const date = new Date(year, monthIndex, day);
  return Number.isNaN(date.getTime()) ? null : date;
};

const getWeekStart = (date: Date): Date => {
  const result = new Date(date);
  const day = result.getDay();
  const diff = (day + 6) % 7; // Monday as first day
  result.setDate(result.getDate() - diff);
  result.setHours(0, 0, 0, 0);
  return result;
};

const formatWeekLabel = (date: Date): string => {
  const formatter = new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short' });
  const formatted = formatter.format(date);
  return `Semana del ${formatted.charAt(0).toUpperCase()}${formatted.slice(1)}`;
};

const formatMonthLabel = (date: Date): string => {
  const formatter = new Intl.DateTimeFormat('es-ES', { month: 'short' });
  const formatted = formatter.format(date);
  return `${formatted.charAt(0).toUpperCase()}${formatted.slice(1)}`;
};

type ReportsPageProps = {
  project?: SidebarProject | null;
  projects?: SidebarProject[];
  selectedId: string;
  onSelect: (projectId: string) => void;
  onBack?: () => void;
  onProfileClick?: () => void;
  onLogout?: () => void;
  headerNotifications?: HeaderProps['notifications'];
};

const ReportsPage: React.FC<ReportsPageProps> = ({
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

  const projectList = React.useMemo(() => projects ?? DEFAULT_PROJECTS, [projects]);

  const tasksSnapshot = React.useMemo<BoardTasksByColumn>(() => {
    if (project?.id && PROJECT_TASK_SNAPSHOTS[project.id]) {
      return PROJECT_TASK_SNAPSHOTS[project.id];
    }
    return PROJECT_TASK_SNAPSHOTS.default;
  }, [project]);

  const flattenedTasks = React.useMemo(() => {
    return COLUMN_ORDER.flatMap((columnId) => {
      const columnTasks = tasksSnapshot[columnId] ?? [];
      return columnTasks.map((task) => ({
        task,
        columnId,
        createdAtDate: parseSpanishDate(task.createdAt),
        updatedAtDate: parseSpanishDate(task.updatedAt),
      }));
    });
  }, [tasksSnapshot]);

  const totalTasks = flattenedTasks.length;
  const doneTasks = flattenedTasks.filter(({ task }) => task.status === 'Completado');
  const openTasks = totalTasks - doneTasks.length;

  const cycleDurations = React.useMemo(() => {
    return doneTasks
      .map(({ createdAtDate, updatedAtDate }) => {
        if (!createdAtDate || !updatedAtDate) {
          return null;
        }
        const milliseconds = updatedAtDate.getTime() - createdAtDate.getTime();
        return milliseconds > 0 ? milliseconds / 86_400_000 : null;
      })
      .filter((value): value is number => value !== null);
  }, [doneTasks]);

  const averageCycleTime = React.useMemo(() => {
    if (cycleDurations.length === 0) {
      return null;
    }
    const total = cycleDurations.reduce((accumulator, value) => accumulator + value, 0);
    return total / cycleDurations.length;
  }, [cycleDurations]);

  const weeklySummary = React.useMemo<WeeklySummary[]>(() => {
    if (flattenedTasks.length === 0) {
      return [];
    }

    const map = new Map<string, WeeklySummary>();

    const ensureEntry = (date: Date) => {
      const start = getWeekStart(date);
      const key = start.toISOString();
      if (!map.has(key)) {
        map.set(key, {
          key,
          start,
          newCount: 0,
          completedCount: 0,
          pendingCount: 0,
          completedDurations: [],
        });
      }
      return map.get(key)!;
    };

    flattenedTasks.forEach(({ task, createdAtDate, updatedAtDate }) => {
      if (createdAtDate) {
        ensureEntry(createdAtDate).newCount += 1;
      }
      if (task.status === 'Completado' && updatedAtDate) {
        const entry = ensureEntry(updatedAtDate);
        entry.completedCount += 1;
        if (createdAtDate) {
          const diff =
            (updatedAtDate.getTime() - createdAtDate.getTime()) / 86_400_000;
          if (diff >= 0) {
            entry.completedDurations.push(diff);
          }
        }
      }
    });

    const entries = Array.from(map.values()).sort(
      (a, b) => a.start.getTime() - b.start.getTime()
    );

    entries.forEach((entry) => {
      const weekEnd = new Date(entry.start);
      weekEnd.setDate(weekEnd.getDate() + 6);
      const pendingCount = flattenedTasks.filter(({ task, createdAtDate, updatedAtDate }) => {
        if (!createdAtDate) {
          return false;
        }
        if (createdAtDate > weekEnd) {
          return false;
        }
        if (task.status === 'Completado' && updatedAtDate && updatedAtDate <= weekEnd) {
          return false;
        }
        return true;
      }).length;
      entry.pendingCount = pendingCount;
    });

    return entries.sort((a, b) => b.start.getTime() - a.start.getTime());
  }, [flattenedTasks]);

  const distributionData = React.useMemo<DistributionItem[]>(() => {
    if (totalTasks === 0) {
      return COLUMN_ORDER.map((columnId) => ({
        id: columnId,
        label: STATUS_METADATA[columnId].label,
        value: 0,
        percentage: 0,
        colorClass: STATUS_METADATA[columnId].colorClass,
      }));
    }

    let accumulated = 0;

    return COLUMN_ORDER.map((columnId, index) => {
      const value = tasksSnapshot[columnId]?.length ?? 0;
      let percentage = Math.round((value / totalTasks) * 100);

      if (index === COLUMN_ORDER.length - 1) {
        percentage = Math.max(0, 100 - accumulated);
      } else {
        accumulated += percentage;
      }

      return {
        id: columnId,
        label: STATUS_METADATA[columnId].label,
        value,
        percentage,
        colorClass: STATUS_METADATA[columnId].colorClass,
      };
    });
  }, [tasksSnapshot, totalTasks]);

  const performanceRows = React.useMemo<PerformanceItem[]>(() => {
    if (weeklySummary.length === 0) {
      return [];
    }

    return weeklySummary.slice(0, 4).map((entry, index) => ({
      id: entry.key,
      label:
        index === 0
          ? 'Esta semana'
          : index === 1
          ? 'Semana pasada'
          : formatWeekLabel(entry.start),
      completed: entry.completedCount,
      new: entry.newCount,
      pending: entry.pendingCount,
    }));
  }, [weeklySummary]);

  const resolutionTrendPoints = React.useMemo<ResolutionPoint[]>(() => {
    if (flattenedTasks.length === 0) {
      return [];
    }

    const completedTasks = flattenedTasks.filter(
      ({ task, updatedAtDate }) => task.status === 'Completado' && updatedAtDate
    );

    const referenceDate =
      completedTasks.length > 0
        ? completedTasks.reduce((latest, item) => {
            if (!item.updatedAtDate) {
              return latest;
            }
            return item.updatedAtDate > latest ? item.updatedAtDate : latest;
          }, completedTasks[0].updatedAtDate!)
        : flattenedTasks.reduce((latest, item) => {
            if (!item.createdAtDate) {
              return latest;
            }
            return item.createdAtDate > latest ? item.createdAtDate : latest;
          }, new Date());

    const startDate = new Date(referenceDate.getFullYear(), referenceDate.getMonth() - 5, 1);
    const monthCounts = new Map<string, number>();

    completedTasks.forEach(({ updatedAtDate }) => {
      if (!updatedAtDate) {
        return;
      }
      const key = `${updatedAtDate.getFullYear()}-${updatedAtDate.getMonth()}`;
      monthCounts.set(key, (monthCounts.get(key) ?? 0) + 1);
    });

    const points: ResolutionPoint[] = [];
    const cursor = new Date(startDate);

    for (let i = 0; i < 6; i += 1) {
      const key = `${cursor.getFullYear()}-${cursor.getMonth()}`;
      points.push({
        month: formatMonthLabel(cursor),
        value: monthCounts.get(key) ?? 0,
      });
      cursor.setMonth(cursor.getMonth() + 1);
    }

    return points;
  }, [flattenedTasks]);

  const resolutionMaxValue = React.useMemo(() => {
    if (resolutionTrendPoints.length === 0) {
      return 1;
    }
    return Math.max(...resolutionTrendPoints.map((point) => point.value), 1);
  }, [resolutionTrendPoints]);

  const resolutionAverage = React.useMemo(() => {
    if (resolutionTrendPoints.length === 0) {
      return null;
    }
    const total = resolutionTrendPoints.reduce((accumulator, point) => accumulator + point.value, 0);
    return total / resolutionTrendPoints.length;
  }, [resolutionTrendPoints]);

  const resolutionRate = totalTasks > 0 ? Math.round((doneTasks.length / totalTasks) * 100) : 0;

  const metrics = React.useMemo<ReportMetric[]>(() => {
    const latestWeek = weeklySummary[0];
    const previousWeek = weeklySummary[1];

    const totalDelta =
      latestWeek !== undefined
        ? `${latestWeek.newCount >= 0 ? '+' : ''}${latestWeek.newCount} nuevas`
        : undefined;

    const totalTrend: Trend =
      latestWeek !== undefined && previousWeek !== undefined
        ? latestWeek.newCount >= previousWeek.newCount
          ? 'up'
          : 'down'
        : 'neutral';

    const completedDelta =
      latestWeek !== undefined && previousWeek !== undefined
        ? latestWeek.completedCount - previousWeek.completedCount
        : latestWeek !== undefined
        ? latestWeek.completedCount
        : null;

    let resolutionDelta: string | undefined;
    let resolutionTrend: Trend = 'neutral';
    if (completedDelta !== null) {
      resolutionDelta = `${completedDelta >= 0 ? '+' : ''}${completedDelta} completadas vs semana anterior`;
      resolutionTrend = completedDelta >= 0 ? 'up' : 'down';
    }

    const latestCycleAverage =
      latestWeek && latestWeek.completedDurations.length > 0
        ? latestWeek.completedDurations.reduce((accumulator, value) => accumulator + value, 0) /
          latestWeek.completedDurations.length
        : null;

    const previousCycleAverage =
      previousWeek && previousWeek.completedDurations.length > 0
        ? previousWeek.completedDurations.reduce((accumulator, value) => accumulator + value, 0) /
          previousWeek.completedDurations.length
        : null;

    let cycleDelta: string | undefined;
    let cycleTrend: Trend = 'neutral';

    if (latestCycleAverage !== null && previousCycleAverage !== null) {
      const diff = previousCycleAverage - latestCycleAverage;
      cycleTrend = diff >= 0 ? 'up' : 'down';
      cycleDelta = `${diff >= 0 ? '-' : '+'}${Math.abs(diff).toFixed(1)} días vs semana anterior`;
    }

    const latestPending = latestWeek?.pendingCount ?? openTasks;
    const previousPending = previousWeek?.pendingCount ?? latestPending;
    const pendingDiff = latestPending - previousPending;

    const pendingDelta =
      previousWeek !== undefined || latestWeek !== undefined
        ? `${pendingDiff >= 0 ? '+' : ''}${pendingDiff} vs semana anterior`
        : undefined;

    const pendingTrend: Trend =
      pendingDiff < 0 ? 'up' : pendingDiff > 0 ? 'down' : 'neutral';

    return [
      {
        id: 'total',
        label: 'Total de tareas',
        value: totalTasks.toString(),
      },
      {
        id: 'resolution',
        label: 'Tasa de resolución',
        value: `${resolutionRate}%`,
      },
      {
        id: 'cycle',
        label: 'Tiempo promedio',
        value: averageCycleTime !== null ? `${averageCycleTime.toFixed(1)} días` : '—',
      },
      {
        id: 'pending',
        label: 'Pendientes de gestionar',
        value: openTasks.toString(),
      },
    ];
  }, [averageCycleTime, openTasks, resolutionRate, totalTasks, weeklySummary]);

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
          title="Reports"
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

              <div className="flex flex-wrap gap-2 text-xs" />
            </div>

            <p className="mt-4 max-w-3xl text-sm text-slate-600">
              Revisa el rendimiento del proyecto, tiempos de entrega, capacidad del equipo y posibles cuellos de botella. Usa
              esta vista para anticipar riesgos y ajustar la planificación de los próximos sprints.
            </p>
          </section>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => (
              <article
                key={metric.id}
                className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white px-5 py-5 shadow-sm shadow-slate-900/10"
              >
                <header className="flex items-start justify-between gap-3">
                  <span className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">{metric.label}</span>
                </header>
                <p className="text-3xl font-semibold text-slate-900">{metric.value}</p>
              </article>
            ))}
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <article className="rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-lg shadow-slate-900/5">
              <header className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">
                    Distribución por estado
                  </h3>
                  <p className="text-xs text-slate-500">Detalle de tareas activas agrupadas según su estado actual en el tablero.</p>
                </div>
                <span className="text-xs font-semibold text-slate-400">Últimos 30 días</span>
              </header>

              {distributionData.length > 0 && totalTasks > 0 ? (
                <ul className="mt-6 space-y-3 text-xs text-slate-500">
                  {distributionData.map((item) => (
                    <li key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className={`h-2 w-2 rounded-full ${item.colorClass}`} />
                          <span className="text-sm font-semibold text-slate-800">{item.label}</span>
                        </div>
                        <span className="text-xs text-slate-400">
                          {item.value} {item.value === 1 ? 'tarea' : 'tareas'} · {item.percentage}%
                        </span>
                      </div>
                      <div className="mt-3 h-2 rounded-full bg-white shadow-inner shadow-slate-900/5">
                        <div
                          className={`h-full rounded-full ${item.colorClass}`}
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-8 text-center text-xs text-slate-400">
                  No hay tareas registradas en este proyecto para calcular la distribución.
                </div>
              )}
            </article>

            <article className="rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-lg shadow-slate-900/5">
              <header className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">Rendimiento semanal</h3>
                  <p className="text-xs text-slate-500">
                    Tareas resueltas frente a nuevas solicitudes y pendientes de cierre.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  <span className="inline-flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Resueltas
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-blue-400" />
                    Nuevas
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-amber-400" />
                    Pendientes
                  </span>
                </div>
              </header>

              {performanceRows.length > 0 ? (
                <ul className="mt-6 space-y-3 text-xs text-slate-500">
                  {performanceRows.map((item) => (
                    <li key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                      <div className="flex items-center justify-between text-sm font-semibold text-slate-800">
                        <span>{item.label}</span>
                        <span className="text-xs text-slate-400">
                          {item.completed} / {item.new} / {item.pending}
                        </span>
                      </div>
                      <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-slate-500">
                        <div className="rounded-xl bg-white px-3 py-2 shadow-inner shadow-emerald-500/10">
                          <span className="font-semibold text-emerald-600">{item.completed}</span>
                          <span className="block text-[11px] uppercase tracking-wide text-slate-400">Resueltas</span>
                        </div>
                        <div className="rounded-xl bg-white px-3 py-2 shadow-inner shadow-blue-500/10">
                          <span className="font-semibold text-blue-500">{item.new}</span>
                          <span className="block text-[11px] uppercase tracking-wide text-slate-400">Nuevas</span>
                        </div>
                        <div className="rounded-xl bg-white px-3 py-2 shadow-inner shadow-amber-500/10">
                          <span className="font-semibold text-amber-500">{item.pending}</span>
                          <span className="block text-[11px] uppercase tracking-wide text-slate-400">Pendientes</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-8 text-center text-xs text-slate-400">
                  Aún no hay actividad semanal registrada para este proyecto.
                </div>
              )}
            </article>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-lg shadow-slate-900/5">
            <header className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">Tasa de resolución</h3>
                <p className="text-xs text-slate-500">Tareas cerradas mes a mes en el periodo seleccionado.</p>
              </div>
              <span className="text-xs font-semibold text-slate-400">
                {resolutionAverage !== null ? `Promedio · ${resolutionAverage.toFixed(1)} tareas/mes` : ''}
              </span>
            </header>

            <div className="mt-6 rounded-3xl bg-gradient-to-b from-blue-500/10 via-slate-50 to-white p-6">
              {resolutionTrendPoints.length >= 2 ? (
                <svg viewBox="0 0 720 220" className="h-52 w-full">
                  <defs>
                    <linearGradient id="resolutionGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d={`M0,200 ${resolutionTrendPoints
                      .map((point, index) => {
                        const ratio =
                          resolutionTrendPoints.length > 1
                            ? index / (resolutionTrendPoints.length - 1)
                            : 0;
                        const x = ratio * 720;
                        const y =
                          200 - (point.value / resolutionMaxValue) * 180;
                        return `L${x},${y}`;
                      })
                      .join(' ')} L720,200 Z`}
                    fill="url(#resolutionGradient)"
                    stroke="none"
                  />
                  <polyline
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={resolutionTrendPoints
                      .map((point, index) => {
                        const ratio =
                          resolutionTrendPoints.length > 1
                            ? index / (resolutionTrendPoints.length - 1)
                            : 0;
                        const x = ratio * 720;
                        const y =
                          200 - (point.value / resolutionMaxValue) * 180;
                        return `${x},${y}`;
                      })
                      .join(' ')}
                  />
                  {resolutionTrendPoints.map((point, index) => {
                    const ratio =
                      resolutionTrendPoints.length > 1
                        ? index / (resolutionTrendPoints.length - 1)
                        : 0;
                    const x = ratio * 720;
                    const y =
                      200 - (point.value / resolutionMaxValue) * 180;
                    return (
                      <g key={`${point.month}-${index}`}>
                        <circle cx={x} cy={y} r="5" fill="#2563EB" stroke="#fff" strokeWidth="2" />
                        <text
                          x={x}
                          y={210}
                          textAnchor="middle"
                          className="fill-slate-400 text-[10px] uppercase tracking-wide"
                        >
                          {point.month}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              ) : (
                <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white text-xs text-slate-400">
                  No hay suficientes tareas completadas para generar el histórico.
                </div>
              )}
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

export default ReportsPage;


