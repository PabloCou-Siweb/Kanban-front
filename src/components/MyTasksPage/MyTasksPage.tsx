import React from 'react';

export type MyTask = {
  id: string;
  title: string;
  projectId: string;
  projectName: string;
  status: 'Pendiente' | 'En progreso' | 'En revisión' | 'Completado';
  priority: 'Alta' | 'Media' | 'Baja';
  dueDate: string;
  boardTaskRef?: {
    columnId: string;
    taskId: string;
  };
};

export const DEFAULT_TASKS: MyTask[] = [
  {
    id: 'KB-301',
    title: 'Mapa de stakeholders',
    projectId: 'marketing',
    projectName: 'Marketing Launch',
    status: 'Pendiente',
    priority: 'Media',
    dueDate: 'Sin fecha',
    boardTaskRef: {
      columnId: 'pending',
      taskId: 'KB-301',
    },
  },
  {
    id: 'KB-305',
    title: 'Auditoría accesibilidad',
    projectId: 'design',
    projectName: 'UI/UX Design',
    status: 'Pendiente',
    priority: 'Alta',
    dueDate: '18 Abr',
    boardTaskRef: {
      columnId: 'pending',
      taskId: 'KB-305',
    },
  },
  {
    id: 'KB-298',
    title: 'Sincronización con calendario',
    projectId: 'desarrollo',
    projectName: 'Desarrollo Web',
    status: 'En progreso',
    priority: 'Alta',
    dueDate: '12 Abr',
    boardTaskRef: {
      columnId: 'in-progress',
      taskId: 'KB-298',
    },
  },
  {
    id: 'KB-303',
    title: 'Componentes de tablero',
    projectId: 'desarrollo',
    projectName: 'Desarrollo Web',
    status: 'En progreso',
    priority: 'Media',
    dueDate: 'Hoy',
    boardTaskRef: {
      columnId: 'in-progress',
      taskId: 'KB-303',
    },
  },
  {
    id: 'KB-287',
    title: 'Validación permisos avanzados',
    projectId: 'design',
    projectName: 'UI/UX Design',
    status: 'En revisión',
    priority: 'Alta',
    dueDate: '11 Abr',
    boardTaskRef: {
      columnId: 'review',
      taskId: 'KB-287',
    },
  },
  {
    id: 'KB-282',
    title: 'Automatización de reportes',
    projectId: 'desarrollo',
    projectName: 'Desarrollo Web',
    status: 'Completado',
    priority: 'Alta',
    dueDate: '09 Abr',
    boardTaskRef: {
      columnId: 'done',
      taskId: 'KB-282',
    },
  },
];

const statusStyles: Record<MyTask['status'], string> = {
  Pendiente: 'bg-amber-100 text-amber-700',
  'En progreso': 'bg-blue-100 text-blue-700',
  'En revisión': 'bg-purple-100 text-purple-700',
  Completado: 'bg-emerald-100 text-emerald-700',
};

type MyTasksPageProps = {
  tasks?: MyTask[];
  onOpenProject?: (projectId: string) => void;
  onOpenTaskDetails?: (task: MyTask) => void;
  title?: string;
  description?: string;
};

const MyTasksPage: React.FC<MyTasksPageProps> = ({
  tasks = DEFAULT_TASKS,
  onOpenProject,
  onOpenTaskDetails,
  title = 'Mis tareas asignadas',
  description = 'Consulta tus tareas pendientes y su estado actual dentro de cada proyecto.',
}) => {
  return (
    <section className="flex h-full flex-col gap-6 rounded-3xl bg-white px-6 py-8 shadow-lg shadow-slate-900/10 md:px-8 md:py-10">
      <header className="flex flex-col gap-2">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>
      </header>

      <div className="mt-6 grid flex-1 content-start gap-3 md:grid-cols-2 xl:grid-cols-4">
        {tasks.map((task) => (
          <article
            key={task.id}
            onClick={() => {
              if (onOpenTaskDetails) {
                onOpenTaskDetails(task);
              } else {
                onOpenProject?.(task.projectId);
              }
            }}
            className="group flex h-full min-h-[180px] w-full max-w-xs cursor-pointer flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-sm transition hover:border-blue-200 hover:shadow-lg"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">{task.title}</h3>
              </div>
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${statusStyles[task.status]}`}
              >
                {task.status}
              </span>
            </div>

            <div className="flex flex-wrap gap-3 text-xs text-slate-500">
              <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">
                {task.projectName}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1">
                Fecha límite: <strong className="text-slate-700">{task.dueDate}</strong>
              </span>
            </div>
            <span className="mt-auto text-xs font-semibold uppercase tracking-wide text-blue-500">Ver proyecto</span>
          </article>
        ))}
      </div>
    </section>
  );
};

export default MyTasksPage;

