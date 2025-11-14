import React from 'react';
import { CommitEntry } from './types';

type CommitsSectionProps = {
  commits: CommitEntry[];
};

const CommitsSection: React.FC<CommitsSectionProps> = ({ commits }) => (
  <section className="space-y-4 rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-lg shadow-slate-900/5">
    <header className="flex flex-col gap-1">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Commits recientes</h3>
      <p className="text-xs text-slate-500">Seguimiento de las últimas contribuciones y su estado actual.</p>
    </header>

    <ul className="space-y-3 text-sm text-slate-600">
      {commits.map((commit) => (
        <li key={commit.id} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold text-slate-700">{commit.author}</span>
            <span>{commit.timestamp}</span>
          </div>
          <span className="text-sm font-semibold text-slate-900">{commit.message}</span>
          <span className="text-xs text-slate-500">Hash {commit.sha}</span>
        </li>
      ))}
    </ul>
  </section>
);

export default CommitsSection;

