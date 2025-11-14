import React from 'react';
import Sidebar, { SidebarProject, DEFAULT_PROJECTS } from '../Sidebar/Sidebar';
import Header, { HeaderProps } from '../Header/Header';
import BoardFilters from './BoardFilters';
import BoardColumn from './BoardColumn';
import TaskDetailOverlay from './TaskDetailOverlay';
import AttachmentModal from './AttachmentModal';
import CommentsModal from './CommentsModal';
import LabelsModal from './LabelsModal';
import {
  BOARD_COLUMNS,
  BOARD_TASKS,
  BOARD_MEMBERS,
  PRIORITY_OPTIONS,
  PRIORITY_BADGE_STYLES,
  STATUS_BADGE_STYLES,
  LABEL_PRESETS,
} from './boardData';
import { BoardTaskItem } from './types';

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

  const handleResetFilters = () => {
    setPriorityFilter('all');
    setAssigneeFilter('all');
  };

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

  const handleStartTaskEditing = () => {
    if (!selectedTask) {
      return;
    }
    setTaskDraft({ ...selectedTask });
    setIsEditingTask(true);
  };

  const handleCancelTaskEditing = () => {
    handleResetTaskDraft();
    setIsEditingTask(false);
  };

  const openAttachmentsModal = () => {
    setShowAttachModal(true);
    setShowCommentsModal(false);
    setShowLabelsModal(false);
  };

  const openCommentsModal = () => {
    setShowCommentsModal(true);
    setShowAttachModal(false);
    setShowLabelsModal(false);
  };

  const openLabelsModal = () => {
    setShowLabelsModal(true);
    setShowAttachModal(false);
    setShowCommentsModal(false);
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
                  <BoardFilters
                    priorityFilter={priorityFilter}
                    assigneeFilter={assigneeFilter}
                    onPriorityChange={setPriorityFilter}
                    onAssigneeChange={setAssigneeFilter}
                    onReset={handleResetFilters}
                  />
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
                      <BoardColumn
                        key={column.id}
                        column={column}
                        tasks={filteredTasks}
                        totalCount={columnAllTasks.length}
                        isFiltering={isFiltering}
                        onDrop={handleDrop}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        onOpenTask={handleOpenTask}
                      />
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
        <TaskDetailOverlay
          task={selectedTask}
          taskDraft={taskDraft}
          isEditing={isEditingTask}
          isTaskDraftDirty={isTaskDraftDirty}
          selectedMemberId={selectedMemberId}
          currentAttachments={currentAttachments}
          formatBytes={formatBytes}
          onClose={handleCloseTask}
          onStartEdit={handleStartTaskEditing}
          onCancelEdit={handleCancelTaskEditing}
          onSaveTask={handleSaveTaskChanges}
          onResetDraft={handleResetTaskDraft}
          onTaskDraftChange={handleTaskDraftChange}
          onSelectMember={handleSelectMember}
          onAssignToCurrentUser={handleAssignToCurrentUser}
          onOpenAttachments={openAttachmentsModal}
          onOpenComments={openCommentsModal}
          onOpenLabels={openLabelsModal}
        />
      )}

      {showAttachModal && selectedTask && selectedTaskColumn && (
        <AttachmentModal
          task={selectedTask}
          columnId={selectedTaskColumn}
          attachments={attachments[`${selectedTask.id}-${selectedTaskColumn}`] ?? []}
          formatBytes={formatBytes}
          onClose={() => setShowAttachModal(false)}
          onUploadFiles={handleUploadFiles}
          onRemoveAttachment={handleRemoveAttachment}
        />
      )}

      {showCommentsModal && selectedTask && selectedTaskColumn && (
        <CommentsModal
          task={selectedTask}
          columnId={selectedTaskColumn}
          comments={comments[`${selectedTask.id}-${selectedTaskColumn}`] ?? []}
          commentDraft={commentDraft}
          onClose={() => setShowCommentsModal(false)}
          onChangeDraft={setCommentDraft}
          onAddComment={handleAddComment}
          onDeleteComment={handleDeleteComment}
        />
      )}

      {showLabelsModal && selectedTask && selectedTaskColumn && (
        <LabelsModal
          task={selectedTask}
          columnId={selectedTaskColumn}
          activeLabels={activeLabels}
          newLabel={newLabel}
          trimmedNewLabel={trimmedNewLabel}
          isNewLabelDuplicate={isNewLabelDuplicate}
          onClose={() => {
            setShowLabelsModal(false);
            setNewLabel('');
          }}
          onToggleLabel={handleToggleLabel}
          onChangeNewLabel={setNewLabel}
          onAddCustomLabel={handleAddCustomLabel}
        />
      )}
    </div>
  );
};

export default BoardPage;
