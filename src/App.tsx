import React, { useState, useEffect } from 'react';
import { StudioProvider } from './context/StudioContext.tsx';
import { Navbar } from './components/common/Navbar.tsx';
import { Footer } from './components/common/Footer.tsx';
import { OfflineIndicator } from './components/common/OfflineIndicator.tsx';
import { Hero } from './components/sections/Hero.tsx';
import { ServicesSection } from './components/sections/ServicesSection.tsx';
import { PortfolioSection } from './components/sections/PortfolioSection.tsx';
import { CustomerReviewsSection } from './components/sections/CustomerReviewsSection.tsx';
import { DeliveryStatsSection } from './components/sections/DeliveryStatsSection.tsx';
import { SubmitCreativeConceptSection } from './components/sections/SubmitCreativeConceptSection.tsx';
import { FAQSection } from './components/sections/FAQSection.tsx';
import { ContactSection } from './components/sections/ContactSection.tsx';
import { ReviewModal } from './components/modals/ReviewModal.tsx';
import { AdminPortal } from './components/admin/AdminPortal.tsx';

function MainApp() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [quotePrefill, setQuotePrefill] = useState<{
    service: string;
    details: string;
  } | null>(null);

  // Check URL parameters or hash for admin entry (e.g. #admin, /admin, ?admin=1)
  useEffect(() => {
    const handleUrlCheck = () => {
      const hash = window.location.hash.toLowerCase();
      const pathname = window.location.pathname.toLowerCase();
      const search = window.location.search.toLowerCase();
      if (
        hash === '#admin' ||
        pathname === '/admin' ||
        search.includes('admin=1') ||
        search.includes('admin=true')
      ) {
        setIsAdminOpen(true);
      }
    };

    handleUrlCheck();
    window.addEventListener('hashchange', handleUrlCheck);
    return () => window.removeEventListener('hashchange', handleUrlCheck);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectServiceFromCard = (serviceKey: string) => {
    if (serviceKey === 'idea_submission') {
      scrollToSection('submit-concept');
    } else {
      setQuotePrefill({
        service: serviceKey,
        details: `I am interested in details regarding your ${serviceKey.replace('_', ' ')} capabilities.`,
      });
      scrollToSection('contact');
    }
  };

  return (
    <div className="min-h-screen bg-[#07070D] text-[#F2F4FF] relative selection:bg-[#00E5FF]/20 selection:text-[#00E5FF]">
      {/* Offline Status Indicator */}
      <OfflineIndicator />

      {/* 1. Navbar */}
      <Navbar />

      {/* Main Single-Scroll Experience in exact order:
          navbar → hero → services → featured work → customer reviews → delivery stats → submit creative concept banner → FAQ → contact → footer
      */}
      <main>
        {/* 2. Hero Section */}
        <Hero
          onContactClick={() => scrollToSection('contact')}
          onWorkClick={() => scrollToSection('portfolio')}
        />

        {/* 3. Services Section */}
        <ServicesSection onSelectService={handleSelectServiceFromCard} />

        {/* 4. Featured Work (Hidden automatically if no real items exist) */}
        <PortfolioSection />

        {/* 5. Customer Reviews (Hidden automatically if no approved reviews exist) */}
        <CustomerReviewsSection />

        {/* 6. Delivery Stats (Hidden automatically if no real stats exist) */}
        <DeliveryStatsSection />

        {/* 7. Submit Creative Concept Banner & Form */}
        <SubmitCreativeConceptSection />

        {/* 8. FAQ Accordion */}
        <FAQSection />

        {/* 9. Direct Contact Form */}
        <ContactSection prefill={quotePrefill} />
      </main>

      {/* 10. Studio Footer */}
      <Footer onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* Private Client Review Modal (Triggered via ?review=projectId link) */}
      <ReviewModal />

      {/* Owner Portal: Customer Reviews Approval & Creative Concepts Inbox */}
      <AdminPortal isOpen={isAdminOpen} onClose={() => {
        setIsAdminOpen(false);
        if (window.location.hash === '#admin') {
          window.history.replaceState({}, '', window.location.pathname + window.location.search);
        }
      }} />
    </div>
  );
}

export default function App() {
  return (
    <StudioProvider>
      <MainApp />
    </StudioProvider>
  );
}
