import React, { useState } from 'react';
import { X, MessageSquare, Lightbulb, Smartphone, Sparkles, CheckCircle2 } from 'lucide-react';
import { AdminReviews } from './AdminReviews.tsx';
import { AdminCreativeConcepts } from './AdminCreativeConcepts.tsx';
import { AdminAndroidCompanion } from './AdminAndroidCompanion.tsx';
import { useStudio } from '../../context/StudioContext.tsx';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'reviews' | 'concepts' | 'android'>('reviews');
  const { reviews, ideas } = useStudio();

  if (!isOpen) return null;

  const approvedReviewsCount = reviews.filter((r) => r.isApproved).length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#07070D] flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#07070D]/95 backdrop-blur-xl px-4 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00E5FF] to-[#FF2E9A] p-0.5">
            <div className="w-full h-full rounded-[10px] bg-[#07070D] flex items-center justify-center font-display font-extrabold text-white text-sm">
              D
            </div>
          </div>
          <div>
            <h1 className="text-base font-display font-bold text-white flex items-center gap-2">
              Drishya Studio Control
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Owner Mode
              </span>
            </h1>
            <p className="text-[11px] text-[#9AA0B8]">
              {approvedReviewsCount} approved reviews live • {ideas.length} creative concepts
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="hidden sm:flex items-center gap-2 p-1 rounded-2xl bg-[#0F0F1A] border border-white/10 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('reviews')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all ${
              activeTab === 'reviews'
                ? 'bg-gradient-to-r from-amber-400 to-[#FF2E9A] text-[#07070D] font-bold shadow'
                : 'text-[#9AA0B8] hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Customer Reviews</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('concepts')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all ${
              activeTab === 'concepts'
                ? 'bg-gradient-to-r from-[#FF2E9A] to-[#00E5FF] text-white font-bold shadow'
                : 'text-[#9AA0B8] hover:text-white'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Creative Concepts</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('android')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all ${
              activeTab === 'android'
                ? 'bg-[#00E5FF] text-[#07070D] font-bold shadow'
                : 'text-[#9AA0B8] hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Android App</span>
          </button>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close portal"
          className="p-2 rounded-xl border border-white/10 bg-[#0F0F1A] text-[#9AA0B8] hover:text-white hover:border-white/20 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      {/* Mobile Tab Selector */}
      <div className="sm:hidden flex items-center justify-around border-b border-white/10 bg-[#0F0F1A] p-2 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('reviews')}
          className={`py-2 px-3 rounded-lg ${activeTab === 'reviews' ? 'bg-white/10 text-white' : 'text-[#9AA0B8]'}`}
        >
          Reviews
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('concepts')}
          className={`py-2 px-3 rounded-lg ${activeTab === 'concepts' ? 'bg-white/10 text-white' : 'text-[#9AA0B8]'}`}
        >
          Concepts
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('android')}
          className={`py-2 px-3 rounded-lg ${activeTab === 'android' ? 'bg-white/10 text-white' : 'text-[#9AA0B8]'}`}
        >
          Android
        </button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'reviews' && <AdminReviews />}
        {activeTab === 'concepts' && <AdminCreativeConcepts />}
        {activeTab === 'android' && <AdminAndroidCompanion />}
      </main>
    </div>
  );
};
