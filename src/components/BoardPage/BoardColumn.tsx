import React from 'react';
import { BOARD_COLUMNS, PRIORITY_BADGE_STYLES } from './boardData';
import { BoardTaskItem } from './types';

type ColumnConfig = (typeof BOARD_COLUMNS)[number];

type BoardColumnProps = {
  column: ColumnConfig;
  tasks: BoardTaskItem[];
  totalCount: number;
  isFiltering: boolean;
  onDrop: (columnId: string) => void;
  onDragStart: (columnId: string, taskId: string) => void;
  onDragEnd: () => void;
  onOpenTask: (columnId: string, taskId: string) => void;
};

const BoardColumn: React.FC<BoardColumnProps> = ({
  column,
  tasks,
  totalCount,
  isFiltering,
  onDrop,
  onDragStart,
  onDragEnd,
  onOpenTask,
}) => {
  return (
    <div
      className={`flex h-full max-h-full flex-col rounded-3xl border ${column.accent} p-4 shadow-sm shadow-slate-900/5 transition hover:-translate-y-1 hover:shadow-md`}
      onDragOver={(event) => {
        event.preventDefault();
      }}
      onDrop={() => onDrop(column.id)}
    >
      <header
        className={`flex items-center justify-between rounded-2xl px-4 py-3 text-xs font-semibold uppercase tracking-wide ${column.headerAccent}`}
      >
        <div className="flex flex-col">
          <span>{column.title}</span>
          <span
            className={`mt-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${column.headerTag}`}
          >
            {tasks.length}
            {isFiltering && ` · de ${totalCount}`}
            {tasks.length === 1 ? ' tarea' : ' tareas'}
          </span>
        </div>
      </header>

      <div className="mt-4 flex flex-1 flex-col gap-3 overflow-y-auto pr-1">
        {tasks.map((task) => (
          <article
            key={task.id}
            className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm shadow-sm shadow-slate-900/5"
            draggable
            onDragStart={() => onDragStart(column.id, task.id)}
            onDragEnd={onDragEnd}
            onClick={() => onOpenTask(column.id, task.id)}
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

        {tasks.length === 0 && (
          <div className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/80 px-4 py-6 text-center text-xs text-slate-400">
            {isFiltering ? 'Sin tarjetas con este filtro.' : 'Sin tarjetas en esta columna.'}
          </div>
        )}
      </div>
    </div>
  );
};

export default BoardColumn;

