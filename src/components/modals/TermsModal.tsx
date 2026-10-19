import React from 'react';
import { X, ShieldAlert, Award, FileText, CheckCircle2 } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl border border-white/10 bg-[#0F0F1A] shadow-2xl text-left overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-[#07070D]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#00E5FF]/10 text-[#00E5FF]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-display">Terms of Service & Revenue-Share</h3>
              <p className="text-xs text-[#9AA0B8]">Last updated: October 2026 • Drishya</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Terms modal"
            className="p-1.5 rounded-lg text-[#9AA0B8] hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-[#9AA0B8] leading-relaxed">
          <section>
            <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#00E5FF]" />
              1. General Engagement & Service Scope
            </h4>
            <p>
              Drishya is directed by Harsha. By engaging Drishya for video editing, poster art, or photo retouching, clients agree to provide necessary raw assets and adhere to payment milestones agreed upon in the project quote.
            </p>
          </section>

          <section>
            <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#FF2E9A]" />
              2. Submit Creative Concept & Revenue-Share Agreement
            </h4>
            <div className="p-3.5 rounded-xl border border-[#FF2E9A]/20 bg-[#FF2E9A]/5 space-y-2 text-white/90">
              <p className="font-medium text-white">
                Co-Creation Transparency Clause:
              </p>
              <ul className="list-disc pl-4 space-y-1 text-xs text-[#9AA0B8]">
                <li><strong className="text-white">Authorship:</strong> You retain moral authorship of concepts you pitch. By submitting, you grant Drishya an exclusive 90-day evaluation window to review feasibility.</li>
                <li><strong className="text-white">Agreed Revenue Share:</strong> If Harsha decides to produce, monetize, or license your idea, a co-creation agreement is executed detailing your net revenue share percentage (standard tier: 15% to 35% of net proceeds).</li>
                <li><strong className="text-white">Transparent Accounting:</strong> Harsha maintains transparent ledger records of all earnings and disbursements, viewable upon request.</li>
                <li><strong className="text-white">Disbursements:</strong> Payments are remitted within 7 business days of commercial receipt via UPI or direct bank transfer.</li>
              </ul>
            </div>
          </section>

          <section>
            <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-[#7B5CFF]" />
              3. Revision Policy & Asset Delivery
            </h4>
            <p>
              Every custom project includes 2 complimentary revision cycles. Additional revisions outside the agreed brief are billed at standard hourly or task-based studio rates. Final master files (4K ProRes, H.264/265, CMYK prints) are delivered upon receipt of full milestone payment.
            </p>
          </section>

          <section>
            <h4 className="text-sm font-semibold text-white mb-2">4. Intellectual Property & Portfolio Rights</h4>
            <p>
              Unless an exclusive NDA is executed in writing prior to kickoff, Drishya reserves the right to display completed cuts, posters, and before/after breakdowns in public portfolio showreels and case studies.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-[#07070D] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition-colors"
          >
            I Understand & Agree
          </button>
        </div>
      </div>
    </div>
  );
};
