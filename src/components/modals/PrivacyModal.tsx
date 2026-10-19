import React from 'react';
import { X, Lock, Eye, Database } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl border border-white/10 bg-[#0F0F1A] shadow-2xl text-left overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-[#07070D]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#00E5FF]/10 text-[#00E5FF]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-display">Privacy & Data Protection Policy</h3>
              <p className="text-xs text-[#9AA0B8]">Drishya • Harsha</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Privacy modal"
            className="p-1.5 rounded-lg text-[#9AA0B8] hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs text-[#9AA0B8] leading-relaxed">
          <section>
            <h4 className="text-sm font-semibold text-white mb-1.5 flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-[#00E5FF]" />
              1. Information We Collect
            </h4>
            <p>
              When you submit an inquiry or creative idea through our website or PWA, we collect your name, contact email, WhatsApp/Instagram handle, and project brief details. We never sell, lease, or share personal data with external third-party advertisers.
            </p>
          </section>

          <section>
            <h4 className="text-sm font-semibold text-white mb-1.5 flex items-center gap-1.5">
              <Database className="w-4 h-4 text-[#7B5CFF]" />
              2. Footage & Creative Asset Storage
            </h4>
            <p>
              Client raw footage, project project files, and high-resolution assets are stored in encrypted cloud drives and local offline redundant raids. Unused raw media is securely purged 30 days after final sign-off unless an extended archive agreement is retained.
            </p>
          </section>

          <section>
            <h4 className="text-sm font-semibold text-white mb-1.5">3. Idea Pitch Confidentiality</h4>
            <p>
              Creative ideas pitched for our revenue-share program are treated with strict confidentiality. If an idea is not selected for production, it will not be shared with competing creators or brands.
            </p>
          </section>

          <section>
            <h4 className="text-sm font-semibold text-white mb-1.5">4. Local Storage & PWA Caching</h4>
            <p>
              Our companion Android Progressive Web App uses client-side offline caching to ensure lightning-fast load times and offline accessibility. No tracking beacons or intrusive third-party cookies are used.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-[#07070D] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
