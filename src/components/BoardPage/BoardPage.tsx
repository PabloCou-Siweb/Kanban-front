import React from 'react';
import Sidebar, { SidebarProject, DEFAULT_PROJECTS } from '../Sidebar/Sidebar';
import Header, { HeaderProps } from '../Header/Header';

export const BOARD_COLUMNS = [
  {
    id: 'pending',
    title: 'Pendiente',
    accent: 'border-amber-100 bg-white',
    headerAccent: 'bg-amber-500 text-white',
    headerTag: 'bg-amber-50 text-amber-700',
  },
  {
    id: 'in-progress',
    title: 'En progreso',
    accent: 'border-blue-100 bg-white',
    headerAccent: 'bg-blue-500 text-white',
    headerTag: 'bg-blue-50 text-blue-700',
  },
  {
    id: 'review',
    title: 'En revisión',
    accent: 'border-purple-100 bg-white',
    headerAccent: 'bg-purple-500 text-white',
    headerTag: 'bg-purple-50 text-purple-700',
  },
  {
    id: 'done',
    title: 'Completado',
    accent: 'border-emerald-100 bg-white',
    headerAccent: 'bg-emerald-500 text-white',
    headerTag: 'bg-emerald-50 text-emerald-700',
  },
];

export const BOARD_TASKS: Record<string, Array<{
  id: string;
  title: string;
  description: string;
  owner: string;
  avatar: string;
  due: string;
  status: 'Pendiente' | 'En progreso' | 'En revisión' | 'Completado';
  priority: 'Alta' | 'Media' | 'Baja';
  createdAt: string;
  updatedAt: string;
}>> = {
  pending: [
    {
      id: 'KB-301',
      title: 'Mapa de stakeholders',
      description: 'Identificar decisores y revisores clave para el go-live.',
      owner: 'María S.',
      avatar: 'MS',
      due: 'Sin fecha',
      status: 'Pendiente',
      priority: 'Media',
      createdAt: '02 Abr 2025',
      updatedAt: '05 Abr 2025',
    },
    {
      id: 'KB-305',
      title: 'Auditoría accesibilidad',
      description: 'Revisión AA para flujos críticos de tableros.',
      owner: 'Ana R.',
      avatar: 'AR',
      due: '18 Abr',
      status: 'Pendiente',
      priority: 'Alta',
      createdAt: '04 Abr 2025',
      updatedAt: '04 Abr 2025',
    },
  ],
  'in-progress': [
    {
      id: 'KB-298',
      title: 'Sincronización con calendario',
      description: 'Agregar exportación de tareas a Google Calendar.',
      owner: 'Carlos O.',
      avatar: 'CO',
      due: '12 Abr',
      status: 'En progreso',
      priority: 'Alta',
      createdAt: '30 Mar 2025',
      updatedAt: '08 Abr 2025',
    },
    {
      id: 'KB-303',
      title: 'Componentes de tablero',
      description: 'Refactorizar drag & drop y estados visuales.',
      owner: 'Daniel P.',
      avatar: 'DP',
      due: 'Hoy',
      status: 'En progreso',
      priority: 'Media',
      createdAt: '03 Abr 2025',
      updatedAt: '09 Abr 2025',
    },
  ],
  review: [
    {
      id: 'KB-287',
      title: 'Validación permisos avanzados',
      description: 'QA de roles jerárquicos y acceso a proyectos.',
      owner: 'María S.',
      avatar: 'MS',
      due: '11 Abr',
      status: 'En revisión',
      priority: 'Alta',
      createdAt: '28 Mar 2025',
      updatedAt: '08 Abr 2025',
    },
  ],
  done: [
    {
      id: 'KB-280',
      title: 'Template de retrospectivas',
      description: 'Diseñar modelo reutilizable para sesiones retro.',
      owner: 'Laura M.',
      avatar: 'LM',
      due: '08 Abr',
      status: 'Completado',
      priority: 'Media',
      createdAt: '20 Mar 2025',
      updatedAt: '08 Abr 2025',
    },
    {
      id: 'KB-282',
      title: 'Automatización de reportes',
      description: 'Enviar métricas semanales a stakeholders automáticamente.',
      owner: 'Carlos O.',
      avatar: 'CO',
      due: '09 Abr',
      status: 'Completado',
      priority: 'Alta',
      createdAt: '22 Mar 2025',
      updatedAt: '09 Abr 2025',
    },
  ],
};

export type BoardTaskItem = (typeof BOARD_TASKS)['pending'][number];

const BOARD_MEMBERS = [
  { id: 'ms', name: 'María Sánchez', display: 'María S.', initials: 'MS' },
  { id: 'ar', name: 'Ana Rodríguez', display: 'Ana R.', initials: 'AR' },
  { id: 'co', name: 'Carlos Ortega', display: 'Carlos O.', initials: 'CO' },
  { id: 'dp', name: 'Daniel Pérez', display: 'Daniel P.', initials: 'DP' },
  { id: 'lm', name: 'Laura Martínez', display: 'Laura M.', initials: 'LM' },
  { id: 'na', name: 'Sin asignar', display: 'Sin asignar', initials: 'NA' },
];

const PRIORITY_OPTIONS: BoardTaskItem['priority'][] = ['Alta', 'Media', 'Baja'];

const PRIORITY_BADGE_STYLES: Record<BoardTaskItem['priority'], string> = {
  Alta: 'bg-rose-100 text-rose-700 border border-rose-200',
  Media: 'bg-amber-100 text-amber-700 border border-amber-200',
  Baja: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
};

const STATUS_BADGE_STYLES: Record<BoardTaskItem['status'], string> = {
  Pendiente: 'bg-amber-100 text-amber-700',
  'En progreso': 'bg-blue-100 text-blue-700',
  'En revisión': 'bg-purple-100 text-purple-700',
  Completado: 'bg-emerald-100 text-emerald-700',
};

