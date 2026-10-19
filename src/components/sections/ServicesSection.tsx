import React from 'react';
import { Video, Lightbulb, Image as ImageIcon, ArrowRight, Sparkles, CheckCircle } from 'lucide-react';

interface ServicesSectionProps {
  onSelectService: (serviceKey: 'video_editing' | 'idea_submission' | 'poster_photo_editing') => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService }) => {
  const services = [
    {
      id: 'video_editing' as const,
      icon: Video,
      title: 'Cinematic Video Editing',
      subtitle: 'Precision narrative cuts, rhythm, and acoustic atmosphere.',
      highlights: [
        'Color grading: Rec.709 & Log-to-HDR calibration',
        'Sound design & frequency-calibrated audio mixing',
        'Fast turnaround with milestone rough cuts',
        'Final 4K ProRes & web delivery',
      ],
      gradient: 'from-[#00E5FF] to-[#7B5CFF]',
      borderGlow: 'hover:border-[#00E5FF]/50 hover:shadow-[0_0_30px_rgba(0,229,255,0.2)]',
    },
    {
      id: 'idea_submission' as const,
      icon: Lightbulb,
      title: 'Submit Creative Concept',
      subtitle: 'Co-creation revenue-share partnerships: pitch concepts, produce together, share returns.',
      highlights: [
        'Pitch review within 24–48 hours turnaround',
        'Agreed co-creation terms & legal credit attribution',
        'Commercial monetization & client spec production',
        'Transparent ledger accounting & direct payouts',
      ],
      gradient: 'from-[#FF2E9A] to-[#7B5CFF]',
      borderGlow: 'hover:border-[#FF2E9A]/50 hover:shadow-[0_0_30px_rgba(255,46,154,0.2)]',
    },
    {
      id: 'poster_photo_editing' as const,
      icon: ImageIcon,
      title: 'Poster & Photo Editing',
      subtitle: 'Theatrical key art, high-impact visuals, and digital retouching.',
      highlights: [
        'Frequency separation & detailed portrait retouching',
        'Theatrical film poster & cover typography',
        'Rapid 24-hour turnaround on priority assets',
        'Print-ready CMYK & uncompressed digital delivery',
      ],
      gradient: 'from-[#7B5CFF] to-[#00E5FF]',
      borderGlow: 'hover:border-[#7B5CFF]/50 hover:shadow-[0_0_30px_rgba(123,92,255,0.2)]',
    },
  ];

  return (
    <section id="services" className="py-20 lg:py-28 relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-[#0F0F1A] text-xs font-semibold text-[#00E5FF] mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Creative Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            Crafted for impact.{' '}
            <span className="bg-gradient-to-r from-[#00E5FF] to-[#FF2E9A] bg-clip-text text-transparent">
              Engineered to captivate.
            </span>
          </h2>
          <p className="mt-4 text-xs sm:text-base text-[#9AA0B8] leading-relaxed">
            High-grade post-production, precision color timing, and collaborative partnerships tailored to your story.
          </p>
        </div>

        {/* Services Grid (Zero prices, single uniform button) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((svc) => {
            const Icon = svc.icon;
            return (
              <div
                key={svc.id}
                className={`flex flex-col justify-between rounded-3xl border border-white/10 bg-[#0F0F1A] p-7 transition-all duration-300 ${svc.borderGlow}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${svc.gradient} p-0.5 flex items-center justify-center`}
                    >
                      <div className="w-full h-full rounded-[14px] bg-[#07070D] flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-display font-bold text-white mb-2">{svc.title}</h3>
                  <p className="text-xs text-[#9AA0B8] mb-6 leading-relaxed">{svc.subtitle}</p>

                  {/* 3 to 4 Technical Highlights */}
                  <div className="space-y-3 mb-8">
                    {svc.highlights.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5">
                        <CheckCircle className="w-4 h-4 text-[#00E5FF] flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-[#9AA0B8] leading-normal">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Every service uses one button: "Contact for details" */}
                <button
                  type="button"
                  onClick={() => onSelectService(svc.id)}
                  aria-label={`Contact for details on ${svc.title}`}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl border border-white/10 bg-[#07070D] hover:bg-white/5 hover:border-[#00E5FF]/40 text-xs font-bold text-white uppercase tracking-wider transition-all active:scale-95 group"
                >
                  <span>Contact for details</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#00E5FF] group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
