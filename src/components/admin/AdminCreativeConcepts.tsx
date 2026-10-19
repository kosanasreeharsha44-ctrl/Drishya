import React, { useState } from 'react';
import { Lightbulb, CheckCircle2, Clock, Trash2, ArrowUpRight, DollarSign, Filter, ExternalLink } from 'lucide-react';
import { useStudio } from '../../context/StudioContext.tsx';
import type { IdeaStatus, IdeaSubmission } from '../../types/index.ts';

export const AdminCreativeConcepts: React.FC = () => {
  const { ideas, updateIdeaStatus, updateIdeaFinancials, deleteIdea } = useStudio();
  const [filter, setFilter] = useState<'All' | IdeaStatus>('All');
  const [selectedConcept, setSelectedConcept] = useState<IdeaSubmission | null>(null);

  const filtered = ideas.filter((c) => {
    if (filter === 'All') return true;
    return c.status === filter;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2.5">
            <Lightbulb className="w-6 h-6 text-[#FF2E9A]" />
            Creative Concepts Inbox
          </h2>
          <p className="text-xs text-[#9AA0B8] mt-1">
            Incoming creative concepts submitted via the revenue-share program. Evaluate feasibility, execute co-creation contracts, and disburse shares.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#0F0F1A] border border-white/10 overflow-x-auto text-xs">
          {(['All', 'New', 'Reviewing', 'Accepted', 'Earning', 'Paid', 'Rejected'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                filter === st
                  ? 'bg-gradient-to-r from-[#FF2E9A] to-[#00E5FF] text-white font-bold shadow'
                  : 'text-[#9AA0B8] hover:text-white'
              }`}
            >
              {st} {st === 'All' ? `(${ideas.length})` : `(${ideas.filter((i) => i.status === st).length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Concepts List */}
      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-[#0F0F1A] p-12 text-center max-w-xl mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-white/5 text-[#9AA0B8] flex items-center justify-center mx-auto">
            <Lightbulb className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No Creative Concepts Found</h3>
          <p className="text-xs text-[#9AA0B8] leading-relaxed">
            {filter === 'All'
              ? 'Zero concepts submitted yet. Submitted concepts from the website appear here instantly with full contact details and reference files.'
              : `No concepts matching status "${filter}".`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((concept) => (
            <div
              key={concept.id}
              className="rounded-3xl border border-white/10 bg-[#0F0F1A] p-6 space-y-4 hover:border-[#FF2E9A]/40 transition-all shadow-lg flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#FF2E9A]/10 text-[#FF2E9A] border border-[#FF2E9A]/30">
                    {concept.status}
                  </span>
                  <span className="text-[10px] text-[#9AA0B8] font-mono">
                    {new Date(concept.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-base font-display font-bold text-white leading-snug">
                  {concept.title}
                </h3>

                <p className="text-xs text-[#9AA0B8] leading-relaxed line-clamp-3">
                  {concept.description}
                </p>

                {/* Submitter Details */}
                <div className="p-3 rounded-xl bg-[#07070D] border border-white/5 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-white/60">Pitcher:</span>
                    <span className="text-white font-medium">{concept.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Contact:</span>
                    <span className="text-[#00E5FF] font-mono">{concept.contact}</span>
                  </div>
                  {concept.fileUrl && (
                    <div className="pt-1 mt-1 border-t border-white/5 flex justify-between items-center text-[11px]">
                      <span className="text-white/60">Reference:</span>
                      <a
                        href={concept.fileUrl.startsWith('http') ? concept.fileUrl : '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#FF2E9A] hover:underline flex items-center gap-1 font-mono truncate max-w-[140px]"
                      >
                        <span>Open Ref</span>
                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Update Actions */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                <select
                  value={concept.status}
                  onChange={(e) => updateIdeaStatus(concept.id, e.target.value as IdeaStatus)}
                  aria-label="Update concept status"
                  className="rounded-xl border border-white/10 bg-[#07070D] px-2.5 py-1.5 text-xs text-white focus:border-[#FF2E9A] focus:outline-none"
                >
                  <option value="New">New</option>
                  <option value="Reviewing">Reviewing</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Earning">Earning</option>
                  <option value="Paid">Paid</option>
                  <option value="Rejected">Rejected</option>
                </select>

                <button
                  type="button"
                  onClick={() => deleteIdea(concept.id)}
                  aria-label="Delete concept"
                  className="p-1.5 rounded-xl border border-white/10 bg-[#07070D] text-[#9AA0B8] hover:text-red-400 hover:border-red-400/30 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