const LABEL_PRESETS = [
  {
    id: 'disciplinas',
    title: 'Disciplinas',
    labels: ['Backend', 'Frontend', 'Diseño', 'Contenido', 'Producto', 'Automatización'],
  },
  {
    id: 'estatus',
    title: 'Estado operativo',
    labels: [
      'Pendiente de aprobación',
      'Esperando feedback',
      'En implementación',
      'Listo para producción',
      'Bloqueado por dependencia',
    ],
  },
  {
    id: 'areas',
    title: 'Áreas de trabajo',
    labels: ['Desarrollo', 'Diseño', 'Integración', 'Testing', 'Documentación', 'Propuesta', 'Marketing'],
  },
];

type BoardPageProps = {
  project?: SidebarProject | null;
  projects?: SidebarProject[];
  selectedId: string;
  onSelect: (projectId: string) => void;
  onBack?: () => void;
  onProfileClick?: () => void;
  onLogout?: () => void;
  initialTaskRef?: { taskId: string; columnId?: string } | null;
  onInitialTaskHandled?: () => void;
  currentUser?: {
    name: string;
    initials: string;
  };
  headerNotifications?: HeaderProps['notifications'];
};

const BoardPage: React.FC<BoardPageProps> = ({
  project,
  projects = DEFAULT_PROJECTS,
  selectedId,
  onSelect,
  onBack,
  onProfileClick,
  onLogout,
  initialTaskRef,
  onInitialTaskHandled,
  currentUser: currentUserProp,
  headerNotifications,
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);
  const [boardTasks, setBoardTasks] = React.useState(BOARD_TASKS);
  const [taskCounter, setTaskCounter] = React.useState(() =>
    Object.values(BOARD_TASKS).reduce((accumulator, list) => accumulator + list.length, 0)
  );
  const [draggedTask, setDraggedTask] = React.useState<{ columnId: string; taskId: string } | null>(null);
  const [selectedTask, setSelectedTask] = React.useState<BoardTaskItem | null>(null);
  const [selectedTaskColumn, setSelectedTaskColumn] = React.useState<string | null>(null);
  const [showAttachModal, setShowAttachModal] = React.useState(false);
  const [showCommentsModal, setShowCommentsModal] = React.useState(false);
  const [showLabelsModal, setShowLabelsModal] = React.useState(false);
  const [commentDraft, setCommentDraft] = React.useState('');
  const [comments, setComments] = React.useState<Record<string, string[]>>({});
  const [attachments, setAttachments] = React.useState<Record<string, Array<{ name: string; size: number }>>>({});
  const [taskDraft, setTaskDraft] = React.useState<BoardTaskItem | null>(null);
  const [isEditingTask, setIsEditingTask] = React.useState(false);
  const [labelsMap, setLabelsMap] = React.useState<Record<string, string[]>>({});
  const [newLabel, setNewLabel] = React.useState('');
  const [priorityFilter, setPriorityFilter] = React.useState<'all' | BoardTaskItem['priority']>('all');
  const [assigneeFilter, setAssigneeFilter] = React.useState<'all' | string>('all');
  const [showFilters, setShowFilters] = React.useState(false);
  const [openFilterSection, setOpenFilterSection] = React.useState<'priority' | 'assignee' | null>(null);

  const handleResetFilters = () => {
    setPriorityFilter('all');
    setAssigneeFilter('all');
    setOpenFilterSection(null);
  };

  const renderDropdownSection = (
    title: string,
    isOpen: boolean,
    onToggle: () => void,
    content: React.ReactNode
  ) => (
    <div className="rounded-2xl border border-slate-200 bg-slate-50">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500"
      >
        <span>{title}</span>
        <span className="text-[11px] text-slate-400">{isOpen ? '▲' : '▼'}</span>
      </button>
      {isOpen && <div className="border-t border-slate-200 px-3 py-3 text-xs text-slate-500">{content}</div>}
    </div>
  );

  const filterDropdown = (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowFilters((prev) => !prev)}
        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600 transition hover:border-blue-200 hover:text-blue-600"
      >
        <span>Filtros</span>
        <span className="text-[11px] text-slate-400">{showFilters ? '▲' : '▼'}</span>
      </button>

      {showFilters && (
        <div className="absolute right-0 top-full z-30 mt-2 w-[320px] space-y-3 rounded-3xl border border-slate-200 bg-white p-4 text-xs text-slate-500 shadow-xl shadow-slate-900/10">
          {renderDropdownSection(
            'Prioridad',
            openFilterSection === 'priority',
            () => setOpenFilterSection((prev) => (prev === 'priority' ? null : 'priority')),
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setPriorityFilter('all')}
                className={`flex w-full items-center justify-between rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                  priorityFilter === 'all'
                    ? 'border-blue-300 bg-blue-50 text-blue-600'
                    : 'border-slate-200 text-slate-500 hover:border-blue-200 hover:text-blue-600'
                }`}
              >
                Todas
              </button>
              {PRIORITY_OPTIONS.map((priority) => (
                <button
                  key={priority}
                  type="button"
                  onClick={() => setPriorityFilter(priority)}
                  className={`flex w-full items-center justify-between rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                    priorityFilter === priority
                      ? 'border-blue-300 bg-blue-50 text-blue-600'
                      : 'border-slate-200 text-slate-500 hover:border-blue-200 hover:text-blue-600'
                  }`}
                >
                  {priority}
                </button>
              ))}
            </div>
          )}

          {renderDropdownSection(
            'Asignado a',
            openFilterSection === 'assignee',
            () => setOpenFilterSection((prev) => (prev === 'assignee' ? null : 'assignee')),
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setAssigneeFilter('all')}
                className={`flex w-full items-center justify-between rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                  assigneeFilter === 'all'
                    ? 'border-blue-300 bg-blue-50 text-blue-600'
                    : 'border-slate-200 text-slate-500 hover:border-blue-200 hover:text-blue-600'
                }`}
              >
                Todos
              </button>
              <button
                type="button"
                onClick={() => setAssigneeFilter('Sin asignar')}
                className={`flex w-full items-center justify-between rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                  assigneeFilter === 'Sin asignar'
                    ? 'border-blue-300 bg-blue-50 text-blue-600'
                    : 'border-slate-200 text-slate-500 hover:border-blue-200 hover:text-blue-600'
                }`}
              >
                Sin asignar
              </button>
              {BOARD_MEMBERS.filter((member) => member.display !== 'Sin asignar').map((member) => (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => setAssigneeFilter(member.display)}
                  className={`flex w-full items-center justify-between rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                    assigneeFilter === member.display
                      ? 'border-blue-300 bg-blue-50 text-blue-600'
                      : 'border-slate-200 text-slate-500 hover:border-blue-200 hover:text-blue-600'
                  }`}
                >
                  {member.display}
                </button>
              ))}
            </div>
          )}

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500 transition hover:border-blue-200 hover:text-blue-600"
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const currentUser = React.useMemo(
    () => currentUserProp ?? { name: 'María Sánchez', initials: 'MS' },
    [currentUserProp]
  );

  const selectedMemberId = React.useMemo(() => {
    if (!taskDraft) {
      return 'custom';
    }
    return BOARD_MEMBERS.find((member) => member.display === taskDraft.owner)?.id ?? 'custom';
  }, [taskDraft]);

  const isTaskDraftDirty = React.useMemo(() => {
    if (!taskDraft || !selectedTask) {
      return false;
    }

    return (
      taskDraft.title !== selectedTask.title ||
      taskDraft.description !== selectedTask.description ||
      taskDraft.status !== selectedTask.status ||
      taskDraft.priority !== selectedTask.priority ||
      taskDraft.owner !== selectedTask.owner ||
      taskDraft.due !== selectedTask.due ||
      taskDraft.createdAt !== selectedTask.createdAt ||
      taskDraft.updatedAt !== selectedTask.updatedAt
    );
  }, [selectedTask, taskDraft]);

  const taskKey = React.useMemo(() => {
    if (!selectedTask || !selectedTaskColumn) {
      return null;
    }
    return `${selectedTask.id}-${selectedTaskColumn}`;
  }, [selectedTask, selectedTaskColumn]);

  const activeLabels = React.useMemo(() => {
    if (!taskKey) {
      return [] as string[];
    }
    return labelsMap[taskKey] ?? [];
  }, [labelsMap, taskKey]);

  const trimmedNewLabel = newLabel.trim();
  const isNewLabelDuplicate = React.useMemo(
    () => trimmedNewLabel !== '' && activeLabels.some((item) => item.toLowerCase() === trimmedNewLabel.toLowerCase()),
    [activeLabels, trimmedNewLabel]
  );

  const currentAttachments = React.useMemo(() => {
    if (!taskKey) {
      return [] as Array<{ name: string; size: number }>;
    }
    return attachments[taskKey] ?? [];
  }, [attachments, taskKey]);

  const findTaskById = React.useCallback(
    (taskId: string, columnHint?: string) => {
      if (columnHint && boardTasks[columnHint]) {
        const hintedTask = boardTasks[columnHint].find((task) => task.id === taskId);
        if (hintedTask) {
          return { task: hintedTask, columnId: columnHint };
        }
      }

      for (const column of Object.keys(boardTasks)) {
        const result = boardTasks[column].find((task) => task.id === taskId);
        if (result) {
          return { task: result, columnId: column };
        }
      }

      return null;
    },
    [boardTasks]
  );

  React.useEffect(() => {
    if (!initialTaskRef) {
      return;
    }

    const found = findTaskById(initialTaskRef.taskId, initialTaskRef.columnId);
    if (found) {
      setSelectedTask(found.task);
      setSelectedTaskColumn(found.columnId);
      setTaskDraft({ ...found.task });
      setIsEditingTask(false);
      setShowAttachModal(false);
      setShowCommentsModal(false);
      setShowLabelsModal(false);
      setNewLabel('');
    }

    onInitialTaskHandled?.();
  }, [findTaskById, initialTaskRef, onInitialTaskHandled]);

  const handleDragStart = (columnId: string, taskId: string) => {
    setDraggedTask({ columnId, taskId });
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
  };

  const handleDrop = (targetColumnId: string) => {
    setBoardTasks((prev) => {
      if (!draggedTask) {
        return prev;
      }

      const { columnId, taskId } = draggedTask;
      if (!prev[columnId]) {
        return prev;
      }

      const sourceTasks = [...prev[columnId]];
      const taskIndex = sourceTasks.findIndex((item) => item.id === taskId);
      if (taskIndex === -1) {
        return prev;
      }

      const [movedTask] = sourceTasks.splice(taskIndex, 1);

      if (columnId === targetColumnId) {
        return {
          ...prev,
          [columnId]: [...sourceTasks, movedTask],
        };
      }

      const targetTasks = [...(prev[targetColumnId] ?? [])];
      const nextStatus = BOARD_COLUMNS.find((col) => col.id === targetColumnId)?.title ?? movedTask.status;
      targetTasks.push({ ...movedTask, status: nextStatus as typeof movedTask.status });

      return {
        ...prev,
        [columnId]: sourceTasks,
        [targetColumnId]: targetTasks,
      };
    });

    if (draggedTask && draggedTask.columnId !== targetColumnId) {
      const oldKey = `${draggedTask.taskId}-${draggedTask.columnId}`;
      const newKey = `${draggedTask.taskId}-${targetColumnId}`;

      setComments((prev) => {
        if (!prev[oldKey]) {
          return prev;
        }
        const { [oldKey]: moved, ...rest } = prev;
        return moved ? { ...rest, [newKey]: moved } : rest;
      });

      setAttachments((prev) => {
        if (!prev[oldKey]) {
          return prev;
        }
        const { [oldKey]: moved, ...rest } = prev;
        return moved ? { ...rest, [newKey]: moved } : rest;
      });

      setLabelsMap((prev) => {
        if (!prev[oldKey]) {
          return prev;
        }
        const { [oldKey]: moved, ...rest } = prev;
        return moved ? { ...rest, [newKey]: moved } : rest;
      });
    }

    setDraggedTask(null);
  };

  const handleAddTask = () => {
    const nextCounter = taskCounter + 1;
    const newTaskId = `KB-${300 + nextCounter}`;

    setBoardTasks((prev) => {
      const pendingTasks = [...(prev.pending ?? [])];
      const newTask = {
        id: newTaskId,
        title: 'Nueva tarea',
        description: 'Describe el objetivo y asigna responsables.',
        owner: 'Sin asignar',
        avatar: 'NA',
        due: 'Sin fecha',
        status: 'Pendiente' as const,
        priority: 'Baja' as const,
        createdAt: new Date().toLocaleDateString('es-ES', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
        updatedAt: new Date().toLocaleDateString('es-ES', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
      };

      pendingTasks.push(newTask);

      return {
        ...prev,
        pending: pendingTasks,
      };
    });

    setTaskCounter((prev) => prev + 1);
  };

  const handleOpenTask = (columnId: string, taskId: string) => {
    const task = boardTasks[columnId]?.find((item) => item.id === taskId);
    if (!task) {
      return;
    }
    setSelectedTask(task);
    setSelectedTaskColumn(columnId);
    setTaskDraft({ ...task });
    setIsEditingTask(false);
  };

  const handleCloseTask = () => {
    setSelectedTask(null);
    setSelectedTaskColumn(null);
    setTaskDraft(null);
    setIsEditingTask(false);
    setShowAttachModal(false);
    setShowCommentsModal(false);
    setShowLabelsModal(false);
    setNewLabel('');
  };

  const handleAddComment = () => {
    if (!selectedTaskColumn || !selectedTask || commentDraft.trim() === '') {
      return;
    }

    setComments((prev) => {
      const key = `${selectedTask.id}-${selectedTaskColumn}`;
      const currentList = prev[key] ?? [];
      return {
        ...prev,
        [key]: [...currentList, commentDraft.trim()],
      };
    });

    setCommentDraft('');
  };

  const handleDeleteComment = (taskId: string, columnId: string, index: number) => {
    setComments((prev) => {
      const key = `${taskId}-${columnId}`;
      const existing = prev[key] ?? [];
      const nextList = existing.filter((_, itemIndex) => itemIndex !== index);

      if (nextList.length === 0) {
        const { [key]: _, ...rest } = prev;
        return rest;
      }

      return {
        ...prev,
        [key]: nextList,
      };
    });
  };

  const handleUploadFiles = (files: FileList) => {
    if (!selectedTask || !selectedTaskColumn || files.length === 0) {
      return;
    }

    const key = `${selectedTask.id}-${selectedTaskColumn}`;

    setAttachments((prev) => {
      const current = prev[key] ?? [];
      const nextFiles = Array.from(files).map((file) => ({
        name: file.name,
        size: file.size,
      }));

      return {
        ...prev,
        [key]: [...current, ...nextFiles],
      };
    });
  };

  const handleRemoveAttachment = (taskId: string, columnId: string, index: number) => {
    setAttachments((prev) => {
      const key = `${taskId}-${columnId}`;
      const list = prev[key] ?? [];
      const nextList = list.filter((_, itemIndex) => itemIndex !== index);

      if (nextList.length === 0) {
        const { [key]: _, ...rest } = prev;
        return rest;
      }

      return {
        ...prev,
        [key]: nextList,
      };
    });
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(i === 0 ? 0 : 1)} ${sizes[i]}`;
  };

  const handleTaskDraftChange = <K extends keyof BoardTaskItem>(field: K, value: BoardTaskItem[K]) => {
    setTaskDraft((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSelectMember = (memberId: string) => {
    const member = BOARD_MEMBERS.find((item) => item.id === memberId);
    if (!member) {
      return;
    }
    setTaskDraft((prev) => (prev ? { ...prev, owner: member.display, avatar: member.initials } : prev));
  };

  const handleResetTaskDraft = () => {
    if (selectedTask) {
      setTaskDraft({ ...selectedTask });
    }
  };

  const resolveColumnIdByStatus = (status: BoardTaskItem['status']) => {
    const column = BOARD_COLUMNS.find((item) => item.title === status);
    return column?.id ?? null;
  };

  const handleSaveTaskChanges = () => {
    if (!taskDraft || !selectedTask || !selectedTaskColumn) {
      return;
    }

    const targetColumnId = resolveColumnIdByStatus(taskDraft.status) ?? selectedTaskColumn;
    const updatedTask: BoardTaskItem = { ...taskDraft };

    setBoardTasks((prev) => {
      const sourceTasks = (prev[selectedTaskColumn] ?? []).filter((task) => task.id !== updatedTask.id);
      const targetTasks = targetColumnId === selectedTaskColumn
        ? [...sourceTasks, updatedTask]
        : [...(prev[targetColumnId] ?? []), updatedTask];

      return {
        ...prev,
        [selectedTaskColumn]: sourceTasks,
        [targetColumnId]: targetTasks,
      };
    });

    if (selectedTaskColumn !== targetColumnId) {
      const oldKey = `${selectedTask.id}-${selectedTaskColumn}`;
      const newKey = `${selectedTask.id}-${targetColumnId}`;

      setComments((prev) => {
        if (!prev[oldKey]) {
          return prev;
        }
        const { [oldKey]: moved, ...rest } = prev;
        return moved ? { ...rest, [newKey]: moved } : rest;
      });

      setAttachments((prev) => {
        if (!prev[oldKey]) {
          return prev;
        }
        const { [oldKey]: moved, ...rest } = prev;
        return moved ? { ...rest, [newKey]: moved } : rest;
      });

      setLabelsMap((prev) => {
        if (!prev[oldKey]) {
          return prev;
        }
        const { [oldKey]: moved, ...rest } = prev;
        return moved ? { ...rest, [newKey]: moved } : rest;
      });
    }

    setSelectedTask(updatedTask);
    setSelectedTaskColumn(targetColumnId);
    setTaskDraft({ ...updatedTask });
    setIsEditingTask(false);
  };

  const handleToggleLabel = (label: string) => {
    const targetKey = taskKey;
    if (!targetKey) {
      return;
    }

    const normalized = label.trim();
    if (normalized === '') {
      return;
    }

    setLabelsMap((prev) => {
      const currentList = prev[targetKey] ?? [];
      const exists = currentList.some((item) => item.toLowerCase() === normalized.toLowerCase());
      let nextList: string[];

      if (exists) {
        nextList = currentList.filter((item) => item.toLowerCase() !== normalized.toLowerCase());
      } else {
        nextList = [...currentList, label];
      }

      if (nextList.length === 0) {
        const { [targetKey]: _removed, ...rest } = prev;
        return rest;
      }

      return {
        ...prev,
        [targetKey]: nextList,
      };
    });
  };

  const handleAddCustomLabel = () => {
    const targetKey = taskKey;
    const value = newLabel.trim();
    if (!targetKey || value === '') {
      return;
    }

    setLabelsMap((prev) => {
      const currentList = prev[targetKey] ?? [];
      const exists = currentList.some((item) => item.toLowerCase() === value.toLowerCase());
      if (exists) {
        return prev;
      }
      return {
        ...prev,
        [targetKey]: [...currentList, value],
      };
    });

    setNewLabel('');
  };

  const handleAssignToCurrentUser = () => {
    const targetKey = taskKey;
    if (!selectedTask || !selectedTaskColumn || !targetKey) {
      return;
    }

    setBoardTasks((prev) => {
      const columnTasks = [...(prev[selectedTaskColumn] ?? [])];
      const taskIndex = columnTasks.findIndex((task) => task.id === selectedTask.id);
      if (taskIndex === -1) {
        return prev;
      }

      const updatedTask = {
        ...columnTasks[taskIndex],
        owner: currentUser.name,
        avatar: currentUser.initials,
      };
      columnTasks[taskIndex] = updatedTask;

      return {
        ...prev,
        [selectedTaskColumn]: columnTasks,
      };
    });

    setSelectedTask((prev) => (prev ? { ...prev, owner: currentUser.name, avatar: currentUser.initials } : prev));
    setTaskDraft((prev) => (prev ? { ...prev, owner: currentUser.name, avatar: currentUser.initials } : prev));
  };

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900">
      <Sidebar
        projects={projects}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
        onLogoutRequest={() => setShowLogoutConfirm(true)}
        onSelect={onSelect}
        selectedId={selectedId}
      />

      <div className="flex min-h-screen flex-1 flex-col">
        <Header
          title="Board"
          onBack={onBack}
          onProfileClick={onProfileClick}
          notifications={headerNotifications}
        />

        <main className="flex flex-1 flex-col overflow-hidden p-8">
          <section className="flex h-full flex-col gap-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-900/10">
            <div className="border-b border-slate-200 px-6 py-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="mt-2 text-3xl font-semibold text-slate-900">{project ? project.name : 'Tablero principal'}</h2>
                </div>
                <div className="flex items-center gap-3">
                  {filterDropdown}
                  <button
                    type="button"
                    onClick={handleAddTask}
                    className="inline-flex items-center gap-2 rounded-full bg-blue-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-500/30"
                  >
                    <span className="text-base">+</span>
                    <span>Agregar tarea</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-hidden">
              <div className="h-full overflow-x-auto">
                <div className="grid h-full min-w-[960px] grid-cols-1 gap-5 px-6 py-6 md:grid-cols-2 xl:grid-cols-4">
                  {BOARD_COLUMNS.map((column) => {
                    const columnAllTasks = boardTasks[column.id] ?? [];
                    const filteredTasks = columnAllTasks.filter((task) => {
                      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
                      const matchesAssignee =
                        assigneeFilter === 'all' ||
                        (assigneeFilter === 'Sin asignar' && task.owner === 'Sin asignar') ||
                        task.owner === assigneeFilter;
                      return matchesPriority && matchesAssignee;
                    });
                    const isFiltering = priorityFilter !== 'all' || assigneeFilter !== 'all';
                    return (
                      <div
                        key={column.id}
                        className={`flex h-full max-h-full flex-col rounded-3xl border ${column.accent} p-4 shadow-sm shadow-slate-900/5 transition hover:-translate-y-1 hover:shadow-md`}
                        onDragOver={(event) => {
                          event.preventDefault();
                        }}
                        onDrop={() => handleDrop(column.id)}
                      >
                        <header
                          className={`flex items-center justify-between rounded-2xl px-4 py-3 text-xs font-semibold uppercase tracking-wide ${column.headerAccent}`}
                        >
                          <div className="flex flex-col">
                            <span>{column.title}</span>
                            <span className={`mt-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${column.headerTag}`}>
                              {filteredTasks.length}
                              {isFiltering && ` · de ${columnAllTasks.length}`}
                              {filteredTasks.length === 1 ? ' tarea' : ' tareas'}
                            </span>
                          </div>
                        </header>

                        <div className="mt-4 flex flex-1 flex-col gap-3 overflow-y-auto pr-1">
                          {filteredTasks.map((task) => (
                            <article
                              key={task.id}
                              className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm shadow-sm shadow-slate-900/5"
                              draggable
                              onDragStart={() => handleDragStart(column.id, task.id)}
                              onDragEnd={handleDragEnd}
                              onClick={() => handleOpenTask(column.id, task.id)}
                            >
                              <div className="flex items-center justify-between text-[11px] uppercase tracking-wide text-slate-400">
                                <span>{task.id}</span>
                                <span>{task.due}</span>
                              </div>
                              <div>
                                <h4 className="text-base font-semibold text-slate-900">{task.title}</h4>
                                <p className="mt-1 text-xs text-slate-500">{task.description}</p>
                              </div>
                              <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                                <span className="inline-flex items-center gap-2">
                                  <span className="grid h-8 w-8 place-items-center rounded-full bg-slate-900/5 text-xs font-semibold text-slate-700">
                                    {task.avatar}
                                  </span>
                                  <span className="font-medium text-slate-700">{task.owner}</span>
                                </span>
                                <span
                                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${PRIORITY_BADGE_STYLES[task.priority]}`}
                                >
                                  {task.priority}
                                </span>
                              </div>
                            </article>
                          ))}

                          {filteredTasks.length === 0 && (
                            <div className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/80 px-4 py-6 text-center text-xs text-slate-400">
                              {isFiltering ? 'Sin tarjetas con este filtro.' : 'Sin tarjetas en esta columna.'}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
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

      {selectedTask && selectedTaskColumn && taskDraft && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 px-4 md:px-8">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl shadow-slate-900/20">
            <header className="flex items-start justify-between">
              <div className="w-full pr-4">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Resumen de tarea</p>
                {isEditingTask ? (
                  <input
                    type="text"
                    value={taskDraft.title}
                    onChange={(event) => handleTaskDraftChange('title', event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-2xl font-semibold text-slate-900 transition focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                  />
                ) : (
                  <h3 className="mt-2 text-2xl font-semibold text-slate-900">{selectedTask.title}</h3>
                )}
              </div>
              <div className="flex items-center gap-2">
                {isEditingTask ? (
                  <button
                    type="button"
                    onClick={() => {
                      handleResetTaskDraft();
                      setIsEditingTask(false);
                    }}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500 transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    Cancelar
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setTaskDraft({ ...selectedTask });
                      setIsEditingTask(true);
                    }}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500 transition hover:border-blue-200 hover:text-blue-600"
                  >
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-100">
                      <img src="/img/edit-icon.svg" alt="Editar" className="h-3 w-3" />
                    </span>
                    Editar
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleCloseTask}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-blue-200 hover:text-blue-600"
                  aria-label="Cerrar detalle de tarea"
                >
                  ×
                </button>
              </div>
            </header>

            {isEditingTask ? (
              <form
                className="mt-5 space-y-6"
                onSubmit={(event) => {
                  event.preventDefault();
                  handleSaveTaskChanges();
                }}
              >
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                  <label className="flex flex-col gap-2 text-sm text-slate-600">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Descripción</span>
                    <textarea
                      value={taskDraft.description}
                      onChange={(event) => handleTaskDraftChange('description', event.target.value)}
                      className="min-h-[120px] rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                    />
                  </label>
                </div>

                <div className="grid gap-4 text-sm text-slate-600 md:grid-cols-2 lg:grid-cols-3">
                  <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
                    <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Prioridad
                      <select
                        value={taskDraft.priority}
                        onChange={(event) =>
                          handleTaskDraftChange('priority', event.target.value as BoardTaskItem['priority'])
                        }
                        className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 transition focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                      >
                        {PRIORITY_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
                    <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Asignado a
                      <select
                        value={selectedMemberId}
                        onChange={(event) => handleSelectMember(event.target.value)}
                        className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 transition focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                      >
                        <option value="custom" disabled>
                          Selecciona un miembro
                        </option>
                        {BOARD_MEMBERS.map((member) => (
                          <option key={member.id} value={member.id}>
                            {member.display}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
                    <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Fecha límite
                      <input
                        type="text"
                        value={taskDraft.due}
                        onChange={(event) => handleTaskDraftChange('due', event.target.value)}
                        className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 transition focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                      />
                    </label>
                  </div>
                </div>

                {currentAttachments.length > 0 && (
                  <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-600">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Adjuntos</span>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAttachModal(true);
                          setShowCommentsModal(false);
                          setShowLabelsModal(false);
                        }}
                        className="text-xs font-semibold text-blue-500 transition hover:text-blue-600"
                      >
                        Gestionar
                      </button>
                    </div>
                    <ul className="mt-3 space-y-2 text-xs">
                      {currentAttachments.map((file, index) => (
                        <li
                          key={`${selectedTask.id}-${file.name}-${index}`}
                          className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
                        >
                          <span className="flex items-center gap-2 text-slate-600">
                            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-[11px] font-semibold text-blue-500">
                              📎
                            </span>
                            <span className="font-medium">{file.name}</span>
                          </span>
                          <span className="text-[11px] uppercase tracking-wide text-slate-400">{formatBytes(file.size)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleResetTaskDraft}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                  >
                    Restablecer
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-full bg-blue-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={!isTaskDraftDirty}
                  >
                    Guardar cambios
                  </button>
                </div>
              </form>
            ) : (
              <section className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Descripción</h4>
                  <p className="mt-2 text-sm text-slate-600">{selectedTask.description}</p>
                </div>

                <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-4">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Estado</span>
                  <span
                    className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${STATUS_BADGE_STYLES[selectedTask.status]}`}
                  >
                    {selectedTask.status}
                  </span>
                </div>

                <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-4">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Prioridad</span>
                  <span
                    className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${PRIORITY_BADGE_STYLES[selectedTask.priority]}`}
                  >
                    {selectedTask.priority}
                  </span>
                </div>

                <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-4">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Asignado a</span>
                  <span className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-slate-900/5 text-xs font-semibold text-slate-700">
                      {selectedTask.avatar}
                    </span>
                    {selectedTask.owner}
                  </span>
                  {selectedTask.owner === 'Sin asignar' && (
                    <button
                      type="button"
                      onClick={handleAssignToCurrentUser}
                      className="mt-2 inline-flex w-fit items-center gap-2 rounded-full border border-blue-200 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-600 transition hover:border-blue-300 hover:bg-blue-50"
                    >
                      Asignarme esta tarea
                    </button>
                  )}
                </div>

                <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-4">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Fecha límite</span>
                  <span className="text-sm font-semibold text-slate-800">{selectedTask.due}</span>
                </div>

                <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-4">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Fecha de creación</span>
                  <span className="text-sm font-semibold text-slate-800">{selectedTask.createdAt}</span>
                </div>

                <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-4">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Última actualización</span>
                  <span className="text-sm font-semibold text-slate-800">{selectedTask.updatedAt}</span>
                </div>

                {currentAttachments.length > 0 && (
                  <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-white px-4 py-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Adjuntos</span>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAttachModal(true);
                          setShowCommentsModal(false);
                          setShowLabelsModal(false);
                        }}
                        className="text-xs font-semibold text-blue-500 transition hover:text-blue-600"
                      >
                        Ver todos
                      </button>
                    </div>
                    <ul className="mt-3 space-y-2 text-xs text-slate-600">
                      {currentAttachments.map((file, index) => (
                        <li
                          key={`${selectedTask.id}-${file.name}-${index}`}
                          className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
                        >
                          <span className="flex items-center gap-2">
                            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-[11px] font-semibold text-blue-500">
                              📎
                            </span>
                            <span className="font-medium text-slate-700">{file.name}</span>
                          </span>
                          <span className="text-[11px] uppercase tracking-wide text-slate-400">{formatBytes(file.size)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            )}

            <div className="mt-6 grid gap-2 text-xs text-slate-500 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => {
                  setShowAttachModal(true);
                  setShowCommentsModal(false);
                  setShowLabelsModal(false);
                }}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 px-3 py-3 font-semibold uppercase tracking-wide text-slate-600 transition hover:border-blue-200 hover:text-blue-600"
              >
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100">
                  <img src="/img/add_file-icon.svg" alt="Adjuntar" className="h-3.5 w-3.5" />
                </span>
                Adjuntar archivo
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCommentsModal(true);
                  setShowLabelsModal(false);
                }}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 px-3 py-3 font-semibold uppercase tracking-wide text-slate-600 transition hover:border-blue-200 hover:text-blue-600"
              >
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100">
                  <img src="/img/comments-icon.svg" alt="Comentarios" className="h-3.5 w-3.5" />
                </span>
                Comentarios
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLabelsModal(true);
                  setShowCommentsModal(false);
                }}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 px-3 py-3 font-semibold uppercase tracking-wide text-slate-600 transition hover:border-blue-200 hover:text-blue-600"
              >
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100">
                  <img src="/img/tag-icon.svg" alt="Etiquetas" className="h-3.5 w-3.5" />
                </span>
                Etiquetas
              </button>

              {showLabelsModal && (
                <div className="absolute left-0 top-full z-10 mt-2 w-48 rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-600 shadow-lg">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Etiquetas rápidas</p>
                  <ul className="mt-2 space-y-1">
                    <li>
                      <button
                        type="button"
                        className="w-full rounded-full border border-slate-200 px-2 py-1 text-left text-xs transition hover:border-blue-200 hover:text-blue-600"
                      >
                        Alta prioridad
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        className="w-full rounded-full border border-slate-200 px-2 py-1 text-left text-xs transition hover:border-amber-200 hover:text-amber-600"
                      >
                        Bloqueado
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        className="w-full rounded-full border border-slate-200 px-2 py-1 text-left text-xs transition hover:border-emerald-200 hover:text-emerald-600"
                      >
                        Listo para QA
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showAttachModal && selectedTask && selectedTaskColumn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 md:px-8">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl shadow-slate-900/20">
            <header className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Adjuntar archivos</p>
                <h3 className="mt-2 text-lg font-semibold text-slate-900">{selectedTask.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAttachModal(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-blue-200 hover:text-blue-600"
                aria-label="Cerrar adjuntos"
              >
                ×
              </button>
            </header>

            <section className="mt-4 space-y-5">
              <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-6 text-center text-sm text-slate-500">
                <p className="font-semibold text-slate-700">Sube archivos relevantes a esta tarea</p>
                <p className="mt-1 text-xs text-slate-400">Formatos permitidos: PDF, JPG, PNG. Tamaño máximo 25 MB por archivo.</p>

                <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-full bg-blue-500 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-600">
                  <input
                    type="file"
                    className="hidden"
                    multiple
                    onChange={(event) => {
                      if (event.target.files) {
                        handleUploadFiles(event.target.files);
                        event.target.value = '';
                      }
                    }}
                  />
                  Seleccionar archivos
                </label>
              </div>

              <div className="space-y-3">
                {(() => {
                  const key = `${selectedTask.id}-${selectedTaskColumn}`;
                  const list = attachments[key] ?? [];
                  if (list.length === 0) {
                    return (
                      <p className="text-xs text-slate-500">
                        Aún no hay archivos adjuntos. Añade recursos para compartir contexto con tu equipo.
                      </p>
                    );
                  }

                  return (
                    <ul className="space-y-2 text-xs text-slate-600">
                      {list.map((file, index) => (
                        <li
                          key={`${selectedTask.id}-${file.name}-${index}`}
                          className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
                        >
                          <div className="flex items-center gap-3">
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
                              <img src="/img/add_file-icon.svg" alt="Archivo" className="h-4 w-4" />
                            </span>
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold text-slate-800">{file.name}</span>
                              <span className="text-xs text-slate-400">{formatBytes(file.size)}</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveAttachment(selectedTask.id, selectedTaskColumn, index)}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 text-xs font-semibold text-slate-400 transition hover:border-rose-200 hover:text-rose-600"
                            aria-label="Eliminar archivo adjunto"
                          >
                            ×
                          </button>
                        </li>
                      ))}
                    </ul>
                  );
                })()}
              </div>
            </section>

            <div className="mt-6 h-4" />
          </div>
        </div>
      )}

      {showCommentsModal && selectedTask && selectedTaskColumn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 md:px-8">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl shadow-slate-900/20">
            <header className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Comentarios</p>
                <h3 className="mt-2 text-lg font-semibold text-slate-900">{selectedTask.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCommentsModal(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-blue-200 hover:text-blue-600"
                aria-label="Cerrar comentarios"
              >
                ×
              </button>
            </header>

            <section className="mt-4 space-y-4">

              <div className="space-y-3">
                {(() => {
                  const key = `${selectedTask.id}-${selectedTaskColumn}`;
                  const list = comments[key] ?? [];
                  if (list.length === 0) {
                    return (
                      <p className="text-xs text-slate-500">
                        No hay comentarios todavía. Sé el primero en compartir una actualización.
                      </p>
                    );
                  }
                  return (
                    <ul className="space-y-2 text-xs text-slate-600">
                      {list.map((message, index) => (
                        <li
                          key={`${selectedTask.id}-${index}`}
                          className="flex items-start justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm"
                        >
                          <span className="flex-1 text-left">{message}</span>
                          <button
                            type="button"
                            onClick={() => handleDeleteComment(selectedTask.id, selectedTaskColumn, index)}
                            className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 text-xs font-semibold text-slate-400 transition hover:border-rose-200 hover:text-rose-600"
                            aria-label="Eliminar comentario"
                          >
                            ×
                          </button>
                        </li>
                      ))}
                    </ul>
                  );
                })()}
              </div>

              <form
                className="flex flex-col gap-3"
                onSubmit={(event) => {
                  event.preventDefault();
                  handleAddComment();
                }}
              >
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-400" htmlFor="comment-input">
                  Añadir comentario
                </label>
                <textarea
                  id="comment-input"
                  value={commentDraft}
                  onChange={(event) => setCommentDraft(event.target.value)}
                  placeholder="Escribe una actualización o pregunta..."
                  className="min-h-[100px] resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setCommentDraft('')}
                    className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500 transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    Limpiar
                  </button>
                  <button
                    type="submit"
                    className="rounded-full bg-blue-500 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={commentDraft.trim() === ''}
                  >
                    Publicar
                  </button>
                </div>
              </form>
            </section>
          </div>
        </div>
      )}

      {showLabelsModal && selectedTask && selectedTaskColumn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 md:px-8">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl shadow-slate-900/20">
            <header className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Etiquetas</p>
                <h3 className="mt-2 text-lg font-semibold text-slate-900">{selectedTask.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowLabelsModal(false);
                  setNewLabel('');
                }}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-blue-200 hover:text-blue-600"
                aria-label="Cerrar etiquetas"
              >
                ×
              </button>
            </header>

            <section className="mt-4 space-y-4 text-sm text-slate-600">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Etiquetas rápidas</h4>
                <div className="mt-4 space-y-3">
                  {LABEL_PRESETS.map((group) => (
                    <div key={group.id} className="space-y-2">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{group.title}</p>
                      <div className="flex flex-wrap gap-2">
                        {group.labels.map((label) => {
                          const isSelected = activeLabels.some(
                            (item) => item.toLowerCase() === label.toLowerCase()
                          );
                          return (
                            <button
                              key={label}
                              type="button"
                              onClick={() => handleToggleLabel(label)}
                              aria-pressed={isSelected}
                              className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide transition ${
                                isSelected
                                  ? 'border border-blue-300 bg-blue-50 text-blue-600 shadow-sm'
                                  : 'border border-slate-200 text-slate-600 hover:border-blue-200 hover:text-blue-600'
                              }`}
                            >
                              {label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-5">
                {activeLabels.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {activeLabels.map((label) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => handleToggleLabel(label)}
                        className="group inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-600 transition hover:border-blue-300 hover:bg-blue-100"
                      >
                        <span>{label}</span>
                        <span className="text-base font-semibold text-blue-400 group-hover:text-rose-500">×</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-xs text-slate-500">
                    No hay etiquetas seleccionadas. Usa las etiquetas rápidas o añade una nueva.
                  </p>
                )}
              </div>
            </section>

            <div className="mt-6 space-y-3">
              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Añadir etiqueta</h4>
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={newLabel}
                    onChange={(event) => setNewLabel(event.target.value)}
                    placeholder="Nombre de la etiqueta"
                    className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomLabel}
                    className="inline-flex items-center gap-2 rounded-full bg-blue-500 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={trimmedNewLabel === '' || isNewLabelDuplicate}
                  >
                    Añadir
                  </button>
                </div>
                {isNewLabelDuplicate && (
                  <p className="mt-2 text-xs text-rose-500">
                    Esa etiqueta ya está asignada a esta tarea.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoardPage;
