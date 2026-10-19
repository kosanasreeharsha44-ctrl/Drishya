import React, { useState } from 'react';
import { Play, Sparkles, X, Maximize2 } from 'lucide-react';
import { useStudio } from '../../context/StudioContext.tsx';
import type { PortfolioCategory, PortfolioItem } from '../../types/index.ts';
import { BeforeAfterSlider } from './BeforeAfterSlider.tsx';

export const PortfolioSection: React.FC = () => {
  const { portfolio } = useStudio();
  const visibleItems = portfolio.filter((item) => item.isVisible);

  const [activeCategory, setActiveCategory] = useState<PortfolioCategory>('all');
  const [activeVideoModal, setActiveVideoModal] = useState<PortfolioItem | null>(null);
  const [activeImageLightbox, setActiveImageLightbox] = useState<PortfolioItem | null>(null);

  // REAL DATA ONLY: If no real portfolio items exist, hide the section entirely on the public site
  if (visibleItems.length === 0) {
    return null;
  }

  const categories: { label: string; key: PortfolioCategory }[] = [
    { label: 'All Projects', key: 'all' },
    { label: 'Video Edits', key: 'videos' },
    { label: 'Posters & Key Art', key: 'posters' },
    { label: 'Photo & Color Grades', key: 'photo_edits' },
  ];

  const filteredItems = visibleItems.filter(
    (item) => activeCategory === 'all' || item.category === activeCategory
  );

  return (
    <section id="portfolio" className="py-20 lg:py-28 relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-[#0F0F1A] text-xs font-semibold text-[#00E5FF] mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Selected Portfolio</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
              Featured Work & Color Grades
            </h2>
            <p className="mt-2 text-sm text-[#9AA0B8] max-w-xl">
              Commercial projects, color grading breakdowns, and theatrical key art.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 p-1 rounded-2xl border border-white/10 bg-[#0F0F1A]">
            {categories.map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActiveCategory(cat.key)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeCategory === cat.key
                    ? 'bg-gradient-to-r from-[#00E5FF] to-[#7B5CFF] text-[#07070D] shadow-lg shadow-[#00E5FF]/20'
                    : 'text-[#9AA0B8] hover:text-white hover:bg-white/5'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group flex flex-col justify-between rounded-3xl border border-white/10 bg-[#0F0F1A] p-4 transition-all duration-300 hover:border-[#00E5FF]/40 hover:shadow-[0_10px_30px_rgba(0,229,255,0.1)]"
            >
              <div className="relative rounded-2xl overflow-hidden mb-4 bg-black/60 aspect-[16/10]">
                {item.type === 'before_after' && item.beforeUrl && item.afterUrl ? (
                  <BeforeAfterSlider
                    beforeUrl={item.beforeUrl}
                    afterUrl={item.afterUrl}
                    className="w-full h-full"
                  />
                ) : (
                  <>
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-60 group-hover:opacity-40 transition-opacity" />

                    <div className="absolute inset-0 flex items-center justify-center opacity-90 group-hover:opacity-100 transition-opacity">
                      {item.type === 'video' ? (
                        <button
                          type="button"
                          onClick={() => setActiveVideoModal(item)}
                          aria-label={`Watch video: ${item.title}`}
                          className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#00E5FF] to-[#FF2E9A] p-0.5 shadow-xl hover:scale-110 active:scale-95 transition-transform"
                        >
                          <div className="w-full h-full rounded-full bg-[#07070D] flex items-center justify-center">
                            <Play className="w-5 h-5 text-[#00E5FF] fill-[#00E5FF] ml-0.5" />
                          </div>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setActiveImageLightbox(item)}
                          aria-label={`View full poster: ${item.title}`}
                          className="w-10 h-10 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white hover:text-[#00E5FF] hover:border-[#00E5FF] transition-all"
                        >
                          <Maximize2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </>
                )}

                <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-[#07070D]/80 backdrop-blur-md border border-white/10 text-[10px] font-semibold text-white uppercase tracking-wider">
                  {item.type === 'before_after'
                    ? 'Color Grade'
                    : item.type === 'video'
                    ? 'Video Cut'
                    : 'Poster Art'}
                </div>
              </div>

              <div className="px-1">
                <h3 className="text-base font-display font-bold text-white mb-1 group-hover:text-[#00E5FF] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-[#9AA0B8] line-clamp-2 leading-relaxed">
                  {item.tagline}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Modal Player */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-lg p-4 sm:p-6">
          <div className="relative w-full max-w-4xl rounded-2xl overflow-hidden border border-white/15 bg-[#0F0F1A] shadow-2xl">
            <div className="flex items-center justify-between p-4 bg-[#07070D] border-b border-white/10">
              <div>
                <h4 className="text-sm font-bold text-white">{activeVideoModal.title}</h4>
                <p className="text-xs text-[#9AA0B8]">{activeVideoModal.tagline}</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveVideoModal(null)}
                aria-label="Close video player"
                className="p-1 rounded-lg text-[#9AA0B8] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative aspect-video bg-black">
              <iframe
                src={activeVideoModal.mediaUrl}
                title={activeVideoModal.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* Image Lightbox Modal */}
      {activeImageLightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-lg p-4 sm:p-6">
          <div className="relative max-w-3xl max-h-[90vh] flex flex-col rounded-2xl overflow-hidden border border-white/15 bg-[#0F0F1A] shadow-2xl">
            <div className="flex items-center justify-between p-4 bg-[#07070D] border-b border-white/10">
              <h4 className="text-sm font-bold text-white">{activeImageLightbox.title}</h4>
              <button
                type="button"
                onClick={() => setActiveImageLightbox(null)}
                aria-label="Close photo preview"
                className="p-1 rounded-lg text-[#9AA0B8] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-2 flex items-center justify-center overflow-auto bg-[#07070D]">
              <img
                src={activeImageLightbox.mediaUrl || activeImageLightbox.thumbnailUrl}
                alt={activeImageLightbox.title}
                className="max-h-[75vh] w-auto object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
