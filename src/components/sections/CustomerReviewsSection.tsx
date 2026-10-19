import React, { useState, useEffect, useRef } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote, Sparkles, CheckCircle2 } from 'lucide-react';
import { useStudio } from '../../context/StudioContext.tsx';

export const CustomerReviewsSection: React.FC = () => {
  const { reviews } = useStudio();
  const [mobileIndex, setMobileIndex] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  // ONLY real approved client reviews
  const approvedReviews = reviews.filter((r) => r.isApproved);

  // If no approved reviews exist, completely hide the section from the public site
  if (approvedReviews.length === 0) {
    return null;
  }

  // Calculate real average rating and review count from approved reviews
  const reviewCount = approvedReviews.length;
  const rawAverage =
    approvedReviews.reduce((sum, r) => sum + (r.rating || 5), 0) / reviewCount;
  const averageRating = rawAverage.toFixed(1);

  const nextMobileReview = () => {
    setMobileIndex((prev) => (prev + 1) % reviewCount);
  };

  const prevMobileReview = () => {
    setMobileIndex((prev) => (prev - 1 + reviewCount) % reviewCount);
  };

  const formatServiceType = (svc?: string) => {
    if (!svc) return 'Creative Project';
    if (svc === 'video_editing') return 'Cinematic Video Editing';
    if (svc === 'poster_photo_editing') return 'Poster & Photo Editing';
    if (svc === 'idea_submission' || svc === 'creative_concept') return 'Creative Concept';
    return svc.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <section id="reviews" className="py-20 lg:py-28 relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Average Rating & Count */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-xs font-semibold text-amber-300 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Verified Client Feedback</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight mb-4">
            Customer{' '}
            <span className="bg-gradient-to-r from-amber-400 via-[#FF2E9A] to-[#00E5FF] bg-clip-text text-transparent">
              Reviews
            </span>
          </h2>

          {/* Average Rating Badge */}
          <div className="inline-flex flex-wrap items-center justify-center gap-3 px-5 py-2.5 rounded-2xl border border-white/10 bg-[#0F0F1A] text-sm text-white shadow-lg">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= Math.round(rawAverage)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-white/20'
                  }`}
                />
              ))}
            </div>
            <span className="font-display font-bold text-base text-amber-400">
              {averageRating} / 5.0
            </span>
            <span className="text-[#9AA0B8] text-xs">
              • Based on {reviewCount} approved {reviewCount === 1 ? 'client review' : 'client reviews'}
            </span>
          </div>
        </div>

        {/* Mobile View: Smooth Slider */}
        <div className="block md:hidden">
          <div
            ref={sliderRef}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0F0F1A] p-6 shadow-xl"
            role="region"
            aria-label="Customer reviews slider"
          >
            {/* Ambient Glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#00E5FF]/10 rounded-full blur-3xl pointer-events-none" />

            {approvedReviews[mobileIndex] && (
              <div
                key={approvedReviews[mobileIndex].id}
                className={`space-y-4 ${
                  prefersReducedMotion ? '' : 'transition-opacity duration-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= approvedReviews[mobileIndex].rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-white/20'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30">
                    {formatServiceType(approvedReviews[mobileIndex].service)}
                  </span>
                </div>

                <div className="relative">
                  <Quote className="w-6 h-6 text-white/10 absolute -top-1 -left-1" />
                  <p className="text-sm text-white/90 leading-relaxed italic relative z-10 pl-6">
                    "{approvedReviews[mobileIndex].comment}"
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-display font-bold text-white flex items-center gap-1.5">
                      {approvedReviews[mobileIndex].clientName}
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    </h3>
                    <p className="text-[11px] text-[#9AA0B8]">Verified Client</p>
                  </div>
                  <span className="text-[10px] text-white/40">
                    {new Date(approvedReviews[mobileIndex].createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            )}

            {/* Slider Controls */}
            {reviewCount > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={prevMobileReview}
                  aria-label="Previous review"
                  className="p-2 rounded-xl border border-white/10 bg-[#07070D] text-white hover:text-[#00E5FF] hover:border-[#00E5FF]/40 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1.5">
                  {approvedReviews.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setMobileIndex(idx)}
                      aria-label={`Go to review ${idx + 1}`}
                      className={`h-1.5 rounded-full transition-all ${
                        idx === mobileIndex ? 'w-6 bg-[#00E5FF]' : 'w-1.5 bg-white/20'
                      }`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={nextMobileReview}
                  aria-label="Next review"
                  className="p-2 rounded-xl border border-white/10 bg-[#07070D] text-white hover:text-[#00E5FF] hover:border-[#00E5FF]/40 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Desktop View: Dark Neon Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {approvedReviews.map((rev) => (
            <div
              key={rev.id}
              className={`rounded-3xl border border-white/10 bg-[#0F0F1A] p-7 flex flex-col justify-between relative overflow-hidden group hover:border-[#00E5FF]/40 hover:shadow-[0_0_30px_rgba(0,229,255,0.12)] ${
                prefersReducedMotion ? '' : 'transition-all duration-300 hover:-translate-y-1'
              }`}
            >
              {/* Corner Ambient Light */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#00E5FF]/10 to-transparent rounded-full blur-2xl pointer-events-none group-hover:from-[#00E5FF]/20 transition-all" />

              <div>
                {/* Top Row: Stars + Service Type Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= rev.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-white/20'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20">
                    {formatServiceType(rev.service)}
                  </span>
                </div>

                {/* Comment Text */}
                <div className="relative mb-6">
                  <Quote className="w-5 h-5 text-white/10 absolute -top-1 -left-1" />
                  <p className="text-sm text-white/80 leading-relaxed italic relative z-10 pl-5">
                    "{rev.comment}"
                  </p>
                </div>
              </div>

              {/* Bottom Row: Client Name + Date */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-display font-bold text-white flex items-center gap-1.5">
                    {rev.clientName}
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </h3>
                  <p className="text-[11px] text-[#9AA0B8]">Verified Client</p>
                </div>
                <span className="text-[10px] text-white/40">
                  {new Date(rev.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
