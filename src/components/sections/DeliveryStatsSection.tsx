import React from 'react';
import { Film, CheckCircle2, Clock, Star, Sparkles } from 'lucide-react';
import { useStudio } from '../../context/StudioContext.tsx';

export const DeliveryStatsSection: React.FC = () => {
  const { deliveryStats } = useStudio();

  const hasDelivered = deliveryStats.projectsDelivered > 0;
  const hasOnTime = deliveryStats.onTimeDeliveryPercent !== null;
  const hasTurnaround = deliveryStats.averageTurnaroundDays !== null;
  const hasRating = deliveryStats.averageRating !== null;

  const hasAnyRealStats = hasDelivered || hasOnTime || hasTurnaround || hasRating;

  // Strict real data: hide section if no real delivery stats exist
  if (!hasAnyRealStats) {
    return null;
  }

  return (
    <section id="stats" className="py-12 lg:py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-[#0F0F1A] text-xs font-semibold text-[#00E5FF] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Studio Track Record</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-display font-bold text-white">
            Performance Metrics
          </h3>
        </div>

        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {hasDelivered && (
            <div className="glass-card p-6 rounded-3xl text-center border border-white/10 bg-[#0F0F1A]">
              <div className="text-3xl sm:text-4xl font-display font-black text-white">
                {deliveryStats.projectsDelivered}
              </div>
              <div className="text-xs font-medium text-[#9AA0B8] uppercase tracking-wider mt-1.5 flex items-center justify-center gap-1.5">
                <Film className="w-3.5 h-3.5 text-[#00E5FF]" /> Projects Delivered
              </div>
            </div>
          )}

          {hasOnTime && (
            <div className="glass-card p-6 rounded-3xl text-center border border-white/10 bg-[#0F0F1A]">
              <div className="text-3xl sm:text-4xl font-display font-black text-[#00E5FF]">
                {deliveryStats.onTimeDeliveryPercent}%
              </div>
              <div className="text-xs font-medium text-[#9AA0B8] uppercase tracking-wider mt-1.5 flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00E5FF]" /> On-Time Delivery
              </div>
            </div>
          )}

          {hasTurnaround && (
            <div className="glass-card p-6 rounded-3xl text-center border border-white/10 bg-[#0F0F1A]">
              <div className="text-3xl sm:text-4xl font-display font-black text-[#7B5CFF]">
                {deliveryStats.averageTurnaroundDays}d
              </div>
              <div className="text-xs font-medium text-[#9AA0B8] uppercase tracking-wider mt-1.5 flex items-center justify-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#7B5CFF]" /> Avg Turnaround
              </div>
            </div>
          )}

          {hasRating && (
            <div className="glass-card p-6 rounded-3xl text-center border border-white/10 bg-[#0F0F1A]">
              <div className="text-3xl sm:text-4xl font-display font-black text-[#FF2E9A] flex items-center justify-center gap-1.5">
                <span>{deliveryStats.averageRating}</span>
                <Star className="w-6 h-6 fill-[#FF2E9A] text-[#FF2E9A]" />
              </div>
              <div className="text-xs font-medium text-[#9AA0B8] uppercase tracking-wider mt-1.5">
                Client Rating ({deliveryStats.totalApprovedReviews})
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
