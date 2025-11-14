import React from 'react';
import { RepoLink } from './types';
import { REPO_TYPE_LABELS } from './constants';

type RepoLinksSectionProps = {
  links: RepoLink[];
};

const RepoLinksSection: React.FC<RepoLinksSectionProps> = ({ links }) => {
  const repoCount = links.length;

  return (
    <section className="space-y-4 rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-lg shadow-slate-900/5">
      <header className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-slate-900">Repositorios vinculados</h2>
      </header>

      <ul className="space-y-3 text-sm text-slate-600">
        {links.map((link) => (
          <li key={link.id} className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 font-semibold uppercase tracking-wide">
                {REPO_TYPE_LABELS[link.type]}
              </span>
              <a
                href={link.url}
                className="text-xs font-semibold text-blue-600 transition hover:text-blue-700"
                target="_blank"
                rel="noreferrer"
              >
                Abrir ↗
              </a>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-slate-900">{link.label}</span>
              {link.description && <span className="text-xs text-slate-500">{link.description}</span>}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default RepoLinksSection;

