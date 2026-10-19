import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useStudio } from '../../context/StudioContext.tsx';

interface HeroProps {
  onContactClick?: () => void;
  onHireClick?: () => void;
  onWorkClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onContactClick, onHireClick, onWorkClick }) => {
  const { settings, portfolio } = useStudio();
  const handleContact = onContactClick || onHireClick;

  return (
    <section className="relative min-h-[75vh] flex items-center justify-center overflow-hidden py-16 lg:py-24">
      {/* Background Cinematic Canvas / Ambient Glow */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[320px] bg-gradient-to-tr from-[#00E5FF]/15 via-[#7B5CFF]/15 to-[#FF2E9A]/15 blur-[120px] rounded-full" />
        <div className="absolute -top-10 left-10 w-72 h-72 bg-[#00E5FF]/10 blur-[90px] rounded-full" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#FF2E9A]/10 blur-[100px] rounded-full" />
        <div className="absolute inset-0 film-grain opacity-40" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Studio Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-[#0F0F1A]/80 backdrop-blur-md mb-8 glow-subtle">
          <span className="flex h-2 w-2 rounded-full bg-[#00E5FF] animate-pulse" />
          <span className="text-xs font-semibold tracking-wider uppercase text-[#F2F4FF]">
            Directed by Harsha
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-extrabold tracking-tight text-white max-w-4xl leading-[1.08] mb-6">
          See your story{' '}
          <span className="bg-gradient-to-r from-[#00E5FF] via-[#7B5CFF] to-[#FF2E9A] bg-clip-text text-transparent">
            differently.
          </span>
        </h1>

        {/* Subtext */}
        <p className="text-base sm:text-lg md:text-xl text-[#9AA0B8] max-w-2xl font-normal leading-relaxed mb-10">
          {settings.heroTagline}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleContact}
            aria-label="Contact for details"
            className="w-full sm:w-auto relative group overflow-hidden rounded-2xl bg-gradient-to-r from-[#00E5FF] via-[#7B5CFF] to-[#FF2E9A] p-[2px] transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-[#00E5FF]/20"
          >
            <div className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-[14px] bg-[#07070D] group-hover:bg-opacity-80 transition-all">
              <Sparkles className="w-4 h-4 text-[#00E5FF] group-hover:text-white transition-colors" />
              <span className="text-sm font-bold text-white tracking-wide uppercase">
                Contact for details
              </span>
              <ArrowRight className="w-4 h-4 text-white/90 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {portfolio.length > 0 && (
            <button
              type="button"
              onClick={onWorkClick}
              aria-label="View Drishya work"
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl border border-white/10 bg-[#0F0F1A] text-sm font-semibold text-[#F2F4FF] hover:border-[#00E5FF]/40 hover:bg-[#14142B] transition-all active:scale-95"
            >
              <span>View Work</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
