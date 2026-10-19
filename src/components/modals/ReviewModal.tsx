import React, { useState } from 'react';
import { Star, X, CheckCircle2, Sparkles, MessageSquare } from 'lucide-react';
import { useStudio } from '../../context/StudioContext.tsx';

export const ReviewModal: React.FC = () => {
  const { activeReviewProjectId, setActiveReviewProjectId, submitReview, projects } = useStudio();
  const [clientName, setClientName] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!activeReviewProjectId) return null;

  const project = projects.find((p) => p.id === activeReviewProjectId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!clientName.trim()) {
      setError('Please provide your name.');
      return;
    }
    if (!comment.trim() || comment.trim().length < 5) {
      setError('Please share a brief comment about the deliverable (at least 5 characters).');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    submitReview(
      activeReviewProjectId,
      clientName.trim(),
      rating,
      comment.trim(),
      project?.service || 'video_editing'
    );
    setSubmitted(true);
    setIsSubmitting(false);
  };

  const handleClose = () => {
    setActiveReviewProjectId(null);
    setSubmitted(false);
    setIsSubmitting(false);
    // Clean up query param from URL without page reload
    const url = new URL(window.location.href);
    url.searchParams.delete('review');
    window.history.replaceState({}, '', url.toString());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-[#0F0F1A] p-6 sm:p-8 shadow-2xl">
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close review dialog"
          className="absolute top-5 right-5 p-2 rounded-xl text-[#9AA0B8] hover:text-white hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-display font-bold text-white">Review Submitted!</h3>
            <p className="text-xs text-[#9AA0B8] leading-relaxed max-w-sm mx-auto">
              Thank you, <strong className="text-white">{clientName}</strong>! Your review has been sent directly to Harsha. Once approved, it will be reflected on the studio portfolio.
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="mt-4 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#FF2E9A] text-xs font-bold text-[#07070D] uppercase tracking-wider hover:opacity-90 transition-opacity"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-[#07070D] text-xs font-semibold text-[#00E5FF] w-fit mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Client Review Link</span>
            </div>
            <h3 className="text-xl font-display font-bold text-white mb-1">
              Rate Your Experience with Drishya
            </h3>
            <p className="text-xs text-[#9AA0B8] mb-6">
              {project ? `Project: ${project.title}` : 'Private feedback on your recent completed creative project.'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 rounded-xl border border-red-500/30 bg-red-500/10 text-xs text-red-300">
                  {error}
                </div>
              )}

              {/* Star Rating */}
              <div>
                <label className="block text-xs font-medium text-[#F2F4FF] mb-2">
                  Rating <span className="text-[#00E5FF]">*</span>
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      onClick={() => setRating(star)}
                      aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                      className="p-1 focus:outline-none focus:ring-2 focus:ring-[#00E5FF] rounded-lg transition-transform hover:scale-110 active:scale-95"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= (hoverRating ?? rating)
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-white/20'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-mono text-[#00E5FF] ml-2">
                    {hoverRating ?? rating} / 5
                  </span>
                </div>
              </div>

              {/* Name */}
              <div>
                <label htmlFor="rev-client-name" className="block text-xs font-medium text-[#F2F4FF] mb-1">
                  Your Name / Channel / Company <span className="text-[#00E5FF]">*</span>
                </label>
                <input
                  id="rev-client-name"
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Arjun Patel or Pixel Studios"
                  className="w-full rounded-xl border border-white/10 bg-[#07070D] px-4 py-2.5 text-xs text-white placeholder-white/20 focus:border-[#00E5FF] focus:outline-none"
                />
              </div>

              {/* Comment */}
              <div>
                <label htmlFor="rev-comment" className="block text-xs font-medium text-[#F2F4FF] mb-1">
                  Feedback & Testimonial <span className="text-[#00E5FF]">*</span>
                </label>
                <textarea
                  id="rev-comment"
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Describe the speed, turnaround, color grading quality, or creative experience..."
                  className="w-full rounded-xl border border-white/10 bg-[#07070D] px-4 py-2.5 text-xs text-white placeholder-white/20 focus:border-[#00E5FF] focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#FF2E9A] text-xs font-bold text-[#07070D] uppercase tracking-wider hover:opacity-95 active:scale-95 transition-all shadow-lg shadow-[#00E5FF]/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Submit Client Review</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
