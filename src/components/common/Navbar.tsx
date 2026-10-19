import React, { useState } from 'react';
import { Menu, X, Sparkles, ArrowRight } from 'lucide-react';
import { BrandLogo } from './BrandLogo.tsx';
import { useStudio } from '../../context/StudioContext.tsx';

interface NavbarProps {
  onContactClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const { portfolio, reviews } = useStudio();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const approvedReviews = reviews.filter((r) => r.isApproved);

  // Dynamic navigation:
  // - only show Work if real portfolio items exist
  // - Add "Customer Reviews" item to nav only when approved reviews exist
  // - Submit Creative Concept (replaces Idea Share)
  const navLinks = [
    { label: 'Services', href: '#services' },
    ...(portfolio.length > 0 ? [{ label: 'Work', href: '#portfolio' }] : []),
    ...(approvedReviews.length > 0 ? [{ label: 'Customer Reviews', href: '#reviews' }] : []),
    { label: 'Submit Creative Concept', href: '#submit-concept' },
    { label: 'FAQs', href: '#faqs' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleLinkClick = (href: string) => {
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a
            href="#"
            className="flex items-center focus:outline-none focus:ring-2 focus:ring-[#00E5FF] rounded-xl"
            aria-label="Drishya Home"
          >
            <BrandLogo size="md" />
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.href);
                }}
                className="text-xs lg:text-sm font-medium text-[#9AA0B8] hover:text-[#00E5FF] transition-colors focus:outline-none focus:text-[#00E5FF]"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Primary CTA */}
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('#contact');
              }}
              className="relative group overflow-hidden rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#FF2E9A] p-[1px] focus:outline-none focus:ring-2 focus:ring-[#00E5FF]"
            >
              <div className="flex items-center gap-1.5 px-4 py-2 rounded-[11px] bg-[#07070D] group-hover:bg-transparent transition-all duration-300">
                <Sparkles className="w-3.5 h-3.5 text-[#00E5FF] group-hover:text-white transition-colors" />
                <span className="text-xs font-bold text-white tracking-wide uppercase">
                  Contact
                </span>
                <ArrowRight className="w-3 h-3 text-white/80 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-white/10 bg-[#0F0F1A] text-[#F2F4FF] hover:text-[#00E5FF]"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-white/10 bg-[#07070D]/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-4">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.href);
                }}
                className="px-3 py-2 rounded-lg text-sm font-medium text-[#9AA0B8] hover:text-white hover:bg-white/5"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="pt-3 border-t border-white/10 flex flex-col gap-3">
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('#contact');
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#FF2E9A] text-xs font-bold text-[#07070D] uppercase tracking-wider"
            >
              <Sparkles className="w-4 h-4" />
              <span>Contact for details</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
