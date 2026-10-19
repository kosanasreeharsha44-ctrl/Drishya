import React, { useState } from 'react';
import { Star, CheckCircle2, Eye, EyeOff, Trash2, Copy, Check, MessageSquare, ExternalLink } from 'lucide-react';
import { useStudio } from '../../context/StudioContext.tsx';

export const AdminReviews: React.FC = () => {
  const { reviews, approveReview, deleteReview, projects } = useStudio();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyReviewLink = (projectId: string) => {
    const url = `${window.location.origin}/?review=${projectId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(projectId);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const approvedCount = reviews.filter((r) => r.isApproved).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2.5">
            <MessageSquare className="w-6 h-6 text-amber-400" />
            Customer Reviews Moderation
          </h2>
          <p className="text-xs text-[#9AA0B8] mt-1">
            Real client feedback submitted via private project links. Only approved reviews appear publicly on Drishya within seconds.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl border border-white/10 bg-[#0F0F1A] text-xs font-mono text-white">
            <span className="text-emerald-400 font-bold">{approvedCount}</span> / {reviews.length} Approved Live
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-[#0F0F1A] p-12 text-center max-w-xl mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-white/5 text-[#9AA0B8] flex items-center justify-center mx-auto">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No Reviews Submitted Yet</h3>
          <p className="text-xs text-[#9AA0B8] leading-relaxed">
            Strict real data mode is active: 0 fake reviews. When you complete a project, copy the private review link below and send it to your client.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className={`rounded-2xl border p-5 space-y-4 transition-all ${
                rev.isApproved
                  ? 'border-emerald-500/40 bg-[#0F0F1A] shadow-[0_0_20px_rgba(16,185,129,0.08)]'
                  : 'border-white/10 bg-[#0F0F1A]/70'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-sm font-bold text-white">{rev.clientName}</span>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white/5 text-[#9AA0B8]">
                      {rev.service ? rev.service.replace('_', ' ') : 'Video Edit'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= rev.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-white/20'
                        }`}
                      />
                    ))}
                    <span className="text-[11px] font-mono text-amber-400 ml-1.5">{rev.rating}★</span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    rev.isApproved
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'bg-white/5 text-[#9AA0B8] border border-white/10'
                  }`}
                >
                  {rev.isApproved ? 'Live on Home' : 'Hidden / Pending'}
                </span>
              </div>

              <p className="text-xs text-white/80 leading-relaxed italic bg-[#07070D] p-3 rounded-xl border border-white/5">
                "{rev.comment}"
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                <span className="text-[11px] text-[#9AA0B8] font-mono">
                  {new Date(rev.createdAt).toLocaleDateString()}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => approveReview(rev.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      rev.isApproved
                        ? 'border border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20'
                        : 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
                    }`}
                  >
                    {rev.isApproved ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Hide Review</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Approve Review</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteReview(rev.id)}
                    aria-label="Delete review"
                    className="p-1.5 rounded-xl border border-white/10 bg-[#07070D] text-[#9AA0B8] hover:text-red-400 hover:border-red-400/30 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Private Review Links for Projects */}
      <div className="rounded-3xl border border-white/10 bg-[#0F0F1A] p-6 space-y-4">
        <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
          <ExternalLink className="w-4 h-4 text-[#00E5FF]" />
          Private Client Review Links
        </h3>
        <p className="text-xs text-[#9AA0B8]">
          Send this one-click private link to clients upon project completion. Reviews are submitted directly to your queue.
        </p>

        {projects.length === 0 ? (
          <p className="text-xs text-[#9AA0B8] italic">No projects created yet. Create a project in the Projects tab to generate review links.</p>
        ) : (
          <div className="space-y-2">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="flex items-center justify-between p-3 rounded-xl bg-[#07070D] border border-white/5 text-xs"
              >
                <div>
                  <span className="font-semibold text-white">{proj.title}</span>
                  <span className="text-[#9AA0B8] ml-2 font-mono">({proj.clientName})</span>
                </div>
                <button
                  type="button"
                  onClick={() => copyReviewLink(proj.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium transition-colors"
                >
                  {copiedId === proj.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Review Link</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
