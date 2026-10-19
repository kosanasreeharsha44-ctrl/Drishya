import React, { useState } from 'react';
import { Instagram, Heart, ArrowUp } from 'lucide-react';
import { BrandLogo } from './BrandLogo.tsx';
import { ObfuscatedEmail } from './ObfuscatedEmail.tsx';
import { TermsModal } from '../modals/TermsModal.tsx';
import { PrivacyModal } from '../modals/PrivacyModal.tsx';
import { useStudio } from '../../context/StudioContext.tsx';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const { settings, portfolio, reviews } = useStudio();
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const approvedReviews = reviews.filter((r) => r.isApproved);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-white/10 bg-[#07070D] pt-16 pb-12 relative text-xs text-[#9AA0B8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand & Slogan */}
          <div className="space-y-4 md:col-span-2">
            <BrandLogo size="md" />
            <p className="text-sm text-white/80 font-display font-medium max-w-sm">
              "See your story differently."
            </p>
            <p className="text-xs text-[#9AA0B8] max-w-md leading-relaxed">
              Drishya is founded and directed by Harsha. Specialized in cinematic video editing, color timing, visual key art, and collaborative idea revenue-share partnerships.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href={`https://instagram.com/${settings.instagramHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Instagram handle @${settings.instagramHandle}`}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 bg-[#0F0F1A] text-[#9AA0B8] hover:text-[#FF2E9A] hover:border-[#FF2E9A]/40 transition-colors"
              >
                <Instagram className="w-4 h-4" />
                <span>@{settings.instagramHandle}</span>
              </a>
              <ObfuscatedEmail />
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Studio Navigation</h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#services" className="hover:text-[#00E5FF] transition-colors">Services</a>
              </li>
              {portfolio.length > 0 && (
                <li>
                  <a href="#portfolio" className="hover:text-[#00E5FF] transition-colors">Featured Work</a>
                </li>
              )}
              {approvedReviews.length > 0 && (
                <li>
                  <a href="#reviews" className="hover:text-[#00E5FF] transition-colors">Customer Reviews</a>
                </li>
              )}
              <li>
                <a href="#submit-concept" className="hover:text-[#FF2E9A] transition-colors font-medium">Submit Creative Concept</a>
              </li>
              <li>
                <a href="#faqs" className="hover:text-[#00E5FF] transition-colors">Frequently Asked Questions</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-[#00E5FF] transition-colors">Contact for Details</a>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal & Portal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Legal & Portal</h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  type="button"
                  onClick={() => setShowTerms(true)}
                  className="hover:text-white transition-colors text-left"
                >
                  Terms of Service & Revenue Split
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setShowPrivacy(true)}
                  className="hover:text-white transition-colors text-left"
                >
                  Privacy & Asset Protection
                </button>
              </li>
              <li className="pt-2">
                <a
                  href="#admin"
                  onClick={(e) => {
                    if (onOpenAdmin) {
                      e.preventDefault();
                      onOpenAdmin();
                    }
                  }}
                  className="text-[11px] text-[#9AA0B8]/60 hover:text-[#00E5FF] transition-colors"
                >
                  Owner Portal & Review Moderation
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>© {new Date().getFullYear()} Drishya by Harsha. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-[#9AA0B8]">
              Engineered with <Heart className="w-3 h-3 text-[#FF2E9A] fill-[#FF2E9A]" /> in India
            </span>
            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Scroll back to top"
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
      <PrivacyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
    </footer>
  );
};
